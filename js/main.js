
var i = 0;

var data = {};

d3.csv( './data/scenes.csv' ).then( d => {
  d = d.map( i => {
    if ( i[ 'frameworks' ].includes( ',' ) ) {
      i[ 'frameworks' ] = i[ 'frameworks' ].split( ',' );
    } else {
      i[ 'frameworks' ] = [ i[ 'frameworks' ] ];
    }
    return i 
  } );
  data[ 'scenes' ] = d
} );

d3.csv( './data/groups.csv' ).then( d => data[ 'groups' ] = d );

d3.csv( './data/subgroups.csv' ).then( d => data[ 'subgroups' ] = d );

d3.csv( './data/characters.csv' ).then( d => data[ 'characters' ] = d );

d3.csv( './data/relationships.csv' ).then( d => data[ 'relationships' ] = d );

d3.select( '#background' )
  .on( 'click', function() {
    restart();
  } );

/* Scene interactions */

d3.selectAll( '.scene,.group,.subgroup,.character' )
  .on( 'click', function() {

    var elem = d3.select( this );

    // Define the kind of node
    var entity = get_entity( elem );

    if ( !elem.classed( 'active' ) ) {

      if ( elem.classed( 'minor' ) ) {
        restart();
      }

      d3.selectAll( '.node ' )
        .classed( 'hidden', true );

      // Show the elements
      if ( [ 'scene', 'character' ].includes( entity ) ) {
        data[ 'relationships' ]
          .filter( d => d[ entity ] === elem.attr( 'id' ) )
          .map( r => {
            if ( r[ 'character' ] !== '' ) {
              var character = data[ 'characters' ].filter( c => c[ 'id' ] === r[ 'character' ] )[ 0 ];
              r[ 'group' ] = character[ 'group' ];
              r[ 'subgroup' ] = character[ 'subgroup' ];
            }
            return r;
          } )
          .map( r => {

            d3.select( '#' + r[ 'scene' ] + '.scene' )
              .classed( 'hidden', false )
              .classed( 'visited', true )
              .classed( 'active', true );

            d3.select( '#' + r[ 'scene' ] + '.scene-link' )
              .classed( 'active-link', true );

            d3.select( '#' + r[ 'scene' ] + '.scene-name' )
              .classed( 'active-text', true );  

            if ( r[ 'character' ] !== '' ) {

              if ( r[ 'subgroup' ] !== '' ) {
                d3.select( '#' + r[ 'subgroup' ] + '.subgroup' )
                  .classed( 'hidden', false )
                  .classed( 'visited', true )
                  .classed( 'active', true );

                d3.select( '#' + r[ 'group' ] + '.group' )
                  .classed( 'hidden', false )
                  .classed( 'visited', true );
              } else {
                d3.select( '#' + r[ 'group' ] + '.group' )
                  .classed( 'hidden', false )
                  .classed( 'visited', true )
                  .classed( 'active', true );
              }

              d3.select( '#' + r[ 'group' ] + '.group-link' )
                .classed( 'active-link', true );

              d3.select( '#' + r[ 'group' ] + '.group-name' )
                .classed( 'active-text', true );

              d3.select( '#' + r[ 'character' ] + '.character' )
                .classed( 'hidden', false )
                .classed( 'visited', true )
                .classed( 'active', true );

              d3.select( '#' + r[ 'character' ] + '.character-link' )
                .classed( 'active-link', true );

              d3.select( '#' + r[ 'character' ] + '.character-name' )
                .classed( 'active-text', true );
            }

          } );
      } else if( entity == 'group' ) {
        data[ 'characters' ]
          .filter( d => d[ entity ] === elem.attr( 'id' ) )
          .map( r => {

            d3.select( '#' + r[ 'group' ] + '.group' )
              .classed( 'hidden', false )
              .classed( 'visited', true )
              .classed( 'active', true );

            var group = data[ 'groups' ].filter( g => g[ 'id' ] === elem.attr( 'id' ) )[ 0 ];
            if ( group[ 'organizer' ] === 'false' ) {

              d3.select( '#' + r[ 'group' ] + '.group-name' )
                .classed( 'active-text', true );

              d3.select( '#' + r[ 'id' ] + '.character' )
                .classed( 'hidden', false )
                .classed( 'visited', true )
                .classed( 'active', true );

              d3.select( '#' + r[ 'id' ] + '.character-link' )
                .classed( 'active-link', true );

              d3.select( '#' + r[ 'id' ] + '.character-name' )
                .classed( 'active-text', true );

            }

          } );
      } else if( entity == 'subgroup' ) {
        data[ 'characters' ]
          .filter( d => d[ entity ] === elem.attr( 'id' ) )
          .map( r => {

            d3.select( '#' + r[ 'subgroup' ] + '.subgroup' )
              .classed( 'hidden', false )
              .classed( 'visited', true )
              .classed( 'active', true );

            d3.select( '#' + r[ 'group' ] + '.group' )
              .classed( 'hidden', false )
              .classed( 'visited', true );

            d3.select( '#' + r[ 'subgroup' ] + '.subgroup-name' )
              .classed( 'active-text', true );

            d3.select( '#' + r[ 'id' ] + '.character' )
              .classed( 'hidden', false )
              .classed( 'visited', true )
              .classed( 'active', true );

            d3.select( '#' + r[ 'id' ] + '.character-link' )
              .classed( 'active-link', true );

            d3.select( '#' + r[ 'id' ] + '.character-name' )
              .classed( 'active-text', true );

          } );
      } else {
        elem
          .classed( 'hidden', false )
          .classed( 'visited', true )
          .classed( 'active', true );
      }

      // Highlight related scenes
      if ( entity === 'scene' ) {
        var frameworks = data[ 'scenes' ].filter( d => d[ 'id' ] === elem.attr( 'id' ) )[ 0 ][ 'frameworks' ];
        var related_scenes = data[ 'scenes' ].filter( s => {
          if ( s[ 'frameworks' ].filter( value => frameworks.includes( value ) ).length > 0 ) {
            return true;
          } else {
            return false;
          }
        } ).filter( s => s[ 'id' ] !== elem.attr( 'id' ) );

        if ( related_scenes.length > 0 ) {
          d3.selectAll( related_scenes.map( s => '#' + s[ 'id' ] + '.scene' ).join( ',' ) )
            .classed( 'hidden', false )
            .classed( 'hover', false )
            .classed( 'minor', true );

          d3.selectAll( related_scenes.map( s => '#' + s[ 'id' ] + '.scene-name' ).join( ',' ) )
            .classed( 'hidden', false )
            .classed( 'visible-text', false )
            .classed( 'minor-text', true );
        }

      }

      // Hiding the phantoms
      d3.select( '.phantoms' )
        .style( 'visibility', 'hidden' );

    }

    // Showing the panel
    show_panel( elem.attr( 'id' ), entity );

  } )
  .on( 'mouseover', function() {
    
    var elem = d3.select( this );

    // Define the kind of node
    var entity = get_entity( elem );

    if ( ( elem.classed( 'active' ) === false ) && ( elem.classed( 'minor' ) === false ) ) {

      // Scale up the node, if it is not previously scaled
      if ( entity !== 'character' )
        if ( !elem.classed( 'scaled' ) ) {
          var scaled_points = geometric.polygonScale( get_points( elem ), 1.1 );
          elem
            .classed( 'scaled', true )
            .attr( 'points', scaled_points.join( ' ' ) );
        }

      // Show the elements
      if ( [ 'scene', 'character' ].includes( entity ) ) {
        data[ 'relationships' ]
          .filter( d => d[ entity ] === elem.attr( 'id' ) )
          .map( r => {
            if ( r[ 'character' ] !== '' ) {
              var character = data[ 'characters' ].filter( c => c[ 'id' ] === r[ 'character' ] )[ 0 ];
              r[ 'group' ] = character[ 'group' ];
              r[ 'subgroup' ] = character[ 'subgroup' ];
            }
            return r;
          } )
          .map( r => {

            d3.select( '#' + r[ 'scene' ] + '.scene' )
              .classed( 'hover', true );

            d3.select( '#' + r[ 'scene' ] + '.scene-link' )
              .classed( 'visible-link', true );

            d3.select( '#' + r[ 'scene' ] + '.scene-name' )
              .classed( 'visible-text', true );  

            if ( r[ 'character' ] !== '' ) {

              if ( r[ 'subgroup' ] !== '' ) {
                d3.select( '#' + r[ 'subgroup' ] + '.subgroup' )
                  .classed( 'hover', true );

                d3.select( '#' + r[ 'group' ] + '.group' )
                  .classed( 'hover', true );          
              } else {
                d3.select( '#' + r[ 'group' ] + '.group' )
                  .classed( 'hover', true );
              }

              d3.select( '#' + r[ 'group' ] + '.group-link' )
                .classed( 'visible-link', true );

              d3.select( '#' + r[ 'group' ] + '.group-name' )
                .classed( 'visible-text', true );

              d3.select( '#' + r[ 'character' ] + '.character' )
                .classed( 'hover', true );

              d3.select( '#' + r[ 'character' ] + '.character-link' )
                .classed( 'visible-link', true );

              d3.select( '#' + r[ 'character' ] + '.character-name' )
                .classed( 'visible-text', true );
            }

          } );
      } else if( entity == 'group' ) {
        data[ 'characters' ]
          .filter( d => d[ entity ] === elem.attr( 'id' ) )
          .map( r => {

            d3.select( '#' + r[ 'group' ] + '.group' )
                .classed( 'hover', true );

            var group = data[ 'groups' ].filter( g => g[ 'id' ] === elem.attr( 'id' ) )[ 0 ];
            if ( group[ 'organizer' ] === 'false' ) {
              
              d3.select( '#' + r[ 'group' ] + '.group-name' )
                .classed( 'visible-text', true );

              d3.select( '#' + r[ 'id' ] + '.character' )
                .classed( 'hover', true );

              d3.select( '#' + r[ 'id' ] + '.character-link' )
                .classed( 'visible-link', true );

              d3.select( '#' + r[ 'id' ] + '.character-name' )
                .classed( 'visible-text', true );

            }

          } );
      } else if( entity == 'subgroup' ) {
        data[ 'characters' ]
          .filter( d => d[ entity ] === elem.attr( 'id' ) )
          .map( r => {

            d3.select( '#' + r[ 'subgroup' ] + '.subgroup' )
                .classed( 'hover', true );

            d3.select( '#' + r[ 'group' ] + '.group' )
                .classed( 'hover', true );
              
            d3.select( '#' + r[ 'subgroup' ] + '.subgroup-name' )
              .classed( 'visible-text', true );

            d3.select( '#' + r[ 'id' ] + '.character' )
              .classed( 'hover', true );

            d3.select( '#' + r[ 'id' ] + '.character-link' )
              .classed( 'visible-link', true );

            d3.select( '#' + r[ 'id' ] + '.character-name' )
              .classed( 'visible-text', true );

          } );
      } else {
        elem
          .classed( 'hover', true );
      }

      // Highlight related scenes
      if ( entity === 'scene' ) {
        var frameworks = data[ 'scenes' ].filter( d => d[ 'id' ] === elem.attr( 'id' ) )[ 0 ][ 'frameworks' ];
        var related_scenes = data[ 'scenes' ].filter( s => {
          if ( s[ 'frameworks' ].filter( value => frameworks.includes( value ) ).length > 0 ) {
            return true;
          } else {
            return false;
          }
        } ).filter( s => s[ 'id' ] !== elem.attr( 'id' ) );

        if ( related_scenes.length > 0 ) {
          d3.selectAll( related_scenes.map( s => '#' + s[ 'id' ] + '.scene' ).join( ',' ) )
            .classed( 'hover', true );

          d3.selectAll( related_scenes.map( s => '#' + s[ 'id' ] + '.scene-name' ).join( ',' ) )
            .classed( 'visible-text', true );
        }

      }

    }
    

  } )
  .on( 'mouseout', function() {
    
    var elem = d3.select( this );

    // Define the kind of node
    var entity = get_entity( elem );

    // Hide all visible elements (no actives)

    d3.selectAll( '.hover' )
      .classed( 'hover', false );

    d3.selectAll( '.visible-text' )
      .classed( 'visible-text', false );

    d3.selectAll( '.link' )
      .classed( 'visible-link', false );

    // Scale down the text, if it is not active
    if ( entity !== 'character' )
      if ( !elem.classed( 'active' ) && !elem.classed( 'minor' ) ) {
        var scaled_points = geometric.polygonScale( get_points( elem ), .90909 );
        elem
          .classed( 'scaled', false )
          .attr( 'points', scaled_points.join( ' ' ) );
      }

  } );

