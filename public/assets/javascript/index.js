/* global bootbox */



$(document).ready(function () {
  // Setting a reference to the article-container divs where all the dynamic content will go
  var articleContainer = $(".article-container");
  var articleContainerR = $(".article-containerR");

  // Adding event listeners 
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);
  $(document).on("click", ".scrape-new-right", handleArticleScrapeR);

  // Once the page is ready, run the initPage function to kick things off
  initPage();
  initPageR();

  function clearDB() {
    // triggered when scrape occurs in order to get rid of old articles
    $.ajax({
      method: "DELETE",
      url: "/api/headlines/"

    }).then(function (result) {
      console.log("headlines collection dropped")
    });
  }

  function clearDBR() {
    // triggered when scrape occurs in order to get rid of old articles
    $.ajax({
      method: "DELETE",
      url: "/api/headlinesR/"

    }).then(function (result) {
      console.log("headliners collection dropped")
    });
  }

  function initPage() {
    // Empty the article container, run an AJAX request for any unsaved headlines
    articleContainer.empty();
    $.get("/api/headlines?saved=false").then(function (data) {
      // If we have headlines, render them to the page
      if (data && data.length) {
        renderArticles(data);
      }
      else {
        // Otherwise render a message explaining we have no articles
        renderEmpty();
      }
    });
  }

  function initPageR() {
    // Empty the article container, run an AJAX request for any unsaved headlines
    articleContainerR.empty();
    $.get("/api/headlinesR?saved=false").then(function (data) {
      // If we have headlines, render them to the page
      if (data && data.length) {
        renderArticlesR(data);
      }
      else {
        // Otherwise render a message explaining we have no articles
        renderEmptyR();
      }
    });
  }

  function renderArticles(articles) {
    // This function handles appending HTML containing our article data to the page
    // We are passed an array of JSON containing all available articles in our database
    var articleCards = [];
    // We pass each article JSON object to the createCard function which returns a bootstrap
    // card with our article data inside
    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }
    // Once we have all of the HTML for the articles stored in our articleCards array,
    // append them to the articleCards container
    articleContainer.append(articleCards);
  }

  function renderArticlesR(articles) {
    // This function handles appending HTML containing our article data to the page
    // We are passed an array of JSON containing all available articles in our database
    var articleCardsR = [];
    // We pass each article JSON object to the createCard function which returns a bootstrap
    // card with our article data inside
    for (var i = 0; i < articles.length; i++) {
      articleCardsR.push(createCard(articles[i]));
    }
    // Once we have all of the HTML for the articles stored in our articleCards array,
    // append them to the articleCards container
    articleContainerR.append(articleCardsR);
  }

  function createCard(article) {
    // This function takes in a single JSON object for an article/headline
    // It constructs a jQuery element containing all of the formatted HTML for the
    // article card
    var card = $(
      [
        "<div class='card'>",
        "<div class='card-header'>",
        "<h5>",
        "<a class='article-link' target='_blank' href='" + article.url + "'>",
        article.headline,
        "</a>",
        "</h5>",
        "</div>",
        "<div class='card-body'>",
        article.summary,
        "</div>",
        "<hr>",
        "</div>"
      ].join("")
    );
    // We attach the article's id to the jQuery element
    // We will use this when trying to figure out which article the user wants to save
    card.data("_id", article._id);
    // We return the constructed card jQuery element
    return card;
  }

  function createCardR(article) {
    // This function takes in a single JSON object for an article/headline
    // It constructs a jQuery element containing all of the formatted HTML for the
    // article card
    var cardR = $(
      [
        "<div class='card CR'>",
        "<div class='card-header'>",
        "<h5>",
        "<a class='article-link' target='_blank' href='" + article.url + "'>",
        article.headline,
        "</a>",
        "</h5>",
        "</div>",
        "<div class='card-body'>",
        article.summary,
        "</div>",
        "<hr>",
        "</div>"
      ].join("")
    );
    // We attach the article's id to the jQuery element
    // We will use this when trying to figure out which article the user wants to save
    cardR.data("_id", article._id);
    // We return the constructed card jQuery element
    return cardR;
  }

  function renderEmpty() {
    // This function renders some HTML to the page explaining we don't have any articles to view
    // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h3>No Articles Downloaded</h3>",
        "<h4>Click on arrow above to grab some news from \"the Left\".</h4>",
        "</div>",
      ].join("")
    );

    // Appending this data to the page
    articleContainer.append(emptyAlert);
  }

  function renderEmptyR() {
    // This function renders some HTML to the page explaining we don't have any articles to view
    // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
    var emptyAlertR = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h3>No Articles Downloaded</h3>",
        "<h4>Click on arrow above to grab some news from \"the Right\".</h4>",
        "</div>",
      ].join("")
    );
    // Appending this data to the page
    articleContainerR.append(emptyAlertR);
  }

  function handleArticleSave() {
    // This function is triggered when the user wants to save an article
    // When we rendered the article initially, we attached a javascript object containing the headline id
    // to the element using the .data method. Here we retrieve that.
    var articleToSave = $(this)
      .parents(".card")
      .data();
    articleToSave.saved = true;
    // Using a patch method to be semantic since this is an update to an existing record in our collection
    $.ajax({
      method: "PUT",
      url: "/api/headlines/" + articleToSave._id,
      data: articleToSave
    }).then(function (data) {
      // If the data was saved successfully
      if (data.saved) {
        // Run the initPage function again. This will reload the entire list of articles
        initPage();
      }
    });
  }

  function showRight() {
    //produces spinner to show scrape process is underway
    $(".loaderRight").show();
  }

  function showLeft() {
    //produces spinner to show scrape process is underway
    $(".loaderLeft").show();
  }

  function handleArticleScrape() {
    // This function handles the user clicking any "scrape new article" buttons
    event.preventDefault();
    clearDB();
    showLeft();
    $.get("/api/fetch").then(function (data) {
      // If we are able to successfully scrape the NYTIMES and compare the articles to those
      // already in our collection, re render the articles on the page
      // and let the user know how many unique articles we were able to save
      initPage();
      location.reload();
      bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
    });
  }

  function handleArticleScrapeR() {
    // This function handles the user clicking any "scrape new article" buttons
    event.preventDefault();
    clearDBR();
    showRight();
    $.get("/api/fetchR").then(function (data) {
      // If we are able to successfully scrape foxnews.com and compare the articles to those
      // already in our collection, re render the articles on the page
      // and let the user know how many unique articles we were able to save
      initPage();
      location.reload();
      bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
    });
  }
});
