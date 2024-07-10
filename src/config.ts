import "dotenv/config";

const PORT = process.env.SERVER_PORT;
const MONGOOSE_URL = process.env.MONGODB_URI;

export { PORT, MONGOOSE_URL };
