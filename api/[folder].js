let genshindb = require('genshin-db');


  // if(genshindb.Folders[req.params.folder]) {
  //   let params = req.query;
  //   let opts = parseOptions(params);

  //   const queryresult = genshindb[req.params.folder](params.query, opts);
  //   res.json(queryresult);
  // } else {
  //   res.status(404).send(new Error('Not a valid search folder.'));
  // }



// `/api/user/[id].js
export default function fetchUser(req, res) {
  const folder = req.query.folder;


  if(genshindb.Folders[folder]) {
    let params = req.query;
    let opts = parseOptions(params);

    const queryresult = genshindb[req.params.folder](params.query, opts);
    res.json(queryresult);
  } else {
    res.status(404).send(new Error('Not a valid search folder.'));
  }



}