window.app = window.app || {};

window.index = 0;
window.duckIndex = 0;

;(function(){
  init();
})()

function init() {
  Parse.initialize("eD4Z64yLtYzP7l5da4wj4e1cO9DPFBl8pIMtH5vv", "vU5u314ShnEjpoAJao0TI7RP9RLkN4H7fJ71EvyU");
  app.Utils.HighScore = Parse.Object.extend("HighScore");
  var query = new Parse.Query(app.Utils.HighScore);
  query.descending("score");
  query.limit(5);
  query.find({
    success: function(results){
      $('.highscores').html('')
      results.forEach(function(score){
        var a = new app.Views.highScore({
          model: score
        });
        a.render()
      })
    },
    error: function(error){
      console.log('Error: '+ error)
    }
  })
  window.info = new app.Views.PlayerInfo(function(){
    app.Utils.loadAllModels(function(){
      app.game = new app.Models.Game({

      });
      app.game.start();
      $('.highscores').css('display', 'none')
    });
  });
  info.render();
  document.getElementById('namebox').focus();
  window.onbeforeunload = confirmExit;
  function confirmExit(){
    return "If you leave now your score will be lost!"
  }
}
