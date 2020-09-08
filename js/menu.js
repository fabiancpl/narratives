var hoverMenu = $( '#hidden-menu' );
var contentInfo = $( '#info-top-bar' )
var btnInfo = $( '#btn-info' )
var btnClose = $( '#btn-close' )
var video = $( '#video' )
var videoElement = document.getElementById('video')
var btnActiveSound = $( '#btn-active-sound' )

$(document).ready(function(){
  init();
})

function mouseUpdate (event) { 
  // console.log(contentInfo.height())
  // console.log(hoverMenu.height())
  // console.log({ 
  //   x : event.pageX, 
  //   y : event.pageY 
  // })

  if (event.pageY <= 23 && event.pageY >= 2){
    hoverMenu.css( { top: 0 } );
  } else if (event.pageY >= hoverMenu.height()) {
    hoverMenu.css( { top: -23 } );
    hideContentInfo()
  } else if (event.pageY < 2) {
    hoverMenu.css( { top: -23 } );
    hideContentInfo()
  }

}

function showContentInfo(){
  contentInfo.fadeIn();
}

function hideContentInfo(){
  contentInfo.fadeOut('slow');
}

function showVideo () {
  $('.modal').show()
  document.removeEventListener('mousemove', mouseUpdate);

  videoElement.loop = false;
  videoElement.controls = false;
  videoElement.muted = true;
  videoElement.play();

  video.bind('ended', function () { 
    console.log('SE TERMINO EL VIDEO')
    hideVideo()
  })
}

function hideVideo () {
  videoElement.pause();
  videoElement.currentTime = 0;
  activeSoundVideo()
  $('.modal').hide()
  document.addEventListener('mousemove', mouseUpdate);
}

function activeSoundVideo(){
  // console.log(this)
  console.log(btnActiveSound.hasClass( "active" ))
  if (btnActiveSound.hasClass( "active" )) {
    btnActiveSound.removeClass("active")
    videoElement.muted = true;
  } else {
    btnActiveSound.addClass("active")
    videoElement.muted = false;
  }
}

function init() {
  document.addEventListener('mousemove', mouseUpdate); 
  showVideo()
  btnInfo.on('click', showVideo)
  btnClose.on('click', hideVideo)
  hoverMenu.on('click', showContentInfo)
  btnActiveSound.on('click', activeSoundVideo)

}