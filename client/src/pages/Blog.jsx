import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AnimatedSection from "@/components/AnimatedSection";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";



export default function Blog() {
  const [dbBlogPosts, setDbBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const ITEMS_PER_PAGE = 9;
  const { toast } = useToast();

  // Handle Search Debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setCurrentPage(1); // Reset to first page
      fetchBlogPosts(searchQuery, 1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle Page Change
  useEffect(() => {
    fetchBlogPosts(searchQuery, currentPage);
  }, [currentPage]);

  const fetchBlogPosts = async (query = "", page = 1) => {
    setLoading(true);
    try {
      const pageIndex = page - 1;
      const url = query
        ? `http://localhost:8080/api/blogs/search?q=${encodeURIComponent(query)}&page=${pageIndex}&size=${ITEMS_PER_PAGE}`
        : `http://localhost:8080/api/blogs?page=${pageIndex}&size=${ITEMS_PER_PAGE}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch blog posts");
      }

      const data = await response.json();

      // Transform backend data to match BlogCard props
      // Handle Page<BlogPostDTO> structure: data.content
      const postsData = data.content || [];

      const transformedPosts = postsData.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        category: post.tags && post.tags.length > 0 ? post.tags[0] : "Article",
        author: post.authorName,
        authorInitials: getInitials(post.authorName),
        date: formatDate(post.publishedAt || post.createdAt),
        readTime: estimateReadTime(post.content),
        coverImage: post.coverImage,
        isStatic: false,
      }));

      setDbBlogPosts(transformedPosts);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      toast({
        title: "Error",
        description: "Failed to load blog posts from database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const estimateReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min`;
  };

  // Determine posts to display
  const currentPosts = dbBlogPosts;
  const emptySlots = ITEMS_PER_PAGE - currentPosts.length;

  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6" data-testid="text-blog-title">
              Our Blog
            </h1>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8" data-testid="text-blog-subtitle">
              Technical insights, industry trends, and expert perspectives from our team.
              Published every weekend.
            </p>
            <span className="block text-xs text-muted-foreground/70 italic mb-4">
              {currentPosts.length > 0 && `Showing page ${currentPage} of ${totalPages} • `}
              More features coming soon!
            </span>
            <div className="h-px w-48 mx-auto mt-8 mb-12 bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />

            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-12"
                data-testid="input-blog-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading blog posts...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {currentPosts.map((post, index) => (
                <AnimatedSection key={post.id} delay={index * 100}>
                  <BlogCard {...post} />
                </AnimatedSection>
              ))}
              {/* Placeholders for fixed layout (Desktop only typically, but good for consistency) */}
              {!loading && emptySlots > 0 && Array.from({ length: emptySlots }).map((_, i) => (
                <div key={`placeholder-${i}`} className="hidden lg:block h-full min-h-[450px] opacity-0 pointer-events-none" aria-hidden="true" />
              ))}
            </div>
          )}

          {!loading && currentPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts found.</p>
            </div>
          )}

          {!loading && totalPages > 0 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          setCurrentPage(p => p - 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} text-white hover:text-white hover:bg-white/10`}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`text-white hover:text-white hover:bg-white/10 ${currentPage === page ? "bg-white/20 border-white/40" : ""}`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          setCurrentPage(p => p + 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} text-white hover:text-white hover:bg-white/10`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}
