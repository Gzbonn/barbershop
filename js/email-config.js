/**
 * ==========================================================================
 * THESTREETBARBERSHOP — Email confirmation configuration
 * ==========================================================================
 *
 * Trimiterea automată a confirmărilor folosește EmailJS (https://www.emailjs.com).
 * Este gratuit pentru până la 200 de emailuri/lună și funcționează direct din
 * site-ul static, fără server propriu.
 *
 * Pași (detalii complete în EMAIL-SETUP.md):
 *   1. Creează un cont EmailJS și conectează adresa Gmail a frizeriei.
 *   2. Creează un template de email și copiază variabilele din EMAIL-SETUP.md.
 *   3. Completează mai jos serviceId, templateId și publicKey.
 *   4. În EmailJS → Account → Security, permite originea
 *      https://gzbonn.github.io (și http://127.0.0.1:8080 pentru teste).
 *
 * Cheia publică EmailJS este concepută pentru a fi vizibilă în browser.
 * Nu pune niciodată aici parola Gmail sau chei private.
 */
window.EMAIL_CONFIG = {
  serviceId: '',   // ex: 'service_ab12cd3'
  templateId: '',  // ex: 'template_xy45zw6'
  publicKey: '',   // ex: 'AbCdEfGhIjKlMnOp'

  shopName: 'TheStreetBarbershop',
  shopAddress: '142 Main St, Downtown Arts District',
  shopPhone: '(555) 234-5678',
  shopEmail: 'concierge@thestreetbarbershop.com'
};
