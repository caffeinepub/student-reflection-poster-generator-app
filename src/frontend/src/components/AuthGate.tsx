import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Check,
  Copy,
  FolderOpen,
  HelpCircle,
  Shield,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import TroubleOpeningHelpDialog from "./TroubleOpeningHelpDialog";

export default function AuthGate() {
  const { login, loginStatus } = useInternetIdentity();
  const [copied, setCopied] = useState(false);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: unknown) {
      console.error("Login error:", error);
    }
  };

  const handleCopyLink = async () => {
    const appUrl = window.location.origin;
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      toast.success("App link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (_error) {
      toast.error(
        "Failed to copy link. Please select and copy the URL manually.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src="/assets/generated/logo-mark.dim_512x512.png"
              alt="ReflectPoster"
              className="h-20 w-20"
            />
          </div>
          <CardTitle className="text-3xl font-bold">
            Welcome to ReflectPoster
          </CardTitle>
          <CardDescription className="text-base">
            Create beautiful academic posters from your reflections and share
            them on LinkedIn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
              <BookOpen className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Write Reflections</h3>
              <p className="text-xs text-muted-foreground">
                Capture your learning journey
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
              <Sparkles className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Generate Posters</h3>
              <p className="text-xs text-muted-foreground">
                Choose from academic templates
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
              <FolderOpen className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Build Portfolio</h3>
              <p className="text-xs text-muted-foreground">
                Showcase your work
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleLogin}
              disabled={loginStatus === "logging-in"}
              className="w-full h-12 text-base"
              size="lg"
            >
              {loginStatus === "logging-in"
                ? "Connecting..."
                : "Sign In to Get Started"}
            </Button>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              <span>Secure authentication with Internet Identity</span>
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-medium text-foreground">
                  Share this app:
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
              <div className="text-xs text-muted-foreground break-all select-all bg-background/50 p-2 rounded border border-border">
                {window.location.origin}
              </div>
            </div>

            <TroubleOpeningHelpDialog
              trigger={
                <Button variant="ghost" size="sm" className="w-full gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Trouble opening the app?
                </Button>
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
