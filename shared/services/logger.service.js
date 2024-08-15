/**
 * 0: Debug
 * 1: Verbose
 * 2: info
 * 3: warnings
 * 4: errors
 * 5: alerts
 * 6: critical
 */
export class Logger {
    static instance = null;
    static maxCharPerLine = 80;
    messages = [];
    level = 0;
    /*private */constructor(level) {
        this.level = level
    } //!!!!not to be used outside of getLogger()!!!!

    add(string, level, topic) {
        this.messages.push({string,level,topic})
    }

    print() {
        let lastTopic = '';
        this.messages.forEach((msgObj/*{level,string,topic}*/) => {
            if (msgObj.level < this.level) {
                return;
            }
            if (lastTopic !== msgObj.topic) {
                this.log('\n', false);
                this.log(`[${msgObj.topic.toUpperCase()}]`, false);
            }
            lastTopic = msgObj.topic;
            this.log(`${msgObj.string}`)
        });
        this.messages = [];
    }

    log(str, insertTime = true) {
        let leftover = str;
        do {
            //todo: slice after prefix is inserted, to include prefix in maxcharlength
            let slice = leftover.slice(0, Logger.maxCharPerLine - (!insertTime ? 6/* length of 2 x \t - 'hh:mm:ss - '.length */ : 0));
            leftover = leftover.slice(Logger.maxCharPerLine);
            let prefix = '\t\t';
            if (insertTime) {
                //only log time once, then indend next lines to show connection
                prefix = Logger.getTimeLogFormat() + ' -';
                insertTime = false;
            }

            //FInally some loggin
            console.log(prefix, slice);
        }
        while (0 !== leftover.length);
    }

    static getTimeLogFormat() {
        let str = new Date().toISOString();
        const idxT = str.indexOf('T');
        return str.slice(idxT + 1, -5);
    }

    static getLogger() {
        if (!Logger.instance) {
            Logger.instance = new Logger(0);
        }
        return this.instance;
    }
}