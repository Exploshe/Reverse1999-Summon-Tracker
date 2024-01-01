// document.querySelector(".export-import-button").addEventListener("click", () => {
//     document.querySelector(".js-export-import-overlay").classList.add("visible");
// });

document.querySelector(".js-export-import-overlay").addEventListener("click", () => {
    document.querySelector(".js-export-import-overlay").classList.remove("visible");
});

document.querySelector(".js-export-import-modal").addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
});


document.querySelector(".changelog-button").addEventListener("click", () => {
    document.querySelector(".js-changelog-overlay").classList.add("visible");
});

document.querySelector(".js-changelog-overlay").addEventListener("click", () => {
    document.querySelector(".js-changelog-overlay").classList.remove("visible");
});

document.querySelector(".js-changelog-modal").addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
});

fetch("../changelog.txt")
    .then(function (res) {
        return res.text();
    })
    .then(function (data) {
        document.querySelector(".js-changelog-txt").innerHTML = data;
    });