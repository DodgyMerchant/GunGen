import * as System from "./js/system.js";
import * as Parts from "./js/parts.js";

const mygun = System.gunFactory.newGun("gun1", "MyGun", true, undefined);
console.log("mygun: ", mygun);
console.log("mygun: ", mygun.getDisplayName());

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

console.log("mymag-", mymag);

/**
 * @type {Parts.RoundConfig}
 */
let conf = { caliber: System.CALIBER.CAL45, state: System.ROUNDSTATES.Ready };

let ammoBox = [];
for (let index = 0; index < 30; index++) {
	ammoBox.push(new Parts.Round(conf));
}

let list = [];
for (let index = 0; index < 10; index++) {
	list.push(new Parts.Round(conf));
}

console.log("loading mag! - ", mymag.load(list));
console.log("mymag-", mymag);

console.log("loading mag! - ", mymag.load(ammoBox));
console.log("mymag-", mymag);
