import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Mail, Share2, Settings as SettingsIcon, Save, RotateCcw, AlertTriangle, PhoneCall } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { settingsService, SiteSettings } from "@/services/settingsService";

const AdminSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(settingsService.getSettings());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSettings(settingsService.getSettings());
    const unsubscribe = settingsService.subscribe(() => {
      setSettings(settingsService.getSettings());
    });
    return unsubscribe;
  }, []);

  const handleChange = (key: keyof SiteSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    settingsService.updateSettings({
      siteName: settings.siteName,
      tagline: settings.tagline,
      phone: settings.phone,
      email: settings.email,
      location: settings.location,
      whatsappNumber: settings.whatsappNumber,
    });
    setIsSaving(false);
    toast.success("General settings updated successfully!");
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    settingsService.updateSettings({
      smtpHost: settings.smtpHost,
      smtpPort: settings.smtpPort,
      smtpUser: settings.smtpUser,
      smtpPass: settings.smtpPass,
    });
    setIsSaving(false);
    toast.success("Email (SMTP) settings saved successfully!");
  };

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    settingsService.updateSettings({
      facebookUrl: settings.facebookUrl,
      instagramUrl: settings.instagramUrl,
      twitterUrl: settings.twitterUrl,
    });
    setIsSaving(false);
    toast.success("Social media links updated successfully!");
  };

  const handleToggleMaintenance = (enabled: boolean) => {
    handleChange("maintenanceMode", enabled);
    settingsService.updateSettings({ maintenanceMode: enabled });
    if (enabled) {
      toast.warning("Maintenance mode ENABLED. Public users will see maintenance notice.");
    } else {
      toast.success("Maintenance mode DISABLED. Site is fully accessible.");
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all site settings to default configuration?")) {
      const def = settingsService.resetSettings();
      setSettings(def);
      toast.success("Settings restored to default!");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <SettingsIcon className="h-7 w-7 text-primary" />
              Site Settings & Configuration
            </h1>
            <p className="text-muted-foreground">
              Manage site branding, contact numbers, email configuration, and maintenance mode
            </p>
          </div>
          <Button variant="outline" onClick={handleResetDefaults}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Defaults
          </Button>
        </div>

        <div className="grid gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                General Site Information
              </CardTitle>
              <CardDescription>Branding, title, phone numbers, and location</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveGeneral} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name *</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => handleChange("siteName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline / Subtitle</Label>
                    <Input
                      id="tagline"
                      value={settings.tagline}
                      onChange={(e) => handleChange("tagline", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Phone *</Label>
                    <Input
                      id="phone"
                      value={settings.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <Input
                      id="whatsappNumber"
                      value={settings.whatsappNumber}
                      onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                      placeholder="919082945603"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">City / Location</Label>
                    <Input
                      id="location"
                      value={settings.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Support Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  Save General Settings
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Maintenance Mode */}
          <Card className={settings.maintenanceMode ? "border-amber-500 bg-amber-500/5" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className={`h-5 w-5 ${settings.maintenanceMode ? "text-amber-600" : "text-primary"}`} />
                Maintenance Mode Control
              </CardTitle>
              <CardDescription>Temporarily show a maintenance notice for public users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">
                    Enable Site Maintenance Mode
                  </p>
                  <p className="text-sm text-muted-foreground">
                    When active, a banner appears across the site notifying visitors of scheduled maintenance.
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={handleToggleMaintenance}
                />
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Email Server (SMTP) Settings
              </CardTitle>
              <CardDescription>Configure outgoing email notification server credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveEmail} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={settings.smtpHost}
                      onChange={(e) => handleChange("smtpHost", e.target.value)}
                      placeholder="smtp.example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={settings.smtpPort}
                      onChange={(e) => handleChange("smtpPort", e.target.value)}
                      placeholder="587"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpUser">SMTP Username</Label>
                    <Input
                      id="smtpUser"
                      value={settings.smtpUser}
                      onChange={(e) => handleChange("smtpUser", e.target.value)}
                      placeholder="user@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPass">SMTP Password</Label>
                    <Input
                      id="smtpPass"
                      type="password"
                      value={settings.smtpPass}
                      onChange={(e) => handleChange("smtpPass", e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Email Settings
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                Social Media Links
              </CardTitle>
              <CardDescription>Public links displayed on site footer & header</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSocial} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input
                    id="facebook"
                    value={settings.facebookUrl}
                    onChange={(e) => handleChange("facebookUrl", e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input
                    id="instagram"
                    value={settings.instagramUrl}
                    onChange={(e) => handleChange("instagramUrl", e.target.value)}
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter URL</Label>
                  <Input
                    id="twitter"
                    value={settings.twitterUrl}
                    onChange={(e) => handleChange("twitterUrl", e.target.value)}
                    placeholder="https://twitter.com/yourpage"
                  />
                </div>
                <Button type="submit" disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Social Links
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
