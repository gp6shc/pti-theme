/*
custom events	
*/

jQuery(function($) {
"use strict";

/* ----------------------------------------------------------- */
/*  Debouncer/Throttler
/* ----------------------------------------------------------- */
var jq_throttle = function( delay, no_trailing, callback, debounce_mode ) {
    // After wrapper has stopped being called, this timeout ensures that
    // `callback` is executed at the proper times in `throttle` and `end`
    // debounce modes.
    var timeout_id,
      
      // Keep track of the last time `callback` was executed.
      last_exec = 0;
    
    // `no_trailing` defaults to falsy.
    if ( typeof no_trailing !== 'boolean' ) {
      debounce_mode = callback;
      callback = no_trailing;
      no_trailing = undefined;
    }
    
    // The `wrapper` function encapsulates all of the throttling / debouncing
    // functionality and when executed will limit the rate at which `callback`
    // is executed.
    function wrapper() {
      var that = this,
        elapsed = +new Date() - last_exec,
        args = arguments;
      
      // Execute `callback` and update the `last_exec` timestamp.
      function exec() {
        last_exec = +new Date();
        callback.apply( that, args );
      }
      
      // If `debounce_mode` is true (at_begin) this is used to clear the flag
      // to allow future `callback` executions.
      function clear() {
        timeout_id = undefined;
      }
      
      if ( debounce_mode && !timeout_id ) {
        // Since `wrapper` is being called for the first time and
        // `debounce_mode` is true (at_begin), execute `callback`.
        exec();
      }
      
      // Clear any existing timeout.
      timeout_id && clearTimeout( timeout_id );
      
      if ( debounce_mode === undefined && elapsed > delay ) {
        // In throttle mode, if `delay` time has been exceeded, execute
        // `callback`.
        exec();
        
      } else if ( no_trailing !== true ) {
        // In trailing throttle mode, since `delay` time has not been
        // exceeded, schedule `callback` to execute `delay` ms after most
        // recent execution.
        // 
        // If `debounce_mode` is true (at_begin), schedule `clear` to execute
        // after `delay` ms.
        // 
        // If `debounce_mode` is false (at end), schedule `callback` to
        // execute after `delay` ms.
        timeout_id = setTimeout( debounce_mode ? clear : exec, debounce_mode === undefined ? delay - elapsed : delay );
      }
    }
    
    // Set the guid of `wrapper` function to the same of original callback, so
    // it can be removed in jQuery 1.4+ .unbind or .die by using the original
    // callback as a reference.
    if ( $.guid ) {
      wrapper.guid = callback.guid = callback.guid || $.guid++;
    }
    
    // Return the wrapper function.
    return wrapper;
};


// requestAnimationFrame shim

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
		};
	}
 
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
	}
}());

/* ----------------------------------------------------------- */
/*  Scroll Events
/* ----------------------------------------------------------- */
var isHomePage = $('.home').length; // if is, === 1 (true); if isn't, === 0 (false)

$(document).ready(function() {
	var bodyHeight, footerHeight, interiorHeight, interiorSidebar, sidebarHeight, isSidebarPage, shouldAffix, viewportW;
	
	function updateHeights() {
		bodyHeight 		= $('body').outerHeight(true);
		footerHeight 	= $('#footer').outerHeight(true) + $('#copyright').outerHeight(true);
		interiorHeight 	= $('.interior-page').outerHeight(true);
		interiorSidebar	= $('#interior-sidebar');
		sidebarHeight 	= interiorSidebar.outerHeight(true);
		isSidebarPage 	= interiorSidebar.length;
		shouldAffix		= sidebarIsNotTaller();
		viewportW		= $('body').outerWidth();
	}
	$(window).resize( jq_throttle(500, updateHeights));
		
	// Use this function to monitor all layout changes that should update on scroll
	var updateLayout = function() {
		// reset the tick so we can capture the next scroll
		ticking = false;
		
		// hides/shows the top most bar of info
		toggleTopBar();
		
		// only executed on home page:
		if (isHomePage) {
			// turns customer section blue when hit by line
			toggleClassAtSixty($("#customers"), "blue-bg");
			toggleClassAtSixty($("#carousel-1"), "blue-tint");
		}
		
		// only executed on pages with an affixed sidebar
		if (isSidebarPage && shouldAffix && (viewportW > 768) ) {
			affixSidebar();
		}
		
		// check when at the bottom
		if ( isAtBottom() ) {
			$('#top').addClass('active');
		} else {
			$('#top').removeClass('active');
		}
	};
	
	
	
	// stores scroll position
	var lastKnownScrollY = 0,
		ticking = false;
	
	function requestTick() {
		if (!ticking) {
			requestAnimationFrame(updateLayout);
		}
		ticking = true;
	}
	
	//update the scroll position
	function scrollY() {
		lastKnownScrollY = window.pageYOffset || document.documentElement.scrollTop;
		requestTick();
	}
	
	// Add the event listener
	$(window).scroll( scrollY );
	
	
	
	
	function toggleTopBar() {
		if ( lastKnownScrollY >= 70 ) {
			$('.top-bar').slideUp(300);
			$("#header").addClass("header-fixed");	
		}else{
			$('.top-bar').slideDown(300);
			$("#header").removeClass("header-fixed");
		}
	}
	
	function affixSidebar() {
		if ( lastKnownScrollY <= 0 ) {
			interiorSidebar.removeClass("affix-bottom");
		}
		if ( (bodyHeight - (lastKnownScrollY + sidebarHeight + 54)) <= footerHeight) {
			interiorSidebar.addClass("affix-bottom");
		}else if (lastKnownScrollY >= 70) {
			interiorSidebar.removeClass("affix-bottom");
		}
	}
	
	function sidebarIsNotTaller() {
		if (interiorHeight <= (sidebarHeight + 25) ) { // if the sidebar (+ fudge) is longer than the page content
			interiorSidebar.addClass("no-affix");
			return false;
		}else{
			return true;
		}
	}
	
	function toggleClassAtSixty(elem, classToBeToggled) {
		var elementPosition = elem.offset().top - lastKnownScrollY;
		if ( elementPosition <= ( (window.innerHeight * 3) / 5) ) { // when the element enters the 60% mark if 100% is the bottom
			elem.addClass(classToBeToggled);	
		}else{
			elem.removeClass(classToBeToggled);	
		}
	}	
	
	// Checks if at the bottom of the page
	function isAtBottom() {
		if (lastKnownScrollY + window.innerHeight === bodyHeight) {
			return true;
		}else{
			return false;
		}
	}
	
	// makes sure the layout is right after page load, not just after scrolling
	updateLayout();
	updateHeights();
			
});
	
	
	
