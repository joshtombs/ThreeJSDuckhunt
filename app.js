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
var camera, scene, renderer, mesh, levels = [];
var morph, morphs = [];
var clock = new THREE.Clock();
var player = new app.Models.Player();

init();
render();

function CreateBirdModel(){
  window.bird = new app.Models.Bird({
    position: {
      x: app.randomNum((-idealwidth/20),(idealwidth/20)),
      y: 25,
      z: app.randomNum(50,110)
    }
  });
  bird.generateBird(function(bird){
    scene.add(bird);
    morphs.push(bird);
  });
  index = 0;
}

function CreateGunModel(){
  var loader = new THREE.JSONLoader();
  loader.load( "models/hyperblaster.js", function( geometry ) {

    morphColorsToFaceColors( geometry );
    geometry.computeMorphNormals();

    var material = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0xffffff, shininess: 20, morphTargets: true, morphNormals: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
    window.newgun = new THREE.MorphAnimMesh( geometry, material );

    newgun.duration = 1000;

    var s = 0.75;
    newgun.scale.set( s, s, s );
    newgun.position.set(11,30,200);

    newgun.rotation.y = -5;
    newgun.rotation.x = 6;
    newgun.rotation.z = 5;

    newgun.castShadow = true;
    newgun.receiveShadow = true;

    scene.add( newgun );
    // morphs.push( newgun );

  } );
}

function CreateTreeModel(){
  var loader = new THREE.JSONLoader();
  loader.load( "models/tree.js", function( geometry ) {
    var materialScene = new THREE.MeshBasicMaterial( { color: 0x000000, shading: THREE.FlatShading } );
    treeMesh = new THREE.Mesh( geometry, materialScene );
    treeMesh.position.set(app.randomNum(-100,100),10,app.randomNum(0,80));

    var sc = app.randomNum(40,80);
    treeMesh.scale.set( sc, sc, sc );

    treeMesh.matrixAutoUpdate = false;
    treeMesh.updateMatrix();

    scene.add( treeMesh );

  } );
}

function init() {
  document.body.style.cursor = 'crosshair';
  camera = new THREE.PerspectiveCamera( 60, idealwidth / idealHeight, 1, 1000 );
  camera.position.set( 0, 50, 205 );
  createScenery();
  generateScoreBoard();
  generateDuckCounter();
  generateGun();
  CreateBirdModel();
  CreateTreeModel();
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

function onWindowResize() {
  camera.aspect = idealwidth / idealHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( idealwidth, idealHeight );
  // effect.setSize( window.innerWidth, window.innerHeight );
}

function createScenery(){
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0xEBEBEB, 0, 900);
  skytexture = THREE.ImageUtils.loadTexture("images/cloud.jpg");
  skytexture.wrapS = THREE.RepeatWrapping;
  skytexture.wrapT = THREE.RepeatWrapping;
  skytexture.repeat.set(0.7,0.3);
  skyPlane = new THREE.Mesh( new THREE.PlaneGeometry(4 * idealwidth, idealHeight), new THREE.MeshBasicMaterial({color: app.skyColor, map: skytexture}));
  skyPlane.position.z -= 150;
  window.sky = skyPlane;
  scene.add(skyPlane);
  DrawGrass();
  DrawSun();
  DrawBushes();
  DrawTrees();
}

function DrawGrass(){
    var grasstexture = THREE.ImageUtils.loadTexture("images/grass.jpg");
    grasstexture.wrapS = THREE.RepeatWrapping;
    grasstexture.wrapT = THREE.RepeatWrapping;
    grasstexture.repeat.set(4,4);
    var newplane = new THREE.Mesh( new THREE.PlaneGeometry(idealwidth,255), new THREE.MeshLambertMaterial({color: 0x003300, map:grasstexture}));
    
    newplane.position.z +=30;
    newplane.rotation.x = - Math.PI / 2;
    scene.add(newplane);
}

function DrawSun(){
  // scene.add(new THREE.HemisphereLight(app.skyColor, 0x00FF00, 5))
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

  scene.add( dirLight );

  suntexture = THREE.ImageUtils.loadTexture("images/sun.jpg");
  suntexture.wrapS = THREE.RepeatWrapping;
  suntexture.wrapT = THREE.RepeatWrapping;
  suntexture.repeat.set(3,3);

  var sunsphere = new THREE.Mesh( new THREE.SphereGeometry(100,100,100), new THREE.MeshLambertMaterial({color: 'yellow'}));
  sunsphere.position.z=-200;
  scene.add(sunsphere);
}

