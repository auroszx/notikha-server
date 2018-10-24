// Controller for Notes related operations.
const db = require('../middleware/DB');
const auth = require('../middleware/Auth');

module.exports = {

	getNotesByUser: async function(user_id, token) {
		if (token != undefined) {
			var data = await auth.verify(token);
			if (data.user_id == user_id) {
				db.connect();
				return db.get("SELECT * FROM notes WHERE user_id = (?)", [user_id]);
			}
			else {
				return { status: 403, message: "You are not allowed to see other user's notes"};
			}
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
	},

	createNote: async function(note_title, note_content, token) {
		if (token != undefined) {
			var data = await auth.verify(token);
			db.connect();
			var id = await db.execute("INSERT INTO notes (note_title, note_content, user_id) VALUES ((?), (?), (?))", [note_title, note_content, data.user_id]);
			return this.getNote(id, token);
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
	},

	getNote: async function(note_id, token) {
		if (token != undefined) {
			var data = await auth.verify(token);
			db.connect();
			return db.get("SELECT * FROM notes WHERE note_id = (?) AND user_id = (?)", [note_id, data.user_id]);
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
	},

	deleteNote: async function(note_id, token) {
		if (token != undefined) {
			var data = await auth.verify(token);
			db.connect();
			await db.execute("DELETE FROM notes WHERE note_id = (?) AND user_id = (?)", [note_id, data.user_id]);
			return { note_id: note_id, deleted: true };
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
	},

	updateNote: async function(note_id, note_title, note_content, token) {
		if (token != undefined) {
			var data = await auth.verify(token);
			db.connect();
			await db.execute("UPDATE notes SET note_title = (?), note_content = (?) WHERE note_id = (?) AND user_id = (?)", [note_title, note_content, note_id, data.user_id]);
			return { note_id: note_id, note_title: note_title, note_content: note_content, updated: true };
		}
		else {
			return { status: 403, message: "You are not allowed to perform this action" };
		}
	}

};
