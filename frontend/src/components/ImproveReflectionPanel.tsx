import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle2 } from 'lucide-react';
import { improveReflection } from '../lib/reflection/improveReflection';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ImproveReflectionPanelProps {
  reflectionText: string;
  onApply: (improvedText: string) => void;
}

export default function ImproveReflectionPanel({ reflectionText, onApply }: ImproveReflectionPanelProps) {
  const suggestions = improveReflection(reflectionText);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRewrite, setSelectedRewrite] = useState('');

  const handleApplyClick = (rewrite: string) => {
    setSelectedRewrite(rewrite);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    onApply(selectedRewrite);
    setShowConfirm(false);
  };

  return (
    <>
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Reflection Improvement Suggestions
          </CardTitle>
          <CardDescription>AI-powered suggestions to enhance your reflection</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="clarity">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="clarity">Clarity</TabsTrigger>
              <TabsTrigger value="structure">Structure</TabsTrigger>
              <TabsTrigger value="tone">Tone</TabsTrigger>
            </TabsList>

            <TabsContent value="clarity" className="space-y-3">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{suggestions.clarity.tip}</AlertDescription>
              </Alert>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm mb-2 font-medium">Suggested rewrite:</p>
                <p className="text-sm text-muted-foreground">{suggestions.clarity.rewrite}</p>
              </div>
              <Button onClick={() => handleApplyClick(suggestions.clarity.rewrite)} variant="outline" size="sm">
                Apply This Version
              </Button>
            </TabsContent>

            <TabsContent value="structure" className="space-y-3">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{suggestions.structure.tip}</AlertDescription>
              </Alert>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm mb-2 font-medium">Suggested rewrite:</p>
                <p className="text-sm text-muted-foreground">{suggestions.structure.rewrite}</p>
              </div>
              <Button onClick={() => handleApplyClick(suggestions.structure.rewrite)} variant="outline" size="sm">
                Apply This Version
              </Button>
            </TabsContent>

            <TabsContent value="tone" className="space-y-3">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{suggestions.tone.tip}</AlertDescription>
              </Alert>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm mb-2 font-medium">Suggested rewrite:</p>
                <p className="text-sm text-muted-foreground">{suggestions.tone.rewrite}</p>
              </div>
              <Button onClick={() => handleApplyClick(suggestions.tone.rewrite)} variant="outline" size="sm">
                Apply This Version
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace reflection text?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace your current reflection body with the suggested version. You can always edit it further
              after applying.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Apply</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
