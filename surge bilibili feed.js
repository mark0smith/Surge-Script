var body = $response.body;
body=JSON.parse(body);
console.log(`原始响应内容数量： ${body["data"]["items"].length}`);

function should_filter(element) {
	// 不喜欢原因数量为1个时，判断为广告或者推广，进行屏蔽
	if ("three_point" in element) {
		if ('dislike_reasons' in element['three_point']) {
			if (element['three_point']['dislike_reasons'].length == 1) {
				return true;
			}
		}
	}
	
	// 屏蔽直播 	
	if ("card_goto" in element) {
		if (element['card_goto'] == 'live'){
			return true;
		}
	}

	// 播放参数信息中视频时长小于1分钟的短视频，进行屏蔽
	if ("player_args" in element) {
		if ("duration" in element["player_args"]) {
			if (element['player_args']['duration'] < 60) {
				return true
			}
		}
	}
	return false;
}
var new_array = [];
body["data"]["items"].forEach((element, index) => {
	should_be_filterd = should_filter(element)

	console.log(`${index} ${should_be_filterd}`);
	if (! should_be_filterd) {
		new_array.push(element)
	}
});
body["data"]["items"] = new_array;

console.log(`修改后响应内容数量： ${body["data"]["items"].length}`);
body=JSON.stringify(body)

$done({body})
