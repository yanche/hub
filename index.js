
//fn: a function returns promise
var Hub = function (fn, timeout) {
    this._fn = fn;
    this._resolved = false;
    this._result = null;
    //{res, rej}
    this._pendingQ = [];
    this._timeout = timeout; //in ms
    this._resolvedTs = null;
};
Hub.prototype.timeout = function () {
    return this._timeout != null && this._resolvedTs != null && (this._timeout + this._resolvedTs <= new Date().getTime());
};
Hub.prototype.get = function () {
    //if cache not expired yet
    if (this._resolved && !this.timeout())
        return Promise.resolve(this._result);
    else {
        var me = this;
        return new Promise(function (res, rej) {
            me._pendingQ.push({ res: res, rej: rej });
            //send the request at first call
            if (me._pendingQ.length == 1) {
                me._resolved = false;
                me._resolvedTs = null;
                me._result = null;
                me._fn()
                .then(function (d) {
                    me._resolved = true;
                    me._resolvedTs = new Date().getTime();
                    me._result = d;
                    while (me._pendingQ.length > 0)
                        me._pendingQ.shift().res(d);
                })
                .catch(function (err) {
                    while (me._pendingQ.length > 0)
                        me._pendingQ.shift().rej(err);
                });
            }
        });
    }
};

module.exports = Hub;
