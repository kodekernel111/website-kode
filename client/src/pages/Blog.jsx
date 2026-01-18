import API_BASE_URL from "../config";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AnimatedSection from "@/components/AnimatedSection";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Search, Layers, Clock, ArrowLeft, BookOpen, Sparkles, Code2 } from "lucide-react";
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

  // Series State
  const [viewMode, setViewMode] = useState("latest"); // latest, series, series_detail
  const [seriesList, setSeriesList] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [seriesPosts, setSeriesPosts] = useState([]);

  const { toast } = useToast();

  // Fetch Series when tab is clicked
  useEffect(() => {
    if (viewMode === 'series' && seriesList.length === 0) {
      fetch(`${API_BASE_URL}/api/blog-series/with-posts`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch series");
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            // Transform posts within each series
            const transformed = data.map(series => ({
              ...series,
              posts: series.posts.map(post => ({
                id: post.id,
                title: post.title,
                excerpt: post.excerpt,
                category: post.tags && post.tags.length > 0 ? post.tags[0] : "Article",
                author: post.authorName,
                authorInitials: getInitials(post.authorName),
                date: formatDate(post.publishedAt || post.createdAt),
                readTime: estimateReadTime(post.content),
                coverImage: post.coverImage,
                authorProfilePic: post.authorProfilePic,
                isStatic: false,
              }))
            }));
            setSeriesList(transformed);
          } else {
            setSeriesList([]);
          }
        })
        .catch(err => {
          console.error(err);
          setSeriesList([]);
        });
    }
  }, [viewMode]);


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
        ? `${API_BASE_URL}/api/blogs/search?q=${encodeURIComponent(query)}&page=${pageIndex}&size=${ITEMS_PER_PAGE}`
        : `${API_BASE_URL}/api/blogs?page=${pageIndex}&size=${ITEMS_PER_PAGE}`;

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
        authorProfilePic: post.authorProfilePic,
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
            <div className="relative max-w-4xl mx-auto mb-16 space-y-8">
              {/* Background Blur */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-40 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary/80 uppercase tracking-widest backdrop-blur-md">
                  <Code2 className="w-3 h-3" />
                  Our DNA
                </div>

                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                  Driven by a strong <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent filter drop-shadow-sm">
                    Engineering-First Culture
                  </span>
                </h2>

                <p className="text-lg text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed font-light" data-testid="text-blog-subtitle">
                  Technical insights, architecture deep-dives, and industry trends. <br className="hidden sm:block" />
                  Straight from our team to you.
                </p>

                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground/50 uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" />
                  Published Every Weekend
                  <Sparkles className="w-3 h-3" />
                </div>
              </div>
            </div>
            <span className="block text-xs text-muted-foreground/70 italic mb-4">
              {viewMode === 'latest' && currentPosts.length > 0 && `Showing page ${currentPage} of ${totalPages} • `}
              More features coming soon!
            </span>

            {/* View Toggle */}
            <div className="flex justify-center gap-4 mt-6">
              <Button
                variant={viewMode === 'latest' ? 'default' : 'outline'}
                onClick={() => setViewMode('latest')}
                className="rounded-full px-6 gap-2"
              >
                <Clock className="w-4 h-4" /> Latest
              </Button>
              <Button
                variant={viewMode.startsWith('series') ? 'default' : 'outline'}
                onClick={() => setViewMode('series')}
                className="rounded-full px-6 gap-2"
              >
                <Layers className="w-4 h-4" /> Series
              </Button>
            </div>

            <div className="h-px w-48 mx-auto mt-8 mb-12 bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />

            {viewMode === 'latest' && (
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
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <>
              {/* Latest View */}
              {viewMode === 'latest' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {currentPosts.map((post, index) => (
                    <AnimatedSection key={post.id} delay={index * 100}>
                      <BlogCard {...post} />
                    </AnimatedSection>
                  ))}
                  {!loading && emptySlots > 0 && Array.from({ length: emptySlots }).map((_, i) => (
                    <div key={`placeholder-${i}`} className="hidden lg:block h-full min-h-[450px] opacity-0 pointer-events-none" aria-hidden="true" />
                  ))}
                </div>
              )}

              {/* Series List View (With Posts) */}
              {viewMode === 'series' && (
                <div className="space-y-16">
                  {seriesList.length === 0 ? (
                    <div className="text-center text-muted-foreground">No series found.</div>
                  ) : (
                    seriesList.map((series, idx) => (
                      <div key={series.id} className="relative">
                        {/* Decorative connector line between series (except last) */}
                        {idx !== seriesList.length - 1 && (
                          <div className="absolute left-8 top-[100px] bottom-[-64px] w-px bg-gradient-to-b from-primary/50 to-transparent opacity-20 hidden lg:block" />
                        )}

                        <div className="space-y-8">
                          {/* Series Header Card */}
                          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 md:p-10 backdrop-blur-sm">
                            {/* Background glow effect */}
                            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

                            <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                              <div className="space-y-4 max-w-3xl">
                                <div className="flex items-center gap-3">
                                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                                    <Layers className="h-4 w-4" />
                                  </span>
                                  <span className="text-sm font-medium tracking-wider text-primary uppercase">Feature Series</span>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                                  {series.name}
                                </h2>

                                {series.description && (
                                  <p className="text-lg text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-4">
                                    {series.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full border border-white/5 self-start shrink-0">
                                <div className="flex -space-x-2">
                                  {[...Array(Math.min(3, series.posts.length))].map((_, i) => (
                                    <div key={i} className="h-6 w-6 rounded-full bg-zinc-800 border border-zinc-900 ring-2 ring-background flex items-center justify-center">
                                      <span className="text-[10px] text-zinc-500">
                                        <BookOpen className="w-3 h-3" />
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                <span className="text-sm font-medium text-zinc-400 pl-2">
                                  {series.posts.length} {series.posts.length === 1 ? 'Article' : 'Articles'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Posts Grid */}
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pl-0">
                            {series.posts && series.posts.length > 0 ? (
                              series.posts.map((post, index) => (
                                <AnimatedSection key={post.id} delay={index * 100}>
                                  <BlogCard {...post} />
                                </AnimatedSection>
                              ))
                            ) : (
                              <div className="col-span-full py-12 text-center rounded-xl border border-dashed border-white/10 bg-white/5">
                                <p className="text-muted-foreground text-sm italic">
                                  No published articles in this series yet.
                                  <br />
                                  <span className="text-xs opacity-50">Check back soon!</span>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}

          {!loading && viewMode === 'latest' && currentPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts found.</p>
            </div>
          )}

          {!loading && viewMode === 'latest' && totalPages > 0 && (
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
