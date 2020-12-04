import {svg, render} from 'lit-html'

export class Spinner extends HTMLElement {
    constructor() {
        super()
        this.template = svg`
            <svg viewBox="25 25 50 50">
                <circle cx="50" cy="50" r="20" stroke-miterlimit="10"/>
            </svg>
        `
    }

    render() {
        render(this.template, this)
    }

    connectedCallback() {
        this.render()
    }
}