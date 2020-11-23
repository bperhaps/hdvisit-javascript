export default class Utils {
    static timeToSec() {
        let date = new Date();
        return date.getHours() * 60 * 60 +
            date.getMinutes() * 60 +
            date.getSeconds();
    }

    export
    function

    static secToTime(sec) {
        let hour = sec / (60 * 60);
        let minute = (sec - hour * 60 * 60) / 60;
        let second = sec - hour * 60 * 60 - minute * 60;

        return hour + ":" + minute + ":" + second;
    }

    export
    function

    static makePath(contry, date, idx) {
        if(idx == undefined) {
            return "m/" +
                contry + "'/" +
                this.calcDateDiff(date) + "'";
        }
        return "m/" +
            contry + "'/" +
            this.calcDateDiff(date) + "'/" +
            idx;
    }

    export
    function

    static calcDateDiff(date) {
        let firstDate = new Date(0);
        let secondDate = date;

        let diff = secondDate.getTime() - firstDate.getTime();

        return Math.ceil(
            diff / (1000 * 3600 * 24)
        );
    }
}