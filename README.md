# Hafiz Samiullah — portfolio site

Static GitHub Pages portfolio for machine learning, computer vision, and applied research work. The homepage is an editorial case-study layout; the computer vision reports remain standalone HTML pages with a shared visual override.

## Site structure

- `index.html` — homepage; renders case studies, reports, project archive, publications, skills, and contact sections
- `_layouts/default.html` — shared document shell, navigation, skip link, footer, and script loading
- `assets/css/main.css` — homepage and layout design system
- `assets/css/report.css` — shared override for legacy computer vision report pages
- `assets/js/main.js` — navigation toggle, project filters, cursor focus lens, and fading ink trail
- `_data/` — editable content for projects, reports, case studies, skills, categories, and publications
- `computer-vision/` — full computer vision report pages
- `sample_page.md` — stock forecasting write-up

## Local preview

GitHub Pages builds the site automatically after a push.

If Jekyll is installed locally, run:

```bash
jekyll serve --baseurl ""
```

Then open `http://localhost:4000`.

## Adding content

- Add a project to `_data/projects.yml`.
- Add a report to `_data/reports.yml`.
- Add a major case study to `_data/case_studies.yml`.
- Add a publication to `_data/publications.yml`.
- Add a skill group to `_data/skills.yml`.

Project images belong in `images/`. Prefer local images over GitHub hotlinks so the site does not depend on third-party asset URLs.

## Cursor interaction

The cursor effect uses one fixed canvas and a section-local radial focus lens. It is disabled for touch pointers, coarse pointers, and users who prefer reduced motion. It never blocks clicks or keyboard navigation.

## Verification checklist

- All navigation links and section anchors resolve.
- Project filters update visible cards and announce the count.
- Images load from local paths.
- Mobile navigation opens, closes on selection, and closes with Escape.
- Keyboard focus is visible throughout.
- Reduced-motion and touch users see no cursor effect.
- Computer vision reports load `assets/css/report.css` and link back to the report index.
