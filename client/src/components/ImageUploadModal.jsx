import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Link as LinkIcon, X, Image as ImageIcon, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ImageUploadModal({ isOpen, onClose, onInsert, token }) {
    const [activeTab, setActiveTab] = useState("upload");
    const [imageUrl, setImageUrl] = useState("");
    const [altText, setAltText] = useState("");
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const { toast } = useToast();

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({
                title: "Invalid File",
                description: "Please select an image file (JPG, PNG, GIF, WebP)",
                variant: "destructive",
            });
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File Too Large",
                description: "Please select an image smaller than 5MB",
                variant: "destructive",
            });
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);

        // Upload to server
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/api/upload/image', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            setImageUrl(data.url);

            toast({
                title: "Upload Successful",
                description: "Image uploaded successfully",
            });
        } catch (error) {
            toast({
                title: "Upload Failed",
                description: error.message || "Failed to upload image. Please try again.",
                variant: "destructive",
            });
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    const handleInsert = () => {
        if (!imageUrl.trim()) {
            toast({
                title: "No Image URL",
                description: "Please provide an image URL or upload an image",
                variant: "destructive",
            });
            return;
        }

        const markdown = `![${altText || 'Image'}](${imageUrl})`;
        onInsert(markdown);
        handleClose();
    };

    const handleClose = () => {
        setImageUrl("");
        setAltText("");
        setPreview(null);
        setActiveTab("upload");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] bg-card/95 backdrop-blur-xl border-border/50">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        Insert Image
                    </DialogTitle>
                    <DialogDescription>
                        Upload an image or provide a URL to insert into your blog post
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-background/60">
                        <TabsTrigger value="upload" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload File
                        </TabsTrigger>
                        <TabsTrigger value="url" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                            <LinkIcon className="w-4 h-4 mr-2" />
                            Image URL
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-4 mt-4">
                        <div className="space-y-3">
                            <Label className="text-white font-semibold">Upload Image</Label>
                            <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="image-upload"
                                    disabled={uploading}
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="cursor-pointer flex flex-col items-center gap-3"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                            <p className="text-sm text-muted-foreground">Uploading...</p>
                                        </>
                                    ) : preview ? (
                                        <>
                                            <img src={preview} alt="Preview" className="max-h-48 rounded-lg" />
                                            <p className="text-sm text-green-400">✓ Image ready to insert</p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-12 h-12 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium text-white">
                                                    Click to upload or drag and drop
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    PNG, JPG, GIF, WebP up to 5MB
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </label>
                            </div>

                            {preview && (
                                <div className="space-y-2">
                                    <Label htmlFor="alt-text-upload" className="text-white">
                                        Alt Text (Optional)
                                    </Label>
                                    <Input
                                        id="alt-text-upload"
                                        value={altText}
                                        onChange={(e) => setAltText(e.target.value)}
                                        placeholder="Describe the image for accessibility"
                                        className="bg-background/60 border-border/50 text-white"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Alt text improves accessibility and SEO
                                    </p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="url" className="space-y-4 mt-4">
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <Label htmlFor="image-url" className="text-white font-semibold">
                                    Image URL
                                </Label>
                                <Input
                                    id="image-url"
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="bg-background/60 border-border/50 text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="alt-text-url" className="text-white">
                                    Alt Text (Optional)
                                </Label>
                                <Input
                                    id="alt-text-url"
                                    value={altText}
                                    onChange={(e) => setAltText(e.target.value)}
                                    placeholder="Describe the image for accessibility"
                                    className="bg-background/60 border-border/50 text-white"
                                />
                            </div>

                            {imageUrl && (
                                <div className="space-y-2">
                                    <Label className="text-white">Preview</Label>
                                    <div className="border border-border/50 rounded-lg p-4 bg-background/40">
                                        <img
                                            src={imageUrl}
                                            alt={altText || "Preview"}
                                            className="max-h-48 mx-auto rounded"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                        <p className="text-sm text-red-400 text-center mt-2" style={{ display: 'none' }}>
                                            Failed to load image. Please check the URL.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex gap-3 pt-4 border-t border-border/50">
                    <Button
                        onClick={handleInsert}
                        disabled={!imageUrl || uploading}
                        className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary"
                    >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Insert Image
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        className="border-border/50 hover:bg-background/60"
                    >
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
