import {downloadFile} from "./download.js";
import m17n from "./multilingaliztion.js";
import "./jsQR.js";

/**
 * Processing to be performed at the timing immediately after reading the HTML of the web page to the end.
 */
function onload() {
    m17n.translateAll();

    const video = $$("video");
    const canvasElement = $$("canvas");
    const canvas = canvasElement.getContext("2d");
    const beep = new Audio('sound/beep.mp3');

    // Use facingMode: environment to attemt to get the front camera on phones
    navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then(function (stream) {
            video.srcObject = stream;
            video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
            video.play();
            setInterval(tick, 1_000);
        });

    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvasElement.hidden = true;
            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;

            // Drawing the contents of the video element being captured by the camera onto the canvas element
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

            // Obtain a QR code from the image on the canvas
            const imageData = canvas.getImageData(0, 0,canvasElement.width,canvasElement.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            // If you can read the QR code from the image
            if (code) {
                // If a dialog is open, close it.
                $$('button').click();

                // QR code format: `WIFI:T:WPA;S:${essid};P:${password};;`;
                const ssid = code.data.match(/S:(?<ssid>\w+);/)[1];
                const password = code.data.match(/P:(?<password>\w+);/)[1];
                console.debug(code.data);
                console.debug(ssid);
                console.debug(password);

                if (ssid && password) {
                    // Sound effects
                    beep.play();

                    // Generate batch files
                    const content = createBatchFile(ssid, password);

                    // Download the batch file
                    downloadFile(content, 'text/plain', "wifi_setup_" + ssid + ".bat");

                    // open usage dialog.
                    $$('dialog').showModal();
                }
            }
        }
    }
}

// Event when the HTML of a web page is read to the end.
document.addEventListener("DOMContentLoaded", onload );

/**
 * Fake jQrery object
 * @param {*} selector
 * @returns {Node|Array<Node>|undefined}
 */
function $$(selector) {
    const elems = document.querySelectorAll(selector);
    if (elems?.length > 1) {
        return elems;
    } else if (elems.length == 1) {
        return elems[0];
    } else {
        return undefined;
    }
}

/**
 * Generate batch file to configure Wifi settings
 * @param {string} ssid
 * @param {string} password
 * @returns  {string} batch file content
 */
function createBatchFile(ssid, password) {
    return `
@echo off

set SSID=${ssid}
set PASSWD=${password}
set CONFIG_FILE=Wi-Fi_config_tmp.xml

setlocal EnableDelayedExpansion
set /p "=%SSID%" <NUL> chr.tmp
for %%a in (chr.tmp) do fsutil file createnew zero.tmp %%~Za > NUL
set "hex="
for /F "skip=1 tokens=2" %%a in ('fc /B chr.tmp zero.tmp') do set "hex=!hex!%%a"
del chr.tmp zero.tmp

(
echo ^<?xml version=^"1.0^"?^>
echo ^<WLANProfile xmlns="http://www.microsoft.com/networking/WLAN/profile/v1"^>
echo 	^<name^>%SSID%^</name^>
echo 	^<SSIDConfig^>
echo 		^<SSID^>
echo 			^<hex^>%hex%^</hex^>
echo 			^<name^>%SSID%^</name^>
echo 		^</SSID^>
echo 	^</SSIDConfig^>
echo 	^<connectionType^>ESS^</connectionType^>
echo 	^<connectionMode^>auto^</connectionMode^>
echo 	^<MSM^>
echo 		^<security^>
echo 			^<authEncryption^>
echo 				^<authentication^>WPA2PSK^</authentication^>
echo 				^<encryption^>AES^</encryption^>
echo 				^<useOneX^>false^</useOneX^>
echo 			^</authEncryption^>
echo 			^<sharedKey^>
echo 				^<keyType^>passPhrase^</keyType^>
echo 				^<protected^>false^</protected^>
echo 				^<keyMaterial^>%PASSWD%^</keyMaterial^>
echo 			^</sharedKey^>
echo 		^</security^>
echo 	^</MSM^>
echo 	^<MacRandomization xmlns="http://www.microsoft.com/networking/WLAN/profile/v3"^>
echo 		^<enableRandomization^>false^</enableRandomization^>
echo 	^</MacRandomization^>
echo ^</WLANProfile^>
) > %CONFIG_FILE%

endlocal

netsh wlan add profile filename=%CONFIG_FILE% user=all
netsh wlan set profileparameter name=%SSID% nonBroadcast=yes keymaterial=%PASSWD%

del %CONFIG_FILE% hex.bat
`;
}
