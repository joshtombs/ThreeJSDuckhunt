window.app = window.app || {}
;(function(App, Backbone){
  App.Models = App.Models || {};
  App.Models.Player = Backbone.Model.extend({
    defaults:{
      'name':'Player Name',
      'score':0,
      'bullets':6
    },
    reload: function(){
      var audio;
      audio = document.getElementById('reload');
      audio.load();
      audio.play();
      this.set('bullets', 6); 
    },
    shoot: function(){
      var audio;
      audio = document.getElementById('fired');
      audio.load();
      audio.play();
      this.set('bullets', Math.max((this.get('bullets')-1), 0));
    },
    clipEmpty: function(){ 
      return !Boolean(this.get('bullets'))
    },
    incrementScoreBy: function(num){
      this.set('score', this.get('score') + num)
    }
  })
})(window.app, Backbone)
