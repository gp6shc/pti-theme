/* ----------------------------------------------------------- */
/*  Homepage video bg customizations
/* ----------------------------------------------------------- */
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
      'html5': 1, //force html5 vs flash... may need onError() fallback
      'playlist': 'nXpU7GX5Id0', //required for looping :(
      'controls': 0,
      'rel': 0,
      'enablejsapi': 1,
      'showinfo': 0,
      'autohide': 1,
      'modestbranding': 1,
      vq: 'hd1080'
    },
    videoId: 'nXpU7GX5Id0',
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

// When play button is clicked
$("#play-video").click(function() {
  player.pauseVideo(); //pause video
  $(".title").hide(); //hide text, but keep overlay
  var button = $(event.relatedTarget); //button that triggered the modal
  //var timeElapsed = player.getCurrentTime();
  //var timeTruncated = Math.round(timeElapsed); //round num to 1 integer
  //var videoSource = "https://www.youtube.com/embed/nXpU7GX5Id0" + "?rel=0&showinfo=0&autoplay=1&autohide=1" + "&start=" + timeTruncated;
  var videoSource = "https://www.youtube.com/embed/nXpU7GX5Id0" + "?rel=0&showinfo=0&autoplay=1&autohide=1";
  $(button).prop("data-video-source", videoSource); //attach data-video-source to modal button
  $('#home-iframe').prop("src", videoSource); //attach src to modal iframe
});

function closeVidModal() {
  player.playVideo(); //resume video
  $('#home-iframe').prop("src", ""); //remove video src from iframe
  $(".title").show(); //show text
};

// On modal close
$('#play-full').click(function(e) {
  closeVidModal();
});

// On escapekey close - (Bugfix; hidden.bs.modal event not working in SF)
$(document).keyup(function(e) {
  if (e.keyCode == 27) {
    closeVidModal();
  }
});
