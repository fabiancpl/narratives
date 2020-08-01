
var i = 0;

var scenes,
  groups,
  subgroups,
  characters;

d3.csv( './data/scenes.csv' ).then( data => scenes = data );

d3.csv( './data/groups.csv' ).then( data => groups = data );

d3.csv( './data/subgroups.csv' ).then( data => subgroups = data );

d3.csv( './data/characters.csv' ).then( data => characters = data );

// Tooltip

var tooltip = d3.select( 'body' ).append( 'div' )
  .attr( 'class', 'tooltip' )
  .text( '' );

d3.select( '#background' )
  .on( 'click', function() {
    d3.selectAll( '.scene,.group,.character' )
      .attr( 'active', false ).style( 'fill-opacity', .05 );
    close_panels();
  } );

d3.selectAll( '.scene,.group,.subgroup,.character' )
  .on( 'click', function() {
    var elem = d3.select( this );
    if ( elem.attr( 'active' ) == 'true' ) {
      elem.attr( 'active', false ).style( 'fill-opacity', .05 );
    } else if ( elem.attr( 'active' ) == 'false' || elem.attr( 'active' ) === null ) {
      elem.attr( 'active', true ).style( 'fill-opacity', .5 );
    }
    
    if ( elem.attr( 'class' ) === 'scene' ) {
      show_panel( elem.attr( 'id' ), 'scene' );
    } else if ( elem.attr( 'class' ) === 'group' ) {
      show_panel( elem.attr( 'id' ), 'group' );
    } else if ( elem.attr( 'class' ) === 'subgroup' ) {
      show_panel( elem.attr( 'id' ), 'subgroup' );
    } else if ( elem.attr( 'class' ) === 'character' ) {
      show_panel( elem.attr( 'id' ), 'character' );
    }

    var links = d3.selectAll( '.link' );
    if ( links.attr( 'active' ) == 'true' ) {
      links.attr( 'active', false ).style( 'stroke-opacity', 0 );
    } else if ( links.attr( 'active' ) == 'false' || links.attr( 'active' ) === null ) {
      links.attr( 'active', true ).style( 'stroke-opacity', 1 );
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
    } else if ( elem.attr( 'class' ) === 'subgroup' ) {
      text = subgroups.filter( d => d[ 'id' ] === id )[ 0 ][ 'subgroup' ];
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

function show_panel( element_id, entity ) {

  var element;
  var color;
  if ( entity === 'scene' ) { 
    element = scenes.filter( d => d[ 'id' ] === element_id )[ 0 ];
    color = '#0d0d0d';
  } else if ( entity === 'group' ) {
    element = groups.filter( d => d[ 'id' ] === element_id )[ 0 ];
    color = '#f20505';
  } else if ( entity === 'subgroup' ) {
    element = subgroups.filter( d => d[ 'id' ] === element_id )[ 0 ];
    color = '#f20505';
  } else if ( entity === 'character' ) {
    element = characters.filter( d => d[ 'id' ] === element_id )[ 0 ];
    color = '#f20505';
  }

  // Panel id
  var id = i;

  var panel = d3.select( 'body' ).append( 'div' )
    .attr( 'id', 'player_' + id )
    .attr( 'class', 'panel' )
    .style( 'background-color', color );

  panel.append( 'div' )
    .attr( 'class', 'close-panel' )
    .append( 'span' )
    .append( 'b' )
      .text( 'X' );
  
  var body = panel.append( 'div' )
    .attr( 'class', 'panel-body' );

  body.append( 'div' )
    .append( 'span' )
    .html( '<b>' + element[ entity ].toUpperCase() + '</b>&nbsp;&nbsp;' );

  if ( entity === 'character' )
    body.append( 'div' )
      .append( 'span' )
      .style( 'font-size', '0.7rem' )
      .html( element[ 'group' ] + '&nbsp;&nbsp;' );
  
  // Drawing audio
  if ( element[ 'audio' ] !== undefined && element[ 'audio' ] !== '' ) {
    body.append( 'div' )
      .attr( 'class', 'mediPlayer' )
      .append( 'audio' )
        .attr( 'class', 'listen' )
        .attr( 'preload', 'none' )
        .attr( 'data-size', 35 )
        .attr( 'src', './audios/' + element[ 'audio' ] );

    $( '#player_' + id ).find( '.mediPlayer' ).mediaPlayer();
  }

  // Showing panel
  panel
    .transition()
    .duration( 1000 )
    .style( 'opacity', .65 );

  // Dragging panel
  panel
    .call( d3.drag().on( 'drag', function() {
      d3.select( this )
        .style( 'top',  ( d3.event.y - 5 ) + 'px' )
        .style( 'left', ( d3.event.x - 5 ) + 'px' )
    } ) );

  d3.select( '#player_' + id ).selectAll( '.close-panel' )
    .on( 'click', function() {
      var element = d3.select( this.parentNode );
      console.log( element.attr( 'id' ) );
      close_panel( element );
    } );

  i++;

}

function close_panel( element ) {
  element
    .transition()
    .duration( 1000 )
    .style( 'opacity', 0 )
    .remove();
}

function close_panels() {
  d3.selectAll( '.panel' )
    .transition()
    .duration( 1000 )
    .style( 'opacity', 0 )
    .remove();

  d3.selectAll( '.link' ).attr( 'active', false ).style( 'stroke-opacity', 0 );
}
