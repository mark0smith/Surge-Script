let body = $response.body
body=JSON.parse(body)

function should_filter(element) {
    // 不喜欢原因数量为1个时，判断为广告或者推广，进行屏蔽
    if(element['three_point']['dislike_reasons'].length == 1){
        return true;
    }

    // 没有播放参数信息，或者视频时长小于1分钟的短视频，进行屏蔽
    if(! "player_args" in element){
        return true;
    }else if( ! "duration" in element["player_args"] ){
        return true;
    }else if( element['player_args']['duration'] < 60 ){
        return true;
    }

    return false;

}
body["data"]["items"].forEach((element, index) => {
    should_be_filterd = should_filter(element)

    console.log(`${index} ${should_be_filterd}`);
	if (should_be_filterd) {
		body["data"]["items"].splice(index, 1);
	}
});

body=JSON.stringify(body)
$done({body})
