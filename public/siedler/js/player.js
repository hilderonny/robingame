class Player {

    constructor() {
        this.domElement = Helper.createDomElement('<div class="player"></div>');
        this.clickRadiusDomElement = Helper.createDomElement('<div class="clickradius"></div>');
        this.avatarDomElement = Helper.createDomElement('<div class="avatar"></div>');
        this.domElement.appendChild(this.clickRadiusDomElement);
        this.domElement.appendChild(this.avatarDomElement);
        this.clickRadius = 50;
        this.updateClickRadius();
        return new Proxy(this, {
            set(player, propertyname, value) {
                player[propertyname] = value;
                switch (propertyname) {
                    case "clickRadius": player.updateClickRadius(); break;
                }
            }
        });
    }

    updateClickRadius() {
        this.clickRadiusDomElement.style.borderRadius = this.clickRadius + "px";
        this.clickRadiusDomElement.style.height = (2 * this.clickRadius) + "px";
        this.clickRadiusDomElement.style.width = (2 * this.clickRadius) + "px";
    }

}
