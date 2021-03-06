var t, e, a, n = require("../../api.js"),
    o = getApp();
Page({
    data: {
        circleList: [],
        awardList: [],
        colorCircleFirst: "#F12416",
        colorCircleSecond: "#FFFFFF",
        colorAwardDefault: "#F5F0FC",
        colorAwardSelect: "#ffe400",
        indexSelect: 0,
        isRunning: !1,
        prize: !1,
        close: !1,
        lottert: 0,
        animationData: "",
        time: !1,
        title: ""
    },
    onLoad: function(t) {
        var e = this;
        o.pageOnLoad(this), o.request({
            url: n.pond.setting,
            success: function(t) {
                if (0 == t.code) {
                    var a = t.data.title;
                    a && (wx.setNavigationBarTitle({
                        title: a
                    }), e.setData({
                        title: a
                    }))
                }
            }
        })
    },
    onShow: function() {
        var t = this;
        wx.showLoading({
            title: "加载中"
        }), o.request({
            url: n.pond.index,
            success: function(e) {
                var a = e.data.list;
                a.forEach(function(t, e, n) {
                    switch (t.type) {
                        case 1:
                            a[e].name = t.price + "元红包";
                            break;
                        case 2:
                            a[e].name = t.coupon;
                            break;
                        case 3:
                            a[e].name = t.num + "积分", a[e].image_url || (a[e].image_url = "/pond/images/pond-jf.png");
                            break;
                        case 4:
                            a[e].name = t.gift;
                            break;
                        case 5:
                            a[e].name = "谢谢参与", a[e].image_url || (a[e].image_url = "/pond/images/pond-xx.png")
                    }
                }), t.setData({
                    list: a,
                    oppty: e.data.oppty,
                    time: e.data.time,
                    register: e.data.register,
                    integral: e.data.integral
                });
                for (var n = 18, o = 18, i = 0; i < 8; i++) 0 == i ? (n = 18, o = 18) : i < 3 ? (n = n, o = o + 196 + 8) : i < 5 ? (o = o, n = n + 158 + 8) : i < 7 ? (o = o - 196 - 8, n = n) : i < 8 && (o = o, n = n - 158 - 8), a[i].topAward = n, a[i].leftAward = o;
                t.setData({
                    awardList: a
                })
            },
            complete: function(a) {
                wx.hideLoading();
                for (var n = 4, o = 4, i = [], s = 0; s < 24; s++) {
                    if (0 == s) o = 8, n = 8;
                    else if (s < 6) o = 4, n += 110;
                    else if (6 == s) o = 8, n = 660;
                    else if (s < 12) o += 92, n = 663;
                    else if (12 == s) o = 545, n = 660;
                    else if (s < 18) o = 550, n -= 110;
                    else if (18 == s) o = 545, n = 10;
                    else {
                        if (!(s < 24)) return;
                        o -= 92, n = 5
                    }
                    i.push({
                        topCircle: o,
                        leftCircle: n
                    })
                }
                t.setData({
                    circleList: i
                }), e = setInterval(function() {
                    "#FFFFFF" == t.data.colorCircleFirst ? t.setData({
                        colorCircleFirst: "#F12416",
                        colorCircleSecond: "#FFFFFF"
                    }) : t.setData({
                        colorCircleFirst: "#FFFFFF",
                        colorCircleSecond: "#F12416"
                    })
                }, 900), t.pond_animation()
            }
        })
    },
    startGame: function() {
        var e = this;
        if (!e.data.isRunning) if (0 != e.data.oppty) if (e.data.integral) if (e.data.time) {
            clearInterval(t), a.translate(0, 0).step(), e.setData({
                animationData: a.export()
            }), e.setData({
                isRunning: !0,
                lottert: 0
            });
            var i = e.data.indexSelect,
                s = 0,
                r = e.data.awardList,
                c = setInterval(function() {
                    if (i++, i %= 8, s += 30, e.setData({
                        indexSelect: i
                    }), e.data.lottert > 0 && i + 1 == e.data.lottert) {
                        if (clearInterval(c), e.pond_animation(), 5 == r[i].type) t = 1;
                        else var t = 2;
                        e.setData({
                            isRunning: !1,
                            name: r[i].name,
                            num: r[i].id,
                            prize: t
                        })
                    }
                }, 200 + s);
            o.request({
                url: n.pond.lottery,
                success: function(t) {
                    if (1 == t.code) return clearInterval(c), wx.showModal({
                        title: "很抱歉",
                        content: t.msg ? t.msg : "网络错误",
                        showCancel: !1,
                        success: function(t) {
                            t.confirm && e.setData({
                                isRunning: !1
                            })
                        }
                    }), void e.pond_animation();
                    "积分不足" == t.msg && e.setData({
                        integral: !1
                    });
                    var a = t.data.id;
                    r.forEach(function(n, o, i) {
                        n.id == a && setTimeout(function() {
                            e.setData({
                                lottert: o + 1,
                                oppty: t.data.oppty
                            })
                        }, 2e3)
                    })
                }
            })
        } else wx.showModal({
            title: "很抱歉",
            content: "活动未开始或已经结束",
            showCancel: !1,
            success: function(t) {
                t.confirm && e.setData({
                    isRunning: !1
                })
            }
        });
        else wx.showModal({
            title: "很抱歉",
            content: "积分不足",
            showCancel: !1,
            success: function(t) {
                t.confirm && e.setData({
                    isRunning: !1
                })
            }
        });
        else wx.showModal({
            title: "很抱歉",
            content: "抽奖机会不足",
            showCancel: !1,
            success: function(t) {
                t.confirm && e.setData({
                    isRunning: !1
                })
            }
        })
    },
    pondClose: function() {
        this.setData({
            prize: !1
        })
    },
    pond_animation: function() {
        var e = this;
        a = wx.createAnimation({
            duration: 500,
            timingFunction: "step-start",
            delay: 0,
            transformOrigin: "50% 50%"
        });
        var n = !0;
        t = setInterval(function() {
            n ? (a.translate(0, 0).step(), n = !1) : (a.translate(0, -3).step(), n = !0), e.setData({
                animationData: a.export()
            })
        }, 900)
    },
    onHide: function() {
        clearInterval(e), clearInterval(t)
    },
    onShareAppMessage: function() {
        return {
            path: "/pond/pond/pond?user_id=" + wx.getStorageSync("user_info").id,
            title: this.data.title ? this.data.title : "九宫格抽奖"
        }
    },
    showShareModal: function() {
        this.setData({
            share_modal_active: "active"
        })
    },
    shareModalClose: function() {
        this.setData({
            share_modal_active: ""
        })
    },
    getGoodsQrcode: function() {
        var t = this;
        if (t.setData({
            qrcode_active: "active",
            share_modal_active: ""
        }), t.data.goods_qrcode) return !0;
        o.request({
            url: n.pond.qrcode,
            success: function(e) {
                0 == e.code && t.setData({
                    goods_qrcode: e.data.pic_url
                }), 1 == e.code && (t.goodsQrcodeClose(), wx.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm
                    }
                }))
            }
        })
    },
    qrcodeClick: function(t) {
        var e = t.currentTarget.dataset.src;
        wx.previewImage({
            urls: [e]
        })
    },
    qrcodeClose: function() {
        this.setData({
            qrcode_active: ""
        })
    },
    saveQrcode: function() {
        var t = this;
        wx.saveImageToPhotosAlbum ? (wx.showLoading({
            title: "正在保存图片",
            mask: !1
        }), wx.downloadFile({
            url: t.data.goods_qrcode,
            success: function(t) {
                wx.showLoading({
                    title: "正在保存图片",
                    mask: !1
                }), wx.saveImageToPhotosAlbum({
                    filePath: t.tempFilePath,
                    success: function() {
                        wx.showModal({
                            title: "提示",
                            content: "商品海报保存成功",
                            showCancel: !1
                        })
                    },
                    fail: function(t) {
                        wx.showModal({
                            title: "图片保存失败",
                            content: t.errMsg,
                            showCancel: !1
                        })
                    },
                    complete: function(t) {
                        wx.hideLoading()
                    }
                })
            },
            fail: function(e) {
                wx.showModal({
                    title: "图片下载失败",
                    content: e.errMsg + ";" + t.data.goods_qrcode,
                    showCancel: !1
                })
            },
            complete: function(t) {
                wx.hideLoading()
            }
        })) : wx.showModal({
            title: "提示",
            content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
            showCancel: !1
        })
    }
});