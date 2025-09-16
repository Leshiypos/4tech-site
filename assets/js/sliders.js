document.addEventListener("DOMContentLoaded", () => {
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
          start: "bottom bottom-=50px", // как только секция пришла к верху вьюпорта
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
  gorizontalSwiper();
  fadeInAnimation(".fade_in");

  //   Слайдер Партнеры
  let slider_partners = document.querySelectorAll(".partners_slider");

  if (slider_partners.length) {
    slider_partners.forEach((slider) => {
      new Swiper(slider, {
        speed: 400,
        slidesPerView: 2.4,
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
  //   let sliders_section = document.querySelectorAll(
  //     ".slider_section .img_slider"
  //   );

  //   if (sliders_section) {
  //     sliders_section.forEach((slider) => {
  //       new Swiper(slider, {
  //         speed: 400,
  //         loop: true,
  //         slidesPerView: "auto",
  //         spaceBetween: 10,
  //       });
  //     });
  //   }

  //   //   Блок новости
  //   let news_section = document.querySelectorAll(
  //     ".news_section .swiper.news_slider"
  //   );
  //   if (news_section) {
  //     news_section.forEach((slider) => {
  //       new Swiper(slider, {
  //         speed: 400,
  //         slidesPerView: 1.3,
  //         spaceBetween: 16,
  //         breakpoints: {
  //           530: {
  //             spaceBetween: 36,
  //           },

  //           1000: {
  //             slidesPerView: 3,
  //           },
  //         },
  //       });
  //     });
  //   }
});
