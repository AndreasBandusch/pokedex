# Pokedex

A browsable Pokédex: search, filter and view detailed stats for Pokémon, sourced live from the public PokéAPI.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![REST API](https://img.shields.io/badge/REST_API-PokéAPI-2a75bb)

---

## Features

- **Live data from PokéAPI** — no local dataset, every Pokémon is fetched by id on load
- **Incremental loading** — starts with the first 20 Pokémon, "Load more" fetches the next batch until all 898 are loaded
- **Search-as-you-type** — dropdown of name matches, sorted alphabetically, click to jump straight to a Pokémon
- **Detail view** — id, types, base stats (HP, attack, defense, …) as progress bars, with a type-colored header
- **Keyboard navigation** — arrow keys step through Pokémon while the detail view is open
- **Responsive** — card grid adapts to screen size

---

## Tech Stack

| Technology | Notes |
|---|---|
| JavaScript (ES6, `async`/`await`) | No framework |
| HTML5 / CSS3 | Layout, type-based color theming |
| [PokéAPI](https://pokeapi.co/) | REST, consumed directly via `fetch()`, no API key needed |

No `package.json`, no bundler, no build step — a plain static site, consistent with El Pollo Loco from the same bootcamp period.

---

## Getting Started

Nothing to install. Because Pokémon data loads via `fetch()`, opening `index.html` straight from disk hits CORS restrictions in some browsers — serve it locally instead:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

---

## Architecture

### Data loading

`loadPokemons()` fetches Pokémon one at a time in a loop (`fetch` per id, awaited sequentially) rather than in parallel — simple and sufficient at a batch size of 20, but the reason detail requests noticeably queue up when "Load more" is clicked rather than resolving all at once. All loaded Pokémon accumulate in `allLoadedPokemons`; `pokemonList` is a derived, sorted `{id, name}` projection used for the search dropdown so the search doesn't have to sort the full objects each time.

### Rendering

Cards and the detail view are built via template-literal HTML strings appended straight into `innerHTML` — no virtual DOM, no diffing, the container is cleared and fully re-rendered on every data change (`renderPokemonCards()`). The detail card's header background color comes from the Pokémon's primary type name, used directly as a CSS class (`getCssStyle()`), which is why the stylesheet defines one color rule per PokéAPI type name.

### Search

`searchPokemons()` filters the in-memory `allLoadedPokemons` array by name prefix — only Pokémon already fetched are searchable, so search results are scoped to what's been loaded so far, not the full Pokédex, unless "Load more" has been used enough.

---

## Project Structure

```
pokedex/
├── index.html
├── script.js          # All app logic: loading, search, card rendering, keyboard nav
├── style.css
├── fonts.css
├── fonts/              # Self-hosted webfonts
└── images/             # UI icons, favicon set
```

## Status

Completed bootcamp project from the Developer Akademie, not under further active development. Was project four on [bandusch.com](https://www.bandusch.com) until 08.09.2026, when it was swapped out for the portfolio site itself — the repo stays public on GitHub, just no longer linked from the portfolio. `robots.txt`/`.htaccess` already set the site to `noindex, nofollow` on its own subdomain, independent of that swap.

One housekeeping note: the repo also contains an `out/` folder with generated JSDoc HTML output referencing an unrelated `test.js` — leftover from a documentation-generator run, not part of the actual app. Left untouched here since removing it wasn't part of this pass.

## Author

**Andreas Bandusch**
