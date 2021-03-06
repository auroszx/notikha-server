const server = require('server');
const { get, post, put, del, error } = server.router;
const { json, status, header } = server.reply;
const user = require('./controllers/UserController');
const notes = require('./controllers/NotesController');

const cors = [
  ctx => header("Access-Control-Allow-Origin", "*"),
  ctx => header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, authorization"),
  ctx => header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"),
  ctx => ctx.method.toLowerCase() === 'options' ? 200 : false
];

var routes = [

	// User routes
	get('/user', async ctx => {
		return json(await user.getUser(ctx.headers.authorization));
	}),

	post('/user/create', async ctx => {
		return json(await user.addUser(ctx.data.username, ctx.data.fullname, ctx.data.password, ctx.data.email));
	}),

	post('/user/login', async ctx => {
		return json(await user.login(ctx.data.username, ctx.data.password));
	}),


	// Notes routes
	get('/notes/user', async ctx => {
		return json(await notes.getNotesByUser(ctx.headers.authorization));
	}),

	get('/notes/:id', async ctx => {
		return json(await notes.getNote(parseInt(ctx.params.id), ctx.headers.authorization));
	}),

	post('/notes/create', async ctx => {
		return json(await notes.createNote(ctx.data.note_title, ctx.data.note_content, ctx.headers.authorization));
	}),

	del('/notes/delete/:id', async ctx => {
		return json(await notes.deleteNote(parseInt(ctx.params.id), ctx.headers.authorization));
	}),

	put('/notes/update', async ctx => {
		return json(await notes.updateNote(ctx.data.note_id, ctx.data.note_title, ctx.data.note_content, ctx.headers.authorization));
	}),

	// Extra error handling
	error(ctx => status(500).json({status: 500, message: ctx.error.message}))

];


// Running the server
server({ security: { csrf: false } }, cors, routes).then(ctx => {
  	console.log(`Notikha server running on http://localhost:${ctx.options.port}/`);
});
