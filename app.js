const express = require("express");
const logger = require("./middlewares/logger");
const { notFound, errorHandler } = require("./middlewares/errors");
const connectToDB = require("./config/db");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.static(path.join(__dirname, "images")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);
app.use(helmet());
app.use(cors({
	// origin: "http://localhost:3000"
}));

app.set('view engine', 'ejs');

app.use("/api/books", require("./routes/books"));
app.use("/api/authors", require("./routes/authors"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/upload", require("./routes/upload"));
app.use("/password", require("./routes/password"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
async function start() {
	await connectToDB();
	app.listen(PORT, () => console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
};

start();