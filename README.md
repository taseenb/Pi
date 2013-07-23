Pi == Processing ideas
==============================
Processing ideas (alpha)<br>
The Processing ide web application http://www.processingideas.com/<br>
Languages: Javascript + Php<br>

<h2>The first idea</h2>
Pi is a web tool dedicated to Processing creatives. It aims to provide a web space to create, exhibit and share interactive works, drawings and animations written in the Processing http://processing.org/ language.<br>
Pi uses the javascript port of Processing http://processingjs.org/ allowing users to code in javascript as well.<br>
Other libraries could be added in the future (imagine Paper.js http://paperjs.org/ or Raphael.js http://raphaeljs.com/), mixing all these possibilities together within a common environment.<br>
If you can embed a YouTube video or an swf Flash file in any web page, why shouldn't be as easy to embed a Processing sketch or any other canvas based application?

<h2>Browser compatibility</h2>
Processing sketches are drawn on the canvas element: canvas support is mandatory.<br>
Only modern browsers are supported: IE9+ (i'll only target 10+ soon), Chrome 23+, Firefox 12+, Opera 12+, Safari 5.1+.

<h2>Mobile app and site</h2>
Pi does not support mobile devices at the moment. A responsive, mobile-friendly and touch site (or a mobile app) will probably be done in the future.

<h2>Installation</h2>
Installation instructions will be available soon.
Please see the notes [1] [2]

<h2>Builds</h2>
There are no builds available, yet.

<h2>Credits</h2>
Author: Esteban Almiron http://www.estebanalmiron.com
Pi uses open source software:<br>
- Processing JS http://processingjs.org/<br>
- Jquery http://jquery.com/<br>
- Require.js http://requirejs.org/
- Underscore.js http://underscorejs.org/
- Backbone.js http://backbonejs.org/
- Jquery UI http://jqueryui.com/<br>
- Ace http://ace.ajax.org/
- Yii http://www.yiiframework.com/

And others that you can find in the /scripts/ and /scripts/lib/ directories.


<h2>Notes</h2>
1. In order to install Pi, you need a copy of the Yii framework https://github.com/yiisoft/yii installed in a directory. The latest stable version of the 1.1.x series will be supported.<br>
2. Yii framework folder does not need to be installed under a Web-accessible directory. A Yii application has one entry script which is usually the only file that needs to be exposed to Web users. Other PHP scripts, including those from Yii, should be protected from Web access; otherwise they might be exploited by hackers. (From Yii docs)
<br>
3. Pi distribution should run "out of the box" on a LAMP environment, but it is easy to install on other platforms. The only difference should be the URL rewrite setup.<br>
For Nginx, please read this basic information:http://www.yiiframework.com/doc/guide/1.1/en/quickstart.apache-nginx-config<br>
For Windows Server, please translate the .htaccess file in the root directory to a web.config file.<br>
