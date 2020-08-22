var hoverMenu = $( '#hidden-menu' );
var contentInfo = $( '#info-top-bar' )

document.addEventListener('mousemove', mouseUpdate); 

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