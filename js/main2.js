
var width = 1300,
  height = 900,
  centroid = {
    x: ( 4 * width / 6 ),
    y: ( 3 * height / 5 ) 
  };

var points = 100;

var frameworksRadius = 10,
  groupsRadius1 = 120,
  groupsRadius2 = 210,
  groupsRadius3 = 280,
  charactersRadius1 = 350,
  charactersRadius2 = 400,
  scenesRadius1 = 160,
  scenesRadius2 = ( 160 * 2 ) + 20,
  scenesRadius3 = ( 160 * 3 ) + 30,
  scenesRadius4 = ( 160 * 4 ) + 40,
  scenesRadius5 = 160 * 5;

// Loading data
d3.csv( './data/frameworks.csv' ).then( d => draw_frameworks( d ) );

d3.csv( './data/groups.csv' ).then( d => draw_groups( d ) );

//d3.csv( './data/subgroups.csv' ).then( d => draw_subgroups( d ) );

d3.csv( './data/characters.csv' ).then( d => draw_characters( d ) );

d3.csv( './data/scenes.csv' ).then( d => draw_scenes( d ) );

/* Scales */

var frameworksScale = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ 0, 2 * Math.PI ] );

var frameworkTextScale = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ -0.35, 0.35 ] );

var frameworksPos = d3.scaleBand()
    .range( [ 0, 1 ] );

var groupsScale1 = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ 4.5 * Math.PI / 6, 5.5 * Math.PI / 6 ] );

var groupsScale2 = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ Math.PI / 6, 4 * Math.PI / 6 ] );

var groupsScale3 = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ 2 * Math.PI / 6, 3 * Math.PI / 6 ] );

var groupTextScale = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ Math.PI / 6 - 0.3, Math.PI / 6 + 0.2 ] );

var groupsPos1 = d3.scaleBand()
  .range( [ .3, .5 ] )
  .padding( 1 );

var groupsPos2 = d3.scaleBand()
  .range( [ .04, .4 ] )
  .padding( 1 );

var groupsPos3 = d3.scaleBand()
  .range( [ .07, .34 ] )
  .padding( 1 );

var groupsSize = d3.scaleLinear()
  .domain( [ 1, 11 ] )
  .range( [ 3, 35 ] );

var charactersScale = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ Math.PI / 6, 5 * Math.PI / 6 ] );

var characterTextScale = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ 5 * Math.PI / 6, 5 * Math.PI / 6 - 0.2 ] );

var charactersPos = d3.scaleBand()
  .range( [ .03, .4 ] )
  .padding( 1 );

var scenesScale1 = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ 11 * Math.PI / 10, 19 * Math.PI / 10 ] );

var scenesScale2 = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ 11 * Math.PI / 10, 19 * Math.PI / 10 ] );

var scenesScale3 = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ 13 * Math.PI / 10, 19 * Math.PI / 10 ] );

var scenesScale4 = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ 13 * Math.PI / 10, 18 * Math.PI / 10 ] );

var scenesScale5 = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ 14 * Math.PI / 10, 17 * Math.PI / 10 ] );

var sceneTextScale = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ 18 * Math.PI / 10 - 0.07, 18 * Math.PI / 10 + 0.07 ] );

var scenesPos1 = d3.scaleBand()
  .range( [ .4, 1.2 ] )
  .padding( 1 );

var scenesPos2 = d3.scaleBand()
  .range( [ .5, 1.07 ] )
  .padding( 1 );

var scenesPos3 = d3.scaleBand()
  .range( [ .62, .98 ] )
  .padding( 1 );

var scenesPos4 = d3.scaleBand()
  .range( [ .65, .9 ] )
  .padding( 1 );

var scenesPos5 = d3.scaleBand()
  .range( [ .68, .87 ] )
  .padding( 1 );

var scenesSize = d3.scaleLinear()
  .domain( [ 1, 4 ] )
  .range( [ 10, 30 ] );

/* Shapes */

var frameworksLine = d3.lineRadial()
  .radius( frameworksRadius )
  .angle( ( d, i ) => frameworksScale( i ) );

var frameworkTextLine = d3.lineRadial()
  .radius( frameworksRadius + 50 )
  .angle( ( d, i ) => frameworkTextScale( i ) );

var groupsLine1 = d3.lineRadial()
  .radius( groupsRadius1 )
  .angle( ( d, i ) => groupsScale1( i ) );

var groupsLine2 = d3.lineRadial()
  .radius( groupsRadius2 )
  .angle( ( d, i ) => groupsScale2( i ) );

