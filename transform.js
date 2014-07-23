(function () {

    var h = helpers;

    var config = {
        'pollTimeout'       : 5000,
        'polledElementID'   : 'footer',
        'alias'             : '',
        'imagePath'         : '',
        'hideCSS'           : ''
    };

    function renderContent($) {

        h.log('render');

        h.addCSS(['.wtHide { display: none; }', '.wtForceHide { display: none !important; }'].join(''));

        var _levels = {};

        _levels.F1 = {
            'level_1': function () {

            },
            'level_2': function () {

            }
        };

        function execLevels() {
            h.log(JSON.stringify(xLevels));
            for (var factor in xLevels) {
                if (xLevels.hasOwnProperty(factor)) {
                    try {
                        _levels[factor][xLevels[factor]]();
                    } catch (e) {
                        h.log('Factor: ' + factor);
                        h.log(e);
                    }
                }
            }
        }

        $(document).ajaxComplete(function () {
            execLevels();
        });
        execLevels();

        setTimeout(function () {
            $('#xShowHide').remove();
        }, 1000);
        
    }

    function conversions($) {

    }

    if (typeof window[(config.alias + '_complete')] == 'undefined') {
        window[(config.alias + '_complete')] = 0;
    }

    if (!h.getElementById('xShowHide')) {
        h.addCSS(config.hideCSS, 'xShowHide');
    }

    var pollTimer = 0;

    function pollAndRender() {
        pollTimer += 250;
        if (pollTimer > config.pollTimeout) {
            var showHideEl = document.getElementById('xShowHide');
            if (showHideEl) {
                showHideEl.parentNode.removeChild(showHideEl);
            }
            h.log('Exit Polling and Abort.');
            return;
        }
        if (!h.getElementById(config.polledElementID) || !h.jqueryExists()) {
            h.log('polling');
            setTimeout(pollAndRender, 250);
            return;
        }
        window[(config.alias + '_complete')] += 1;
        if (window[(config.alias + '_complete')] == 1) {
            renderContent(jQuery);
            conversions(jQuery);
        }
    }
    pollAndRender();
    
})();