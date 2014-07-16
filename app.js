window.app = window.app || {};

window.index = 0;
window.duckIndex = 0;

;(function(){
  init();
})()

function init() {
  app.Utils.loadAllModels(function(){
    app.game = new app.Models.Game({

    });
  });
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
