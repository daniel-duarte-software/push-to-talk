"use strict";

import { AudioPlayer } from "./AudioPlayer.js";
import { AudioRecorder, AUDIO_RECORDER_EVENTS } from "./AudioRecorder.js";
import { AudioDataAPI, AUDIO_DATA_API_EVENTS } from "./AudioDataAPI.js";
import { AudioRecordButton, AUDIO_RECORD_BUTTON_EVENTS } from "./AudioRecordButton.js";

document.addEventListener("DOMContentLoaded", () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {

        const audioPlayer = new AudioPlayer();
        const audioDataAPI = new AudioDataAPI();
        const audioRecorder = new AudioRecorder(stream, {
            mimeType: "audio/webm"
        });
        const audioRecordButton = new AudioRecordButton({
            textPrompt: "Hold Down to Record Audio",
            onRecordClassNames: ["record-button--animating"],
        });

        const audioPlayerElement = audioPlayer.element();
        audioPlayerElement.classList.add("centered-block");

        const audioRecordButtonElement = audioRecordButton.element();
        audioRecordButtonElement.classList.add("centered-block", "record-button", "rounded");

        const appElement = document.getElementById("app");
        appElement.appendChild(audioRecordButtonElement);
        appElement.appendChild(audioPlayerElement);

        document.addEventListener(AUDIO_RECORD_BUTTON_EVENTS.start, () => {
            audioRecorder.start();
        });

        document.addEventListener(AUDIO_RECORD_BUTTON_EVENTS.end, () => {
            audioRecorder.stop();
        });

        document.addEventListener(AUDIO_RECORDER_EVENTS.processed, (e) => {
            audioDataAPI.save("//localhost:3000/audio_upload", {
                fileType: 'webm',
                data: e.detail,
            });
        });

        document.addEventListener(AUDIO_DATA_API_EVENTS.saved, (e) => {
            const { url } = e.detail;
            audioPlayer.load(url);
        });
    });
});
