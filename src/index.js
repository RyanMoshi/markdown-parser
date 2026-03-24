'use strict';
// Parse and transform markdown — extract headings, links, code blocks

function parseHeadings(md) {
  return md.split('
')
    .filter((l) => /^#{1,6}s/.test(l))
    .map((l) => {
      const match = l.match(/^(#{1,6})s+(.*)/);
      return { level: match[1].length, text: match[2].trim() };
    });
}

function parseLinks(md) {
  const re = /[([^]]+)](([^)]+))/g;
  const links = [];
  let m;
  while ((m = re.exec(md)) !== null) links.push({ text: m[1], href: m[2] });
  return links;
}

function parseCodeBlocks(md) {
  const re = /```(w*)
([sS]*?)```/g;
  const blocks = [];
  let m;
  while ((m = re.exec(md)) !== null) blocks.push({ lang: m[1] || 'text', code: m[2] });
  return blocks;
}

function stripMarkdown(md) {
  return md
    .replace(/```[sS]*?```/g, '')
    .replace(/^#{1,6}s+/gm, '')
    .replace(/[([^]]+)]([^)]+)/g, '$1')
    .replace(/[*_~`]/g, '')
    .replace(/^s*[-*+]s+/gm, '')
    .trim();
}

function tableOfContents(md) {
  return parseHeadings(md).map((h) => {
    const indent = '  '.repeat(h.level - 1);
    const anchor = h.text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return indent + '- [' + h.text + '](#' + anchor + ')';
  }).join('
');
}

module.exports = { parseHeadings, parseLinks, parseCodeBlocks, stripMarkdown, tableOfContents };
