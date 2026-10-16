# OILCEO ($OILCEO) · X kit

| File | Pakai untuk |
|---|---|
| 01-logo-x.png (1000×1000), 01-logo-x-400.png | Foto profil X (barrel pakai jas, aman buat crop bulat) |
| 02-banner-x.png (1500×500) | Header X (pojok kiri bawah dikosongin buat avatar) |
| 03-gif-emergency-meeting.gif (600×600, loop 4 dtk) | Postingan / reply |
| 04-video-demo.mp4 (1920×1080, 30 dtk) | Postingan pinned / demo cara kerja |

Sumber: `konten-x/studio/src/oil/` (Remotion). Buka dengan `cd konten-x/studio && npm i && npm run dev`.
Render ulang: `npx remotion still Logo ../01-logo-x.png`, `npx remotion still Banner ../02-banner-x.png`,
`npx remotion render MeetingGif ../03-gif-emergency-meeting.gif --codec=gif --every-nth-frame=2`,
`npx remotion render Demo ../04-video-demo.mp4 --codec=h264 --crf=18`.

## Nama & bio X
**Nama:** OILCEO
**Bio:** The world's most important barrel. 🛢️ Every $OILCEO trade fills the Oil Reserve. Full reserve → emergency meeting → ETH to the Board. Sell once, embargoed. oilceo.fun

## Post: video demo (pinned)
world leaders argue.
oil prices move.
the barrel gets promoted again. 🛢️

Every $OILCEO trade fills the Oil Reserve.
Reserve hits 0.02 ETH → emergency meeting on-chain → ETH straight to the 10 biggest holders who never sold.
Every buy pumps a numbered barrel. 5,000 in the well. No refills.
Sell once? Embargoed. For good.

oilceo.fun

## Post: GIF
emergency meeting called. 🚨

reserve full → 0.02 ETH → the Board.
then it fills again.

$OILCEO · oilceo.fun

## Post pendek (buat selingan)
- everybody argues. everybody needs oil. 🛢️ $OILCEO
- the barrel was not consulted. the barrel got promoted anyway. $OILCEO
- 10 seats at the table. the rest of the world watches. oilceo.fun

## Catatan
- Angka di video & GIF cuma setting engine yang asli: meeting 0.02 ETH, 70% ke No. 1–5 (0.014) dan 30% ke No. 6–10 (0.006), 5,000 barrel. Wallet di adegan reserve diberi label "illustration".
- **Engine di server sekarang `AUTOMATION=0`**: fee tetap tampil di web, tapi meeting belum dibayar otomatis. Selama masih begitu, jangan posting seolah meeting sudah jalan sendiri ("every 0.02 ETH the Board is paid"). Pakai kalimat "when the reserve fills" atau nyalakan lagi otomasinya dulu.
- Setelah launch, pasang CA di bio / reply pertama.
- Jangan pernah janji profit atau APY. Kontennya satire; footer web sudah bilang begitu.
