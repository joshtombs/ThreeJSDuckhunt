window.app = {};
window.app.player = {};
window.app.vertLook = 0.5;
window.app.horzLook = 0.5;
window.app.skyColor = 0x6E91FF;
window.app.player.score = 0;
window.app.player.name = 'Player Name';
window.app.player.shotsLeft = 6;
window.bird = {};
var mouse = new THREE.Vector3();
var projector = new THREE.Projector();
var camera, scene, renderer, mesh, levels = [];

// if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

init();
animate();

function init() {
  document.body.style.cursor = 'crosshair';
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.set( 0, 50, 205 );
  createScenery();
  generateScoreBoard();
  generateGun();
  generateBird();
  renderer = new THREE.WebGLRenderer();
  renderer.sortObjects = false;
  renderer.setClearColor( 0x7ec0ee );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  //
  window.addEventListener( 'resize', onWindowResize, false );
  window.document.addEventListener("mousemove", onMouseMove);
  window.document.addEventListener("mousedown", onMouseDown);
  window.document.addEventListener("mouseup", onMouseUp);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );

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
  scene.add(new THREE.HemisphereLight(app.skyColor, 0x00FF00, 5))
  var sunsphere = new THREE.Mesh( new THREE.SphereGeometry(100,100,100), new THREE.MeshLambertMaterial({color: 'yellow'}));
  sunsphere.position.z=-200;
  scene.add(sunsphere);
}

function DrawBushes(){
  var bush;
  for(var i = 0; i < 20; i++){
    bush = new THREE.Mesh(new THREE.BoxGeometry(20,8,10), new THREE.MeshLambertMaterial({color:0x002000}));
    bush.position.set((20*i -200),30,140);
    scene.add(bush);
  }
}

function DrawTrees(){
  var tree;
  var numTrees = randomNum(2,4);
  for(var i = 1; i < numTrees; i++){
    tree = new THREE.Mesh(new THREE.BoxGeometry(10,randomNum(30,90),10), new THREE.MeshLambertMaterial({color:0x0987143}));
    tree.position.set(randomNum(-100,100),30,10);
    scene.add(tree);
  }
 }

function generateScoreBoard(){
  window.app.Shots = window.document.getElementById('shotsleft');
  app.Shots.innerHTML = app.player.shotsLeft;
  window.app.Score = window.document.getElementById('score');
  app.Score.innerHTML = app.player.score;
  window.document.getElementById('playername').innerHTML = window.app.player.name;
}

function updateScoreBoard(){
  app.Score.innerHTML = app.player.score;
  app.Shots.innerHTML = app.player.shotsLeft;
}

function generateBird(){
  bird = new THREE.Mesh( new THREE.SphereGeometry(3,10,10), new THREE.MeshLambertMaterial({color:'red'}));
  bird.position.set(randomNum((-window.innerWidth/20),(window.innerWidth/20)), 25, 110);
  bird.velocity = {
    x: 0,
    y: 0.3
  }
  scene.add(bird);
}

function generateGun(){
  var gun = new THREE.Mesh( new THREE.BoxGeometry(20,5,5), new THREE.MeshLambertMaterial({color:'brown'}));
  gun.position.set(0,40,190);
  window.Gun = gun;
  scene.add(gun);
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

app.player.reload = function(){

  app.player.shotsLeft = 6;
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

  if(bird.position.y > (window.innerHeight / 10)) {
    outOfView(bird);
  }
  else {
    bird.position.x += bird.velocity.x;             
    bird.position.y += bird.velocity.y;
  }
}

function outOfView(bird){
  scene.remove(bird);
  generateBird();
}

function render() {

  var time = Date.now() / 6000;

  camera.lookAt( scene.position );
  // camera.rotateX((1 - app.vertLook) *Math.PI/2)
  Gun.lookAt( scene.position );
  Gun.rotateY((((app.horzLook)*-2))* Math.PI/2);
  Gun.rotateZ((1 - app.vertLook) * (Math.PI - 2)/2);
  Gun.rotateY(0);
  
  updateScoreBoard();
  flyBird();
  renderer.render( scene, camera );

}
