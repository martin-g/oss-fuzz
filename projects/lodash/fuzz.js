const { FuzzedDataProvider } = require('@jazzer.js/core');
const _ = require('lodash');

module.exports.fuzz = function(data) {
  const provider = new FuzzedDataProvider(data);

  try {

    // Chunk function
    const input = provider.consumeIntegrals(10, 1, true);
    const chunkSize = provider.consumeIntegralInRange(1, input.length);
    _.chunk(input, chunkSize);

    // Compact function
    const array = provider.consumeBooleans(10);
    _.compact(array);

    // Concat function
    const array1 = provider.consumeIntegrals(5, 1, true);
    const array2 = provider.consumeIntegrals(5, 1, true);
    _.concat(array1, array2);

    // Drop function
    const array3 = provider.consumeIntegrals(10, 1, true);
    const n = provider.consumeIntegralInRange(1, array3.length);
    _.drop(array3, n);

    // Filter function
    const array4 = provider.consumeIntegrals(10, 1, true);
    const predicate = (value) => {
      return value % 2 === 0;
    };
    _.filter(array4, predicate);

    // Flatten function
    const array5 = provider.consumeIntegrals(5, 1, true);
    const array6 = provider.consumeIntegrals(5, 1, true);
    const array7 = provider.consumeIntegrals(5, 1, true);
    const array8 = [array5, array6, array7];
    _.flatten(array8);

    // Map function
    const array9 = provider.consumeIntegrals(10, 1, true);
    const iteratee = (value) => {
      return value * 2;
    };
    _.map(array9, iteratee);

    // Reverse function
    const array10 = provider.consumeIntegrals(10, 1, true);
    _.reverse(array10);

    // Slice function
    const array11 = provider.consumeIntegrals(10, 1, true);
    const start = provider.consumeIntegralInRange(0, array11.length - 1);
    const end = provider.consumeIntegralInRange(start, array11.length - 1);
    _.slice(array11, start, end);

    // Uniq function
    const array13 = provider.consumeIntegrals(10, 1, true);
    _.uniq(array13);

    // Template function
    // Generate a random template string
    const templateString = provider.consumeString(50);

    // Generate a random data object to use with the template
    const dataObject = generateDataObject(provider);

    // Render the template with the data object
    const renderedTemplate = _.template(templateString)(dataObject);
  } catch (error) {
    if (!ignoredError(error)) {
      throw error;
    }
  }
};

function ignoredError(error) {
  return !!ignored.find((message) => error.message.indexOf(message) !== -1);
}

const ignored = [
  "min must be less than or equal to max"
];

// Generate a random data object with nested properties
function generateDataObject(provider) {
  const dataObject = {};

  // Generate a random number of properties
  const numProperties = provider.consumeIntegralInRange(1, 10);
  for (let i = 0; i < numProperties; i++) {
    // Generate a random property name and value
    const propertyName = provider.consumeString(10);
    const propertyValue = generatePropertyValue(provider);

    // Add the property to the data object
    dataObject[propertyName] = propertyValue;
  }

  return dataObject;
}

// Generate a random property value for the data object
function generatePropertyValue(provider) {
  const valueType = provider.consumeIntegralInRange(0, 3);

  switch (valueType) {
    case 0:
      // Generate a random string
      return provider.consumeString(20);
    case 1:
      // Generate a random number
      return provider.consumeNumber();
    case 2:
      // Generate a nested data object
      return generateDataObject(provider);
    case 3:
      // Generate an array of random values
      const numValues = provider.consumeIntegralInRange(1, 5);
      const values = [];
      for (let i = 0; i < numValues; i++) {
        values.push(generatePropertyValue(provider));
      }
      return values;
  }
}

