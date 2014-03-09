Article = new Meteor.Collection("article");
/* Article Collection
 * { filename: file name, datetime: created at, title: article title, 
 *   url: article url, body: all text } */

if (Meteor.isClient) {
  Meteor.Router.add({
    '/log/:id': function(id) { 
      Session.set('current_id', id);
    }
  });

  Meteor.subscribe('all_article');
  Meteor.subscribe('get_log', Session.get('current_id'));
  Meteor.subscribe('articles', Session.get('display_history'));

  Template.article.log = function () {
    var current_id = Session.get('current_id');
    if (current_id == null) {
      return Article.find({}, {sort: {datetime: -1}, limit: 5});
    } else {
      return Article.find({url: current_id});
    }
  };

  Template.footer.year = function () {
    Session.set('display_history', get_now_year());
    return get_now_year();
  };

  Template.nav.year = function () {
    return Session.get('display_history');
  };

  Template.nav.articles = function () {
    var year = Session.get('display_history');
    if (year == "All") {
      year = "";
    } else if (year == null || !year.match(/^[0-9]{4}$/i)) {
      year = get_now_year();
    } 
    var match = new RegExp("^" + year);
    return Article.find({datetime: match}, {sort: {datetime: -1}});
  };

  Template.nav.history_year = function () {
    var articles = Article.find({}, {sort: {datetime: -1}});

    var years = ["All"];
    articles.forEach(function(article) {
      var datetime = String(article.datetime);
      datetime.match(/^([0-9]{4})/i);
      var year = RegExp.$1;

      if (years.indexOf(year) == -1) {
        years.push(year);
      }
    });

    return years;
  };

  Template.nav.events({
    'click .history-log' : function(e, t) {
      var display_history = String(this);
      Session.set('display_history', display_history);
    },

    'click .call-article' : function(e, t) {
      move_top_article();
    },
  });

  Template.article.events({
    'click .call-article' : function(e, t) {
      move_top_article();
    },
  });

} /* end of isClient */

if (Meteor.isServer) {
  var fs = Npm.require('fs');
  var root = process.env.PWD;

  Meteor.Router.add({
    '/create_index': function() {

      var path = root + "/client/log/";
      var file_list = get_filelist(path);

      if (file_list == null) {
        return '<a href="/">create index failed.</a>';
      }

      file_list.forEach(function(file) {
        var a = get_article(path, file);

        if (a != null) {
          Article.insert(a);
        }
      });

      return '<a href="/">index created.</a>';
    }
  });

  Meteor.publish("articles", function (year) {
    if (year == "All") {
      year = "";
    } else if (year == null || !year.match(/^[0-9]{4}$/i)) {
      year = get_now_year();
    } 
    var match = new RegExp("^" + year);
    return Article.find({datetime: match}, {sort: {datetime: -1}});
  });

  Meteor.publish("all_article", function () {
    return Article.find({}, {sort: {datetime: -1}});
  });

  Meteor.publish("get_log", function (current_id) {
    if (current_id == null) {
      return Article.find({}, {sort: {datetime: -1}, limit: 5});
    } else {
      return Article.find({url: current_id});
    }
  });

  Article.allow({
    insert: function(userId, doc) {
      return true;
    },
    fetch: undefined
  });

  Meteor.startup(function () {
    // code to run on server at startup
  });

  /* ---------- functions ---------- */

  var get_filelist = function(path) {
    return fs.readdirSync(path);
  }

  var get_article = function(path, filename) {
    var article = Article.findOne({filename: filename});
    if (article != null) {
      // already added.
      return null;
    }

    var data = fs.readFileSync(path + filename, "utf-8");

    var title_match = /^\# (.+)\r?\n/i;
    var title = "";
    if (!String(data).match(title_match)) {
      return null;
    } else {
      title = RegExp.$1;
    }
    
    var datetime = filename.substr(0,4) + 
                   "/" + filename.substr(4,2) + 
                   "/" + filename.substr(6,2) +
                   " " + filename.substr(9,2) +
                   ":" + filename.substr(11,2);

    var url = filename.substr(14);
    var url_match = /^(.+)\.md/i;
    if (!url.match(url_match)) {
      return null;
    } else {
      url = RegExp.$1;
    }

    return { filename: filename, 
             datetime: datetime, 
             title: title, 
             url: url, 
             body: data }
  }
} /* end of isServer */

var get_now_year = function() {
  var now = new Date();
  return String(now.getFullYear());
}

var move_top_article = function() {
  var position = $("#article-top").offset().top;
  $("html, body").animate({scrollTop:position}, 200, "swing");
}
