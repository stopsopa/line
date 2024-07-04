var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
export function line(parent, x1, y1, x2, y2, opt) {
    var _a, _b;
    var o = __assign({ style: "solid", width: 1, color: "black", cls: "jqline", correct: true, correctpos: "normal", css: {
            height: "0",
            zIndex: "999",
            zoom: 1,
        } }, opt);
    if (!isNode(o.create)) {
        o.create = document.createElement("div");
    }
    var ang = calcAngle(x1, y1, x2, y2); // degrees
    var c = correct(x1, y1, x2, y2, o, ang);
    c.distance = calcDistance(x1, y1, x2, y2);
    o.css = Object.assign(Object.assign({}, o.css), {
        borderTop: o.width + "px " + o.style + " " + o.color,
        position: "absolute",
        width: c.distance + "px",
        // "-webkit-transform": "rotate(" + ang + "deg)",
        // "-moz-transform": "rotate(" + ang + "deg)",
        // "-ms-transform": "rotate(" + ang + "deg)",
        // "-o-transform": "rotate(" + ang + "deg)",
        transform: "rotate(" + ang + "deg)",
        "transform-origin": "0 0",
        // "-ms-transform-origin": "0 0" /* IE 9 */,
        // "-webkit-transform-origin": "0 0" /* Chrome, Safari, Opera */,
        left: x1 + c.x + "px",
        top: y1 + c.y + "px",
    }, opt.css);
    Object.assign(o.create.style, o.css);
    o.cls && ((_a = o.create) === null || _a === void 0 ? void 0 : _a.classList.add(o.cls));
    o.id && ((_b = o.create) === null || _b === void 0 ? void 0 : _b.setAttribute("id", o.id));
    if (!parent.contains(o.create)) {
        parent.appendChild(o.create);
    }
    if (typeof o.callback === "function") {
        o.callback(o.create, o, c);
    }
    return o.create;
}
export function withAngleAndDistance(parent, x1, y1, angAndDis, opt) {
    var a = Array.from(arguments);
    var k;
    if (isDistanceAndAngle(angAndDis)) {
        k = calcXYOffsetByVectorAngle(angAndDis.ang, angAndDis.dis);
    }
    else if (isDistanceAndRadians(angAndDis)) {
        k = calcXYOffsetByVectorAngleRad(angAndDis.rad, angAndDis.dis);
    }
    else {
        throw new Error("Arguments incomplete: " + JSON.stringify(angAndDis));
    }
    a[6] = a[5];
    a[5] = a[4];
    a[3] = x1 + k.x;
    a[4] = y1 + k.y;
    return line(parent, a[3], a[4], a[5], a[6], opt);
}
export function defualtParent(x1, y1, x2, y2, opt) {
    return line(document.body, x1, y1, x2, y2, opt);
}
export function withAngleAndDistanceDefualtParent(x1, y1, angAndDis, opt) {
    return withAngleAndDistance(document.body, x1, y1, angAndDis, opt);
}
/**
 * https://stackoverflow.com/a/384380
 */
function isNode(o) {
    return typeof Node === "object"
        ? o instanceof Node
        : o &&
            typeof o === "object" &&
            typeof o.nodeType === "number" &&
            typeof o.nodeName === "string";
}
/**
 * angle to radians
 */
export function angToRad(ang) {
    return ang * (Math.PI / 180);
}
/**
 * radians to angle
 */
export function radToAng(rad) {
    return rad * (180 / Math.PI);
}
/**
 * calc distance between two points
 */
export function calcDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
/**
 * calculate angle in radians
 */
export function calcAngleRad(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}
/**
 * calculate angle in degrees
 */
export function calcAngle(x1, y1, x2, y2) {
    var a = calcAngleRad(x1, y1, x2, y2) * (180 / Math.PI);
    return a < 0 ? (a += 360) : a;
}
/**
 * calculate points based on radians and distance
 * calcXYOffsetByVectorAngleRad(x2.rad, x2.dis)
 */
export function calcXYOffsetByVectorAngleRad(rad, dis) {
    return {
        // http://stackoverflow.com/a/10962780
        x: Math.cos(rad) * dis,
        y: Math.sin(rad) * dis,
    };
}
export function calcXYOffsetByVectorAngle(ang, dis) {
    return calcXYOffsetByVectorAngleRad(angToRad(ang), dis);
}
/**
 * calculate correction
 */
function correct(x1, y1, x2, y2, o, ang) {
    ang || (ang = calcAngle(x1, y1, x2, y2));
    var hw = o.width / 2;
    var hwo = hw; // originial
    var sw = false;
    if (typeof o.correct === "number") {
        var c_1 = o.correct;
        switch (true) {
            case o.correctpos == "normal":
                hw += c_1;
                break;
            case o.correctpos == "top" && ang > 90 && ang < 270:
                sw = true;
                c_1 = -Math.abs(c_1);
                break;
            case o.correctpos == "bottom" && (ang < 90 || ang > 270):
                sw = true;
                c_1 = -Math.abs(c_1);
                break;
            case o.correctpos == "left" && ang > 0 && ang < 180:
                sw = true;
                c_1 = -Math.abs(c_1);
                break;
            case o.correctpos == "right" && (ang < 0 || ang > 180):
                sw = true;
                c_1 = -Math.abs(c_1);
                break;
        }
        hw += c_1;
    }
    var rad = calcAngleRad(x1, y1, x2, y2); // radians
    var radminhalf = rad - Math.PI / 2; // radians minus half radian
    var c = {
        x: 0,
        y: 0,
        oy: 0,
        ox: 0,
        ang: 0,
        rad: 0,
        ox2: 0,
        oy2: 0,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
    };
    if (o.correct === false) {
        c.x = c.y = c.oy = c.ox = 0;
    }
    else {
        c.y = Math.sin(radminhalf) * hw;
        c.x = Math.cos(radminhalf) * hw;
        c.oy = Math.sin(radminhalf) * hwo; // without correction
        c.ox = Math.cos(radminhalf) * hwo; // without correction
    }
    c.ang = ang;
    c.rad = rad;
    c.ox2 = c.ox * 2;
    c.oy2 = c.oy * 2;
    c.x1 = x1;
    c.y1 = y1;
    c.x2 = x2;
    c.y2 = y2;
    if (sw) {
        c.ax = c.x1 - c.ox2;
        c.ay = c.y1 - c.oy2;
        c.bx = c.ax + c.x;
        c.by = c.ay + c.y;
        c.cx = c.x2 + c.x;
        c.cy = c.y2 + c.y;
        c.dx = c.cx - c.ox2;
        c.dy = c.cy - c.oy2;
    }
    else {
        c.bx = c.x1 + c.x;
        c.by = c.y1 + c.y;
        c.ax = c.bx - c.ox2;
        c.ay = c.by - c.oy2;
        c.dx = c.x2 + c.x;
        c.dy = c.y2 + c.y;
        c.cx = c.dx - c.ox2;
        c.cy = c.dy - c.oy2;
    }
    return c;
}
function isDistanceAndAngle(obj) {
    return typeof obj.ang !== "undefined";
}
function isDistanceAndRadians(obj) {
    return typeof obj.rad !== "undefined";
}
