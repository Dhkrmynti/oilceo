# Deploy OILCEO ($OILCEO) ke VPS

Untuk yang punya akses SSH ke VPS. Cuma 3 langkah. Skrip ini **hanya menambah**:
1 situs nginx untuk domain kamu dan 1 proses pm2 (`oilceo-engine`, port 5043).
Situs dan aplikasi lain yang sudah ada di server **tidak diubah**.

## 1. Masuk ke VPS lalu ambil kodenya

```sh
ssh root@<ip-vps>
apt-get install -y git
git clone https://github.com/Dhkrmynti/oilceo.git /opt/oilceo
```

## 2. Pasang

```sh
cd /opt/oilceo
DOMAIN=domainkamu.com sh scripts/install-server.sh
```

Skrip ini memasang Node 20, nginx, pm2, dan certbot (hanya yang belum ada), lalu membangun situsnya,
membuat `.env` engine (dengan `ADMIN_SECRET` acak), mendaftarkan situs nginx, dan menjalankan engine.
Kalau RPC Robinhood diblokir DNS Indonesia, DNS server otomatis dipindah ke DNS-over-TLS (Cloudflare/Google).

Skrip berhenti sendiri tanpa mengubah apa pun kalau port 80 dipakai aplikasi selain nginx,
atau port 5043 sudah dipakai. Untuk port lain: `PORT=5051 DOMAIN=... sh scripts/install-server.sh`.

## 3. Arahkan domain, lalu HTTPS

Di DNS domain kamu buat:

| Type | Name | Value |
|---|---|---|
| A | @ | `<ip-vps>` |
| A | www | `<ip-vps>` |

Tunggu sampai `ping domainkamu.com` menunjuk ke IP itu, lalu:

```sh
cd /opt/oilceo && DOMAIN=domainkamu.com sh scripts/install-server.sh https
```

## Update berikutnya

```sh
cd /opt/oilceo && git pull && DOMAIN=domainkamu.com sh scripts/install-server.sh update
```

## Mode demo / live

Sebelum launch, situs bisa ditampilkan dengan data contoh (diberi label "Demo data"):

```sh
cd /opt/oilceo && sh scripts/site-mode.sh demo   # sebelum launch
cd /opt/oilceo && sh scripts/site-mode.sh live   # setelah token launch
```

## Setelah token launch di Pons

1. Launch $OILCEO di Pons **dari wallet yang private key-nya dipakai engine** (creator fee hanya masuk ke wallet creator).
2. Isi sedikit ETH di wallet itu untuk gas.
3. Buka `https://domainkamu.com/lotnok`, isi CA token, private key wallet creator, alamat treasury, dan **ADMIN_SECRET**
   (setiap simpan wajib pakai secret). `ADMIN_SECRET` ada di `/opt/oilceo/.env`; jangan dibagikan.
4. Cek dari laptop (hanya membaca, tidak mengirim transaksi):

```sh
HOST=root@<ip-vps> SITE=https://domainkamu.com sh scripts/postlaunch-check.sh 0xCA_TOKEN
```

Log engine: `pm2 logs oilceo-engine`.
