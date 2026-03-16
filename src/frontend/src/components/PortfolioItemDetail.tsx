import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Copy, Download, X } from "lucide-react";
import { toast } from "sonner";
import type { PortfolioItem } from "../backend";
import { downloadPosterPng } from "../lib/poster/downloadPosterPng";
import { preparePostText } from "../lib/sharing/linkedIn";
import PosterPreview from "./PosterPreview";

interface PortfolioItemDetailProps {
  item: PortfolioItem;
  onClose: () => void;
}

export default function PortfolioItemDetail({
  item,
  onClose,
}: PortfolioItemDetailProps) {
  const postText = preparePostText(item.reflection, item.hashtags);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postText);
      toast.success("Copied to clipboard!");
    } catch (_error) {
      toast.error("Failed to copy");
    }
  };

  const handleDownload = async () => {
    try {
      await downloadPosterPng(item.reflection, item.template);
      toast.success("Poster downloaded!");
    } catch (error) {
      toast.error("Failed to download poster");
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle>{item.reflection.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              {new Date(
                Number(item.postTimestamp) / 1_000_000,
              ).toLocaleDateString()}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <PosterPreview reflection={item.reflection} template={item.template} />

        <Separator />

        <div className="space-y-2">
          <div className="text-sm font-medium">Template</div>
          <div className="text-sm text-muted-foreground">
            {item.template.name}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Hashtags</div>
          <div className="flex flex-wrap gap-2">
            {item.hashtags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-sm font-medium">Post Text</div>
          <div className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap">
            {postText}
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleCopy} variant="outline" className="flex-1">
            <Copy className="h-4 w-4 mr-2" />
            Copy Text
          </Button>
          <Button onClick={handleDownload} variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
