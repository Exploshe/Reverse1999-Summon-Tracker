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
    const myObj = {
        nextIndex: localStorage.getItem("nextIndex"),
        selectedIndex: localStorage.getItem("selectedIndex"),
        profiles: JSON.parse(localStorage.getItem("profiles")),
        summonData: JSON.parse(localStorage.getItem("summonData"))
    }
    downloadObjectAsJson(myObj, "timekeeper-top-backup");
});

function downloadObjectAsJson(exportObj, exportName){
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
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
    const requiredKeys = ["nextIndex", "selectedIndex", "profiles", "summonData"];

    reader.addEventListener("load", () => {
        const data = JSON.parse(reader.result);
        if (requiredKeys.every(key => key in data)) {
            localStorage.setItem("nextIndex", data.nextIndex);
            localStorage.setItem("selectedIndex", data.selectedIndex);
            localStorage.setItem("profiles", JSON.stringify(data.profiles));
            localStorage.setItem("summonData", JSON.stringify(data.summonData));

            selectElement.innerHTML = "";
            populateSelectElement(data.profiles);
            let i = 0
            for (const [key, obj] of Object.entries(data.profiles)) {
                if (key === data.selectedIndex) {
                    selectElement.selectedIndex = i;
                    break;
                }
                i++;
            }
            
            respondSuccessOrFailure("success", "Success");
        } else {
            const requiredKeys = ["1", "2", "3", "5"];
            if (requiredKeys.every(key => key in data)) {
                const profile = {
                    "1": {
                        name: "Default", 
                        uuid: localStorage.getItem("uuid") ?? crypto.randomUUID()
                    }
                };
                const summonData = { "1": data }
                localStorage.setItem("nextIndex", 2);
                localStorage.setItem("selectedIndex", 1);
                localStorage.setItem("profiles", JSON.stringify(profile));
                localStorage.setItem("summonData", JSON.stringify(summonData));

                selectElement.innerHTML = "";
                populateSelectElement(data.profiles);
                selectElement.selectedIndex = 0;

                respondSuccessOrFailure("success", "Success");
            } else {
                respondSuccessOrFailure("failure", "Invalid JSON");
            }
        }
    })

    reader.readAsText(file);
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

// populate profiles
const selectElement = document.querySelector(".dropdown-button");
const profiles = JSON.parse(localStorage.getItem("profiles"));

function populateSelectElement(profiles) {
    let i = 0
    for (const [key, obj] of Object.entries(profiles)) {
        const option = document.createElement("option");
        option.text = obj.name;
        option.value = key;
        selectElement.add(option);
        if (key === localStorage.getItem("selectedIndex")) {
            selectElement.selectedIndex = i;
        }
        i++;
    }
}
populateSelectElement(profiles);


// create new profile
const deleteProfile = document.querySelector(".delete-profile");
const createProfile = document.querySelector(".create-profile");
const createProfileOverlay = document.querySelector(".js-create-profile-overlay");

createProfile.addEventListener("click", () => {
    createProfileOverlay.classList.add("visible");
});

createProfileOverlay.addEventListener("click", (event) => {
    if (event.target.classList[0] === "overlay") {
        createProfileOverlay.classList.remove("visible");
    }
});

const actualCreateProfile = document.querySelector(".actual-create-profile");
const summonData = JSON.parse(localStorage.getItem("summonData"));
actualCreateProfile.addEventListener("click", () => {
    const option = document.createElement("option");
    option.text = document.querySelector(".input-profile-name").value;
    option.value = localStorage.getItem("nextIndex");
    localStorage.setItem("nextIndex", parseInt(option.value) + 1);
    selectElement.add(option);

    deleteProfile.style.display = "inline-block";
    createProfileOverlay.classList.remove("visible");

    // add new profile to local storage
    profiles[option.value] = {
        name: option.text,
        uuid: crypto.randomUUID()
    }
    localStorage.setItem("profiles", JSON.stringify(profiles));

    summonData[option.value] = {
        1: { // Beginner banner
			pity6: 0,
			pity5: 0,
			history: [],
		},
		2: { // Standard banner
			pity6: 0,
			pity5: 0,
			history: [],
		},
		3: { // Limited banner
			isGuaranteed: false,
			pity6: 0,
			pity5: 0,
			history: [],
		},
		5: { // Golden thread banner
			pity6: 0,
			pity5: 0,
			history: [],
		}
    }
    localStorage.setItem("summonData", JSON.stringify(summonData));
});

// delete profile
const deleteProfileOverlay = document.querySelector(".js-delete-profile-overlay");
deleteProfile.addEventListener("click", () => {
    document.querySelector(".js-selected-profile").innerHTML = profiles[selectElement.value].name;
    deleteProfileOverlay.classList.add("visible");
});

deleteProfileOverlay.addEventListener("click", (event) => {
    if (event.target.classList[0] === "overlay") {
        deleteProfileOverlay.classList.remove("visible");
    }
});
document.querySelector(".cancel").addEventListener("click", () => {
    deleteProfileOverlay.classList.remove("visible");
});

document.querySelector(".actual-delete-profile").addEventListener("click", () => {
    const selected = selectElement.value;

    for (let i = 0; i < selectElement.length; i++) {
        if (selectElement.options[i].value === selected) {
            selectElement.remove(i);
            break;
        }
    }
    
    localStorage.setItem("selectedIndex", selectElement.value);

    if (selectElement.length === 1) {
        deleteProfile.style.display = "none";
    }

    delete profiles[selected];
    delete summonData[selected];
    localStorage.setItem("profiles", JSON.stringify(profiles));
    localStorage.setItem("summonData", JSON.stringify(summonData));

    deleteProfileOverlay.classList.remove("visible");
})

selectElement.addEventListener("change", () => {
    localStorage.setItem("selectedIndex", selectElement.value);
})

if (selectElement.length === 1) {
    deleteProfile.style.display = "none";
}

// rename profile
const renameProfile = document.querySelector(".rename-button");
const renameProfileOverlay = document.querySelector(".js-rename-profile-overlay");
renameProfile.addEventListener("click", () => {
    renameProfileOverlay.classList.add("visible");
});

renameProfileOverlay.addEventListener("click", (event) => {
    if (event.target.classList[0] === "overlay") {
        renameProfileOverlay.classList.remove("visible");
    }
});

const actualRenameProfile = document.querySelector(".actual-rename-profile");
actualRenameProfile.addEventListener("click", () => {
    const selected = selectElement.value;
    const newName = document.querySelector(".rename-profile").value
    profiles[selectElement.value].name = newName;
    localStorage.setItem("profiles", JSON.stringify(profiles));

    for (let i = 0; i < selectElement.length; i++) {
        if (selectElement.options[i].value === selected) {
            selectElement.options[i].text = newName;
            break;
        }
    }

    renameProfileOverlay.classList.remove("visible");
});