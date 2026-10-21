(function () {
  "use strict";

  var PLACEHOLDER = "REPLACE_ME";

  var ICONS = {
    qq: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 16 0v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z"/><circle cx="9.2" cy="11.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="14.8" cy="11.5" r="1.1" fill="currentColor" stroke="none"/><path d="M9.5 15.2c1.6 1 3.4 1 5 0"/></svg>',
    gmail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.8 6.8 8.2 6 8.2-6"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.8 6.8 8.2 6 8.2-6"/><path d="M3 18.5h18" opacity="0.45"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 8.84 21.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5A10 10 0 0 0 12 2z"/></svg>',
    bilibili: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="7" width="19" height="12.5" rx="3"/><path d="m7 3.2 3 3.8M17 3.2l-3 3.8"/><circle cx="9" cy="12.6" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="12.6" r="1.2" fill="currentColor" stroke="none"/><path d="M9.6 16.2h4.8"/></svg>'
  };

  var FALLBACK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>';

  function isUnconfigured(value) {
    return typeof value === "string" && value.indexOf(PLACEHOLDER) !== -1;
  }

  function el(tag, className, textContent) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (textContent != null) node.textContent = textContent;
    return node;
  }

  var toastNode = document.getElementById("toast");
  var toastTimer = null;

  function showToast(message) {
    toastNode.textContent = message;
    toastNode.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastNode.classList.remove("is-visible");
    }, 2600);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(area);
      }
    });
  }

  function buildCard(link) {
    var unconfigured = isUnconfigured(link.url) || isUnconfigured(link.handle);

    var item = el("li", "link-item");
    if (unconfigured) item.classList.add("is-unconfigured");

    var anchor = el("a", "link-card");
    anchor.href = unconfigured ? "#" : link.url;
    anchor.target = unconfigured ? "_self" : "_blank";
    anchor.rel = "noopener noreferrer";
    if (unconfigured) anchor.setAttribute("aria-disabled", "true");

    var iconBox = el("span", "link-icon link-icon--" + link.id);
    iconBox.innerHTML = ICONS[link.icon] || FALLBACK_ICON;

    var textBox = el("span", "link-text");
    textBox.appendChild(el("span", "link-label", link.label));
    textBox.appendChild(el("span", "link-handle", link.handle));
    textBox.appendChild(el("span", "link-desc", link.description));

    anchor.appendChild(iconBox);
    anchor.appendChild(textBox);

    if (unconfigured) {
      anchor.addEventListener("click", function (event) {
        event.preventDefault();
        showToast("这一项还没配置，请编辑 js/config.js 里的 REPLACE_ME");
      });
    }

    item.appendChild(anchor);

    if (link.copyText) {
      var copyButton = el("button", "copy-button", "复制");
      copyButton.type = "button";
      copyButton.setAttribute("aria-label", "复制 " + link.label + " 地址");
      copyButton.addEventListener("click", function () {
        if (isUnconfigured(link.copyText)) {
          showToast("地址还是占位符，先在 js/config.js 里填真实信息");
          return;
        }
        copyToClipboard(link.copyText).then(
          function () { showToast("已复制 " + link.copyText); },
          function () { showToast("复制失败，请手动选中地址"); }
        );
      });
      item.appendChild(copyButton);
    }

    return item;
  }

  function renderProfile(profile) {
    document.getElementById("profile-name").textContent = profile.name;
    document.getElementById("profile-title").textContent = profile.title;
    document.getElementById("profile-bio").textContent = profile.bio;
    document.getElementById("footer-name").textContent = profile.name;
    document.title = profile.name + " · 个人主页";
  }

  function applyReveal() {
    var profileNodes = document.querySelectorAll(".profile-name, .profile-title, .profile-bio");
    var profileDelays = [0.18, 0.34, 0.5];
    profileNodes.forEach(function (node, i) {
      node.classList.add("reveal");
      node.style.setProperty("--d", profileDelays[i] + "s");
    });

    var title = document.querySelector(".section-title");
    if (title) {
      title.classList.add("reveal");
      title.style.setProperty("--d", "0.78s");
    }

    var footer = document.querySelector(".site-footer");
    if (footer) {
      footer.classList.add("reveal");
      footer.style.setProperty("--d", "1.15s");
    }

    var items = document.querySelectorAll(".link-item");
    var batch = 0;
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("reveal");
          entry.target.style.setProperty("--d", (0.9 + batch * 0.1) + "s");
          batch++;
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.15 });
      items.forEach(function (item) { observer.observe(item); });
    } else {
      items.forEach(function (item, i) {
        item.classList.add("reveal");
        item.style.setProperty("--d", (0.9 + i * 0.1) + "s");
      });
    }
  }

  function init() {
    var config = window.SITE_CONFIG;
    if (!config) {
      showToast("读取不到 js/config.js");
      return;
    }

    renderProfile(config.profile);

    var list = document.getElementById("link-list");
    var fragment = document.createDocumentFragment();
    config.links.forEach(function (link) {
      fragment.appendChild(buildCard(link));
    });
    list.appendChild(fragment);

    document.getElementById("year").textContent = String(new Date().getFullYear());

    applyReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
