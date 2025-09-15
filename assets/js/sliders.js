document.addEventListener("DOMContentLoaded", () => {
  // Слайдер Комплексные решения
  let sliders_stripe = document.querySelectorAll(".solution-slider");

  if (sliders_stripe.length) {
    sliders_stripe.forEach((slider) => {
      new Swiper(slider, {
        speed: 400,
        slidesPerView: 4,
      });
    });
  }

  //   Слайдер Партнеры
  let slider_partners = document.querySelectorAll(".partners_slider");

  if (slider_partners.length) {
    slider_partners.forEach((slider) => {
      new Swiper(slider, {
        speed: 400,
        slidesPerView: 5.3,
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
