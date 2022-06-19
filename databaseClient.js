var mysql = require('mysql');
var dbCreds = require('./dbCreds.json');

//grab creds from json file
const {host, username, password, database} = dbCreds;

//setup connection details
const db = mysql.createConnection({
  host: host,
  user: username,
  password: password,
  database: database
})

//Variable to store all needed queries
var queries = {
    lecturers: "SELECT FullName FROM Lecturers",
    lecturerInfo: "SELECT FullName, Email, Location FROM Lecturers WHERE FullName LIKE ?",
    Restaurants : "SELECT Name FROM Restaurants",
    RestaurantInfo : "SELECT Name, Menu FROM Restaurants WHERE Name LIKE ?"
};

/**
 * Function to execute a query to the database and return its results
 * @param queryName The name of the query to be executed (specified in var queries)
 * @param queryParams Any parameters needed for that specific query
 * @returns Results of query
 */
const getAllLecs = async (queryName, queryParams) => {
    return new Promise(function(resolve, reject){
      db.query(queries[queryName], queryParams, function(err, results, fields){
        if (!err) {
          resolve(results);
        }
        else {
          console.log("Please make sure you are connected to the University VPN for database connection");
          reject(err);
        }
      });
    });
}


module.exports = {
  db: db,
  getAllLecs
}