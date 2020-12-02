import {html, render} from 'lit-html'

export class InputNumber extends HTMLElement {
    constructor() {
        super()
        this.el = {"input": null}
        let input = this.querySelector('input') ||
            html`<input type="number" value="0">`
        this.template = html`
            ${input}
            <pkt-button-group>
                <pkt-button-square el="up"
                    @click=${(e) => this.el.input.stepUp()}
                    @mousedown=${(e) => this.fast_up_start()}
                    @mouseup=${(e) => {this.interval_stop()}}>
                +</pkt-button-square>
                <pkt-button-square el="down"
                    @click=${(e) => this.el.input.stepDown()}
                    @mousedown=${(e) => this.fast_down_start()}
                    @mouseup=${(e) => {this.interval_stop()}}>
                -</pkt-button-square>
            </pkt-button-group>
        `
    }

    render() {
        render(this.template, this)
    }

    connectedCallback() {
        this.render()
        this.el.input = this.querySelector('input')
        if (!this.el.input.value) {
            this.el.input.value = this.el.input.getAttribute("min") || "0"
        }
    }

    fast_up_start() {
        this.timeout = setTimeout(() => {
            this.interval = setInterval(() => {
                this.el.input.stepUp()
            }, 100)
        }, 700)
    }

    fast_down_start() {
        this.timeout = setTimeout(() => {
            this.interval = setInterval(() => {
                this.el.input.stepDown()
            }, 100)
        }, 700)
    }

    interval_stop() {
        clearTimeout(this.timeout)
        clearInterval(this.interval)
    }
}
