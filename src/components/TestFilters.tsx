import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

export interface FilterState {
  priceRange: [number, number];
  parameterRange: [number, number];
  categories: string[];
  popularOnly: boolean;
}

interface TestFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const diseaseCategories = [
  "Diabetes",
  "Thyroid",
  "Heart Health",
  "Liver",
  "Kidney",
  "Bone Health",
  "Anemia",
  "Infection",
  "Cancer Screening",
  "Women's Health",
  "Men's Health",
];

const TestFilters = ({ filters, onFiltersChange }: TestFiltersProps) => {
  const handlePriceChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  const handleParameterChange = (value: number[]) => {
    onFiltersChange({ ...filters, parameterRange: [value[0], value[1]] });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handlePopularToggle = () => {
    onFiltersChange({ ...filters, popularOnly: !filters.popularOnly });
  };

  const clearFilters = () => {
    onFiltersChange({
      priceRange: [0, 5000],
      parameterRange: [0, 100],
      categories: [],
      popularOnly: false,
    });
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <button
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Popular Tests */}
        <div className="space-y-3">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Popular Tests
          </Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="popular"
              checked={filters.popularOnly}
              onCheckedChange={handlePopularToggle}
            />
            <label
              htmlFor="popular"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show only popular tests
            </label>
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
          </Label>
          <Slider
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            max={5000}
            min={0}
            step={100}
            className="w-full"
          />
        </div>

        {/* Parameter Count */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Parameters: {filters.parameterRange[0]} - {filters.parameterRange[1]}
          </Label>
          <Slider
            value={filters.parameterRange}
            onValueChange={handleParameterChange}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
        </div>

        {/* Disease Categories */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Health Categories</Label>
          <div className="flex flex-wrap gap-2">
            {diseaseCategories.map((category) => (
              <Badge
                key={category}
                variant={filters.categories.includes(category) ? "default" : "outline"}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => handleCategoryToggle(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestFilters;
