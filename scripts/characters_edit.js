import { characterIds } from "../data/character_ids.js";
import { characterNames } from "../data/character_ids.js";

const searchBar = document.querySelector(".search-bar");
const characterCardsElement = document.querySelector(".character-cards");
const cardsList = characterCardsElement.children;

searchBar.addEventListener("input", (e) => {
    const input = e.target.value.toLowerCase();

    for (let i = 0; i < cardsList.length; i++) {
        cardsList[i].style.display = cardsList[i].children[1].innerHTML.toLowerCase().includes(input) ? "flex" : "none";
    }
});

const selectedProfile = localStorage.getItem("selectedIndex");
const arcanistsEdit = JSON.parse(localStorage.getItem("arcanistsEdit"));
const selectedProfileArcanistsEdit = arcanistsEdit[selectedProfile];
renderList();

// add character to edit
for (let i = 0; i < cardsList.length; i++) {
    const card = cardsList[i];
    card.addEventListener("click", (e) => {
        const characterName = e.currentTarget.children[1].innerHTML;
        const id = characterNames[characterName];
        selectedProfileArcanistsEdit[id] = 1;
        updateLocalStorage();
        renderList();

        // characterCardsElement.removeChild(cardsList[n]);
    })
}

function renderList() {
    let listHTML = "";
    for (const [key, value] of Object.entries(selectedProfileArcanistsEdit)) {
        const character = characterIds[key].name;
        const html = `
        <div class="edited-char">
            <img class="character-img" src="images/characters/icon/${character === "Matilda Bouanich" ? "Matilda" : character.replace(/ /g,"_")}_Icon.png">
            <input class="${key} num-input rarity${characterIds[key].rarity}" type="number" min="1" value="${value}">
            <button class="${key} delete-button">Delete</button>
        </div>`;
        listHTML += html;
    }
    document.querySelector(".edited-chars-list").innerHTML = listHTML;

    document.querySelectorAll(".delete-button").forEach(button => {
        button.addEventListener("click", () => {
            delete selectedProfileArcanistsEdit[button.classList[0]];
            updateLocalStorage();
            renderList();
        })
    })

    document.querySelectorAll(".num-input").forEach(input => {
        input.addEventListener("change", () => {
            const id = input.classList[0];
            selectedProfileArcanistsEdit[id] = parseInt(input.value);
            updateLocalStorage();
        })
    })
}

function updateLocalStorage() {
    arcanistsEdit[selectedProfile] = selectedProfileArcanistsEdit;
    localStorage.setItem("arcanistsEdit", JSON.stringify(arcanistsEdit));
}

    
