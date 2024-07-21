import { CALIBER, SLOTTYPE } from "./js/enums.js";
import { partSlot } from "./js/parts.js";
import * as System from "./js/system.js";
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

let myFrame = System.GunFactory.Make_FramePistol(
  {
    game: Game,
    model: "Pistol Frame",
  },
  {
    imgSrc: "assets/gun1.png",
  },
  {
    partSlotlist: [
      new partSlot({
        attachX: 10,
        attachY: 10,
        attachType: SLOTTYPE.PistolMag,
        child: System.GunFactory.Make_Magazine(
          {
            game: Game,
            model: "Pistol Magazine",
          },
          {
            imgSrc: "assets/mag1.png",
          },
          {
            restrictions: Game.GameSpace,
          },
          { caliber: CALIBER.CAL9 },
          {
            attachType: SLOTTYPE.PistolMag,
            attachX: 0,
            attachY: 0,
          }
        ),
      }),
    ],
  },
  {
    handleDimensions: {
      x: 0,
      y: 5,
      w: 10,
      h: 10,
    },
    restrictions: Game.GameSpace,
  }
);

Game.addGunPart(myFrame);

Game.detatch(myFrame.partSlotlist[0].child);
