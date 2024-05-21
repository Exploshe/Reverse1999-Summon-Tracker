import { banners } from "../data/banners.js";
import { characterIds } from "../data/character_ids.js";

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function roundTo2Places(n) {
	return Math.round((n + Number.EPSILON) * 100) / 100;
}

const bannerButtons = document.querySelectorAll(".banner-button");

bannerButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        if (button.classList.contains("selected")) {
            return;
        }
        unselectAll();
        button.classList.add("selected");
        renderStats(event.currentTarget.classList[0]);
    })
})

function unselectAll() {
    bannerButtons.forEach(button => {
        button.classList.remove("selected");
    })
}

function renderStats(banner) {
    const hehe = banner.indexOf("-")
    const bannerName = hehe >= 0 ? banner.slice(0, hehe) : banner;
    const bannerStart = hehe >= 0 ? banner.slice(hehe + 1, banner.length) : null;
    
    // fetch stats for banner from server
    console.log(`fetching ${bannerName}`);
    document.querySelector(".loading").innerHTML = "Loading";
    fetch(`https://18.116.12.52/global-stats/banner?bannerName=${bannerName}&bannerStart=${bannerStart}`)
		.then(response => response.text())
		.then(data => {
            data = JSON.parse(data);
            
            if (data.bannerStatsResults[0]) {
                for (const [key, value] of Object.entries(data.bannerStatsResults[0]).slice(2)) {
                    document.getElementById(key).innerHTML = numberWithCommas(value);
                }
                document.getElementById("clear_drops_spent").innerHTML = numberWithCommas(data.bannerStatsResults[0].total_spins * 180);
            } else {
                ["total_users","total_spins","6*_spins","5*_spins","6*_50/50_wr","total_rate_up_spins"].forEach(key => {
                    document.getElementById(key).innerHTML = 0;
                })
                document.getElementById("clear_drops_spent").innerHTML = 0;
            }

            const config = {
                staticPlot: true,
                responsive: true
            }

            let start = bannerStart ?? banners[bannerName].start;
            let end = banners[bannerName]?.end;
            if (!end) {
                for (let i = 0; i < banners[bannerName].length; i++) {
                    const b = banners[bannerName][i];
                    if (b.start.includes(start)) {
                        end = b.end;
                        break;
                    }
                }
                start += " 05:00:00";  // for graph formatting
            }

            const startDateMinus1Day = new Date(start);
            startDateMinus1Day.setDate(startDateMinus1Day.getDate() - 1);
            const layout = {
                title: "Spins By Day",
                xaxis: {
                    tickmode: "linear",
                    tick0: new Date(start).toISOString().slice(0,10),
                    range: [startDateMinus1Day.toISOString(), end],
                    type: "date",
                    gridcolor: "black"
                }
            }
            createGraph(document.querySelector(".spins-by-day-graph"), data.bannerGraphDateResults, {type: "scatter"}, layout, config)

            const layout2 = {
                title: "6&#9733; Spins By Pity",
                xaxis: {
                    autotick: false,
                    tick0: 1,
                    dtick: 2,
                    range: [0.01, 70.99],
                    tickangle: -45,
                    gridcolor: "black"
                }
            }
            createGraph(document.querySelector(".sixstar-spins-by-pity-graph"), data.bannerGraph6PityResults, {type: "bar", marker: {color: "rgb(224,154,37)"}}, layout2, config)

            const layout3 = {
                title: "5&#9733; Spins By Pity",
                xaxis: {
                    autotick: false,
                    tick0: 1,
                    dtick: 2,
                    rangemode: "tozero",
                    tickangle: -45,
                    gridcolor: "black",
                }
            }
            createGraph(document.querySelector(".fivestar-spins-by-pity-graph"), data.bannerGraph5PityResults, {type: "bar", marker: {color: "rgb(228,199,128)"}}, layout3, config)

            const rateUp = banners[bannerName].rateUp6StarId ?? banners[bannerName][0].rateUp6StarId;
            const charName = characterIds[rateUp].name;
            document.getElementById("char-name").innerHTML = charName;
            document.querySelector(".rate-up-char-img").src = `images/characters/icon/${charName.replace(/\ /g, "_")}_Icon.png`

            document.querySelector(".loading").innerHTML = "";
		});
}

function createGraph(domElement, data, trace, layout, config) {
    const x = data.map((x) => x.pity || x.date);
    const y = data.map((x) => x.total_spins);
    const width = Array(data.length).fill(0.9);

    trace.x = x;
    trace.y = y;
    if (trace.type === "bar") {
        trace.width = width;
    }

    const lines = [trace];

    const defaultLayout = {
        font: {
            color: "white"
        },
        plot_bgcolor: "rgb(53, 44, 112)",
        paper_bgcolor: "rgb(53, 44, 112)",
        margin: {
            t: 60,
            b: 40,
            l: 40,
            r: 30
        },
        yaxis: {
            showgrid: true,
            gridcolor: "black",
            rangemode: "tozero"
        }
    };
    const newLayout = Object.assign(defaultLayout, layout);
    
    Plotly.newPlot(domElement, lines, newLayout, config);
}

bannerButtons[0].click();
