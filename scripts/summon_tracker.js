import { characterIds } from "../data/character_ids.js";
import { characterNames } from "../data/character_ids.js";
import { banners } from "../data/banners.js";

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function roundTo2Places(n) {
	return Math.round((n + Number.EPSILON) * 100) / 100;
}
function avg(nums) {
	return nums.reduce((partialSum, a) => partialSum + a, 0) / nums.length;
}

// remove later
if (localStorage.getItem("standardBannerHistory") && !localStorage.getItem("summonData")) {
	const span = document.createElement("span");
	span.innerHTML = "please reimport ur summons sorry hehe"
	span.style.color = "white";
	document.querySelector("body").appendChild(span);
}

// Load standard banner and limited banner stats
const summonData = JSON.parse(localStorage.getItem("summonData"));
const bannerTypeMap = {
	beginner: 1,
	standard: 2,
	limited: 3,
	event: 5,
	1: "beginner",
	2: "standard",
	3: "limited",
	5: "event"
}
if (summonData) {
	for (let i = 2; i <= 3; i++) {
		const totalPulls = summonData[i].history.length;
		document.querySelector(`.js-${bannerTypeMap[i]}-lifetime-pulls`).innerHTML = totalPulls;
		document.querySelector(`.js-${bannerTypeMap[i]}-clear-drop-count`).innerHTML = numberWithCommas(totalPulls * 180);

		document.querySelector(`.js-${bannerTypeMap[i]}-6star-pity`).innerHTML = summonData[i].pity6;
		document.querySelector(`.js-${bannerTypeMap[i]}-5star-pity`).innerHTML = summonData[i].pity5;
	}
};
if(summonData[bannerTypeMap.limited].isGuaranteed) {
	document.querySelector(".guaranteed").style.display = "block";
}

// remove later
for (const [bannerType, obj] of Object.entries(summonData)) {
	for (let i = 0; i < obj.history.length; i++) {
		const summon = obj.history[i];
		if (summon.name === "3има") {
			summon.name = "Зима";
		} else if (summon.name === "Black Dwarf") {
			summon.name = "Kaalaa Baunaa";
		}
	}
}
localStorage.setItem("summonData", JSON.stringify(summonData));

