define([
    'underscore',
    'backbone',
    'require'
], function (_, Backbone, require) {
    'use strict';
    /**
     * The basic Tag model represents an tag that pics can be assigned to.
     */
    var Tag = Backbone.Model.extend({
        /*
         * Default attribtues for the pic. Ensures it has the deleted
         * and favorited attributes.
         */
        defaults: function() {
            return {
                tagName: "Tag Name",
                tagId: require("collections/tagset").nextTagId(),
                
            };
        },  
        
        getPics: function() {
            return PicSet.filter(function(pic) {pic.hasTag(this)});
        },
    });
    return Tag;
});