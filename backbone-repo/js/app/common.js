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
        }
	};
    
    // Make Common also an Event Bus
    _.extend(Common, Backbone.Events);
    
    return Common;
});