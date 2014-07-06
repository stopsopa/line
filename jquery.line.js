/**
 * @author Szymon Działowski
 * @homepage 
 * @ver 1.0
 */
;(function ($) {
    function calcDistance(x1, y1, x2, y2) { // http://www.gwycon.com/calculating-the-distance-between-two-pixels/
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    function calcAngle(x1, y1, x2, y2) { // http://stackoverflow.com/a/7586218
        return Math.atan( (y2 - y1) / (x2 - x1) ) * 180 / Math.PI;
    }
    /**
     * @returns jQuery object representing line
     */
    $.fn.line = function (x1, y1, x2, y2, opt, callback) {
        
        if (x2 < x1) {
            var e = x2;
            x2 = x1;
            x1 = e;
            e = y1;
            y1 = y2;
            y2 = e
        }

        if ($(this).length > 1) 
            throw "$(this) is more then one element";		    

        var o = $.extend(true, {
            create: $('<div></div>'),
            class: '_line',
            css: {
                borderTop: '1px solid black',
                height: '0',
                zIndex: '999',
                zoom: 1
            }
        }, opt || {});

        opt.css && (o.css = opt.css);

        var angle = calcAngle(x1, y1, x2, y2);

        o.create
            .css(o.css)
            .css({
                position: 'absolute',
                width: calcDistance(x1, y1, x2, y2) + 'px',
                '-webkit-transform': 'rotate(' + angle + 'deg)',
                '-moz-transform': 'rotate(' + angle + 'deg)',
                '-ms-transform': 'rotate(' + angle + 'deg)',
                '-o-transform': 'rotate(' + angle + 'deg)',
                transform: 'rotate(' + angle + 'deg)',

                'transform-origin' :  '0 0',
                '-ms-transform-origin' : '0 0', /* IE 9 */
                '-webkit-transform-origin' : '0 0', /* Chrome, Safari, Opera */			    

                top : y1+'px',
                left : x1+'px'
            });

        o.class && o.create.addClass(o.class);

        o.create.appendTo($(this));
        
        typeof callback == 'function' && callback(o.create, o);
        
        return o.create;
    };
    /**
     * @returns jQuery object representing line
     */
    $.line = function (x1, y1, x2, y2, opt, callback) {
        return $('body').line(x1, y1, x2, y2, opt, callback);
    };
})(jQuery);