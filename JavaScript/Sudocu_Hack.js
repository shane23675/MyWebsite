window.onload = function () {
    var c = console.log;
    $("#submitBtn").click(function () {
        sudocu(document.querySelector("#task").value);
    });
    var s, b99;
    $("#showBtn").click(function () {
        s();
        c(b99);
    });
    var str = "";
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (input[i][j] == ".") {
                str += "0";
            } else {
                str += input[i][j];
            }
        }
    }
    sudocu(str)
    //主程序
    var trial = 0;
    function sudocu(task) {
        s = showBox9x9;
        var editFlag;
        //box9x9：表示整個數獨9x9方格，以行排序
        var box9x9 = [];
        //往兩種box9x9中添加9個陣列
        for (var i = 0; i < 9; i++) {
            box9x9.push([]);
        }
        //將task中的數字變成box物件並丟入box9x9
        for (var i = 0; i < 81; i++) {
            var row = parseInt(i / 9);
            var column = i % 9;
            var box = new Box(parseInt(task[i]), row, column, i);
            box9x9[row].push(box);
        }
        //開始填入
        editFlag = true;
        while (editFlag) {
            pArrayEmptyFlag = false;
            editFlag = false;
            checkAll(refreshPArray);
            fillByBlock();
            checkAll(refreshPArray);
            checkAll(fillByPArray);
            if (pArrayEmptyFlag) {
                trial++;
                return
            }
        }
        //完成
        if (completeCheck()) {
            //c("完成!!");
            //showBox9x9();
            //b99 = box9x9;
            //setTimeout(function () {
            //    c("失敗的嘗試：" + trial + "次");
            //}, 200);
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    input[i][j] = box9x9[i][j].value.toString();
                }
            }
        }
        //未完成，進行分支運算
        else {
            //找到第一個0
            var cur;
            var first = true;
            checkAll(function (box) {
                if (!first) { return }
                if (box.value == 0) {
                    cur = box;
                    first = false;
                }
            });
            //取得當前box9x9字串
            var box9x9str = getBox9x9InLine();
            //取得前後部分(index本身不要)
            var index = cur.index;
            var box9x9ForeStr = box9x9str.slice(0, index);
            var box9x9BackStr = box9x9str.slice(index + 1);
            box9x9ForeStr = box9x9ForeStr == null ? "" : box9x9ForeStr;
            box9x9BackStr = box9x9BackStr == null ? "" : box9x9BackStr;
            //進行分支運算
            for (var i = 0; i < cur.pArray.length; i++) {
                var newTask = box9x9ForeStr + cur.pArray[i] + box9x9BackStr;
                sudocu(newTask);
            }
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
        //取得整串的box9x9的函數
        function getBox9x9InLine() {
            var result = "";
            checkAll(function (box) {
                result += box.value;
            })
            return result
        }
        //遍歷所有box9x9內部項目的方法
        function checkAll(callBack) {
            //將各個box依序傳入回調函數中
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    callBack(box9x9[i][j]);
                }
            }
        }
        //檢查是否完成的函數
        function completeCheck() {
            var flag = true;
            checkAll(function (box) {
                if (box.value == 0) {
                    flag = false;
                }
            });
            return flag
        }
        //Box類：用來表示每個小格子
        function Box(value, row, column, index) {
            //value表示其對應的值(0表示未知)
            this.value = value;
            //row及column紀錄位置，index紀錄索引值
            this.row = row;
            this.column = column;
            this.index = index;
            //p為可能的值(當value為0時)，預設為1~9
            if (value == 0) {
                this.pArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            } else {
                this.pArray = [];
                this.pArray[0] = this.value;
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
        var pArrayEmptyFlag = false;
        function refreshPArray(box) {
            //橫向的row檢查
            var row = box.row;
            box9x9[row].forEach(function (item) {
                //若item就是自己則跳過
                if (item == box) {return}
                //依序將box.pArray的對應數字移除(item.value為該row的各格數字)
                var index = box.pArray.indexOf(item.value);
                if (index != -1) {
                    box.pArray.splice(index, 1);
                }
            });
            //縱向的column檢查
            var column = box.column;
            box9x9.forEach(function (item) {
                //若item[column]就是自己則跳過
                if (item[column] == box) { return }
                //依序將box.pArray的對應數字移除(item[column].value為該column的各格數字)
                var index = box.pArray.indexOf(item[column].value);
                if (index != -1) {
                    box.pArray.splice(index, 1);
                }
            })
            //3x3區塊block檢查
            check3x3(box, function (b) {
                //若b就是自己則跳過
                if (b == box) {return}
                var index = box.pArray.indexOf(b.value);
                if (index != -1) {
                    box.pArray.splice(index, 1);
                }
            });
            //檢查完後，若pArray為空則改變pArrayEmptyFlag(表示異常)
            if (box.pArray.length == 0)
                pArrayEmptyFlag = true;
        }
        //將可能性只有一個的box填入的函數
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
            for (var i = 0; i < 9; i += 3) {
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
                            //檢查完此方格的該數字(item)了，若無重複則填入並改變pArray、清空cur、改變isChanged、editFlag
                            if (!isRepeated && cur) {
                                cur.value = item;
                                cur.pArray = [];
                                cur.pArray.push(item)
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
}