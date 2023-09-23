const ignorePatterns = ["@rneui/*"];

module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    `"node_modules/(?!${ignorePatterns.join("|")})`,
    `jest-runner`,
  ],
  setupFilesAfterEnv: ["./jest.setup.ts"],
};
