var a = require("../../api.js"),
    t = getApp();
Page({
    data: {
        args: !1,
        page: 1
    },
    onLoad: function() {
        t.pageOnLoad(this)
    },
    onShow: function() {
        var e = this;
        wx.showLoading({
            title: "加载中"
        }), t.request({
            url: a.scratch.prize,
            data: {
                page: 1
            },
            success: function(a) {
                0 != a.code || e.setData({
                    list: e.setName(a.data)
                })
            },
            complete: function(a) {
                wx.hideLoading()
            }
        })
    },
    onReachBottom: function() {
        var e = this;
        if (!e.data.args) {
            var r = e.data.page + 1;
            t.request({
                url: a.scratch.prize,
                data: {
                    page: r
                },
                success: function(a) {
                    if (0 == a.code) {
                        var t = e.setName(a.data);
                        e.setData({
                            list: e.data.list.concat(t),
                            page: r
                        })
                    } else e.data.args = !0
                }
            })
        }
    },
    setName: function(a) {
        return a.forEach(function(t, e, r) {
            switch (t.type) {
                case 1:
                    a[e].name = t.price + "元红包";
                    break;
                case 2:
                    a[e].name = t.coupon;
                    break;
                case 3:
                    a[e].name = t.num + "积分";
                    break;
                case 4:
                    a[e].name = t.gift;
                    break;
                case 5:
                    a[e].name = "谢谢参与"
            }
        }), a
    },
    submit: function(a) {
        var t = a.currentTarget.dataset.gift,
            e = JSON.parse(a.currentTarget.dataset.attr),
            r = a.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/order-submit/order-submit?scratch_id=" + r + "&goods_info=" + JSON.stringify({
                goods_id: t,
                attr: e,
                num: 1
            })
        })
    },
    onShareAppMessage: function() {
        return {
            path: "/pond/pond/pond?parent_id=" + wx.getStorageSync("user_info").id,
            title: "九宫格抽奖"
        }
    }
});