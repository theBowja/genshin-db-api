let { getData } = require('../../main.js');

// `/api/[command]
export default function fetchUser(req, res) {
	getData(req, res, 5);
}