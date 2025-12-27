import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { Send, Trash2, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    const { token, isAuthenticated } = useSelector((state) => state.auth);
    const { toast } = useToast();

    useEffect(() => {
        if (postId) {
            fetchComments(0);
        }
    }, [postId]); // Reload if postId changes

    const fetchComments = async (pageNum) => {
        try {
            setLoading(true);
            const headers = {};
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(`/api/comments/post/${postId}?page=${pageNum}&size=5`, {
                headers
            });

            if (!response.ok) throw new Error("Failed to load comments");

            const data = await response.json();

            if (pageNum === 0) {
                setComments(data.content);
            } else {
                setComments(prev => [...prev, ...data.content]);
            }

            setHasMore(!data.last);
            setPage(pageNum);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to load comments",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        fetchComments(page + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await fetch(`/api/comments/post/${postId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ content: newComment })
            });

            if (!response.ok) {
                if (response.status === 401) throw new Error("Session expired. Please log in again.");
                if (response.status === 403) {
                    if (token) throw new Error("Session expired. Please log in again.");
                    throw new Error("You are not authorized to post comments.");
                }
                if (response.status >= 500) throw new Error("Server error. Please try again later.");
                throw new Error("Failed to post comment.");
            }

            const savedComment = await response.json();

            // Prepend new comment
            setComments(prev => [savedComment, ...prev]);
            setNewComment("");

            toast({
                title: "Success",
                description: "Comment posted successfully"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        }
    };

    const handleDelete = async (commentId) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 403) {
                    if (token) throw new Error("Session expired. Please log in again.");
                    throw new Error("You can only delete your own comments.");
                }
                if (response.status === 401) throw new Error("Please log in to delete comments.");
                throw new Error("Failed to delete comment.");
            }

            setComments(prev => prev.filter(c => c.id !== commentId));

            toast({
                title: "Success",
                description: "Comment deleted"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        }
    };

    return (
        <div className="mt-16 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-8">Comments ({comments.length}{hasMore ? "+" : ""})</h3>

            {/* Add Comment */}
            <div className="mb-10 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
                {isAuthenticated ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="min-h-[100px] resize-none bg-background/50 border-border/50 focus:border-primary/50"
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={!newComment.trim()}>
                                <Send className="w-4 h-4 mr-2" />
                                Post Comment
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-muted-foreground mb-4">You need to be logged in to post a comment.</p>
                        <Link href="/login">
                            <Button variant="outline">Log in to Comment</Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 p-4 rounded-xl hover:bg-card/30 transition-colors group">
                        <Avatar className="w-10 h-10 border border-border">
                            <AvatarFallback className="bg-primary/10 text-primary">
                                {comment.authorInitials || <User className="w-4 h-4" />}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <span className="font-semibold mr-2">{comment.authorName}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                                {comment.isOwner && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDelete(comment.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                {comment.content}
                            </p>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                )}

                {!loading && hasMore && (
                    <div className="text-center pt-4">
                        <Button variant="ghost" onClick={loadMore}>Load More Comments</Button>
                    </div>
                )}

                {!loading && comments.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        No comments yet. Be the first to share your thoughts!
                    </div>
                )}
            </div>
        </div>
    );
}
