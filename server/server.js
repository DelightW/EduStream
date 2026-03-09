const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
// Change localhost to mongo so Docker containers can talk
const mongoURI = process.env.MONGO_URI || 'mongodb://mongo:27017/edustream';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB via Docker...'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- SCHEMAS ---

// 1. Course Content (Cisco Structure)
const CourseSchema = new mongoose.Schema({
  title: String,
  courseCode: { type: String, unique: true },
  instructor: String,
  weeks: [{
    weekNumber: Number,
    modules: [{ 
      id: String, 
      title: String, 
      content: String, 
      completed: { type: Boolean, default: false } 
    }],
    resources: [{ fileName: String, fileUrl: String }]
  }]
}, { collection: 'courses' });

// 2. Student Enrollments
const EnrollmentSchema = new mongoose.Schema({
  courseCode: String,
  username: String,
  studentEmail: String,
  progress: { type: Number, default: 0 }
}, { collection: 'enrollments' });

// 3. User Preferences (Academic Affiliation)
const PreferenceSchema = new mongoose.Schema({
  id: String, // linked to username
  schoolName: String
}, { collection: 'preferences' });

const Course = mongoose.model('Course', CourseSchema);
const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);
const Preference = mongoose.model('Preference', PreferenceSchema);

// --- API ROUTES ---

// ENROLLMENTS: Get for Student Dashboard
app.get('/api/enrollments', async (req, res) => {
  try {
    const { username } = req.query;
    const data = await Enrollment.find(username ? { username } : {});
    res.json(data);
  } catch (err) { res.status(500).json(err); }
});

// PREFERENCES: Get Academic Affiliation
app.get('/api/preferences/:username', async (req, res) => {
  try {
    const data = await Preference.findOne({ id: req.params.username });
    res.json(data || { schoolName: 'Not Set' });
  } catch (err) { res.status(500).json(err); }
});

// PREFERENCES: Save Academic Affiliation
app.post('/api/preferences', async (req, res) => {
  try {
    const data = await Preference.findOneAndUpdate(
      { id: req.body.id },
      req.body,
      { new: true, upsert: true }
    );
    res.json(data);
  } catch (err) { res.status(500).json(err); }
});

// COURSES: Get Content for Cisco Viewer
app.get('/api/courses/:code', async (req, res) => {
  try {
    const data = await Course.findOne({ courseCode: req.params.code });
    res.json(data);
  } catch (err) { res.status(500).json(err); }
});

// COURSES: Instructor Save/Update
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

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));