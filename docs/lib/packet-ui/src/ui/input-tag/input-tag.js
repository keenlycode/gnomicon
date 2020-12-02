export class InputTag extends HTMLElement {
    constructor() {
        super();
        this.el = {};
        this.el.input = document.createElement('input');
        this.appendChild(this.el.input);
        this.addEventListener('click', () => {
            this.el.input.focus();
        })
        this.el.input.addEventListener('keydown', (event) => {
            this.keydown(event);
        })
        this.el.input.addEventListener('blur', (event) => {
            this.blur();
        })
    }

    keydown(event) {
        if (event.key === ("Enter")) {
            this.add_tag(this.el.input.value.trim());
            this.el.input.value = '';
        } else if (event.key === "Backspace") {
            if (this.el.input.value.trim() === '') {
                this.el.input.previousSibling.remove();
            }
        }
    }

    blur() {
        this.add_tag(this.el.input.value.trim());
        this.el.input.value = '';
    }

    add_tag(value) {
        if (value == '') {return};
        for (let el of this.querySelectorAll('pkt-tag-x')) {
            if (el.innerText.trim() === value) { return }
        }
        let tag = document.createElement('pkt-tag-x');
        this.insertBefore(tag, this.el.input);
        tag.querySelector('span').innerText = value;
        tag.addEventListener('remove', (event) => {
            this.dispatchEvent(new CustomEvent('remove', {
                detail: {tag: event.target}
            }))
        })
    }

    get tags() {
        let tag_nodes = this.querySelectorAll('pkt-tag-x');
        let tags = [];
        for (let tag of tag_nodes) {
            tags.push(tag.innerText.trim());
        }
        return tags;
    }
}
