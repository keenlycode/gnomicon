export class Menu extends HTMLElement {
    constructor() {
        super()
        let caret = document.createElement('i')
        let a_items = this.querySelectorAll('a')
        caret.classList.add('caret')
        for(let item of a_items) {
            item.addEventListener('click', (event) => {this.click(event)})
            if (item.parentElement.querySelector('ul')) {
                item.appendChild(caret.cloneNode(true))
            }
        }
    }

    click(event) {
        let a = event.currentTarget
        if(a.classList.contains('on')) {
            this._hide(a.parentElement)
        } else {
            this._show(a.parentElement)
        }
    }

    _hide(li) {
        for(let a of li.querySelectorAll('a')) {
            a.classList.remove('on')
            let ul = a.parentElement.querySelector('ul')
            if(!ul) {continue}
            ul.style.height = ul.scrollHeight
            // setTimeout to create height transition.
            setTimeout(function (ul) {
                ul.style.height = 0
            }, 0, ul)
        }
    }

    _show(li) {
        let a = li.querySelector('a')
        a.classList.add('on')
        let ul = a.closest('ul, pkt-menu')
        ul.style.height = 'auto';
        ul = li.querySelector('ul')
        if(!ul) {return}
        ul.style.height = ul.scrollHeight
    }
}