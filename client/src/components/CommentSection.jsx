import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { Send, Trash2, User, MessageSquare, CornerDownRight, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const CommentItem = ({ comment, postId, token, isAuthenticated, onDelete, onReplySuccess }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [areRepliesOpen, setAreRepliesOpen] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/comments/post/${postId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ content: replyContent, parentId: comment.id })
            });

            if (!response.ok) throw new Error("Failed to post reply.");

            setIsReplying(false);
            setReplyContent("");
            setAreRepliesOpen(true); // Auto-expand on reply
            toast({ title: "Success", description: "Reply posted" });
            onReplySuccess();
        } catch (err) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="group">
            <div className="flex gap-3 md:gap-4 p-4 rounded-xl hover:bg-card/30 transition-colors">
                <Avatar className="w-8 h-8 md:w-10 md:h-10 border border-border flex-shrink-0">
                    <AvatarImage src={comment.authorProfilePic} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs md:text-sm font-semibold">
                        {comment.authorInitials || <User className="w-4 h-4" />}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm md:text-base">{comment.authorName}</span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                        {comment.isOwner && (
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onDelete(comment.id)}>
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        )}
                    </div>

                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap break-words">{comment.content}</p>

                    <div className="mt-2 text-xs">
                        {isAuthenticated && (
                            <button
                                className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium px-1 py-1 rounded-md hover:bg-primary/10"
                                onClick={() => setIsReplying(!isReplying)}
                            >
                                <MessageSquare className="w-3 h-3" /> Reply
                            </button>
                        )}
                    </div>

                    {isReplying && (
                        <form onSubmit={handleReply} className="mt-3 flex gap-3 animate-in fade-in slide-in-from-top-2">
                            <div className="w-6 flex justify-center pt-2"><CornerDownRight className="w-4 h-4 text-muted-foreground/50" /></div>
                            <div className="flex-1 space-y-2">
                                <Textarea autoFocus value={replyContent} onChange={e => setReplyContent(e.target.value)} placeholder="Write a reply..." className="min-h-[80px] text-sm bg-background/50 border-input" />
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="ghost" size="sm" onClick={() => setIsReplying(false)}>Cancel</Button>
                                    <Button type="submit" size="sm" disabled={isSubmitting}>Reply</Button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-12 md:ml-14">
                    {!areRepliesOpen ? (
                        <button
                            onClick={() => setAreRepliesOpen(true)}
                            className="flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors mt-1 mb-2 px-2 py-1 rounded-md"
                        >
                            <div className="w-6 h-px bg-border group-hover:bg-primary/50 transition-colors" />
                            <ChevronDown className="w-3 h-3" />
                            View {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                        </button>
                    ) : (
                        <div className="relative">
                            {/* Hide control at top for easy access */}
                            <button
                                onClick={() => setAreRepliesOpen(false)}
                                className="absolute -left-4 top-2 p-1 text-muted-foreground hover:text-primary z-10"
                                title="Collapse"
                            >
                                <div className="w-px h-full absolute left-1/2 -translate-x-1/2 bg-border group-hover:bg-primary/50" />
                                <ChevronUp className="w-3 h-3 relative z-10 bg-background" />
                            </button>

                            <div className="pl-6 border-l-2 border-primary/30 space-y-3 mt-2">
                                {comment.replies.map(reply => (
                                    <CommentItem key={reply.id} comment={reply} postId={postId} token={token} isAuthenticated={isAuthenticated} onDelete={onDelete} onReplySuccess={onReplySuccess} />
                                ))}

                                <button
                                    onClick={() => setAreRepliesOpen(false)}
                                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors mt-4 mb-1 px-2 py-1 rounded-md ml-auto mr-auto w-max opacity-80 hover:opacity-100"
                                >
                                    <ChevronUp className="w-3 h-3" /> Hide Replies
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    const { user, token, isAuthenticated } = useSelector((state) => state.auth);
    const { toast } = useToast();

    const refreshComments = () => {
        fetchComments(0);
    };

    useEffect(() => {
        if (postId) {
            fetchComments(0);
        }
    }, [postId]);

    const fetchComments = async (pageNum) => {
        try {
            if (pageNum === 0) setLoading(true);
            const headers = {};
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const response = await fetch(`/api/comments/post/${postId}?page=${pageNum}&size=10`, { headers });
            if (!response.ok) throw new Error("Failed to load comments");

            const data = await response.json();

            if (pageNum === 0) {
                setComments(data.content);
            } else {
                setComments(prev => {
                    const newContent = data.content.filter(c => !prev.some(existing => existing.id === c.id));
                    return [...prev, ...newContent];
                });
            }

            setHasMore(!data.last);
            setPage(pageNum);
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to load comments", variant: "destructive" });
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
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ content: newComment })
            });

            if (!response.ok) throw new Error("Failed to post comment.");

            const savedComment = await response.json();
            setComments(prev => [savedComment, ...prev]);
            setNewComment("");
            toast({ title: "Success", description: "Comment posted" });
        } catch (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const handleDelete = async (commentId) => {
        if (!confirm("Are you sure you want to delete this?")) return;
        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to delete comment.");

            const deleteRecursive = (list) => {
                return list.filter(c => c.id !== commentId).map(c => ({
                    ...c,
                    replies: c.replies ? deleteRecursive(c.replies) : []
                }));
            };

            setComments(prev => deleteRecursive(prev));

            toast({ title: "Success", description: "Deleted" });
        } catch (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    return (
        <div className="mt-16 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <h3 className="text-2xl font-bold">Discussions</h3>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">{comments.length} Threads</span>
            </div>

            {/* Add Top-Level Comment */}
            <div className="mb-10 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 transition-all focus-within:border-primary/50 focus-within:bg-card">
                {isAuthenticated ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex gap-4">
                            <Avatar className="w-10 h-10 border border-border">
                                <AvatarImage src={user?.profilePic} className="object-cover" />
                                <AvatarFallback className="bg-primary/20 text-primary font-bold">ME</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <Textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Start a meaningful discussion..."
                                    className="min-h-[100px] resize-none bg-background/50 border-border/50 focus:border-primary/50 text-base"
                                />
                                <div className="flex justify-end mt-4">
                                    <Button type="submit" disabled={!newComment.trim()} className="px-6">
                                        <Send className="w-4 h-4 mr-2" /> Post Comment
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-8">
                        <div className="mb-4 text-muted-foreground">Join the conversation to share your thoughts.</div>
                        <Link href="/login">
                            <Button variant="outline" className="px-8">Log in</Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        postId={postId}
                        token={token}
                        isAuthenticated={isAuthenticated}
                        onDelete={handleDelete}
                        onReplySuccess={refreshComments}
                    />
                ))}

                {loading && (
                    <div className="flex justify-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                )}

                {!loading && hasMore && (
                    <div className="text-center pt-6">
                        <Button variant="ghost" onClick={loadMore}>Load More Conversations</Button>
                    </div>
                )}

                {!loading && comments.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground border border-dashed border-border/50 rounded-2xl bg-card/20">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No discussions yet. Be the first to break the ice!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
