var c = console.log;

//頂部左側導航欄
var button_side_nav = document.querySelector("nav span:first-child"); //左上角的按鈕
var sideNav = document.querySelector("#side-nav");      //左側導航欄
var songList = document.querySelector("#songList");     //歌曲播放列表
function main_menu(){
	if (parseInt(window.getComputedStyle(sideNav).width) == "0"){
		sideNav.style.width = "300px";
		songList.style.left = "300px";
		button_side_nav.style.color = "black";
	}else{
		sideNav.style.width = "0px";
		songList.style.left = "0px";
		button_side_nav.style.color = "gray";
	};
};
button_side_nav.onclick = main_menu;




//留言板
//留言區獲得焦點後顯示發表及取消按鍵
$(".message>textarea").focusin(function(){
	$(".message>button").show();
	$(this).css("border-bottom", "4px gray solid");
});
//留言區失去焦點後恢復底線樣式
$(".message>textarea").focusout(function(){
	$(this).css("border-bottom", "");
});
//按下取消鍵後隱藏發表及取消按鍵
$(".cancelMsg").click(function(){
	$(".message>button").hide();
});
//輸入內容後才可以按下發表留言或回覆
//必須使用父級元素委託才能達到實時監聽是否有輸入內容
$("#structure03").delegate("textarea", "propertychange input", function () {
    //如果輸入enter，讓留言板的高度增加
    var enterArray = $(this).val().match(/\n/g);
    //如果enterArray為null，enters = 0
    var enters = (enterArray !== null) ? enterArray.length : 0;
    //根據enters來修改留言板高度
    $(this).css("height", 20 * (enters + 1) + 5 + "px");
    //有輸入非空白內容才能送出
    if (/\S/.test($(this).val())) {
		$(this).next().prop("disabled", false);
		$(this).next().css("background", "blue").css("cursor", "pointer");
	}else{
		$(this).next().prop("disabled", true);
		$(this).next().css("background", "").css("cursor", "");
	};
});
//發表留言
$(".submitMsg").click(function(){
	//若尚未登入，則跳出登入提示訊息
	if (!logInFlag){
		alert("留言前請先登入");
		$logInButton.trigger("click");
		return
	}else{
		let makeSure = confirm("確定要發表留言嗎?");
		if (!makeSure){
			return
		};
	};
	//取得留言內容並創建新的留言元素
	let content = $(".message>textarea").val();
	//將留言內容的\n換為<br>
	content = content.replace(/\n/g, "<br>");
	$("#billboard").prepend($('\
		<div class="aSingleComment clearfix">\
			<div class="userPic"></div>\
			<div class="comment">\
				<span class="userName">'+ userAccount +'</span><span class="userName commentTime">'+ getFormattedTime() +'</span>\
				<p class="commentContent">'+ content +'</p>\
				<p class="showMoreContent">顯示全部內容</p>\
				<div class="toolBar clearfix"  likeFlag="false" dislikeFlag="false">\
					<button class="likeBtn"></button>\
					<span class="likeCounts">0</span>\
					<button class="dislikeBtn"></button>\
					<span class="dislikeCounts">0</span>\
					<button class="replyBtn">回覆</button>\
				</div>\
				<div class="replyBox clearfix">\
					<div class="userPicSmall "></div>\
					<div class="reply">\
						<textarea placeholder="新增公開回覆..."></textarea>\
						<button class="submitReply">回覆</button>\
						<button class="cancelReply">取消</button>\
					</div>\
				</div>\
				<div class="replyDiv"><!--留言中的回覆內容-->\
					<p class="showMoreReply">查看回覆</p>\
				</div>\
			</div>\
		</div>\
	'));
	//將寫入留言的區域清空、高度恢復原狀
    $(".message>textarea").val("");
    $(".message>textarea").css("height", "");
    //讓按鈕的樣式恢復原狀
	$(this).prop("disabled", true);
	$(this).css("background", "").css("cursor", "").css("height", "");
	//自動按下"取消留言"按鍵
	$(".cancelMsg").trigger("click");
	//若新添加的留言長度過長，則將只顯示部分內容，並顯示「顯示全部內容」按鈕
	if($(".aSingleComment").eq(0).find(".commentContent").height() > 108){
		$(".aSingleComment").eq(0).find(".showMoreContent").show();
		$(".aSingleComment").eq(0).find(".commentContent").css("height", "108px");
	};
	//讓新添加的留言產生背景變化效果
	$(".aSingleComment").eq(0).css("animation", "newComment 2s");
});
//按下"顯示全部內容"
$("#structure03").delegate(".showMoreContent", "click", function(){
	console.log($(this).prev().css("height"));
	if ($(this).prev().css("height") == "108px"){
		$(this).prev().css("height", "unset");
		$(this).text("顯示部分內容");
	}else{
		$(this).prev().css("height", "108px");
		$(this).text("顯示全部內容");
	};
});
//按下回覆按鈕
$("#structure03").delegate(".replyBtn", "click", function(){
	//讓回覆框出現
	$(this).parent().next().slideToggle(300);
	//讓回覆輸入框獲得焦點
	$(this).parent().next().find("textarea").focus();
	//讓回覆發表及取消按鈕出現
	$(this).parent().next().find("button").show();
});
//回覆框獲得焦點
$("#structure03").delegate(".reply>textarea", "focusin", function(){
	$(this).css("border-bottom", "4px gray solid");
});
//回覆框失去焦點
$("#structure03").delegate(".reply>textarea", "focusout", function(){
	$(this).css("border-bottom", "");
});
//發表回覆
$("#structure03").delegate(".submitReply", "click", function(){
	//若尚未登入，則跳出登入提示訊息
	if (userAccount == undefined){
		alert("留言前請先登入");
		$logInButton.trigger("click");
		return
	}else{
		let makeSure = confirm("確定要發表回覆嗎?");
		if (!makeSure){
			return
		};
	};
	//取得留言內容並創建新的留言元素
	let content = $(this).prev().val();
	//將留言內容的\n換為<br>
	content = content.replace(/\n/g, "<br>");
	$(this).parents(".comment").find(".showMoreReply").after($('\
			<div class="aSingleReply clearfix">\
				<div class="userPicSmall"></div>\
				<div class="reply"> \
					<span class="userName">'+ userAccount +'</span><span class="userName commentTime">'+ getFormattedTime() +'</span>\
					<p class="commentContent">'+ content +'</p>\
					<p class="showMoreContent">顯示更多內容</p>\
					<div class="toolBar clearfix" likeFlag="false" dislikeFlag="false">\
						<button class="likeBtn"></button>\
						<span class="likeCounts">0</span>\
						<button class="dislikeBtn"></button>\
						<span class="dislikeCounts">0</span>\
					</div>	\
				</div>\
			</div>\
	'));
	//將寫入回覆的區域清空、高度恢復
	$(this).prev().val("");
	$(this).prev().css("height", "");
	//讓回覆按鍵變成無法使用(直到再次輸入內容)
	$(this).prop("disabled", true);
	$(this).css("background", "").css("cursor", "").css("height", "");
	//自動按下"取消回覆"按鍵
	$(this).next().trigger("click");
	//讓新添加的留言產生背景變化效果
	$(this).parents(".aSingleComment").find(".aSingleReply").eq(0).css("animation", "newComment 2s");
	//自動顯示回覆內容
	$(this).parents(".comment").find(".showMoreReply").text("隱藏回覆");
	$(this).parents(".comment").find(".replyDiv").css("height", "unset");
});
//取消回覆
$("#structure03").delegate(".cancelReply", "click", function(){
	$(this).parents(".aSingleComment").find(".replyBtn").trigger("click");
});
//按下喜歡
$("#structure03").delegate(".likeBtn", "click", function(){
	//每個留言都有自己的likeFlag及dislikeFlag屬性
	let likeFlag = $(this).parent().attr("likeFlag") == "true";
	let dislikeFlag = $(this).parent().attr("dislikeFlag") == "true";
	//若按過喜歡，則取消喜歡
	if (likeFlag){
		let likes = parseInt($(this).next().text());
		$(this).next().text(likes - 1);
		$(this).parent().attr("likeFlag","false");
		return
	}else if (dislikeFlag){
		//若已經按過不喜歡才按喜歡，將不喜歡數量-1
		let dislikes = $(this).nextAll(".dislikeCounts").text();
		$(this).nextAll(".dislikeCounts").text(dislikes - 1);
		$(this).parent().attr("dislikeFlag", "false");
	};	
	let likes = parseInt($(this).next().text());
	$(this).next().text(likes + 1);
	$(this).parent().attr("likeFlag", "true");
});
//按下不喜歡
$("#structure03").delegate(".dislikeBtn", "click", function(){
	//每個留言都有自己的likeFlag及dislikeFlag屬性
	let likeFlag = $(this).parent().attr("likeFlag") == "true";
	let dislikeFlag = $(this).parent().attr("dislikeFlag") == "true";
	//若按過不喜歡，則直接返回
	if (dislikeFlag){
		let dislikes = parseInt($(this).next().text());
		$(this).next().text(dislikes - 1);
		$(this).parent().attr("dislikeFlag", "false");
		return
	}else if (likeFlag){
		//若已經按過喜歡才按不喜歡，將喜歡數量-1
		let likes = $(this).prevAll(".likeCounts").text();
		$(this).prevAll(".likeCounts").text(likes - 1);
		$(this).parent().attr("likeFlag", "false");
	};
	let dislikes = parseInt($(this).next().text());
	$(this).next().text(dislikes + 1);
	$(this).parent().attr("dislikeFlag", "true");
});
//按下"顯示回覆"
$("#structure03").delegate(".showMoreReply", "click", function(){
	let show = $(this).parent().css("height");
	if (show == "30px"){
		$(this).parent().css("height", "unset");
		$(this).text("隱藏回覆");
	}else{
		$(this).parent().css("height", "");
		$(this).text("查看回覆");
	};
	
});




