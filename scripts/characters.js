import { characterIds } from "../data/character_ids.js";
import { characterNames } from "../data/character_ids.js";

const filterbuttons = document.querySelectorAll(".sort-filter-bar div");
const characterList = document.querySelectorAll(".characters a");

filterbuttons.forEach(button => {{
    button.addEventListener("click", () => {
        button.classList.contains("selected") ? button.classList.remove("selected") : button.classList.add("selected")
        updateFilters();
    });
}})

function updateFilters() {
    const afflatusFilters = getSelectedFilters("afflatus");
    const rarityFilters = getSelectedFilters("rarity");
    const damageTypeFilters = getSelectedFilters("damageType");

    const filteredCharacters = []
    characterList.forEach(characterElement => {
        // characterElement.children[3] -> <div class="class0 class1 _ID"></div>, .classList[2] -> _ID, .slice(1) -> ID
        const id = characterElement.children[3].classList[2].slice(1);
        const character = characterIds[id];
        if ((!rarityFilters.length || rarityFilters.includes(character.rarity.toString())) && 
        (!afflatusFilters.length || afflatusFilters.includes(character.afflatus)) && 
        (!damageTypeFilters.length || damageTypeFilters.includes(character.damageType))) {
            filteredCharacters.push(characterElement);
        }
    });

    displayFilteredCharacters(filteredCharacters);
}

function getSelectedFilters(filterType) {
    return Array.from(filterbuttons)
        .filter(button => button.classList.contains("selected") && button.classList.contains(filterType))
        .map(button => button.classList[0]);
}

function displayFilteredCharacters(filteredCharacters) {
    characterList.forEach(characterElement => {
        characterElement.style.display = "none";
    });

    filteredCharacters.forEach(characterElement => {
        characterElement.style.display = "flex";
    });
}


// Count characters
const selectedProfile = localStorage.getItem("selectedIndex");
const summonData = JSON.parse(localStorage.getItem("summonData"))[selectedProfile];
const arcanistsCounter = {};
for (const [bannerType, obj] of Object.entries(summonData)) {
    for (let i = 0; i < obj.history.length; i++) {
        const summon = obj.history[i];
        if (summon.name.startsWith("The Golden Thread")) {
            continue
        }
        arcanistsCounter[summon.name] ? arcanistsCounter[summon.name] += 1 : arcanistsCounter[summon.name] = 1
    }
}

// If first time visitng site since manually editing characters was implemented
if (!JSON.parse(localStorage.getItem("arcanistsEdit"))) {
    arcanistsEdit = {}
    for (const [key, value] of Object.entries(JSON.parse(localStorage.getItem("profiles")))) {
        arcanistsEdit[key] = {
            3022: 1,
            3028: 1,
            3041: 1,
            3023: 5
        }
    }
    
    localStorage.setItem("arcanistsEdit", JSON.stringify(arcanistsEdit));
}

// Set portray amount
const selectedProfileArcanistsEdit = JSON.parse(localStorage.getItem("arcanistsEdit"))[localStorage.getItem("selectedIndex")];
for (const [name, id] of Object.entries(characterNames)) {
    const portrayElement = document.querySelector(`._${id}`);
    if (!portrayElement) {
        continue;
    }
    const count = (arcanistsCounter[name] ?? 0) + (selectedProfileArcanistsEdit[id] ?? 0);
    portrayElement.innerHTML = count ? `P${count - 1}` : "";
    portrayElement.style.color = (count - 1) >= 5 ? "rgb(224,154,37)" : "white";
}
