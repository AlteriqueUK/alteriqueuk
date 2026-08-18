const dns = require("dns");
const mongoose = require("mongoose");

async function connectDb() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set");
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    // Some home/office DNS servers refuse the SRV queries mongodb+srv:// needs;
    // retry once through public resolvers before giving up.
    if (/querySrv|ESERVFAIL|ECONNREFUSED/.test(String(err.message))) {
      console.warn("SRV lookup failed via system DNS, retrying with public resolvers");
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
      await mongoose.connect(process.env.MONGODB_URI);
    } else {
      throw err;
    }
  }
  console.log("MongoDB connected");
}

module.exports = connectDb;
