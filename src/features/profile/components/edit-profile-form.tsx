import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/shared/ui/card";
import { Field, FieldGroup, FieldLabel, } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Save, X } from "lucide-react";
export interface UserProfileData {
    username: string;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    bio: string;
    avatarUrl: string;
}
interface EditProfileFormProps {
    userData: UserProfileData;
    onSave: (data: UserProfileData) => void;
    onCancel: () => void;
}
export function EditProfileForm({ userData, onSave, onCancel }: EditProfileFormProps) {
    const [formData, setFormData] = useState<UserProfileData>(userData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const handleChange = (field: keyof UserProfileData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null);
        setSuccess(false);
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            if (!formData.fullName.trim()) {
                throw new Error("Full name is required");
            }
            if (!formData.email.trim()) {
                throw new Error("Email is required");
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                throw new Error("Please enter a valid email address");
            }
            await new Promise(resolve => setTimeout(resolve, 500));
            localStorage.setItem('userProfile', JSON.stringify(formData));
            setSuccess(true);
            onSave(formData);
            setTimeout(() => {
                onCancel();
            }, 1000);
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || "Failed to update profile");
            }
            else {
                setError("Failed to update profile");
            }
        }
        finally {
            setLoading(false);
        }
    };
    return (<Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Edit Profile</CardTitle>
        <CardDescription className="text-sm">
          Update your personal information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input id="username" type="text" value={formData.username} disabled className="bg-slate-50"/>
              <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
            </Field>

            
            <Field>
              <FieldLabel htmlFor="fullName">Full Name *</FieldLabel>
              <Input id="fullName" type="text" placeholder="John Doe" value={formData.fullName} onChange={(e) => handleChange('fullName', e.target.value)} required/>
            </Field>

            
            <Field>
              <FieldLabel htmlFor="email">Email *</FieldLabel>
              <Input id="email" type="email" placeholder="john.doe@example.com" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required/>
            </Field>

            
            <Field>
              <FieldLabel htmlFor="phone">Phone</FieldLabel>
              <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)}/>
            </Field>

            
            <Field>
              <FieldLabel htmlFor="location">Location</FieldLabel>
              <Input id="location" type="text" placeholder="San Francisco, CA" value={formData.location} onChange={(e) => handleChange('location', e.target.value)}/>
            </Field>

            
            <Field>
              <FieldLabel htmlFor="website">Website</FieldLabel>
              <Input id="website" type="text" placeholder="johndoe.com" value={formData.website} onChange={(e) => handleChange('website', e.target.value)}/>
            </Field>

            
            <Field>
              <FieldLabel htmlFor="bio">Bio</FieldLabel>
              <textarea id="bio" className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Tell us about yourself..." value={formData.bio} onChange={(e) => handleChange('bio', e.target.value)} rows={4}/>
            </Field>

            
            {error && (<div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>)}

            
            {success && (<div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm text-green-600">Profile updated successfully!</p>
              </div>)}

            
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                <Save className="h-4 w-4 mr-2"/>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="flex-1">
                <X className="h-4 w-4 mr-2"/>
                Cancel
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>);
}
