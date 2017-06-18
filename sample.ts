
import Hub from "./index.js";

function asyncFn() {
	console.log('in function');
	return delay(2000).then(() => 200);
};

const hub = new Hub<number>(asyncFn, 5000);

Promise.all([hub.get(), hub.get()])
	.then(data => {
		console.log('both complete');
		console.info(data);
	})
	.then(function () {
		//4.5s later, hub cache still work

		return Promise.all([
			delay(1000)
				.then(() => {
					console.log("you will get result immediately, it's from cache");
					return hub.get().then(d => console.log(d));
				}),
			delay(5000)
				.then(() => {
					console.log("you will not get result immediately, because cache expired");
					return hub.get().then(d => console.log(d));
				})
		]);
	})
	.catch((err: Error) => console.error(err.stack));

function delay(ms: number): Promise<void> {
	return new Promise<void>(res => setTimeout(res, ms));
}
