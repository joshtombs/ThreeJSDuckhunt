window.app = window.app || {};
app.randomNum = function(min, max){
  var num = Math.random()*(max-min+1) + min;
  return num;
};
window.idealwidth = window.innerWidth;
window.idealHeight = idealwidth * (3/7);
window.app.vertLook = 0.5;
window.app.horzLook = 0.5;
window.app.skyColor = 0x6E91FF;
window.Gun = {};
window.newgun= null;
window.target = [];
window.index = 0;
window.levelstats = [[0.1,0.1,0,30,3],[0.1,0.1,0,50,4],[0.2,0.2,0.2,40,5],[0.3,0.3,0.2,50,6],[0.3,0.3,0.3,60,6],[0.4,0.4,0.3,60,6]];
window.level = 0;
window.levelCounter = 0;
window.duckIndex = 0;
var mouse = new THREE.Vector3();
var projector = new THREE.Projector();
var renderer, mesh, levels = [];
var morph, morphs = [];
var clock = new THREE.Clock();
var player = new app.Models.Player();
var level = new app.Models.Level();

init();
render();

function init() {
  document.body.style.cursor = 'crosshair';
  generateScoreBoard();
  generateDuckCounter();
  generateLevels(); 
  level.start();
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.sortObjects = false;
  renderer.setClearColor( 0x7ec0ee );
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMapEnabled = true;
  renderer.shadowMapCullFace = THREE.CullFaceBack;
  renderer.setSize( idealwidth, idealHeight );
  document.body.appendChild( renderer.domElement );
  //
  window.addEventListener( 'resize', onWindowResize, false );
  window.document.addEventListener("mousemove", onMouseMove);
  window.document.addEventListener("mousedown", onMouseDown);
  window.document.addEventListener("mouseup", onMouseUp);

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
  effect.setSize( idealwidth, idealHeight );
}

function generateLevels(){
  var i = 0;
  while(i<10){
    switch(i){
      case 0: 
        console.log(0);
        break;
      case 1:
        console.log(1);
        break;
      case 2:
        console.log(2);
        break;
      default:
        console.log('default');
        break;
    }
    i++;
  }
}

function onWindowResize() {
  level.get('scene').camera.aspect = idealwidth / idealHeight;
  level.get('scene').camera.updateProjectionMatrix();

  renderer.setSize( idealwidth, idealHeight );
  // effect.setSize( window.innerWidth, window.innerHeight );
}

function onMouseMove(e){
  app.vertLook = e.y/idealHeight;
  app.horzLook = e.x/idealwidth;

  mouse.x = 2 * (e.clientX / idealwidth) -1;
  mouse.y = 1 - 2 * (e.clientY / idealHeight);

  var raycaster = projector.pickingRay( mouse.clone(), level.get('scene').camera );
  window.intersects = raycaster.intersectObject(bird.get('threeBird'));

  document.body.style.cursor = 'crosshair';
}

function onMouseDown(e){
  e.preventDefault();
  var audio;
  if(player.clipEmpty()){
    audio = document.getElementById('empty');
    audio.load();
    audio.play();
    return
  }
  document.body.style.cursor = 'crosshair';
  flash();
  player.shoot();
  if(player.clipEmpty()){
    setTimeout(function(){player.reload()}, 2500);
  }
  if ( intersects.length > 0 ) {
    levelCounter++;
    duckIndex--;
    grayDuck(duckIndex);
    player.incrementScoreBy(1);
    level.get('scene').remove(intersects[0].object);
    morphs.pop();
    setTimeout(function(){CreateBirdModel()},500);
  }
}

function generateScoreBoard(){
  window.app.Shots = window.document.getElementById('shotsleft');
  app.Shots.innerHTML = player.get('bullets');
  window.app.Score = window.document.getElementById('score');
  app.Score.innerHTML = player.get('score');
  window.document.getElementById('playername').innerHTML = player.get('name');
  window.app.Level = window.document.getElementById('level');
  app.Level.innerHTML = level.get('number') ;
}

function updateScoreBoard(){
  app.Score.innerHTML = player.get('score');
  app.Shots.innerHTML = player.get('bullets');
  app.Level.innerHTML = level.number;
}

function generateDuckCounter(){
  duckIndex = level.get('numberBirds');
  var dcounter = document.getElementsByClassName('duckcounter')[0];
  dcounter.innerHTML = '';
  for(var i = 0; i < duckIndex; i++){
    dcounter.innerHTML += "<img src= 'images/gduck.jpg' class='duckIMG' />"
  }
}

function onMouseUp(e){
  e.preventDefault();
  document.body.style.cursor = 'crosshair';
}

// function updateLevel(){
//   if(levelCounter == levelstats[level][4]){ 
//     level++;
//     levelCounter = 0;
//     app.skyColor = Math.random() * 0xFFFFFF;
//     scene = new app.View.Scene();
//     generateGun();
//     generateDuckCounter();
//   }
// }

function checkIndex(){
  if(duckIndex == 0)
    if( (levelstats[level][4] - levelCounter) > 0 )
      findMissedBird();
}

function findMissedBird(){
  var ducks = document.getElementsByTagName('img');
  for(var i = 0 ; i >= levelstats[level][4] - 1; i++){
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

function render() {
  requestAnimationFrame(render);

  var delta = clock.getDelta();

  level.get('scene').camera.lookAt( level.get('scene').scene.position );
  // camera.rotateX((1 - app.vertLook) *Math.PI/2)
  if(newgun != undefined){
    newgun.lookAt( level.get('scene').scene.position );
    newgun.rotateY((((app.horzLook)*-2))* Math.PI/2);
    newgun.rotateZ((1 - app.vertLook) * (Math.PI - 2)/2);
    newgun.rotateY(0);
  }
  updateScoreBoard();
  skyPlane.position.x += 0.5
  if(skyPlane.position.x > 600)
    skyPlane.position.x = 0;
  checkIndex();
  // updateLevel();
  if(bird.get('threeBird') != undefined){
    birdPos = bird.get('position');
    if((birdPos.y > (window.idealHeight / 10)) || birdPos.x > (window.idealwidth / 5) || birdPos.x < -(window.idealwidth/5)) {
      level.get('scene').outOfView();
    }
    else{  
      bird.fly();
      bird.updateTarget();
    }
  }
  for ( var i = 0; i < morphs.length; i ++ ) {
    morph = morphs[ i ];
    morph.updateAnimation( 1000 * delta );
  }
  renderer.render( level.get('scene').scene, level.get('scene').camera );
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
