/* ============================================================
   Apurbo — Portfolio Scripts
   Theme toggle · Mobile nav · Scroll reveal · Skill bars ·
   Active nav link · Lazy YouTube embed · Contact form
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- Theme toggle (dark default) ---------- */
  var themeToggle = document.getElementById("themeToggle");
  var savedTheme = null;
  try {
    savedTheme = localStorage.getItem("theme");
  } catch (e) {
    /* storage unavailable */
  }
  if (savedTheme === "light" || savedTheme === "dark") {
    root.setAttribute("data-theme", savedTheme);
  }

  themeToggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      /* ignore */
    }
  });

  /* ---------- Mobile hamburger menu ---------- */
  var hamburger = document.getElementById("hamburger");
  var navLinks = document.getElementById("navLinks");

  function closeMenu() {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open menu");
  }

  hamburger.addEventListener("click", function () {
    var isOpen = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    hamburger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  navLinks.addEventListener("click", function (e) {
    if (e.target.tagName === "A") closeMenu();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Navbar scrolled state ---------- */
  var navbar = document.getElementById("navbar");
  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll-triggered reveal + skill bars ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var skillEls = document.querySelectorAll(".skill");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });

    var skillObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var level = entry.target.getAttribute("data-level") || "0";
            entry.target.querySelector(".skill__fill").style.width =
              level + "%";
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    skillEls.forEach(function (el) {
      skillObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
    skillEls.forEach(function (el) {
      el.querySelector(".skill__fill").style.width =
        (el.getAttribute("data-level") || "0") + "%";
    });
  }

  /* ---------- Active nav link highlighting ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var linkMap = {};
  navLinks.querySelectorAll("a[href^='#']").forEach(function (a) {
    linkMap[a.getAttribute("href").slice(1)] = a;
  });

  if ("IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = linkMap[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            Object.keys(linkMap).forEach(function (k) {
              linkMap[k].classList.remove("active");
            });
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach(function (s) {
      sectionObserver.observe(s);
    });
  }

  /* ---------- Lazy YouTube embed (loads iframe only on click) ---------- */
  document
    .querySelectorAll(".video-card__media[data-video-id]")
    .forEach(function (media) {
      media.addEventListener("click", function () {
        if (media.querySelector("iframe")) return;
        var id = media.getAttribute("data-video-id");
        var iframe = document.createElement("iframe");
        iframe.src =
          "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
        iframe.title = "YouTube video player";
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        media.innerHTML = "";
        media.appendChild(iframe);
        media.style.cursor = "default";
      });
    });

  /* ---------- Lazy Facebook video embed (loads iframe only on click) ---------- */
  document
    .querySelectorAll(".video-card__media[data-fb-url]")
    .forEach(function (media) {
      media.addEventListener("click", function () {
        if (media.querySelector("iframe")) return;
        var url = media.getAttribute("data-fb-url");
        var iframe = document.createElement("iframe");
        iframe.src =
          "https://www.facebook.com/plugins/video.php?height=314&href=" +
          encodeURIComponent(url) +
          "&show_text=false&width=560&autoplay=true";
        iframe.title = "Facebook video player";
        iframe.allow = "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        media.innerHTML = "";
        media.appendChild(iframe);
        media.style.cursor = "default";
      });
    });

  /* ---------- Portfolio category filter ---------- */
  var filterButtons = document.querySelectorAll(".portfolio__filter");
  var portfolioCards = document.querySelectorAll("#portfolioGrid [data-category]");

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      var filter = btn.getAttribute("data-filter");
      portfolioCards.forEach(function (card) {
        var show = filter === "all" || card.getAttribute("data-category") === filter;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  form.addEventListener("submit", function () {
    note.textContent = "Opening your email app to send the message…";
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
