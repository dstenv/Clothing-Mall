var mysql = require('mysql')
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '200165',
	database: 'aolai'
})
module.exports = connection