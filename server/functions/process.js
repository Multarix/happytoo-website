const sql = require("better-sqlite3")("./server/objects/storage.sqlite3");

const sqlGet = (statement, ...args) => {
	const prep = sql.prepare(statement);
	return prep.get(args);
};
module.exports = async (data) => {
	const { username, password } = data;
	const user = sqlGet("SELECT * FROM users WHERE username = ?", username);
	if(user){
		const bool = (user.password === password) ? true : false;
		return bool;
	}
};
