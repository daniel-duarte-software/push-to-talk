"use strict";

export const AUDIO_RECORDER_EVENTS = {
    'processed': 'audio-recorder-processed'
};

export class AudioRecorder {

    constructor(stream, options) {

        this.recorder = new MediaRecorder(stream, options);
        this.recorder.ondataavailable = (e) => {
            if (e.target.state === 'inactive') {
                this.onAudioDataRecorded(e.data);
            }
        };
    }
    
    start() {
        this.recorder.start();
    }

    stop() {
        this.recorder.stop();
    }

    onAudioDataRecorded(data) {

        const event = new CustomEvent(AUDIO_RECORDER_EVENTS.processed, { detail: data });
        document.dispatchEvent(event);
    }
}
