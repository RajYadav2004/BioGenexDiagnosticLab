import { useEffect, useState } from "react";
import { Heart, Facebook, Instagram, Twitter } from "lucide-react";
import { settingsService, SiteSettings } from "@/services/settingsService";

const Footer = () => {
  const [settings, setSettings] = useState<SiteSettings>(settingsService.getSettings());

  useEffect(() => {
    setSettings(settingsService.getSettings());
    const unsubscribe = settingsService.subscribe(() => {
      setSettings(settingsService.getSettings());
    });
    return unsubscribe;
  }, []);

  return (
    <footer className="bg-foreground/5 border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg text-foreground mb-1">{settings.siteName}</h3>
            <p className="text-sm text-muted-foreground">{settings.tagline}</p>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-accent fill-accent" /> for better health
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-1">
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {settings.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-6 text-sm justify-center md:justify-end">
            <a href="/tests" className="text-muted-foreground hover:text-primary transition-colors">
              Tests
            </a>
            <a href="/book-test" className="text-muted-foreground hover:text-primary transition-colors">
              Book Test
            </a>
            <a href="/reports" className="text-muted-foreground hover:text-primary transition-colors">
              Reports
            </a>
            <a href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
              Blog
            </a>
            <a href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
              FAQ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
