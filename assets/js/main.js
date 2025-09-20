document.addEventListener("DOMContentLoaded", () => {
  // preloader

  if (document.getElementById("preloader")) {
    document.body.style.overflow = "hidden";
    const loader = () => {
      document.body.style.overflow = "";
      const preloader = document.getElementById("preloader");
      const fadeout = setInterval(() => {
        const opacity = getComputedStyle(preloader).opacity;
        opacity > 0
          ? (preloader.style.opacity = opacity - 0.1)
          : (clearInterval(fadeout), preloader.remove());
      }, 15);
    };

    setTimeout(() => loader(), 2000);
  }
  // конец preloader

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
  //   Проверка номера
  //   Проверка номера
  (function () {
    const input = document.querySelector("#number");
    const hidden = document.querySelector("#phone_e164");
    const error = document.querySelector("#phone_error");
    const form = document.querySelector("#custom-contact-form");
    if (!input || !form) return;

    const iti = window.intlTelInput(input, {
      initialCountry: "ru",
      preferredCountries: ["by", "ru", "ua", "pl", "de"],
      separateDialCode: true,
      nationalMode: true, // вводим национальный номер
      autoPlaceholder: "aggressive", // пример номера -> плейсхолдер
      formatOnDisplay: true,
      useFullscreenPopup: false,
      // важно: та же UMD-версия utils, что и в index.html
      utilsScript:
        "https://cdn.jsdelivr.net/npm/intl-tel-input@23.7.4/build/js/utils.js?1688124762000",
    });

    // ------- Маска по плейсхолдеру -------
    let maskTemplate = ""; // напр. "(29) 123-45-67" -> "(__) ___-__-__" внутренне
    let maxDigits = 15; // фактическая длина цифр для выбранной страны

    function buildMaskFromPlaceholder() {
      const ph = input.getAttribute("placeholder") || "";
      const digitMatches = ph.match(/\d/g);
      if (!digitMatches || digitMatches.length === 0) return false;

      maxDigits = digitMatches.length;
      maskTemplate = ph.replace(/\d/g, "_");
      input.setAttribute("maxlength", String(maskTemplate.length)); // ограничим по длине отображаемой строки
      return true;
    }

    // ждём, когда utils подставит пример номера в placeholder
    (function waitForPlaceholder(tries = 0) {
      if (buildMaskFromPlaceholder()) return;
      if (tries > 60) return; // ~3 сек. максимум
      setTimeout(() => waitForPlaceholder(tries + 1), 50);
    })();

    function applyMask(digitsOnly) {
      const digits = digitsOnly.replace(/\D+/g, "").slice(0, maxDigits);

      // Если цифр нет — поле должно стать ПУСТЫМ (никаких "(" или "+")
      if (digits.length === 0) return "";

      // Префикс до первого символа ввода (например, "(" или "+375 ")
      const firstIdx = maskTemplate.indexOf("_");
      let out = firstIdx > 0 ? maskTemplate.slice(0, firstIdx) : "";
      let di = 0;

      // Заполняем начиная с первой "_"
      for (let i = Math.max(firstIdx, 0); i < maskTemplate.length; i++) {
        const ch = maskTemplate[i];
        if (ch === "_") {
          if (di < digits.length) out += digits[di++];
          else break; // закончились цифры — не тянем хвост фикс-символов
        } else {
          out += ch; // фикс-символы между цифрами ( ) - пробел и т.п.
        }
      }
      return out;
    }

    function formatInputValue() {
      // чистим всё, кроме цифр; накладываем маску
      const digits = input.value.replace(/\D+/g, "");
      input.value = applyMask(digits);
      error.style.display = "none";
      input.classList.remove("has-error");
    }

    // ------- Фильтрация ввода -------
    // полностью блокируем ввод нецифровых символов с клавиатуры
    input.addEventListener("beforeinput", (e) => {
      // разрешаем только цифры и действия удаления/вставки
      if (e.inputType === "insertText" && /\D/.test(e.data || "")) {
        e.preventDefault();
      }
    });

    // форматируем при любом изменении (включая paste/drag&drop)
    // input.addEventListener("input", formatInputValue);

    // при смене страны перестраиваем маску и очищаем поле
    input.addEventListener("countrychange", () => {
      // подождём, пока placeholder обновится новой страной
      setTimeout(() => {
        buildMaskFromPlaceholder();
        input.value = "";
        input.click();
        input.focus();
      }, 0);
    });

    // ------- Отправка формы -------
    form.addEventListener("submit", (e) => {
      const e164 = iti.getNumber(); // всегда с "+"
      const isValid = iti.isValidNumber();

      if (!isValid) {
        e.preventDefault();
        error.style.display = "block";
        input.classList.add("has-error");
        input.focus();
        return;
      }
      hidden.value = e164;
    });
  })();

  //   Проверка номера POPUP
  (function () {
    const input = document.querySelector("#number_popup");
    const hidden = document.querySelector("#phone_e164_popUp");
    const error = document.querySelector("#phone_error_popup");
    const form = document.querySelector("#custom-contact-form-popup");
    if (!input || !form) return;

    const iti = window.intlTelInput(input, {
      initialCountry: "ru",
      preferredCountries: ["by", "ru", "ua", "pl", "de"],
      separateDialCode: true,
      nationalMode: true, // вводим национальный номер
      autoPlaceholder: "aggressive", // пример номера -> плейсхолдер
      formatOnDisplay: true,
      useFullscreenPopup: false,
      // важно: та же UMD-версия utils, что и в index.html
      utilsScript:
        "https://cdn.jsdelivr.net/npm/intl-tel-input@23.7.4/build/js/utils.js?1688124762000",
    });

    // ------- Маска по плейсхолдеру -------
    let maskTemplate = ""; // напр. "(29) 123-45-67" -> "(__) ___-__-__" внутренне
    let maxDigits = 15; // фактическая длина цифр для выбранной страны

    function buildMaskFromPlaceholder() {
      const ph = input.getAttribute("placeholder") || "";
      const digitMatches = ph.match(/\d/g);
      if (!digitMatches || digitMatches.length === 0) return false;

      maxDigits = digitMatches.length;
      maskTemplate = ph.replace(/\d/g, "_");
      input.setAttribute("maxlength", String(maskTemplate.length)); // ограничим по длине отображаемой строки
      return true;
    }

    // ждём, когда utils подставит пример номера в placeholder
    (function waitForPlaceholder(tries = 0) {
      if (buildMaskFromPlaceholder()) return;
      if (tries > 60) return; // ~3 сек. максимум
      setTimeout(() => waitForPlaceholder(tries + 1), 50);
    })();

    function applyMask(digitsOnly) {
      const digits = digitsOnly.replace(/\D+/g, "").slice(0, maxDigits);
      let di = 0,
        out = "";

      for (let i = 0; i < maskTemplate.length; i++) {
        const ch = maskTemplate[i];
        if (ch === "_") {
          if (di < digits.length) out += digits[di++];
          else break; // дальше не заполняем
        } else {
          // фиксированные символы (скобки/пробелы/дефисы и т.п.)
          if (di > 0 || i === 0) out += ch;
        }
      }
      return out;
    }

    function formatInputValue() {
      // чистим всё, кроме цифр; накладываем маску
      const digits = input.value.replace(/\D+/g, "");
      input.value = applyMask(digits);
      error.style.display = "none";
      input.classList.remove("has-error");
    }

    // ------- Фильтрация ввода -------
    // полностью блокируем ввод нецифровых символов с клавиатуры
    input.addEventListener("beforeinput", (e) => {
      // разрешаем только цифры и действия удаления/вставки
      if (e.inputType === "insertText" && /\D/.test(e.data || "")) {
        e.preventDefault();
      }
    });

    // форматируем при любом изменении (включая paste/drag&drop)
    // input.addEventListener("input", formatInputValue);

    // при смене страны перестраиваем маску и очищаем поле
    input.addEventListener("countrychange", () => {
      // подождём, пока placeholder обновится новой страной
      setTimeout(() => {
        buildMaskFromPlaceholder();
        input.value = "";
        input.click();
        input.focus();
      }, 0);
    });

    // ------- Отправка формы -------
    form.addEventListener("submit", (e) => {
      const e164 = iti.getNumber(); // всегда с "+"
      const isValid = iti.isValidNumber();

      if (!isValid) {
        e.preventDefault();
        error.style.display = "block";
        input.classList.add("has-error");
        input.focus();
        return;
      }
      hidden.value = e164;
    });
  })();
  //   Работа с popUp
  function popUpControl() {
    const popUp = document.getElementById("popup-overlay");
    const burgerMenu = document.getElementById("burger-menu");
    //   popUp.classList.add("hidden");
    window.addEventListener("click", (e) => {
      // .e.preventDefault();
      const targetClose = e.target.closest("[data-close-popup]");
      const targetOpen = e.target.closest("[data-open-popup]");
      if (targetClose) {
        popUp.classList.add("hidden");
      }
      if (targetOpen) {
        e.preventDefault();
        popUp.classList.remove("hidden");
        burgerMenu ? burgerMenu.classList.remove("active") : null;
      }
    });
  }
  popUpControl();

  function bergerMenuControl() {
    const burgerMenu = document.getElementById("burger-menu");
    if (!burgerMenu) return;
    window.addEventListener("click", (e) => {
      const btnToggleMenu = e.target.closest("[data-toggle-menu]");
      const linkBurger = e.target.closest("[data-link-burger]");
      if (btnToggleMenu) {
        console.log("нажал");
        burgerMenu.classList.toggle("active");
      }
      if (linkBurger) {
        burgerMenu.classList.remove("active");
      }
    });
  }
  bergerMenuControl();
});

// отложенный автоплей

window.addEventListener("load", () => {
  console.log("Старница загружена");
  document.querySelectorAll('[data-autoplay="delay"]').forEach((video) => {
    video.setAttribute("preload", "auto");
    video.muted = true; // обязательно для autoplay
    video.setAttribute("autoplay", "autoplay");
    video.load(); // перезапускаем загрузку

    video
      .play()
      .then(() => console.log("Видео запустилось:", video))
      .catch((err) => console.warn("Автозапуск заблокирован:", err));
  });
});
