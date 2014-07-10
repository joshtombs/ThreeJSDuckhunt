window.app = {};
window.app.player = {};
window.app.vertLook = 0.5;
window.app.horzLook = 0.5;
window.app.skyColor = 0x6E91FF;
window.app.player.score = 0;
window.app.player.name = 'Player Name';
window.app.player.shotsLeft = 6;
window.bird = {};
window.Gun = {};
window.target = [];
window.index = 0;
window.levelstats = [[0.1,0.1,0,30,3],[0.1,0.1,0,50,4],[0.2,0.2,0.2,40,5],[0.3,0.3,0.2,50,6],[0.3,0.3,0.3,60,6],[0.4,0.4,0.3,60,6]];
window.level = 0;
window.levelCounter = 0;
window.duckIndex = 0;
var mouse = new THREE.Vector3();
var projector = new THREE.Projector();
var camera, scene, renderer, mesh, levels = [];
var moph, morphs = [];
var clock = new THREE.Clock();
window.app.player.reload = function(){
  app.player.shotsLeft = 6;
};



window.bird.position = {};
window.bird.position = {x:0,y:0,z:0}
window.bird.velocity = {x:0,y:0,z:0}

// if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

init();
animate();


  // MODEL

function CreateBirdModel(){
  var loader = new THREE.JSONLoader();
  loader.load( "models/stork.js", function( geometry ) {

    morphColorsToFaceColors( geometry );
    geometry.computeMorphNormals();

    var material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 20, morphTargets: true, morphNormals: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
    window.bird = new THREE.MorphAnimMesh( geometry, material );

    bird.duration = 1000;

    var s = 0.15;
    bird.scale.set( s, s, s );
    bird.position.set(randomNum((-window.innerWidth/20),(window.innerWidth/20)), 25, randomNum(50,110));

    bird.rotation.y = -1;

    bird.castShadow = true;
    bird.receiveShadow = true;

    bird.velocity = {
      x: levelstats[level][0],
      y: levelstats[level][1],
      z: levelstats[level][2]
    }

    scene.add( bird );
    morphs.push( bird );

  } );
}

function CreateGunModel(){
  var loader = new THREE.JSONLoader();
  loader.load( "models/hyperblaster.js", function( geometry ) {

    morphColorsToFaceColors( geometry );
    geometry.computeMorphNormals();

    var material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 20, morphTargets: true, morphNormals: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
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
    treeMesh.position.set(randomNum(-100,100),10,randomNum(0,80));

    var sc = 50;
    treeMesh.scale.set( sc, sc, sc );

    treeMesh.matrixAutoUpdate = false;
    treeMesh.updateMatrix();

    scene.add( treeMesh );

  } );
}

function init() {
  document.body.style.cursor = 'crosshair';
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.set( 0, 50, 205 );
  createScenery();
  generateScoreBoard();
  generateDuckCounter();
  generateGun();
  generateBird();
  CreateTreeModel();
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.sortObjects = false;
  renderer.setClearColor( 0x7ec0ee );
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMapEnabled = true;
  renderer.shadowMapCullFace = THREE.CullFaceBack;
  renderer.setSize( window.innerWidth, window.innerHeight );
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
  effect.setSize( window.innerWidth, window.innerHeight );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
  // effect.setSize( window.innerWidth, window.innerHeight );
}

function createScenery(){
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0xEBEBEB, 0, 500);
  skyPlane = new THREE.Mesh( new THREE.PlaneGeometry(window.innerWidth, window.innerHeight), new THREE.MeshBasicMaterial({color: app.skyColor}));
  skyPlane.position.z -= 150;
  scene.add(skyPlane);
  DrawGrass();
  DrawSun();
  DrawBushes();
  DrawTrees();
}

function DrawGrass(){
    var newplane = new THREE.Mesh( new THREE.PlaneGeometry(window.innerWidth,255), new THREE.MeshLambertMaterial({color: 0x003300}));
    newplane.position.z +=30;
    newplane.rotation.x = - Math.PI / 2;
    scene.add(newplane);
}

function DrawSun(){
  // scene.add(new THREE.HemisphereLight(app.skyColor, 0x00FF00, 5))
  var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
  dirLight.color.setHSL( 0.1, 1, 0.95 );
  dirLight.position.set( -1, 1.75, 1 );
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

  var sunsphere = new THREE.Mesh( new THREE.SphereGeometry(100,100,100), new THREE.MeshLambertMaterial({color: 'yellow'}));
  sunsphere.position.z=-200;
  scene.add(sunsphere);
}

function DrawBushes(){
  var bush;
  for(var i = 0; i < 20; i++){
    bush = new THREE.Mesh(new THREE.BoxGeometry(20,8,10), new THREE.MeshLambertMaterial({color:0x006000}));
    bush.position.set((20*i -200),30,140);
    scene.add(bush);
  }
}

function DrawTrees(){
  // var tree;
  var numTrees = randomNum(2,4);
  for(var i = 1; i < numTrees; i++){
    CreateTreeModel();
    // tree = new THREE.Mesh(new THREE.BoxGeometry(10,randomNum(30,90),10), new THREE.MeshLambertMaterial({color:0x0987143}));
    // tree.position.set(randomNum(-100,100),30,randomNum(0,80));
    // scene.add(tree);
  }
 }

function generateScoreBoard(){
  window.app.Shots = window.document.getElementById('shotsleft');
  app.Shots.innerHTML = app.player.shotsLeft;
  window.app.Score = window.document.getElementById('score');
  app.Score.innerHTML = app.player.score;
  window.document.getElementById('playername').innerHTML = window.app.player.name;
  window.app.Level = window.document.getElementById('level');
  app.Level.innerHTML = window.level + 1;
}

