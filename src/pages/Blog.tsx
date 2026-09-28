import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { blogService, BlogPostItem } from "@/services/blogService";

const Blog = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setPosts(blogService.getPosts());

    const unsubscribe = blogService.subscribe(() => {
      setPosts(blogService.getPosts());
    });

    return unsubscribe;
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Health Blog & Articles
              </h1>
              <p className="text-lg opacity-90 mb-8">
                Expert insights on health, wellness, and preventive care
              </p>
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search articles by title, topic, or category..."
                  className="pl-12 pr-4 py-6 text-lg bg-background/95 backdrop-blur border-border/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">No articles found matching "{searchQuery}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    delay={index * 50}
                    onClick={() => navigate(`/blog/${post.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;