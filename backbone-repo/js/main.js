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
        }
    },
    paths: {
        jquery: '../lib/jquery',
        underscore: '../lib/underscore',
        backbone: '../lib/backbone',
        backboneLocalstorage: '../lib/backbone.localStorage',
        text: '../lib/requirejs-text'
    }
});

require([
    'backbone',
    'views/app',
    'routers/router'
], function(Backbone, AppView, Workspace) {
    // Start routing and Backbone.history()
    new Workspace();
    Backbone.history.start();
    
    // Initialize the application view
    var appView = new AppView();   
    console.log(appView);
});