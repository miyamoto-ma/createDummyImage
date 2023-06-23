'use strict';

window.addEventListener('DOMContentLoaded', () => {
    /*---------------------------------------------
        HTMLからの取得要素群など
    ----------------------------------------------*/
    const elements = {
        // キャンバス関係
        canvas_line: document.getElementById('canvas_line'),            // 描画用キャンバス
        canvas_font: document.getElementById('canvas_font'),            // フォント用キャンバス
        canvas_img: document.getElementById('canvas_img'),              // 背景画像用キャンバス
        canvas_back: document.getElementById('canvas_back'),            // 背景色用キャンバス
        ctx_line: canvas_line.getContext('2d', { willReadFrequently: true }),
        ctx_font: canvas_font.getContext('2d', { willReadFrequently: true }),
        ctx_img: canvas_img.getContext('2d'),
        ctx_back: canvas_back.getContext('2d'),

        // ダウンロードボタン
        dl_btn: document.getElementById('download_img'),

        // 各種クリアボタン
        clear_line: document.getElementById('clear_line'),
        clear_font: document.getElementById('clear_font'),
        clear_img: document.getElementById('clear_img'),
        clear_back: document.getElementById('clear_back'),
        clear_all: document.getElementById('clear_all'),

        // ラインのモード ラジオボタン(ペンか消しゴムかの選択)
        drawmodes: document.getElementsByName('drawmode'),

        // 各input要素を取得
        inputObj: {
            c_width: document.getElementById('c_width'),         // キャンバスの幅の要素
            c_height: document.getElementById('c_height'),       // キャンバスの高さの要素
            c_bgcolor: document.getElementById('c_bgcolor'),     // キャンバスの背景色の要素
            c_bgopacity: document.getElementById('c_bgopacity'), // キャンバスの背景色(透明度)
            l_bold: document.getElementById('l_bold'),           // 線の太さ
            l_color: document.getElementById('l_color'),         // 線の色
            l_opacity: document.getElementById('l_opacity'),     // 線の色(透明度)
            f_select: document.getElementById('f_select'),       // テキストを選択
            f_style_l: document.getElementById('f_style_l'),     // フォントスタイル(中抜きかどうか)
            f_style_i: document.getElementById('f_style_i'),     // フォントスタイル(斜体かどうか)
            f_style_b: document.getElementById('f_style_b'),     // フォントスタイル(太字かどうか)
            f_stroke_w: document.getElementById('f_stroke_w'),   // 中抜きの場合の線の太さ
            f_size: document.getElementById('f_size'),           // フォントサイズの要素
            f_family: document.getElementById('f_family'),       // フォントの種類
            f_color: document.getElementById('f_color'),         // フォント色の要素
            f_text: document.getElementById('text'),             // 文章の要素
            base_img: document.getElementById('base_img'),       // 画像を取得
        },

        // テキストの矢印ボタン(位置変更用)
        left: document.getElementById('left'),
        right: document.getElementById('right'),
        up: document.getElementById('up'),
        down: document.getElementById('down'),

        // テキストセットの追加・削除ボタン
        text_add: document.getElementById('text_add'),           //「追加」ボタン
        text_remove: document.getElementById('text_remove'),     //「削除」ボタン
    }

    window.CI_el = elements;
});
