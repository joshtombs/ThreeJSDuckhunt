window.app = window.app || {};
;(function(App, Backbone){
  App.Models = App.Models || {};
  App.Models.Level = Backbone.Model.extend({
    defaults: {
      velocity: {x:0, y:0, z:0},
      maxDistance: 0,
      numberBirds: 1,
      birdsShot: 0,
      birdsMissed: 0
    }
  })
})(window.app, Backbone)
