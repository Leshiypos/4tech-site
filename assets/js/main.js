document.addEventListener("DOMContentLoaded", () => {
  function cloneWidth(parentSelector, childsSelector) {
    const parent = document.querySelector(parentSelector);
    const children = document.querySelectorAll(childsSelector);
    if (!parent || !children.length) return;

    const width = parent.offsetWidth;
    children.forEach((c) => {
      c.style.width = width + "px";
      c.style.maxWidth = width + "px";
    });
  }

  // универсальный debounce
  function debounce(fn, wait = 150) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(null, args), wait);
    };
  }

  const run = () =>
    cloneWidth(".catalog_section .parent_cl_w", ".catalog_section .child_cl_w");
  //   Клонирование ширитны контейнера секции catalog_section
  run(); // первый запуск
  window.addEventListener("resize", debounce(run, 200), { passive: true });
  //   <------------------------------------------------------->
});
