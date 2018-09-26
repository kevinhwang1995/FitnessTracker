var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_hwangk',
  password        : '4331',
  database        : 'cs290_hwangk'
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port',27521);

app.use(express.static('public'));

app.get('/', function(req,res){
  var context = {};
  res.render('home', context);
});

app.get('/get-data', function(req,res,next){
  pool.query('SELECT * FROM workouts', function(err, rows, fields){
  if(err){
    next(err);
    return;
  }
  res.type('application/json');
  res.send(rows);
  });
});

app.post('/add', function(req,res,next){
  pool.query("INSERT INTO workouts (`name`, `date`,`reps`,`weight`,`lbs`) VALUES (?,?,?,?,?)", [req.body.name,req.body.date,req.body.reps,req.body.weight,req.body.unit], function(err, result){
    if(err){
      next(err);
      return;
    }
    pool.query('SELECT * FROM workouts', function(err, rows, fields){
	if(err){
      next(err);
      return;
	}
	res.type('application/json');
	res.send(rows);
	});
  });
});


app.post('/delete', function(req, res, next){
  pool.query("DELETE FROM workouts WHERE id = ?", [req.body.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    pool.query('SELECT * FROM workouts', function(err, rows, fields){
	if(err){
      next(err);
      return;
	}
	res.type('application/json');
	res.send(rows);
	});
  });
});

app.post('/update',function(req,res,next){
  pool.query("UPDATE workouts SET name=?, date=?, reps=?, weight=?, lbs=? WHERE id = ?", [req.body.name, req.body.date, req.body.reps, req.body.weight, req.body.unit, req.body.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
    next(err);
    return;
    }
    res.type('application/json');
    res.send(rows);
    });
  });
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.use(function(req, res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

