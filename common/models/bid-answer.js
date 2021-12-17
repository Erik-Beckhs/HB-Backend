'use strict';
var pubsub = require('../../server/pubsub.js');

module.exports = function(Bidanswer) {
    Bidanswer.observe('after save', function(ctx, next) {
        //socket.emit('/Sifeempresa/POST',ctx.instance);
        pubsub.publish('oferta', ctx.instance);
          //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
          next();
    });    
};

