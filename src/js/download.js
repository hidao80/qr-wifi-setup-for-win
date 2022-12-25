/**
 * Convert string to array
 *
 * @param {string} str String to be converted to an array
 * @returns {Uint8Array} array of bytes
 */
function stringToArray(str) {
    let array = [];
    for (let i = 0; i < str.length; i++) {
        array.push(str.charCodeAt(i));
    }
    return array;
};

/**
 * Download file
 *
 * @param {string} content
 * @param {string} contentType
 * @param {string} downloadFileName
 */
export function downloadFile(content, contentType, downloadFileName) {
    // Creating Anchor Tags
    const downLoadLink = document.createElement("a");

    // Generate HTML text to download
    const outputData = stringToArray(content);  // Pass byte strings as they are
    downLoadLink.download = downloadFileName;
    downLoadLink.href = URL.createObjectURL(new Blob([new Uint8Array(outputData)], { type: contentType }));
    downLoadLink.dataset.downloadurl = [contentType, downloadFileName, downLoadLink.href].join(":");
    downLoadLink.click();
//    downLoadLink.remove();
}
