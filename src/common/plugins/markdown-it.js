import MarkdownIt from 'markdown-it';
import footnote from 'markdown-it-footnote';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
}).use(footnote);

// Customize footnote rendering if needed
md.renderer.rules.footnote_block_open = () => {
  return (
    '<section class="footnotes">\n' +
    '<hr class="footnotes-sep">\n' +
    '<ol class="footnotes-list">\n'
  );
};

// Override: ảnh → link
md.renderer.rules.image = (tokens, idx) => {
  const token = tokens[idx];
  const src = token.attrGet('src');
  const alt = token.content;
  const title = token.attrGet('title');
  return `<a href="${src}" target="_blank" rel="noopener noreferrer">
    <img src="${src}" alt="${alt || 'Image'}" title="${title || 'Click để xem ảnh full size'}" style="cursor:pointer;" />
  </a>`;
};

// Override: footnote_ref → citation button
md.renderer.rules.footnote_ref = (tokens, idx) => {
  const id = tokens[idx].meta.id + 1;
  const label = tokens[idx].meta.label;
  const caption = tokens[idx].meta.subId > 0 ? `${id}:${tokens[idx].meta.subId}` : `${id}`;
  return `<a id="fnref${caption}" href="#fn${label}" data-label="${label}"
    style="border-radius:9999px;color:#fff!important;background-color:#A4A7AE;border-color:#A4A7AE;"
    class="btn btn-secondary py-0 btn-sm ml-1 citation-link">Nguồn</a>`;
};

export default {
  install: (app) => {
    app.config.globalProperties.$md = md;
    app.provide('markdown-it', md);
  },
  md
};
