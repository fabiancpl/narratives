
var scenes,
  groups,
  characters;

d3.csv( './data/scenes.csv' ).then( data => scenes = data );

d3.csv( './data/groups.csv' ).then( data => groups = data );

d3.csv( './data/characters.csv' ).then( data => characters = data );

// Tooltip

var tooltip = d3.select( 'body' ).append( 'div' )
  .attr( 'class', 'tooltip' )
  .text( '' );

d3.select( '#background' )
  .on( 'click', function() {
    console.log( 'Click' );

    d3.selectAll( '.scene,.group,.character' )
      .attr( 'active', false ).style( 'fill-opacity', .05 );

    hide_panel();
  } )

d3.selectAll( '.scene,.group,.character' )
  .on( 'click', function() {
    var elem = d3.select( this );
    if ( elem.attr( 'active' ) == 'true' ) {
      elem.attr( 'active', false ).style( 'fill-opacity', .05 );
    } else if ( elem.attr( 'active' ) == 'false' || elem.attr( 'active' ) === null ) {
      elem.attr( 'active', true ).style( 'fill-opacity', .5 );
    }

    if ( elem.attr( 'class' ) === 'character' ) {
      show_panel();
    }

  } )
  .on( 'mouseover', function() {
    var elem = d3.select( this );
    var id = elem.attr( 'id' );
    var text;
    if ( elem.attr( 'class' ) === 'scene' ) {
      text = scenes.filter( d => d[ 'id' ] === id )[ 0 ][ 'scene' ];
    } else if ( elem.attr( 'class' ) === 'group' ) {
      text = groups.filter( d => d[ 'id' ] === id )[ 0 ][ 'acronym' ];
    } else {
      text = characters.filter( d => d[ 'id' ] === id )[ 0 ][ 'character' ];
    }
    elem.style( 'cursor', 'pointer' );
    return tooltip
      .style( 'visibility', 'visible' )
      .html( '<span class="' + elem.attr( 'class' ) + '-tooltip"><b>' + text + '</b></span>' );
  } )
  .on( 'mousemove', function() {
    return tooltip.style( 'top', ( event.pageY - 15 ) + 'px' ).style( 'left', ( event.pageX + 15 ) + 'px' );
  } )
  .on( 'mouseout', function() {
    return tooltip.style( 'visibility', 'hidden' );
  } );

function show_panel() {

  var panel = d3.select( '#mydiv' );
  
  panel
    .transition()
    .duration( 1000 )
    .style( 'opacity', .65 );
  
  panel.select( '.close-panel' ).select( 'span' )
    .on( 'click', hide_panel );

}

function hide_panel() {
  d3.select( '#mydiv' )
    .transition()
    .duration( 1000 )
    .style( 'opacity', 0 );
}

