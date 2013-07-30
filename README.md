# Pi == Processing ideas

Processing ideas (alpha)  
The Processing ide web application http://www.processingideas.com/  
Languages: Javascript + Php  

## The first idea
Pi is dedicated to Processing creatives. It aims to provide a comfortable space to create, exhibit and share interactive works, drawings and animations written in the [Processing](http://processing.org/) language (Java-like).  
Pi uses [Processing JS](http://processingjs.org/),the javascript port of Processing, allowing users to code in javascript as well.  
Other libraries could be added in the future (some examples are [Paper.js](http://paperjs.org/), [Raphael.js](http://raphaeljs.com/), [Three.js](http://threejs.org/)), mixing all these amazing possibilities together within a common environment.  
If you can embed a YouTube video or an swf Flash file in any web page, why shouldn't be as easy to embed a Processing sketch or any other canvas based application?  


## Browser support
Processing sketches are drawn on the canvas element: canvas support is mandatory.
Performance is a big concern, since Pi somehow emulates a multitasking desktop environment and should still have enough resources to smoothly play one or more sketches. Browser support will not be a concern then... we simply target modern browsers and recommend the latest.
Supported browsers: IE9+ (not for long), Chrome 23+, Firefox 12+, Opera 12+, Safari 5.1+.  
Recommended browsers: Chrome 26+, Firefox 16+, IE 10+, Opera 12.10+, Safari 6+.
The best performance at the moment is offered by Webkit browsers (Chrome and Safari).

## Mobile app and site
Pi does not support mobile devices at the moment. A responsive, mobile-friendly and touch site (or a mobile app) will probably be done in the future.  


## Features

#### DONE @ 90%
- Desktop-like development environment.
- Original Processing ide interface emulation with tabs.
- Ide error console.
- Live code.
- Javascript mode (read-only).
- Auto save.
- Auto resize sketches to fit the screen.
- Full-screen presentation mode.
- Play-pause sketches.
- Secured log in and sign up processes.


## Credits
Author: taseenb ([Esteban Almiron](http://www.estebanalmiron.com))  

Pi uses open source software:  
- [Processing JS](http://processingjs.org/)
- [Jquery](http://jquery.com/)
- [Require.js](http://requirejs.org/)
- [Underscore.js](http://underscorejs.org/)
- [Backbone.js](http://backbonejs.org/)
- [Jquery UI](http://jqueryui.com/)
- [Ace](http://ace.ajax.org/)
- [Yii](http://www.yiiframework.com/)

And others that you can find in the /scripts/ and /scripts/lib/ directories.  

