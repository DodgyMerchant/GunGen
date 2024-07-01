import * as System from "./js/system.js";
import * as Parts from "./js/parts.js";
import * as Enums from "./js/enums.js";

/**
 * @type {Parts.RoundConfig}
 */
let roundConf = {
  caliber: Enums.CALIBER.CAL9,
  state: Enums.ROUNDSTATES.Ready,
};

let myMag = System.GunFactory.Make_Magazine(
  {
    model: "Pistol Magazine",
  },
  {
    caliber: Enums.CALIBER.CAL9,
    capacity: 12,
    contents: roundConf,
  },
  {
    attachType: Enums.SLOTTYPE.PistolMag,
    parent: undefined,
  }
);

let myMagSlot = new Parts.partSlot({
  attachType: Enums.SLOTTYPE.PistolMag,
  child: myMag,
});

let myExtractor = System.GunFactory.Make_Extractor(
  {
    model: "Extractor",
  },
  {
    attachType: Enums.SLOTTYPE.Extractor,
    parent: undefined,
  },
  {
    caliber: Enums.CALIBER.CAL9,
    heldRound: undefined,
    source: myMagSlot,
  }
);

let myFrame = System.GunFactory.Make_FramePistol(
  {
    model: "Pistol Frame",
  },
  {
    partSlotlist: [
      myMagSlot,
      new Parts.partSlot({
        attachType: Enums.SLOTTYPE.Extractor,
        child: myExtractor,
      }),
    ],
  },
  {
    grabEnabled: true,
  }
);
