import {html, render} from 'lit-html'

export class Checkbox extends HTMLElement {
    constructor() {
        super()
        let checkbox = this.querySelector('input[type="checkbox"]') ||
            html `<input type="checkbox">`
        this.template = html`
            ${checkbox}
            <span></span>
        `
    }

    render() {
        render(this.template, this)
    }

    connectedCallback() {
        this.render()
    }
}
