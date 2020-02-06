import express from "express";
import cors from "cors";

//import middleware
import requestHelpers from "./utils/responce";
import connectDB from "./config/db";
import errorHandler from "./middleware/errorHandler";

// import routes
import authRoute from "./routes/auth";
import userRoute from "./routes/user";
import streetRoute from "./routes/street";

// create express app
const app = express();
const port = 3001;

// setup middleware
app.use(requestHelpers);
app.use(cors());
app.use(express.json());
app.use(errorHandler);

// connect to database
connectDB();

// routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/street", streetRoute);

app.listen(port, () => console.log(`App listening on port ${port}!`));
