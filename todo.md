# Todo

- [ ] Auto-generate nav bar from `site.pages` in `_layouts/default.html`
  - Replace hardcoded `<ul class="nav-links">` with a Liquid loop
  - Use `nav_order` front matter to control page order
  - Use `nav_exclude: true` front matter to hide pages (e.g. 404)
  - Handle external links (e.g. Resume) separately — hardcode or use a `nav_external_url` front matter field
