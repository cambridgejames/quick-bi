function getTipsList(o_url, o_data, name){
	$.ajax({
		"cache": "false",
		"url": o_url,
		"type": "get",
		"data": o_data,
		"dataType": "json",
		"success": function(data) {
			data = jsonDecode(data);
			if(data['error']) {
				errorCodeTranslater(data['error']);
			} else {
				var domList = translateArrayToList(data, name);
				animationCtrl.display('selecter', domList);
			}
		},
		"error": function(XMLHttpRequest, textStatus, errorThrown) {
			animationCtrl.display('error', '服务器访问异常');
		},
	})
}

function StudentInfoAjaxControler() {
	this.studentid = null;
	this.studentInfo = [];
	this.studentInfo['basic'] = "";
	this.studentInfo['identical'] = "";
	this.studentInfo['schooling'] = "";

	this.lastTime = 0;

	this.getStudentInfo = function(studentid, mode, flush) {
		var currentTime = (new Date()).valueOf();
		var difference = currentTime - this.lastTime;
		this.lastTime = currentTime;
		if(difference < 800) {
			animationCtrl.display('warning', '请勿重复点击');
			return;
		}
		if(studentid == this.studentid && this.studentid !== null && flush != true) {
			var domList = this.studentInfo[mode];
			studentInfoCtrl.changeShowMode(studentInfoCtrl.addressQuery(mode), domList);
		} else {
			$("#serch-hidden").val(studentid);
			animationCtrl.display('information', '查询中...');
			getInformation(studentid, 'basic');
			getInformation(studentid, 'identical');
			getInformation(studentid, 'schooling');
			this.studentid = studentid;
		}
	}

	function getInformation(studentid, mode) {
		$.ajax({
			"cache": "false",
			"url": "/messages/" + mode + "/studentid/" + studentid,
			"type": "get",
			"dataType": "json",
			"success": function(data) {
				data = jsonDecode(data);
				if(data['error']) {
					if(mode === 'basic') {
						errorCodeTranslater(data['error']);
					}
				} else {
					var domList = translateArrayToParagraph(data, mode);
					studentInfoAjaxCtrl.studentInfo[mode] = domList;
					if(mode === 'basic') {
						animationCtrl.display('success', '查询成功');
						setTimeout(function() {
							animationCtrl.display('messages', data['student_sex']);
							studentInfoCtrl.changeShowMode(studentInfoCtrl.addressQuery(mode), domList);
						}, 1000);
					}
				}
			},
			"error": function(XMLHttpRequest, textStatus, errorThrown) {
				animationCtrl.display('error', '服务器访问异常');
			},
		})
	}
}

var studentInfoAjaxCtrl = new StudentInfoAjaxControler();
