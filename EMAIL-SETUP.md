# Confirmări pe email — TheStreetBarbershop

Site-ul este static (GitHub Pages), deci nu poate trimite emailuri singur, fără un serviciu extern.
Am integrat **EmailJS** (gratuit până la 200 de emailuri/lună), care trimite confirmarea
direct din browser, prin contul Gmail al frizeriei.

Până la configurare, pagina de confirmare afișează butonul **„Trimite confirmarea pe Gmail”**,
care deschide Gmail cu toate detaliile deja completate (clientul apasă doar Send).

---

## 1. Creează contul EmailJS

1. Intră pe <https://www.emailjs.com> și creează un cont gratuit.
2. **Email Services → Add New Service → Gmail** și conectează adresa Gmail a frizeriei.
3. Copiază **Service ID** (ex: `service_ab12cd3`).

## 2. Creează template-ul de email

**Email Templates → Create New Template** și completează:

- **To Email:** `{{to_email}}`
- **From Name:** `TheStreetBarbershop`
- **Reply To:** `{{reply_to}}`
- **Subject:** `Confirmare programare {{booking_code}} — {{shop_name}}`

Corpul emailului (mod HTML):

```html
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;background:#0c0a09;color:#f5f5f4;padding:28px;border:1px solid #d9a44e;border-radius:10px">
  <h1 style="color:#d9a44e;font-size:22px;margin:0 0 4px">TheStreetBarbershop</h1>
  <p style="color:#a8a29e;font-size:13px;margin:0 0 22px">Confirmare programare</p>

  <p style="font-size:15px">Salut, <strong>{{to_name}}</strong>!</p>
  <p style="font-size:15px">Programarea ta este confirmată. Te așteptăm.</p>

  <p style="font-size:22px;color:#d9a44e;margin:22px 0 14px"><strong>{{booking_code}}</strong></p>

  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr><td style="padding:7px 0;color:#a8a29e">Serviciu</td><td style="padding:7px 0;text-align:right"><strong>{{booking_service}}</strong></td></tr>
    <tr><td style="padding:7px 0;color:#a8a29e">Frizer</td><td style="padding:7px 0;text-align:right"><strong>{{booking_barber}}</strong></td></tr>
    <tr><td style="padding:7px 0;color:#a8a29e">Data</td><td style="padding:7px 0;text-align:right"><strong>{{booking_date}}</strong></td></tr>
    <tr><td style="padding:7px 0;color:#a8a29e">Ora</td><td style="padding:7px 0;text-align:right"><strong>{{booking_time}}</strong></td></tr>
    <tr><td style="padding:7px 0;color:#a8a29e">Durată</td><td style="padding:7px 0;text-align:right"><strong>{{booking_duration}}</strong></td></tr>
    <tr><td style="padding:7px 0;color:#a8a29e">Preț</td><td style="padding:7px 0;text-align:right;color:#d9a44e"><strong>{{booking_price}}</strong></td></tr>
    <tr><td style="padding:7px 0;color:#a8a29e">Note</td><td style="padding:7px 0;text-align:right"><strong>{{booking_notes}}</strong></td></tr>
  </table>

  <hr style="border:none;border-top:1px solid #292524;margin:22px 0" />

  <p style="font-size:13px;color:#a8a29e;line-height:1.7;margin:0">
    {{shop_name}}<br />
    {{shop_address}}<br />
    Telefon: {{shop_phone}}<br />
    Email: {{shop_email}}
  </p>
  <p style="font-size:12px;color:#78716c;margin:18px 0 0">Te rugăm să ajungi cu 5–10 minute mai devreme. Pentru modificări sau anulări, contactează-ne la telefon.</p>
</div>
```

Copiază **Template ID** (ex: `template_xy45zw6`).

## 3. Ia cheia publică și permite site-ul

- **Account → General → Public Key** — copiază cheia.
- **Account → Security → Allowed origins** — adaugă:
  - `https://gzbonn.github.io`
  - `http://127.0.0.1:8080` (doar pentru teste locale)

## 4. Completează configurația

Deschide `js/email-config.js` și completează:

```js
window.EMAIL_CONFIG = {
  serviceId: 'service_ab12cd3',
  templateId: 'template_xy45zw6',
  publicKey: 'AbCdEfGhIjKlMnOp',
  ...
};
```

Fă commit și push. De la următorul deploy, fiecare programare trimite automat
confirmarea pe adresa introdusă de client.

> Cheia publică EmailJS este făcută pentru browser și poate sta în cod.
> Nu pune niciodată parola Gmail sau chei private în acest fișier.

## 5. Test

1. Deschide site-ul live, fă o programare cu o adresă Gmail reală.
2. În pasul 5 ar trebui să apară: „Confirmarea a fost trimisă pe …”.
3. Verifică Inbox + Spam.
4. În EmailJS → **Email History** poți vedea fiecare trimitere și eventualele erori.

## Depanare

| Mesaj | Cauză | Soluție |
| --- | --- | --- |
| „Confirmarea automată nu este încă activată” | `js/email-config.js` este gol | Completează cele 3 valori |
| „Confirmarea automată nu a putut fi trimisă” | Service/template greșit, origine blocată sau limita lunară atinsă | Verifică EmailJS → Email History și Allowed origins |
| Emailul ajunge la Spam | Expeditor nou Gmail | Marchează „Not spam”; ideal, folosește un domeniu propriu verificat |
