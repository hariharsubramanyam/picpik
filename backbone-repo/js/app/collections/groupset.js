define([
    'underscore',
    'backbone',
    'backboneLocalstorage',
    'models/group'
], function(_, Backbone, Store, Group) {
    /**
     * A Collection of groups:
     */ 
    var GroupSet = Backbone.Collection.extend({
        model: Group,
        
        localStorage: new Backbone.LocalStorage("picpik-groupset"),
                
    });
    
    // GroupSet is a "singleton" picture set
    return new GroupSet();
});