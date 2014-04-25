require.config({
	// The shim config allows us to configure dependencies for
	// scripts that do not call define() to register a module
    baseUrl: 'js/app',
    
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        backboneLocalstorage: {
            deps: ['backbone'],
            exports: 'Store'
        },
        jqueryGridly: {
            deps: ['jquery'],
            exports: 'Gridly'
        },
        jqueryUI: {
            deps: ['jquery']
        },
        freewall: {
            deps: ['jquery'],
            exports: 'freewall'
        },
        facebox: {
            deps: ['jquery'],
            exports: 'facebox'
        },
        typeahead: {
            deps: ['jquery'],
            exports: 'typeahead'
        },
        bootstrap: {
            deps: ['jquery']
        }
    },
    paths: {
        jquery: '../lib/jquery',
        jqueryUI: '../lib/jquery-ui',
        underscore: '../lib/underscore',
        backbone: '../lib/backbone',
        backboneLocalstorage: '../lib/backbone.localStorage',
        text: '../lib/requirejs-text',
        jqueryGridly: '../lib/jquery.gridly',
        freewall: '../lib/freewall',
        facebox: '../lib/facebox',
        typeahead: '../lib/typeahead.bundle',
        bootstrap: '../../css/bootstrap/dist/js/bootstrap'
    }
});

require([
    'backbone',
    'views/app',
    'routers/router',
    'demo-loader',
], function(Backbone, AppView, Workspace, DemoLoader) {
    // Uncomment this to clear the database if everything fucks up:
    //localStorage.clear();

     
    // Start routing and Backbone.history()
    new Workspace();
    Backbone.history.start();
    
    // Initialize the application view
    var appView = new AppView();  
    appView.render();
    
    DemoLoader.checkFirst();
});