//頁面切換
var $structures = $("#main>div");
var $sideNavBtns = $(".sideNavButtons");
//點擊logo可以回到封面
$(".myWebsite").click(function(){
	$structures.hide();
	$structures.eq(0).show();
	//收起左側導航欄
	$("#side-nav").css("width", "0px");
});
//side-nav中的頁面鏈接
for (var i=0; i<$sideNavBtns.length; i++){
	(function (i){$sideNavBtns.eq(i).click(function(){
		$structures.hide();
		$structures.eq(i+1).show();
		//收起左側導航欄(觸發按下左上角菜單鈕的函數)
		main_menu();
	})})(i);
};


//封面輪播圖
var welcomePicturesUl = document.querySelector("#welcomePictures ul:first-child");  //放置圖片的<ul>
var welcomePictureDotsUl = document.querySelector("#welcomePictureDots"); //放置小點點的<ul>
for (var i=0; i<welcomePicturesUl.childElementCount; i++){    //依照放置圖片的數量生成相同的小點點容器<li>並放入<ul>中，達成自適應
	let li = document.createElement("li");    //生成<li>
	welcomePictureDotsUl.appendChild(li);	  //將<li>丟入<ul>
};
var welcomePictureDots = document.querySelectorAll("#welcomePictureDots li"); //輪播圖小點點
welcomePictureDots[0].style.background = "lightgreen"; //將第一個小點先設置為亮綠色
var changeInterval = 3000;    //設置換圖片間隔時間
welcomePicturesUl.style.width = welcomePicturesUl.childElementCount * 400 + "px";  //設置<ul>的寬度等於400乘以圖片數量，達成自適應
var movePictures = function(){
	var left = parseInt(getComputedStyle(welcomePicturesUl).left) - 400; //一次移動400px，等於圖片的寬度
	if (left < (welcomePicturesUl.childElementCount - 1) * -400){        //走到圖片尾端，回到第一張
		left = 0;
	};
	welcomePicturesUl.style.left = left + "px"; //移動圖片
	for (j=0; j<welcomePictureDots.length; j++){  //將所有的點點樣式恢復預設值
			welcomePictureDots[j].style = "";
	};
	var dotIndex = parseInt(left / -400);     //dotIndex值計算出現在是第幾張圖
	welcomePictureDots[dotIndex].style.background = "lightgreen"; //將對應的點點變成亮綠色
};
movePicturesTimer = setInterval(movePictures, changeInterval);
for (i=0; i<welcomePictureDots.length; i++){     //按下點點的動作
	welcomePictureDots[i].index = i;
	welcomePictureDots[i].onclick = function(){
		for (j=0; j<welcomePictureDots.length; j++){  //將所有的點點樣式恢復預設值
			welcomePictureDots[j].style = "";
		};
		welcomePictureDots[this.index].style.background = "lightgreen"; //將自己變成亮綠色
		var left = -400 * this.index;
		welcomePicturesUl.style.left = left + "px";  //將圖片移動至對應位置
	};
};
var welcomePicturesDiv = document.querySelector("#welcomePictures");  //放置圖片<ul>的<div>
welcomePicturesDiv.onmouseover = function(){
	clearInterval(movePicturesTimer);
};
welcomePicturesDiv.onmouseout = function(){
	movePicturesTimer = setInterval(movePictures, changeInterval);
};




