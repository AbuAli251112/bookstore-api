const { Book } = require("./models/Book");
const { Author } = require("./models/Author");
const { books, authors } = require("./data");
const connectToDb = require("./config/db");
require("dotenv").config();

connectToDb();

const importBooks = async () => {
	try {
		await Book.insertMany(books);
		console.log("Books Imported");
		process.exit(1);
	} catch(e) {
		console.log(e);
		process.exit(1);
	}
};

const importAuthors = async () => {
	try {
		await Author.insertMany(authors);
		console.log("Authors Imported");
		process.exit(1);
	} catch(e) {
		console.log(e);
		process.exit(1);
	}
};

const removeBooks = async () => {
	try {
		await Book.deleteMany(books);
		console.log("Books Removed");
		process.exit(1);
	} catch(e) {
		console.log(e);
		process.exit(1);
	}
};

const removeAuthors = async () => {
	try {
		await Author.deleteMany(authors);
		console.log("Authors Removed");
		process.exit(1);
	} catch(e) {
		console.log(e);
		process.exit(1);
	}
};

if (process.argv[2] === "-import") {
	importBooks();
} else if (process.argv[2] === "-remove") {
	removeBooks();
} else if (process.argv[2] === "-import-authors") {
	importAuthors();
}