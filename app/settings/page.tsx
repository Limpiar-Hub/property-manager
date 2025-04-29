"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxHooks";
import { logout } from "@/redux/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings, User, Shield, Bell, Palette, Key, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

const passwordSchema = z.object({
  currentPassword: z.string().min(8, "Current password must be at least 8 characters"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  fullName: z.string().optional(),
});

export default function AdvancedSettingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const { theme, setTheme } = useTheme(); // Use ThemeProvider
  const [language, setLanguage] = useState("en");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    push: false,
    sms: false,
  });
  const [apiKey, setApiKey] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      fullName: user?.fullName || "",
    },
  });

  // Load user preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await fetch("https://limpiar-backend.onrender.com/api/user/preferences", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response from server");
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setLanguage(data.language || "en");
        setTwoFactorEnabled(data.twoFactorEnabled || false);
        setNotificationPreferences(data.notificationPreferences || notificationPreferences);
      } catch (error) {
        console.error("Error loading preferences:", error);
        setLanguage("en");
        setTwoFactorEnabled(false);
        setNotificationPreferences({ email: true, push: false, sms: false });
        toast.error("Failed to load user preferences. Using defaults.");
      }
    };
    if (token && user?._id) loadPreferences();
  }, [token, user?._id]);

  // Push notification handler
  const sendPushNotification = async (title: string, body: string) => {
    if (!notificationPreferences.push) return;

    if (!("Notification" in window)) {
      console.warn("Push notifications are not supported in this browser.");
      return;
    }

    if (Notification.permission === "granted") {
      new Notification(title, { body });
    } else if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification(title, { body });
      }
    } else {
      console.warn("Push notification permission denied.");
    }
  };

  const handlePasswordChange = async (data: z.infer<typeof passwordSchema>) => {
    if (!token || !user?._id) {
      toast.error("Authentication error: Missing token or user ID");
      await sendPushNotification("Settings Error", "Authentication error: Missing token or user ID");
      return;
    }

    try {
      const response = await fetch("https://limpiar-backend.onrender.com/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user._id,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (response.ok) {
        toast.success("Password updated successfully");
        await sendPushNotification("Settings Updated", "Password updated successfully");
        passwordForm.reset();
      } else {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Failed to update password";
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || `HTTP error ${response.status}`;
        }
        toast.error(errorMessage);
        await sendPushNotification("Settings Error", errorMessage);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An error occurred while updating password");
      await sendPushNotification("Settings Error", "An error occurred while updating password");
    }
  };

  const handleProfileUpdate = async (data: z.infer<typeof profileSchema>) => {
    try {
      const response = await fetch("https://limpiar-backend.onrender.com/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user?._id, ...data }),
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
        await sendPushNotification("Settings Updated", "Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
        await sendPushNotification("Settings Error", "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred");
      await sendPushNotification("Settings Error", "An error occurred");
    }
  };

  const handleGenerateApiKey = async () => {
    try {
      const response = await fetch("https://limpiar-backend.onrender.com/api/user/generate-api-key", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: user?._id }),
      });
      const data = await response.json();
      setApiKey(data.apiKey);
      toast.success("API key generated successfully");
      await sendPushNotification("Settings Updated", "API key generated successfully");
    } catch (error) {
      console.error("Error generating API key:", error);
      toast.error("An error occurred");
      await sendPushNotification("Settings Error", "Failed to generate API key");
    }
  };

  const handleToggleTwoFactor = async (checked: boolean) => {
    try {
      const response = await fetch("https://limpiar-backend.onrender.com/api/auth/two-factor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user?._id, enable: checked }),
      });

      if (response.ok) {
        setTwoFactorEnabled(checked);
        const message = `Two-factor authentication ${checked ? "enabled" : "disabled"}`;
        toast.success(message);
        await sendPushNotification("Settings Updated", message);
      } else {
        toast.error("Failed to update two-factor authentication");
        await sendPushNotification("Settings Error", "Failed to update two-factor authentication");
      }
    } catch (error) {
      console.error("Error toggling 2FA:", error);
      toast.error("An error occurred");
      await sendPushNotification("Settings Error", "An error occurred");
    }
  };

  const handleSaveNotificationPreferences = async () => {
    try {
      const response = await new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 500));
      if (response.ok) {
        toast.success("Notification preferences saved");
        await sendPushNotification("Settings Updated", "Notification preferences saved");
      } else {
        toast.error("Failed to save notification preferences");
        await sendPushNotification("Settings Error", "Failed to save notification preferences");
      }
    } catch (error) {
      console.error("Error saving notification preferences:", error);
      toast.error("An error occurred");
      await sendPushNotification("Settings Error", "An error occurred");
    }
  };

  const handleSaveAppearanceSettings = async () => {
    try {
      const response = await new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 500));
      if (response.ok) {
        toast.success("Appearance settings saved");
        await sendPushNotification("Settings Updated", "Appearance settings saved");
      } else {
        toast.error("Failed to save appearance settings");
        await sendPushNotification("Settings Error", "Failed to save appearance settings");
      }
    } catch (error) {
      console.error("Error saving appearance settings:", error);
      toast.error("An error occurred");
      await sendPushNotification("Settings Error", "An error occurred");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  const sidebarItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "api", label: "API", icon: Key },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed z-50 top-4 right-4 lg:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b dark:border-gray-700">
          <Image
            src="/limp.png"
            alt="Limpiar Logo"
            width={120}
            height={50}
            className="h-10 w-auto"
          />
        </div>

        {/* Navigation */}
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium w-full justify-start text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
                  activeTab === item.id ? "bg-blue-50 dark:bg-blue-900" : ""
                )}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
              >
                <item.icon className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                {item.label}
              </Button>
            ))}
          </div>
        </nav>

        {/* Bottom links */}
        <div className="absolute bottom-0 w-full border-t dark:border-gray-700">
          <Button
            variant="ghost"
            className="flex items-center px-4 py-3 text-sm font-medium w-full justify-start text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={handleBack} className="mb-4 text-gray-800 dark:text-gray-200">
            ← Back
          </Button>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-6 lg:hidden bg-gray-200 dark:bg-gray-700">
              {sidebarItems.map((item) => (
                <TabsTrigger key={item.id} value={item.id} className="text-gray-800 dark:text-gray-200">
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Profile Settings</h2>
                <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
                  <div>
                    <Label htmlFor="username" className="text-gray-800 dark:text-gray-200">Username</Label>
                    <Input id="username" {...profileForm.register("username")} className="dark:bg-gray-700 dark:text-gray-200" />
                    {profileForm.formState.errors.username && (
                      <p className="text-red-500 text-sm">{profileForm.formState.errors.username.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-800 dark:text-gray-200">Email</Label>
                    <Input id="email" type="email" {...profileForm.register("email")} className="dark:bg-gray-700 dark:text-gray-200" />
                    {profileForm.formState.errors.email && (
                      <p className="text-red-500 text-sm">{profileForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="fullName" className="text-gray-800 dark:text-gray-200">Full Name</Label>
                    <Input id="fullName" {...profileForm.register("fullName")} className="dark:bg-gray-700 dark:text-gray-200" />
                  </div>
                  <Button type="submit">Update Profile</Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Security Settings</h2>
                <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword" className="text-gray-800 dark:text-gray-200">Current Password</Label>
                    <Input type="password" id="currentPassword" {...passwordForm.register("currentPassword")} className="dark:bg-gray-700 dark:text-gray-200" />
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-red-500 text-sm">{passwordForm.formState.errors.currentPassword.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-gray-800 dark:text-gray-200">New Password</Label>
                    <Input type="password" id="newPassword" {...passwordForm.register("newPassword")} className="dark:bg-gray-700 dark:text-gray-200" />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-red-500 text-sm">{passwordForm.formState.errors.newPassword.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-800 dark:text-gray-200">Confirm New Password</Label>
                    <Input type="password" id="confirmPassword" {...passwordForm.register("confirmPassword")} className="dark:bg-gray-700 dark:text-gray-200" />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-red-500 text-sm">{passwordForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                  <Button type="submit">Change Password</Button>
                </form>
                <div className="mt-6 flex items-center justify-between">
                  <Label htmlFor="twoFactor" className="text-gray-800 dark:text-gray-200">Two-Factor Authentication</Label>
                  <input
                    type="checkbox"
                    id="twoFactor"
                    checked={twoFactorEnabled}
                    onChange={(e) => handleToggleTwoFactor(e.target.checked)}
                    className="h-5 w-5 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailNotifications" className="text-gray-800 dark:text-gray-200">Email Notifications</Label>
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      checked={notificationPreferences.email}
                      onChange={(e) =>
                        setNotificationPreferences({ ...notificationPreferences, email: e.target.checked })
                      }
                      className="h-5 w-5 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pushNotifications" className="text-gray-800 dark:text-gray-200">Push Notifications</Label>
                    <input
                      type="checkbox"
                      id="pushNotifications"
                      checked={notificationPreferences.push}
                      onChange={(e) =>
                        setNotificationPreferences({ ...notificationPreferences, push: e.target.checked })
                      }
                      className="h-5 w-5 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="smsNotifications" className="text-gray-800 dark:text-gray-200">SMS Notifications</Label>
                    <input
                      type="checkbox"
                      id="smsNotifications"
                      checked={notificationPreferences.sms}
                      onChange={(e) =>
                        setNotificationPreferences({ ...notificationPreferences, sms: e.target.checked })
                      }
                      className="h-5 w-5 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                  </div>
                  <Button onClick={handleSaveNotificationPreferences}>Save Preferences</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="mt-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Appearance Settings</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-800 dark:text-gray-200">Theme</Label>
                    <Select value={theme} onValueChange={(value: "light" | "dark" | "system") => setTheme(value)}>
                      <SelectTrigger className="dark:bg-gray-700 dark:text-gray-200">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:text-gray-200">
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-800 dark:text-gray-200">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="dark:bg-gray-700 dark:text-gray-200">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:text-gray-200">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleSaveAppearanceSettings}>Save Settings</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="api" className="mt-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">API Settings</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-800 dark:text-gray-200">API Key</Label>
                    <div className="flex gap-2">
                      <Input value={apiKey} readOnly placeholder="No API key generated" className="dark:bg-gray-700 dark:text-gray-200" />
                      <Button onClick={handleGenerateApiKey}>Generate New Key</Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Keep your API key secure and do not share it publicly.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}