/* ----------------------------------------------------------- */
/*  Multiple Carousels
/* ----------------------------------------------------------- */	
function loadHeroCycle() {
	$('#first-slide').addClass('active');
	$('#transition-timer-carousel-opaque').carousel({
		wrap: false,
		interval: 5400,
		pause: "false",
		keyboard: false
	});	
}

function checkIfTypekitReady() {
	if ( $('html').hasClass('wf-active') || $('html').hasClass('wf-inactive') ) {
		loadHeroCycle();
	}else{
		setTimeout(checkIfTypekitReady, 20);
	}
}

if (isHomePage) {
	
	$(document).ready(function(){
		$('#transition-timer-carousel, #transition-timer-carousel-two').carousel({
			interval: 4000,
			pause: "false",
			keyboard: false
		});
		
	});

	checkIfTypekitReady();
}
	
/* ----------------------------------------------------------- */
	/*  Open Sidebar when under 768px
/* ----------------------------------------------------------- */	
$('#js-open-sidebar').on('click', function() {
	$('body, html').toggleClass("no-scroll");
	$('.main-content').toggleClass("open");
	
	if ( $('.main-content').hasClass('open') ) {
		$('.main-content').on('click', function() {
			$('.main-content').removeClass("open");
		});
	}
});

/* ----------------------------------------------------------- */
	/*  Search Expand
/* ----------------------------------------------------------- */	
$('#js-search-icon').click(function() {
	if ( $(this).hasClass('fa-search') ) {
		setTimeout( function() {
			$('#js-search-input').focus();
		}, 200);
	}else{
		$('#js-search-input').blur();
	}

	$(this).toggleClass('search-slide fa-search fa-times');
	$('#js-search-form, #js-quote-btn').toggleClass('opacity-0');	
});

$('#js-mobile-search-icon').click(function() {
	if ( $(this).hasClass('fa-search') ) {
		setTimeout( function() {
			$('#js-mobile-search-input').focus();
		}, 600);
	}else{
		$('#js-mobile-search-input').blur();
	}

	$(this).toggleClass('fa-search fa-times');
	$('#js-mobile-search-form').toggleClass('opacity-0 opened');	
});

/* ----------------------------------------------------------- */
	/*  set video source on open, remove on close
/* ----------------------------------------------------------- */
$('#customer-video').on('shown.bs.modal', function (event) {
	var button = $(event.relatedTarget); // Button that triggered the modal
	var videoSource = button.data('video-source') + "?rel=0&showinfo=0&autoplay=1&autohide=1";

	$('#bs-iframe').attr("src", videoSource);	
});

$('#customer-video').on('hide.bs.modal', function () {
	$('#bs-iframe').attr("src", "");	
});

/* ----------------------------------------------------------- */
/*  Back to top
/* ----------------------------------------------------------- */
	
$('#top').click(function(e){
	e.preventDefault();
	
	$('body,html').animate({
	  'scrollTop': 0
	}, 700);
});

/* ----------------------------------------------------------- */
/*  Mobile Menu
/* ----------------------------------------------------------- */
$(document).ready(function() {
	$("#mobile-nav").mmenu({
		offCanvas: {
			position: "right"
        }
	})
	.on( "opened.mm", function() { //revoke touch scrolling when menu is open
		document.ontouchmove = function(e){ e.preventDefault(); };
		
    })
	.on( "closed.mm", function() { //reset when closed
		document.ontouchmove = function(){ return true; };
    });
    
    $('#mmenu-hamburger').on('touchstart click', function(e) {
	    e.preventDefault();
	    $("#mobile-nav").trigger("open.mm");
    });
});



/* ----------------------------------------------------------- */
/*  Crude Font-Size adjust
/* ----------------------------------------------------------- */

$("#sm").on('click', function() {
	var currentSize = $("html").css("font-size").slice(0,-2);
	currentSize = (currentSize / 16) * 100;
	currentSize = Math.floor(currentSize - 5);
	$("html").css("font-size", currentSize + "%");
});

$("#med").on('click', function() {
	$("html").css("font-size", "100%");
});

$("#lg").on('click', function() {
	var currentSize = $("html").css("font-size").slice(0,-2);
	currentSize = (currentSize / 16) * 100;
	currentSize = Math.floor(currentSize + 5);
	$("html").css("font-size", currentSize + "%");
});

//close
});