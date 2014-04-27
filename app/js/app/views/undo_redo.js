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
		},
		render: function(){
			var undo_message = UndoManager.peekUndoMessage();
			var redo_message = UndoManager.peekRedoMessage();
			console.log(undo_message + " " + redo_message);
			this.$el.html(this.template({
				"redo_message":redo_message,
				"undo_message":undo_message
			}));
			return this;
		},
		undo: function(){
			if(UndoManager.hasUndo()){
				UndoManager.undo();
				this.render();
			}
		},
		redo: function(){
			if(UndoManager.hasRedo()){
				UndoManager.redo();
				this.render();
			}
		}
	});

	return UndoRedoView;
});