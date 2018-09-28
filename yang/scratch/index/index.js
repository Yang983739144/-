var t, a = require("../../api.js"),
    e = getApp();
Page({
    data: {
        isStart: !0,
        name: "",
        monitor: "",
        detect: !0,
        type: 5,
        error: "",
        oppty: 0,
        log: [],
        register: !0,
        award_name: !1
    },
    onShow: function() {
        wx.showLoading({
            title: "加载中"
        });
        var s = this;
        e.request({
            url: a.scratch.setting,
            success: function(t) {
                var i = t.data.setting;
                i.title && wx.setNavigationBarTitle({
                    title: i.title
                }), s.setData({
                    title: i.title,
                    deplete_register: i.deplete_register,
                    register: null == i.deplete_register || 0 == i.deplete_register
                }), e.request({
                    url: a.scratch.index,
                    success: function(t) {
                        if (0 == t.code) {
                            var a = t.data.list,
                                e = s.setName(a);
                            console.log("name=>" + e), s.setData({
                                name: e,
                                oppty: t.data.oppty,
                                id: a.id,
                                type: a.type
                            })
                        } else s.setData({
                            error: t.msg,
                            isStart: !0,
                            oppty: t.data.oppty
                        })
                    },
                    complete: function(t) {
                        wx.hideLoading()
                    }
                })
            }
        }), e.request({
            url: a.scratch.log,
            success: function(t) {
                if (0 == t.code) {
                    var a = t.data;
                    for (var e in a) a[e].name = s.setName(a[e]);
                    s.setData({
                        log: a
                    })
                }
            }
        }), this.init(), t = setInterval(function() {
            e.request({
                url: a.scratch.log,
                success: function(t) {
                    if (0 == t.code) {
                        var a = t.data;
                        for (var e in a) a[e].name = s.setName(a[e]);
                        s.setData({
                            log: a
                        })
                    }
                }
            })
        }, 1e4)
    },
    onLoad: function() {
        e.pageOnLoad(this)
    },
    register: function() {
        this.data.error ? wx.showModal({
            title: "提示",
            content: this.data.error,
            showCancel: !1
        }) : (this.setData({
            register: !0
        }), this.init())
    },
    init: function() {
        var t = wx.createSelectorQuery(),
            a = this;
        a.setData({
            award_name: !1
        }), t.select("#frame").boundingClientRect(), t.exec(function(t) {
            var e = t[0].width,
                s = t[0].height;
            a.setData({
                r: 16,
                lastX: "",
                lastY: "",
                minX: "",
                minY: "",
                maxX: "",
                maxY: "",
                canvasWidth: e,
                canvasHeight: s
            });
            var i = wx.createCanvasContext("scratch");
            i.drawImage("/scratch/images/scratch_hide_2.png", 0, 0, e, s), i.draw(!1, function(t) {
                a.setData({
                    award_name: !0
                })
            }), a.setData({
                ctx: i,
                isStart: !0,
                isScroll: !0
            })
        })
    },
    onStart: function() {
        this.setData({
            register: null == this.data.deplete_register || 0 == this.data.deplete_register,
            name: this.data.monitor,
            isStart: !0,
            award: !1
        }), this.init()
    },
    drawRect: function(t, a) {
        var e = this.data.r / 2,
            s = t - e > 0 ? t - e : 0,
            i = a - e > 0 ? a - e : 0;
        return "" !== this.data.minX ? this.setData({
            minX: this.data.minX > s ? s : this.data.minX,
            minY: this.data.minY > i ? i : this.data.minY,
            maxX: this.data.maxX > s ? this.data.maxX : s,
            maxY: this.data.maxY > i ? this.data.maxY : i
        }) : this.setData({
            minX: s,
            minY: i,
            maxX: s,
            maxY: i
        }), this.setData({
            lastX: s,
            lastY: i
        }), [s, i, 2 * e]
    },
    clearArc: function(t, a, e) {
        var s = this.data.r,
            i = this.data.ctx,
            o = s - e,
            r = Math.sqrt(s * s - o * o),
            n = t - o,
            c = a - r,
            d = 2 * o,
            h = 2 * r;
        e <= s && (i.clearRect(n, c, d, h), e += 1, this.clearArc(t, a, e))
    },
    touchStart: function(t) {
        if (this.data.isStart) if (this.data.error) wx.showModal({
            title: "提示",
            content: this.data.error,
            showCancel: !1
        });
        else;
    },
    touchMove: function(t) {
        if (this.data.isStart && !this.data.error) {
            this.drawRect(t.touches[0].x, t.touches[0].y), this.clearArc(t.touches[0].x, t.touches[0].y, 1), this.data.ctx.draw(!0)
        }
    },
    touchEnd: function(t) {
        if (this.data.isStart && !this.data.error) {
            var s = this,
                i = this.data.canvasWidth,
                o = this.data.canvasHeight,
                r = this.data.minX,
                n = this.data.minY,
                c = this.data.maxX,
                d = this.data.maxY;
            c - r > .4 * i && d - n > .4 * o && this.data.detect && (s.setData({
                detect: !1
            }), console.log("LOGID", s.data.id), e.request({
                url: a.scratch.receive,
                data: {
                    id: s.data.id
                },
                success: function(t) {
                    if (0 == t.code) {
                        s.setData({
                            award: 5 != s.data.type,
                            isStart: !1,
                            isScroll: !0
                        }), s.data.ctx.draw();
                        var a = t.data.list;
                        t.data.oppty <= 0 || "" == a ? s.setData({
                            monitor: "谢谢参与",
                            error: t.msg ? t.msg : "机会已用完",
                            detect: !0,
                            type: 5,
                            oppty: t.data.oppty
                        }) : s.setData({
                            monitor: s.setName(a),
                            id: a.id,
                            detect: !0,
                            type: a.type,
                            oppty: t.data.oppty
                        })
                    } else s.setData({
                        monitor: "谢谢参与",
                        detect: !0
                    }), wx.showModal({
                        title: "提示",
                        content: t.msg ? t.msg : "网络异常，请稍后重试",
                        showCancel: !1
                    }), s.onStart()
                }
            }))
        }
    },
    setName: function(t) {
        var a = "";
        switch (t.type) {
            case 1:
                a = t.price + "元红包";
                break;
            case 2:
                a = t.coupon;
                break;
            case 3:
                a = t.num + "积分";
                break;
            case 4:
                a = t.gift;
                break;
            default:
                a = "谢谢参与"
        }
        return a
    },
    onShareAppMessage: function() {
        return {
            path: "/scratch/index/index?user_id=" + wx.getStorageSync("user_info").id,
            title: this.data.title ? this.data.title : "刮刮卡"
        }
    },
    onHide: function() {
        clearInterval(t)
    },
    onUnload: function() {
        clearInterval(t)
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
        e.request({
            url: a.scratch.qrcode,
            success: function(a) {
                0 == a.code && t.setData({
                    goods_qrcode: a.data.pic_url
                }), 1 == a.code && (t.goodsQrcodeClose(), wx.showModal({
                    title: "提示",
                    content: a.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm
                    }
                }))
            }
        })
    },
    qrcodeClick: function(t) {
        var a = t.currentTarget.dataset.src;
        wx.previewImage({
            urls: [a]
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
            fail: function(a) {
                wx.showModal({
                    title: "图片下载失败",
                    content: a.errMsg + ";" + t.data.goods_qrcode,
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