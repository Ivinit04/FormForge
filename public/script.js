// JavaScript code for the Cloze Question Form

// Input elements
const sentenceInput = document.getElementById("sentence");
const underlineInput = document.getElementById("underline");
const underlinedWords = document.getElementById("underlined-words");
const optionsInput = document.getElementById("options");
const optionsList = document.getElementById("options-list");
const previewSentence = document.getElementById("preview-sentence");

// Form element
const clozeForm = document.getElementById("cloze-form");

// Track underlined words and options
const underlinedWordsArray = [];
const optionsArray = [];

// Update the preview sentence
const updatePreview = () => {
    let preview = sentenceInput.value;

    underlinedWordsArray.forEach((word) => {
        preview = preview.replace(new RegExp(word, "g"), "_____");
    });

    previewSentence.innerText = preview;
};

// Update the hidden input fields with underlined words and options
const updateHiddenFields = () => {
    document.getElementById("underlined-words-input").value = JSON.stringify(underlinedWordsArray);
    document.getElementById("options-input").value = JSON.stringify(optionsArray);
    document.getElementById("preview-input").value = previewSentence.innerText;
};


// Add underlined word
underlineInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter" && underlineInput.value.trim() !== "") {
        underlinedWordsArray.push(underlineInput.value);
        underlineInput.value = "";
        underlinedWords.innerText = underlinedWordsArray.join(", ");
        underlineInput.required = false; // Remove the "required" attribute after the first word is entered
        updatePreview();
        updateHiddenFields(); // Update hidden fields
    }
});

// Add option
optionsInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter" && optionsInput.value.trim() !== "") {
        optionsArray.push(optionsInput.value);
        optionsInput.value = "";
        optionsInput.required = false; // Remove the "required" attribute after the first option is entered
        updateOptionsList();
        updateHiddenFields(); // Update hidden fields
    }
});

// Update the list of options
const updateOptionsList = () => {
    optionsList.innerHTML = "";
    optionsArray.forEach((option, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            ${option}
            <span class="drag-icon" draggable="true" data-index="${index}">&#9776;</span>
        `;
        optionsList.appendChild(listItem);
    });
};

// Prevent form submission when "Enter" key is pressed in input fields
clozeForm.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.target === sentenceInput || event.target === underlineInput || event.target === optionsInput)) {
        event.preventDefault(); // Prevent form submission
    }
});

// Initial setup
updateOptionsList();
updatePreview();
