import "dotenv/config";
import app from "./app.js/index.js";

const port = Number(process.env.PORT);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
