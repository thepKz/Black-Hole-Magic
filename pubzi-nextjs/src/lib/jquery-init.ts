/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}

export function initJQueryPlugins() {
  if (typeof window === 'undefined' || !window.$) return;

  const $ = window.$;
  const $documentOn = $(document);
  const $windowOn = $(window);

  // Mobile Menu
  $('#mobile-menu').meanmenu({
    meanMenuContainer: '.mobile-menu',
    meanScreenWidth: "1199",
    meanExpand: ['<i class="far fa-plus"></i>'],
  });

  $('#mobile-menus').meanmenu({
    meanMenuContainer: '.mobile-menus',
    meanScreenWidth: "1920",
    meanExpand: ['<i class="far fa-plus"></i>'],
  });

  // Sidebar Toggle
  $(".offcanvas__close,.offcanvas__overlay").on("click", function () {
    $(".offcanvas__info").removeClass("info-open");
    $(".offcanvas__overlay").removeClass("overlay-open");
  });

  $(".sidebar__toggle").on("click", function () {
    $(".offcanvas__info").addClass("info-open");
    $(".offcanvas__overlay").addClass("overlay-open");
  });

  // Body Overlay
  $(".body-overlay").on("click", function () {
    $(".offcanvas__area").removeClass("offcanvas-opened");
    $(".df-search-area").removeClass("opened");
    $(".body-overlay").removeClass("opened");
  });

  // Sticky Header
  $windowOn.on("scroll", function (this: Window) {
    if ($(this).scrollTop() > 250) {
      $("#header-sticky").addClass("sticky");
    } else {
      $("#header-sticky").removeClass("sticky");
    }
  });

  // Video/Image Popup
  $(".img-popup").magnificPopup({
    type: "image",
    gallery: {
      enabled: true,
    },
  });

  $(".img-popup2").magnificPopup({
    type: "image",
    gallery: {
      enabled: true,
    },
  });

  $(".video-popup").magnificPopup({
    type: "iframe",
    callbacks: {},
  });

  // Counter Up
  $(".gt-count").counterUp({
    delay: 15,
    time: 4000,
  });

  // Wow Animation
  if (typeof window !== 'undefined' && (window as any).WOW) {
    new (window as any).WOW().init();
  }

  // Nice Select
  if ($('.single-select').length) {
    $('.single-select').niceSelect();
  }

  // Parallaxie
  if ($('.parallaxie').length) {
    $('.parallaxie').parallaxie({
      speed: 0.5,
      offset: 0,
    });
  }

  // Back to Top
  const progressPath = document.querySelector('.gt-back-to-top path') as SVGPathElement;
  if (progressPath) {
    const pathLength = progressPath.getTotalLength();
    progressPath.style.transition = progressPath.style.webkitTransition = 'none';
    progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
    progressPath.style.strokeDashoffset = String(pathLength);
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.webkitTransition = 'stroke-dashoffset 10ms linear';

    const updateProgress = function () {
      const scroll = $(window).scrollTop() || 0;
      const height = $(document).height() - $(window).height();
      const progress = pathLength - (scroll * pathLength / height);
      progressPath.style.strokeDashoffset = String(progress);
    };

    updateProgress();
    $(window).scroll(updateProgress);

    const offset = 50;
    const duration = 550;

    $(window).on('scroll', function (this: Window) {
      if ($(this).scrollTop() > offset) {
        $('.gt-back-to-top').addClass('show');
      } else {
        $('.gt-back-to-top').removeClass('show');
      }
    });

    $('.gt-back-to-top').on('click', function (event: any) {
      event.preventDefault();
      $('html, body').animate({ scrollTop: 0 }, duration);
      return false;
    });
  }
}
