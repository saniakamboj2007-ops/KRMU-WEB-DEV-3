import express from "express";

import studentRoutes from "./routes/studentRoutes.js";
import logger from "./middleware/logger.js";


const app = express();


// Middleware
app.use(express.json());

app.use(logger);


// Routes
app.use("/students", studentRoutes);


// Home Route
app.get("/", (req, res) => {

    res.status(200).json({
        message: "Student Management REST API is running"
    });

});


// Error Handling Middleware
app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).json({
        message: "Internal Server Error"
    });

});


// Server
const PORT = 3000;

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});