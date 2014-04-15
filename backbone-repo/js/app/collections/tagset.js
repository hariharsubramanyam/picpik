define([
    'underscore',
    'backbone',
    'backboneLocalstorage',
    'models/tag'
], function(_, Backbone, Store, Tag) {
    /**
     * A Collection of tags:
     */ 
    var TagSet = Backbone.Collection.extend({
        model: Tag,
        
        localStorage: new Backbone.LocalStorage("picpik-tagset"),
        
        
        nextTagId: function() {
            if (!this.length) return 1;
            return this.last().get('tagId') + 1;
        },
                
    });
    
    // TagSet is a "singleton" tag set
    return new TagSet();
});