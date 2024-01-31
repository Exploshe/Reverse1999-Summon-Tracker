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

function renderStats(bannerName) {
    // fetch stats for banner from server
    console.log(`fetching ${bannerName}`);
    document.querySelector(".loading").innerHTML = "Loading";
    fetch(`https://3.146.105.207/global-stats/banner?bannerName=${bannerName}`)
		.then(response => response.text())
		.then(data => {
            data = JSON.parse(data);
            
            for (const [key, value] of Object.entries(data.bannerStatsResults[0]).slice(2)) {
                document.getElementById(key).innerHTML = numberWithCommas(value);
            }
            document.getElementById("clear_drops_spent").innerHTML = numberWithCommas(data.bannerStatsResults[0].total_spins * 180);

            const config = {
                staticPlot: true,
                responsive: true
            }
            const layout = {
                title: "Spins By Day",
                xaxis: {
                    tickformat: "%m/%d",
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

            const charName = characterIds[banners[bannerName].rateUp6StarId].name;
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
