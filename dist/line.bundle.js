(() => {
  // line.js
  var tool = function(parent, x1, y1, x2, y2, opt, callback) {
    if (!isNode(parent)) {
      return tool.apply(this, [document.body].concat(_a(arguments)));
    }
    if (isObject(x2)) {
      var k = 0, a = _a(arguments);
      if (typeof x2.ang != "undefined") {
        k = calcXYOffsetByVectorAngle(x2.ang, x2.dis);
      } else if (typeof x2.rad != "undefined") {
        k = calcXYOffsetByVectorAngleRad(x2.rad, x2.dis);
      } else {
        new Error("Arguments incomplete: " + JSON.stringify(a));
      }
      a[6] = a[5];
      a[5] = a[4];
      a[3] = x1 + k.x;
      a[4] = y1 + k.y;
      return tool.apply(this, a);
    }
    if (isFunction(opt)) {
      callback = opt;
    }
    opt || (opt = {});
    var o = {
      style: "solid",
      width: 1,
      color: "black",
      cls: "jqline",
      id: false,
      correct: true,
      // bool|int - corection of position, give integer to move
      correctpos: "normal",
      // normal, top, bottom, left, right
      css: {
        height: "0",
        zIndex: "999",
        zoom: 1
      }
    };
    o = Object.assign(o, opt || {});
    o.create = opt.create || document.createElement("div");
    var ang = calcAngle(x1, y1, x2, y2);
    var c = correct(x1, y1, x2, y2, o, ang);
    c.distance = calcDistance(x1, y1, x2, y2);
    o.css = Object.assign(
      Object.assign({}, o.css),
      {
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
        top: y1 + c.y + "px"
      },
      opt.css
    );
    Object.assign(o.create.style, o.css);
    o.cls && o.create.classList.add(o.cls);
    o.id && o.create.setAttribute("id", o.id);
    if (!parent.contains(o.create)) {
      parent.appendChild(o.create);
    }
    isFunction(callback) && callback(o.create, o, c);
    return o.create;
  };
  tool.radToAng = radToAng;
  tool.angToRad = angToRad;
  tool.calcDistance = calcDistance;
  tool.calcAngleRad = calcAngleRad;
  tool.calcAngle = calcAngle;
  tool.calcXYOffsetByVectorAngle = calcXYOffsetByVectorAngle;
  tool.calcXYOffsetByVectorAngleRad = calcXYOffsetByVectorAngleRad;
  var line_default = tool;
  function _a(a) {
    return Array.prototype.slice.call(a, 0);
  }
  function isFunction(a) {
    return typeof a == "function" || false;
  }
  function isObject(obj) {
    var type = typeof obj;
    return type === "function" || type === "object" && !!obj;
  }
  function angToRad(ang) {
    return ang * (Math.PI / 180);
  }
  function radToAng(rad) {
    return rad * (180 / Math.PI);
  }
  function calcDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
  function calcAngleRad(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  }
  function calcAngle(x1, y1, x2, y2) {
    var a = calcAngleRad(x1, y1, x2, y2) * (180 / Math.PI);
    return a < 0 ? a += 360 : a;
  }
  function calcXYOffsetByVectorAngleRad(rad, dis) {
    return {
      // http://stackoverflow.com/a/10962780
      x: Math.cos(rad) * dis,
      y: Math.sin(rad) * dis
    };
  }
  function calcXYOffsetByVectorAngle(ang, dis) {
    return calcXYOffsetByVectorAngleRad(angToRad(ang), dis);
  }
  function isNode(o) {
    return typeof Node === "object" ? o instanceof Node : o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string";
  }
  function correct(x1, y1, x2, y2, o, ang) {
    ang || (ang = calcAngle(x1, y1, x2, y2));
    var hw = o.width / 2;
    var hwo = hw;
    var sw = false;
    if (Number.isInteger(o.correct)) {
      var c = o.correct;
      switch (true) {
        case o.correctpos == "normal":
          hw += c;
          break;
        case (o.correctpos == "top" && ang > 90 && ang < 270):
          sw = true;
          c = -Math.abs(c);
          break;
        case (o.correctpos == "bottom" && (ang < 90 || ang > 270)):
          sw = true;
          c = -Math.abs(c);
          break;
        case (o.correctpos == "left" && ang > 0 && ang < 180):
          sw = true;
          c = -Math.abs(c);
          break;
        case (o.correctpos == "right" && (ang < 0 || ang > 180)):
          sw = true;
          c = -Math.abs(c);
          break;
      }
      hw += c;
    }
    var rad = calcAngleRad(x1, y1, x2, y2);
    var radminhalf = rad - Math.PI / 2;
    var c = {};
    if (o.correct === false) {
      c.x = c.y = c.oy = c.ox = 0;
    } else {
      c.y = Math.sin(radminhalf) * hw;
      c.x = Math.cos(radminhalf) * hw;
      c.oy = Math.sin(radminhalf) * hwo;
      c.ox = Math.cos(radminhalf) * hwo;
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
    } else {
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

  // libs/line.entry.js
  {
    let protoFactory = function(source, format) {
      let root;
      switch (format) {
        case "file":
          root = protobuf.load(source);
          break;
        case "string":
          root = protobuf.parse(source).root;
          break;
        default:
          throw Error('protobuf error: format must be "file" or "string"');
      }
      return {
        encode: function(payload) {
          var AwesomeMessage = root.lookupType("awesomepackage.AwesomeMessage");
          var message = AwesomeMessage.fromObject(payload);
          var buffer = AwesomeMessage.encode(message).finish();
          var base64String = base.encode(buffer);
          base64String = base64String.replace(/\//g, "_").replace(/=/g, "-");
          return base64String;
        },
        decode: function(string) {
          string = string.replace(/_/g, "/").replace(/-/g, "=");
          const buffer = base.decode(string);
          var AwesomeMessage = root.lookupType("awesomepackage.AwesomeMessage");
          var message = AwesomeMessage.decode(buffer);
          var object = AwesomeMessage.toObject(message, {
            // longs: String,
            enums: String,
            defaults: true
            // bytes: String,
            // see ConversionOptions
          });
          return object;
        }
      };
    }, fetchGet = function(publish = false) {
      const s = new URLSearchParams(window.location.search).get("s");
      if (typeof s === "string") {
        const decoded = encoder.decode(s);
        const {
          color,
          style,
          width,
          useincorrect,
          correctb,
          correctn,
          correctpos,
          measure: measure2
        } = decoded;
        const extend = { color, style, width, correctpos, measure: measure2 };
        extend.correct = useincorrect === "correctb" ? correctb : correctn;
        Object.assign(state, extend);
        if (publish) {
          ps.publish("color", state.color);
        }
      }
      return s;
    }, update = function(opt) {
      Object.assign(state, opt);
      const { color, style, width, correct: correct2, correctpos, measure: measure2 } = state;
      statepre.innerHTML = `
line(document.body, 140, 150, 160, 150, {
  color: "${color}",
  style: "${style}",
  width: ${width},
  correct: ${correct2},
  correctpos: "${correctpos}",
  create: div,
});

`;
      const payload = {
        color,
        style,
        width,
        /* correct, skip this one */
        correctpos,
        measure: measure2
      };
      if (typeof correct2 === "boolean") {
        payload.useincorrect = "correctb";
        payload.correctb = correct2;
      } else {
        payload.useincorrect = "correctn";
        payload.correctn = correct2;
      }
      const get = encoder.encode(payload);
      history.pushState(
        {},
        "",
        `${location.protocol}//${location.host}${location.pathname}?s=${get}`
      );
      ps.publish("state", state);
    };
    document.querySelector("[data-reset]").setAttribute(
      "href",
      `${location.protocol}//${location.host}${location.pathname}`
    );
    const encoder = protoFactory(
      `
syntax = "proto3";
package awesomepackage;

enum Style {
  solid = 0; 
  dotted = 1;
  dashed = 2;
  double = 3;
  groove = 4;
  ridge = 5;
  inset = 6;
  outset = 7;
}

enum Correctpos {
  normal = 0;
  top = 1;
  bottom = 2;
  left = 3;
  right = 4;
}

enum UseInCorrect {
  correctb = 0;
  correctn = 1;
}

message AwesomeMessage {
  string color = 1; 
  Style style = 2;
  int32 width = 3;

  UseInCorrect useincorrect = 4; // 'correctb' or 'correctn'
  bool correctb = 5;
  int32 correctn = 6;

  Correctpos correctpos = 7;
  bool measure = 8;
}    
`,
      "string"
    );
    const ps = {
      events: {},
      subscribe(event, callback2) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback2);
      },
      publish(event, data) {
        if (this.events[event])
          this.events[event].forEach((callback2) => callback2(data));
      }
    };
    const state = {
      color: "#383838",
      style: "solid",
      width: 3,
      // supporting fields just for serialization using protobuf ------------ vvv
      useincorrect: "correctb",
      // 'correctb' or 'correctn'
      correctb: true,
      corrects: 0,
      // supporting fields just for serialization using protobuf ------------ ^^^
      // and this is state used really locally, all above is here because I've tried to be clever and use one field as bool and int at the same time <facepalm>
      correct: true,
      correctpos: "normal",
      css: {
        height: "0",
        zIndex: "999",
        zoom: 1
      },
      measure: false
    };
    const statepre = document.querySelector("#state");
    fetchGet();
    let run = false;
    let x1, y1, t;
    {
      const color = document.querySelector("#color");
      ps.subscribe("color", (v) => {
        color.value = v;
      });
      ps.publish("color", state.color);
      color.addEventListener(
        "input",
        (e) => update({ color: e.target.value }),
        false
      );
      color.addEventListener(
        "change",
        (e) => update({ color: e.target.value }),
        false
      );
    }
    {
      const parent = document.querySelector("#styles");
      ps.subscribe("style", (v) => {
        parent.querySelector(`input[type="radio"][value="${v}"]`).checked = true;
      });
      ps.publish("style", state.style);
      parent.addEventListener("click", (e) => {
        const target = e.target;
        var match = target.matches(`input[type="radio"][name="style"]`);
        if (match) {
          update({ style: target.value });
        }
      });
    }
    {
      const width = document.querySelector("#width");
      const parent = width.parentNode;
      const up = parent.querySelector(".up");
      const down = parent.querySelector(".down");
      ps.subscribe("width", (v) => {
        width.innerHTML = String(v);
      });
      ps.publish("width", state.width);
      parent.addEventListener("click", (e) => {
        const target = e.target;
        if (target === up || target === down) {
          var v = parseInt(width.innerHTML, 10);
          if (target === up) {
            v += 1;
          }
          if (target === down) {
            --v;
            if (v < 1) {
              v = 1;
            }
          }
          width.innerHTML = String(v);
          update({ width: v });
        }
      });
    }
    const parentSwitch = document.querySelector("#switch");
    {
      ps.subscribe("correctpos", (v) => {
        parentSwitch.querySelector(
          `input[type="radio"][value="${v}"]`
        ).checked = true;
      });
      ps.publish("correctpos", state.correctpos);
      parentSwitch.addEventListener("click", (e) => {
        const target = e.target;
        var match = target.matches(`input[type="radio"][name="correctpos"]`);
        if (match) {
          update({ correctpos: target.value });
        }
      });
    }
    const measure = document.querySelector("#measure");
    {
      ps.subscribe("measure", (v) => {
        measure.checked = v;
      });
      ps.publish("measure", state.measure);
      measure.addEventListener("change", (e) => {
        update({ measure: e.target.checked });
      });
    }
    {
      let get = function() {
        var v = correct2.innerHTML;
        if (v == "true") {
          return true;
        }
        if (v == "false") {
          return false;
        }
        return parseInt(v, 10);
      }, set = function(v) {
        correct2.innerHTML = String(v);
        v = get();
        update({ correct: v });
        const radios = [
          ...parentSwitch.querySelectorAll('input[type="radio"]'),
          measure
        ];
        if (v !== false && v !== true) {
          return radios.forEach((el) => el.removeAttribute("disabled"));
        }
        radios.forEach((el) => el.setAttribute("disabled", "disabled"));
      };
      const correct2 = document.querySelector("#correct");
      const parent = correct2.parentNode;
      const up = parent.querySelector(".up");
      const down = parent.querySelector(".down");
      const step = 10;
      ps.subscribe("correct", (v) => {
        set(v);
      });
      ps.publish("correct", state.correct);
      parent.addEventListener("click", (e) => {
        const target = e.target;
        if (target === up || target === down) {
          var v = get();
          if (target === up) {
            if (v === true) return set(step);
            if (v === false) return set("true");
            if (v === 0 - step) return set("false");
            return set(v + step);
          }
          if (target === down) {
            if (v === true) return set("false");
            if (v === false) return set("-" + String(step));
            if (v === step) return set("true");
            return set(v - step);
          }
        }
      });
    }
    let callback;
    {
      hopt = {
        color: "red",
        css: {
          zIndex: "1000"
        }
      };
      callback = (div, o, c, leave) => {
        if (state.measure && o.correct !== false && o.correct !== true) {
          if (leave) {
            a = b = null;
          } else {
            a = line_default(c.x1, c.y1, c.bx, c.by, hopt);
            b = line_default(
              c.x2,
              c.y2,
              c.dx,
              c.dy,
              Object.assign({}, hopt, { color: "green" })
            );
          }
        }
      };
    }
    window.addEventListener("mousedown", function(e) {
      x1 = e.pageX;
      y1 = e.pageY;
      t = false;
      run = true;
    });
    window.addEventListener("mouseup", function(e) {
      if (x1 - e.pageX < 4 && y1 - e.pageY < 4) {
        return run = false;
      }
      run = false;
      t && t.parentNode.removeChild(t);
      line_default(x1, y1, e.pageX, e.pageY, state, function(div, o, c) {
        callback(div, o, c, true);
      });
    });
    window.addEventListener("mousemove", function(e) {
      if (run) {
        t && t.parentNode.removeChild(t);
        t = void 0;
        a && a.parentNode.removeChild(a);
        a = void 0;
        b && b.parentNode.removeChild(b);
        b = void 0;
        t = line_default(x1, y1, e.pageX, e.pageY, state, callback);
      }
    });
    {
      const parent = document.querySelector("#parent");
      const div = parent.querySelector("div");
      let a = {
        x1: 250,
        y1: 40,
        x2: 60,
        y2: 200
      };
      let b = {
        x1: 100,
        y1: 100,
        x2: 200,
        y2: 200
      };
      const { color, style, width, correct: correct2, correctpos } = state;
      line_default(parent, 140, 150, 160, 150, {
        color,
        style,
        width,
        correct: correct2,
        correctpos,
        create: div
      });
      ps.subscribe("state", ({ color: color2, style: style2, width: width2 }) => {
        Object.assign(div.style, {
          borderTopColor: color2,
          borderTopStyle: style2,
          borderTopWidth: width2 + "px"
        });
      });
      setInterval(() => {
        const { color: color2, style: style2, width: width2, correct: correct3, correctpos: correctpos2 } = state;
        line_default(parent, a.x1, a.y1, a.x2, a.y2, {
          color: color2,
          style: style2,
          width: width2,
          correct: correct3,
          correctpos: correctpos2,
          create: div
        });
        b = [a, a = b][0];
      }, 2100);
    }
  }
  var a;
  var b;
  var hopt;
})();
