function t(t, o, e) {
    return o in t ? Object.defineProperty(t, o, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[o] = e, t;
}

var o, e = require("../../../api.js"), a = require("../../../utils.js"), s = getApp(), i = require("../../../wxParse/wxParse.js"), n = 1, c = !1, d = !0;

Page((o = {
    data: {
        tab_detail: "active",
        tab_comment: "",
        comment_list: [],
        comment_count: {
            score_all: 0,
            score_3: 0,
            score_2: 0,
            score_1: 0
        }
    },
    onLoad: function(t) {
        s.pageOnLoad(this);
        var o = 0, e = t.user_id, i = decodeURIComponent(t.scene);
        if (void 0 != e) o = e; else if (void 0 != i) {
            var c = a.scene_decode(i);
            c.uid && c.gid ? (o = c.uid, t.id = c.gid) : o = i;
        }
        s.loginBindParent({
            parent_id: o
        }), this.setData({
            id: t.id
        }), n = 1, this.getGoodsInfo(t), this.getCommentList(!1);
    },
    onReady: function() {},
    onShow: function() {
        s.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.getCommentList(!0);
    },
    onShareAppMessage: function() {
        var t = this, o = wx.getStorageSync("user_info");
        return {
            title: t.data.goods.name,
            path: "/pages/book/details/details?id=" + t.data.goods.id + "&user_id=" + o.id,
            imageUrl: t.data.goods.cover_pic,
            success: function(t) {}
        };
    },
    getGoodsInfo: function(t) {
        var o = t.id, a = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), s.request({
            url: e.book.details,
            method: "get",
            data: {
                gid: o
            },
            success: function(t) {
                if (0 == t.code) {
                    var o = t.data.info.detail;
                    i.wxParse("detail", "html", o, a);
                    var e = parseInt(t.data.info.virtual_sales) + parseInt(t.data.info.sales);
                    a.setData({
                        goods: t.data.info,
                        shop: t.data.shopList,
                        sales: e
                    });
                } else wx.showModal({
                    title: "提示",
                    content: t.msg,
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
    tabSwitch: function(t) {
        var o = this;
        "detail" == t.currentTarget.dataset.tab ? o.setData({
            tab_detail: "active",
            tab_comment: ""
        }) : o.setData({
            tab_detail: "",
            tab_comment: "active"
        });
    },
    commentPicView: function(t) {
        var o = this, e = t.currentTarget.dataset.index, a = t.currentTarget.dataset.picIndex;
        wx.previewImage({
            current: o.data.comment_list[e].pic_list[a],
            urls: o.data.comment_list[e].pic_list
        });
    },
    bespeakNow: function(t) {
        wx.redirectTo({
            url: "/pages/book/submit/submit?id=" + this.data.goods.id
        });
    },
    goToShopList: function(t) {
        wx.navigateTo({
            url: "/pages/book/shop/shop?ids=" + this.data.goods.shop_id,
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        });
    },
    getCommentList: function(t) {
        var o = this;
        t && "active" != o.data.tab_comment || c || d && (c = !0, s.request({
            url: e.book.goods_comment,
            data: {
                goods_id: o.data.id,
                page: n
            },
            success: function(e) {
                0 == e.code && (c = !1, n++, o.setData({
                    comment_count: e.data.comment_count,
                    comment_list: t ? o.data.comment_list.concat(e.data.list) : e.data.list
                }), 0 == e.data.list.length && (d = !1));
            }
        }));
    },
    showShareModal: function() {
        this.setData({
            share_modal_active: "active",
            no_scroll: !0
        });
    },
    shareModalClose: function() {
        this.setData({
            share_modal_active: "",
            no_scroll: !1
        });
    },
    getGoodsQrcode: function() {
        var t = this;
        if (t.setData({
            goods_qrcode_active: "active",
            share_modal_active: ""
        }), t.data.goods_qrcode) return !0;
        s.request({
            url: e.book.goods_qrcode,
            data: {
                goods_id: t.data.id
            },
            success: function(o) {
                0 == o.code && t.setData({
                    goods_qrcode: o.data.pic_url
                }), 1 == o.code && (t.goodsQrcodeClose(), wx.showModal({
                    title: "提示",
                    content: o.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm;
                    }
                }));
            }
        });
    },
    goodsQrcodeClose: function() {
        this.setData({
            goods_qrcode_active: "",
            no_scroll: !1
        });
    }
}, t(o, "goodsQrcodeClose", function() {
    this.setData({
        goods_qrcode_active: "",
        no_scroll: !1
    });
}), t(o, "saveGoodsQrcode", function() {
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
                    });
                },
                fail: function(t) {
                    wx.showModal({
                        title: "图片保存失败",
                        content: t.errMsg,
                        showCancel: !1
                    });
                },
                complete: function(t) {
                    wx.hideLoading();
                }
            });
        },
        fail: function(o) {
            wx.showModal({
                title: "图片下载失败",
                content: o.errMsg + ";" + t.data.goods_qrcode,
                showCancel: !1
            });
        },
        complete: function(t) {
            wx.hideLoading();
        }
    })) : wx.showModal({
        title: "提示",
        content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
        showCancel: !1
    });
}), t(o, "goodsQrcodeClick", function(t) {
    var o = t.currentTarget.dataset.src;
    wx.previewImage({
        urls: [ o ]
    });
}), t(o, "goHome", function(t) {
    wx.redirectTo({
        url: "/pages/book/index/index",
        success: function(t) {},
        fail: function(t) {},
        complete: function(t) {}
    });
}), o));