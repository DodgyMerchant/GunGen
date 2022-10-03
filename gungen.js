import * as System from "./js/system.js";
import * as Parts from "./js/parts.js";

/**
 * @type {Parts.RoundConfig}
 */
let roundConf = {
	caliber: System.CALIBER.CAL9,
	state: System.ROUNDSTATES.Ready,
};

// const mymag = new Parts.gunPart_Magazine(
// 	undefined,
// 	"mag",
// 	System.SLOTTYPE.PistolMag,
// 	[],
// 	true,
// 	System.CALIBER.CAL9,
// 	12,
// 	undefined
// );

const mymag = new Parts.gunPart_Magazine(undefined, {
	model: "mag",
	attachType: System.SLOTTYPE.PistolMag,
	partSlotlist: [],
	caliber: System.CALIBER.CAL9,
	capacity: 12,
	contents: {
		caliber: System.CALIBER.CAL9,
		state: System.ROUNDSTATES.Ready,
	},
});

// const mygun = System.gunFactory.assembleGun("gun1", "MyGun", true, undefined, [
// 	// new Parts.partSlot(undefined, System.SLOTTYPE.PistolMag, mymag),
// 	// new Parts.partSlot(undefined, System.SLOTTYPE.Barrel, undefined),
// ]);

// console.log("mygun: ", mygun);
// console.log(mygun.toString());

console.log("mag: ", mymag);

/*
class AAA {
	name;
	num;
	constructor(name, num) {
		this.name = name;
		this.num = num;
	}
}
class BBB extends AAA {
	arr;
	constructor(name, num, arr) {
		super(name, num);
		this.arr = arr;
	}
}

let conf = { name: "mofo", num: 1, arr: [] };

let e = function (conf = {}) {
	let config = Object.assign({}, conf);
	console.log("");
};
*/
