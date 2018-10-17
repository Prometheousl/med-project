const bluetooth = require('node-bluetooth');

const device = new bluetooth.DeviceINQ();

device.listPairedDevices(console.log);


device
  .on('finished', console.log.bind(console, 'finished'))
  .on('found', function found(address, name) {
    console.log('Found' + address + ' with name ' + name);
    if(address == '00:16:A4:49:43:93') {
      console.log("Found the medical device!");
      device.findSerialPortChannel(address, function(channel){
        console.log('Found RFCOMM channel for serial port on %s: ', name, channel);

        // make bluetooth connect to remote device
        bluetooth.connect(address, channel, function(err, connection){
          if(err) return console.error(err);

          connection.on('data', (buffer) => {
            console.log('received message:', buffer.toString());
          });

        });

      });
    }
  }).scan();
