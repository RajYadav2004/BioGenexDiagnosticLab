import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Mail, Clock } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary-foreground">
            Get In Touch
          </h2>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to us anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="bg-background/95 backdrop-blur border-0 shadow-glow hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '0ms' }}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary-light flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Phone</h3>
              <a href="tel:9082945603" className="text-primary hover:underline">
                9082945603
              </a>
            </CardContent>
          </Card>

          <Card className="bg-background/95 backdrop-blur border-0 shadow-glow hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary-light flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Location</h3>
              <p className="text-muted-foreground">Thane, Maharashtra</p>
            </CardContent>
          </Card>

          <Card className="bg-background/95 backdrop-blur border-0 shadow-glow hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary-light flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Email</h3>
              <a href="mailto:info@biogenexdiagnostic.com" className="text-primary hover:underline text-sm">
                info@biogenexdiagnostic.com
              </a>
            </CardContent>
          </Card>

          <Card className="bg-background/95 backdrop-blur border-0 shadow-glow hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary-light flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Hours</h3>
              <p className="text-muted-foreground text-sm">Mon-Sat: 8AM-8PM<br/>Sun: 8AM-2PM</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '400ms' }}>
          <Button 
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow text-lg px-8 py-6 transition-all hover:scale-105"
          >
            <Phone className="mr-2 h-5 w-5" />
            Request a Callback
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Contact;
