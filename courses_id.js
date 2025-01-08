const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // Import ObjectId for handling _id

const app = express();
const port = 5002;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017"; 
const dbName = "codinggita";

// Middleware
app.use(express.json());

let db, courses;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        courses = db.collection("courses");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if database connection fails
    }
}

// Initialize Database
initializeDatabase();

// Routes

// GET: List all courses
app.get('/courses', async (req, res) => {
    try {
        const allCourses = await courses.find().toArray();
        res.status(200).json(allCourses);
    } catch (err) {
        res.status(500).send("Error fetching courses: " + err.message);
    }
});

// POST: Add a new course
app.post('/courses', async (req, res) => {
    try {
        const newCourse = req.body;
        const result = await courses.insertOne(newCourse);
        res.status(201).send(`Course added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding course: " + err.message);
    }
});

// PUT: Update a course completely
app.put('/courses/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        const updatedCourse = req.body;
        const result = await courses.replaceOne({ _id: new ObjectId(courseId) }, updatedCourse);
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating course: " + err.message);
    }
});

// PATCH: Partially update a course
app.patch('/courses/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        const updates = req.body;
        const result = await courses.updateOne({ _id: new ObjectId(courseId) }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating course: " + err.message);
    }
});

// DELETE: Remove a course
app.delete('/courses/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        const result = await courses.deleteOne({ _id: new ObjectId(courseId) });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting course: " + err.message);
    }
});
