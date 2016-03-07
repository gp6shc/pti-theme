/*
custom events   
*/

jQuery(function($) {
"use strict";

/* ----------------------------------------------------------- */
/*  Cookie Framework
/* ----------------------------------------------------------- */
var docCookies = {
  getItem: function (sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    if (!sKey) { return false; }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  }
};

(function() {
    if(docCookies.hasItem('fontSize')) {
        var newFontSize = docCookies.getItem('fontSize');
        $("html").css("font-size", newFontSize+"%");
    }
}());

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
 
// requestAnimationFrame polyfill by Erik MÃ¶ller
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

var bodyHeight, footerHeight, interiorHeight, interiorSidebar, sidebarHeight, isSidebarPage, shouldAffix, viewportW;

function updateHeights() {
    bodyHeight      = $('body').outerHeight(true);
    footerHeight    = $('#footer').outerHeight(true) + $('#copyright').outerHeight(true);
    interiorHeight  = $('.interior-page').outerHeight(true);
    interiorSidebar = $('#interior-sidebar');
    sidebarHeight   = interiorSidebar.outerHeight(true);
    isSidebarPage   = interiorSidebar.length;
    shouldAffix     = sidebarIsNotTaller();
    viewportW       = $('body').outerWidth();
}
$(window).resize( jq_throttle(500, updateHeights));

function sidebarIsNotTaller() {
    if (interiorHeight <= (sidebarHeight) ) { // if the sidebar is longer than the page content
        interiorSidebar.addClass("no-affix");
        return false;
    }else{
        return true;
    }
}

/* ----------------------------------------------------------- */
/*  Scroll Events
/* ----------------------------------------------------------- */
var isHomePage = $('#carousel-2').length; // if is, === 1 (true); if isn't, === 0 (false)

$(document).ready(function() {
        
    // Use this function to monitor all layout changes that should update on scroll
    var updateLayout = function() {
        // reset the tick so we can capture the next scroll
        ticking = false;
        // hides/shows the top most bar of info
        toggleTopBar();
        
        // only executed on home page:
        if (isHomePage) {
            // turns customer section blue when hit by line
            toggleClassAtSixty($(".customers"), "blue-bg");
            toggleClassAtSixty($("#HomepageSlider1"), "blue-tint");
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
        if ( lastKnownScrollY === 0) {
            $(".sidebar-wrapper").removeClass("push-up");
        }

        if ( lastKnownScrollY >= 70 ) {
            $('.top-bar').slideUp(300);
            setTimeout( function() {
                $("#header").addClass("header-fixed");
                $(".sidebar-wrapper").addClass("push-up");
                if(isSidebarPage) {
                    $('#js-open-sidebar').addClass('push-up-chevron');
                }
            }, 300);    
        }else{
            $('.top-bar').slideDown(300);
            setTimeout( function() {
                $(".sidebar-wrapper").removeClass("push-up");
                $("#header").removeClass("header-fixed");
                if(isSidebarPage) {
                    $('#js-open-sidebar').removeClass('push-up-chevron');
                }
            }, 300);
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

    $(window).load(function() {
        updateHeights(); //recalculate heights after images have loaded 
    });
            
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
    //pause-play toggle
    $('#player-controls i').click(function() {
        if ( $(this).hasClass('fa-pause') ) {

            $('#transition-timer-carousel-opaque').carousel('pause');
            $(this).toggleClass('fa-pause fa-play');
            $('.item, .active .quotable, .image-cycle .carousel-inner img').addClass('pause');

        } else {
            $('#transition-timer-carousel-opaque').carousel('cycle');
            $(this).toggleClass('fa-play fa-pause');
            $('.item, .active .quotable, .image-cycle .carousel-inner img').removeClass('pause');
        }

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
            interval: 7000,
            pause: "true",
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
    $('.get-quote').toggleClass('remove-z'); 
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
/*  Agent Sign In
/* ----------------------------------------------------------- */
    $('#drop4').click(function(){
        $(this).find('i').toggleClass('fa-angle-down fa-times-circle')
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
        $("#header").removeAttr('style');
    });
    
    $('#mmenu-hamburger').on('touchstart click', function(e) {
        e.preventDefault();
        $('.main-content').removeClass("open");
        setTimeout(function() {
            $("#header").attr('style', 'position:absolute;top:' + $("#header").offset().top + 'px');
            $("#mobile-nav").trigger("open.mm");    
        }, 200);
    });
});



/* ----------------------------------------------------------- */
/*  Crude Font-Size adjust
/* ----------------------------------------------------------- */

$("#sm").on('click', function() {
    var currentSize = $("html").css("font-size").slice(0,-2);
    currentSize = (currentSize / 16) * 100;
    currentSize = Math.floor(currentSize - 5);
    docCookies.setItem('fontSize', currentSize, 'Fri, 31 Dec 9999 23:59:59 GMT','/');
    $("html").css("font-size", currentSize + "%");
    updateHeights();
});

$("#med").on('click', function() {
    docCookies.removeItem('fontSize');
    $("html").css("font-size", "100%");
    updateHeights();
});

$("#lg").on('click', function() {
    var currentSize = $("html").css("font-size").slice(0,-2);
    currentSize = (currentSize / 16) * 100;
    currentSize = Math.floor(currentSize + 5);
    docCookies.setItem('fontSize', currentSize, 'Fri, 31 Dec 9999 23:59:59 GMT','/');
    $("html").css("font-size", currentSize + "%");
    updateHeights();
});

/* ----------------------------------------------------------- */
/*  Form Submit
/* ----------------------------------------------------------- */

var sendInput = function(input, zip) {
    input.removeClass('bad-input bad-input-anim');

    if (zip > 9999 && zip < 100000) { // between 4 digits and 6 digits
        location.href = '/lp-group/default-landing-page?zip=' + zip;
    }else{
        input.addClass('bad-input');
        input.addClass('bad-input-anim');
        setTimeout( function() {input.removeClass('bad-input-anim')}, 300);
        input.focus();
    }
}

$("button[type=submit]").on('click', function(e) {
    e.preventDefault();
    var input = $(this).prev('.form-group').find('input');
    var zip   = input.val();

    sendInput(input, zip);
});

$(document).keypress(function(e) {
    if(e.which === 13) {
        e.preventDefault();
        var inputs = $('.form-group').find('input');

        for (var i = 0; i < inputs.length; i++ ) {
            if (inputs[i].value == '') {
                $(inputs[i]).removeClass('bad-input');
                continue;
            }else{ 
                sendInput( $(inputs[i]), inputs[i].value);
                break;
            }
        }
    }
});

/* ----------------------------------------------------------- */
/*  Show curved filling bg on home page
/* ----------------------------------------------------------- */

$(document).ready(function() {
    if(isHomePage) {
        $('.gradient-contain').addClass('visible');
    }
    
});

//close
});