/** Find the N closest world bank projects */
function nClosest(point,n) {

  var sql = 'SELECT * FROM farmers_markets_copy ORDER BY the_geom <-> ST_SetSRID(ST_Point(' + point.lng + ',' + point.lat + '), 4326) LIMIT ' + n;
  console.log('https://viola96.cartodb.com/api/v2/sql/?q=' + sql);
  $.ajax('https://viola96.cartodb.com/api/v2/sql/?q=' + sql).done(function(results) {
    //console.log(n +' closest:', results);
    addRecords(results);
  });
}

/** Find all points within the box constructed */
function pointsWithin(rect) {
  // Grab the southwest and northeast points in this rectangle
  var sw = rect[0];
  var ne = rect[2];

  var sql = 'SELECT * FROM farmers_markets_copy WHERE the_geom @ ST_MakeEnvelope(' +
    sw.lng + ','+ sw.lat + ',' + ne.lng + ',' + ne.lat + ', 4326)';
  console.log('https://viola96.cartodb.com/api/v2/sql/?q=' + sql);
  $.ajax('https://viola96.cartodb.com/api/v2/sql/?q=' + sql).done(function(results) {
    //console.log('pointsWithin:', results);
    addRecords(results);
  });
}


/**
 * function for adding one record
 *
 * The pattern of writing the function which solves for 1 case and then using that function
 *  in the definition of the function which solves for N cases is a common way to keep code
 *  readable, clean, and think-aboutable.
 */
function addOneRecord(rec) {
  var title = $('<p></p>')
    .text('Farm Market nearby Neighorhood: ' + rec.neighborhood);

  var location = $('<p></p>')
    .text('Location: ' + rec.address);

  var time = $('<p></p>')
    .text('Open Date: ' + rec.months + ', '+rec.day+', '+rec.time);


  var recordElement = $('<li></li>')
    .addClass('list-group-item')
    .append(title)
    .append(location)
    .append(time);

  $('#project-list').append(recordElement);
}

/** Given a cartoDB resultset of records, add them to our list */
function addRecords(cartodbResults) {
  $('#project-list').empty();
  _.each(cartodbResults.rows, addOneRecord);
}