function DrawBushes(){
  var bush;
  bushtexture = THREE.ImageUtils.loadTexture("images/bush.png");
  bushtexture.wrapS = THREE.RepeatWrapping;
  bushtexture.wrapT = THREE.RepeatWrapping;
  bushtexture.repeat.set(8,8);
  for(var i = 0; i < 20; i++){
    bush = new THREE.Mesh(new THREE.BoxGeometry(20,8,10), new THREE.MeshLambertMaterial({color:0x004000, map:bushtexture}));
    bush.position.set((20*i -200),30,140);
    scene.add(bush);
  }
}

function DrawTrees(){
  var numTrees = app.randomNum(2,4);
  for(var i = 1; i < numTrees; i++){
    CreateTreeModel();
  }
 }

function generateScoreBoard(){
  window.app.Shots = window.document.getElementById('shotsleft');
  app.Shots.innerHTML = player.get('bullets');
  window.app.Score = window.document.getElementById('score');
  app.Score.innerHTML = player.get('score');
  window.document.getElementById('playername').innerHTML = player.get('name');
  window.app.Level = window.document.getElementById('level');
  app.Level.innerHTML = window.level + 1;
}

function updateScoreBoard(){
  app.Score.innerHTML = player.get('score');
  app.Shots.innerHTML = player.get('bullets');
  app.Level.innerHTML = window.level + 1;
}

function generateDuckCounter(){
  duckIndex = levelstats[level][4];
  var dcounter = document.getElementsByClassName('duckcounter')[0];
  dcounter.innerHTML = '';
  for(var i = 0; i < duckIndex; i++){
    dcounter.innerHTML += "<img src= 'images/gduck.jpg' class='duckIMG' />"
  }
}

function generateGun(){
  CreateGunModel();
}

function onMouseMove(e){
  app.vertLook = e.y/idealHeight;
  app.horzLook = e.x/idealwidth;

  mouse.x = 2 * (e.clientX / idealwidth) -1;
  mouse.y = 1 - 2 * (e.clientY / idealHeight);

  var raycaster = projector.pickingRay( mouse.clone(), camera );
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
    scene.remove(intersects[0].object);
    morphs.pop();
    setTimeout(function(){CreateBirdModel()},500);
  }
}

function onMouseUp(e){
  e.preventDefault();
  document.body.style.cursor = 'crosshair';
}

function flash(){
  var flash = new THREE.AmbientLight(0xFFFFFF,10);
  scene.add(flash);
  setTimeout(function(){scene.remove(flash)},70);
}

// function isNearTarget() {
//   if (bird.get('threeBird') == void 0) {
//     return 
//   }

//   var p       = bird.get("path")[index];
//   var birdPos = bird.get('threeBird').position;

//   return (Math.abs(p.x - birdPos.x) < 4) && (Math.abs(p.y - birdPos.y)) < 1
// }

function outOfView(){
  scene.remove(bird.get('threeBird'));
  morphs.pop();
  CreateBirdModel();
  duckIndex--;
}

function updateLevel(){
  if(levelCounter == levelstats[level][4]){ 
    level++;
    levelCounter = 0;
    app.skyColor = Math.random() * 0xFFFFFF;
    createScenery();
    generateGun();
    generateDuckCounter();
  }
}

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

  camera.lookAt( scene.position );
  // camera.rotateX((1 - app.vertLook) *Math.PI/2)
  if(newgun != undefined){
    newgun.lookAt( scene.position );
    newgun.rotateY((((app.horzLook)*-2))* Math.PI/2);
    newgun.rotateZ((1 - app.vertLook) * (Math.PI - 2)/2);
    newgun.rotateY(0);
  }
  updateScoreBoard();
  skyPlane.position.x += 0.5
  if(skyPlane.position.x > 600)
    skyPlane.position.x = 0;
  checkIndex();
  updateLevel();
  if(bird.get('threeBird') != undefined){
    bird.fly();
    bird.updateTarget();
  }

  for ( var i = 0; i < morphs.length; i ++ ) {
    morph = morphs[ i ];
    morph.updateAnimation( 1000 * delta );
  }

  renderer.render( scene, camera );
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

