window.app = window.app || {};
;(function(App, Backbone, jQuery){
  App.Views = App.Views || {};
  App.Views.Scoreboard = Backbone.View.extend({
    template: JST['scoreboard'],
    events:{
      'click input.pause-button': 'pause'
    },
    initialize: function(options) {
      this.options = options;
      this.listenTo(this.model, "change", this.render);
    },
    render: function(){
      this.$el.html(this.template(this.model.attributes));
      this.levelinfo = new app.Views.LevelInfo({
        el: this.$el.find('.level'),
        model: this.options.levelmodel
      });
      this.levelinfo.render();

      return this;
    },
    pause: function() {
      console.log("hit");
    }
  });
})(app, Backbone, jQuery)
