# Between Brussels and Moscow: research website

Plain HTML, CSS and JavaScript. No build step.

## Files

- `index.html`  page structure and all chapter prose
- `styles.css`  design (colours and fonts are set at the top, under "Tokens")
- `data.js`     editable content: timeline, checkpoints, matrix, experts, CV, contact
- `main.js`     diagrams, maps and scroll behaviour
- `assets/thesis.pdf`  the thesis (personal ID code on the licence page redacted)
- `assets/geo.js`      map geometry (Natural Earth; Crimea assigned to Ukraine)
- `images/`     portrait.jpg, photo-2.jpg, og-card.png
- `fonts/`, `vendor/`  self-hosted fonts, D3 v7 and topojson-client

## Editing text

Chapter paragraphs are in `index.html`. Everything that repeats (checkpoints, expert
cards, CV entries, the matrix, map notes, needle positions) is in `data.js`.

## Publishing

GitHub Pages: push this folder to a repository, then Settings > Pages > deploy from branch.
Netlify: drag the folder onto the Netlify dashboard.

After the site has an address, open `index.html`, search for `SITE-URL` and replace the
three relative values with full URLs (for example `https://your-domain/images/og-card.png`).
LinkedIn and X need full URLs to show the share card.

## Viewing locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder.
