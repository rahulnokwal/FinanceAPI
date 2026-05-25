import connectDB from "./db/index.js";
import { PORT } from "./constant.js";
import app from "./app.js";

connectDB()
  .then(() => {
    const portUsed = `${PORT}` || 3000;
    const server = app.listen(portUsed, () => {
      console.log(`App is listening on port ${portUsed}`);
    });

    server.on("error", () => {
      console.error("Server error: ", error);
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failures", error);
    process.exit(1);
  });
