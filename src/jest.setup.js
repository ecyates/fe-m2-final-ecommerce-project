import { TextEncoder, TextDecoder } from "util";
import "@testing-library/jest-dom";

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder


import dotenv from "dotenv";
dotenv.config();