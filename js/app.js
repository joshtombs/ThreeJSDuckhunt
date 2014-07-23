window.app = window.app || {};

window.index = 0;
window.duckIndex = 0;

;(function(){
  init();
})()

function init() {
  window.info = new app.Views.PlayerInfo(function(){
    app.Utils.loadAllModels(function(){
      app.game = new app.Models.Game({

      });
      app.game.start();
    });
  });
  info.render();
  document.getElementById('namebox').focus();
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
