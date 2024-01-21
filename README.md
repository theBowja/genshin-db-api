# genshin-db-api
 
Web API for [genshin-db](https://www.npmjs.com/package/genshin-db) using Vercel serverless function.

You can access v4 style data by switch `/v5` with `/v4`.

## [folder]?query=[query]
https://genshin-db-api.vercel.app/api/v5/characters?query=hutao  
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
https://genshin-db-api.vercel.app/api/v5/characters?query=hutao  
https://genshin-db-api.vercel.app/api/v5/characters?query=胡桃&queryLanguages=chinese&resultLanguage=chinese  
https://genshin-db-api.vercel.app/api/v5/talents?query=slime&matchCategories=true&queryLanguages=english,jap  
https://genshin-db-api.vercel.app/api/v5/weapons?query=skywardharp&dumpResult=true&resultLanguage=korean

### [folder]?query=names&matchCategories=true
https://genshin-db-api.vercel.app/api/v5/characters?query=names&matchCategories=true  
Returns a list of names for the specified folder.

You may also include the option verboseCategories to get a list of data objects instead of a list of names.

## config
https://genshin-db-api.vercel.app/api/v5/config  
Returns the following:
- list of folders
- list of languages
- the default options used by the api
- list of category values for each folder

You can use `resultLanguage` to get category values for other languages.  
Example:  
https://genshin-db-api.vercel.app/api/v5/config?resultLanguage=spanish  

## folders
https://genshin-db-api.vercel.app/api/v5/folders  
Returns the list of folders.

## languages
https://genshin-db-api.vercel.app/api/v5/languages  
Returns the list of languages.

## categories
https://genshin-db-api.vercel.app/api/v5/categories  
Returns the category values for every folder.

You can use `resultLanguage` to get category values for other languages.  
Example:  
https://genshin-db-api.vercel.app/api/v5/categories?resultLanguage=spanish  

## stats?folder=[folder]&query=[query]
https://genshin-db-api.vercel.app/api/v5/stats?folder=characters&query=hutao  
Returns the stats for every level for the specified folder and query as a JSON map.  
Ascended stats are mapped with a '+' like '80+'.  
Only for `characters` and `weapons` folder.  

You may include standard genshindb options as url query parameters (case-sensitive).  
Adding `dumpResult=true` will allow you to get the data object of the character/weapon being searched.
You may include `level` as a query parameter to get the stats for a specific level.  
Examples:  
https://genshin-db-api.vercel.app/api/v5/stats?folder=characters&query=胡桃&queryLanguages=chinese  
https://genshin-db-api.vercel.app/api/v5/stats?folder=weapons&query=jadespear&level=90  
https://genshin-db-api.vercel.app/api/v5/stats?folder=characters&query=hutao&dumpResult=true
https://genshin-db-api.vercel.app/api/v5/stats?folder=characters&query=ganyu&level=60+  

## tcgdeckshare/decode?code=[deckcode]
https://genshin-db-api.vercel.app/api/tcgdeckshare/decode?code=A0Bw8TQPARBw8pcPCSBw9cIPDFAg9sgQDAGAAMkQDCGQCdkQDaGQC+MQDrEwDOQQDsAA  
Converts a tcg deck share code into an array of card share ids.

Returns an array.

## tcgdeckshare/encode?deck=[cardids]
https://genshin-db-api.vercel.app/api/tcgdeckshare/encode?deck=123,123,123,123  
Converts a comma-separated array of card share ids into a tcg deck share code.

Returns a string.