let genshindb = require('genshin-db');
const { Logtail } = require("@logtail/node");

let logtail;
try {
	logtail = new Logtail(process.env.LOGTAIL_SECRET);
} catch(e) {
	console.log(e);
}

/*
  matchAltNames: true, // Allows the matching of alternate or custom names.
  matchAliases: false, // Allows the matching of aliases. These are searchable fields that returns the data object the query matched in.
  matchCategories: false, // Allows the matching of categories. If true, then returns an array if it matches.
  verboseCategories: false, // Used if a category is matched. If true, then replaces each string name in the array with the data object instead.
  queryLanguages: ["English"], // Array of languages that your query will be searched in.
  resultLanguage: "English" // Output language that you want your results to be in.
*/
function parseOptions(input) {
  let opts = {};

  ['dumpResult', 'matchAltNames', 'matchAliases', 'matchCategories', 'verboseCategories'].forEach(prop => {
    if(input[prop] !== undefined) {
      opts[prop] = parseBoolean(input[prop]);
    }
  });

  if(input.queryLanguages !== undefined) {
    opts.queryLanguages = input.queryLanguages.split(',');
  }

  if(input.resultLanguage !== undefined) {
    opts.resultLanguage = input.resultLanguage;
  }

  return opts;
}

function parseBoolean(str) {
  str = str.toLowerCase();
  if(str === 'true') return true;
  else if(str === 'false') return false;
  else return undefined;
}

function log(message, data) {
	try {
		logtail.info(message, data);
	} catch(e) {
		console.log(e);
	}
}


// `/api/user/[id].js
export default function fetchUser(req, res) {
	if(!enableCors(req, res)) return;

	const folder = req.query.folder ? req.query.folder.toLowerCase() : undefined;
	if(folder === undefined) return;

	if(folder === 'language' || folder === 'languages') {
		log('get languages');
		return res.json(Object.keys(genshindb.Languages));
	}
	if(folder === 'folder' || folder === 'folders') {
		log('get folders');
		return res.json(Object.keys(genshindb.Folder));
	}


  if(genshindb.Folders[folder]) {
    let params = req.query;
    let opts = parseOptions(params);
    let userDumpResult = opts.dumpResult === true;
    opts.dumpResult = true;

    const queryresult = genshindb[folder](params.query, opts);
    queryresult.options.dumpResult = userDumpResult;
    log("success "+queryresult.match, { query: queryresult.query, folder: queryresult.folder, match: queryresult.match, options: queryresult.options, filename: queryresult.filename });
    if(userDumpResult) {
    	res.json(queryresult);
    } else {
    	res.json(queryresult.result);
    }
  } else {
  	log("invalid folder");
    res.status(404).send(new Error('Not a valid search folder.'));
  }
}

function enableCors(req, res) {
	res.setHeader('Access-Control-Allow-Credentials', true)
	res.setHeader('Access-Control-Allow-Origin', '*')
	// another common pattern
	// res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
	res.setHeader('Access-Control-Allow-Methods', 'GET')
	res.setHeader(
		'Access-Control-Allow-Headers',
		'folder-type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
	)
	if (req.method === 'OPTIONS') {
		res.status(200).end();
	return false;
	}
	return true;
}