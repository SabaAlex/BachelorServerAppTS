var koa = require('koa');
var app = module.exports = new koa();
const server = require('http').createServer(app.callback());
const WebSocket = require('ws');
const wss = new WebSocket.Server({server});
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');

app.use(bodyParser());

app.use(cors());

app.use(middleware);

function middleware(ctx, next) {
  const start = new Date();
  return next().then(() => {
    // const ms = new Date() - start;
    // console.log(`${start.toLocaleTimeString()} ${ctx.request.method} ${ctx.request.url} ${ctx.response.status} - ${ms}ms`);
  });
}

const broadcast = (data) =>
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });

const router = new Router();

router.get('/test', ctx => {
  ctx.response.body = "Request Works";
  ctx.response.status = 200;
});

router.post('/hrReading', ctx => {
  const headers = ctx.request.body;
  const hrReading = headers.hrReading;

  if(hrReading != null){
    console.log(`Heart rate reading: ${hrReading}`)
    broadcast(hrReading);
  }
  else{
    console.log("Missing or invalid fields!");
    ctx.response.body = {text: 'Missing or invalid fields!'};
    ctx.response.status = 404;
  }
});


app.use(router.routes());
app.use(router.allowedMethods());

server.listen(8080);