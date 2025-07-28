import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserProfileSchema, type UpdateUserProfile } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SettingsIcon, KeyIcon, BrainIcon, UserIcon } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<UpdateUserProfile>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      preferredModel: user?.preferredModel || "gpt-4",
      apiKey: "",
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: UpdateUserProfile) => {
      return apiRequest("/api/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/me"], data.user);
      toast({
        title: "Profile updated",
        description: "Your preferences have been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: UpdateUserProfile) => {
    // Only include apiKey if it's not empty
    const updateData = {
      ...data,
      ...(data.apiKey && data.apiKey.trim() ? { apiKey: data.apiKey } : {}),
    };
    
    await updateProfile.mutateAsync(updateData);
  };

  const aiModels = [
    { value: "gpt-4", label: "GPT-4 (OpenAI)" },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo (OpenAI)" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo (OpenAI)" },
    { value: "claude-3-opus", label: "Claude 3 Opus (Anthropic)" },
    { value: "claude-3-sonnet", label: "Claude 3 Sonnet (Anthropic)" },
    { value: "claude-3-haiku", label: "Claude 3 Haiku (Anthropic)" },
    { value: "gemini-pro", label: "Gemini Pro (Google)" },
    { value: "grok-beta", label: "Grok Beta (xAI)" },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
              <SettingsIcon className="h-8 w-8" />
              Profile Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your AI preferences and account settings
            </p>
          </div>

          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Username</Label>
                  <p className="text-lg font-medium">{user.username}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-lg font-medium">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Preferences Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainIcon className="h-5 w-5" />
                AI Model Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="preferredModel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred AI Model</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your preferred AI model" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {aiModels.map((model) => (
                              <SelectItem key={model.value} value={model.value}>
                                {model.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <KeyIcon className="h-4 w-4" />
                          API Key
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={user.apiKey ? "API key is saved (enter new key to update)" : "Enter your API key"}
                            {...field}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Your API key is encrypted and stored securely. Leave blank to keep current key.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={updateProfile.isPending}
                  >
                    {updateProfile.isPending ? "Saving..." : "Save Preferences"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Your API keys are stored securely and never shared with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}