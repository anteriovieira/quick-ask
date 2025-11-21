"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MessageSquare, X, Send, Sparkles, MoreVertical, ArrowLeft, ArrowRight, RotateCw, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function BrowserSimulation() {
    const [selectedText, setSelectedText] = useState(false)
    const [showQuickAsk, setShowQuickAsk] = useState(false)
    const [showPanel, setShowPanel] = useState(false)
    const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([])
    const [isTyping, setIsTyping] = useState(false)

    // Simulation sequence
    useEffect(() => {
        const sequence = async () => {
            // Reset state
            setSelectedText(false)
            setShowQuickAsk(false)
            setShowPanel(false)
            setMessages([])
            setIsTyping(false)

            // Wait a bit
            await new Promise((r) => setTimeout(r, 1000))

            // 1. Select text
            setSelectedText(true)
            await new Promise((r) => setTimeout(r, 600))

            // 2. Show QuickAsk button
            setShowQuickAsk(true)
            await new Promise((r) => setTimeout(r, 1000))

            // 3. Click button / Open panel
            setShowQuickAsk(false)
            setShowPanel(true)
            await new Promise((r) => setTimeout(r, 500))

            // 4. Add user message (context)
            setMessages([{ role: "user", content: "Explain the concept of 'Agentic AI' based on this text." }])
            await new Promise((r) => setTimeout(r, 800))

            // 5. AI typing
            setIsTyping(true)
            await new Promise((r) => setTimeout(r, 1500))

            // 6. AI response
            setIsTyping(false)
            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    content:
                        "Agentic AI refers to artificial intelligence systems that can autonomously pursue complex goals. Unlike passive AI that waits for prompts, agentic AI can plan, execute multi-step tasks, and adapt to changing environments to achieve an objective.",
                },
            ])

            // Loop after a delay
            await new Promise((r) => setTimeout(r, 5000))
            sequence()
        }

        sequence()
    }, [])

    return (
        <div className="relative w-full max-w-5xl mx-auto perspective-1000">
            <motion.div
                initial={{ opacity: 0, y: 20, rotateX: 5 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative bg-background rounded-xl border shadow-2xl overflow-hidden"
            >
                {/* Browser Toolbar */}
                <div className="bg-muted/50 border-b p-3 flex items-center gap-4">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex gap-2 text-muted-foreground">
                        <ArrowLeft className="w-4 h-4" />
                        <ArrowRight className="w-4 h-4" />
                        <RotateCw className="w-4 h-4" />
                    </div>
                    <div className="flex-1 bg-background border rounded-md px-3 py-1.5 text-xs text-muted-foreground flex items-center gap-2">
                        <Search className="w-3 h-3" />
                        <span>https://en.wikipedia.org/wiki/Artificial_intelligence</span>
                    </div>
                    <div className="flex gap-3 text-muted-foreground">
                        <Star className="w-4 h-4" />
                        <MoreVertical className="w-4 h-4" />
                    </div>
                </div>

                {/* Browser Content */}
                <div className="relative h-[600px] bg-white dark:bg-neutral-950 p-8 md:p-12 font-serif text-lg leading-relaxed text-foreground/80 overflow-hidden">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <h1 className="text-4xl font-bold text-foreground mb-8">The Rise of Agentic AI</h1>

                        <p>
                            Artificial intelligence has evolved significantly over the past decade. From simple rule-based systems to
                            generative models capable of creating art and code, the landscape is constantly shifting.
                        </p>

                        <div className="relative inline">
                            <span className={selectedText ? "bg-blue-200 dark:bg-blue-900/50 transition-colors duration-300" : ""}>
                                The next frontier is <strong className="font-semibold text-foreground">Agentic AI</strong>. These are systems designed not just to respond to
                                inputs, but to actively perceive their environment, reason about it, and take actions to achieve specific
                                goals.
                            </span>

                            {/* Floating QuickAsk Button */}
                            <AnimatePresence>
                                {showQuickAsk && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                        className="absolute -top-12 left-1/2 -translate-x-1/2 z-10"
                                    >
                                        <Button
                                            size="sm"
                                            className="rounded-full shadow-lg bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-600 hover:to-violet-600 gap-2 border-2 border-white"
                                        >
                                            <Sparkles className="w-3.5 h-3.5" />
                                            Ask AI
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <p>
                            Unlike traditional chatbots, agents can use tools, browse the web, and interact with software APIs. This
                            capability allows them to function as autonomous assistants, capable of handling complex workflows with
                            minimal human intervention.
                        </p>

                        <p>
                            For example, an agentic coding assistant could not only suggest code snippets but also run tests, debug
                            errors, and deploy applications. In the realm of research, an agent could synthesize information from
                            multiple sources to generate comprehensive reports.
                        </p>
                    </div>

                    {/* Side Panel */}
                    <AnimatePresence>
                        {showPanel && (
                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="absolute top-0 right-0 w-[350px] h-full bg-background border-l shadow-xl flex flex-col z-20 font-sans"
                            >
                                {/* Panel Header */}
                                <div className="p-3 border-b flex items-center justify-between bg-background">
                                    <div className="flex items-center gap-2 font-medium text-sm">
                                        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-muted-foreground"><path d="M12 2L14.5 9L22 12L14.5 15L12 22L9.5 15L2 12L9.5 9L12 2Z" /></svg>
                                        Quick Ask
                                    </div>
                                </div>

                                {/* Chat Area */}
                                <ScrollArea className="flex-1 p-4 bg-background">
                                    <div className="space-y-3">
                                        {messages.map((msg, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
                                            >
                                                <div
                                                    className={`px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === "user"
                                                        ? "bg-[#1a73e8] text-white rounded-[18px] rounded-br-sm"
                                                        : "bg-[#f1f3f4] dark:bg-muted text-[#202124] dark:text-foreground rounded-[18px] rounded-bl-sm"
                                                        }`}
                                                >
                                                    {msg.content}
                                                </div>
                                            </motion.div>
                                        ))}
                                        {isTyping && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="flex mr-auto items-start max-w-[85%]"
                                            >
                                                <div className="bg-[#f1f3f4] dark:bg-muted rounded-[18px] rounded-bl-sm px-3.5 py-2.5 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </ScrollArea>

                                {/* Quick Actions */}
                                <div className="px-4 py-2 border-t bg-background flex gap-2 overflow-x-auto no-scrollbar">
                                    {["Explain it", "Summarize", "Translate"].map((action) => (
                                        <button key={action} className="px-3 py-1.5 bg-muted/50 hover:bg-muted text-xs rounded-full border transition-colors whitespace-nowrap">
                                            {action}
                                        </button>
                                    ))}
                                </div>

                                {/* Input Area */}
                                <div className="p-4 bg-background">
                                    <div className="relative flex items-center gap-2 p-2 border rounded-[24px] bg-muted/30 focus-within:bg-background focus-within:border-[#1a73e8] focus-within:ring-1 focus-within:ring-[#1a73e8] transition-all">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-muted-foreground shrink-0">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                        </Button>
                                        <Input
                                            placeholder="Ask a follow-up..."
                                            className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 text-sm placeholder:text-muted-foreground/70"
                                        />
                                        <Button size="icon" className="h-8 w-8 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white shrink-0">
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}
