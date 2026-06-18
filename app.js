import * as cc from "./color-conversions.js";

// Global Variables
let colors = [];
let hoveringMarkerDropdown = false;
let hoveringMarker = false;

// HTML element references
const input = document.getElementById("colorInput");
const display = document.getElementById("display");
const searchDropdown = document.getElementById("dropdown");
const markerDropdown = document.getElementById("markerDropdown");
const rgbValue = document.getElementById("rgbValue");
const hexValue = document.getElementById("hexValue");
const hslValue = document.getElementById("hslValue");
const markerBar = document.getElementById("markerBar");


// Dropdown hover state - used to prevent dropdown lists from 
// changing or clearing while user is hovering.
markerDropdown.addEventListener("mouseenter", function () {
    hoveringMarkerDropdown = true;
});

markerDropdown.addEventListener("mouseleave", function () {
    hoveringMarkerDropdown = false;
});

// DOM helper
const queryElement = document.createElement("div");

// Function definitions
function sortByDistance(list, targetColor) {
    return list.sort((a, b) => // sort order: negative = a before b, positive = a after b
        Math.abs(a.position - targetColor.position)
        - Math.abs(b.position - targetColor.position)
    );
}

function getCloseColors(targetColor, maxDistance) {
    const results = [];
    for (const color of colors) {
        if (color === targetColor) continue;
        
        const distance = Math.abs(color.position - targetColor.position);

        if (distance < maxDistance) {
            results.push(color);
        }
    }
    return results;
}

// create hidden element and have browser determine its color
function resolveColor(colorName) {
    queryElement.style.color = colorName;
    document.body.appendChild(queryElement);
    const rgb = getComputedStyle(queryElement).color;
    document.body.removeChild(queryElement);
    return rgb;
}

function setColorDisplay(color) {
    display.style.backgroundColor = color.rgb;
    rgbValue.textContent = color.rgb;
    hexValue.textContent = color.hex;
    const hsl = color.hsl;
    hslValue.textContent = `${Math.round(hsl.h)}°, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%`;
}

function populateDropdown(colorList, dropdown) {
    dropdown.innerHTML = "";
    colorList.forEach(function (color) {
        // create dynamic element
        const dropdownItem = document.createElement("div");
        dropdownItem.classList.add("dropdownItem");
        dropdownItem.textContent = color.name;
        // add event listener to dynamic element
        dropdownItem.addEventListener("click", function () {
            input.value = color.name;
            setColorDisplay(color);
            dropdown.innerHTML = "";
        });
        dropdown.appendChild(dropdownItem);
    });
}

function setDropDown(userInput) {
    searchDropdown.innerHTML = "";
    // Filter array to match user input
    const startsWithMatches = colors.filter(function (value) {
        return value.name.startsWith(userInput);
    });
    const containsMatches = colors.filter(function (value) {
        return !value.name.startsWith(userInput) && value.name.includes(userInput);
    });
    const matchedColors = startsWithMatches.concat(containsMatches);
    populateDropdown(matchedColors.slice(0, 5), searchDropdown);
}

function renderMarkers() {
    markerBar.innerHTML = "";

    colors.forEach(function (color) {
        const marker = document.createElement("div");

        marker.classList.add("marker");

        marker.style.left = `${color.position * 100}%`;
        marker.style.backgroundColor = "rgba(125, 125, 125, 0.20)";
        marker.title = color.name;

        marker.addEventListener("click", function () {
            input.value = color.name;
            setColorDisplay(color);
        });

        marker.addEventListener("mouseenter", function () {
            hoveringMarker = true;
            const nearby = getCloseColors(color, 0.08);
            const sorted = sortByDistance(nearby, color);

            populateDropdown(sorted, markerDropdown);
        });

        marker.addEventListener("mouseleave", function () {
            hoveringMarker = false;
            setTimeout(function () {
                if (!hoveringMarkerDropdown && !hoveringMarker) {
                    markerDropdown.innerHTML = "";
                }
            }, 300);

        });

        markerBar.appendChild(marker);
    });
}

function handleInput() {
    const normalizedInput = input.value.toLowerCase();
    if (normalizedInput === "") {
        dropdown.innerHTML = "";
        display.style.backgroundColor = "grey";
        return;
    }
    const color = colors.find(c => c.name === normalizedInput);
    setDropDown(normalizedInput);
    setColorDisplay(color);
}

function initApp() {
    input.addEventListener("input", handleInput);
    renderMarkers();
}

// Load data
fetch("colors.json")
    .then(response => response.json())
    .then(data => {
        colors = data.map(function (colorName) {
            const rgb = resolveColor(colorName);
            const hex = cc.rgbToHex(rgb);
            const hsl = cc.rgbToHsl(rgb);
            return {
                name: colorName,
                rgb: rgb,
                hex: hex,
                hsl: hsl,
                position: hsl.h / 360
            };
        });
        initApp();
    });
