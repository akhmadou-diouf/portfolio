    (() => {
      "use strict";
      document.documentElement.classList.add("main-ok");

      /* ---------- Langue (FR par défaut, EN sur en.html) ---------- */
      const EN = document.documentElement.lang === "en";
      const T = EN ? {
        menuOpen: "Open menu", menuClose: "Close menu",
        themeDark: "Switch to dark mode", themeLight: "Switch to light mode",
        who: "akhmadou — MSc Cybersecurity (Y1) @ Efrei Paris",
        agents: "● active (running) — 3 agents connected",
        nids: "✓ NIDS up — af-packet",
        goalCmd: "$ echo $GOAL",
        goal: "3-6 month internship / work-study in cybersecurity",
        formError: "Please enter your name, a valid email and a message.",
        formOk: "Opening your email client…",
        formSending: "Sending…",
        formSent: "Thank you! Your message has been sent. I'll get back to you soon.",
        formFail: "Sending failed. Please email me directly at ",
        copied: "Email address copied ✓",
        copyFail: "Email: ",
        idStatus: "> identity verified — access granted ✓"
      } : {
        menuOpen: "Ouvrir le menu", menuClose: "Fermer le menu",
        themeDark: "Activer le mode sombre", themeLight: "Activer le mode clair",
        who: "akhmadou — M1 Cybersécurité @ Efrei Paris",
        agents: "● active (running) — 3 agents connectés",
        nids: "✓ NIDS opérationnel — af-packet",
        goalCmd: "$ echo $OBJECTIF",
        goal: "Stage 3-6 mois / alternance en cybersécurité",
        formError: "Merci de renseigner votre nom, un email valide et un message.",
        formOk: "Ouverture de votre messagerie…",
        formSending: "Envoi en cours…",
        formSent: "Merci ! Votre message a bien été envoyé, je vous réponds rapidement.",
        formFail: "L'envoi a échoué. Écrivez-moi directement à ",
        copied: "Adresse e-mail copiée ✓",
        copyFail: "E-mail : ",
        idStatus: "> identité vérifiée — accès autorisé ✓"
      };

      /* ---------- Thème clair / sombre ---------- */
      const root = document.documentElement;
      const themeBtn = document.querySelector(".theme-toggle");
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      const applyTheme = (t) => {
        root.setAttribute("data-theme", t);
        const dark = t === "dark";
        themeBtn.setAttribute("aria-pressed", String(dark));
        themeBtn.setAttribute("aria-label", dark ? T.themeLight : T.themeDark);
        if (metaTheme) metaTheme.setAttribute("content", dark ? "#17110F" : "#FAF6F0");
      };
      applyTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light");
      themeBtn.addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        try { localStorage.setItem("theme", next); } catch (e) {}
      });

      /* ---------- Année du footer ---------- */
      document.getElementById("year").textContent = new Date().getFullYear();

      /* ---------- Navigation : fond au scroll ---------- */
      const nav = document.getElementById("nav");
      const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 12);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });

      /* ---------- Menu mobile ---------- */
      const toggle = document.getElementById("navToggle");
      const links  = document.getElementById("navLinks");
      const setMenu = (open) => {
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? T.menuClose : T.menuOpen);
        links.classList.toggle("is-open", open);
      };
      toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
      links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
      document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

      /* ---------- Lien actif selon la section visible ---------- */
      const navAnchors = [...links.querySelectorAll('a[href^="#"]')];
      const sections = navAnchors.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
      const spy = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          navAnchors.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id));
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach(s => spy.observe(s));

      /* ---------- Apparition au scroll ---------- */
      const revealObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add("is-visible"); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));

      /* ---------- Carte profil : statut tapé + inclinaison 3D ---------- */
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const idStatus = document.getElementById("idStatus");
      const idcard = document.getElementById("idcard");
      if (idStatus) {
        if (reduced) idStatus.textContent = T.idStatus;
        else {
          let c = 0;
          const tick = () => {
            idStatus.textContent = T.idStatus.slice(0, ++c);
            if (c < T.idStatus.length) setTimeout(tick, 28 + Math.random() * 40);
          };
          setTimeout(tick, 1400);
        }
      }
      if (idcard && !reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        idcard.addEventListener("mousemove", (e) => {
          const r = idcard.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          idcard.style.setProperty("--ry", ((px - .5) * 10).toFixed(2) + "deg");
          idcard.style.setProperty("--rx", ((.5 - py) * 8).toFixed(2) + "deg");
          idcard.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
          idcard.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
        });
        idcard.addEventListener("mouseleave", () => {
          idcard.style.setProperty("--rx", "0deg"); idcard.style.setProperty("--ry", "0deg");
        });
      }

      /* ---------- Terminal animé (version « terminal », contenu statique) ---------- */
      const term = document.getElementById("terminal");
      if (term) {
        const lines = [
          { t: "p",    s: "$ whoami" },
          { t: "",     s: T.who },
          { t: "p",    s: "$ systemctl status wazuh-manager" },
          { t: "ok",   s: T.agents },
          { t: "p",    s: "$ suricata --list-runmodes | head -1" },
          { t: "ok",   s: T.nids },
          { t: "p",    s: "$ tail -n1 /var/log/suricata/fast.log" },
          { t: "warn", s: "[**] ET SCAN Possible Nmap scan [**]" },
          { t: "p",    s: T.goalCmd },
          { t: "",     s: T.goal }
        ];
        const cursor = document.createElement("span");
        cursor.className = "cursor";
        const addLine = (cls) => {
          const div = document.createElement("div");
          if (cls) div.className = cls;
          term.appendChild(div);
          return div;
        };
        if (reduced) {
          lines.forEach(l => { addLine(l.t).textContent = l.s; });
          term.appendChild(cursor);
        } else {
          let i = 0;
          const typeLine = () => {
            if (i >= lines.length) { term.appendChild(cursor); return; }
            const { t, s } = lines[i++];
            const el = addLine(t);
            if (t !== "p") { el.textContent = s; el.appendChild(cursor); setTimeout(typeLine, 380); return; }
            let c = 0;
            const tick = () => {
              el.textContent = s.slice(0, ++c);
              el.appendChild(cursor);
              if (c < s.length) setTimeout(tick, 32 + Math.random() * 40);
              else setTimeout(typeLine, 260);
            };
            tick();
          };
          setTimeout(typeLine, 700);
        }
      }

      /* ---------- Filtres de la veille ---------- */
      const filterBtns = document.querySelectorAll(".filter");
      const newsCards = document.querySelectorAll(".news-card");
      filterBtns.forEach(btn => btn.addEventListener("click", () => {
        const f = btn.dataset.filter;
        filterBtns.forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
        newsCards.forEach(card => { card.hidden = f !== "all" && card.dataset.cat !== f; });
      }));

      /* ---------- Curseur "cyber" ---------- */
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (finePointer && !reduced) {
        const ret   = document.querySelector(".cy-reticle");
        const dot   = document.querySelector(".cy-dot");
        const label = document.querySelector(".cy-label");
        const LOCKABLE = "a, button, select, .badge";
        const DARK_ALWAYS = ".contact, .idcard, .terminal, .project__visual, .news-card__visual";
        const DARK_LIGHTMODE = DARK_ALWAYS + ", .btn--primary, .nav__cta, .filter[aria-pressed=\"true\"]";
        const HEX = "0123456789ABCDEF";
        const SIZE = 36, PAD = 6;

        let mx = -100, my = -100, started = false, locked = null, dark = false;
        let cx = mx, cy = my, cw = SIZE, ch = SIZE;   // état interpolé du viseur
        let lastBit = 0, bx = 0, by = 0;
        const pad = n => String(Math.max(0, Math.round(n))).padStart(4, "0");

        const spawn = (cls, x, y, extra) => {
          const el = document.createElement("span");
          el.className = cls;
          el.style.setProperty("--x", x + "px");
          el.style.setProperty("--y", y + "px");
          if (extra) extra(el);
          el.addEventListener("animationend", () => el.remove(), { once: true });
          document.body.appendChild(el);
        };

        window.addEventListener("mousemove", (e) => {
          mx = e.clientX; my = e.clientY;
          if (!started) { cx = mx - SIZE / 2; cy = my - SIZE / 2; started = true; }
          root.classList.add("has-cursor");
          root.style.setProperty("--mx", mx + "px");
          root.style.setProperty("--my", my + "px");
          dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;

          const t = e.target;
          locked = t.closest(LOCKABLE);
          dark = !!t.closest(root.getAttribute("data-theme") === "dark" ? DARK_ALWAYS : DARK_LIGHTMODE);
          root.classList.toggle("cy-lock", !!locked);
          root.classList.toggle("cy-dark", dark);
          root.classList.toggle("cy-text", !!t.closest("input, textarea"));

          // Traînée de caractères (limitée en fréquence et en distance)
          const now = performance.now();
          if (now - lastBit > 45 && Math.hypot(mx - bx, my - by) > 14 && !t.closest("input, textarea")) {
            lastBit = now; bx = mx; by = my;
            spawn("cy-bit" + (dark ? " cy-dark-bit" : ""), mx + 8, my + 6, el => {
              el.textContent = Math.random() < .5 ? (Math.random() < .5 ? "0" : "1")
                                                  : HEX[Math.floor(Math.random() * 16)] + HEX[Math.floor(Math.random() * 16)];
              el.style.setProperty("--dx", (Math.random() * 16 - 8) + "px");
            });
          }
        }, { passive: true });

        document.addEventListener("mouseleave", () => root.classList.remove("has-cursor"));
        window.addEventListener("mousedown", (e) => {
          if (!e.target.closest("input, textarea")) spawn("cy-ping", e.clientX, e.clientY);
        });

        const loop = () => {
          let tx, ty, tw, th;
          if (locked && document.body.contains(locked)) {
            const r = locked.getBoundingClientRect();     // le viseur s'ajuste à la cible
            tx = r.left - PAD; ty = r.top - PAD; tw = r.width + PAD * 2; th = r.height + PAD * 2;
            const txt = (locked.getAttribute("aria-label") || locked.textContent || "").trim().replace(/\s+/g, " ").slice(0, 22);
            label.textContent = "LOCK ▸ " + (txt || locked.tagName.toLowerCase());
          } else {
            tx = mx - SIZE / 2; ty = my - SIZE / 2; tw = SIZE; th = SIZE;
            label.textContent = `x:${pad(mx)} y:${pad(my)}`;
          }
          const k = locked ? 0.22 : 0.28;
          cx += (tx - cx) * k; cy += (ty - cy) * k; cw += (tw - cw) * k; ch += (th - ch) * k;
          ret.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
          ret.style.width = cw + "px"; ret.style.height = ch + "px";
          label.style.transform = `translate3d(${cx + cw + 6}px, ${cy + ch + 4}px, 0)`;
          requestAnimationFrame(loop);
        };
        loop();
      }

      /* ---------- Copie de l'adresse e-mail au clic ---------- */
      const toast = document.getElementById("toast");
      let toastTimer;
      const showToast = (msg) => {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add("is-shown");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("is-shown"), 2600);
      };
      const copyText = async (text) => {
        try { await navigator.clipboard.writeText(text); return true; } catch (e) {}
        try {                                   // repli pour les navigateurs plus anciens
          const ta = document.createElement("textarea");
          ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
          document.body.appendChild(ta); ta.select();
          const ok = document.execCommand("copy"); ta.remove(); return ok;
        } catch (e) { return false; }
      };
      document.querySelectorAll("[data-copy]").forEach(el => el.addEventListener("click", async (e) => {
        e.preventDefault();
        const addr = el.dataset.copy;
        showToast((await copyText(addr)) ? T.copied : T.copyFail + addr);
      }));

      /* ---------- Formulaire de contact (envoi via Formspree) ---------- */
      const form = document.getElementById("contactForm");
      const status = document.getElementById("formStatus");
      const submitBtn = form.querySelector('button[type="submit"]');
      const TO = "akhmadoudiouf.pro@gmail.com";
      const clean = (v, max) => String(v || "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
      const setStatus = (msg, kind) => {
        status.textContent = msg;
        status.style.color = kind === "ok" ? "#5E7A52" : kind === "err" ? "#B5674D" : "var(--muted)";
      };
      const configured = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(form.action) && !form.action.includes("VOTRE_ID");

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (form.elements["_gotcha"].value) return;           // robot détecté (honeypot)
        if (!form.checkValidity()) { setStatus(T.formError, "err"); form.reportValidity(); return; }

        const name    = clean(form.name.value, 80);
        const company = clean(form.company.value, 80);
        const email   = clean(form.email.value, 120);
        const subject = clean(form.subject.value, 60);
        const message = String(form.message.value).trim().slice(0, 2000);

        // Formspree pas encore configuré : repli sur la messagerie du visiteur
        if (!configured) {
          const body = `${message}\n\n—\n${name}${company ? " · " + company : ""}\n${email}`;
          setStatus(T.formOk, "ok");
          window.location.href = `mailto:${TO}?subject=${encodeURIComponent(subject + " — " + name)}&body=${encodeURIComponent(body)}`;
          return;
        }

        submitBtn.disabled = true;
        setStatus(T.formSending);
        try {
          const res = await fetch(form.action, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ name, company, email, subject, message, _subject: `${subject} — ${name}`, _replyto: email })
          });
          if (!res.ok) throw new Error("HTTP " + res.status);
          setStatus(T.formSent, "ok");
          form.reset();
        } catch (err) {
          setStatus(T.formFail + TO, "err");
        } finally {
          submitBtn.disabled = false;
        }
      });
    })();
