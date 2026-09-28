import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import testIcon from "@/assets/test-icon.png";
import homeCollection from "@/assets/home-collection.png";
import fastReports from "@/assets/fast-reports.png";
import { testService } from "@/services/testService";
import { Test } from "@/data/testCatalog";

const features = [
  {
    icon: homeCollection,
    title: "Home Sample Collection",
    description: "Free sample collection from your doorstep at your convenience",
  },
  {
    icon: fastReports,
    title: "Fast & Accurate Reports",
    description: "Digital reports delivered within 24-48 hours with high precision",
  },
  {
    icon: testIcon,
    title: "Wide Test Range",
    description: "Comprehensive testing options covering all diagnostic needs",
  },
];

const defaultServices: Test[] = [
  {
    name: "Complete Blood Count (CBC)",
    description: "Comprehensive analysis of blood cells and platelets",
    price: "₹450",
    parameters: "24 Parameters",
    includes: ["RBC", "WBC", "Platelets", "Hemoglobin"],
    popular: true,
  },
  {
    name: "Lipid Profile",
    description: "Cholesterol and triglycerides assessment",
    price: "₹650",
    parameters: "8 Parameters",
    includes: ["Total Cholesterol", "HDL", "LDL", "Triglycerides"],
    popular: true,
  },
  {
    name: "Thyroid Function Test",
    description: "TSH, T3, and T4 hormone levels",
    price: "₹850",
    parameters: "3 Parameters",
    includes: ["TSH", "T3", "T4"],
    popular: true,
  },
  {
    name: "Diabetes Screening",
    description: "HbA1c and fasting glucose levels",
    price: "₹750",
    parameters: "2 Parameters",
    includes: ["HbA1c", "Fasting Blood Sugar"],
    popular: true,
  },
];

const Services = () => {
  const navigate = useNavigate();
  const [popularServices, setPopularServices] = useState<Test[]>([]);

  useEffect(() => {
    const loadPopular = () => {
      const catalog = testService.getTestCatalog();
      const populars: Test[] = [];

      catalog.forEach((cat) => {
        cat.tests.forEach((test) => {
          if (test.popular && !populars.some((p) => p.name.toLowerCase() === test.name.toLowerCase())) {
            populars.push(test);
          }
        });
      });

      setPopularServices(populars.length > 0 ? populars.slice(0, 8) : defaultServices);
    };

    loadPopular();

    const unsubscribe = testService.subscribe(loadPopular);
    return unsubscribe;
  }, []);

  return (
    <section id="services" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Popular Health Tests
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our comprehensive range of diagnostic tests with accurate results you can trust
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {popularServices.map((service, index) => {
            const formattedPrice = service.price
              ? service.price.startsWith("₹")
                ? service.price
                : `₹${service.price}`
              : "₹0";

            return (
              <Card
                key={`${service.name}-${index}`}
                className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 border-border/50 animate-in fade-in slide-in-from-bottom-4 flex flex-col justify-between"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div>
                    {service.popular && (
                      <Badge className="mb-4 bg-accent text-accent-foreground">
                        Popular
                      </Badge>
                    )}
                    <div className="w-16 h-16 mb-4 rounded-full bg-primary-light/20 flex items-center justify-center">
                      <img src={testIcon} alt="" className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {formattedPrice}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {service.parameters}
                      </span>
                    </div>
                    <Button
                      className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                      onClick={() =>
                        navigate("/book-test", {
                          state: { testName: service.name, price: formattedPrice },
                        })
                      }
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${(index + 4) * 100}ms` }}
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-primary p-1">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  <img src={feature.icon} alt="" className="w-10 h-10" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
