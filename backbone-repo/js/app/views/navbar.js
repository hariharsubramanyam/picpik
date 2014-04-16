define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/navbar.html',
    'common',
], function($, _, Backbone, navbarTemplate, Common) {
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
            "click  #starButton" : "starClicked",
        },
        
        initialize: function() {
        },
        
        render: function() {
            this.$el.html(this.template());
            return this;
        },
        
        previewClicked: function() {
            console.log("preview Clicked!");
            Backbone.trigger("previewPics", Common.selectedPics);
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
        
        starClicked: function() {
            var allFavorited = _.every(Common.selectedPics, function(pic) {return pic.get('favorited')});
            if (allFavorited) {
                _.each(Common.selectedPics, function(pic) { pic.unfavorite() });
            } else {
                _.each(Common.selectedPics, function(pic) { pic.favorite() });
                
            }
        },
        
        
        
    });
    return NavBarView;
});