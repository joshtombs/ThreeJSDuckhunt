window.app = window.app || {};
;(function(App, Backbone){
  app.Views = app.Views || {};
  app.Views.Inbetween = Backbone.View.extend({
    template: JST['inbetween'],
    events:{
      'click input.start-level': 'close'
    },
    initialize: function(options){
      this.callback = options.cb;
    },
    render: function(){
      this.$el.html(this.template(this.model.attributes));
      return this;
    },
    close: function(){
      this.$el.children()[0].style.display = 'none';
      this.callback();
    }
  })
})(app, Backbone)
