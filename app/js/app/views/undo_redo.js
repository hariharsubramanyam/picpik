define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/undo_redo.html',
	'common',
	'models/undomanager',
	'bootstrap'
], function($, _, Backbone, undoRedoTemplate, Common, UndoManager){
	var UndoRedoView = Backbone.View.extend({
		template: _.template(undoRedoTemplate),
		events: {
			'click .undo-btn': 'undo',
			'click .redo-btn': 'redo'
		},
		initialize: function(){
		},
		render: function(){
			this.$el.html(this.template());
			return this;
		},
		undo: function(){
			if(UndoManager.hasUndo()){
				UndoManager.undo();
			}
		},
		redo: function(){
			if(UndoManager.hasRedo()){
				UndoManager.redo();
			}
		}
	});

	return UndoRedoView;
});