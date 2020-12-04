import {html, render} from 'lit-html'

export class Switch extends HTMLElement {
    constructor() {
        super()
        let checkbox = this.querySelector('input[type="checkbox"]') ||
            html`<input type="checkbox">`
        let label = this.querySelector('div[el="label"]') ||
            html`
                <div el="label">
                    <span>ON</span>
                    <span>OFF</span>
                </div>
            `
        this.template = html`
            ${checkbox}
            ${label}
            <div el="paddle"></div>
        `
    }

    render() {
        render(this.template, this)
    }

    connectedCallback() {
        this.render()
    }
}