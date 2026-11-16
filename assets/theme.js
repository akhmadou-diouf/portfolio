/* Applique le thème avant l'affichage pour éviter un flash de couleur */
(function () {
  var t = null;
  try { t = localStorage.getItem("theme"); } catch (e) {}
  if (t !== "dark" && t !== "light") {
    t = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.setAttribute("data-theme", t);
  document.documentElement.classList.add("js");
  // Filet de sécurité : si le script principal ne démarre pas, on affiche tout le contenu
  setTimeout(function () {
    if (!document.documentElement.classList.contains("main-ok")) document.documentElement.classList.remove("js");
  }, 2500);
})();
