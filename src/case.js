new Promise(function(resolve, reject){
	setTimeout(function(){
		console.log("start")
		resolve("go to next");
	},1000);
}).then(function(data){
	var me = this;
	return new Promise(function(reslove,reject){
		setTimeout(function(){
			console.log(data);
			reslove("resloved 1")
		},1000);
	});
},function(reason){
	return new Promise(function(reslove,reject){
		setTimeout(function(){
			console.log(reason);
			reject("resloved 1")
		},1000);
	});
}).then(function(data){
	var me = this;
	setTimeout(function(){
		console.log(data);
		return("resloved 2")
	},1000);
},function(reason){
	setTimeout(function(){
		console.log(reason);
		return("reject 2")
	},1000)
});


Promise.all([
	new Promise(function(reslove,reject){
		setTimeout(function(){
			console.log(1);
			reslove(1);
		},1000);
	})
,function(){
	console.log(2);
	return 2;
}]).then(function(data){
	console.log(data);
},function(reasons){
	console.log(reasons);
})