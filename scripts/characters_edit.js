import { default_character_count } from "../data/default_character_count.js";

const searchBar = document.querySelector(".search-bar");
const cardsList = document.querySelector(".character-cards").children;

searchBar.addEventListener("input", (e) => {
    const input = e.target.value.toLowerCase();

    for (let i = 0; i < cardsList.length; i++) {
        cardsList[i].style.display = cardsList[i].children[1].innerHTML.toLowerCase().includes(input) ? "flex" : "none";
    }
});

for (let i = 0; i < cardsList.length; i++) {
    const card = cardsList[i];
    card.addEventListener("click", (e) => {
        console.log(e.currentTarget.children[1].innerHTML);
    })
}

for (const [id, obj] of Object.entries(default_character_count))
document.querySelector(".edited-characters").innerHTML
    
