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
  return '<section class="footnotes">\n' +
         '<hr class="footnotes-sep">\n' +
         '<ol class="footnotes-list">\n';
};

export default {
  install: (app) => {
    app.config.globalProperties.$md = md;
    app.provide('markdown-it', md);
  },
  md
};
