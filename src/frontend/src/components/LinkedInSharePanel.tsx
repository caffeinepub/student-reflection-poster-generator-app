import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { SiLinkedin } from "react-icons/si";
import { toast } from "sonner";
import type { Reflection } from "../backend";
import { openLinkedInShare, preparePostText } from "../lib/sharing/linkedIn";

interface LinkedInSharePanelProps {
  reflection: Reflection;
  hashtags: string[];
}

export default function LinkedInSharePanel({
  reflection,
  hashtags,
}: LinkedInSharePanelProps) {
  const postText = preparePostText(reflection, hashtags);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postText);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (_error) {
      toast.error("Failed to copy");
    }
  };

  const handleShare = () => {
    openLinkedInShare();
    toast.info(
      "Opening LinkedIn... Remember to upload your downloaded poster image!",
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SiLinkedin className="h-5 w-5" />
          Share to LinkedIn
        </CardTitle>
        <CardDescription>
          Copy the post text and upload your poster image on LinkedIn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Post Text</Label>
          <Textarea
            value={postText}
            readOnly
            rows={6}
            className="resize-none"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleCopy} variant="outline" className="flex-1">
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Copied!" : "Copy Text"}
          </Button>
          <Button onClick={handleShare} className="flex-1">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open LinkedIn
          </Button>
        </div>
        <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
          <strong>How to share:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Click "Copy Text" to copy the post content</li>
            <li>Click "Open LinkedIn" to open LinkedIn in a new tab</li>
            <li>Paste the text and upload your downloaded poster image</li>
            <li>Click "Post" to share with your network!</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