var groupsLine3 = d3.lineRadial()
  .radius( groupsRadius3 )
  .angle( ( d, i ) => groupsScale3( i ) );

var groupTextLine = d3.lineRadial()
  .radius( groupsRadius2 + 50 )
  .angle( ( d, i ) => groupTextScale( i ) );

var charactersLine1 = d3.lineRadial()
  .radius( charactersRadius1 )
  .angle( ( d, i ) => charactersScale( i ) );

var charactersLine2 = d3.lineRadial()
  .radius( charactersRadius2 )
  .angle( ( d, i ) => charactersScale( i ) );

var characterTextLine = d3.lineRadial()
  .radius( charactersRadius1 - 25 )
  .angle( ( d, i ) => characterTextScale( i ) );

// Scenes

var scenesLine1 = d3.lineRadial()
  .radius( scenesRadius1 )
  .angle( ( d, i ) => scenesScale1( i ) );

var scenesLine2 = d3.lineRadial()
  .radius( scenesRadius2 )
  .angle( ( d, i ) => scenesScale2( i ) );

var scenesLine3 = d3.lineRadial()
  .radius( scenesRadius3 )
  .angle( ( d, i ) => scenesScale3( i ) );

var scenesLine4 = d3.lineRadial()
  .radius( scenesRadius4 )
  .angle( ( d, i ) => scenesScale4( i ) );

var scenesLine5 = d3.lineRadial()
  .radius( scenesRadius5 )
  .angle( ( d, i ) => scenesScale5( i ) );

var sceneTextLine = d3.lineRadial()
  .radius( scenesRadius3 + 80 )
  .angle( ( d, i ) => sceneTextScale( i ) );

/* Drawing */

var svg = d3.select( '#vis' ).append( 'svg' )
  .attr( 'width', width )
  .attr( 'height', height )
  .append( 'g' );

// Frameworks

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'class', 'line' )
    .attr( 'd', frameworksLine )
    .attr( 'transform', 'translate(' + centroid.x + ', ' + centroid.y + ')' );

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'id', 'frameworkText' )
    .attr( 'class', 'line-text' )
    .attr( 'd', frameworkTextLine )
    .attr( 'transform', 'translate(' + centroid.x + ', ' + centroid.y + ')' );

svg.append( 'text' )
  .append( 'textPath' )
    .attr( 'xlink:href', '#frameworkText' )
    .attr( 'fill', '#fcfff5' )
    .style( 'opacity', .5 )
    .style( 'font-size', 10 )
    .text( 'MARCOS' );

svg.append( 'use' )
  .attr( 'xlink:href', '#frameworkText' );

// Groups

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'class', 'line' )
    .attr( 'd', groupsLine1 )
    .attr( 'transform', 'translate(' + centroid.x + ', ' + centroid.y + ')' );

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'class', 'line' )
    .attr( 'd', groupsLine2 )
    .attr( 'transform', 'translate(' + centroid.x + ', ' + centroid.y + ')' );

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'class', 'line' )
    .attr( 'd', groupsLine3 )
    .attr( 'transform', 'translate(' + centroid.x + ', ' + centroid.y + ')' );

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'id', 'groupText' )
    .attr( 'class', 'line-text' )
    .attr( 'd', groupTextLine )
    .attr( 'transform', 'translate(' + centroid.x + ', ' + centroid.y + ')' );

svg.append( 'text' )
  .append( 'textPath' )
    .attr( 'xlink:href', '#groupText' )
    .attr( 'fill', '#33D168' )
    .style( 'opacity', .5 )
    .style( 'font-size', 10 )
    .text( 'GRUPOS Y SUBGRUPOS' );

svg.append( 'use' )
  .attr( 'xlink:href', '#groupText' );

// Characters

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'class', 'line' )
    .attr( 'd', charactersLine1 )
    .attr( 'transform', 'translate(' + centroid.x + ', ' + centroid.y + ')' );

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'class', 'line' )
    .attr( 'd', charactersLine2 )
    .attr( 'transform', 'translate(' + centroid.x + ', ' + centroid.y + ')' );

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'id', 'characterText' )
    .attr( 'class', 'line-text' )
    .attr( 'd', characterTextLine )
    .attr( 'transform', 'translate(' + centroid.x + ', ' + centroid.y + ')' );

svg.append( 'text' )
  .append( 'textPath' )
    .attr( 'xlink:href', '#characterText' )
    .attr( 'fill', '#FEE838' )
    .style( 'opacity', .5 )
    .style( 'font-size', 10 )
    .text( 'PERSONAJES' );

