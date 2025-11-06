const rgbaToHex = (r, g, b, a = 1, incluirAlpha = false) => {
    const toHex = (c) => {
        let hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    const red = toHex(Math.min(255, Math.max(0, Math.round(r))));
    const green = toHex(Math.min(255, Math.max(0, Math.round(g))));
    const blue = toHex(Math.min(255, Math.max(0, Math.round(b))));

    let hexString = red + green + blue;

    if (incluirAlpha) {
        const alpha255 = Math.min(255, Math.max(0, Math.round(a * 255)));
        hexString += toHex(alpha255);
    }

    return parseInt(hexString, 16);
};