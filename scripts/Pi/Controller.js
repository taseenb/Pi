define([
    'backbone', 'underscore'

], function(Backbone, _) {

    var Controller = Backbone.Controller = function(options) {
//	this.cid = _.uniqueId('controller');
//	this._configure(options || {});
    }

    // Add extend (inheritance) functionality to the Controller class
    Controller.extend = Backbone.Model.extend;

    return Backbone;

});