svg.append( 'use' )
  .attr( 'xlink:href', '#characterText' );

// Scenes

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'class', 'line' )
    .attr( 'd', scenesLine1 )
    .attr( 'transform', 'translate(' + centroid.x + ', ' + centroid.y + ')' );

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'class', 'line' )
    .attr( 'd', scenesLine2 )
    .attr( 'transform', 'translate(' + centroid.x + ', ' + centroid.y + ')' );

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'class', 'line' )
    .attr( 'd', scenesLine3 )
    .attr( 'transform', 'translate(' + centroid.x + ', ' + centroid.y + ')' );

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'class', 'line' )
    .attr( 'd', scenesLine4 )
    .attr( 'transform', 'translate(' + centroid.x + ', ' + centroid.y + ')' );

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'class', 'line' )
    .attr( 'd', scenesLine5 )
    .attr( 'transform', 'translate(' + centroid.x + ', ' + centroid.y + ')' );

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'id', 'sceneText' )
    .attr( 'class', 'line-text' )
    .attr( 'd', sceneTextLine )
    .attr( 'transform', 'translate(' + centroid.x + ', ' + centroid.y + ')' );

svg.append( 'text' )
  .append( 'textPath' )
    .attr( 'xlink:href', '#sceneText' )
    .attr( 'fill', '#B0EBE8' )
    .style( 'opacity', .5 )
    .style( 'font-size', 10 )
    .text( 'ESCENAS' );

svg.append( 'use' )
  .attr( 'xlink:href', '#sceneText' );

function draw_frameworks( frameworks ) {
  
  frameworks.map( f => {
    f.h = d3.randomInt( -20, 20 )();
    return f;
  } );

  frameworksPos
    .domain( frameworks.map( d => d.framework ) );

  svg.selectAll( 'circle.framework' )
    .data( frameworks )
    .enter().append( 'circle' )
      .attr( 'class', 'framework' )
      .attr( 'cx', d => frameworksRadius * Math.cos( frameworksPos( d.framework ) * Math.PI * 2 - Math.PI / 2 ) )
      .attr( 'cy', d => frameworksRadius * Math.sin( frameworksPos( d.framework ) * Math.PI * 2 - Math.PI / 2 ) )
      .attr( 'r',  1 )
      .attr( 'fill', '#fcfff5' )
      .attr( 'transform', 'translate(' + centroid.x+ ', ' + centroid.y + ')' );

}

