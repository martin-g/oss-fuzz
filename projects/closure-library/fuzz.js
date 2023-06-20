const { FuzzedDataProvider } = require('@jazzer.js/core');
require("google-closure-library");
const SafeHtml = goog.require('goog.html.SafeHtml');
const googString = goog.require('goog.string.Const');
const TrustedResourceUrl = goog.require('goog.html.TrustedResourceUrl');
const UncheckedResourceUrl = goog.require('goog.html.UncheckedResourceUrl');

module.exports.fuzz = function(data) {
  const provider = new FuzzedDataProvider(data);

  const html = provider.consumeString(300);
  const shouldWrap = provider.consumeBoolean();
  const tagName = shouldWrap ? provider.consumeString(10) : '';

  let safeHtml;
  try {
    const method = provider.consumeIntegralInRange(1, 4);

    switch (method) {
      case 1:
        safeHtml = SafeHtml.create(tagName, { innerHtml: html });
        break;
      case 2:
        safeHtml = SafeHtml.fromConstant(googString.from(html));
        break;
      case 3:
        safeHtml = SafeHtml.fromTrustedResourceUrl(TrustedResourceUrl.fromConstant(googString.from(html)));
        break;
      case 4:
        safeHtml = SafeHtml.fromUntrustedResourceUrl(UncheckedResourceUrl.fromConstant(googString.from(html)));
        break;
    }
    console.log(safeHtml);

    const htmlString = SafeHtml.unwrap(safeHtml);
    const isEmpty = provider.consumeBoolean();
    const emptySafeHtml = isEmpty ? SafeHtml.EMPTY : safeHtml;
    const concatenatedSafeHtml = SafeHtml.concat(safeHtml, emptySafeHtml);
    const isTrusted = provider.consumeBoolean();
    const trustedSafeHtml = isTrusted ? SafeHtml.htmlEscape(htmlString) : concatenatedSafeHtml;
    SafeHtml.unwrap(trustedSafeHtml);
  } catch (error) {
    if (!ignoredError(error)) throw error;
  }
};

function ignoredError(error) {
  return !!ignored.find((message) => error.message.indexOf(message) !== -1);
}

const ignored = [
  "Cannot read properties of"
];

