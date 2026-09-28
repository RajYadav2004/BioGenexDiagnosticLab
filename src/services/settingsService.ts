export interface SiteSettings {
  siteName: string;
  tagline: string;
  phone: string;
  email: string;
  location: string;
  whatsappNumber: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  maintenanceMode: boolean;
}

export const defaultSettings: SiteSettings = {
  siteName: "Biogenex Diagnostic",
  tagline: "Your Trust Our Priority",
  phone: "9082945603",
  email: "info@biogenex.com",
  location: "Thane, Maharashtra",
  whatsappNumber: "919082945603",
  smtpHost: "smtp.biogenex.com",
  smtpPort: "587",
  smtpUser: "notifications@biogenex.com",
  smtpPass: "",
  facebookUrl: "https://facebook.com/biogenex",
  instagramUrl: "https://instagram.com/biogenex",
  twitterUrl: "https://twitter.com/biogenex",
  maintenanceMode: false,
};

const STORAGE_KEY_SETTINGS = "biogenex_site_settings";

type Listener = () => void;
const listeners: Set<Listener> = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("biogenex-settings-updated"));
  }
};

export const settingsService = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSettings(): SiteSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (data) {
        return { ...defaultSettings, ...JSON.parse(data) };
      }
    } catch (e) {
      console.error("Failed to load site settings", e);
    }
    return defaultSettings;
  },

  updateSettings(partial: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated = { ...current, ...partial };
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
      notifyListeners();
    } catch (e) {
      console.error("Failed to save site settings", e);
    }
    return updated;
  },

  resetSettings(): SiteSettings {
    try {
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
      notifyListeners();
    } catch (e) {
      console.error("Failed to reset site settings", e);
    }
    return defaultSettings;
  },
};
