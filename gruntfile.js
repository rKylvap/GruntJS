var fs = require('fs'),
    request = require('request');

module.exports = function(grunt){
    //Config

   grunt.initConfig({
       srcFiles: ['src/a.js', 'src/b.js', 'src/c.js'],

       build: {
           dir: 'build/',
           file: 'abc.js',
           min: 'abc.min.js'
       },

       destFile: '<%= build.dir %>'.concat('/'.concat('<%=build.file %>')),

       minFile: '<%= build.dir %>'.concat('/'.concat('<%=build.min %>')),

       clean: {
           target1: {
               src: '<%= build.dir %>'
           }
       },

        copy: {
            target1: {
                files: {
                    'dest/text1.txt': 'src/text1.txt',
                    'dest/text2.txt': 'src/text2.txt'
                }
            },
            target2: {
                files: {
                    'dest/text3.txt': 'src/text3.txt',
                    'dest/text4.txt': 'src/text4.txt'
                }
            }
        },

        //build: {
        //    main: {},
        //    extra: {}
        //},
        //test: {
        //    main: {},
        //    extra: {}
        //},

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            target1: 'src/**/*.js'
        },

        concat: {
            target1:{
                options: {
                    separator: ';'
                },
                files: {
                    '<%= destFile %>':  '<%= srcFiles %>'
                }
            }
        },

       uglify: {
           compress: {
               options: {
                   mangle: {
                       toplevel: true,
                       eval: true,
                       sort: true,
                       props: true
                   },
                   compress: {
                       join_vars: true,
                       unsafe: true
                   }
               },
               files: [{
                   expand: true,
                   cwd: '<%= build.dir %>',
                   src: ['**/*.js'],
                   dest: '<%= build.dir %>',
                   ext: '.min.js',
                   extDot: 'first'
               }]
           }
       },

        watch: {
            target1: {
                files: '<%= srcFiles %>',
                tasks: ['concat', 'uglify']
            }
        }
    });

    grunt.registerTask('log-deploy', function(){
        var _message = 'Deployment on ' + new Date();

        fs.appendFileSync('deploy.log', _message + '\n');

        grunt.log.writeln('Appended " ' + _message + '"');
    });

    //grunt object

    grunt.registerTask('foo', function(){
        console.log('My task "%s" has arguments %j', this.name, this.args);
    });

    //tasks aliasing

    grunt.registerTask('build', console.log.bind(console, 'Building....'));
    grunt.registerTask('test', console.log.bind(console, 'Testing....'));
    grunt.registerTask('upload', console.log.bind(console, 'Uploading....'));

    grunt.registerTask('deploy', ['build', 'test', 'upload']);

    //Multitasks

    grunt.registerMultiTask('copy', function(){
        this.files.forEach(function(file){
            grunt.file.copy(file.src, file.dest);
        });

        grunt.log.writeln('Copied ' + this.files.length + ' files. Target>>> ' + this.target);
    });

    grunt.registerMultiTask('build', console.log.bind(console, 'Building...'));
    grunt.registerMultiTask('test', console.log.bind(console, 'Testing...'));

    //grunt.registerTask('default', ['build:main', 'test:main']);

    //Asynchronous tasks

    grunt.registerTask('webget', function(){
        var _done = this.async(),
            _url = 'https://raw.github.com/jpillora/gswg-examples/master/README.md';

        request(_url, function(err, res, content){
            if(err){
                _done(err);
            } else if(res.statusCode !== 200){
                _done(new Eror('Not Ok!'))
            }else {
                grunt.file.write('FILE.md', content);
                grunt.log.ok('FILE.md successfully created!');

                _done();
            }
        });
    });

    //Programmatically run task

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('check', function(){
        if(grunt.file.exists('.jshintrc')){
            grunt.task.run('jshint');
        }
    });

    //Automatically

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['clean', 'concat', 'uglify', 'watch']);
};
