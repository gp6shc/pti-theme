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
					changeHeaderOn = 100; //when scrolled > x
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
		$(window).on('scroll', function(){
		  
		  var wHeight         = $(window).height(),
		      distanceFromTop = $(window).scrollTop(),
		      bodyHeight      = $('body,html').height(),
		      bodyMinusWindow = bodyHeight - (wHeight + 200);
		  
		  if (distanceFromTop > bodyMinusWindow) {
		    $('#top').addClass('active');
		  } else {
		    $('#top').removeClass('active');
		  }
		   
		});
		
		$('#top').click(function(e){
		  
		  e.preventDefault();
		  
		  $('body,html').animate({
		    'scrollTop': 0
		  }, 700);
		  
		});
		
		
//close
});