//按下網頁蒙版，可以關閉表單等其他用途
var $darkGlass = $("#darkGlass");			  //網頁蒙版
var darkGlassUsage; //用來記錄上次叫出網頁蒙版的用途
var $darkGlassCross = $("#darkGlass>span.icomoon"); //蒙版右上角的X
$darkGlass.click(function(event){			
	if (event.target == this){  
		if (darkGlassUsage == "log in"){
			if(confirm("尚未登入完成，要離開登入頁面嗎?")){
				closeLogInForm();
			};
		}else if (darkGlassUsage == "register"){
			if(confirm("尚未完成註冊，要離開註冊頁面嗎?")){
				closeRegisterForm();
			};
		}else if (darkGlassUsage == "lang-introduction"){ //關閉放大的程式語言介紹
			$langIntroductionZoomInUl.fadeOut(500);
			$darkGlass.fadeOut(500);
			setTimeout(function(){
				//等0.5秒後(上面fadeOut完成)再清空<ul>內容
				$langIntroductionZoomInUl.empty();
			}, 500);
		}else if (darkGlassUsage == "imgZoomIn"){ //關閉放大的圖片
			$("#zoomIn").stop().fadeOut(500);
			$darkGlass.fadeOut(500);
			setTimeout(function(){
				//等0.5秒後(上面fadeOut完成)再清空#zoomIn內容
				$("#zoomIn").empty();
			}, 500);
		}else{
			$darkGlass.fadeOut(500);
		};
	};
});
$darkGlassCross.click(function(){ //點X跟點其他地方作用相同
	$darkGlass.trigger("click"); 
});


//獲得現在時間的函數
var getFormattedTime = function (){
	let d = new Date();
	return d.getFullYear() +"-"+ (d.getMonth()+1) +"-"+ d.getDate() +" "+ d.getHours() +":"+ d.getMinutes() +":"+ d.getSeconds()
}



