/* Parcours propres à Kabooça : panier (ajout, deux onglets, donnée abîmée, commande simulée),
   catalogue (filtres dans l'adresse, recherche sans accents ni pluriels), configurateur (étapes, choix
   préremplis par l'adresse, Entrée sans envoi, champs obligatoires, double clic), visionneuse (lien direct,
   Échap, focus rendu), vue éclatée sur téléphone, FAQ. Chaque problème va au rapport. */
export default async function ({ contexte, attendrePret, attendre, BASE, R, T }) {
  const lieu = (page, taille) => ({ page, taille });

  /* 1. Panier : ajout depuis la fiche, compteur, deux onglets, donnée abîmée, commande simulée. */
  {
    const { ctx, page } = await contexte({ taille: T('1366×768') });
    try {
      await page.goto(BASE + '/boutique/sac-de-commandement', { waitUntil: 'load' });
      await attendrePret(page);
      await page.evaluate(() => localStorage.removeItem('kabooca:panier'));
      await page.reload({ waitUntil: 'load' }); await attendrePret(page);
      await page.click('.fiche-tete [data-ajouter]');
      await page.click('.fiche-tete [data-ajouter]'); /* double clic rapide : un seul exemplaire */
      await attendre(500);
      const n = await page.evaluate(() => document.querySelector('[data-panier-compte]').textContent.trim());
      if (n !== '1') R.echec('panier', `compteur à ${n} après un double clic sur « Ajouter » (attendu 1)`, lieu('/boutique/sac-de-commandement', '1366×768'));
      const annonce = await page.evaluate(() => document.querySelector('[data-annonce]').textContent);
      if (!/ajouté/.test(annonce)) R.echec('panier', 'ajout non annoncé aux lecteurs d’écran', lieu('/boutique/sac-de-commandement', '1366×768'));
      /* Second onglet : même panier, mis à jour par l'événement storage. */
      const autre = await ctx.newPage();
      await autre.goto(BASE + '/boutique', { waitUntil: 'load' }); await attendrePret(autre);
      await autre.click('[data-creation="accessoires-de-precision"] [data-ajouter]');
      await attendre(600);
      const n2 = await page.evaluate(() => document.querySelector('[data-panier-compte]').textContent.trim());
      if (n2 !== '2') R.echec('panier', `le premier onglet affiche ${n2} article(s) au lieu de 2 après un ajout dans un autre onglet`, lieu('/boutique', '1366×768'));
      /* Tiroir : ouverture, focus dedans, quantité, Échap, focus rendu. */
      await page.click('[data-panier-bouton]'); await attendre(600);
      const dedans = await page.evaluate(() => !!document.activeElement.closest('[data-panier]'));
      if (!dedans) R.echec('panier', 'le focus n’entre pas dans le tiroir à l’ouverture', lieu('/boutique/sac-de-commandement', '1366×768'));
      await page.click('[data-panier-liste] [data-plus]'); await attendre(200);
      const n3 = await page.evaluate(() => document.querySelector('[data-panier-compte]').textContent.trim());
      if (n3 !== '3') R.echec('panier', `bouton + : compteur à ${n3} au lieu de 3`, lieu('/boutique/sac-de-commandement', '1366×768'));
      await page.keyboard.press('Escape'); await attendre(600);
      const ferme = await page.evaluate(() => document.querySelector('[data-panier]').hidden && document.activeElement.matches('[data-panier-bouton]'));
      if (!ferme) R.echec('panier', 'Échap ne ferme pas le tiroir ou ne rend pas le focus au bouton', lieu('/boutique/sac-de-commandement', '1366×768'));
      /* Commande simulée : panier vidé, message. */
      await page.click('[data-panier-bouton]'); await attendre(600);
      await page.click('[data-panier-commander]'); await attendre(300);
      const apres = await page.evaluate(() => ({ n: document.querySelector('[data-panier-compte]').textContent.trim(), msg: !document.querySelector('[data-panier-message]').hidden }));
      if (apres.n !== '0' || !apres.msg) R.echec('panier', 'la commande simulée ne vide pas le panier ou n’affiche pas son message', lieu('/boutique/sac-de-commandement', '1366×768'));
      await page.keyboard.press('Escape'); await attendre(500);
      /* Donnée abîmée : nettoyée, le site reste utilisable. */
      await page.evaluate(() => localStorage.setItem('kabooca:panier', '{abîmé'));
      await page.reload({ waitUntil: 'load' });
      if ((await attendrePret(page)) === 'jamais-pret') R.echec('panier', 'une donnée abîmée bloque le site', lieu('/boutique/sac-de-commandement', '1366×768'));
      const propre = await page.evaluate(() => localStorage.getItem('kabooca:panier'));
      if (propre !== '[]' && propre !== null) R.echec('panier', `donnée abîmée non nettoyée (${propre})`, lieu('/boutique/sac-de-commandement', '1366×768'));
      await page.evaluate(() => localStorage.setItem('kabooca:panier', JSON.stringify([{ cle: 'inconnu', qte: 3 }, { cle: 'sac-de-commandement', qte: 2 }])));
      await page.reload({ waitUntil: 'load' }); await attendrePret(page);
      const n4 = await page.evaluate(() => document.querySelector('[data-panier-compte]').textContent.trim());
      if (n4 !== '2') R.echec('panier', `ligne inconnue gardée dans le panier (compteur ${n4} au lieu de 2)`, lieu('/boutique/sac-de-commandement', '1366×768'));
      await page.evaluate(() => localStorage.removeItem('kabooca:panier'));
    } finally { await ctx.close(); }
  }

  /* 2. Catalogue : filtre gardé dans l'adresse, recherche sans accents ni pluriels, rubrique vide. */
  {
    const { ctx, page } = await contexte({ taille: T('390×844') });
    try {
      const visibles = () => page.evaluate(() => [...document.querySelectorAll('[data-grille] [data-creation]')].filter((c) => !c.hidden).map((c) => c.dataset.creation));
      await page.goto(BASE + '/boutique?categorie=sacs', { waitUntil: 'load' }); await attendrePret(page); await attendre(300);
      let v = await visibles();
      if (v.join() !== 'sac-de-commandement,sacs-legion-etrangere') R.echec('catalogue', `?categorie=sacs affiche ${v.join(', ') || 'rien'}`, lieu('/boutique', '390×844'));
      await page.click('[data-filtre="accessoires"]'); await attendre(500);
      v = await visibles();
      if (v.join() !== 'accessoires-de-precision') R.echec('catalogue', `filtre Accessoires : ${v.join(', ')}`, lieu('/boutique', '390×844'));
      if (!/categorie=accessoires/.test(page.url())) R.echec('catalogue', 'le filtre n’est pas gardé dans l’adresse', lieu('/boutique', '390×844'));
      await page.click('[data-filtre=""]'); await attendre(400);
      await page.fill('[data-recherche]', 'ACCESSOIRE PRECISION'); await attendre(600);
      v = await visibles();
      if (v.join() !== 'accessoires-de-precision') R.echec('catalogue', `recherche « ACCESSOIRE PRECISION » (sans accent, singulier) : ${v.join(', ') || 'rien'}`, lieu('/boutique', '390×844'));
      await page.fill('[data-recherche]', 'zzzz'); await attendre(600);
      const aucun = await page.evaluate(() => !document.querySelector('[data-aucun]').hidden);
      if (!aucun) R.echec('catalogue', 'aucun message quand la recherche ne trouve rien', lieu('/boutique', '390×844'));
      await page.click('[data-effacer]'); await attendre(500);
      v = await visibles();
      if (v.length !== 4) R.echec('catalogue', `« Effacer la recherche » laisse ${v.length} création(s)`, lieu('/boutique', '390×844'));
    } finally { await ctx.close(); }
  }

  /* 3. Configurateur : choix préremplis par l'adresse, Entrée sans envoi, étapes, champs obligatoires, double clic. */
  {
    const { ctx, page } = await contexte({ taille: T('1366×768') });
    try {
      await page.goto(BASE + '/sur-mesure?modele=sacs-legion-etrangere&corps=cobalt&sangle=graphite&initiales=AB#configurateur', { waitUntil: 'load' });
      await attendrePret(page); await attendre(400);
      const pre = await page.evaluate(() => ({
        modele: (document.querySelector('input[name="modele"]:checked') || {}).value,
        corps: (document.querySelector('input[name="corps"]:checked') || {}).value,
        recap: document.querySelector('[data-recap="modele"]').textContent,
        croquis: [...document.querySelectorAll('.config-croquis-type')].filter((e) => !e.hidden).map((e) => e.dataset.type).join(),
        marquage: document.querySelector('[data-recap="marquage"]').textContent,
      }));
      if (pre.modele !== 'sacs-legion-etrangere' || pre.corps !== 'cobalt') R.echec('configurateur', `choix de l’adresse non repris (${pre.modele}, ${pre.corps})`, lieu('/sur-mesure', '1366×768'));
      if (pre.croquis !== 'sac-a-dos') R.echec('configurateur', `croquis affiché : ${pre.croquis} au lieu du sac à dos`, lieu('/sur-mesure', '1366×768'));
      if (pre.marquage !== 'AB') R.echec('configurateur', `récapitulatif du marquage : « ${pre.marquage} »`, lieu('/sur-mesure', '1366×768'));
      const etape = () => page.evaluate(() => Number((document.querySelector('[data-pas].actif') || {}).dataset?.pas || 0));
      if ((await etape()) !== 1) R.echec('configurateur', 'la première étape n’est pas affichée au départ', lieu('/sur-mesure', '1366×768'));
      await page.click('[data-suivant]'); await attendre(450);
      await page.click('[data-suivant]'); await attendre(450);
      /* Entrée dans le champ des initiales (étape 3) : étape suivante, pas d'envoi. */
      await page.focus('#c-initiales'); await page.keyboard.press('Enter'); await attendre(450);
      const e4 = await etape();
      const envoye = await page.evaluate(() => !document.querySelector('[data-configurateur] [data-message-envoi]').hidden);
      if (e4 !== 4 || envoye) R.echec('configurateur', `Entrée à l’étape 3 : étape ${e4}, envoi ${envoye ? 'déclenché' : 'non déclenché'}`, lieu('/sur-mesure', '1366×768'));
      await page.click('[data-envoyer]'); await attendre(300);
      const erreurs = await page.evaluate(() => document.querySelectorAll('[data-configurateur] [aria-invalid="true"]').length);
      if (erreurs < 3) R.echec('configurateur', `envoi sans coordonnées : ${erreurs} erreur(s) signalée(s) au lieu de 3`, lieu('/sur-mesure', '1366×768'));
      await page.fill('#c-prenom', 'Camille'); await page.fill('#c-nom', 'Martin'); await page.fill('#c-email', 'camille@exemple.fr');
      await page.dblclick('[data-envoyer]'); await attendre(400);
      const fin = await page.evaluate(() => ({ msg: !document.querySelector('[data-configurateur] [data-message-envoi]').hidden, bloque: document.querySelector('[data-envoyer]').disabled }));
      if (!fin.msg || !fin.bloque) R.echec('configurateur', 'après l’envoi : message simulé absent ou bouton encore actif (double envoi possible)', lieu('/sur-mesure', '1366×768'));
    } finally { await ctx.close(); }
  }

  /* 4. Visionneuse : lien direct, flèches, Échap, focus rendu à la vignette. */
  {
    const { ctx, page } = await contexte({ taille: T('1366×768') });
    try {
      await page.goto(BASE + '/boutique/accessoires-de-precision#detail-2', { waitUntil: 'load' });
      await attendrePret(page); await attendre(700);
      let etat = await page.evaluate(() => ({ ouverte: !document.querySelector('[data-visionneuse-fenetre]').hidden, vue: [...document.querySelectorAll('[data-vue]')].findIndex((v) => !v.hidden) }));
      if (!etat.ouverte || etat.vue !== 1) R.echec('visionneuse', `le lien #detail-2 n’ouvre pas la deuxième vue (ouverte : ${etat.ouverte}, vue ${etat.vue + 1})`, lieu('/boutique/accessoires-de-precision', '1366×768'));
      await page.keyboard.press('ArrowRight'); await attendre(300);
      etat = await page.evaluate(() => ({ vue: [...document.querySelectorAll('[data-vue]')].findIndex((v) => !v.hidden), hash: location.hash }));
      if (etat.vue !== 2 || etat.hash !== '#detail-3') R.echec('visionneuse', `flèche droite : vue ${etat.vue + 1}, adresse ${etat.hash}`, lieu('/boutique/accessoires-de-precision', '1366×768'));
      await page.keyboard.press('Escape'); await attendre(300);
      etat = await page.evaluate(() => ({ ouverte: !document.querySelector('[data-visionneuse-fenetre]').hidden, focus: document.activeElement.id, bloque: document.documentElement.classList.contains('defilement-bloque') }));
      if (etat.ouverte || etat.focus !== 'vignette-3' || etat.bloque) R.echec('visionneuse', `Échap : ouverte ${etat.ouverte}, focus sur « ${etat.focus} », défilement bloqué ${etat.bloque}`, lieu('/boutique/accessoires-de-precision', '1366×768'));
    } finally { await ctx.close(); }
  }

  /* 5. Vue éclatée sur téléphone : éclatée à l'écran, le bouton la réassemble. 6. FAQ : ouverture et fermeture. */
  {
    const { ctx, page } = await contexte({ taille: T('390×844') });
    try {
      await page.goto(BASE + '/', { waitUntil: 'load' }); await attendrePret(page);
      await page.evaluate(() => document.querySelector('.eclatee-cadre').scrollIntoView({ block: 'center', behavior: 'instant' }));
      await attendre(2200);
      const r = await page.evaluate(() => ({ bouton: !document.querySelector('[data-eclatee-bascule]').hidden, repere: getComputedStyle(document.querySelector('.eclatee-repere')).opacity }));
      if (!r.bouton || Number(r.repere) < 0.9) R.echec('vue éclatée', `téléphone : repères à ${r.repere}, bouton ${r.bouton ? 'visible' : 'absent'}`, lieu('/', '390×844'));
      await page.click('[data-eclatee-bascule]'); await attendre(1600);
      const c = await page.evaluate(() => getComputedStyle(document.querySelector('.eclatee-couleur')).opacity);
      if (Number(c) < 0.9) R.echec('vue éclatée', `« Réassembler » : croquis en couleurs à ${c}`, lieu('/', '390×844'));
    } finally { await ctx.close(); }
  }
  {
    const { ctx, page } = await contexte({ taille: T('1366×768') });
    try {
      await page.goto(BASE + '/sur-mesure#questions', { waitUntil: 'load' }); await attendrePret(page); await attendre(400);
      await page.click('#question-1 summary'); await attendre(500);
      const ouvert = await page.evaluate(() => document.querySelector('#question-1').open && document.querySelector('#question-1 .faq-reponse').getBoundingClientRect().height > 10);
      await page.click('#question-1 summary'); await attendre(500);
      const ferme = await page.evaluate(() => !document.querySelector('#question-1').open);
      if (!ouvert || !ferme) R.echec('FAQ', `ouverture ${ouvert}, fermeture ${ferme}`, lieu('/sur-mesure', '1366×768'));
    } finally { await ctx.close(); }
  }
}
