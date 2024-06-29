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

  bankaccount: {
    cedula: { type: String, default: 0 },
    numcell: { type: String, default: "0" },
    bank: { type: String, default: "mercantil" },
  },
  pending: [String],
  calendar: [
    {
      courseId: String,
      date: Date,
      event: String,
    },
  ],
  carrer: String,
  description: String,
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  ratings: [
    {
      userId: String,
      score: Number,
    },
  ],
});

userSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length === 0) {
    this.rating = 0;
    this.ratingCount = 0;
  } else {
    const sum = this.ratings.reduce((acc, curr) => acc + curr.score, 0);
    this.rating = parseFloat((sum / this.ratings.length).toFixed(2));
    this.ratingCount = this.ratings.length;
  }
};

// Middleware para actualizar el rating antes de guardar
userSchema.pre("save", function (next) {
  if (this.isModified("ratings")) {
    this.calculateAverageRating();
  }
  next();
});

const User = mongoose.model("usuario", userSchema);

export default User;
