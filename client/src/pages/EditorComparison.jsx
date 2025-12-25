import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ReactMarkdown from "react-markdown";
import MDEditor from "@uiw/react-md-editor";
import { motion } from "framer-motion";
import {
    Bold, Italic, Heading1, Heading2, List, ListOrdered,
    Link as LinkIcon, Code, Quote, Image as ImageIcon
} from "lucide-react";

export default function EditorComparison() {
    const [content1, setContent1] = useState("");
    const [content2, setContent2] = useState("");
    const [content3, setContent3] = useState("");

    // Option 1: Markdown Toolbar Helper
    const insertMarkdown = (syntax, placeholder = "text") => {
        const textarea = document.getElementById("markdown-toolbar-textarea");
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content1.substring(start, end) || placeholder;

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
                newText = `![alt text](image-url)`;
                break;
            default:
                newText = selectedText;
        }

        const newContent = content1.substring(0, start) + newText + content1.substring(end);
        setContent1(newContent);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start, start + newText.length);
        }, 0);
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

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 lg:px-8 bg-background">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        Editor Comparison
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Try all three editor options and choose your favorite
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Option 1: Markdown with Toolbar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="border-border/50 bg-card/50 backdrop-blur-xl h-full">
                            <CardHeader className="border-b border-border/50">
                                <CardTitle className="text-lg font-bold text-white">
                                    Option 1: Markdown Toolbar
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Simple toolbar + Markdown syntax
                                </p>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                {/* Toolbar */}
                                <div className="flex flex-wrap gap-1 p-2 bg-background/60 rounded-lg border border-border/50">
                                    {toolbarButtons.map((btn) => (
                                        <Button
                                            key={btn.action}
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => insertMarkdown(btn.action)}
                                            className="h-8 w-8 p-0 hover:bg-primary/10"
                                            title={btn.label}
                                        >
                                            <btn.icon className="w-4 h-4" />
                                        </Button>
                                    ))}
                                </div>

                                {/* Textarea */}
                                <Textarea
                                    id="markdown-toolbar-textarea"
                                    value={content1}
                                    onChange={(e) => setContent1(e.target.value)}
                                    placeholder="Type here... Use toolbar buttons for formatting"
                                    rows={12}
                                    className="bg-background/60 border-border/50 text-white font-mono text-sm resize-none"
                                />

                                {/* Preview */}
                                <div className="space-y-2">
                                    <Label className="text-white text-sm font-semibold">Preview:</Label>
                                    <div className="p-4 bg-background/60 rounded-lg border border-border/50 min-h-[100px] prose prose-invert prose-sm max-w-none">
                                        <ReactMarkdown>{content1 || "*Nothing to preview yet...*"}</ReactMarkdown>
                                    </div>
                                </div>

                                <div className="text-xs text-green-400 space-y-1">
                                    <p>✅ Lightweight (~50KB)</p>
                                    <p>✅ Easy to use</p>
                                    <p>✅ Markdown syntax</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Option 2: Split-Screen Live Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="border-border/50 bg-card/50 backdrop-blur-xl h-full">
                            <CardHeader className="border-b border-border/50">
                                <CardTitle className="text-lg font-bold text-white">
                                    Option 2: Split-Screen Preview
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Side-by-side editing & preview
                                </p>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                    {/* Editor Side */}
                                    <div className="space-y-2">
                                        <Label className="text-white text-sm font-semibold">Edit:</Label>
                                        <Textarea
                                            value={content2}
                                            onChange={(e) => setContent2(e.target.value)}
                                            placeholder="# Heading
**Bold** and *italic*
- List item"
                                            rows={15}
                                            className="bg-background/60 border-border/50 text-white font-mono text-sm resize-none"
                                        />
                                    </div>

                                    {/* Preview Side */}
                                    <div className="space-y-2">
                                        <Label className="text-white text-sm font-semibold">Preview:</Label>
                                        <div className="p-3 bg-background/60 rounded-lg border border-border/50 h-[360px] overflow-y-auto prose prose-invert prose-sm max-w-none">
                                            <ReactMarkdown>{content2 || "*Start typing to see preview...*"}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-xs text-green-400 space-y-1">
                                    <p>✅ Real-time preview</p>
                                    <p>✅ See both at once</p>
                                    <p>✅ Markdown friendly</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Option 3: Full WYSIWYG */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border-border/50 bg-card/50 backdrop-blur-xl h-full">
                            <CardHeader className="border-b border-border/50">
                                <CardTitle className="text-lg font-bold text-white">
                                    Option 3: WYSIWYG Editor
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    What You See Is What You Get
                                </p>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                <div data-color-mode="dark">
                                    <MDEditor
                                        value={content3}
                                        onChange={setContent3}
                                        preview="edit"
                                        height={400}
                                        textareaProps={{
                                            placeholder: "Start typing... Formatting toolbar above"
                                        }}
                                    />
                                </div>

                                <div className="text-xs text-green-400 space-y-1">
                                    <p>✅ Visual editing</p>
                                    <p>✅ Rich toolbar</p>
                                    <p>✅ No syntax needed</p>
                                    <p className="text-yellow-400">⚠️ Heavier (~200KB)</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Comparison Summary */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-white">Quick Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/50">
                                        <th className="text-left p-3 text-white font-semibold">Feature</th>
                                        <th className="text-left p-3 text-white font-semibold">Option 1</th>
                                        <th className="text-left p-3 text-white font-semibold">Option 2</th>
                                        <th className="text-left p-3 text-white font-semibold">Option 3</th>
                                    </tr>
                                </thead>
                                <tbody className="text-muted-foreground">
                                    <tr className="border-b border-border/50">
                                        <td className="p-3">Bundle Size</td>
                                        <td className="p-3 text-green-400">~50KB</td>
                                        <td className="p-3 text-green-400">~50KB</td>
                                        <td className="p-3 text-yellow-400">~200KB</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="p-3">Learning Curve</td>
                                        <td className="p-3">Low-Medium</td>
                                        <td className="p-3">Low-Medium</td>
                                        <td className="p-3 text-green-400">Very Low</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="p-3">Visual Feedback</td>
                                        <td className="p-3">Below editor</td>
                                        <td className="p-3 text-green-400">Side-by-side</td>
                                        <td className="p-3 text-green-400">Inline</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="p-3">Best For</td>
                                        <td className="p-3">Developers</td>
                                        <td className="p-3">Mixed users</td>
                                        <td className="p-3">Non-technical</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3">Storage Format</td>
                                        <td className="p-3 text-green-400">Markdown</td>
                                        <td className="p-3 text-green-400">Markdown</td>
                                        <td className="p-3 text-green-400">Markdown</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
