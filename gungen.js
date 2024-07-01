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

// let myMag = System.GunFactory.Make_Magazine(
//   {
//     model: "Pistol Magazine",
//   },
//   {
//     caliber: Enums.CALIBER.CAL9,
//     capacity: 12,
//     contents: roundConf,
//   },
//   {
//     attachType: Enums.SLOTTYPE.PistolMag,
//     parent: undefined,
//   }
// );

// frame with mag
// let myMagSlot = new Parts.partSlot({
//   attachType: Enums.SLOTTYPE.PistolMag,
//   child: myMag,
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

// console.log(myMag.contents.length, myExtractor.heldRound);
// console.log(myExtractor.source.child);
// myExtractor.Feed();
// console.log(myMag.contents.length, myExtractor.heldRound);
// myExtractor.Eject();
// myMag.Detach();
// myExtractor.Feed();
// console.log(myMag.contents.length, myExtractor.heldRound);

const eater = (state, bool) => ({
  canEat: bool,
  eat(amount) {
    if (!state.canEat) {
      console.log(state.name + " cant eat!");
      return;
    }
    console.log(state.name + " is eating");
    state.energy += amount;
  },
});

class Dog {
  name;
  energy;
  breed;
  constructor(name, energy, breed) {
    this.name = name;
    this.energy = energy;
    this.breed = breed;
  }
}

/**
 * class + obj
 */
const make_dog = (name, energy, breed) => {
  let _dog = new Dog(name, energy, breed);
  return Object.assign(_dog, eater(_dog, false));
};

let leo = make_dog("Leo1", 10, "Pug");
leo.eat(10);
console.log(leo);
