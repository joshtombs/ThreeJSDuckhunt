window.app = window.app || {};
;(function(App, Backbone, THREE){
  App.Views = App.Views || {};
  App.Views.Scene = Backbone.View.extend({
    initialize: function(options){
      this.level = options.level;
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera( 60, app.Utils.idealWidth / app.Utils.idealHeight, 1, 1000 );
      this.camera.position.set( 0, 50, 205 );
      this.scene.fog = new THREE.Fog( 0xEBEBEB, 0, 900);
      skytexture = THREE.ImageUtils.loadTexture("images/cloud.jpg");
      skytexture.wrapS = THREE.RepeatWrapping;
      skytexture.wrapT = THREE.RepeatWrapping;
      skytexture.repeat.set(0.7,0.3);
      skyPlane = new THREE.Mesh( new THREE.PlaneGeometry(4 * app.Utils.idealWidth, app.Utils.idealHeight), new THREE.MeshBasicMaterial({color: options.skyColor, map: skytexture}));
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
      var newplane = new THREE.Mesh( new THREE.PlaneGeometry(app.Utils.idealWidth,255), new THREE.MeshLambertMaterial({color: 0x003300, map:grasstexture}));
      
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
      var bushMesh;
      for(var i = 0; i < 30; i++){
        var bushtexture = THREE.ImageUtils.loadTexture("images/bush.jpg");
        bushtexture.wrapS = THREE.RepeatWrapping;
        bushtexture.wrapT = THREE.RepeatWrapping;
        bushtexture.repeat.set(8,8);
    
        var materialScene = new THREE.MeshLambertMaterial( { 
          shading: THREE.FlatShading,
          map: bushtexture,
          color: 0x004F00
          // opacity: 0.5
          // wireframe: true 
        });

        // materialScene.transparent = true
        bushMesh = new THREE.Mesh( app.Utils.BushGeometry, materialScene );
        // bushMesh = new THREE.Mesh(new THREE.BoxGeometry(10,10,10), materialScene)
        var sc = 1;
        bushMesh.scale.set( sc, sc, sc );
        bushMesh.updateMatrix();
        bushMesh.position.set(-100 + 10*i,10,140);
        this.add(bushMesh);
      }
    },
    DrawTrees: function(){
      var numTrees = app.Utils.randomNum(2,4);
      for(var i = 1; i < numTrees; i++){
        var materialScene = new THREE.MeshBasicMaterial( { 
          color: 0x000000, 
          shading: THREE.FlatShading
        });
        var treeMesh = new THREE.Mesh( app.Utils.TreeGeometry, materialScene );
        var sc = app.Utils.randomNum(40,80);
        treeMesh.scale.set( sc, sc, sc );
        treeMesh.updateMatrix();

        treeMesh.position.set(app.Utils.randomNum(-100,100),10,app.Utils.randomNum(0,80));
        this.add(treeMesh)
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
          x: app.Utils.randomNum((-app.Utils.idealWidth/20),(app.Utils.idealWidth/20)),
          y: 25,
          z: app.Utils.randomNum(50,110)
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
      var material = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0xffffff, shininess: 20, morphTargets: true, morphNormals: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
      this.gun = new THREE.MorphAnimMesh( app.Utils.GunGeometry, material );

      this.gun.duration = 1000;

      var s = 0.75;
      this.gun.scale.set( s, s, s );
      this.gun.position.set(11,30,200);

      this.gun.rotation.y = -5;
      this.gun.rotation.x = 6;
      this.gun.rotation.z = 5;

      this.gun.castShadow = true;
      this.gun.receiveShadow = true;

      this.add(this.gun);      
    },
    flash: function(){
      var flash = new THREE.AmbientLight(0xFFFFFF,10);
      this.add(flash);
      var _this = this;
      setTimeout(function(){
        _this.remove(flash)
      },70);
    },
    outOfView: function(){
      this.remove(this.bird.get('threeBird'));
      this.morphs.pop();
      this.level.set('birdsMissed', this.level.get('birdsMissed') + 1)
      this.createBirdModel();
    }

  });
})(app, Backbone, THREE)
