document.querySelector(".export-import-button").addEventListener("click", () => {
    document.querySelector(".js-export-import-overlay").classList.add("visible");
});

document.querySelector(".js-export-import-overlay").addEventListener("click", (event) => {
    if (event.target.classList[0] === "overlay") {
        document.querySelector(".js-export-import-overlay").classList.remove("visible");
    }
});


document.querySelector(".changelog-button").addEventListener("click", () => {
    document.querySelector(".js-changelog-overlay").classList.add("visible");
});

document.querySelector(".js-changelog-overlay").addEventListener("click", (event) => {
    if (event.target.classList[0] === "overlay") {
        document.querySelector(".js-changelog-overlay").classList.remove("visible");
    }
});


fetch("changelog.txt")
    .then(function (res) {
        return res.text();
    })
    .then(function (data) {
        document.querySelector(".js-changelog-txt").innerHTML = data;
    });

document.querySelector(".download-button").addEventListener("click", () => {
    downloadObjectAsJson(localStorage.getItem("summonData"), "reverse1999_summon_history");
});

function downloadObjectAsJson(exportObj, exportName){
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportObj);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}


const inputElement = document.querySelector(".input-file")

document.querySelector(".input-json-button").addEventListener("click", () => {
    inputElement.click();
});

const responseElement = document.querySelector(".import-result");

inputElement.addEventListener("change", () => {
    if (inputElement.files.length === 1) {
        const file = inputElement.files[0];
        if (file.name.slice(-5) === ".json") {
            importHistoryJSON(file);
        } else {
            respondSuccessOrFailure("failure", "Invalid file type");
        }
    }
}); 

function importHistoryJSON(file) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        const data = JSON.parse(reader.result);
        if ("1" in data && "2" in data && "3" in data && "5" in data) {
            localStorage.setItem("summonData", JSON.stringify(data));
            respondSuccessOrFailure("success", "Success");
        } else {
            respondSuccessOrFailure("failure", "Import failed");
        }
    })

    reader.readAsText(file);
}

function respondSuccessOrFailure(response, message) {
    responseElement.innerHTML = message;
    responseElement.classList.add(response);
    if (response === "success") { responseElement.classList.remove("failure") }
    else { responseElement.classList.remove("success") }
}
