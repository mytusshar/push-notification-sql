/***
 * author: Tushar Bochare
 * Email: mytusshar@gmail.com
 */

var controller  = require("./controller.js");
var constants  = require("./constants.js");
var db = require("./database.js");

exports.initDatabaseIfNotAlready = function() {
    console.log("*********** initDatabaseIfNotAlready ***********");
        
    var asyncOperation = function(resolve, reject) {
        var sql = controller.generateSQL(constants.CREATE_DB);
        var promise = db.dbOperation(sql);
        promise.then(successCB, errorCB);

        function successCB(result) {
            console.log("***** RESOLVED initDatabaseIfNotAlready:");
            console.log("*** Database created success ***");
            controller.createTable(resolve, reject);
        }
    
        function errorCB(err) {
            console.log("***** ERROR: REJECTED initDatabaseIfNotAlready: ");
            // resolve(err);
            controller.createTable(resolve, reject);
            if(err.code == "ER_DB_CREATE_EXISTS") {
                console.log("***** Database already exists ********");
                controller.createTable(resolve, reject);
            } else {
                console.log(err);
            }
        }
    }
    return new Promise(asyncOperation);
}

exports.createTable = function(resolve, reject) {
	console.log("*********** createTable ***********");
	var sql = controller.generateSQL(constants.CREATE_TABLE);
	var promise = db.dbOperation(sql);
	promise.then(successCB, errorCB);

	function successCB(result) {
		console.log("***** RESOLVED createTable:");
        console.log("*** Table created success ***");
        resolve(result);
	}

	function errorCB(err) {
        console.log("***** ERROR: REJECTED createTable: ");
        // reject(err)
        if(err.code == "ER_TABLE_EXISTS_ERROR") {
            console.log("*** Table Already exists ***");
            controller.countNotificationsInDB(resolve, reject);
        } else {
            console.log(err);
        }
	}
}

exports.countNotificationsInDB = function(resolve, reject) {
    console.log("*********** countNotificationsInDB ***********");
    var sql = controller.generateSQL(constants.COUNT_NOTI);
	var promise = db.dbOperation(sql);
	promise.then(successCB, errorCB);

	function successCB(result) {
        console.log("***** RESOLVED countNotificationsInDB:");
        result.notiId = true;
        resolve(result);
	}

	function errorCB(err) {
        console.log("***** ERROR: REJECTED countNotificationsInDB: ", err);
        reject(err)
	}
}

exports.loadHomePage = function(req, res) {
    res.sendFile('index.html');
}

exports.updateNotiViewCB = function(req, res) {
    console.log("************ updateNotiViewCB ***********");
    var recentNoti = parseInt(req.body.recentNoti);
    var count = parseInt(req.body.recentNoti) - parseInt(req.body.count);
    var data = {recentNoti: recentNoti, count: count}

    var sql = controller.generateSQL(constants.UPDATE_VIEWED, data);
    var promise = db.dbOperation(sql);
	promise.then(successCB, errorCB);

	function successCB(result) {
		console.log("***** updateNotiViewCB SUCCESS *****");
        console.log('Updated notification count !!', result);
        res.json({"code": 200, "status": "OK"});
	}

	function errorCB(err) {
        console.log("***** updateNotiViewCB ERROR: ", err);
        res.json({"code" : err.code, "status": err.status});
	}
}

exports.updateNotiCB = function(req, res) {
    console.log("***** updateNotiCB  *****");
    var data = { notiId: req.body.notiId};

    var sql = controller.generateSQL(constants.UPDATE_UNREAD, data);
    var promise = db.dbOperation(sql);
	promise.then(successCB, errorCB);

	function successCB(result) {
		console.log("***** updateNotiCB SUCCESS *****");
        console.log('Updated notification count !!');
        res.json({"code": 200, "status": "OK"});
	}

	function errorCB(err) {
        console.log("***** updateNotiCB ERROR: ", err);
        res.json({"code" : err.code, "status": err.status});
	}
}

exports.getNotiCB = function(req, res) {
    console.log("***** getNotiCB *****");
    var sql = controller.generateSQL(constants.GET_ALL_NOTI);
    var promise = db.dbOperation(sql);
	promise.then(successCB, errorCB);

	function successCB(result) {
		console.log("***** getNotiCB SUCCESS *****");
        res.json(result);
	}

	function errorCB(err) {
        console.log("***** getNotiCB ERROR: ", err);
        res.json({"code" : err.code, "status": err.status});
	}
}

exports.generateSQL = function(code, data) {
	var tableName = constants.DB_DATABASE_NAME + "." + constants.DB_TABLE_NAME;
	switch(code){
        case constants.INSERT_NOTI: 
            return  "INSERT INTO " + tableName + " (notiId, notiData, unread, viewed)" 
                    + " VALUES (" + data.notiId + ", '" + data.notiData + "', 1, 1)";
        break;
		case constants.UPDATE_UNREAD:
			return "UPDATE " + tableName + " SET unread = 0 where notiId = " + data.notiId;
		break;
		case constants.UPDATE_VIEWED:
            return "UPDATE " + tableName + " SET viewed = 0 where notiId BETWEEN " + data.count +  ' AND ' + data.recentNoti;
		break;
		case constants.GET_ALL_NOTI:
            return "SELECT * FROM " + tableName;
		break;
		case constants.CREATE_DB:
			return "CREATE DATABASE " + constants.DB_DATABASE_NAME;
		break;
		case constants.CREATE_TABLE:
			return "CREATE TABLE " + tableName + " (notiId int, notiData varchar(255), unread int, viewed int)";
        break;
        case constants.COUNT_NOTI:
            return "select max(notiId) from " + tableName;
		default: console.log("invalid request type");
	}
}