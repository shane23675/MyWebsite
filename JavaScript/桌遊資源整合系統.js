window.onload = function () {
    c = console.log;
	//登入按鈕
	$("#logInBtn").click(function(){
		//讓登入表單消失
        $("#logInForm").hide();
        //讓功能主選單出現
        $("#mainFunctions").css("display", "flex");
	});
	//點擊任一功能主選單的選項，將讓功能主選單消失
    $("#mainFunctions .option").click(function () {
        $("#mainFunctions").hide();
    });
    //功能A：店內座位資訊
    $("#optA").click(function () {
        //顯示店內座位資訊
        $("#seatInfo").show();
    });
    //點擊「新增一張桌子」
    $("#addNewTable").click(function () {
        //顯示「新增桌子視窗」
        $("#addTable").css("top", "50%");
    });
	//在「新增桌子視窗」中點擊「新增」
    $("#addTable .confirmBtn").click(function () {
        //取得該桌人數
        var tableSize = $("#addTable .tableSize").val();
        //新增該桌至列表
        $("#tables").append("<li><i class='fas fa-dice'></i>" + tableSize + "<span>看照片(未開放)</span></li>");
        //關閉「新增桌子視窗」
        $("#addTable").css("top", "");
    });
	//在「新增桌子視窗」中點擊「取消」
    $("#addTable .cancelBtn").click(function () {
        //關閉「新增桌子視窗」
        $("#addTable").css("top", "");
    });

	
	
	
}