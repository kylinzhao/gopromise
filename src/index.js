(function(){
	var Promise = function( executed ){
		this.status = "pending";
		this.queue = [];
		this.finishQueue = [];
		var me = this;
		executed && executed(function(value){
			me.reslove(value);
		},function(value){
			me.reject(value);
		});
	}

	var _dequeue = function(value){
		"undefined" !== typeof value && (this.value = value);
		if(this.queue.length){
			var funcs = this.queue.shift();
			funcs(value);
		}else{
			// this.status = "finish";
			_dequeueFinish.call(this,value);
		}
	}

	var _dequeueFinish = function(value){
		if(this.finishQueue.length){
			var funcs = this.finishQueue.shift();
			funcs(value);
		}
	}

	Promise.prototype.reslove = function(value){
		this.status = "fulfilled";
		_dequeue.call(this,value);

	};
	Promise.prototype.reject = function(value){
		this.status = "rejected";
		_dequeue.call(this,value);
	};

	var _doProcess = function(type,resloved){
		var me = this;
		var promise = new Promise();
		var _callback = function(value){
			resloved && resloved(value, function(value){
				promise.reslove(value);
			},function(value){
				promise.reject(value);
			});
		}

		var _type = {
			"then" : "fulfilled",
			"catch" : "reject",
			"finish" : "rejected"
		}[type];

		if(this.status === _type){
			_callback(me.value, function(){
				promise.reslove();
			}, function(){
				promise.reject();
			});
		}else if(this.status === "pending"){
			this.queue.push(function(value){
				if(me.status === _type){
					_callback(me.value);
				}
			});
		}

		return promise;
	};

	Promise.prototype.then = function(resloved){
		return _doProcess.call(this, "then", resloved);
	};

	Promise.prototype.delay = function(){};

	Promise.prototype.catch = function(resloved){
		return _doProcess.call(this, "catch", resloved);
	};

	Promise.prototype.finish = function(){

	};
	// return Promise;

	new Promise(function(resolve, reject){
		setTimeout(function(){
			console.log("start")
			resolve("go to next");
		},1000);
	}).then(function(data,reslove,reject){
		setTimeout(function(){
			console.log(data);
			reslove("one")
		},1000);
	}).then(function(data,reslove,reject){
		setTimeout(function(){
			console.log(data);
			reslove("two")
		},1000);
	}).then(function(data,reslove,reject){
		setTimeout(function(){
			console.log(data);
			reject("reject one")
		},1000);
	}).catch(function(data,reslove,reject){
		setTimeout(function(){
		    console.log(data)
		    reject("reject two");
		},1000);
	}).then(function(data,reslove,reject){
		setTimeout(function(){
		    console.log(data)
		    reslove("three");
		},1000);
	}).catch(function(data,reslove,reject){
		setTimeout(function(){
		    console.log(data)
		    reslove("four");
		},1000);
	}).then(function(data,reslove,reject){
		setTimeout(function(){
		    console.log(data)
		    reslove("four");
		},1000);
	}).finish(function(data,reslove,reject){
		console.log(data);
		console.log("finish")
	});

})()