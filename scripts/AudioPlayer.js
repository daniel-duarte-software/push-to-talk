"use strict";

export class AudioPlayer {

    constructor() {

        this.audioElement = document.createElement('audio');
        this.audioElement.controls = true;

        this.sourceElement = document.createElement('source');
        this.audioElement.appendChild(this.sourceElement);
    }

    load(url) {

        this.sourceElement.setAttribute("src", url);
        this.audioElement.load();
    }

    element() {
        return this.audioElement;
    }
}
