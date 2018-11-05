"use strict";

const { AudioDataAPI, AUDIO_DATA_API_EVENTS } = require("AudioDataAPI");

describe("AudioDataAPI", () => {

    it("sends a save request with the correct arguments", () => {

        jest.spyOn(window.FormData.prototype, "append");
        window.fetch = jest.fn().mockImplementation(() => Promise.resolve());

        const audioDataAPI = new AudioDataAPI();
        audioDataAPI.onSaveResponse = jest.fn();

        const url = "service url";
        const params = { foo: "bar", some: "data" };
        audioDataAPI.save(url, params);

        for (const [key, value] of Object.entries(params)) {
            expect(window.FormData.prototype.append).toHaveBeenCalledWith(key, value);
        }

        expect(window.fetch).toHaveBeenCalledWith(url, expect.objectContaining({
            method: 'POST',
            body: expect.any(FormData)
        }));
    });

    it("dispatches the correct event after receiving a successful save response", (done) => {

        jest.spyOn(document, "dispatchEvent");

        const result = { foo: "bar" };
        new AudioDataAPI().onSaveResponse({
            status: 200,
            json: () => Promise.resolve(result),
        });

        setTimeout(() => {
            expect(document.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({
                type: AUDIO_DATA_API_EVENTS.saved,
                detail: result
            }));
            done();
        });
    });
});
