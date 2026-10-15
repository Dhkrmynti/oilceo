# OILCEO ($OILCEO) · the world's most important barrel (15 Oct 2026)

A new lore and a new site on the engine of `../burn-sawit` ($PALM), itself from `../token-menkrep` and
`../token2`. The money mechanics are unchanged.

## Lore

Every country argues, but in the end everybody needs oil. So one barrel of it got the job: **CEO of the
world**. It sits in the president's chair at the Barrel House in a navy suit and a red tie, and says nothing.

- **Every trade fills the Oil Reserve** (the Pons fee escrow). When the reserve reaches its target, the
  Board holds an **emergency meeting on-chain** and the ETH goes straight to the ten biggest holders.
  The next fill goes to the **strategic reserve** (the treasury), then the Board again.
- **The ten biggest holders who never sold are the Board.** No. 1–5 hold **permanent seats**, No. 6–10
  **rotating seats**. **No. 1 holds the gavel** (the Chairman).
- **Every buy pumps one barrel** out of a well of 5,000. Each barrel has a number, a crude grade
  (Brent, Murban, Minas…), an API gravity, and the day's world headline, all worked out from its number:
  *"Two presidents walked out. Oil up 2.1%."* The well never refills.
- **Sell once and you are under embargo.** Sanctioned for good.
- **The barrel itself is the dev wallet**: it chairs every meeting, never seated, never ranked, never paid.
- Every holder is a small nation with a **flag** (ink, pattern, emblem, field), set by a signed message.
- Tagline: **"The world's most important barrel."** Motto: *world leaders argue. oil prices move. the barrel gets promoted again.*
  Closing: **"Everyone argues. Everyone needs oil."**
- Voice: deadpan newsroom. Satire about oil politics; no real leader, country or company is named, and the
  footer says so. Never yield, APY, passive income or promises of value.

| Word on the site | What it is in the engine |
|---|---|
| the Oil Reserve | the Pons fee escrow, `escrowETH` against the step's threshold |
| emergency meeting | a `feeding` round: ETH to the top 10 by balance |
| strategic reserve | a `keeper` round: ETH to the treasury |
| the Board / permanent / rotating seats | the leaderboard top 10 / tier 1 (70%) / tier 2 (30%) |
| the gavel, the Chairman | No. 1 |
| observers' gallery | No. 11–50 |
| the lobby | holding, first buy not old enough yet |
| embargo, sanctioned | sold: out forever (`hopped`) |
| the CEO, the barrel | the dev wallet |
| a barrel pumped / the well | one buy tx ≥ `BARREL_MIN_TOKENS` / `state.forest` (`/api/forest`) |
| the minutes | every round with its transaction |
| credentials | the wallet check; name and flag set by a signed message |
| longest tenure | holders by time held |

## Buyback

The concept allows "ETH to the top holders **or** a buyback, per the contract's rules". This engine's
rules are: **no buyback, no burn**. Every claimed ETH goes to the Board or the treasury, and the site says
so. A buyback step would be a new money path in the engine (it would have to buy on the Pons curve or the
pool and decide what happens to the tokens) and is not built.

## Why it works as a meme

- **The barrel in a suit** is the picture. It is on every card, every pass, the head of every table.
- **Every buy is a headline.** A buyer gets a numbered barrel, a crude grade and a made-up world headline:
  the share card people post ("I pumped barrel #1,204 (Murban). Two prime ministers left before lunch. Oil up 3.4%.").
- **The meeting is an event.** The reserve visibly fills; at 80% the desk siren goes red; when it pays,
  the page's siren banner says how much went to the Board.
- **Sellers are sanctioned in public**, struck through under hazard tape.
