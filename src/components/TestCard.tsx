import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Eye, ShoppingCart, GitCompare } from "lucide-react";
import { Test } from "@/data/testCatalog";
import { useCart } from "@/contexts/CartContext";
import { useCompare } from "@/contexts/CompareContext";
import TestDetailDialog from "./TestDetailDialog";

interface TestCardProps {
  test: Test;
  delay?: number;
}

const TestCard = ({ test, delay = 0 }: TestCardProps) => {
  const [showDetail, setShowDetail] = useState(false);
  const { addToCart, items } = useCart();
  const { addToCompare, isInCompare } = useCompare();

  const isInCart = items.some((item) => item.name === test.name);
  const inCompare = isInCompare(test.name);

  return (
    <>
      <Card
        className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 border-border/50 animate-in fade-in slide-in-from-bottom-4"
        style={{ animationDelay: `${delay}ms` }}
      >
        <CardContent className="p-6">
          {test.popular && (
            <Badge className="mb-4 bg-accent text-accent-foreground">
              Popular
            </Badge>
          )}
          <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
            {test.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {test.description}
          </p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl font-bold text-primary">
              {test.price ? (test.price.startsWith('₹') ? test.price : `₹${test.price}`) : '₹0'}
            </span>
            <span className="text-xs text-muted-foreground">
              {test.parameters}
            </span>
          </div>
          <div className="mb-4 space-y-2">
            <p className="text-sm font-semibold text-foreground">Includes:</p>
            <ul className="space-y-1">
              {test.includes.slice(0, 3).map((item, idx) => (
                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                  <Check className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
              {test.includes.length > 3 && (
                <li className="text-xs text-primary font-medium">
                  +{test.includes.length - 3} more tests
                </li>
              )}
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className={inCompare ? "border-accent text-accent" : ""}
              onClick={() => addToCompare(test)}
              disabled={inCompare}
              title="Compare"
            >
              <GitCompare className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowDetail(true)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Details
            </Button>
            <Button 
              className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
              onClick={() => addToCart(test)}
              disabled={isInCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isInCart ? "In Cart" : "Add"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <TestDetailDialog
        test={test}
        open={showDetail}
        onOpenChange={setShowDetail}
      />
    </>
  );
};

export default TestCard;
