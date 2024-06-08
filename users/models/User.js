import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: String,
  name: String,
  email: String,
  gender: String,
  lastName: String,
  userType: String,
  cellphone: String,
  courses_student: [String],
  courses_tutor: [String],
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  bankaccount: {
    cedula: { type: String, default: 0 },
    numcell: { type: String, default: "0" },
    bank: { type: String, default: "mercantil" },
  },
});

const User = mongoose.model("usuario", userSchema);

export default User;