function updateScoreBoard(){
  app.Score.innerHTML = app.player.score;
  app.Shots.innerHTML = app.player.shotsLeft;
  app.Level.innerHTML = window.level + 1;
}

function generateDuckCounter(){
  duckIndex = levelstats[level][4];
  var dcounter = document.getElementsByClassName('duckcounter')[0];
  dcounter.innerHTML = '';
  for(var i = 0; i < duckIndex; i++){
    dcounter.innerHTML += "<img src= 'images/duck.jpg' class='duckIMG' />"
  }
}

function generateBird(){
  // bird = new THREE.Mesh( new THREE.SphereGeometry(3,10,10), new THREE.MeshLambertMaterial({color:'red'}));
  CreateBirdModel();
  // bird.position.set(randomNum((-window.innerWidth/20),(window.innerWidth/20)), 25, randomNum(50,110));
  // bird.velocity = {
  //   x: levelstats[level][0],
  //   y: levelstats[level][1],
  //   z: levelstats[level][2]
  // }
  // scene.add(bird);
  index = 0;
  generatePath();
}

function generateGun(){
  CreateGunModel();
  // var gun = new THREE.Mesh( new THREE.BoxGeometry(20,5,5), new THREE.MeshLambertMaterial({color:0xAC7728}));
  // gun.position.set(0,40,190);
  // window.Gun = gun;
  // scene.add(gun);
}

function onMouseMove(e){
  app.vertLook = e.y/window.innerHeight;
  app.horzLook = e.x/window.innerWidth;

  mouse.x = 2 * (e.clientX / window.innerWidth) -1;
  mouse.y = 1 - 2 * (e.clientY / window.innerHeight);

  var raycaster = projector.pickingRay( mouse.clone(), camera );
  window.intersects = raycaster.intersectObject( bird );

  document.body.style.cursor = 'crosshair';
}

function onMouseDown(e){
  e.preventDefault();
  if(app.player.shotsLeft == 0)
    return
  document.body.style.cursor = 'crosshair';
  flash();
  app.player.shotsLeft--;
  if(app.player.shotsLeft == 0){
    setTimeout(function(){app.player.reload()}, 2500);
  }
  if ( intersects.length > 0 ) {
    levelCounter++;
    grayDuck(duckIndex);
    duckIndex--;
    app.player.score++;
    scene.remove(intersects[0].object);
    setTimeout(function(){generateBird()},500);
  }
}

function onMouseUp(e){
  e.preventDefault();
  document.body.style.cursor = 'crosshair';
}

function randomNum(min, max){
  var num = Math.random()*(max-min+1) + min;
  return num;
}

function flash(){
  var flash = new THREE.AmbientLight(0xFFFFFF,10);
  scene.add(flash);
  setTimeout(function(){scene.remove(flash)},70);
}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function flyBird(){
  bird.lookAt( new THREE.Vector3( target[index][0], target[index][1], target[index][2]) );
  if((bird.position.y > (window.innerHeight / 10)) || bird.position.x > (window.innerWidth / 10 || bird.position.x < (window.innerWidth/10))) {
    outOfView(bird);
  }
  else {
    if((bird.position.x < target[index][0] ) && (Math.abs(bird.position.x - target[index][0]) > 1))
      bird.position.x += bird.velocity.x;
    else if((bird.position.x > target[index][0])  && (Math.abs(bird.position.x - target[index][0]) > 1))
      bird.position.x -= bird.velocity.x;
    if((bird.position.y < target[index][1]) && (Math.abs(bird.position.x - target[index][1]) > .8))
      bird.position.y += bird.velocity.y;
    else if((bird.position.y > target[index][1]) && (Math.abs(bird.position.y - target[index][1]) > .8))
      bird.position.y -= bird.velocity.y;
    if((bird.position.z < target[index][3]) && (Math.abs(bird.position.z - target[index][3]) > 1))
      bird.position.z += bird.velocity.z;
    else if((bird.position.z > target[index][3])  && (Math.abs(bird.position.z - target[index][3]) > 1))
      bird.position.z -= bird.velocity.z;
  }
}

function isNearTarget(){
  if(((target[index][0] - bird.position.x) < 4)&&((target[index][1] - bird.position.y) < 1)){
    return true
  } 
  else 
    return false
}

function generatePath(){
  b = 25;
  var i = 0;
  while(b < (window.innerHeight/10 + 20 )){
    b += 5;
    target[i] = [];
    target[i][0] = randomNum(bird.position.x - levelstats[level][3], bird.position.x + levelstats[level][3]);
    target[i][1] = randomNum(b - 10, b + 10);
    target[i][2] = randomNum(60,120);
    i++;
  }
}

function outOfView(bird){
  scene.remove(bird);
  generateBird();
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
    if( !(b.indexOf('gduck.jpg') > -1) ){
      duckIndex = i;
    }
  }
}

function grayDuck(ind){
  var ducks = document.getElementsByTagName('img');
  var deadduck = ducks[ind - 1]
  deadduck.src = 'images/gduck.jpg';
}

function render() {
  var delta = clock.getDelta();

  camera.lookAt( scene.position );
  // camera.rotateX((1 - app.vertLook) *Math.PI/2)
  newgun.lookAt( scene.position );
  newgun.rotateY((((app.horzLook)*-2))* Math.PI/2);
  newgun.rotateZ((1 - app.vertLook) * (Math.PI - 2)/2);
  newgun.rotateY(0);
  updateScoreBoard();

  checkIndex();
  updateLevel();
  flyBird();
  if( isNearTarget() )
    index++;

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

