define([
    'jquery',
    'underscore',
    'backbone',
    'common'
], function($, _, Backbone, Common){
    'use strict';

    var UndoManager = Backbone.Model.extend({
        commandStack: undefined,
        index: undefined,
        undoManagerContext: false,

        initialize: function () {
            this.commandStack = [];
            this.set({index: -1});
        },
        
        callCommand: function (command) {
            if (!command) {
                return;
            }
            this.undoManagerContext = true;
            command.f.apply(command.o, command.p);
            this.undoManagerContext = false;
        },

        register: function(undoObj, undoFunc, undoParamsList, undoMsg, redoObj, redoFunc, redoParamsList, redoMsg){
            if (this.undoManagerContext) {return;}
            this.commandStack.splice(this.get('index') + 1, this.commandStack.length - this.get('index'));
            
            this.commandStack.push({
                undo: {o: undoObj, f: undoFunc, p: undoParamsList, m: undoMsg},
                redo: {o: redoObj, f: redoFunc, p: redoParamsList, m: redoMsg}
            });

            this.set({index: this.commandStack.length - 1});
        },

        undo: function(){
            var command = this.commandStack[this.get('index')];
            if (!command) {return;}
            this.callCommand(command.undo);
            this.set({index: this.get('index') - 1});
        },

        redo: function(){
            var command = this.commandStack[this.get('index') + 1];
            if (!command) {return;}
            this.callCommand(command.redo);
            this.set({index: this.get('index') + 1});   
        },

        clear: function(){
            this.initialize();
        },

        hasUndo: function(){
            return this.get('index') !== -1;
        },

        hasRedo: function(){
            return this.get('index') < (this.commandStack.length - 1);
        },

        peekUndoMessage: function(){
            var command = this.commandStack[this.get('index')];
            if (!command) {return null;}
            return command.undo.m;
        },

        peekRedoMessage: function(){
            var command = this.commandStack[this.get('index') + 1];
            if (!command) {return null;}
            return command.redo.m;
        },

        setCallback: function(){
            this.callback = callbackFunc;
        }  
    });

    return new UndoManager();

});
/*
LICENSE

The MIT License

Copyright (c) 2010-2011 Arthur Clemens, arthur@visiblearea.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions: 

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/