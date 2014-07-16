window.app = window.app || {};
;(function(App, Backbone, THREE){
  App.Models = App.Models || {};
  App.Models.Game = Backbone.Model.extend({
    defaults:{
      levels: []
    },
    initialize: function(){
      window.addEventListener( 'resize', this.onWindowResize, false );
      window.document.addEventListener("mousemove", this.onMouseMove.bind(this));
      window.document.addEventListener("mousedown", this.onMouseDown.bind(this));
      window.document.addEventListener("mouseup", this.onMouseUp.bind(this));
      
      this.set('mouse', new THREE.Vector3());
      this.set('projector', new THREE.Projector());
      this.set('renderer', new THREE.WebGLRenderer( { antialias: true } ));
      this.set('clock', new THREE.Clock());
      this.set('player', new app.Models.Player());

      document.body.style.cursor = 'crosshair';

      this.get('renderer').sortObjects = false;
      this.get('renderer').setClearColor( 0x7ec0ee );
      this.get('renderer').gammaInput = true;
      this.get('renderer').gammaOutput = true;
      this.get('renderer').shadowMapEnabled = true;
      this.get('renderer').shadowMapCullFace = THREE.CullFaceBack;
      this.get('renderer').setSize( app.Utils.idealWidth, app.Utils.idealHeight );
      document.body.appendChild( this.get('renderer').domElement );

      _this = this;
      this.getPlayerInfo();
        

      this.set('levels', new app.Collections.Levels([
      {
        number: 1,
        velocity:{
          x: 0.2,
          y: 0.2,
          z: 0
        },
        maxDistance: 30,
        numberBirds: 3,
        skyColor: 0x6E91FF
      },
      {
        number: 2,
        velocity:{
          x: 0.2,
          y: 0.2,
          z: 0
        },
        maxDistance: 40,
        numberBirds: 4,
        skyColor: 0xE61A1A
      },
      {
        number: 3,
        velocity:{
          x: 0.3,
          y: 0.3,
          z: 0.2
        },
        maxDistance: 40,
        numberBirds: 4,
        skyColor: 0x58A32D
      },
      {
        number: 4,
        velocity:{
          x: 0.3,
          y: 0.3,
          z: 0.3
        },
        maxDistance: 50,
        numberBirds: 5,
        skyColor: 0xE9E9CF
      },
      {
        number: 5,
        velocity:{
          x: 0.4,
          y: 0.3,
          z: 0.4
        },
        maxDistance: 40,
        numberBirds: 5,
        skyColor: 0xA233CE
      },
      {
        number: 6,
        velocity:{
          x: 0.5,
          y: 0.3,
          z: 0.4
        },
        maxDistance: 40,
        numberBirds: 5,
        skyColor: 0x5EE76E
      }
    ]));
    this.set('level', this.get('levels').pop());
    this.generateUI();

    this.get('level').start();
    this.render();

    // EFFECTS

    // composer = new THREE.EffectComposer( renderer );
    // composer.addPass( new THREE.RenderPass( scene, camera ) );
    // var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
    // effect.uniforms[ 'amount' ].value = 0.002;
    // effect.renderToScreen = true;
    // composer.addPass( effect );

    // Oculus Rift Effects!!

    // worldScale 100 means that 100 Units == 1m
    this.set('effect', new THREE.OculusRiftEffect( this.get('renderer'), {worldScale: 100} ));
    this.get('effect').setSize( app.Utils.idealWidth, app.Utils.idealHeight );
    },
    start: function(){

    },
    generateUI: function(){
      var scoreboard = new app.Views.Scoreboard({
        model: this.get('player'),
        levelmodel: this.get('level')
      });
      scoreboard.render();
      var birdDisplay = new app.Views.birdDisplay({
        model: this.get('level')
      });
      birdDisplay.render();      
    },
    onWindowResize: function() {
      this.get('level').get('scene').camera.aspect = app.Utils.idealWidth / app.Utils.idealHeight;
      this.get('level').get('scene').camera.updateProjectionMatrix();

      this.get('renderer').setSize( app.Utils.idealWidth, app.Utils.idealHeight );
      // effect.setSize( window.innerWidth, window.innerHeight );
    },
    onMouseMove: function(e){
      app.Utils.vertLook = e.y/app.Utils.idealHeight;
      app.Utils.horzLook = e.x/app.Utils.idealWidth;

      this.get('mouse').x = 2 * (e.clientX / app.Utils.idealWidth) -1;
      this.get('mouse').y = 1 - 2 * (e.clientY / app.Utils.idealHeight);

      this.set('raycaster', this.get('projector').pickingRay( this.get('mouse').clone(), this.get('level').get('scene').camera ));
      window.intersects = this.get('raycaster').intersectObject(this.get('level').get('scene').bird.get('threeBird'));

      document.body.style.cursor = 'crosshair';
    },
    onMouseDown: function(e){
      e.preventDefault();
      var audio;
      if(this.get('player').clipEmpty()){
        audio = document.getElementById('empty');
        audio.load();
        audio.play();
        return
      }
      document.body.style.cursor = 'crosshair';
      this.get('level').get('scene').flash();
      this.get('player').shoot();
      _this = this;
      if(this.get('player').clipEmpty()){
        setTimeout(function(){_this.get('player').reload()}, 2500);
      }
      if ( intersects.length > 0 ) {
        this.get('level').birdsShot = this.get('level').birdsShot + 1;
        duckIndex--;
        // grayDuck(duckIndex);
        app.game.get('player').incrementScoreBy(1);
        app.game.get('level').get('scene').remove(intersects[0].object);
        app.game.get('level').get('scene').morphs.pop();
        setTimeout(function(){ _this.get('level').get('scene').createBirdModel()},500);
      }
    },
    onMouseUp: function(e){
      e.preventDefault();
      document.body.style.cursor = 'crosshair';
    },
    getPlayerInfo: function(){
      var playerinfo = new app.Views.PlayerInfo();
      playerinfo.render();
      playerinfo.close();
    },
    render: function() {
      requestAnimationFrame(this.render.bind(this));

      var delta = this.get('clock').getDelta();
      var Scene = this.get('level').get('scene');
      var gun   = Scene.gun;
      Scene.camera.lookAt( Scene.scene.position );
      // camera.rotateX((1 - app.Utils.vertLook) *Math.PI/2)
      
      if(gun != undefined){
        gun.lookAt( Scene.scene.position );
        gun.rotateY((((app.Utils.horzLook)*-2))* Math.PI/2);
        gun.rotateZ((1 - app.Utils.vertLook) * (Math.PI - 2)/2);
        gun.rotateY(0);
      }  
      Scene.sky.position.x += 0.5
      if(Scene.sky.position.x > 600)
        Scene.sky.position.x = 0;
      // checkIndex();
      // updateLevel();
      Bird = this.get('level').get('scene').bird;
      if(Bird.get('threeBird') != undefined){
        birdPos = Bird.get('threeBird').position;
        if((birdPos.y > 86) || birdPos.x > (app.Utils.idealWidth / 5) || birdPos.x < -(app.Utils.idealWidth/5)) {
          this.get('level').get('scene').outOfView();
        }
        else{  
          Bird.fly();
          Bird.updateTarget();
        }
      }
      var morph;
      var morphs = Scene.morphs;  
      for ( var i = 0; i < morphs.length; i ++ ) {
        morph = morphs[ i ];
        morph.updateAnimation( 1000 * delta );
      }
      this.get('renderer').render( Scene.scene, Scene.camera );
      // effect.render(scene, camera);

    },
    end: function(){

    }
  });
})(app, Backbone, THREE)
