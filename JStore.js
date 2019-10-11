const JStore = Vue.prototype.$local = new Proxy(({}), {
    get(t, kEnd) {
        if (kEnd[0] == "$") {
            kEnd = kEnd.substring(1);
            if (this.instace)
                return this.instace[kEnd];
            else if (kEnd in t)
                return t[kEnd];
            else
                return t[kEnd] = (JSON.parse(kEnd in localStorage ? localStorage[kEnd] : localStorage[kEnd] = 'null'));
        }
        return new Proxy(t, {
            ...this, root: this.root || kEnd, instace:
                this.instace ?
                    (kEnd in this.instace ? this.instace[kEnd] : this.instace[kEnd]=({})) :
                    kEnd in t ? t[kEnd] : t[kEnd] = (JSON.parse(kEnd in localStorage ? localStorage[kEnd] : (localStorage[kEnd] = '{}')))
        });
    },

    set(t, kEnd, v) {
        if (kEnd[0] == "$") {
            kEnd = kEnd.substring(1);
            v = Vue.observable(v);
            (this.instace || t)[kEnd] = v;
            localStorage[this.root || kEnd] = JSON.stringify(t[this.root || kEnd]);
            return true;
        }
    }
});
