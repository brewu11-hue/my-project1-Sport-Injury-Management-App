'use client';

import { useState } from 'react';
import { Injury, useInjuryData } from '@/hooks/use-injury-data';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

const treatmentSchema = z.object({
  activity: z.string().min(1, 'Activity is required.'),
  date: z.date({ required_error: 'Please select a date.' }),
  notes: z.string().optional(),
});

type TreatmentFormValues = z.infer<typeof treatmentSchema>;

export default function TreatmentLog({ injury }: { injury: Injury }) {
  const { addTreatment } = useInjuryData();
  const { toast } = useToast();
  
  const form = useForm<TreatmentFormValues>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      activity: '',
      notes: '',
      date: new Date(),
    },
  });

  function onSubmit(data: TreatmentFormValues) {
    addTreatment(injury.id, data);
    toast({
      title: 'Treatment Logged',
      description: `${data.activity} added for ${injury.type}.`,
    });
    form.reset({ activity: '', notes: '', date: new Date() });
  }

  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">Treatment & Recovery Log</h3>
      <Accordion type="single" collapsible>
        <AccordionItem value="add-treatment">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4"/>
              Add Recovery Activity
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="activity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activity</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Stretching, Icing" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <DatePicker date={field.value} setDate={field.onChange} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any additional notes..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Log Activity</Button>
              </form>
            </Form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-4 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {injury.treatments.length > 0 ? (
              injury.treatments.map((treatment) => (
                <TableRow key={treatment.id}>
                  <TableCell className="font-medium">{format(treatment.date, 'MMM d')}</TableCell>
                  <TableCell>{treatment.activity}</TableCell>
                  <TableCell>{treatment.notes}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No treatments logged yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
