import { Phone, MapPin, User, LogOut, AlertTriangle, ShieldCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import MobileMenu from "@/components/MobileMenu";
import logo from "@/assets/logo.png";
import WhatsAppButton from "@/components/WhatsAppButton";
import { settingsService, SiteSettings } from "@/services/settingsService";

const Header = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(settingsService.getSettings());

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    // Listen for settings changes
    const unsubscribeSettings = settingsService.subscribe(() => {
      setSettings(settingsService.getSettings());
    });

    return () => {
      subscription.unsubscribe();
      unsubscribeSettings();
    };
  }, []);

  const checkAdminRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    
    setIsAdmin(!!data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/tests", label: "Tests & Packages" },
    { href: "/reports", label: "Download Reports" },
    { href: "/blog", label: "Health Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/#about", label: "About" },
  ];

  return (
    <>
      {/* Maintenance Mode Alert Banner */}
      {settings.maintenanceMode && (
        <div className="bg-amber-500 text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 shadow-inner z-50 relative">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>Notice: System maintenance scheduled. Diagnostic bookings and report processing remain active.</span>
        </div>
      )}

      {/* Top Info Bar (Visible on Tablet & Desktop) */}
      <div className="hidden sm:block bg-secondary/50 border-b border-border/40 py-1.5 text-xs text-muted-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{settings.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
              <a href={`tel:${settings.phone}`} className="hover:text-primary transition-colors font-medium">
                {settings.phone}
              </a>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {settings.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{settings.email}</span>
              </div>
            )}
            <span className="text-primary font-semibold">Free Home Sample Collection Available</span>
          </div>
        </div>
      </div>

      {/* Main Responsive Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo & Brand Name */}
            <a href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-soft transition-transform group-hover:scale-105">
                <img src={logo} alt={settings.siteName} className="w-9 h-9 sm:w-10 sm:h-10 object-contain" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors">
                  {settings.siteName}
                </h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{settings.tagline}</p>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right Header Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* WhatsApp Quick Chat */}
              <div className="hidden sm:block">
                <WhatsAppButton
                  size="sm"
                  phoneNumber={settings.whatsappNumber}
                  className="bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-sm"
                  message={`Hi, I'd like to book a test at ${settings.siteName}`}
                />
              </div>

              {/* User Account / Auth Button */}
              <div className="hidden sm:block">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <span className="hidden xl:inline max-w-[120px] truncate">{user.email?.split("@")[0]}</span>
                        <span className="xl:hidden">Account</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <div className="px-2 py-1.5 text-xs text-muted-foreground">
                        Signed in as <p className="font-semibold text-foreground truncate">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      {isAdmin && (
                        <>
                          <DropdownMenuItem onClick={() => window.location.href = "/admin/dashboard"}>
                            <ShieldCheck className="h-4 w-4 mr-2 text-primary" />
                            Admin Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem onClick={() => window.location.href = "/reports"}>
                        My Test Reports
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = '/auth'}
                  >
                    Sign In
                  </Button>
                )}
              </div>

              {/* Primary CTA: Book Test */}
              <Button 
                size="sm"
                className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-soft px-4 sm:px-5 font-semibold text-xs sm:text-sm"
                onClick={() => window.location.href = '/book-test'}
              >
                Book Test
              </Button>

              {/* Mobile & Tablet Drawer Menu */}
              <MobileMenu
                user={user}
                isAdmin={isAdmin}
                settings={settings}
                onSignOut={handleSignOut}
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
