window.app = window.app || {};
;(function(App, Backbone, jQuery){
  App.Views = App.Views || {};
  App.Views.LevelInfo = Backbone.View.extend({
    template: JST['level'],
    initialize: function(options) {
      this.listenTo(this.model, "change", this.render);
    },
    render: function(){
      this.$el.html(this.template(this.model.attributes));
      return this.el;
    }
  });
})(app, Backbone, jQuery)
