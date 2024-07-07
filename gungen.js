import * as System from "./js/system.js";
import * as Parts from "./js/parts.js";
import * as Enums from "./js/enums.js";
import MyMath from "./myJS/MyMath.js";
import MyDraggable from "./myJS/MyDraggable.js";

const FPS = 1000 / 60;
var InterMainLoop = 0;
const GameWindow = document.getElementById("GameWindow");

/**
 * Kills the game loop
 */
function Kill() {
  clearInterval(InterMainLoop);
}

window.onload = function () {
  InterMainLoop = setInterval(MainLoop, FPS);
};

/**
 * @type {HTMLElement}
 */
var TestObj = document.getElementsByClassName("draggable")[0];
var GameRect = GameWindow.getBoundingClientRect();

/**
 * the main game loop.
 */
function MainLoop() {
  // console.log("Test");

  let testRect = TestObj.getBoundingClientRect();
  let target = { x: GameRect.x, y: GameRect.y };

  if (testRect.x != target.x || testRect.y != target.y) {
    let newPoint = MyMath.findNewPoint(testRect.x, testRect.y, MyMath.pointAngle(testRect.x, testRect.y, target.x, target.y), 2);

    newPoint = {
      x: Math.max(newPoint.x, target.x),
      y: Math.max(newPoint.y, target.y),
    };

    MyDraggable.MoveElTo(TestObj, newPoint.x, newPoint.y);
  }
}

// ------------------- TEST ----------------------------

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

MyDraggable.MakeClassDraggable("draggable", "dragHandle", GameWindow);
