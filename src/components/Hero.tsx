import { Button } from "@/components/ui/button";
import { Phone, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-lab.jpg";
import WhatsAppButton from "@/components/WhatsAppButton";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl text-primary-foreground animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Your Health, Our Commitment
          </h2>
          <p className="text-xl md:text-2xl mb-4 opacity-95">
            Your Trust Our Priority
          </p>
          <p className="text-lg mb-8 opacity-90 max-w-xl">
            Advanced diagnostic services with accurate results and compassionate care. Experience world-class medical testing at your convenience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow text-lg px-8 py-6 transition-all hover:scale-105"
              onClick={() => navigate('/book-test')}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Appointment
            </Button>
            <WhatsAppButton
              size="lg"
              variant="outline"
              className="bg-[#25D366] hover:bg-[#20BA5A] border-none text-white text-lg px-8 py-6 transition-all hover:scale-105"
              message="Hi, I'd like to book a test at Biogenex Diagnostic"
            >
              Book via WhatsApp
            </WhatsAppButton>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-background/20 backdrop-blur border-primary-foreground/30 text-primary-foreground hover:bg-background/30 text-lg px-8 py-6 transition-all hover:scale-105"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call: 9082945603
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
