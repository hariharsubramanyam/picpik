define([
    'underscore',
    'backbone',
    'require'
], function (_, Backbone, require) {
    'use strict';
    /**
     * The basic Pic Model represents an image that can be
     * favorited or deleted as needed.
     */
    var Pic = Backbone.Model.extend({
        /*
         * Default attribtues for the pic. Ensures it has the deleted
         * and favorited attributes.
         */
        defaults: function() {
            var nextPicId = require("collections/picset").nextPicId();
            return {
                title: "Untitled Photo",
                deleted: false,
                favorited: false,
                picId: nextPicId,
                picSrc: "pic" + ( (nextPicId % 4) + 1) + ".jpg",
                tagList: [],
            };
        },
        
        toggleFavorited: function() {
            this.save({favorited: !this.get("favorited")});
        },
        
        toggleDeleted: function() {
            this.save({deleted: !this.get("deleted")});
        },
        
        hasTag: function(tag) {
            return _.contains(this.get('tagList'), tag.get('tagId'));
        }
    });
    return Pic;
});