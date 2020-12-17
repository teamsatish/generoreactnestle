/**
* @file
* File contains JS for Product Landing page.
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

  // Sticky Header.
  Drupal.behaviors.stickHeader = {
    attach: function(context, settings) {
      var $window = $(window);
      $(window).scroll(function() {
        var $scroll_position = $window.scrollTop();
        var header_height = $('.product-lp .nestle-header').innerHeight();
        if ($scroll_position >= header_height) { 
          // if body is scrolled down by 80 pixels
          $('.product-lp .nestle-header').addClass('sticky');
          $('body').addClass('stickypage');
        } else {
          $('.product-lp .nestle-header').removeClass('sticky');
          $('body').removeClass('stickypage');
        }
      });
    }
  };

  // Get URL parameters
  function urlParam (name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null){
      return null;
    }
    else {
      return decodeURI(results[1]) || 0;
    }
  }

  // Initialize LP Basket Total price and quantity.
  Drupal.behaviors.lpBasketTotal = {
    attach: function(context, settings) {
      // Get LPID from URL
      var $lp_id = urlParam('landing_page_id');

      // If LPID from URL is not available set it from hidden form.
      if($lp_id == null || $lp_id == ''){
        $lp_id = $('.lp-selection-form .lp-id').val();
      }

      // Set the variables for baslet total and qty with LP Id.
      var $lpIdBasketTotal = $lp_id + '_basket_total';
      var $lpIdBasketQty = $lp_id + '_basket_qty';

      // Get the localStorage value for Total Price.
      var $totalPrice = localStorage.getItem($lpIdBasketTotal);

      // Set the localStorage value for Total Price.
      if ($totalPrice == null) {
        $totalPrice = 0;
        localStorage.setItem($lpIdBasketTotal, $totalPrice);
      }

      // Get the localStorage value for Total Qty.
      var $totalQty = localStorage.getItem($lpIdBasketQty);

      // Set the localStorage value for Total Qty.
      if ($totalQty == null) {
        $totalQty = 0;
        localStorage.setItem($lpIdBasketQty, $totalQty);
      }

      // Set the total price value in header.
      $('.lp-basket .total-amount-value').text($totalPrice);

      // Set the total qty value in header.
      $('.lp-basket .total-quantity').text($totalQty);
    }
  };

  /* Quantity Selector Handler */
  Drupal.behaviors.quantitySelectorHandler = {
    attach: function (context, settings) {
      // Variables to get total quantity and price for the current LP.
      // Get LPID from URL
      var $lp_id = urlParam('landing_page_id');

      // If LPID from URL is not available set it from hidden form.
      if($lp_id == null || $lp_id == ''){
        $lp_id = $('.lp-selection-form .lp-id').val();
      }
      var $lpIdBasketTotal = $lp_id + '_basket_total';
      var $lpIdBasketQty = $lp_id + '_basket_qty';

      // Add to cart & quantity controls handler.
      $('.mdata-prod-qty-btns .addToCart').on('click', function () {
        var $quantityControls = $(this).siblings('.lp.quantity-btns');
        var $select = $quantityControls.find('select');
        var $minus = $quantityControls.find('.minus');
        var $delete = $quantityControls.find('.delete');
        var $quantity = $select.data("quantity");
        var $sku = $select.data("sku");
        var i;

        // Create the select options using the product max quantity.
        if (!$select.hasClass('options-added')) {
          if ($quantity <= 0 || $quantity > 99) {
            $quantity = 99;
            $(this).siblings('.lp.quantity-btns').find('select').data("quantity", $quantity);
          }

          for (i = 1; i <= $quantity; i++) {
            $select.append("<option value='" + i + "'>" + i + "</option>");
          }

          $select.addClass('options-added');
        }

        // Set value using session storage.
        var $item = localStorage.getItem($sku);

        if ($item != null) {
          $select.val($item);
        }
        else {
          // Initial quantity value should be 1.
          $select.val(1);
        }

        // Remove quantity cover button and show up controls.
        $(this).addClass('btn-hidden');
        $select.trigger('change');

        var select_value = parseInt($select.val(), 10);

        // Show delete button and hide minus button.
        if (select_value == 1) {
          $minus.addClass('btn-hidden');
          $delete.removeClass('btn-hidden');

          // Enable the Floating btn
          $('.lp-selection-form').next().children('button').removeClass('btn-disabled');
        }

        $quantityControls.removeClass('btn-hidden');
      });

      // Minus and Plus buttoms handlers.
      $('.quantity-btns .qty-btn-control').on('click', function (e) {
        var $click_select = $(this).siblings('select');
        var $quantity = $click_select.data("quantity");
        var select_value = parseInt($click_select.val(), 10);
        var $form = $('.lp-selection-form form');
        var $sku = $click_select.data("sku");
        var $delete = $(this).siblings('.minus.delete');
        var $minus = $(this).siblings('.minus');

        // Update select list value.
        if ($(this).hasClass('plus')) {
          var new_value = select_value + 1;

          if (new_value <= $quantity) {
            $click_select.val(new_value);
            $click_select.trigger('change');
          }

          if (new_value > 1){
            $(this).siblings('.minus').removeClass('btn-hidden');
            $(this).siblings('.delete').addClass('btn-hidden');
          }
        }
        else {
          var new_value = select_value - 1;

          if (new_value == 1){
            $(this).addClass('btn-hidden');
            $(this).siblings('.delete').removeClass('btn-hidden');
          }

          // Hide quantity controls if value is less than 1.
          if (new_value < 1) {
            $(this).parent().addClass('btn-hidden');
            $(this).siblings('.minus').toggleClass('btn-hidden');
            $(this).parent().siblings('.addToCart').removeClass('btn-hidden');
            localStorage.removeItem($sku);

            // Remove input for this product in the hidden form.
            $form.find("input[name=" + $sku + "]").remove();

            // Disable the Floating btn if no product selected.
            var skuDataCount = $form.find("input.sku-data").length;

            if (skuDataCount < 1) {
              $form.parent().next().children('button').addClass('btn-disabled');
            }

            // Get price stored in session.
            var $totalPrice = localStorage.getItem($lpIdBasketTotal);

            // Get qty stored in session.
            var $totalQty = localStorage.getItem($lpIdBasketQty);

            // Set the total price value in header.
            $('.lp-basket .total-amount-value').text($totalPrice);

            // Set the total qty value in header.
            $('.lp-basket .total-quantity').text($totalQty);
          }

          $click_select.val(new_value);
          $click_select.trigger('change');
        }

        e.stopImmediatePropagation();
      });
    }
  };

  /* Initial state handler */
  Drupal.behaviors.lpInitialStateHandler = {
    attach: function (context, settings) {
      $(window).on('load', function () {
        var sessionItems = Object.keys(localStorage);

        // Fire click event on selects with value in the session storage.
        sessionItems.forEach(function (item) {
          if ($("button[data-sku='" + item + "']").length) {
            $("button[data-sku='" + item + "']").trigger('click');
          }
        });
      });
    }
  };

  // Basket cart calculations.
  function calculateTotals($select) {
    // Get LP Id.
    var $lp_id = urlParam('landing_page_id');

    // If LPID from URL is not available set it from hidden form.
    if($lp_id == null || $lp_id == ''){
      $lp_id = $('.lp-selection-form .lp-id').val();
    }
    var $lpIdBasketTotal = $lp_id + '_basket_total';
    var $lpIdBasketQty = $lp_id + '_basket_qty';

    // Get price stored in session.
    var $totalPrice = localStorage.getItem($lpIdBasketTotal);

    // Get qty stored in session.
    var $totalQty = localStorage.getItem($lpIdBasketQty);

    // Select event handler.
    var $sku = $select.data("sku");
    var $price = $select.data("price");
    var $selectedQty = $select.val();

    // If not value is selected then set to 0.
    if (!$selectedQty) {
      $selectedQty = 0;
    }

    // Get quantity stored in session.
    var $currentQty = localStorage.getItem($sku);

    // Calculate the price of quantity stored in session.
    var $currentPrice = $price * $currentQty;
    
    // If session product qty is null set the current product value as selected qty.
    if ($currentQty == null) {
      // If we have items.
      if ($selectedQty) {
        localStorage.setItem($sku, $selectedQty);
        $currentQty = $selectedQty;
      }
      else {
        // We don't have items so we need to remove from totals.
        $currentQty = -1;
      }
      
      // Calculate the price for products stored in session.
      $currentPrice = $price * $currentQty;
      $totalQty = parseInt($totalQty, 10) + parseInt($currentQty, 10);
      $totalPrice = parseInt($totalPrice, 10) + parseInt($currentPrice, 10);
    }
    else {
      // Calculate the totalprice for changed qty.
      var $changedPrice = $price * $selectedQty;

      // Calculate difference between stored price and changed price.
      if ($currentQty != $selectedQty) {
        // Calculate the total price.
        var $priceDiff = parseInt($changedPrice, 10) - parseInt($currentPrice, 10);
        $totalPrice = parseInt($totalPrice, 10) + parseInt($priceDiff, 10);

        // Calculate the totalqty.
        var $qtyDiff = parseInt($selectedQty, 10) - parseInt($currentQty, 10);
        $totalQty = parseInt($totalQty, 10) + parseInt($qtyDiff, 10);
      }
    }

    // In case our calculation is less than 0 reset the variables.
    if ($totalQty < 0) {
      $totalQty = 0;
    }

    // Same thing with the price.
    if ($totalPrice < 0) {
      $totalPrice = 0;
    }

    // Set the total price value in header.
    $('.lp-basket .total-amount-value').text($totalPrice);

    // Set the total qty value in header.
    $('.lp-basket .total-quantity').text($totalQty);

    // Set the calculated total price in localStorage.
    localStorage.setItem($lpIdBasketTotal, $totalPrice);

    // Set the calculated quantity in localStorage.
    localStorage.setItem($lpIdBasketQty, $totalQty);
  };

  /* LP Form handler */
  Drupal.behaviors.lpFormHandler = {
    attach: function (context, settings) {
      var $form = $('.lp-selection-form form');
      var $select = $('.lp.quantity-btns select');

      // Add all the options to the form if we have recored in session storage.
      $select.each(function () {
        var $sku = $(this).data("sku");

        if ((typeof $sku !== 'undefined') && ($sku !== '')) {
          if (!$("input[name=" + $sku + "]").length) {
            var $item = localStorage.getItem($sku);

            if ($item != null) {
              $form.append("<input type='hidden' class='sku-data' name='" + $sku + "' value='" + $item + "' />");
            }
          }
        }
      });

      // Update form using quantity selector on change.
      $select.on('change', function (e) {
        var $sku = $(this).data("sku");
        var $quantity = $(this).data("quantity");
        var $plus = $(this).siblings('.plus');
        var $minus = $(this).siblings('.minus');
        var $delete = $(this).siblings('.delete');
        var selector_value = $(this).val();

        if ((typeof $sku !== 'undefined') && ($sku !== '')) {
          if (!$("input[name=" + $sku + "]").length) {
            // Add form hidden input with select list value.
            $form.append("<input type='hidden' class='sku-data' name='" + $sku + "' value='" + selector_value + "' />");
          }
          else {
            // Sync form hidden input with select list value.
            $form.find("input[name=" + $sku + "]").val(selector_value);
          }

          // Calculate Cart Totals.
          calculateTotals($(this));

          // Save value in the session storage to later use as form default value.
          localStorage.setItem($sku, selector_value);
        }

        // Hide quantity controls if value is less than 1.
        if (selector_value < 1 || selector_value == null) {
          $(this).parent().addClass('btn-hidden');
          $minus.toggleClass('btn-hidden');
          $(this).parent().siblings('.addToCart').removeClass('btn-hidden');
          localStorage.removeItem($sku);

          // Remove input for this product in the hidden form.
          $form.find("input[name=" + $sku + "]").remove();
        }

        // Show delete button if value is 1.
        if (selector_value > 1) {
          if (!$delete.hasClass('btn-hidden')) {
            $minus.toggleClass('btn-hidden');
          }
        }

        // Show delete button and hide minus button.
        if (selector_value == 1) {
          $minus.addClass('btn-hidden');
          $delete.removeClass('btn-hidden');
        }

        // If we reach the limit disable plus button.
        if (selector_value == $quantity) {
          $plus.addClass('btn-disabled');
        }
        else {
          if ($plus.hasClass('btn-disabled')) {
            $plus.removeClass('btn-disabled');
          }
        }

        e.stopImmediatePropagation();
      });

      // Submit the form when user clicks in the CTA button.
      $(".lp-submit-selection").click(function () {
        $form.submit();
      });
    }
  };

  /* Floating Banner Position change on scroll */
  Drupal.behaviors.floatingBanner = {
    attach: function (context, settings) {
      $(window).on('scroll', function () {

        var scrollHeight = $(document).height();
        var scrollWidth = $(document).width();
        var scrollTopheight = $(window).scrollTop();
        var scrollPosition = $(window).height() + $(window).scrollTop();

        var footHeight = $('footer.footer').height();

        var pcontainer = $('.productlp-container');

        var fbanner = $('[data-js="js-fixedBanner"]');

        var fbannerHeight = $(fbanner).height() + 40;

        var scrollQty = scrollHeight - scrollPosition - 80;

        if (scrollHeight - scrollPosition <= footHeight) {

          $(pcontainer).css({ 'paddingBottom': fbannerHeight });
          $(fbanner).css({ 'position': 'absolute' });
          $(fbanner).css({ 'bottom': 'inherit' });
          $(fbanner).css({ 'box-shadow': 'none' });
        } else {

          $(fbanner).css({ 'position': 'fixed' });
          $(fbanner).css({ 'bottom': '0' });
        }
        // Max mobile screen width.
        if (scrollWidth < 576 ) {
          $(fbanner).css({ 'position': 'fixed' });
          $(fbanner).css({ 'bottom': '0' });
        }
      });
    }
  };

  // Disable Float Button if no product is selected.
  Drupal.behaviors.disableFloatBtn = {
    attach: function (context, settings) {
      var elementClass = $('.lp-selection-form input[type="hidden"]').hasClass('sku-data');

      if (elementClass) {
        $('.lp-selection-form').next().children('button').removeClass('btn-disabled');
      }
      else {
        $('.lp-selection-form').next().children('button').addClass('btn-disabled');
      }
    }
  };

})($, Drupal, Drupal.debounce, drupalSettings);

