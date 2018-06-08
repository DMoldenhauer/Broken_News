// scrapeR script
// =============

// Require axios and cheerio, making our scrapes possible
var axios = require("axios");
var cheerio = require("cheerio");

// This function will scrape the foxnews website
var scrapeR = function () {
  // Scrape the NYTimes website
  return axios.get("http://www.foxnews.com/us.html").then(function (res) {
    var $ = cheerio.load(res.data);
    // Make an empty array to save our article info
    var articlesR = [];

    // Now, find and loop through each element that has the "theme-summary" class
    // (i.e, the section holding the articles)
    $(".article").each(function (i, element) {
      // In each .theme-summary, we grab the child with the class article

      // Then we grab the inner text of the this element and store it
      // to the head variable. This is the article headline
      var head = $(this)
        .find(".title")
        .children("a")
        .text()
        .trim();

      
      // Grab the URL of the article
      var url = "http://www.foxnews.com" + $(this).find("a").attr("href");
      

      // Then we grab any children with the class of .dek and then grab it's inner text
      // We store this to the sum variable. This is the article summary
      var sum = $(this)
        .find(".dek")
        .children("a")
        .text()
        .trim();
      

      // So long as our headline and sum and url aren't empty or undefined, do the following
      if (head && sum && url) {
        // This section uses regular expressions and the trim function to tidy our headlines and summaries
        // We're removing extra lines, extra spacing, extra tabs, etc.. to increase to typographical cleanliness.
        var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

        // Initialize an object we will push to the articles array

        var dataToAdd = {
          headline: headNeat,
          summary: sumNeat,
          url: url
        };
        console.log("datatoAdd is: " + dataToAdd);
        articlesR.push(dataToAdd);
      }
      else {
        articlesR.push(dataToAdd);
      }
    });
    return articlesR;
    console.log("articlesR is: " + articlesR);
  });
};

// Export the function, so other files in our backend can use it
module.exports = scrapeR;
