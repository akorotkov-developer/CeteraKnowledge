$(document).foundation();

function handleStartPosition() {
  let leftStartOffset = Math.max(10, $(window).width() / 2 - 600),
    widthOfSlide = $(document).find(".compare__slide").innerWidth();
  $(document).find(".acc__cell,.bike__slide").width(widthOfSlide);
  $(document).find(".compare__wrap").css("left", leftStartOffset + "px");
  $(document).find(".bike").css("padding-left", leftStartOffset + "px");
}

function isInViewportX(elem) {
  let bounding = elem.getBoundingClientRect();
  return bounding.left >= 0 && bounding.right <= (window.innerWidth || document.documentElement.clientWidth);
}

function checkVisibilityOfSlidesAndInfo() {
  $(document).find(".compare__slide").each(function () {
    $(this).removeClass("compare__slide_out");

    if (!isInViewportX($(this)[0])) {
      $(this).addClass("compare__slide_out");
    }
  });
  $(document).find(".acc__cell").each(function () {
    $(this).removeClass("acc__cell_out");

    if (!isInViewportX($(this)[0])) {
      $(this).addClass("acc__cell_out");
    }
  });
  $(document).find(".bike__slide").each(function () {
    $(this).removeClass("bike__slide_out");

    if (!isInViewportX($(this)[0])) {
      $(this).addClass("bike__slide_out");
    }
  });
}

function updateCompare() {
  handleStartPosition();
  checkVisibilityOfSlidesAndInfo();
}