// Anchor Link List added outside drupal behaviors as once() is giving error.
$(document).ready( function() {
  var $catTitle = $('.productlp--catlist').find('.prodlist-title');
  var $select = $('.prod-category-list').find('.title-list');
  var headerHeight = $('.nestle-header').height();

  var bodyClass = $("body").hasClass("user-logged-in");
  if(bodyClass == false) {
    headerHeight = headerHeight + 15;
  }
  else {
    headerHeight = headerHeight - 30;
  }

  if($catTitle != '') {
    // Create a select list and assign a class to it.
    // $select = $('<select></select>').attr('class', 'title-list');

    $catTitle.each(function() {
      
      // Get the title text to be displayed in select.
      var titleText = $(this).text();
      // trim text
      titleText = $.trim(titleText);

      // Get the title parentid for scroll link.
      var titleParentId = $(this).parent().attr('id');

      if(titleText != '' && !$(this).hasClass('title-added')) {
        $(this).addClass('title-added');
        // Add the title text and parentid in select option.
        $select.append(
          $('<option></option>').val(titleParentId).html(titleText)
        );
      }
    });

    // Display the select in header.
    $('.header-middle .prod-category-list').append($select);

    // Get default title value.
    var optionText = $('.title-list option:selected').text();

    // Display default selected title in label.
    var labelDisplay = $('.productlp-catlist .prod-category-name');
    labelDisplay.html(optionText);

    // Scroll to title.
    $select.on('change', function() {
      // Get changed value.
      var optionText = $('.title-list option:selected').text();
      
      // Display changed value in label.
      var labelDisplay = $(this).parent().siblings('label.prod-category-name');
      labelDisplay.html(optionText);

      $('body, html').animate({
        scrollTop: $('#' + $(this).val()).position().top - headerHeight
      }, 'slow');
    });
  }
});