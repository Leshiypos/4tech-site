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

  if (window.innerWidth > 1000) {
    console.log("Мягкий сролл включен");
    smoothScroll();
  }

  //   <-------------------------------------->
  //   Анмация
  function fadeInAnimation(selector, position = 90) {
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
            start: `top ${position}%`,
            once: true,
            markers: false,
          },
        });
      });
    }
  }
  //   <-------------------------------------->
  //   отслеживание положения секции и переключение главного меню

  function abserveSectionPosition(idSectionSelector) {
    const trigger = document.getElementById(`${idSectionSelector}`);
    const liMenu = document.querySelector(
      `.main_menu [href="#${idSectionSelector}"]`
    );

    ScrollTrigger.create({
      trigger: trigger,
      start: "30% bottom",
      end: "bottom bottom",
      // markers: true,
      onEnter: () => {
        document.querySelectorAll(".main_menu .active").forEach((li) => {
          li.classList.remove("active");
        });

        liMenu?.classList.add("active");
      },
      onEnterBack: () => {
        document.querySelectorAll(".main_menu .active").forEach((li) => {
          li.classList.remove("active");
        });
        liMenu?.classList.add("active");
      },
    });
  }

  function abserveSectionPositionBeginer(idSectionSelector) {
    const trigger = document.getElementById(`${idSectionSelector}`);

    ScrollTrigger.create({
      trigger: trigger,
      start: "bottom+=10px bottom",
      end: "bottom bottom",
      // markers: true,
      onEnter: () => {
        document.querySelectorAll(".main_menu .active").forEach((li) => {
          li.classList.remove("active");
        });
      },
      onEnterBack: () => {
        document.querySelectorAll(".main_menu .active").forEach((li) => {
          li.classList.remove("active");
        });
      },
    });
  }
  if (window.innerWidth > 1000) {
    abserveSectionPositionBeginer("begin");
    abserveSectionPosition("about");
    abserveSectionPosition("services");
    abserveSectionPosition("soft");
    abserveSectionPosition("equipment");
    abserveSectionPosition("protect");
    abserveSectionPosition("outsourcing");
    abserveSectionPosition("solution");
    abserveSectionPosition("development");
    abserveSectionPosition("partners");
    abserveSectionPosition("solutions");
    abserveSectionPosition("contacts");
  }
  //   отслеживание положения секции и переключение главного меню
  //   <-------------------------------------->

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
          start: "top top+=50px", // как только секция пришла к верху вьюпорта
          end: () => `+=${getScrollLength()}`, // длина вертикального скролла = горизонтальному пути
          scrub: true,
          pin: section, // пин ВСЕЙ секции, не только слайдера
          anticipatePin: 1,
          invalidateOnRefresh: true, // пересчитать при ресайзе/перезагрузке
          //   markers: true, // включи для отладки
        },
      });

      const onRefreshInit = () => swiper.update();
      ScrollTrigger.addEventListener("refreshInit", onRefreshInit);

      // cleanup при выходе из медиа-условия
      return () => {
        ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
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
          trigger: wrapper, // пин всей секции
          start: "top top+=50px",
          end: () => `+=${getScrollLength()}`,
          scrub: true,
          pin: section,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          //   markers: true,
        },
      });

      const onRefreshInit = () => swiper.update();
      ScrollTrigger.addEventListener("refreshInit", onRefreshInit);

      // cleanup при выходе из брейкпоинта
      return () => {
        ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(wrapper, { x: 0 });
        swiper.allowTouchMove = true;
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
        autoplay: {
          delay: 5000,
        },
        breakpoints: {
          700: {
            slidesPerView: 3.3,
          },
          1000: {
            slidesPerView: 5.3,
            loop: true,
            autoplay: {
              delay: 5000,
            },
          },
        },
      });
    });
  }

  function partnersGorizontalSliders() {
    const cluster = document.querySelector(".partners_cluster");
    if (!cluster) return;

    const mm = gsap.matchMedia();
    mm.add("(max-width: 3000px)", () => {
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
      const getLengthFor = (index) => {
        const wrapper = wrappers[index];
        const container = sliderEls[index];
        if (!wrapper || !container) return 0;
        return Math.max(0, wrapper.scrollWidth - container.clientWidth);
      };
      const getMaxLen = () =>
        wrappers.reduce((max, _, idx) => Math.max(max, getLengthFor(idx)), 0);

      const updateSwipers = () => {
        sliderEls.forEach((el) => {
          const sw = el.swiper;
          sw?.update?.();
        });
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: cluster,
          start: `top top+=70px`,
          end: () => `+=${getMaxLen()}`,
          scrub: 1,
          pin: cluster, // пин всего блока с двумя секциями
          anticipatePin: 1,
          pinSpacing: true,
          invalidateOnRefresh: true,
        },
      });
      // крутится прямо
      wrappers.forEach((w, idx) =>
        tl.to(w, { x: () => -getLengthFor(idx) }, 0)
      );
      // врутится обратно
      //   wrappers.forEach((w, idx) =>
      //     tl.fromTo(
      //       w,
      //       { x: () => -getLengthFor(idx) }, // стартуем с правого края
      //       { x: 0, immediateRender: false }, // едем к левому (нормальному) положению
      //       0
      //     )
      //   );

      ScrollTrigger.addEventListener("refreshInit", updateSwipers);
      tl.scrollTrigger?.refresh();

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", updateSwipers);
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
      };
    });
  }
  if (window.innerWidth < 1001) {
    initOveryoneHere();
    gorizontalSwiper();
    partnersGorizontalSliders();
  }
  fadeInAnimation(".fade_in");
  fadeInAnimation(".fade_in_fast", 95);

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
