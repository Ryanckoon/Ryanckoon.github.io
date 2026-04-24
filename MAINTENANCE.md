# Maintaining Your Website

A step-by-step guide for keeping `ryanckoon.github.io` up to date — written for you, Ruihua, with no prior HTML/CSS assumed.

---

## 1. Mental model

Your site is **pure static files**. There's no server, no database, no build step. Every page you see is a real `.html` file sitting in a folder on GitHub. When you save a change, GitHub Pages publishes it to the internet within about a minute.

**The files that matter:**

| File | What it is |
|---|---|
| `index.html` | Your main profile page (the homepage) |
| `stylesheet.css` | All visual styling — colors, fonts, spacing |
| `blog/index.html` | List of blog posts |
| `blog/template.html` | A starter you duplicate when writing a new post |
| `blog/<slug>.html` | One file per blog post |
| `images/` | Profile photo, institution logos |
| `pdf/` | CV and any PDFs you link to |
| `favicon/favicon.svg` | The little icon in browser tabs |
| `.nojekyll` | A marker telling GitHub Pages not to mangle anything (leave it alone) |

Everything else (MAINTENANCE.md, README.md) is documentation — it lives in the repo but isn't shown on the site.

---

## 2. Two ways to edit

### Option A — Edit on GitHub.com (no software needed)

1. Go to `https://github.com/Ryanckoon/Ryanckoon.github.io`.
2. Click the file you want to edit (e.g., `index.html`).
3. Click the **pencil icon** (top right of the file view).
4. Make your change in the textbox.
5. Scroll to the bottom. In **Commit changes**, type a short description (e.g. "update office room"). Leave "Commit directly to the main branch" selected.
6. Click **Commit changes**.
7. Wait ~1 minute. Refresh `https://ryanckoon.github.io` — your change is live.

Best for: small edits (one line, a date, a link).

### Option B — Edit on your laptop (for bigger changes)

One-time setup (do this once):

```bash
cd ~
git clone git@github.com:Ryanckoon/Ryanckoon.github.io.git
cd Ryanckoon.github.io
```

Each time you want to edit:

```bash
cd ~/Ryanckoon.github.io
git pull                              # grab any changes made on GitHub.com
# edit files in your editor of choice (VS Code, Sublime, etc.)
open index.html                       # preview in your browser
git add -A
git commit -m "short description of the change"
git push
```

Wait ~1 minute. Refresh the site.

Best for: adding a new experience, writing a blog post, changing the photo.

---

## 3. Recipes

Every recipe below is a small, copy-pasteable change. For each one, you'll edit exactly one file.

### 3.1 — Edit an existing experience

Open `index.html`. Use Cmd+F (Mac) / Ctrl+F (Win) to find the text you want to change (e.g. "NUS Business School"). Change the text inside the `<h3>`, `<p>`, or `<span>` tags. Save. Commit.

**Rule of thumb:** only edit text *between* angle brackets like `<h3>text here</h3>`. Don't change the angle brackets themselves.

### 3.2 — Add a new experience to a timeline

Every timeline entry is a `<div class="timeline-item">…</div>` block. To add one, copy an existing block and edit its contents.

Find a block that looks like this:

```html
<div class="timeline-item">
  <div class="timeline-logo timeline-logo--mono" aria-hidden="true">NUS</div>
  <div class="timeline-content">
    <h3>National University of Singapore, Business School</h3>
    <p class="timeline-role">Ph.D. in Real Estate</p>
    <p class="timeline-detail">Department of Real Estate</p>
  </div>
  <span class="timeline-date">Aug 2025 &mdash; Present</span>
</div>
```

Copy it, paste it right above or below, and edit every piece:
- `NUS` — the monogram (1–3 letters) for the institution
- `National University of Singapore, Business School` — the heading
- `Ph.D. in Real Estate` — your role
- `Department of Real Estate` — one-line detail (optional; remove the whole `<p>` if not needed)
- `Aug 2025 &mdash; Present` — the dates. `&mdash;` is the HTML code for the em-dash (—).

### 3.3 — Add a news item

In `index.html`, find `<!-- ============ NEWS ============ -->`. Inside the `<ul class="news-list">`, copy any existing `<li>` and paste it **at the top** (newest first):

```html
<li>Your news text, with a <a href="https://link">link</a> if helpful. <time datetime="2026-05">2026/05</time></li>
```

Keep `<time datetime="...">` in `YYYY-MM` format — it's how screen readers and search engines read the date.

### 3.4 — Add a work in progress

In `index.html`, find `<!-- ============ WORKS IN PROGRESS ============ -->`. Inside the `<div class="pub-list">`, copy any `<article class="pub">` block and edit:

```html
<article class="pub">
  <h3 class="pub-title">Your Paper Title</h3>
  <p class="pub-authors"><strong>Ruihua Guo</strong>, Coauthor Name</p>
  <p class="pub-venue"><em>Working paper</em></p>
  <details class="pub-toggle">
    <summary>Abstract</summary>
    <p>Your abstract here.</p>
  </details>
</article>
```

To mark a best-paper award or similar honor, add this line right after `.pub-venue`:

```html
<p class="pub-award">Best Paper Award</p>
```

The `pub-award` class uses the reserved Cornell-red accent — it'll stand out.

### 3.5 — Update the bio

In `index.html`, find `<p class="bio">`. Edit the text inside. Keep it to 2–3 sentences. Avoid trailing spaces. If you reference an institution, wrap it in an `<a href="…">…</a>` so it links.

### 3.6 — Swap the profile photo

