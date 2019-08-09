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
		//***這裡面的this會指向調用append方法的實例對象本身***
        //創建一個SongNode對象
        var newNode = new SongNode(src, name);
		var headNode = this.headNode;
		var tailNode = headNode.prev;
		//將tailNode接上newNode
		tailNode.next = newNode;
		newNode.prev = tailNode;
		//將newNode接上headNode
		newNode.next = headNode;
		headNode.prev = newNode;
    }
	//遍歷方法(需傳入一個回調函數)
	CycleLinkedList.prototype.travel = function (callback) {
		//***這裡面的this會指向調用append方法的實例對象本身***
		//將該CycleLinkedList實例對象中的每個節點輪流傳入callback
		var cur = this.headNode;
		//若該實例對象中無任何節點則返回
		if (!cur){return};
		do {
			callback(cur);
			cur = cur.next;
		} while (cur != this.headNode);
		
	};

    //測試囉
    var nodeArray = [
		new SongNode("music/買辣椒也用券《起風了》.mp3", "起風了"),
		new SongNode("music/陳雪凝 - 綠色.mp3", "綠色"),
		new SongNode("music/高爾宣 OSN -【最後一次】The Last Time.mp3", "最後一次"),
		new SongNode("music/卓義峯 Yifeng Zhuo -〈再見煙火〉Goodbye Firework.mp3", "再見煙火"),
		new SongNode("music/李榮浩 Ronghao Li - 年少有為 If I Were Young .mp3", "年少有為")
	];
    var songList = new CycleLinkedList(nodeArray);
	
	var audio = document.querySelector("audio");
	var prevBtn = document.querySelector("#prevBtn");
	var playBtn = document.querySelector("#playBtn");
	var nextBtn = document.querySelector("#nextBtn");
	var cur = songList.headNode;
	audio.src = cur.src;
	prevBtn.addEventListener("click", function(){
		cur = cur.prev;
		audio.src = cur.src;
	}); 
	nextBtn.addEventListener("click", function(){
		cur = cur.next;
		audio.src = cur.src;
	}); 
	
	
	
	
	
	
	
	
	
	
	



}