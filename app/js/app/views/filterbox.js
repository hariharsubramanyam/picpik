define([
    'jquery',
    'underscore',
    'backbone',
    'typeahead',
    'collections/tagset',
    'text!templates/filterbox.html',
    'common',
], function($, _, Backbone, 
            typeahead,
            TagSet,
            filterBoxTemplate, 
            Common) {
    /**
     * The View object for a Picture in the grid.
     * The view object is a div
     */
    var FilterBoxView = Backbone.View.extend({
        tagName: "div",
        
        template: _.template(filterBoxTemplate),
        
        events: {
            "click  #favorites_only" : "clickFavoritesOnly",
            "click  #show_deleted" : "clickDeleted",
            "change  .tag_choice" : "pickTag",
            "keypress .filter-field" : "keyPress",
            "blur .filter-field" : "onBlur",            
            'keyup .filter-field': 'keyUp',
            "click .tt-dropdown-menu" : "applyFilter",
            "keydown .filter-field":  "noShortcuts",
        },
        
        noShortcuts: function(e) {
            e.stopPropagation();  
        },
        
        initialize: function() {
            this.listenTo(Common, "filterTag", this.filterTag);
            
            this.listenTo(TagSet, 'all', this.render);      
            this.listenTo(Backbone, "filterToDeleted", this.filterToDeleted);
            this.listenTo(Backbone, "filterToFavorited", this.filterToFavorited);
            
            this.listenTo(Backbone, 'setCurrentFilterTag', _.bind(this.setCurrentFilterTag, this));            
        },
        
        setCurrentFilterTag: function(tagName) {
            var selection= tagName;
            var currentVal = this.$(".filter-field").val();
            this.$(".filter-field").val(tagName);
            if (currentVal == tagName) {
                Common.clearVisibleTags();   
                Common.setFavoritesOnly(false);
                Common.setDeletedOnly(false);
                $(".filter-field").val("");
                Backbone.trigger("showToast", "Filtering to All Photos");
            } else {
                Common.clearVisibleTags();   
                Common.setFavoritesOnly(false);
                Common.setDeletedOnly(false);
                
                console.log(selection);
                
                var tag = TagSet.findWhere({name: selection});
                if (tag) {
                    Common.setVisibleTag(tag);
                    Backbone.trigger("showToast", "Filtering to tag " + selection);
                } else {
                    // Bad value:
                    var selection = $(".filter-field").val("");
                }
            }
        },
        
        filterToDeleted: function(){
            if (this.$(".filter-field").val() == "Deleted") {
                this.$(".filter-field").val("");
                Backbone.trigger("showToast", "Filtering to All Photos");
            } else {
                this.$(".filter-field").val("Deleted");      
                Backbone.trigger("showToast", "Filtering to Deleted Photos");
            }
            this.applyFilter();
        },
        
        filterToFavorited: function(){
            if (this.$(".filter-field").val() == "Favorited") {
                this.$(".filter-field").val("");
                Backbone.trigger("showToast", "Filtering to All Photos");
            } else {
                this.$(".filter-field").val("Favorited");                
                Backbone.trigger("showToast", "Filtering to Favorited Photos");
            }
            this.applyFilter();
        },
        
        substringMatcher: function(strs) {
          return function findMatches(q, cb) {
            var matches, substringRegex;
         
            // an array that will be populated with substring matches
            matches = [];
         
            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');
         
            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
              if (substrRegex.test(str)) {
                // the typeahead jQuery plugin expects suggestions to a
                // JavaScript object, refer to typeahead docs for more info
                matches.push({ value: str });
              }
            });
         
            cb(matches);
          };
        },
        
        render: function() {
            this.$el.html(this.template());     
    
            var source = this.substringMatcher(this.choices());
            
            this.$(".filter-field").typeahead({
                hint: false,
                highlight: true,
                minLength: 1
            }, {
                name: 'states',
                displayKey: 'value',
                source: source,
            });
            
            var applyFilter = this.applyFilter;
            this.$(".filter-field").on("typeahead:selected", applyFilter);
            
            this.renderTagChoices();
            return this;
        },
        
        filterTag: function(tag) {
        },
        
        clickDeleted: function() {
            Common.setDeletedFilter(this.$("#show_deleted").is(":checked"));
        },
        
        clickFavoritesOnly: function() {
            Common.setFavoritesOnly(this.$("#favorites_only").is(":checked"));
        },
        
        keyPress: function(e) {
			if (e.which === Common.ENTER_KEY) {
				this.applyFilter();
			}
        },
        
        onBlur: function() {
            Backbone.trigger("showToast", "Filtering to SHOW tag " + $(".filter-field").val());              
		    this.applyFilter();
        },

        keyUp: function(e){
            if(this.$('.filter-field').val().length == 0){
                this.applyFilter();
            }
        },
        
        applyFilter: function() {
            Common.deselectAll();
            var selection = $(".filter-field").val();
            if(selection != "Deleted"){
                Backbone.trigger("notFilteredToDeleted");
            }
            if (selection === "All") {
                Backbone.trigger("showToast", "Filtering to All Photos");              
                Common.clearVisibleTags();   
                Common.setFavoritesOnly(false);
                Common.setDeletedOnly(false);
            } else if (selection == "Favorited" || selection == "favorited") {
                Backbone.trigger("showToast", "Filtering to Favorited Photos");                            
                Common.clearVisibleTags();
                Common.setFavoritesOnly(true);
                Common.setDeletedOnly(false);
            } else if (selection === "Deleted") {
                Backbone.trigger("showToast", "Filtering to Deleted Photos");              
                Common.clearVisibleTags();   
                Common.setFavoritesOnly(false);
                Common.setDeletedOnly(true);
            } else {
                Common.clearVisibleTags();   
                Common.setFavoritesOnly(false);
                Common.setDeletedOnly(false);
                console.log("selection: " + selection);
                var tag = TagSet.findWhere({name: selection});
              
                if (tag) {
                    Common.setVisibleTag(tag);
                } else {
                    // Bad value:
                    $(".filter-field").val("");
                }
            }
        },
        
        choices: function() {
            var choices = [];
            choices.push("All");
            choices.push("Favorited");
            choices.push("Deleted");
            TagSet.each(function(tag) {     
                var info = tag.toJSON();
                choices.push(tag.get("name"));
            }, this);
            return choices;
        },
    
        
        renderTagChoices: function() {
        },
        
        pickTag: function() {
            var tagId = this.$(".tag_choice").val();
            if (tagId == "all") {
                Common.clearVisibleTags();
            } else {
                var tag = TagSet.findWhere({tagId: parseInt(tagId)});
                Common.setVisibleTag(tag);
            }
        }
        
    });
    return FilterBoxView;
});