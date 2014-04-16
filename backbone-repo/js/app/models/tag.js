define([
    'underscore',
    'backbone',
    'require',
    'collections/picset',
], function (_, Backbone, require, PicSet) {
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
                name: "Tag Name",
                tagId: require("collections/tagset").nextTagId(),
                color: "red",                
            };
        },  
        
        getPics: function() {
            var pics =  PicSet.filter(function(pic) {return pic.hasTag(this)}, this);
            return pics;
        },
    });
    return Tag;
});