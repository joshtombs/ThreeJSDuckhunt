window.app = window.app || {};
;(function(App, Backbone){
  App.Models = App.Models || {};
  App.Models.Scene = Backbone.Model.extend({
    defaults: {
      skyColor: 0x6E91FF,

    }
  }),
  createScene: function(){
    var scene = new THREE.Scene();
    this.createSky();
    this.createGrass();

  },
  createSky: function(){
    var skyTexture = THREE.ImageUtils.loadTexture("../../images/cloud.jpg");
    skyTexture.wrapS = THREE.ReapeatWrapping;
    skyTexture.wrapT = THREE.ReapeatWrapping;
    skyTexture.repeat.set(0.7, 0.3);

    var geometry = new THREE.PlaneGeometry(4*/*idealwidth*/, /*idealheight*/);
    var material = new THREE.MeshBasicMaterial({color: this.skyColor, map: skyTexture});
    skyPlane = new THREE.Mesh( geometry, material );
    skyPlane.position.z -= 150;
    // scene.add(skyPlane);
  },
  createGrass: function(){
    var grassTexture = THREE.ImageUtils.loadTexture("../../images/grass.jpg");
    grassTexture.wrapS = THREE.ReapeatWrapping;
    grassTexture.wrapT = THREE.ReapeatWrapping;
    grassTexture.repeat.set(4, 4);

    var geometry = new THREE.PlaneGeometry( /*idealwidth*/, 255);
    var material = new THREE.MeshLambertMaterial({color: 0x003300, map: grassTexture});
    grassPlane = new THREE.Mesh( geometry, material );
    grassPlane.position.z += 30;
    grassPlane.rotation.x = -Math.PI / 2;
    // scene.add(grassPlane); 
  }


})(window.app, Backbone)
