// ==UserScript==
// @name          BilibiliAPI_mod
// @namespace     https://github.com/SeaLoong
// @version       3.1.7
// @description   BilibiliAPI，PC端抓包研究所得，原作者是SeaLoong。我在此基础上补充新的API。
// @author        SeaLoong, andywang425
// @require       https://code.jquery.com/jquery-3.6.0.min.js
// @require       ./libWbiSign.js
// @grant         none
// @include       *
// @license       MIT
// ==/UserScript==
let BAPI_csrf_token, BAPI_visit_id, BAPI_ts_ms = () => Date.now(),
	BAPI_WBI_SIGN = () => BAPI.x.getWbiSign()
	.then((a => {
		if (0 === a.code) {
			const {
				img_url: e,
				sub_url: i
			} = a.data.wbi_img;
			return {
				img_key: e.substring(e.lastIndexOf("/") + 1, e.length)
					.split(".")[0],
				sub_key: i.substring(i.lastIndexOf("/") + 1, i.length)
					.split(".")[0]
			}
		}
		return null
	})),
	BAPI_ts_s = () => Math.round(BAPI_ts_ms() / 1e3),
	getAppCommonRequestJson = a => ({
		access_key: a,
		actionKey: "appkey",
		appkey: "1d8b6e7d45233436",
		build: "6720300",
		c_locale: "zh_CN",
		channel: "bili",
		device: "android",
		disable_rcmd: 0,
		mobi_app: "android",
		platform: "android",
		s_locale: "zh_CN",
		statistics: '{"appId":1,"platform":3,"version":"7.3.0","abtest":""}',
		sign: BilibiliToken.md5(Math.random()
			.toString()),
		ts: BAPI_ts_s()
	}),
	getAppHeaders = a => {
		const e = BilibiliToken.md5(Math.random()
				.toString()),
			i = BilibiliToken.md5(Math.random()
				.toString()),
			t = e + i;
		return {
			buvid: BilibiliToken.buvidXX,
			fp_local: t,
			fp_remote: t,
			session_id: e.substring(0, 8),
			env: "prod",
			"app-key": "android64",
			"user-agent": "Mozilla/5.0 BiliDroid/6.72.0 (bbcallen@gmail.com) os/android model/XQ-CT72 mobi_app/android build/6720300 channel/bilih5 innerVer/6720310 osVer/12 network/2",
			"x-bili-trace-id": e.concat(":", i.substring(0, 16), ":0:0"),
			"x-bili-aurora-eid": "VFwJQVkEBFYH",
			"x-bili-mid": a,
			"x-bili-aurora-zone": "",
			"content-type": "application/x-www-form-urlencoded; charset=utf-8",
			"accept-encoding": "gzip"
		}
	};
