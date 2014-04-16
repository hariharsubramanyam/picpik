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
        },
        
        initialize: function() {
            this.listenTo(this.model, 'destroy', this.remove);            
        },
        
        render: function() {
            var info = this.model.toJSON();
            info['count'] = this.model.getPics().length;
            this.$el.html(this.template(info));
            return this;
        },
        
        removeTag: function() {
            this.model.destroy();
        }
    });
    return TagView;
});