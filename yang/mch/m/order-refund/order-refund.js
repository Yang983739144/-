var t = require("../../../api.js"),
    e = getApp();
Page({
    data: {},
    onLoad: function(o) {
        e.pageOnLoad(this);
        var n = this;
        n.setData({
            id: o.id || 0
        }), wx.showLoading({
            title: "加载中",
            mask: !0
        }), e.request({
            url: t.mch.order.refund_detail,
            data: {
                id: n.data.id
            },
            success: function(t) {
                0 == t.code && n.setData(t.data), 1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1
                })
            },
            complete: function(t) {
                wx.hideLoading()
            }
        })
    },
    onReady: function() {
        e.pageOnReady(this)
    },
    onShow: function() {
        e.pageOnShow(this)
    },
    onHide: function() {
        e.pageOnHide(this)
    },
    onUnload: function() {
        e.pageOnUnload(this)
    },
    showPicList: function(t) {
        var e = this;
        wx.previewImage({
            urls: e.data.pic_list,
            current: e.data.pic_list[t.currentTarget.dataset.pindex]
        })
    },
    refundPass: function(o) {
        var n = this,
            i = n.data.id,
            a = n.data.type;
        wx.showModal({
            title: "提示",
            content: "确认同意" + (1 == a ? "退款？资金将原路返回！" : "换货？"),
            success: function(o) {
                o.confirm && (wx.showLoading({
                    title: "正在处理",
                    mask: !0
                }), e.request({
                    url: t.mch.order.refund,
                    method: "post",
                    data: {
                        id: i,
                        action: "pass"
                    },
                    success: function(t) {
                        wx.showModal({
                            title: "提示",
                            content: t.msg,
                            showCancel: !1,
                            success: function(t) {
                                wx.redirectTo({
                                    url: "/" + n.route + "?" + getApp().utils.objectToUrlParams(n.options)
                                })
                            }
                        })
                    },
                    complete: function() {
                        wx.hideLoading()
                    }
                }))
            }
        })
    },
    refundDeny: function(o) {
        var n = this,
            i = n.data.id;
        wx.showModal({
            title: "提示",
            content: "确认拒绝？",
            success: function(o) {
                o.confirm && (wx.showLoading({
                    title: "正在处理",
                    mask: !0
                }), e.request({
                    url: t.mch.order.refund,
                    method: "post",
                    data: {
                        id: i,
                        action: "deny"
                    },
                    success: function(t) {
                        wx.showModal({
                            title: "提示",
                            content: t.msg,
                            showCancel: !1,
                            success: function(t) {
                                wx.redirectTo({
                                    url: "/" + n.route + "?" + getApp().utils.objectToUrlParams(n.options)
                                })
                            }
                        })
                    },
                    complete: function() {
                        wx.hideLoading()
                    }
                }))
            }
        })
    }
});