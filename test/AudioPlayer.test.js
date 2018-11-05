"use strict";

const { JSDOM } = require('jsdom');
const { AudioPlayer } = require("AudioPlayer");

describe("AudioPlayer", () => {

    const body = window.document.body;

    beforeEach(() => {
        body.innerHTML = "";
    });

    it("renders an audio element with controls", () => {

        const [_, element] = renderElement();
        expect(element.tagName).toStrictEqual("AUDIO");
        expect(element.hasAttribute("controls")).toBe(true);
    });

    it("loads a given audio URL", () => {

        const [instance, element] = renderElement();
        window.HTMLMediaElement.prototype.load = jest.fn();

        const audioURL = "some url";
        instance.load(audioURL);

        const sourceElement = element.querySelector("source");
        const sourceURL = sourceElement.getAttribute('src');
        expect(sourceURL).toStrictEqual(audioURL);
        expect(window.HTMLMediaElement.prototype.load).toBeCalled();
    });

    function renderElement() {

        const instance = new AudioPlayer();
        const element = instance.element();
        body.appendChild(element);
        const renderedElement = body.children[0];

        return [instance, renderedElement];
    }
});
