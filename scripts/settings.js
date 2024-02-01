// Open and close export/import data
const exportImportOverlay = document.querySelector(".js-export-import-overlay");

document.querySelector(".export-import-button").addEventListener("click", () => {
    exportImportOverlay.classList.add("visible");
});

exportImportOverlay.addEventListener("click", (event) => {
    if (event.target.classList[0] === "overlay") {
        exportImportOverlay.classList.remove("visible");
    }
});

// Open and close changelog
const changelogOverlay = document.querySelector(".js-changelog-overlay");

document.querySelector(".changelog-button").addEventListener("click", () => {
    changelogOverlay.classList.add("visible");
});

changelogOverlay.addEventListener("click", (event) => {
    if (event.target.classList[0] === "overlay") {
        changelogOverlay.classList.remove("visible");
    }
});

// Populate changelog
fetch("changelog.txt")
    .then(function (res) {
        return res.text();
    })
    .then(function (data) {
        document.querySelector(".js-changelog-txt").innerHTML = data;
    });

// Download data
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

// Import data
const inputElement = document.querySelector(".input-file")

document.querySelector(".input-json-button").addEventListener("click", () => {
    inputElement.click();
});

inputElement.addEventListener("change", () => {
    if (inputElement.files.length === 1) {
        const file = inputElement.files[0];
        if (file.name.endsWith(".json")) {
            importHistoryJSON(file);
        } else {
            respondSuccessOrFailure("failure", "Invalid file type");
        }
    }
}); 

function importHistoryJSON(file) {
    const reader = new FileReader();
    const requiredKeys = ["1", "2", "3", "5"];

    reader.addEventListener("load", () => {
        const data = JSON.parse(reader.result);
        if (requiredKeys.every(key => key in data)) {
            localStorage.setItem("summonData", JSON.stringify(data));

            const checkbox = document.querySelector(".checkbox");
            if (checkbox.checked) {
                if (!localStorage.getItem("uuid")) {
                    localStorage.setItem("uuid", crypto.randomUUID());
                }
                postDataToServer({uuid: localStorage.getItem("uuid"), summonData: data});
            }
            
            respondSuccessOrFailure("success", "Success");
        } else {
            respondSuccessOrFailure("failure", "Invalid JSON");
        }
    })

    reader.readAsText(file);
}

function postDataToServer(obj) {
	fetch("https://3.146.105.207/post", {
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

const responseElement = document.querySelector(".import-result");
function respondSuccessOrFailure(response, message) {
    response === "failure" ? responseElement.innerHTML = `<img style="width: 56px; margin-top: 0px;" src="images/MatildaDizzy.webp"> ${message}` : responseElement.innerHTML = message;
    responseElement.classList.add(response);

    if (response === "success") { 
        responseElement.classList.remove("failure") 
    } else { 
        responseElement.classList.remove("success") 
    }
}

// check if server is up
fetch("https://3.146.105.207/post", { method: "POST" })
	.then((response) => {if (!response.ok) {throw new Error("hehe");}; return response.text()})
	.catch((error) => {
		document.querySelector(".server-down").style.display = "block";
	});

