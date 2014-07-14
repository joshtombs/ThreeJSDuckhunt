window.app = window.app || {};
app.randomNum = function(min, max){
  var num = Math.random()*(max-min+1) + min;
  return num;
};
app.idealWidth = window.innerWidth;
app.idealHeight = app.idealWidth * (3/7);
app.vertLook = 0.5;
app.horzLook = 0.5;

window.addEventListener( 'resize', onWindowResize, false );
window.document.addEventListener("mousemove", onMouseMove);
window.document.addEventListener("mousedown", onMouseDown);
window.document.addEventListener("mouseup", onMouseUp);

window.index = 0;
// window.levelstats = [[0.1,0.1,0,30,3],[0.1,0.1,0,50,4],[0.2,0.2,0.2,40,5],[0.3,0.3,0.2,50,6],[0.3,0.3,0.3,60,6],[0.4,0.4,0.3,60,6]];
window.duckIndex = 0;

var mouse = new THREE.Vector3();
var projector = new THREE.Projector();
var renderer, mesh;
var clock = new THREE.Clock();
var player = new app.Models.Player();
// var levels = new app.Collections.Levels([
//   {
//     number: 1,
//     velocity:{
//       x: 0.2,
//       y: 0.2,
//       z: 0
//     },
//     maxDistance: 30,
//     numberBirds: 3,
//     skyColor: 0x6E91FF
//   },
//   {
//     number: 2,
//     velocity:{
//       x: 0.2,
//       y: 0.2,
//       z: 0
//     },
//     maxDistance: 40,
//     numberBirds: 4,
//     skyColor: 0xE61A1A
//   },
//   {
//     number: 3,
//     velocity:{
//       x: 0.3,
//       y: 0.3,
//       z: 0.2
//     },
//     maxDistance: 40,
//     numberBirds: 4,
//     skyColor: 0x58A32D
//   },
//   {
//     number: 4,
//     velocity:{
//       x: 0.3,
//       y: 0.3,
//       z: 0.3
//     },
//     maxDistance: 50,
//     numberBirds: 5,
//     skyColor: 0xE9E9CF
//   },
//   {
//     number: 5,
//     velocity:{
//       x: 0.4,
//       y: 0.3,
//       z: 0.4
//     },
//     maxDistance: 40,
//     numberBirds: 5,
//     skyColor: 0xA233CE
//   },
//   {
//     number: 6,
//     velocity:{
//       x: 0.5,
//       y: 0.3,
//       z: 0.4
//     },
//     maxDistance: 40,
//     numberBirds: 5,
//     skyColor: 0x5EE76E
//   }
// ]);
var level = new app.Models.Level({
  skyColor: 0x5EE76E
});
init();
render();  

function init() {
  document.body.style.cursor = 'crosshair';
  var scoreboard = new app.Views.Scoreboard({
    model: player,
    levelmodel: level
  });
  scoreboard.render();
  
  // var birdDisplay = new app.Views.birdDisplay({
  //   model: level
  // });
  // birdDisplay.render();
  
  level.start();
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.sortObjects = false;
  renderer.setClearColor( 0x7ec0ee );
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMapEnabled = true;
  renderer.shadowMapCullFace = THREE.CullFaceBack;
  renderer.setSize( app.idealWidth, app.idealHeight );
  document.body.appendChild( renderer.domElement );
  
  // EFFECTS

  // composer = new THREE.EffectComposer( renderer );
  // composer.addPass( new THREE.RenderPass( scene, camera ) );
  // var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
  // effect.uniforms[ 'amount' ].value = 0.002;
  // effect.renderToScreen = true;
  // composer.addPass( effect );

  // Oculus Rift Effects!!

  // worldScale 100 means that 100 Units == 1m
  effect = new THREE.OculusRiftEffect( renderer, {worldScale: 100} );
  effect.setSize( app.idealWidth, app.idealHeight );
}

function onWindowResize() {
  level.get('scene').camera.aspect = app.idealWidth / app.idealHeight;
  level.get('scene').camera.updateProjectionMatrix();

  renderer.setSize( app.idealWidth, app.idealHeight );
  // effect.setSize( window.innerWidth, window.innerHeight );
}

