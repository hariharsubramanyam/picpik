define([
    'underscore',
    'backbone',
    'require',
    'collections/picset'
], function (_, Backbone, require, PicSet) {
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
            var children = this.get('children')
            children.push(pic.get('picId'));
            this.save({children: children});
        },
        
        getPics: function() {
            var pics =  _.map(this.get('children'), function(aPicId) {
                return PicSet.findWhere({picId: aPicId});
            });
            return pics;
        },
        
        destroyGroup: function() {
            _.each(this.getPics(), function(pic) {
                if (pic) {
                    pic.destroy();
                }}, this);
            this.destroy();
        }
    });
    return Group;
});