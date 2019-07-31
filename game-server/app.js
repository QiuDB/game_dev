const pomelo = require('pomelo');
const bearcat = require('bearcat');

/**
 * Init app for client.
 */
let app = pomelo.createApp();
app.set('name', 'game_dev');

let Configure = function() {
  // app configuration
  app.configure('production|development', 'connector', function(){
    app.set('connectorConfig',
      {
        connector : pomelo.connectors.hybridconnector,
        heartbeat : 3,
        useDict : true,
        useProtobuf : true
      });
  });

  // app configuration
  app.configure('production|development', 'auth', function() {
    app.set('authConfig', require('./config/auth.json'));
  })
}

// https://github.com/bearcatjs/treasures
let contextPath = require.resolve('./context.json');
bearcat.createApp([contextPath], {
  BEARCAT_LOGGER: "off", //这边应设置为 off，否则 由于 bear 还没加载完，会生成 undefined 名字的 log，并且所有日志会写入到这个 undefined 文件里
  BEARCAT_HOT: "on",// 开启热更新，如果是off 那么不会热更新
  BEARCAT_FUNCTION_STRING: true
});

bearcat.start(function() {
  Configure(); // pomelo configure in app.js
  app.set('bearcat', bearcat);
  app.start(); // start app
})


process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
