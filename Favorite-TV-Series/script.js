document.addEventListener("DOMContentLoaded", () => {
  //Sticky headerda smooth scroll işlevselliği
  document.querySelectorAll('.menu a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(
        link.getAttribute("href").substring(1)
      );
      if (target)
        window.scrollTo({
          top:
            target.offsetTop -
            (document.getElementById("sticky-header")?.offsetHeight || 0),
          behavior: "smooth",
        });
    });
  });

  // Favori karakter seçme işlevselliği
  const favoriteButtons = document.querySelectorAll(".favorite-button");

  favoriteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("active");
    });
  });

  //Hamburger menü açma ve kapanma
  const menuToggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");

  menuToggle.addEventListener("click", function () {
    menu.classList.toggle("active");
  });
});
