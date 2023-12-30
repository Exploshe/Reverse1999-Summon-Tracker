import { characterIds } from "../data/character_ids.js";
import { characterNames } from "../data/character_ids.js";
import { banners } from "../data/banners.js";

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function roundTo2Places(n) {
	return Math.round((n + Number.EPSILON) * 100) / 100;
}

// Load standard banner stats
if (localStorage.getItem("standardBannerLifetimePulls")) {
	const standardBannerLifetimePulls = localStorage.getItem("standardBannerLifetimePulls");
	document.querySelector(".js-standard-lifetime-pulls").innerHTML = standardBannerLifetimePulls;
	document.querySelector(".js-standard-clear-drop-count").innerHTML = numberWithCommas(standardBannerLifetimePulls * 180);

	document.querySelector(".js-standard-6star-pity").innerHTML = localStorage.getItem("standardBanner6StarPity");

	document.querySelector(".js-standard-5star-pity").innerHTML = localStorage.getItem("standardBanner5StarPity");
};

// Load limited banner stats
if (localStorage.getItem("limitedBannerLifetimePulls")) {
	const limitedBannerLifetimePulls = localStorage.getItem("limitedBannerLifetimePulls");
	document.querySelector(".js-limited-lifetime-pulls").innerHTML = limitedBannerLifetimePulls;
	document.querySelector(".js-limited-clear-drop-count").innerHTML = numberWithCommas(limitedBannerLifetimePulls * 180);

	document.querySelector(".js-limited-6star-pity").innerHTML = localStorage.getItem("limitedBanner6StarPity");

	document.querySelector(".js-limited-5star-pity").innerHTML = localStorage.getItem("limitedBanner5StarPity");
};    


function makeTableAndPopulateExtraStats(bannerType, banner) {
	const table = document.querySelector(`.js-${bannerType}-banner-history`);
	for (let i = table.rows.length - 1; i >= 1; i--) {
		table.deleteRow(i);
	}
	if (localStorage.getItem(`${bannerType}BannerHistory`)) {
		const bannerHistory = JSON.parse(localStorage.getItem(`${bannerType}BannerHistory`));
		// These are for the banner's extra stats section
		let sixStars = [];
		let fiveStars = [];
		let totalPulls = 0
		// Populate banner history table and make 4-*s invisible by default
		bannerHistory.forEach(summon => {
			if (banner === "all" || summon.banner === banner) {
				totalPulls++;

				let row = table.insertRow(-1);
				row.insertCell(0).appendChild(document.createTextNode(characterIds[summon.id].name));
				row.cells[0].setAttribute("class", `banner-history-name-${characterIds[summon.id].rarity}star`);
				row.insertCell(1).appendChild(document.createTextNode(summon.time));
				row.cells[1].setAttribute("class", `banner-history-time`);
				row.insertCell(2).appendChild(document.createTextNode(summon.pity ? summon.pity : ""));
				if (characterIds[summon.id].rarity <= 4) {
					row.style.display = "none";
				}

				if (characterIds[summon.id].rarity === 6) {
					sixStars.push(summon.pity);
				} else if (characterIds[summon.id].rarity === 5) {
					fiveStars.push(summon.pity);
				}
			}
		});

		// Populate banner's extra stats section
		if (bannerType !== "beginner") {
			let bannerExtraStatsTable;
			let FIVESTARROW = 3;
			if (bannerType === "limited") {
				bannerExtraStatsTable = document.querySelectorAll(".banner-extra-stats-table")[0];
			} else if (bannerType === "standard") {
				bannerExtraStatsTable = document.querySelectorAll(".banner-extra-stats-table")[1];
				FIVESTARROW = 2;
			}
			const sixStarRow = bannerExtraStatsTable.rows[1];
			sixStarRow.cells[1].innerHTML = sixStars.length;
			
			sixStarRow.cells[2].innerHTML = `${roundTo2Places(sixStars.length * 100 / bannerHistory.length)}%`;
			
			sixStarRow.cells[3].innerHTML = sixStars.length ? roundTo2Places(sixStars.reduce((partialSum, a) => partialSum + a, 0) / sixStars.length) : 0;

			const fiveStarRow = bannerExtraStatsTable.rows[FIVESTARROW];
			fiveStarRow.cells[1].innerHTML = fiveStars.length;
			fiveStarRow.cells[2].innerHTML = `${roundTo2Places(fiveStars.length * 100 / bannerHistory.length)}%`;
			fiveStarRow.cells[3].innerHTML = fiveStars.length ? roundTo2Places(fiveStars.reduce((partialSum, a) => partialSum + a, 0) / fiveStars.length) : 0;

			document.querySelector(".js-limited-lifetime-pulls").innerHTML = totalPulls;
			document.querySelector(".js-limited-clear-drop-count").innerHTML = numberWithCommas(totalPulls * 180);
		}
	}
}
makeTableAndPopulateExtraStats("standard", "all");
makeTableAndPopulateExtraStats("limited", "all");
makeTableAndPopulateExtraStats("beginner", "all");


