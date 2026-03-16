import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { type ReactNode, useState } from "react";
import { SiLinkedin } from "react-icons/si";
import TopNav from "./TopNav";
import TroubleOpeningHelpDialog from "./TroubleOpeningHelpDialog";

type Page = "reflections" | "generator" | "portfolio";

interface AppLayoutProps {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function AppLayout({
  children,
  currentPage,
  onNavigate,
}: AppLayoutProps) {
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/logo-mark.dim_512x512.png"
                alt="ReflectPoster"
                className="h-10 w-10"
              />
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  ReflectPoster
                </h1>
                <p className="text-xs text-muted-foreground">
                  Academic Reflection & Poster Generator
                </p>
              </div>
            </div>
            <TopNav currentPage={currentPage} onNavigate={onNavigate} />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Built with</span>
              <span className="text-destructive">♥</span>
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <SiLinkedin className="h-4 w-4" />
                <span>Share your reflections on LinkedIn</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHelpDialogOpen(true)}
                className="gap-1 h-auto py-1 px-2"
              >
                <HelpCircle className="h-3 w-3" />
                <span className="text-xs">Trouble opening the app?</span>
              </Button>
            </div>
            <div className="text-xs">
              © {new Date().getFullYear()} ReflectPoster
            </div>
          </div>
        </div>
      </footer>

      <TroubleOpeningHelpDialog
        open={helpDialogOpen}
        onOpenChange={setHelpDialogOpen}
      />
    </div>
  );
}
