define([
    'jquery',
    'underscore',
    'backbone',
    'collections/tagset',
    'text!templates/tagoverlay.html',
    'common',
    'bootstrap'
], function($, _, Backbone, TagSet, tagOverlayTemplate, Common) {
    /**
     */
    var TagOverlayView = Backbone.View.extend({
        tagName: "div",
        
        template: _.template(tagOverlayTemplate),
        
        events: {
            "click .close": "close",
            "click .add_tag": "addTag",
            "click .remove_tag": "removeTag",
        },
        
        initialize: function() {
            this.active = false;
            this.pics = [];
            this.listenTo(Backbone, "tagPics", this.tagPics);
            this.listenTo(TagSet, 'all', this.renderTagChoices);            
        },
        
        render: function() {
            this.$el.html(this.template());
            if (this.active && this.pics.length > 0) {
                this.renderTagChoices();
                $("#tagModal").modal("show");
            }
            return this;
        },

        renderTagChoices: function() {
            this.$(".tag_choice").html("");
            TagSet.each(function(tag) {
                var info = tag.toJSON();
                this.$(".tag_choice").append(
                    _.template(" <option value='<%= tagId %>'><%= name %></option>")
                    (info));
            }, this);
        },
        
        tagPics: function(pics) {
            this.active = true;
            this.pics = pics;
            this.render();
        },
        
        close: function() {
            this.active = false;
            this.$el.hide();
        },
        
        addTag: function() {
            console.log("Tagging pics");
            var tagId = parseInt(this.$(".tag_choice").val());
            var tag = TagSet.findWhere({tagId: tagId});
            _.each(this.pics, function(pic) { pic.addTag(tag) });
        },
        
        removeTag: function() {
            var tagId = parseInt(this.$(".tag_choice").val());
            var tag = TagSet.findWhere({tagId: tagId});
            _.each(this.pics, function(pic) { pic.removeTag(tag) });
        },
    
    });
    return TagOverlayView;
});