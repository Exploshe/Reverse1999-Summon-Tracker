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
        const isCorrectAfflatus = characterIds[id].afflatus === characterIds[answer.id].afflatus;
        let spans = "";
        characterIds[id].tags.forEach(tag => {
            spans += `<span style="color: ${characterIds[answer.id].tags.includes(tag) ? "green" : "red"}">${tag}</span>`
        });
        const isCorrectMaterial = characterIds[id].material === characterIds[answer.id].material;
        const isCorrectDamageType = characterIds[id].damageType === characterIds[answer.id].damageType;
        document.querySelector(".guess-list").innerHTML += `
            <tr>
                <td><img class="character-img" src="images/characters/icon/${characterName === "Matilda Bouanich" ? "Matilda" : characterName.replace(/ /g,"_")}_Icon.png"></td>
                <td style="background-color: ${id === answer.id ? 'green' : 'red'}">${characterName}</td>
                <td style="background-color: ${isCorrectMaterial ? 'green' : 'red'}"><img style="width: 40px" src="images/materials/${characterIds[id].material.replace(/ /g,"_")}.webp"></td>
                <td>${spans}</td>
                <td style="background-color: ${isCorrectAfflatus ? 'green' : 'red'}">${characterIds[id].afflatus}</td>
                <td style="background-color: ${isCorrectDamageType ? 'green' : 'red'}">${characterIds[id].damageType}</td>
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