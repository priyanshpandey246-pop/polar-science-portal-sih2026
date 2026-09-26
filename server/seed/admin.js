const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error(
        "ADMIN_EMAIL or ADMIN_PASSWORD missing from .env"
      );
    }

    await User.deleteMany({
      email: email.toLowerCase(),
    });

    await User.create({
      name: "Polar Portal Admin",
      email,
      password,
      role: "admin",
    });

    console.log("Admin successfully created");
    console.log("Email:", email);

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Admin creation failed:");
    console.error(error.message);

    process.exit(1);
  }
};

createAdmin();