//頂部導航註冊及登入
//註冊表單
var $registerFormSubmit = $("#registerFormSubmit"); //表單中的註冊按鈕
var $registerFormCancel = $("#registerFormCancel"); //表單中的取消按鈕
var $registerButton = $("#registerButton");   //網頁頁面的註冊按鈕
var $registerForm = $("#registerForm");  	  //註冊表單
var openRegisterForm = function(){			  //開啟註冊表單的函數
	$($darkGlass).fadeIn(500);
	$($registerForm).css("top", "30px");
};
var closeRegisterForm = function(){			  //關閉註冊表單的函數
	$($registerForm).css("top", "");
	$($darkGlass).fadeOut(500);
};
$registerButton.click(function(){			//按下網頁頁面的註冊按鈕
	openRegisterForm();
	darkGlassUsage = "register";			//將網頁蒙版用途改為register
});
$registerFormSubmit.click(function(){		//按下表單中的註冊按鈕
	alert("這個目前只有外殼\n真的註冊系統要等到我會寫資料庫之類的");
	closeRegisterForm();
	return false
});
$registerFormCancel.click(function(){		//按下表單中的取消按鈕
	closeRegisterForm();
	return false
});
//登入表單
var $logInFormSubmit = $("#logInFormSubmit"); //表單中的登入按鈕
var $logInFormCancel = $("#logInFormCancel"); //表單中的取消按鈕
var $logInButton = $("#logInButton");   		//網頁頁面的登入按鈕
var $logInForm = $("#logInForm");  	  		//登入表單
var $userAccount = $(".logInInfo").eq(0); 	//帳號的<input>
var $userPassword = $(".logInInfo").eq(1); 	//密碼的<input>
var userAccount; 							//使用者的帳號資訊
var logInFlag = false;                      //用來記錄目前是否是登入狀態
var accountFlag = false;
var passwordFlag = false;
var openLogInForm = function(){			 	 //開啟登入表單的函數
	$($darkGlass).fadeIn(500);
	$($logInForm).css("top", "30px");
};
var closeLogInForm = function(){			  //關閉登入表單的函數
	$($logInForm).css("top", "");
	$($darkGlass).fadeOut(500);
};
$logInButton.click(function(){			//按下網頁頁面的登入按鈕
	openLogInForm();
	darkGlassUsage = "log in";			//將網頁蒙版用途改為log in
});
$logInFormSubmit.click(function(){		//按下表單中的登入按鈕
	if (accountFlag && passwordFlag){
		userAccount = $userAccount.val(); //確保userAccount不是undifined
		alert("使用者：" + $userAccount.val() + "\n登入成功!!");
		//移除登入&註冊按鍵
		$logInButton.hide();
		$registerButton.hide();
		//顯示使用者資訊
		$("#userInformation").show();
		$("#userInformation>p").text(userAccount);
        closeLogInForm();
        //紀錄為已登入
        logInFlag = true;
	}else{
		alert("帳號或密碼錯誤");
		//清空帳號密碼欄位
		$userAccount.val("");
		$userPassword.val("");
	};
	return false
});
$logInFormCancel.click(function(){		//按下表單中的取消按鈕
	closeLogInForm();
	return false
});
$userAccount.blur(function(){		//失去焦點時檢查帳號
	userAccount = $userAccount.val();
	let result = /^[a-z][0-9|a-z]{5,11}$/i.test(userAccount); //帳號需為英文字母開頭，長度6-12位
	if (!result){ //不符合標準，顯示錯誤訊息
		$(this).css("outline", "5px rgb(255, 0, 0) solid");
		$(".errorMsg").eq(0).show();
		accountFlag = false;
	}else{		//符合標準，隱藏錯誤訊息
		$(this).css("outline", "");
		$(".errorMsg").eq(0).hide();
		accountFlag = true;
	};
});
$userPassword.blur(function(){		//失去焦點時檢查密碼
	let userPassword = $userPassword.val();
	let result = /[a-z]/i.test(userPassword) &&  /[0-9]/.test(userPassword) && /^.{6,12}$/.test(userPassword);//密碼需為英數字組合，長度6-12位
	if (!result){ //不符合標準，顯示錯誤訊息
		$(this).css("outline", "5px rgb(255, 0, 0) solid");
		$(".errorMsg").eq(1).show();
		passwordFlag = false;
	}else{		//符合標準，隱藏錯誤訊息
		$(this).css("outline", "");
		$(".errorMsg").eq(1).hide();
		passwordFlag = true;
	};
});



//清晰模式鈕
$("#cleanModeBtn").click(function(){
    if ($("#main>div").css("background-color") !== "rgb(238, 238, 238)"){
		$("#main>div").css("background", "#EEE");
		$(this).text("一般模式");
	}else{
		$("#main>div").css("background", "");
		$(this).text("清晰模式");
	};
});
//清晰模式提示訊息
$("#cleanModeBtn").hover(function(){
	$("#cleanModeHint").stop().fadeIn(300);
}, function(){
	$("#cleanModeHint").stop().fadeOut(300);
});


