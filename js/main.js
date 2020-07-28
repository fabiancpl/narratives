
var width = 1300,
  height = 900

var points = 100;

var frameworksRadius = 50,
  groupsRadius = 200,
  subgroupsRadius = 350,
  charactersRadius = 500,
  scenesRadius = 400;

// Loading data
d3.csv( './data/frameworks.csv' ).then( d => draw_frameworks( d ) );

d3.csv( './data/groups.csv' ).then( d => draw_groups( d ) );

d3.csv( './data/subgroups.csv' ).then( d => draw_subgroups( d ) );

d3.csv( './data/characters.csv' ).then( d => draw_characters( d ) );

d3.csv( './data/scenes.csv' ).then( d => draw_scenes( d ) );

/* Scales */

var frameworksScale = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ 0, 2 * Math.PI ] );

var frameworkTextScale = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ -0.3, 0.3 ] );

var frameworksPos = d3.scaleBand()
    .range( [ 0, 1 ] );

var groupsScale = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ Math.PI / 6, 5 * Math.PI / 6 ] );

var groupTextScale = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ 0.3, 0.9 ] );

var groupsPos = d3.scaleBand()
  .range( [ .05, .45 ] )
  .padding( 1 );

var subgroupsScale = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ Math.PI / 6, 5 * Math.PI / 6 ] );

var subgroupsPos = d3.scaleBand()
  .range( [ .05, .45 ] )
  .padding( 1 );

var charactersScale = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ Math.PI / 6, 5 * Math.PI / 6 ] );

var characterTextScale = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ 5 * Math.PI / 6, 4.5 * Math.PI / 6 ] );

var charactersPos = d3.scaleBand()
  .range( [ .12, .38 ] )
  .padding( 1 );

var scenesScale = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ 7 * Math.PI / 6, 11 * Math.PI / 6 ] );

var sceneTextScale = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ 10.7 * Math.PI / 6, 11 * Math.PI / 6 ] );

var scenesPos = d3.scaleBand()
  .range( [ .6, .9 ] )
  .padding( 1 );

/* Shapes */

var frameworksLine = d3.lineRadial()
  .radius( frameworksRadius )
  .angle( ( d, i ) => frameworksScale( i ) );

var frameworkTextLine = d3.lineRadial()
  .radius( frameworksRadius + 25 )
  .angle( ( d, i ) => frameworkTextScale( i ) );

var groupsLine = d3.lineRadial()
  .radius( groupsRadius )
  .angle( ( d, i ) => groupsScale( i ) );

var groupTextLine = d3.lineRadial()
  .radius( groupsRadius + 75 )
  .angle( ( d, i ) => groupTextScale( i ) );

var subgroupsLine = d3.lineRadial()
  .radius( subgroupsRadius )
  .angle( ( d, i ) => subgroupsScale( i ) );

var charactersLine = d3.lineRadial()
  .radius( charactersRadius )
  .angle( ( d, i ) => charactersScale( i ) );

var characterTextLine = d3.lineRadial()
  .radius( charactersRadius - 25 )
  .angle( ( d, i ) => characterTextScale( i ) );

var scenesLine = d3.lineRadial()
  .radius( scenesRadius )
  .angle( ( d, i ) => scenesScale( i ) );

var sceneTextLine = d3.lineRadial()
  .radius( scenesRadius + 25 )
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
    .attr( 'transform', 'translate(' + width / 2 + ', ' + height / 2 + ')' );

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'id', 'frameworkText' )
    .attr( 'class', 'line-text' )
    .attr( 'd', frameworkTextLine )
    .attr( 'transform', 'translate(' + width / 2 + ', ' + height / 2 + ')' );

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
    .attr( 'd', groupsLine )
    .attr( 'transform', 'translate(' + width / 2 + ', ' + height / 2 + ')' );

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'id', 'groupText' )
    .attr( 'class', 'line-text' )
    .attr( 'd', groupTextLine )
    .attr( 'transform', 'translate(' + width / 2 + ', ' + height / 2 + ')' );

svg.append( 'text' )
  .append( 'textPath' )
    .attr( 'xlink:href', '#groupText' )
    .attr( 'fill', '#33D168' )
    .style( 'opacity', .5 )
    .style( 'font-size', 10 )
    .text( 'GRUPOS Y SUBGRUPOS' );

svg.append( 'use' )
  .attr( 'xlink:href', '#groupText' );

// Subgroups

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'class', 'line' )
    .attr( 'd', subgroupsLine )
    .attr( 'transform', 'translate(' + width / 2 + ', ' + height / 2 + ')' );

