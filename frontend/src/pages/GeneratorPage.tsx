import { useState, useEffect } from 'react';
import { useGetReflections } from '../hooks/queries/useReflections';
import { useGetTemplates } from '../hooks/queries/useTemplates';
import { useGeneratePoster } from '../hooks/queries/usePortfolio';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Download, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { Reflection, Template } from '../backend';
import TemplateGallery from '../components/TemplateGallery';
import PosterPreview from '../components/PosterPreview';
import HashtagEditor from '../components/HashtagEditor';
import LinkedInSharePanel from '../components/LinkedInSharePanel';
import { downloadPosterPng } from '../lib/poster/downloadPosterPng';
import { generateHashtags } from '../lib/hashtags/generateHashtags';

export default function GeneratorPage() {
  const { data: reflections = [] } = useGetReflections();
  const { data: templates = [] } = useGetTemplates();
  const generatePoster = useGeneratePoster();

  const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  useEffect(() => {
    if (templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates[0]);
    }
  }, [templates, selectedTemplate]);

  const handleGenerate = () => {
    if (!selectedReflection) {
      toast.error('Please select a reflection');
      return;
    }
    if (!selectedTemplate) {
      toast.error('Please select a template');
      return;
    }

    const generatedHashtags = generateHashtags(selectedReflection.title + ' ' + selectedReflection.body);
    setHashtags(generatedHashtags);
    setIsGenerated(true);
    toast.success('Poster generated!');
  };

  const handleDownload = async () => {
    if (!selectedReflection || !selectedTemplate) return;
    try {
      await downloadPosterPng(selectedReflection, selectedTemplate);
      toast.success('Poster downloaded!');
    } catch (error) {
      toast.error('Failed to download poster');
      console.error(error);
    }
  };

  const handleSaveToPortfolio = async () => {
    if (!selectedReflection || !selectedTemplate) return;
    try {
      await generatePoster.mutateAsync({
        reflection: selectedReflection,
        templateId: selectedTemplate.id,
        hashtags,
      });
      toast.success('Saved to portfolio!');
    } catch (error) {
      toast.error('Failed to save to portfolio');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Reflection</CardTitle>
            <CardDescription>Choose a reflection to turn into a poster</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Reflection</Label>
              <Select
                value={selectedReflection?.title || ''}
                onValueChange={(title) => {
                  const reflection = reflections.find((r) => r.title === title);
                  setSelectedReflection(reflection || null);
                  setIsGenerated(false);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a reflection..." />
                </SelectTrigger>
                <SelectContent>
                  {reflections.map((reflection, idx) => (
                    <SelectItem key={idx} value={reflection.title}>
                      {reflection.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedReflection && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground line-clamp-4">{selectedReflection.body}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Template</CardTitle>
            <CardDescription>Choose a design for your poster</CardDescription>
          </CardHeader>
          <CardContent>
            <TemplateGallery
              templates={templates}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={(template) => {
                setSelectedTemplate(template);
                setIsGenerated(false);
              }}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Generate Poster</CardTitle>
              <CardDescription>Create your shareable poster</CardDescription>
            </div>
            <Button onClick={handleGenerate} disabled={!selectedReflection || !selectedTemplate}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </div>
        </CardHeader>
        {isGenerated && selectedReflection && selectedTemplate && (
          <CardContent className="space-y-6">
            <PosterPreview reflection={selectedReflection} template={selectedTemplate} />

            <Separator />

            <HashtagEditor hashtags={hashtags} onHashtagsChange={setHashtags} />

            <Separator />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleDownload} variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </Button>
              <Button onClick={handleSaveToPortfolio} disabled={generatePoster.isPending} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {generatePoster.isPending ? 'Saving...' : 'Save to Portfolio'}
              </Button>
            </div>

            <LinkedInSharePanel reflection={selectedReflection} hashtags={hashtags} />
          </CardContent>
        )}
      </Card>
    </div>
  );
}