function draw_groups( groups ) {

  console.log( groups );

  var datar = d3.range( 0, 9, 1 ).map( c => {
    return {
      x: c,
      y: d3.randomInt( 0, 2 )()
    };
  } );

  var x = d3.scaleLinear()
    .domain([d3.min(datar, d => d.x), d3.max(datar, d => d.x)])
    .range([0, 2 * Math.PI]);

  var y1 = d3.scaleLinear()
    .domain( [ d3.min( datar, d => d.y ), d3.max( datar, d => d.y ) ] )
    .range( [ 10, 12 ] );

  var y2 = d3.scaleLinear()
    .domain( [ d3.min( datar, d => d.y ), d3.max( datar, d => d.y ) ] )
    .range( [ 20, 23 ] );

  var y3 = d3.scaleLinear()
    .domain( [ d3.min( datar, d => d.y ), d3.max( datar, d => d.y ) ] )
    .range( [ 40, 45 ] );

  var line = d3.lineRadial()
    .curve( d3.curveLinearClosed )
    .angle( d => x( d.x ) );

  groupsPos1
    .domain( groups.filter( d => +d.arc === 1 ).map( d => d.id ) );

  groupsPos2
    .domain( groups.filter( d => +d.arc === 2 ).map( d => d.id ) );

  groupsPos3
    .domain( groups.filter( d => +d.arc === 3 ).map( d => d.id ) );

  groups.map( s => {
    if ( +s.arc === 1 ) {
      s.h = groupsRadius1 + d3.randomInt( -10, 10 )();
      //s.r = y1;
      s.scale = groupsPos1;
    } else if ( +s.arc === 2 ) {
      s.h = groupsRadius2 + d3.randomInt( -10, 10 )();
      //s.r = y2;
      s.scale = groupsPos2;
    } else if ( +s.arc === 3 ) {
      s.h = groupsRadius3 + d3.randomInt( -10, 10 )();
      //s.r = y3;
      s.scale = groupsPos3;
    }
    return s;
  } );

  groups.map( s => {
    if ( +s.size <= 2 ) {
      s.r = y1;
    } else if ( +s.size <= 5 ) {
      s.r = y2;
    } else if ( +s.size <= 11 ) {
      s.r = y3;
    }
    return s;
  } );

  /*svg.selectAll( 'circle.group' )
    .data( groups )
    .enter().append( 'circle' )
      .attr( 'id', d => d.group )
      .attr( 'class', 'group' )
      .attr( 'cx', d => d.h * Math.cos( d.scale( d.id ) * Math.PI * 2 - Math.PI / 2 ) )
      .attr( 'cy', d => d.h * Math.sin( d.scale( d.id ) * Math.PI * 2 - Math.PI / 2 ) )
      .attr( 'r', d => groupsSize( d.size ) )
      .attr( 'stroke', '#0dd169' )
      .attr( 'fill', '#0dd169' )
      .style( 'fill-opacity', .03 )
      .attr( 'stroke-width', 1 )
      .attr( 'transform', 'translate(' + centroid.x + ', ' + centroid.y + ')' );*/

  svg.selectAll( 'path.group' )
    .data( groups )
    .enter().append( 'path' )
      .attr( 'id', d => 'group_' + d.id )
      .attr( 'class', 'group' )
      .attr( 'stroke', '#0dd169' )
      .attr( 'fill', '#0dd169' )
      .style( 'fill-opacity', .03 )
      .attr( 'stroke-width', 1 )
      .attr( 'active', false )
      .attr( 'd', a => line.radius( d => a.r( d.y ) )( datar ) )
      .attr( 'transform', d => 'translate(' + d.h * Math.cos( d.scale( d.id ) * Math.PI * 2 - Math.PI / 2 ) + ', ' + d.h * Math.sin( d.scale( d.id ) * Math.PI * 2 - Math.PI / 2 ) + ')' 
                              + 'translate(' + centroid.x + ', ' + centroid.y + ')' )
      .on( 'click', function( datum ) {
        var elem = d3.select( this );
        if( elem.attr( 'active' ) == "true" ) {
          elem.attr( 'active', false ).style( 'fill-opacity', .03 );
        } else {
          elem.attr( 'active', true ).style( 'fill-opacity', .4 );
        }
      } )
      .on( 'mouseover', function( datum ) {
        return tooltip
          .style( 'visibility', 'visible' )
          .html( '<span class="group-text">' + datum.acronym + '</span>' );
      } )
      .on( 'mousemove', function() {
        return tooltip.style( 'top', ( event.pageY - 15 ) + 'px' ).style( 'left', ( event.pageX + 15 ) + 'px' );
      } )
      .on( 'mouseout', function() {
        return tooltip.style( 'visibility', 'hidden' );
      } );

}

function draw_subgroups( subgroups ) {
  
  subgroupsPos
    .domain( subgroups.map( d => d.subgroup ) );

  svg.selectAll( 'circle.subgroup' )
    .data( subgroups )
    .enter().append( 'circle' )
      .attr( 'id', d => d.subgroup )
      .attr( 'class', 'subgroup' )
      .attr( 'cx', d => subgroupsRadius * Math.cos( subgroupsPos( d.subgroup ) * Math.PI * 2 - Math.PI / 2 ) )
      .attr( 'cy', d => subgroupsRadius * Math.sin( subgroupsPos( d.subgroup ) * Math.PI * 2 - Math.PI / 2 ) )
      .attr( 'r',  3 )
      .attr( 'fill', '#0dd169' )
      .attr( 'transform', 'translate(' + width / 2 + ', ' + height / 2 + ')' );

}

function draw_characters( characters ) {
  
  characters.map( c => {
    c.h = d3.randomInt( -30, 30 )();
    return c;
  } );

  charactersPos
    .domain( characters.map( d => d.character ) );

  svg.selectAll( 'circle.character' )
    .data( characters )
    .enter().append( 'circle' )
      .attr( 'id', d => d.subgroup )
      .attr( 'class', 'character' )
      .attr( 'cx', d => ( charactersRadius2 + d.h ) * Math.cos( charactersPos( d.character ) * Math.PI * 2 - Math.PI / 2 ) )
      .attr( 'cy', d => ( charactersRadius2 + d.h ) * Math.sin( charactersPos( d.character ) * Math.PI * 2 - Math.PI / 2 ) )
      .attr( 'r',  2 )
      .attr( 'fill', '#FEE838' )
      .attr( 'transform', 'translate(' + centroid.x + ', ' + centroid.y + ')' );

}

