/**
* @file
* File contains JS for All in One LP pages.
*/

// Import Boostrap Js.
require('bootstrap');

(function ($, Drupal, drupalSettings) {
  'use strict';

  Drupal.behaviors.aolpLinkScroll = {
    attach: function(context, settings) {
      window.scrollToForm = function () {
       document.querySelector('#root').scrollIntoView({behavior: 'smooth'});
      }
    }
  }
})($, Drupal, drupalSettings);