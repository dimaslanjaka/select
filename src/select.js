var SelectCSS;
/**
 * Dimas Lanjaka Advanced Select
 * @class Advanced Select
 * @param {String} target
 * @param {Object} settings
 */
class dS {
    /**
     * instance of HTML DOM
     * @var {HTMLDocument} target
     */
    target = null;
    select = null;
    display = null;
    list = null;
    options = [];
    isLarge = false;
    value = null;
    selected = null;
    settings = null;
    highlighted = null;
    filter = null;
    target = null;
    select = null;
    display = null;
    list = null;
    options = [];
    isLarge = false;
    value = null;
    selected = null;
    uid = null;
    settings = null;
    highlighted = null;
    constructor(target, settings = {
        /**
         * Should the 'filter options' input be displayed?
         */
        filtered: 'auto',
        /**
         * Maximum displayed threshold
         * * When a select contains `x` options or more, display the filter input.
         */
        filter_threshold: 8,
        /**
         * Placeholder text for the filter input.
         */
        filter_placeholder: 'Filter options...',
        /**
         * Auto start
         */
        start: false,
        /**
         * Save selected value to cache browser (saving for next request in same browser and pages)
         */
        save: false
    }) {
        this.target = null;
        this.select = null;
        this.display = null;
        this.list = null;
        this.options = [];
        this.isLarge = false;
        this.value = null;
        this.selected = null;
        this.settings = null;
        this.highlighted = null;
        this.filter = null;
        this.target = target;
        this.select = null;
        this.display = null;
        this.list = null;
        this.options = [];
        this.isLarge = false;
        this.value = null;
        this.selected = null;
        this.uid = null;
        this.settings = settings;
        this.highlighted = null;
        if (settings.hasOwnProperty('start') && settings.start) {
            this.init();
        }
    }
    uuid() {
        this.uid = location.host;
        if (!this.target) {
            this.uid = new Date().getTime();
        } else {
            if (this.target.getAttribute('name')) {
                this.uid = this.target.getAttribute('name');
            } else if (this.target.getAttribute('id')) {
                this.uid = this.target.getAttribute('id');
            }
        }
    }
    /**
     * Check element instanceOf Element Or HTMLDocument
     * @param {any} element
     */
    isElement(element) {
        return element instanceof Element || element instanceof HTMLDocument;
    }
    /**
     * Initialize Select
     */
    init() {
        switch (typeof this.target) {
            case 'object':
                this.target = this.target;
                break;
            case 'string':
                this.target = document.querySelector(this.target);
                break;
        }
        if (!SelectCSS && this.settings.hasOwnProperty('css')) {
            SelectCSS = true;
            this.loadCss(this.settings.css);
        }
        this.settings = this.getSettings(this.settings);
        this.buildSelect();
        this.target.parentNode.replaceChild(this.select, this.target);
        this.target.style.display = 'none';
        this.select.appendChild(this.target);
        document.addEventListener('click', this.handleClickOff.bind(this));
        this.positionList();
        this.uuid();
        this.load();
    }
    /**
     * Load CSS Asynchronously
     * @param {string} url
     */
    loadCss(url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    }
    /**
     * Build Select
     */
    buildSelect() {
        this.select = document.createElement('div');
        this.select.classList.add('select');
        this.select.setAttribute('tabindex', this.target.tabIndex);
        this.select.addEventListener('keydown', this.handleSelectKeydown.bind(this));
        this.display = document.createElement('span');
        this.display.classList.add('value');
        this.display.addEventListener('click', this.handleDisplayClick.bind(this));
        this.select.appendChild(this.display);
        this.buildList();
        if (this.options.length) {
            this.value = this.options[this.target.selectedIndex].getAttribute('data-value');
            this.selected = this.options[this.target.selectedIndex];
            this.display.innerHTML = this.selected.innerHTML;
        }
        if ((this.settings.filtered === 'auto' && this.options.length >= this.settings.filter_threshold) ||
            this.settings.filtered === true) {
            this.isLarge = true;
            this.select.classList.add('large');
        }
    }
    buildList() {
        this.list = document.createElement('div');
        this.list.classList.add('list');
        this.list.setAttribute('tabindex', '-1');
        this.list.addEventListener('keydown', this.handleListKeydown.bind(this));
        this.list.addEventListener('mouseenter', function () {
            this.options[this.highlighted].classList.remove('hovered');
        }.bind(this));
        this.highlighted = this.target.selectedIndex;
        this.buildFilter();
        this.buildOptions();
        this.select.appendChild(this.list);
    }
    buildOptions() {
        var ul = document.createElement('ul');
        var options = this.target.querySelectorAll('option');
        for (var i = 0; i < options.length; i++) {
            var li = document.createElement('li');
            li.setAttribute('data-value', options[i].value);
            li.innerHTML = options[i].innerHTML;
            li.addEventListener('click', this.handleOptionClick.bind(this));
            ul.appendChild(li);
            this.options.push(li);
        }
        this.list.appendChild(ul);
    }
    buildFilter() {
        var wrapper = document.createElement('div');
        wrapper.classList.add('filter');
        this.filter = document.createElement('input');
        this.filter.type = 'text';
        this.filter.setAttribute('placeholder', this.settings.filter_placeholder);
        this.filter.addEventListener('keyup', this.handleFilterKeyup.bind(this));
        wrapper.appendChild(this.filter);
        this.list.appendChild(wrapper);
    }
    toggleList() {
        if (this.list.classList.contains('open')) {
            this.list.classList.remove('open');
            this.options[this.highlighted].classList.remove('hovered');
            this.select.focus();
        } else {
            this.options[this.target.selectedIndex].classList.add('hovered');
            this.highlighted = this.target.selectedIndex;
            this.list.classList.add('open');
            this.list.focus();
        }
    }
    positionList() {
        if (!this.isLarge) {
            this.list.style.top = '-' + this.selected.offsetTop + 'px';
        }
    }
    highlightOption(dir) {
        var next = null;
        switch (dir) {
            case 'up':
                next = (this.highlighted - 1 < 0) ? this.highlighted : this.highlighted - 1;
                break;
            case 'down':
                next = (this.highlighted + 1 > this.options.length - 1) ? this.highlighted : this.highlighted + 1;
                break;
            default:
                next = this.highlighted;
        }
        this.options[this.highlighted].classList.remove('hovered');
        this.options[next].classList.add('hovered');
        this.highlighted = next;
    }
    clearFilter() {
        this.filter.value = '';
        for (var i = 0; i < this.options.length; i++) {
            this.options[i].style.display = 'block';
        }
    }
    closeList() {
        this.list.classList.remove('open');
        this.options[this.highlighted].classList.remove('hovered');
    }
    getSettings(settings) {
        var defaults = {
            filtered: 'auto',
            filter_threshold: 8,
            filter_placeholder: 'Filter options...'
        };
        for (var p in settings) {
            defaults[p] = settings[p];
        }
        return defaults;
    }
    // EVENT HANDLERS
    handleSelectKeydown(e) {
        if (this.select === document.activeElement && e.keyCode == 32) {
            this.toggleList();
        }
    }
    handleDisplayClick(e) {
        this.list.classList.add('open');
        if (this.isLarge) {
            this.filter.focus();
        }
    }
    handleListKeydown(e) {
        if (this.list === document.activeElement) {
            switch (e.keyCode) {
                case 38:
                    this.highlightOption('up');
                    break;
                case 40:
                    this.highlightOption('down');
                    break;
                case 13:
                    this.target.value = this.options[this.highlighted].getAttribute('data-value');
                    this.selected = this.options[this.highlighted];
                    this.display.innerHTML = this.options[this.highlighted].innerHTML;
                    this.closeList();
                    setTimeout(this.positionList.bind(this), 200);
                    this.select.focus();
                    break;
            }
        }
    }
    handleFilterKeyup(e) {
        var self = this;
        this.options.filter(function (li) {
            if (li.innerHTML.substring(0, self.filter.value.length).toLowerCase() == self.filter.value.toLowerCase()) {
                li.style.display = 'block';
            } else {
                li.style.display = 'none';
            }
        });
    }
    /**
     * Save selected value
     */
    save() {
        if (this.settings.hasOwnProperty('debug')) {
            console.info({
                'save': this.uid
            });
        }
        localStorage.setItem(this.uid, this.value);
    }
    /**
     * Load previous selected value
     */
    load(Value) {
        if (this.uid && localStorage.getItem(this.uid) !== null && this.settings.hasOwnProperty('save') && this.settings.save) {
            if (this.settings.hasOwnProperty('debug')) {
                console.info({
                    'load': {
                        'key': this.uid,
                        'text': this.target[this.target.selectedIndex].text,
                        'val': localStorage.getItem(this.uid)
                    }
                });
            }
            this.target.value = localStorage.getItem(this.uid);
            this.select.value = localStorage.getItem(this.uid);
            this.value = localStorage.getItem(this.uid);
            this.target.setAttribute('data-value', localStorage.getItem(this.uid));
            this.selected = this.target;
            this.display.innerHTML = this.target[this.target.selectedIndex].text;
        }
    }
    reset() { }
    /**
     * Handle click on options
     * @param {EventListenerOrEventListenerObject} e
     */
    handleOptionClick(e) {
        this.display.innerHTML = e.target.innerHTML;
        this.target.value = e.target.getAttribute('data-value');
        this.value = this.target.value;
        this.selected = e.target;
        this.closeList();
        this.clearFilter();
        if (this.settings.hasOwnProperty('save') && this.settings.save && this.value) {
            this.save();
        }
        setTimeout(this.positionList.bind(this), 200);
    }
    handleClickOff(e) {
        if (!this.select.contains(e.target)) {
            this.closeList();
        }
    }
}
//# sourceMappingURL=select.js.map