import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TestSearchProps {
  onSearch: (query: string) => void;
}

const TestSearch = ({ onSearch }: TestSearchProps) => {
  return (
    <div className="relative max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
      <Input
        type="text"
        placeholder="Search for tests, packages, or health conditions..."
        className="pl-12 pr-4 py-6 text-lg bg-background/95 backdrop-blur border-border/50"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default TestSearch;