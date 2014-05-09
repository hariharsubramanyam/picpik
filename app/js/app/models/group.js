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
        GROUP_TYPE: "GROUP_TYPE",
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
                    var picId = childElt['value'];
                    var pic = PicSet.findWhere({picId: picId});
                    if(pic) {
                        this.listenTo(pic, "destroy", function () {this.removePic(pic)});
                        this.listenTo(pic, "leaveGroup", function () {this.removePic(pic)});
                    }
                }
            }, this);
        },
        
        addSubgroupListeners: function() {
            var GroupSet = require("collections/groupset");
            var children = this.get('children');
            _.each(children, function(childElt) {
                if(childElt['type'] == this.GROUP_TYPE) {
                    var groupId = childElt['value'];
                    var group = GroupSet.findWhere({groupId: groupId});
                    if(group) {
                        this.listenTo(group, "destroy", 
                                      function () {this.removeSubgroup(group)});
                        this.listenTo(group, "leaveGroup", 
                                      function () {this.removeSubgroup(group)});
                    }
                }
            }, this);
        },
        
        childrenString: function() {
            var childrenStr = "";
                _.each(this.get('children'), function(child) {
                childrenStr += child['type'][0] + ":" + child['value'] + ", ";
            });
            return childrenStr;
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
            this.trigger("addPic", pic);
        },
        
        removePic: function(pic) {
            this.removeChild(this.PIC_TYPE, pic.get('picId'));            
        },
        
        addSubgroup: function(group) {
            this.addChild(this.GROUP_TYPE, group.get('groupId'));
            this.listenTo(group, "destroy", function () {this.removeSubgroup(group)});
            this.listenTo(group, "leaveGroup", function () {this.removeSubgroup(group)});
            this.trigger("addSubgroup", group);
        },
        
        removeSubgroup: function(group) {
            this.removeChild(this.GROUP_TYPE, group.get('groupId'));            
        },
        
        getPics: function() {
            var pics =  _.filter(_.map(this.get('children'), function(childElt) {
                if (childElt['type'] == this.PIC_TYPE) {                    
                    return PicSet.findWhere({picId: childElt['value']});
                }
            }, this), function(x) { return x; });
            return pics;
        },
        
        getSubgroups: function() {
            var subgroups =  _.filter(_.map(this.get('children'), function(childElt) {
                if (childElt['type'] == this.GROUP_TYPE) {                    
                    return require("collections/groupset").findWhere({groupId: childElt['value']});
                }
            }, this), function(x) { return x; });
            return subgroups;
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