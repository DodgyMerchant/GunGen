import { CALIBER, SLOTTYPE } from "./js/enums.js";
import { partSlot } from "./js/parts.js";
import * as System from "./js/system.js";
import MyHTML from "./myJS/MyHTML.js";
import MyTemplate from "./myJS/MyTemplate.js";

if (!MyTemplate.supports()) {
  alert(
    "Your browser does not fully support this website!\n My portfolio projects won't be displayed currently."
  );
  stop();
}
const Game = new System.Game({
  GameWindow: document.getElementById("GameWindow"),
  FPS: 1000 / 60,
  GameSpace: {
    Scale: 4,
    Height: 600,
    Width: 600,
  },
  GameUI: {},
});

// ------------------- TEST ----------------------------
/*
Ideas:
TODO: make connection and sprite one package.
attach x/y are sprite specific for some connections.
f.e. the magazine port of a gun.
The type of the connection and attach x/y are dictaded by the sprite.

TODO: attach hitbox.
box in attachable and host that, if they collide, they will be attached.

TODO: grabAttachTarget in partslot.
if component should be grabbable in an attached state the move target will be changed to the target in grabAttachTarget.
This makes things like foregrips possible.
if left empty no target will be given and functionality ignored/not setup.

TODO: give attachable component own intput box like grabbable. Split functionality.
TODO: combin the gab and attach component like you do with components already.
TODO: change the GRAB system to an interact system.
TODO: MakeElementDraggable param the functions used for mouse press. everything from there happens in that function anyways.
*/

let myFrame = System.GunFactory.Make_FrameGrip(
  {
    game: Game,
    modelName: "G18C Frame Tan",
  },
  {
    imgSrc: "assets/G18C_Tan_Frame.png",
  },
  {
    partSlotlist: [
      //mag
      new partSlot({
        attachX: 38,
        attachY: 2,
        zIndex: -1,
        detachable: true,
        attachType: SLOTTYPE.PistolMag,
        child: System.GunFactory.Make_Magazine(
          {
            game: Game,
            modelName: "G-Type Pistol Magazine 17.",
          },
          {
            imgSrc: "assets/Gmag_17.png",
          },
          {},
          { caliber: CALIBER.CAL9 },
          {
            attachType: SLOTTYPE.PistolMag,
            attachX: 0,
            attachY: 0,
          }
        ),
      }),
      //slide
      new partSlot({
        attachX: 0,
        attachY: 0,
        zIndex: 1,
        child: System.GunFactory.Make_PistolSlide(
          {
            game: Game,
            modelName: "G17C Top Slide Tan",
          },
          { imgSrc: "assets/G18C_Tan_Slide.png" },
          {
            partSlotlist: [],
          },
          {
            grabHosted: true,
            handleDimensions: {
              x: 38,
              y: 1,
              w: 19,
              h: 7,
            },
          },
          {
            attachType: SLOTTYPE.PistolBarrel,
            attachX: 0,
            attachY: 8,
          },
          { caliber: CALIBER.CAL9, source: undefined }
        ),
      }),
      //barrel
      new partSlot({
        attachX: 37,
        attachY: -4,
        child: System.GunFactory.Make_Attachable(
          {
            game: Game,
            modelName: "G18C Barrel Standart",
          },
          {
            imgSrc: "assets/G18C_BarrelStandart.png",
          },
          {
            attachType: SLOTTYPE.PistolBarrel,
            attachX: 38,
            attachY: 1,
          }
        ),
      }),
    ],
  },
  {
    handleDimensions: {
      x: 37,
      y: 3,
      w: 23,
      h: 26,
    },
  }
);

myFrame.imgLoadPromise.finally(() => {
  console.log(myFrame.Width, myFrame.htmlDisplayElement.style.width);
  Game.addGunPart(
    myFrame,
    // Game.GameSpace.Width / 3 - myFrame.Width / 2,
    Game.GameSpace.Width / 2 -
      MyHTML.getPropertyFlt(myFrame.htmlDisplayElement, "width") / 2,
    Game.GameSpace.Height / 2 -
      MyHTML.getPropertyFlt(myFrame.htmlDisplayElement, "height") / 2
  );
});

// TODO: make a seperate promise that that is usable as a Ready signal.
// atm the myFrame.Width uses getBoundingClientRect wich isnt updated when the update fires.
//
// myFrame.imgLoadPromise.finally(() => {
//   console.log(myFrame.Width, myFrame.htmlDisplayElement.style.width);
//   Game.addGunPart(
//     myFrame,
//     // Game.GameSpace.Width / 3 - myFrame.Width / 2,

//     Game.GameSpace.Width / 2 - myFrame.Width / 2,
//     Game.GameSpace.Height / 2 - myFrame.Height / 2
//   );
// });
//ResizeObserver;
