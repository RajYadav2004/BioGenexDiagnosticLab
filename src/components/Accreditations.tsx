import { Card, CardContent } from "@/components/ui/card";
import { Award, Shield, Target, CheckCircle2 } from "lucide-react";

const accreditations = [
  {
    icon: Shield,
    title: "ISO 15189:2012",
    description: "Medical Laboratories - Quality and Competence",
    details: "International standard certifying quality and competence of medical laboratories",
  },
  {
    icon: Award,
    title: "CAP Certified",
    description: "College of American Pathologists accreditation",
    details: "International gold standard for laboratory excellence and quality assurance",
  },
  {
    icon: Target,
    title: "ISO 9001:2015",
    description: "Quality Management Systems certification",
    details: "Ensuring consistent quality in processes and customer satisfaction",
  },
  {
    icon: CheckCircle2,
    title: "EQAS Participant",
    description: "External Quality Assurance Scheme",
    details: "Regular proficiency testing for maintaining highest accuracy standards",
  },
];

const qualityFeatures = [
  "State-of-the-art automated analyzers",
  "Highly qualified pathologists and technicians",
  "Stringent quality control protocols",
  "Regular equipment calibration and maintenance",
  "Comprehensive test menu with 2000+ parameters",
  "24/7 emergency testing facility",
  "Digital report delivery system",
  "Patient data security and confidentiality",
];

const Accreditations = () => {
  return (
    <section className="py-20 bg-gradient-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary-foreground">
            Accreditations & Quality Standards
          </h2>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Certified excellence in diagnostic services with international quality standards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {accreditations.map((accreditation, index) => {
            const Icon = accreditation.icon;
            return (
              <Card
                key={index}
                className="bg-background/95 backdrop-blur border-0 shadow-glow hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                    <Icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {accreditation.title}
                  </h3>
                  <p className="text-sm font-medium text-primary mb-2">
                    {accreditation.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {accreditation.details}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-background/95 backdrop-blur border-0 shadow-glow max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '400ms' }}>
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-center text-foreground">
              Our Quality Commitments
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {qualityFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">{feature}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Accreditations;