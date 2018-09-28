var t = require("../../../api.js"), e = require("../../../utils/utils.js"), a = getApp();

Page({
    data: {
        now_date: new Date()
    },
    onLoad: function(t) {
        a.pageOnLoad(this), this.getPreview(t);
    },
    onReady: function() {},
    onShow: function() {
        a.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    checkboxChange: function(t) {
        var e = this, a = t.target.dataset.pid, o = t.target.dataset.id, i = e.data.form_list, s = i[a].default[o].selected;
        i[a].default[o].selected = 1 != s, e.setData({
            form_list: i
        });
    },
    radioChange: function(t) {
        var e = this, a = t.target.dataset.pid, o = e.data.form_list;
        for (var i in o[a].default) t.target.dataset.id == i ? o[a].default[i].selected = !0 : o[a].default[i].selected = !1;
        e.setData({
            form_list: o
        });
    },
    inputChenge: function(t) {
        var e = this, a = t.target.dataset.id, o = e.data.form_list;
        o[a].default = t.detail.value, e.setData({
            form_list: o
        });
    },
    getPreview: function(o) {
        var i = this, s = o.id;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), a.request({
            url: t.book.submit_preview,
            method: "get",
            data: {
                gid: s
            },
            success: function(o) {
                if (0 == o.code) {
                    for (var s in o.data.form_list) "date" == o.data.form_list[s].type && (o.data.form_list[s].default = o.data.form_list[s].default ? o.data.form_list[s].default : e.formatData(new Date())), 
                    "time" == o.data.form_list[s].type && (o.data.form_list[s].default = o.data.form_list[s].default ? o.data.form_list[s].default : "00:00");
                    var n = o.data.option;
                    n ? (1 == n.balance && (i.setData({
                        balance: !0,
                        pay_type: "BALANCE_PAY"
                    }), a.request({
                        url: t.user.index,
                        success: function(t) {
                            0 == t.code && wx.setStorageSync("user_info", t.data.user_info);
                        }
                    })), 1 == n.wechat && i.setData({
                        wechat: !0,
                        pay_type: "WECHAT_PAY"
                    })) : i.setData({
                        wechat: !0,
                        pay_type: "WECHAT_PAY"
                    }), i.setData({
                        goods: o.data.goods,
                        form_list: o.data.form_list
                    });
                } else wx.showModal({
                    title: "提示",
                    content: o.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/book/index/index"
                        });
                    }
                });
            },
            complete: function(t) {
                setTimeout(function() {
                    wx.hideLoading();
                }, 1e3);
            }
        });
    },
    booksubmit: function(t) {
        var e = this, a = e.data.pay_type;
        if (0 != e.data.goods.price) {
            if ("BALANCE_PAY" == a) {
                var o = wx.getStorageSync("user_info");
                wx.showModal({
                    title: "当前账户余额：" + o.money,
                    content: "是否使用余额",
                    success: function(a) {
                        a.confirm && e.submit(t);
                    }
                });
            }
            "WECHAT_PAY" == a && e.submit(t);
        } else e.submit(t);
    },
    submit: function(e) {
        var o = e.detail.formId, i = this, s = i.data.goods.id, n = JSON.stringify(i.data.form_list), r = i.data.pay_type;
        wx.showLoading({
            title: "正在提交",
            mask: !0
        }), a.request({
            url: t.book.submit,
            method: "post",
            data: {
                gid: s,
                form_list: n,
                form_id: o,
                pay_type: r
            },
            success: function(t) {
                if (0 == t.code) {
                    if (1 != t.type) return wx.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), void wx.requestPayment({
                        timeStamp: t.data.timeStamp,
                        nonceStr: t.data.nonceStr,
                        package: t.data.package,
                        signType: t.data.signType,
                        paySign: t.data.paySign,
                        success: function(t) {
                            wx.redirectTo({
                                url: "/pages/book/order/order?status=1"
                            });
                        },
                        fail: function(t) {},
                        complete: function(t) {
                            setTimeout(function() {
                                wx.hideLoading();
                            }, 1e3), "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? "requestPayment:ok" != t.errMsg && wx.redirectTo({
                                url: "/pages/book/order/order?status=-1"
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
                    });
                    wx.redirectTo({
                        url: "/pages/book/order/order?status=1"
                    });
                } else wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {}
                });
            },
            complete: function(t) {
                setTimeout(function() {
                    wx.hideLoading();
                }, 1e3);
            }
        });
    },
    switch: function(t) {
        this.setData({
            pay_type: t.currentTarget.dataset.type
        });
    },
    uploadImg: function(t) {
        var e = this, o = t.currentTarget.dataset.id, i = e.data.form_list;
        a.uploader.upload({
            start: function() {
                wx.showLoading({
                    title: "正在上传",
                    mask: !0
                });
            },
            success: function(t) {
                0 == t.code ? (i[o].default = t.data.url, e.setData({
                    form_list: i
                })) : e.showToast({
                    title: t.msg
                });
            },
            error: function(t) {
                e.showToast({
                    title: t
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    }
});