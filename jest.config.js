module.exports = {
    "moduleDirectories": ["node_modules", "bower_components", "src"],
    "testRegex": [
      "(/test/.*.test)\\.[jt]sx?$"
    ],
    "transform": {
      "^.+\\.tsx?$": "ts-jest",
      "^.+\\.js$": "babel-jest"
    },
  }