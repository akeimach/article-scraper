$(document.body).ready(function() {

  displayArticles();

  $("#start-scraper").on("click", startScrape);
  $("#scrape-success-close").on("click", function(event) {
    location.reload();
  });
  $(document).on("click", ".save-article", saveArticle);
  

});

function startScrape() {
  event.preventDefault();
  $.ajax({
    method: "GET",
    url: "/api/scrape"
  }).then(function(data) {
    $("#scrape-success").modal("toggle");
  });
}

function displayArticles() {
  $(".article-container").empty(); // first remove old articles
  $.ajax({
    method: "GET",
    url: "/api/articles/" + false,
  }).then(function(data) {
    console.log(data);
    if (data) {
      for (var i = 0; i < 5; i++) {

        var article = $("<div>");
        article.addClass("card");

        var header = $("<div>");
        header.addClass("card-header");
        header.html("<a href='" + data[i].link + "' target='_blank'>" + data[i].title + "</a>");

        var body = $("<div>");
        body.addClass("card-body");
        body.html("<p>" + data[i].summary + "</p>");

        var saveButton = $("<button>");
        saveButton.addClass("btn");
        saveButton.addClass("save-article");
        saveButton.attr("data", data[i]._id);
        saveButton.text("Save Article");

        body.append(saveButton);
        article.append(header);
        article.append(body);
        $(".article-container").append(article);
        $(".article-container").append("<br>");
      }
    }
  });
}

function saveArticle() {
  event.preventDefault();
  var id = $(this)[0].attributes[1].value;
  $.ajax("/api/articles/" + id + "/" + true, {
    method: "PUT"
  }).then(function(result) {
    console.log("SAVE SUCCESS");
  });
}

