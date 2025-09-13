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
    input.addEventListener("input", formatInputValue);

    // при смене страны перестраиваем маску и очищаем поле
    input.addEventListener("countrychange", () => {
      // подождём, пока placeholder обновится новой страной
      setTimeout(() => {
        buildMaskFromPlaceholder();
        input.value = "";
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
    // Закрыть после выбора страны

    // Закрыть после выбора страны
  })();
});
