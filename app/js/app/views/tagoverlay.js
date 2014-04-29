define([
    'jquery',
    'underscore',
    'backbone',
    'collections/tagset',
    'text!templates/tagoverlay.html',
    'common',
    'models/undomanager',
    'bootstrap'
], function($, _, Backbone, TagSet, tagOverlayTemplate, Common, UndoManager) {
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
            var tagId = parseInt(this.$(".tag_choice").val());
            var tag = TagSet.findWhere({tagId: tagId});
            var redo_function = function(tag){
                _.each(this, function(pic){
                    pic.addTag(tag);
                });
                Backbone.trigger("imagesTagged");
            };
            var undo_function = function(tag){
                _.each(this, function(pic){
                    pic.removeTag(tag);
                });
                Backbone.trigger("imagesUntagged");
            };
            UndoManager.register(this.pics, undo_function, [tag], "Undo Tagging", this.pics, redo_function, [tag], "Redo Tagging");
            _.each(this.pics, function(pic) { pic.addTag(tag); });
            Backbone.trigger("imagesTagged");
            Backbone.trigger("showToast", "tagged pics");
        },
        
        removeTag: function() {
            var tagId = parseInt(this.$(".tag_choice").val());
            var tag = TagSet.findWhere({tagId: tagId});
            var redo_function = function(tag){
                _.each(this, function(pic){
                    pic.removeTag(tag);
                });
                Backbone.trigger("imagesUntagged");
            };
            var undo_function = function(pic){
                _.each(this, function(pic){
                    pic.addTag(tag);
                });
                Backbone.trigger("imagesTagged");
            };
            UndoManager.register(this.pics, undo_function, [tag], "Undo Untagging", this.pics, redo_function, [tag], "Redo Untagging");
            _.each(this.pics, function(pic) { pic.removeTag(tag) });
            Backbone.trigger("imagesUntagged");
            Backbone.trigger("showToast", "untagged pics");
        },
    
    });
    return TagOverlayView;
});