export class Friend {
    constructor() {
        this.health = 3;
        this.birthday = Date.now();
        console.log(this.birthday);
        this.age = this.updateAge();
        console.log(this.age);
        this.image = this.getImage();
    }

    decreaseHealth(amt) {
        this.health = Math.max(0, this.health-1);
    }

    increaseHealth(amt) {
        this.health = Math.min(3, this.health+1);
    }

    increaseAge() {
        this.age += 1;
        this.image = this.getImage();
    }

    updateAge() {
        // milliseconds to days
        const daysElapsed = Math.floor((Date.now() - this.birthday)/86400000);
        return daysElapsed;
    }

    getImage () {
        if (this.age < 2) {
            return './images/egg.png';
        } else if (this.age < 3) {
            return './images/eggcrack.png';
        } else if (this.age < 7) {
            return './images/cat.png';
        } else if (this.age >= 7) {
            return './images/poink.png';
        }
    }
}