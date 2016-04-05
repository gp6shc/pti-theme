
      // Loads the YT iFrame Player API code asynchronously.
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // creates an iframe & YouTube player
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '100%',
          width: '100%',
          playerVars: {
              'autoplay': 1,
              'loop': 1,
              'playlist': 'b_NefZMJySs',
              'controls': 0,
              'rel': 0,
              'enablejsapi': 1,
              'showinfo': 0,
              'autohide': 0,
              'modestbranding': 1,
                  vq: 'hd1080'},
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // Call this function when the video player is ready
      function onPlayerReady(event) {
        event.target.playVideo();
        player.mute();
      }

      var done = false;
      function onPlayerStateChange(event) {
        
      }
      function stopVideo() {
        player.stopVideo();
      }
    
      
// When play button is clicked
$("#play-video").click(function () {
    $(".title").hide(); //hide text, but keep overlay
    player.pauseVideo(); //pause video
    
});

// On modal open
$('#play-full').on('shown.bs.modal', function (event) {
    var button = $(event.relatedTarget); // button that triggered the modal
    //var videoSource = button.data('video-source') + "?rel=0&showinfo=0&autoplay=1&autohide=1";
    var timeElapsed = player.getCurrentTime();
    var timeTruncated = Math.round(timeElapsed);
    var videoSource = "//www.youtube.com/embed/b_NefZMJySs" + "?rel=0&showinfo=0&autoplay=1&autohide=1" + "&start=" + timeTruncated;
    $(button).attr("data-video-source", videoSource);
    $('#home-iframe').attr("src", videoSource);   
});

// On modal close
$('#play-full').on('hide.bs.modal', function () { 
    $('#home-iframe').attr("src", "");  
    $(".title").show(); //show text 
    player.playVideo(); //resume video
});
