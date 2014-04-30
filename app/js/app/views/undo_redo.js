define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/undo_redo.html',
	'common',
	'models/undomanager',
	'bootstrap'
], function($, _, Backbone, undoRedoTemplate, Common, UndoManager){
	'use strict';
	var UndoRedoView = Backbone.View.extend({
		template: _.template(undoRedoTemplate),
		events: {
			'click .undo-btn': 'undo',
			'click .redo-btn': 'redo'
		},
		initialize: function(){
			this.listenTo(Backbone, "imagesDeleted", this.render);
			this.listenTo(Backbone, "imagesUndeleted", this.render);
			this.listenTo(Backbone, "imagesUnfavorited", this.render);
			this.listenTo(Backbone, "imagesFavorited", this.render);
			this.listenTo(Backbone, "imagesTagged", this.render);
			this.listenTo(Backbone, "imagesUntagged", this.render);
		},
		render: function(){
			var undo_message = UndoManager.peekUndoMessage();
			var redo_message = UndoManager.peekRedoMessage();
			this.$el.html(this.template({
				"redo_message":redo_message,
				"undo_message":undo_message
			}));
			return this;
		},
		undo: function(){
			if(UndoManager.hasUndo()){
				var message = UndoManager.peekUndoMessage();
				UndoManager.undo();
				this.render();
				Backbone.trigger("didUndo", message);
			}
		},
		redo: function(){
			if(UndoManager.hasRedo()){
				var message = UndoManager.peekRedoMessage();
				UndoManager.redo();
				this.render();
				Backbone.trigger("didRedo", message);
			}
		}
	});

	return UndoRedoView;
});