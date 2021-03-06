var t = require("../../api.js"), a = getApp(), s = !1, e = !1, n = 2;

Page({
    data: {
        status: -1,
        list: [],
        hidden: -1,
        is_no_more: !1,
        is_loading: !1
    },
    onLoad: function(t) {
        a.pageOnLoad(this), s = !1, e = !1, n = 2, this.GetList(t.status || -1);
    },
    GetList: function(s) {
        var e = this;
        e.setData({
            status: parseInt(s || -1)
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), a.request({
            url: t.share.get_order,
            data: {
                status: e.data.status
            },
            success: function(t) {
                e.setData({
                    list: t.data
                }), 0 == t.data.length && e.setData({
                    is_no_more: !0
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    click: function(t) {
        var a = this, s = t.currentTarget.dataset.index;
        a.setData({
            hidden: a.data.hidden == s ? -1 : s
        });
    },
    onReachBottom: function() {
        var i = this;
        e || s || (e = !0, i.setData({
            is_loading: e
        }), a.request({
            url: t.share.get_order,
            data: {
                status: i.data.status,
                page: n
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = i.data.list.concat(t.data);
                    i.setData({
                        list: a
                    }), 0 == t.data.length && (s = !0, i.setData({
                        is_no_more: s
                    }));
                }
                n++;
            },
            complete: function() {
                e = !1, i.setData({
                    is_loading: e
                });
            }
        }));
    }
});