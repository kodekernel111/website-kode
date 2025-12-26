import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useSelector } from "react-redux";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, ArrowLeft, Edit, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import CodeBlock from "@/components/CodeBlock";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:id");
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authorStats, setAuthorStats] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Check if current user can edit this post
  const canEdit = isAuthenticated && post && (
    user?.email === post.authorEmail ||
    user?.role === 'ADMIN'
  );

  useEffect(() => {
    if (params?.id) {
      fetchBlogPost(params.id);
      incrementViewCount(params.id);
    }
  }, [params?.id]);

  const fetchBlogPost = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/blogs/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Blog post not found");
        }
        throw new Error("Failed to fetch blog post");
      }

      const data = await response.json();
      setPost(data);

      // Fetch author stats after getting post data
      if (data.authorEmail) {
        fetchAuthorStats(data.authorEmail);
      }
    } catch (err) {
      console.error("Error fetching blog post:", err);
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async (id) => {
    try {
      // Check if user has already viewed this post recently
      const viewKey = `blog_view_${id}`;
      const lastViewTime = localStorage.getItem(viewKey);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      // Only increment if:
      // 1. User hasn't viewed before, OR
      // 2. Last view was more than 24 hours ago
      if (!lastViewTime || (now - parseInt(lastViewTime)) > twentyFourHours) {
        await fetch(`http://localhost:8080/api/blogs/${id}/view`, {
          method: "POST",
        });

        // Store current timestamp
        localStorage.setItem(viewKey, now.toString());

        // Update local state instantly for UI feedback
        setPost(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            viewCount: (prev.viewCount || 0) + 1
          };
        });

        // Update author stats if available
        setAuthorStats(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            totalReaders: (prev.totalReaders || 0) + 1
          };
        });
      }
    } catch (err) {
      // Silently fail - view tracking shouldn't break the page
      console.error("Failed to increment view count:", err);
    }
  };

  const fetchAuthorStats = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/blogs/author/${encodeURIComponent(email)}/stats`
      );

      if (response.ok) {
        const data = await response.json();
        setAuthorStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch author stats:", err);
    }
  };

  const handleLike = async () => {
    if (isLiking) return; // Prevent double-clicking

    if (!post || !post.id) {
      console.error('Post is null or missing ID:', post);
      return;
    }

    console.log('Liking post:', post.id, 'Current liked:', liked, 'Current count:', likeCount);
    setIsLiking(true);

    try {
      const url = `http://localhost:8080/api/blogs/${post.id}/like${liked ? '?unlike=true' : ''}`;
      const response = await fetch(url, {
        method: 'POST',
      });

      console.log('Response status:', response.status, 'OK:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        const newLiked = !liked; // Toggle

        setLiked(newLiked);
        setLikeCount(data.likeCount);

        // Update author stats locally
        if (authorStats) {
          setAuthorStats(prev => ({
            ...prev,
            totalLikes: newLiked ? (prev.totalLikes || 0) + 1 : Math.max(0, (prev.totalLikes || 0) - 1)
          }));
        }

        console.log('Updated state - liked:', newLiked, 'count:', data.likeCount);

        // Store in localStorage
        if (newLiked) {
          localStorage.setItem(`blog_like_${post.id}`, 'true');
        } else {
          localStorage.removeItem(`blog_like_${post.id}`);
        }

        toast({
          title: newLiked ? "❤️ Liked!" : "Like removed",
          description: newLiked ? "Thanks for the support!" : "",
        });
      } else {
        const errorText = await response.text();
        console.error('Error response:', response.status, errorText);
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (err) {
      console.error('Failed to like post:', err);
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  // Check if user has already liked this post
  useEffect(() => {
    if (post) {
      const hasLiked = localStorage.getItem(`blog_like_${post.id}`);
      setLiked(!!hasLiked);
      setLikeCount(post.likeCount || 0);
    }
  }, [post]);


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

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-32 pb-20 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading blog post...</p>
        </div>
        <Footer />
        <Chatbot />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-32 pb-20 text-center max-w-2xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            {error || "The blog post you're looking for doesn't exist."}
          </p>
          <Link href="/blog">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
        <Footer />
        <Chatbot />
      </div>
    );
  }

  const category = post.tags && post.tags.length > 0 ? post.tags[0] : "Article";
  const authorInitials = getInitials(post.authorName);
  const publishDate = formatDate(post.publishedAt || post.createdAt);
  const readTime = estimateReadTime(post.content);

  return (
    <div className="min-h-screen">
      <Navigation />

      <article className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <Link href="/blog">
              <Button variant="ghost" className="gap-2" data-testid="button-back-to-blog">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Button>
            </Link>

            {canEdit && (
              <Link href={`/write?edit=${post.id}`}>
                <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary">
                  <Edit className="w-4 h-4" />
                  Edit Post
                </Button>
              </Link>
            )}
          </div>

          <div className="mb-8">
            <Badge className="mb-4" data-testid="badge-category">{category}</Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight" data-testid="text-post-title">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {authorInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold" data-testid="text-author">{post.authorName}</div>
                  <div className="text-sm text-muted-foreground">{post.authorEmail}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span data-testid="text-date">{publishDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span data-testid="text-readtime">{readTime} read</span>
                </div>
              </div>
            </div>

            {post.excerpt && (
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>

          {post.coverImage && (
            <div className="aspect-video rounded-xl mb-12 overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {!post.coverImage && (
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl mb-12" />
          )}

          <div className="prose prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg">
            <ReactMarkdown
              components={{
                code: CodeBlock
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>

                {/* Engagement Stats */}
                <div className="flex-shrink-0 flex items-center gap-4">
                  {/* View Count */}
                  <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 rounded-lg border border-muted bg-muted/30 text-muted-foreground select-none">
                    <Eye className="w-5 h-5" />
                    <div className="flex flex-col items-start leading-none gap-0.5">
                      <span className="font-bold text-lg text-foreground">{post.viewCount?.toLocaleString() || 0}</span>
                      <span className="text-[10px] uppercase tracking-wider font-medium">Views</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleLike}
                    disabled={isLiking}
                    variant="outline"
                    size="lg"
                    className={`gap-3 h-14 px-6 transition-all duration-300 ${liked
                      ? 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20 hover:border-red-500'
                      : 'border-border/50 hover:bg-primary/10 hover:border-primary/50'
                      }`}
                  >
                    <Heart
                      className={`w-6 h-6 transition-all duration-300 ${liked ? 'fill-red-500 scale-110' : 'scale-100'
                        }`}
                    />
                    <div className="flex flex-col items-start leading-none gap-0.5">
                      <span className="font-bold text-lg">{likeCount.toLocaleString()}</span>
                      <span className="text-[10px] uppercase tracking-wider font-medium">{liked ? 'Liked' : 'Likes'}</span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Premium Author Bio Section */}
          <div className="mt-16 pt-12 border-t border-border/50">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-background border border-primary/10">
              {/* Decorative gradient orbs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative p-8 md:p-10">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Author Avatar */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                    <Avatar className="relative w-24 h-24 md:w-28 md:h-28 border-4 border-background shadow-2xl">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary text-3xl font-bold">
                        {authorInitials}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Author Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent" data-testid="text-author-bio-name">
                          {post.authorName}
                        </h3>
                        <Badge variant="outline" className="border-primary/30 text-primary">
                          Writer
                        </Badge>
                      </div>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <span className="text-primary">✉</span>
                        {post.authorEmail}
                      </p>
                    </div>

                    <p className="text-base leading-relaxed text-muted-foreground max-w-2xl" data-testid="text-author-bio">
                      Passionate writer and developer at Kodekernel, sharing insights on modern web development,
                      best practices, and cutting-edge technologies. Always learning, always building.
                    </p>

                    {/* Author Stats */}
                    <div className="flex flex-wrap gap-6 pt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">{authorStats?.articleCount || 0}</div>
                          <div className="text-xs text-muted-foreground">Articles</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">{authorStats?.totalReaders?.toLocaleString() || 0}</div>
                          <div className="text-xs text-muted-foreground">Views</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">{authorStats?.totalLikes?.toLocaleString() || 0}</div>
                          <div className="text-xs text-muted-foreground">Likes</div>
                        </div>
                      </div>
                    </div>

                    {/* Social Links & Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/30">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary/20 hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-all"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary/20 hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-all"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                        Twitter
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary/20 hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-all"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        LinkedIn
                      </Button>

                      <div className="ml-auto">
                        <Button
                          className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all"
                          size="sm"
                        >
                          Follow
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
      <Chatbot />
    </div>
  );
}
