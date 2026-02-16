'use client';

import React, { useState } from 'react';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Aura } from '@/components/ui/Aura';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Lock, Shield, Loader2, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useRef, useEffect } from 'react';

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (content: string, visibility: string, isAnonymous: boolean, tags: string[]) => void;
}

const VISIBILITY_OPTIONS = [
  { id: 'community', label: 'Community', icon: Globe, description: 'Shared with the world.' },
  { id: 'circles', label: 'Circles', icon: Shield, description: 'Visible to your safe spaces.' },
  { id: 'private', label: 'Private', icon: Lock, description: 'Only for your eyes.' },
];

export const CreatePost: React.FC<CreatePostProps> = ({ isOpen, onClose, onPost }) => {
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('community');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [sensitivityTags, setSensitivityTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isHeld, setIsHeld] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submissionIdRef = useRef<number>(0);

  const handlePost = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const currentId = ++submissionIdRef.current;

    try {
      await onPost(content, visibility, isAnonymous, sensitivityTags);

      // Success state
      setIsHeld(true);
      setContent('');
      setSensitivityTags([]);

      setTimeout(() => {
        if (submissionIdRef.current === currentId) {
          setIsHeld(false);
        }
      }, 2000);
    } catch (error) {
      console.error('Failed to release reflection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !sensitivityTags.includes(newTag) && sensitivityTags.length < 5) {
        setSensitivityTags([...sensitivityTags, newTag]);
        setTagInput('');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-text/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          className="relative bg-background w-full max-w-lg rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-6 border-b border-text/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <Heading level={6}>Share a Reflection</Heading>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-text/5 rounded-full transition-colors">
              <X className="w-6 h-6 text-text/40" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Text weight="semibold">Identify as</Text>
                <button
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300",
                    isAnonymous ? "bg-primary/5 border-primary/20 text-primary" : "border-text/10 text-text/40"
                  )}
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-bold uppercase tracking-wider">
                    {isAnonymous ? "Anonymous Soul" : "Public Profile"}
                  </span>
                </button>
              </div>

            </div>

            <div
              className={cn(
                "p-4 border bg-neutral-50/50 rounded-2xl transition-all duration-500",
                isFocused ? "border-neutral-400 bg-background" : "border-neutral-200"
              )}
            >
              <textarea
                autoFocus
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="You can drop something here safely…"
                className={cn(
                  "w-full bg-transparent p-2 text-base font-sans leading-[1.6] focus:outline-none transition-all duration-500 resize-none",
                  isFocused ? "min-h-[120px]" : "min-h-[60px]"
                )}
              />

              <AnimatePresence>
                {content.length >= 15 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-text/5 space-y-3"
                  >
                    <div className="flex flex-wrap gap-2">
                      {sensitivityTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1 bg-primary/5 text-primary border-primary/10">
                          #{tag}
                          <button onClick={() => setSensitivityTags(sensitivityTags.filter(t => t !== tag))} className="ml-1 hover:text-destructive">
                            <X size={10} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    {sensitivityTags.length < 5 && (
                      <div className="flex items-center gap-2 group">
                        <Tag className="w-3 h-3 text-text/30 group-focus-within:text-primary transition-colors" />
                        <input
                          type="text"
                          placeholder="Add a feeling (optional)"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                          className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-text/20"
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              <Text weight="semibold">Visible to</Text>
              <div className="grid grid-cols-3 gap-3">
                {VISIBILITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setVisibility(opt.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300",
                      visibility === opt.id ? "bg-primary border-primary text-white" : "border-text/5 text-text/40 hover:border-primary/20"
                    )}
                  >
                    <opt.icon className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 bg-primary/5 flex flex-col gap-3">
            <Button
              fullWidth
              size="lg"
              disabled={!content.trim() || isSubmitting}
              onClick={handlePost}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Releasing...
                </>
              ) : (
                'Release'
              )}
            </Button>

            <AnimatePresence>
              {isHeld && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center"
                >
                  <Text size="xs" className="text-primary italic font-medium">Held.</Text>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
