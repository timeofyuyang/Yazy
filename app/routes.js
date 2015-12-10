/**
 * http://usejsdoc.org/
 */

var path = require('path');
var fs = require('fs');
var multer = require('multer');
var upload = multer({ dest: './public/img/'});
var fname = 'dog';
var user_email = 'undefined';
var user_id = 'undefined';
var mysql = require('mysql');
//for quiz game
var ans=[];
var score=0;
var times=0;
var User = require('../app/models/user');


var connection = mysql.createConnection(
    {
      host     : 'yazymovies.c0pos2ecywq8.us-east-1.rds.amazonaws.com',
      user     : 'YazyMoviesUser',
      password : 'yazyyazy',
      port     : '3306',
      database : 'movies',
    }
);

// app/routes.js
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

 // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // ==========================   ===========
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
    	//for quiz game initialize
    	ans=[];
        score=0;
        times=0;
        //Yani
    	user_email = req.user.local.email;
    	user_id = req.user._id;
    	/*
    	var query_s1 = 'INSERT INTO movies.PROFILEIMG(USERID, FILENAME) VALUES (' +'"'+connection.escape(user_email)+'","'+connection.escape(fname)+'") ON DUPLICATE KEY UPDATE FILENAME = "'+connection.escape(fname)+'"';
    	connection.query(query_s1,function(err, result) {
    	});
    	var query_s2 = "SELECT FILENAME FROM movies.PROFILEIMG WHERE USERID = "+'"'+connection.escape(user_email)+'"';
    	connection.query(query_s2, function (err, rows, fields) {
    		//console.log(rows);
    		fname = rows[0]; 
    		//console.log(err);
    	});*/
    	
    	/*res.render('profile.ejs', {
            user : req.user, // get the user out of session and pass to template
            fname : fname    // photo name
        });*/
    	//amelia
    	User.where('image.user_id', user_id).findOne( function(err, picture) {
    		if (err) return console.error(err);
    		if(picture) {
    			fname = picture.image.filename;
    			res.render('profile.ejs', {
    	    	    user : req.user, // get the user out of session and pass to template
    	    	    fname : fname    // photo name
    	    	});
    		} 
    		else {
    			fname = 'dog';
    			res.render('profile.ejs', {
    	    	    user : req.user, // get the user out of session and pass to template
    	    	    fname : fname    // photo name
    	    	});
    		}
    	});
    	//amelia
    });
    //Yang
    app.post('/profile', function(req, res) {
    	str = req.body.history;
    	if(str != ''){
    	arr = str.split(",");
    	//console.log(arr[2]);
    	var post  = {USERNAME: user_email, TIME: arr[1], GAME:arr[0], SCORE:parseInt(arr[2])};
    	var query_str = connection.query('INSERT INTO movies.PLAYHISTORY SET ?', post, function(err, result) {
    	});
    	//console.log(query_str);
    	}
    	res.redirect('/profile');
    });
    //Yang

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    // Yang
    
    app.get('/leaderboard', isLoggedIn, function(req, res) {
    	var leader_str = "SELECT USERNAME, SCORE FROM movies.PLAYHISTORY WHERE GAME='Puzzle' ORDER BY SCORE DESC LIMIT 10";
    	connection.query(leader_str, function(err, rows, fields) {
    	    if (err) throw err;
    	    res.render('leaderboard.ejs',{
    	    	rows : rows
    	    });
    	});
    		//res.render('leaderboard.ejs');
    });
    
    // Try Jigsaw Puzzle
    app.get('/JigsawPuzzle', isLoggedIn, function(req, res) {
    	query_str = "select PROFILE from movies.POSTER order by rand() limit 1";
    	connection.query(query_str, function(err, rows, fields) {
    	    if (err) throw err;
    	    var poster_url = rows[0].PROFILE;
    	    res.render('puzzle.ejs',{
        		poster_url : poster_url
        	});
    	});
    	/*fs.readFile('./views/demo.html', function(error, content) {
            if (error) {
                res.writeHead(500);
                res.end();
                console.log(error);
            }
            else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content, 'utf8');
            }
        });*/
    });

    // Ziyu
    // Try Memory gAME
    app.get('/MemoryGame', isLoggedIn, function(req, res) {
         //res.render('../views/demo.html');
        fs.readFile('./views/memory.html', function(error, content) {
            if (error) {
                res.writeHead(500);
                res.end();
                console.log(error);
            }
            else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content, 'utf8');
            }
        });
    });
    

    
  //try uploading image
    app.use(multer({ dest: './public/img/',
        rename: function (fieldname, filename) {
        	fname =  filename+Date.now();
        	//amelia
        	console.log(fname);
        	var updateProfilePic =  {'image' : { 'user_id' : user_id, 'filename' : fname  } };
        	User.findOneAndUpdate({'image.user_id' : user_id}, updateProfilePic, {upsert:true}, function(err, doc){
        	    if (err) console.log(err);
        	    console.log(doc);
        	    console.log("saved image!");
        	});
        	//amelia
        	return fname;
            //return filename+Date.now();
        	//return 'dog';
        },
        onFileUploadStart: function (file) {
            console.log(file.originalname + ' is starting ...');
        },
        onFileUploadComplete: function (file) {
            console.log(file.fieldname + ' uploaded to  ' + file.path)
        }
    }));

    app.get('/upload',isLoggedIn,function(req,res){
          res.render("../views/upload.html");
    });

    app.post('/image',function(req,res){
        upload(req,res,function(err) {
            if(err) {
                return res.end("Error uploading file.");
            }
            res.end("File is uploaded");
        });
        res.writeHead(200, {'Content-type' : 'text/html'});
        res.write('<a href="/profile"><input type="button" value="Return"></input></a>');
        res.end();
    	/* var tempPath = req.file.path,
         targetPath = path.resolve('./img/image.jpg');
     if (path.extname(req.files.file.name).toLowerCase() === '.jpg') {
         fs.rename(tempPath, targetPath, function(err) {
             if (err) throw err;
             console.log("Upload completed!");
         });
     } else {
         fs.unlink(tempPath, function () {
             if (err) throw err;
             console.error("Only .jpg files are allowed!");
         });
     }*/
    });
    //Yang
    
    // Amelia
    // Try Memory game with images
    app.get('/MemoryGame2',isLoggedIn, function(req, res) {
    	
    	var User = require('../app/models/user');
    	
    	var thor = new User({
    		gamesPlayed      : {
    			user_id      : user_id,
    			gameName     : 'Memory',
    			date         : Date.now()
    		}
    	});

    	thor.save(function(err, thor) {
    	  if (err) return console.error(err);
    	  console.dir(thor);
    	});
    	
         //res.render('../views/demo.html');
        fs.readFile('./views/memory2.html', function(error, content) {
            if (error) {
                res.writeHead(500);
                res.end();
                console.log(error);
            }
            else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('<a href="/profile"><input type="button" value="Return"></input></a>');
                res.end(content, 'utf8');
            }
        });
    });
    
    //amelia
    app.get('/memoryrefresh', isLoggedIn,function(req, res, next) {
    	var mysql = require('mysql');
    	var queryString = 'SELECT DISTINCT PROFILE FROM movies.POSTER WHERE PROFILE LIKE "%.gif" ORDER BY RAND() LIMIT 16;'; 	 
    	var results = [];
    	var fs      = require('fs');
		var request = require('request');
		var filename = "";
		var easyimg = require('easyimage');
		var gm = require('gm');
		// Or with cookies
		// var request = require('request').defaults({jar: true});
    	
    	var download = function(url, filename, cb) {
    		request.get({url: url, encoding: 'binary'}, function (err, response, body) {
    			fs.writeFile(filename, body, 'binary', function(err) {
    				if(err) {
    					console.log(err);
    				}
    				else {
    					console.log("The file was saved as " + filename);
    				}
    			}); 
			});
    	}
    
    	var pool = mysql.createPool(
			    {
			      host     : 'yazymovies.c0pos2ecywq8.us-east-1.rds.amazonaws.com',
			      user     : 'YazyMoviesUser',
			      password : 'yazyyazy',
			      port	   : '3306',
			      database : 'movies'
			    }
			);
    	
    	pool.getConnection(function(err, connection) {
    		if (err) throw err;
    		connection.query(queryString, function(err, row, fields) {
    		    if (err) throw err;    
    		    
    		    if(row.length > 0) {
    		    	for(var i in row) {
    		    		console.log(row[i].PROFILE );
    		    		results.push(row[i].PROFILE );
    		    		console.log(i);
		    			
    		    	}
    		    	
    		    	var i = 0, threads = 16;
    		    	require('async').eachLimit(results, threads, function(url){
    		    		  download(url, "./public/img/test" + (i++) + ".gif", next);
    		    		}, function(){
    		    		   console.log('finished');
    		    	});
    		    	
    		    	 
    		    	
    		    	res.render('memoryrefresh.ejs', {results: results});
    		    	
    		    }
    		    else {
    		    	res.render('memoryrefresh.ejs', {results: null});
    		    }
    		    
    		    connection.release();
    		 
    		});
    	});
    	    	
    });//Amelia
    
    // =====================================
    // QUIZ GAME ===========================
    // =====================================
    app.get('/quizgame', isLoggedIn,function(req, res, next) {
    	var mysql = require('mysql');
    	var math = require('mathjs');
    	var genre = [];
    	var title = [];
    	var pool = mysql.createPool(
			    {
			      host     : 'yazymovies.c0pos2ecywq8.us-east-1.rds.amazonaws.com',
			      user     : 'YazyMoviesUser',
			      password : 'yazyyazy',
			      port	   : '3306',
			      database : 'movies',
			    }
			);
    	pool.getConnection(function(err, connection) {
    		if (err) throw err;
    		connection.query('SELECT GENRE, TITLE, max(title) AS h\
    				FROM movies.MOVIES GROUP BY GENRE\
    				 ORDER BY RAND() LIMIT 4', function(err, row, fields) {
    		    if (err) throw err;
    		    //select target movie randomly from the four choices
    		    var an = math.randomInt(3);
    		    ans.push(an);
    		    if(row.length > 0) {
    		    	for(var i in row) {
    		    		title.push(row[i].TITLE);
    		    		genre.push(row[i].GENRE);
    		    	}
    		    	times=times+1;
    		    	//check if the answer is right and accumulate score
    		    	if(ans[ans.length-2]==req.query.antw-1){
    		    		score=score+1;
    		    		}
    		    	res.render('quizgame.ejs', {genre:genre, title:title,answer:an,score:score,times:times});
    		    }
    		    else {
    		    	console.log('flag');
    		    	res.render('quizgame.ejs', {genre:null, title:null,answer:null,score:null,times:null});
    		    }
    		    connection.release();
    		});
    	});
    });//YANI
    
    
   
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}