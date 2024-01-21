const convertXtoYbitarray = require("convert-x-to-y-bit-array");
let { getData, enableCors } = require('../../main.js');

// `/api/[command]
export default function fetchUser(req, res) {
	if (!enableCors(req, res)) return;
	if (req.query.code === undefined) return;

	const str = req.query.code;
	// const str = "A0Bw8TQPARBw8pcPCSBw9cIPDFAg9sgQDAGAAMkQDCGQCdkQDaGQC+MQDrEwDOQQDsAA";
	const byteArray = Array.from(atob(str), c => c.codePointAt(0));
	const lastByte = byteArray.pop();

	const reordered = [
		...Array.from({ length: 25 }).fill(0).map((_, i) => byteArray[2 * i] - lastByte),
		...Array.from({ length: 25 }).fill(0).map((_, i) => byteArray[2 * i + 1] - lastByte),
		0,
	];

	const output = convertXtoYbitarray(8, 12, reordered);
	output.pop();

	return output;
}