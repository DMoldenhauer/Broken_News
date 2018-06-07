// Controller for our scraper
// ============================
var db = require("../models");
var scrapeR = require("../scripts/scrapeR");

module.exports = {
  scrapeHeadlinesR: function(req, res) {
    // scrape foxnews.com
    return scrapeR()
      .then(function(articlesR) {
        // then insert articles into the db
        return db.HeadlineR.create(articlesR);
      })
      .then(function(dbHeadlineR) {
        if (dbHeadlineR.length === 0) {
          res.json({
            message: "No new articles today. Check back tomorrow!"
          });
        }
        else {
          // Otherwise send back a count of how many new articles we got
          res.json({
            message: "Added " + dbHeadlineR.length + " new articles!"
          });
        }
      })
      .catch(function(err) {
        // This query won't insert articles with duplicate headlines, but it will error after inserting the others
        res.json({
          message: "Scrape complete!!"
        });
      });
  }
};
