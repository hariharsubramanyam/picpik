define([
    'underscore',
    'backbone',
    'require'
], function (_, Backbone, require) {
    'use strict';
    /**
     * The basic Group Model represents a list of images that the group contains.
     * Support for subgroups will be added in the future.
     */
    var Group = Backbone.Model.extend({
        /*
         * Default attribtues for the group.
         */
        defaults: function() {
            return {
                children: [],
                name: "Untitled Group",
            };
        },
        
        addPic: function(pic) {
            this.save({children: children.push(picId)});
        },
    });
    return Group;
});