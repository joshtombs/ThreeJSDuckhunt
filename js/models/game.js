window.app = window.app || {};
;(function(App, Backbone, THREE){
  App.Models = App.Models || {};
  App.Models.Game = Backbone.Model.extend({
    defaults:{
      levels: [],
      updateUI: true,
      muted: false
    },
    setEventListeners: function() {
      document.getElementById('canvas').onmousedown = this.onMouseDown.bind(this);
      document.getElementById('canvas').onmouseup = this.onMouseUp.bind(this);
      document.getElementById('canvas').onmousemove = this.onMouseMove.bind(this);
    },

    removeEventListeners: function() {
      document.getElementById('canvas').onmousedown = null;
      document.getElementById('canvas').onmouseup = null;
      document.getElementById('canvas').onmousemove = null;
    },

    initialize: function(){
      this.on("change:level", function() {
        this.generateUI()
      });

      this.set('mouse', new THREE.Vector3());
      this.set('projector', new THREE.Projector());
      this.set('renderer', new THREE.WebGLRenderer( { antialias: true } ));
      this.set('clock', new THREE.Clock());
      this.set('player',
        new app.Models.Player({
          name: App.Utils.PlayerName
        })
      );

      this.get('renderer').sortObjects = false;
      this.get('renderer').setClearColor( 0x7ec0ee );
      this.get('renderer').gammaInput = true;
      this.get('renderer').gammaOutput = true;
      this.get('renderer').shadowMapEnabled = true;
      this.get('renderer').shadowMapCullFace = THREE.CullFaceBack;
      this.get('renderer').setSize( app.Utils.idealWidth, app.Utils.idealHeight );
      document.getElementById('canvas').appendChild( this.get('renderer').domElement );

      _this = this;

      this.set('levels', new app.Collections.Levels([
      {
        number: 8,
        velocity:{
          x: 0.5,
          y: 0.4,
          z: 0.4
        },
        maxDistance: 50,
        numberBirds: 7,
        skyColor: 0x2A8FF0
      },
      {
        number: 7,
        velocity:{
          x: 0.5,
          y: 0.4,
          z: 0.4
        },
        maxDistance: 50,
        numberBirds: 6,
        skyColor: 0x69E2BE
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
        number: 1,
        velocity:{
          x: 0.2,
          y: 0.2,
          z: 0
        },
        maxDistance: 30,
        numberBirds: 3,
        skyColor: 0x6E91FF
      }
    ]));
    this.set('level', this.get('levels').pop());
    this.listenTo( this.get('level'), "change:birdsShot", this.updateLevel);
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
      this.setEventListeners();
    },
    pause: function(){
      cancelAnimationFrame(app.Utils.ID);
      this.removeEventListeners();
    },
    resume: function(){
      this.render();
      this.removeEventListeners();
      this.setEventListeners();
    },
    updateLevel: function(){
      if(this.get('level').get('birdsShot') >= this.get('level').get('numberBirds')){
        var _this = this;
        this.pause();
        this.stopListening(this.get('level'));
        var inbetweenLevels = new app.Views.Inbetween({
          model: this,
          cb: function(){
            if(this.get('levels').length < 1){
              alert('You\'re a weinner!')
              app.game.end();
            }else{
              var levels = this.get('levels');
              this.set('level', levels.pop());
              var level = this.get('level');
              if(levels.length == 0)
                levels.push(new app.Models.Level({
                  number: level.get('number') + 1,
                  velocity:{
                    x: level.get('velocity').x + 0.05,
                    y: level.get('velocity').y + 0.05,
                    z: level.get('velocity').z + 0.05
                  },
                  maxDistance: level.get('maxDistance') + 5,
                  numberBirds: level.get('numberBirds'),
                  skyColor: 0xFFFFFF * Math.random()
                }));

              this.get('level').start();
              this.get('player').reload();
              this.listenTo( this.get('level'), "change:birdsShot", this.updateLevel);
              this.resume();
            }
          }.bind(_this)
        });
        $('.inbetween').html(inbetweenLevels.render().el);
      } else{
        setTimeout(function(){ app.game.get('level').get('scene').createBirdModel()},500);
      }
    },
    generateUI: function(){
      var scoreboard = new app.Views.Scoreboard({
        model: this.get('player'),
        levelmodel: this.get('level'),
        game: this
      });
      $('.score-board').html(scoreboard.render().el)
      var birdDisplay = new app.Views.birdDisplay({
        model: this.get('level')
      });
      birdDisplay.render();
    },
    onMouseMove: function(e){
      app.Utils.vertLook = e.y/app.Utils.idealHeight;
      app.Utils.horzLook = e.x/app.Utils.idealWidth;

      this.get('mouse').x = 2 * (e.clientX / app.Utils.idealWidth) -1;
      this.get('mouse').y = 1 - 2 * (e.clientY / app.Utils.idealHeight);
      if(this.get('level') != void 0){
        this.set('raycaster', this.get('projector').pickingRay( this.get('mouse').clone(), this.get('level').get('scene').camera ));
        window.intersects = this.get('raycaster').intersectObject(this.get('level').get('scene').bird.get('threeBird'));
      }
    },
    onMouseDown: function(e){
      e.preventDefault();
      var audio;
      if(this.get('player').clipEmpty()){
        if(!this.get('muted')){
          audio = document.getElementById('empty');
          audio.load();
          audio.play();
        }
        return
      }
      this.get('level').get('scene').flash();
      this.get('player').shoot();
      var _this = this;
      if(this.get('player').clipEmpty()){
        setTimeout(function(){_this.get('player').reload()}, 2500);
      }
      if ( intersects.length > 0 ){
        var level = app.game.get('level')
        app.game.get('player').incrementScoreBy(1);
        level.birdShot(intersects[0].object);
      }
    },
    onMouseUp: function(e){
      e.preventDefault();
    },
    render: function() {
      app.Utils.ID = requestAnimationFrame(this.render.bind(this));
      var delta = this.get('clock').getDelta();
      if(this.get('level').get('scene') != undefined){
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
      }

    },
    end: function(){
      this.pause();
      window.onbeforeunload = null;
      $('#canvas').css('display', 'none');
      $('.highscores').css('display', '');
      var ender = new app.Views.Endgame();
      ender.render();
      var p = app.game.get('player');
      if(p.get('name') != 'test'){
        var highscore = new app.Utils.HighScore();
        highscore.save({
          name: p.get('name'),
          score: p.get('score')
        }).then(function(object){
          console.log('You\'re high score of ' + app.game.get('player').get('score') + ' was saved!')
        })
      }
    }
  });
})(app, Backbone, THREE)