var BAPI = {
	setCommonArgs: (a = "", e = "") => {
		BAPI_csrf_token = a, BAPI_visit_id = e
	},
	TreasureBox: {
		getAward: (a, e, i) => BAPI.lottery.SilverBox.getAward(a, e, i),
		getCaptcha: a => BAPI.lottery.SilverBox.getCaptcha(a),
		getCurrentTask: () => BAPI.lottery.SilverBox.getCurrentTask()
	},
	Exchange: {
		coin2silver: (a, e) => BAPI.pay.coin2silver(a, e),
		silver2coin: a => BAPI.pay.silver2coin(a),
		old: {
			coin2silver: a => BAPI.exchange.coin2silver(a),
			silver2coin: () => BAPI.exchange.silver2coin()
		}
	},
	Lottery: {
		Gift: {
			check: a => BAPI.xlive.smalltv.check(a),
			join: (a, e, i) => BAPI.xlive.smalltv.join(a, e, i),
			notice: (a, e) => BAPI.xlive.smalltv.notice(a, e)
		},
		Raffle: {
			check: a => BAPI.activity.check(a),
			join: (a, e) => BAPI.activity.join(a, e),
			notice: (a, e) => BAPI.activity.notice(a, e)
		},
		MaterialObject: {
			getRoomActivityByRoomid: a => BAPI.lottery.box.getRoomActivityByRoomid(a),
			getStatus: (a, e) => BAPI.lottery.box.getStatus(a, e),
			check: a => BAPI.lottery.box.getBoxInfo(a),
			draw: (a, e) => BAPI.lottery.box.draw(a, e),
			getWinnerGroupInfo: (a, e) => BAPI.lottery.box.getWinnerGroupInfo(a, e)
		},
		Guard: {
			check: a => BAPI.lottery.lottery.check_guard(a),
			join: (a, e, i) => BAPI.xlive.guard.join(a, e, i)
		},
		Pk: {
			check: a => BAPI.xlive.pk.check(a),
			join: (a, e) => BAPI.xlive.pk.join(a, e)
		}
	},
	Group: {
		my_groups: () => BAPI.link_group.my_groups(),
		sign_in: (a, e) => BAPI.link_group.sign_in(a, e)
	},
	Storm: {
		check: a => BAPI.lottery.Storm.check(a),
		join: (a, e, i, t, o) => BAPI.lottery.Storm.join(a, e, i, t, o),
		join_ex: (a, e, i, t, o, r = "", l = "", n = 16777215) => BAPI.lottery.Storm.join_ex(a, e, i, t, o, "", "", 16777215)
	},
	HeartBeat: {
		web: () => BAPI.user.userOnlineHeart(),
		mobile: () => BAPI.mobile.userOnlineHeart()
	},
	DailyReward: {
		task: () => BAPI.home.reward(),
		exp: () => BAPI.exp(),
		login: () => BAPI.x.now(),
		watch: (a, e, i, t, o, r, l, n, d) => BAPI.x.heartbeat(a, e, i, t, o, r, l, n, d),
		coin: (a, e) => BAPI.x.coin_add(a, e),
		share: a => BAPI.x.share_add(a)
	},
	ajax: a => {
		void 0 === a.xhrFields && (a.xhrFields = {}), a.xhrFields.withCredentials = !0, jQuery.extend(a, {
			url: ("//" === a.url.substr(0, 2) || "http" === a.url.substr(0, 4) ? "" : "//api.live.bilibili.com/") + a.url,
			method: a.method || "GET",
			crossDomain: !0,
			dataType: a.dataType || "json"
		});
		const e = jQuery.Deferred();
		return jQuery.ajax(a)
			.then(((...a) => {
				e.resolve(...a)
			}))
			.catch((a => {
				a.responseJSON ? a.responseJSON.msg = a.responseJSON.message : 0 !== a.status ? a.responseJSON = {
					code: a.status,
					message: `状态码: ${a.status}`,
					msg: `状态码: ${a.status}`
				} : a.responseJSON = {
					code: "NET_ERR",
					msg: "请检查网络",
					message: "请检查网络"
				}, a.responseJSON.netError = !0, e.resolve(a.responseJSON)
			})), e
	},
	ajaxWithCommonArgs: a => (a.data || (a.data = {}), a.data.csrf = BAPI_csrf_token, a.data.csrf_token = BAPI_csrf_token, void 0 !== BAPI_visit_id && (a.data.visit_id = BAPI_visit_id), BAPI.ajax(a)),
	ajaxGetCaptchaKey: () => BAPI.ajax({
		url: "//www.bilibili.com/plus/widget/ajaxGetCaptchaKey.php?js"
	}),
	exp: () => BAPI.ajax({
		url: "//www.bilibili.com/plus/account/exp.php"
	}),
	msg: a => BAPI.ajaxWithCommonArgs({
		method: "POST",
		url: "ajax/msg",
		data: {
			roomid: a
		}
	}),
	ajaxCapsule: () => BAPI.ajax({
		url: "api/ajaxCapsule"
	}),
	player: (a, e, i = "pc", t = "web") => BAPI.ajax({
		url: "api/player",
		data: {
			id: "string" == typeof a && "cid:" === a.substr(0, 4) ? a : "cid:" + a,
			ts: "string" == typeof e ? e : e.toString(16),
			platform: i,
			player_type: t
		},
		dataType: "text"
	}),
	create: (a, e) => BAPI.ajax({
		url: "captcha/v1/Captcha/create",
		data: {
			width: a || "112",
			height: e || "32"
		},
		cache: !1
	}),
	topList: (a, e, i) => BAPI.ajax({
		url: "guard/topList",
		data: {
			roomid: a,
			page: e,
			ruid: i
		}
	}),
	getSuser: () => BAPI.ajax({
		url: "msg/getSuser"
	}),
	refresh: (a = "all") => BAPI.ajax({
		url: "index/refresh?area=" + a
	}),
	get_ip_addr: () => BAPI.ajax({
		url: "ip_service/v1/ip_service/get_ip_addr"
	}),
	getuserinfo: () => BAPI.ajax({
		url: "user/getuserinfo"
	}),
	activity: {
		mobileActivity: () => BAPI.ajax({
			url: "activity/v1/Common/mobileActivity"
		}),
		mobileRoomInfo: a => BAPI.ajax({
			url: "activity/v1/Common/mobileRoomInfo",
			data: {
				roomid: a
			}
		}),
		roomInfo: (a, e, i, t) => BAPI.ajax({
			url: "activity/v1/Common/roomInfo",
			data: {
				roomid: a,
				ruid: e,
				area_v2_id: i,
				area_v2_parent_id: t
			}
		}),
		welcomeInfo: (a, e) => BAPI.ajax({
			url: "activity/v1/Common/welcomeInfo",
			data: {
				roomid: a,
				ruid: e
			}
		}),
		check: a => BAPI.ajax({
			url: "activity/v1/Raffle/check?roomid=" + a
		}),
		join: (a, e) => BAPI.ajax({
			url: "activity/v1/Raffle/join",
			data: {
				roomid: a,
				raffleId: e
			}
		}),
		notice: (a, e) => BAPI.ajax({
			url: "activity/v1/Raffle/notice",
			data: {
				roomid: a,
				raffleId: e
			}
		}),
		receive_award: a => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "activity/v1/task/receive_award",
			data: {
				task_id: a
			}
		})
	},
	av: {
		getTimestamp: (a = "pc") => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "av/v1/Time/getTimestamp",
			data: {
				platform: a
			}
		})
	},
	dynamic_svr: {
		dynamic_new: (a, e = 8) => BAPI.ajax({
			url: "dynamic_svr/v1/dynamic_svr/dynamic_new",
			data: {
				uid: a,
				type: e
			}
		}),
		space_history: (a, e, i, t) => BAPI.ajax({
			url: "dynamic_svr/v1/dynamic_svr/space_history",
			data: {
				visitor_uid: a,
				host_uid: e,
				offset_dynamic_id: i,
				need_top: t
			}
		}),
		w_live_users: (a = 10) => BAPI.ajax({
			url: "//api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/w_live_users",
			data: {
				size: a
			}
		})
	},
	exchange: {
		coin2silver: a => BAPI.ajax({
			method: "POST",
			url: "exchange/coin2silver",
			data: {
				coin: a
			}
		}),
		silver2coin: () => BAPI.ajax({
			type: "GET",
			url: "exchange/silver2coin"
		})
	},
	fans_medal: {
		get_fans_medal_info: (a, e, i = 1) => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "fans_medal/v1/fans_medal/get_fans_medal_info",
			data: {
				source: i,
				uid: a,
				target_id: e
			}
		})
	},
	feed_svr: {
		notice: () => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "feed_svr/v1/feed_svr/notice",
			data: {}
		}),
		my: (a, e = 0, i = 0, t = 0) => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "feed_svr/v1/feed_svr/my",
			data: {
				live_status: e,
				type: i,
				page_size: a,
				offset: t
			}
		})
	},
	gift: {
		bag_list: () => BAPI.ajax({
			url: "gift/v2/gift/bag_list"
		}),
		send: (a, e, i, t, o, r, l = "silver", n = "pc", d = "live", s = 0, m = 0) => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "gift/v2/gift/send",
			data: {
				uid: a,
				gift_id: e,
				ruid: i,
				gift_num: t,
				coin_type: l,
				bag_id: 0,
				platform: n,
				biz_code: d,
				biz_id: o,
				rnd: r,
				storm_beat_id: s,
				metadata: "",
				price: m
			}
		}),
		bag_send: (a, e, i, t, o, r, l, n = "pc", d = "live", s = 0, m = 0) => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "gift/v2/live/bag_send",
			data: {
				uid: a,
				gift_id: e,
				ruid: i,
				gift_num: t,
				bag_id: o,
				platform: n,
				biz_code: d,
				biz_id: r,
				rnd: l,
				storm_beat_id: s,
				metadata: "",
				price: m
			}
		}),
		gift_config: () => BAPI.ajax({
			url: "gift/v3/live/gift_config"
		}),
		heart_gift_receive: (a, e) => BAPI.ajax({
			url: "gift/v2/live/heart_gift_receive",
			data: {
				roomid: a,
				area_v2_id: e
			}
		}),
		heart_gift_status: (a, e) => BAPI.ajax({
			url: "gift/v2/live/heart_gift_status",
			data: {
				roomid: a,
				area_v2_id: e
			}
		}),
		receive_daily_bag: () => BAPI.ajax({
			url: "gift/v2/live/receive_daily_bag"
		}),
		room_gift_list: (a, e) => BAPI.ajax({
			url: "gift/v2/live/room_gift_list",
			data: {
				roomid: a,
				area_v2_id: e
			}
		}),
		smalltv: {
			check: a => BAPI.ajax({
				url: "gift/v3/smalltv/check",
				data: {
					roomid: a
				}
			}),
			join: (a, e, i = "Gift") => BAPI.ajaxWithCommonArgs({
				method: "POST",
				url: "gift/v3/smalltv/join",
				data: {
					roomid: a,
					raffleId: e,
					type: i
				}
			}),
			notice: (a, e = "small_tv") => BAPI.ajax({
				url: "gift/v3/smalltv/notice",
				data: {
					type: e,
					raffleId: a
				}
			})
		}
	},
	giftBag: {
		getSendGift: () => BAPI.ajax({
			url: "giftBag/getSendGift"
		}),
		sendDaily: () => BAPI.ajax({
			url: "giftBag/sendDaily"
		})
	},
	home: {
		reward: () => BAPI.ajax({
			url: "//account.bilibili.com/home/reward"
		})
	},
	i: {
		ajaxCancelWear: () => BAPI.ajax({
			url: "i/ajaxCancelWear"
		}),
		ajaxGetAchieve: (a, e, i = 6, t = "normal", o = 0, r = "all") => BAPI.ajax({
			url: "i/api/ajaxGetAchieve",
			data: {
				type: t,
				status: o,
				category: r,
				keywords: a,
				page: e,
				pageSize: i
			}
		}),
		ajaxGetMyMedalList: () => BAPI.ajax({
			url: "i/ajaxGetMyMedalList"
		}),
		ajaxWearFansMedal: a => BAPI.ajax({
			url: "i/ajaxWearFansMedal?medal_id=" + a
		}),
		following: (a = 1, e = 9) => BAPI.ajax({
			url: "i/api/following",
			data: {
				page: a,
				pageSize: e
			}
		}),
		guard: (a, e = 10) => BAPI.ajax({
			url: "i/api/guard",
			data: {
				page: a,
				pageSize: e
			}
		}),
		liveinfo: () => BAPI.ajax({
			url: "i/api/liveinfo"
		}),
		operation: (a = 1) => BAPI.ajax({
			url: "i/api/operation?page=" + a
		}),
		taskInfo: () => BAPI.ajax({
			url: "i/api/taskInfo"
		})
	},
	link_group: {
		my_groups: () => BAPI.ajax({
			url: "link_group/v1/member/my_groups"
		}),
		sign_in: (a, e) => BAPI.ajax({
			url: "link_setting/v1/link_setting/sign_in",
			data: {
				group_id: a,
				owner_id: e
			}
		}),
		buy_medal: (a, e = "metal", i = "android") => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "//api.vc.bilibili.com/link_group/v1/member/buy_medal",
			data: {
				master_uid: a,
				coin_type: e,
				platform: i
			}
		})
	},
	live: {
		getRoomKanBanModel: a => BAPI.ajax({
			url: "live/getRoomKanBanModel?roomid" + a
		}),
		rankTab: a => BAPI.ajax({
			url: "live/rankTab?roomid=" + a
		}),
		roomAdList: () => BAPI.ajax({
			url: "live/roomAdList"
		})
	},
	live_user: {
		get_anchor_in_room: a => BAPI.ajax({
			url: "live_user/v1/UserInfo/get_anchor_in_room?roomid=" + a
		}),
		get_info_in_room: a => BAPI.ajax({
			url: "live_user/v1/UserInfo/get_info_in_room?roomid=" + a
		}),
		get_weared_medal: (a, e, i = 1) => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "live_user/v1/UserInfo/get_weared_medal",
			data: {
				source: i,
				uid: a,
				target_id: e
			}
		}),
		governorShow: a => BAPI.ajax({
			url: "live_user/v1/Master/governorShow?target_id=" + a
		})
	},
	lottery: {
		box: {
			getRoomActivityByRoomid: a => BAPI.ajax({
				url: "lottery/v1/box/getRoomActivityByRoomid?roomid=" + a
			}),
			getStatus: (a, e = "") => BAPI.ajax({
				url: "lottery/v2/box/getStatus",
				data: {
					aid: a,
					times: e
				}
			}),
			getBoxInfo: a => BAPI.ajax({
				url: "/xlive/lottery-interface/v1/goldBox/getBoxInfo",
				data: {
					aid: a
				}
			}),
			draw: (a, e = 1) => BAPI.ajax({
				url: "/xlive/lottery-interface/v2/Box/draw",
				data: {
					aid: a,
					number: e
				}
			}),
			getWinnerGroupInfo: (a, e = 1) => BAPI.ajax({
				url: "/xlive/lottery-interface/v2/Box/getWinnerGroupInfo",
				data: {
					aid: a,
					number: e
				}
			})
		},
		SilverBox: {
			getAward: (a, e, i) => BAPI.ajax({
				url: "lottery/v1/SilverBox/getAward",
				data: {
					time_start: a,
					end_time: e,
					captcha: i
				}
			}),
			getCaptcha: a => BAPI.ajax({
				url: "lottery/v1/SilverBox/getCaptcha?ts=" + a
			}),
			getCurrentTask: () => BAPI.ajax({
				url: "lottery/v1/SilverBox/getCurrentTask"
			})
		},
		Storm: {
			check: a => BAPI.ajax({
				url: "lottery/v1/Storm/check?roomid=" + a
			}),
			join: (a, e, i, t, o = 16777215) => BAPI.ajaxWithCommonArgs({
				method: "POST",
				url: "lottery/v1/Storm/join",
				data: {
					id: a,
					color: o,
					captcha_token: e,
					captcha_phrase: i,
					roomid: t
				}
			}),
			join_ex: (a, e, i, t, o) => {
				let r = TokenUtil.signQuery(KeySign.sort({
					id: a,
					access_key: i,
					appkey: t,
					actionKey: "appkey",
					build: 5561e3,
					channel: "bili",
					device: "android",
					mobi_app: "android",
					platform: "android"
				}));
				return BAPI.ajaxWithCommonArgs({
					method: "POST",
					url: `xlive/lottery-interface/v1/storm/Join?${r}`,
					headers: o,
					roomid: e
				})
			}
		},
		lottery: {
			check_guard: a => BAPI.ajax({
				url: "lottery/v1/Lottery/check_guard?roomid=" + a
			}),
			join: (a, e, i = "guard") => BAPI.ajaxWithCommonArgs({
				method: "POST",
				url: "lottery/v2/Lottery/join",
				data: {
					roomid: a,
					id: e,
					type: i
				}
			})
		}
	},
	mobile: {
		userOnlineHeart: () => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "mobile/userOnlineHeart",
			data: {}
		})
	},
	pay: {
		coin2silver: (a, e = "pc") => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "pay/v1/Exchange/coin2silver",
			data: {
				num: a,
				platform: e
			}
		}),
		getRule: (a = "pc") => BAPI.ajax({
			url: "pay/v1/Exchange/getRule?platform=" + a
		}),
		getStatus: (a = "pc") => BAPI.ajax({
			url: "pay/v1/Exchange/getStatus?platform=" + a
		}),
		silver2coin: (a = "pc") => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "pay/v1/Exchange/silver2coin",
			data: {
				platform: a
			}
		}),
		myWallet: (a = 1, e = 1, i = "pc") => BAPI.ajax({
			url: "pay/v2/Pay/myWallet",
			data: {
				need_bp: a,
				need_metal: e,
				platform: i
			}
		})
	},
	rankdb: {
		roomInfo: (a, e, i) => BAPI.ajax({
			url: "rankdb/v1/Common/roomInfo",
			data: {
				ruid: a,
				roomid: e,
				areaId: i
			}
		}),
		getTopRealTimeHour: a => BAPI.ajax({
			url: `rankdb/v1/Rank2018/getTop?type=master_realtime_hour&type_id=areaid_realtime_hour&area_id=${a}`
		})
	},
	relation: {
		getList: (a, e) => BAPI.ajax({
			url: "relation/v1/feed/getList",
			data: {
				page: a,
				page_size: e
			},
			cache: !1
		}),
		heartBeat: () => BAPI.ajax({
			url: "relation/v1/feed/heartBeat",
			cache: !1
		}),
		GetUserFc: a => BAPI.ajax({
			url: "relation/v1/Feed/GetUserFc?follow=" + a
		}),
		IsUserFollow: a => BAPI.ajax({
			url: "relation/v1/Feed/IsUserFollow?follow=" + a
		}),
		getFollowings: (a, e = 1, i = 20, t = "desc", o = "jsonp", r = "") => BAPI.ajax({
			url: "//api.bilibili.com/x/relation/followings",
			data: {
				vmid: a,
				pn: e,
				ps: i,
				order: t,
				jsonp: o,
				callback: r
			}
		}),
		get_attention_list: a => BAPI.ajax({
			url: "//api.vc.bilibili.com/feed/v1/feed/get_attention_list",
			data: {
				mid: a
			}
		}),
		getTags: () => BAPI.ajax({
			url: "//api.bilibili.com/x/relation/tags",
			data: {
				jsonp: "jsonp",
				callback: ""
			}
		}),
		getUpInTag: (a, e, i = 1, t = 20, o = "jsonp", r = "") => BAPI.ajax({
			url: "//api.bilibili.com/x/relation/tag",
			data: {
				mid: a,
				tagid: e,
				pn: i,
				ps: t,
				jsonp: o,
				callback: r
			}
		}),
		createTag: (a, e = "jsonp") => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "//api.bilibili.com/x/relation/tag/create",
			data: {
				tag: a,
				jsonp: e
			}
		}),
		getTagIDByName: a => BAPI.ajax({
			url: "//api.bilibili.com/x/tag/info",
			data: {
				tag_name: a
			}
		}),
		delTag: (a, e = "jsonp") => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "//api.bilibili.com/x/relation/tag/del",
			data: {
				tagid: a,
				jsonp: e
			}
		}),
		modify: (a, e, i = 11) => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "//api.bilibili.com/x/relation/modify",
			data: {
				fid: a,
				act: e,
				re_src: i,
				jsonp: "jsonp",
				callback: ""
			}
		}),
		addUsers: (a, e, i = !0) => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "//api.bilibili.com/x/relation/tags/addUsers",
			data: {
				cross_domain: i,
				fids: a,
				tagids: e
			}
		}),
		moveUsers: (a, e, i, t = "jsonp") => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "//api.bilibili.com/x/relation/tags/moveUsers",
			data: {
				beforeTagids: a,
				afterTagids: e,
				fids: i,
				jsonp: t
			}
		})
	},
	room: {
		get_info: (a, e = "room") => BAPI.ajax({
			url: "room/v1/Room/get_info",
			data: {
				room_id: a,
				from: e
			}
		}),
		get_recommend_by_room: (a, e, i) => BAPI.ajax({
			url: "room/v1/room/get_recommend_by_room",
			data: {
				room_id: a,
				count: e,
				rnd: i || Math.floor(Date.now() / 1e3)
			}
		}),
		playUrl: (a, e = "0", i = "web") => BAPI.ajax({
			url: "room/v1/Room/playUrl",
			data: {
				cid: a,
				quality: e,
				platform: i
			}
		}),
		room_entry_action: (a, e = "pc") => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "room/v1/Room/room_entry_action",
			data: {
				room_id: a,
				platform: e
			}
		}),
		room_init: a => BAPI.ajax({
			url: "room/v1/Room/room_init?id=" + a
		}),
		getConf: (a, e = "pc", i = "web") => BAPI.ajax({
			url: "room/v1/Danmu/getConf",
			data: {
				room_id: a,
				platform: e,
				player: i
			}
		}),
		getList: () => BAPI.ajax({
			url: "room/v1/Area/getList"
		}),
		getRoomList: (a = 1, e = 0, i = 0, t = 1, o = 30, r = "online", l = "web", n = 1) => BAPI.ajax({
			url: "room/v3/area/getRoomList",
			data: {
				platform: l,
				parent_area_id: a,
				cate_id: e,
				area_id: i,
				sort_type: r,
				page: t,
				page_size: o,
				tag_version: n
			}
		}),
		update: (a, e) => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "room/v1/Room/update",
			data: {
				room_id: a,
				description: e
			}
		}),
		getRoomInfoOld: a => BAPI.ajax({
			url: "room/v1/Room/getRoomInfoOld",
			data: {
				mid: a
			}
		}),
		getRoomBaseInfo: (a, e = "link-center") => BAPI.ajax({
			url: "xlive/web-room/v1/index/getRoomBaseInfo",
			data: {
				room_ids: a,
				req_biz: e
			}
		}),
		verify_room_pwd: (a, e = "") => BAPI.ajax({
			url: "room/v1/Room/verify_room_pwd",
			data: {
				room_id: a,
				pwd: e
			}
		})
	},
	sign: {
		doSign: () => BAPI.ajax({
			url: "sign/doSign"
		}),
		GetSignInfo: () => BAPI.ajax({
			url: "sign/GetSignInfo"
		}),
		getLastMonthSignDays: () => BAPI.ajax({
			url: "sign/getLastMonthSignDays"
		})
	},
	user: {
		getWear: a => BAPI.ajax({
			url: "user/v1/user_title/getWear?uid=" + a
		}),
		isBiliVip: a => BAPI.ajax({
			url: "user/v1/user/isBiliVip?uid=" + a
		}),
		userOnlineHeart: () => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "User/userOnlineHeart",
			data: {}
		}),
		getUserInfo: a => BAPI.ajax({
			url: "User/getUserInfo?ts=" + a
		})
	},
	x: {
		getWbiSign: () => BAPI.ajax({
			url: "//api.bilibili.com/x/web-interface/nav"
		}),
		getUserSpace: (a, e, i, t, o, r, l) => BAPI.ajax({
			url: "//api.bilibili.com/x/space/arc/search",
			data: {
				mid: a,
				ps: e,
				tid: i,
				pn: t,
				keyword: o,
				order: r,
				jsonp: l
			}
		}),
		getAccInfoOld: (a, e = "jsonp") => BAPI.ajax({
			url: "//api.bilibili.com/x/space/acc/info",
			data: {
				mid: a,
				jsonp: e
			}
		}),
		getAccInfo: (a, e = "", i = "web", t = "1550101") => BAPI_WBI_SIGN()
			.then((o => {
				if (o) return BAPI.ajax({
					url: "//api.bilibili.com/x/space/wbi/acc/info?" + Wbi.encWbi({
						mid: a,
						platform: i,
						token: e,
						web_location: t,
						wts: BAPI_ts_s()
					}, o.img_key, o.sub_key)
				})
			})),
		myinfo: () => BAPI.ajax({
			url: "//api.bilibili.com/x/space/v2/myinfo"
		}),
		getCoinInfo: (a, e, i, t) => BAPI.ajax({
			url: "//api.bilibili.com/x/web-interface/archive/coins",
			data: {
				callback: a,
				jsonp: e,
				aid: i,
				_: t
			}
		}),
		getTodayExp: () => BAPI.ajax({
			url: "//api.bilibili.com/x/web-interface/coin/today/exp"
		}),
		coin_add: (a, e = 1, i = 0) => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "//api.bilibili.com/x/web-interface/coin/add",
			data: {
				aid: a,
				multiply: e,
				select_like: i,
				cross_domain: !0
			}
		}),
		share_add: a => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "//api.bilibili.com/x/web-interface/share/add",
			data: {
				aid: a,
				jsonp: "jsonp"
			}
		}),
		heartbeat: (a, e, i, t, o = 0, r = 0, l = 3, n = 1, d = 2) => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "//api.bilibili.com/x/report/web/heartbeat",
			data: {
				aid: a,
				cid: e,
				mid: i,
				start_ts: t || Date.now() / 1e3,
				played_time: o,
				realtime: r,
				type: l,
				play_type: n,
				dt: d
			}
		}),
		now: () => BAPI.ajax({
			url: "//api.bilibili.com/x/report/click/now",
			data: {
				jsonp: "jsonp"
			}
		}),
		card: a => BAPI.ajax({
			url: "//api.bilibili.com/x/web-interface/card",
			data: {
				mid: a
			}
		}),
		stat: a => BAPI.ajax({
			url: "//api.bilibili.com/x/relation/stat",
			data: {
				vmid: a
			}
		}),
		reserve: (a, e = "jsonp") => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "//api.bilibili.com/x/space/reserve",
			data: {
				sid: a,
				jsonp: e
			}
		}),
		get_reserve_info: a => BAPI.ajax({
			url: "https://api.bilibili.com/x/activity/up/reserve/relation/info",
			data: {
				ids: a
			}
		}),
		elec_pay_quick: (a, e = 2, i = "up", t = !0, o = a) => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "//api.bilibili.com/x/ugcpay/web/v2/trade/elec/pay/quick",
			data: {
				up_mid: a,
				bp_num: e,
				otype: i,
				is_bp_remains_prior: t,
				oid: o
			}
		}),
		activity: {
			getLotteryMyTimes: a => BAPI.ajax({
				url: "//api.bilibili.com/x/activity/lottery/mytimes",
				data: {
					sid: a
				}
			}),
			doLottery: (a, e = 1) => BAPI.ajaxWithCommonArgs({
				method: "POST",
				url: "//api.bilibili.com/x/activity/lottery/do",
				data: {
					sid: a,
					type: e
				}
			}),
			addLotteryTimes: (a, e = 3) => BAPI.ajaxWithCommonArgs({
				method: "POST",
				url: "//api.bilibili.com/x/activity/lottery/addtimes",
				data: {
					sid: a,
					action_type: e
				}
			})
		},
		vip: {
			privilege: {
				my: () => BAPI.ajax({
					url: "//api.bilibili.com/x/vip/privilege/my"
				}),
				receive: a => BAPI.ajaxWithCommonArgs({
					method: "POST",
					url: "//api.bilibili.com/x/vip/privilege/receive",
					data: {
						type: a
					}
				})
			}
		}
	},
	xlive: {
		revenue: {
			silver2coin: () => BAPI.ajaxWithCommonArgs({
				method: "POST",
				url: "xlive/revenue/v1/wallet/silver2coin"
			}),
			coin2silver: (a, e = "pc") => BAPI.ajaxWithCommonArgs({
				method: "POST",
				url: "xlive/revenue/v1/wallet/coin2silver",
				data: {
					num: a,
					platform: e
				}
			})
		},
		guard: {
			join: (a, e, i = "guard") => BAPI.ajaxWithCommonArgs({
				method: "POST",
				url: "xlive/lottery-interface/v3/guard/join",
				data: {
					roomid: a,
					id: e,
					type: i
				}
			})
		},
		lottery: {
			check: a => BAPI.ajax({
				url: "xlive/lottery-interface/v1/lottery/Check",
				data: {
					roomid: a
				}
			}),
			getLotteryInfoWeb: a => BAPI.ajax({
				url: "xlive/lottery-interface/v1/lottery/getLotteryInfoWeb",
				data: {
					roomid: a
				}
			})
		},
		smalltv: {
			check: a => BAPI.ajax({
				url: "xlive/lottery-interface/v3/smalltv/Check",
				data: {
					roomid: a
				}
			}),
			join: (a, e, i = "small_tv") => BAPI.ajaxWithCommonArgs({
				method: "POST",
				url: "xlive/lottery-interface/v5/smalltv/join",
				data: {
					roomid: a,
					id: e,
					type: i
				}
			}),
			notice: (a, e = "small_tv") => BAPI.ajax({
				url: "xlive/lottery-interface/v3/smalltv/Notice",
				data: {
					type: e,
					raffleId: a
				}
			})
		},
		pk: {
			check: a => BAPI.ajax({
				url: "xlive/lottery-interface/v1/pk/check",
				data: {
					roomid: a
				}
			}),
			join: (a, e) => BAPI.ajaxWithCommonArgs({
				method: "POST",
				url: "xlive/lottery-interface/v1/pk/join",
				data: {
					roomid: a,
					id: e
				}
			})
		},
		dosign: () => BAPI.ajax({
			url: "xlive/web-ucenter/v1/sign/DoSign"
		}),
		getDanmuInfo: (a, e = 0) => BAPI.ajax({
			url: "xlive/web-room/v1/index/getDanmuInfo",
			data: {
				id: a,
				type: e
			}
		}),
		getInfoByUser: a => BAPI.ajax({
			url: "xlive/web-room/v1/index/getInfoByUser",
			data: {
				room_id: a
			}
		}),
		wearMedal: a => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "xlive/web-room/v1/fansMedal/wear",
			data: {
				medal_id: a
			}
		}),
		getHotRank: (a, e, i = 0, t, o, r) => BAPI.ajax({
			url: "xlive/general-interface/v1/rank/getHotRank",
			data: {
				room_id: a,
				ruid: e,
				is_pre: i,
				area_id: t,
				page_size: o,
				source: r
			}
		}),
		getInfoByRoom: a => BAPI.ajax({
			url: "xlive/web-room/v1/index/getInfoByRoom",
			data: {
				room_id: a
			}
		}),
		roomEntryAction: (a, e = "pc") => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "/xlive/web-room/v1/index/roomEntryAction",
			data: {
				room_id: a,
				platform: e
			}
		}),
		trigerInteract: (a, e = 3) => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "/xlive/web-room/v1/index/TrigerInteract",
			data: {
				roomid: a,
				interact_type: e
			}
		}),
		likeInteract: a => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "/xlive/web-ucenter/v1/interact/likeInteract",
			data: {
				roomid: a,
				ts: BAPI_ts_s()
			}
		}),
		likeReportV3: (a, e) => BAPI.ajaxWithCommonArgs({
			method: "POST",
			url: "/xlive/app-ucenter/v1/like_info_v3/like/likeReportV3",
			data: {
				room_id: a,
				anchor_id: e,
				ts: BAPI_ts_s()
			}
		}),
		anchor: {
			check: a => BAPI.ajax({
				url: "xlive/lottery-interface/v1/Anchor/Check?roomid=" + a
			}),
			join: (a, e, i, t = "pc") => {
				var o = {
					id: a,
					platform: t
				};
				return void 0 !== e && void 0 !== i && (o.gift_id = e, o.gift_num = i), BAPI.ajaxWithCommonArgs({
					method: "POST",
					url: "xlive/lottery-interface/v1/Anchor/Join",
					data: o
				})
			},
			randTime: a => BAPI.ajax({
				url: "xlive/lottery-interface/v1/Anchor/RandTime?id=" + a
			})
		},
		popularityRedPocket: {
			followRelation: (a, e) => BAPI.ajax({
				url: "xlive/lottery-interface/v1/popularityRedPocket/FollowRelation",
				data: {
					uid: a,
					target_uid: e
				}
			}),
			draw: (a, e, i, t = "444.8.red_envelope.extract", o = "", r = "") => BAPI.ajaxWithCommonArgs({
				method: "POST",
				url: "xlive/lottery-interface/v1/popularityRedPocket/RedPocketDraw",
				data: {
					ruid: a,
					room_id: e,
					lot_id: i,
					spm_id: t,
					session_id: o,
					jump_from: r
				}
			})
		},
		app: {
			medal: (a = 1, e = 10) => BAPI.ajax({
				url: "xlive/app-ucenter/v1/user/GetMyMedals",
				data: {
					page: a,
					page_size: e
				}
			}),
			getUserTaskProgress: async (a, e = 358483030) => {
				let i = getAppCommonRequestJson(a);
				i.target_id = e;
				return (await BAPI.GMR({
						url: "xlive/app-ucenter/v1/userTask/GetUserTaskProgress",
						query: i,
						headers: getAppHeaders(e)
					}))
					.response
			},
			userTaskReceiveRewards: async (a, e = 358483030) => {
				let i = getAppCommonRequestJson(a);
				i.target_id = e;
				return (await BAPI.GMR({
						method: "POST",
						url: "xlive/app-ucenter/v1/userTask/UserTaskReceiveRewards",
						data: i,
						headers: getAppHeaders(e)
					}))
					.response
			},
			sendmsg: async (a, e, i, t) => {
				const o = getAppCommonRequestJson(a);
				return (await BAPI.GMR({
						method: "POST",
						url: "xlive/app-room/v1/dM/sendmsg",
						query: o,
						data: {
							bubble: 0,
							live_status: "live",
							cid: i,
							mid: t,
							msg: e,
							rnd: -Math.round(1e10 * Math.random()),
							mode: 1,
							pool: 0,
							type: "json",
							av_id: "-99998",
							color: 16777215,
							fontsize: 25,
							bussiness_extend: '{"broadcast_type":"0","stream_scale":"2","watch_ui_type":"2"}',
							flow_extend: '{"position":"1","s_position":"1","slide_direction":"-99998"}',
							jumpfrom_extend: "-99998",
							screen_status: 2,
							dm_type: 0,
							playTime: "0.0"
						},
						headers: getAppHeaders(t)
					}))
					.response
			}
		}
	},
	YearWelfare: {
		checkFirstCharge: () => BAPI.ajax({
			url: "YearWelfare/checkFirstCharge"
		}),
		inviteUserList: () => BAPI.ajax({
			url: "YearWelfare/inviteUserList/1"
		})
	},
	sendLiveDanmu: (a, e, i = "16777215", t = "25", o = "1", r = "0") => BAPI.ajaxWithCommonArgs({
		method: "POST",
		url: "msg/send",
		data: {
			color: i,
			fontsize: t,
			mode: o,
			msg: a,
			rnd: BAPI_ts_s(),
			roomid: e,
			bubble: r
		}
	}),
	sendMsg: (a, e = 0, i = "web") => BAPI.ajaxWithCommonArgs({
		method: "POST",
		url: "//api.vc.bilibili.com/web_im/v1/web_im/send_msg ",
		data: {
			"msg[sender_uid]": a.sender_uid,
			"msg[receiver_id]": a.receiver_id,
			"msg[receiver_type]": a.receiver_type || 1,
			"msg[msg_type]": a.msg_type || 1,
			"msg[msg_status]": a.msg_status || 0,
			"msg[content]": a.content,
			"msg[timestamp]": BAPI_ts_s(),
			"msg[dev_id]": a.dev_id,
			build: e,
			mobi_app: i
		}
	}),
	getCookie: a => {
		let e, i = document.cookie.split(";");
		for (var t = 0; t < i.length; t++)
			if (e = i[t].split("="), e[0].replace(" ", "") == a) return decodeURIComponent(e[1])
	},
	GMR: a => new Promise((e => {
		"object" != typeof a.data || a.data instanceof FormData || a.data instanceof Blob || (a.data = new URLSearchParams(a.data)
			.toString()), "object" == typeof a.query && (a.url = a.url.concat("?", new URLSearchParams(a.query)
			.toString())), a.url = ("//" === a.url.substr(0, 2) || "http" === a.url.substr(0, 4) ? "" : "https://api.live.bilibili.com/") + a.url, a.method = a.method || "GET", a.responseType = a.responseType || "json", a._ontimeout = a.ontimeout ? ? function() {}, a._onerror = a.onerror ? ? function() {}, a._onload = a.onload ? ? function() {}, a.ontimeout = function(e) {
			a._ontimeout(e), a.onerror(e)
		}, a.onerror = function(i) {
			a._onerror(i), console.error("XHR出错", a, i), e(void 0)
		}, a.onload = function(i) {
			a._onload(i), 200 === i.status ? e(i) : e({
				code: i.status,
				message: statusText
			})
		}, GM_xmlhttpRequest(a)
	}))
};
