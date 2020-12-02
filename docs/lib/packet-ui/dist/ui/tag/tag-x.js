import {html, render} from 'lit-html'

export class TagX extends HTMLElement {
    constructor() {
        super()
        this.template = (text) => html`
            <span>${text}</span>
            <pkt-icon theme="adwaita" name="window-close"
                @click=${( () => {this.remove()} )}
            ></pkt-icon>
        `
    }

    render() {
        render(this.template(this.innerText), this)
    }

    connectedCallback() {
        this.render()
    }

    remove() {
        this.dispatchEvent(new Event('remove'))
        this.parentNode.removeChild(this)
    }
}
