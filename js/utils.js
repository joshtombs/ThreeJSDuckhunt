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
      App.Utils.BirdGeometry = geometry;
    });
    loader.load( "models/hyperblaster.js", function( geometry ) {
      App.Utils.morphColorsToFaceColors( geometry );
      geometry.computeMorphNormals();
      App.Utils.GunGeometry = geometry;
    });
    loader.load("models/tree.js", function( geometry ) {
      App.Utils.TreeGeometry = geometry;
    });
    loader.load( "models/bush.js", function( geometry ) {
      App.Utils.BushGeometry = geometry;
    });
    setTimeout(function(){cb()},200);
  }      
})(app, THREE)
