window.app = window.app || {};
;(function(App, Backbone){
  App.Views = App.Views || {};
  App.Views.PlayerInfo = Backbone.View.extend({
    el: '.player-info',
    template: _.template(document.querySelector('#playerInfo-template').innerText),
    initialize: function(){

    },
    render: function(){
      this.$el.html(this.template());
      return this.el;
    },
    close: function(){
      this.$el.children()[0].style.display = 'none';
    }
  });
})(app, Backbone)
