define([
    'underscore',
    'backbone',
], function (_, Backbone) {
	var Common = {
		// Which filter are we using?
		picFilter: '', // empty, active, completed

		// What is the enter key constant?
		ENTER_KEY: 13,
        
        selectedPics: [],
        
        numPicsSelected: function() {
            return this.selectedPics.length;
        },
        
        selectPic: function(pic) {
            this.selectedPics.push(pic);
            this.trigger("selectionChange");            
        },
        
        deselectPic: function(picToDelete) {
            var idToDelete = picToDelete.get('picId');
            this.selectedPics = _.filter(this.selectedPics, function(pic) { return pic.get('picId') != idToDelete});
            this.trigger("selectionChange");
        },
        
        deselectAll: function() {
            _.each(this.selectedPics, function(pic) { pic.deselect(); });
        },
        
        
        favoritesOnly: false,
        setFavoritesOnly: function(val) {
            this.favoritesOnly = val;
            Backbone.trigger("filterChanged");
        },
        
        showDeleted: false,
        setDeletedFilter: function(val) {
            this.showDeleted = val;
            Backbone.trigger("filterChanged");
        },
        
        visibleTags: [],
        
        setVisibleTag: function(tag) {
            this.visibleTags = [tag];
            Backbone.trigger("filterChanged");            
        },
        
        clearVisibleTags: function() {
            this.visibleTags = [];
            Backbone.trigger("filterChanged");            
        },        
        
        addVisibleTag: function(tag) {
            if (!_.contains(this.visibleTags, tag)) {
                this.visibleTags.append(tag);
                Backbone.trigger("filterChanged");
            }
        },
        
        removeVisibleTag: function(tagToDelete) {
            this.visibleTags = _.filter(this.visibleTags, function(tag) { return tag != tagToDelete; });
            Backbone.trigger("filterChanged");
        },
        
        picVisible: function(pic) {
            if (this.favoritesOnly && !pic.get('favorited')) {
                return false;
            }
            if (pic.get('deleted') && !this.showDeleted) {
                return false;
            }
            console.log(this.visibleTags);
            if (this.visibleTags.length > 0 && !pic.hasTag(this.visibleTags[0])) {
                return false;
            }
            return true;
        },
        
	};
    
    // Make Common also an Event Bus
    _.extend(Common, Backbone.Events);
    
    return Common;
});