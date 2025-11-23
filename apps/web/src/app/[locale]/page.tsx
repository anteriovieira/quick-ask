import { BrowserSimulation } from "@/components/browser-simulation"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Zap, Shield, MousePointerClick, Github, Chrome } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Logo from "@/assets/logo.png"
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Image src={Logo} alt="QuickAsk Logo" width={32} height={32} className="w-8 h-8" />
            QuickAsk
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">{t('Navigation.features')}</Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">{t('Navigation.howItWorks')}</Link>
            <Link href="https://github.com/anteriovieira/quick-ask" target="_blank" className="hover:text-foreground transition-colors">{t('Navigation.github')}</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="https://github.com/anteriovieira/quick-ask" target="_blank">
              <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                <Github className="w-4 h-4" />
                {t('Navigation.starOnGithub')}
              </Button>
            </Link>
            <Link href="https://chromewebstore.google.com/detail/donnhgglokpiabojgalipkkndhmngnnh" target="_blank">
              <Button size="sm" className="gap-2">
                <Chrome className="w-4 h-4" />
                {t('Navigation.addToChrome')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 overflow-hidden relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

          <div className="container mx-auto px-4 text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border text-xs font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              {t('Hero.version')}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              {t('Hero.title')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                {t('Hero.subtitle')}
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              {t('Hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="https://chromewebstore.google.com/detail/donnhgglokpiabojgalipkkndhmngnnh" target="_blank">
                <Button size="lg" className="h-12 px-8 text-base gap-2 rounded-full">
                  <Chrome className="w-5 h-5" />
                  {t('Hero.cta')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Browser Simulation */}
          <div id="how-it-works" className="container mx-auto px-4">
            <BrowserSimulation />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">{t('Features.title')}</h2>
              <p className="text-muted-foreground">
                {t('Features.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-background border-none shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                    <MousePointerClick className="w-6 h-6" />
                  </div>
                  <CardTitle>{t('Features.selectAndAsk.title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  {t('Features.selectAndAsk.description')}
                </CardContent>
              </Card>

              <Card className="bg-background border-none shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6" />
                  </div>
                  <CardTitle>{t('Features.lightningFast.title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  {t('Features.lightningFast.description')}
                </CardContent>
              </Card>

              <Card className="bg-background border-none shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6" />
                  </div>
                  <CardTitle>{t('Features.privateAndSecure.title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  {t('Features.privateAndSecure.description')}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-10" />
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('CTA.title')}</h2>
                <p className="text-primary-foreground/80 mb-8 text-lg">
                  {t('CTA.description')}
                </p>
                <Link href="https://chromewebstore.google.com/detail/donnhgglokpiabojgalipkkndhmngnnh" target="_blank">
                  <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full gap-2">
                    <Chrome className="w-5 h-5" />
                    {t('CTA.button')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted/50 py-12 border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <div className="text-sm text-muted-foreground">
            {t('Footer.copyright', { year: new Date().getFullYear() })}
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground">{t('Footer.privacy')}</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">{t('Footer.terms')}</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">{t('Footer.twitter')}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