// Characters

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'class', 'line' )
    .attr( 'd', charactersLine )
    .attr( 'transform', 'translate(' + width / 2 + ', ' + height / 2 + ')' );

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'id', 'characterText' )
    .attr( 'class', 'line-text' )
    .attr( 'd', characterTextLine )
    .attr( 'transform', 'translate(' + width / 2 + ', ' + height / 2 + ')' );

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
    .attr( 'd', scenesLine )
    .attr( 'transform', 'translate(' + width / 2 + ', ' + height / 2 + ')' );

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'id', 'sceneText' )
    .attr( 'class', 'line-text' )
    .attr( 'd', sceneTextLine )
    .attr( 'transform', 'translate(' + width / 2 + ', ' + height / 2 + ')' );

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
      .attr( 'cx', d => ( frameworksRadius + d.h ) * Math.cos( frameworksPos( d.framework ) * Math.PI * 2 - Math.PI / 2 ) )
      .attr( 'cy', d => ( frameworksRadius + d.h ) * Math.sin( frameworksPos( d.framework ) * Math.PI * 2 - Math.PI / 2 ) )
      .attr( 'r',  3 )
      .attr( 'fill', '#fcfff5' )
      .attr( 'transform', 'translate(' + width / 2 + ', ' + height / 2 + ')' );

}

function draw_groups( groups ) {
  
  groupsPos
    .domain( groups.map( d => d.group ) );

  svg.selectAll( 'circle.group' )
    .data( groups )
    .enter().append( 'circle' )
      .attr( 'id', d => d.group )
      .attr( 'class', 'group' )
      .attr( 'cx', d => groupsRadius * Math.cos( groupsPos( d.group ) * Math.PI * 2 - Math.PI / 2 ) )
      .attr( 'cy', d => groupsRadius * Math.sin( groupsPos( d.group ) * Math.PI * 2 - Math.PI / 2 ) )
      .attr( 'r',  3 )
      .attr( 'fill', '#0dd169' )
      .attr( 'transform', 'translate(' + width / 2 + ', ' + height / 2 + ')' );

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
    c.h = d3.randomInt( -60, 60 )();
    return c;
  } );

  charactersPos
    .domain( characters.map( d => d.character ) );

  svg.selectAll( 'circle.character' )
    .data( characters )
    .enter().append( 'circle' )
      .attr( 'id', d => d.subgroup )
      .attr( 'class', 'character' )
      .attr( 'cx', d => ( charactersRadius + d.h ) * Math.cos( charactersPos( d.character ) * Math.PI * 2 - Math.PI / 2 ) )
      .attr( 'cy', d => ( charactersRadius + d.h ) * Math.sin( charactersPos( d.character ) * Math.PI * 2 - Math.PI / 2 ) )
      .attr( 'r',  3 )
      .attr( 'fill', '#FEE838' )
      .attr( 'transform', 'translate(' + width / 2 + ', ' + height / 2 + ')' );

}

function draw_scenes( scenes ) {
  
  console.log( scenes.map( s => {
    s.h = d3.randomInt( -160, 160 )();
    return s;
  } ) );

  scenesPos
    .domain( scenes.map( d => d.scene ) );

  /*svg.selectAll( 'circle.scene' )
    .data( scenes )
    .enter().append( 'circle' )
      .attr( 'id', d => d.scene )
      .attr( 'class', 'scene' )
      .attr( 'cx', d => ( scenesRadius + d.h ) * Math.cos( scenesPos( d.scene ) * Math.PI * 2 - Math.PI / 2 ) )
      .attr( 'cy', d => ( scenesRadius + d.h ) * Math.sin( scenesPos( d.scene ) * Math.PI * 2 - Math.PI / 2 ) )
      .attr( 'r',  3 )
      .attr( 'fill', '#b0ebe8' )
      .attr( 'transform', 'translate(' + width / 2 + ', ' + height / 2 + ')' );*/

  svg.selectAll( 'path.scene' )
    .data( scenes )
    .enter().append( 'path' )
      .attr( 'id', d => d.scene )
      .attr( 'class', 'scene' )
      .attr( 'transform', d => `translate(${ width / 2 + ( scenesRadius + d.h ) * Math.cos( scenesPos( d.scene ) * Math.PI * 2 - Math.PI / 2 )},${height / 2 + ( scenesRadius + d.h ) * Math.sin( scenesPos( d.scene ) * Math.PI * 2 - Math.PI / 2 )})scale(0.025)` )
      .attr( 'fill', d => '#B0EBE8' )
      .attr( 'd', 'M410.5,281Q442,312,445,353Q448,394,368,348Q288,302,285.5,327.5Q283,353,266.5,337.5Q250,322,217.5,386Q185,450,156.5,433.5Q128,417,107,393Q86,369,135.5,320Q185,271,165,260.5Q145,250,113.5,222.5Q82,195,124,192Q166,189,148.5,137.5Q131,86,171,107.5Q211,129,230.5,99.5Q250,70,268,105Q286,140,311.5,135.5Q337,131,334,161Q331,191,342,203.5Q353,216,366,233Q379,250,410.5,281Z');

}
