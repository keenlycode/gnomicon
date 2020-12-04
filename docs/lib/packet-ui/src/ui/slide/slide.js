import {html, render} from 'lit-html'
import Siema from 'siema'

export class Slide extends HTMLElement {
    constructor() {
        super()
        this.el = {}
        this.el.slides = this.querySelectorAll('.slide')
        this.template = html`
            <div el="slide"
                @touchstart=${this.clear_interval}
                @click=${this.clear_interval}
                @dragstart=${this.clear_interval}
            >
                ${this.el.slides}
            </div>
            <div el="nav"></div>
        `
    }

    render() {
        render(this.template, this)
        this.el.slide = this.querySelector('[el="slide"]')
        this.el.nav = this.querySelector('[el="nav"]')
        if (!this.hasAttribute('manual')) {
            this.setup()
        }
    }

    connectedCallback() {
        this.render()
    }

    setup(opts={}) {
        let siema = {
            "selector": this.el.slide,
            "loop": true,
            "onChange": () => { this.on_change() },
            "duration": 300
        }
        for (let key in opts) siema[key] = opts[key];
        this.siema = new Siema(siema);
        for (let i = 0; i < this.el.slides.length; i++) {
            let dot = document.createElement('dot')
            dot.dataset.i = i
            this.el.nav.appendChild(dot)
            dot.addEventListener('click', (event) => {
                this.nav_click(event)
            })
        }
        this.el.dots = this.el.nav.querySelectorAll('dot')
        this.el.dots[0].classList.add('selected')
        this.set_interval()
    }

    nav_click(event) {
        let dot = event.currentTarget
        this.el.nav.querySelector('.selected').classList.remove('selected')
        dot.classList.add('selected')
        this.siema.goTo(dot.dataset.i)
        this.clear_interval()
    }

    on_change() {
        let i = this.siema.currentSlide
        this.el.nav.querySelector('.selected').classList.remove('selected')
        this.el.dots[i].classList.add('selected')
        this.dispatchEvent(new Event('change'))
    }

    set_interval() {
        this.interval = setInterval(() => {
            this.siema.next();
        }, 5000)
    }

    clear_interval() {
        clearInterval(this.interval)
    }
}