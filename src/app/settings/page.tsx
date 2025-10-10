
'use client';

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

export default function SettingsPage() {
  return (
    <div className="grid gap-6 max-w-4xl mx-auto">
      <div className="grid gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            This is how others will see you on the site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input id="name" defaultValue="Alex Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="alex.doe@example.com" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Profile</Button>
        </CardFooter>
      </Card>
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
