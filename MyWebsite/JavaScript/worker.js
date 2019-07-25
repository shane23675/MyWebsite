/*多線程*/
//耗時的費波納契數列計算
function fibonacci(n){
	var result = (n > 2) ? ( fibonacci(n-1) + fibonacci(n-2)) :  1;
	return result
};
var onmessage = function(event){
	console.log(event.data)
	var result = fibonacci(event.data);
	postMessage(result);
};