//音樂上一首、下一首
//創建音樂對象
function Music(name){   
	this.name = name;
	this.src = "music/" + name + ".mp3";
};
//創建音樂列表
var musicArray = [    
	new Music("買辣椒也用券《起風了》"), 
	new Music("SHAUN – Way Back Home (feat. Conor Maynard)"), 
	new Music("LSD - Genius ft. Sia, Diplo, Labrinth"), 
	new Music("陳雪凝 - 綠色"),
	new Music("LSD - Thunderclouds (Official Video) ft. Sia, Diplo, Labrinth"),
	new Music("Maroon 5 - Girls Like You ft. Cardi B"),
	new Music("Imagine Dragons - Thunder"),
	new Music("李榮浩 Ronghao Li - 年少有為 If I Were Young "),
	new Music("卓義峯 Yifeng Zhuo -〈再見煙火〉Goodbye Firework"),
	new Music("Eric周興哲《 如果雨之後 The Chaos After You 》"),
	new Music("《体面》 Kelly于文文 "),
	new Music("高爾宣 OSN -【最後一次】The Last Time"),
	new Music("《你要的全拿走》胡彥斌")
	//可以直接在此新增歌曲，記得在項目間用逗號區隔
];
//按鈕的操作部分
var $playBtn = $("#playBtn");         //播放按鈕
var $prevSongBtn = $("#prevSongBtn"); //上一首按鈕
var $nextSongBtn = $("#nextSongBtn"); //下一首按鈕
var $randomSongBtn = $("#randomSongBtn"); //隨機播放按鈕
var $showSongListBtn = $("#showSongListBtn"); //顯示播放列表按鈕
var $songList = $("#songList");      //播放列表
var $songListUl = $("#songList>ul"); //播放列表中的<ul>
var $musicAudio = $("#music audio");   //<audio>
var $nowPlayingSongName = $("#nowPlayingSongName");   	//用來顯示當前播放歌曲名稱的<p>
var musicIndex;   			    //要播放的歌曲索引值
var nowPlaying;					//正在播放的曲目Music對象
var $nowPlayingLi;				//正在播放的曲目的<li>
var $shrinkSongListSpan = $("#songList>span:nth-child(2)"); //播放列表右上角的縮小圖示
var $closeSongListSpan = $("#songList>span:nth-child(3)"); //播放列表右上角的X
var deleteSongIndexArray = [];		//已經刪除的曲目的索引值數組
//檢查播放狀態的函數
function checkPlayingState() {
    //取得JS原生對象
    var musicAudio = $musicAudio.get(0);
    //若歌曲正在播放則暫停
    if (!musicAudio.paused) {
        musicAudio.pause();
        //將圖標改為play樣式
        $playBtn.text("");
    }
    //若歌曲目前暫停則播放
    else {
        musicAudio.play();
        //將圖標改為paused樣式
        $playBtn.text("");
    };
}
//按下播放鍵
$playBtn.click(checkPlayingState);
//更換歌曲的函數，若傳入參數x，表示按下"上一首"
function changeSong(x){    
	//將其他<li>中的<span class='icomoon'>移除：
	//首先要知道上次添加<span>的<li>是哪一個  是上次的$nowPlayingLi
	//將<li>中的文字內容儲存在變量中     	  是上次的nowPlaying.name
	if (nowPlaying){ //如果nowPlaying已經被賦值(不是undefined)，表示不是第一次播放音樂(第一次時<span>尚未生成)，才執行清除程序
		//接著將<li>中的<span>清除
		$nowPlayingLi.children(".playingIcon").remove(); //只刪除有.playingIcon的<span>，以免同時刪除掉<span class='deleteSongBtn'>
		//將<li>的背景顏色改回預設值
		$nowPlayingLi.css("background", "");
	};
	//如果準備播放的歌曲已經被刪除，則跳到下一首歌曲
	while($.inArray(musicIndex.toString(), deleteSongIndexArray) != -1){
		if (musicArray.length == deleteSongIndexArray.length){ //如果播放列表的曲目都已被刪除，則使此函數失效
			return
		};
		if (x == "prev"){		//若傳入參數prev，表示按下"上一首"，musicIndex要逐漸減少直到找到不在deleteSongIndexArray中的索引值
			musicIndex--;
			if (musicIndex < 0){
				musicIndex = musicArray.length - 1;
			};
		}else if(x == "random"){		//若傳入參數"random"，表示按下"隨機播放"，musicIndex要逐漸增加直到找到不在deleteSongIndexArray中的索引值
			return $randomSongBtn.trigger("click"); //再次按下隨機播放，讓musicIndex隨機選擇直到它不在deleteSongIndexArray之中
		}else{		//若不傳入參數x，表示按下"下一首"，musicIndex要逐漸增加直到找到不在deleteSongIndexArray中的索引值
			musicIndex++;
			if (musicIndex == musicArray.length){
				musicIndex = 0;
			};
		}; 
	};
	//找到不在deleteSongIndexArray中的索引值後，將歌曲資訊做切換
	nowPlaying = musicArray[musicIndex];
	$nowPlayingSongName.text(nowPlaying.name); //將<p>中的名稱改掉
	$musicAudio.attr("src", nowPlaying.src); //將<audio>中的src修改
	$nowPlayingLi = $($songListLi).eq(musicIndex); //將nowPlayingLi賦值
	$nowPlayingLi.prepend("<span class='icomoon playingIcon'></span>"); //在正在播放的曲目<li>裡面加入一個<span>來裝入icomoon
    $nowPlayingLi.css("background", "white"); //讓正在播放的曲目<li>的背景變成白色
    checkPlayingState() //檢查播放狀態
};
$prevSongBtn.click(function(){  //按下上一首
	musicIndex--;
	if (musicIndex < 0){			//超過索引值的處理
		musicIndex += musicArray.length;
	};
	changeSong("prev"); //傳入"prev"表示按下的是"上一首"
});
$nextSongBtn.click(function(){  //按下下一首
	musicIndex++;
	if (musicIndex == musicArray.length){	//超過索引值的處理
		musicIndex = 0;
	};
	changeSong();
});
$showSongListBtn.click(function(){  //按下顯示播放列表
    if ($songList.css("width") == "300px") {
        //隱藏播放列表
        $songList.css("width", "0px");
        //按鈕顏色恢復原狀
        $showSongListBtn.css("color", ""); 
    } else {
        //顯示播放列表
        $($songList).css("width", "300px"); 
        //按鈕高亮
        $showSongListBtn.css("color", "rgb(104, 255, 142)");
	};	
});
$randomSongBtn.click(function(){  //按下隨機播放
	/* 隨機播放歌曲的原理
	若有10首歌
	則random在0~0.1 選第一首歌(0)
	random在0.1~0.2 選第2首歌(1)
	...
	所以索引值應該是
	Math.random * musicArray.length之後無條件捨去(Math.floor)
	也就是musicIndex = Math.floor(Math.random * musicArray.length)
	*/
	musicIndex = Math.floor(Math.random() * musicArray.length);
	changeSong("random");
});
$shrinkSongListSpan.click(function(){ //按下播放列表右上角的縮小圖示
	if ($($songList).css("height") == "71px"){
		$($songList).css("height", ""); //將播放列表的高度恢復預設值
		$($songList).css("opacity", ""); //將播放列表的透明度恢復預設值
		$($shrinkSongListSpan).text(""); //將右上角的縮小圖示恢復預設值
		$($shrinkSongListSpan).attr("title", "最小化播放列表"); //將右上角的縮小圖示的title恢復預設值
	}else{
		$($songList).css("height", "71px"); //將播放列表的高度變小
		$($songList).css("opacity", "0.2"); //將播放列表的透明度變小
		$($shrinkSongListSpan).text(""); //將右上角的縮小圖示改變
		$($shrinkSongListSpan).attr("title", "還原播放列表"); //將右上角的縮小圖示的title改變
	};
});
$closeSongListSpan.click(function(){ //按下播放列表右上角的X
	$($showSongListBtn).trigger("click"); //觸發按下"隱藏播放列表"
});
/*就為了下面這行代碼搞了很久，有如下的重要啟示：
 *用$符號獲取到的jQuery對象在調用方法、綁定事件時是不能像原生JS那樣做的
 *因為此時操作的事jQuery對象而不是JS的Object
 *兩者的方法和屬性調用方式都不同，務必要注意
 */
