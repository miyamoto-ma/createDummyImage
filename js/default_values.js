'use strict';

{
    let defaultValue = {
    /*---------------------------------------------
        各値の初期値
    ----------------------------------------------*/
        // キャンバスサイズの初期値
        canvasDefault : {
            width: 500,                     // キャンバスの幅(10-800)
            height: 500,                    // キャンバスの高さ(10-800)
        },

        // 背景色の初期値
        backDefault : {
            bgcolor: "#eeeeee",             // キャンバスの背景色
            bgopacity: 1.0,                 // キャンバスの背景色(透明度)(0-1)
        },

        // ラインの初期値
        lineDefault : {
            bold: 5,                    // 線の太さ
            color: "#ff0000",           // 線の色
            opacity: 1.0,               // 線の色(透明度)
        },

        // ラインの描画モードの初期値
        l_mode: "normal",          // ペンモード(normal) or 消しゴムモード(erase)

        // フォントの初期値
        fontDefault : {
            style_l: false,             // フォントスタイル(中抜きかどうか)
            style_i: false,             // フォントスタイル(斜体かどうか)
            style_b: false,             // フォントスタイル(太字かどうか)
            stroke_w: 2,                // 中抜きの場合の線の太さ(0-5)
            size: 50,                   // フォントの大きさ(12-100)
            family: "ms_g",             // フォントの種類(下のfonfFamilyプロパティ参照)
            color: "#000000",           // フォントの色
            text: "",                   // 文章内容
            position: [30, 80],         // ポジション(左上)
            move_step: 10,              // ポジション移動の単位(1クリックでのpositionの増減値)
        },

        fontFamily : {
            ms_g: 'ＭＳ ゴシック',
            ms_p: 'ＭＳ Ｐゴシック',
            ms_m: 'ＭＳ 明朝',
            yu_m: '游明朝',
            yu_g: '游ゴシック',
            hg_me: 'HG明朝E',
            hg_ge: 'HGゴシックE'
        },

        // クリック判定(1:クリック開始, 2:クリック中)(ラインの描画に使用)
        click_flag: "0",

        // 選択中のCI_TextSetのidx(テキストの描画・選択に使用)
        current_idx: 0,
    }

    window.CI_dv = defaultValue;
}
