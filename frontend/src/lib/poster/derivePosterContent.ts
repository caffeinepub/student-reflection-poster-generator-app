import type { Reflection, UserProfile } from '../../backend';

export function derivePosterContent(
  reflection: Reflection,
  userProfile: UserProfile | null | undefined
): { excerpt: string; attribution: string } {
  // Create a meaningful excerpt (first 200 chars or first 2 sentences)
  let excerpt = reflection.body;
  const sentences = reflection.body.match(/[^.!?]+[.!?]+/g) || [];
  
  if (sentences.length >= 2) {
    excerpt = sentences.slice(0, 2).join(' ').trim();
  } else if (reflection.body.length > 200) {
    excerpt = reflection.body.substring(0, 200).trim() + '...';
  }

  // Create attribution line
  const authorName = userProfile?.name || 'Student';
  const attribution = `— ${authorName}`;

  return { excerpt, attribution };
}
