import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Star, Search, Filter, Pencil, RotateCcw, ArrowLeft, Check } from "lucide-react";
import { Test, TestCategory } from "@/data/testCatalog";
import { testService, TestInputData } from "@/services/testService";

interface EditFormData {
  name: string;
  category: string;
  price: string;
  parameters: string;
  description: string;
  includes: string;
  popular: boolean;
}

const AdminPopular = () => {
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState<TestCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [onlyPopular, setOnlyPopular] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<(Test & { category: string }) | null>(null);
  const [formData, setFormData] = useState<EditFormData>({
    name: "",
    category: "",
    price: "",
    parameters: "",
    description: "",
    includes: "",
    popular: true,
  });

  useEffect(() => {
    setCatalog(testService.getTestCatalog());

    const unsubscribe = testService.subscribe(() => {
      setCatalog(testService.getTestCatalog());
    });

    return unsubscribe;
  }, []);

  // Flatten tests with category info
  const allTests = useMemo(() => {
    return catalog.flatMap((category) =>
      category.tests.map((test) => ({
        ...test,
        category: category.category,
      }))
    );
  }, [catalog]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    catalog.forEach((cat) => set.add(cat.category));
    return Array.from(set);
  }, [catalog]);

  const popularTests = useMemo(() => {
    return allTests.filter((t) => t.popular);
  }, [allTests]);

  const filteredTests = useMemo(() => {
    return allTests.filter((test) => {
      const matchesSearch =
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || test.category === selectedCategory;
      const matchesPopular = !onlyPopular || test.popular;
      return matchesSearch && matchesCategory && matchesPopular;
    });
  }, [allTests, searchQuery, selectedCategory, onlyPopular]);

  const handleTogglePopular = (test: Test & { category: string }, newPopularState: boolean) => {
    const input: TestInputData = {
      name: test.name,
      description: test.description,
      parameters: test.parameters,
      price: test.price,
      includes: test.includes || [],
      popular: newPopularState,
      specialty: test.specialty || "",
      category: test.category,
    };

    testService.addOrUpdateTest(input, test.name, test.category);

    if (newPopularState) {
      toast.success(`"${test.name}" marked as Popular & featured on Home Page!`);
    } else {
      toast.info(`"${test.name}" removed from Popular tests.`);
    }
  };

  const handleEdit = (test: Test & { category: string }) => {
    setEditingTest(test);
    setFormData({
      name: test.name,
      category: test.category,
      price: test.price,
      parameters: test.parameters,
      description: test.description,
      includes: Array.isArray(test.includes) ? test.includes.join(", ") : "",
      popular: test.popular || false,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingTest) return;

    const input: TestInputData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      parameters: formData.parameters.trim(),
      price: formData.price.trim(),
      includes: formData.includes
        ? formData.includes.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      popular: formData.popular,
      category: formData.category,
    };

    testService.addOrUpdateTest(input, editingTest.name, editingTest.category);
    toast.success(`Test "${formData.name}" updated successfully!`);
    setIsDialogOpen(false);
  };

  const handleReset = () => {
    if (confirm("Reset popular tests settings to defaults?")) {
      testService.resetCatalog();
      toast.success("Catalog reset to defaults!");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Star className="h-7 w-7 text-amber-500 fill-amber-500" />
                Popular Tests Editing
              </h1>
              <p className="text-muted-foreground">
                Toggle popular badges and customize featured health tests for the Home Page
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Defaults
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400">
                Popular Tests Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-600">{popularTests.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Featured across site</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Catalog Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{allTests.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Available for selection</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{categories.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Diagnostic areas</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[220px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2 shrink-0">
                <Switch
                  id="only-popular"
                  checked={onlyPopular}
                  onCheckedChange={setOnlyPopular}
                />
                <Label htmlFor="only-popular" className="cursor-pointer text-sm font-medium">
                  Show Popular Only
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Tests Management Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Popular Tests List ({filteredTests.length})</span>
            </CardTitle>
            <CardDescription>
              Toggle the switch to make any test popular or remove it from the Home Page
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Popular Toggle</TableHead>
                    <TableHead>Test Name</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="hidden sm:table-cell">Parameters</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTests.slice(0, 100).map((test, index) => (
                    <TableRow
                      key={`${test.category}-${test.name}-${index}`}
                      className={test.popular ? "bg-amber-500/5" : ""}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={!!test.popular}
                            onCheckedChange={(checked) => handleTogglePopular(test, checked)}
                          />
                          {test.popular && (
                            <Badge className="bg-amber-500 text-white flex gap-1 items-center">
                              <Star className="h-3 w-3 fill-white" /> Popular
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-foreground">{test.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {test.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{test.category}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-primary">
                        {test.price ? (test.price.startsWith("₹") ? test.price : `₹${test.price}`) : "₹0"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">
                        {test.parameters}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(test)}
                        >
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredTests.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No tests match your filter criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Test Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Popular Test Details</DialogTitle>
          </DialogHeader>
          {editingTest && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pop-name">Test Name</Label>
                <Input
                  id="pop-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pop-price">Price (₹)</Label>
                  <Input
                    id="pop-price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pop-params">Parameters</Label>
                  <Input
                    id="pop-params"
                    value={formData.parameters}
                    onChange={(e) => setFormData({ ...formData, parameters: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pop-desc">Description</Label>
                <Textarea
                  id="pop-desc"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pop-includes">Included Parameters (comma separated)</Label>
                <Textarea
                  id="pop-includes"
                  value={formData.includes}
                  onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="pop-flag"
                  checked={formData.popular}
                  onCheckedChange={(checked) => setFormData({ ...formData, popular: checked })}
                />
                <Label htmlFor="pop-flag" className="font-semibold">
                  Featured as Popular Test
                </Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminPopular;
