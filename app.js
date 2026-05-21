// Get reference to HTML elements
const input = document.getElementById("colorInput");
const display = document.getElementById("display");

const rgbValue = document.getElementById("rgbValue");
const hexValue = document.getElementById("hexValue");

function rgbToHex(rgbString) {
    const strippedString = rgbString.replace("rgb(", "").replace(")", "");
    const numberStrings = strippedString.split(",");
    let hexString = "#";
    numberStrings.forEach(function(value){
        const num = parseInt(value.trim(), 10);
        hexString += num.toString(16).padStart(2, "0");
    });
    return hexString;
}

input.addEventListener("input", function() {
    display.style.backgroundColor = input.value;

    // get computed color (browser resolves it)
    const computed = getComputedStyle(display).backgroundColor;
    rgbValue.textContent = computed;
    hexValue.textContent = rgbToHex(computed);
})