(function($) {
  "use strict";
  $(function() {
    //begin of button tab activity
    $(document).click(function(e) {
      var $currItem = $(e.target).closest(".button_tab");
      if ($currItem.length) {
        var idOfTab = $currItem.data("href");
        var $panelActive = $(idOfTab);
        var $sliders = $panelActive.find(".slick-slider");
        $currItem.siblings().removeClass("js-open");
        $currItem.addClass("js-open");
        $panelActive.siblings().removeClass("is-active");
        $panelActive.addClass("is-active");
        $sliders.addClass("js-invisible");
        $sliders.slick("slickNext");
        $sliders.slick("slickPrev");

        setTimeout(function() {
          $sliders.removeClass("js-invisible");
        }, 500);
        e.preventDefault();
      }
    });
    //end of button tab activity
    //begin of checkbox all activity
    $(".step_all .step__input").change(function() {
      if (this.checked) {
        $(this)
          .closest(".step")
          .parent()
          .find(".step__input")
          .prop("checked", false);
        $(this).prop("checked", true);
      }
    });
    //end of checkbox all activity
    //begin of .params activity
    $(document).click(function(e) {
      var $currItem = $(e.target).closest(".params__title");
      if ($currItem.length) {
        let $currFitBlock = $currItem.closest(".params");
        $currFitBlock.toggleClass("js-active");
        $("#filter-left").toggleClass("hide-for-small-only");
        Foundation.reInit("slider");
        $(".slider").each(function() {
          let $input = $(this)
            .prev()
            .find("input")
            .eq(0);
          let currInputValue = $input.val();
          let currBlock = $(this);
          setTimeout(function() {
            let mySlider = new Foundation.Slider(currBlock, {
              initialStart: ++currInputValue
            });
          }, 100);
          setTimeout(function() {
            let mySlider = new Foundation.Slider(currBlock, {
              initialStart: --currInputValue
            });
          }, 150);
        });
      }
    });
    //end of .params activity
    //begin of .fit activity script
    $(document).click(function(e) {
      var $currItem = $(e.target).closest(".fit__title");
      if ($currItem.length) {
        let $currFitBlock = $currItem.closest(".fit");
        $currFitBlock.toggleClass("js-active");
        $currFitBlock.find(".fit__menu").toggleClass("hide");
      }
    });
    $(document).click(function(e) {
      var $currItem = $(e.target).closest(".partners__link");
      if ($currItem.length) {
        let currText = $currItem.text();
        $(".fit__name").text(currText);
        $(".fit").removeClass("js-active");
        $(".fit__menu").addClass("hide");
        $(".partners__link_active").removeClass("partners__link_active");
        $currItem.addClass("partners__link_active");
      }
    });
    //end of .fit activity script
    //begin of equalize height of flag blocks
    function equalizeHeightOfFlagBlocks() {
      let $currBlocks = $(".flag");
      let $currProdBlock = $currBlocks.closest(".grid-x").find(".prod");
      if (!$currProdBlock.length) {
        return;
      }
      let heightOfNeighborBlocks =
        $currProdBlock.height() +
        $currProdBlock.css("padding-top").slice(0, -2) -
        $currBlocks.css("padding-top").slice(0, -2) -
        $currBlocks.css("padding-bottom").slice(0, -2);
      $currBlocks.height(heightOfNeighborBlocks);
    }
    $(document).ready(function() {
      equalizeHeightOfFlagBlocks();
    });
    var myEfficientFn = debounce(function() {
      equalizeHeightOfFlagBlocks();
    }, 100);
    window.addEventListener("resize", myEfficientFn);
    //end of equalize height of flag blocks
    //begin of debounce function
    function debounce(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this,
          args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    }

    //end of debounce function
    //begin of slider help function add min and max value
    $(document).ready(function() {
      sliderShowMaxAndMinValues();
    });
    function sliderShowMaxAndMinValues() {
      $(".slider").each(function() {
        let minValue = $(this).attr("data-start");
        let maxValue = $(this).attr("data-end");
        $(this).append(
          `<div class="slider__min">${minValue}</div><div class="slider__max">${maxValue}</div>`
        );
      });
    }
    //end of slider help function add min and max value

    //begin of .sort block show/hide info
    $(document).click(function(e) {
      var $currItem = $(e.target).closest(".sort_mini");
      if ($currItem.length) {
        $currItem.toggleClass("js-open");
      }
    });
    jQuery(document).on("click", function(e) {
      var el = ".sort_mini";
      if (jQuery(e.target).closest(el).length) return;

      $(el).removeClass("js-open");

      $(el).removeClass("js-open");
    });
    //end of .sort block show/hide info
    //begin of custom file upload activity
    $(".file__input").bind("change", function() {
      var filename = $(this).val();

      if (/^\s*$/.test(filename)) {
        $(".file").removeClass("active");
        $(".file__button span").text("Фото товара");
      } else {
        $(".file").addClass("active");
        $(".file__button span").text(filename.replace("C:\\fakepath\\", ""));
      }
    });
    //end of custom file upload activity
    //begin of blade slider
    let topOffsetOfSliderDots = -170;

    function slickDotsSlider() {
      $(".blade").each(function() {
        let $blockDots = $(this).find(".slick-dots");
        if (!$blockDots.closest(".slick__wrap").length) {
          $blockDots.wrap("<div class='slick__wrap'></div>");
        }

        var currHeight = $blockDots.closest(".slick__wrap").height();

        var trueHeight = $blockDots.height();

        if (trueHeight < currHeight) {
          return;
        }
        $(this)
          .find(".slick__up,.slick__down")
          .remove();
        $(this).append(
          '<div class="slick__down "><svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L7 7L13 1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>  </svg></div><div class="slick__up hide"><svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L7 7L13 1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>  </svg></div>'
        );

        $(document).click(function(e) {
          var $currItem = $(e.target).closest(".slick__down,.slick__up");
          if ($currItem.length) {
            let $dots = $currItem.closest(".slick-slider").find(".slick-dots");
            if (!$dots.length) {
              return;
            }
            let sign = 1;
            if ($currItem.hasClass("slick__up")) {
              sign = -1;
            }
            let currPos =
              +$dots.css("top").slice(0, -2) + topOffsetOfSliderDots * sign;
            if (-1 * currPos > trueHeight - currHeight) {
              $currItem
                .closest(".blade")
                .find(".slick__down")
                .addClass("hide");
            } else {
              $currItem
                .closest(".blade")
                .find(".slick__down")
                .removeClass("hide");
            }
            if (currPos >= 0) {
              $currItem
                .closest(".blade")
                .find(".slick__up")
                .addClass("hide");
            } else {
              $currItem
                .closest(".blade")
                .find(".slick__up")
                .removeClass("hide");
            }

            $dots.attr("style", `top:${currPos}px;`);
          }
        });
      });
    }
    function backgroundForDotsSlider() {
      $(".blade").each(function() {
        $(this)
          .find(".blade__slide")
          .each(function(index) {
            let imgSrc = $(this)
              .find(">img")
              .attr("src");
            let $youtubeBlock = $(this).find(".youtube__main");
            let $button = $(this)
              .closest(".blade")
              .find(".slick-dots  li")
              .eq(index)
              .find("button");
            if ($youtubeBlock.length) {
              imgSrc =
                "https://img.youtube.com/vi/" +
                $youtubeBlock.attr("data-embed") +
                "/sddefault.jpg";
              $button.addClass("js-youtube");
            } else if (imgSrc === undefined) {
              imgSrc = "./images/3d.svg";
            }

            $button.attr("style", `background-image:url(${imgSrc})`);
          });
      });
    }
    $(".blade").on("init", function(event, slick) {
      backgroundForDotsSlider();
      slickDotsSlider();
    });
    $(window).resize(function() {
      backgroundForDotsSlider();
      slickDotsSlider();
    });
    $(".blade").slick({
      infinite: false,
      dots: true,
      arrows: true,
      autoplay: false,
      autoplaySpeed: 5000,
      slidesToShow: 1,
      autoplayHoverPause: true,
      fade: false,
      swipeToSlide: true,
      prevArrow:
        '<svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="slick-prev"><path d="M9 1L1 9L9 17" stroke="#929A9C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      nextArrow:
        '<svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="slick-next"><path d="M9 1L1 9L9 17" stroke="#929A9C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      responsive: [
        {
          breakpoint: 640,
          settings: {
            dots: false
          }
        }
      ]
    });

    //end of blade slider
    //begin of youtube lazy load
    (function() {
      var youtube = document.querySelectorAll(".youtube__main");

      for (var i = 0; i < youtube.length; i++) {
        var source =
          "https://img.youtube.com/vi/" +
          youtube[i].dataset.embed +
          "/sddefault.jpg";

        var image = new Image();
        image.src = source;
        image.addEventListener(
          "load",
          (function() {
            youtube[i].appendChild(image);
          })(i)
        );

        youtube[i].addEventListener("click", function() {
          var iframe = document.createElement("iframe");

          iframe.setAttribute("frameborder", "0");
          iframe.setAttribute("allowfullscreen", "");
          iframe.setAttribute(
            "src",
            "https://www.youtube.com/embed/" +
              this.dataset.embed +
              "?rel=0&showinfo=0&autoplay=1"
          );

          this.innerHTML = "";
          this.appendChild(iframe);
        });
      }
    })();
    //end of youtube lazy load
    //begin of viewport checker function
    var isInViewportX = function(elem) {
      var bounding = elem.getBoundingClientRect();
      return (
        bounding.left >= 0 &&
        bounding.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    };
    //end of viewport checker function
    //begin of .switch activity
    $(document).click(function(e) {
      var $currItem = $(e.target).closest(".switch__info");
      if ($currItem.length) {
        $currItem
          .closest(".switch")
          .find("label")
          .trigger("click");
      }
    });
    //end of .switch activity
    //begin of .acc activity
    $(document).click(function(e) {
      var $currItem = $(e.target).closest(".acc__title");
      if ($currItem.length) {
        $currItem.closest(".acc").toggleClass("is-active");
        $currItem
          .closest(".acc")
          .find(".acc__content")
          .slideToggle();
      }
    });
    //end of .acc activity
    //begin of .compare__wrap activity

    $(window).resize(function() {
      handleStartPosition();
    });
    $(document).ready(function() {
      handleStartPosition();
      checkVisibilityOfSlidesAndInfo();
      toggleStickyPanel();
    });
    $(window).scroll(function() {
      toggleStickyPanel();
    });

    let currLeftOffset = 0;
    let $motionBlocks = $(".compare__carousel,.acc__row,.bike__wrap");

    function toggleStickyPanel() {
      var $currSlide = $(".prod__slide");
      if (!$currSlide.length) {
        return;
      }
      var offsetOfImg = $currSlide.offset().top + $currSlide.height();

      if (window.pageYOffset > offsetOfImg) {
        $(".bike").fadeIn();
      } else {
        $(".bike").fadeOut(0);
      }

      checkVisibilityOfSlidesAndInfo();
    }
    $(document).click(function(e) {
      var $currItem = $(e.target).closest(".compare__arr_right");
      if (!$currItem.length) {
        return;
      }
      slideGoToNext(true);
      checkVisibilityOfArrowsIfNeed();
    });
    function slideGoToNext(isNext) {
      var widthOfSlide = $(".compare__slide").innerWidth();
      if (isNext) {
        currLeftOffset = currLeftOffset - widthOfSlide;
      } else {
        currLeftOffset = currLeftOffset + widthOfSlide;
      }

      $motionBlocks.attr(
        "style",
        "transform:translateX(" + currLeftOffset + "px)"
      );
      setTimeout(function() {
        checkVisibilityOfSlidesAndInfo();
      }, 400);
    }
    $(document).click(function(e) {
      var $currItem = $(e.target).closest(".compare__arr_left");
      if (!$currItem.length) {
        return;
      }
      slideGoToNext(false);
      checkVisibilityOfArrowsIfNeed();
    });

    function checkVisibilityOfArrowsIfNeed() {
      var widthOfSlide = $(".compare__slide").innerWidth();
      var fullWidth =
        widthOfSlide * $(".compare__slide").length -
        Math.min($(window).width() / 2 + 600, $(".compare").width()) +
        50;
      var numOfFullSlides = Math.ceil(fullWidth / widthOfSlide);
      var roundLeftOffset = numOfFullSlides * -widthOfSlide;
      if (currLeftOffset < 0) {
        $(".compare__arr_left").removeClass("hide");
      } else {
        $motionBlocks.attr("style", "transform:translateX(0px)");
        $(".compare__arr_left").addClass("hide");
      }

      if (-fullWidth < currLeftOffset) {
        $(".compare__arr_right").removeClass("hide");
      } else {
        $motionBlocks.attr(
          "style",
          "transform:translateX(" + roundLeftOffset + "px)"
        );
        currLeftOffset = roundLeftOffset;
        $(".compare__arr_right").addClass("hide");
      }
    }
    var compareBlock = document.querySelector(".compare");
    if (compareBlock) {
      compareBlock.addEventListener("touchstart", handleTouchStart, false);
      compareBlock.addEventListener("touchmove", handleTouchMove, false);
    }

    var xDown = null;
    var yDown = null;

    function getTouches(evt) {
      return (
        evt.touches || evt.originalEvent.touches // browser API
      ); // jQuery
    }

    function handleTouchStart(evt) {
      const firstTouch = getTouches(evt)[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
    }

    function handleTouchMove(evt) {
      if (!xDown || !yDown) {
        return;
      }

      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;

      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        var widthOfSlide = $(".compare__slide").innerWidth();
        if (xDiff > 0) {
          slideGoToNext(true);
        } else {
          slideGoToNext(false);
        }
        checkVisibilityOfSlidesAndInfo();
        checkVisibilityOfArrowsIfNeed();
      }
      xDown = null;
      yDown = null;
    }
    //end of .compare__wrap activity
    //begin of preloader
    function loadData() {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, 2000);
      });
    }

    loadData().then(() => {
      let preloaderEl = document.querySelector(".preloader");
      if (preloaderEl) {
        preloaderEl.classList.add("hide");
      }
    });
    //end of preloader
    //begin of truncate text

    function ellipsizeTextBox(className) {
      $(className).each(function() {
        var el = $(this)[0];
        var wordArray = el.innerHTML.split(" ");
        while (el.scrollHeight > el.offsetHeight) {
          wordArray.pop();
          el.innerHTML = wordArray.join(" ") + "&hellip;";
        }
      });
    }
    if ($(".manual__title").length) {
      ellipsizeTextBox(".manual__title");
    }

    //end of truncate text
    //begin of equalize .js-equalize-
    function setHeight() {
      for (var i = 1; i < 5; i++) {
        $(".js-equalize-" + i).css("height", "auto");
        var maxHeight2 = Math.max.apply(
          null,
          $(".js-equalize-" + i)
            .map(function() {
              return $(this).height();
            })
            .get()
        );
        $(".js-equalize-" + i).height(maxHeight2);
      }
    }
    $(window).on("load", function() {
      setHeight();
    });
    $(window).on("resize", function() {
      setHeight();
    });
    $(document).ready(function() {
      setHeight();
    });
    //end of equalize .js-equalize-
    //begin of .header__toggle activity show/hide menu and other

    $(document).click(function(e) {
      if ($(e.target).closest(".header__toggle").length) {
        $(e.target)
          .closest(".header__toggle")
          .toggleClass("js-open");
        if ($(".header__toggle.js-open").length) {
          $(".header__toggle path:nth-child(1)").attr(
            "transform",
            "rotate(45 7 7)"
          );
          $(".header__toggle path:nth-child(2)").attr(
            "transform",
            "rotate(-45 17 6)"
          );
        } else {
          $(".header__toggle path:nth-child(1)").attr("transform", "");
          $(".header__toggle path:nth-child(2)").attr("transform", "");
        }

        $(".tractor").toggleClass("js-open");
        $("#card").toggleClass("hide-for-small-only");
        $("#search").addClass("hide");
      }
    });
    $('.tractor__item:not("is-active")').click(function(e) {
      var $currItem = $(this);
      var idOfPanel = $(this).data("tab");

      if ($currItem) {
        $(".tractor__item").removeClass("is-active");
        $currItem.addClass("is-active");
        $(".tractor__panel.is-active").removeClass("is-active");
        $("#" + idOfPanel).addClass("is-active");
      }
    });
    jQuery(document).on("click", function(e) {
      var el = ".header";
      if (jQuery(e.target).closest(el).length) return;
      $(".tractor").removeClass("js-open");
      $(".header__toggle").removeClass("js-open");
      $(".header__toggle path:nth-child(1)").attr("transform", "");
      $(".header__toggle path:nth-child(2)").attr("transform", "");
    });
    jQuery(document).on("click", function(e) {
      var el = ".header";
      if (jQuery(e.target).closest(el).length) return;

      $("#search").addClass("hide");
    });
    //end of .header__toggle activity show/hide menu and other
    //begin of .prove slider
    $(".prove").slick({
      infinite: false,
      dots: false,
      arrows: false,
      autoplay: false,
      autoplaySpeed: 5000,
      slidesToShow: 3,
      autoplayHoverPause: true,
      fade: false,
      swipeToSlide: true,
      responsive: [
        ,
        {
          breakpoint: 960,
          settings: {
            variableWidth: true,
            centerMode: false,
            slidesToShow: 1
          }
        }
      ]
    });
    //end of .prove slider
    //begin of .cert slider
    $(".cert").slick({
      infinite: true,
      dots: false,
      arrows: true,
      autoplay: false,
      autoplaySpeed: 5000,

      autoplayHoverPause: true,
      fade: false,
      swipeToSlide: true,
      prevArrow:
        '<svg width="70" height="70" viewBox="0 0 70 70" class="slick-prev" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="35" cy="35" r="35" transform="rotate(-180 35 35)" fill="transparent"/><path fill-rule="evenodd" clip-rule="evenodd" d="M34.0571 45.2762C34.5778 45.7969 35.4221 45.7969 35.9428 45.2762C36.4635 44.7555 36.4635 43.9113 35.9428 43.3906L28.8856 36.3334H44.3333C45.0697 36.3334 45.6666 35.7365 45.6666 35.0001C45.6666 34.2637 45.0697 33.6667 44.3333 33.6667H28.8856L35.9428 26.6096C36.4635 26.0889 36.4635 25.2446 35.9428 24.7239C35.4221 24.2032 34.5778 24.2032 34.0571 24.7239L24.7238 34.0573C24.2031 34.578 24.2031 35.4222 24.7238 35.9429L34.0571 45.2762Z" fill="#000"/></svg>',
      nextArrow:
        '<svg width="70" height="70" viewBox="0 0 70 70" class="slick-next" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="35" cy="35" r="35" transform="rotate(-180 35 35)" fill="transparent"/><path fill-rule="evenodd" clip-rule="evenodd" d="M34.0571 45.2762C34.5778 45.7969 35.4221 45.7969 35.9428 45.2762C36.4635 44.7555 36.4635 43.9113 35.9428 43.3906L28.8856 36.3334H44.3333C45.0697 36.3334 45.6666 35.7365 45.6666 35.0001C45.6666 34.2637 45.0697 33.6667 44.3333 33.6667H28.8856L35.9428 26.6096C36.4635 26.0889 36.4635 25.2446 35.9428 24.7239C35.4221 24.2032 34.5778 24.2032 34.0571 24.7239L24.7238 34.0573C24.2031 34.578 24.2031 35.4222 24.7238 35.9429L34.0571 45.2762Z" fill="#000"/></svg>'
    });
    //end of .cert slider
    //begin of .machine slider
    $(".machine").slick({
      infinite: true,
      dots: false,
      arrows: true,
      autoplay: false,
      autoplaySpeed: 5000,
      autoplayHoverPause: true,
      fade: false,
      swipeToSlide: true,
      prevArrow:
        '<svg width="70" height="70" viewBox="0 0 70 70" class="slick-prev" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="35" cy="35" r="35" transform="rotate(-180 35 35)" fill="transparent"/><path fill-rule="evenodd" clip-rule="evenodd" d="M34.0571 45.2762C34.5778 45.7969 35.4221 45.7969 35.9428 45.2762C36.4635 44.7555 36.4635 43.9113 35.9428 43.3906L28.8856 36.3334H44.3333C45.0697 36.3334 45.6666 35.7365 45.6666 35.0001C45.6666 34.2637 45.0697 33.6667 44.3333 33.6667H28.8856L35.9428 26.6096C36.4635 26.0889 36.4635 25.2446 35.9428 24.7239C35.4221 24.2032 34.5778 24.2032 34.0571 24.7239L24.7238 34.0573C24.2031 34.578 24.2031 35.4222 24.7238 35.9429L34.0571 45.2762Z" fill="#000"/></svg>',
      nextArrow:
        '<svg width="70" height="70" viewBox="0 0 70 70" class="slick-next" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="35" cy="35" r="35" transform="rotate(-180 35 35)" fill="transparent"/><path fill-rule="evenodd" clip-rule="evenodd" d="M34.0571 45.2762C34.5778 45.7969 35.4221 45.7969 35.9428 45.2762C36.4635 44.7555 36.4635 43.9113 35.9428 43.3906L28.8856 36.3334H44.3333C45.0697 36.3334 45.6666 35.7365 45.6666 35.0001C45.6666 34.2637 45.0697 33.6667 44.3333 33.6667H28.8856L35.9428 26.6096C36.4635 26.0889 36.4635 25.2446 35.9428 24.7239C35.4221 24.2032 34.5778 24.2032 34.0571 24.7239L24.7238 34.0573C24.2031 34.578 24.2031 35.4222 24.7238 35.9429L34.0571 45.2762Z" fill="#000"/></svg>'
    });
    //end of .machine slider
    //begin of .prod__models show/hide model block
    $(document).click(function(e) {
      if ($(e.target).closest(".prod__models")) {
        var $currElement = $(e.target).closest(".prod__models");
        if ($currElement.hasClass("js-opened")) {
          $(".prod__models.js-opened").removeClass("js-opened");
          $(".model").addClass("invisible");
        } else {
          $(".prod__models.js-opened").removeClass("js-opened");
          $(".model").addClass("invisible");
          $currElement.toggleClass("js-opened");
          $currElement.next(".model").toggleClass("invisible");
        }
      }
    });

    jQuery(document).on("click", function(e) {
      var el = ".prod__models,.model";
      if (jQuery(e.target).closest(el).length) return;
      $(".prod__models.js-opened").removeClass("js-opened");
      $(".model").addClass("invisible");
    });
    //end of .prod__models show/hide model block
    //begin of replace svg img with inline svg
    jQuery("img.js-inl-svg").each(function() {
      var $img = jQuery(this);
      var imgID = $img.attr("id");
      var imgClass = $img.attr("class");
      var imgURL = $img.attr("src");

      jQuery.get(
        imgURL,
        function(data) {
          // Get the SVG tag, ignore the rest
          var $svg = jQuery(data).find("svg");

          // Add replaced image's ID to the new SVG
          if (typeof imgID !== "undefined") {
            $svg = $svg.attr("id", imgID);
          }
          // Add replaced image's classes to the new SVG
          if (typeof imgClass !== "undefined") {
            $svg = $svg.attr("class", imgClass + " replaced-svg");
          }

          // Remove any invalid XML tags as per http://validator.w3.org
          $svg = $svg.removeAttr("xmlns:a");

          // Replace image with new SVG
          $img.replaceWith($svg);
        },
        "xml"
      );
    });
    //end of replace svg img with inline svg
    //begin of fonts loading
    const loadFont = url => {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          let css = xhr.responseText;
          css = css.replace(/}/g, "font-display: swap; }");

          const head = document.getElementsByTagName("head")[0];
          const style = document.createElement("style");
          style.appendChild(document.createTextNode(css));
          head.appendChild(style);
        }
      };
      xhr.send();
    };

    loadFont(
      "https://fonts.googleapis.com/css?family=Montserrat:200,300,400,500,600,700,800&display=swap&subset=cyrillic"
    );

    /** fix bug equalizer */

    function fixEqualizer() {
      if ($("[data-equalizer]").length) {
        Foundation.reInit("equalizer");
      }
    }

    $(document).ready(function() {
      fixEqualizer();
    });
    $(window).resize(function() {
      fixEqualizer();
    });

    /** .quant input activity */

    // Restricts input for each element in the set of matched elements to the given inputFilter.
    (function($) {
      $.fn.inputFilter = function(inputFilter) {
        return this.on(
          "input keydown keyup mousedown mouseup select contextmenu drop",
          function() {
            if (inputFilter(this.value)) {
              this.oldValue = this.value;
              this.oldSelectionStart = this.selectionStart;
              this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
              this.value = this.oldValue;
              this.setSelectionRange(
                this.oldSelectionStart,
                this.oldSelectionEnd
              );
            }
          }
        );
      };
    })(jQuery);

    $(".quant").each(function() {
      const $input = $(this).find(".quant__input");
      $input.inputFilter(function(value) {
        return /^\d*$/.test(value);
      });

      $(this)
        .find(".quant__plus")
        .on("click", function() {
          let currentNum = Math.max(+$input.val(), 0);

          $input.val(++currentNum);
        });

      $(this)
        .find(".quant__minus")
        .on("click", function() {
          let currentNum = Math.max(+$input.val(), 0);
          if (currentNum >= 2) {
            $input.val(--currentNum);
          }
        });
    });

    /** close .dd when click outside, when using Foundation Toggler */
    $(document).on("mouseup", function(e) {
      const $popup = $(".dd_show[data-toggler]");
      if ($popup.length === 0) {
        return;
      }
      const $button = $('[data-toggle="' + $popup.prop("id") + '"]');
      if (
        !$popup.is(e.target) &&
        $popup.has(e.target).length === 0 &&
        !$button.is(e.target) &&
        $button.has(e.target).length === 0
      ) {
        $popup.removeClass("dd_show");
      }
    });

    /** Разные карусели */

    $(".oil").slick({
      infinite: true,
      dots: false,
      arrows: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: 5000,
      autoplayHoverPause: true,
      fade: true,
      swipeToSlide: true,
      prevArrow:
        '<svg width="70" height="70" viewBox="0 0 70 70" class="slick-prev" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="35" cy="35" r="35" transform="rotate(-180 35 35)" fill="#EFD643"/><path fill-rule="evenodd" clip-rule="evenodd" d="M34.0571 45.2762C34.5778 45.7969 35.4221 45.7969 35.9428 45.2762C36.4635 44.7555 36.4635 43.9113 35.9428 43.3906L28.8856 36.3334H44.3333C45.0697 36.3334 45.6666 35.7365 45.6666 35.0001C45.6666 34.2637 45.0697 33.6667 44.3333 33.6667H28.8856L35.9428 26.6096C36.4635 26.0889 36.4635 25.2446 35.9428 24.7239C35.4221 24.2032 34.5778 24.2032 34.0571 24.7239L24.7238 34.0573C24.2031 34.578 24.2031 35.4222 24.7238 35.9429L34.0571 45.2762Z" fill="black"/></svg>',
      nextArrow:
        '<svg width="70" height="70" viewBox="0 0 70 70" class="slick-next" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="35" cy="35" r="35" transform="rotate(-180 35 35)" fill="#EFD643"/><path fill-rule="evenodd" clip-rule="evenodd" d="M34.0571 45.2762C34.5778 45.7969 35.4221 45.7969 35.9428 45.2762C36.4635 44.7555 36.4635 43.9113 35.9428 43.3906L28.8856 36.3334H44.3333C45.0697 36.3334 45.6666 35.7365 45.6666 35.0001C45.6666 34.2637 45.0697 33.6667 44.3333 33.6667H28.8856L35.9428 26.6096C36.4635 26.0889 36.4635 25.2446 35.9428 24.7239C35.4221 24.2032 34.5778 24.2032 34.0571 24.7239L24.7238 34.0573C24.2031 34.578 24.2031 35.4222 24.7238 35.9429L34.0571 45.2762Z" fill="black"/></svg>'
    });
    //begin of market and prod sliders

    $(".market").slick({
      infinite: false,
      dots: true,
      arrows: true,
      autoplay: false,
      autoplaySpeed: 5000,
      centerMode: false,
      variableWidth: true,
      autoplayHoverPause: true,
      fade: false,
      swipeToSlide: true,
      prevArrow:
        '<svg width="70" height="70" viewBox="0 0 70 70" class="slick-prev" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="35" cy="35" r="35" transform="rotate(-180 35 35)" fill="#000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M34.0571 45.2762C34.5778 45.7969 35.4221 45.7969 35.9428 45.2762C36.4635 44.7555 36.4635 43.9113 35.9428 43.3906L28.8856 36.3334H44.3333C45.0697 36.3334 45.6666 35.7365 45.6666 35.0001C45.6666 34.2637 45.0697 33.6667 44.3333 33.6667H28.8856L35.9428 26.6096C36.4635 26.0889 36.4635 25.2446 35.9428 24.7239C35.4221 24.2032 34.5778 24.2032 34.0571 24.7239L24.7238 34.0573C24.2031 34.578 24.2031 35.4222 24.7238 35.9429L34.0571 45.2762Z" fill="#fff"/></svg>',
      nextArrow:
        '<svg width="70" height="70" viewBox="0 0 70 70" class="slick-next" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="35" cy="35" r="35" transform="rotate(-180 35 35)" fill="#000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M34.0571 45.2762C34.5778 45.7969 35.4221 45.7969 35.9428 45.2762C36.4635 44.7555 36.4635 43.9113 35.9428 43.3906L28.8856 36.3334H44.3333C45.0697 36.3334 45.6666 35.7365 45.6666 35.0001C45.6666 34.2637 45.0697 33.6667 44.3333 33.6667H28.8856L35.9428 26.6096C36.4635 26.0889 36.4635 25.2446 35.9428 24.7239C35.4221 24.2032 34.5778 24.2032 34.0571 24.7239L24.7238 34.0573C24.2031 34.578 24.2031 35.4222 24.7238 35.9429L34.0571 45.2762Z" fill="#fff"/></svg>',
      responsive: [
        {
          breakpoint: 640,
          settings: {
            dots: false,
            arrows: false
          }
        }
      ]
    });
    $(".market").on("beforeChange", function(
      event,
      slick,
      currentSlide,
      nextSlide
    ) {
      loadSliderProd();
      addOpacityOnSlides();
    });
    $(".prove").on("beforeChange", function(
      event,
      slick,
      currentSlide,
      nextSlide
    ) {});

    function addOpacityOnSlides() {
      $(".market").each(function() {
        var widthOfSlide = $(this)
          .find(".prod")
          .width();
        var widthOfSlider = $(this).width();
        var numOfIncompleteSlide = Math.max(
          Math.floor(widthOfSlider / widthOfSlide),
          1
        );

        $(this)
          .find(".slick-slide_fog")
          .removeClass("slick-slide_fog");
        var $incompleteSlide = $(this).find(".slick-current");
        while (numOfIncompleteSlide >= 1) {
          $incompleteSlide = $incompleteSlide.next();
          numOfIncompleteSlide--;
        }
        $incompleteSlide.addClass("slick-slide_fog");
      });
    }

    function addOpacityOnSlidesProve() {
      $(".prove").each(function() {
        var widthOfSlide = $(this)
          .find(".prod")
          .width();
        var widthOfSlider = $(this).width();
        var numOfIncompleteSlide = Math.floor(widthOfSlider / widthOfSlide);

        $(this)
          .find(".slick-slide_fog")
          .removeClass("slick-slide_fog");
        var $incompleteSlide = $(this).find(".slick-current");
        while (numOfIncompleteSlide >= 1) {
          $incompleteSlide = $incompleteSlide.next();
          numOfIncompleteSlide--;
        }
        $incompleteSlide.addClass("slick-slide_fog");
      });
    }

    function loadSliderProd() {
      $(".prod__main:not(.slick-slider)").slick({
        infinite: true,
        dots: true,
        arrows: false,
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        autoplayHoverPause: true,
        fade: true,
        swipeToSlide: false
      });

      $(".model").mCustomScrollbar();

      // let observer = new IntersectionObserver(
      //   (entries, observer) => {
      //     entries.forEach(entry => {
      //
      //       if (entry.isVisible === true) {
      //         $(entry.target).removeClass('slick-slide_fog');
      //
      //       } else {
      //         $(entry.target).addClass('slick-slide_fog');
      //       }
      //       observer.unobserve(entry.target);
      //     });
      //   });
      // document.querySelectorAll('.market__slide').forEach(img => {
      //   observer.observe(img)
      // });
    }

    loadSliderProd();

    //end of market and prod sliders
  });
})(jQuery);
