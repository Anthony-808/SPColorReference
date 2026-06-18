// Constants
const HUE_RED_SECTOR = 0;
const HUE_GREEN_SECTOR = 2;
const HUE_BLUE_SECTOR = 4;

export function parseRGB(rgbString) {
    const rgbValuesString = rgbString.replace("rgb(", "").replace(")", "");
    const rgbValuesArray = rgbValuesString.split(",");
    return rgbValuesArray.map(function(stringValue) {
        return parseInt(stringValue.trim(), 10);
    });
}

export function rgbToHex(rgbString) {
    const rgbStrings = parseRGB(rgbString);
    let hexString = "#";
    rgbStrings.forEach(function(value){
        // convert rgb int to base 16 number representation of string
        const hexNum = value.toString(16);
        // ensure substring is two digits before adding to main string
        hexString += hexNum.padStart(2, "0");
    });
    return hexString;
}

export function rgbToHsl(rgbString){
    let [r, g, b] = parseRGB(rgbString);
    r /= 255;
    g /= 255;
    b /= 255;
 
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    const delta = max - min;

    // LIGHTNESS
    // L from HSL (lightness - how black or white)
    let l = (max + min) / 2; // incorporates both magnitude of values and the difference between them

    // SATURATION
    let zeroCenteredL = 2 * l - 1; // rescaled from 0 -> 1 to -1 -> 1
    let distanceFromMidLightness = Math.abs(zeroCenteredL);
    let distanceFromExtremeLightness = 1 - distanceFromMidLightness;

    let s = 0;
    if (delta != 0) {
        // How much of the color can exists due to the absence of extreme lightness
        s = delta / distanceFromExtremeLightness;
    }

    let h = 0;
    if (delta !== 0) {
        let hueSegment;

        // Determine where color is within color sector, the shift to correct sector
        if (max === r) {
            hueSegment = (g - b) / delta + HUE_RED_SECTOR;
        } else if (max === g) {
            hueSegment = (b - r) / delta + HUE_GREEN_SECTOR;
        } else {
            hueSegment = (r - g) / delta + HUE_BLUE_SECTOR;
        }

        // converts sector units 0 - 6 scale to degrees 0 to 360
        h = hueSegment * 60;

        // convert negative degree into positives
        if (h < 0) {
            h += 360;
        }
    }

    return { h, s, l };
}

export function hslToRgb(h, s, l) {
    h /= 360;
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}
