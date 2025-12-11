import bcrypt from "bcrypt";

const generateHash = async () => {
  const password = "Admin@123";
  const hash = await bcrypt.hash(password, 10);
  console.log("\n✅ Generated bcrypt hash for admin password:");
  console.log(hash);
  console.log("\nUse this hash in MongoDB for the admin user's password.\n");
};

generateHash();
