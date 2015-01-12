/*
custom events	
*/

	jQuery(function($) {
	"use strict";

	 /* ----------------------------------------------------------- */
	 /*  Fixed header
	 /* ----------------------------------------------------------- */
	 (function() {
				
				var docElem = document.documentElement,
					didScroll = false,
					changeHeaderOn = 100;
					document.querySelector( 'header' );
					
				function init() {
					window.addEventListener( 'scroll', function() {
						if( !didScroll ) {
							didScroll = true;
							setTimeout( scrollPage, 250 );
						}
					}, false );
				}
				
				function scrollPage() {
					var sy = scrollY();
					if ( sy >= changeHeaderOn ) {
						$('.top-bar').slideUp(300);
						$("header").addClass("header-fixed");
						
					}
					else {
						$('.top-bar').slideDown(300);
						$("header").removeClass("header-fixed");
						
					}
					didScroll = false;
				}
				
				function scrollY() {
					return window.pageYOffset || docElem.scrollTop;
				}
				
				init();
				
		})();
		
		
		
	/* ----------------------------------------------------------- */
	/*  Search Expand
	/* ----------------------------------------------------------- */	


	 /* ----------------------------------------------------------- */
	 /*  Back to top
	 /* ----------------------------------------------------------- */

			 $(window).scroll(function () {
						if ($(this).scrollTop() > 50) {
								$('#back-to-top').fadeIn();
						} else {
								$('#back-to-top').fadeOut();
						}
				});
			// scroll body to 0px on click
			$('#back-to-top').click(function () {
					$('#back-to-top').tooltip('hide');
					$('body,html').animate({
							scrollTop: 0
					}, 800);
					return false;
			});
			
			$('#back-to-top').tooltip('hide');

});