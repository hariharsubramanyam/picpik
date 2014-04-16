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
            "click  .thumb" : "toggleSelection",
            "dblclick  .thumb" : "doubleClick",            
        },
        
        initialize: function() {
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(TagSet, 'all', this.renderTagChoices);
            
            this.listenTo(this.model, 'change:selected', this.updateSelectionClass);
            this.listenTo(Backbone, 'filterChanged', this.updateVisibility);
            
            //this.listenTo(this.model, 'change', this.render);
            //this.listenTo(this.model, 'visible', this.toggleVisible);
            this.selected = false;
        },
        
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('selected', this.model.selected);
                        
            this.renderTagChoices();
            this.updateVisibility();
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
            this.model.toggleDeleted();
        },
        
        destroy: function() {
            this.$el.fadeOut(400, (function() {
                this.model.destroy();
            }).bind(this));
        },
        
        addTag: function() {
            var tagId = parseInt(this.$(".tag_choice").val());
            var tag = TagSet.findWhere({tagId: tagId});
            if (tag) {
                this.model.addTag(tag);
            }
        },
        
        removeTag: function() {
            var tagId = parseInt(this.$(".tag_choice").val());
            var tag = TagSet.findWhere({tagId: tagId});
            if (tag) {
                this.model.removeTag(tag);
            }
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
        }
    });
    return PicView;
});