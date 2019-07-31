window.onload = function () {
    c = console.log;
    //取得範圍內隨機正整數的函數
    function getRndInt(num) {
        var rnd = Math.random();
        return parseInt(num * rnd)
    }
    $("button").click(function () {
        var totalNum = $("#totalNum").val();
        var roundNum = $("#roundNum").val();
        var res = [];
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







}