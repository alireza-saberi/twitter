/*
* @Author: Ali
* @Date:   2016-10-21 22:07:55
* @Last Modified by:   alireza-saberi
* @Last Modified time: 2016-10-24 14:24:59
*/

module.exports = function(grunt) {

    grunt.initConfig({
        
        jshint: {
          files: ['Gruntfile.js', 'app/js/**/*.js'],
          options: {
            globals: {
              jQuery: true
            }
          }
        },

        concat: {
            js: {
                src: ['app/js/*.js', 'node_modules/jquery/dist/jquery.js','node_modules/bootstrap/dist/js/bootstrap.js','node_modules/angular/angular.js'],
                dest: 'dist/js/script.min.js'
            },
            css: {
                src: ['app/css/*.css', 'node_modules/bootstrap/dist/css/bootstrap.css'],
                dest: 'dist/css/style.min.css'
            }
        },

        uglify: {
            ugly: {
                src: 'dist/js/script.min.js',
                dest: 'dist/js/script.min.js'
            }
        },

        cssmin: {
            options: {
                        shorthandCompacting: false,
                        roundingPrecision: -1
            },
            mytarget: {
                src:'dist/css/style.min.css',
                dest: 'dist/css/style.min.css'
            }
        },

        /* PROCESS THE SPECIAL COMMENTS IN THE HTML */
        processhtml: {
            replaceScriptLinks: {
                files: {
                    './dist/index.html': ['./app/index.html']
                }
            }
        },

        /* Copy images to img folder without change*/
        /*TODO: images need to get optimzed for web application later*/
        copy: {
            main: {
                cwd: 'app/img',
                expand: true,
                src:'*',
                dest:'dist/img'
            }
        },

        watch: {
            options:{
                livereload:{
                    host: 'localhost',
                    port: 3000
                }
            },
            html: {
                files: ['app/index.html'],
                tasks: ['processhtml']
            },
            css: {
                files: ['app/css/*.*'],
                tasks: ['concat:css', 'cssmin']
            },
            js: {
                files: ['app/js/*.*'],
                tasks: ['concat:js' ,'uglify']
            },
            img: {
                files: ['app/img/*.*'],
                tasks: ['copy']
            },

        }
        });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'processhtml', 'copy']);

};