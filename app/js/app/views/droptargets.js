define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/droptargets.html',
	'collections/picset',
	'models/undomanager',
	'common',
	'bootstrap'
], function($, _, Backbone, dropTargetTemplate, PicSet, UndoManager, Common){
	'use strict';
	var DropTargetsView = Backbone.View.extend({
		tagName: "div",
		template: _.template(dropTargetTemplate),
		events: {
			'click .favorite-target': 'showFavorites',
			'click .delete-target': 'filterToDeleted'
		},
		showFavorites: function(){
			Backbone.trigger("filterToFavorited");
		},
		filterToDeleted: function(){
			Backbone.trigger("filterToDeleted");
		},
		initialize: function(){
			this.listenTo(Backbone, 'imagesDeleted', this.render);
			this.listenTo(Backbone, 'imagesUndeleted', this.render);
			this.listenTo(Backbone, 'imagesFavorited', this.render);
			this.listenTo(Backbone, 'imagesUnfavorited', this.render);
		},
		render: function(){
			var num_deleted = PicSet.where({deleted: true}).length;
			var num_favorited = PicSet.where({favorited: true}).length;
			this.$el.html(this.template({
				"num_deleted": num_deleted,
				"num_favorited": num_favorited
			}));
			$(".delete-target").droppable({
				accept: ".pic_grid .pic",
				activeClass: "active-target",
				hoverClass: 'hover-over-target',
				drop: function( event, ui ) {
                    ui.draggable.parent().addClass('dropped');
					var picId = $(ui.draggable[0]).find('img').attr('picId');
                    var deleteMe = PicSet.findWhere({picId: parseInt(picId)});
                    var undo_function = function(){
						this.markNotDeleted();
						Backbone.trigger("imagesUndeleted");
					};
					var redo_function = function(){
						this.markDeleted();
						Backbone.trigger("imagesDeleted"); 
					};
					UndoManager.register(deleteMe, undo_function, null, "Undo Delete", deleteMe, redo_function, null, "Redo Delete");
					deleteMe.markDeleted();
					Backbone.trigger("imagesDeleted");
				}
			});
			$(".favorite-target").droppable({
				accept: ".pic_grid .pic",
				activeClass: "active-target",
				hoverClass: 'hover-over-target',
                revert: "valid",
				drop: function( event, ui ) {
                    ui.draggable.parent().addClass('dropped');
					var picId = $(ui.draggable[0]).find('img').attr('picId');
                    var favoriteMe = PicSet.findWhere({picId: parseInt(picId)});
					var undo_function = function(){
						this.unfavorite();
						Backbone.trigger("imagesUnfavorited");
					};
					var redo_function = function(){
						this.favorite();
						Backbone.trigger("imagesFavorited"); 
					};
					UndoManager.register(favoriteMe, undo_function, null, "Undo Favorite", favoriteMe, redo_function, null, "Redo Favorite");
					favoriteMe.favorite();
					Backbone.trigger("imagesFavorited");
				}
			});
			return this;
		}
	});

	return DropTargetsView;
});