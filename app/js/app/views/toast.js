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
			var current_object = this;
			this.listenTo(Backbone, "imagesDeleted", function(){current_object.showToast("Deleted")});
			this.listenTo(Backbone, "imagesUndeleted", function(){current_object.showToast("Undeleted")});
			this.listenTo(Backbone, "imagesFavorited", function(){current_object.showToast("Favorited")});
			this.listenTo(Backbone, "imagesUnfavorited", function(){current_object.showToast("Unfavorited")});
			this.listenTo(Backbone, "imagesTagged", function(){current_object.showToast("Tagged")});
			this.listenTo(Backbone, "imagesUntagged", function(){current_object.showToast("Untagged")});
			this.listenTo(Backbone, "showToast", function(message){current_object.showToast(message)});
			// this.listenTo(Backbone, "didUndo", function(message){current_object.showToast(message)});
			// this.listenTo(Backbone, "didRedo", function(message){current_object.showToast(message)});
			// this.listenTo(Backbone, "selectedPics", function(message){current_object.showToast(message)});
			
			this.timeout = null;
		},
		showToast: function(message){
			this.render(message);
		},
		render: function(message){
			this.$el.html("");
			this.$el.fadeOut(0);
			if(this.timeout != null){
				clearTimeout(this.timeout);
			}
			this.$el.html(this.template({
				"message": message
			}));
			this.$el.fadeIn(500);
			var current_object = this;
			this.timeout = setTimeout(function(){
				current_object.$el.fadeOut(500);
			}, 5000);
		}
	});

	return ToastView;
});