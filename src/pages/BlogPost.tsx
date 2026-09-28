import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, User } from "lucide-react";
import { blogService, BlogPostItem } from "@/services/blogService";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostItem | undefined>(undefined);

  useEffect(() => {
    if (id) {
      setPost(blogService.getPostById(id));
    }
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Article not found</h1>
            <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <article className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Button
                variant="ghost"
                className="mb-6"
                onClick={() => navigate("/blog")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Articles
              </Button>

              <div className="mb-8">
                <Badge className="mb-4 bg-accent text-accent-foreground">
                  {post.category}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{post.readTime}</span>
                  </div>
                  {post.author && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <span>{post.author}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative h-96 rounded-2xl overflow-hidden mb-8 shadow-md">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-muted-foreground mb-8 font-medium leading-relaxed bg-secondary/30 p-6 rounded-xl border border-border/50">
                  {post.excerpt}
                </p>

                <div className="space-y-6 text-foreground leading-relaxed whitespace-pre-line text-base md:text-lg">
                  {post.content || post.excerpt}
                </div>
              </div>

              <div className="mt-12 p-8 bg-gradient-primary/10 border border-primary/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-1 text-foreground">
                    Need diagnostic testing?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Book your health tests with BioGenex for accurate results & free home sample collection.
                  </p>
                </div>
                <Button
                  className="bg-gradient-primary hover:opacity-90 transition-opacity text-base py-6 px-8 whitespace-nowrap"
                  onClick={() => navigate("/book-test")}
                >
                  Book Test Now
                </Button>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;