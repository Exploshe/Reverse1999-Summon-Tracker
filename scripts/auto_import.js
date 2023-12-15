import { characterIds } from "/data/character_ids.js";


function parseSummonHistory(res) {
    const summons = res.data.pageData;
    let limitedLifetimePulls = 0;
    let limitedBanner6StarPity = 0
    let limitedBanner5StarPity = 0
    for (let i = summons.length - 1; i >= 0; i--) {
        const summon = summons[i];
        for (let j = 0; j < summon.gainIds.length; j++) {
            const id = summon.gainIds[j];
            // Beginner banner
            if (summon.poolType === 1) {}
            // Standard banner
            else if (summon.poolType === 2) {}
            // Limited banner
            else if (summon.poolType === 3) {
                limitedLifetimePulls++;
                limitedBanner6StarPity++;
                limitedBanner5StarPity++;
                if (characterIds[`${id}`].rarity === 6) {
                    limitedBanner6StarPity = 0;
                } else if (characterIds[`${id}`].rarity === 5) {
                    limitedBanner5StarPity = 0
                }
            }
        };
    };
    localStorage.setItem("limitedLifetimePulls", limitedLifetimePulls);
    localStorage.setItem("limitedBanner6StarPity", limitedBanner6StarPity);
    localStorage.setItem("limitedBanner5StarPity", limitedBanner5StarPity);
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
    // For testing
    // localStorage.setItem("limitedLifetimePulls", 123);
    // localStorage.setItem("limitedBanner6StarPity", 123);
    // localStorage.setItem("limitedBanner5StarPity", 123);
}


document.querySelector(".js-import-button").addEventListener("click", () => {
    importSummon()
});
document.querySelector(".js-import-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        importSummon();
    }
});