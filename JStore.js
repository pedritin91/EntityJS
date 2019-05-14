export const JStore = new Proxy(
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
  });
