define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/actionbar.html',
    'common',
    'models/undomanager'
], function($, _, Backbone, actionBarTemplate, 
            Common, UndoManager) {
    /**
     * The View object for a Picture in the grid.
     * The view object is a div
     */
    var ActionBarView = Backbone.View.extend({
        tagName: "div",

        template: _.template(actionBarTemplate),
        
        events: {
            "click  .deselectButton" : "deselectAll",
            "click  #previewButton" : "previewClicked",
            "click  #deleteButton" : "deleteClicked",
            "click  #groupButton" : "groupClicked",
            "click  #tagButton" : "tagClicked",
            "click  #starButton" : "starClicked",
        },
        
        initialize: function() {
            this.listenTo(Common, "selectionChange", this.render);
            
        },
        
        render: function() {
            var numPicsSelected = Common.numPicsSelected();
            this.$el.html(this.template({num_selected: numPicsSelected}));
            if (numPicsSelected === 0) {
                this.$el.hide();
            } else {
                this.$el.show();
            }            
            
            return this;
        },
        
        deselectAll: function() {
            Common.deselectAll();
        },
                
        previewClicked: function() {
            Backbone.trigger("previewPics", Common.selectedPics);
        },
        
        deleteClicked: function() {
            var undo_function = function(){
                _.each(this, function(pic){
                    pic.markNotDeleted();
                });
                Backbone.trigger("imagesUndeleted");
            };
            var redo_function = function(){
                _.each(this, function(pic){
                    pic.markDeleted();
                });
                Backbone.trigger("imagesDeleted"); 
            };

            UndoManager.register(Common.selectedPics, undo_function, null, "Undo Delete", Common.selectedPics, redo_function, null, "Redo Delete");
            _.each(Common.selectedPics, function(pic){pic.markDeleted();});
            Backbone.trigger("imagesDeleted");         
        },
        
        groupClicked: function() {
            Backbone.trigger("groupPics", Common.selectedPics);
        },
        
        tagClicked: function() {
            Backbone.trigger("tagPics", Common.selectedPics);
        },
        
        starClicked: function() {
            var allFavorited = _.every(Common.selectedPics, function(pic) {return pic.get('favorited');});
            if (allFavorited) {
                var redo_function = function(){
                    _.each(this, function(pic){pic.unfavorite();});
                    Backbone.trigger("imagesUnfavorited");
                };
                var undo_function = function(){
                    _.each(this, function(pic){pic.favorite();});
                    Backbone.trigger("imagesFavorited");
                };
                UndoManager.register(Common.selectedPics, undo_function, null, "Undo Unfavorite", Common.selectedPics, redo_function, null, "Redo Unfavorite");
                _.each(Common.selectedPics, function(pic) { pic.unfavorite();});
                Backbone.trigger("imagesUnfavorited");
            } else {
                var redo_function = function(){
                    _.each(this, function(pic){pic.favorite();});
                    Backbone.trigger("imagesFavorited");
                };
                var undo_function = function(){
                    _.each(this, function(pic){pic.unfavorite();});
                    Backbone.trigger("imagesUnfavorited");
                };
                UndoManager.register(Common.selectedPics, undo_function, null, "Undo Favorite", Common.selectedPics, redo_function, null, "Redo favorite");
                _.each(Common.selectedPics, function(pic) {pic.favorite();});
                Backbone.trigger("imagesFavorited");
            }
        },
    });
    return ActionBarView;
});