const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  phone: { type: String },
  dateOfBirth: { type: Date },
  surgeryDate: { type: Date },
  surgeryType: { type: String },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastCheckIn: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);