let genshindb = require('genshin-db');
const { Logtail } = require("@logtail/node");

let logtail;
try {
	logtail = new Logtail(process.env.LOGTAIL_SECRET);
} catch(e) {
	console.log(e);
}

/*
    dumpResult: false, // The query result will return an object with the properties: { query, folder, match, matchtype, options, filename, result }.
    matchNames: true, // Allows the matching of names.
    matchAltNames: true, // Allows the matching of alternate or custom names.
    matchAliases: false, // Allows the matching of aliases. These are searchable fields that returns the data object the query matched in.
    matchCategories: false, // Allows the matching of categories. If true, then returns an array if it matches.
    verboseCategories: false, // Used if a category is matched. If true, then replaces each string name in the array with the data object instead.
    queryLanguages: ["English"], // Array of languages that your query will be searched in.
    resultLanguage: "English" // Output language that you want your results to be in.
*/
function parseOptions(input) {
  let opts = {};

  ['dumpResult', 'matchNames', 'matchAltNames', 'matchAliases', 'matchCategories', 'verboseCategories'].forEach(prop => {
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
		//logtail.info(message, data);
	} catch(e) {
		console.log(e);
	}
}

const foldersList = Object.keys(genshindb.Folder);
const languagesList = Object.keys(genshindb.Languages);

function createConfig(opts) {
    const config = {};
    config.folders = foldersList;
    config.languages = languagesList;
    config.defaultOptions = genshindb.getOptions();
    config.categories = {};
    for (let folder of config.folders) {
        config.categories[folder] = {};
        config.categories[folder].names = genshindb.categories('names', folder, opts);
        for (let category of config.categories[folder].names) {
            config.categories[folder][category] = genshindb.categories(category, folder, opts);
        }
    }
    return config;
}

function getStats(params) {
	let opts = parseOptions(params);
	opts.matchCategories = false;
	opts.dumpResult = false;
	const queryresult = genshindb[folder](params.query, opts);
	
        console.log(params);
        if (params.level) {
		let [level, ascension] = parseLevel(params.level);
		if (level !== undefined) {
			console.log(ascension);
			return queryresult.stats(level, ascension);
		}
	}
}

function parseLevel(level) {
	const regex = /(\d+)(.*)/;
	if ((m = regex.exec(level)) !== null) {
		return [m[1], m[2]];
	}
	return [undefined, undefined];
}

// `/api/[folder]
export default function fetchUser(req, res) {
	if(!enableCors(req, res)) return;

	const folder = req.query.folder ? req.query.folder.toLowerCase() : undefined;
	if(folder === undefined) return;

	switch (folder) {
		case 'default':
		case 'config':
			log('get config');
			return res.json(createConfig(parseOptions(req.query)));
			
		case 'language':
		case 'languages':
			log('get folders');
			return res.json(languagesList);

		case 'folder':
		case 'folders':
			log('get languages');
			return res.json(foldersList);
			
		case 'stat':
		case 'stats':
			if (folder !== 'characters' && folder !== 'weapons') {
				log("invalid stats folder");
				return res.status(404).send(new Error('Not a valid stat folder.'));
			} else {
				log('get stats');
				return res.json(getStats(req.query));
			}
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
