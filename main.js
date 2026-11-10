/* Enzo Létocart · portfolio */
(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* Nav border once scrolled */
  const nav = document.querySelector(".nav");
  const onNav = () => nav && nav.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onNav, { passive: true }); onNav();

  /* Soft orange glow that follows the cursor */
  const glow = document.querySelector(".glow");
  if (glow && !reduced) {
    window.addEventListener("pointermove", e => {
      glow.style.setProperty("--mx", e.clientX + "px");
      glow.style.setProperty("--my", e.clientY + "px");
    }, { passive: true });
  }

  /* Card spotlight */
  document.querySelectorAll(".card").forEach(c => c.addEventListener("pointermove", e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty("--cx", e.clientX - r.left + "px");
    c.style.setProperty("--cy", e.clientY - r.top + "px");
  }));

  /* Scroll reveal (content stays visible if anything fails) */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduced) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(el => io.observe(el));
  } else reveals.forEach(el => el.classList.add("in"));

  /* Stopwatch: 15 minutes down to 0.4 s */
  const watch = document.getElementById("watch");
  if (watch) {
    const bar = document.getElementById("watch-bar");
    const fmt = v => {
      const m = Math.floor(v / 60), s = v - m * 60;
      return `${String(m).padStart(2, "0")}:${s.toFixed(1).padStart(4, "0")}`;
    };
    const finish = () => { watch.textContent = "00:00.4"; watch.classList.add("done"); bar.style.transform = "scaleX(0.01)"; };
    const run = () => {
      if (reduced) return finish();
      const start = performance.now(), dur = 2400;
      const step = now => {
        const p = clamp((now - start) / dur, 0, 1);
        const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        const v = 900 - (900 - 0.4) * e;
        watch.textContent = fmt(v);
        bar.style.transform = `scaleX(${Math.max(v / 900, 0.01)})`;
        p < 1 ? requestAnimationFrame(step) : finish();
      };
      requestAnimationFrame(step);
    };
    if ("IntersectionObserver" in window) {
      const wo = new IntersectionObserver(([en]) => { if (en.isIntersecting) { wo.disconnect(); setTimeout(run, 300); } }, { threshold: 0.5 });
      wo.observe(watch);
    } else finish();
  }

  /* Statement: words light up while scrolling */
  const statement = document.getElementById("statement");
  let words = [];
  const split = () => {
    if (!statement) return;
    statement.innerHTML = statement.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(" ");
    words = [...statement.querySelectorAll(".w")];
    light();
  };
  const light = () => {
    if (!words.length) return;
    const r = statement.getBoundingClientRect(), vh = window.innerHeight;
    const p = reduced ? 1 : clamp((vh * 0.9 - r.top) / (r.height + vh * 0.35), 0, 1);
    const n = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle("on", i < n));
  };
  window.addEventListener("scroll", light, { passive: true });

  /* EN / FR */
  const FR = {
    "nav.work": "Projets", "nav.path": "Parcours", "nav.contact": "Contact",
    "hero.eyebrow": "Apprenti ingénieur en informatique · CESI",
    "hero.sub": "Je développe des <em>applications</em>, des outils d'<em>automatisation</em> et des <em>outils de données</em>, surtout en Python et Node.js.",
    "hero.avail": "Disponible pour un stage de 3 mois à partir de mai 2027",
    "hero.cta1": "Voir mes projets", "hero.cta2": "Télécharger mon CV",
    "work.title": "Projets",
    "work.note": "Mon alternance se déroule dans un environnement Défense : je ne peux montrer ni captures ni données. Je détaillerai volontiers la partie technique en entretien.",
    "tag.index": "Indexation", "tag.dataviz": "Visualisation de données",
    "p1.title": "Moteur de recherche indexé pour archives de fichiers",
    "p1.desc": "Trouver un fichier dans les archives passait par une recherche Windows de 5 à 15 minutes, à chaque fois. J'ai écrit un indexeur en Python qui parcourt les archives une fois et se met à jour tout seul, avec une interface de recherche en PyQt. Les résultats arrivent maintenant presque instantanément.",
    "p1.label": "Temps de recherche", "p1.before": "avant · 5–15 min", "p1.after": "après · &lt; 1 s",
    "p2.title": "Cartes interactives & tableaux de bord",
    "p2.desc": "Des cartes interactives pour explorer des données, avec des graphes pour les lire d'un coup d'œil et des exports pour les réutiliser dans d'autres outils.",
    "p3.title": "Outils d'automatisation",
    "p3.desc": "Des scripts et petits outils qui suppriment les étapes manuelles répétitives du traitement de données, pour que l'équipe passe son temps sur l'analyse plutôt que sur le copier-coller.",
    "about.title": "Profil",
    "about.statement": "On me donne en général un objectif et quelques pistes, pas un cahier des charges. Je trouve le reste : je lis la doc, je teste, je livre une première version, puis je l'améliore avec ceux qui l'utilisent.",
    "about.p1": "Je suis élève ingénieur en 4e année d'informatique au CESI, en alternance. En entreprise, je développe des logiciels en autonomie ; à l'école, j'apprends à travailler en équipe, à découper un projet et à le livrer ensemble.",
    "about.p2": "J'utilise des outils de code assistés par IA tous les jours pour aller plus vite. Je reste responsable de chaque ligne : je la lis, je la teste et je comprends pourquoi elle marche.",
    "skills.title": "Compétences",
    "sk.dev": "Développement", "sk.tools": "Outils", "sk.ai": "Outils de code IA",
    "sk.areas": "Domaines", "sk.a1": "Applications", "sk.a2": "Automatisation", "sk.a3": "Traitement de données", "sk.a4": "Cartographie & dataviz",
    "sk.lang": "Langues", "l.fr": "Français", "l.native": "natif", "l.es": "Espagnol", "l.en": "Anglais",
    "path.title": "Parcours", "now": "aujourd'hui",
    "r1.t": "Apprenti ingénieur logiciel", "r1.o": "Établissement Géographique Interarmées · Armées françaises · stage (mai–août 2025), puis alternance",
    "r4.t": "Assistant informatique (stage, 2 mois)",
    "r5.t": "Maître-nageur", "r5.o": "Piscine d'Ozoir-la-Ferrière · en parallèle des études",
    "r2.t": "Diplôme d'ingénieur en informatique", "r2.o": "CESI École d'Ingénieurs · alternance",
    "k.work": "Expérience", "k.edu": "Formation",
    "beyond.title": "Hors écran",
    "beyond.big": "Ancien nageur de <em>haut niveau.</em>",
    "beyond.p1": "J'ai nagé aux Championnats de France Élite et remporté des médailles aux Championnats de France Juniors. Des années de réveils à l'aube m'ont appris ce qu'est un travail régulier.",
    "beyond.p2": "Aujourd'hui : triathlon et tennis.",
    "contact.eyebrow": "Stage · à partir de mai 2027",
    "contact.big": "Parlons<em>-en.</em>",
    "foot.free": "Freelance : petites applis dès 500 € →",
    /* freelance page */
    "fl.back": "← Portfolio",
    "fl.eyebrow": "Freelance · petites applis & outils",
    "fl.h1a": "Petites applis,", "fl.h1b": "bien faites<i>.</i>",
    "fl.sub": "Un process lent, un tableur qui déborde, une idée d'appli simple ? Je la développe proprement, à <em>prix fixe</em>.",
    "fl.cta": "Décrire mon projet",
    "fl.what": "Ce que je fais",
    "fl.c1t": "Outils internes", "fl.c1d": "Une petite appli web pour remplacer un Excel partagé ou un process papier.",
    "fl.c2t": "Automatisation", "fl.c2d": "Des scripts qui font à votre place les tâches répétitives : fichiers, exports, rapports.",
    "fl.c3t": "Cartes & données", "fl.c3d": "Cartes interactives et tableaux de bord pour visualiser vos données.",
    "fl.c4t": "Sites simples", "fl.c4d": "Une page claire et rapide, sans template générique.",
    "fl.how": "Déroulé",
    "fl.s1t": "Vous décrivez", "fl.s1d": "Un e-mail avec votre besoin, même en vrac.",
    "fl.s2t": "Je chiffre", "fl.s2d": "Un prix fixe et un délai, avant de commencer.",
    "fl.s3t": "Je développe", "fl.s3d": "Avec des points réguliers pour montrer l'avancée.",
    "fl.s4t": "Je livre", "fl.s4d": "L'outil, le code et une explication.",
    "fl.price": "Tarif", "fl.from": "à partir de",
    "fl.pnote": "Le prix final dépend de ce que l'appli doit faire. Vous le connaissez avant que je commence.",
    "fl.big": "Votre <em>projet ?</em>",
  };

  const CV = { en: "cv/Enzo-Letocart-CV-EN.pdf", fr: "cv/Enzo-Letocart-CV-FR.pdf" };
  const nodes = document.querySelectorAll("[data-i18n]");
  nodes.forEach(n => (n.dataset.en = n.innerHTML));
  const btn = document.getElementById("lang");
  let lang = localStorage.getItem("lang") || (navigator.language || "en").slice(0, 2);
  if (lang !== "fr") lang = "en";

  function apply() {
    document.documentElement.lang = lang;
    nodes.forEach(n => {
      const k = n.dataset.i18n;
      n.innerHTML = lang === "fr" && FR[k] ? FR[k] : n.dataset.en;
    });
    document.querySelectorAll(".cv-link").forEach(a => (a.href = CV[lang]));
    if (btn) btn.textContent = lang === "fr" ? "EN" : "FR";
    split();
  }
  if (btn) btn.addEventListener("click", () => {
    lang = lang === "fr" ? "en" : "fr";
    localStorage.setItem("lang", lang);
    apply();
  });
  apply();
})();
