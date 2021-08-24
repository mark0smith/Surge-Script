var body = $response.body;
body=JSON.parse(body);
console.log(`原始响应内容数量： ${body["data"]["items"].length}`);

// 屏蔽不喜欢的UP主
var blocked_up_list = ["游戏BBQ","拜托了小翔哥","电竞方头人Riot"];
// 最短播放时间为5分钟；
var duration_threshold = 5 * 60; 

function should_filter(element) {
	// 不喜欢原因数量为1个时，判断为广告或者推广，进行屏蔽
	if ("three_point" in element) {
		if ('dislike_reasons' in element['three_point']) {
			if (element['three_point']['dislike_reasons'].length == 1) {
				return [true, "广告/推广"];
			}
		}
	}
	
	//屏蔽文章
	if ("card_goto" in element) {
		if (element['card_goto'] == 'article_s'){
			return [true, "文章"];
		}
	}
	if ("goto" in element) {
		if (element['goto'] == 'article'){
			return [true, "文章"];
		}
	}
	
	// 屏蔽直播 	
	if ("card_goto" in element) {
		if (element['card_goto'] == 'live'){
			return [true, "直播"];
		}
	}
	if ("goto" in element) {
		if (element['goto'] == 'live'){
			return [true, "直播"];
		}
	}

	// 播放参数信息中视频时长小于1分钟的短视频，进行屏蔽
	if ("player_args" in element) {
		if ("duration" in element["player_args"]) {
			if (element['player_args']['duration'] < duration_threshold) {
				return [true, `短视频, 视频时长 ${element['player_args']['duration']} 秒`];
			}
		}
	}
	
	// 屏蔽不喜欢的UP主，进行屏蔽
	if ("args" in element) {
		if ("up_name" in element["args"]) {
			if (blocked_up_list.indexOf(element['args']['up_name']) > -1) {
				return [true, `不喜欢的UP主: ${element['args']['up_name']}`];
			}
		}
	}	
	
	return [false,""];
}
var new_array = [];
body["data"]["items"].forEach((element, index) => {
	info = should_filter(element)
	should_be_filterd = info[0]
	filter_reason = info[1]

	console.log(`${index} ${should_be_filterd} ${filter_reason}`);
	if (! should_be_filterd) {
		new_array.push(element)
	}
});
body["data"]["items"] = new_array;

console.log(`修改后响应内容数量： ${body["data"]["items"].length}`);
body=JSON.stringify(body)

$done({body})
