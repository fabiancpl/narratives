var hoverMenu = $( '#hidden-menu' ),
  hoverSpace = $( '#hover-space' );

hoverSpace
  .on( 'mousemove', function( event ) {
    if( 23 - event.clientY < 0 ) {
      hoverMenu.css( { top: 23 - event.clientY } );
    } else {
      hoverMenu.css( { top: 0 } );
    }
  } )
  .on( 'mouseout', function() {
    hoverMenu.css( { top: -23 } );
  } );