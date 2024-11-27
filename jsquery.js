const { $, JSQuery } = (() => {
    class ElementArray extends Array {
        on(e, func, s) {
            this.forEach((v) => v.on(e, func, s));
            return this;
        }
        rect() {
            return this.map((v) => v.rect());
        }
        hasClass(c) {
            return this.map((v) => v.hasClass(c));
        }
        is(q) {
            return this.map((v) => v.is(q));
        }
        checked(val) {
            if (val) {
                this.forEach((v) => v.checked(val));
                return this;
            }
            return this.map((v) => v.checked());
        }
        trigger(e) {
            this.forEach((v) => v.trigger(e));
            return this;
        }
        css(styles) {
            this.forEach((v) => v.css(styles));
            return this;
        }
        props(props) {
            this.forEach((v) => v.props(props));
            return this;
        }
        class(names) {
            this.forEach((v) => v.class(names));
            return this;
        }
        removeClass(names) {
            this.forEach((v) => v.removeClass(names));
            return this;
        }
        toggleClass(names) {
            this.forEach((v) => v.toggleClass(names));
            return this;
        }
        remove() {
            this.forEach((v) => v.remove());
            return this;
        }
        new() {
            const temp = new this.constructor();
            this.forEach((v) => temp.push(v.new()));
            return temp;
        }
        //events
        click(func, s) {
            this.forEach((v) => v.click(func, s));
            return this;
        }
    }

    function toArray(elt) {
        return elt instanceof NodeList || elt instanceof HTMLCollection;
    }

    class Element {
        #TriggerEvent(e, func, s) {
            if (!func) {
                this.trigger(e);
                return;
            }
            this.on(e, func, s);
        }
        static from(elt) {
            if (elt == null) {
                return null;
            }
            if (toArray(elt)) {
                return ElementArray.from(elt).map((v) => new this(v));
            }
            return new this(elt);
        }
        new() {
            return this.constructor.from(this.elt);
        }
        constructor(elt) {
            this.elt = elt;
        }
        on(e, func, s) {
            this.elt.addEventListener(e, func, s);
            return this;
        }
        removeEvent(e, func, s) {
            this.elt.removeEventListener(e, func, s);
            return this;
        }
        trigger(e) {
            this.elt[e]();
            return this;
        }
        css(styles) {
            for (const [name, val] of Object.entries(styles)) {
                this.elt.style[name] = val;
            }
            return this;
        }
        getCss(style) {
            return this.elt.style[style];
        }
        props(props) {
            for (const [name, val] of Object.entries(props)) {
                this.elt.setAttribute(name, val);
            }
            return this;
        }
        getProp(name) {
            return this.elt.getAttribute(name);
        }
        id(val) {
            if (val == undefined) return this.getProp("id");
            this.props({ id: val });
            return this;
        }
        class(names) {
            if (Array.isArray(names)) {
                names.forEach((name) => this.elt.classList.add(name));
            } else {
                this.elt.classList.add(names);
            }
            return this;
        }
        removeClass(names) {
            if (Array.isArray(names)) {
                names.forEach((name) => this.elt.classList.remove(name));
            } else {
                this.elt.classList.remove(names);
            }
            return this;
        }
        toggleClass(names) {
            if (Array.isArray(names)) {
                names.forEach((name) => this.elt.classList.toggle(name));
            } else {
                this.elt.classList.toggle(names);
            }
            return this;
        }
        hasClass(name) {
            return this.elt.classList.contains(name);
        }
        $(q) {
            return J.from(this.elt.querySelector(q));
        }
        all(q) {
            return J.from(this.elt.querySelectorAll(q));
        }
        is(q) {
            return this.elt.matches(q);
        }
        child(children) {
            if (Array.isArray(children)) {
                children.forEach((child) => this.elt.appendChild(toElt(child)));
            } else {
                this.elt.appendChild(toElt(children));
            }
            return this;
        }
        remove() {
            this.elt.remove();
            return this;
        }
        get children() {
            return this.constructor.from(this.elt.children);
        }
        html(val) {
            if (val == undefined) return this.elt.innerHTML;
            this.elt.innerHTML = val;
            return this;
        }
        text(val) {
            if (val == undefined) return this.elt.textContent;
            this.elt.textContent = val;
            return this;
        }
        rect() {
            return this.elt.getBoundingClientRect().toJSON();
        }
        value(val) {
            if (val == undefined) return this.elt.value;
            this.elt.value = val;
            return this;
        }
        checked(val) {
            if (val == undefined) return this.elt.checked;
            this.elt.checked = val;
            return this;
        }
        //events
        click(func, s) {
            this.#TriggerEvent("click", func, s);
            return this;
        }
    }

    function toElt(elt) {
        if (elt instanceof Element) return elt.elt;
        return elt;
    }

    class Extension {
        constructor() {
            if (this.constructor === Extension) {
                throw new Error(
                    "you can't make an instance of class: JSQuery.Extension"
                );
            }
        }
        get() {
            return {
                $: this.$(),
                Element: this.Element(),
                static_Element: this.static_Element(),
                static_ElementArray: this.static_ElementArray(),
                ElementArray: this.ElementArray(),
                JSQuery: this.JSQuery(),
            };
        }
        $() {
            return {};
        }
        Element() {
            return {};
        }
        ElementArray() {
            return {};
        }

        static_Element() {
            return {};
        }
        static_ElementArray() {
            return {};
        }

        JSQuery() {
            return {};
        }
    }

    function J(q) {
        return Element.from(document.querySelector(q));
    }

    J.from = (elt) => {
        return Element.from(elt);
    };

    J.all = (q) => {
        return Element.from(document.querySelectorAll(q));
    };

    let head;
    J.head = () => {
        if (!head) head = Element.from(document.head);
        return head;
    };

    let body;
    J.body = () => {
        if (!body) body = Element.from(document.body);
        return body;
    };

    let doc;
    J.doc = () => {
        if (!doc) doc = Element.from(document);
        return doc;
    };

    J.create = (t) => {
        return Element.from(document.createElement(t));
    };

    const JSQuery = {
        Element,
        ElementArray,
        Extension,
        Plugin: Extension,
        Caching: class Caching extends Extension {
            $() {
                return {
                    cache(func) {
                        const f = (...args) => {
                            const val = JSON.stringify(args);
                            if (f.cache.hasOwnProperty(val)) {
                                return f.cache[val];
                            }
                            const temp = func(...args);
                            f.cache[val] = temp;
                            return temp;
                        };
                        f.cache = {};
                        return f;
                    },
                };
            }
        },
    };

    J.loadExtension = (extend) => {
        if (Object.getPrototypeOf(extend) !== Extension) {
            throw new Error(
                "the class is not a child of JSQuery.Extension or the inputed class is an instance"
            );
        }
        body = undefined;
        head = undefined;
        const items = new extend().get();
        Object.assign(J, items.$);
        Object.assign(JSQuery, items.JSQuery);
        Object.assign(Element.prototype, items.Element);
        Object.assign(ElementArray.prototype, items.ElementArray);
        Object.assign(Element, items.static_Element);
        Object.assign(ElementArray, items.static_ElementArray);
    }

    J.loadPlugin = J.loadExtension;

    return { $: J, JSQuery };
})();

