define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/previewoverlay.html',
    'text!templates/multipreviewoverlay.html',
    'common',
    'facebox'
], function($, _, Backbone, previewOverlayTemplate, multiPreviewOverlayTemplate, Common, Facebox) {
    /**
     */
    var PreviewOverlayView = Backbone.View.extend({
        tagName: "div",
        
        singleImageTemplate: _.template(previewOverlayTemplate),
        multiImageTemplate: _.template(multiPreviewOverlayTemplate),
        
        events: {
            "click .close": "close",
        },
        
        initialize: function() {
            this.active = false;
            this.pics = [];
            this.listenTo(Backbone, "previewPics", this.previewPics);
        },
        
        render: function() {
            if (this.active) {
                this.$el.html(this.singleImageTemplate({pics: this.pics}));
                $('#previewModal').modal("show");
                $('.carousel').carousel();
            } 
            return this;
        },
        
        previewPics: function(pics) {
            this.active = true;
            this.pics = pics;
            this.render();
        },
        
        close: function() {
            this.active = false;
            this.$el.hide();
        }
    });
    return PreviewOverlayView;
});