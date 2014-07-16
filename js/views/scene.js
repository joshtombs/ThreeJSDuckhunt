window.app = window.app || {};
;(function(App, Backbone, THREE){
  App.Views = App.Views || {};
  App.Views.Scene = Backbone.View.extend({
    initialize: function(options){
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera( 60, app.Utils.idealWidth / app.Utils.idealHeight, 1, 1000 );
      console.log(this.camera)
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
      var bush;
      _this = this;
      for(var i = 0; i < 20; i++){
        var tempBush = App.Utils.AnimMorphs[3].clone();
        tempBush.position.set(App.Utils.randomNum(-100,100),10,140);
        this.add(tempBush);
      }
    },
    DrawTrees: function(){
      var numTrees = app.Utils.randomNum(2,4);
      _this = this;
      for(var i = 1; i < numTrees; i++){
        var tempTree = App.Utils.AnimMorphs[2].clone();
        tempTree.position.set(App.Utils.randomNum(-100,100),10,App.Utils.randomNum(0,80));
        this.add(tempTree)
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
      this.gun = App.Utils.AnimMorphs[1].clone();
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
      this.createBirdModel();
      this.duckIndex--;
    }

  });
})(app, Backbone, THREE)
