import * as System from "./js/system.js";
import * as Parts from "./js/parts.js";

/**
 * @type {Parts.RoundConfig}
 */
let conf = { caliber: System.CALIBER.CAL9, state: System.ROUNDSTATES.Ready };

const mymag = new Parts.gunPart_Magazine(
	undefined,
	"mag",
	System.SLOTTYPE.PistolMag,
	[],
	true,
	System.CALIBER.CAL9,
	12,
	undefined
);

// const mygun = System.gunFactory.newGun("gun1", "MyGun", true, undefined, [
// 	mymag,
// ]);
const mygun = System.gunFactory.assembleGun("gun1", "MyGun", true, undefined, [
	new Parts.partSlot(System.SLOTTYPE.PistolMag, mymag),
	new Parts.partSlot(System.SLOTTYPE.Barrel, undefined),
]);
// console.log("mygun: ", mygun);
// console.log(mygun.toString());

