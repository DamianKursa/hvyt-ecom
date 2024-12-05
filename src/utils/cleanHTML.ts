import DOMPurify from 'dompurify';

export const cleanHTML = (html: string): string => {
  // Step 1: Parse the HTML content into a DOM object
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Step 2: Check for plain text nodes (`#text`) outside of any tags
  doc.body.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      // Wrap plain text in a <p> tag
      const p = doc.createElement('p');
      p.textContent = node.textContent.trim();
      node.replaceWith(p);
    }
  });

  // Step 3: Serialize the DOM back into an HTML string
  const wrappedHtml = doc.body.innerHTML;

  // Step 4: Sanitize the HTML to ensure safety
  return DOMPurify.sanitize(wrappedHtml, { USE_PROFILES: { html: true } });
};
