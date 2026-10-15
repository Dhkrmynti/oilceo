---
name: OILCEO — A working day at the Barrel House
description: "$OILCEO as one day at the barrel's office: the office at dawn, the morning briefing on the desk, the summit at the round table, the Oil Reserve out back, the minutes, the embargo list, the accreditation desk, and the office after hours."
colors:
  night: "#0b1220 (the office, after hours)"
  walnut: "#24160d (the briefing desk)"
  chamber: "#102342 (the summit)"
  refinery: "#0e0d0c (the reserve) with #e8a24a (crude)"
  paper: "#f1ead9 (the minutes, the memo, the pass)"
  concrete: "#2c2c2f (the embargo)"
  navy: "#16294a (accreditation, the suit)"
  red: "#ff4a2e (emergency: the one loud colour everywhere)"
  brass: "#e0b04a (the answer to it: gold trim, seats, money)"
typography:
  display: "Archivo Variable, 850–900, condensed (font-stretch 72–80%)"
  accent: "Instrument Serif italic, for the turn in every headline"
  data: "JetBrains Mono (every number, address, label)"
---

# OILCEO — a working day at the Barrel House

Same method as `../burn-sawit`: the page is one place, top to bottom. Every stop has its own ground
and its own drawn thing, and the edge between two stops is drawn too (`src/world/Edges.tsx`).

| Stop | Section | Ground | The thing drawn | Edge into it |
|---|---|---|---|---|
| 01 Office | `Hero.tsx` | night, office wallpaper stripes, lamp glow | the barrel in the president's chair, ten flags of the Board on poles, the desk (red phone, name plate, minutes, siren lamp), a window on an oil field with a flare | - |
| (chyron) | `Story.tsx` `Chyron` | ivory | a breaking-news ticker, one line per barrel with its headline | red rule |
| 02 Briefing | `Story.tsx` `Briefing` | walnut desk | a memo to the world (the motto typed out), a DECLASSIFIED stamp, four manila folders with the rules | - |
| 03 Summit | `Board.tsx` | chamber blue | a scalloped drape, the round table seen from above, the barrel at its head, ten seats with flags | drape |
| 04 Reserve | `Reserve.tsx` `Reserve` | refinery black | the storage tank (fee escrow) with its gauge and beacon, pipes, two valve wheels, riveted plates | refinery skyline |
| 05 Minutes | `Reserve.tsx` `Minutes` | paper | typed minutes, one resolution per round, an ADOPTED stamp | - |
| 06 Embargo | `Reserve.tsx` `Embargo` | concrete | sellers as sanction cards, flags greyed, names struck through | two runs of hazard tape |
| 07 Accreditation | `Credentials.tsx` | navy | a delegate pass on a red lanyard with the lookup | - |
| 08 After hours | `Frame.tsx` `Closing` | night | the barrel at the window, the moon, pumpjacks nodding | oil field |

## The barrel (`src/world/ceo-shapes.ts`)
One list of flat shapes on a 200 by 250 grid. The page renders it as SVG (`Barrel.tsx`), the cards draw
the same list on canvas (`src/card/draw.ts`), in the browser and in the engine. Black drum, brass hoop,
deadpan eyes that blink, navy suit, red tie, steepled hands.

## Motion (GSAP + ScrollTrigger + Lenis)
- Office: poles rise, the barrel settles into the chair; flags wave; the flare flickers; the red phone rings
  when a barrel is pumped; the siren lamp goes red when the reserve passes 80% before a meeting.
  As the hero scrolls away the camera pushes in on the barrel and the readouts lift off.
- Briefing: the memo slides onto the desk, the motto types itself, the stamp slams; folders drop.
- Summit: the table scales in and the seats pop in one by one.
- Reserve: crude rises in the tank as you scroll; oil runs down the pipe of the step being filled; its valve turns.
- Minutes: the page feeds out of the typewriter (clip); ADOPTED slams at the end.
- Embargo: cards drop in, stamps slam.
- Accreditation: the pass drops on its lanyard with a bounce.
- After hours: the moon rises; the barrel steps up to the window; pumpjacks nod.
- Page-wide: a progress line (brass → red) under the bar, the bar hides on the way down, the agenda
  rail on the left marks the stop with an oil drop. All off under prefers-reduced-motion.

## Rules
- Red is the one loud colour; brass answers it. Each place has one accent of its own.
- Headlines: condensed grotesque, then the turn in serif italic.
- No yield or APY language. A satire note at the bottom.
