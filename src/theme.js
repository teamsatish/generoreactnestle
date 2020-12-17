/**
* @file
* File contains JS for Theme.
*/

// Import Boostrap Js.
require('bootstrap');

(function ($, Drupal, debounce, drupalSettings) {
  'use strict';

  /* Footer Accordion */
  Drupal.behaviors.accordionFooter = {
    attach: function (context, settings) {
      // Check on page load.
      toogleCollapsibleNav($(window));
      expandCollapseClasses(context);
      expandCollapseClick(context);

      // Check on resize handler.
      $(window).resize(function (e) {
        toogleCollapsibleNav($(this));
        expandCollapseClasses(context);
      });
    }
  };

  /* Helper function to toggle cass on footer menu */
  function toogleCollapsibleNav(element) {
    var elementSize = element.width();

    if (elementSize < 575) {
      $('.footer-menu').addClass('collapsible-nav');
    }
    else {
      $('.footer-menu').removeClass('collapsible-nav');
      $('.footer-menu .dropdown-menu').slideDown();
    }
  }

  /* Helper function to manage the custom expand collapse for accordions. */
  function expandCollapseClasses(context) {
    var allCollapse = $('.collapsible-nav > li.menu-item--expanded > ul').hide();
    $('.collapsible-nav > li.menu-item--expanded > a').addClass('no-link collapsed');
    $('.collapsible-nav > li.menu-item--expanded > .menu-item').addClass('collapsed');

    var activeExpand = $('.collapsible-nav > li.menu-item--active-trail > ul').show();
    $('.collapsible-nav > li.menu-item--active-trail > a').removeClass('collapsed').addClass('expanded');
  }

  /* Helper function to manage click handler for accordions. */
  function expandCollapseClick(context) {
    $('.nav > li.menu-item--expanded', context).click(function (e) {
      if ($(this).parent().hasClass('collapsible-nav')) {
        var visible = false;

        if ($(this).find('ul').is(':visible')) {
          visible = true;
        }

        if (visible) {
          $(this).find('ul').slideUp();
          $(this).children('a').removeClass('expanded').addClass('collapsed');

          $(this).children('.menu-item').removeClass('expanded').addClass('collapsed');
        }
        else {
          $(this).find('ul').slideDown();
          $(this).children('a').removeClass('collapsed').addClass('expanded');

          $(this).children('.menu-item').removeClass('collapsed').addClass('expanded');
        }

        e.stopPropagation();
      }
    });

    $('.collapsible-nav > li.menu-item--expanded ul.sub-nav li.dropdown-subitem a, .static-nav-menu.collapsible-nav > li.menu-item--expanded ul.sub-nav li.dropdown-item a', context).click(function (e) {
      e.stopPropagation();
    });
  }

  /* Menu Text Split */
  Drupal.behaviors.menuTextSplit = {
    attach: function (context, settings) {
      $("ul.nav a, ul.nav li .menu-image-title, ul.nav li .menu-item a, ul.nav li .menu-title", context).each(function () {
        var changed_string = $(this).text();
        changed_string = $.trim(changed_string);
        var temp = changed_string.split("~");
        if (temp.length > 1) {
          changed_string = "<div class='small-text'>" + temp[0] + "</div><div>" + temp[1] + "</div>";
        }
        if (temp.length > 2) {
          changed_string = temp[0] + "<br/>" + temp[1] + "<br/>" + temp[2];
        }
        $(this).html(changed_string);
      });
    }
  };

  /* Smooth Scroll */
  Drupal.behaviors.smoothScroll = {
    attach: function (context, settings) {
      // Add smooth scrolling to all links
      $("a[href^='#']:not([data-toggle='collapse'], [data-toggle='modal'])").on('click', function (event) {

        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
          // Prevent default anchor click behavior
          event.preventDefault();

          // Store hash
          var hash = this.hash;

          // Using jQuery's animate() method to add smooth page scroll
          // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
          $('html, body').stop(true, false).animate({
            scrollTop: $(hash).offset().top
          }, 800, function () {

            // Add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = hash;
          });
        } // End if
      });
    }
  };

  /* Back to top button */
  Drupal.behaviors.backToTop = {
    attach: function (context, settings) {

      $(".c-pageTop a").click(function () {
        $('html, body').stop(true, false).animate({ scrollTop: 0 }, 800);
      });
    }
  };

  /* Active accordion scroll to top */
  Drupal.behaviors.accordionScroll = {
    attach: function (context, settings) {

      $('.faq-item-content').on('show.bs.collapse', function (e) {
        var panel = $(this).closest('.paragraph--type--faq-items');
        var position = panel.offset().top;
        $('html,body').stop(true, false).animate({ scrollTop: position }, 800);
      });
    }
  };

  /* Gallery thumbs functionality. */
  Drupal.behaviors.galleryThumbs = {
    attach: function (context, settings) {
      $('.machine__items_img').each(function () {
        var main_image = $(this).find('.machine__items_img_main .embedded-entity');
        var original_image = main_image.clone();

        $(this).find('li').on('mouseover', function () {
          var current_image = $(this).find('.embedded-entity').clone();
          main_image.replaceWith(current_image);
          main_image = current_image;
        });

        $(this).find('li').on('mouseleave', function () {
          main_image.replaceWith(original_image);
          main_image = original_image;
        });
      });
    }
  };

  /* Read more link for Campaign Block on Top page */
  Drupal.behaviors.campaignReadMore = {
    attach: function (context, settings) {
      // Add Link button
      if (context === document) {
        // Include more than 6 col-items in seperate div
        $(".campaign-block .col-item:gt(5)").wrapAll("<div class='col-items-more'></div>");

        $('<div class="col-items-readmore"><button id="btn-readmore">もっと見る</button></div>').appendTo($(".campaign-block .col-items"));
        // $(".campaign-block .col-items").append(jQuery('<div class="col-items-readmore"><button id="btn-readmore">もっと見る</button></div>'));

        $(".col-items-more").css('display', 'none');

        $(".campaign-block .col-items-readmore button").click(function () {
          $(".col-items-more").slideToggle("slow");
          $(this).toggleClass('open');

          $(this).text(function (i, v) {
            return v === 'もっと見る' ? '閉じる' : 'もっと見る'
          });
        });
      }
    }
  };

  /* Order links alter */
  Drupal.behaviors.orderLinksAlter = {
    attach: function (context, settings) {
      setTimeout(
        function () {
          var orderUrl = drupalSettings.orderUrl;

          if (typeof (orderUrl) != "undefined" && orderUrl !== null) {
            if (orderUrl != 'order.nestle.jp') {
              $('a[href*="order.nestle.jp"]').each(function () {
                var href = $(this).attr('href');

                if ((href.indexOf('preprod.order.nestle.jp') < 0) && (href.indexOf('int3.order.nestle.jp') < 0)) {

                  href = href.replace('order.nestle.jp', orderUrl);
                  $(this).attr('href', href);
                };
              });
            }
          }
        }, 2500);
    }
  };

  // Js for keyboard issues for IE.
  Drupal.behaviors.keyboardButtonEnableIE = {
    attach: function (context, settings) {
      var ua = navigator.userAgent;
      var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;

      if (is_ie) {
        window.onkeydown = function (e) {
          if (e.keyCode == 38) {
            window.scrollBy(0, -30);
          }
          if (e.keyCode == 40) {
            window.scrollBy(0, 30);
          }
        }
      }
    }
  };

  /* Show / Hide overlay and open close side menu */
  Drupal.behaviors.showhideOverlay = {
    attach: function (context, settings) {
      // Open sidbar menu on click
      $('#header-menubtn', context).click(function (e) {
        $('.page-wrapper, .header-sidebar, .menu-overlay').addClass('is-open');
      });

      // Close Sidebar on btn click and overlay click
      $('.sidebar-close, .menu-overlay', context).click(function (e) {
        $('.page-wrapper, .header-sidebar, .menu-overlay').removeClass('is-open');
        $(window).scrollTop(0);
      });
    }
  };

  // Change Mypage link block text
  Drupal.behaviors.changeLoginText = {
    attach: function (context, settings) {
      var login_block = $('.header-sidebar .sidebar-bottom .member-login-bottom #block-nestleshoploginblock .login-text a');
      login_block.text('ログイン');
    }
  };

  // Call StartChat on startChat class menu item click
  Drupal.behaviors.startChat = {
    attach: function (context, settings) {
      $('li a.startChat', context).click(function (e) {
        e.preventDefault();
        startChat();
      });
    }
  };

  Drupal.behaviors.accordionFunction = {
    attach: function (context, settings) {
      var accordionFunc = function () {
        // 通常のアコーディオン.
        var $acHead = $('[data-js="accordion"] > dt');
        var $acBody = $('[data-js="accordion"] > dd');

        $acHead.css('cursor', 'pointer');
        $acBody.hide();

        $acHead.off('click');
        $acHead.on('click', function (e) {
          $(this).next().slideToggle();
          $(this).toggleClass('is-active');

          // material icon を使っている場合の処理.
          var $acHeadIcon = $(this).find('i');

          if ($acHeadIcon.text() === 'keyboard_arrow_down') {
            $acHeadIcon.text('keyboard_arrow_up');
          } else {
            $acHeadIcon.text('keyboard_arrow_down');
          }

          e.preventDefault();
          e.stopImmediatePropagation();
        });

        // SPのみアコーディオン.
        var $acSpHead = $('[data-js="accordion-sp"] > dt');
        var $acSpBody = $('[data-js="accordion-sp"] > dd');
        var acSpFlg = false;

        function accShowCtrl() {
          if ($(window).width() <= 575) {
            if (!acSpFlg) {
              $acSpHead.css('cursor', 'pointer').css('pointer-events', 'all');
              $acSpBody.hide();
            }
            acSpFlg = true;
          } else {
            if (acSpFlg) {
              $acSpHead.css('cursor', 'pointer').css('pointer-events', 'all');
              $acSpBody.show();
            }
            acSpFlg = false;
          }
        };

        $(window).on('load', function () {
          $acSpHead = $('[data-js="accordion-sp"] > dt');
          $acSpBody = $('[data-js="accordion-sp"] > dd');
          accShowCtrl()
        });

        $(window).on('resize', function () {
          accShowCtrl()
        });

        $acSpHead.off('click');
        $($acSpHead).click(function () {
          $(this).next().slideToggle();
          $(this).toggleClass('is-active');

          // material icon を使っている場合の処理.
          var $acHeadIcon = $(this).find('i');

          if ($acHeadIcon.text() === 'keyboard_arrow_down') {
            $acHeadIcon.text('keyboard_arrow_up');
          } else {
            $acHeadIcon.text('keyboard_arrow_down');
          }
        });
      }

      var accordionFunc = new accordionFunc();
    }
  }

  // WebP polyfill.
  Drupal.behaviors.webpMachine = {
    attach: function (context, settings) {
      var webpMachine = new webpHero.WebpMachine();
      webpMachine.polyfillDocument();
    }
  };

  // Open My page link and Cart link in same window instead of new window
  Drupal.behaviors.sameTabLink = {
    attach: function (context, settings) {
      $('#block-nestleshopcartblock a.cart, #block-nestleshopmembermypagelinkblock a.btn-mypage', context).each(function () {
        if ($(this).attr('target', '_blank')) {
          $(this).attr('target', '_self');
        }
      });
    }
  };

  // Redirect 404 page after 10 seconds.
  Drupal.behaviors.redirect404 = {
    attach: function (context, settings) {
      var attr = $('#block-nestle-content article').attr('about');

      if (typeof attr !== typeof undefined && attr !== false) {
        if(attr == '/404/') {
           window.setInterval(function () {
            window.location.replace('/');
            }, 10000);
        }
      }
    }
  };
})($, Drupal, Drupal.debounce, drupalSettings);
