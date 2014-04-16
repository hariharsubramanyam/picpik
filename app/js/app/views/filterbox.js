define([
    'jquery',
    'underscore',
    'backbone',
    'collections/tagset',
    'text!templates/filterbox.html',
    'common',
], function($, _, Backbone, 
            TagSet,
            filterBoxTemplate, 
            Common) {
    /**
     * The View object for a Picture in the grid.
     * The view object is a div
     */
    var FilterBoxView = Backbone.View.extend({
        tagName: "div",
        
        template: _.template(filterBoxTemplate),
        
        events: {
            "click  #favorites_only" : "clickFavoritesOnly",
            "click  #show_deleted" : "clickDeleted",
            "change  .tag_choice" : "pickTag",
            
        },
        
        initialize: function() {
            this.listenTo(Common, "filterTag", this.filterTag);
            
            this.listenTo(TagSet, 'all', this.renderTagChoices);            
        },
        
        render: function() {
            this.$el.html(this.template());         
            
            this.renderTagChoices();
            return this;
        },
        
        filterTag: function(tag) {
        },
        
        clickDeleted: function() {
            console.log('click deleted');
            Common.setDeletedFilter(this.$("#show_deleted").is(":checked"));
        },
        
        clickFavoritesOnly: function() {
            console.log('click fav');            
            Common.setFavoritesOnly(this.$("#favorites_only").is(":checked"));
        },
        
        renderTagChoices: function() {
            this.$(".tag_choice").html("");
            this.$(".tag_choice").append(" <option value='all'>All Tags</option>");
            
            TagSet.each(function(tag) {     
                var info = tag.toJSON();
                this.$(".tag_choice").append(
                    _.template(" <option value='<%= tagId %>'><%= name %></option>")
                    (info));
            }, this);
        },
        
        pickTag: function() {
            var tagId = this.$(".tag_choice").val();
            console.log(tagId);
            if (tagId == "all") {
                Common.clearVisibleTags();
            } else {
                var tag = TagSet.findWhere({tagId: parseInt(tagId)});
                Common.setVisibleTag(tag);
            }
        }
        
    });
    return FilterBoxView;
});