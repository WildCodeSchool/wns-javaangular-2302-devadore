module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['Jasmine', 'AngularCli'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-jasmine-html-reporter'),
        require('karma-coverage'),
        require('@angular-devkit/build-angular/plugins/karma')
      ],
      client: {
        clearContext: false
      },
      jasmineHtmlReporter: {
        suppressAll: true
      },
      coverageReporter: {
        dir: require('path').join(__dirname, './coverage/client'),
        reporters: [{ type: 'html' }, { type: 'text-summary' }]
      },
      angularCli: {
        environment: 'dev'
      },
      reporters: ['progress', 'kjhtml'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['Chrome', 'ChromeHeadless'],
      singleRun: false,
      restartOnFileChange: true, 
      customLaunchers: {
        ChromeHeadlessCI: {
          base: 'ChromeHeadless',
          flags: ['--no-sandbox', '--disable-gpu'] 
        }
      },
    });
  };
  