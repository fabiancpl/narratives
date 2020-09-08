
var i = 0;

var data = {};

var last_click = undefined,
  panels = [];

d3.csv( './data/scenes.csv' ).then( d => {
  d = d.map( i => {
    if ( i[ 'related' ].includes( ',' ) ) {
      i[ 'related' ] = i[ 'related' ].split( ',' );
    } else {
      if ( i[ 'related' ] !== '' ) {
        i[ 'related' ] = [ i[ 'related' ] ];  
      } else {
        i[ 'related' ] = [];
      }
    }

    i[ 'popup_coords' ] = i[ 'popup_coords' ].split( ',' ).map( c => +c );
    
    return i 
  } );
  data[ 'scenes' ] = d
} );

d3.csv( './data/groups.csv' ).then( d => {
  d = d.map( i => {
    i[ 'popup_coords' ] = i[ 'popup_coords' ].split( ',' ).map( c => +c );
    return i 
  } );
  data[ 'groups' ] = d
} );

d3.csv( './data/subgroups.csv' ).then( d => {
  d = d.map( i => {
    i[ 'popup_coords' ] = i[ 'popup_coords' ].split( ',' ).map( c => +c );
    return i 
  } );
  data[ 'subgroups' ] = d
} );

d3.csv( './data/characters.csv' ).then( d => {
  d = d.map( i => {
    i[ 'popup_coords' ] = i[ 'popup_coords' ].split( ',' ).map( c => +c );
    return i 
  } );
  data[ 'characters' ] = d
} );

d3.csv( './data/relationships.csv' ).then( d => data[ 'relationships' ] = d );