function onMouseMove(e){
  app.vertLook = e.y/app.idealHeight;
  app.horzLook = e.x/app.idealWidth;

  mouse.x = 2 * (e.clientX / app.idealWidth) -1;
  mouse.y = 1 - 2 * (e.clientY / app.idealHeight);

  var raycaster = projector.pickingRay( mouse.clone(), level.get('scene').camera );
  window.intersects = raycaster.intersectObject(level.get('scene').bird.get('threeBird'));

  document.body.style.cursor = 'crosshair';
}

function onMouseDown(e){
  e.preventDefault();
  // var audio;
  if(player.clipEmpty()){
    // audio = document.getElementById('empty');
    // audio.load();
    // audio.play();
    return
  }
  document.body.style.cursor = 'crosshair';
  level.get('scene').flash();
  player.shoot();
  if(player.clipEmpty()){
    setTimeout(function(){player.reload()}, 2500);
  }
  if ( intersects.length > 0 ) {
    level.set('birdsShot', level.get('birdsShot') + 1);
    duckIndex--;
    // grayDuck(duckIndex);
    player.incrementScoreBy(1);
    level.get('scene').remove(intersects[0].object);
    level.get('scene').morphs.pop();
    setTimeout(function(){ level.get('scene').  createBirdModel()},500);
  }
}

function onMouseUp(e){
  e.preventDefault();
  document.body.style.cursor = 'crosshair';
}

// function updateLevel(){
//   if(level.get('birdsShot') == levelstats[level][4]){ 
//     level++;
//     level.get('birdsShot') = 0;
//     scene = new app.View.Scene();
//     generateGun();
//     generateDuckCounter();
//   }
// }

function render() {
  requestAnimationFrame(render);

  var delta = clock.getDelta();
  var Scene = level.get('scene');
  var gun   = Scene.gun;
  Scene.camera.lookAt( Scene.scene.position );
  // camera.rotateX((1 - app.vertLook) *Math.PI/2)
  
  if(gun != undefined){
    gun.lookAt( Scene.scene.position );
    gun.rotateY((((app.horzLook)*-2))* Math.PI/2);
    gun.rotateZ((1 - app.vertLook) * (Math.PI - 2)/2);
    gun.rotateY(0);
  }  
  Scene.sky.position.x += 0.5
  if(Scene.sky.position.x > 600)
    Scene.sky.position.x = 0;
  checkIndex();
  // updateLevel();
  Bird = level.get('scene').bird;
  if(Bird.get('threeBird') != undefined){
    birdPos = Bird.get('threeBird').position;
    if((birdPos.y > 86) || birdPos.x > (app.idealWidth / 5) || birdPos.x < -(app.idealWidth/5)) {
      level.get('scene').outOfView();
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
  renderer.render( Scene.scene, Scene.camera );
  // effect.render(scene, camera);

}

function morphColorsToFaceColors( geometry ) {
  if ( geometry.morphColors && geometry.morphColors.length ) {
    var colorMap = geometry.morphColors[ 0 ];
    for ( var i = 0; i < colorMap.colors.length; i ++ ) {
      geometry.faces[ i ].color = colorMap.colors[ i ];
    }
  }
}


// ----------------  UI Stuff  ----------------------

function generateDuckCounter(){
  duckIndex = level.get('numberBirds');
  var dcounter = document.getElementsByClassName('duckcounter')[0];
  dcounter.innerHTML = '';
  for(var i = 0; i < duckIndex; i++){
    dcounter.innerHTML += "<img src= 'images/gduck.jpg' class='duckIMG' />"
  }
}

function checkIndex(){
  if(duckIndex == 0)
    if( (level.get('numberBirds') - level.get('birdsShot')) > 0 )
      findMissedBird();
}

function findMissedBird(){
  var ducks = document.getElementsByTagName('img');
  for(var i = 0 ; i >= level.get('numberBirds') - 1; i++){
    var b = ducks[i].src;
    if( (b.indexOf('gduck.jpg') > -1) ){
      duckIndex = i;
    }
  }
}

function grayDuck(ind){
  var ducks = document.getElementsByTagName('img');
  var deadduck = ducks[ind]
  deadduck.src = 'images/duck.jpg';
}
