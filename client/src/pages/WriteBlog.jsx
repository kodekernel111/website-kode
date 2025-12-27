import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import MDEditor from "@uiw/react-md-editor";
import ImageUploadModal from "@/components/ImageUploadModal";
import {
    Save, Eye, FileText, Image as ImageIcon, Tag, Settings,
    Bold, Italic, Heading1, Heading2, List, ListOrdered,
    Link as LinkIcon, Code, Quote, Columns, Maximize2, Edit3, Upload
} from "lucide-react";

const EDITOR_MODES = {
    TOOLBAR: {
        id: 'toolbar',
        name: 'Markdown with Toolbar',
        description: 'Lightweight editor with formatting shortcuts',
        icon: Edit3,
        recommended: 'For developers and technical writers'
    },
    SPLIT: {
        id: 'split',
        name: 'Split-Screen Editor',
        description: 'Side-by-side editing with live preview',
        icon: Columns,
        recommended: 'For balanced visual feedback'
    },
    WYSIWYG: {
        id: 'wysiwyg',
        name: 'Visual Editor',
        description: 'Rich text editing with full toolbar',
        icon: Maximize2,
        recommended: 'For non-technical content creators'
    }
};

export default function WriteBlog() {
    const { user, isAuthenticated, token } = useSelector((state) => state.auth);
    const [_, setLocation] = useLocation();
    const { toast } = useToast();

    // Check if we're in edit mode
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    const isEditMode = !!editId;

    const [editorMode, setEditorMode] = useState(EDITOR_MODES.TOOLBAR.id);
    const [showModeSelector, setShowModeSelector] = useState(false);
    const [preview, setPreview] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [uploadTarget, setUploadTarget] = useState('content'); // 'content' or 'cover'
    const [cursorPosition, setCursorPosition] = useState(0); // Track cursor position for WYSIWYG
    const [loading, setLoading] = useState(isEditMode); // Loading state for fetching blog data

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        excerpt: "",
        coverImage: "",
        tags: "",
        published: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            setLocation("/login");
            return;
        }

        if (user?.role !== "WRITER" && user?.role !== "ADMIN") {
            toast({
                title: "Access Denied",
                description: "You need writer privileges to access this page.",
                variant: "destructive",
            });
            setLocation("/");
            return;
        }

        // Load saved editor preference
        const savedMode = localStorage.getItem('preferredEditorMode');
        if (savedMode && EDITOR_MODES[savedMode.toUpperCase()]) {
            setEditorMode(savedMode);
        }

        // Fetch blog data if in edit mode
        if (isEditMode && editId) {
            fetchBlogForEdit(editId);
        }
    }, [isAuthenticated, user, setLocation, toast, isEditMode, editId]);

    const fetchBlogForEdit = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/blogs/${id}/edit`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch blog post for editing");
            }

            const data = await response.json();

            // Populate form with existing data
            setFormData({
                title: data.title || "",
                content: data.content || "",
                excerpt: data.excerpt || "",
                coverImage: data.coverImage || "",
                tags: data.tags ? data.tags.join(", ") : "",
                published: data.published || false,
            });

            toast({
                title: "Blog Loaded",
                description: "You can now edit your blog post.",
            });
        } catch (error) {
            console.error("Error fetching blog:", error);
            toast({
                title: "Error",
                description: "Failed to load blog post for editing.",
                variant: "destructive",
            });
            setLocation("/write");
        } finally {
            setLoading(false);
        }
    };

    const handleEditorModeChange = (mode) => {
        setEditorMode(mode);
        localStorage.setItem('preferredEditorMode', mode);
        setShowModeSelector(false);
        toast({
            title: "Editor Mode Changed",
            description: `Switched to ${EDITOR_MODES[mode.toUpperCase()].name}`,
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleContentChange = (value) => {
        setFormData((prev) => ({ ...prev, content: value }));
    };

    const insertMarkdown = (syntax, placeholder = "text") => {
        const textarea = document.getElementById("content-textarea");
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = formData.content.substring(start, end) || placeholder;

        let newText;
        switch (syntax) {
            case "bold":
                newText = `**${selectedText}**`;
                break;
            case "italic":
                newText = `*${selectedText}*`;
                break;
            case "h1":
                newText = `# ${selectedText}`;
                break;
            case "h2":
                newText = `## ${selectedText}`;
                break;
            case "link":
                newText = `[${selectedText}](url)`;
                break;
            case "code":
                newText = `\`${selectedText}\``;
                break;
            case "quote":
                newText = `> ${selectedText}`;
                break;
            case "ul":
                newText = `- ${selectedText}`;
                break;
            case "ol":
                newText = `1. ${selectedText}`;
                break;
            case "image":
                setShowImageModal(true);
                return;
            default:
                newText = selectedText;
        }

        const newContent = formData.content.substring(0, start) + newText + formData.content.substring(end);
        setFormData(prev => ({ ...prev, content: newContent }));

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start, start + newText.length);
        }, 0);
    };

    const handleImageInsert = (markdown) => {
        if (uploadTarget === 'cover') {
            // Extract URL from markdown: ![alt](url)
            const urlMatch = markdown.match(/\!\[.*?\]\((.+?)\)/);
            if (urlMatch && urlMatch[1]) {
                setFormData(prev => ({ ...prev, coverImage: urlMatch[1] }));
                toast({
                    title: "Cover Image Set",
                    description: "Cover image has been uploaded and set.",
                });
            }
            setUploadTarget('content'); // Reset to content
            return;
        }

        // Insert into content
        const textarea = document.getElementById("content-textarea");

        if (textarea) {
            // For Toolbar and Split modes (has textarea)
            const start = textarea.selectionStart;
            const newContent = formData.content.substring(0, start) + markdown + formData.content.substring(start);
            setFormData(prev => ({ ...prev, content: newContent }));

            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + markdown.length, start + markdown.length);
            }, 0);
        } else {
            // For WYSIWYG mode (uses MDEditor)
            // Get cursor position from the MDEditor's textarea
            const mdEditorTextarea = document.querySelector('.w-md-editor-text-input');
            let insertPosition = cursorPosition;

            if (mdEditorTextarea) {
                insertPosition = mdEditorTextarea.selectionStart || cursorPosition;
            }

            // Insert at cursor position
            const newContent = formData.content.substring(0, insertPosition) +
                '\n' + markdown + '\n' +
                formData.content.substring(insertPosition);
            setFormData(prev => ({ ...prev, content: newContent }));

            // Update cursor position
            setCursorPosition(insertPosition + markdown.length + 2);

            toast({
                title: "Image Inserted",
                description: "Image has been added at cursor position.",
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = isEditMode
                ? `http://localhost:8080/api/blogs/${editId}`
                : "http://localhost:8080/api/blogs";

            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
                    editorMode, // Track which editor was used
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Failed to ${isEditMode ? 'update' : 'create'} blog post`);
            }

            const data = await response.json();

            toast({
                title: "Success!",
                description: `Your blog post has been ${isEditMode ? 'updated' : 'created'} successfully.`,
            });

            if (!isEditMode) {
                // Reset form only for new posts
                setFormData({
                    title: "",
                    content: "",
                    excerpt: "",
                    coverImage: "",
                    tags: "",
                    published: false,
                });
            }

            setLocation(`/blog/${data.id}`);
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || `Failed to ${isEditMode ? 'update' : 'create'} blog post`,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const toolbarButtons = [
        { icon: Bold, action: "bold", label: "Bold" },
        { icon: Italic, action: "italic", label: "Italic" },
        { icon: Heading1, action: "h1", label: "Heading 1" },
        { icon: Heading2, action: "h2", label: "Heading 2" },
        { icon: List, action: "ul", label: "Bullet List" },
        { icon: ListOrdered, action: "ol", label: "Numbered List" },
        { icon: LinkIcon, action: "link", label: "Link" },
        { icon: Code, action: "code", label: "Code" },
        { icon: Quote, action: "quote", label: "Quote" },
        { icon: ImageIcon, action: "image", label: "Image" },
    ];

    const renderContentEditor = () => {
        switch (editorMode) {
            case EDITOR_MODES.TOOLBAR.id:
                return (
                    <div className="space-y-3">
                        {/* Upload Image Button for Toolbar Mode */}
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setUploadTarget('content');
                                    setShowImageModal(true);
                                }}
                                className="border-primary/20 hover:bg-primary/10 hover:text-primary gap-2"
                            >
                                <ImageIcon className="w-4 h-4" />
                                Upload Image
                            </Button>
                        </div>

                        {/* Markdown Toolbar */}
                        <div className="flex flex-wrap gap-1 p-2 bg-background/60 rounded-lg border border-border/50">
                            {toolbarButtons.map((btn) => (
                                <Button
                                    key={btn.action}
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => insertMarkdown(btn.action)}
                                    className="h-9 px-3 hover:bg-primary/10 hover:text-primary transition-colors"
                                    title={btn.label}
                                >
                                    <btn.icon className="w-4 h-4 mr-1.5" />
                                    <span className="text-xs hidden sm:inline">{btn.label}</span>
                                </Button>
                            ))}
                        </div>

                        <Textarea
                            id="content-textarea"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Write your blog content here... Use toolbar buttons for formatting or type Markdown directly."
                            required
                            rows={18}
                            className="bg-background/60 border-border/50 text-white placeholder:text-muted-foreground focus:border-primary/50 resize-y font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <Code className="w-3 h-3" />
                            Markdown formatting supported. Use toolbar buttons or type syntax directly. Click "Upload Image" above to insert images.
                        </p>
                    </div>
                );

            case EDITOR_MODES.SPLIT.id:
                return (
                    <div className="space-y-3">
                        {/* Upload Image Button for Split Mode */}
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setUploadTarget('content');
                                    setShowImageModal(true);
                                }}
                                className="border-primary/20 hover:bg-primary/10 hover:text-primary gap-2"
                            >
                                <ImageIcon className="w-4 h-4" />
                                Upload Image
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-white font-semibold text-sm flex items-center gap-2">
                                    <Edit3 className="w-4 h-4" />
                                    Editor
                                </Label>
                                <Textarea
                                    id="content-textarea"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    placeholder="# Your Blog Title

Write your content here...

**Bold** and *italic* text
- Bullet points
1. Numbered lists"
                                    required
                                    rows={18}
                                    className="bg-background/60 border-border/50 text-white placeholder:text-muted-foreground focus:border-primary/50 resize-y font-mono text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white font-semibold text-sm flex items-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    Live Preview
                                </Label>
                                <div className="p-4 bg-background/60 rounded-lg border border-border/50 h-[432px] overflow-y-auto prose prose-invert prose-sm max-w-none">
                                    <ReactMarkdown>{formData.content || "*Start typing to see preview...*"}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case EDITOR_MODES.WYSIWYG.id:
                return (
                    <div className="space-y-3">
                        {/* Upload Image Button for WYSIWYG */}
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setUploadTarget('content');
                                    setShowImageModal(true);
                                }}
                                className="border-primary/20 hover:bg-primary/10 hover:text-primary gap-2"
                            >
                                <ImageIcon className="w-4 h-4" />
                                Upload Image
                            </Button>
                        </div>

                        <div data-color-mode="dark">
                            <MDEditor
                                value={formData.content}
                                onChange={handleContentChange}
                                preview="edit"
                                height={450}
                                textareaProps={{
                                    placeholder: "Start writing your blog post... Use the toolbar above for formatting.",
                                    required: true
                                }}
                            />
                            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-2">
                                <Maximize2 className="w-3 h-3" />
                                Visual editor with rich formatting toolbar. Use "Upload Image" button above for image uploads.
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (!isAuthenticated || (user?.role !== "WRITER" && user?.role !== "ADMIN")) {
        return null;
    }

    const currentMode = EDITOR_MODES[editorMode.toUpperCase()];

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 lg:px-8 bg-background relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -right-[10%] w-[70rem] h-[70rem] bg-primary/5 rounded-full blur-3xl opacity-20 animate-pulse" />
                <div className="absolute top-[40%] -left-[10%] w-[60rem] h-[60rem] bg-accent/5 rounded-full blur-3xl opacity-20" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                                Create Blog Post
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Share your insights with the community
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowModeSelector(!showModeSelector)}
                            className="border-primary/20 hover:bg-primary/10 gap-2"
                        >
                            <Settings className="w-4 h-4" />
                            Editor Mode
                        </Button>
                    </div>

                    {/* Editor Mode Selector */}
                    <AnimatePresence>
                        {showModeSelector && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card className="border-primary/20 bg-card/50 backdrop-blur-xl">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg font-semibold text-white">
                                            Choose Your Editor Mode
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            Select the editing experience that works best for you
                                        </p>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {Object.values(EDITOR_MODES).map((mode) => {
                                            const Icon = mode.icon;
                                            const isActive = editorMode === mode.id;

                                            return (
                                                <button
                                                    key={mode.id}
                                                    onClick={() => handleEditorModeChange(mode.id)}
                                                    className={`p-4 rounded-lg border-2 transition-all text-left ${isActive
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-border/50 bg-background/40 hover:border-primary/50 hover:bg-background/60'
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/20' : 'bg-background/60'}`}>
                                                            <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className={`font-semibold text-sm mb-1 ${isActive ? 'text-primary' : 'text-white'}`}>
                                                                {mode.name}
                                                            </h3>
                                                            <p className="text-xs text-muted-foreground mb-2">
                                                                {mode.description}
                                                            </p>
                                                            <p className="text-xs text-primary/80 italic">
                                                                {mode.recommended}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {isActive && (
                                                        <div className="mt-3 pt-3 border-t border-primary/20">
                                                            <span className="text-xs font-medium text-primary">
                                                                ✓ Currently Active
                                                            </span>
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Form */}
                    <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
                        <CardHeader className="border-b border-border/50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    {currentMode.name}
                                </CardTitle>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setPreview(!preview)}
                                    className="border-primary/20 hover:bg-primary/10 gap-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    {preview ? "Edit" : "Preview"}
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6">
                            {!preview ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Title */}
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-white font-semibold">
                                            Title <span className="text-red-400">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Enter a compelling title for your blog post"
                                            required
                                            className="bg-background/60 border-border/50 text-white placeholder:text-muted-foreground focus:border-primary/50"
                                        />
                                    </div>

                                    {/* Excerpt */}
                                    <div className="space-y-2">
                                        <Label htmlFor="excerpt" className="text-white font-semibold">
                                            Excerpt <span className="text-red-400">*</span>
                                        </Label>
                                        <Textarea
                                            id="excerpt"
                                            name="excerpt"
                                            value={formData.excerpt}
                                            onChange={handleChange}
                                            placeholder="Write a brief summary that will appear in blog listings (2-3 sentences recommended)"
                                            required
                                            rows={3}
                                            className="bg-background/60 border-border/50 text-white placeholder:text-muted-foreground focus:border-primary/50 resize-none"
                                        />
                                    </div>

                                    {/* Cover Image */}
                                    <div className="space-y-2">
                                        <Label htmlFor="coverImage" className="text-white font-semibold flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4" />
                                            Cover Image
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="coverImage"
                                                name="coverImage"
                                                value={formData.coverImage}
                                                onChange={handleChange}
                                                placeholder="https://example.com/image.jpg or upload below"
                                                type="url"
                                                className="bg-background/60 border-border/50 text-white placeholder:text-muted-foreground focus:border-primary/50 flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setUploadTarget('cover');
                                                    setShowImageModal(true);
                                                }}
                                                className="border-primary/20 hover:bg-primary/10 hover:text-primary gap-2 whitespace-nowrap"
                                            >
                                                <Upload className="w-4 h-4" />
                                                Upload
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Paste a URL or click Upload to select from your computer
                                        </p>
                                    </div>

                                    {/* Content Editor */}
                                    <div className="space-y-2">
                                        <Label className="text-white font-semibold">
                                            Content <span className="text-red-400">*</span>
                                        </Label>
                                        {renderContentEditor()}
                                    </div>

                                    {/* Tags */}
                                    <div className="space-y-2">
                                        <Label htmlFor="tags" className="text-white font-semibold flex items-center gap-2">
                                            <Tag className="w-4 h-4" />
                                            Tags
                                        </Label>
                                        <Input
                                            id="tags"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleChange}
                                            placeholder="technology, programming, web development (comma-separated)"
                                            className="bg-background/60 border-border/50 text-white placeholder:text-muted-foreground focus:border-primary/50"
                                        />
                                    </div>

                                    {/* Published Checkbox */}
                                    <div className="flex items-center space-x-3 p-4 bg-background/40 rounded-lg border border-border/50">
                                        <input
                                            type="checkbox"
                                            id="published"
                                            name="published"
                                            checked={formData.published}
                                            onChange={handleChange}
                                            className="w-4 h-4 rounded border-border/50 bg-background/60 text-primary focus:ring-primary focus:ring-offset-0"
                                        />
                                        <div>
                                            <Label htmlFor="published" className="text-white font-medium cursor-pointer">
                                                Publish immediately
                                            </Label>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                Uncheck to save as draft for later publication
                                            </p>
                                        </div>
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex gap-3 pt-4 border-t border-border/50">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting || loading}
                                            className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-300 h-11"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {isSubmitting
                                                ? (isEditMode ? "Updating..." : "Publishing...")
                                                : isEditMode
                                                    ? "Update Post"
                                                    : (formData.published ? "Publish Post" : "Save Draft")
                                            }
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setLocation("/blog")}
                                            className="border-border/50 hover:bg-background/60 h-11 px-8"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    {/* Full Preview */}
                                    {formData.coverImage && (
                                        <div className="relative w-full h-80 rounded-lg overflow-hidden">
                                            <img
                                                src={formData.coverImage}
                                                alt="Cover"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="prose prose-invert max-w-none">
                                        <h1 className="text-4xl font-bold text-white mb-4">
                                            {formData.title || "Untitled Post"}
                                        </h1>
                                        <p className="text-muted-foreground text-lg mb-6 italic">
                                            {formData.excerpt || "No excerpt provided"}
                                        </p>
                                        <div className="border-t border-border/50 pt-6">
                                            <ReactMarkdown>{formData.content || "*No content yet...*"}</ReactMarkdown>
                                        </div>
                                        {formData.tags && (
                                            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border/50">
                                                {formData.tags.split(",").filter(Boolean).map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm border border-primary/20 font-medium"
                                                    >
                                                        #{tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Image Upload Modal */}
            <ImageUploadModal
                isOpen={showImageModal}
                onClose={() => setShowImageModal(false)}
                onInsert={handleImageInsert}
                token={token}
            />
        </div>
    );
}
