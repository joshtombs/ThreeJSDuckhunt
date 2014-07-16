window.app = window.app || {};
;(function(App, THREE){
  App.Utils = App.Utils || {};
  App.Utils.idealWidth = window.innerWidth;
  App.Utils.idealHeight = App.Utils.idealWidth * (3/7);
  App.Utils.vertLook = 0.5;
  App.Utils.horzLook = 0.5;
  App.Utils.randomNum = function(min, max){
    var num = Math.random()*(max-min+1) + min;
    return num;
  };
  App.Utils.morphColorsToFaceColors = function(geometry){
    if ( geometry.morphColors && geometry.morphColors.length ){
      var colorMap = geometry.morphColors[ 0 ];
      for ( var i = 0; i < colorMap.colors.length; i ++ ) {
        geometry.faces[ i ].color = colorMap.colors[ i ];
      }
    }
  };
  App.Utils.loadAllModels = function(cb){
    App.Utils.AnimMorphs = App.Utils.AnimMorphs || [];
    var loader = new THREE.JSONLoader();
    loader.load( "models/stork.js", function( geometry ) {

      App.Utils.morphColorsToFaceColors( geometry );
      geometry.computeMorphNormals();

      var material = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0xC0C0C0, shininess: 5, morphTargets: true, morphNormals: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
      var threeBird = new THREE.MorphAnimMesh( geometry, material );

      threeBird.rotation.y = -1;
      threeBird.castShadow = true;
      threeBird.receiveShadow = true;

      App.Utils.AnimMorphs[0] = threeBird;
    });
    loader.load( "models/hyperblaster.js", function( geometry ) {
      App.Utils.morphColorsToFaceColors( geometry );
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
      App.Utils.AnimMorphs[1] = gun;      
    });
    loader.load("models/tree.js", function( geometry ) {
      var materialScene = new THREE.MeshBasicMaterial( { 
        color: 0x000000, 
        shading: THREE.FlatShading
      });
      treeMesh = new THREE.Mesh( geometry, materialScene );

      var sc = app.Utils.randomNum(40,80);
      treeMesh.scale.set( sc, sc, sc );
      treeMesh.matrixAutoUpdate = false;
      treeMesh.updateMatrix();
      App.Utils.AnimMorphs[2] = treeMesh;
    });
    loader.load( "models/bush.js", function( geometry ) {
      bushtexture = THREE.ImageUtils.loadTexture("images/bush.png");
      bushtexture.wrapS = THREE.RepeatWrapping;
      bushtexture.wrapT = THREE.RepeatWrapping;
      bushtexture.repeat.set(8,8);
  
      var materialScene = new THREE.MeshBasicMaterial( { 
        shading: THREE.FlatShading,
        // map: bushtexture,
        color: 0x006F00,
        opacity: 0.5
        // wireframe: true 
      });

      materialScene.transparent = true
      bushMesh = new THREE.Mesh( geometry, materialScene );

      var sc = 1;
      bushMesh.scale.set( sc, sc, sc );

      bushMesh.matrixAutoUpdate = false;
      bushMesh.updateMatrix();

      App.Utils.AnimMorphs[3] = bushMesh;
    });
    setTimeout(function(){cb()},200);
  }      
})(app, THREE)
