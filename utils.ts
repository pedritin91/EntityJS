import qs from 'query-string';
const headers: { [key: string]: string } = {
    'Accept': `application/json`,
    'Content-Type': 'application/json'
};

export enum RowState {   
    Detached = 1,
    Unchanged = 2,
    Added = 4,
    Deleted = 8,
    Modified = 16
}

export interface UserSession {
    user: string;
    session?: string;
    id?: number;
}

var obj = {
    JRequest: new Proxy(
        {
            async get<T>(params) {
                let req = await (fetch(this.url + ((params = qs.stringify(params)) && '?' + params), {
                    method: 'get',
                    headers: new Headers(headers)
                })),
                    status = (await req.ok);                
                if (status)
                    return (await req.json()) as T;
                else
                    throw new Error(await req.text());
            },
            async post(params) {
                let req = await (fetch(this.url, {
                    method: 'post',
                    body: JSON.stringify(params),
                    headers: new Headers(headers)
                })),
                    status = (await req.ok);
                if (status)
                    return (await req.json());
                else
                    throw new Error(await req.text());
            }
        }, {
            url: "",
            get(a: any, b, o) {
                if (b in a){
                    let r = a[b].bind({url:this.url});
                    this.url = "";                
                    return r;
                };
                this.url = this.url + (this.url ? '/' : '') + escape(b.toString());
                return new Proxy(a, this);
            }
        } as any),
    JStore: new Proxy(
        {}, 
        {
            key: "",
            path: [],
            get(r, k, o) {
                if (!this.key)
                    this.key = k;
                else if(k.startsWith('$')){
                    this.path.push(k.substring(1));
                    let w = this.$get();
                    this.path = [];
                    this.key = "";
                    obj.JStore = o;
                    return w;
                }else
                    this.path.push(k);
                
                return o
            },
            set(r, k, v, o) {
                if (!this.key)
                    this.key = k;
                else if(k.startsWith('$')){
                    this.path.push(k.substring(1));
                    let w = this.$set(v);
                    this.path = [];
                    this.key = "";
                    obj.JStore = o;
                    return true;
                }else
                    this.path.push(k);
                
                return o
            },
            $get() {
                var r = JSON.parse(localStorage.getItem(this.key)||'{}'),
                    lastKey = this.path.pop();
                for(let k of this.path)
                    r = (k in r) ? r[k] : {};
                return r[lastKey];
            },
            $set(value) {
                var original, r = original = JSON.parse(localStorage.getItem(this.key)||'{}'),
                    lastKey = this.path.pop();
                for(let k of this.path)
                    r = r[k] = (k in r) ? r[k] : {};
                r[lastKey] = value;
                localStorage.setItem(this.key, JSON.stringify(original));
                return r[lastKey];
            }
        } as any)
};
export default obj;