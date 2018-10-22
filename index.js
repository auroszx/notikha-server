const server = require('server');
const { get, post, put, del, error } = server.router;
const { json, status, header } = server.reply;
const user = require('./controllers/UserController');

const cors = [
  ctx => header("Access-Control-Allow-Origin", "*"),
  ctx => header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"),
  ctx => ctx.method.toLowerCase() === 'options' ? 200 : false
];

var routes = [

	// User routes
	get('/user/:id', async ctx => {
		return json(await user.getUser(parseInt(ctx.params.id), ctx.headers.authorization));
	}),

	post('/user/create', async ctx => {
		return json(await user.addUser(ctx.data.username, ctx.data.fullname, ctx.data.password, ctx.data.email));
	}),

	post('/user/login', async ctx => {
		return json(await user.login(ctx.data.username, ctx.data.password));
	}),

	// Error handling
	error(ctx => status(500).send(ctx.error.message))

];


// Running the server
server({ security: { csrf: false } }, cors, routes).then(ctx => {
  	console.log(`Notikha server running on http://localhost:${ctx.options.port}/`);
});
