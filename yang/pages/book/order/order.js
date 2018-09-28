var t = require("../../../api.js"), e = getApp(), o = !1, a = !1, n = 2;

Page({
    data: {
        hide: 1,
        qrcode: ""
    },
    onLoad: function(t) {
        e.pageOnLoad(this), o = !1, a = !1, n = 2, this.loadOrderList(t.status || -1);
    },
    onReady: function() {},
    onShow: function() {
        e.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var i = this;
        a || o || (a = !0, e.request({
            url: t.book.order_list,
            data: {
                status: i.data.status,
                page: n
            },
            success: function(t) {
                if (0 == t.code) {
                    var e = i.data.order_list.concat(t.data.list);
                    i.setData({
                        order_list: e
                    }), 0 == t.data.list.length && (o = !0);
                }
                n++;
            },
            complete: function() {
                a = !1;
            }
        }));
    },
    onShareAppMessage: function() {},
    loadOrderList: function(o) {
        void 0 == o && (o = -1);
        var a = this;
        a.setData({
            status: o
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), e.request({
            url: t.book.order_list,
            data: {
                status: a.data.status
            },
            success: function(t) {
                0 == t.code && a.setData({
                    order_list: t.data.list
                }), a.setData({
                    show_no_data_tip: 0 == a.data.order_list.length
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    orderCancel: function(o) {
        wx.showLoading({
            title: "正在加载",
            mask: !0
        });
        var a = o.currentTarget.dataset.id;
        e.request({
            url: t.book.order_cancel,
            data: {
                id: a
            },
            success: function(t) {
                0 == t.code && wx.redirectTo({
                    url: "/pages/book/order/order?status=0"
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    GoToPay: function(o) {
        wx.showLoading({
            title: "正在提交",
            mask: !0
        }), e.request({
            url: t.book.order_pay,
            data: {
                id: o.currentTarget.dataset.id
            },
            complete: function() {
                wx.hideLoading();
            },
            success: function(t) {
                0 == t.code && wx.requestPayment({
                    timeStamp: t.data.timeStamp,
                    nonceStr: t.data.nonceStr,
                    package: t.data.package,
                    signType: t.data.signType,
                    paySign: t.data.paySign,
                    success: function(t) {},
                    fail: function(t) {},
                    complete: function(t) {
                        "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? wx.redirectTo({
                            url: "/pages/book/order/order?status=1"
                        }) : wx.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function(t) {
                                t.confirm && wx.redirectTo({
                                    url: "/pages/book/order/order?status=0"
                                });
                            }
                        });
                    }
                }), 1 == t.code && wx.showToast({
                    title: t.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    goToDetails: function(t) {
        wx.navigateTo({
            url: "/pages/book/order/details?oid=" + t.currentTarget.dataset.id
        });
    },
    orderQrcode: function(o) {
        var a = this, n = o.target.dataset.index;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), a.data.order_list[n].offline_qrcode ? (a.setData({
            hide: 0,
            qrcode: a.data.order_list[n].offline_qrcode
        }), wx.hideLoading()) : e.request({
            url: t.book.get_qrcode,
            data: {
                order_no: a.data.order_list[n].order_no
            },
            success: function(t) {
                0 == t.code ? a.setData({
                    hide: 0,
                    qrcode: t.data.url
                }) : wx.showModal({
                    title: "提示",
                    content: t.msg
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    hide: function(t) {
        this.setData({
            hide: 1
        });
    },
    applyRefund: function(o) {
        var a = o.target.dataset.id;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), e.request({
            url: t.book.apply_refund,
            data: {
                order_id: a
            },
            success: function(t) {
                0 == t.code ? wx.showModal({
                    title: "提示",
                    content: "申请退款成功",
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/book/order/order?status=3"
                        });
                    }
                }) : wx.showModal({
                    title: "提示",
                    content: t.msg
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    comment: function(t) {
        wx.navigateTo({
            url: "/pages/book/order-comment/order-comment?id=" + t.target.dataset.id,
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        });
    }
});