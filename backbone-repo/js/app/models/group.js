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
        PIC_TYPE: "PIC_TYPE",
        /*
         * Default attribtues for the group.
         */
        defaults: function() {
            return {
                children: [],
                name: "Untitled Group",
                groupId: require("collections/groupset").nextGroupId(),
                parent: "None",
            };
        },
        
        addPicListeners: function() {
            var children = this.get('children');
            _.each(children, function(childElt) {
                if(childElt['type'] == this.PIC_TYPE) {
                    console.log(this.PIC_TYPE);
                    var picId = childElt['value'];
                    var pic = PicSet.findWhere({picId: picId});
                    this.listenTo(pic, "destroy", function () {this.removePic(pic)});
                    this.listenTo(pic, "leaveGroup", function () {this.removePic(pic)});
                }
            }, this);
        },
        
        addChild: function(type, value) {
            var children = this.get('children');

            var childElt = {};
            childElt['type'] = type;
            childElt['value'] = value;
            children.push(childElt);
            
            this.save("children", children);
            this.trigger("change");
        },
        
        removeChild: function(type, value) {
            var children = this.get('children');
            children = _.filter(children, function(childElt) { 
                return childElt['type'] != type || childElt['value'] != value; 
            });
            this.save("children", children);
            this.trigger("change");       
        },
        
        
        addPic: function(pic) {
            this.addChild(this.PIC_TYPE, pic.get('picId'));            
            this.listenTo(pic, "destroy", function () {this.removePic(pic)});
            this.listenTo(pic, "leaveGroup", function () {this.removePic(pic)});
        },
        
        removePic: function(pic) {
            this.addChild(this.PIC_TYPE, pic.get('picId'));            
        },
        
        getPics: function() {
            var pics =  _.map(this.get('children'), function(childElt) {
                if (childElt['type'] = this.PIC_TYPE) {                    
                    return PicSet.findWhere({picId: childElt['value']});
                }
            }, this);
            return pics;
        },
        
        destroyGroup: function() {
            _.each(this.getPics(), function(pic) {
                if (pic) {
                    pic.destroy();
                }}, this);
            this.destroy();
        },
        
    });
    return Group;
});