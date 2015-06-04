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
		this.status = "fullfilled";
		_dequeue.call(this,value);

	};
	Promise.prototype.reject = function(value){
		this.status = "rejected";
		_dequeue.call(this,value);
	};

	var _doProcess = function(resloved,rejected){
		var me = this;
		var promise = new Promise();

		var _resolveCallback = function(value){
			var _reslovedValue;
			if(resloved){
				_reslovedValue = resloved(value);
			}
			return _reslovedValue;
		}
		var _rejectCallback = function(value){
			var _rejectValue;
			if(rejected){
				_rejectValue = rejected(value)
			}
			return _rejectValue;
		}
		var _callback = function(value){
			var _callbackValue;
			if(this.status === "fullfilled"){
				_callbackValue = _resolveCallback(value);
				if(!isPromise(_callbackValue)){
					promise.reslove(_callbackValue);
				}
			}else if(this.status === "rejected"){
				_callbackValue = _rejectCallback(value);
				if(!isPromise(_callbackValue)){
					promise.reject(_callbackValue);
				}
			}

			try{
				if(isPromise(_callbackValue)){
					_callbackValue.then(function(data){
						promise.reslove(data);
					},function(data){
						promise.reject(data);
					});	
				}
			}catch(e){
				promise.reject(e);
			}
			
		}

		if(this.status === "pending"){
			this.queue.push(function(value){
				_callback.call(me,value);
			});
		}else{
			_callback.call(me,me.value);
		}

		return promise;
	};

	Promise.prototype.then = function(onFullFilled, onRejected){
		return _doProcess.call(this, onFullFilled, onRejected);
	};

	Promise.prototype.catch = function(resloved){
		// return _doProcess.call(this, "catch", resloved);
	};

	Promise.prototype.finish = function(){

	};

	Promise.all = function(list,onFullFilled,onRejected){
		if(!list.length) {
			onRejected && onRejected();
		}
		return new Promise(function(reslove,reject){
			var max = list.length;
			var promises = list.slice(0);
			var values = [];
			var flag = true;
			for(var i=0,len=max;i<len;i++){
				(function(order){
					var _list = list[order];
					if(isFunction(_list)){
						max--;
						try{
							values[order] = list[order]();
						}catch(e){
							values[order] = e;
							flag = false;
						}
						if(!max){
							flag && reslove(values);
							!flag && reject(values);
						}
						// continue;
					}else if(isPromise(_list)){
						list[order].then(function(data){
							max--;
							values[order] = data;
							if(!max){
								flag && reslove(values);
							}
						},function(reason){
							max--;
							values[order] = reason;
							if(!max){
								!flag && reject(values);
							}
						});
					}else{
						max--;
						values[order] = _list;
						if(!max){
							flag && reslove(values);
						}
					}
				})(i);
			}
		})
	};
	// return Promise;

	var isPromise = function(obj){
		return (obj && obj.constructor && obj.constructor === Promise)
	}

	var isFunction = function(obj){ return typeof obj === 'function' }

	// new Promise(function(resolve, reject){
	// 	setTimeout(function(){
	// 		console.log("start")
	// 		reject("go to next");
	// 	},1000);
	// }).then(
	// 	function(data){
	// 		var me = this;
	// 		return new Promise(function(reslove,reject){
	// 			setTimeout(function(){
	// 				console.log(data);
	// 				resolve("resloved 1")
	// 			},1000);
	// 		});
	// 	},function(reason){
	// 		return new Promise(function(reslove,reject){
	// 			setTimeout(function(){
	// 				console.log(reason);
	// 				reject("resloved 1")
	// 			},1000);
	// 		});
	// 	}
	// ).then(
	// 	function(data){
	// 		console.log(data);
	// 		return "reslove2 immediately";
	// 	},function(reason){
	// 		console.log(reason);
	// 		return "reject2 immediately";
	// 	}
	// ).then(
	// 	function(data){
	// 		console.log(data);
	// 		return "reslove3 immediately";
	// 	},function(reason){
	// 		console.log(reason);
	// 		return "reject3 immediately";
	// 	}
	// )
	// new Promise
	// .catch(function(data,reslove,reject){
	// 	setTimeout(function(){
	// 	    console.log(data)
	// 	    reject("reject two");
	// 	},1000);
	// }).then(function(data,reslove,reject){
	// 	setTimeout(function(){
	// 	    console.log(data)
	// 	    reslove("three");
	// 	},1000);
	// }).catch(function(data,reslove,reject){
	// 	setTimeout(function(){
	// 	    console.log(data)
	// 	    reslove("four");
	// 	},1000);
	// }).then(function(data,reslove,reject){
	// 	setTimeout(function(){
	// 	    console.log(data)
	// 	    reslove("four");
	// 	},1000);
	// }).finish(function(data,reslove,reject){
	// 	console.log(data);
	// 	console.log("finish")
	// });

	

})()