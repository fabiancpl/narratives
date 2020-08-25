var hoverMenu = $( '#hidden-menu' );
var contentInfo = $( '#info-top-bar' )
var btnInfo = $( '#btn-info' )
var btnClose = $( '#btn-close' )
var video = $( '#video' )

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
    contentInfo.fadeIn();
  } else if (event.pageY >= contentInfo.height()) {
    hoverMenu.css( { top: -23 } );
    contentInfo.fadeOut('slow');0
  } else if (event.pageY < 2) {
    hoverMenu.css( { top: -23 } );
    contentInfo.fadeOut('slow');
  }
  
}

function showVideo () {
  $('.modal').show()
  document.removeEventListener('mousemove', mouseUpdate);

  var media = document.getElementById('video')
  media.muted = true;
  media.play();

  // .show().trigger("play")
  video.bind('ended', function () { 
    console.log('SE TERMINO EL VIDEO')
    hideVideo()
  })
}

function hideVideo () {
  $('.modal').hide()
  document.addEventListener('mousemove', mouseUpdate);
}

function init() {
  document.addEventListener('mousemove', mouseUpdate); 
  showVideo()
  btnInfo.on('click', showVideo)
  btnClose.on('click', hideVideo)
}