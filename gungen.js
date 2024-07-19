import * as System from "./js/system.js";
import * as Parts from "./js/parts.js";
import * as Enums from "./js/enums.js";
import MyMath from "./myJS/MyMath.js";
import MyTemplate from "./myJS/MyTemplate.js";
import MyArr from "./myJS/MyArr.js";
import MyHTML from "./myJS/MyHTML.js";

const FPS = 1000 / 60;
// const FPS = 1000;
var InterMainLoop = 0;
const GameWindow = document.getElementById("GameWindow");
const GameSpace = document.getElementById("GameSpace");
const GameUI = document.getElementById("UI");

if (!MyTemplate.supports()) {
  alert(
    "Your browser does not fully support this website!\n My portfolio projects won't be displayed currently."
  );
  stop();
}

/**
 * Kills the game loop
 */
function Kill() {
  clearInterval(InterMainLoop);
}

window.onload = function () {
  InterMainLoop = setInterval(MainLoop, FPS);
};

GameWindow.addEventListener("mousedown", (event) => event.preventDefault());
GameWindow.addEventListener("contextmenu", (event) => event.preventDefault());

/**
 *
 *
 */
var TestObjs = GameSpace.children;
var GameRect;
var DraggedObj = System.GrabSystem.GetDraggedObjs();

/**
 * the main game loop.
 */
function MainLoop() {
  let spd = 1;

  GameRect = GameSpace.getBoundingClientRect();
  let target = {
    x: GameRect.width / 2,
    y: GameRect.height / 2,
  };

  let rect, newPoint, element;
  for (let i = 0; i < TestObjs.length; i++) {
    /**
     * @type {HTMLElement}
     */
    element = TestObjs[i];

    if (DraggedObj.indexOf(element) != -1) continue;

    rect = {
      x: element.offsetLeft,
      y: element.offsetTop,
    };

    if (rect.x != target.x || rect.y != target.y) {
      let ang = MyMath.pointAngle(rect.x, rect.y, target.x, target.y);

      console.log(ang);
      newPoint = MyMath.findNewPoint(rect.x, rect.y, ang, spd);

      // System.GrabSystem.MoveElTo(
      //   element,
      //   MyMath.ovsh(rect.x, newPoint.x, target.x),
      //   MyMath.ovsh(rect.y, newPoint.y, target.y)
      //   // GameSpace.getBoundingClientRect()
      // );

      System.GrabSystem.MoveElTo(element, newPoint.x, newPoint.y);
    }
  }
}

// ------------------- TEST ----------------------------

let myFrame = System.GunFactory.Make_FramePistol(
  {
    model: "Pistol Frame",
  },
  {
    partSlotlist: [
      // myMagSlot,
      // new Parts.partSlot({
      //   attachType: Enums.SLOTTYPE.Extractor,
      //   child: myExtractor,
      // }),
    ],
  },
  {
    grabEnabled: true,
  }
);

/**
 * @type {HTMLElement}
 */
let grab, base, img;
let gx = 0,
  gy = 5,
  gw = 10,
  gh = 10;
let num = 1;
for (let i = 0; i < num; i++) {
  // base
  base = MyTemplate.addTemplate(
    document.getElementById("temp_PartBase"),
    GameSpace
  )[0];

  // grabbable
  MyHTML.addClass(base, "grabTarget");
  grab = MyTemplate.addTemplate(
    document.getElementById("temp_Grabbable"),
    base
  )[0];
  grab.style.left = gx * System.Game.Scale + "px";
  grab.style.top = gy * System.Game.Scale + "px";
  grab.style.width = gw * System.Game.Scale + "px";
  grab.style.height = gh * System.Game.Scale + "px";

  // display
  img = MyTemplate.addTemplate(
    document.getElementById("temp_Displayable"),
    base
  )[0];

  img.style.width = img.naturalWidth * System.Game.Scale + "px";
  img.style.height = img.naturalHeight * System.Game.Scale + "px";
}

System.GrabSystem.MakeClassDraggable("grabTarget", "grabSource", GameSpace);

// /**
//  * @type {Parts.RoundConfig}
//  */
// let roundConf = {
//   caliber: Enums.CALIBER.CAL9,
//   state: Enums.ROUNDSTATES.Ready,
// };

// let myMagSlot = new Parts.partSlot({
//   attachType: Enums.SLOTTYPE.PistolMag,
//   child: System.GunFactory.Make_Magazine(
//     {
//       model: "Pistol Magazine",
//     },
//     {
//       caliber: Enums.CALIBER.CAL9,
//       capacity: 12,
//       contents: roundConf,
//     },
//     {
//       attachType: Enums.SLOTTYPE.PistolMag,
//       parent: undefined,
//     }
//   ),
// });

// let myExtractor = System.GunFactory.Make_Extractor(
//   {
//     model: "Extractor",
//   },
//   {
//     attachType: Enums.SLOTTYPE.Extractor,
//     parent: undefined,
//   },
//   {
//     caliber: Enums.CALIBER.CAL9,
//     heldRound: undefined,
//     source: myMagSlot,
//   }
// );

// let myFrame = System.GunFactory.Make_FramePistol(
//   {
//     model: "Pistol Frame",
//   },
//   {
//     partSlotlist: [
//       myMagSlot,
//       new Parts.partSlot({
//         attachType: Enums.SLOTTYPE.Extractor,
//         child: myExtractor,
//       }),
//     ],
//   },
//   {
//     grabEnabled: true,
//   }
// );

// console.log("round: ", myExtractor.heldRound, myMagSlot.child.contents.length);
// myExtractor.Feed();
// console.log("round: ", myExtractor.heldRound, myMagSlot.child.contents.length);
// myExtractor.Eject();
// myExtractor.Feed();
// console.log("round: ", myExtractor.heldRound, myMagSlot.child.contents.length);
