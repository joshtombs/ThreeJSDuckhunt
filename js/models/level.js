window.app = window.app || {};
;(function(App, Backbone){
  App.Models = App.Models || {};
  App.Models.Level = Backbone.Model.extend({
    defaults: {
      number: 1,
      velocity: {x:0, y:0, z:0},
      maxDistance: 0,
      numberBirds: 3,
      birdsShot: 0,
      birdsMissed: 0
    },
    initialize: function(){
      this.listenTo(this, 'change:birdsMissed', this.endGame);
    },
    start: function(){
      this.set('scene', new app.Views.Scene({
        skyColor: this.skyColor,
        level: this
      }));
    },
    endGame: function(){
      if(this.get('birdsMissed') >= Math.floor(0.8*this.get('numberBirds'))){
      }
    }
  })
})(window.app, Backbone)
