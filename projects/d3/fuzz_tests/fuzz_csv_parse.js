const d3 = require("../src/index.js");

module.exports.fuzz = function (data) {
    d3.csvParse(data.toString())
};
