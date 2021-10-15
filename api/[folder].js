let genshindb = require('genshin-db');
const { Logtail } = require("@logtail/node");

const logtail = new Logtail("xZCuWTDJ3m6Gc2zTLdn2pNec");

/*
  matchAltNames: true, // Allows the matching of alternate or custom names.
  matchAliases: false, // Allows the matching of aliases. These are searchable fields that returns the data object the query matched in.
  matchCategories: false, // Allows the matching of categories. If true, then returns an array if it matches.
  verboseCategories: false, // Used if a category is matched. If true, then replaces each string name in the array with the data object instead.
  queryLanguages: ["English"], // Array of languages that your query will be searched in.
  resultLanguage: "English" // Output language that you want your results to be in.
*/
function parseOptions(input) {
  let opts = { dumpResult: true };

  ['matchAltNames', 'matchAliases', 'matchCategories', 'verboseCategories'].forEach(prop => {
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


// `/api/user/[id].js
export default function fetchUser(req, res) {
  const folder = req.query.folder ? req.query.folder.toLowerCase() : undefined;


  if(genshindb.Folders[folder]) {
    let params = req.query;
    let opts = parseOptions(params);

    const queryresult = genshindb[folder](params.query, opts);
    logtail.info("success", { query: queryresult.query, folder: queryresult.folder, match: queryresult.match, options: queryresult.options, filename: queryresult.filename });
    res.json(queryresult);
  } else {
  	logtail.info("invalid folder");
    res.status(404).send(new Error('Not a valid search folder.'));
  }
}