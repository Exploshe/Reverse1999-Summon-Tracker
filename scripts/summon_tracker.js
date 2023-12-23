import { characterIds } from "../data/character_ids.js";
import { characterNames } from "../data/character_ids.js";

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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


function makeTableAndPopulateExtraStats(bannerType) {
    // TODO: Add these to local storage
    if (localStorage.getItem(`${bannerType}BannerHistory`)) {
        const bannerHistory = JSON.parse(localStorage.getItem(`${bannerType}BannerHistory`));
        let sixStars = [];
        let fiveStars = [];
        for (let i = 0; i < bannerHistory.length; i++) {
            const summon = bannerHistory[i];
            let row = document.querySelector(`.js-${bannerType}-banner-history`).insertRow(-1);
            row.insertCell(0).appendChild(document.createTextNode(characterIds[summon.id].name));
            row.cells[0].setAttribute("class", `${bannerType}-banner-history-name-${characterIds[summon.id].rarity}star`);
            row.insertCell(1).appendChild(document.createTextNode(summon.time));
            row.cells[1].setAttribute("class", `${bannerType}-banner-history-time`);
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

        let bannerExtraStatsTable;
        if (bannerType === "limited") {
            bannerExtraStatsTable = document.querySelectorAll(".banner-extra-stats-table")[0];
        } else if (bannerType === "standard") {
            bannerExtraStatsTable = document.querySelectorAll(".banner-extra-stats-table")[1];
        }
        const sixStarRow = bannerExtraStatsTable.rows[1];
        sixStarRow.cells[1].innerHTML = sixStars.length;
        sixStarRow.cells[2].innerHTML = `${Math.round(((sixStars.length * 100 / bannerHistory.length) + Number.EPSILON) * 100) / 100}%`;
        sixStarRow.cells[3].innerHTML = sixStars.length ? Math.round(((sixStars.reduce((partialSum, a) => partialSum + a, 0) / sixStars.length) + Number.EPSILON) * 100) / 100 : 0;

        const fiveStarRow = bannerExtraStatsTable.rows[3];
        fiveStarRow.cells[1].innerHTML = fiveStars.length;
        fiveStarRow.cells[2].innerHTML = `${Math.round(((fiveStars.length * 100 / bannerHistory.length) + Number.EPSILON) * 100) / 100}%`;
        fiveStarRow.cells[3].innerHTML = fiveStars.length ? Math.round(((fiveStars.reduce((partialSum, a) => partialSum + a, 0) / fiveStars.length) + Number.EPSILON) * 100) / 100 : 0;
    }
}
makeTableAndPopulateExtraStats("standard");
makeTableAndPopulateExtraStats("limited");


let limitedShow6Stars = {"value":true};
let limitedShow5Stars = {"value":true};
let limitedShow4AndLowerStars = {"value":false};
let standardShow6Stars = {"value": true};
let standardShow5Stars = {"value": true};
let standardShow4AndLowerStars = {"value": false};


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