$musicAudio.on("ended", function(){ //結束後自動播放下一首
		$($nextSongBtn).trigger("click");
	});
$.each(musicArray, function(index, music){		//將曲目添加到播放列表
	$songListUl.append("<li>" + music.name + "<span class='icomoon deleteSongBtn' title='從播放列表移除' songindex='"+ index +"'></span></li>");	  //把<li>及刪除鈕<span>生成後加入<ul> 同時為<span>添加songIndex屬性
	music.index = index; //為每個Music對象添加一個index屬性，方便使用
});
var $songListLi = $("#songList>ul li"); //播放列表中所有的<li>  在這裡才宣告，否則<li>還未創建
var $deleteSongBtn = $(".deleteSongBtn");  //刪除曲目的<span>
$deleteSongBtn.click(function(){		//按下刪除曲目的X
	deleteSongIndexArray.push($(this).eq(0).attr("songindex"));
	$(this).parent().remove();
	return false //阻止事件冒泡
});
for (var i=0; i<musicArray.length;i++){   //按下播放列表中的<li>可以切換到對應的歌曲
	let index = i;   	//設置index來儲存索引值，以免在調用click函數時出現uncaught error
	$("#songList>ul li").eq(i).click(function(){  
		musicIndex = index;
		changeSong();
	});
};
$randomSongBtn.trigger("click");  //刷新頁面時隨機播放
$songListUl.mCustomScrollbar({		//為<ul>添加自定義滾動條 記得在最後才添加，否則此時曲目<li>尚未生成
	autoHideScrollbar: true,
});  
//音量控制條
//改變變量的函數
function changeValue(event, $target, fn) {
    //取得變量value(0-1之間)
    var value = (event.pageX - $target.offset().left) / $target.innerWidth();
    if (value < 0) {
        value = 0;
    } else if (value > 1) {
        value = 1;
    };
    //改變進度條長度
    //取得內部進度條、小點
    var $bar = $target.find(".bar");
    var $dot = $target.find(".dot");
    //更改bar寬度
    $bar.css("width", $target.innerWidth() * value + "px")
    //更改dot位置
    $dot.css("left", $target.innerWidth() * value - ($dot.innerWidth() / 2) + "px")
    //調用函數fn(最後value要造成的改變)
    fn(value);
}
//監聽音量控制條內的點擊事件
function barControl($target, fn) {
    $target.mousedown(function () {
        //點擊時立刻改變變量
        changeValue(event, $target.find(".barBg"), fn);
        //點擊後移動滑鼠同步改變變量
        $(window).mousemove(function () {
            changeValue(event, $target.find(".barBg"), fn);
        });
        //放開滑鼠後，清除mousemove事件
        $(window).mouseup(function () {
            $(window).off("mousemove");
        });
    })
}
//監控音量控制條
barControl($("#volumeBar"), function (value) {
    $musicAudio.get(0).volume = value;
});
//監控音樂進度控制條
barControl($("#musicProgressBar"), function (value) {
    $musicAudio.get(0).currentTime = value * $musicAudio.get(0).duration;
});
//當音樂在播放時同步進度條
$musicAudio.on("timeupdate", function () {
    var progress = $musicAudio.get(0).currentTime / $musicAudio.get(0).duration;
    //改變進度條長度
    $barBg = $("#musicProgressBar .barBg");
    //取得內部進度條、小點
    var $bar = $barBg.find(".bar");
    var $dot = $barBg.find(".dot");
    //更改bar寬度
    $bar.css("width", $barBg.innerWidth() * progress + "px")
    //更改dot位置
    $dot.css("left", $barBg.innerWidth() * progress - ($dot.innerWidth() / 2) + "px")
    //更改時間訊息
    //格式化時間的函數
    function getFormatedTime(t) {
        var min = Math.floor(t / 60);
        var sec = parseInt(t % 60);
        if (min < 10) {
            min = "0" + min;
        } else {
            min = min.toString();
        };
        if (sec < 10) {
            sec = "0" + sec;
        } else {
            min = min.toString();
        };
        return min + ":" + sec
    }
    //獲得格式化的timeInfo
    //$musicAudio.get(0).duration可能是NaN，所以要先進行處理
    var duration = (isNaN($musicAudio.get(0).duration)) ? (0) : ($musicAudio.get(0).duration)
    var timeInfo = getFormatedTime($musicAudio.get(0).currentTime) + "/" + getFormatedTime(duration);
    //將timeInfo輸出
    $(".timeInfo").text(timeInfo);
});



