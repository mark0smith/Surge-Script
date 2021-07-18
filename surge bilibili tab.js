var body = $response.body;
body=JSON.parse(body);


function should_filter_top(element) {
	// 屏蔽游戏推广
	if ("uri" in element) {
		if (element['uri'].includes("game")) {
		    return [true, "游戏相关"];
		}
	}
    if ("name" in element) {
		if (element['name'].includes("游戏")) {
		    return [true, "游戏相关"];
		}
	}
    if ("tab_id" in element) {
		if (element['tab_id'].includes("游戏")) {
		    return [true, "游戏相关"];
		}
	}
	
	return [false,""];
}

function should_filter_bottom(element) {
	// 屏蔽发布按钮
    if ("name" in element) {
		if (element['name'].includes("发布")) {
		    return [true, "发布"];
		}
	}
    if ("tab_id" in element) {
		if (element['tab_id'].includes("发布")) {
		    return [true, "发布"];
		}
	}
    
    // 屏蔽会员购
    if ("name" in element) {
		if (element['name'].includes("会员购")) {
		    return [true, "会员购"];
		}
	}
    if ("tab_id" in element) {
		if (element['tab_id'].includes("会员购")) {
		    return [true, "会员购"];
		}
	}
    
	return [false,""];
}


console.log("======对顶栏进行屏蔽======")
var new_array = [];
body["data"]["top"].forEach((element, index) => {
	info = should_filter_top(element)
	should_be_filterd = info[0]
	filter_reason = info[1]

	console.log(`${index} ${should_be_filterd} ${filter_reason}`);
	if (! should_be_filterd) {
		new_array.push(element)
	}
});
body["data"]["top"] = new_array;
console.log("======对顶栏进行屏蔽结束======")

console.log("======对底栏进行屏蔽======")
var new_array = [];
body["data"]["bottom"].forEach((element, index) => {
	info = should_filter_bottom(element)
	should_be_filterd = info[0]
	filter_reason = info[1]

	console.log(`${index} ${should_be_filterd} ${filter_reason}`);
	if (! should_be_filterd) {
		new_array.push(element)
	}
});
body["data"]["bottom"] = new_array;
console.log("======对底栏进行屏蔽结束======")

body=JSON.stringify(body)

$done({body})
