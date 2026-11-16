// ============================================================
// Basma Mohamed Alsayad - Portfolio Scripts
// Night Mode, Color Themes, Animations & Form Handling
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
  var root = document.documentElement;

  // ---------- Dynamic Year in Footer ----------
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ---------- Night Mode (Dark Mode) ----------
  var nightToggle = document.getElementById("nightToggle");
  var modeIcon = nightToggle ? nightToggle.querySelector(".mode-icon") : null;

  function setNightMode(isDark, persist) {
    if (isDark) {
      root.setAttribute("data-mode", "dark");
      if (modeIcon) modeIcon.textContent = "☀️";
      if (nightToggle) {
        nightToggle.setAttribute("aria-label", "Switch to light mode");
        nightToggle.title = "Light mode";
      }
    } else {
      root.removeAttribute("data-mode");
      if (modeIcon) modeIcon.textContent = "🌙";
      if (nightToggle) {
        nightToggle.setAttribute("aria-label", "Switch to night mode");
        nightToggle.title = "Night mode";
      }
    }

    if (persist) {
      try {
        localStorage.setItem("basma_night_mode", isDark ? "dark" : "light");
      } catch (err) {
        console.warn("LocalStorage access error:", err);
      }
    }
  }

  // Check saved preference or system preference
  var savedMode = null;
  try {
    savedMode = localStorage.getItem("basma_night_mode");
  } catch (err) {}

  if (savedMode === "dark") {
    setNightMode(true, false);
  } else if (savedMode === "light") {
    setNightMode(false, false);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setNightMode(true, false);
  }

  if (nightToggle) {
    nightToggle.addEventListener("click", function () {
      var isCurrentlyDark = root.getAttribute("data-mode") === "dark";
      setNightMode(!isCurrentlyDark, true);
    });
  }

  // Listen to system changes if user hasn't explicitly set a preference
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
      var userHasExplicitPref = false;
      try {
        userHasExplicitPref = localStorage.getItem("basma_night_mode") !== null;
      } catch (err) {}
      if (!userHasExplicitPref) {
        setNightMode(e.matches, false);
      }
    });
  }

  // ---------- Color Themes (Blush, Lavender, Sage) ----------
  var swatches = document.querySelectorAll(".sw");

  function setColorTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    swatches.forEach(function (s) {
      s.setAttribute("aria-pressed", s.dataset.theme === theme ? "true" : "false");
    });
    if (persist) {
      try {
        localStorage.setItem("basma_color_theme", theme);
      } catch (err) {}
    }
  }

  var savedColor = null;
  try {
    savedColor = localStorage.getItem("basma_color_theme");
  } catch (err) {}

  if (savedColor && ["blush", "lavender", "sage"].includes(savedColor)) {
    setColorTheme(savedColor, false);
  }

  swatches.forEach(function (sw) {
    sw.addEventListener("click", function () {
      setColorTheme(sw.dataset.theme, true);
    });
  });

  // ---------- Click Sparkles Effect ----------
  var sparkleLayer = document.getElementById("sparkles");
  document.addEventListener("click", function (e) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Don't spawn sparkles directly on interactive buttons to keep clicks clean
    if (e.target.closest("button") || e.target.closest("input") || e.target.closest("textarea")) return;

    for (var i = 0; i < 4; i++) {
      var s = document.createElement("span");
      s.className = "spark";
      s.textContent = i % 2 === 0 ? "✦" : "✧";
      s.style.left = e.clientX + (Math.random() * 44 - 22) + "px";
      s.style.top = e.clientY + (Math.random() * 36 - 18) + "px";
      s.style.fontSize = 12 + Math.random() * 14 + "px";
      sparkleLayer.appendChild(s);

      (function (el) {
        setTimeout(function () {
          el.remove();
        }, 900);
      })(s);
    }
  });

  // ---------- Skills Ribbons ----------
  var skills = [
    { name: "HTML5 & Semantic Markup", level: 90 },
    { name: "Modern CSS & Responsive Design", level: 85 },
    { name: "JavaScript (ES6+)", level: 75 },
    { name: "C++ & Object-Oriented Programming", level: 80 },
    { name: "Data Structures & Problem Solving", level: 75 }
  ];

  var ribbonsBox = document.getElementById("ribbons");
  if (ribbonsBox) {
    skills.forEach(function (s) {
      var r = document.createElement("div");
      r.className = "ribbon";
      r.innerHTML =
        "<b>" + s.name + "</b>" +
        '<div class="track" role="progressbar" aria-valuenow="' + s.level + '" aria-valuemin="0" aria-valuemax="100">' +
          '<span class="fill" data-w="' + s.level + '"></span>' +
        "</div>" +
        "<output>" + s.level + "%</output>";
      ribbonsBox.appendChild(r);
    });

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting) {
          ribbonsBox.querySelectorAll(".fill").forEach(function (f) {
            f.style.width = f.dataset.w + "%";
          });
          obs.disconnect();
        }
      }, { threshold: 0.25 });
      observer.observe(ribbonsBox);
    } else {
      // Fallback if IntersectionObserver is not supported
      ribbonsBox.querySelectorAll(".fill").forEach(function (f) {
        f.style.width = f.dataset.w + "%";
      });
    }
  }

  // ---------- Featured Projects Gallery ----------
  var projects = [
    {
      title: "Personal Profile & Portfolio",
      tags: ["HTML5", "CSS3", "JavaScript"],
      text: "Interactive student profile with real-time themes, full night mode, sparkle effects, and a responsive arch card layout."
    },
    {
      title: "Task Master Web Application",
      tags: ["JavaScript", "LocalStorage", "UI/UX"],
      text: "Dynamic productivity tool with priority filtering, category tags, completion status, and local storage data persistence."
    },
    {
      title: "Student Record Management",
      tags: ["C++", "OOP", "File I/O"],
      text: "Academic management system handling student profiles, GPA calculation, course enrollments, and persistent file records."
    },
    {
      title: "Algorithm Visualizer",
      tags: ["Algorithms", "Data Structures", "Canvas"],
      text: "Visual demonstration tool showcasing sorting algorithms and pathfinding step-by-step with customizable playback speeds."
    }
  ];

  var gallery = document.getElementById("gallery");
  if (gallery) {
    projects.forEach(function (p, i) {
      var card = document.createElement("article");
      card.className = "gcard";

      var tagsHtml = p.tags
        .map(function (tag) {
          return '<span class="tag">' + tag + "</span>";
        })
        .join("");

      card.innerHTML =
        '<div class="gcard-header">' +
          '<span class="num">' + (i + 1) + "</span>" +
          '<div class="gcard-tags">' + tagsHtml + "</div>" +
        "</div>" +
        "<h3>" + p.title + "</h3>" +
        "<p>" + p.text + "</p>";

      gallery.appendChild(card);
    });

    var leftBtn = document.getElementById("left");
    var rightBtn = document.getElementById("right");

    if (leftBtn) {
      leftBtn.addEventListener("click", function () {
        gallery.scrollBy({ left: -290, behavior: "smooth" });
      });
    }

    if (rightBtn) {
      rightBtn.addEventListener("click", function () {
        gallery.scrollBy({ left: 290, behavior: "smooth" });
      });
    }
  }

  // ---------- Active Navigation Highlighting on Scroll ----------
  var navLinks = document.querySelectorAll(".bar nav a");
  var sections = document.querySelectorAll("section[id]");

  function updateActiveNav() {
    var scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    var currentSectionId = "";

    sections.forEach(function (section) {
      var top = section.offsetTop - 140;
      var height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === "#" + currentSectionId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  // ---------- Back to Top Button ----------
  var backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 350) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }, { passive: true });

    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---------- Contact Form Handling & Validation ----------
  var contactForm = document.getElementById("contactForm");
  var nameInput = document.getElementById("name");
  var emailInput = document.getElementById("email");
  var msgInput = document.getElementById("message");
  var formMsg = document.getElementById("formMsg");

  // Clear errors when the user types
  [
    { input: nameInput, err: "nameErr" },
    { input: emailInput, err: "emailErr" },
    { input: msgInput, err: "msgErr" }
  ].forEach(function (field) {
    if (field.input) {
      field.input.addEventListener("input", function () {
        var errEl = document.getElementById(field.err);
        if (errEl) errEl.textContent = "";
      });
    }
  });

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var nameVal = nameInput ? nameInput.value.trim() : "";
      var emailVal = emailInput ? emailInput.value.trim() : "";
      var msgVal = msgInput ? msgInput.value.trim() : "";

      var isValid = true;

      function setError(errId, msg) {
        var el = document.getElementById(errId);
        if (el) el.textContent = msg;
        if (msg) isValid = false;
      }

      // Name validation
      if (nameVal.length < 2) {
        setError("nameErr", "Please enter your name (at least 2 letters).");
      } else {
        setError("nameErr", "");
      }

      // Email validation
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailVal)) {
        setError("emailErr", "Please enter a valid email address.");
      } else {
        setError("emailErr", "");
      }

      // Message validation
      if (msgVal.length < 10) {
        setError("msgErr", "Message must be at least 10 characters.");
      } else {
        setError("msgErr", "");
      }

      if (isValid) {
        if (formMsg) {
          formMsg.className = "success";
          formMsg.textContent = "Thank you, " + nameVal + "! Your note has been received with love ♡";
        }
        contactForm.reset();

        setTimeout(function () {
          if (formMsg) {
            formMsg.textContent = "";
            formMsg.className = "";
          }
        }, 6000);
      } else {
        if (formMsg) {
          formMsg.textContent = "";
          formMsg.className = "";
        }
      }
    });
  }
});
