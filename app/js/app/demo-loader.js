define([
    'underscore',
    'backbone',
    'collections/picset',
    'collections/tagset',
    'collections/groupset'
], function (_, Backbone, PicSet, TagSet, GroupSet) {
	var DemoLoader = {
        loadDemo: function() {
            TagSet.each(function(tag) { 
                try { tag.destroy(); } catch (err) { }
            });
            GroupSet.each(function(group) { 
                try { group.destroyGroup(); } catch (err) { }
            });
            GroupSet.each(function(group) { 
                try { group.destroy(); } catch (err) { }
            });
            PicSet.each(function(pic) { 
                try { pic.destroy(); } catch (err) { }
            });
            TagSet.each(function(tag) { 
                try { tag.destroy(); } catch (err) { }
            });            
            
            
            var t1 = TagSet.create({name: "John"});
            
            var t2 = TagSet.create({name: "Food"});
            
            var rootGroup = GroupSet.rootGroup();
            
            var p = GroupSet.create({name: "Mumbai"});
            rootGroup.addSubgroup(p);
            for (var i = 0; i < 10 + Math.random() * 5 ; i++) {
                var newPic = PicSet.create({title: "New Pic"});
                p.addPic(newPic);
                if (Math.random() < 0.3) {
                    newPic.addTag(t1);
                }
                if (Math.random() < 0.4) {
                    newPic.addTag(t2);
                }
                if (Math.random() < 0.2) {
                    newPic.set({favorited: true});
                }
                if (Math.random() < 0.1) {
                    newPic.set({deleted: true});
                }
            }
            var p = GroupSet.create({name: "New Dehli"});
            rootGroup.addSubgroup(p);
            for (var i = 0; i < 15 + Math.random() * 5; i++) {
                var newPic = PicSet.create({title: "New Pic"});
                p.addPic(newPic);
                if (Math.random() < 0.3) {
                    newPic.addTag(t1);
                }
                if (Math.random() < 0.4) {
                    newPic.addTag(t2);
                }
                if (Math.random() < 0.2) {
                    newPic.set({favorited: true});
                }
                if (Math.random() < 0.1) {
                    newPic.set({deleted: true});
                }
                
            }
            

        },
        
        clearStorage: function() {
            localStorage.clear();
        },
        
        checkFirst: function() {
            if (PicSet.size() == 0 && GroupSet.size() == 0) {
                this.loadDemo();
            }
        }
	};
    return DemoLoader;
});