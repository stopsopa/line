export type Options = {
  width: number;
  style?: string;
  color?: string;
  cls?: string;
  id?: string;
  correct?: boolean | number;
  correctpos?: string;
  css?: Record<string, string | number>;
  create?: HTMLElement;
  callback?: (element: HTMLElement, opt: Options, c: Correct) => void;
};

export type DistanceAndRadians = {
  rad: number;
  dis: number;
};

export type DistanceAndAngle = {
  ang: number;
  dis: number;
};

export function line(
  parent: HTMLElement,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  opt: Options
): HTMLElement {
  const o: Options = {
    style: "solid",
    width: 1,
    color: "black",
    cls: "jqline",
    correct: true, // bool|int - corection of position, give integer to move
    correctpos: "normal", // normal, top, bottom, left, right
    css: {
      height: "0",
      zIndex: "999",
      zoom: 1,
    },
    ...opt,
  };

  if (!isNode(o.create)) {
    o.create = document.createElement("div");
  }

  const ang = calcAngle(x1, y1, x2, y2); // degrees

  const c = correct(x1, y1, x2, y2, o, ang);

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
      top: y1 + c.y + "px",
    },
    opt.css
  );

  Object.assign(o.create.style, o.css);

  o.cls && o.create?.classList.add(o.cls);
  o.id && o.create?.setAttribute("id", o.id);

  if (!parent.contains(o.create)) {
    parent.appendChild(o.create);
  }

  if (typeof o.callback === "function") {
    o.callback(o.create, o, c);
  }

  return o.create;
}

export function withAngleAndDistance(
  parent: HTMLElement,
  x1: number,
  y1: number,
  angAndDis: DistanceAndAngle | DistanceAndRadians,
  opt: Options
): HTMLElement {
  const a = Array.from(arguments);

  let k;

  if (isDistanceAndAngle(angAndDis)) {
    k = calcXYOffsetByVectorAngle(angAndDis.ang, angAndDis.dis);
  } else if (isDistanceAndRadians(angAndDis)) {
    k = calcXYOffsetByVectorAngleRad(angAndDis.rad, angAndDis.dis);
  } else {
    throw new Error("Arguments incomplete: " + JSON.stringify(angAndDis));
  }

  a[6] = a[5];
  a[5] = a[4];
  a[3] = x1 + k.x;
  a[4] = y1 + k.y;

  return line(parent, a[3], a[4], a[5], a[6], opt);
}

export function defualtParent(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  opt: Options
): HTMLElement {
  return line(document.body, x1, y1, x2, y2, opt);
}

export function withAngleAndDistanceDefualtParent(
  x1: number,
  y1: number,
  angAndDis: DistanceAndAngle | DistanceAndRadians,
  opt: Options
): HTMLElement {
  return withAngleAndDistance(document.body, x1, y1, angAndDis, opt);
}
/**
 * https://stackoverflow.com/a/384380
 */
function isNode(o: any): o is Node {
  return typeof Node === "object"
    ? o instanceof Node
    : o &&
        typeof o === "object" &&
        typeof o.nodeType === "number" &&
        typeof o.nodeName === "string";
}
export function angToRad(ang: number): number {
  return ang * (Math.PI / 180);
}
export function radToAng(rad: number): number {
  return rad * (180 / Math.PI);
}
// calc distance between two points
export function calcDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
// calculate angle in radians
export function calcAngleRad(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.atan2(y2 - y1, x2 - x1);
}
// calculate angle in degrees
export function calcAngle(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  var a = calcAngleRad(x1, y1, x2, y2) * (180 / Math.PI);
  return a < 0 ? (a += 360) : a;
}

type XYType = { x: number; y: number };

// calculate points based on radians and distance
// calcXYOffsetByVectorAngleRad(x2.rad, x2.dis)
export function calcXYOffsetByVectorAngleRad(rad: number, dis: number): XYType {
  return {
    // http://stackoverflow.com/a/10962780
    x: Math.cos(rad) * dis,
    y: Math.sin(rad) * dis,
  };
}
export function calcXYOffsetByVectorAngle(ang: number, dis: number): XYType {
  return calcXYOffsetByVectorAngleRad(angToRad(ang), dis);
}

type Correct = {
  x: number;
  y: number;
  oy: number;
  ox: number;
  ang: number;
  rad: number;
  ox2: number;
  oy2: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  ax?: number;
  ay?: number;
  bx?: number;
  by?: number;
  cx?: number;
  cy?: number;
  dx?: number;
  dy?: number;
};

type CorrectExtended = Correct & { distance?: number };

// calculate correction
function correct(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  o: Options,
  ang: number
): CorrectExtended {
  ang || (ang = calcAngle(x1, y1, x2, y2));

  var hw = o.width / 2;
  var hwo = hw; // originial

  var sw = false;

  if (typeof o.correct === "number") {
    let c = o.correct;
    switch (true) {
      case o.correctpos == "normal":
        hw += c;
        break;
      case o.correctpos == "top" && ang > 90 && ang < 270:
        sw = true;
        c = -Math.abs(c);
        break;
      case o.correctpos == "bottom" && (ang < 90 || ang > 270):
        sw = true;
        c = -Math.abs(c);
        break;
      case o.correctpos == "left" && ang > 0 && ang < 180:
        sw = true;
        c = -Math.abs(c);
        break;
      case o.correctpos == "right" && (ang < 0 || ang > 180):
        sw = true;
        c = -Math.abs(c);
        break;
    }
    hw += c;
  }

  var rad = calcAngleRad(x1, y1, x2, y2); // radians
  var radminhalf = rad - Math.PI / 2; // radians minus half radian

  var c: CorrectExtended = {
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
  } else {
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

function isDistanceAndAngle(obj: any): obj is DistanceAndAngle {
  return typeof obj.ang !== "undefined";
}

function isDistanceAndRadians(obj: any): obj is DistanceAndRadians {
  return typeof obj.rad !== "undefined";
}
