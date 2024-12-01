"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("@routes/user"));
const public_1 = __importDefault(require("@routes/public"));
const auth_1 = __importDefault(require("@routes/auth"));
// Load the environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.API_PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('Hello, TypeScript Express!');
});
app.use('/auth', auth_1.default);
app.use('/users', user_1.default);
app.use('/', public_1.default);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
