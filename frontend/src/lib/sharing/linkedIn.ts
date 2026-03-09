import type { Reflection } from '../../backend';

export function preparePostText(reflection: Reflection, hashtags: string[]): string {
  const hashtagString = hashtags.map((tag) => `#${tag}`).join(' ');
  
  return `${reflection.title}

${reflection.body}

${hashtagString}`;
}

export function openLinkedInShare(): void {
  // Open LinkedIn's share page in a new tab
  // Users will need to manually paste the text and upload the image
  const linkedInUrl = 'https://www.linkedin.com/feed/';
  window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
}
