/*
custom events	
*/

jQuery(function($) {
"use strict";

/* ----------------------------------------------------------- */
/*  Debouncer
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

/* ----------------------------------------------------------- */
/*  Scroll Events
/* ----------------------------------------------------------- */
$(document).ready(function() {
	// Use this function to monitor all layout changes that should update on scroll
	var updateLayout = function() {
		// hides/shows the top most bar of info
		toggleTopBar();
		
		// only executed on home page:
		if ($('.home').length) {
			// turns customer section blue when hit by line
			toggleCustomerColor();
		}
		
		// check when at the bottom
		if ( isAtBottom() ) {
			$('#top').addClass('active');
		} else {
			$('#top').removeClass('active');
		}
	};
	// Add the event listener
	$(window).scroll( jq_throttle(250, updateLayout));
	
	function scrollY() {
		return window.pageYOffset || document.documentElement.scrollTop;
	}
	
	function toggleTopBar() {
		var sY = scrollY();
		if ( sY >= 70 ) {
			$('.top-bar').slideUp(300);
			$("#header").addClass("header-fixed");	
		}else{
			$('.top-bar').slideDown(300);
			$("#header").removeClass("header-fixed");
		}
	}
	
	function toggleCustomerColor() {
		var customerPosition = $("#customers").offset().top - $(window).scrollTop();
		if ( customerPosition <= ( (window.innerHeight * 3) / 5) ) { // when the element enters the 60% mark if 100% is the bottom
			$("#customers").addClass("blue-bg");	
		}else{
			$("#customers").removeClass("blue-bg");	
		}
	}
	
	
	// Checks if at the bottom of the page
	function isAtBottom() {
		var totalHeight, currentScroll, visibleHeight;
	
		if (document.documentElement.scrollTop) {
			currentScroll = document.documentElement.scrollTop;
		} else {
			currentScroll = document.body.scrollTop;
		}
		
		totalHeight = document.body.offsetHeight;
		visibleHeight = document.documentElement.clientHeight;
		
		if (totalHeight <= currentScroll + visibleHeight ) {
			return true;
		} else {
			return false;
		}
	}
	
	// makes sure the layout is right after page load, not just after scrolling
	updateLayout();
			
});
	
	
	
/* ----------------------------------------------------------- */
/*  Multiple Carousels
/* ----------------------------------------------------------- */	

$(document).ready(function(){
	$('#transition-timer-carousel, #transition-timer-carousel-two').carousel({
		interval: false
	});
});
	
/* ----------------------------------------------------------- */
	/*  Sticky Sidebar Navigation using Affix
/* ----------------------------------------------------------- */	
$('#sidebar').affix({
	offset: {
	    top: 150
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

/* ----------------------------------------------------------- */
/*  Back to top
/* ----------------------------------------------------------- */
	
$('#top').click(function(e){
	e.preventDefault();
	
	$('body,html').animate({
	  'scrollTop': 0
	}, 700);
});

//close
});
