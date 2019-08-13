window.onload = function () {
    var c = console.log;
   //寫出一個Node類
    function Node(src, name) {
        this.src = src;
        this.name = name;
        this.next = null;
        this.prev = null;
    }
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
            this.headNode = null;
        }
    }

    //***這些方法裡面的this會指向調用該方法的實例對象本身***
    //append方法
    CycleLinkedList.prototype.append = function (newNode) {
        //若鍊表為空
        if (this.headNode == null) {
             this.headNode = newNode;
            this.headNode.next = this.headNode;
            this.headNode.prev = this.headNode;
            return
        }
        var headNode = this.headNode;
        var tailNode = headNode.prev;
        //將tailNode接上newNode
        tailNode.next = newNode;
        newNode.prev = tailNode;
        //將newNode接上headNode
        newNode.next = headNode;
        headNode.prev = newNode;
    };
    //remove方法(需傳入刪除目標節點)
    CycleLinkedList.prototype.remove = function (node) {
        var headNode = this.headNode;
        cur = headNode;
        do {
            if (cur == node) {
                //若刪除目標是頭節點，則將頭節點指標指向下一個node
                if (cur == headNode) {
                    //但若只剩下頭節點本身，而且它就是刪除目標，則直接讓頭節點指向空
                    if (cur.next == cur) {
                        this.headNode = null;
                        return
                    } else {
                        this.headNode = cur.next;
                    };
                }
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
    var isPlaying = false;
    var repeatState = 0;
    var randomState = false;
    //初始化：將cur指向第第一首歌，然後執行changeSong()
    var cur = songList.headNode;
    changeSong();
    //將所有相關的點擊事件委託給body監聽
    body.addEventListener("click", function (event) {
        switch (event.target.id) {
            //點擊上一首
            case "prevBtn":
                cur = cur.prev;
                changeSong();
                break
            //點擊下一首
            case "nextBtn":
                cur = cur.next;
                changeSong();
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
                    //清空randomNodeArray
                    randomNodeArray = [];
                    //將selectedSongs.list中的node取出塞到randomNodeArray中(此時是有序的)
                    selectedSongs.list.travel(function (node) {
                        randomNodeArray.push(node);
                    })
                    //將randomNodeArray隨機排序
                    randomNodeArray = randomNodeArray.slice().sort(function () { return 0.5 - Math.random() })
                    //創建一個隨機排列的歌曲列表
                    randomSongList = new CycleLinkedList(randomNodeArray);
                    //將cur切換到此播放列表的軌道上並播放
                    cur = randomSongList.headNode;
                    changeSong();
                    //更改按鈕樣式
                    randomBtn.style.color = "rgba(0, 0, 0, 1)";
                    //看看這列表長什麼樣子
                    randomSongList.travel(function (node) {
                        c(node.name);
                    });
                } else {
                    //取得selectedSongs中的<li>
                    var liArray = document.querySelectorAll("#selectedSongs>li");
                    //創建一個li.node的容器
                    var selectedSongsNodeArray = [];
                    //將node依序推入容器中
                    liArray.forEach(function (li) {
                        selectedSongsNodeArray.push(li.node);
                    });
                    //將selectedSongs.list指向新的CycleLinkedList
                    selectedSongs.list = new CycleLinkedList(selectedSongsNodeArray);
                    //將cur切換回此播放列表的軌道上並更換歌曲
                    cur = selectedSongs.list.headNode;
                    changeSong();
                    //更改按鈕樣式
                    randomBtn.style.color = "";
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
    //切換歌曲的函數
    function changeSong() {
        audio.src = cur.src;
        nowPlayingInfo.innerText = cur.name;
        isPlaying = true;
        refreshPlayingState();
        //將上一首、下一首的title做修改(設定定時器是確保修改是發生在雙擊造成的node的轉移之後)
        setTimeout(function () {
            document.querySelector("#nextBtn").title = "下一首:  " + cur.next.name;
            document.querySelector("#prevBtn").title = "上一首:  " + cur.prev.name;
        }, 20);
    }
	//結束時自動切換下一首
    audio.addEventListener("ended", function () {
        //1表示不循環播放的狀態
        if (repeatState == 1) {
            //下一首歌為第一首則停止播放
            if (cur.next == songList.headNode || cur.next == selectedSongs.list.headNode) {
                isPlaying = false;
                refreshPlayingState();
            } else {
                cur = cur.next;
                changeSong();
            };
        }
        //2表示單曲循環播放
        else if (repeatState == 2) {
            audio.currentTime = 0;
            audio.play();
        }
        //0表示循環播放
        else {
            cur = cur.next;
            changeSong();
        }
    });
	//創建所有歌曲列表
    var allSongs = document.querySelector("#allSongs");
    allSongs.list = songList;
    songList.travel(function (node) {
        //創建一個<li>
        var li = document.createElement("li");
        //將相關資訊丟進<li>
        li.innerText = node.name;
        li.node = node;
        //將<li>丟進allSongs
        allSongs.appendChild(li);
    });
	//創建另一個循環鍊表及歌單，用來給用戶客製化歌單
    var selectedSongs = document.querySelector("#selectedSongs");
    selectedSongs.list = new CycleLinkedList();
    //監聽歌曲列表的雙擊事件的函數
    function changeSongPosition(originUl, targetUl) {
        originUl.addEventListener("dblclick", function (event) {
            //將該node從原先的播放列表移除
            originUl.list.remove(event.target.node);
            //將該node添加到目標對應的歌曲鍊表
            targetUl.list.append(event.target.node);
            //將originUl中的<li>添加到selectSongs
            targetUl.appendChild(event.target);
            /*將該<li>從列表刪除：這一步不必操作，因為上面已經將originUl的event.target直接丟進targetUl
            這個動作會直接讓原本在originUl的event.target消失*/
        });
    };
    changeSongPosition(allSongs, selectedSongs);
    changeSongPosition(selectedSongs, allSongs);
    //點擊歌單中的歌
    body.addEventListener("click", function (event) {
        var songNode = event.target.node;
        if (songNode instanceof Node) {
            //將cur指向該歌曲並切歌
            cur = songNode;
            changeSong();
        }
    });
	
	
	
	//對拉bar的控制
	function barControl(target, mousedownCallback=function(){}, mousemoveCallBack=function(){}, mouseupCallBack=function(){}){
		var barBg = target.children[0];
		var barFg = barBg.children[0];
		//監聽target的mousedown事件
		target.addEventListener("mousedown", function(event){
			var value;
			//mousedown後立即改變barFg
			var offsetX = event.offsetX;
			barFg.style.width = offsetX + "px";
			//計算相對長度
			value = event.offsetX / target.clientWidth;
			//執行回調函數
			mousedownCallback(value);
			//mousemove的函數
			function mousemove(event){
				//計算barFg應有長度
				var length = event.pageX - target.offsetLeft
				//修正計算結果
				if (length < 0){
					length = 0;
				}else if (length > target.clientWidth){
					length = target.clientWidth;
				};
				//改變barFg
				barFg.style.width = length + "px";
				//計算相對長度
				value = length / target.clientWidth;
				//執行回調函數
				mousemoveCallBack(value);
			};
			//mouseup時的函數
			function mouseup(){
				//移除window的mousemove事件
				window.removeEventListener("mousemove", mousemove);
				//執行回調函數
				mouseupCallBack(value);
				//移除window的mouseup事件
				window.removeEventListener("mouseup", mouseup);
			}
			//mousedown後監聽window的mousemove及mouseup事件
			window.addEventListener("mousemove", mousemove);
			window.addEventListener("mouseup", mouseup);
		});
	}
	//改變音量的函數
	function changeVol(value){
		audio.volume = value;
	};
	//改變進度的函數
	function changeProgress(value){
		audio.currentTime = audio.duration * value;
	};
	//設置音量條
	barControl(document.querySelector("#volBar"), changeVol, changeVol);
	//設置進度條
	barControl(document.querySelector("#progressBar"),function(){
		//點擊後移除audio播放時同步刷新進度條的行為
		audio.removeEventListener("timeupdate", timeupdate);
	},function(){},function(value){
		changeProgress(value);
		//放開後恢復audio播放時同步刷新進度條的行為
		audio.addEventListener("timeupdate", timeupdate);
	});
	//監聽audio的播放事件
	function timeupdate(){
		var value = audio.currentTime / audio.duration;
		var progressBar = document.querySelector("#progressBar");
		var progressBarFg = document.querySelector("#progressBar .barFg");
		progressBarFg.style.width = progressBar.clientWidth * value + "px";
	}
	audio.addEventListener("timeupdate", timeupdate);

    var testBtn = document.querySelector("#testBtn");
    testBtn.onclick = function () {
        c(allSongs.list);
		c(selectedSongs.list);
    };
	

	
	
	
	
	
	
	
	
	
	
	
	
	
}