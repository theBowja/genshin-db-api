# genshin-db-api
 
Web API for [genshin-db](https://www.npmjs.com/package/genshin-db) using Vercel serverless function.

## [folder]?query=[query]
https://genshin-db-api.vercel.app/api/characters?query=hutao  
Returns the search result for the specified folder and query.  
You'll have to retrieve stats for characters/talents/weapons using the stats API.

You may include standard genshindb options as url query parameters (case-sensitive):
- dumpResult // The query result will return an object with the properties: { query, folder, match, matchtype, options, filename, result }.
- matchNames // Allows the matching of names.
- matchAltNames // Allows the matching of alternate or custom names.
- matchAliases // Allows the matching of aliases. These are searchable fields that returns the data object the query matched in.
- matchCategories // Allows the matching of categories. If true, then returns an array if it matches.
- verboseCategories // Used if a category is matched. If true, then replaces each string name in the array with the data object instead.
- queryLanguages // Comma separated list of languages that your query will be searched in.
- resultLanguage // Output language that you want your results to be in.

Examples:  
https://genshin-db-api.vercel.app/api/talents?query=slime&matchCategories=true&queryLanguages=english,jap
https://genshin-db-api.vercel.app/api/weapons?query=skywardspear&dumpResult=true&resultLanguage=korean

## config
https://genshin-db-api.vercel.app/api/config  
Returns the following:
- list of folders
- list of languages
- the default options used by the api
- list of category values for each folder

## folders
https://genshin-db-api.vercel.app/api/folders  
Returns the list of folders.

## languages
https://genshin-db-api.vercel.app/api/languages  
Returns the list of languages.

## stats?folder=[folder]&query=[query]
https://genshin-db-api.vercel.app/api/stats?folder=characters&query=hutao  
Returns the stats for each level for the specified folder and query as a JSON map.  
Only for `characters` and `weapons` folder.

You may include standard genshindb options as url query parameters (case-sensitive).  
You may include `level` as a query parameter to get the stats for a specific level.  
Examples:  
https://genshin-db-api.vercel.app/api/stats?folder=characters&query=胡桃&queryLanguages=chinese  
https://genshin-db-api.vercel.app/api/stats?folder=weapons&query=jadespear&level=90  
https://genshin-db-api.vercel.app/api/stats?folder=characters&query=ganyu&level=60+
