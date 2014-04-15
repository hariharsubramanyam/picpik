define([
    'jquery',
    'underscore',
    'backbone',
    'collections/picset',
    'views/pic',
    'text!templates/group.html',
    'common'
], function($, _, Backbone, PicSet, PicView, groupTemplate, Common) {
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
        },
        
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('favorited', this.model.get('favorited'));
            this.toggleVisible();      
            
            // Render Pics     
            this.$picgrid = this.$('.pic_grid');
            console.log(this.$picgrid.html());
            console.log("GetPics:");
            console.log(this.model.getPics());
            _.each(this.model.getPics(), this.addPic, this);

            
			this.$input = this.$('.group_name');            
            return this;
        },
        
        addPic: function(pic) {
            if (pic) {
                var view = new PicView({model: pic});
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
            //this.model.trigger("change");
        },
        addPicToGroup: function() {
            var newPic = PicSet.create({title: "New Pic"});
            this.model.addPic(newPic);
            this.addPic(newPic);
        },
        
    });
    return GroupView;
});