
var db = require("../models");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");
var ArticleRDB = require("../models/articleR.js");

module.exports = function (app) {

// A GET route for scraping the NYT website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.nytimes.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);


    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("h2").text();
      result.summary = $(this).children(".summary").text();
      result.link = $(this).children("h2").children("a").attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          console.log (err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});


// A GET route for scraping the NYPOST website
app.get("/scrapeR", function (req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.foxnews.com/us.html").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    
    console.log ("axios found wsj news");
    
    var $ = cheerio.load(response.data);

    console.log ("cheerio loaded response.data");

    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function (i, element) {
      // Save an empty result object
      var result = {};
// console.log (element);
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).find(".title").children("a").text();
      result.summary = $(this).find(".dek").children("a").text();
      result.link = $(this).find ("a").attr("href");
      // res.json (result);

      console.log ("result of scrapeR is: ", result);
      // Create a new Article using the `result` object built from scraping
      ArticleRDB.create(result)
        .then(function (dbArticleR) {
          // View the added result in the console
          console.log(dbArticleR);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          console.log (err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});





};