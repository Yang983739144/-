var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, a = require("../../../api.js"), e = getApp();

Page({
    data: {
        switch_tab_1: "active",
        switch_tab_2: "",
        goods: {
            goods_pic: "https://goss1.vcg.com/creative/vcg/800/version23/VCG21f302700c4.jpg"
        },
        refund_data_1: {},
        refund_data_2: {}
    },
    onLoad: function(t) {
        e.pageOnLoad(this);
        var i = this;
        e.request({
            url: a.miaosha.refund_preview,
            data: {
                order_detail_id: t.id
            },
            success: function(t) {
                0 == t.code && i.setData({
                    goods: t.data
                }), 1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    image: "/images/icon-warning.png",
                    success: function(t) {
                        t.confirm && wx.navigateBack();
                    }
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    switchTab: function(t) {
        var a = this;
        1 == t.currentTarget.dataset.id ? a.setData({
            switch_tab_1: "active",
            switch_tab_2: ""
        }) : a.setData({
            switch_tab_1: "",
            switch_tab_2: "active"
        });
    },
    descInput: function(t) {
        var a = this, e = t.currentTarget.dataset.type, i = t.detail.value;
        if (1 == e) {
            var n = a.data.refund_data_1;
            n.desc = i, a.setData({
                refund_data_1: n
            });
        }
        if (2 == e) {
            var d = a.data.refund_data_2;
            d.desc = i, a.setData({
                refund_data_2: d
            });
        }
    },
    chooseImage: function(t) {
        var a = this, e = t.currentTarget.dataset.type;
        if (1 == e) {
            var i = a.data.refund_data_1, n = 0;
            i.pic_list && (n = i.pic_list.length || 0);
            s = 6 - n;
            wx.chooseImage({
                count: s,
                success: function(t) {
                    i.pic_list || (i.pic_list = []), i.pic_list = i.pic_list.concat(t.tempFilePaths), 
                    a.setData({
                        refund_data_1: i
                    });
                }
            });
        }
        if (2 == e) {
            var d = a.data.refund_data_2, n = 0;
            d.pic_list && (n = d.pic_list.length || 0);
            var s = 6 - n;
            wx.chooseImage({
                count: s,
                success: function(t) {
                    d.pic_list || (d.pic_list = []), d.pic_list = d.pic_list.concat(t.tempFilePaths), 
                    a.setData({
                        refund_data_2: d
                    });
                }
            });
        }
    },
    deleteImage: function(t) {
        var a = this, e = t.currentTarget.dataset.type, i = t.currentTarget.dataset.index;
        if (1 == e) {
            var n = a.data.refund_data_1;
            n.pic_list.splice(i, 1), a.setData({
                refund_data_1: n
            });
        }
        if (2 == e) {
            var d = a.data.refund_data_2;
            d.pic_list.splice(i, 1), a.setData({
                refund_data_2: d
            });
        }
    },
    refundSubmit: function(i) {
        var n = this, d = i.currentTarget.dataset.type;
        if (1 == d) {
            var s, o, c = function() {
                var t = function() {
                    wx.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), e.request({
                        url: a.miaosha.refund,
                        method: "post",
                        data: {
                            type: 1,
                            order_id: n.data.goods.order_id,
                            desc: r,
                            pic_list: JSON.stringify(u)
                        },
                        success: function(t) {
                            wx.hideLoading(), 0 == t.code && wx.showModal({
                                title: "提示",
                                content: t.msg,
                                showCancel: !1,
                                success: function(t) {
                                    t.confirm && wx.redirectTo({
                                        url: "/pages/miaosha/order/order?status=4"
                                    });
                                }
                            }), 1 == t.code && wx.showModal({
                                title: "提示",
                                content: t.msg,
                                showCancel: !1,
                                success: function(t) {
                                    t.confirm && wx.navigateBack({
                                        delta: 2
                                    });
                                }
                            });
                        }
                    });
                };
                if (0 == (r = n.data.refund_data_1.desc || "").length) return wx.showToast({
                    title: "请填写退款原因",
                    image: "/images/icon-warning.png"
                }), {
                    v: void 0
                };
                if (u = [], _ = 0, s = e.siteInfo, o = {}, -1 != s.uniacid && "-1" != s && (o._uniacid = s.uniacid, 
                o._acid = s.acid), n.data.refund_data_1.pic_list && n.data.refund_data_1.pic_list.length > 0) {
                    wx.showLoading({
                        title: "正在上传图片",
                        mask: !0
                    });
                    for (f in n.data.refund_data_1.pic_list) !function(e) {
                        wx.uploadFile({
                            url: a.default.upload_image,
                            filePath: n.data.refund_data_1.pic_list[e],
                            name: "image",
                            formData: o,
                            success: function(t) {},
                            complete: function(a) {
                                _++, 200 == a.statusCode && 0 == (a = JSON.parse(a.data)).code && (u[e] = a.data.url), 
                                _ == n.data.refund_data_1.pic_list.length && (wx.hideLoading(), t());
                            }
                        });
                    }(f);
                } else t();
            }();
            if ("object" === (void 0 === c ? "undefined" : t(c))) return c.v;
        }
        if (2 == d) {
            var r, u, _, f, l = function() {
                var t = function() {
                    wx.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), e.request({
                        url: a.order.refund,
                        method: "post",
                        data: {
                            type: 2,
                            order_detail_id: n.data.goods.order_detail_id,
                            desc: r,
                            pic_list: JSON.stringify(u)
                        },
                        success: function(t) {
                            wx.hideLoading(), 0 == t.code && wx.showModal({
                                title: "提示",
                                content: t.msg,
                                showCancel: !1,
                                success: function(t) {
                                    t.confirm && wx.redirectTo({
                                        url: "/pages/miaosha/order/order?status=4"
                                    });
                                }
                            }), 1 == t.code && wx.showModal({
                                title: "提示",
                                content: t.msg,
                                showCancel: !1,
                                success: function(t) {
                                    t.confirm && wx.navigateBack({
                                        delta: 2
                                    });
                                }
                            });
                        }
                    });
                };
                if (0 == (r = n.data.refund_data_2.desc || "").length) return wx.showToast({
                    title: "请填写换货说明",
                    image: "/images/icon-warning.png"
                }), {
                    v: void 0
                };
                if (u = [], _ = 0, n.data.refund_data_2.pic_list && n.data.refund_data_2.pic_list.length > 0) {
                    wx.showLoading({
                        title: "正在上传图片",
                        mask: !0
                    });
                    for (f in n.data.refund_data_2.pic_list) !function(e) {
                        wx.uploadFile({
                            url: a.default.upload_image,
                            filePath: n.data.refund_data_2.pic_list[e],
                            name: "image",
                            success: function(t) {},
                            complete: function(a) {
                                _++, 200 == a.statusCode && 0 == (a = JSON.parse(a.data)).code && (u[e] = a.data.url), 
                                _ == n.data.refund_data_2.pic_list.length && (wx.hideLoading(), t());
                            }
                        });
                    }(f);
                } else t();
            }();
            if ("object" === (void 0 === l ? "undefined" : t(l))) return l.v;
        }
    }
});