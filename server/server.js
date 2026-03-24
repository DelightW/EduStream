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
    modules: [{ 
      id: String, 
      title: String, 
      content: String, 
      completed: { type: Boolean, default: false } 
    }],
    resources: [{ fileName: String, fileUrl: String }]
  }]
}, { collection: 'courses', versionKey: false });

const EnrollmentSchema = new mongoose.Schema({
  courseCode: { type: String, required: true },
  studentEmail: String,
  username: { type: String, required: true }, 
  instructorName: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
  progress: { type: Number, default: 0 },
  completedModules: [{ type: String }] 
}, { collection: 'enrollments', versionKey: false });

const Course = mongoose.model('Course', CourseSchema);
const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);

// --- ROUTES ---

app.get('/api/preferences/:username', async (req, res) => {
  try {
    const data = await mongoose.connection.collection('preferences').findOne({ id: req.params.username });
    if (!data) return res.json({ schoolName: '' }); // Return empty if not set yet
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post('/api/preferences', async (req, res) => {
  try {
    const { id, schoolName } = req.body;
    await mongoose.connection.collection('preferences').updateOne(
      { id: id },
      { $set: { id: id, schoolName: schoolName, updatedAt: new Date() } },
      { upsert: true }
    );
    res.json({ success: true, schoolName });
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});
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

// 2. ENROLLMENT & DASHBOARD ROUTES
app.get('/api/enrollments', async (req, res) => {
  try {
    const { username, courseCode } = req.query;
    let filter = {};
    if (username) filter.username = username;
    if (courseCode) filter.courseCode = courseCode;

    const data = await Enrollment.find(filter);
  
    res.status(200).json(data || []); 
  } catch (err) { 
    console.error("Enrollment fetch error:", err);
    res.status(500).json({ error: "Server error fetching enrollments" }); 
  }
});

app.get('/api/instructor/enrollments/:instructorName', async (req, res) => {
  try {
    const name = req.params.instructorName;
    const data = await Enrollment.find({ instructorName: { $regex: name, $options: 'i' } });
    res.json(data);
  } catch (err) { res.status(500).json({ error: "Failed to fetch roster" }); }
});

app.get('/api/enrollments/by-course/:courseCode', async (req, res) => {
  try {
    const { courseCode } = req.params;
    const data = await Enrollment.find({ courseCode: courseCode });

    res.status(200).json(data || []); 
  } catch (err) {
    console.error("Error fetching course enrollments:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Get status for a specific course (used in Course Viewer)
app.get('/api/enrollments/status', async (req, res) => {
  try {
    const { username, courseCode } = req.query;
    const data = await Enrollment.findOne({ username, courseCode });
    res.json(data);
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/enrollments/request', async (req, res) => {
  try {
    const { courseCode, username, studentEmail, instructorName } = req.body;
    const courseExists = await Course.findOne({ courseCode });
    if (!courseExists) return res.status(404).json({ error: "Course doesn't exist" });

    const newRequest = new Enrollment({ courseCode, username, studentEmail, instructorName });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) { res.status(500).json(err); }
});

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

app.post('/api/enrollments/complete-module', async (req, res) => {
  try {
    const { username, courseCode, moduleId } = req.body;
    const enrollment = await Enrollment.findOneAndUpdate(
      { username, courseCode },
      { $addToSet: { completedModules: moduleId } }, 
      { new: true }
    );
    res.json(enrollment);
  } catch (err) { res.status(500).json(err); }
});

// 3. COURSE ROUTES
app.get('/api/courses', async (req, res) => {
  try {
    const { instructor } = req.query;
    const query = instructor ? { instructor } : {};
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

// 4. MODULE & RESOURCE MANAGEMENT
app.post('/api/courses/:code/weeks/:weekNumber/modules', async (req, res) => {
  try {
    const { code, weekNumber } = req.params;
    const { title, content } = req.body;
    const course = await Course.findOneAndUpdate(
      { courseCode: code, "weeks.weekNumber": parseInt(weekNumber) },
      { 
        $push: { 
          "weeks.$.modules": { 
            id: Date.now().toString(), 
            title, 
            content 
          } 
        } 
      },
      { new: true }
    );
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/courses/:code/weeks/:weekNumber/resources', async (req, res) => {
  try {
    const { code, weekNumber } = req.params;
    const course = await Course.findOneAndUpdate(
      { courseCode: code, "weeks.weekNumber": parseInt(weekNumber) },
      { $push: { "weeks.$.resources": req.body } },
      { new: true }
    );
    res.json(course);
  } catch (err) { res.status(500).json(err); }
});

app.delete('/api/courses/:code', async (req, res) => {
  try {
    await Course.findOneAndDelete({ courseCode: req.params.code });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json(err); }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));