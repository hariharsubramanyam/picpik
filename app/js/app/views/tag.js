define([
    'jquery',
    'underscore',
    'backbone',
    'collections/picset',
    'text!templates/tag.html',
    'common'
], function($, _, Backbone, PicSet, tagTemplate, Common) {
    /**
     * The View object for a Tag in the sidebar.
     */
    var TagView = Backbone.View.extend({
        tagName: "div",
        
        template: _.template(tagTemplate),
        
        events: {
            "click .delete_tag_btn" : "removeTag",
            "blur .tag_name_field" : "closeName",
            "keydown .group_name":  "noShortcuts",
            "click .filter_tag_btn": "filterTag",
            
        },
        
        noShortcuts: function(e) {
            e.stopPropagation();  
        },
        
        initialize: function() {
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'change', this.render);
        },
        
        render: function() {
            var info = this.model.toJSON();
            info['count'] = this.model.getPics().length;
            info['total'] = PicSet.size();
            this.$el.html(this.template(info));
            this.$nameInput = this.$(".tag_name_field");
            return this;
        },
        
        removeTag: function() {
            this.model.destroy();
        },
        
        closeName: function() {
            var value = this.$nameInput.val();
            this.model.save({name: value});        
        },
        
        filterTag: function() {
            Common.deselectAll();
            
            Common.clearVisibleTags();   
            Common.setFavoritesOnly(false);
            Common.setDeletedOnly(false);
            Common.setVisibleTag(this.model);
            Backbone.trigger("setCurrentFilterTag", this.model.get('name'));
        }
    });
    return TagView;
});