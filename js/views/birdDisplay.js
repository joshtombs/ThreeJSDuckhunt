window.app = window.app || {};
;(function(App, Backbone){
  App.Views = App.Views || {};
  App.Views.birdDisplay = new Backbone.View.extend({
    el: 'bird-display',
    template: _.template(document.querySelector('#birdDisplay-template').innerText),
    initialize: function(){
      this.listenTo( this.model, "change:birdsShot", this.render);
    },
    render: function(){
      for(var i = 0; i < this.model.get('numberBirds'); i++){
        this.template.append("<img src='images/gduck.jpg' class='duckIMG' />")
      }
      this.$el.html(this.template());
      return this.el;
    }
  })
})(app, Backbone)
