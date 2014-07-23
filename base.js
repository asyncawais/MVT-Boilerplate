if (typeof window.console == 'undefined') {
    window.console = { log: function() {}, info: function() {}, warn: function() {} }
}
if (1 == 2 && !Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/ ) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}
var debug = true,
    level = {},
    helpers = {
        addCSS: function(sRules, sID) {
            if (!sRules) return false;
            var CSS = document.createElement("style");
            if (sID) CSS.id = sID;
            CSS.setAttribute("type", "text/css");
            if (CSS.styleSheet) CSS.styleSheet.cssText = sRules;
            else CSS.appendChild(document.createTextNode(sRules));
            document.getElementsByTagName("head")[0].appendChild(CSS);
        },
        addEvent: function(tgt, evt, callback, capture) {
            if (typeof tgt.addEventListener == 'undefined') {
                tgt.attachEvent('on' + evt, callback);
            } else {
                tgt.addEventListener(evt, callback, capture);
            }
        },
        conversion: function(name, config) {
            helpers.log('DEBUG: Conversion Point: ' + name);
            xx.conversion(config.alias, {
                cp: name,
                ci: false,
                cc: true,
                b: !!config.beacon
            });
        },
        conversions: function(conversions, config) {

            /*
             * Conversions object example:
             * var cpObject = [
             * {name: '1_LOGO_Home', elements: '#1_LOGO_Home a', type: 'redirect'},
             * {name: '2_NAV_Home', elements: '#parent_nav .home_link a', type: 'redirect'},
             * {name: '3_NAV_Savings', elements: '#parent_nav .parent_links li:first a', type: 'redirect'},
             * ];
             */

            // Exit if jQuery does not exist
            if (!this.jqueryExists()) {
                return;
            }
            for (var i = 0; i < conversions.length; i++) {
                (function(index) {
                    var c = conversions[index];
                    var handler = c.handler == 'click' || !c.handler ? 'click' : c.handler;
                    $(c.elements)
                        .bind(handler, function(evt) {
                            if (c.type == 'redirect' || typeof c.callback == 'function') {
                                evt.preventDefault();
                            }
                            xx.conversion(config.alias, {
                                cp: c.name,
                                ci: false,
                                b: !!c.beacon
                            });
                            if (c.type == 'redirect') {
                                var href = this.href;
                                var t = setTimeout(function() {
                                    window.location = href;
                                }, 800);
                            } else if (typeof c.callback == 'function') {
                                c.callback(this, evt, c);
                            }
                        });
                })(i);
            }
        },
        cookies: {
            set: function(c_name, value, exdays) {
                var exdate = new Date();
                exdate.setDate(exdate.getDate() + exdays);
                var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toGMTString());
                document.cookie = c_name + "=" + c_value + '; path=/';
            },
            get: function(c_name) {
                var i, x, y, ARRcookies = document.cookie.split(";");
                for (i = 0; i < ARRcookies.length; i++) {
                    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
                    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
                    x = x.replace(/^\s+|\s+$/g, "");
                    if (x == c_name) {
                        return unescape(y);
                    }
                }
            }
        },
        getElementsByClassName: function(klass) {
            if (typeof document.getElementsByClassName != 'undefined') {
                return document.getElementsByClassName(klass);
            }
            var elementClassNames,
                elements = document.getElementsByTagName('*'),
                matchedElements = [];
            for (var i = 0, len = elements.length; i < len; i++) {
                elementClassNames = elements[i].className.split(' ');
                if (elementClassNames.indexOf(klass) > -1) {
                    matchedElements.push(elements[i]);
                }
            }
            return matchedElements;
        },
        getElementById: function(id) {
            return document.getElementById(id);
        },
        hashChange: function(callback) {
            var previousHash = window.location.hash,
                currentHash,
                hashName;
            setInterval(function() {
                currentHash = window.location.hash;
                if (currentHash != previousHash) {
                    previousHash = currentHash;
                    hashName = currentHash;
                    if (hashName.indexOf('#') == 0) {
                        hashName = hashName.slice(1)
                    }
                    callback(hashName);
                }
            }, 100);
        },
        isArray: function(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
        isNumber: function(obj) {
            return !isNaN(parseFloat(obj));
        },
        isObject: function(obj) {
            return Object.prototype.toString.call(obj) === '[object Object]';
        },
        jqueryExists: function() {
            return typeof jQuery == 'function';
        },
        log: function(txt) {
            if (xDebug) {
                console.log('DEBUG: ' + txt);
            }
        },
        preloadImages: function(imagesArr) {
            if (!isArray(imagesArr)) {
                return;
            }
            var imgObj = new Image();
            for (var i = 0; i < imagesArr.length; i++) {
                imgObj.src = imagesArr[i];
            }
        },
        getParams: function() {
            var qs = window.location.search.toString(),
                qs_segs = [],
                params = {};
            if (qs) {
                qs_segs = qs.slice(1, qs.length)
                    .split('&');
                for (var i = 0; i < qs_segs.length; i++) {
                    params[qs_segs[i].split('=')[0]] = qs_segs[i].split('=')[1];
                }
            }
            return params;
        }
    };