# OILCEO · $OILCEO

Memecoin site + engine for **$OILCEO** (Robinhood Chain 4663, to be launched on Pons). One barrel of oil
is CEO of the world. Every trade fills the **Oil Reserve** (the creator-fee escrow); when it reaches its
target the Board holds an **emergency meeting** on-chain and the ETH goes straight to the **10 biggest
wallets that never sold**; the next fill goes to the treasury, then the Board again. Every buy pumps one
numbered barrel out of a well of 5,000. Lore: `CONCEPT.md`. Design: `DESIGN.md`.

The engine in `bot/` is the `../token2` ($HANG, Hang On) engine plus the barrel layer from `../burn-sawit`
(`bot/forest.ts`, `bot/cards.ts`, `bot/xpost.ts`). Diffed against token2: `xlink.ts` and `uniswap-v4.ts`
are identical, and the claim/pay/treasury logic in `pads-engine.ts` and `store.ts` is the same; the
differences are names, the port, banned name words and the barrel layer. The VPS scripts in `scripts/`
come from token2 too (see `DEPLOY-VPS.md`).
Changed: the token name in logs and signed texts, the default port (5043), the card drawing (the barrel),
the barrel routes (`/barrel/<n>`, `/api/barrel/<n>`, `/api/card/barrel/<n>.png`), and env aliases
(`WELL_BARRELS`, `BARREL_MIN_TOKENS`). Nothing that claims or sends ETH was changed. The well is still
`state.forest` and `/api/forest` inside the engine.

## Run locally

```bash
npm install
npm run bot          # engine + API on 127.0.0.1:5043 (standby until /lotnok is filled)
npm run dev          # site on http://localhost:5205 (proxies /api and /barrel to 5043)
```

- The dev server always shows labelled demo data (a barrel comes up every 6.5 s and the reserve fills;
  when it tops out the meeting siren plays); `http://localhost:5205/?live` shows the real state.
- `?stage=quarter|last100|gone` starts the demo well just before that moment.
- `http://localhost:5205/lotnok` is the engine room.

## Share card

`src/card/draw.ts` draws a 1200 by 630 card for any pumped barrel: the barrel in its office, the grade,
the headline, barrels left, tokens bought. The browser draws it for Save / Share / Post on X; the engine
draws the same card as the link preview of `/barrel/<n>` and of the site (`/api/card/site.png`).

## Not done yet

- **No buyback.** The concept allows one "per the contract's rules"; this engine has none (see `CONCEPT.md`).
- No token yet. Live at https://oilceo.fun (VPS, port 5080), X: https://x.com/oilceorh. `public/terms.html`
  and `public/privacy.html` say `your-domain.example`.
- Not tested against a live token yet: the buy detection should be checked on the first real buys.

## Deploy

See `DEPLOY-VPS.md` (Indonesian): `DOMAIN=example.com sh scripts/install-server.sh` on the server,
`scripts/site-mode.sh demo|live`, and `scripts/postlaunch-check.sh` after launch.

## Launch checklist

1. Launch $OILCEO on Pons **from the wallet whose key goes into the engine**.
2. Put a little ETH in it for gas.
3. `/lotnok` → CA, key, treasury, admin secret → Save. Check `/api/status` shows the token, an indexed block and `forest`.
4. The first emergency meeting runs once the reserve reaches 0.02 ETH and at least one wallet is seated.
