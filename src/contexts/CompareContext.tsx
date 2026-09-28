import { createContext, useContext, useState, ReactNode } from "react";
import { Test } from "@/data/testCatalog";
import { toast } from "sonner";

interface CompareContextType {
  compareItems: Test[];
  addToCompare: (test: Test) => void;
  removeFromCompare: (testName: string) => void;
  clearCompare: () => void;
  isInCompare: (testName: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [compareItems, setCompareItems] = useState<Test[]>([]);

  const addToCompare = (test: Test) => {
    if (compareItems.length >= 3) {
      toast.error("You can only compare up to 3 tests");
      return;
    }
    if (compareItems.some((item) => item.name === test.name)) {
      toast.info(`${test.name} is already in comparison`);
      return;
    }
    setCompareItems((prev) => [...prev, test]);
    toast.success(`${test.name} added to comparison`);
  };

  const removeFromCompare = (testName: string) => {
    setCompareItems((prev) => prev.filter((item) => item.name !== testName));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (testName: string) => {
    return compareItems.some((item) => item.name === testName);
  };

  return (
    <CompareContext.Provider
      value={{ compareItems, addToCompare, removeFromCompare, clearCompare, isInCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
