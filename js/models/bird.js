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
      var _this = this;
      var loader = new THREE.JSONLoader();
      loader.load( "models/stork.js", function( geometry ) {

        morphColorsToFaceColors( geometry );
        geometry.computeMorphNormals();

        var material = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0xC0C0C0, shininess: 5, morphTargets: true, morphNormals: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
        var threeBird = new THREE.MorphAnimMesh( geometry, material );
        threeBird.duration = _this.get('animDuration');

        var s = _this.get('scale');
        threeBird.scale.set( s, s, s );
        threeBird.position.set(_this.get('position').x, _this.get('position').y,_this.get('position').z);
        threeBird.rotation.y = -1;
        threeBird.castShadow = true;
        threeBird.receiveShadow = true;

        threeBird.velocity = _this.get('velocity');
        _this.set('threeBird', threeBird);
        _this.generatePath();
        cb(_this.get('threeBird'));
      });
    },
    generatePath: function(){
      var b = this.get('threeBird').position.y, i = 0;
      this.set('path', []);
      while(b < (window.idealHeight/10 + 20 )){
        b += 5;
        this.get('path')[i] = {
          x: app.randomNum(this.get('threeBird').position.x - window.levelstats[window.level][3], this.get('threeBird').position.x + window.levelstats[window.level][3]),
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
      if((birdPos.y > (window.idealHeight / 10)) || birdPos.x > (window.idealwidth / 5) || birdPos.x < -(window.idealwidth/5)) {
        outOfView(this.get('threeBird'));
      }
      else {      
        if((birdPos.x < birdPath.x ) && (Math.abs(birdPos.x - birdPath.x) > 1))
          birdPos.x += velocity.x;
        else if((birdPos.x > birdPath.x)  && (Math.abs(birdPos.x - birdPath.x) > 1))
          birdPos.x -= velocity.x;
        if((birdPos.y < birdPath.y) && (Math.abs(birdPos.x - birdPath.y) > .8))
          birdPos.y += velocity.y;
        else if((birdPos.y > birdPath.y) && (Math.abs(birdPos.y - birdPath.y) > .8))
          birdPos.y -= velocity.y;
        if((birdPos.z < birdPath.z) && (Math.abs(birdPos.z - birdPath.z) > 1))
          birdPos.z += velocity.z;
        else if((birdPos.z > birdPath.z)  && (Math.abs(birdPos.z - birdPath.z) > 1))
          birdPos.z -= velocity.z;
      }
    },
    updateTarget: function(){
      var p       = bird.get("path")[index];
      if(bird.get('threeBird') == void 0)
        return  
      var birdPos = bird.get('threeBird').position;
      if((Math.abs(p.x - birdPos.x) < 4) && (Math.abs(p.y - birdPos.y)) < 1)
        window.index++;
    }
  })
})(window.app, Backbone)
