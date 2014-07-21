window.app = window.app || {};
;(function(App, Backbone){
  app.Views = app.Views || {};
  app.Views.Inbetween = Backbone.View.extend({
    el: '.inbetween',
    template: _.template(document.querySelector('#inbetween-template').innerText),
    initialize: function(){
      console.log('doggeeeeeeė')
    }
  })
})(app, Backbone)