d3.csv( './data/audio-scenes.csv' ).then( d => {
  data[ 'audios' ] = d.map( a => {
    a[ 'start_sec' ] = normalize_time( a[ 'start' ].split( ':' ).map( t => +t ) );
    a[ 'end_sec' ] = normalize_time( a[ 'end' ].split( ':' ).map( t => +t ) );
    return a
  } );
} );

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

    console.log( 'last_click: ', last_click );
    console.log( 'entity: ', entity );

    if ( [ 'group', 'subgroup' ].includes( last_click ) ) {

      if ( entity === 'character' ) {
        
        // Showing the panel
        show_panel( elem.attr( 'id' ), entity );
      
      } else if ( last_click === 'subgroup' && entity === 'group' ) {

        show_elements();

      }

    } else if ( last_click === 'scene' && entity === 'character' ) {

      // Showing the panel
      show_panel( elem.attr( 'id' ), entity );

    } else {

      if ( ![ 'group', 'subgroup' ].includes( entity ) || last_click === undefined ) {
        if ( !elem.classed( 'active' ) || ( last_click === 'character' && entity === 'scene' ) )
          show_elements();

      }

    }

    function show_elements() {

      restart();

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
          var related_scenes = data[ 'scenes' ].filter( d => d[ 'id' ] === elem.attr( 'id' ) )[ 0 ][ 'related' ];
          if ( related_scenes.length > 0 ) {
            d3.selectAll( related_scenes.map( s => '#' + s + '.scene' ).join( ',' ) )
              .classed( 'hidden', false )
              .classed( 'hover', false )
              .classed( 'minor', true );

            d3.selectAll( related_scenes.map( s => '#' + s + '.scene-name' ).join( ',' ) )
              .classed( 'hidden', false )
              .classed( 'visible-text', false )
              .classed( 'minor-text', true );
          }

        }

        // Hiding the phantoms
        d3.select( '.phantoms' )
          .style( 'visibility', 'hidden' );

        // Showing the panel
        show_panel( elem.attr( 'id' ), entity );

        last_click = entity;

    }

  } )
  .on( 'mouseover', function() {
    
    var elem = d3.select( this );

    // Define the kind of node
    var entity = get_entity( elem );

    if ( ( elem.classed( 'active' ) === false ) && ( elem.classed( 'minor' ) === false ) ) {

      // Scale up the node, if it is not previously scaled
      /*if ( entity !== 'character' )
        if ( !elem.classed( 'scaled' ) ) {
          var scaled_points = geometric.polygonScale( get_points( elem ), 1.1 );
          elem
            .classed( 'scaled', true )
            .attr( 'points', scaled_points.join( ' ' ) );
        }*/

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
            //if ( group[ 'organizer' ] === 'false' ) {
              
              if ( last_click !== 'subgroup' ) {

                d3.select( '#' + r[ 'group' ] + '.group-name' )
                  .classed( 'visible-text', true );

              }

              d3.select( '#' + r[ 'id' ] + '.character' )
                .classed( 'hover', true );

              d3.select( '#' + r[ 'id' ] + '.character-link' )
                .classed( 'visible-link', true );

              d3.select( '#' + r[ 'id' ] + '.character-name' )
                .classed( 'visible-text', true );

            //}

          } );

        //if ( last_click === 'subgroup' ) {

          var group_characters = data[ 'characters' ].filter( c => c[ 'group' ] === elem.attr( 'id' ) ).map( c => c[ 'id' ] );
          d3.selectAll( group_characters.map( c => '#' + c + '.character' ).join( ',' ) )
            .classed( 'hidden', false );
        //}

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
        var related_scenes = data[ 'scenes' ].filter( d => d[ 'id' ] === elem.attr( 'id' ) )[ 0 ][ 'related' ];
        if ( related_scenes.length > 0 ) {
          d3.selectAll( related_scenes.map( s => '#' + s + '.scene' ).join( ',' ) )
            .classed( 'hover', true );

          d3.selectAll( related_scenes.map( s => '#' + s + '.scene-name' ).join( ',' ) )
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

    if ( last_click !== undefined ) {
      d3.selectAll( '.character:not(.active)' )
          .classed( 'hidden', true );
    }

    // Scale down the text, if it is not active
    /*if ( entity !== 'character' )
      if ( !elem.classed( 'active' ) && !elem.classed( 'minor' ) ) {
        var scaled_points = geometric.polygonScale( get_points( elem ), .90909 );
        elem
          .classed( 'scaled', false )
          .attr( 'points', scaled_points.join( ' ' ) );
      }*/

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
  
  if ( panels.includes( element_id ) === false ) {

    // Panel id
    var id = element_id;

    var top = ( 20 * ( i + 1 ) + 20 ),
      left = 20 * ( i + 1 );

    function get_coords( element, entity ) {

      if ( ( entity === 'character' ) && panels.map( p => p.substring( 0, 2 ) ).includes( 'E-' ) ) {

        // Delete old character panel
        if ( panels.length > 1 ) close_panel( d3.select( '#player_' + panels[ 1 ] ) );

        var elem = d3.select( '#player_' + panels[ 0 ] );
        return [ +elem.style( 'top' ).replace( 'px', '' ), +elem.style( 'left' ).replace( 'px', '' ) + +elem.style( 'width' ).replace( 'px', '' ) + 10 ];

      } else {

        if ( element[ 'popup_coords' ].length === 2  ) {
          let rect = document.getElementById( 'viz' ).getBoundingClientRect();
          var centroid;
          if ( entity !== 'character' ) {
            centroid = d3.polygonCentroid( get_points( d3.select( '#' + element[ 'id' ] + '.' + entity ) ) );
          } else {

            var elem = d3.select( '#' + element[ 'id' ] + '.' + entity );
            centroid = [ +elem.attr( 'cx' ), +elem.attr( 'cy' ) ];
            console.log( centroid );
          }
          
          var top = rect.y + ( ( ( centroid[ 1 ] + element[ 'popup_coords' ][ 1 ] ) * rect.height ) / 1100 ),
            left = rect.x + ( ( ( centroid[ 0 ] + element[ 'popup_coords' ][ 0 ] ) * rect.width ) / 1920 );
          return [ top, left ];
        }

      }

    }

    var element;
    var background_color;
    var color;
    var coords;

    if ( entity === 'scene' ) { 
      element = data[ 'scenes' ].filter( d => d[ 'id' ] === element_id )[ 0 ];
      background_color = '#404945';
      color = '#A3BFB5';
      coords = get_coords( element, entity );
    } else if ( entity === 'group' ) {
      element = data[ 'groups' ].filter( d => d[ 'id' ] === element_id )[ 0 ];
      
      var group = data[ 'groups' ].filter( g => g[ 'id' ] === element_id )[ 0 ];
      if ( group[ 'organizer' ] === 'false' ) {
        background_color = '#D24F4B';
        color = '#0D0D0D';
      } else {
        background_color = '#132F92';
        color = '#A3BFB5';
      }

      coords = get_coords( element, entity );
    } else if ( entity === 'subgroup' ) {
      element = data[ 'subgroups' ].filter( d => d[ 'id' ] === element_id )[ 0 ];
      background_color = '#D24F4B';
      color = '#0D0D0D';
      coords = get_coords( element, entity );
    } else if ( entity === 'character' ) {
      element = data[ 'characters' ].filter( d => d[ 'id' ] === element_id )[ 0 ];
      background_color = '#DA797F';
      color = '#0D0D0D';
      coords = get_coords( element, entity );
    }

    /*d3.select( '#' + element_id + '.' + entity + '-name' )
      .classed( 'active-text', false )
      .classed( 'visible-text', false );*/

    if ( coords !== undefined ) {
      top = coords[ 0 ];
      left = coords[ 1 ];
    }

    var panel = d3.select( 'body' ).append( 'div' )
      .attr( 'id', 'player_' + id )
      .attr( 'class', 'panel' )
      .style( 'background-color', background_color )
      .style( 'color', color )
      .style( 'top', top + 'px' )
      .style( 'left', left +'px' );

    /*panel.append( 'div' )
      .attr( 'class', 'close-panel' )
      .append( 'span' )
      .append( 'b' )
        .text( 'X' );*/
    
    var body = panel.append( 'div' )
      .attr( 'class', 'panel-body' );

    // Drawing audio
    if ( element[ 'audio' ] !== undefined && element[ 'audio' ] !== '' ) {
      body.append( 'div' )
        .attr( 'class', 'mediPlayer' )
        .append( 'audio' )
          .attr( 'class', 'listen' )
          .attr( 'preload', 'none' )
          .attr( 'data-size', 30 )
          .attr( 'src', './audios/' + element[ 'audio' ] );

      $( '#player_' + id ).find( '.mediPlayer' ).mediaPlayer( { 'id': id, 'color': color } );
    }

    var div = body.append( 'div' )
      .style( 'float', 'left' )
      .style( 'margin-left', '5px' );

    if ( entity === 'character' ) {

      div.append( 'div' )
        .append( 'span' )
        .html( '<b>' + element[ entity ] + '</b>&nbsp;&nbsp;' );

      var group_name = data[ 'groups' ].filter( d => d[ 'id' ] === element[ 'group' ] )[ 0 ][ 'group' ];
      if ( element[ 'subgroup' ] !== '' ) {
        console.log( element );
        var subgroup_name = data[ 'subgroups' ].filter( d => d[ 'id' ] === element[ 'subgroup' ] )[ 0 ][ 'subgroup' ];
      }

      div.append( 'div' )
        .append( 'span' )
        .style( 'font-size', '0.7rem' )
        .html( '<b>' + group_name.toUpperCase() + '</b>' + ( ( subgroup_name !== undefined ) ? ( '<br />' + subgroup_name ) : '' ) );

    } else if ( entity === 'scene' ) {

      div.append( 'div' )
        .append( 'span' )
        .html( '<b>' + element[ entity ] + '</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' );

      var container = div.append( 'div' )
      
      container
        .append( 'span' )
          .attr( 'id', 'popup_time_char_' + element_id )
          .style( 'font-size', '0.7rem' )
          .text( '' );

    } else if ( entity === 'subgroup' ) {

      div.append( 'div' )
        .append( 'span' )
        .html( '<b>AUTODEFENSAS UNIDAS DE COLOMBIA</b>&nbsp;&nbsp;' );

      div.append( 'div' )
        .append( 'span' )
        .style( 'font-size', '0.7rem' )
        .html( '<b /><b>' + element[ entity ] + '</b>&nbsp;&nbsp;' );

      div.append( 'div' )
        .append( 'span' )
        .style( 'font-size', '0.7rem' )
        .html( data[ 'subgroups' ].find( g => g[ 'id' ] === element_id )[ 'description' ] );

    } else if ( entity === 'group' ) {

      div.append( 'div' )
        .append( 'span' )
        .html( '<b>' + element[ entity ].toUpperCase() + '</b>&nbsp;&nbsp;' );

      div.append( 'div' )
        .append( 'span' )
        .style( 'font-size', '0.7rem' )
        .html( data[ 'groups' ].find( g => g[ 'id' ] === element_id )[ 'description' ] );

    }

    // Showing panel
    panel
      .transition()
      .duration( 1000 )
      .style( 'opacity', 1 );

    // Dragging panel
    panel
      .call( d3.drag().on( 'drag', function() {
        d3.select( this )
          .style( 'top',  ( d3.event.y - 10 ) + 'px' )
          .style( 'left', ( d3.event.x - 10 ) + 'px' )
      } ) );

    panels.push( element_id );
    i++;

  }

}

function close_panel( element ) {
  console.log( element );
  let index = panels.indexOf( element.attr( 'id' ).replace( 'player_', '' ) )
  index > -1 ? panels.splice( index, 1 ) : false

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
    .classed( 'active', false );
    /*.classed( 'scaled', false )
    .attr( 'points', function() {
      
      var elem = d3.select( this );

      // Define the kind of node
      var entity = get_entity( elem );

      if ( entity !== 'character' ) {
        var scaled_points = geometric.polygonScale( get_points( elem ), .90909 );
        return scaled_points.join( ' ' );
      }

    } );*/

  d3.selectAll( '.active-text' )
    .classed( 'active-text', false );

  d3.selectAll( '.minor-text' )
    .classed( 'minor-text', false );

  d3.selectAll( '.minor' )
    .classed( 'minor', false )

  // Close all panels
  close_panels();

  last_click = undefined;

}

function close_panels() {
  d3.selectAll( '.panel' )
    .transition()
    .duration( 1000 )
    .style( 'opacity', 0 )
    .remove();
   i = 0;

  panels = []
}

function normalize_time( array ) {
  return ( array[ 0 ] * 60 ) + array[ 1 ];
}
