window.app = window.app || {};
;(function(App, Backbone, jQuery){
  App.Views = App.Views || {};
  App.Views.Scoreboard = Backbone.View.extend({
    template: JST['scoreboard'],
    events:{
      'click input.p-button': 'pause',
      'click img.m-button': 'mute'
    },
    initialize: function(options) {
      this.options = options;
      this.listenTo(this.model, "change", this.render);
      setTimeout(function(){this.listenTo(App.game, "change:muted", this.render)}.bind(this),500);
      this.paused = false;
      this.muted = false;
    },
    render: function(){
      if(app.game != undefined)
        this.muted = app.game.get('muted')
      this.$el.html(this.template(this.model.attributes, this.muted));
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
    },
    mute: function() {
      if(app.game.get('muted')){
        app.game.set('muted', false);
      }else{
        app.game.set('muted', true)
      }
    }
  });
})(app, Backbone, jQuery)
