import DOMPurify from 'dompurify';

export const cleanHTML = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  doc.body.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {

      const p = doc.createElement('p');
      p.textContent = node.textContent.trim();
      node.replaceWith(p);
    }
  });
  const wrappedHtml = doc.body.innerHTML;
  return DOMPurify.sanitize(wrappedHtml, { USE_PROFILES: { html: true } });
};
