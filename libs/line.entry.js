import { line, defualtParent } from "../line.js";

{
  document
    .querySelector("[data-reset]")
    .setAttribute(
      "href",
      `${location.protocol}//${location.host}${location.pathname}`
    );

  function protoFactory(source, format) {
    let root;
    switch (format) {
      case "file":
        // for this case encoder() returns promise
        root = protobuf.load(source);
        break;
      case "string":
        // for this case encoder() func is synchronous - no wrapping with promise
        root = protobuf.parse(source).root;

        // https://stackoverflow.com/a/70915341 - not documented
        // it can be found though in the examples: https://github.com/protobufjs/protobuf.js/blob/master/examples/traverse-types.js
        break;
      default:
        throw Error('protobuf error: format must be "file" or "string"');
    }
    return {
      encode: function (payload) {
        // from: https://github.com/protobufjs/protobuf.js?tab=readme-ov-file#using-proto-files

        var AwesomeMessage = root.lookupType("awesomepackage.AwesomeMessage");

        // // ;
        // // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
        // var errMsg = AwesomeMessage.verify(payload);
        // // if you need enum then use approach similar to
        // // https://www.sohamkamani.com/javascript/enums/
        // // then you can use .verify() method
        // // if you wan't to feed and receive object with original values then valid will not work and
        // // instead of create you will have to use fromObject(payload)

        // if (errMsg) {
        //   ;
        //   throw Error(errMsg);
        // }

        // Create a new message
        // var message = AwesomeMessage.create(payload); // or use .fromObject if conversion is necessary
        var message = AwesomeMessage.fromObject(payload); // or use .fromObject if conversion is necessary

        // Encode a message to an Uint8Array (browser) or Buffer (node)
        var buffer = AwesomeMessage.encode(message).finish();

        var base64String = base.encode(buffer);

        base64String = base64String.replace(/\//g, "_").replace(/=/g, "-");

        return base64String;
      },
      decode: function (string) {
        string = string.replace(/_/g, "/").replace(/-/g, "=");

        const buffer = base.decode(string);

        // from: https://github.com/protobufjs/protobuf.js?tab=readme-ov-file#using-proto-files
        var AwesomeMessage = root.lookupType("awesomepackage.AwesomeMessage");

        // Decode an Uint8Array (browser) or Buffer (node) to a message
        var message = AwesomeMessage.decode(buffer);
        // ... do something with message

        // If the application uses length-delimited buffers, there is also encodeDelimited and decodeDelimited.

        // Maybe convert the message back to a plain object
        var object = AwesomeMessage.toObject(message, {
          // longs: String,
          enums: String,
          defaults: true,
          // bytes: String,
          // see ConversionOptions
        });

        return object;
      },
    };
  }

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

  // https://frontendmasters.com/blog/vanilla-javascript-reactivity/#pubsub-pattern-publish-subscriber
  const ps = {
    events: {},
    subscribe(event, callback) {
      if (!this.events[event]) this.events[event] = [];
      this.events[event].push(callback);
    },

    publish(event, data) {
      if (this.events[event])
        this.events[event].forEach((callback) => callback(data));
    },
  };

  const state = {
    color: "#383838",
    style: "solid",
    width: 3,

    // supporting fields just for serialization using protobuf ------------ vvv
    useincorrect: "correctb", // 'correctb' or 'correctn'
    correctb: true,
    corrects: 0,
    // supporting fields just for serialization using protobuf ------------ ^^^

    // and this is state used really locally, all above is here because I've tried to be clever and use one field as bool and int at the same time <facepalm>
    correct: true,

    correctpos: "normal",
    css: {
      height: "0",
      zIndex: "999",
      zoom: 1,
    },
    measure: false,
  };

  const statepre = document.querySelector("#state");

  function fetchGet(publish = false) {
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
        measure,
      } = decoded;

      const extend = { color, style, width, correctpos, measure };

      extend.correct = useincorrect === "correctb" ? correctb : correctn;

      Object.assign(state, extend);

      if (publish) {
        ps.publish("color", state.color);
      }
    }

    return s;
  }

  // if get 's' param exist then apply it on top of state
  fetchGet();

  function update(opt) {
    Object.assign(state, opt);

    const { color, style, width, correct, correctpos, measure } = state;

    // use 'state' variable to assemble line like
    //
    // line(parent, a.x1, a.y1, a.x2, a.y2, {
    //   color,
    //   style,
    //   width,
    //   correct,
    //   correctpos,
    //   create: div,
    // });
    statepre.innerHTML = `
line(document.body, 140, 150, 160, 150, {
  color: "${color}",
  style: "${style}",
  width: ${width},
  correct: ${correct},
  correctpos: "${correctpos}",
  create: div,
});

`;

    const payload = {
      color,
      style,
      width,
      /* correct, skip this one */ correctpos,
      measure,
    };
    if (typeof correct === "boolean") {
      payload.useincorrect = "correctb";
      payload.correctb = correct;
    } else {
      payload.useincorrect = "correctn";
      payload.correctn = correct;
    }

    const get = encoder.encode(payload);

    history.pushState(
      {},
      "",
      `${location.protocol}//${location.host}${location.pathname}?s=${get}`
    );

    ps.publish("state", state);
  }
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
    ); // triggered many times while you playing with opened color picker
    color.addEventListener(
      "change",
      (e) => update({ color: e.target.value }),
      false
    ); // triggered at the end when you close the color picker
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
    // normal top bottom left right
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
    const correct = document.querySelector("#correct");
    const parent = correct.parentNode;
    const up = parent.querySelector(".up");
    const down = parent.querySelector(".down");
    const step = 10;
    function get() {
      var v = correct.innerHTML;
      if (v == "true") {
        return true;
      }
      if (v == "false") {
        return false;
      }
      return parseInt(v, 10);
    }
    function set(v) {
      correct.innerHTML = String(v); // setting as a string

      v = get(); // but getting true|false as boolean

      update({ correct: v });

      const radios = [
        ...parentSwitch.querySelectorAll('input[type="radio"]'),
        measure,
      ];

      if (v !== false && v !== true) {
        return radios.forEach((el) => el.removeAttribute("disabled"));
      }

      radios.forEach((el) => el.setAttribute("disabled", "disabled"));
    }
    ps.subscribe("correct", (v) => {
      set(v); // set initial value
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
    var a,
      b,
      hopt = {
        color: "red",
        css: {
          zIndex: "1000",
        },
      };
    callback = (div, o, c, leave) => {
      if (state.measure && o.correct !== false && o.correct !== true) {
        if (leave) {
          a = b = null;
        } else {
          a = defualtParent(c.x1, c.y1, c.bx, c.by, hopt);
          b = defualtParent(
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

  window.addEventListener("mousedown", function (e) {
    x1 = e.pageX;
    y1 = e.pageY;
    t = false;
    run = true;
  });

  window.addEventListener("mouseup", function (e) {
    if (x1 - e.pageX < 4 && y1 - e.pageY < 4) {
      return (run = false);
    }
    run = false;
    t && t.parentNode.removeChild(t);
    defualtParent(x1, y1, e.pageX, e.pageY, state, function (div, o, c) {
      callback(div, o, c, true);
    });
  });

  window.addEventListener("mousemove", function (e) {
    if (run) {
      t && t.parentNode.removeChild(t);
      t = undefined;
      a && a.parentNode.removeChild(a);
      a = undefined;
      b && b.parentNode.removeChild(b);
      b = undefined;
      t = defualtParent(x1, y1, e.pageX, e.pageY, state, callback);
    }
  });

  {
    // continuous animation
    const parent = document.querySelector("#parent");
    const div = parent.querySelector("div");

    let a = {
      x1: 250,
      y1: 40,
      x2: 60,
      y2: 200,
    };
    let b = {
      x1: 100,
      y1: 100,
      x2: 200,
      y2: 200,
    };

    const { color, style, width, correct, correctpos } = state;

    line(parent, 140, 150, 160, 150, {
      color,
      style,
      width,
      correct,
      correctpos,
      create: div,
    });

    ps.subscribe("state", ({ color, style, width }) => {
      Object.assign(div.style, {
        borderTopColor: color,
        borderTopStyle: style,
        borderTopWidth: width + "px",
      });
    });

    setInterval(() => {
      const { color, style, width, correct, correctpos } = state;

      line(parent, a.x1, a.y1, a.x2, a.y2, {
        color,
        style,
        width,
        correct,
        correctpos,
        create: div,
      });

      b = [a, (a = b)][0];
    }, 2100);
  }
}