// Show/hide banner history
let showLimitedBannerHistory = {"value": true};
const limitedHistoryTable = document.querySelector(".js-limited-banner-history");
function updateVisibilityOfBannerHistory(bannerType, makeVisible, table) {
	if (makeVisible.value) {
		document.querySelector(`.${bannerType}-filter-buttons`).style.display = "block";
		table.style.display = "table";
		document.querySelector(`.js-${bannerType}-banner-show-history`).innerHTML = "hide";
	} else {
		document.querySelector(`.${bannerType}-filter-buttons`).style.display = "none";
		table.style.display = "none";
		document.querySelector(`.js-${bannerType}-banner-show-history`).innerHTML = "show";
	}
	makeVisible.value = !makeVisible.value;
}
document.querySelector(".js-limited-banner-show-history").addEventListener("click", () => updateVisibilityOfBannerHistory("limited", showLimitedBannerHistory, limitedHistoryTable));

let showStandardBannerHistory = {"value": true};
const standardHistoryTable = document.querySelector(".js-standard-banner-history");
document.querySelector(".js-standard-banner-show-history").addEventListener("click", () => updateVisibilityOfBannerHistory("standard", showStandardBannerHistory, standardHistoryTable));


// For filtering by rarity, they are objs so they can be passed by reference
let limitedShow6Stars = {"value":true};
let limitedShow5Stars = {"value":true};
let limitedShow4AndLowerStars = {"value":false};
let standardShow6Stars = {"value": true};
let standardShow5Stars = {"value": true};
let standardShow4AndLowerStars = {"value": false};
// Filter by rarity
function updateVisibilityOfRarity(rarity, makeVisible, table) {
	for (let i = 1, row; row = table.rows[i]; i++) {
		const name = row.cells[0].innerHTML;
		const id = characterNames[name];
		if (characterIds[id].rarity === rarity || rarity === 432 && characterIds[id].rarity <= 4) {
			if (makeVisible.value) {
				row.style.display = "table-row";
			} else {
				row.style.display = "none";
			}
		}
	}
}
function updateBoolAndCSS(showRarityBool, button, bannerType, rarity) {
	showRarityBool.value = !showRarityBool.value;
	button.classList.add(`js-${bannerType}-show-${rarity}stars-button-${showRarityBool.value}`);
	button.classList.remove(`js-${bannerType}-show-${rarity}stars-button-${!showRarityBool.value}`);
}
const limitedShow6StarsButton = document.querySelector(".js-limited-show-6stars-button-true");
limitedShow6StarsButton.addEventListener("click", () => {
    updateBoolAndCSS(limitedShow6Stars, limitedShow6StarsButton, "limited", 6);
    updateVisibilityOfRarity(6, limitedShow6Stars, limitedHistoryTable);
});
const limitedShow5StarsButton = document.querySelector(".js-limited-show-5stars-button-true");
limitedShow5StarsButton.addEventListener("click", () => {
    updateBoolAndCSS(limitedShow5Stars, limitedShow5StarsButton, "limited", 5);
    updateVisibilityOfRarity(5, limitedShow5Stars, limitedHistoryTable);
});
const limitedShow432StarsButton = document.querySelector(".js-limited-show-432stars-button-false");
document.querySelector(".js-limited-show-432stars-button-false").addEventListener("click", () => {
    updateBoolAndCSS(limitedShow4AndLowerStars, limitedShow432StarsButton, "limited", 432);
    updateVisibilityOfRarity(432, limitedShow4AndLowerStars, limitedHistoryTable);
});
const standardShow6StarsButton = document.querySelector(".js-standard-show-6stars-button-true");
standardShow6StarsButton.addEventListener("click", () => {
    updateBoolAndCSS(standardShow6Stars, standardShow6StarsButton, "standard", 6);
    updateVisibilityOfRarity(6, standardShow6Stars, standardHistoryTable);
});
const standardShow5StarsButton = document.querySelector(".js-standard-show-5stars-button-true");
standardShow5StarsButton.addEventListener("click", () => {
    updateBoolAndCSS(standardShow5Stars, standardShow5StarsButton, "standard", 5);
    updateVisibilityOfRarity(5, standardShow5Stars, standardHistoryTable);
});
const standardShow432StarsButton = document.querySelector(".js-standard-show-432stars-button-false");
document.querySelector(".js-standard-show-432stars-button-false").addEventListener("click", () => {
	updateBoolAndCSS(standardShow4AndLowerStars, standardShow432StarsButton, "standard", 432);
	updateVisibilityOfRarity(432, standardShow4AndLowerStars, standardHistoryTable);
});


