window.onload = function () {
    var c = console.log;
   //寫出一個Node類
    function SongNode(src, name) {
        this.src = src;
        this.name = name;
        this.next = null;
        this.prev = null;
    }
    //var song1 = new SongNode(src, name)

    //寫出一個雙向循環鍊表
    function CycleLinkedList(nodeArray) {
        //儲存CycleLinkedList的this
        var cllThis = this;
        //指標cur, 頭節點headNode
        var cur, headNode;
        if (nodeArray && Array.isArray(nodeArray)) {
            nodeArray.forEach(function (item, index, arr) {
                //第一個Node變成頭
                if (index == 0) {
                    cllThis.headNode = item;
                    headNode = item;
                    cur = item;
                    //若arr長度為1則頭要自己接自己
                    if (arr.length == 1) {
                        item.prev = item;
                        item.next = item;
                    }
                }
                //最後一個Node要特別處理
                else if (index == arr.length - 1) {
                    //一樣接前面
                    item.prev = cur;
                    cur.next = item;
                    //後面接頭
                    item.next = headNode;
                    headNode.prev = item;
                }
                //中間的Node接前後
                else {
                    //接前面(前面的next是我，我的prev是前面)
                    item.prev = cur;
                    cur.next = item;
                    //讓cur往下走
                    cur = item;
                }
            });
        } else {
            c("please use an array as parameter")
        }
    }
    //append方法
    CycleLinkedList.prototype.append = function (src, name) {
        //創建一個SongNode對象
        var song = new SongNode(src, name);

    }

    //測試囉
    var song1 = new SongNode("src1", "name1");
    var song2 = new SongNode("src2", "name2");
    var song3 = new SongNode("src3", "name3");
    var nodeArray = [song1, song2, song3];

    var songList = new CycleLinkedList(nodeArray);
    c(songList.headNode)
    c(songList.headNode.next)
    c(songList.headNode.prev)





}