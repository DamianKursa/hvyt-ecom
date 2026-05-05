export function renderSafeHtml(html: string): string {
  // Zamień np. class="w-[340px]" na style="width:340px"
  return html.replace(
    /class="([^"]*)"/g,
    (match, classes) => {
      const styleMap = parseTailwindArbitrary(classes);
      const remaining = removeArbitraryClasses(classes);
      return `class="${remaining}" style="${styleMap}"`;
    }
  );
}

function parseTailwindArbitrary(classes: string): string {
  const styles: string[] = [];
  const rules: [RegExp, string][] = [
    [/w-\[([^\]]+)\]/, 'width'],
    [/h-\[([^\]]+)\]/, 'height'],
    [/min-w-\[([^\]]+)\]/, 'min-width'],
    [/max-w-\[([^\]]+)\]/, 'max-width'],
    [/min-h-\[([^\]]+)\]/, 'min-height'],
    [/max-h-\[([^\]]+)\]/, 'max-height'],
    [/p-\[([^\]]+)\]/, 'padding'],
    [/px-\[([^\]]+)\]/, 'padding-left:$1;padding-right'],
    [/py-\[([^\]]+)\]/, 'padding-top:$1;padding-bottom'],
    [/m-\[([^\]]+)\]/, 'margin'],
    [/mx-\[([^\]]+)\]/, 'margin-left:$1;margin-right'],
    [/my-\[([^\]]+)\]/, 'margin-top:$1;margin-bottom'],
    [/text-\[([^\]]+)\]/, 'font-size'],
    [/top-\[([^\]]+)\]/, 'top'],
    [/left-\[([^\]]+)\]/, 'left'],
    [/right-\[([^\]]+)\]/, 'right'],
    [/bottom-\[([^\]]+)\]/, 'bottom'],
    [/gap-\[([^\]]+)\]/, 'gap'],
    [/rounded-\[([^\]]+)\]/, 'border-radius'],
  ];

  for (const [regex, prop] of rules) {
    const m = classes.match(regex);
    if (m) styles.push(`${prop}:${m[1]}`);
  }

  return styles.join(';');
}

function removeArbitraryClasses(classes: string): string {
  return classes.replace(/\S+\[[^\]]+\]/g, '').replace(/\s+/g, ' ').trim();
}