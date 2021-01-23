(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var OAuth2PopupFlow = /** @class */ (function () {
        function OAuth2PopupFlow(options) {
            this.authorizationUri = options.authorizationUri;
            this.clientId = options.clientId;
            this.redirectUri = options.redirectUri;
            this.scope = options.scope;
            this.responseType = options.responseType || 'token';
            this.accessTokenStorageKey = options.accessTokenStorageKey || 'token';
            this.accessTokenResponseKey =
                options.accessTokenResponseKey || 'access_token';
            this.storage = options.storage || window.localStorage;
            this.pollingTime = options.pollingTime || 200;
            this.additionalAuthorizationParameters =
                options.additionalAuthorizationParameters;
            this.tokenValidator = options.tokenValidator;
            this.beforePopup = options.beforePopup;
            this.afterResponse = options.afterResponse;
            this._eventListeners = {};
        }
        Object.defineProperty(OAuth2PopupFlow.prototype, "_rawToken", {
            get: function () {
                return this.storage.getItem(this.accessTokenStorageKey) || undefined;
            },
            set: function (value) {
                if (value === null)
                    return;
                if (value === undefined)
                    return;
                this.storage.setItem(this.accessTokenStorageKey, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OAuth2PopupFlow.prototype, "_rawTokenPayload", {
            get: function () {
                var rawToken = this._rawToken;
                if (!rawToken)
                    return undefined;
                var tokenSplit = rawToken.split('.');
                var encodedPayload = tokenSplit[1];
                if (!encodedPayload)
                    return undefined;
                var decodedPayloadJson = window.atob(encodedPayload.replace('-', '+').replace('_', '/'));
                var decodedPayload = OAuth2PopupFlow.jsonParseOrUndefined(decodedPayloadJson);
                return decodedPayload;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * A simple synchronous method that returns whether or not the user is logged in by checking
         * whether or not their token is present and not expired.
         */
        OAuth2PopupFlow.prototype.loggedIn = function () {
            var decodedPayload = this._rawTokenPayload;
            if (!decodedPayload)
                return false;
            if (this.tokenValidator) {
                var token = this._rawToken;
                if (!this.tokenValidator({ payload: decodedPayload, token: token }))
                    return false;
            }
            var exp = decodedPayload.exp;
            if (!exp)
                return false;
            if (new Date().getTime() > exp * 1000)
                return false;
            return true;
        };
        /**
         * Returns true only if there is a token in storage and that token is expired. Use this to method
         * in conjunction with `loggedIn` to display a message like "you need to *re*login" vs "you need
         * to login".
         */
        OAuth2PopupFlow.prototype.tokenExpired = function () {
            var decodedPayload = this._rawTokenPayload;
            if (!decodedPayload)
                return false;
            var exp = decodedPayload.exp;
            if (!exp)
                return false;
            if (new Date().getTime() <= exp * 1000)
                return false;
            return true;
        };
        /**
         * Deletes the token from the given storage causing `loggedIn` to return false on its next call.
         * Also dispatches `logout` event
         */
        OAuth2PopupFlow.prototype.logout = function () {
            this.storage.removeItem(this.accessTokenStorageKey);
            this.dispatchEvent(new Event('logout'));
        };
        /**
         * Call this method in a route of the `redirectUri`. This method takes the value of the hash at
         * `window.location.hash` and attempts to grab the token from the URL.
         *
         * If the method was able to grab the token, it will return `'SUCCESS'` else it will return a
         * different string.
         */
        OAuth2PopupFlow.prototype.handleRedirect = function () {
            var locationHref = window.location.href;
            if (!locationHref.startsWith(this.redirectUri))
                return 'REDIRECT_URI_MISMATCH';
            var rawHash = window.location.hash;
            if (!rawHash)
                return 'FALSY_HASH';
            var hashMatch = /#(.*)/.exec(rawHash);
            // this case won't happen because the browser typically adds the `#` always
            if (!hashMatch)
                return 'NO_HASH_MATCH';
            var hash = hashMatch[1];
            var authorizationResponse = OAuth2PopupFlow.decodeUriToObject(hash);
            if (this.afterResponse) {
                this.afterResponse(authorizationResponse);
            }
            var rawToken = authorizationResponse[this.accessTokenResponseKey];
            if (!rawToken)
                return 'FALSY_TOKEN';
            this._rawToken = rawToken;
            window.location.hash = '';
            return 'SUCCESS';
        };
        /**
         * supported events are:
         *
         * 1. `logout`–fired when the `logout()` method is called and
         * 2. `login`–fired during the `tryLoginPopup()` method is called and succeeds
         */
        OAuth2PopupFlow.prototype.addEventListener = function (type, listener) {
            var listeners = this._eventListeners[type] || [];
            listeners.push(listener);
            this._eventListeners[type] = listeners;
        };
        /**
         * Use this to dispatch an event to the internal `EventTarget`
         */
        OAuth2PopupFlow.prototype.dispatchEvent = function (event) {
            var listeners = this._eventListeners[event.type] || [];
            for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
                var listener = listeners_1[_i];
                var dispatch = typeof listener === 'function'
                    ? listener
                    : typeof listener === 'object' &&
                        typeof listener.handleEvent === 'function'
                        ? listener.handleEvent.bind(listener)
                        : function () { };
                dispatch(event);
            }
            return true;
        };
        /**
         * Removes the event listener in target's event listener list with the same type, callback, and options.
         */
        OAuth2PopupFlow.prototype.removeEventListener = function (type, listener) {
            var listeners = this._eventListeners[type] || [];
            this._eventListeners[type] = listeners.filter(function (l) { return l !== listener; });
        };
        /**
         * Tries to open a popup to login the user in. If the user is already `loggedIn()` it will
         * immediately return `'ALREADY_LOGGED_IN'`. If the popup fails to open, it will immediately
         * return `'POPUP_FAILED'` else it will wait for `loggedIn()` to be `true` and eventually
         * return `'SUCCESS'`.
         *
         * Also dispatches `login` event
         */
        OAuth2PopupFlow.prototype.tryLoginPopup = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var additionalParams, popup;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.loggedIn())
                                return [2 /*return*/, 'ALREADY_LOGGED_IN'];
                            if (!this.beforePopup) return [3 /*break*/, 2];
                            return [4 /*yield*/, Promise.resolve(this.beforePopup())];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            additionalParams = typeof this.additionalAuthorizationParameters === 'function'
                                ? this.additionalAuthorizationParameters()
                                : typeof this.additionalAuthorizationParameters === 'object'
                                    ? this.additionalAuthorizationParameters
                                    : {};
                            popup = window.open(this.authorizationUri + "?" + OAuth2PopupFlow.encodeObjectToUri(tslib_1.__assign({ client_id: this.clientId, response_type: this.responseType, redirect_uri: this.redirectUri, scope: this.scope }, additionalParams)));
                            if (!popup)
                                return [2 /*return*/, 'POPUP_FAILED'];
                            return [4 /*yield*/, this.authenticated()];
                        case 3:
                            _a.sent();
                            popup.close();
                            this.dispatchEvent(new Event('login'));
                            return [2 /*return*/, 'SUCCESS'];
                    }
                });
            });
        };
        /**
         * A promise that does not resolve until `loggedIn()` is true. This uses the `pollingTime`
         * to wait until checking if `loggedIn()` is `true`.
         */
        OAuth2PopupFlow.prototype.authenticated = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!this.loggedIn()) return [3 /*break*/, 2];
                            return [4 /*yield*/, OAuth2PopupFlow.time(this.pollingTime)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 0];
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * If the user is `loggedIn()`, the token will be returned immediate, else it will open a popup
         * and wait until the user is `loggedIn()` (i.e. a new token has been added).
         */
        OAuth2PopupFlow.prototype.token = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var token;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authenticated()];
                        case 1:
                            _a.sent();
                            token = this._rawToken;
                            if (!token)
                                throw new Error('Token was falsy after being authenticated.');
                            return [2 /*return*/, token];
                    }
                });
            });
        };
        /**
         * If the user is `loggedIn()`, the token payload will be returned immediate, else it will open a
         * popup and wait until the user is `loggedIn()` (i.e. a new token has been added).
         */
        OAuth2PopupFlow.prototype.tokenPayload = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var payload;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authenticated()];
                        case 1:
                            _a.sent();
                            payload = this._rawTokenPayload;
                            if (!payload)
                                throw new Error('Token payload was falsy after being authenticated.');
                            return [2 /*return*/, payload];
                    }
                });
            });
        };
        /**
         * wraps `JSON.parse` and return `undefined` if the parsing failed
         */
        OAuth2PopupFlow.jsonParseOrUndefined = function (json) {
            try {
                return JSON.parse(json);
            }
            catch (e) {
                return undefined;
            }
        };
        /**
         * wraps `setTimeout` in a `Promise` that resolves to `'TIMER'`
         */
        OAuth2PopupFlow.time = function (milliseconds) {
            return new Promise(function (resolve) {
                return window.setTimeout(function () { return resolve('TIMER'); }, milliseconds);
            });
        };
        /**
         * wraps `decodeURIComponent` and returns the original string if it cannot be decoded
         */
        OAuth2PopupFlow.decodeUri = function (str) {
            try {
                return decodeURIComponent(str);
            }
            catch (_a) {
                return str;
            }
        };
        /**
         * Encodes an object of strings to a URL
         *
         * `{one: 'two', buckle: 'shoes or something'}` ==> `one=two&buckle=shoes%20or%20something`
         */
        OAuth2PopupFlow.encodeObjectToUri = function (obj) {
            return Object.keys(obj)
                .map(function (key) { return ({ key: key, value: obj[key] }); })
                .map(function (_a) {
                var key = _a.key, value = _a.value;
                return encodeURIComponent(key) + "=" + encodeURIComponent(value);
            })
                .join('&');
        };
        /**
         * Decodes a URL string to an object of string
         *
         * `one=two&buckle=shoes%20or%20something` ==> `{one: 'two', buckle: 'shoes or something'}`
         */
        OAuth2PopupFlow.decodeUriToObject = function (str) {
            var _this = this;
            return str.split('&').reduce(function (decoded, keyValuePair) {
                var _a = keyValuePair.split('='), keyEncoded = _a[0], valueEncoded = _a[1];
                var key = _this.decodeUri(keyEncoded);
                var value = _this.decodeUri(valueEncoded);
                decoded[key] = value;
                return decoded;
            }, {});
        };
        return OAuth2PopupFlow;
    }());
    exports.OAuth2PopupFlow = OAuth2PopupFlow;
    exports.default = OAuth2PopupFlow;

})));
//# sourceMappingURL=index.js.map
