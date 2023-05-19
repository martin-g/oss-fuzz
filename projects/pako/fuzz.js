// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////////

const pako = require("pako");
const { FuzzedDataProvider } = require("@jazzer.js/core");

module.exports.fuzz = function(data) {
  const fdp = new FuzzedDataProvider(data);
  const comprLevel = fdp.consumeIntegral(1);
  const windowBits = fdp.consumeIntegral(1);
  const memLevel = fdp.consumeIntegral(1);
  const strategy = fdp.consumeIntegral(1);
  const raw = fdp.consumeBoolean();
  const options = {
    level: comprLevel,
    windowBits: windowBits,
    memLevel: memLevel,
    strategy: strategy,
    raw: raw,
  };

  let choice = fdp.consumeBoolean();
  const exp = fdp.consumeRemainingAsBytes();

  try {
    const defl =
      choice === true ? pako.deflate(exp, options) : pako.gzip(exp, options);

    const infl =
      choice === false
        ? pako.inflate(defl, options)
        : pako.ungzip(defl, options);
  } catch (error) {
    if (error.message && !ignoredError(error)) {
      throw error;
    }
  }
};

function ignoredError(error) {
  return !!ignored.find((message) => error.message.indexOf(message) !== -1);
}

const ignored = [
  "stream error",
  "invalid window size",
  "incorrect header check",
  "strm.input.subarray", // is this a valid bug?
];
