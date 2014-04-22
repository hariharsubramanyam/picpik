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
        
        // Local Storage using picpik-groupset prefix
        localStorage: new Backbone.LocalStorage("picpik-groupset"),
         
        // Returns the root group; Creates it if it doesn't exist. The root group is the top level group and has groupID 0;
        rootGroup: function() {
            var rootGroup = this.findWhere({groupId: 0});
            if (!rootGroup) {
                rootGroup = this.create({
                    name: "Root Group",
                    groupId: 0
                });
            }
            return rootGroup;
        },
        
        nextGroupId: function() {
            if (!this.length) return 1;
            return this.last().get('groupId') + 1;
        },
    });
    
    // GroupSet is a "singleton" picture set
    return new GroupSet();
});