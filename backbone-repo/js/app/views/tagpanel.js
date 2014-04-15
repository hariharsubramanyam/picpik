define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/tagpanel.html',
], function($, _, Backbone, tagpanelTemplate) {
    /**
     */
    var TagPanelView = Backbone.View.extend({
        tagName: "div",
        
        template: _.template(tagpanelTemplate),
        
        events: {
            "click .add_tag_btn": "addTagClicked",
        },
        
        initialize: function() {
        },
        
        render: function() {
            this.$el.html(this.template());
            console.log(this.template());
            return this;
        },
        
        addTagClicked: function() {
            console.log("Add Tag Clicked!");
        },        
    });
    return TagPanelView;
});