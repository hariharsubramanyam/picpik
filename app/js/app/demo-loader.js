define([
    'underscore',
    'backbone',
    'collections/picset',
    'collections/tagset',
    'collections/groupset'
], function (_, Backbone, PicSet, TagSet, GroupSet) {
	var DemoLoader = {
        loadDemo: function() {
            PicSet.each(function(pic) { pic.destroy(); });
            TagSet.each(function(tag) { tag.destroy(); });
            GroupSet.each(function(group) { group.destroy(); });
        }
	};
    
    return DemoLoader;
});