








var peopleGroup = [ 
  {
    'id': 1,
    'name': 'FARC',
    'num_people': 4
  },
  {
    'id': 2,
    'name': 'EPL',
    'num_people': 4
  },
  {
    'id': 3,
    'name': 'ELN',
    'num_people': 4
  },
  {
    'id': 4,
    'name': 'M-19',
    'num_people': 5
  },
  {
    'id': 5,
    'name': 'AUC',
    'num_people': 11
  },
  {
    'id': 6,
    'name': 'CRS',
    'num_people': 1
  },
  {
    'id': 7,
    'name': 'PRT',
    'num_people': 2
  }
];

var conversations = [
  {
    'id': 1,
    'title': 'Conversación 1'
  },
  {
    'id': 2,
    'title': 'Conversación 2'
  },
  {
    'id': 3,
    'title': 'Conversación 3'
  },
  {
    'id': 4,
    'title': 'Conversación 4'
  },
  {
    'id': 5,
    'title': 'Conversación 5'
  }
];








var radius = 300,
  padding = 30,
  radians = ( 3 * Math.PI ) / 6;
  

/* Scales */



var groupsScale = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ 7 * Math.PI / 6, 11 * Math.PI / 6 ] );

var angleRight = d3.scaleLinear()
  .domain( [ 0, points - 1 ] )
  .range( [ Math.PI / 6, 5 * Math.PI / 6 ] );



var peopleGroupSize = d3.scaleLinear()
  .domain( [ d3.min( peopleGroup.map( d => d[ 'num_people' ] ) ), d3.max( peopleGroup.map( d => d[ 'num_people' ] ) ) ] )
  .range( [ 5, 35 ] );

var conversationsPos = d3.scaleBand()
  .domain( conversations.map( d => d[ 'title' ] ) )
  .range( [ 0.1 + 0.5, 0.4 + 0.5 ] )
  .padding( 1 );

/* Shapes */


var groupsLine = d3.lineRadial()
  .radius( radius )
  .angle( ( d, i ) => groupsScale( i ) );

var lineRight = d3.lineRadial()
  .radius( radius )
  .angle( ( d, i ) => angleRight( i ) );

var data = [
  {
    'source': { 'x': peopleGroupPos( 'FARC' ), 'y': peopleGroupPos( 'FARC' ) },
    'target': { 'x': conversationsPos( 'Conversación 1' ), 'y': conversationsPos( 'Conversación 1' ) }
  },
  {
    'source': { 'x': peopleGroupPos( 'M-19' ), 'y': peopleGroupPos( 'M-19' ) },
    'target': { 'x': conversationsPos( 'Conversación 2' ), 'y': conversationsPos( 'Conversación 2' ) }
  }
];

var link = d3.linkHorizontal()
  .x( d => radius * Math.cos( d.x * Math.PI * 2 - Math.PI / 2 ) )
  .y( d => radius * Math.sin( d.y * Math.PI * 2 - Math.PI / 2 ) );


svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'class', 'line' )
    .attr( 'd', groupsLine )
    .attr( 'transform', 'translate(' + width / 2 + ', ' + height / 2 + ')' );

svg.append( 'path' )
  .datum( d3.range( points ) )
    .attr( 'class', 'line' )
    .attr( 'd', lineRight )
    .attr( 'transform', 'translate(' + width / 2 + ', ' + height / 2 + ')' );

svg.selectAll( 'path.link' )
  .data( data )
  .enter().append( 'path' )
    .attr( 'class', 'link' )
    .attr( 'd', link )
    .attr( 'stroke', 'black' )
    .attr( 'fill', 'none' )
    .attr( 'transform', 'translate(' + width / 2 + ', ' + height / 2 + ')' );



svg.selectAll( 'circle.circle2' )
  .data( conversations )
  .enter().append( 'circle' )
    .attr( 'class', 'circle2' )
    .attr( 'cx', d => radius * Math.cos( conversationsPos( d[ 'title' ] ) * Math.PI * 2 - Math.PI / 2 ) )
    .attr( 'cy', d => radius * Math.sin( conversationsPos( d[ 'title' ] ) * Math.PI * 2 - Math.PI / 2 ) )
    .attr( 'r', 10 )
    .attr( 'transform', 'translate(' + ( radius + padding ) + ',' + ( radius + padding ) + ')' );
