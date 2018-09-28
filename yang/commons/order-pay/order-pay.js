var t = require("../../api.js"), e = getApp(), a = {
    init: function(a, o) {
        var i = this;
        i.page = a, e = o, i.page.orderPay = function(a) {
            function o(t, a, o) {
                e.request({
                    url: a,
                    data: {
                        order_id: t,
                        pay_type: "WECHAT_PAY"
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
                                    url: "/" + o + "?status=1"
                                }) : wx.showModal({
                                    title: "提示",
                                    content: "订单尚未支付",
                                    showCancel: !1,
                                    confirmText: "确认",
                                    success: function(t) {
                                        t.confirm && wx.redirectTo({
                                            url: "/" + o + "?status=0"
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
            }
            function r(t, a, o) {
                var i = wx.getStorageSync("user_info");
                wx.showModal({
                    title: "当前账户余额：" + i.money,
                    content: "是否使用余额",
                    success: function(i) {
                        i.confirm && (wx.showLoading({
                            title: "正在提交",
                            mask: !0
                        }), e.request({
                            url: a,
                            data: {
                                order_id: t,
                                pay_type: "BALANCE_PAY"
                            },
                            complete: function() {
                                wx.hideLoading();
                            },
                            success: function(t) {
                                0 == t.code && wx.redirectTo({
                                    url: "/" + o + "?status=1"
                                }), 1 == t.code && wx.showModal({
                                    title: "提示",
                                    content: t.msg,
                                    showCancel: !1
                                });
                            }
                        }));
                    }
                });
            }
            var s = a.currentTarget.dataset.index, n = i.page.data.order_list[s], d = new Array();
            if (void 0 !== i.page.data.pay_type_list) d = i.page.data.pay_type_list; else if (void 0 !== n.pay_type_list) d = n.pay_type_list; else if (void 0 !== n.goods_list[0].pay_type_list) d = n.goods_list[0].pay_type_list; else {
                var c = {};
                c.payment = 0, d.push(c);
            }
            var g = getCurrentPages(), u = g[g.length - 1].route, p = t.order.pay_data;
            -1 != u.indexOf("pt") ? p = t.group.pay_data : -1 != u.indexOf("miaosha") && (p = t.miaosha.pay_data), 
            1 == d.length ? (wx.showLoading({
                title: "正在提交",
                mask: !0
            }), 0 == d[0].payment && o(n.order_id, p, u), 3 == d[0].payment && r(n.order_id, p, u)) : wx.showModal({
                title: "提示",
                content: "选择支付方式",
                cancelText: "余额支付",
                confirmText: "微信支付",
                success: function(t) {
                    t.confirm ? (wx.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), o(n.order_id, p, u)) : t.cancel && r(n.order_id, p, u);
                }
            });
        }, i.page.order_submit = function(o, r) {
            function s() {
                wx.showLoading({
                    title: "正在提交",
                    mask: !0
                }), e.request({
                    url: n,
                    method: "post",
                    data: o,
                    success: function(t) {
                        if (0 == t.code) {
                            var s = function() {
                                e.request({
                                    url: d,
                                    data: {
                                        order_id: n,
                                        order_id_list: g,
                                        pay_type: u,
                                        form_id: o.formId
                                    },
                                    success: function(t) {
                                        if (0 != t.code) return wx.hideLoading(), void i.page.showToast({
                                            title: t.msg,
                                            image: "/images/icon-warning.png"
                                        });
                                        setTimeout(function() {
                                            wx.hideLoading();
                                        }, 1e3), "pt" == r ? "ONLY_BUY" == i.page.data.type ? wx.redirectTo({
                                            url: c + "?status=2"
                                        }) : wx.redirectTo({
                                            url: "/pages/pt/group/details?oid=" + n
                                        }) : void 0 !== i.page.data.goods_card_list && i.page.data.goods_card_list.length > 0 && 2 != o.payment ? i.page.setData({
                                            show_card: !0
                                        }) : wx.redirectTo({
                                            url: c + "?status=-1"
                                        });
                                    }
                                });
                            };
                            if (void 0 != t.data.p_price && 0 === t.data.p_price) return a.showToast({
                                title: "提交成功"
                            }), void setTimeout(function() {
                                wx.navigateBack();
                            }, 2e3);
                            setTimeout(function() {
                                i.page.setData({
                                    options: {}
                                });
                            }, 1);
                            var n = t.data.order_id || "", g = t.data.order_id_list ? JSON.stringify(t.data.order_id_list) : "", u = "";
                            0 == o.payment ? e.request({
                                url: d,
                                data: {
                                    order_id: n,
                                    order_id_list: g,
                                    pay_type: "WECHAT_PAY"
                                },
                                success: function(t) {
                                    if (0 != t.code) {
                                        if (1 == t.code) return wx.hideLoading(), void i.page.showToast({
                                            title: t.msg,
                                            image: "/images/icon-warning.png"
                                        });
                                    } else {
                                        setTimeout(function() {
                                            wx.hideLoading();
                                        }, 1e3), wx.requestPayment({
                                            timeStamp: t.data.timeStamp,
                                            nonceStr: t.data.nonceStr,
                                            package: t.data.package,
                                            signType: t.data.signType,
                                            paySign: t.data.paySign,
                                            success: function(t) {},
                                            fail: function(t) {},
                                            complete: function(t) {
                                                "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? "requestPayment:ok" != t.errMsg || (void 0 !== i.page.data.goods_card_list && i.page.data.goods_card_list.length > 0 ? i.page.setData({
                                                    show_card: !0
                                                }) : "pt" == r ? "ONLY_BUY" == i.page.data.type ? wx.redirectTo({
                                                    url: c + "?status=2"
                                                }) : wx.redirectTo({
                                                    url: "/pages/pt/group/details?oid=" + n
                                                }) : wx.redirectTo({
                                                    url: c + "?status=1"
                                                })) : wx.showModal({
                                                    title: "提示",
                                                    content: "订单尚未支付",
                                                    showCancel: !1,
                                                    confirmText: "确认",
                                                    success: function(t) {
                                                        t.confirm && wx.redirectTo({
                                                            url: c + "?status=0"
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                        var e = wx.getStorageSync("quick_list");
                                        if (e) {
                                            for (var o = e.length, s = 0; s < o; s++) for (var d = e[s].goods, g = d.length, u = 0; u < g; u++) d[u].num = 0;
                                            wx.setStorageSync("quick_lists", e);
                                            for (var p = wx.getStorageSync("carGoods"), o = p.length, s = 0; s < o; s++) p[s].num = 0, 
                                            p[s].goods_price = 0, a.setData({
                                                carGoods: p
                                            });
                                            wx.setStorageSync("carGoods", p);
                                            var l = wx.getStorageSync("total");
                                            l && (l.total_num = 0, l.total_price = 0, wx.setStorageSync("total", l));
                                            wx.getStorageSync("check_num");
                                            0, wx.setStorageSync("check_num", 0);
                                            for (var _ = wx.getStorageSync("quick_hot_goods_lists"), o = _.length, s = 0; s < o; s++) _[s].num = 0, 
                                            a.setData({
                                                quick_hot_goods_lists: _
                                            });
                                            wx.setStorageSync("quick_hot_goods_lists", _);
                                        }
                                    }
                                }
                            }) : 2 == o.payment ? (u = "HUODAO_PAY", s()) : 3 == o.payment && (u = "BALANCE_PAY", 
                            s());
                        }
                        if (1 == t.code) return wx.hideLoading(), void i.page.showToast({
                            title: t.msg,
                            image: "/images/icon-warning.png"
                        });
                    }
                });
            }
            var n = t.order.submit, d = t.order.pay_data, c = "/pages/order/order";
            if ("pt" == r ? (n = t.group.submit, d = t.group.pay_data, c = "/pages/pt/order/order") : "ms" == r ? (n = t.miaosha.submit, 
            d = t.miaosha.pay_data, c = "/pages/miaosha/order/order") : "pond" == r ? (n = t.pond.submit, 
            d = t.order.pay_data, c = "/pages/order/order") : "scratch" == r && (n = t.scratch.submit, 
            d = t.order.pay_data, c = "/pages/order/order"), 3 == o.payment) {
                var g = wx.getStorageSync("user_info");
                wx.showModal({
                    title: "当前账户余额：" + g.money,
                    content: "是否确定使用余额支付",
                    success: function(t) {
                        t.confirm && s();
                    }
                });
            } else s();
        };
    }
};

module.exports = a;