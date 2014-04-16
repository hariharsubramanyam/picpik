define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/previewOverlay.html',
    'text!templates/multiPreviewOverlay.html',
    'common'
], function($, _, Backbone, previewOverlayTemplate, multiPreviewOverlayTemplate, Common) {
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
                if (this.pics.length  == 1) {
                    this.$el.show();
                    this.$el.html(this.singleImageTemplate({imgsrc: this.pics[0].get('picSrc')}));
                }else if (this.pics.length > 1) {
                    this.$el.show();
                    this.$el.html(this.multiImageTemplate());
                } else {
                    this.$el.hide();
                }
            } else {
                this.$el.hide();
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