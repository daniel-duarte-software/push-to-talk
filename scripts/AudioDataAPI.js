"use strict";

export const AUDIO_DATA_API_EVENTS = {
    'saved': 'audio-data-api-saved',
};

export class AudioDataAPI {

    save(url, params) {

        const body = this.formDataFromObject(params);
        const options = { method: 'POST', body };
        window.fetch(url, options).then(this.onSaveResponse.bind(this));
    }

    formDataFromObject(obj) {

        const formData = new FormData();
        Object.entries(obj).forEach(([key, value]) => {
            formData.append(key, value);
        });
        return formData;
    }

    onSaveResponse(response) {

        if (response.status === 200) {
            response.json().then(this.processSaveResponse.bind(this));
        }
    }

    processSaveResponse(result) {

        const event = new CustomEvent(AUDIO_DATA_API_EVENTS.saved, { detail: result });
        document.dispatchEvent(event);
    }
}
