define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/pictarget.html',
    'collections/tagset',    
    'common',
    'models/undomanager'
], function($, _, Backbone, picTargetTemplate, TagSet, Common, UndoManager) {
    /**
     * The View object for a Picture in the grid.
     * The view object is a div
     */
    var PicTargetView = Backbone.View.extend({
        tagName: "li",
        
        template: _.template(picTargetTemplate),
        
        events: {
            "mousedown  .thumb" : "mouseDown",
            "mouseup  .thumb" : "mouseUp",
            "mousemove  .thumb" : "mouseMove",
            "dblclick  .thumb" : "doubleClick",
            "click .favorite" : "favorite",
            "click .unfavorite" : "unfavorite",
        },
        
        initialize: function() {
            this.listenTo(this, 'destroy', this.remove);
            this.partialClick = false;
        },
        
        render: function() {
            this.$el.addClass("pic_target_hidden");                         
            return this;
        },
        
        updateVisibility: function() {
            // Pass;
        }
    });
    return PicTargetView;
});