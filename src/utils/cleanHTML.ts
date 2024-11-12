import DOMPurify from 'dompurify';

export const cleanHTML = (html: string): string => {
  // Step 1: Replace double line breaks with paragraphs
  const withParagraphs = html
    .split('\n\n')
    .map((line) => `${line.trim().replace(/\n/g, '<br>')}`) // Step 2: Replace single line breaks within each paragraph
    .join('');

  // Sanitize the HTML to ensure safety
  return DOMPurify.sanitize(withParagraphs, { USE_PROFILES: { html: true } });
};
