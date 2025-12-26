import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import { Button } from './ui/button';

export default function CodeBlock({ children, className, ...props }) {
    const [copied, setCopied] = useState(false);

    // Extract language from className (e.g., "language-javascript")
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : 'text';

    // Get the code content
    const code = String(children).replace(/\n$/, '');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    // For inline code (no language specified)
    if (!match) {
        return (
            <code className={className} {...props}>
                {children}
            </code>
        );
    }

    // For code blocks with syntax highlighting
    return (
        <div className="relative group my-4">
            {/* Language label */}
            <div className="flex items-center justify-between bg-[#1e1e1e] border border-border/50 rounded-t-lg px-4 py-2">
                <span className="text-xs font-mono text-muted-foreground uppercase">
                    {language}
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 px-2 opacity-70 hover:opacity-100 transition-opacity"
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4 mr-1 text-green-500" />
                            <span className="text-xs text-green-500">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4 mr-1" />
                            <span className="text-xs">Copy</span>
                        </>
                    )}
                </Button>
            </div>

            {/* Code block with syntax highlighting */}
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                    margin: 0,
                    borderRadius: '0 0 0.5rem 0.5rem',
                    border: '1px solid hsl(var(--border) / 0.5)',
                    borderTop: 'none',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                }}
                showLineNumbers={true}
                wrapLines={true}
                {...props}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}
