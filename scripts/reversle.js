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

for (let i = 0; i < cardsList.length; i++) {
    const card = cardsList[i];
    card.addEventListener("click", (e) => {
        const characterName = e.currentTarget.children[1].innerHTML;
        const id = characterNames[characterName];
        let isCorrectAfflatus = true;
        characterIds[id].tags.forEach(tag => {
            
        });
        if (id !== answer.id) {
            if (characterIds[id].afflatus !== characterIds[answer.id].afflatus) {
                isCorrectAfflatus = false;
                console.log("wrong afflatus");
            } else {
                console.log("correct afflatus");
            }
        }

        document.querySelector(".guess-list").innerHTML += `
            <tr>
                <td><img class="character-img" src="images/characters/icon/${characterName === "Matilda Bouanich" ? "Matilda" : characterName.replace(/ /g,"_")}_Icon.png"></td>
                <td style="background-color: ${id === answer.id ? 'green' : 'red'}">${characterName}</td>
                <td style="background-color: ${isCorrectRarity ? 'green' : 'red'}">${characterIds[id].rarity}</td>
                <td style="background-color: ${isCorrectAfflatus ? 'green' : 'red'}">${characterIds[id].afflatus}</td>
            </tr>`
    })
}

const randomNumber = Math.floor(Math.random() * cardsList.length);
const name = cardsList[randomNumber].children[1].innerHTML;
const answer = {
    name: name,
    id: characterNames[name]
}
// console.log(answer);