/**
 * http://usejsdoc.org/
 */

// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {		

    'facebookAuth' : {
        'clientID'      : '539529792872325', // your App ID
        'clientSecret'  : 'c5ecab202a5fb9fdcc3c431d3c61a98a', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    }
/*
    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }
    */

};