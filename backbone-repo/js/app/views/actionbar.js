define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/actionbar.html',
    'common',
], function($, _, Backbone, actionBarTemplate, Common) {
    /**
     * The View object for a Picture in the grid.
     * The view object is a div
     */
    var ActionBarView = Backbone.View.extend({
        tagName: "div",
        
        template: _.template(actionBarTemplate),
        
        events: {
            "click #btnDeselectAll" : "deselectAll"
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
        }
        
    });
    return ActionBarView;
});