function get_entity( elem ) {
  var entity;
  if ( elem.classed( 'scene' ) ) {
    entity = 'scene';
  } else if ( elem.classed( 'group' ) ) {
    entity = 'group';
  } else if ( elem.classed( 'subgroup' ) ) {
    entity = 'subgroup';
  } else if ( elem.classed( 'character' ) ) {
    entity = 'character';
  }
  return entity
}

function get_points( elem ) {
  return elem.attr( 'points' ).split( ' ' )
    .filter( s => s != '' && s != '\n' )
    .map( s => s.split( ',' ).map( s => +s ) );
}

function show_panel( element_id, entity ) {

  var element;
  var color;
  if ( entity === 'scene' ) { 
    element = data[ 'scenes' ].filter( d => d[ 'id' ] === element_id )[ 0 ];
    color = '#0d0d0d';
  } else if ( entity === 'group' ) {
    element = data[ 'groups' ].filter( d => d[ 'id' ] === element_id )[ 0 ];
    
    var group = data[ 'groups' ].filter( g => g[ 'id' ] === element_id )[ 0 ];
    if ( group[ 'organizer' ] === 'false' ) {
      color = '#f20505';
    } else {
      color = '#132F92';
    }
  } else if ( entity === 'subgroup' ) {
    element = data[ 'subgroups' ].filter( d => d[ 'id' ] === element_id )[ 0 ];
    color = '#f20505';
  } else if ( entity === 'character' ) {
    element = data[ 'characters' ].filter( d => d[ 'id' ] === element_id )[ 0 ];
    color = '#F25C69';
  }

  // Panel id
  var id = i;

  var panel = d3.select( 'body' ).append( 'div' )
    .attr( 'id', 'player_' + id )
    .attr( 'class', 'panel' )
    .style( 'background-color', color )
    .style( 'top', ( 20 * ( i + 1 ) + 20 ) + 'px' )
    .style( 'left', 20 * ( i + 1 ) +'px' );

  /*panel.append( 'div' )
    .attr( 'class', 'close-panel' )
    .append( 'span' )
    .append( 'b' )
      .text( 'X' );*/
  
  var body = panel.append( 'div' )
    .attr( 'class', 'panel-body' );

  body.append( 'div' )
    .append( 'span' )
    .html( '<b>' + element[ entity ].toUpperCase() + '</b>&nbsp;&nbsp;' );

  if ( entity === 'character' ) {
    var group_name = data[ 'groups' ].filter( d => d[ 'id' ] === element[ 'group' ] )[ 0 ][ 'group' ];
    if ( element[ 'subgroup' ] !== '' ) {
      console.log( element );
      var subgroup_name = data[ 'subgroups' ].filter( d => d[ 'id' ] === element[ 'subgroup' ] )[ 0 ][ 'subgroup' ];
    }

    body.append( 'div' )
      .append( 'span' )
      .style( 'font-size', '0.7rem' )
      .html( ( ( subgroup_name !== undefined ) ? ( subgroup_name + '<br />' ) : '' ) + group_name + '&nbsp;&nbsp;' );
  } else if ( entity === 'subgroup' )
    body.append( 'div' )
      .append( 'span' )
      .style( 'font-size', '0.7rem' )
      .html( 'Autodefensas Unidas de Colombia&nbsp;&nbsp;' );

  
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
    .style( 'opacity', .75 );

  // Dragging panel
  panel
    .call( d3.drag().on( 'drag', function() {
      d3.select( this )
        .style( 'top',  ( d3.event.y - 10 ) + 'px' )
        .style( 'left', ( d3.event.x - 10 ) + 'px' )
    } ) );

  /*d3.select( '#player_' + id ).selectAll( '.close-panel' )
    .on( 'click', function() {
      var element = d3.select( this.parentNode );
      console.log( element.attr( 'id' ) );
      close_panel( element );
    } );*/

  i++;

}

function close_panel( element ) {
  element
    .transition()
    .duration( 1000 )
    .style( 'opacity', 0 )
    .remove();
}

function restart() {

  d3.selectAll( '.hidden' )
    .classed( 'hidden', false );

  d3.selectAll( '.active-link' )
    .classed( 'active-link', false );

  // Showing the phantoms
  d3.select( '.phantoms' )
    .style( 'visibility', 'visible' );

  d3.selectAll( '.active' )
    .classed( 'active', false )
    .classed( 'scaled', false )
    .attr( 'points', function() {
      
      var elem = d3.select( this );

      // Define the kind of node
      var entity = get_entity( elem );

      if ( entity !== 'character' ) {
        var scaled_points = geometric.polygonScale( get_points( elem ), .90909 );
        return scaled_points.join( ' ' );
      }

    } );

  d3.selectAll( '.active-text' )
    .classed( 'active-text', false );

  d3.selectAll( '.minor-text' )
    .classed( 'minor-text', false );

  d3.selectAll( '.minor' )
    .classed( 'minor', false )

  // Close all panels
  close_panels();

}

function close_panels() {
  d3.selectAll( '.panel' )
    .transition()
    .duration( 1000 )
    .style( 'opacity', 0 )
    .remove();
   i = 0;
}
