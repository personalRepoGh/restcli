var client = new HttpClient();
var response = new HttpResponse();
var logger = new Logger();
var logTestingCapture = null;
var testReportStore = new TestReportStore();
var testFailedCount = 0
var t = new TermColors();
var REST_CLI = true;
var _END_ = "_END_";

///////////// HttpClient /////////////
function HttpClient() {
    this.global = new Variables();
}

/**
 * Creates test with name 'testName' and body 'func'.
 * All tests will be executed right after response handler script.
 */
HttpClient.prototype.test = function (testName, func) {
    logTestingCapture = new LogTestingCapture();
    try {
        func();
        logger.info(t.green("✓ " + testName));
        testReportStore.add(testName, true, null, null);
    } catch (e) {
        testFailedCount += 1;
        logger.error(t.red("✗ " + testFailedCount + ". " + testName + "(" + e.message + ")"));
        testReportStore.add(
            testName,
            false,
            e.name,
            e.message + "\n" + logTestingCapture.details.join("\n"));
    }
    logTestingCapture = null;
}

/**
 * Checks that condition is true and throw an exception otherwise.
 * @param condition
 * @param message if specified it will be used as an exception message.
 */
HttpClient.prototype.assert = function (condition, message) {
    if (condition) {
        // Well done. Do nothing.
    } else {
        throw {name: "AssertionFailure", message: message};
    }
}

/**
 * Prints text to the response handler or test stdout and then terminates the line.
 */
HttpClient.prototype.log = function (text) {
    if (logTestingCapture) {
        logTestingCapture.add(text);
    }
    logger.info(text);
}

/**
 * Sets the name of the next request. The next `requestName` will be after all test of the current
 * request run finished.
 */
HttpClient.prototype.setNextRequest = function (requestName) {
    _store.setNextRequest(requestName);
}

///////////// HttpResponse /////////////
function HttpResponse() {
    /**
     * Response content, it is a string or JSON object if response content-type is json.
     */
    this.body = "";

    /**
     * Response headers storage.
     */
    this.headers = new ResponseHeaders();

    /**
     * Response status, e.g. 200, 404, etc.
     */
    this.status = 200;

    /**
     * Value of 'Content-Type' response header.
     */
    this.contentType = new ContentType();
}

HttpResponse.prototype.set = function (varName, varValue) {

}

///////////// ResponseHeaders /////////////
function ResponseHeaders() {
    this.headers = [];
}

/**
 * Retrieves the first value of 'headerName' response header or null otherwise.
 */
ResponseHeaders.prototype.valueOf = function (headerName) {
    var headerNameLowerCase = headerName.toLowerCase()
    for (var i = 0; i < this.headers.length; i++) {
        var header = this.headers[i];
        if (header.hasOwnProperty(headerNameLowerCase)) {
            return header[headerNameLowerCase];
        }
    }
    return null;
}

/**
 * Retrieves all values of 'headerName' response header. Returns empty list if header with 'headerName' doesn't exist.
 */
ResponseHeaders.prototype.valuesOf = function (headerName) {
    var headerNameLowerCase = headerName.toLowerCase()
    var result = [];
    for (var i = 0; i < this.headers.length; i++) {
        var header = this.headers[i];
        if (header.hasOwnProperty(headerNameLowerCase)) {
            result.push(header[headerNameLowerCase]);
        }
    }
    return result;
}

ResponseHeaders.prototype.add = function (headerName, headerValue) {
    var header = {};
    header[headerName.toLowerCase()] = headerValue;
    this.headers.push(header);
}

///////////// ContentType /////////////
function ContentType() {
    /**
     * MIME type of the response,
     * e.g. 'text/plain', 'text/xml', 'application/json'.
     */
    this.mimeType = "";

    /**
     * String representation of the response charset,
     * e.g. utf-8.
     */
    this.charset = "";
}

///////////// Variables /////////////
function Variables() {
    this.store = {};
}

/**
 * Saves variable with name 'varName' and sets its value to 'varValue'.
 */
Variables.prototype.set = function (varName, varValue) {
    this.store[varName] = varValue;
}

/**
 * Returns value of variable 'varName'.
 */
Variables.prototype.get = function (varName) {
    return this.store[varName];
}

/**
 * Checks no variables are defined.
 */
Variables.prototype.isEmpty = function () {
    return Object.keys(this.store).length === 0;
}

/**
 * Removes variable 'varName'.
 * @param varName {string}
 */
Variables.prototype.clear = function (varName) {
    delete this.store[varName];
}

/**
 * Removes all variables.
 */
Variables.prototype.clearAll = function (varName) {
    this.store = {};
}

///////////// LogTestingCapture /////////////
function LogTestingCapture() {
    this.details = [];
}

LogTestingCapture.prototype.add = function (detail) {
    this.details.push(detail);
}

///////////// TestReportStore /////////////
// Lazy variable to referenced to uos.dev.restcli.report.TestReportStore
var _store = Java.type("uos.dev.restcli.report.TestReportStore");

function TestReportStore() {
}

TestReportStore.prototype.add = function (name, isPassed, exception, detail) {
    _store.addTestReport(name, isPassed, exception, detail);
}

///////////// Logger /////////////
var _jsLogger = Java.type("uos.dev.restcli.jsbridge.JsLogger");

function Logger() {
}

Logger.prototype.debug = function (message) {
    _jsLogger.debug(JSON.stringify(message));
}

Logger.prototype.info = function (message) {
    _jsLogger.info(JSON.stringify(message));
}

Logger.prototype.warn = function (message) {
    _jsLogger.warn(JSON.stringify(message));
}

Logger.prototype.error = function (message) {
    _jsLogger.error(JSON.stringify(message));
}

Logger.prototype.trace = function (message) {
    _jsLogger.trace(JSON.stringify(message));
}

///////////// TermColors /////////////
var ANSI_RESET = "\u001B[0m";
var ANSI_BLACK = "\u001B[30m";
var ANSI_RED = "\u001B[31m";
var ANSI_GREEN = "\u001B[32m";
var ANSI_YELLOW = "\u001B[33m";
var ANSI_BLUE = "\u001B[34m";
var ANSI_PURPLE = "\u001B[35m";
var ANSI_CYAN = "\u001B[36m";
var ANSI_WHITE = "\u001B[37m";

function TermColors() {
}

TermColors.prototype.green = function (message) {
    return ANSI_GREEN + message + ANSI_RESET;
}

TermColors.prototype.red = function (message) {
    return ANSI_RED + message + ANSI_RESET;
}

TermColors.prototype.black = function (message) {
    return ANSI_BLACK + message + ANSI_RESET;
}

TermColors.prototype.yellow = function (message) {
    return ANSI_YELLOW + message + ANSI_RESET;
}

TermColors.prototype.blue = function (message) {
    return ANSI_BLUE + message + ANSI_RESET;
}

TermColors.prototype.purple = function (message) {
    return ANSI_PURPLE + message + ANSI_RESET;
}

TermColors.prototype.cyan = function (message) {
    return ANSI_CYAN + message + ANSI_RESET;
}

TermColors.prototype.white = function (message) {
    return ANSI_WHITE + message + ANSI_RESET;
}
