document.addEventListener("DOMContentLoaded", () => {
  function smoothScroll() {
    // плавный скролл
    const lenis = new Lenis({
      duration: 1.05, // «инерция» (0.6–1.4 — подбирай на вкус)
      smoothWheel: true, // сглаживание колёсика мыши
      smoothTouch: false, // при желании можно включить и для тача
      // orientation: 'vertical', // если понадобится горизонтальный — можно переключать
    });

    // Обновляем ScrollTrigger на каждом «виртуальном» скролле Lenis
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Привязываем Lenis к кадрам анимации (используем GSAP ticker)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Отключаем сглаживание лага GSAP, чтобы не было задержек
    gsap.ticker.lagSmoothing(0);

    // После инициализации — пересчитать все триггеры
    ScrollTrigger.refresh();
  }

  smoothScroll();

  //   <-------------------------------------->
  //   Анмация
  function fadeInAnimation(selector) {
    const banerSections = document.querySelectorAll(selector);
    if (banerSections) {
      banerSections.forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 24,
          duration: 1,
          //   delay: 1,

          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            once: true,
            markers: false,
          },
        });
      });
    }
  }

  function gorizontalSwiper() {
    // Слайдер Комплексные решения
    // Инициализация Swiper (если у тебя уже инициализируется, просто возьми reference)
    const slider = document.querySelector(".solution-slider");
    if (!slider) return;

    const swiper =
      slider.swiper ||
      new Swiper(slider, {
        speed: 400,
        slidesPerView: 1,
        spaceBetween: 15,
        allowTouchMove: true, // на десктопе/широких разрешениях можно оставить свайп
        breakpoints: {
          1001: {
            slidesPerView: 4,
            allowTouchMove: true,
          },
        },
      });

    // Горизонтальный скролл только до 1000px ширины
    const mm = gsap.matchMedia();

    mm.add("(max-width: 1000px)", () => {
      // отключаем ручной свайп — управление будет скроллом страницы
      swiper.allowTouchMove = false;

      const section = document.querySelector(".solution_section .wrap_section"); // пинится весь блок
      const wrapper = slider.querySelector(".swiper-wrapper");

      // На случай, если размеры слайдов подвяжутся к шрифтам/картинкам
      swiper.update();

      const getScrollLength = () => {
        // сдвиг = полная ширина контента минус видимая ширина слайдера
        const length = wrapper.scrollWidth - slider.clientWidth;
        return Math.max(0, length);
      };

      // Анимация «влево» на длину контента
      const tween = gsap.to(wrapper, {
        x: () => -getScrollLength(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "bottom bottom-=120px", // как только секция пришла к верху вьюпорта
          end: () => `+=${getScrollLength()}`, // длина вертикального скролла = горизонтальному пути
          scrub: true,
          pin: section, // пин ВСЕЙ секции, не только слайдера
          anticipatePin: 1,
          invalidateOnRefresh: true, // пересчитать при ресайзе/перезагрузке
          //   markers: true, // включи для отладки
        },
      });

      // На ресайз пересчитываем
      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);

      // cleanup при выходе из медиа-условия
      return () => {
        window.removeEventListener("resize", onResize);
        tween.scrollTrigger && tween.scrollTrigger.kill();
        tween.kill();
        gsap.set(wrapper, { x: 0 });
        swiper.allowTouchMove = true; // возвращаем свайп, если нужно
      };
    });
  }

  //   Секция Все в одном месте
  function initOveryoneHere() {
    const section = document.querySelector("#services.overyone_here_section");
    const swiperEl = section?.querySelector(".overyone_here_slider");
    if (!section || !swiperEl) return;

    // Инициализируем Swiper (без повторной инициализации)
    const swiper =
      swiperEl.swiper ||
      new Swiper(swiperEl, {
        speed: 400,
        slidesPerView: 1,
        spaceBetween: 14,
      });

    const mm = gsap.matchMedia();

    // Горизонтальный скролл только на ширине ≤ 561px
    mm.add("(max-width: 561px)", () => {
      swiper.allowTouchMove = false; // отключаем свайп — управляем скроллом

      const wrapper = swiperEl.querySelector(".swiper-wrapper");

      const getScrollLength = () => {
        // сколько нужно протащить по X
        const len = wrapper.scrollWidth - swiperEl.clientWidth;
        return Math.max(0, len);
      };

      swiper.update(); // пересчитать размеры слайдов

      const tween = gsap.to(wrapper, {
        x: () => -getScrollLength(),
        ease: "none",
        scrollTrigger: {
          trigger: section, // пин всей секции
          start: "bottom bottom-=150px",
          end: () => `+=${getScrollLength()}`,
          scrub: true,
          pin: section,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // markers: true,
        },
      });

      // пересчитать ВСЕ триггеры после создания пина
      ScrollTrigger.refresh();

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);

      // cleanup при выходе из брейкпоинта
      return () => {
        window.removeEventListener("resize", onResize);
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(wrapper, { x: 0 });
        swiper.allowTouchMove = true;
        ScrollTrigger.refresh();
      };
    });
  }

  //   Слайдер Партнеры

  let slider_partners = document.querySelectorAll(".partners_slider");
  if (slider_partners.length) {
    slider_partners.forEach((slider) => {
      new Swiper(slider, {
        speed: 400,
        slidesPerView: 1.4,
        breakpoints: {
          700: {
            slidesPerView: 3.3,
          },
          1000: {
            slidesPerView: 5.3,
          },
        },
      });
    });
  }

  function partnersGorizontalSliders() {
    const cluster = document.querySelector(".partners_cluster");
    if (!cluster) return;
    // получаем высоту кластера
    const clusterHeight = cluster.getBoundingClientRect().height;
    const heightWindow = window.innerHeight;
    const padTrigger = heightWindow - clusterHeight;

    const mm = gsap.matchMedia();
    mm.add("(max-width: 1000px)", () => {
      const sliderEls = Array.from(
        cluster.querySelectorAll(".partners_slider")
      );
      if (!sliderEls.length) return;

      sliderEls.forEach((el) => {
        const sw = el.swiper;
        if (sw) {
          sw.allowTouchMove = false;
          sw.autoplay?.stop?.();
          sw.update();
        }
      });

      const wrappers = sliderEls.map((el) =>
        el.querySelector(".swiper-wrapper")
      );
      const lengths = wrappers.map((w, i) => {
        const container = sliderEls[i];
        return Math.max(0, w.scrollWidth - container.clientWidth);
      });
      const maxLen = Math.max(...lengths, 0);

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: cluster,
          start: `bottom bottom-=210px`,
          end: () => `+=${maxLen}`,
          scrub: true,
          pin: cluster, // пин всего блока с двумя секциями
          anticipatePin: 1,
          invalidateOnRefresh: true,
          //   markers: true,
        },
      });

      wrappers.forEach((w, idx) => tl.to(w, { x: -lengths[idx] }, 0));
      ScrollTrigger.refresh();

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        wrappers.forEach((w) => gsap.set(w, { x: 0 }));
        sliderEls.forEach((el) => {
          const sw = el.swiper;
          if (sw) {
            sw.allowTouchMove = true;
            sw.autoplay?.start?.();
          }
        });
        ScrollTrigger.refresh();
      };
    });
  }
  initOveryoneHere();
  gorizontalSwiper();
  fadeInAnimation(".fade_in");
  partnersGorizontalSliders();
  //   Секция наши клиенты
  let our_clients = document.querySelector(".our_clients_slider");
  if (our_clients) {
    new Swiper(our_clients, {
      speed: 400,
      slidesPerView: 2,
      spaceBetween: 14,
      breakpoints: {
        650: {
          slidesPerView: 3,
        },
        800: {
          slidesPerView: 4,
        },
        1000: {
          slidesPerView: 6,
        },
      },
    });
  }
});
