'use strict';

window.addEventListener('DOMContentLoaded', () => {
    /*---------------------------------------------
        要素を入れておく配列の配列
    ----------------------------------------------*/
    let arrays = {
        // キャンバスを入れた配列
        canvas_arr: [CI_el.canvas_line, CI_el.canvas_font, CI_el.canvas_img, CI_el.canvas_back],
        // ctxを入れた配列
        ctx_arr: [CI_el.ctx_line, CI_el.ctx_font, CI_el.ctx_img, CI_el.ctx_back],
        // クリアボタンを入れた配列
        clear_arr: [CI_el.clear_line, CI_el.clear_font, CI_el.clear_img, CI_el.clear_back, CI_el.clear_all],
        // CI_TextSetのインスタンスを格納する配列
        text_set_arr: [],
    }
    window.CI_ar = arrays;


    /*---------------------------------------------
        初期設定
    ----------------------------------------------*/
    // キャンバスのサイズをセット
    CI_fn.setDefaultSize();

    // 各初期値をinput要素に設定(テキスト以外)
    CI_fn.setInputDefault(CI_dv.canvasDefault, 'c_');
    CI_fn.setInputDefault(CI_dv.backDefault, 'c_');
    CI_fn.setInputDefault(CI_dv.lineDefault, 'l_');

    // 背景色をセット
    CI_fn.setBgcolor();

    // デフォルトのラインモードに設定(ペンか消しゴムか)
    CI_fn.setLineDefaultMode();


    // テキスト関係の初期値設定
    CI_fn.createTextSet();
    // テキスト関係の要素の初期化
    arrays.text_set_arr[0].setValueSet();
    // font_styleに初期値をセット
    CI_fn.setFontStyleDefault(arrays.text_set_arr[0]);
    // 中抜きにチェックが入っていた場合の初期値セット
    CI_fn.setStrokeDefault(arrays.text_set_arr[0]);
    // 中抜きにチェックの有無で初期のテキストのコードを実行
    arrays.text_set_arr[0].writingText();

    // 「ファイルを選択」の画像情報を保存する変数
    let data_img;

    // ダウンロードに必要な要素の準備(JS上のみの要素)
    let canvas_marge = document.createElement('canvas');
    let download_a = document.createElement('a');
    let ctx_marge = canvas_marge.getContext('2d');
    let img1 = new Image();
    let img2 = new Image();
    let img3 = new Image();
    let img4 = new Image();


    /*---------------------------------------------
        ctx_back(背景色機能)とキャンバス全体
    ----------------------------------------------*/
    // キャンバスのサイズ変更
    CI_el.inputObj['c_width'].addEventListener('change', e => {
        CI_fn.changeCanvasSize('width', e.target, data_img, img3);
    });
    CI_el.inputObj['c_height'].addEventListener('change', e => {
        CI_fn.changeCanvasSize('height', e.target, data_img, img3);
    });

    // キャンバスの背景色・透明度を変更(changeイベント)
    CI_fn.changeCanvasColor('bgcolor');
    CI_fn.changeCanvasColor('bgopacity');


    /*---------------------------------------------
        ctx_img(背景画像機能)
    ----------------------------------------------*/
    CI_el.inputObj["base_img"].addEventListener('change', e => {
        // ファイル情報の取得
        let data_img_temp = e.target.files[0];
        // キャンセルした場合は処理を終了
        if (!data_img_temp) {
            return;
        } else {
            data_img = e.target.files[0];
        }
        // 画像データで無ければ処理を終了
        if (!data_img.type.match('image.*')) {
            alert('画像を選択して下さい。');
            return;
        }
        CI_fn.setCanvasImg(data_img, img3);
    });

    //「画像サイズに合わせる」クリックで、キャンバスサイズを画像サイズに変更。max800
    const sizebyimg_btn = document.getElementById('sizebyimg_btn');
    sizebyimg_btn.addEventListener('click', () => {
        CI_fn.changeCanvasSizeByImg(data_img, img3);
    });


    /*---------------------------------------------
        ctx_font(テキスト機能)
    ----------------------------------------------*/
    // 「選択」変更時、該当のテキストセットをセットする
    CI_el.inputObj["f_select"].addEventListener('change', e => {
        CI_dv.current_idx = e.currentTarget.value - 1;
        arrays.text_set_arr[CI_dv.current_idx].setValueSet();
        CI_fn.setStrokeDefault(arrays.text_set_arr[CI_dv.current_idx]);
    });

    // 「追加」クリック時に新しいテキストセットを追加する
    CI_el.text_add.addEventListener('click', () => {
        CI_fn.createTextSet();
    });

    // 「削除」クリック時に選択中のテキストセットを削除する
    CI_el.text_remove.addEventListener('click', () => {
        if (arrays.text_set_arr.length > 0) {
            CI_fn.deleteTextSet(arrays.text_set_arr[CI_dv.current_idx]);
        } else {
            alert('テキストセットは全て削除されています。')
        }
    });

    // 入力テキストを表示(キャンバスと、セレクトボックスの該当opsionに表示される)
    CI_el.inputObj["f_text"].addEventListener('keyup', e => {
        arrays.text_set_arr[CI_dv.current_idx]["text"] = e.target.value;
        let text = (arrays.text_set_arr[CI_dv.current_idx]["num"] + ') ' + e.target.value).slice(0, 20);
        CI_el.inputObj["f_select"].children[CI_dv.current_idx].textContent = text;
        CI_fn.rewriteText();
    });

    // フォントサイズ/フォントの種類を変更する(changeイベント)
    CI_fn.changeFontSiFa(CI_el.inputObj["f_size"]);
    CI_fn.changeFontSiFa(CI_el.inputObj["f_family"]);

    // テキストの色の変更
    CI_el.inputObj["f_color"].addEventListener('change', e => {
        let key = e.target.id.slice(2);
        arrays.text_set_arr[CI_dv.current_idx][key] = e.target.value;
        CI_fn.rewriteText();
    });

    // 斜体/太字の変更(changeイベント)
    CI_fn.chengeFontStyle(f_style_i);
    CI_fn.chengeFontStyle(f_style_b);

    // 中抜きにチェックが入ったら、f_stroke_wのinputを表示する
    CI_el.inputObj["f_style_l"].addEventListener('change', e => {
        if (e.target.checked) {
            CI_el.inputObj["f_stroke_w"].parentNode.parentNode.classList.remove('hide');
            arrays.text_set_arr[CI_dv.current_idx]["style_l"] = true;
        } else {
            CI_el.inputObj["f_stroke_w"].parentNode.parentNode.classList.add('hide');
            arrays.text_set_arr[CI_dv.current_idx]["style_l"] = false;
        }
        CI_fn.rewriteText();
    });

    // 中抜きの線の太さを変更する
    CI_el.inputObj["f_stroke_w"].addEventListener('change', e => {
        arrays.text_set_arr[CI_dv.current_idx]["stroke_w"] = e.target.value;
        CI_fn.rewriteText();
    });

    // 矢印をクリックで該当テキストを移動(clickイベント)
    CI_fn.text_move(CI_el.left);
    CI_fn.text_move(CI_el.right);
    CI_fn.text_move(CI_el.up);
    CI_fn.text_move(CI_el.down);


    /*---------------------------------------------
        ctx_line(ライン機能)
    ----------------------------------------------*/
    // キャンバス上でのイベント
    let l_mode;
    CI_el.canvas_line.addEventListener('mousedown', () => {
        CI_dv.click_flag = "1";
        l_mode = CI_fn.changeLineMode();    // モードを取得
        CI_fn.setLineMode(l_mode);
        CI_fn.setLineBold();
        CI_fn.setLineColor();
    });
    CI_el.canvas_line.addEventListener('mouseup', () => {
        CI_dv.click_flag = "0";
    });
    CI_el.canvas_line.addEventListener('mousemove', e => {
        if (CI_dv.click_flag == "0") return false;
        CI_fn.draw(e.offsetX, e.offsetY, l_mode);
    });
    CI_el.canvas_line.addEventListener('mouseleave', () => {
        CI_dv.click_flag = "0";
    });

    /*---------------------------------------------
        ダウンロード機能
    ----------------------------------------------*/
    // ダウンロード
    CI_el.dl_btn.addEventListener('click', () => {
        canvas_marge.width = CI_el.inputObj["c_width"].value;
        canvas_marge.height = CI_el.inputObj["c_height"].value;
        Promise.all([
            new Promise(resolve => {
                img1.onload = resolve;
                img1.src = CI_el.canvas_line.toDataURL();
            }),
            new Promise(resolve => {
                img2.onload = resolve;
                img2.src = CI_el.canvas_font.toDataURL();
            }),
            new Promise(resolve => {
                img3.onload = resolve;
                img3.src = CI_el.canvas_img.toDataURL();
            }),
            new Promise(resolve => {
                img4.onload = resolve;
                img4.src = CI_el.canvas_back.toDataURL();
            })
        ]).then(() => {
            ctx_marge.drawImage(img4, 0, 0);
            ctx_marge.drawImage(img3, 0, 0);
            ctx_marge.drawImage(img2, 0, 0);
            ctx_marge.drawImage(img1, 0, 0);
            // 拡張子の取得
            const extensions = document.getElementsByName('extension');
            let extension;
            extensions.forEach(target => {
                if (target.checked) {
                    extension = target.value;
                }
            });
            // 解像度の取得
            const quality = document.getElementById('quality').value / 100;
            canvas_marge.toBlob(blob => {
                download_a.href = URL.createObjectURL(blob);
                download_a.download = 'img.' + extension;
                download_a.click();
                URL.revokeObjectURL(blob);
            }, 'image/' + extension, quality);
        });
    });


    /*---------------------------------------------
        クリア機能
    ----------------------------------------------*/
    // クリアボタン(各種)の動き
    arrays.clear_arr.forEach((clear, index) => {
        clear.addEventListener('click', () => {
            let result;
            if (clear.id === 'clear_all') {
                result = confirm('全てレイヤーをリセットします。');
                if (result) {
                    CI_fn.clearCanvasAll();
                    CI_fn.clearTextSets();
                    CI_fn.setDefaultSize();
                    CI_fn.setLineDefaultMode();
                    CI_fn.setInputValue(CI_dv.canvasDefault, 'c_');
                    CI_fn.setInputValue(CI_dv.backDefault, 'c_');
                    CI_fn.setInputValue(CI_dv.lineDefault, 'l_');
                    CI_fn.setBgcolor();
                }
            } else {
                switch (clear.id) {
                    case 'clear_line':
                        result = confirm('ラインをリセットします。');
                        if (result) {
                            CI_fn.clearCanvas(arrays.ctx_arr[index]);
                            CI_fn.setLineDefaultMode();
                            CI_fn.setInputValue(CI_dv.lineDefault, 'l_');
                        }
                        break;
                    case 'clear_font':
                        result = confirm('テキストをリセットします。');
                        if (result) {
                            CI_fn.clearCanvas(arrays.ctx_arr[index]);
                            CI_fn.clearTextSets();
                        }
                        break;
                    case 'clear_back':
                        result = confirm('背景色をリセットします。');
                        if (result) {
                            CI_fn.clearCanvas(arrays.ctx_arr[index]);
                            CI_fn.setInputValue(CI_dv.backDefault, 'c_');
                            CI_fn.setBgcolor();
                        }
                        break;
                    case 'clear_img':
                        result = confirm('背景画像をリセットします。');
                        if (result) {
                            CI_fn.clearCanvas(arrays.ctx_arr[index]);
                            CI_el.inputObj["base_img"].value = '';
                            CI_fn.setBgcolor();
                        }
                        break;
                }
            }
        });
    });
});
