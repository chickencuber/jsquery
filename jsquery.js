const { $, JSQuery } = (() => {
  class ElementArray extends Array {
    on(e, func, s) {
      this.forEach((v) => v.on(e, func, s));
      return this;
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
      if (func === undefined) {
        this.trigger(e);
        return;
      }
      this.on(e, func, s);
    }
    static from(elt) {
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
      this.elt.dispatchEvent(new Event(e));
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
      if (!val) return this.getProp("id");
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
      if (!val) return this.elt.innerHTML;
      this.elt.innerHTML = val;
      return this;
    }
    text(val) {
      if (!val) return this.elt.textContent;
      this.elt.textContent = val;
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
    get(global) {
      return {
        $: this.$(global),
        Element: this.Element(global),
        static_Element: this.static_Element(global),
        static_ElementArray: this.static_ElementArray(global),
        ElementArray: this.ElementArray(global),
        JSQuery: this.JSQuery(global),
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
    if(!doc) doc = Element.from(document);
    return doc;
  }

  J.create = (t) => {
    return Element.from(document.createElement(t));
  };

  const JSQuery = { Element, ElementArray, Extension };

  J.loadExtension = (extend, global = false) => {
    if (Object.getPrototypeOf(extend) !== Extension) {
      throw new Error(
        "the class is not a parent of JSQuery.Extension or the inputed class is an instance"
      );
    }
    body = undefined;
    head = undefined;
    const items = new extend().get(global);
    if (!global) {
      Object.assign(J, { [extend.name]: items.$ });
      Object.assign(JSQuery, { [extend.name]: items.JSQuery });
      Object.assign(Element.prototype, { [extend.name]: items.Element });
      Object.assign(ElementArray.prototype, {
        [extend.name]: items.ElementArray,
      });
      Object.assign(Element, { [extend.name]: items.static_Element });
      Object.assign(ElementArray, { [extend.name]: items.static_ElementArray });
    } else {
      Object.assign(J, items.$);
      Object.assign(JSQuery, items.JSQuery);
      Object.assign(Element.prototype, items.Element);
      Object.assign(ElementArray.prototype, items.ElementArray);
      Object.assign(Element, items.static_Element);
      Object.assign(ElementArray, items.static_ElementArray);
    }
  };

  return { $: J, JSQuery };
})();
