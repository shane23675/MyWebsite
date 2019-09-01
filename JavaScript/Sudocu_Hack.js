window.onload = function () {
    var c = console.log;

    
    $("#submitBtn").click(sudocu);
    $("#showBtn").click(function () {
        c(box9x9);
    });
    //box9x9：表示整個數獨9x9方格，以行排序
    var box9x9 = [];
    //往兩種box9x9中添加9個陣列
    for (var i = 0; i < 9; i++) {
        box9x9.push([]);
    }
    //給box9x9添加一個遍歷所有內部項目的方法                    
    box9x9.checkAll = function (callBack) {
        //將各個box依序傳入回調函數中
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                callBack(this[i][j]);
            }
        }
    }
    //主程序
    var editFlag;
    function sudocu() {
        var task = document.querySelector("#task").value;
        //007000302200005010000801400010096008760000049000000000000103000801060000000700063
        //初始化：若box9x9中已經有東西則清空
        if (box9x9[0].length != 0) {
            box9x9.splice(0, 9);
            for (var i = 0; i < 9; i++) {
                box9x9.push([]);
            }
        }
        //將task中的數字變成box物件並丟入box9x9
        for (var i = 0; i < 81; i++) {
            var row = parseInt(i / 9);
            var column = i % 9;
            var box = new Box(parseInt(task[i]), row, column);
            box9x9[row].push(box);
        }
        editFlag = true;
        while (editFlag) {
            editFlag = false;
            box9x9.checkAll(refreshPArray);
            fillByBlock();
            box9x9.checkAll(refreshPArray);
            box9x9.checkAll(fillByPArray);
        }
        showBox9x9();
    }
    //查看Box9x9的函數
    function showBox9x9() {
        for (var i = 0; i < 9; i++) {
            var str = "";
            for (var j = 0; j < 9; j++) {
                str += box9x9[i][j].value + ", ";
            }
            c(str);
        }
    }
    //Box類：用來表示每個小格子
    function Box(value, row, column) {
        //value表示其對應的值(0表示未知)
        this.value = value;
        //row及column紀錄位置，block紀錄在第幾個3x3的中格子
        this.row = row;
        this.column = column;
        this.block = parseInt(row / 3) * 3 + parseInt(column / 3);
        //p為可能的值(當value為0時)，預設為1~9
        if (value == 0) {
            this.pArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        } else {
            this.pArray = [];
        }
    }
    //遍歷某格其對應的3x3Block的函數
    function check3x3(box, callBack) {
        var rowStart = parseInt(box.row / 3) * 3;
        var columnStart = parseInt(box.column / 3) * 3;
        for (var i = rowStart; i < rowStart + 3; i++) {
            for (var j = columnStart; j < columnStart + 3; j++) {
                //將此block中的各個box依序傳入回調函數中
                callBack(box9x9[i][j]);
            }
        }
    }
    //刷新某格可能性的函數
    function refreshPArray(box) {
        //若該box有值則不必檢查
        if (box.value != 0) return
        //橫向的row檢查
        var row = box.row;
        box9x9[row].forEach(function (item) {
            //依序將box.pArray的對應數字移除(item.value為該row的各格數字)
            var index = box.pArray.indexOf(item.value);
            if (index != -1) {
                box.pArray.splice(index, 1);
            }
        });
        //縱向的column檢查
        var column = box.column;
        box9x9.forEach(function (item) {
            //依序將box.pArray的對應數字移除(item[column].value為該column的各格數字)
            var index = box.pArray.indexOf(item[column].value);
            if (index != -1) {
                box.pArray.splice(index, 1);
            }
        })
        //3x3區塊block檢查
        check3x3(box, function (b) {
            var index = box.pArray.indexOf(b.value);
            if (index != -1) {
                box.pArray.splice(index, 1);
            }
        });
    }
    //將可能性只有一個的box填入的函數(回傳值表示有沒有對整個box9x9造成改變)
    function fillByPArray(box) {
        //若box已有值則跳過
        if (box.value != 0) { return }
        if (box.pArray.length == 1) {
            box.value = box.pArray[0];
            //有填入則改變editFlag
            editFlag = true;
        }
    }
    //檢查每個3x3方格是否有數可以填入的函數
    function fillByBlock() {
        //依序傳入每個block的第一個box(座標為(0, 0), (0, 3), (0, 6), (3, 0), ... , (6, 6))
        for (var i = 0; i< 9; i += 3) {
            for (var j = 0; j < 9; j += 3) {
                //用isChanged來記錄此3x3方塊是否有被填入，如果有則必須不斷檢查
                var isChanged;
                do {
                    isChanged = false;
                    //用來記錄這個block沒有的數字的矩陣
                    var absentValueArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    //檢查其對應的block，將已經存在的數字移出absentValueArray
                    check3x3(box9x9[i][j], function (box) {
                        var index = absentValueArray.indexOf(box.value);
                        if (index != -1)
                            absentValueArray.splice(index, 1);
                    });
                    //遍歷exintingValueArray，若某數只在整個3x3方塊的pArray中出現一次則填入
                    absentValueArray.forEach(function (item) {
                        //用來紀錄找到的box
                        var cur;
                        //isRepeated用來記錄是否找到兩個以上，如果是則不填入
                        var isRepeated = false;
                        check3x3(box9x9[i][j], function (box) {
                            //若該box已有值則跳過
                            if (box.value != 0) { return }
                            var index = box.pArray.indexOf(item);
                            if (index != -1) {
                                if (cur) {
                                    isRepeated = true;
                                } else {
                                    cur = box;
                                }
                            }
                        });
                        //檢查完此方格的該數字(item)了，若無重複則填入並清空cur、改變isChanged、editFlag
                        if (!isRepeated && cur) {
                            cur.value = item;
                            cur = undefined;
                            isChanged = true;
                            editFlag = true;
                        }
                    });
                } while (isChanged);
            }
        }
    }
}