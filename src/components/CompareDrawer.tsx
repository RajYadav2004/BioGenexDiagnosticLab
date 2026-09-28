import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GitCompare, X, Check, IndianRupee } from "lucide-react";
import { useCompare } from "@/contexts/CompareContext";

const CompareDrawer = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  // Get the maximum number of includes across all items for alignment
  const maxIncludes = Math.max(...compareItems.map((item) => item.includes.length), 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative border-primary/30 hover:bg-primary/10"
        >
          <GitCompare className="h-5 w-5" />
          {compareItems.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground text-xs">
              {compareItems.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-4xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Compare Tests ({compareItems.length}/3)
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {compareItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <GitCompare className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No tests to compare</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Add up to 3 tests to compare them side-by-side
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <div className="space-y-6">
                {/* Header Row - Test Names */}
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${compareItems.length}, 1fr)` }}>
                  {compareItems.map((item) => (
                    <div key={item.name} className="relative p-4 bg-secondary/30 rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCompare(item.name)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <h3 className="font-semibold text-foreground pr-8">{item.name}</h3>
                      {item.popular && (
                        <Badge className="mt-2 bg-accent text-accent-foreground text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>

                {/* Price Row */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Price
                  </h4>
                  <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${compareItems.length}, 1fr)` }}>
                    {compareItems.map((item) => (
                      <div key={item.name} className="p-4 bg-primary/5 rounded-lg">
                        <span className="text-2xl font-bold text-primary flex items-center">
                          <IndianRupee className="h-5 w-5" />
                          {item.price.replace("₹", "")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Parameters Row */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Parameters
                  </h4>
                  <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${compareItems.length}, 1fr)` }}>
                    {compareItems.map((item) => (
                      <div key={item.name} className="p-4 bg-secondary/30 rounded-lg">
                        <span className="text-lg font-semibold text-foreground">
                          {item.parameters}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specialty Row */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Specialty
                  </h4>
                  <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${compareItems.length}, 1fr)` }}>
                    {compareItems.map((item) => (
                      <div key={item.name} className="p-4 bg-secondary/30 rounded-lg">
                        <Badge variant="outline">{item.specialty || "General"}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Included Tests */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Included Tests
                  </h4>
                  <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${compareItems.length}, 1fr)` }}>
                    {compareItems.map((item) => (
                      <div key={item.name} className="p-4 bg-secondary/30 rounded-lg space-y-2">
                        {item.includes.map((include, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-foreground">{include}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear Button */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearCompare}
                >
                  Clear Comparison
                </Button>
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CompareDrawer;
