'use strict';

module.exports = function(app){
    var polyTogList = require('../controllers/polytogController');

app.route("/entries")
.get(polyTogList.list_all_entries)
.post(polyTogList.create_a_entry);

app.route("/workspace")
.post(polyTogList.get_workspace);

app.route("/workspaces")
.get(polyTogList.get_all_workspaces);

app.use(function(req, res,next) {
  res.status(404).send({url: req.originalUrl + ' not found'});
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // next();
});
}