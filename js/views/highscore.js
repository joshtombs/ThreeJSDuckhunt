window.app = window.app || {};
;(function(App, Backbone){
  App.Views = App.Views || {};
  App.Utils = App.Utils || {};
  App.Views.highScore = Backbone.View.extend({
    el: '.highscores',
    template: JST['highscore'],
    render: function(){
      this.$el.append(this.template(this.model.attributes));
      return this.el;
    }
  });
})(app, Backbone)
