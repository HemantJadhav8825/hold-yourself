'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
// Switch is missing, using checkbox
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { X } from 'lucide-react';

/**
 * HOLDING SPACE RULE:
 * Never render engagement counts.
 * Never introduce ranking UI.
 * Never introduce trending or popularity surfaces.
 */

export const ShareComposer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'followers'>('public');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleFocus = () => setIsExpanded(true);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const canPost = content.trim().length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-card rounded-lg border shadow-sm transition-all duration-300">
      <div className="relative">
        <Textarea
          placeholder="Share something (if it feels right)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={handleFocus}
          className={`resize-none min-h-[40px] transition-all duration-300 ${isExpanded ? 'min-h-[120px]' : ''}`}
        />
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
          {/* Tags Input */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
            {tags.length < 5 && (
              <input
                type="text"
                placeholder="Add sensitivity tags (optional, press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="text-sm w-full bg-transparent border-b border-muted focus:outline-none focus:border-primary py-1"
              />
            )}
            <p className="text-xs text-muted-foreground">Max 5 tags. Used for sensitivity blurring.</p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-4">
              {/* Visibility Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">Visibility:</span>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as 'public' | 'followers')}
                  className="text-xs bg-background border rounded px-2 py-1"
                >
                  <option value="public">Public</option>
                  <option value="followers">Followers</option>
                </select>
              </div>

              {/* Anonymous Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous-mode"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                />
                <Label htmlFor="anonymous-mode" className="text-xs cursor-pointer">
                  Wait incognito
                </Label>
              </div>
            </div>

            <Button disabled={!canPost} size="sm">
              Post
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
