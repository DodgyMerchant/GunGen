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

console.log(myMag.contents.length, myExtractor.heldRound);
myExtractor.Feed();
console.log(myMag.contents.length, myExtractor.heldRound);
myExtractor.Eject();
myMag.Detach();
myExtractor.Feed();
console.log(myMag.contents.length, myExtractor.heldRound);

let i = 0;

class Test1 {
  test1 = 0;
  test12 = 0;
  constructor(num) {
    this.test1 = num;
    this.test12 = num;
  }
}
class Test2 {
  test2 = 0;
  constructor(num) {
    this.test2 = num;
  }
}

let obj = {
  ...new Test1(1),
  ...new Test2(3),
};

let str = "";
if (obj instanceof Test1) str = "Is Test1";
else str = "Is NOT Test1";
console.log(str);
if (obj instanceof Test2) str = "Is Test2";
else str = "Is NOT Test2";
console.log(str);
