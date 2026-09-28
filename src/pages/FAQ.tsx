import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    category: "Booking & Appointments",
    questions: [
      {
        question: "How do I book a test?",
        answer: "You can book a test through our website by clicking on 'Book Test' button, calling us at 9082945603, or visiting our lab directly. We offer free home sample collection for your convenience.",
      },
      {
        question: "Is home sample collection free?",
        answer: "Yes, we provide free home sample collection services across Thane. Our trained phlebotomists will visit your location at your preferred time slot.",
      },
      {
        question: "What are your operating hours?",
        answer: "We operate Monday to Saturday from 8:00 AM to 8:00 PM, and Sunday from 8:00 AM to 2:00 PM. Emergency services are available 24/7.",
      },
      {
        question: "Can I book tests for my family members?",
        answer: "Yes, you can book tests for multiple family members in a single appointment. Just provide all the required details during booking.",
      },
    ],
  },
  {
    category: "Reports & Results",
    questions: [
      {
        question: "How quickly will I receive my reports?",
        answer: "Most routine tests are completed within 24-48 hours. Specialized tests may take 3-5 days. You'll receive digital reports via email and SMS.",
      },
      {
        question: "How can I download my reports?",
        answer: "Reports can be downloaded from our 'Download Reports' section using your Patient ID and password. You'll also receive reports via email.",
      },
      {
        question: "Are the reports accurate and reliable?",
        answer: "Yes, our lab is NABL accredited and follows stringent quality control measures. All reports are verified by experienced pathologists before release.",
      },
      {
        question: "Can I get a hard copy of my report?",
        answer: "Yes, you can collect hard copies from our lab or request delivery during home sample collection at no extra cost.",
      },
    ],
  },
  {
    category: "Tests & Packages",
    questions: [
      {
        question: "What tests do you offer?",
        answer: "We offer comprehensive diagnostic services including blood tests, urine analysis, radiology, pathology, and specialized health packages covering all major health conditions.",
      },
      {
        question: "Do you offer health checkup packages?",
        answer: "Yes, we offer various health packages including Full Body Checkup, Executive Health Checkup, Senior Citizen Package, Women's Wellness, and more tailored to different age groups and health needs.",
      },
      {
        question: "Do I need a prescription for tests?",
        answer: "While a prescription is recommended, some routine tests can be done without one. However, certain specialized tests may require a doctor's prescription.",
      },
      {
        question: "Can I customize a health package?",
        answer: "Yes, we can customize packages based on your specific health requirements. Please contact us for personalized package creation.",
      },
    ],
  },
  {
    category: "Preparation & Guidelines",
    questions: [
      {
        question: "Do I need to fast before tests?",
        answer: "Fasting requirements depend on the specific test. Tests like Fasting Blood Sugar, Lipid Profile require 8-12 hours of fasting. Our team will inform you about specific requirements during booking.",
      },
      {
        question: "Can I take my regular medicines before the test?",
        answer: "Generally, you can continue your regular medications unless specifically instructed otherwise. Please inform our staff about your medications during booking.",
      },
      {
        question: "What should I bring for the test?",
        answer: "Please bring your prescription (if available), valid ID proof, and previous test reports for reference. For home collection, keep these documents ready.",
      },
    ],
  },
  {
    category: "Payment & Pricing",
    questions: [
      {
        question: "What are your payment options?",
        answer: "We accept cash, credit/debit cards, UPI, and online payments. Payment can be made at the lab or online during booking.",
      },
      {
        question: "Do you accept insurance?",
        answer: "Yes, we are empaneled with major insurance providers. Please check with your insurance company for coverage details and carry your insurance card.",
      },
      {
        question: "Are there any additional charges for home collection?",
        answer: "No, home sample collection is completely free across Thane. There are no hidden charges.",
      },
    ],
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-lg opacity-90">
                Find answers to common questions about our services
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              {faqs.map((category, categoryIndex) => (
                <div
                  key={categoryIndex}
                  className="animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${categoryIndex * 100}ms` }}
                >
                  <h2 className="text-2xl font-bold mb-6 text-foreground">
                    {category.category}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem
                        key={faqIndex}
                        value={`${categoryIndex}-${faqIndex}`}
                        className="border border-border/50 rounded-lg px-6 bg-card"
                      >
                        <AccordionTrigger className="text-left hover:no-underline">
                          <span className="font-semibold text-foreground">
                            {faq.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;