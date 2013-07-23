Pi
==============================
Processing ideas (Pre-Alpha)<br>
The Processing multitasking environment website http://www.processingideas.com/<br>
Languages: Javascript + Php<br>


<h2>Installation</h2>
Installation instructions will be available soon.
<br>
Please see the notes [1] [2]

<h2>Credits</h2>
Pi uses open source software:<br>
- Processing JS http://processingjs.org/<br>
- Jquery http://jquery.com/<br>
- Require.js http://requirejs.org/
- Underscore.js http://underscorejs.org/
- Backbone.js http://backbonejs.org/
- Jquery UI http://jqueryui.com/<br>
- Ace http://ace.ajax.org/
- Yii http://www.yiiframework.com/ 


<h2>Notes</h2>
1. Yii framework folder does not need to be installed under a Web-accessible directory. A Yii application has one entry script which is usually the only file that needs to be exposed to Web users. Other PHP scripts, including those from Yii, should be protected from Web access; otherwise they might be exploited by hackers. (From Yii docs)
<br>
2. Pi distribution should run "out of the box" on a LAMP environment, but it is easy to install on other platforms. The only difference should be the URL rewrite setup.<br>
For Nginx, please read this basic information:http://www.yiiframework.com/doc/guide/1.1/en/quickstart.apache-nginx-config<br>
For Windows Server, please translate the .htaccess file in the root directory to a web.config file.<br>
