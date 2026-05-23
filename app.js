// Define colors for drop down list
colors = [
    "red",
    "green",
    "blue",
    "yellow",
    "orange",
    "cyan",
    "teal",
    "brown",
    "beige",
    "gray"
]

// Get reference to HTML elements
const input = document.getElementById("colorInput");
const display = document.getElementById("display");
const hueSlider = document.getElementById("hueSlider");
const dropdown = document.getElementById("dropdown");
const rgbValue = document.getElementById("rgbValue");
const hexValue = document.getElementById("hexValue");
const hslValue = document.getElementById("hslValue");


function rgbToHex(rgbString) {
    const rgbValuesString = rgbString.replace("rgb(", "").replace(")", "");
    const rgbStrings = rgbValuesString.split(",");
    let hexString = "#";
    rgbStrings.forEach(function(value){
        const rgbNum = parseInt(value.trim(), 10);
        // convert rgb int to base 16 number representation of string
        const hexNum = rgbNum.toString(16);
        // ensure substring is two digits before adding to main string
        hexString += hexNum.padStart(2, "0");
    });
    return hexString;
}

function setColorDisplay(userInput) {
    display.style.backgroundColor = userInput;
    const displayColorRGB = getComputedStyle(display).backgroundColor;
    rgbValue.textContent = displayColorRGB;
    hexValue.textContent = rgbToHex(displayColorRGB);
}

function populateDropdown(colorList) {
    colorList.forEach(function(color) {
        // create element and attach to eventlistener
        const dropdownItem = document.createElement("div");
        dropdownItem.textContent = color;
        dropdownItem.addEventListener("click", function() {
            input.value = color;
            setColorDisplay(color);
            dropdown.innerHTML = "";
        });
        dropdown.appendChild(dropdownItem);
    });
}
function setDropDown(userInput) {
    dropdown.innerHTML = "";
   
     // Filter array to match user input
    const matchedColors = colors.filter(function(value) {
        return value.includes(userInput);
    });
    populateDropdown(matchedColors);
}

input.addEventListener("input", function() {
    const userInput = input.value;
    setDropDown(userInput);
    setColorDisplay(userInput);
})

hueSlider.addEventListener("input", function() {
    const userInput = hueSlider.value;
    const hslString = `hsl(${userInput}, 100%, 50%)`;
    setColorDisplay(hslString);
    hslValue.textContent = hslString;
})