define([
    'jquery',
    'jqueryUI',
    'freewall',
    'jqueryGridly',
    'underscore',
    'backbone',
    'collections/picset',
    'collections/groupset',
    'views/pic',
    'views/pictarget',
    'views/picdebug',
    'text!templates/group.html',
    'common'
], function($, jqueryUI, freewall, gridly, _, Backbone, PicSet, GroupSet, PicView, PicTargetView, PicDebugView, groupTemplate, Common) {
    'use strict';
    var PIC_DEBUG = false;
    /**
     * The View object for a Group in the grid.
     * The view object is a div
     */
    var GroupView = Backbone.View.extend({
        tagName: "div",
        
        template: _.template(groupTemplate),
        
        events: {
            "blur .group_name":  "closeName",
            "click .remove_group_button":  "removeGroup",            
            "click .add_pic_to_group": "addPicToGroup",
            "mouseup .pic_grid": "resizePicGrid",
            "keydown .group_name":  "noShortcuts",
        },
        
        noShortcuts: function(e) {
            e.stopPropagation();  
        },
        
        initialize: function() {
            // "change" is slower, but will update the info list of children,
            // "addPic" is better when the only changes we care about are 
            // rendering new picture additions
            this.listenTo(this.model, 'addPic', this.addPicViewe);
            this.listenTo(this.model, 'addSubgroup', this.addSubgroupView);
            
            //this.listenTo(this.model, 'change', this.render);
                        
            this.listenTo(this.model, 'destroy', this.remove);
            
            this.listenTo(Backbone, 'filterChanged', this.filterWall);
            //this.listenTo(Backbone, 'imagesDeleted', this.renderpicviews);
            //this.listenTo(Backbone, "imagesUndeleted", this.renderpicviews);
            //this.listenTo(Backbone, "imagesFavorited", this.renderpicviews);
            //this.listenTo(Backbone, "imagesUnfavorited", this.renderpicviews);
            
            this.picViews = [];
        },
        
        filterWall: function() {
            _.each(this.picViews, function(picView) { 
                picView.updateVisibility()}, this);
        },
        
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('favorited', this.model.get('favorited'));
            this.toggleVisible();      
      
            // Render Pics     
            this.$picgrid = this.$('.pic_grid');
            this.$picgrid.sortable({
              connectWith: '.pic_grid',
              forcePlaceholderSize: true,
              placeholder: 'pic_target',
              stop: function() {
                if ($(this).hasClass('dropped')){
                    $(this).sortable('cancel');
                    $(this).removeClass('dropped');
                }
              }
            });
            this.$picgrid.disableSelection();

            var group_pics = this.model.getPics();
            _.each(group_pics, this.addPicView, this);     
          
            if (group_pics.length == 0) {
                //this.addTargetView();
            }
            
            // Render SubGroups     
            this.$subgroups = this.$('.subgroups');
          
            this.$subgroups.sortable({
              handle: '.group-handle',
              connectWith: '.subgroups',
              placeholder: 'group_target',              
            });

          
            var subgroups = this.model.getSubgroups();

            _.each(subgroups, this.addSubgroupView, this);            
                        
			this.$input = this.$('.group_name');            
            
            this.$(".add_subgroup_to_group").click(_.bind(this.createSubgroup, this));
            
            return this;
        },
        
        resizePicGrid: function() {
        },
        
        renderChildren: function() {
        },
        
        addPicView: function(pic) {
            if (pic) {
                if (PIC_DEBUG) {
                    var view = new PicDebugView({model: pic});
                } else {
                    var view = new PicView({model: pic});                    
                }
                //this.listenTo(view, "visibilityChanged", this.filterWall);
                this.picViews.push(view);
                this.$picgrid.append(view.render().$el); 
            }
        },
        
        addTargetView: function(pic) {
            var view = new PicTargetView();                    
            //this.listenTo(view, "visibilityChanged", this.filterWall);
            this.picViews.push(view);
            this.$picgrid.append(view.render().$el); 
        },
        
        addSubgroupView: function(group) {
            if (group) {
                var view = new GroupView({model: group});                    
                this.$subgroups.prepend(view.render().$el); 
            }
        },


        removeGroup: function() {
            this.model.destroyGroup();
        },
        
        toggleFavorited: function() {
            this.model.toggleFavorited();
        },
        
        toggleDeleted: function() {
            this.$el.fadeOut(400, (function() {
                this.model.toggleDeleted();
            }).bind(this));
        },
        
        toggleVisible: function() {
            if (this.isHidden()) {
                this.$el.hide();
            } else {
                this.$el.show();
            }
        },
        
        isHidden: function() {
            var isDeleted = this.model.get('deleted');
            var isFavorited = this.model.get('favorited');
            return (
                (!isFavorited && Common.picFilter === "favorited") ||
                (isDeleted && Common.picFilter != "deleted") ||
                (!isDeleted && Common.picFilter === "deleted")
            );
        },
        closeName: function() {
            var value = this.$input.html();
            this.model.save({name: value});
        },
        
        addPicToGroup: function() {
            var newPic = PicSet.create({title: "New Pic"});
            this.model.addPic(newPic);
        },
        
        createSubgroup: function() {
            var newSubgroup = GroupSet.create({name: "New Subgroup"});
            this.model.addSubgroup(newSubgroup);
        },
    });
    return GroupView;
});