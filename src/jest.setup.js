import { TextEncoder, TextDecoder } from "util";
import "@testing-library/jest-dom";

global.TextEncoder = TextEncoder
// @ts-expect-error
global.TextDecoder = TextDecoder

// global.alert = jest.fn();
// global.location.reload = jest.fn();
