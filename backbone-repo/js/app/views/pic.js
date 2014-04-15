define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/pic.html',
    'common'
], function($, _, Backbone, picTemplate, Common) {
    /**
     * The View object for a Picture in the grid.
     * The view object is a div
     */
    var PicView = Backbone.View.extend({
        tagName: "div",
        
        template: _.template(picTemplate),
        
        events: {
            "click  .favorite" : "toggleFavorited",
            "click  .delete" : "toggleDeleted",
            "click  .destroy" : "destroy",
        },
        
        initialize: function() {
            //this.listenTo(this.model, 'change', this.render);
            //this.listenTo(this.model, 'destroy', this.remove);
            //this.listenTo(this.model, 'visible', this.toggleVisible);
        },
        
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('favorited', this.model.get('favorited'));
            return this;
        },
        
        toggleFavorited: function() {
            this.model.toggleFavorited();
        },
        
        toggleDeleted: function() {
            this.$el.fadeOut(400, (function() {
                this.model.toggleDeleted();
            }).bind(this));
        },
        
        destroy: function() {
            this.$el.fadeOut(400, (function() {
                this.model.destroy();
            }).bind(this));
        },
                
        isHidden: function() {
            var isDeleted = this.model.get('deleted');
            var isFavorited = this.model.get('favorited');
            return (
                (!isFavorited && Common.picFilter === "favorited") ||
                (isDeleted && Common.picFilter != "deleted") ||
                (!isDeleted && Common.picFilter === "deleted")
            );
        },
    });
    return PicView;
});