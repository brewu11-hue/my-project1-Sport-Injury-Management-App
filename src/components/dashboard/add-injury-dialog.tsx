'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { DatePicker } from '@/components/ui/date-picker';
import { useInjuryData } from '@/hooks/use-injury-data';
import { useToast } from '@/hooks/use-toast';

const injurySchema = z.object({
  type: z.string().min(1, 'Injury type is required.'),
  date: z.date({ required_error: 'Please select a date.' }),
  severity: z.number().min(1).max(10),
});

type InjuryFormValues = z.infer<typeof injurySchema>;

export function AddInjuryDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { addInjury } = useInjuryData();
  const { toast } = useToast();

  const form = useForm<InjuryFormValues>({
    resolver: zodResolver(injurySchema),
    defaultValues: {
      type: '',
      severity: 5,
    },
  });

  async function onSubmit(data: InjuryFormValues) {
    try {
      await addInjury(data);
      toast({
        title: 'Injury Logged',
        description: `${data.type} has been added to your log.`,
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to add injury:", error);
      toast({
        variant: 'destructive',
        title: 'Failed to log injury',
        description: 'There was an issue saving your injury. Please try again.',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Injury</DialogTitle>
          <DialogDescription>
            Log a new sport injury to track your recovery.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Injury Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ankle Sprain" {...field} />
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
                  <FormLabel>Date of Injury</FormLabel>
                  <DatePicker date={field.value} setDate={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severity: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Mild</span>
                    <span>Severe</span>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Injury'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
