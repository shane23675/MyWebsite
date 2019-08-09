window.onload = function () {
    var c = console.log;
   //寫出一個Node類
    function Node(src, name) {
        this.src = src;
        this.name = name;
        this.next = null;
        this.prev = null;
    }
    //var song1 = new Node(src, name)

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

    //***這些方法裡面的this會指向調用append方法的實例對象本身***
    //append方法
    CycleLinkedList.prototype.append = function (src, name) {
        //創建一個Node對象
        var newNode = new Node(src, name);
        var headNode = this.headNode;
        var tailNode = headNode.prev;
        //將tailNode接上newNode
        tailNode.next = newNode;
        newNode.prev = tailNode;
        //將newNode接上headNode
        newNode.next = headNode;
        headNode.prev = newNode;
    };
    //remove方法(需傳入刪除目標名稱)
    CycleLinkedList.prototype.remove = function (name) {
        var headNode = this.headNode;
        cur = headNode;
        do {
            if (cur.name == name) {
                //將cur的前後節點相接
                cur.prev.next = cur.next;
                cur.next.prev = cur.prev;
                break
            } else {
                cur = cur.next;
            };
        } while (cur != headNode);
    };
	//遍歷方法(需傳入一個回調函數)
	CycleLinkedList.prototype.travel = function (callback) {
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
		new Node("music/買辣椒也用券《起風了》.mp3", "起風了"),
		new Node("music/陳雪凝 - 綠色.mp3", "綠色"),
		new Node("music/高爾宣 OSN -【最後一次】The Last Time.mp3", "最後一次"),
		new Node("music/卓義峯 Yifeng Zhuo -〈再見煙火〉Goodbye Firework.mp3", "再見煙火"),
		new Node("music/李榮浩 Ronghao Li - 年少有為 If I Were Young .mp3", "年少有為"),
        new Node("music/SHAUN – Way Back Home (feat. Conor Maynard).mp3", "Way Back Home"),
        new Node("music/Maroon 5 - Girls Like You ft. Cardi B.mp3", "Girls Like You"),
        new Node("music/LSD - Thunderclouds (Official Video) ft. Sia, Diplo, Labrinth.mp3", "Thunderclouds"),
        new Node("music/LSD - Genius ft. Sia, Diplo, Labrinth.mp3", "Genius"),
        new Node("music/Imagine Dragons - Thunder.mp3", "Thunder"),
        new Node("music/Eric周興哲《 如果雨之後 The Chaos After You 》.mp3", "如果雨之後"),
        new Node("music/《你要的全拿走》胡彥斌.mp3", "你要的全拿走"),
        new Node("music/《体面》 Kelly于文文 .mp3", "體面")
    ];
    var randomNodeArray;
    var randomSongList;
    var songList = new CycleLinkedList(nodeArray);
	var audio = document.querySelector("audio");
    var body = document.querySelector("body");
    var nowPlayingInfo = document.querySelector("#nowPlayingInfo");
    var cur = songList.headNode;
    var isPlaying = false;
    var repeatState = 0;
    var randomState = false;
    audio.src = cur.src;
    nowPlayingInfo.innerText = cur.name;
    //將所有相關的點擊事件委託給body監聽
    body.addEventListener("click", function (event) {
        switch (event.target.id) {
            //點擊上一首
            case "prevBtn":
                cur = cur.prev;
                audio.src = cur.src;
                nowPlayingInfo.innerText = cur.name;
                isPlaying = true;
                refreshPlayingState();
                break
            //點擊下一首
            case "nextBtn":
                nextSong();
                break
            //點擊播放按鈕
            case "playBtn":
                if (isPlaying) {
                    audio.pause();
                } else {
                    audio.play();
                }
                //改變播放狀態
                isPlaying = !isPlaying;
                refreshPlayingState();
                break
            //點擊倒退按鈕
            case "backwardBtn":
                audio.currentTime -= 10;
                break
            //點擊快進按鈕
            case "forwardBtn":
                audio.currentTime += 10;
                break
            //循環播放鈕
            case "repeatBtn":
                var repeatBtn = document.querySelector("#repeatBtn")
                repeatState++;
                repeatState %= 3;
                switch (repeatState) {
                    //0: 循環播放
                    case 0:
                        repeatBtn.innerText = "repeat";
                        repeatBtn.style.color = "rgba(0, 0, 0, 1)";
                        break
                    //1: 不循環播放
                    case 1:
                        repeatBtn.style.color = "rgba(0, 0, 0, 0.3)";
                        break
                    //2: 單曲循環播放
                    case 2:
                        repeatBtn.innerText = "repeat_one";
                        repeatBtn.style.color = "rgba(0, 0, 0, 1)";
                        break
                }
                break
            //隨機播放鈕
            case "randomBtn":
                var randomBtn = document.querySelector("#randomBtn");
                //改變隨機狀態
                randomState = !randomState;
                if (randomState) {
                    //獲得一個隨機排列的nodeArray
                    randomNodeArray = nodeArray.slice().sort(function () { return 0.5 - Math.random() })
                    //創建一個隨機排列的歌曲列表
                    randomSongList = new CycleLinkedList(randomNodeArray);
                    //將cur切換到此播放列表的軌道上
                    cur = randomSongList.headNode.prev;
                    //更改按鈕樣式
                    randomBtn.style.color = "";
                    //看看這列表長什麼樣子
                    randomSongList.travel(function (node) {
                        c(node.name);
                    });
                } else {
                    //將cur切換回原先播放列表的軌道上
                    cur = songList.headNode.prev;
                    //更改按鈕樣式
                    randomBtn.style.color = "rgba(0, 0, 0, 0.3)";
                }
                break
            //刪除歌曲的按鈕
            case "delBtn":
                var delSongName = document.querySelector("#delSongName").value;
                songList.remove(delSongName);
                break
        }
    })
	//更新目前撥放狀態的函數
    function refreshPlayingState() {
        //更改播放鍵圖示
        if (isPlaying) {
            document.querySelector("#playBtn").className = "controlBtn fas fa-pause";
        } else {
            document.querySelector("#playBtn").className = "controlBtn fas fa-play";
        };
    }
    //切換下一首的函數
    function nextSong() {
        cur = cur.next;
        audio.src = cur.src;
        nowPlayingInfo.innerText = cur.name;
        isPlaying = true;
        refreshPlayingState();
    }
	//結束時自動切換下一首
    audio.addEventListener("ended", function () {
        //1表示不循環播放的狀態
        if (repeatState == 1) {
            //下一首歌為第一首則返回
            if (cur.next == songList.headNode) { return }
            nextSong();
        }
        //2表示單曲播放
        else if (repeatState == 2) {
            audio.currentTime = 0;
            audio.play();
        }
        //0表示循環播放
        else {
            nextSong();
        }

    });
	
	
	




	
	
	



}