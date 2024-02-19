import { characterIds } from "../data/character_ids.js";
import { banners } from "../data/banners.js";

function binarySearch(arr, val) {
	// array is sorted new to old
	let left = 0;
	let right = arr.length - 1;
	while (left <= right) {
		const middle = Math.floor((left + right) / 2);
		const time = arr[middle].createTime;
		if (time === val) {
			return middle;
		} else if (time < val) {
			right = middle - 1;
		} else {
			left = middle + 1;
		}
	}
	return arr.length;
}

const profiles = JSON.parse(localStorage.getItem("profiles"));
const selectedIndex = JSON.parse(localStorage.getItem("selectedIndex"));
document.querySelector(".js-selected-profile").innerHTML = profiles[selectedIndex].name;

function importSummon() {
    try {
		document.querySelector(".importing").style.display = "block";
        let res;
        const input = document.querySelector(".link").value;
		// update to accept jp links
        if (input.startsWith("https://game-re-en-service.sl916.com/query/summon?userId=")) {
            const url = 'https://corsproxy.io/?' + encodeURIComponent(input);
            makeRequest(url);
        } else if (input.startsWith('{')) {
            res = JSON.parse(input);
			verifyJSON(res);
        } else {
			respondSuccessOrFailure("failure");
		}
    } catch (error) {
        respondSuccessOrFailure("failure");
        console.error("Error:", error.message);
    }
}

async function makeRequest(url) {
    try {
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", url);
        xhttp.send();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                const res = JSON.parse(xhttp.responseText);
                verifyJSON(res);
            }
        }
    } catch (error) {
        respondSuccessOrFailure("failure");
        console.error('Error making the request:', error.message);
    }
}

function verifyJSON(json) {
	if (json.code === 200) {
		parseSummonHistory(json);
	} else {
		respondSuccessOrFailure("failure");
	}
}

function parseSummonHistory(res) {
	const summons = res.data.pageData;
	const selectedProfile = localStorage.getItem("selectedIndex");
	const summonData = JSON.parse(localStorage.getItem("summonData"));
	const selectedProfileSummonData = summonData[selectedProfile] && Object.keys(summonData[selectedProfile]).length > 0 ? summonData[selectedProfile] : {
		1: { // Beginner banner
			pity6: 0,
			pity5: 0,
			history: [],
		},
		2: { // Standard banner
			pity6: 0,
			pity5: 0,
			history: [],
		},
		3: { // Limited banner
			isGuaranteed: false,
			pity6: 0,
			pity5: 0,
			history: [],
		},
		5: { // Golden thread banner
			pity6: 0,
			pity5: 0,
			history: [],
		}
	};

	// get index of latest pull to only import new pulls
	let max = "";
	for (const [key, obj] of Object.entries(selectedProfileSummonData)) {
		const time = obj.history[obj.history.length - 1]?.time
		max = time > max ? time : max;
	}

	const newSummons = [];
	const index = max ? binarySearch(summons, max) : summons.length;
	for (let i = index - 1; i >= 0; i--) {
		const summon = summons[i];
		const { gainIds, poolType, createTime, poolName } = summon;
		gainIds.forEach(id => {
			const character = characterIds[id];
			const rarity = character.rarity;

			const obj = {
				id, 
				name: character.name, 
				time: createTime, 
				banner: poolName
			};
			
			selectedProfileSummonData[poolType].pity6++;
			selectedProfileSummonData[poolType].pity5++;

			if (rarity === 6 || rarity === 5) {
				obj.pity = selectedProfileSummonData[poolType][`pity${rarity}`];
				selectedProfileSummonData[poolType][`pity${rarity}`] = 0;
			}

			// 5050s, 0 = lost, 1 = won, 2 = guaranteed
			if (poolType === 3) {
				const { rateUp6StarId, rateUp5StarIds } = banners[poolName];

				switch (rarity) {
					case 6:
						obj.rate = id === rateUp6StarId && !selectedProfileSummonData[3].isGuaranteed ? 1 : selectedProfileSummonData[3].isGuaranteed * 2;
						selectedProfileSummonData[3].isGuaranteed = id !== rateUp6StarId;
						break;
					case 5:
						obj.rate = rateUp5StarIds.includes(id) ? 1 : 0;
				}
			}
			
			selectedProfileSummonData[poolType].history.push(obj);
			newSummons.push(obj);
		});
	}

	const checkbox = document.querySelector(".checkbox");
	if (checkbox.checked && newSummons) {
		const profiles = JSON.parse(localStorage.getItem("profiles"));
		if (!profiles[selectedProfile].uuid) {
			profiles[selectedProfile].uuid = crypto.randomUUID();
			localStorage.setItem("profiles", profiles);
		}
		postDataToServer({uuid: profiles[selectedProfile].uuid, summons: newSummons});
	}

	summonData[selectedProfile] = selectedProfileSummonData;
	localStorage.setItem("summonData", JSON.stringify(summonData));
	respondSuccessOrFailure("success");
}


function respondSuccessOrFailure(response) {
	document.querySelector(".importing").style.display = "none";
	if (response === "success") {
		document.querySelector(".js-import-result").innerHTML = "Success";
		document.querySelector(".js-import-result").classList.remove("failure");
	} else {
		document.querySelector(".js-import-result").innerHTML = '<img style="width: 56px; margin-top: 0px;" src="images/MatildaDizzy.webp"> Invalid input';
		document.querySelector(".js-import-result").classList.remove("success");
	}
	document.querySelector(".js-import-result").classList.add(`${response}`);
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

function postDataToServer(obj) {
	fetch("https://18.116.12.52/post", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(obj)
		})
		.then(response => response.text())
		.then(data => {
			console.log(`response ${data}`)
		});
}

// check if server is up
fetch("https://18.116.12.52/post", { method: "POST" })
	.then((response) => {if (!response.ok) {throw new Error("hehe");}; return response.text()})
	.catch((error) => {
		document.querySelector(".server-down").style.display = "block";
	});
