
var Hub = require('./index.js');

var asyncFn = function () {
	console.log('in function');
	return new Promise(function(res, rej) {
		setTimeout(function(){ res(100); }, 2000);
	});
};

var hub = new Hub(asyncFn, 5000);

Promise.all([hub.get(), hub.get()])
.then(function(data){
	console.log('both complete');
	console.info(data);
})
.then(function(){
	//4.5s later, hub cache still work
	setTimeout(function(){
		console.log('you will get result immediately, it\'s from cache');
		hub.get().then(function(d){console.log(d);});
	}, 4500);

	//5.5s later, hub cache will expire
	setTimeout(function(){
		console.log('you will not get result immediately, because cache expired');
		hub.get().then(function(d){console.log(d);});
	}, 5500);
});
