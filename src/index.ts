import express from "express";
import cors from "cors";

//import middleware
import requestHelpers from "./utils/responce";
import connectDB from "./config/db";

// import routes
import authRoute from "./routes/auth";
import userRoute from "./routes/user";

// create express app
const app = express();
const port = 3001;

// setup middleware
app.use(express.json());
app.use(requestHelpers);
app.use(cors());

// connect to database
connectDB();

// routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

app.listen(port, () => console.log(`App listening on port ${port}!`));
