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
            
            
            var t1 = TagSet.create({name: "David"});
            
            var t2 = TagSet.create({name: "Rafting"});
            
            var t3 = TagSet.create({name: "Sunset"});
            
            var rootGroup = GroupSet.rootGroup();
            
            var p = GroupSet.create({name: "Eagle Point"});
            rootGroup.addSubgroup(p);
            for (var i = 0; i < 30 + Math.random() * 5 ; i++) {
                var newPic = PicSet.create({title: "New Pic"});
                p.addPic(newPic);
                if (Math.random() < 0.3) {
                    newPic.addTag(t1);
                }
                if (Math.random() < 0.4) {
                    newPic.addTag(t2);
                }
                if (Math.random() < 0.2) {
                    newPic.addTag(t3);
                }
                if (Math.random() < 0.2) {
                    newPic.set({favorited: true});
                }
                if (Math.random() < 0.1) {
                    newPic.set({deleted: true});
                }
            }
            
            
            var subgroup2 = GroupSet.create({name: "Lookout"});
            p.addSubgroup(subgroup2);
            for (var i = 0; i < 3 + Math.random() *4 ; i++) {
                var newPic = PicSet.create({title: "New Pic"});
                subgroup2.addPic(newPic);
                if (Math.random() < 0.3) {
                    newPic.addTag(t1);
                }
                if (Math.random() < 0.4) {
                    newPic.addTag(t2);
                }
                if (Math.random() < 0.2) {
                    newPic.addTag(t3);
                }
                if (Math.random() < 0.2) {
                    newPic.set({favorited: true});
                }
                if (Math.random() < 0.1) {
                    newPic.set({deleted: true});
                }
            }
            
            var subgroup1 = GroupSet.create({name: "Day Hike"});
            p.addSubgroup(subgroup1);
            for (var i = 0; i < 20 + Math.random() *4 ; i++) {
                var newPic = PicSet.create({title: "New Pic"});
                subgroup1.addPic(newPic);
                if (Math.random() < 0.3) {
                    newPic.addTag(t1);
                }
                if (Math.random() < 0.4) {
                    newPic.addTag(t2);
                }
                if (Math.random() < 0.2) {
                    newPic.addTag(t3);
                }
                if (Math.random() < 0.2) {
                    newPic.set({favorited: true});
                }
                if (Math.random() < 0.1) {
                    newPic.set({deleted: true});
                }
            }
            
            var subsubgroup1 = GroupSet.create({name: "Stream Crossing"});
            subgroup1.addSubgroup(subsubgroup1);
            for (var i = 0; i < 12 + Math.random() *4 ; i++) {
                var newPic = PicSet.create({title: "New Pic"});
                subsubgroup1.addPic(newPic);
                if (Math.random() < 0.3) {
                    newPic.addTag(t1);
                }
                if (Math.random() < 0.4) {
                    newPic.addTag(t2);
                }
                if (Math.random() < 0.2) {
                    newPic.addTag(t3);
                }
                if (Math.random() < 0.2) {
                    newPic.set({favorited: true});
                }
                if (Math.random() < 0.1) {
                    newPic.set({deleted: true});
                }
            }
            
            var subsubgroup2 = GroupSet.create({name: "Rim Descent"});
            subgroup1.addSubgroup(subsubgroup2);
            for (var i = 0; i < 5 + Math.random() *10 ; i++) {
                var newPic = PicSet.create({title: "New Pic"});
                subsubgroup2.addPic(newPic);
                if (Math.random() < 0.3) {
                    newPic.addTag(t1);
                }
                if (Math.random() < 0.4) {
                    newPic.addTag(t2);
                }
                if (Math.random() < 0.2) {
                    newPic.addTag(t3);
                }
                if (Math.random() < 0.2) {
                    newPic.set({favorited: true});
                }
                if (Math.random() < 0.1) {
                    newPic.set({deleted: true});
                }
            }
            

            var p = GroupSet.create({name: "Hermit's Rest"});
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
                    newPic.addTag(t3);
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