const { FuzzedDataProvider } = require("@jazzer.js/core");
const turf = require("@turf/turf");

module.exports.fuzz = function(data) {
  const provider = new FuzzedDataProvider(data);
  try {
    // Consume inputs for turf.buffer
    const point = turf.point([
      provider.consumeNumberInRange(-180, 180),
      provider.consumeNumberInRange(-90, 90),
    ]);
    const radius = provider.consumeNumber();
    const options = {
      steps: provider.consumeIntegralInRange(1, 1000),
      units: provider.consumeString(10),
    };

    turf.buffer(point, radius, options);

    // Consume inputs for turf.lineIntersect
    const line1 = turf.lineString([
      [
        provider.consumeNumberInRange(-180, 180),
        provider.consumeNumberInRange(-90, 90),
      ],
      [
        provider.consumeNumberInRange(-180, 180),
        provider.consumeNumberInRange(-90, 90),
      ],
    ]);
    const line2 = turf.lineString([
      [
        provider.consumeNumberInRange(-180, 180),
        provider.consumeNumberInRange(-90, 90),
      ],
      [
        provider.consumeNumberInRange(-180, 180),
        provider.consumeNumberInRange(-90, 90),
      ],
    ]);

    turf.lineIntersect(line1, line2);

    // Consume inputs for turf.destination
    const origin = turf.point([
      provider.consumeNumberInRange(-180, 180),
      provider.consumeNumberInRange(-90, 90),
    ]);
    const distance = provider.consumeNumberInRange(0, 100);
    const bearing = provider.consumeNumberInRange(0, 360);

    turf.destination(origin, distance, bearing);

    // Consume inputs for turf.booleanContains
    const polygon1 = turf.polygon([
      [
        [
          provider.consumeNumberInRange(-180, 180),
          provider.consumeNumberInRange(-90, 90),
        ],
        [
          provider.consumeNumberInRange(-180, 180),
          provider.consumeNumberInRange(-90, 90),
        ],
        [
          provider.consumeNumberInRange(-180, 180),
          provider.consumeNumberInRange(-90, 90),
        ],
        [
          provider.consumeNumberInRange(-180, 180),
          provider.consumeNumberInRange(-90, 90),
        ],
        [
          provider.consumeNumberInRange(-180, 180),
          provider.consumeNumberInRange(-90, 90),
        ],
      ],
    ]);
    const polygon2 = turf.polygon([
      [
        [
          provider.consumeNumberInRange(-180, 180),
          provider.consumeNumberInRange(-90, 90),
        ],
        [
          provider.consumeNumberInRange(-180, 180),
          provider.consumeNumberInRange(-90, 90),
        ],
        [
          provider.consumeNumberInRange(-180, 180),
          provider.consumeNumberInRange(-90, 90),
        ],
        [
          provider.consumeNumberInRange(-180, 180),
          provider.consumeNumberInRange(-90, 90),
        ],
        [
          provider.consumeNumberInRange(-180, 180),
          provider.consumeNumberInRange(-90, 90),
        ],
      ],
    ]);

    turf.booleanContains(polygon1, polygon2);

    // Consume inputs for turf.bbox
    const point1 = turf.point([
      provider.consumeNumberInRange(-180, 180),
      provider.consumeNumberInRange(-90, 90),
    ]);
    const point2 = turf.point([
      provider.consumeNumberInRange(-180, 180),
      provider.consumeNumberInRange(-90, 90),
    ]);
    const point3 = turf.point([
      provider.consumeNumberInRange(-180, 180),
      provider.consumeNumberInRange(-90, 90),
    ]);
    const point4 = turf.point([
      provider.consumeNumberInRange(-180, 180),
      provider.consumeNumberInRange(-90, 90),
    ]);

    // Call turf.bbox with fuzzed inputs
    turf.bbox(turf.featureCollection([point1, point2, point3, point4]));
  } catch (error) {
    // Ignore errors
    if (!ignoredError(error)) throw error;
  }
};

function ignoredError(error) {
  return !!ignored.find((message) => error.message.indexOf(message) !== -1);
}

const ignored = ["units is invalid"];

