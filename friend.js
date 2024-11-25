export class Friend {
    constructor(health = 4, age = 0, birthday = Date.now(), image = './images/egg.png', lastDateChecked = Date.now(), daysUntilEvolution = 3, evolutionStage = 0) {
        this.health = health;
        this.age = age;
        this.birthday = birthday;
        this.image = image;
        this.lastDateChecked = lastDateChecked;
        // keeping track of daysUntilEvolution is necessary so that it does evolve twice if the user gets to an old age while having less than 3 health
        this.daysUntilEvolution = daysUntilEvolution;
        this.evolutionStage = evolutionStage
        console.log(this.image, this.daysUntilEvolution, this.evolutionStage, this.age)
    }

    decreaseHealth(amt) {
        this.health = Math.max(0, this.health-amt);
    }

    increaseHealth(amt) {
        this.health = Math.min(4, this.health+amt);
    }

    increaseAge(amt) {
        this.age += amt;
        this.image = this.getImage();
    }

    updateAge() {
        // milliseconds to days
        const daysElapsed = Math.floor((Date.now() - this.birthday)/86400000);
        return daysElapsed;
    }

    decreaseDaysUntilEvolution(amt) {
        this.daysUntilEvolution = Math.min(0, this.daysUntilEvolution-amt)
    }

    getImage() {
        if (this.evolutionStage === 0) {
            if (this.age < 2) {
                return './images/egg.png';
            } else {
                console.log('hello')
                return './images/eggcrack.png';
            }
        } else if (this.evolutionStage === 1) {
            return './images/cat.png';
        } else if (this.evolutionStage === 2) {
            return './images/poink.png';
        }
    }

    evolve() {
        if (this.evolutionStage === 0) { // first evolution
            this.daysUntilEvolution = 4;
            this.evolutionStage = 1;
            this.image = getImage();
        } else if (this.evolutionStage === 1) { // second evolution
            this.evolutionStage = 2;
            this.image = getImage();
        }
    }

    saveState() {
        chrome.storage.local.set({
            charState: {
                health: this.health,
                age: this.age,
                birthday: this.birthday,
                image: this.image,
                lastDateChecked: this.lastDateChecked,
                daysUntilEvolution: this.daysUntilEvolution,
                evolutionStage: this.evolutionStage
            }
        });
    }

    die() {
        const message = document.getElementById('message');
        message.textContent = 'Your friend has died :('

        // remove data from storage
        chrome.storage.local.remove('charState', () => {
            if (chrome.runtime.lastError) {
                console.log('Error removing friend data:', chrome.runtime.lastError);
            } else {
                console.log('Removed friend data from storage')
            }
        })
    }

    static async loadState(){
        return new Promise((resolve) => {
            chrome.storage.local.get(['charState'], (result) => {
                if (result.charState){
                    const {health, age, birthday, image, lastDateChecked, daysUntilEvolution, evolutionStage} = result.charState;
                    resolve(new Friend(health, age, birthday, image, lastDateChecked, daysUntilEvolution, evolutionStage));
                } else {
                    // default Friend if no saved data
                    resolve(new Friend());
                }
            })
        })
    }
}