window.app = window.app || {};

window.index = 0;
window.duckIndex = 0;

;(function(){
  init();
})()

function init() {
  Parse.initialize("eD4Z64yLtYzP7l5da4wj4e1cO9DPFBl8pIMtH5vv", "vU5u314ShnEjpoAJao0TI7RP9RLkN4H7fJ71EvyU");
  app.Utils.HighScore = Parse.Object.extend("HighScore");
  
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
