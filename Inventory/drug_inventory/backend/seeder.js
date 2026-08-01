require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User.model");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany();

  const users = [
    {
      name: "Admin",
      email: "admin@medtrack.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
      locationId: "HQ001"
    },
    {
      name: "Manufacturer",
      email: "manufacturer@medtrack.com",
      password: await bcrypt.hash("demo123", 10),
      role: "manufacturer",
      locationId: "MFG001"
    },
    {
      name: "Pharmacy",
      email: "pharmacy@medtrack.com",
      password: await bcrypt.hash("demo123", 10),
      role: "pharmacy",
      locationId: "PHR001"
    }
  ];

  await User.insertMany(users);
  console.log("Users seeded successfully");
  process.exit();
}

seed();
