define([
    'jquery',
    'underscore',
    'backbone',
    'collections/picset',
    'collections/groupset',
    'views/pic',
    'views/group',
    'views/navbar',
    'text!templates/stats.html',
    'common'
], function($, _, Backbone, PicSet, GroupSet, PicView, GroupView, NavBarView, statsTemplate, Common) {
    /**
     * The top-level piece of UI for the App.
     */
    var AppView = Backbone.View.extend({
        el: "#picpicapp",
        
        statsTemplate: _.template(statsTemplate),
        
        events: {
            "click #add-group": "createGroup"
        },
        
        initialize: function() {  
            this.listenTo(PicSet, 'add', this.addOne);
            this.listenTo(PicSet, 'reset', this.addAll);
            this.listenTo(PicSet, 'all', this.render);
            this.listenTo(PicSet, 'change:completed', this.filterOne);
            this.listenTo(PicSet, 'filter', this.filterAll);
            
            
            this.listenTo(GroupSet, 'add', this.addOneGroup);
            this.listenTo(GroupSet, 'reset', this.addAllGroups);
            
            this.navBar = new NavBarView();
            console.log(this.navBar);
            
            this.$main = $('#main');
            
            this.$footer = $('#footer-stats');
            
            PicSet.fetch();
            GroupSet.fetch();
        },
        
        render: function() {            
            var deleted = PicSet.deleted().length;
            var favorited = PicSet.favorited().length;
                        
            this.$footer.html(this.statsTemplate({
                num_favorited: favorited,
                num_deleted: deleted
            }));
            
            $("#navBarContainer").append(this.navBar.$el);
            this.navBar.render();
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
        
    });
    return AppView;
});