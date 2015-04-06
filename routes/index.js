var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('login',{
  	title: 'Venter'
  });
});

router.get('/home', function(req, res){
	res.render('index',{
		title: 'Venter'
	})
});

module.exports = router;
