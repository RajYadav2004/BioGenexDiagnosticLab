import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Separator } from "@/components/ui/separator";

const BookTest = () => {
  const location = useLocation();
  const testInfo = location.state as { testName?: string; price?: string } | null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Book Your Test
              </h1>
              <p className="text-lg opacity-90">
                Schedule your health test with free home sample collection
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-8 text-center">
              <p className="text-muted-foreground mb-4">Choose your preferred booking method</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <WhatsAppButton
                  size="lg"
                  className="bg-[#25D366] hover:bg-[#20BA5A] text-white w-full sm:w-auto"
                  message={`Hi, I'd like to book ${testInfo?.testName || "a test"} at Biogenex Diagnostic`}
                >
                  Quick Book via WhatsApp
                </WhatsAppButton>
                <span className="text-muted-foreground">or</span>
              </div>
              <Separator className="mb-8" />
            </div>
            <BookingForm preSelectedTest={testInfo?.testName} preSelectedPrice={testInfo?.price} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BookTest;