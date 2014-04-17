define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/pic.html',
    'collections/tagset',    
    'common'
], function($, _, Backbone, picTemplate, TagSet, Common) {
    /**
     * The View object for a Picture in the grid.
     * The view object is a div
     */
    var PicView = Backbone.View.extend({
        tagName: "div",
        
        template: _.template(picTemplate),
        
        events: {
            "dragstart  .thumb" : "mouseDown",
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
            
            this.selected = false;
            
            this.partialClick = false;
        },
        
        render: function() {
            this.$el.addClass("pic");
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('selected', this.model.selected);
                            
            var before = this.$el.hasClass('visible');          
            this.updateVisibility();
            var after = this.$el.hasClass('visible');
                       
            this.trigger("visibilityChanged");
            return this;
        },
        
        toggleSelection: function() {
            if (this.model.selected) {
                this.model.deselect();
            } else {
                this.model.select();
            }
        },
        
        updateVisibility: function() {
            var visible = Common.picVisible(this.model);
            if (visible) {
                this.$el.toggleClass('visible', true);
            } else {
                this.$el.toggleClass('visible', false);
            }
        },
        
        updateSelectionClass: function() {
            this.$el.toggleClass('selected', this.model.selected);            
        },

        favorite: function() {
            this.model.favorite();
        },

        unfavorite: function() {
            this.model.unfavorite();
        },
        
        doubleClick: function() {
            Common.deselectAll();            
            Backbone.trigger("previewPics", [this.model]);
        },
        
        mouseDown: function() {
            console.log("mousedown");
            this.partialClick = true;
        },
        
        mouseMove: function() {
            this.partialClick = false;
        },
        
        mouseUp: function() {
            console.log(this.partialClick);
            this.toggleSelection();
        },
    });
    return PicView;
});