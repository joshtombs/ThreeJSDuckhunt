window.app = window.app || {};
;(function(App, Backbone){
  App.Views = App.Views || {};
  App.Views.birdDisplay = Backbone.View.extend({
    el: '.bird-display',
    template: _.template(document.querySelector('#birdDisplay-template').innerText),
    initialize: function(){
      this.listenTo( this.model, "change", this.render);
    },
    render: function(){
      this.$el.html(this.template());
      shot = this.model.get('birdsShot');
      for(var i = 0; i < shot; i++){
        this.$el.children().append("<img src='images/duck.jpg' class='duckIMG' />"); 
      }
      for(var j = shot; j < this.model.get('numberBirds'); j++){
        this.$el.children().append("<img src='images/gduck.jpg' class='duckIMG' />"); 
      }
      return this.el;
    }
  });
})(app, Backbone)
