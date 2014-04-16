define([
    'jquery',
    'underscore',
    'backbone',
    'collections/picset',
    'collections/groupset',
    'collections/tagset',
    
    'views/group',
    'views/tagpanel',
    'views/actionbar',
    'views/previewoverlay',
    'views/tagoverlay',
    'views/groupoverlay',
    'views/filterbox',
    
    'demo-loader',
    'text!templates/stats.html',
    'common'
], function($, _, Backbone, PicSet, GroupSet, TagSet, GroupView,
            TagPanelView, 
            ActionBarView, 
            PreviewOverlayView, 
            TagOverlayView,
            GroupOverlayView,
            FilterBoxView,
            DemoLoader,
            statsTemplate, Common) {
    /**
     * The top-level piece of UI for the App.
     */
    var AppView = Backbone.View.extend({
        el: "#picpicapp",
        
        statsTemplate: _.template(statsTemplate),
        
        events: {
            "click #add-group": "createGroup",
            "click #load-demo": "loadDemoData"            
        },
        
        initialize: function() {  
            //this.listenTo(PicSet, 'add', this.addOne);
            //this.listenTo(PicSet, 'reset', this.addAll);
            //this.listenTo(PicSet, 'all', this.render);
            //this.listenTo(PicSet, 'change:completed', this.filterOne);
            //this.listenTo(PicSet, 'filter', this.filterAll);
            
            
            this.listenTo(GroupSet, 'add', this.addOneGroup);
            this.listenTo(GroupSet, 'reset', this.addAllGroups);
            
            this.tagPanel = new TagPanelView();
            this.actionBar = new ActionBarView();   
            this.previewOverlay = new PreviewOverlayView();
            this.tagOverlay = new TagOverlayView();
            this.groupOverlay = new GroupOverlayView();
            this.filterBox = new FilterBoxView();

            
            this.$main = $('#main');
            
            this.$footer = $('#footer-stats');
            
            PicSet.fetch();            
            GroupSet.fetch();
            GroupSet.each(function(group) { group.addPicListeners(); });

        },
        
        render: function() {            
            var deleted = PicSet.deleted().length;
            var favorited = PicSet.favorited().length;
                        
            this.$footer.html(this.statsTemplate({
                num_favorited: favorited,
                num_deleted: deleted
            }));
                        
            $("#tag_div").append(this.tagPanel.$el);
            this.tagPanel.render();
            
            $("#actionbar_container").append(this.actionBar.$el);
            this.actionBar.render();
            
            $("#preview_overlay_container").append(this.previewOverlay.$el);
            this.previewOverlay.render();
            
            $("#tag_overlay_container").append(this.tagOverlay.$el);
            this.tagOverlay.render();
            
            $("#group_overlay_container").append(this.groupOverlay.$el);
            this.groupOverlay.render();
            
            $("#search_div").append(this.filterBox.$el);
            this.filterBox.render();
            
            
            this.$('#filters a').removeClass('selected')
            .filter('[href="#/' + (Common.picFilter || '') + '"]')
            .addClass('selected');
            
        },
        
        addOne: function(pic) {
            var view = new PicView({model: pic});
            this.$('#pic-grid').append(view.render().el);
        },
        
        addAll: function() {
            PicSet.each(this.addOne, this);
        },
        
        addOneGroup: function(group) {
            var view = new GroupView({model: group});
            this.$('#group_container').append(view.render().el);
        },
        
        addAllGroups: function() {
            GroupSet.each(this.addOneGroup, this);
        },
        
        filterOne: function (pic) {
            pic.trigger('visible');
        },
        
        filterAll: function() {
            PicSet.each(this.filterOne, this);
        },
        
        createPic: function(e) {
            console.log('create pic!');
            PicSet.create({title: "New Pic"});
        },
        
        createGroup: function(e) {
            console.log('create group!');
            GroupSet.create({name: "A New Group!"});
        },
        
        loadDemoData: function() {
            DemoLoader.loadDemo();
        }
        
    });
    return AppView;
});