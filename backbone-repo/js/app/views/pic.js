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
            "click  .favorite" : "toggleFavorited",
            "click  .delete" : "toggleDeleted",
            "click  .destroy" : "destroy",
            "click  .add_tag" : "addTag",
            "click  .remove_tag" : "removeTag",
            
        },
        
        initialize: function() {
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(TagSet, 'add', this.renderTagChoices);
            this.listenTo(TagSet, 'change', this.renderTagChoices);
            this.listenTo(TagSet, 'reset', this.renderTagChoices);
            this.listenTo(TagSet, 'remove', this.renderTagChoices);
            
            //this.listenTo(this.model, 'change', this.render);
            //this.listenTo(this.model, 'visible', this.toggleVisible);
            this.selected = false;
        },
        
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('favorited', this.model.get('favorited'));
            this.renderTagChoices();
            return this;
        },
        
        renderTagChoices: function() {
            this.$(".tag_choice").html("");
            TagSet.each(function(tag) {     
                var info = tag.toJSON();
                var hasTag = this.model.hasTag(tag);
                if (hasTag) {
                    info['has_tag'] = "X ";
                } else {
                    info['has_tag'] = "";
                }
                this.$(".tag_choice").append(
                    _.template(" <option value='<%= tagId %>'><%= has_tag %><%= name %></option>")
                    (info));
            }, this);
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
        
        addTag: function() {
            var tagId = parseInt(this.$(".tag_choice").val());
            var tag = TagSet.findWhere({tagId: tagId});
            this.model.addTag(tag);
        },
        
        removeTag: function() {
            var tagId = parseInt(this.$(".tag_choice").val());
            var tag = TagSet.findWhere({tagId: tagId});
            this.model.removeTag(tag);
        }
    });
    return PicView;
});