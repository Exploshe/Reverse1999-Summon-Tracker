import { characterIds } from "../data/character_ids.js";


function parseSummonHistory(res) {
    const summons = res.data.pageData;
    let standardBannerLifetimePulls = 0;
    let standardBanner6StarPity = 0;
    let standardBanner5StarPity = 0;
    let standardBannerHistory = [];
    let limitedBannerLifetimePulls = 0;
    let limitedBanner6StarPity = 0;
    let limitedBanner5StarPity = 0;
    let limitedBannerHistory = [];
    for (let i = summons.length - 1; i >= 0; i--) {
        const summon = summons[i];
        for (let j = 0; j < summon.gainIds.length; j++) {
            const id = summon.gainIds[j];
            // Beginner banner
            if (summon.poolType === 1) {}
            // Standard banner
            else if (summon.poolType === 2) {
                standardBannerLifetimePulls++;
                standardBanner6StarPity++;
                standardBanner5StarPity++;
                const obj = {"id": id, "time": summon.createTime};
                if (characterIds[`${id}`].rarity === 6) {
                    obj.pity = standardBanner6StarPity;
                    standardBanner6StarPity = 0;
                } else if (characterIds[`${id}`].rarity === 5) {
                    obj.pity = standardBanner5StarPity;
                    standardBanner5StarPity = 0;
                }
                standardBannerHistory.push(obj);
            }
            // Limited banner
            else if (summon.poolType === 3) {
                limitedBannerLifetimePulls++;
                limitedBanner6StarPity++;
                limitedBanner5StarPity++;
                const obj = {"id": id, "time": summon.createTime};
                if (characterIds[`${id}`].rarity === 6) {
                    obj.pity = limitedBanner6StarPity;
                    limitedBanner6StarPity = 0;
                } else if (characterIds[`${id}`].rarity === 5) {
                    obj.pity = limitedBanner5StarPity;
                    limitedBanner5StarPity = 0;
                }
                limitedBannerHistory.push(obj);
            }
        }
    }
    localStorage.setItem("standardBannerLifetimePulls", standardBannerLifetimePulls);
    localStorage.setItem("standardBanner6StarPity", standardBanner6StarPity);
    localStorage.setItem("standardBanner5StarPity", standardBanner5StarPity);
    localStorage.setItem("standardBannerHistory", JSON.stringify(standardBannerHistory.reverse()));
    localStorage.setItem("limitedBannerLifetimePulls", limitedBannerLifetimePulls);
    localStorage.setItem("limitedBanner6StarPity", limitedBanner6StarPity);
    localStorage.setItem("limitedBanner5StarPity", limitedBanner5StarPity);
    localStorage.setItem("limitedBannerHistory", JSON.stringify(limitedBannerHistory.reverse()));
    console.log("Success");
}


async function makeRequest(url) {
    try {
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", url);
        xhttp.send();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                const res = JSON.parse(xhttp.responseText);
                if (res.code === 200) {
                    parseSummonHistory(res);
                } else { 
                    console.log("Expired or invalid link");
                }
            }
            
        }
    } catch (error) {
        console.error('Error making the request:', error.message);
    }
}


function importSummon() {
    let url = document.querySelector(".link").value;
    url = 'https://corsproxy.io/?' + encodeURIComponent(url);
    document.querySelector(".link").value = "";

    makeRequest(url);
}


document.querySelector(".js-import-button").addEventListener("click", () => importSummon());
document.querySelector(".js-import-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        importSummon();
    }
});