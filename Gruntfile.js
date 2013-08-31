module.exports = function(grunt) {

    // Project and task configuration
    grunt.initConfig({
	less: {
	    development: {
		options: {
		    compress: true,
		    optimization: 2
		},
		files: {
		    "themes/classic/css-dev/bootstrap.css": "themes/classic/less/bootstrap.less",
		    "themes/classic/css-dev/responsive.css": "themes/classic/less/responsive.less"
		}
	    }
	},
	watch: {
	    styles: {
		files: [
		    'themes/classic/less/*.less'
		],
		tasks: ['less'],
		options: {
		    nospawn: true
		}
	    }
	}
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-contrib-concat');

    // Define tasks
    grunt.registerTask('default', ['watch']);

};