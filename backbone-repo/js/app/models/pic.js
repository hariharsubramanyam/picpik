define([
    'underscore',
    'backbone',
    'require',
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
        
        addTagListeners: function() {
            var tagList = this.get('tagList');
            console.log(tagList);
            _.each(tagList, function(tagId) {
                var tag = require("collections/tagset").findWhere({tagId: tagId});
                this.listenTo(tag, "destroy", function () {this.removeTag(tag)});
            }, this);
        },
        
        toggleFavorited: function() {
            this.save({favorited: !this.get("favorited")});
        },
        
        toggleDeleted: function() {
            this.save({deleted: !this.get("deleted")});
        },
        
        hasTag: function(tag) {
            return _.contains(this.get('tagList'), tag.get('tagId'));
        },
        
        addTag: function(tag) {
            var tagList = this.get('tagList')
            tagList.push(tag.get('tagId'));
            this.save("tagList", tagList);
            tag.trigger("change");
            this.trigger("change");
            this.listenTo(tag, "destroy", function () {console.log("Tag Destroyed"); this.removeTag(tag)});
        },
        
        removeTag: function(tag) {
            var tagList = this.get('tagList')
            var tagIdToRemove = tag.get('tagId');
            tagList = _.filter(tagList, function(tagId) { return tagId != tagIdToRemove; });
            this.stopListening(tag);
            this.save("tagList", tagList);
            tag.trigger("change");
            this.trigger("change");
        }
    });
    return Pic;
});