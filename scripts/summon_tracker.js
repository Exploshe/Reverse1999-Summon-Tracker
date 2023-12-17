import { characterIds } from "../data/character_ids.js";

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


if (localStorage.getItem("standardBannerLifetimePulls")) {
    const standardBannerLifetimePulls = localStorage.getItem("standardBannerLifetimePulls");
    document.querySelector(".js-standard-lifetime-pulls").innerHTML = standardBannerLifetimePulls;
    document.querySelector(".js-standard-clear-drop-count").innerHTML = numberWithCommas(standardBannerLifetimePulls * 180);
};
if (localStorage.getItem("standardBanner6StarPity")) {
    const standardBanner6StarPity = localStorage.getItem("standardBanner6StarPity");
    document.querySelector(".js-standard-6star-pity").innerHTML = standardBanner6StarPity;
};
if (localStorage.getItem("standardBanner5StarPity")) {
    const standardBanner5StarPity = localStorage.getItem("standardBanner5StarPity");
    document.querySelector(".js-standard-5star-pity").innerHTML = standardBanner5StarPity;
};

if (localStorage.getItem("limitedBannerLifetimePulls")) {
    const limitedBannerLifetimePulls = localStorage.getItem("limitedBannerLifetimePulls");
    document.querySelector(".js-limited-lifetime-pulls").innerHTML = limitedBannerLifetimePulls;
    document.querySelector(".js-limited-clear-drop-count").innerHTML = numberWithCommas(limitedBannerLifetimePulls * 180);
};
if (localStorage.getItem("limitedBanner6StarPity")) {
    const limitedBanner6StarPity = localStorage.getItem("limitedBanner6StarPity");
    document.querySelector(".js-limited-6star-pity").innerHTML = limitedBanner6StarPity;
};
if (localStorage.getItem("limitedBanner5StarPity")) {
    const limitedBanner5StarPity = localStorage.getItem("limitedBanner5StarPity");
    document.querySelector(".js-limited-5star-pity").innerHTML = limitedBanner5StarPity;
};


function renderStandardBannerHistory() {
    if (localStorage.getItem("standardBannerHistory")) {
        const standardBannerHistory = JSON.parse(localStorage.getItem("standardBannerHistory"));
        for (let i = 0; i < standardBannerHistory.length; i++) {
            const summon = standardBannerHistory[i];
    
            let row = document.querySelector(".js-standard-banner-history").insertRow(-1);
            row.insertCell(0).appendChild(document.createTextNode(characterIds[summon.id].name));
            if (characterIds[summon.id].rarity === 6) {
                row.cells[0].setAttribute("class", "standard-banner-history-name-6star")
            } else if (characterIds[summon.id].rarity === 5) {
                row.cells[0].setAttribute("class", "standard-banner-history-name-5star")
            }
            row.insertCell(1).appendChild(document.createTextNode(summon.time));
            row.cells[1].setAttribute("class", "standard-banner-history-time");
            if (summon.pity) {
                row.insertCell(2).appendChild(document.createTextNode(summon.pity));
            } else {
                row.insertCell(2).appendChild(document.createTextNode(""));
            }
        }
    }
}


function renderLimitedBannerHistory() {
    if (localStorage.getItem("limitedBannerHistory")) {
        const limitedBannerHistory = JSON.parse(localStorage.getItem("limitedBannerHistory"));
        for (let i = 0; i < limitedBannerHistory.length; i++) {
            const summon = limitedBannerHistory[i];
            
            let row = document.querySelector(".js-limited-banner-history").insertRow(-1);
            row.insertCell(0).appendChild(document.createTextNode(characterIds[summon.id].name));
            if (characterIds[summon.id].rarity === 6) {
                row.cells[0].setAttribute("class", "limited-banner-history-name-6star")
            } else if (characterIds[summon.id].rarity === 5) {
                row.cells[0].setAttribute("class", "limited-banner-history-name-5star")
            }
            row.insertCell(1).appendChild(document.createTextNode(summon.time));
            row.cells[1].setAttribute("class", "limited-banner-history-time");
            if (summon.pity) {
                row.insertCell(2).appendChild(document.createTextNode(summon.pity));
            } else {
                row.insertCell(2).appendChild(document.createTextNode(""));
            }
        }
    }
}

renderStandardBannerHistory();
renderLimitedBannerHistory();