const pKatakana = "[\\u30A1-\\u30FA\\u30FD-\\u30FF\\u31F0-\\u31FF\\u32D0-\\u32FE\\u3300-\\u3357\\uFF66-\\uFF6F\\uFF71-\\uFF9D]|\\uD82C\\uDC00";


export const removeSpecialChars = function (str) {
    return str.replace(/[^0-9]/g, "")
}
export const sanitizeAddressString = function (str) {
    return str.replace(/[^A-Za-z0-9 _.,/]*/g, "")
}

export const isFullWidth =  function (str){
    const rxx = new RegExp(/^[ァ-ン]+$/);
    return rxx.test(str);
}

export const isKataKana = function (str){
    const rx = new RegExp("^([\\w-]|" + pKatakana+")+$");
    return rx.test(str);
}