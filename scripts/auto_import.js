import { characterIds } from "../data/character_ids.js";


function updateLocalStorage(standardBanner6StarPity, standardBanner5StarPity, standardBannerHistory,
                            limitedBanner6StarPity, limitedBanner5StarPity, limitedBannerHistory,
                            beginnerBannerHistory, eventBannerHistory) {
    // TODO: dont overwrite old pulls when they start getting deleted after 90 days (Jan 24, 2024)
    localStorage.setItem("standardBannerLifetimePulls", standardBannerHistory.length);
    localStorage.setItem("standardBanner6StarPity", standardBanner6StarPity);
    localStorage.setItem("standardBanner5StarPity", standardBanner5StarPity);
    localStorage.setItem("standardBannerHistory", JSON.stringify(standardBannerHistory.reverse()));
    localStorage.setItem("limitedBannerLifetimePulls", limitedBannerHistory.length);
    localStorage.setItem("limitedBanner6StarPity", limitedBanner6StarPity);
    localStorage.setItem("limitedBanner5StarPity", limitedBanner5StarPity);
    localStorage.setItem("limitedBannerHistory", JSON.stringify(limitedBannerHistory.reverse()));
    localStorage.setItem("beginnerBannerHistory", JSON.stringify(beginnerBannerHistory.reverse()));
    localStorage.setItem("eventBannerHistory", JSON.stringify(eventBannerHistory.reverse()));
}

function respondSuccessOrFailure(response) {
    if (response === "success") {
        document.querySelector(".js-import-result").innerHTML = "Success";
        document.querySelector(".js-import-result").classList.remove("failure");
    } else {
        document.querySelector(".js-import-result").innerHTML = "Invalid input";
        document.querySelector(".js-import-result").classList.remove("success");
    }
    document.querySelector(".js-import-result").classList.add(`${response}`);
}

function parseSummonHistory(res) {
    const summons = res.data.pageData;
    let beginnerBanner6StarPity = 0;
    let beginnerBanner5StarPity = 0;
    let beginnerBannerHistory = [];
    let standardBanner6StarPity = 0;
    let standardBanner5StarPity = 0;
    let standardBannerHistory = [];
    let limitedBanner6StarPity = 0;
    let limitedBanner5StarPity = 0;
    let limitedBannerHistory = [];
    let eventBanner6StarPity = 0;
    let eventBanner5StarPity = 0;
    let eventBannerHistory = [];
    for (let i = summons.length - 1; i >= 0; i--) {
        const summon = summons[i];
        for (let j = 0; j < summon.gainIds.length; j++) {
            const id = summon.gainIds[j];
            const poolType = summon.poolType;
            const obj = {"id": id, "time": summon.createTime};
            // Beginner banner
            if (poolType === 1) {
                beginnerBanner6StarPity++;
                beginnerBanner5StarPity++;
                if (characterIds[`${id}`].rarity === 6) {
                    obj.pity = beginnerBanner6StarPity;
                    beginnerBanner6StarPity = 0;
                } else if (characterIds[`${id}`].rarity === 5) {
                    obj.pity = beginnerBanner5StarPity;
                    beginnerBanner5StarPity = 0;
                }
                beginnerBannerHistory.push(obj);
            }
            // Standard banner
            else if (poolType === 2) {
                standardBanner6StarPity++;
                standardBanner5StarPity++;
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
            else if (poolType === 3) {
                limitedBanner6StarPity++;
                limitedBanner5StarPity++;
                obj.banner = summon.poolName;
                if (characterIds[`${id}`].rarity === 6) {
                    obj.pity = limitedBanner6StarPity;
                    limitedBanner6StarPity = 0;
                } else if (characterIds[`${id}`].rarity === 5) {
                    obj.pity = limitedBanner5StarPity;
                    limitedBanner5StarPity = 0;
                }
                limitedBannerHistory.push(obj);
            }
            // Golden Thread event
            else if (poolType === 5) {
                eventBanner6StarPity++;
                eventBanner5StarPity++;
                if (characterIds[`${id}`].rarity === 6) {
                    obj.pity = eventBanner6StarPity;
                    eventBanner6StarPity = 0;
                } else if (characterIds[`${id}`].rarity === 5) {
                    obj.pity = eventBanner5StarPity;
                    eventBanner5StarPity = 0;
                }
                eventBannerHistory.push(obj);
            }
        }
    }
    updateLocalStorage(standardBanner6StarPity, standardBanner5StarPity, standardBannerHistory,
                        limitedBanner6StarPity, limitedBanner5StarPity, limitedBannerHistory,
                        beginnerBannerHistory, eventBannerHistory);
    respondSuccessOrFailure("success");
}


async function makeRequest(url) {
    try {
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", url);
        xhttp.send();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                const res = JSON.parse(xhttp.responseText);
                if (res.code === 200) {
                    parseSummonHistory(res);
                } else { 
                    respondSuccessOrFailure("failure");
                }
            }
        }
    } catch (error) {
        respondSuccessOrFailure("failure");
        console.error('Error making the request:', error.message);
    }
}


function importSummon() {
    try {
        let url = document.querySelector(".link").value;
        if (url.startsWith("https://game-re-en-service.sl916.com/query/summon?userId=")) {
            url = 'https://corsproxy.io/?' + encodeURIComponent(url);
            document.querySelector(".link").value = "";

            makeRequest(url);
        } else if (url.startsWith('{')) {
            const res = JSON.parse(url);
            if (res.code === 200){
                parseSummonHistory(res);
            } else {
                respondSuccessOrFailure("failure");
            }
        } else {
            respondSuccessOrFailure("failure");
        }
    } catch (error) {
        respondSuccessOrFailure("failure");
        console.error("Error:", error.message);
    }
}


document.querySelector(".js-import-button").addEventListener("click", () => importSummon());
document.querySelector(".js-import-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        importSummon();
    }
});


function selectPC() {
    document.querySelector(".pc-directions").style.display = "flex";
    document.querySelector(".pc-button").classList.add("selected");
    document.querySelector(".ios-directions").style.display = "none";
    document.querySelector(".ios-button").classList.remove("selected");
}
function selectIOS() {
    document.querySelector(".ios-directions").style.display = "flex";
    document.querySelector(".ios-button").classList.add("selected");
    document.querySelector(".pc-directions").style.display = "none";
    document.querySelector(".pc-button").classList.remove("selected");
}
document.querySelector(".pc-button").addEventListener("click", () => selectPC());
document.querySelector(".ios-button").addEventListener("click", () => selectIOS());
selectPC();