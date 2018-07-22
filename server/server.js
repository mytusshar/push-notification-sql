/***
 * author: Tushar Bochare
 * Email: mytusshar@gmail.com
 */

var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var http = require("http").Server(app);
var socket = require("socket.io")(http);
var controller = require("./controller.js");
var db = require("./database.js");
var constants  = require("./constants.js");

var notiId = 1;

app.use(express.static('../client'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", controller.loadHomePage);

app.get("/notifications", controller.getNotiCB);

app.put("/notifications/unread", controller.updateNotiCB);

app.put("/notifications/viewed", controller.updateNotiViewCB);

function insertIntoDb2(notiData) {
    var post = { notiId: notiId++, notiData: notiData, unread: 1, viewed: 1 };

    var sql = controller.generateSQL(constants.INSERT_NOTI, post);
    var promise = db.dbOperation(sql);
	promise.then(successCB, errorCB);

	function successCB(result) {
		console.log("***** insertIntoDb2 SUCCESS *****");
        console.log(new Date() + " : Row inserted");
        socket.emit('newNotificationAdded', post);
	}

	function errorCB(err) {
        console.log("***** insertIntoDb2 ERROR: ", err);
	}
}

function initDependencies() {
    var promise = controller.initDatabaseIfNotAlready();
    promise.then(successCB, errorCB);

    function successCB(result) {
        console.log("********** SUCCESS *************", result);
        /***** updating NotiId ******/
        if(result.hasOwnProperty("notiId")) {
            notiId = result[0]["max(notiId)"] + 1;
        }
        console.log("Database is connected !!");
        createSocketConnection();
    }

    function errorCB(error) {
        console.log("********** ERROR *************");
    }
}
initDependencies();

function createSocketConnection() {
    socket.on('connection', function(sock) {
        console.log("Client Socket connected !!");
        (function loop() {
            var rand = Math.round(Math.random() * 10000) + 8000; //Generate random number between 5 sec to 10 sec
            setTimeout(function() {
                insertIntoDb2(new Date());
                loop();
            }, rand);
        }());
    });
}

http.listen(8000, function() {
    console.log("Server is running at: http://localhost:8000");
});
