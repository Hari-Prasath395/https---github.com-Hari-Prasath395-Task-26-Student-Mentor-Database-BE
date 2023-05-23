const mentorRouter = require("express").Router();
const Mentor = require("../Models/mentor.model");
const Student = require("../Models/student.model");

mentorRouter.post('/creatementor', async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    await mentor.save();
    res.status(201).json(mentor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


//assign student to mentor
mentorRouter.post("/mentors/:mentorId/students", async (req, res) => {
  try {
    const { mentorId } = req.params;
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }
    const { studentIds } = req.body;
    const students = await Student.find({
      _id: { $in: studentIds },
      mentor: { $exists: false },
    });
    if (students.length === 0) {
      return res.status(400).json({ error: "No students available to assign" });
    }
    mentor.students.push(...students.map((s) => s._id));
    await mentor.save();
    await Student.updateMany(
      { _id: { $in: studentIds } },
      { mentor: mentor._id }
    );
    res.json({ mentor, students });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//Show all the students for a particular mentor
mentorRouter.get("/mentors/:mentorId/students", async (req, res) => {
  try {
    const { mentorId } = req.params;
    const mentor = await Mentor.findById(mentorId).populate("students");
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }
    res.json(mentor.students);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//Get all mentors in student mentor hub
mentorRouter.get('/mentors', async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
});

mentorRouter.delete('/mentors/:mentorId', async (req, res) => {
  try {
    const { mentorId } = req.params;
    await Mentor.findByIdAndDelete(mentorId);
    res.status(200).json({ message: 'Mentor deleted successfully!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


module.exports = mentorRouter;
