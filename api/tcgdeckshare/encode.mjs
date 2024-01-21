import convertXtoYbitarray from "convert-x-to-y-bit-array";
import { getData, enableCors } from '../../main.js';

// `/api/tcgdeckshare/encode
export default function fetchUser(req, res) {
	if (!enableCors(req, res)) return;
	if (req.query.deck === undefined) return;

	const deck = req.query.deck.split(',').map(id => parseInt(id));
	const offset = req.query.offset || 0;

	const output = encode(deck, offset);

	return res.json({ deckcode: output, offset: offset, cardshareids: deck });
}

function encode(deck, offset=0) {
	deck.push(0);

	const byteArray = convertXtoYbitarray(12, 8, deck);

	const lastByte = offset;

	const original = Array.from({ length: 25 })
	  .fill(0)
	  .flatMap((_, i) => [(byteArray[i] + lastByte) & 255, (byteArray[i + 25] + lastByte) & 255]);

	const shareCode = btoa(String.fromCodePoint(...original, lastByte));

	return shareCode;
}