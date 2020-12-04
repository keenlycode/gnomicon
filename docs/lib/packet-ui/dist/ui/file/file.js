import {html, render} from 'lit-html'

export class File extends HTMLElement{
    constructor() {
        super()
        let button = this.querySelector('[el="button"]') ||
            html `<button el="button">File</button>`
        let input = this.querySelector('input[type="file"]') ||
            html `<input type="file" name="file">`
        this.template = html `
            ${button}
            ${input}
        `
    }

    render() {
        render(this.template, this)
    }

    connectedCallback() {
        this.render()
        this.querySelector('[el="button"]').addEventListener('click', () => {
            this.querySelector('input[type="file"]').click()
        })
    }
}
