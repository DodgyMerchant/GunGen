import * as parts from "./parts.js";

class GunCorpP100 extends parts.Gun {
	constructor(givenName) {
		super("GunCorp P100", givenName, true, [new partSlot(SLOTTYPE.Pistol)]);
	}
}
