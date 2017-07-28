const dgram = require('dgram'),
      http = require('http'),
      config = require('./config.json'),
      fs = require('fs');

var tmpl = fs.readFileSync(config.tmpl, 'utf-8').replace(/{{ *test_host *}}/, config.testhost)

var dns_server = dgram.createSocket('udp4');
var quires = [];

var log = msg => console.log(`${Date.now()} ${msg}`)

var dns_hndl = (req, remote) => {
  try {
    var query_name = req.slice(12, req.length - 4).toString(),
         client_adddr = remote.address;
    log(`Got ${query_name}: from ${client_adddr}`)
    quires.push({query_name, client_adddr});
  } catch (e) { log(`DNS Handler Error: ${e}`); }
};

dns_server.on('message', dns_hndl);
dns_server.bind(config.dnsport);

var httpd = http.createServer((req, res) => {
  var path = req.url;
  log(`Got HTTP on ${path}`)
  if (path.match(/^\/getToken[\/]?$/)) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({token: Math.random().toString(36).substring(2)}));
  }
  if (path.match(/^\/getAddress\/[^\/]+$/)) {
    var token = /^\/getAddress\/([^\/]+)$/.exec(path)[1];
    var addrs = quires.filter(q => q.query_name.includes(token)).map(q => q.client_adddr);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(addrs));
  }
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(tmpl);
});

httpd.listen(config.httpport);
