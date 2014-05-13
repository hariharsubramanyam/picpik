define([
    'jquery',
    'underscore',
    'backbone',
    'collections/groupset',
    'text!templates/groupoverlay.html',
    'common'
], function($, _, Backbone, GroupSet, groupOverlayTemplate, Common) {
    /**
     */
    var GroupOverlayView = Backbone.View.extend({
        tagName: "div",
        
        template: _.template(groupOverlayTemplate),
        
        events: {
            "click .close": "close",
            "click .move_btn": "movePics",
        },
        
        initialize: function() {
            this.active = false;
            this.pics = [];
            this.listenTo(Backbone, "groupPics", this.groupPics);
        },
        
        render: function() {
            this.$el.html(this.template());
            if (this.active && this.pics.length > 0) {
                this.renderGroupChoices();
                var modal = $('#groupModal')
                modal.modal("show");
                this.listenTo(Backbone, "closeModal", function() {
                    modal.modal("hide");
                });
              
                this.$(".small_modal_close_btn").click(function() {
                    modal.modal("hide");
                });              
            }
            return this;
        },
        
        renderGroupChoices: function() {
            this.$(".group_choice").html("");
            GroupSet.each(function(group) {     
                var info = group.toJSON();
                this.$(".group_choice").append(
                    _.template(" <option value='<%= id %>'><%= name %></option>")
                    (info));
            }, this);
        },
        
        groupPics: function(pics) {
            this.active = true;
            this.pics = pics;
            this.render();
        },
        
        close: function() {
            this.active = false;
            this.$el.hide();
        },
        
        movePics: function() {
            var groupId = this.$(".group_choice").val();
            var group = GroupSet.get(groupId);
            _.each(this.pics, function(pic) { pic.moveToGroup(group) });
        },
    
    });
    return GroupOverlayView;
});