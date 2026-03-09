import { useState } from 'react';
import { Card } from '@/components/ui/card';
import type { Template } from '../backend';
import { Check, ImageOff } from 'lucide-react';

interface TemplateGalleryProps {
  templates: Template[];
  selectedTemplate: Template | null;
  onSelectTemplate: (template: Template) => void;
}

export default function TemplateGallery({ templates, selectedTemplate, onSelectTemplate }: TemplateGalleryProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (templateId: bigint) => {
    setFailedImages((prev) => new Set(prev).add(templateId.toString()));
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {templates.map((template) => {
        const hasImageError = failedImages.has(template.id.toString());

        return (
          <button
            key={Number(template.id)}
            onClick={() => onSelectTemplate(template)}
            className="relative group"
          >
            <Card
              className={`overflow-hidden transition-all ${
                selectedTemplate?.id === template.id
                  ? 'ring-2 ring-primary shadow-lg'
                  : 'hover:ring-2 hover:ring-muted-foreground/50'
              }`}
            >
              <div className="aspect-[4/5] relative bg-muted">
                {hasImageError ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                    <ImageOff className="h-12 w-12 mb-2" />
                    <span className="text-xs">Preview unavailable</span>
                  </div>
                ) : (
                  <img
                    src={template.previewImage}
                    alt={template.name}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(template.id)}
                  />
                )}
                {selectedTemplate?.id === template.id && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-primary text-primary-foreground rounded-full p-2">
                      <Check className="h-6 w-6" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-2 bg-card">
                <div className="text-sm font-medium text-center">{template.name}</div>
              </div>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
