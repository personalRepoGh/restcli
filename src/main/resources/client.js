var client = new HttpClient();
var response = new HttpResponse();
var logger = new Logger();

///////////// HttpClient /////////////
function HttpClient() {
    this.global = new Variables();
}

/**
 * Creates test with name 'testName' and body 'func'.
 * All tests will be executed right after response handler script.
 */
HttpClient.prototype.test = function (testName, func) {
    try {
        func();
        logger.green("✓ " + testName);
    } catch (e) {
        logger.error("✗ " + testName + "\n" + e.message);
    }
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
        throw new Error(message);
    }
}

/**
 * Prints text to the response handler or test stdout and then terminates the line.
 */
HttpClient.prototype.log = function (text) {
    logger.info(text);
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
    for (var i = 0; i < this.headers.length; i++) {
        var header = this.headers[i];
        if (header.hasOwnProperty(headerName)) {
            return header;
        }
    }
    return null;
}

/**
 * Retrieves all values of 'headerName' response header. Returns empty list if header with 'headerName' doesn't exist.
 */
ResponseHeaders.prototype.valuesOf = function (headerName) {
    var result = [];
    for (var i = 0; i < this.headers.length; i++) {
        var header = this.headers[i];
        if (header.hasOwnProperty(headerName)) {
            result.push(header);
        }
    }
    return result;
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

///////////// Logging /////////////
var ANSI_RESET = "\u001B[0m";
var ANSI_BLACK = "\u001B[30m";
var ANSI_RED = "\u001B[31m";
var ANSI_GREEN = "\u001B[32m";
var ANSI_YELLOW = "\u001B[33m";
var ANSI_BLUE = "\u001B[34m";
var ANSI_PURPLE = "\u001B[35m";
var ANSI_CYAN = "\u001B[36m";
var ANSI_WHITE = "\u001B[37m";

function Logger() {
}

Logger.prototype.info = function (message) {
    print(message);
}

Logger.prototype.error = function (message) {
    print(ANSI_RED + message + ANSI_RESET);
}

Logger.prototype.warning = function (message) {
    print(ANSI_YELLOW + message + ANSI_RESET);
}

Logger.prototype.green = function (message) {
    print(ANSI_GREEN + message + ANSI_RESET);
}
