define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/group.html',
    'common'
], function($, _, Backbone, groupTemplate, Common) {
    /**
     * The View object for a Group in the grid.
     * The view object is a div
     */
    var GroupView = Backbone.View.extend({
        tagName: "div",
        
        template: _.template(groupTemplate),
        
        events: {
            "blur .group_name":  "closeName",
            "click .remove_group_button":  "removeGroup",            
        },
        
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('favorited', this.model.get('favorited'));
            this.toggleVisible();
            
			this.$input = this.$('.group_name');            
            return this;
        },
            
        removeGroup: function() {
            this.model.destroy();
        },
        
        toggleFavorited: function() {
            this.model.toggleFavorited();
        },
        
        toggleDeleted: function() {
            this.$el.fadeOut(400, (function() {
                this.model.toggleDeleted();
            }).bind(this));
        },
        
        toggleVisible: function() {
            if (this.isHidden()) {
                this.$el.hide();
            } else {
                this.$el.show();
            }
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
        closeName: function() {
            var value = this.$input.html();
            console.log(value);
            this.model.save({name: value});
            //this.model.trigger("change");
        }
        
    });
    return GroupView;
});