define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/actionbar.html',
    'common',
], function($, _, Backbone, actionBarTemplate, 
            Common) {
    /**
     * The View object for a Picture in the grid.
     * The view object is a div
     */
    var ActionBarView = Backbone.View.extend({
        tagName: "div",
        
        template: _.template(actionBarTemplate),
        
        events: {
            "click  .deselectButton" : "deselectAll",
            "click  #previewButton" : "previewClicked",
            "click  #deleteButton" : "deleteClicked",
            "click  #groupButton" : "groupClicked",
            "click  #tagButton" : "tagClicked",
            "click  #starButton" : "starClicked",
        },
        
        initialize: function() {
            this.listenTo(Common, "selectionChange", this.render);

        },
        
        render: function() {
            var numPicsSelected = Common.numPicsSelected();
            this.$el.html(this.template({num_selected: numPicsSelected}));
            if (numPicsSelected == 0) {
                this.$el.hide();
            } else {
                this.$el.show();
            }            
            
            return this;
        },
        
        deselectAll: function() {
            Common.deselectAll();
        },
                
        previewClicked: function() {
            Backbone.trigger("previewPics", Common.selectedPics);
        },
        
        deleteClicked: function() {
            _.each(Common.selectedPics, function(pic) { pic.markDeleted() });
        },
        
        groupClicked: function() {
            Backbone.trigger("groupPics", Common.selectedPics);
        },
        
        tagClicked: function() {
            Backbone.trigger("tagPics", Common.selectedPics);
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
    return ActionBarView;
});