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

  let rect, newPoint;
  /**
   * @type {HTMLElement}
   */
  let element;
  for (let i = 0; i < TestObjs.length; i++) {
    element = TestObjs[i];

    if (DraggedObj.indexOf(element) != -1) continue;

    rect = {
      // offsetLeft & offsetTop is an int leads to movement problems.
      x: MyHTML.getPropertyFlt(element, "left"),
      y: MyHTML.getPropertyFlt(element, "top"),
    };

    if (!(rect.x == target.x && rect.y == target.y)) {
      let ang = MyMath.pointAngle(rect.x, rect.y, target.x, target.y);
      newPoint = MyMath.findNewPoint(rect.x, rect.y, ang, spd);

      System.GrabSystem.MoveElTo(
        element,
        MyMath.ovsh(rect.x, newPoint.x, target.x),
        MyMath.ovsh(rect.y, newPoint.y, target.y),
        GameRect
      );
    }
  }
}

// ------------------- TEST ----------------------------

let myFrame = System.GunFactory.Make_FramePistol(
  {
    model: "Pistol Frame",
  },
  {
    imgSrc: "assets/gun1.png",
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
    dimensions: {
      x: 0,
      y: 5,
      w: 10,
      h: 10,
    },
    restrictions: GameSpace,
  }
);



GameSpace.appendChild(myFrame.htmlElement);

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
