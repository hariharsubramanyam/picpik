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
        },
        
        initialize: function() {
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'change', this.render);
            
            this.listenTo(this.model, 'change:selected', this.updateSelectionClass);
            this.listenTo(Backbone, 'filterChanged', this.updateVisibility);
            
            this.selected = false;
            
            this.partialClick = false;
        },
        
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('selected', this.model.selected);
                                    
            this.updateVisibility();
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
            console.log("Update vis");
            var visible = Common.picVisible(this.model);
            if (visible) {
                this.$el.show();
            } else {
                this.$el.hide();
            }
        },
        
        updateSelectionClass: function() {
            this.$el.toggleClass('selected', this.model.selected);            
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
        }
    });
    return PicView;
});