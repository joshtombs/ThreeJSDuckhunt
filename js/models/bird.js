window.app = window.app || {};
;(function(App, Backbone){
  App.Models = App.Models || {};
  App.Models.Bird = Backbone.Model.extend({
    defaults: {
      position: {x:0, y:0, z:0},
      velocity: {x:0.3, y:0.3, z:0.1},
      scale: 0.15,
      animDuration: 1000,
      path: []
    },
    generateBird: function(cb){
      this.set('threeBird', App.Utils.AnimMorphs[0]);
      this.get('threeBird').position.set(this.get('position').x, this.get('position').y, this.get('position').z);      
      this.generatePath();
      cb(this.get('threeBird'));
    },
    generatePath: function(){
      var b = this.get('threeBird').position.y, i = 0;
      this.set('path', []);
      var levelmax = 30;
      while(b < 100 ){
        b += 5;
        this.get('path')[i] = {
          x: app.randomNum(this.get('threeBird').position.x - levelmax, this.get('threeBird').position.x + levelmax),
          y: app.randomNum(b - 10, b + 10), 
          z: app.randomNum(60, 120)
        };
        i++;
      }
    },
    fly: function(){
      var birdPos = this.get('threeBird').position;
      var birdPath = this.get('path')[index];
      var velocity = this.get('velocity');
      this.get('threeBird').lookAt( new THREE.Vector3( this.get('path')[index].x, this.get('path')[index].y, this.get('path')[index].z) );
      if((birdPos.x < birdPath.x ) && (Math.abs(birdPos.x - birdPath.x) > 1))
        birdPos.x += this.get('velocity').x;
      else if((birdPos.x > birdPath.x)  && (Math.abs(birdPos.x - birdPath.x) > 1))
        birdPos.x -= this.get('velocity').x;
      if((birdPos.y < birdPath.y) && (Math.abs(birdPos.x - birdPath.y) > .8))
        birdPos.y += this.get('velocity').y;
      else if((birdPos.y > birdPath.y) && (Math.abs(birdPos.y - birdPath.y) > .8))
        birdPos.y -= this.get('velocity').y;
      if((birdPos.z < birdPath.z) && (Math.abs(birdPos.z - birdPath.z) > 1))
        birdPos.z += this.get('velocity').z;
      else if((birdPos.z > birdPath.z)  && (Math.abs(birdPos.z - birdPath.z) > 1))
        birdPos.z -= this.get('velocity').z;
    },
    updateTarget: function(){
      var p       = this.get("path")[index];
      if(this.get('threeBird') == void 0)
        return  
      var birdPos = this.get('threeBird').position;
      if((Math.abs(p.x - birdPos.x) < 4) && (Math.abs(p.y - birdPos.y)) < 1)
        window.index++;
    }
  })
})(window.app, Backbone)
