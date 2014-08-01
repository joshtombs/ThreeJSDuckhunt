window.app = window.app || {};
;(function(App, Backbone){
  app.Views = app.Views || {};
  app.Views.Endgame = Backbone.View.extend({
    el: '.game-ender',
    template: JST['end_game'],
    events:{
      'click .gameover': function(){location.reload()}
    },
    render: function(){
      this.$el.html(this.template());
      return this.el;
    }
  })
})(app, Backbone)
