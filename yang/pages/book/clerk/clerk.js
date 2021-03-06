var e = require("../../../api.js"), o = (require("../../../utils.js"), getApp());

Page({
    data: {
        hide: 1,
        qrcode: ""
    },
    onLoad: function(e) {
        this.getOrderDetails(e);
    },
    onReady: function() {},
    onShow: function() {
        o.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    getOrderDetails: function(t) {
        var n = t.scene, i = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), o.request({
            url: e.book.clerk_order_details,
            method: "get",
            data: {
                id: n
            },
            success: function(e) {
                0 == e.code ? i.setData({
                    goods: e.data
                }) : wx.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && wx.redirectTo({
                            url: "/pages/user/user"
                        });
                    }
                });
            },
            complete: function(e) {
                setTimeout(function() {
                    wx.hideLoading();
                }, 1e3);
            }
        });
    },
    goToGoodsDetails: function(e) {
        wx.redirectTo({
            url: "/pages/book/details/details?id=" + this.data.goods.goods_id
        });
    },
    nowWriteOff: function(t) {
        var n = this;
        wx.showModal({
            title: "提示",
            content: "是否确认核销？",
            success: function(t) {
                t.confirm ? (wx.showLoading({
                    title: "正在加载"
                }), o.request({
                    url: e.book.clerk,
                    data: {
                        order_id: n.data.goods.id
                    },
                    success: function(e) {
                        0 == e.code ? wx.redirectTo({
                            url: "/pages/user/user"
                        }) : wx.showModal({
                            title: "警告！",
                            showCancel: !1,
                            content: e.msg,
                            confirmText: "确认",
                            success: function(e) {
                                e.confirm && wx.redirectTo({
                                    url: "/pages/index/index"
                                });
                            }
                        });
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                })) : t.cancel;
            }
        });
    }
});