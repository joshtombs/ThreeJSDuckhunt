window.app = window.app || {};
;(function(App, Backbone){
  App.Models = App.Models || {};
  App.Models.Level = Backbone.Model.extend({
    defaults: {
      number: 1,
      velocity: {x:0, y:0, z:0},
      maxDistance: 0,
      numberBirds: 1,
      birdsShot: 0,
      birdsMissed: 0,
      skyColor: 0x6E91FF
    },
    update: function(){
      if(this.get('birdsShot') == this.get('numberBirds'))
        window.level++;
    },
    start: function(){
      this.set('scene', new app.Views.Scene({
        skyColor: this.skyColor
      }));
    }
  })
})(window.app, Backbone)
