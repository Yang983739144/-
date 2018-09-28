var e = require("../../../api.js"),
    t = getApp();
Page({
    data: {
        order: {}
    },
    onLoad: function(o) {
        t.pageOnLoad(this);
        var a = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), t.request({
            url: e.mch.order.detail,
            data: {
                id: o.id
            },
            success: function(e) {
                0 == e.code ? a.setData({
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
        t.pageOnReady(this)
    },
    onShow: function() {
        t.pageOnShow(this)
    },
    onHide: function() {
        t.pageOnHide(this)
    },
    onUnload: function() {
        t.pageOnUnload(this)
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    expressChange: function(e) {
        var t = this;
        t.data.order.default_express = t.data.order.express_list[e.detail.value].express, t.setData({
            order: t.data.order
        })
    },
    expressInput: function(e) {
        this.data.order.default_express = e.detail.value
    },
    expressNoInput: function(e) {
        this.data.order.express_no = e.detail.value
    },
    wordsInput: function(e) {
        this.data.order.words = e.detail.value
    },
    formSubmit: function(o) {
        var a = this;
        wx.showLoading({
            title: "正在提交",
            mask: !0
        }), t.request({
            url: e.mch.order.send,
            method: "post",
            data: {
                send_type: "express",
                order_id: a.data.order.id,
                express: o.detail.value.express,
                express_no: o.detail.value.express_no,
                words: o.detail.value.words
            },
            success: function(e) {
                wx.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && 0 == e.code && wx.navigateBack()
                    }
                })
            },
            complete: function(e) {
                wx.hideLoading()
            }
        })
    }
});