// List of 6*s at the bottom of the limited banner extra stats
function addToListOf6Stars(bannerType, name, pity, won5050) {
	const colors = {
		1: "rgb(0, 255, 0)",
		2: "rgb(85, 255, 0)",
		3: "rgb(170, 255, 0)",
		4: "yellow",
		5: "rgb(255, 210, 0)",
		6: "orange",
		7: "rgb(255, 82, 0)",
	};
	const colorsKey = Math.floor((pity + 9) / 10).toString();
	document.querySelector(`.${bannerType}-6star-list`).innerHTML += `
	<span class="six-star-list-elements ${won5050 ? "won-5050" : ""}">
		${name} 
		<span style="color: ${pity < 70 ? colors[colorsKey] : "red"}">
			${pity}
		</span>
	</span>`
}

let bannerList = [];
function calculate5050WinRateAndIsGuaranteed(bannerType, banner) {
	document.querySelector(`.${bannerType}-6star-list`).innerHTML = "";
	let isGuaranteed = false;
	let total5050s = [];
	const bannerHistory = JSON.parse(localStorage.getItem(`${bannerType}BannerHistory`));
	for (let i = bannerHistory.length - 1; i >= 0; i--) {
		const summon = bannerHistory[i];
		if (bannerType === "limited" && summon.banner && !bannerList.includes(summon.banner)) {
			bannerList.push(summon.banner);
		}
		if (characterIds[summon.id].rarity === 6) {
			let won5050 = false;
			if (bannerType === "limited") {
				const rateUpCharId = banners[summon.banner].rateUpCharId;
				if (summon.id === rateUpCharId) {
					if (!isGuaranteed) {
						won5050 = true;
						total5050s.push({"banner": summon.banner, "is5050win": true});
					}
					isGuaranteed = false;
				} else {
					total5050s.push({"banner": summon.banner, "is5050win": false});
					isGuaranteed = true;
				}
			}
			if (banner === "all" || summon.banner === banner) {
				addToListOf6Stars(bannerType, characterIds[summon.id].name, summon.pity, won5050);
			}
		}
	}
	if(isGuaranteed) {
		document.querySelector(".guaranteed").style.display = "block";
	}
	if (bannerType === "limited") {
		let total = 0
		let wins = 0
		total5050s.forEach(fiftyfifty => {
			if (banner === "all" || fiftyfifty.banner === banner) {
				total++;
				if (fiftyfifty.is5050win) {
					wins++;
				}
			}
		});
		const limited5050sRow = document.querySelector(".limited-banner-5050s-info");
		limited5050sRow.cells[1].innerHTML = wins;
		limited5050sRow.cells[2].innerHTML = total > 0 ? `${roundTo2Places(wins * 100 / total)}%` : "0%";
	}
}
calculate5050WinRateAndIsGuaranteed("limited", "all");
calculate5050WinRateAndIsGuaranteed("standard", "all");


function createBannerButtons(bannerList) {
	bannerList.forEach(banner => {
		const button = document.createElement("div");
		button.role = "button";
		button.classList.add("banner-button", banner);
		const img = new Image();
		img.src = banners[banner].img;
		button.appendChild(img);
		document.querySelector(".banner-selection").appendChild(button);
		button.addEventListener("click", () => selectBanner(banner));
	});
}
createBannerButtons(bannerList);

function selectBanner(banner) {
	document.querySelectorAll(".banner-selection div").forEach(bannerDiv => {
		bannerDiv.classList.remove("selected");
	});
	makeTableAndPopulateExtraStats("limited", banner);
	calculate5050WinRateAndIsGuaranteed("limited", banner);
	updateVisibilityOfRarity(6, limitedShow6Stars, limitedHistoryTable);
	updateVisibilityOfRarity(5, limitedShow5Stars, limitedHistoryTable);
	updateVisibilityOfRarity(432, limitedShow4AndLowerStars, limitedHistoryTable);
	if (banner === "all") {
		document.querySelector(".all-button").classList.add("selected");
	} else {
		document.querySelector(`.${banner}`).classList.add("selected");
	}
}


const allButton = document.querySelector(".all-button");
allButton.addEventListener("click", () => selectBanner("all"));