1. Find a good photo. Square, ~500×500px, JPG or PNG.
2. Save it as `site/images/profile.jpg` (overwrite the existing one if present).
3. In `index.html`, find the comment `<!-- EDIT: drop your photo at images/profile.jpg …`.
4. Comment out or delete the monogram line (`<div class="profile-img timeline-logo--mono" …>RG</div>`).
5. Uncomment the `<img>` line above it by removing the `<!--` and `-->`.

Before:
```html
<!-- <img src="images/profile.jpg" alt="Ruihua Guo" class="profile-img"> -->
<div class="profile-img timeline-logo--mono" style="font-size:2.5rem; aspect-ratio:1;">RG</div>
```

After:
```html
<img src="images/profile.jpg" alt="Ruihua Guo" class="profile-img">
```

Commit both the image file and the `index.html` change together.

### 3.7 — Add a real institution logo

1. Get the logo as a transparent PNG or SVG (search "[school name] logo press kit"). Use PNG ~200×200px or a simple SVG.
2. Save it as `site/images/logos/<slug>.png` (e.g., `nus.png`, `cornell.png`).
3. In `index.html`, find the relevant timeline entry. Replace:
   ```html
   <div class="timeline-logo timeline-logo--mono" aria-hidden="true">NUS</div>
   ```
   With:
   ```html
   <img src="images/logos/nus.png" alt="National University of Singapore" class="timeline-logo">
   ```

The monogram fallback is a deliberate design — if you prefer the letters, leave them.

### 3.8 — Write a new blog post

1. Duplicate `blog/template.html`. Name the copy something URL-safe (lowercase, hyphens, no spaces): e.g. `blog/weathering-the-storm-notes.html`.
2. Open the new file. Fill in every `POST TITLE`, `YYYY-MM-DD`, and body paragraph. Remove any parts you don't need.
3. In `blog/index.html`, add a new `<li>` at the top of `<ul class="post-list">`:
   ```html
   <li>
     <a class="post-title" href="your-slug.html">Your post title</a>
     <span class="post-date">2026-05-12</span>
     <span class="post-summary">One sentence about the post.</span>
   </li>
   ```
4. Commit both files together.

### 3.9 — Change a color

All colors live at the top of `stylesheet.css` in the `:root {}` block. Change a hex value, save, commit. Every place in the site that used that color updates.

The two institutional accents are deliberate — NUS blue for links, Cornell red reserved for awards. If you change either, keep the contrast high enough to read on the off-white background (use [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/) — aim for ≥ 4.5:1).

### 3.10 — Replace the CV

Save your new CV as `site/pdf/CV_Ruihua_Guo.pdf` (overwrite the existing one). Commit. The `CV` link in the hero points to this filename — no code change needed.

If you want to keep a history of CV versions, save as `CV_Ruihua_Guo_2026.pdf` and update the link in `index.html`:
```html
<a href="pdf/CV_Ruihua_Guo_2026.pdf">CV</a>
```

---

## 4. Troubleshooting

### The site isn't updating after my change
- Check the **Actions** tab in your GitHub repo — GitHub Pages runs a deploy there. A red ✗ means something failed; click in to see why.
- **Hard-refresh** your browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Win). Browsers cache aggressively.
- Wait 2 minutes. First-time deploys and DNS changes can be slow.

### An image isn't showing up
- Check the filename exactly matches (case-sensitive on GitHub Pages). `Profile.JPG` ≠ `profile.jpg`.
- Confirm the file is committed — `git status` should show it as tracked. If it's under `images/` and you just copied it in, run `git add images/` first.

### The CSS looks broken
- Make sure `stylesheet.css` is in the same folder as the HTML file referencing it.
- Check you didn't accidentally delete a `}` or `;` at the end of a CSS rule.

### I broke the HTML
- Use **GitHub's version history** on any file — click "History" on the file page, find a good version, copy its contents back.
- Worst case, `git revert HEAD` on your laptop undoes the last commit.

---

## 5. Optional upgrades (for later)

### 5.1 — Use your custom domain ruihuaguo.com

1. In the repo on GitHub, go to **Settings → Pages**.
2. Under "Custom domain", enter `ruihuaguo.com`. Save.
3. At your domain registrar, add these DNS records:
   - Four `A` records for `ruihuaguo.com` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (GitHub's Pages IPs).
   - One `CNAME` record for `www` pointing to `ryanckoon.github.io`.
4. Back in GitHub Pages settings, check "Enforce HTTPS" once the domain is verified (takes up to 24 hours).

A `CNAME` file will be auto-created in your repo — don't delete it.

### 5.2 — Add analytics

Lightweight and privacy-friendly: [Plausible](https://plausible.io) (paid, $9/mo) or [Umami](https://umami.is) (free, self-hostable). Add one `<script>` tag in `<head>` of `index.html` and `blog/*.html`.

Or the default: Google Analytics (free; add the standard GA4 snippet). Keep in mind users generally dislike heavy tracking on personal sites.

### 5.3 — Add dark mode

You'd duplicate your `:root { ... }` palette as `[data-theme="dark"] { ... }` with darker values, and add a small JS toggle. Not hard, but not v1 work. Tell Claude "add a dark mode" and it'll walk you through it.

### 5.4 — Add an RSS feed

For the blog. Static JSON feed is easier than XML RSS. Also not v1 work.

---

## 6. Commit message style

Short, imperative, lowercase. Examples:

- `update bio`
- `add first blog post`
- `fix typo in education section`
- `swap profile photo`
- `add ISPD 2026 to news`

Your commits are public in the repo's history. Don't stress about perfection — clarity is enough.

---

## 7. If you get stuck

Open a new Claude Code session in `/Users/ruihuaguo/Website/`, tell it what you're trying to do, and point it at this file. The project context (CLAUDE.md, .impeccable.md) will carry your design direction forward.
