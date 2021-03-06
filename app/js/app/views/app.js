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
    'views/undo_redo',
    'views/droptargets',
    'views/toast',
    'views/pic',
    
    
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
            UndoRedoView,
            DropTargetsView,
            ToastView,
            PicView,
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
            "click #load-demo": "loadDemoData",
            "click #clear-storage": "clearLocalStorage",
            "click .main-panel": "deselectAll",
            "keydown .project_name":  "noShortcuts",
        },
        
        initialize: function() {  
            
            // Make UI Components
                        
            this.tagPanel = new TagPanelView();
            this.actionBar = new ActionBarView();   
            this.previewOverlay = new PreviewOverlayView();
            this.tagOverlay = new TagOverlayView();
            this.groupOverlay = new GroupOverlayView();
            this.filterBox = new FilterBoxView();
            this.undoRedo = new UndoRedoView();
            this.dropTargetsView = new DropTargetsView();
            this.toastView = new ToastView();
            
            this.$el.keydown(_.bind(this.onKeypress, this));

            
            this.$main = $('#main');
            this.$footer = $('#footer-stats');
            
            PicSet.fetch();            
            GroupSet.fetch();
            GroupSet.each(function(group) { group.addPicListeners(); });
            GroupSet.each(function(group) { group.addSubgroupListeners(); });
            this.renderGroups();

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
            
            $("#filter_container").append(this.filterBox.$el);
            this.filterBox.render();

            $("#undo_redo_container").append(this.undoRedo.$el);
            this.undoRedo.render();

            $('#drop_targets_container').append(this.dropTargetsView.$el);
            this.dropTargetsView.render();

            $("#toast_container").append(this.toastView.$el);
            
            
            this.$('#filters a').removeClass('selected')
            .filter('[href="#/' + (Common.picFilter || '') + '"]')
            .addClass('selected');
          
            this.$('#group_container').sortable({
                handle: '.group-handle',
                connectWith: '.subgroups',
            });

            
        },
        
        addOne: function(pic) {
            var view = new PicView({model: pic});
            this.$('#pic-grid').append(view.render().el);
        },
        
        addAll: function() {
            PicSet.each(this.addOne, this);
        },
        
        addTopLevelGroup: function(group) {
            var view = new GroupView({model: group});
            this.$('#group_container').append(view.render().el);
        },
        
        renderGroups: function() {
            var rootGroup = GroupSet.rootGroup();
            
            // Root Children Debug Message
            
            // this.$('#root-kids').html(rootGroup.childrenString());
            // this.listenTo(rootGroup, "subgroupAdded", this.addTopLevelGroup);
            
            
            // Render top-level groups
            var topLevelGroups = rootGroup.getSubgroups();
            for (var i = 0; i < topLevelGroups.length; i++) {
                var group = topLevelGroups[i];
                if (!group) {
                    continue;
                }
                var view = new GroupView({model: group});
                this.$('#group_container').append(view.render().el);
            }
        },
        
        filterOne: function (pic) {
            pic.trigger('visible');
        },
        
        filterAll: function() {
            PicSet.each(this.filterOne, this);
        },
        
        createPic: function(e) {
            PicSet.create({title: "New Pic"});
        },
        
        createGroup: function(e) {
            var newGroup = GroupSet.create({name: "A New Group!"});
            GroupSet.rootGroup().addSubgroup(newGroup);
            var view = new GroupView({model: newGroup});
            this.$('#group_container').append(view.render().el);
        },
        
        clearLocalStorage: function() {
            DemoLoader.clearStorage();
        },
        
        deselectAll: function() {
            Common.deselectAll();
        },
        
        loadDemoData: function() {
            DemoLoader.loadDemo();
        },
        
        onKeypress: function(e) {
            console.log(e.keyCode);
            if (e.keyCode == 27) {
                // Escape
                Common.deselectAll();
                Backbone.trigger("closeModal");        
            } else if (e.keyCode == 32 || e.keyCode == 80 || e.keyCode == 13) {
                // Space
                Backbone.trigger("previewPics", Common.selectedPics);
                Common.deselectAll();
            } else if (e.keyCode == 83 || e.keyCode == 70) {
                // S or F
                this.actionBar.starClicked();
            }  else if (e.keyCode == 8) {
                // Backspace
                this.actionBar.deleteClicked();
                e.preventDefault();
            } else if (e.keyCode == 88) {
                // X 
                this.actionBar.deleteClicked();
            } else if (e.keyCode == 77 || e.keyCode == 71) {
                // M
                this.actionBar.groupClicked();
            } else if (e.keyCode == 84) {
                // X 
                this.actionBar.tagClicked();
            }
        },
      
        noShortcuts: function(e) {
            e.stopPropagation();  
        },
        
      
        
    });
    return AppView;
});