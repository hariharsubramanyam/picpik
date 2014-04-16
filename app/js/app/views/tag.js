define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/tag.html',
    'common'
], function($, _, Backbone, tagTemplate, Common) {
    /**
     * The View object for a Tag in the sidebar.
     */
    var TagView = Backbone.View.extend({
        tagName: "div",
        
        template: _.template(tagTemplate),
        
        events: {
            "click .delete_tag_btn" : "removeTag",
            "blur .tag_name_field" : "closeName",
        },
        
        initialize: function() {
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'change', this.render);
        },
        
        render: function() {
            var info = this.model.toJSON();
            info['count'] = this.model.getPics().length;
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
        }
    });
    return TagView;
});