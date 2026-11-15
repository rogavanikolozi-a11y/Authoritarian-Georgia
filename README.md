# Between Brussels and Moscow: research website

A visual summary of Nikoloz Rogava's MA thesis (University of Tartu, 2026), in English and Georgian.

- English: https://rogavanikolozi-a11y.github.io/Authoritarian-Georgia/
- Georgian: https://rogavanikolozi-a11y.github.io/Authoritarian-Georgia/ka/

Plain HTML, CSS and JavaScript. No build step: edit a file, push to `main`, and GitHub Pages
publishes it in a few minutes.

## Files

| File | What it holds |
| --- | --- |
| `index.html` | English page: all chapter text |
| `ka/index.html` | Georgian page: all chapter text, Georgian font settings and the dark-mode switch |
| `data.js` | English text for the diagrams: timeline, checkpoints, matrix, law table, experts, playbook, CV, contact |
| `ka/data-ka.js` | Georgian text for the same diagrams, plus Georgian button and label text (`D.ui`) |
| `main.js` | Draws the maps and diagrams and runs scrolling and the theme switch. Shared by both pages |
| `styles.css` | Design. Colours are under "Tokens" at the top; dark-mode colours sit right below |
| `404.html` | "Page not found" page |
| `data/corpus.csv` | The 386 statements analysed (ID, speaker, date, Radio Tavisupleba link), from Appendix 1 of the thesis |
| `sitemap.xml` | List of pages for Google |
| `googlee7d4478635277d5d.html` | Google Search Console verification. **Do not delete** |
| `images/` | `portrait.jpg`, `photo-2.jpg`, `preview-swiss.png` (link preview image) |
| `fonts/` | Newsreader, IBM Plex, Noto Serif Georgian, BPG Typewriter A (Georgian page) |
| `assets/` | `thesis.pdf`, `geo.js` (map shapes, Natural Earth) |
| `vendor/` | D3 v7 and topojson-client |

## Common edits

- **Change English chapter text:** edit `index.html`.
- **Change Georgian chapter text:** edit `ka/index.html`.
- **Change text inside a diagram:** English in `data.js`, Georgian in `ka/data-ka.js`.
  The Georgian file replaces words only; numbers such as needle positions and map coordinates
  stay in `data.js`.
- **Add or remove a CV entry:** English in `data.js` (`cv:`). Georgian is written directly in
  `ka/index.html` under "გამოცდილება და განათლება".
- **Change colours:** the "Tokens" section at the top of `styles.css`.

Map labels (country and city names) are intentionally in English on both pages.

**After changing `styles.css`, `main.js`, `data.js` or `ka/data-ka.js`:** change the version number
in the links to those files (`?v=20261116e`) in both `index.html` and `ka/index.html`, for example
to `?v=20261201`. Otherwise browsers may keep showing the old saved version.

## Notes

- The email address is stored backwards in two parts (`emailParts` in `data.js`, and in a small
  script at the bottom of `ka/index.html`) so spam bots can't read it. The page puts it back together.
- The Georgian translation was made with AI help; the page says so at the top.
- The link preview image is `images/preview-swiss.png`. If you replace it, give it a new file name
  and update the `og:image` and `twitter:image` lines in both pages. Apps such as Instagram and
  Facebook keep old previews otherwise.

## Viewing locally

Run `python3 -m http.server` in this folder and open http://localhost:8000.
(Opening `index.html` directly also works.)
