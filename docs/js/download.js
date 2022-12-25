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
    // Remove existing download links.
    document.getElementById('#auto_generated_download_link_6e459a0d6f82ac2ae872709097eaf35c')?.remove();;

    // Creating Anchor Tags
    const downLoadLink = document.createElement("a");
    downLoadLink.id = "auto_generated_download_link_6e459a0d6f82ac2ae872709097eaf35c";

    // Generate HTML text to download
    const outputData = stringToArray(content);  // Pass byte strings as they are
    downLoadLink.download = downloadFileName;
    downLoadLink.href = URL.createObjectURL(new Blob([new Uint8Array(outputData)], { type: contentType }));
    downLoadLink.dataset.downloadurl = [contentType, downloadFileName, downLoadLink.href].join(":");
    downLoadLink.click();
}
