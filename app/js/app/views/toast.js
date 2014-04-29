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
			console.log("Listening");
		},
		showToast: function(message, timeout){
			this.render(message, timeout);
		},
		render: function(message, timeout){
			console.log(timeout);
			this.$el.html(this.template({
				"message": message
			}));
			this.$el.fadeOut(0);
			this.$el.fadeIn(400);
			var current_object = this;
			setTimeout(function(){
				current_object.$el.fadeOut(400);
			}, timeout);
		}
	});

	return ToastView;
});