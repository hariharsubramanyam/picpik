define([
    'underscore',
    'backbone',
    'require',
    'common', 
], function (_, Backbone, require, Common) {
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
                picSrc: "pics/harihar/pic" + ( (nextPicId % 16) + 1) + ".jpg",
                tagList: [],
                selected: false
            };
        },
        
        initialize: function() {
            this.set({"selected": false});
        },
        
        select: function() {
            if (!this.get("selected")) {
                Common.selectPic(this);
            }
            this.set({"selected": true });  
            this.trigger("change");         
        },
        
        deselect: function() {
            if (this.get("selected")) {
                Common.deselectPic(this);
            }
            this.set({"selected": false});
            this.trigger("change");
        },
        
        addTagListeners: function() {
            var tagList = this.get('tagList');
            _.each(tagList, function(tagId) {
                var tag = require("collections/tagset").findWhere({tagId: tagId});
                if(tag) {
                    this.listenTo(tag, "destroy", function () {this.removeTag(tag)});
                }
            }, this);
        },
        
        toggleFavorited: function() {
            this.save({favorited: !this.get("favorited")});
            this.trigger("change");
        },
        
        favorite: function() {
            this.save({favorited: true});
            this.trigger("change");
        },
        
        unfavorite: function() {
            this.save({favorited: false});
            this.trigger("change");
        },
        
        markDeleted: function() {
            this.save({deleted: true});
            this.trigger("change");
        },
        
        toggleDeleted: function() {
            this.save({deleted: !this.get("deleted")});
            this.trigger("change");
        },

        markNotDeleted: function(){
            this.save({deleted: false});
            this.trigger("change");
        },
        
        hasTag: function(tag) {
            return _.contains(this.get('tagList'), tag.get('tagId'));
        },
        
        addTag: function(tag) {
            var tagList = this.get('tagList');
            if (_.contains(tagList, tag.get('tagId'))) {
                return;
            }
            tagList.push(tag.get('tagId'));
            this.save("tagList", tagList);
            tag.trigger("change");
            this.trigger("change");
            this.listenTo(tag, "destroy", function () {
                this.removeTag(tag)});
        },
        
        removeTag: function(tag) {
            var tagList = this.get('tagList')
            var tagIdToRemove = tag.get('tagId');
            tagList = _.filter(tagList, function(tagId) { return tagId != tagIdToRemove; });
            this.stopListening(tag);
            this.save("tagList", tagList);
            tag.trigger("change");
        },
        
        moveToGroup: function(group) {
            this.trigger("leaveGroup");
            group.addPic(this);
        },
    });
    return Pic;
});