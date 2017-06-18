
export default class Hub<T> {
    private _fn: () => PromiseLike<T>;
    private _timeout: number;
    private _lastRunTs: number;
    private _activePromise: Promise<T>;

    public timeout(): boolean {
        return Boolean(this._timeout > 0 && this._lastRunTs && ((this._timeout + this._lastRunTs) <= new Date().getTime()));
    }

    public get(): Promise<T> {
        if (this._activePromise && !this.timeout())
            return this._activePromise;
        else {
            this._lastRunTs = new Date().getTime();
            return this._activePromise = new Promise<T>((res, rej) => {
                try {
                    this._fn().then(res, (err: Error) => {
                        rej(err);
                        this._activePromise = null;
                    });
                }
                catch (err) {
                    // error in this._fn()
                    rej(err);
                    this._activePromise = null;
                }
            });
        }
    }

    constructor(fn: () => PromiseLike<T>, timeout?: number) {
        this._fn = fn;
        this._timeout = timeout; //in ms
        this._activePromise = this._lastRunTs = null;
    }
};
