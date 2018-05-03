class Helper {

    // From https://stackoverflow.com/a/35385518/5964970
    static createDomElement(html) {
        var template = document.createElement('div');
        template.innerHTML = html.trim();
        return template.firstChild;
    }

}