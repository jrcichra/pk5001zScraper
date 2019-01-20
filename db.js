const mariadb = require('mariadb');
const fs = require('fs');
const sql = fs.readFileSync(0,'utf8');
var c;
console.log(sql);
mariadb.createConnection({ // Open a new connection
	host: 'hostname',
	port: '3306',
	user: 'modemscraper',
	password: 'password',
	database: 'modem'
}).then(conn=>{
	c = conn;
	conn.query(sql);
}).then(conn => {
	c.end();
}).catch(err => {
	console.log(err);
});

