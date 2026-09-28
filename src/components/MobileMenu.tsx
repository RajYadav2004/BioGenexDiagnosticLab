import { useState } from "react";
import { Menu, X, Phone, MapPin, User, LogOut, ShieldAlert, Sparkles, BookOpen, Calendar, HelpCircle, Info, FileText, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SiteSettings } from "@/services/settingsService";
import logo from "@/assets/logo.png";

interface MobileMenuProps {
  user: any;
  isAdmin: boolean;
  settings: SiteSettings;
  onSignOut: () => void;
}

const MobileMenu = ({ user, isAdmin, settings, onSignOut }: MobileMenuProps) => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { href: "/tests", label: "Tests & Packages", icon: FlaskConical },
    { href: "/reports", label: "Download Reports", icon: FileText },
    { href: "/blog", label: "Health Blog", icon: BookOpen },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
    { href: "/#about", label: "About Us", icon: Info },
  ];

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-foreground h-10 w-10">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-[310px] sm:w-[350px] bg-background p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            {/* Header branding */}
            <SheetHeader className="text-left pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-soft shrink-0">
                  <img src={logo} alt={settings.siteName} className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <SheetTitle className="text-lg font-bold text-foreground leading-tight">
                    {settings.siteName}
                  </SheetTitle>
                  <p className="text-xs text-muted-foreground">{settings.tagline}</p>
                </div>
              </div>
            </SheetHeader>

            {/* Main Nav Links */}
            <nav className="flex flex-col space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/60 hover:text-primary rounded-lg transition-colors"
                >
                  <item.icon className="h-4 w-4 text-primary shrink-0" />
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>

            <Separator />

            {/* Quick Contact Details */}
            <div className="space-y-2 text-xs text-muted-foreground px-1">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{settings.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-primary transition-colors font-medium">
                  {settings.phone}
                </a>
              </div>
            </div>

            <Separator />

            {/* Account & Admin Section */}
            <div className="space-y-2">
              {user ? (
                <>
                  <div className="px-3 py-2 bg-secondary/40 rounded-lg">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="text-sm font-semibold truncate text-foreground">{user.email}</p>
                  </div>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => {
                        setOpen(false);
                        window.location.href = "/admin/dashboard";
                      }}
                    >
                      <ShieldAlert className="h-4 w-4" />
                      Admin Dashboard
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={() => {
                      setOpen(false);
                      onSignOut();
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-center gap-2"
                  onClick={() => {
                    setOpen(false);
                    window.location.href = "/auth";
                  }}
                >
                  <User className="h-4 w-4" />
                  Sign In / Register
                </Button>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 border-t border-border space-y-3 mt-auto">
            <WhatsAppButton
              size="default"
              phoneNumber={settings.whatsappNumber}
              className="w-full justify-center bg-[#25D366] hover:bg-[#20BA5A] text-white"
              message={`Hi, I'd like to book a test at ${settings.siteName}`}
            />
            <Button
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-soft py-5 text-base font-semibold"
              onClick={() => {
                setOpen(false);
                window.location.href = "/book-test";
              }}
            >
              Book Test Now
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
