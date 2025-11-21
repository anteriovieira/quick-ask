import { Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        QuickAsk
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 py-12 md:py-20">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                        <p className="text-lg text-muted-foreground">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                            <p className="text-muted-foreground">
                                QuickAsk ("we", "our", or "us") is committed to protecting your privacy.
                                This Privacy Policy explains how our Chrome Extension and services handle your data.
                                Our core principle is simple: <strong>We do not collect, store, or share your personal data.</strong>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Data Collection & Usage</h2>

                            <h3 className="text-xl font-medium mb-2 mt-6">1. API Keys</h3>
                            <p className="text-muted-foreground">
                                Your OpenAI API key is stored locally on your device using Chrome's Sync Storage API.
                                It is never sent to our servers. It is only used to authenticate requests directly from your browser to OpenAI's API.
                            </p>

                            <h3 className="text-xl font-medium mb-2 mt-6">2. Text Selection</h3>
                            <p className="text-muted-foreground">
                                When you use QuickAsk to query selected text, that text is sent directly to OpenAI's API to generate a response.
                                We do not see, log, or store this text.
                            </p>

                            <h3 className="text-xl font-medium mb-2 mt-6">3. Chat History</h3>
                            <p className="text-muted-foreground">
                                Your chat history is stored locally in your browser's memory while the extension is open.
                                We do not persist your chat history on any servers.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Permissions</h2>
                            <p className="text-muted-foreground mb-4">
                                We request the minimum permissions necessary for QuickAsk to function:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li><strong>ActiveTab:</strong> To open the side panel and interact with the text you selected on the current page.</li>
                                <li><strong>SidePanel:</strong> To display the chat interface.</li>
                                <li><strong>Storage:</strong> To save your settings (API key, system prompt) locally.</li>
                                <li><strong>Host Permissions:</strong> To communicate with OpenAI's API (api.openai.com).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
                            <p className="text-muted-foreground">
                                QuickAsk uses OpenAI's API to generate responses. Please refer to <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI's Privacy Policy</a> for information on how they handle API data.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                            <p className="text-muted-foreground">
                                If you have any questions about this Privacy Policy, please contact us via our GitHub repository.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="bg-muted/50 py-12 border-t">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
                            <Sparkles className="w-3 h-3" />
                        </div>
                        QuickAsk
                    </div>
                    <div className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} QuickAsk. Open Source under MIT License.
                    </div>
                </div>
            </footer>
        </div>
    )
}
