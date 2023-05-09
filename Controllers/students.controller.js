const studentRouter = require("express").Router();
const Student = require("../Models/student.model");
const Mentor = require("../Models/mentor.model");

//create student
studentRouter.post("/createstudent", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//Assign or change mentor for particular student
studentRouter.put("/students/:studentId/mentor", async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    const { mentorId } = req.body;
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }
    if (student.mentor && student.mentor.toString() === mentor._id.toString()) {
      return res.json({
        message: "Student is already assigned to this mentor",
      });
    }
    if (mentor.students.includes(student._id)) {
      return res
        .status(400)
        .json({ error: "Student is already assigned to this mentor" });
    }
    if (student.mentor) {
      const prevMentor = await Mentor.findById(student.mentor);
      prevMentor.students = prevMentor.students.filter(
        (s) => s.toString() !== student._id.toString()
      );
      await prevMentor.save();
    }
    mentor.students.push(student._id);
    student.mentor = mentor._id;
    await mentor.save();
    await student.save();
    res.json({ mentor, student });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//Show the previously assigned mentor for a particular student
studentRouter.get("/students/:studentId/mentor", async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).populate("mentor");
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student.mentor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = studentRouter;
