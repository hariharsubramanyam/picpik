define([
    'jquery',
    'freewall',
    'jqueryGridly',
    'underscore',
    'backbone',
    'collections/picset',
    'views/pic',
    'views/picdebug',
    'text!templates/group.html',
    'common'
], function($, freewall, gridly, _, Backbone, PicSet, PicView, PicDebugView, groupTemplate, Common) {
    
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
            
        },
        
        initialize: function() {
            // "change" is slower, but will update the info list of children,
            // "addPic" is better when the only changes we care about are 
            // rendering new picture additions
            this.listenTo(this.model, 'addPic', this.addPic);
            //this.listenTo(this.model, 'change', this.render);
            
            this.listenTo(this.model, 'destroy', this.remove);
            
            this.listenTo(Backbone, 'filterChanged', this.filterWall);
            this.listenTo(Backbone, 'imagesDeleted', this.render);
            
            this.picViews = [];
        },
        
        filterWall: function() {
            console.log("Filter Wall...");
            _.each(this.picViews, function(picView) { 
                picView.updateVisibility()}, this);       
            this.wall.filter(".visible");
        },
        
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('favorited', this.model.get('favorited'));
            this.toggleVisible();      
                        
            /* Gridly */
            /*$('.pic_grid').gridly({
                base: 60, // px 
                gutter: 20, // px
                columns: 12
            });*/
            if(!PIC_DEBUG) {
            
                 // Freewall
                this.wall = new freewall(this.$('.pic_grid'));
                var wall = this.wall;
                this.wall.reset({
                    draggable: true,
                    selector: '.pic',                
                    animate: true,
                    cellW: 150,
                    cellH: 150,
                    onResize: function() {
                        wall.refresh();
                    },
                });
                wall.filter(".visible");
                this.wall.fitWidth();
                $(window).trigger("resize");
            }
            
            // Render Pics     
            this.$picgrid = this.$('.pic_grid');
            _.each(this.model.getPics(), this.addPic, this);            
            
           
                        
			this.$input = this.$('.group_name');            
            return this;
        },
        
        resizePicGrid: function() {
            console.log("MouseUp");
        },
        
        renderChildren: function() {
            console.log("render children");  
        },
        
        addPic: function(pic) {
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
    });
    return GroupView;
});