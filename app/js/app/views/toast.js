define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/toast.html',
	'bootstrap'
], function($, _, Backbone, toastTemplate){
	'use strict';
	var ToastView = Backbone.View.extend({
		tagName: "div",
		template: _.template(toastTemplate),
		events: {

		},
		initialize: function(){
			this.listenTo(Backbone, "showToast", this.showToast);
			this.timeout = null;
		},
		showToast: function(message){
			this.render(message);
		},
		render: function(message){
			if(this.timeout != null){
				clearTimeout(this.timeout);
			}
			this.$el.html(this.template({
				"message": message
			}));
			this.$el.fadeOut(0);
			this.$el.fadeIn(500);
			var current_object = this;
			this.timeout = setTimeout(function(){
				current_object.$el.fadeOut(500);
			}, 3000);
		}
	});

	return ToastView;
});