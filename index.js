const server = require('server');
const { get, post, put, del, error } = server.router;
const { json, status } = server.reply;
const user = require('./controllers/UserController');

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
server({ security: { csrf: false } }, routes).then(ctx => {
  	console.log(`Notikha server running on http://localhost:${ctx.options.port}/`);
});
