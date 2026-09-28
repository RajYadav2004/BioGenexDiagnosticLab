import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Clock, Beaker, ShoppingCart, IndianRupee } from "lucide-react";
import { Test } from "@/data/testCatalog";
import { useCart } from "@/contexts/CartContext";

interface TestDetailDialogProps {
  test: Test | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TestDetailDialog = ({ test, open, onOpenChange }: TestDetailDialogProps) => {
  const { addToCart, items } = useCart();

  if (!test) return null;

  const isInCart = items.some((item) => item.name === test.name);

  const getTestCategory = () => {
    const name = test.name.toLowerCase();
    const desc = test.description.toLowerCase();
    
    if (name.includes("blood") || name.includes("cbc") || name.includes("hemoglobin")) return "Hematology";
    if (name.includes("liver") || name.includes("lft") || name.includes("sgpt")) return "Liver Function";
    if (name.includes("kidney") || name.includes("kft") || name.includes("creatinine")) return "Kidney Function";
    if (name.includes("thyroid") || name.includes("tsh") || name.includes("t3") || name.includes("t4")) return "Thyroid";
    if (name.includes("vitamin") || name.includes("b12") || name.includes("d3")) return "Vitamins";
    if (name.includes("diabetes") || name.includes("glucose") || name.includes("hba1c")) return "Diabetes";
    if (name.includes("lipid") || name.includes("cholesterol")) return "Cardiac";
    if (name.includes("allergy") || name.includes("ige")) return "Allergy";
    if (name.includes("cancer") || name.includes("psa") || name.includes("ca-")) return "Oncology";
    if (desc.includes("comprehensive") || desc.includes("full body")) return "Comprehensive";
    return "Diagnostic";
  };

  const getPreparationInstructions = () => {
    const name = test.name.toLowerCase();
    
    if (name.includes("fasting") || name.includes("glucose") || name.includes("lipid")) {
      return "10-12 hours fasting required. Only water is allowed.";
    }
    if (name.includes("thyroid")) {
      return "No special preparation. Can be done at any time.";
    }
    if (name.includes("urine")) {
      return "Clean mid-stream urine sample required. First morning sample preferred.";
    }
    if (name.includes("stool")) {
      return "Fresh stool sample in sterile container. Avoid contamination with urine.";
    }
    return "No special preparation required. Stay hydrated before the test.";
  };

  const getReportTime = () => {
    const params = parseInt(test.parameters);
    if (params > 50) return "24-48 hours";
    if (params > 20) return "12-24 hours";
    return "Same day (6-8 hours)";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl font-bold text-foreground">
                {test.name}
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                {test.description}
              </DialogDescription>
            </div>
            {test.popular && (
              <Badge className="bg-accent text-accent-foreground shrink-0">
                Popular
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Price and Parameters */}
          <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-6 w-6 text-primary" />
              <span className="text-3xl font-bold text-primary">
                {test.price ? (test.price.startsWith('₹') ? test.price : `₹${test.price}`) : '₹0'}
              </span>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-sm">
                {getTestCategory()}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">
                {test.parameters} parameters
              </p>
            </div>
          </div>

          <Separator />

          {/* Test Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Clock className="h-4 w-4 text-primary" />
                Report Delivery
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {getReportTime()}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Beaker className="h-4 w-4 text-primary" />
                Sample Type
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {test.name.toLowerCase().includes("urine") ? "Urine" : 
                 test.name.toLowerCase().includes("stool") ? "Stool" : "Blood"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Preparation Instructions */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Preparation Instructions</h4>
            <p className="text-sm text-muted-foreground bg-secondary/20 p-3 rounded-lg">
              {getPreparationInstructions()}
            </p>
          </div>

          <Separator />

          {/* Included Tests */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">
              Tests Included ({test.includes.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {test.includes.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              className="flex-1 bg-gradient-primary hover:opacity-90"
              onClick={() => {
                addToCart(test);
                onOpenChange(false);
              }}
              disabled={isInCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isInCart ? "Already in Cart" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestDetailDialog;
