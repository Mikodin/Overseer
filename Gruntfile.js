module.exports = function(grunt) {
  require('time-grunt')(grunt);

  require('load-grunt-tasks')(grunt, {
    pattern: ['grunt-*', '!grunt-log-headers']
  });

  require('grunt-log-headers')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    newer: {
      options: {
        gruntLogHeader: false
      }
    },
    'newer-postrun': {
      options: {
        gruntLogHeader: false
      }
    },
    clean: {
      src: [
        'app/public/*.css',
        'app/public/*.js',
        'app/public/minified/**/*.css',
        'app/public/minified/**/*.js'
      ]
    },
    jshint: {
      src: [
          'server.js',
          'api/models/*.js',
          'api/controllers/*.js',
          'api/middlewares/*.js',
          'api/helpers/*.js',
          'api/services/*.js',

          'app/common/**/*.js',
          'app/login/**/*.js',
          'app/dashboard/**/*.js'

      ],
      options: {
        reporter: require('jshint-stylish'),
        globals: {
          jQuery: true,
          console: true
        }
      },

    },
    jscs: {
      src: [
          'server.js',
          'api/models/*.js',
          'api/controllers/*.js',
          'api/middlewares/*.js',
          'api/helpers/*.js',
          'api/services/*.js',

          'app/common/**/*.js',
          'app/login/**/*.js',
          'app/dashboard/**/*.js'
      ],
      options: {
        "config": ".jscsrc",
        "preset": "google",
        "maximumLineLength": 160,
        "validateIndentation": 2,
        "disallowMultipleVarDecl": false,
        "requireCamelCaseOrUpperCaseIdentifiers": "ignoreProperties",
        "requireCapitalizedComments": false,
        "fix": false 
      }
    },
    ngAnnotate: {
        angular_app: {
            files: {
              'app/public/app.js': [
                'app/app.js',
                'app/ApiConfigInfo.js',
                'app/common/**/*.js',
                'app/common/**/**/*.js',
                'app/common/**/**/**/*.js',
                'app/login/**/*.js',
                'app/dashboard/**/*.js',
              ]
            }
        },
    },
    uglify: {
      options: {
        banner: '/* <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap: false,
        beautify: true,
        mangle: false
      },
      base: {
        files: {
          'app/public/minified/js/base.js': [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/datatables.net/js/jquery.dataTables.js',
            'bower_components/datatables.net-bs/js/dataTables.bootstrap.js',
            'bower_components/datatables.net-responsive/js/dataTables.responsive.js',
            'bower_components/datatables.net-responsive-bs/js/responsive.boostrap.js',
            'app/assets/js/jquery.dataTables.columnFilter.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-datatables/dist/angular-datatables.js',
            'bower_components/angular-datatables/dist/plugins/bootstrap/angular-datatables.js',
            'bower_components/angular-datatables/dist/plugins/columnfilter/angular-datatables.columnfilter.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-ui-router-title/angular-ui-router-title.js',
            'bower_components/angular-loader/angular-loader.js',
            'bower_components/angular-bootstrap/ui-bootstrap.js',
            'app/assets/js/ui-bootstrap-tpls-1.3.3.js',
            'app/assets/js/angular-vertilize.js',
            'bower_components/angular-bootstrap-show-errors/src/showErrors.js',
            'bower_components/angular-vertilize/angular-vertilize.js',
            'bower_components/angular-datatables/dist/angular-datatables.js',
            'bower_components/angular-datatables/dist/plugins/bootstrap/angular-datatables.js',
            'bower_components/angular-datatables/dist/plugins/columnfilter/angular-datatables.columnfilter.js',
            'bower_components/angular-datatables/dist/plugins/scroller/angular-datatables.scroller.js',
            'bower_components/angular-scroll/angular-scroll.js',
            'bower_components/angular-confirm-modal/angular-confirm.js',
            'bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js',
            'bower_components/ng-scrollbars/dist/scrollbars.min.js',
            'bower_components/bootstrap-material-design/scripts/material.js',
            'bower_components/bootstrap-material-design/scripts/ripples.js'
          ]
        }
      },
      app: {
        files: {
          'app/public/minified/js/app.js': [
            'app/public/app.js'
          ]
        }
      }
    },
    less: {
      base: {
        options: {
          paths: ["app/assets/less"]
        },
        files: {
          'app/public/less.css': [
            'bower_components/bootstrap-material-design/less/bootstrap-material-design.less',
            'bower_components/bootstrap-material-design/less/ripples.less',
            'app/assets/less/styles.less'
          ]
        }
      }
    },
    cssmin: {
      options: {
        banner: '/* <%= grunt.template.today("yyyy-mm-dd") %> */',
        root: './app/'
      },
      base: {
        files: {
          'app/public/minified/css/base.css': [
            'bower_components/bootstrap/dist/css/bootstrap.css',
            'bower_components/font-awesome/css/font-awesome.css',
            'bower_components/datatables.net-bs/css/dataTables.bootstrap.css',
            'bower_components/datatables.net-responsive-bs/css/responsive.boostrap.css',
            'bower_components/datatables.net-scroller-bs/css/scroller.bootstrap.css',
            'bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css',
            'bower_components/angular-bootstrap/ui-bootstrap-csp.css',
            'app/public/less.css'
          ]
        }
      }
    },
    watch: {
      scripts: {
        files: [
          'server.js',
          'api/**/*.js',
          'app/app.js',
          'app/common/**/*.js',
          'app/common/**/**/*.js',
          'app/common/**/**/**/*.js',
          'app/**/**/*.js',
          'app/**/*.js'
                   ],
                   tasks: ['default'],
                   options: {
                   spawn: false,
                   },
                   },
                   styles: {
                   files: [
                   'app/assets/less/*.less',
                   'app/assets/less/theme/*.less',
                                       ],
                                       tasks: ['less', 'cssmin'],
                                       options: {
                                       spawn: false,
                                       },
                                       },
                                       }
                                       });

                                       grunt.registerTask('default', [
                                       'newer:jshint',
                                       'ngAnnotate:angular_app',
                                       'newer:uglify',
                                       'newer:less',
                                       'newer:cssmin',
                                       'newer:jscs'
                                       ]);

                                       grunt.registerTask('lint', [
                                       'jshint',
                                       'jscs',
                                       ]);
                                       }
