import {html, render} from 'lit-html'

export class ProgressBar extends HTMLElement {
    static get observedAttributes() {
        return ['value']
    }
    constructor() {
        super()
        this.template = html`<div class="loop"></div>`
    }

    render() {
        render(this.template, this)
    }

    connectedCallback() {
        this.render()
    }

    attributeChangedCallback(name, old_value, new_value) {
        if (name === "value") {
            this.template = html`
                <div class="value" style="width: ${new_value}"></div>
            `
            this.render()
        }
    }
}