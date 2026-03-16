import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, Save, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Reflection } from "../backend";
import ImproveReflectionPanel from "../components/ImproveReflectionPanel";
import {
  useGetReflections,
  useSaveReflection,
  useUpdateReflection,
} from "../hooks/queries/useReflections";
import { clearDraft, loadDraft, saveDraft } from "../lib/reflectionDraftStore";

export default function ReflectionEditorPage() {
  const { data: reflections = [], isLoading } = useGetReflections();
  const saveReflection = useSaveReflection();
  const updateReflection = useUpdateReflection();

  const [selectedReflection, setSelectedReflection] =
    useState<Reflection | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showImprove, setShowImprove] = useState(false);

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft && !selectedReflection) {
      setTitle(draft.title);
      setBody(draft.body);
    }
  }, [selectedReflection]);

  // Save draft on changes
  useEffect(() => {
    if (title || body) {
      saveDraft({ title, body });
    }
  }, [title, body]);

  const handleNew = () => {
    setSelectedReflection(null);
    setTitle("");
    setBody("");
    setIsEditing(false);
    clearDraft();
  };

  const handleSelect = (reflection: Reflection) => {
    setSelectedReflection(reflection);
    setTitle(reflection.title);
    setBody(reflection.body);
    setIsEditing(true);
    clearDraft();
  };

  const handleSave = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error("Please fill in both title and body");
      return;
    }

    try {
      if (isEditing && selectedReflection) {
        await updateReflection.mutateAsync({
          title: title.trim(),
          body: body.trim(),
          timestamp: selectedReflection.timestamp,
        });
        toast.success("Reflection updated!");
      } else {
        await saveReflection.mutateAsync({
          title: title.trim(),
          body: body.trim(),
          timestamp: BigInt(Date.now()) * BigInt(1_000_000),
        });
        toast.success("Reflection saved!");
      }
      clearDraft();
      handleNew();
    } catch (error) {
      toast.error("Failed to save reflection");
      console.error(error);
    }
  };

  const handleApplyImprovement = (improvedText: string) => {
    setBody(improvedText);
    setShowImprove(false);
    toast.success("Improvement applied!");
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Your Reflections</CardTitle>
            <Button size="sm" variant="outline" onClick={handleNew}>
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
          <CardDescription>
            Select a reflection to edit or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : reflections.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-8">
                No reflections yet. Create your first one!
              </div>
            ) : (
              <div className="space-y-2">
                {reflections.map((reflection) => (
                  <button
                    type="button"
                    key={reflection.title}
                    onClick={() => handleSelect(reflection)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedReflection?.title === reflection.title
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card hover:bg-muted border-border"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {reflection.title}
                        </div>
                        <div className="text-xs opacity-75 truncate mt-1">
                          {reflection.body.substring(0, 60)}...
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit Reflection" : "New Reflection"}
          </CardTitle>
          <CardDescription>
            Write your thoughts and learning experiences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Learning React Hooks"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Reflection</Label>
            <Textarea
              id="body"
              placeholder="Share what you learned, challenges you faced, and insights you gained..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="resize-none"
            />
            <div className="text-xs text-muted-foreground text-right">
              {body.length} characters
            </div>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSave}
              disabled={saveReflection.isPending || updateReflection.isPending}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {saveReflection.isPending || updateReflection.isPending
                ? "Saving..."
                : "Save Reflection"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowImprove(!showImprove)}
              disabled={!body.trim()}
              className="flex-1"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {showImprove ? "Hide Suggestions" : "Improve Reflection"}
            </Button>
          </div>

          {showImprove && body.trim() && (
            <ImproveReflectionPanel
              reflectionText={body}
              onApply={handleApplyImprovement}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
