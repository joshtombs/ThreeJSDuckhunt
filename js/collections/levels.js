window.app = window.app || {};
;(function(App, Backbone){
  App.Collections = App.Collections || {};
  App.Collections.Levels = Backbone.Collection.extend({
    model: app.Models.Level,
  });
})(app, Backbone)
