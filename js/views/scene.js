window.app = window.app || {};
;(function(App, Backbone, THREE){
  App.Views = App.Views || {};
  App.Views.Scene = Backbone.View.extend({
    initialize: function(options){
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera( 60, app.idealWidth / app.idealHeight, 1, 1000 );
      this.camera.position.set( 0, 50, 205 );
      this.scene.fog = new THREE.Fog( 0xEBEBEB, 0, 900);
      skytexture = THREE.ImageUtils.loadTexture("images/cloud.jpg");
      skytexture.wrapS = THREE.RepeatWrapping;
      skytexture.wrapT = THREE.RepeatWrapping;
      skytexture.repeat.set(0.7,0.3);
      skyPlane = new THREE.Mesh( new THREE.PlaneGeometry(4 * app.idealWidth, app.idealHeight), new THREE.MeshBasicMaterial({color: options.skyColor, map: skytexture}));
      skyPlane.position.z -= 150;
      this.sky = skyPlane;
      this.morphs = [];
      this.add(skyPlane);
      this.DrawGrass();
      this.DrawSun();
      this.DrawBushes();
      this.DrawTrees();
      this.createBirdModel();
      this.createGunModel(); 
    },
    DrawGrass: function(){
      var grasstexture = THREE.ImageUtils.loadTexture("images/grass.jpg");
      grasstexture.wrapS = THREE.RepeatWrapping;
      grasstexture.wrapT = THREE.RepeatWrapping;
      grasstexture.repeat.set(4,4);
      var newplane = new THREE.Mesh( new THREE.PlaneGeometry(app.idealWidth,255), new THREE.MeshLambertMaterial({color: 0x003300, map:grasstexture}));
      
      newplane.position.z +=30;
      newplane.rotation.x = - Math.PI / 2;
      this.scene.add(newplane);
    },
    DrawSun: function(){
      var dirLight = new THREE.DirectionalLight( 0xffffff, 2.5 );
      dirLight.color.setHSL( 0.1, 1, 0.95 );
      dirLight.position.set( 0, 1.75, 1 );
      dirLight.position.multiplyScalar( 50 );

      dirLight.castShadow = true;
      dirLight.shadowMapWidth = 2048;
      dirLight.shadowMapHeight = 2048;
      
      var d = 50;

      dirLight.shadowCameraLeft = -d;
      dirLight.shadowCameraRight = d;
      dirLight.shadowCameraTop = d;
      dirLight.shadowCameraBottom = -d;

      dirLight.shadowCameraFar = 3500;
      dirLight.shadowBias = -0.0001;
      dirLight.shadowDarkness = 0.35;

      this.scene.add( dirLight );

      suntexture = THREE.ImageUtils.loadTexture("images/sun.jpg");
      suntexture.wrapS = THREE.RepeatWrapping;
      suntexture.wrapT = THREE.RepeatWrapping;
      suntexture.repeat.set(3,3);

      var sunsphere = new THREE.Mesh( new THREE.SphereGeometry(100,100,100), new THREE.MeshLambertMaterial({color: 'yellow'}));
      sunsphere.position.z=-200;
      this.scene.add(sunsphere);
    },
    DrawBushes: function(){
      var bush;
      bushtexture = THREE.ImageUtils.loadTexture("images/bush.png");
      bushtexture.wrapS = THREE.RepeatWrapping;
      bushtexture.wrapT = THREE.RepeatWrapping;
      bushtexture.repeat.set(8,8);
      for(var i = 0; i < 20; i++){
        bush = new THREE.Mesh(new THREE.BoxGeometry(20,8,10), new THREE.MeshLambertMaterial({color:0x004000, map:bushtexture}));
        bush.position.set((20*i -200),30,140);
        this.scene.add(bush);
      }
    },
    DrawTrees: function(){
      var numTrees = app.randomNum(2,4);
      _this = this;
      for(var i = 1; i < numTrees; i++){
        var loader = new THREE.JSONLoader();
        loader.load( "models/tree.js", function( geometry ) {
          var materialScene = new THREE.MeshBasicMaterial( { color: 0x000000, shading: THREE.FlatShading } );
          treeMesh = new THREE.Mesh( geometry, materialScene );
          treeMesh.position.set(app.randomNum(-100,100),10,app.randomNum(0,80));

          var sc = app.randomNum(40,80);
          treeMesh.scale.set( sc, sc, sc );

          treeMesh.matrixAutoUpdate = false;
          treeMesh.updateMatrix();

          _this.add( treeMesh );
        })
      }
    },
    add: function(obj){
      this.scene.add(obj);
    },
    remove: function(obj){
      this.scene.remove(obj);
    },
    createBirdModel: function(){
      this.bird = new app.Models.Bird({
        position: {
          x: app.randomNum((-app.idealWidth/20),(app.idealWidth/20)),
          y: 25,
          z: app.randomNum(50,110)
        },
        scene: this.scene
      });
      _this = this;
      this.bird.generateBird(function(bird){
        _this.add(bird);
        _this.morphs.push(bird);
      });
      index = 0;
    },
    createGunModel: function(){
      var loader = new THREE.JSONLoader();
      _this = this;
      loader.load( "models/hyperblaster.js", function( geometry ) {
        morphColorsToFaceColors( geometry );
        geometry.computeMorphNormals();
        var material = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0xffffff, shininess: 20, morphTargets: true, morphNormals: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
        var gun = new THREE.MorphAnimMesh( geometry, material );

        gun.duration = 1000;

        var s = 0.75;
        gun.scale.set( s, s, s );
        gun.position.set(11,30,200);

        gun.rotation.y = -5;
        gun.rotation.x = 6;
        gun.rotation.z = 5;

        gun.castShadow = true;
        gun.receiveShadow = true;
        _this.gun = gun;
        _this.add( _this.gun );
      });
    },
    flash: function(){
      var flash = new THREE.AmbientLight(0xFFFFFF,10);
      this.add(flash);
      _this = this;
      setTimeout(function(){_this.remove(flash)},70);
    },
    outOfView: function(){
      this.remove(this.bird.get('threeBird'));
      this.morphs.pop();
      this.createBirdModel();
      this.duckIndex--;
    }

  });
})(app, Backbone, THREE)
