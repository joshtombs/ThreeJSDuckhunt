window.app = window.app || {};
;(function(App, Backbone){
  app.Views = app.Views || {};
  app.Views.Inbetween = Backbone.View.extend({
    el: '.inbetween',
    template: JST['inbetween'],
    events:{
      'click input.start-level': 'close'
    },
    render: function(){
      this.$el.html(this.template(this.model.attributes));
      return this.el;
    },
    close: function(){
      this.$el.children()[0].style.display = 'none';
      this.model.set('level', this.model.get('levels').pop());
      this.model.get('level').start();
      this.model.resume()
    }
  })
})(app, Backbone)
