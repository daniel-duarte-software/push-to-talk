"use strict";

const processAudioUpload = require('audio_upload');

jest.mock("body_parser", () => {
    return (uploadDir, req) => Promise.resolve({
        fileType: req.fileType,
        data: { path: `some_file_dir/${uploadDir}` }
    });
});

test("audio upload returns the correct response from a valid request", async () => {

    const currentTime = 1234567890;
    window.Date = jest.fn().mockImplementation(() => ({
        getTime: jest.fn(() => currentTime)
    }));

    const uploadDir = "some dir";
    const request = { fileType: "foo" };
    const response = {
        writeHead: jest.fn(),
        write: jest.fn(),
        end: jest.fn()
    };

    await processAudioUpload(uploadDir, request, response);

    const url = `${uploadDir}/${currentTime}.${request.fileType}`;
    const responseObj = JSON.stringify({ url });

    expect(response.writeHead).toHaveBeenCalledWith(expect.any(Number), expect.any(Object));
    expect(response.write).toHaveBeenCalledWith(responseObj);
    expect(response.end).toHaveBeenCalled();
});
