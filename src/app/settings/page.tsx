
'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProfileData } from '@/hooks/use-profile-data';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';


const profileSchema = z.object({
    displayName: z.string().min(2, 'Display name must be at least 2 characters.'),
    email: z.string().email('Please enter a valid email address.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;


export default function SettingsPage() {
    const { profile, updateProfile, loading } = useProfileData();
    const { toast } = useToast();

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, isDirty, errors },
      } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            displayName: '',
            email: '',
        }
    });

    useEffect(() => {
        if (profile) {
            reset({
                displayName: profile.displayName,
                email: profile.email,
            })
        }
    }, [profile, reset])

    const onSubmit = async (data: ProfileFormValues) => {
        await updateProfile(data);
        toast({
            title: "Profile Saved",
            description: "Your profile information has been updated.",
        })
    }

  return (
    <div className="grid gap-6 max-w-4xl mx-auto">
      <div className="grid gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
            <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
                This is how others will see you on the site.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Controller
                        name="displayName"
                        control={control}
                        render={({ field }) => <Input id="displayName" {...field} />}
                    />
                    {errors.displayName && <p className="text-sm text-destructive">{errors.displayName.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                     <Controller
                        name="email"
                        control={control}
                        render={({ field }) => <Input id="email" type="email" {...field} />}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
            </CardContent>
            <CardFooter>
            <Button type="submit" disabled={isSubmitting || loading || !isDirty}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                ) : (
                    'Save Profile'
                )}
            </Button>
            </CardFooter>
        </Card>
      </form>
      <Card>
        <CardHeader>
          <CardTitle>Language & Region</CardTitle>
          <CardDescription>
            Choose the language and region for your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger id="language">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English (United States)</SelectItem>
                <SelectItem value="es">Español (España)</SelectItem>
                <SelectItem value="fr">Français (France)</SelectItem>
                <SelectItem value="de">Deutsch (Deutschland)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
