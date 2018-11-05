"use strict";

const { AudioRecorder, AUDIO_RECORDER_EVENTS } = require("AudioRecorder");

describe("AudioRecorder", () => {

    afterEach(() => {
        window.MediaRecorder.mockRestore();
    })

    it("initializes a MediaRecorder with the correct arguments", () => {

        window.MediaRecorder = jest.fn().mockImplementation();

        const steam = { a: "media stream" };
        const options = { some: "options" };
        new AudioRecorder(steam, options);

        expect(window.MediaRecorder).toHaveBeenCalledWith(steam, options);
    });

    it("starts recording the MediaRecorder", () => {
        expectMediaRecorderAction("start");
    });

    it("stops recording the MediaRecorder", () => {
        expectMediaRecorderAction("stop");
    });

    it("dispatches the correct event when recording is stopped", () => {

        jest.spyOn(document, 'dispatchEvent');

        const audioData = "audio data"
        window.MediaRecorder = jest.fn().mockImplementation(() => ({
            state: 'inactive',
            stop: function() {
                this.ondataavailable({
                    target: { state: "inactive" },
                    data: audioData,
                });
            }
        }));

        new AudioRecorder().stop();

        expect(document.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({
            type: AUDIO_RECORDER_EVENTS.processed,
            detail: audioData
        }));
    });

    function expectMediaRecorderAction(actionName) {

        const MediaRecorderMock = { [actionName]: jest.fn() };
        window.MediaRecorder = jest.fn().mockImplementation(() => MediaRecorderMock);

        new AudioRecorder()[actionName]();

        expect(MediaRecorderMock[actionName]).toHaveBeenCalled();
    }
});
