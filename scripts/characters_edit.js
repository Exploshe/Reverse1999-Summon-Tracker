import { default_character_count } from "../data/default_character_count.js";
import { characterIds } from "../data/character_ids.js";
import { characterNames } from "../data/character_ids.js";

const searchBar = document.querySelector(".search-bar");
const cardsList = document.querySelector(".character-cards").children;

searchBar.addEventListener("input", (e) => {
    const input = e.target.value.toLowerCase();

    for (let i = 0; i < cardsList.length; i++) {
        cardsList[i].style.display = cardsList[i].children[1].innerHTML.toLowerCase().includes(input) ? "flex" : "none";
    }
});

const selectedProfile = localStorage.getItem("selectedIndex");
let characterEdit = localStorage.getItem("characterEdit");
let charactersEditObj;
if (characterEdit) {
    const boga = JSON.parse(characterEdit);
    charactersEditObj = boga[selectedProfile];
} else {
    charactersEditObj = {};
    characterEdit = {
        [selectedProfile]: charactersEditObj
    }
    localStorage.setItem("characterEdit", JSON.stringify(characterEdit));
}
// const charactersEditObj =

// add character to edit
for (let i = 0; i < cardsList.length; i++) {
    const card = cardsList[i];
    card.addEventListener("click", (e) => {
        const characterName = e.currentTarget.children[1].innerHTML;
        const id = characterNames[characterName];
        charactersEditObj[id] = 1;

        renderList();
    })
}

function renderList() {
    let listHTML = "";
    for (const [key, value] of Object.entries(charactersEditObj)) {
    // for (let i = 0; i < charactersEditObj.length; i++) {
        // const character = charactersEditObj[i];
        const character = characterIds[key].name;
        console.log(character);

        const html = `
        <div class="edited-char">
            <img class="character-img" src="images/characters/icon/${character.replace(/ /g,"_")}_Icon.png">
            <input class="num-input" type="number" min="1" value="1">
            <button class="${key} delete-button">Delete</button>
        </div>`;
        listHTML += html;
    }
    document.querySelector(".edited-chars-list").innerHTML = listHTML;

    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            deleteCharacter(button.classList[0]);
        })
    })

    const numInputs = document.querySelectorAll(".num-input");
    numInputs.forEach((input, index) => {
        input.addEventListener("change", () => {
            console.log(input.value, index);
        })
    })
}

function deleteCharacter(id) {
    delete charactersEditObj[id];
    renderList();
}

    
