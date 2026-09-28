import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2, Search, Filter, RotateCcw } from "lucide-react";
import { Test, TestCategory } from "@/data/testCatalog";
import { testService, TestInputData } from "@/services/testService";
import AdminLayout from "@/components/admin/AdminLayout";

interface TestFormData {
  name: string;
  description: string;
  parameters: string;
  price: string;
  includes: string;
  popular: boolean;
  specialty: string;
  category: string;
}

const defaultFormData: TestFormData = {
  name: "",
  description: "",
  parameters: "1",
  price: "",
  includes: "",
  popular: false,
  specialty: "",
  category: "Comprehensive Health Packages",
};

const AdminTests = () => {
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState<TestCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<(Test & { category: string }) | null>(null);
  const [formData, setFormData] = useState<TestFormData>(defaultFormData);

  useEffect(() => {
    // Initial fetch
    setCatalog(testService.getTestCatalog());

    // Subscribe to catalog changes
    const unsubscribe = testService.subscribe(() => {
      setCatalog(testService.getTestCatalog());
    });

    return unsubscribe;
  }, []);

  // Unique categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    catalog.forEach((cat) => set.add(cat.category));
    return Array.from(set);
  }, [catalog]);

  // Flatten all tests with category info
  const allTests = useMemo(() => {
    return catalog.flatMap((category) =>
      category.tests.map((test) => ({
        ...test,
        category: category.category,
        categoryId: category.id,
      }))
    );
  }, [catalog]);

  // Filter tests based on search and category
  const filteredTests = useMemo(() => {
    return allTests.filter((test) => {
      const matchesSearch =
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || test.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allTests, searchQuery, selectedCategory]);

  const handleAddNew = () => {
    setEditingTest(null);
    setFormData({
      ...defaultFormData,
      category: categories[0] || "Comprehensive Health Packages",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (test: Test & { category: string }) => {
    setEditingTest(test);
    setFormData({
      name: test.name,
      description: test.description,
      parameters: test.parameters,
      price: test.price,
      includes: Array.isArray(test.includes) ? test.includes.join(", ") : "",
      popular: test.popular || false,
      specialty: test.specialty || "",
      category: test.category,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (test: Test & { category: string }) => {
    if (confirm(`Are you sure you want to delete test "${test.name}"?`)) {
      testService.deleteTest(test.name, test.category);
      toast.success(`Test "${test.name}" deleted successfully!`);
    }
  };

  const handleResetCatalog = () => {
    if (confirm("Reset test catalog to original defaults? All custom additions/edits will be cleared.")) {
      testService.resetCatalog();
      toast.success("Catalog reset to default!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      toast.error("Please fill in all required fields (Name, Price, Category)");
      return;
    }

    const testInput: TestInputData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      parameters: formData.parameters.trim(),
      price: formData.price.trim(),
      includes: formData.includes
        ? formData.includes.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      popular: formData.popular,
      specialty: formData.specialty.trim(),
      category: formData.category,
    };

    testService.addOrUpdateTest(
      testInput,
      editingTest?.name,
      editingTest?.category
    );

    if (editingTest) {
      toast.success(`Test "${formData.name}" updated successfully!`);
    } else {
      toast.success(`Test "${formData.name}" created and published to store!`);
    }

    setIsDialogOpen(false);
    setFormData(defaultFormData);
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
              <h1 className="text-2xl font-bold">Tests & Packages Management</h1>
              <p className="text-muted-foreground">Manage lab tests live across frontend and admin</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleResetCatalog}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Defaults
            </Button>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add Test
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[240px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories ({categories.length})</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Active Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{allTests.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{categories.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Popular Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{allTests.filter((t) => t.popular).length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tests Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="hidden sm:table-cell">Parameters</TableHead>
                    <TableHead className="hidden lg:table-cell">Popular</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTests.slice(0, 50).map((test, index) => (
                    <TableRow key={`${test.category}-${test.name}-${index}`}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{test.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1 md:hidden">
                            {test.category}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{test.category}</Badge>
                      </TableCell>
                      <TableCell>₹{test.price}</TableCell>
                      <TableCell className="hidden sm:table-cell">{test.parameters}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {test.popular && <Badge className="bg-primary">Popular</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(test)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(test)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredTests.length > 50 && (
              <div className="p-4 text-center text-sm text-muted-foreground border-t">
                Showing 50 of {filteredTests.length} tests. Use search to find specific tests.
              </div>
            )}
            {filteredTests.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No tests found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTest ? "Edit Test" : "Add New Test"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Test Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Complete Blood Count"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Category name (e.g. Comprehensive Health Packages)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the test"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parameters">Parameters Count</Label>
                <Input
                  id="parameters"
                  value={formData.parameters}
                  onChange={(e) => setFormData({ ...formData, parameters: e.target.value })}
                  placeholder="24 Parameters"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="includes">Included Parameters (comma separated)</Label>
              <Textarea
                id="includes"
                value={formData.includes}
                onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
                placeholder="e.g., RBC, WBC, Platelets, Hemoglobin"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Input
                id="specialty"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                placeholder="e.g., Hematology"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="popular"
                checked={formData.popular}
                onCheckedChange={(checked) => setFormData({ ...formData, popular: checked })}
              />
              <Label htmlFor="popular">Mark as Popular Test</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingTest ? "Save Changes" : "Create Test"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminTests;
