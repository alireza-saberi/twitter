/******** Requiring libraries ********/
var express = require('express');
var bodyParser = require('body-parser');

var app = express();


/******** Setting ********/
app.disable('x-powered-by');
app.set('port', 3000 || process.env.PORT);


/******** Routing ********/
app.use(express.static(__dirname + '/app'));

app.listen(app.get('port'), function(){
	console.log('Server is listening on port ' + app.get('port') + '. Press CTRL-C to terminate.');
});

app.get('/twitter', function ( req, res ) {
	console.log('Server: I get a GET request');
	var t = [
            {message: 'tweet1', img:'img1'}, 
            {message: 'tweet2', img:'img2'},
            {message: 'tweet3', img:'img3'}, 
            {message: 'tweet4', img:'img4'}
        ];
    res.json(t);
  });