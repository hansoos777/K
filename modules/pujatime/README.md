# PujaTime

Your personal shrine, wherever you are.

```bash
npm install
npm run dev
```

- **Stack**: React + TypeScript + Vite PWA. No server yet. All data stays in the browser's localStorage.
- **Structure**: My Shrine (daily) / Global Mandir (special days) / Festivals / Learn / Journal.

## Before release

- Mantras, symbols and stories in `src/data` were cross-checked against public references.
- Festival dates end at Diwali 2027. Add new dates every year.
- Mantras have no recorded voice yet. Listen plays a drone and highlights the words.

## Audio credits

- `public/audio/bansuri.mp3`: "Bansuri sample E bass.ogg", Wikimedia Commons, public domain.
- `public/audio/gayatri.mp3`: "Gayatri mantra.ogg" by Wilfredor, Wikimedia Commons, CC0.

## Adding deity paintings

Put `ganesha.jpg`, `shiva.jpg`, `krishna.jpg`, `lakshmi.jpg`, `vishnu.jpg`, `durga.jpg` in `public/deities/`.
Portrait, about 4:5. The app uses them automatically in place of the brass emblems.

## Next: shared Global Mandir

Lamp counts shared worldwide, live ceremonies, and the Prayer Wall need a server (Cloudflare D1 or Durable Objects).
