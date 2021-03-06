var t = require("../../../api.js"),
    o = getApp();
Page({
    data: {
        status: 1,
        goods_list: [],
        no_goods: !1,
        no_more_goods: !1
    },
    onLoad: function(t) {
        o.pageOnLoad(this);
        var a = this;
        a.setData({
            status: parseInt(t.status || 1),
            loading_more: !0
        }), a.loadGoodsList(function() {
            a.setData({
                loading_more: !1
            })
        })
    },
    onReady: function() {
        o.pageOnReady(this)
    },
    onShow: function() {
        o.pageOnShow(this)
    },
    onHide: function() {
        o.pageOnHide(this)
    },
    onUnload: function() {
        o.pageOnUnload(this)
    },
    onPullDownRefresh: function() {},
    onReachBottom: function(t) {
        var o = this;
        o.data.loading_more || (o.setData({
            loading_more: !0
        }), o.loadGoodsList(function() {
            o.setData({
                loading_more: !1
            })
        }))
    },
    searchSubmit: function(t) {
        var o = this,
            a = t.detail.value;
        o.setData({
            keyword: a,
            loading_more: !0,
            goods_list: [],
            current_page: 0
        }), o.loadGoodsList(function() {
            o.setData({
                loading_more: !1
            })
        })
    },
    loadGoodsList: function(a) {
        var s = this;
        if (s.data.no_goods || s.data.no_more_goods) "function" == typeof a && a();
        else {
            var e = (s.data.current_page || 0) + 1;
            o.request({
                url: t.mch.goods.list,
                data: {
                    page: e,
                    status: s.data.status,
                    keyword: s.data.keyword || ""
                },
                success: function(t) {
                    0 == t.code && (1 != e || t.data.list && t.data.list.length || s.setData({
                        no_goods: !0
                    }), t.data.list && t.data.list.length ? (s.data.goods_list = s.data.goods_list || [], s.data.goods_list = s.data.goods_list.concat(t.data.list), s.setData({
                        goods_list: s.data.goods_list,
                        current_page: e
                    })) : s.setData({
                        no_more_goods: !0
                    }))
                },
                complete: function() {
                    "function" == typeof a && a()
                }
            })
        }
    },
    showMoreAlert: function(t) {
        var o = this;
        setTimeout(function() {
            var a = t.currentTarget.dataset.index;
            o.data.goods_list[a].show_alert = !0, o.setData({
                goods_list: o.data.goods_list
            })
        }, 50)
    },
    hideMoreAlert: function(t) {
        var o = this,
            a = !1;
        for (var s in o.data.goods_list) o.data.goods_list[s].show_alert && (o.data.goods_list[s].show_alert = !1, a = !0);
        a && setTimeout(function() {
            o.setData({
                goods_list: o.data.goods_list
            })
        }, 100)
    },
    setGoodsStatus: function(a) {
        var s = this,
            e = a.currentTarget.dataset.targetStatus,
            d = a.currentTarget.dataset.index;
        wx.showLoading({
            title: "正在处理",
            mask: !0
        }), o.request({
            url: t.mch.goods.set_status,
            data: {
                id: s.data.goods_list[d].id,
                status: e
            },
            success: function(t) {
                0 == t.code && (s.data.goods_list[d].status = e, s.setData({
                    goods_list: s.data.goods_list
                })), s.showToast({
                    title: t.msg,
                    duration: 1500
                })
            },
            complete: function() {
                wx.hideLoading()
            }
        })
    },
    goodsDelete: function(a) {
        var s = this,
            e = a.currentTarget.dataset.index;
        wx.showModal({
            title: "警告",
            content: "确认删除该商品？",
            success: function(a) {
                a.confirm && (wx.showLoading({
                    title: "正在处理",
                    mask: !0
                }), o.request({
                    url: t.mch.goods.delete,
                    data: {
                        id: s.data.goods_list[e].id
                    },
                    success: function(t) {
                        s.showToast({
                            title: t.msg
                        }), 0 == t.code && (s.data.goods_list.splice(e, 1), s.setData({
                            goods_list: s.data.goods_list
                        }))
                    },
                    complete: function() {
                        wx.hideLoading()
                    }
                }))
            }
        })
    }
});