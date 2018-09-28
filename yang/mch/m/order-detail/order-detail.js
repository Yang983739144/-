var e = require("../../../api.js"),
    d = getApp();
Page({
    data: {
        show_edit_modal: !1,
        order_sub_price: "",
        order_sub_price_mode: !0,
        order_add_price: "",
        order_add_price_mode: !1,
        show_send_modal: !1,
        send_type: "express",
        order: null
    },
    onLoad: function(t) {
        d.pageOnLoad(this);
        var o = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), d.request({
            url: e.mch.order.detail,
            data: {
                id: t.id
            },
            success: function(e) {
                0 == e.code ? o.setData({
                    order: e.data.order
                }) : wx.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && wx.navigateBack()
                    }
                })
            },
            complete: function() {
                wx.hideLoading()
            }
        })
    },
    onReady: function() {
        d.pageOnReady(this)
    },
    onShow: function() {
        d.pageOnShow(this)
    },
    onHide: function() {
        d.pageOnHide(this)
    },
    onUnload: function() {
        d.pageOnUnload(this)
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    copyUserAddress: function() {
        var e = this;
        wx.setClipboardData({
            data: "收货人:" + e.data.order.username + ",联系电话:" + e.data.order.mobile + ",收货地址:" + e.data.order.address,
            success: function(d) {
                wx.getClipboardData({
                    success: function(d) {
                        e.showToast({
                            title: "已复制收货信息"
                        })
                    }
                })
            }
        })
    },
    showEditModal: function(e) {
        this.setData({
            show_edit_modal: !0,
            order_sub_price: "",
            order_add_price: "",
            order_sub_price_mode: !0,
            order_add_price_mode: !1
        })
    },
    hideEditModal: function(e) {
        this.setData({
            show_edit_modal: !1
        })
    },
    tabSwitch: function(e) {
        var d = this,
            t = e.currentTarget.dataset.tab;
        "order_sub_price_mode" == t && d.setData({
            order_sub_price_mode: !0,
            order_add_price_mode: !1
        }), "order_add_price_mode" == t && d.setData({
            order_sub_price_mode: !1,
            order_add_price_mode: !0
        })
    },
    subPriceInput: function(e) {
        this.setData({
            order_sub_price: e.detail.value
        })
    },
    subPriceBlur: function(e) {
        var d = this,
            t = parseFloat(e.detail.value);
        t = isNaN(t) ? "" : t <= 0 ? "" : t.toFixed(2), d.setData({
            order_sub_price: t
        })
    },
    addPriceInput: function(e) {
        this.setData({
            order_add_price: e.detail.value
        })
    },
    addPriceBlur: function(e) {
        var d = this,
            t = parseFloat(e.detail.value);
        t = isNaN(t) ? "" : t <= 0 ? "" : t.toFixed(2), d.setData({
            order_add_price: t
        })
    },
    editPriceSubmit: function() {
        var t = this,
            o = t.data.order_sub_price_mode ? "sub" : "add";
        wx.showLoading({
            mask: !0,
            title: "正在处理"
        }), d.request({
            url: e.mch.order.edit_price,
            method: "post",
            data: {
                order_id: t.data.order.id,
                type: o,
                price: "sub" == o ? t.data.order_sub_price : t.data.order_add_price
            },
            success: function(e) {
                wx.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(d) {
                        d.confirm && 0 == e.code && wx.redirectTo({
                            url: "/mch/m/order-detail/order-detail?id=" + t.data.order.id
                        })
                    }
                })
            },
            complete: function() {
                wx.hideLoading()
            }
        })
    },
    showSendModal: function() {
        this.setData({
            show_send_modal: !0,
            send_type: "express"
        })
    },
    hideSendModal: function() {
        this.setData({
            show_send_modal: !1
        })
    },
    switchSendType: function(e) {
        var d = this,
            t = e.currentTarget.dataset.type;
        d.setData({
            send_type: t
        })
    },
    sendSubmit: function() {
        var t = this;
        if ("express" == t.data.send_type) return t.hideSendModal(), void wx.navigateTo({
            url: "/mch/m/order-send/order-send?id=" + t.data.order.id
        });
        wx.showModal({
            title: "提示",
            content: "无需物流方式订单将直接标记成已发货，确认操作？",
            success: function(o) {
                o.confirm && (wx.showLoading({
                    title: "正在提交",
                    mask: !0
                }), d.request({
                    url: e.mch.order.send,
                    method: "post",
                    data: {
                        send_type: "none",
                        order_id: t.data.order.id
                    },
                    success: function(e) {
                        wx.showModal({
                            title: "提示",
                            content: e.msg,
                            success: function(d) {
                                d.confirm && 0 == e.code && wx.redirectTo({
                                    url: "/mch/m/order-detail/order-detail?id=" + t.data.order.id
                                })
                            }
                        })
                    },
                    complete: function() {
                        wx.hideLoading({
                            title: "正在提交",
                            mask: !0
                        })
                    }
                }))
            }
        })
    }
});