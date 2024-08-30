import { CALIBER, SLOTTYPE } from "./js/enums.js";
import { PartSlot } from "./js/parts.js";
import * as System from "./js/system.js";
import MyHTML from "./myJS/MyHTML.js";
import MyMath from "./myJS/MyMath.js";
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

TODO: figure out double event bug. first drag function cannot be removed?
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
      new PartSlot({
        attachX: 37,
        attachY: -1,
        zIndex: -1,
        detachable: true,
        attachType: SLOTTYPE.PistolMag,
        connectDimensions: {
          x: 41,
          y: 1,
          w: 7,
          h: 10,
        },
        child: System.GunFactory.Make_Magazine(
          {
            game: Game,
            modelName: "G-Type Pistol Magazine 17.",
          },
          {
            imgSrc: "assets/Gmag_17.png",
          },
          {
            attachType: SLOTTYPE.PistolMag,
            attachX: 0,
            attachY: 0,
            connectDimensions: {
              x: 4,
              y: -2,
              w: 2,
              h: 7,
            },
            handleDimensions: [
              {
                cx: 10.5, // 22
                cy: 17.5, // 34
                w: 10,
                h: 36,
                rot: -22,
              },
            ],
          },
          { caliber: CALIBER.CAL9 }
        ),
      }),
      //slide
      // new PartSlot({
      //   attachX: 56,
      //   attachY: -1,
      //   zIndex: 1,
      //   attachType: SLOTTYPE.PistolBarrel,
      //   connectDimensions: {
      //     x: 25,
      //     y: -3,
      //     w: 13,
      //     h: 6,
      //   },
      //   child: System.GunFactory.Make_PistolSlide(
      //     {
      //       game: Game,
      //       modelName: "G17C Top Slide Tan",
      //     },
      //     { imgSrc: "assets/G18C_Tan_Slide.png" },
      //     {
      //       attachType: SLOTTYPE.PistolBarrel,
      //       attachX: 56,
      //       attachY: 7,
      //       connectDimensions: {
      //         x: 25,
      //         y: 7,
      //         w: 13,
      //         h: 1,
      //       },
      //       grabHosted: true,
      //       handleDimensions: [
      //         {
      //           x: 38,
      //           y: 1,
      //           w: 19,
      //           h: 7,
      //         },
      //       ],
      //     },
      //     { caliber: CALIBER.CAL9, source: undefined },
      //     {
      //       partSlotlist: [],
      //     }
      //   ),
      // }),
      //barrel
      // new PartSlot({
      //   attachType: SLOTTYPE.PistolBarrel,
      //   attachX: 34,
      //   attachY: -4,
      //   connectDimensions: {
      //     x: 24,
      //     y: -6,
      //     w: 11,
      //     h: 5,
      //   },
      //   child: System.GunFactory.Make_Attachable(
      //     {
      //       game: Game,
      //       modelName: "G18C Barrel Standart",
      //     },
      //     {
      //       imgSrc: "assets/G18C_BarrelStandart.png",
      //     },
      //     {
      //       attachType: SLOTTYPE.PistolBarrel,
      //       attachX: 35,
      //       attachY: 2,
      //       connectDimensions: {
      //         x: 25,
      //         y: 0,
      //         w: 11,
      //         h: 5,
      //       },
      //     }
      //   ),
      // }),
      //trigger
      // new PartSlot({
      //   attachType: SLOTTYPE.PistolBarrel,
      //   attachX: 31,
      //   attachY: 2,
      //   zIndex: -1,
      //   connectDimensions: {
      //     x: 30,
      //     y: 1,
      //     w: 3,
      //     h: 3,
      //   },
      //   child: System.GunFactory.Make_Attachable(
      //     {
      //       game: Game,
      //       modelName: "G18C Trigger",
      //     },
      //     {
      //       imgSrc: "assets/G18C_Trigger.png",
      //     },
      //     {
      //       attachType: SLOTTYPE.PistolTrigger,
      //       attachType: SLOTTYPE.PistolBarrel,
      //       attachX: 1,
      //       attachY: 1,
      //       connectDimensions: {
      //         x: 0,
      //         y: 0,
      //         w: 3,
      //         h: 3,
      //       },
      //     }
      //   ),
      // }),
    ],
  },
  {
    handleDimensions: [
      {
        cx: 47.5, //48/49
        cy: 16.5, // 16
        w: 15,
        h: 26,
        rot: -22,
      },
    ],
  }
);

// Game.addGunPart(
//   ,
//   20,
//   20
// );

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