function draw_scenes( scenes ) {

  var datar = d3.range( 0, points, 1 ).map( c => {
    return {
      x: c,
      y: d3.randomInt( 0, 10 )()
    };
  } );

  var x = d3.scaleLinear()
    .domain([d3.min(datar, d => d.x), d3.max(datar, d => d.x)])
    .range([0, 2 * Math.PI]);

  var y1 = d3.scaleLinear()
    .domain( [ d3.min( datar, d => d.y ), d3.max( datar, d => d.y ) ] )
    .range( [ 50, 56 ] );

  var y2 = d3.scaleLinear()
    .domain( [ d3.min( datar, d => d.y ), d3.max( datar, d => d.y ) ] )
    .range( [ 40, 45 ] );

  var y3 = d3.scaleLinear()
    .domain( [ d3.min( datar, d => d.y ), d3.max( datar, d => d.y ) ] )
    .range( [ 30, 34 ] );

  var y4 = d3.scaleLinear()
    .domain( [ d3.min( datar, d => d.y ), d3.max( datar, d => d.y ) ] )
    .range( [ 20, 23 ] );

  var y5 = d3.scaleLinear()
    .domain( [ d3.min( datar, d => d.y ), d3.max( datar, d => d.y ) ] )
    .range( [ 10, 12 ] );

  var line = d3.lineRadial()
    .curve( d3.curveLinearClosed )
    .angle( d => x( d.x ) );

  scenesPos1
    .domain( scenes.filter( d => d.size == 5 ).map( d => d.id ) );

  scenesPos2
    .domain( scenes.filter( d => d.size == 4 ).map( d => d.id ) );

  scenesPos3
    .domain( scenes.filter( d => d.size == 3 ).map( d => d.id ) );

  scenesPos4
    .domain( scenes.filter( d => d.size == 2 ).map( d => d.id ) );

  scenesPos5
    .domain( scenes.filter( d => d.size == 1 ).map( d => d.id ) );

  scenes.map( s => {
    if (s.size == 5 ) {
      s.h = scenesRadius1 + d3.randomInt( -10, 10 )();
      s.r = y1;
      s.scale = scenesPos1;
    } else if (s.size == 4 ) {
      s.h = scenesRadius2 + d3.randomInt( -20, 20 )();
      s.r = y2;
      s.scale = scenesPos2;
    } else if (s.size == 3 ) {
      s.h = scenesRadius3 + d3.randomInt( -30, 30 )();
      s.r = y3;
      s.scale = scenesPos3;
    } else if (s.size == 2 ) {
      s.h = scenesRadius4 + d3.randomInt( -40, 40 )();
      s.r = y4;
      s.scale = scenesPos4;
    } else if (s.size == 1 ) {
      s.h = scenesRadius5 + d3.randomInt( -50, 50 )();
      s.r = y5;
      s.scale = scenesPos5;
    }
    return s;
  } );

  svg.selectAll( 'path.scene' )
    .data( scenes )
    .enter().append( 'path' )
      .attr( 'id', d => 'scene_' + d.id )
      .attr( 'class', 'scene' )
      .attr( 'stroke', '#b0ebe8' )
      .attr( 'fill', '#b0ebe8' )
      .style( 'fill-opacity', .03 )
      .attr( 'stroke-width', 1 )
      .attr( 'active', false )
      .attr( 'd', a => line.radius( d => a.r( d.y ) )( datar ) )
      .attr( 'transform', d => 'translate(' + d.h * Math.cos( d.scale( d.id ) * Math.PI * 2 - Math.PI / 2 ) + ', ' + d.h * Math.sin( d.scale( d.id ) * Math.PI * 2 - Math.PI / 2 ) + ')' 
                              + 'translate(' + centroid.x + ', ' + centroid.y + ')' )
      .on( 'click', function( datum ) {
        var elem = d3.select( this );
        if( elem.attr( 'active' ) == "true" ) {
          elem.attr( 'active', false ).style( 'fill-opacity', .03 );
        } else {
          elem.attr( 'active', true ).style( 'fill-opacity', .4 );
        }
      } )
      .on( 'mouseover', function( datum ) {
        return tooltip
          .style( 'visibility', 'visible' )
          .html( '<span class="scene-text">' + datum.scene + '</span>' );
      } )
      .on( 'mousemove', function() {
        return tooltip.style( 'top', ( event.pageY - 15 ) + 'px' ).style( 'left', ( event.pageX + 15 ) + 'px' );
      } )
      .on( 'mouseout', function() {
        return tooltip.style( 'visibility', 'hidden' );
      } );

}

var tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .text("a simple tooltip");
