/***
 * author: Tushar Bochare
 * Email: mytusshar@gmail.com
 */

/** database parameters */
exports.DB_USER = "root";  // add Database username
exports.DB_PASSWORD = "root";  // add Database password
exports.DB_TABLE_NAME = "noti"; // don't change table name
exports.DB_DATABASE_NAME = "notifications";  // don't change table name

/******** DON'T CHANGE THE FOLLOWING PARAMETERES  *******/

/** request type */
exports.UPDATE_UNREAD = 0;
exports.UPDATE_VIEWED = 1;
exports.GET_ALL_NOTI = 2;
exports.CREATE_DB = 3;
exports.CREATE_TABLE = 4;
exports.INSERT_NOTI = 5;
exports.COUNT_NOTI = 6;