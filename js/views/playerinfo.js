window.app = window.app || {};
;(function(App, Backbone){
  App.Views = App.Views || {};
  App.Utils = App.Utils || {};
  App.Views.PlayerInfo = Backbone.View.extend({
    el: '.player-info',
    template: JST['player_info'],
    events: {
      "change input#namebox": "nameEntered"
    },
    initialize: function(cb){
      this.callback = cb;
    },
    nameEntered: function(e){
      App.Utils.PlayerName = $(e.target).val();
      this.close()
    },
    render: function(){
      this.$el.html(this.template());
      return this.el;
    },
    close: function(){
      this.$el.children()[0].style.display = 'none';
      this.callback();
    }
  });
})(app, Backbone)
