/*
 *  Licence: MIT
 *
 *  Copyright 2022 hidao80
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Multilingualization library class
 *
 * @class Multilingualization
 */
export default class Multilingualization {
    /**
     *  @var dictionaries Multilingual dictionary object
     */
    static dictionaries = {
        "en": {
            "title": "QR code Wi-Fi setup for Windows",
            "dialog-msg": "Double-click the downloaded batch file to run it.",
            "dialog-ok": "OK"
        },
        "ja": {
            "title": "QRコードWi-Fiセットアップ Windows版",
            "dialog-msg": "ダウンロードしたバッチファイルをダブルクリックして実行してください。",
            "dialog-ok": "OK"
        }
    }

    /**
     * Get current language
     *
     * @returns {string} Current language
     */
    static language() {
        const w =  window.navigator;
        const lang = ((w.languages && w.languages[0]) ||
            w.language ||
            w.userLanguage ||
            w.browserLanguage).slice(0, 2);

        // Show English for undefined languages
        return this.dictionaries[lang] ? lang : "en";
    }

    /**
     * Get translated term
     *
     * @param {string} term Term to be translated
     * @returns {string} Translated term
     */
    static translate(term) {
        return this.dictionaries[this.language()][term];
    }

    /**
     * Initialization of dictionary object
     */
    static translateAll() {
        const dictionary = this.dictionaries[this.language()];
        for (let elem of document.querySelectorAll('[data-translate]')) {
            elem.innerHTML = dictionary[elem.dataset.translate];
        }
    }
}
