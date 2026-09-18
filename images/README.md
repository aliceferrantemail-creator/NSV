# Images — where everything goes

**The rule: a file's name is the slot it fills, not what it shows.**
To change a photo on the site, overwrite the file with that slot's name. Keep the
filename exactly the same. Nothing else needs editing.

Example: to change the big photo at the top of the Villas page, replace
`villas/hero.jpg`. Done.

---

## Shapes

Two shapes matter. Getting these roughly right is what stops photos looking cropped.

| Slot type | Shape | Why |
|---|---|---|
| `hero.jpg` | **landscape**, 16:9-ish, ≥2000px wide | fills the full width of the screen |
| everything else | **portrait**, 3:4-ish, ≥1200px wide | sits in tall tiles and half-width panels |

A portrait photo in a hero slot gets cropped hard top and bottom. A landscape photo
in a portrait tile loses its sides. If in doubt, send both and we'll pick.

Keep each file **under ~600 KB**. See "Resizing" at the bottom.

---

## home/ — the front page

| File | Where it appears |
|---|---|
| `hero.jpg` | full-screen photo behind "Slow Days. Empty Waves." **← landscape** |
| `hero-sm.jpg` | the same photo, smaller, loaded on phones **← landscape** |
| `band-1.jpg` | first of three tiles under the intro text |
| `band-2.jpg` | middle tile — has "See the villas" written over it |
| `band-3.jpg` | third tile |
| `split-inside.jpg` | big photo beside "Cool rooms, high ceilings, no clutter" |
| `split-outside.jpg` | big photo beside "Doors open, boards down" (dark green section) |
| `detail-1.jpg` | first of three smaller tiles further down |
| `detail-2.jpg` | middle tile — has "The details" written over it |
| `detail-3.jpg` | third tile |

> `hero.jpg` and `hero-sm.jpg` must be the **same photo** at two sizes.

## villas/ — the Villas page

| File | Where it appears |
|---|---|
| `hero.jpg` | top of the page **← landscape** |
| `villa-one.jpg` | beside the "Villa One" text |
| `villa-two.jpg` | beside the "Villa Two" text |
| `band-1.jpg` `band-2.jpg` `band-3.jpg` | the three tiles near the bottom |

## wave/ — the Wave & The Days page

| File | Where it appears |
|---|---|
| `hero.jpg` | top of the page **← landscape** |
| `pool.jpg` | beside "The pool is open all year" |
| `breakfast.jpg` | beside "Breakfast, made when you want it" |
| `band-1.jpg` `band-2.jpg` `band-3.jpg` | the three tiles near the bottom |

## contact/ and reserve/

| File | Where it appears |
|---|---|
| `contact/hero.jpg` | top of the Contact page **← landscape** |
| `contact/split.jpg` | beside "Or book through a platform" |
| `reserve/hero.jpg` | top of the Reserve page **← landscape** |
| `reserve/split.jpg` | beside "What to know" |

## gallery/ — the Gallery page

`hero.jpg` is the photo at the top **(landscape)**.

The numbered files are the grid, shown **in number order**. Renumber to reorder.

`01-villas-wide.jpg` is special: it spans **two columns**, so it should be
**landscape**. Every other numbered file is portrait.

To add a photo, drop in `18-something.jpg` — then add one `<img>` line to
`gallery.html`. To remove one, delete the file and its line.

## instagram/ — generated, don't hand-edit

Twelve thumbnails pulled from @nirasurfvillas. Filenames are Instagram post IDs
(e.g. `DQJdxo2jD4P.jpg`) because each tile links to that exact post — renaming a
file breaks its link.

This is a **snapshot**, not a live feed. New Instagram posts will not show up on
their own. To refresh it, the files and the links in `index.html` / `gallery.html`
both need updating together.

---

## _originals/ — masters, not used by the website

Full-resolution files kept for re-exporting later. Nothing here is served, and it's
excluded from git (too large). Back it up somewhere else — this folder is not in the repo.

| | |
|---|---|
| `home-hero-master.jpg` | 4133×2745 original of the home hero (9.6 MB) |
| `pool-1-master.jpg`, `pool-2-master.jpg` | originals of the two pool photos |
| `raw/` | Fujifilm `.RAF` files — **need exporting to JPEG before use** |
| `slideshow/` | old 787px slideshow frames — real photos, too small for the site |
| `unused-placeholders/` | the grey gradient placeholders the site started with |

---

## Resizing

Drop a new photo in at full size, then run this from the project root:

```bash
./tools/resize-images.sh
```

It shrinks anything oversized in `images/` and reports what it changed. Originals in
`_originals/` are left alone. Requires only `sips`, which macOS already has.

To do one file by hand:

```bash
sips -Z 2400 -s formatOptions 72 big-photo.jpg --out images/home/hero.jpg
```

`-Z 2400` caps the longest edge at 2400px; `formatOptions 72` sets JPEG quality.
Use `-Z 2400` for heroes and `-Z 1600` for everything else.
