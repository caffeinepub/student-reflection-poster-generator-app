import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface HashtagEditorProps {
  hashtags: string[];
  onHashtagsChange: (hashtags: string[]) => void;
}

export default function HashtagEditor({ hashtags, onHashtagsChange }: HashtagEditorProps) {
  const [newHashtag, setNewHashtag] = useState('');

  const handleAdd = () => {
    const tag = newHashtag.trim().replace(/^#/, '');
    if (tag && !hashtags.includes(tag)) {
      onHashtagsChange([...hashtags, tag]);
      setNewHashtag('');
    }
  };

  const handleRemove = (tag: string) => {
    onHashtagsChange(hashtags.filter((h) => h !== tag));
  };

  return (
    <div className="space-y-3">
      <Label>Hashtags</Label>
      <div className="flex gap-2">
        <Input
          placeholder="Add hashtag (without #)"
          value={newHashtag}
          onChange={(e) => setNewHashtag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button onClick={handleAdd} size="icon" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {hashtags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1">
            #{tag}
            <button onClick={() => handleRemove(tag)} className="hover:text-destructive">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