//在網頁搜尋
var $searchingBox = $("#searching");		//搜尋欄
var $searchingBtn = $("#searching-button"); //搜尋按鈕
var searchingHintOriginalText = $("#searchingHint").html(); //提示框原文
var focusoutTimer; //先定義定時器以免報錯
var address = location.href.replace(/#[TLW]\d{8}$/, "");    //取得現在地址並去除#後的索引
$searchingBox.focusin(function(){		//搜尋欄獲得焦點時出現提示
	//先清除定時器
	clearTimeout(focusoutTimer);
	$("#searchingHint").stop().slideDown();
});
$searchingBox.focusout(function(){		//搜尋欄失去焦點時隱藏提示
	//注意!! 這裡一定要有一個延遲，以免在點擊提示框中的搜尋結果時先觸發focusout，導致提示框收起而沒有真正點擊到該搜尋結果(通常是最下面那個容易出問題)
	focusoutTimer = setTimeout(function(){$("#searchingHint").stop().slideUp();}, 200);
});
$searchingBtn.click(function(){			//按下搜尋按鈕
	//先將搜尋欄中的值保存為target
	let target = $searchingBox.val().toUpperCase();
	//	target為空，則讓搜尋欄獲得焦點
	if(target == ""){
		//讓搜尋欄獲得焦點
		$searchingBox.focus();
		return
	}
	//	若JQ找不到該id，則取消跳轉
	else if($("#"+target).length == 0){
		alert("未找到指定的文章");
		//將搜尋欄清空
		$searchingBox.val("");
		//讓搜尋欄獲得焦點
		$searchingBox.focus();
		//讓搜尋提示框恢復原樣
		$("#searchingHint").html(searchingHintOriginalText);
		//讓搜尋提示框高度刷新
		$("#searchingHint").css("height", "400px");
		return
	}
	//若搜尋以T開頭，自動點開「職訓筆記」
	else if(/^T/.test(target) == true){
		$("#TD").trigger("click");
	}
	//若搜尋以L開頭，自動點開「學習日誌」
	else if(/^L/.test(target) == true){
		$("#LD").trigger("click");
	}
	//若搜尋以W開頭，自動點開「工作日誌」
	else if(/^W/.test(target) == true){
		$("#WD").trigger("click");
	};
	//讓左側導航欄隱藏
	$("#side-nav").css("width", "0px")
	//進行跳轉
    c(address)
	location.assign(address + "#" + target);
	//讓視窗稍微向上滾動，改善用戶體驗
	$(window).scrollTop($(window).scrollTop() - 150);
	//將搜尋到的文章添加動畫效果
	$("#"+target).css("animation", "newComment 1.5s ease-in");
	//動畫播放完畢後自動刪除
	setTimeout(function(){
		$("#"+target).css("animation", "")
	}, 1500);
	//將搜尋欄清空
	$searchingBox.val("");
	//將搜尋提示框恢復預設內容
	$("#searchingHint").html(searchingHintOriginalText);
});
//當用戶點擊Enter時觸發搜尋
$searchingBox.keypress(function(event){ 
	//Enter的keycode是13，用event.which判斷按下的key
    if (event.which == 13) {
        //先將搜尋內容改為相關結果的第一項
        $searchingBox.val($("#searchingHint>.searchingResult").eq(0).text());
        //觸發搜尋按鈕
		$searchingBtn.trigger("click");
	};
});
//將搜尋結果顯示在搜尋提示框
var $singleDiary = $(".singleDiary");
var idArray = [];
for (var i=0; i<$singleDiary.length; i++){
	//拿到文章的個別id
	var id = $singleDiary.eq(i).attr("id");
	//將該id加入idArray
	idArray.push(id);
};
//預覽搜尋結果
//監聽搜尋欄輸入
$("nav").delegate("#searching", "propertychange input", function(){
	//若搜尋欄為空，則顯示最初的提示訊息
	if($searchingBox.val()==""){
		$("#searchingHint").html(searchingHintOriginalText);
		return
	};
	//若搜尋欄不為空
	//先將提示框清空
	$("#searchingHint").empty();
	//添加標題「相關結果」
    $("#searchingHint").append("<p class='header'>相關結果</p>");
    //先依據輸入內容來找出可能的文章類別
    var srArray = [] //searchingResult
    function searchingArticle(reg) {
        //若含有該字母，則將對應的文章從idArray添加到srArray
        if (reg.test($searchingBox.val())) {
            idArray.forEach(function (item) {
                if (reg.test(item)) {
                    srArray.push(item);
                };
            })
        };
    }
    searchingArticle(/t/i); //檢查是否有t
    searchingArticle(/l/i); //檢查是否有l
    searchingArticle(/w/i); //檢查是否有w
    //如果未輸入任何非數字符號，則讓srArray = idArray的複製品(使用slice不傳參數可以達成複製效果)
    if (!/\D/i.test($searchingBox.val())) {
        srArray = idArray.slice();
    };
    //將用戶輸入內容留下純數字，製作成正則表達式
    var reg = new RegExp($searchingBox.val().replace(/\D/g, ""));
	//將srArray中符合搜尋結果的項目顯示出來
    srArray.forEach(function (item) {
		if (reg == "" | reg.test(item)){
			//依照文章進行分類，添加::after
			if (/^T/.test(item)){
				$("#searchingHint").append("<p class='searchingResult content trainingDiary'>"+ item +"</p>");
			}else if (/^L/.test(item)){
				$("#searchingHint").append("<p class='searchingResult content learningDiary'>"+ item +"</p>");
			}else if (/^W/.test(item)){
				$("#searchingHint").append("<p class='searchingResult content workingDiary'>"+ item +"</p>");
			}
		}
	});
	//讓提示框的高度更新
	$("#searchingHint").css("height", "");
});
//點擊搜尋結果可以跳轉到對應頁面
//監聽搜尋結果的點擊事件
$("#searchingHint").delegate(".searchingResult", "click", function(){
	//讓搜尋欄的內容變成對應的字符串
	$searchingBox.val($(this).text());
	//觸發點擊搜尋按鈕
	$searchingBtn.trigger("click");
});


//點擊"我接觸過的程式語言"中的子盒子可以放大顯示
var $langIntroductionLi = $("#lang-introduction>li"); //盛裝程式語言介紹的<li>
var $langIntroductionZoomInUl = $("#lang-introduction-zoomIn"); 	//盛裝固定定位的內容的<ul>
$langIntroductionLi.click(function(){
	//1.叫出網頁蒙版
	$darkGlass.fadeIn(500);
	darkGlassUsage = "lang-introduction";
	//2.將該$langIntroductionLi淺複製
	let $li = $(this).clone(false);
	//3.將複製品改為固定定位並放置在中央
	$langIntroductionZoomInUl.append($li);
	//4.讓盛裝複製品的div顯現
	$langIntroductionZoomInUl.fadeIn(500);
	//5.關閉時刪除複製品(此操作在網頁蒙版內部完成)
});
$langIntroductionLi.attr("title", "點擊可以放大查看"); //每個<li>添加title屬性


//使用者選項(登入後出現)
//登出按鍵
$(".logOut").click(function(){
	if (confirm("確定要登出嗎?")){
		logInFlag = false;
		//移除使用者資訊
		$("#userInformation").hide();
		//顯示登入&註冊按鍵
		$logInButton.show();
		$registerButton.show();
	};
});


//當向下捲動時，將導航欄固定在頂部
//在頁面捲動時監控
$(window).scroll(function(){
	let scrollTop = $("html").scrollTop();
	if(scrollTop >= 100){
		$("nav").css("position", "fixed").css("top", "0");
		$("#side-nav").css("position", "fixed").css("top", "50px");
	}else{
		$("nav").css("position", "").css("top", "");
		$("#side-nav").css("position", "").css("top", "");
	};
});


//向下滾動時，改變橫條背景顏色
$(window).scroll(function(){
	let scrollTop = $("html").scrollTop();
	if (scrollTop >= 100){
		$("#progressBar").show();
		//閱讀比例 = (scrollTop - 100) / ($("html").height() - $(window).height() - 100)
		let p = ((scrollTop - 100) / ($("html").height() - $(window).height() - 100) - 1) * 100 + "%";
		$("#progressBar").css("left", p);
	}else{
		$("#progressBar").hide();
	};
});


//logo提示訊息
$(".myWebsite").hover(function(){
	$("#logoHintBox").stop().fadeIn(300);
}, function () {
    $("#logoHintBox").stop().fadeOut(300);
});



//點擊學習日誌中的圖片可以放大檢視
$("#structure05 img").click(function(){
	//開啟網頁蒙版
	$darkGlass.stop().fadeIn(500);
	darkGlassUsage = "imgZoomIn";
	//淺複製該圖片
	var $img = $(this).clone(false);
	//將複製好的圖片添加到#zoomIn
	$("#zoomIn").append($img);
	//顯示#zoomIn
	$("#zoomIn").show();
});



//封面的太陽及地球
{
let left = 0;
setInterval(function(){
	left -= 400;
	if (left< -8400){
		left = 0;
	};
	$("#sunAndEarth").css("background-position", left+"px 0px");
}, 50);
}


//多線程實例(暫時無法執行)
$("button.withWorker").click(function(){
	var n = parseInt($("input.withWorker").val());
	var w = new Worker("JavaScript/worker.js");
	w.onmessage = function(event){
		alert(event.data);
	};
	w.postMessage(n);
});



//多線程反例
$("button.noWorker").click(function(){
	var n = parseInt($("input.noWorker").val());
	if(n > 30){
		return alert("最多僅能輸入30，以免瀏覽器崩潰")
	};
	function fibonacci(n){
		var result = (n > 2) ? ( fibonacci(n-1) + fibonacci(n-2)) :  1;
		return result
	};
	alert(fibonacci(n));
	
});


//myWebsite動畫效果
{
	let x = 0;
	let fix = 0;
	let myWebsiteTimer = setInterval(function (){
		fix++;
		if (x <= -10500){
			clearInterval(myWebsiteTimer);
			return
		}else{
			x -= 375;
			if (fix % 3 == 0){
				x += 1;
			};
			$(".myWebsite").css("background-position", x+"px -28px");
		};
	}, 100);
}


//回到頂端按鈕
(function () {
    //在外部定義定時器
    var timer;
    $(".topBtn").click(function () {
        //先清除定時器以免重複點擊
        clearInterval(timer);
        //速度為目前scrollTop的1%，3毫秒移動一次
        var speed = $(window).scrollTop() / 100;
        timer = setInterval(function () {
            if ($(window).scrollTop() <= 0) {
                clearInterval(timer);
                return
            };
            $(window).scrollTop($(window).scrollTop() - speed);
        }, 3);
    });
})();



//當scrollTop>500時才出現頂端按鈕
$(window).scroll(function(){
    if ($(window).scrollTop() > 500) {
        $(".topBtn").stop().fadeIn(300);
    } else {
        $(".topBtn").stop().fadeOut(300);
    };
});



//網站自適應
//監聽window的resize事件
$(window).resize(function () {
    //左側導航欄在高度不足時出現滾動條
    if ($(window).innerHeight() < 600) {
        $("#side-nav").css("height", $(window).innerHeight() - 15 + "px").css("min-height", "unset");
    } else {
        $("#side-nav").css("height", "").css("min-height", "");
    };
});
//一開始就觸發自適應檢查(而不是等到resize發生時才調整)
$(window).trigger("resize");
//刷新頁面時觸發滾動事件，確保各項功能正常
$(window).trigger("scroll");










 