function makeTableAndPopulateExtraStats(bannerType, banner) {
	const table = document.querySelector(`.js-${bannerType}-banner-history`);
	for (let i = table.rows.length - 1; i >= 1; i--) {
		table.deleteRow(i);
	}

	const bannerHistory = summonData[bannerTypeMap[bannerType]].history;
	// These are for the banner's extra stats section
	let sixStars = [];
	let fiveStars = [];
	let totalPulls = 0;

	// Populate banner history table and make 4-*s invisible by default
	for (let i = bannerHistory.length - 1; i >= 0; i--) {
		const summon = bannerHistory[i];
		if (banner === "all" || summon.banner === banner) {
			totalPulls++;

			let row = table.insertRow(-1);
			row.insertCell(0).appendChild(document.createTextNode(summon.name));
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
	};

	// Populate banner's extra stats section
	if (bannerType === "limited" || bannerType === "standard") {
		const bannerExtraStatsTable = document.querySelectorAll(".banner-extra-stats-table")[+(bannerType === "standard")];

		populateStatsRow(bannerExtraStatsTable.rows[1], sixStars, bannerHistory.length);
		populateStatsRow(bannerExtraStatsTable.rows[+(bannerType === "limited") + 2], fiveStars, bannerHistory.length);

		// Update total pulls when filtering by banner
		if (bannerType === "limited") {
			document.querySelector(".js-limited-lifetime-pulls").innerHTML = totalPulls;
			document.querySelector(".js-limited-clear-drop-count").innerHTML = numberWithCommas(totalPulls * 180);
		}
	}
}
function populateStatsRow(row, stars, totalPulls) {
	row.cells[1].innerHTML = stars.length;
	row.cells[2].innerHTML = `${roundTo2Places(stars.length * 100 / totalPulls)}%`;
	row.cells[3].innerHTML = stars.length ? roundTo2Places(avg(stars)) : 0;
}
makeTableAndPopulateExtraStats("standard", "all");
makeTableAndPopulateExtraStats("limited", "all");
makeTableAndPopulateExtraStats("beginner", "all");
makeTableAndPopulateExtraStats("event", "all");


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


// Filter by rarity
const rarityFilter = {
	limited: {
		6: true,
		5: true,
		432: false
	}, 
	standard: {
		6: true,
		5: true,
		432: false
	}
}

for (const [bannerType, obj] of Object.entries(rarityFilter)) {
	for (const [rarity, defaultVisibility] of Object.entries(obj)) {
		addOnClickRarityFilter(bannerType, parseInt(rarity), defaultVisibility);
	}
}

function addOnClickRarityFilter(bannerType, rarity, defaultVisibility) {
	const button = document.querySelector(`.js-${bannerType}-show-${rarity}stars-button-${defaultVisibility}`);
	button.addEventListener("click", () => {
		updateBoolAndCSS(button, bannerType, rarity);
		updateVisibilityOfRarity(bannerType, rarity);
	});
}

function updateVisibilityOfRarity(bannerType, rarity) {
	const table = document.querySelector(`.js-${bannerType}-banner-history`);
	for (let i = 1; i < table.rows.length; i++) {
		const row = table.rows[i]
		const name = row.cells[0].innerHTML;
		const id = characterNames[name];
		if (characterIds[id].rarity === rarity || rarity === 432 && characterIds[id].rarity <= 4) {
			row.style.display = rarityFilter[bannerType][rarity] ? "table-row" : "none";
		}
	}
}
function updateBoolAndCSS(button, bannerType, rarity) {
	// Has to be like this cause pass by reference
	rarityFilter[bannerType][rarity] = !rarityFilter[bannerType][rarity];

	const showRarityBool = rarityFilter[bannerType][rarity];
	button.classList.add(`js-${bannerType}-show-${rarity}stars-button-${showRarityBool}`);
	button.classList.remove(`js-${bannerType}-show-${rarity}stars-button-${!showRarityBool}`);
}


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
	<span class="six-star-list-elements ${won5050 === 1 ? "won-5050" : ""}">${name} 
		<span style="color: ${pity < 70 ? colors[colorsKey] : "red"}">
			${pity}
		</span>
	</span>`
}

let bannerList = [];
function calculate5050WinRateAndCreate6StarsList(bannerType, banner) {
	document.querySelector(`.${bannerType}-6star-list`).innerHTML = "";
	const fifty50s = {
		6: [],
		5: []
	}
	const bannerHistory = summonData[bannerTypeMap[bannerType]].history;
	for (let i = 0; i < bannerHistory.length; i++) {
		const summon = bannerHistory[i];
		const rarity = characterIds[summon.id].rarity
		if (bannerType === "limited" && summon.banner && !bannerList.includes(summon.banner)) {
			bannerList.push(summon.banner);
		}

		if (summon.rate < 2) {
			// 0 = lost 5050, 1 = won 5050
			fifty50s[rarity]?.push({ "banner": summon.banner, "is5050win": summon.rate });
		}

		if (rarity === 6 && (banner === "all" || summon.banner === banner)) {
			addToListOf6Stars(bannerType, summon.name, summon.pity, summon.rate);
		}
	}

	if (bannerType === "limited") {
		calc5050wr(fifty50s, banner);
	}
}

function calc5050wr(fifty50s, banner) {
	for (const [rarity, list] of Object.entries(fifty50s)) {
		let total = 0;
		let wins = 0;
		list.forEach(fifty50 => {
			if (banner === "all" || fifty50.banner === banner) {
				total++;
				wins += fifty50.is5050win;
			}
		})

		const win5050Row = document.querySelector(`.js-limited-banner-${rarity}star-5050s-info`);
		win5050Row.cells[1].innerHTML = wins;
		win5050Row.cells[2].innerHTML = total > 0 ? `${roundTo2Places(wins * 100 / total)}%` : "0%";
	}
}

calculate5050WinRateAndCreate6StarsList("limited", "all");
calculate5050WinRateAndCreate6StarsList("standard", "all");


function createBannerButtons(bannerList) {
	bannerList.forEach(banner => {
		const button = document.createElement("div");
		button.role = "button";
		button.classList.add("banner-button", `${banner}-button`);
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
	calculate5050WinRateAndCreate6StarsList("limited", banner);
	updateVisibilityOfRarity("limited", 6);
	updateVisibilityOfRarity("limited", 5);
	updateVisibilityOfRarity("limited", 432);
	document.querySelector(`.${banner}-button`).classList.add("selected");
}


const allButton = document.querySelector(".all-button");
allButton.addEventListener("click", () => selectBanner("all"));

// Hide beginner and event banner if no pulls
if (summonData[bannerTypeMap.beginner].history.length === 0) {
	document.querySelector(".beginner-banner").style.display = "none";
}
if (summonData[bannerTypeMap.event].history.length === 0) {
	document.querySelector(".event-banner").style.display = "none";
}

// populate global stats
const globalStats = document.querySelector(".global-stats");
fetch(`https://3.146.105.207/global-stats?bannerType=${3}`)
		.then(response => response.text())
		.then(data => {
			console.log(data);
			data = JSON.parse(data);

			populateUserGlobalStats(data, "total_spins", "", 1);
			populateUserGlobalStats(data, "6*_50/50_wr", ".six-star-5050wr", 2);
			populateUserGlobalStats(data, "5*_50/50_wr", ".five-star-5050wr", 3);
			populateUserGlobalStats(data, "6*_luck", ".six-star-luck", 4);
			populateUserGlobalStats(data, "5*_luck", ".five-star-luck", 5);
		});

function populateUserGlobalStats(data, dataKey, className, elementIndex) {
	const sortedData = data.map((x) => x[dataKey]).sort((a, b) => a - b);
	const index = rightBinarySearch(sortedData, elementIndex > 1 ? document.querySelector(className).innerHTML.slice(0, -1) : summonData[3].history.length);
	const percentile = roundTo2Places(100 * (index + 1) / data.length);
	if (percentile < 50) {
		globalStats.children[elementIndex].children[1].children[0].innerHTML = "BOTTOM";
		globalStats.children[elementIndex].children[0].children[1].innerHTML = `Unluckier than ${100 -percentile}% of other users`;
		globalStats.children[elementIndex].children[1].children[1].innerHTML = `${percentile}%`;	
	} else {
		globalStats.children[elementIndex].children[0].children[1].innerHTML = `Luckier than ${percentile}% of other users`;
		globalStats.children[elementIndex].children[1].children[1].innerHTML = `${100 - percentile}%`;	
	}
			
}

function rightBinarySearch(arr, val) {
	let left = 0;
	let right = arr.length - 1;
	while (left <= right) {
		const middle = Math.floor((left + right) / 2);
		if (arr[middle] === val) {
			if (middle === arr.length - 1 || arr[middle + 1] > val) {
				return middle
			}
			left = middle + 1;
		} else if (arr[middle] < val) {
			left = middle + 1;
		} else {
			right = middle - 1;
		}
	}
	return left;
}