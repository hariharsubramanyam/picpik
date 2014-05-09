define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/actionbar.html',
    'common',
    'models/undomanager'
], function($, _, Backbone, actionBarTemplate, 
            Common, UndoManager) {
    'use strict';
    /**
     * The View object for a Picture in the grid.
     * The view object is a div
     */
    var ActionBarView = Backbone.View.extend({
        tagName: "div",

        template: _.template(actionBarTemplate),

        undelete_mode: false,
        
        events: {
            "click  .deselectButton" : "deselectAll",
            "click  #previewButton" : "previewClicked",
            "click  #deleteButton" : "deleteClicked",
            "click  #groupButton" : "groupClicked",
            "click  #tagButton" : "tagClicked",
            "click  #starButton" : "starClicked",
            "click  #undeleteButton": "undeleteClicked"
        },
        
        initialize: function() {
            this.listenTo(Common, "selectionChange", this.render);
            this.listenTo(Backbone, "filterToDeleted", function(){
                this.undelete_mode = true;
            });
            this.listenTo(Backbone, "notFilteredToDeleted", function(){
                this.undelete_mode = false;
            });
        },
        
        render: function() {
            var numPicsSelected = Common.numPicsSelected();
            this.$el.html(this.template({num_selected: numPicsSelected, "undelete_mode": this.undelete_mode}));
            if (numPicsSelected === 0) {
                this.$el.hide();
            } else {
                this.$el.show();
            }            
            return this;
        },
        
        deselectAll: function() {
            Common.deselectAll();
            this.render();
        },
                
        previewClicked: function() {
            Backbone.trigger("previewPics", Common.selectedPics);
            this.deselectAll();
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
            this.deselectAll();
        },

        undeleteClicked: function(){
            var redo_function = function(){
                _.each(this, function(pic){
                    pic.markNotDeleted();
                });
                Backbone.trigger("imagesUndeleted");
            };
            var undo_function = function(){
                _.each(this, function(pic){
                    pic.markDeleted();
                });
                Backbone.trigger("imagesDeleted"); 
            };

            UndoManager.register(Common.selectedPics, undo_function, null, "Undo Undelete", Common.selectedPics, redo_function, null, "Redo Unelete");
            _.each(Common.selectedPics, function(pic){pic.markNotDeleted();});
            Backbone.trigger("imagesUndeleted");
            this.deselectAll();
        },
        
        groupClicked: function() {
            Backbone.trigger("groupPics", Common.selectedPics);
            this.deselectAll();
        },
        
        tagClicked: function() {
            Backbone.trigger("tagPics", Common.selectedPics);
            this.deselectAll();
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
            this.deselectAll();
        },
    });
    return ActionBarView;
});