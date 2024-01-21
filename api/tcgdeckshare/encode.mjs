import convertXtoYbitarray from "convert-x-to-y-bit-array";
import { getData, enableCors } from '../../main.js';

// `/api/tcgdeckshare/decode
export default function fetchUser(req, res) {
	if (!enableCors(req, res)) return;
	if (req.query.deck === undefined) return;

	let deck = req.query.deck.split(',').map(id => parseInt(id));

	let output = encode(deck);

	return res.json({ deckcode: output, cardshareids: deck });
}

function encode(deck) {
	deck.push(0);

	const byteArray = convertXtoYbitarray(12, 8, deck);

	const lastByte = 0;

    const original = Array.from({ length: 25 })
      .fill(0)
      .flatMap((_, i) => [byteArray[i] + lastByte, byteArray[i + 25] + lastByte]);

    const shareCode = btoa(String.fromCodePoint(...original, lastByte));

	return shareCode;
}

// let tmp = encode([277,286,287,296,151,151,201,201,205,205,217,217,222,241,241,242,194,243,244,244,245,245,246,246,253,253,255,255,266,267,267,270,256]);
// console.log(tmp);