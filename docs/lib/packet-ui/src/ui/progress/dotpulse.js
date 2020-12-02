import {html, render} from 'lit-html'

export class DotPulse extends HTMLElement {
    constructor() {
        super()
        this.template = html`
            <div data-id="p1"></div>
            <div data-id="p2"></div>
            <div data-id="p3"></div>
        `
    }

    render() {
        render(this.template, this)
    }

    connectedCallback() {
        this.render()
    }
}