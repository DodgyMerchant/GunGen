import * as System from "./js/system.js";
import * as Parts from "./js/parts.js";
import * as Enums from "./js/enums.js";
import MyMath from "./myJS/MyMath.js";
import MyTemplate from "./myJS/MyTemplate.js";
import MyArr from "./myJS/MyArr.js";
import MyHTML from "./myJS/MyHTML.js";

const FPS = 1000 / 60;
var InterMainLoop = 0;
const GameWindow = document.getElementById("GameWindow");

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
var TestObjs = GameWindow.getElementsByClassName("grabTarget");
var GameRect = GameWindow.getBoundingClientRect();
var DraggedObj = System.GrabSystem.GetDraggedObjs();

/**
 * the main game loop.
 */
function MainLoop() {
  let spd = 2;

  let rect, target, newPoint;
  for (let i = 0; i < TestObjs.length; i++) {
    /**
     * @type {HTMLElement}
     */
    const element = TestObjs[i];

    if (DraggedObj.indexOf(element) != -1) continue;

    //#region moveing items over time

    rect = element.getBoundingClientRect();
    target = {
      x: GameRect.x + GameRect.width / 2,
      y: GameRect.y + GameRect.height / 2,
    };
    if (rect.x != target.x || rect.y != target.y) {
      newPoint = MyMath.findNewPoint(
        rect.x,
        rect.y,
        MyMath.pointAngle(rect.x, rect.y, target.x, target.y),
        spd
      );

      System.GrabSystem.MoveElTo(
        element,
        MyMath.ovsh(rect.x, newPoint.x, target.x),
        MyMath.ovsh(rect.y, newPoint.y, target.y)
      );
    }
    //#endregion
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
let grab;
/**
 * @type {HTMLElement}
 */
let grabs;
let gx = 0,
  gy = 5,
  gw = 10,
  gh = 10;
for (let i = 0; i < 2; i++) {
  grab = MyTemplate.addTemplate(
    document.getElementById("temp_Grabbable"),
    GameWindow
  )[0];

  grabs = grab.getElementsByClassName("grabSource")[0];
  grabs.style.left = gx * System.Game.Scale + "px";
  grabs.style.top = gy * System.Game.Scale + "px";
  grabs.style.width = gw * System.Game.Scale + "px";
  grabs.style.height = gh * System.Game.Scale + "px";

  MyTemplate.addTemplate(document.getElementById("temp_Displayable"), grab);
}

System.GrabSystem.MakeClassDraggable("grabTarget", "grabSource", GameWindow);

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
