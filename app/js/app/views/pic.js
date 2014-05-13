define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/pic.html',
    'collections/tagset',    
    'common',
    'models/undomanager'
], function($, _, Backbone, picTemplate, TagSet, Common, UndoManager) {
    /**
     * The View object for a Picture in the grid.
     * The view object is a div
     */
    var PicView = Backbone.View.extend({
        tagName: "li",
        
        template: _.template(picTemplate),
        
        events: {
            "mousedown  .thumb" : "mouseDown",
            "mouseup  .thumb" : "mouseUp",
            "mousemove  .thumb" : "mouseMove",
            "dblclick  .thumb" : "doubleClick",
            "click .favorite" : "favorite",
            "click .unfavorite" : "unfavorite",
        },
        
        initialize: function() {
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'change', this.render);
            
            this.listenTo(this.model, 'change:selected', this.updateSelectionClass);
            
            this.model.set({selected: false});
            
            this.partialClick = false;
            this.inDoubleClickPeriod = false;
        },
        
        render: function() {
            this.$el.addClass("pic");
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('selected', this.model.get("selected"));
                             
            this.updateVisibility();
                       
            this.trigger("visibilityChanged");
            return this;
        },
        
        toggleSelection: function() {
            if (this.model.get("selected")) {
                this.model.deselect();
            } else {
                this.model.select();
            }
        },
        
        updateVisibility: function() {
            var visible = Common.picVisible(this.model);
            if (visible) {
                this.$el.toggleClass('hide', false);
            } else {
                this.$el.toggleClass('hide', true);
            }
        },
        
        updateSelectionClass: function() {
            this.$el.toggleClass('selected', this.model.get("selected"));            
        },

        favorite: function() {
            var undo_function = function(){
                this.unfavorite();
                Backbone.trigger("imagesUnfavorited");
            };
            var redo_function = function(){
                this.favorite();
                Backbone.trigger("imagesFavorited");
            };
            UndoManager.register(this.model, undo_function, null, "Undo Favorite", this.model, redo_function, null, "Redo Favorite");
            this.model.favorite();
            Backbone.trigger("imagesFavorited");
        },

        unfavorite: function() {
            var undo_function = function(){
                this.favorite();
                Backbone.trigger("imagesFavorited");
            };
            var redo_function = function(){
                this.unfavorite();
                Backbone.trigger("imagesUnfavorited");
            };
            UndoManager.register(this.model, undo_function, null, "Undo Unfavorite", this.model, redo_function, null, "Redo Unfavorite");
            this.model.unfavorite();
            Backbone.trigger("imagesUnfavorited");
        },
        
        doubleClick: function() {
            Common.deselectAll();            
            Backbone.trigger("previewPics", [this.model]);
        },
        
        mouseDown: function() {
            this.partialClick = true;
        },
        
        mouseMove: function() {
            this.partialClick = false;
        },
        
        mouseUp: function() {
            if (this.partialClick) {
                this.toggleSelection();
            }
            if (this.inDoubleClickPeriod) {
                this.doubleClick();
                this.inDoubleClickPeriod = false;
            } else {
                this.inDoubleClickPeriod = true;
                var self = this;
                setTimeout(function () {self.inDoubleClickPeriod = false;}, 500);
            }
        },
        getTagNames: function(){
            var tagNames = [];
            var model = this.model;
            _.each(TagSet.toJSON(), function(value, key, list){
                if (_.contains(model.toJSON().tagList, value.tagId)) {
                    tagNames.push(value.name);
                }
            });
            return tagNames;
        }
    });
    return PicView;
});