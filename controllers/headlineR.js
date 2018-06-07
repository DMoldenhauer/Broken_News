// Controller for our foxnews headlines
// ============================
var db = require("../models");

module.exports = {
  // Find all headlines, sort them by date, send them back to the user
  findAll: function(req, res) {
    db.HeadlineR
      .find(req.query)
      .sort({ date: -1 })
      .then(function(dbHeadlineR) {
        res.json(dbHeadlineR);
      });
  },
  // Delete the specified headline
  delete: function(req, res) {
    db.HeadlineR.remove({ _id: req.params.id }).then(function(dbHeadlineR) {
      res.json(dbHeadlineR);
    });
  },
  // Update the specified headline
  update: function(req, res) {
    db.HeadlineR.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true }).then(function(dbHeadline) {
      res.json(dbHeadlineR);
    });
  }
};