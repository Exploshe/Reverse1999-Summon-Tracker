import { characterIds } from "../data/character_ids.js";
import { characterNames } from "../data/character_ids.js";
import { default_character_count } from "../data/default_character_count.js";

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


// Count characters and set portray amount
const summonData = JSON.parse(localStorage.getItem("summonData"));
// const characters = localStorage.getItem("characters") ? JSON.parse(localStorage.getItem("characters")) : default_character_count;
const characters = default_character_count;

if (!localStorage.getItem("characters")) {
    for (const [bannerType, obj] of Object.entries(summonData)) {
        for (let i = 0; i < obj.history.length; i++) {
            const summon = obj.history[i];
            if (summon.name.startsWith("The Golden Thread")) {
                continue
            }
            characters[summon.name].wish += 1
        }
    }

    // localStorage.setItem("characters", JSON.stringify(characters));
}

for (const [name, obj] of Object.entries(characters)) {
    const portray = document.querySelector(`._${characterNames[name]}`);
    const count = obj.default + obj.wish + obj.manual;
    portray.innerHTML = count ? `P${count - 1}` : "";
    portray.style.color = (count - 1) >= 5 ? "rgb(224,154,37)" : "white";
}
