var t = require("../../../api.js"), a = getApp(), n = !1, o = !1;

Page({
    data: {
        p: 1
    },
    onLoad: function(t) {
        a.pageOnLoad(this), n = !1, o = !1;
    },
    onReady: function() {},
    onShow: function() {
        getApp().pageOnShow(this), this.loadData();
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    loadData: function() {
        var e = this, i = e.data.p;
        if (!o) {
            o = !0, wx.showLoading({
                title: "加载中"
            });
            var s = Math.round(new Date().getTime() / 1e3).toString();
            a.request({
                url: t.integral.exchange,
                data: {
                    page: i
                },
                success: function(t) {
                    if (0 == t.code) {
                        var a = t.data.list[0].userCoupon;
                        if (a) for (var o in a) parseInt(a[o].end_time) < parseInt(s) ? a[o].status = 2 : a[o].status = "", 
                        1 == a[o].is_use && (a[o].status = 1);
                        e.setData({
                            goods: t.data.list[0].goodsDetail,
                            coupon: a,
                            page: i + 1,
                            is_no_more: n
                        });
                    }
                },
                complete: function(t) {
                    o = !1, wx.hideLoading();
                }
            });
        }
    }
});