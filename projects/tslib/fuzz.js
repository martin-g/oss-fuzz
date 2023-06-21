const { FuzzedDataProvider } = require('@jazzer.js/core');
const tslib = require('./tslib.js');

module.exports.fuzz = function(data) {
  const provider = new FuzzedDataProvider(data);

  try {
    const functionList = [
      '__assign',
      '__rest',
      '__spread',
      '__decorate',
      '__param',
      '__awaiter',
      '__generator',
      '__exportStar',
      '__values',
      '__read',
      '__spreadArrays',
      '__spreadArray',
      '__extends'
    ];

    const functionName = provider.pickValue(functionList);

    let numProperties;
    switch (functionName) {
      case '__assign':
        // Consume arguments for __assign
        const target = {};
        const numSources = provider.consumeIntegral(1, false);
        const sources = [];
        for (let i = 0; i < numSources; i++) {
          const source = {};
          numProperties = provider.consumeIntegral(1, false);
          for (let j = 0; j < numProperties; j++) {
            const key = provider.consumeString(10);
            const value = provider.consumeBoolean() ? provider.consumeString(10) : provider.consumeNumber();
            source[key] = value;
          }
          sources.push(source);
        }

        // Call __assign with the generated arguments
        tslib.__assign(target, ...sources);
        break;

      case '__rest':
        // Consume arguments for __rest
        const obj = {};
        numProperties = provider.consumeIntegral(1, false);
        for (let i = 0; i < numProperties; i++) {
          const key = provider.consumeString(10);
          const value = provider.consumeBoolean() ? provider.consumeString(10) : provider.consumeNumber();
          obj[key] = value;
        }
        const keys = Object.keys(obj);
        const excludedKeys = keys.sort(() => Math.random() - 0.5).slice(0, provider.consumeIntegral(1, false));

        // Call __rest with the generated arguments
        tslib.__rest(obj, excludedKeys);
        break;

      case '__spread':
        // Consume arguments for __spread
        const arr = [];
        const numArrays = provider.consumeIntegral(1, false);
        for (let i = 0; i < numArrays; i++) {
          const subArr = [];
          const numElements = provider.consumeIntegral(1, false);
          for (let j = 0; j < numElements; j++) {
            const element = provider.consumeBoolean() ? provider.consumeString(10) : provider.consumeNumber();
            subArr.push(element);
          }
          arr.push(subArr);
        }

        // Call __spread with the generated arguments
        tslib.__spreadArray([], arr, true);
        break;

      case '__decorate':
        // Consume arguments for __decorate
        const classConstructor = function() { };
        const numDecorators = provider.consumeIntegral(1, false);
        const decorators = [];
        for (let i = 0; i < numDecorators; i++) {
          const decorator = function() { };
          decorators.push(decorator);
        }

        // Call __decorate with the generated arguments
        tslib.__decorate(decorators, classConstructor.prototype, 'methodName', Object.getOwnPropertyDescriptor(classConstructor.prototype, 'methodName'));
        break;

      case '__param':
        // Consume arguments for __param
        const index = provider.consumeIntegral(1, false);
        const decorator = function() { };

        // Call __param with the generated arguments
        tslib.__param(index, decorator);
        break;

      case '__metadata':
        // Consume arguments for __metadata
        const key = provider.consumeString(10);
        const value = provider.consumeBoolean() ? provider.consumeString(10) : provider.consumeNumber();
        const target1 = function() { };

        // Call __metadata with the generated arguments
        tslib.__metadata(key, value)(target1, 'methodName', 0);
        break;

      case '__awaiter':
        // Consume arguments for __awaiter
        const thisArg = {};
        const _arguments = [];
        const resolve = function() { };
        const reject = function() { };

        // Call __awaiter with the generated arguments
        tslib.__awaiter(thisArg, _arguments, resolve, reject);
        break;

      case '__generator':
        // Consume arguments for __generator
        const obj1 = {};
        const body = function() { };
        const methodName = provider.consumeString(10);

        // Call __generator with the generated arguments
        tslib.__generator(obj1, body, methodName);
        break;

      case '__exportStar':
        // Consume arguments for __exportStar
        const moduleObj = {};
        const exportsObj = {};

        // Call __exportStar with the generated arguments
        tslib.__exportStar(moduleObj, exportsObj);
        break;

      case '__values':
        // Consume arguments for __values
        const iterable = [];
        const iteratorMethod = function() { };

        // Call __values with the generated arguments
        tslib.__values(iterable, iteratorMethod);
        break;

      case '__read':
        // Consume arguments for __read
        const iterator = {};
        tslib.__read(iterator, true);

        break;

      case '__spreadArrays':
        // Consume arguments for __spreadArrays
        const arr1 = [];
        const arr2 = [];
        const arr3 = [];
        const arr4 = [];
        const arr5 = [];

        // Call __spreadArrays with the generated arguments
        tslib.__spreadArray([], arr1).concat(tslib.__spreadArray([], arr2), tslib.__spreadArray([], arr3), tslib.__spreadArray([], arr4), tslib.__spreadArray([], arr5));
        break;

      case '__spreadArray':
        // Consume arguments for __spreadArray
        const to = [];
        const from = [];
        const condition = function() { };

        // Call __spreadArray with the generated arguments
        tslib.__spreadArray(to, from, condition);
        break;

      case '__extends':
        // Consume arguments for __extends
        const derivedCtor = provider.consumeString(10);
        const baseCtor = provider.consumeString(10);

        // Generate a random object for the prototype parameter
        const proto = {};
        numProperties = provider.consumeIntegral(1, false);
        for (let i = 0; i < numProperties; i++) {
          const key = provider.consumeString(10);
          const value = provider.consumeBoolean() ? provider.consumeString(10) : provider.consumeNumber();
          proto[key] = value;
        }

        // Call __extends with the generated arguments
        tslib.__extends(derivedCtor, baseCtor, proto);
        break;

      default:
        break;
    }

  } catch (error) {
    if (!ignoredError(error)) throw error;
  }
};

function ignoredError(error) {
  return !!ignored.find((message) => error.message.indexOf(message) !== -1);
}

const ignored = [
  "Class extends value"
];
