define([
    'jquery',
    'underscore',
    'backbone',
    'views/tag',
    'collections/tagset',
    'text!templates/tagpanel.html',
], function($, _, Backbone, TagView, TagSet, tagpanelTemplate) {
    /**
     */
    var TagPanelView = Backbone.View.extend({
        tagName: "div",
        
        template: _.template(tagpanelTemplate),
        
        events: {
            "click .add_tag_btn": "addTagClicked",
        },
        
        initialize: function() {
            
            this.listenTo(TagSet, 'add', this.addOneTag);
            this.listenTo(TagSet, 'reset', this.addAllTags);
        },
        
        render: function() {
            this.$el.html(this.template());
            TagSet.fetch();
            return this;
        },
        
        addOneTag: function(tag) {
            var view = new TagView({model: tag});
            this.$('#tags_div').append(view.render().el);
        },
        
        addAllTags: function() {
            TagSet.each(this.addOneTag, this);
        },

        
        addTagClicked: function() {
            TagSet.create({name: "New Tag"});
        },
        
    });
    return TagPanelView;
});