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
        
        rootGroup: function() {
            return this.findWhere({groupId: 0});
        },
        
        nextGroupId: function() {
            if (!this.length) return 1;
            return this.last().get('groupId') + 1;
        },
    });
    
    // GroupSet is a "singleton" picture set
    return new GroupSet();
});