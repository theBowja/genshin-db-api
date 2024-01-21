import convertXtoYbitarray from "convert-x-to-y-bit-array";
import { getData, enableCors } from '../../main.js';

// `/api/tcgdeckshare/decode
export default function fetchUser(req, res) {
	if (!enableCors(req, res)) return;
	if (req.query.code === undefined) return;

	const code = decodeURIComponent(req.query.code.replaceAll(' ', '+'));

	const output = decode(code);

	return res.json({ deckcode: code, offset: output.lastByte, cardshareids: output.cards });
}

function decode(str) {
	const byteArray = Array.from(atob(str), c => c.codePointAt(0));

	const lastByte = byteArray.pop();

	const reordered = [
		...Array.from({ length: 25 }).map((_, i) => (byteArray[2 * i] - lastByte) & 255),
		...Array.from({ length: 25 }).map((_, i) => (byteArray[2 * i + 1] - lastByte) & 255),
		0,
	];

	const output = convertXtoYbitarray(8, 12, reordered);

	output.pop();

	return { cards: output, lastByte: lastByte };
}