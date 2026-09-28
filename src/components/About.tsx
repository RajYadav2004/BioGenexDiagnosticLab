import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, Users, Clock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "ISO Certified Lab",
    description: "Our labs are ISO 15189:2012 & ISO 9001:2015 certified for medical laboratory quality and competence",
  },
  {
    icon: Award,
    title: "Expert Team",
    description: "Highly qualified pathologists and technicians with years of experience",
  },
  {
    icon: Users,
    title: "10,000+ Happy Patients",
    description: "Trusted by thousands of families across Thane for accurate diagnostics",
  },
  {
    icon: Clock,
    title: "Quick Turnaround",
    description: "Fast report delivery without compromising on accuracy and quality",
  },
];

const About = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Why Choose Biogenex Diagnostic?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Committed to delivering excellence in diagnostic services with cutting-edge technology and compassionate care
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="border-border/50 hover:shadow-soft transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                    <Icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
