window.app = window.app || {};
;(function(App, Backbone, jQuery){
  App.Views = App.Views || {};
  App.Views.Scoreboard = Backbone.View.extend({
    template: JST['scoreboard'],
    events:{
      'click input.p-button': 'pause'
    },
    initialize: function(options) {
      this.options = options;
      this.listenTo(this.model, "change", this.render);
      this.paused = false;
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
      if(!this.paused){
        app.game.pause();
        this.paused = true
      }
      else{
        app.game.resume();
        this.paused = false
      }
    }
  });
})(app, Backbone, jQuery)
