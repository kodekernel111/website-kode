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

  // Domain State
  const [selectedDomain, setSelectedDomain] = useState("Engineering"); // Engineering, Business
  const [viewMode, setViewMode] = useState("latest"); // latest, series, series_detail
  const [seriesList, setSeriesList] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [seriesPosts, setSeriesPosts] = useState([]);
  const [seriesPage, setSeriesPage] = useState(1);

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
                tags: post.tags || [],
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
  }, [searchQuery, selectedDomain]); // Trigger on domain change too

  // Handle Page Change
  useEffect(() => {
    fetchBlogPosts(searchQuery, currentPage);
  }, [currentPage]);

  const fetchBlogPosts = async (query = "", page = 1) => {
    setLoading(true);
    try {
      const pageIndex = page - 1;

      // If there is a user-typed query, use it. Otherwise, use the selected domain as the query (Tag search).
      const finalQuery = query.trim() ? query : selectedDomain;

      const url = `${API_BASE_URL}/api/blogs/search?q=${encodeURIComponent(finalQuery)}&page=${pageIndex}&size=${ITEMS_PER_PAGE}`;

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
        tags: post.tags || [],
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

  const handleSeriesClick = (series) => {
    setSelectedSeries(series);
    setSeriesPage(1); // Reset to first page
    setViewMode('series_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter Series based on Domain
  const filteredSeriesList = seriesList.filter(series => {
    // Check if any post in the series has the selected domain tag
    // Or if the series name/desc includes it (optional, but safer to rely on posts tags for now if possible)
    // Since Series entity doesn't have tags, we check its posts.
    if (!series.posts || series.posts.length === 0) return false;

    // Case-insensitive check
    const domainLower = selectedDomain.toLowerCase();
    return series.posts.some(post =>
      post.tags && post.tags.some(tag => tag.toLowerCase() === domainLower)
    );
  });

  // Determine posts to display
  const currentPosts = dbBlogPosts;
  const emptySlots = ITEMS_PER_PAGE - currentPosts.length;

  // Series Pagination Logic (Lifted State)
  const totalSeriesPosts = selectedSeries?.posts?.length || 0;
  const seriesTotalPages = Math.ceil(totalSeriesPosts / ITEMS_PER_PAGE);
  const seriesStartIndex = (seriesPage - 1) * ITEMS_PER_PAGE;
  const seriesPaginatedPosts = selectedSeries?.posts?.slice(seriesStartIndex, seriesStartIndex + ITEMS_PER_PAGE) || [];

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

            {/* DOMAIN TABS (Engineering vs Business) */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex items-center p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
                {["Engineering", "Business"].map((domain) => (
                  <button
                    key={domain}
                    onClick={() => {
                      setSelectedDomain(domain);
                      setCurrentPage(1);
                      setViewMode("latest"); // Reset to latest view on domain switch
                    }}
                    className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${selectedDomain === domain
                      ? "bg-primary text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                      }`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            <span className="block text-xs text-muted-foreground/70 italic mb-4">
              {viewMode === 'latest' && currentPosts.length > 0 && `Showing page ${currentPage} of ${totalPages} • `}
              More features coming soon!
            </span>

            {/* View Toggle (Sub-navigation) */}
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

              {/* Series List View (Gallery Mode) */}
              {viewMode === 'series' && (
                <div className="space-y-8">
                  {filteredSeriesList.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                      No {selectedDomain} series found.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredSeriesList.map((series) => (
                        <div
                          key={series.id}
                          onClick={() => handleSeriesClick(series)}
                          className="group cursor-pointer relative flex flex-col justify-between h-full p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 backdrop-blur-sm overflow-hidden"
                        >
                          {/* Hover Glow */}
                          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          <div className="relative z-10 space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                              <Layers className="w-6 h-6" />
                            </div>

                            <div>
                              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {series.name}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                {series.description || "Explore this collection of in-depth articles."}
                              </p>
                            </div>
                          </div>

                          <div className="relative z-10 pt-4 mt-auto border-t border-white/10 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5" />
                              {series.posts.length} {series.posts.length === 1 ? 'Article' : 'Articles'}
                            </span>
                            <span className="text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1">
                              View Series <ArrowLeft className="w-3 h-3 rotate-180" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Series Detail View */}
              {viewMode === 'series_detail' && selectedSeries && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <Button
                    variant="ghost"
                    onClick={() => setViewMode('series')}
                    className="mb-8 hover:bg-white/5 text-muted-foreground hover:text-white gap-2 group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to All Series
                  </Button>

                  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900 to-black p-8 md:p-12 mb-16">
                    {/* Hero Background */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative z-10 max-w-3xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-6">
                        <Layers className="w-3 h-3" />
                        Feature Series
                      </div>
                      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {selectedSeries.name}
                      </h2>
                      <p className="text-lg text-muted-foreground/90 leading-relaxed border-l-4 border-primary/50 pl-6">
                        {selectedSeries.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Posts Grid */}
                    {seriesPaginatedPosts.length > 0 ? (
                      seriesPaginatedPosts.map((post, index) => (
                        <AnimatedSection key={post.id} delay={index * 100}>
                          <BlogCard {...post} />
                        </AnimatedSection>
                      ))
                    ) : (
                      <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                        <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground">No articles in this series yet.</p>
                      </div>
                    )}

                    {/* Series Pagination UI - Always Visible */}
                    <div className="col-span-full mt-12">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (seriesPage > 1) {
                                  setSeriesPage(p => p - 1);
                                  const hero = document.getElementById('series-hero');
                                  if (hero) hero.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                              className={`${seriesPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} text-white hover:text-white hover:bg-white/10`}
                            />
                          </PaginationItem>

                          {/* Show at least page 1 even if 0 pages */}
                          {Array.from({ length: Math.max(1, seriesTotalPages) }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                isActive={seriesPage === page}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSeriesPage(page);
                                  const hero = document.getElementById('series-hero');
                                  if (hero) hero.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={`text-white hover:text-white hover:bg-white/10 ${seriesPage === page ? "bg-white/20 border-white/40" : ""}`}
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
                                if (seriesPage < seriesTotalPages) {
                                  setSeriesPage(p => p + 1);
                                  const hero = document.getElementById('series-hero');
                                  if (hero) hero.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                              className={`${seriesPage >= Math.max(1, seriesTotalPages) ? "pointer-events-none opacity-50" : "cursor-pointer"} text-white hover:text-white hover:bg-white/10`}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {!loading && viewMode === 'latest' && currentPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts found.</p>
            </div>
          )}

          {/* Latest View Pagination - Always Visible */}
          {!loading && viewMode === 'latest' && (
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
                      className={`${currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} text-white hover:text-white hover:bg-white/10`}
                    />
                  </PaginationItem>

                  {/* Show at least page 1 */}
                  {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((page) => (
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
                      className={`${currentPage >= Math.max(1, totalPages) ? "pointer-events-none opacity-50" : "cursor-pointer"} text-white hover:text-white hover:bg-white/10`}
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
