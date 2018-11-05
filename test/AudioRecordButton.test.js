"use strict";

const { JSDOM } = require('jsdom');
const { AudioRecordButton, AUDIO_RECORD_BUTTON_EVENTS } = require("AudioRecordButton");

describe("AudioRecordButton", () => {

    const body = window.document.body;
    const textPrompt = "some text";
    const onRecordClassNames = ["some-class"];

    beforeEach(() => {
        body.innerHTML = "";
    });

    it("shows the correct UI when rendered", () => {

        const [instance, element] = renderElement({ textPrompt, onRecordClassNames });
        expectUI(element, textPrompt, []);
    });

    it("shows the correct UI when recording is started and stopped", () => {

        const [instance, element] = renderElement({ textPrompt, onRecordClassNames });

        expectPreventDefaultAfterAction(instance, "startRecording");
        expectUI(element, "", onRecordClassNames);

        expectPreventDefaultAfterAction(instance, "stopRecording");
        expectUI(element, textPrompt, []);
    });

    it("dispatches the correct events when recording is started and stopped", () => {

        const [instance, _] = renderElement({ textPrompt: "", onRecordClassNames: [] });
        expectEventOnlyOnceForAction(instance, "startRecording", AUDIO_RECORD_BUTTON_EVENTS.start);
        expectEventOnlyOnceForAction(instance, "stopRecording", AUDIO_RECORD_BUTTON_EVENTS.end);
    });

    function expectEventOnlyOnceForAction(instance, actionName, expectedEventType) {

        expectEventDispatch(instance, actionName, expectedEventType, (event) => {
            expect(document.dispatchEvent).toHaveBeenCalledWith(event);
        });

        expectEventDispatch(instance, actionName, expectedEventType, (event) => {
            expect(document.dispatchEvent).not.toHaveBeenCalledWith(event);
        });
    }

    function expectEventDispatch(instance, actionName, expectedEventType, test) {

        const dispatchEventSpy = jest.spyOn(document, 'dispatchEvent');
        expectPreventDefaultAfterAction(instance, actionName);

        const event = expect.objectContaining({ type: expectedEventType });
        test(event);

        dispatchEventSpy.mockRestore();
    }

    function expectPreventDefaultAfterAction(instance, actionName) {

        const event = { preventDefault: jest.fn() };
        instance[actionName](event);
        expect(event.preventDefault).toHaveBeenCalled();
    }

    function expectUI(element, expectedInnerHTML, expectedClassNames) {

        const innerHTML = element.innerHTML;
        expect(innerHTML).toStrictEqual(expectedInnerHTML);

        const classList = [...element.classList];
        expect(classList).toStrictEqual(expectedClassNames);
    }

    function renderElement(params) {

        const instance = new AudioRecordButton(params);
        const element = instance.element();
        body.appendChild(element);
        const renderedElement = body.children[0];

        return [instance, renderedElement];
    }
});
