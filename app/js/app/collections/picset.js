define([
    'underscore',
    'backbone',
    'backboneLocalstorage',
    'models/pic'
], function(_, Backbone, Store, Pic) {
    /**
     * A Collection of pictures:
     */ 
    var PicSet = Backbone.Collection.extend({
        model: Pic,
        
        localStorage: new Backbone.LocalStorage("picpik-picset"),
        
        deleted: function() {
            return this.where({deleted: true});
        },
        
        favorited: function() {
            return this.where({favorited: true});
        },
        
        nextPicId: function() {
            if (!this.length) return 1;
            return this.last().get('picId') + 1;
        },
        
        comparator: 'order'
    });
    
    // PicSet is a "singleton" picture set
    return new PicSet();
});