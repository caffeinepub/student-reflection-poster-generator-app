import { Button } from "@/components/ui/button";
import { BookOpen, FolderOpen, Sparkles } from "lucide-react";
import LoginButton from "./LoginButton";

type Page = "reflections" | "generator" | "portfolio";

interface TopNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function TopNav({ currentPage, onNavigate }: TopNavProps) {
  return (
    <nav className="flex items-center gap-2">
      <Button
        variant={currentPage === "reflections" ? "default" : "ghost"}
        size="sm"
        onClick={() => onNavigate("reflections")}
        className="gap-2"
      >
        <BookOpen className="h-4 w-4" />
        <span className="hidden sm:inline">Reflections</span>
      </Button>
      <Button
        variant={currentPage === "generator" ? "default" : "ghost"}
        size="sm"
        onClick={() => onNavigate("generator")}
        className="gap-2"
      >
        <Sparkles className="h-4 w-4" />
        <span className="hidden sm:inline">Generator</span>
      </Button>
      <Button
        variant={currentPage === "portfolio" ? "default" : "ghost"}
        size="sm"
        onClick={() => onNavigate("portfolio")}
        className="gap-2"
      >
        <FolderOpen className="h-4 w-4" />
        <span className="hidden sm:inline">Portfolio</span>
      </Button>
      <div className="ml-2 pl-2 border-l border-border">
        <LoginButton />
      </div>
    </nav>
  );
}
