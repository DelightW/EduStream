const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb://mongo:27017/edustream';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB...'))
  .catch(err => console.error('❌ Connection Error:', err));

// --- SCHEMAS ---
const CourseSchema = new mongoose.Schema({
  title: String,
  courseCode: { type: String, unique: true },
  instructor: String,
  description: String,
  price: Number,
  weeks: [{
    weekNumber: Number,
    modules: [{ id: String, title: String, content: String, completed: { type: Boolean, default: false } }],
    resources: [{ fileName: String, fileUrl: String }]
  }]
}, { collection: 'courses', versionKey: false });

const EnrollmentSchema = new mongoose.Schema({
  courseCode: { type: String, required: true },
  studentEmail: String,
  username: { type: String, required: true }, 
  instructorName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'declined'], 
    default: 'pending' 
  },
  progress: { type: Number, default: 0 },
}, { collection: 'enrollments', versionKey: false });

const Course = mongoose.model('Course', CourseSchema);
const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);

// --- ROUTES ---

// 1. INSTRUCTOR STATS
app.get('/api/instructor/stats/:username', async (req, res) => {
  try {
    const name = req.params.username;
    const studentCount = await Enrollment.countDocuments({ instructorName: name, status: 'approved' });
    const courseCount = await Course.countDocuments({ instructor: name });
    res.json({
      totalStudents: studentCount,
      totalCourses: courseCount,
      earnings: studentCount * 1500 
    });
  } catch (err) { res.status(500).json(err); }
});

// 2. STUDENT ENROLLMENTS (Fixes the Student Dashboard "Oops" error)
// This handles: /api/enrollments?username=Wambui
app.get('/api/enrollments', async (req, res) => {
  try {
    const { username } = req.query;
    const query = username ? { username: username } : {};
    const data = await Enrollment.find(query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student enrollments' });
  }
});

// 3. COURSE-SPECIFIC ENROLLMENTS (For Instructor "View Course" page)
app.get('/api/enrollments/by-course/:courseCode', async (req, res) => {
  try {
    const code = req.params.courseCode;
    const data = await Enrollment.find({ courseCode: code });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch course enrollments' });
  }
});

// --- FIXED ROUTE ---
app.post('/api/enrollments/request', async (req, res) => { // <--- MUST HAVE 'async' HERE
  try {
    const { courseCode, username, studentEmail, instructorName } = req.body;

    // Now this 'await' will work perfectly
    const courseExists = await Course.findOne({ courseCode });
    if (!courseExists) {
      return res.status(404).json({ error: "That course doesn't exist anymore." });
    }

    const newRequest = new Enrollment({
      courseCode,
      username,
      studentEmail,
      instructorName,
      status: 'pending' 
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ error: "Failed to save request" });
  }
});
// 4. APPROVE ENROLLMENT
app.post('/api/enrollments/approve', async (req, res) => {
  try {
    const { courseCode, username } = req.body;
    const data = await Enrollment.findOneAndUpdate(
      { courseCode, username },
      { status: 'approved' },
      { new: true }
    );
    res.json(data);
  } catch (err) { res.status(500).json(err); }
});

// 5. COURSE ROUTES
app.get('/api/courses', async (req, res) => {
  try {
    const { instructor } = req.query;
    const query = instructor ? { instructor: instructor } : {};
    const data = await Course.find(query);
    res.json(data);
  } catch (err) { res.status(500).json(err); }
});

app.get('/api/courses/:code', async (req, res) => {
  try {
    const data = await Course.findOne({ courseCode: req.params.code });
    if (!data) return res.status(404).json({ error: 'Course not found' });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/courses', async (req, res) => {
  try {
    const data = await Course.findOneAndUpdate(
      { courseCode: req.body.courseCode },
      req.body,
      { new: true, upsert: true }
    );
    res.status(201).json(data);
  } catch (err) { res.status(400).json(err); }
});

// 6. RESOURCE MANAGEMENT (Notes & Files)
app.post('/api/courses/:code/weeks/:weekNumber/resources', async (req, res) => {
  try {
    const { code, weekNumber } = req.params;
    const course = await Course.findOneAndUpdate(
      { courseCode: code, "weeks.weekNumber": parseInt(weekNumber) },
      { $push: { "weeks.$.resources": req.body } },
      { new: true }
    );
    if (!course) return res.status(404).json({ error: "Course or Week not found" });
    res.json(course);
  } catch (err) { res.status(500).json({ error: "Failed to save file" }); }
});

app.post('/api/courses/:code/weeks/:weekNumber/modules', async (req, res) => {
  try {
    const { code, weekNumber } = req.params;
    const course = await Course.findOneAndUpdate(
      { courseCode: code, "weeks.weekNumber": parseInt(weekNumber) },
      { $push: { "weeks.$.modules": { id: Date.now().toString(), content: req.body.content } } },
      { new: true }
    );
    res.json(course);
  } catch (err) { res.status(500).json({ error: "Failed to save note" }); }
});

app.delete('/api/courses/:code', async (req, res) => {
  try {
    await Course.findOneAndDelete({ courseCode: req.params.code });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json(err); }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));