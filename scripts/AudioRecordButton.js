"use strict";

export const AUDIO_RECORD_BUTTON_EVENTS = {
    'start': 'record-button-start',
    'end': 'record-button-end',
};

export class AudioRecordButton {

    constructor({ textPrompt, onRecordClassNames }) {

        this.textPrompt = textPrompt;
        this.onRecordClassNames = onRecordClassNames;

        this.button = document.createElement('button');
        this.button.addEventListener("touchstart", this.startRecording.bind(this));
        this.button.addEventListener("touchmove", this.onRecordButtonTouchMoved.bind(this));
        this.button.addEventListener("touchcancel", this.stopRecording.bind(this));
        this.button.addEventListener("touchend", this.stopRecording.bind(this));
        this.button.addEventListener("mousedown", this.startRecording.bind(this));
        this.button.addEventListener("mouseup", this.stopRecording.bind(this));
        this.button.addEventListener("mouseleave", this.stopRecording.bind(this));

        this.setStopRecordingState();
    }

    startRecording(e) {
        e.preventDefault();
        this.executeAudioActionIf(!this.isRecording, 'setStartRecordingState', AUDIO_RECORD_BUTTON_EVENTS.start)
    }

    stopRecording(e) {
        e.preventDefault();
        this.executeAudioActionIf(this.isRecording, 'setStopRecordingState', AUDIO_RECORD_BUTTON_EVENTS.end)
    }

    executeAudioActionIf(condition, actionName, eventToFire) {

        if (condition) {
            this[actionName]();
            const event = new CustomEvent(eventToFire);
            document.dispatchEvent(event);
        }
    }

    onRecordButtonTouchMoved(e) {
        e.preventDefault();

        const { pageX, pageY } = e.touches[0];
        const touchElement = document.elementFromPoint(pageX, pageY);
        if (this.button !== touchElement) {
            this.stopRecording(e);
        }
    }

    setStartRecordingState() {
        this.setRecordingState({ isRecording: true, textPrompt: "", classFunc: 'add' });
    }

    setStopRecordingState() {
        this.setRecordingState({ isRecording: false, textPrompt: this.textPrompt, classFunc: 'remove' });
    }

    setRecordingState({ isRecording, textPrompt, classFunc }) {

        this.isRecording = isRecording;
        this.button.innerHTML = textPrompt;
        this.button.classList[classFunc](...this.onRecordClassNames);
    }

    element() {
        return this.button;
    }
}
