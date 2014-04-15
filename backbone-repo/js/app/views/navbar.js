define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/navbar.html',
], function($, _, Backbone, navbarTemplate) {
    /**
     * The View object for a Picture in the grid.
     * The view object is a div
     */
    var NavBarView = Backbone.View.extend({
        tagName: "div",
        
        template: _.template(navbarTemplate),
        
        events: {
            "click  #previewButton" : "previewClicked",
            "click  #deleteButton" : "deleteClicked",
            "click  #groupButton" : "groupClicked",
            "click  #tagButton" : "tagClicked",
            "click  #selectButton" : "selectClicked",
        },
        
        initialize: function() {
        },
        
        render: function() {
            this.$el.html(this.template());
            return this;
        },
        
        previewClicked: function() {
            console.log("preview Clicked!");
        },
        
        deleteClicked: function() {
            console.log("delete Clicked!");
        },
        
        groupClicked: function() {
            console.log("group Clicked!");
        },
        
        tagClicked: function() {
            console.log("tag Clicked!");
        },
        
        selectClicked: function() {
            console.log("select Clicked!");
        },
        
        
        
    });
    return NavBarView;
});