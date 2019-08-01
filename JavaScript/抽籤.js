window.onload = function () {
    var c = console.log;
    //取得範圍內隨機正整數的函數
    function getRndInt(num) {
        var rnd = Math.random();
        return parseInt(num * rnd)
    }
	//抽籤鈕
    $("button").click(function () {
		//清除section中的內容
		$("section").empty();
        var totalNum = $("#totalNum").val();
        var roundNum = $("#roundNum").val();
        var res = [];
		//若抽籤次數過大會造成當機，攔截並彈出提示
		if (roundNum > 10000000){
			alert("避免系統崩潰，抽籤不得超過一千萬次\n將自動調整為一千萬次")
			$("#roundNum").val(10000000);
			roundNum = 10000000;
		};
        //為res創建roundNum個項，值都是0
        for (var i = 0; i < totalNum; i++) {
            res[i] = 0;
        };
        //抽到的項次增加1，紀錄次數
        for (var i = 0; i < roundNum; i++) {
            res[getRndInt(totalNum)] += 1;
        };
        //用結果來創建長條圖
        //先找到抽籤結果最大值
        var max = 0;
        res.forEach(function (item, index) {
            if (item > max) {
                max = item;
            }
        });
        //創建長條圖，並將最大值div用紅色標註
        res.forEach(function (item, index) {
            if (item == max) {
                var div = "<div class='maxDiv'>" + (index + 1) + "號" + item + "次</div>";
            } else {
                var div = "<div style='width: " + (item / max * 100) + "%'>" + (index + 1) + "號" + item + "次</div>";
            }
            $("main section").append(div);
        });
        
    });
	//刷新頁面時聚焦於總人數輸入框
	$("#totalNum").focus();
	//在總人數輸入框中按enter可以跳到抽籤次數輸入框
	$("#totalNum").keypress(function(event){
		if (event.which == 13){
			$("#roundNum").focus();
			//清空抽籤次數輸入框
			$("#roundNum").val("");
		};
	});
	//在抽籤次數輸入框中按enter可以觸發抽籤鈕
	$("#roundNum").keypress(function(event){
		if (event.which == 13){
			$("button").trigger("click");
			//跳回總人數輸入框
			$("#totalNum").focus();
			//清空總人數輸入框
			$("#totalNum").val("");
		};
	});

	



}