// SOFAO — comportements du site
document.addEventListener("DOMContentLoaded", function () {
  // Ferme le menu mobile après un clic sur un lien
  document.querySelectorAll(".mobile-menu nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      var menu = link.closest(".mobile-menu");
      if (menu) menu.removeAttribute("open");
    });
  });

  // Diaporama des chantiers sur l'accueil
  var slider = document.querySelector(".hero-slider");
  if (slider) {
    var slides = slider.querySelectorAll(".slide");
    var dotsBox = slider.querySelector(".slider-dots");
    var current = 0, timer = null;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    slides.forEach(function (s, i) {
      var d = document.createElement("button");
      d.type = "button";
      d.setAttribute("role", "tab");
      d.setAttribute("aria-label", "Photo " + (i + 1));
      d.addEventListener("click", function () { show(i); restart(); });
      dotsBox.appendChild(d);
    });
    var dots = dotsBox.querySelectorAll("button");
    function show(i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle("is-active", k === current); });
      dots.forEach(function (d, k) { d.setAttribute("aria-selected", k === current ? "true" : "false"); });
    }
    function restart() {
      clearInterval(timer);
      if (!reduce && slides.length > 1) timer = setInterval(function () { show(current + 1); }, 5000);
    }
    slider.querySelector(".prev").addEventListener("click", function () { show(current - 1); restart(); });
    slider.querySelector(".next").addEventListener("click", function () { show(current + 1); restart(); });
    slider.addEventListener("mouseenter", function () { clearInterval(timer); });
    slider.addEventListener("mouseleave", restart);
    var x0 = null;
    slider.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { show(current + (dx < 0 ? 1 : -1)); restart(); }
      x0 = null;
    });
    if (slides.length < 2) { slider.querySelector(".prev").hidden = true; slider.querySelector(".next").hidden = true; }
    show(0); restart();
  }

  // Formulaire de contact : prépare un e-mail dans la messagerie du visiteur
  var form = document.querySelector(".contact-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;

    var data = new FormData(form);
    var name = (data.get("name") || "").toString().trim();
    var phone = (data.get("phone") || "").toString().trim();
    var service = (data.get("service") || "Non précisé").toString();
    var message = (data.get("message") || "").toString().trim();

    var subject = "Demande de devis — " + service + " — " + name;
    var body =
      "Nom : " + name + "\n" +
      "Téléphone : " + phone + "\n" +
      "Service recherché : " + service + "\n\n" +
      "Projet :\n" + message + "\n";

    window.location.href =
      "mailto:contact@sofaordc.com" +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  });
});
