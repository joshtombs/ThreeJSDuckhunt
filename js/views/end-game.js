window.app = window.app || {};
;(function(App, Backbone){
  app.Views = app.Views || {};
  app.Views.Endgame = Backbone.View.extend({
    el: '.game-ender',
    template: JST['end_game'],
    // events:{
    //   'click input.end-game': 'close'
    // },
    render: function(){
      this.$el.html(this.template());
      return this.el;
    }
    // close: function(){
    //   console.log('button clicked')
    //   // this.$el.children()[0].style.display = 'none';
    //   // this.model.set('level', this.model.get('levels').pop());
    //   // this.model.get('level').start();
    //   // this.model.resume()
    // }
  })
})(app, Backbone)
