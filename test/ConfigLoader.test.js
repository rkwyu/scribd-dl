import { configLoader } from "../src/utils/io/ConfigLoader.js";


describe("load", () => {
    test("return 'output' if load DIRECTORY.output", () => {
        expect(configLoader.load("DIRECTORY", "output")).toBe("output");
    })
    test("throw an error if load unknown section", () => {
        expect(() => {
            configLoader.load("FOO", "output")
        }).toThrow(TypeError)
    })
    test("throw an error if load unknown key", () => {
        expect(() => {
            configLoader.load("DIRECTORY", "FOO")
        }).toThrow(TypeError)
    })
})