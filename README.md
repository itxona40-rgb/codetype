# CodeType

Matn va dasturlash kodini tez yozish mashqi + sinf musobaqasi (reyting va poyga).
Oddiy statik sayt: build kerak emas, GitHub Pages / Netlify / Vercel ga to‘g‘ridan-to‘g‘ri joylanadi.

## Ishga tushirish (terminal)

Kerak: [Node.js](https://nodejs.org) 18 yoki yangiroq. Boshqa hech narsa o‘rnatish shart emas.

```bash
cd codetype
npm start
```

Terminalda manzillar chiqadi:

```
Shu kompyuterda:  http://localhost:3000
Sinf Wi-Fi'ida:   http://192.168.1.15:3000
```

O‘qituvchi kompyuterida `localhost` ni oching, o‘quvchilar telefon yoki kompyuterdan **Wi-Fi manzilini** ochadi (hammasi bitta tarmoqda bo‘lsin). Umumiy reyting va poyga serversiz sozlamasdan ishlaydi. Ma‘lumot `data/db.json` fayliga yoziladi, serverni o‘chirib yoqsangiz ham saqlanib qoladi.

Variantlar:

```bash
npm start -- --port 8080          # boshqa port
npm start -- --log                # har so‘rovni ko‘rsatish
DATA_FILE=/var/ct/db.json npm start
npm test                          # server testlari
```

Zaxira nusxa: `data/db.json` faylini nusxalash yetarli.

Internetdan kirish kerak bo‘lsa, loyihani Node.js ishlaydigan hostingga (Render, Railway, VPS) joylang va `npm start` ni ishga tushiring. Bu holda `PORT` muhit o‘zgaruvchisi hostingdan keladi.

## Tuzilma

```
index.html        sahifa
css/style.css     asosiy dizayn
css/contest.css   musobaqa dizayni
js/app.js         mashq mexanikasi (matn, kod, statistika, effektlar)
js/config.js      server manzili (`npm start` buni o‘zi beradi)
server.js         Node serveri: sayt + umumiy ma‘lumot bazasi
test/             server testlari
js/contest.js     panellar, reyting, poyga, server bilan ishlash
js/learn.js       klaviatura darslari (boshlovchilar uchun)
js/games.js       o‘yinlar: poyga va sharlar
css/games.css     o‘yinlar dizayni
css/learn.css     darslar dizayni
```

## Musobaqa tizimi

- **O‘quvchi:** 8 xonali panel kodi + ism bilan kiradi. Har testdan keyin natija **darhol** reytingga yoziladi.
- **O‘qituvchi:** panel paroli bilan kiradi. Boshlang‘ich parollar `admin1` … `admin20`, birinchi kirgandan keyin o‘zgartiring.
- **20 ta panel**, har birida 150 tagacha o‘quvchi, alohida kod, nom va parol.
- **Reyting:** Umumiy / Matn / Kod. Ball = (wpm × aniqlik) ning har tur bo‘yicha eng yaxshisi.
- **Poyga:** o‘qituvchi tur (Matn EN, Matn UZ, Kod) va matn poygasi uchun vaqtni (15/30/60/120 soniya) tanlaydi. O‘quvchilar “Qo‘shilish” ni bosib qulflangan poyga bo‘limiga o‘tadi: rejim, vaqt va matnni o‘zgartira olmaydi, Esc/Tab ishlamaydi, boshlanguncha yozib bo‘lmaydi. O‘qituvchi “Boshlash” ni bosgach hamma qurilmada bir vaqtda 5 soniyalik sanash boshlanadi. Oxirida wpm bo‘yicha 1, 2, 3… o‘rinli jadval chiqadi.
- **O‘quvchi bo‘limlari:** o‘qituvchi har bir o‘quvchiga alohida bo‘lim (Matn English/O‘zbek/Dasturlash yoki Kod + til) va vaqt belgilaydi, yoki “Hamma o‘quvchiga” bilan hammasiga bir vaqtda. Belgilangach o‘quvchi uni o‘zgartira olmaydi. “Erkin” qulfni ochadi.
- Natija yuborilmay qolsa (internet uzilsa), u qurilmada saqlanadi va aloqa qaytganda avtomatik yuboriladi. Holat tepadagi panelda ko‘rinadi: ✓ saqlandi / ⏳ yuborilmoqda / ⚠ aloqa yo‘q.

## Yangi imkoniyatlar

- **Poygani qayta boshlash:** poyga tugagach o‘qituvchi panelida “↻ Qayta boshlash” tugmasi chiqadi. Xuddi shu tur, til va vaqt bilan yangi matn tanlanadi, o‘quvchilarga yana “Qo‘shilish” kartasi ko‘rinadi.
- **Onlayn / oflayn:** o‘quvchi sahifasi ochiq bo‘lsa har 15 soniyada belgi yuboradi. O‘qituvchi panelida “O‘quvchilar holati” kartasida yashil (onlayn) va kulrang (oflayn, oxirgi ko‘ringan vaqti bilan) ko‘rinadi, o‘quvchilar ro‘yxatida ham nuqta bor. Chiqib ketsa yoki boshqa tabga o‘tsa oflayn bo‘ladi.
- **Klaviatura darslari:** bosh menyuda o‘quvchi va o‘qituvchi yonida uchinchi tugma. Kirishsiz ishlaydi, progress shu brauzerda saqlanadi. 8 bosqich, 38 ta dars: asosiy qator, yuqori qator, pastki qator, katta harflar (Shift), raqamlar, belgilar, so‘zlar va gaplar, yakuniy imtihon. Har darsda ekran klaviaturasi (barmoq ranglari bilan), qo‘llar sxemasi, keyingi tugma va barmoq nomi ko‘rsatiladi. O‘tish uchun aniqlik va tezlik maqsadiga yetish kerak, 1–3 yulduz beriladi, keyingi dars shundan keyin ochiladi. Esc — darsni qayta boshlash.

- **O‘yinlar:** bosh menyuda to‘rtinchi tugma, kirishsiz ishlaydi, rekordlar shu brauzerda saqlanadi.
  - *Poyga: 3 mashina.* Siz va ikkita bot (standart 30 va 50 wpm; oson 20/35, qiyin 45/70). Poyga uzunligi 25/40/60 so‘z, matn English yoki o‘zbekcha. 3-2-1 sanash, har bosilgan harf mashinani suradi, xato bosilsa mashina to‘xtaydi, 20 ta xatosiz harfdan keyin nitro yonadi. Oxirida g‘oliblar zinapoyasi, vaqt va wpm.
  - *Sharlar.* Tepadan harf yoki so‘zli sharlar tushadi. Birinchi harf eng pastdagi mos sharni tanlaydi. Har 8 ta shardan keyin daraja oshadi (1–2: harflar, 3+: so‘zlar, tezlik va uzunlik oshib boradi). Bitta shar pastga yetsa yutqazasiz (xohlasangiz 3 hayot tanlash mumkin), keyin qayta boshlash. Combo ballni oshiradi, Esc — pauza, Backspace — tanlovni bekor qilish.

## Muqobil: Firebase (faqat statik hosting uchun)

`npm start` ishlatilmasa (masalan GitHub Pages), ma‘lumotni Firebase'da saqlash mumkin. Serversiz holda ma‘lumot faqat bitta brauzerda saqlanadi.

1. https://console.firebase.google.com da loyiha yarating.
2. **Build → Realtime Database → Create database** (istalgan hudud, “test mode” emas, “locked mode”).
3. **Rules** bo‘limiga quyidagini qo‘ying va **Publish** qiling:
   ```json
   { "rules": { "ct": { ".read": true, ".write": true } } }
   ```
4. Database tepasidagi manzilni nusxalang (`https://....firebaseio.com`) va `js/config.js` ga yozing:
   ```js
   window.CT_CONFIG={dbUrl:"https://loyiha-nomi-default-rtdb.firebaseio.com"};
   ```
5. Saytni qayta joylang. O‘qituvchi panelida “Server ulanmagan” ogohlantirishi yo‘qoladi.

## Cheklovlar

- Server ma‘lumot yozishni cheklamaydi: manzilga kira oladigan odam ma‘lumotni o‘zgartira oladi (Firebase qoidalari ham ochiq). Sinf musobaqasi uchun yetarli, lekin jiddiy himoya kerak bo‘lsa Firebase Authentication va Cloud Functions qo‘shish lozim.
- Panel parollari xeshlangan holda saqlanadi, lekin tekshiruv brauzerda bajariladi.
- Bir ism ikki qurilmada ishlatilsa, ular bitta o‘quvchi hisoblanadi.
- Poyga boshlanish vaqti o‘quvchilar qurilmalarida 1 soniyagacha farq qilishi mumkin.
