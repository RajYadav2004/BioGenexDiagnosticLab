import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Thane West",
    rating: 5,
    text: "Excellent service! The home collection was very convenient and reports were delivered on time. Highly professional staff.",
    test: "Full Body Checkup",
  },
  {
    name: "Rajesh Patel",
    location: "Ghodbunder Road",
    rating: 5,
    text: "Very accurate reports and the staff explained everything clearly. Best diagnostic lab in Thane!",
    test: "Diabetes Screening",
  },
  {
    name: "Anjali Desai",
    location: "Majiwada",
    rating: 5,
    text: "Quick turnaround time and affordable prices. The phlebotomist was very gentle and professional.",
    test: "Thyroid Profile",
  },
  {
    name: "Vikram Singh",
    location: "Vartak Nagar",
    rating: 5,
    text: "Impressive service! Got my reports online within 24 hours. Will definitely recommend to friends and family.",
    test: "Lipid Profile",
  },
  {
    name: "Meera Joshi",
    location: "Naupada",
    rating: 5,
    text: "The NABL accreditation gives me confidence in the accuracy of results. Great experience overall!",
    test: "Executive Health Checkup",
  },
  {
    name: "Amit Kumar",
    location: "Hiranandani Estate",
    rating: 5,
    text: "Professional and courteous staff. The online booking system is very user-friendly. Highly satisfied!",
    test: "CBC Test",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            What Our Patients Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by thousands of families across Thane for accurate diagnostics and compassionate care
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-border/50 hover:shadow-soft transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-accent text-accent"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.location}
                  </p>
                  <p className="text-xs text-primary mt-1">
                    {testimonial.test}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;