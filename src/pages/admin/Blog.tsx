import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";
import { BookOpen, Plus, Pencil, Trash2, Search, ExternalLink, RotateCcw } from "lucide-react";
import { blogService, BlogPostItem } from "@/services/blogService";

interface BlogFormData {
  id?: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  author: string;
}

const defaultFormData: BlogFormData = {
  title: "",
  excerpt: "",
  content: "",
  category: "Test Insights",
  image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80",
  date: new Date().toISOString().split("T")[0],
  readTime: "5 min read",
  author: "Biogenex Health Team",
};

const defaultCategories = [
  "Test Insights",
  "Health Awareness",
  "Diabetes Care",
  "Heart Health",
  "Women's Health",
  "Nutritional Health",
  "General Wellness",
];

const AdminBlog = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostItem | null>(null);
  const [formData, setFormData] = useState<BlogFormData>(defaultFormData);

  useEffect(() => {
    setPosts(blogService.getPosts());

    const unsubscribe = blogService.subscribe(() => {
      setPosts(blogService.getPosts());
    });

    return unsubscribe;
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>(defaultCategories);
    posts.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const handleAddNew = () => {
    setEditingPost(null);
    setFormData({
      ...defaultFormData,
      date: new Date().toISOString().split("T")[0],
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (post: BlogPostItem) => {
    setEditingPost(post);
    setFormData({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content || post.excerpt,
      category: post.category,
      image: post.image,
      date: post.date,
      readTime: post.readTime,
      author: post.author || "Biogenex Health Team",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (post: BlogPostItem) => {
    if (confirm(`Are you sure you want to delete article "${post.title}"?`)) {
      blogService.deletePost(post.id);
      toast.success("Article deleted successfully!");
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset blog articles to defaults? All custom additions/edits will be cleared.")) {
      blogService.resetPosts();
      toast.success("Blog articles reset to defaults!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.category.trim()) {
      toast.error("Please fill in all required fields (Title, Category, Excerpt)");
      return;
    }

    blogService.addOrUpdatePost({
      id: editingPost ? editingPost.id : undefined,
      title: formData.title.trim(),
      excerpt: formData.excerpt.trim(),
      content: formData.content.trim() || formData.excerpt.trim(),
      category: formData.category.trim(),
      image: formData.image.trim() || "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80",
      date: formData.date || new Date().toISOString().split("T")[0],
      readTime: formData.readTime.trim() || "5 min read",
      author: formData.author.trim() || "Biogenex Health Team",
    });

    if (editingPost) {
      toast.success("Article updated successfully!");
    } else {
      toast.success("New article published to Health Blog!");
    }

    setIsDialogOpen(false);
    setFormData(defaultFormData);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-primary" />
              Health Blog & Articles Management
            </h1>
            <p className="text-muted-foreground">
              Create, edit, and publish health articles live on the frontend portal
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleResetDefaults}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Defaults
            </Button>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              New Article
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
                  placeholder="Search articles by title or snippet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[220px]">
                  <SelectValue placeholder="Filter Category" />
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
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{posts.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{categories.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Filtered Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{filteredPosts.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Articles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Published Articles</CardTitle>
            <CardDescription>Manage articles displayed under /blog</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Article</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Published Date</TableHead>
                    <TableHead>Read Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-12 h-12 rounded object-cover flex-shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-foreground line-clamp-1">{post.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{post.category}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{post.date}</TableCell>
                      <TableCell className="text-sm">{post.readTime}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View on site"
                            onClick={() => window.open(`/blog/${post.id}`, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit Article"
                            onClick={() => handleEdit(post)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete Article"
                            onClick={() => handleDelete(post)}
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
            {filteredPosts.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No blog posts found. Click "New Article" to publish one.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog for Add / Edit */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? "Edit Article" : "Publish New Article"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Understanding Your CBC Report"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Test Insights"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="readTime">Read Time</Label>
                  <Input
                    id="readTime"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="e.g., 5 min read"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt / Summary *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Short summary displayed on article cards"
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Full Article Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full article body content..."
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Cover Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author Name</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Dr. Sarah Sharma"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingPost ? "Save Changes" : "Publish Article"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;
