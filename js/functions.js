'use strict';

window.addEventListener('DOMContentLoaded', () => {
    let functions = {

        /*---------------------------------------------
            初期化・クリア関係
        ----------------------------------------------*/
        // すべてのキャンバスにデフォルトサイズをセットする関数
        setDefaultSize() {
            CI_ar.canvas_arr.forEach(canvas => {
                canvas.width = CI_dv.canvasDefault.width;             // キャンバスの幅
                canvas.height = CI_dv.canvasDefault.height;           // キャンバスの高さ
            });
        },

        // input要素に初期値をセットする関数
        setInputDefault(obj, prefix) {
            Object.entries(obj).forEach(val => {
                CI_el.inputObj[prefix + val[0]].defaultValue = val[1];
            });
        },

        // input要素を初期値に戻す関数
        setInputValue(obj, prefix) {
            Object.entries(obj).forEach(val => {
                CI_el.inputObj[prefix + val[0]].value = val[1];
            });
        },

        // 追加したテキストを全て削除して初期化
        clearTextSets() {
            CI_ar.text_set_arr.forEach((val, idx) => {
                CI_ar.text_set_arr[idx] = null;
            });
            CI_ar.text_set_arr = [];
            while (CI_el.inputObj["f_select"].firstChild) {
                CI_el.inputObj["f_select"].removeChild(CI_el.inputObj["f_select"].firstChild);
            }
            this.createTextSet();
            this.setFontStyleDefault(CI_ar.text_set_arr[0]);
            this.setStrokeDefault(CI_ar.text_set_arr[0]);
        },

        // キャンバスをクリアする関数
        clearCanvas(ctx) {
            ctx.clearRect(0, 0, CI_el.canvas_line.width, CI_el.canvas_line.height);
        },

        // すべてのキャンバスをクリアする関数
        clearCanvasAll() {
            CI_ar.ctx_arr.forEach(ctx => {
                this.clearCanvas(ctx);
            });
        },


        /*---------------------------------------------
            キャンバス全体
        ----------------------------------------------*/
        // キャンバスのサイズを変更する関数
        changeCanvasSize(attr, target, data_img, img3) {
            let line = this.getImage(CI_el.ctx_line);
            let font = this.getImage(CI_el.ctx_font);
            CI_ar.canvas_arr.forEach(canvas => {
                canvas[attr] = target.value;
                if (canvas.id === 'canvas_line') {
                    this.putImage(CI_el.ctx_line, line);
                }
                if (canvas.id === 'canvas_font') {
                    this.putImage(CI_el.ctx_font, font);
                }
                if (canvas.id === 'canvas_back') {
                    this.setBgcolor();
                }
                if (canvas.id === 'canvas_img') {
                    if (data_img) {
                        this.setCanvasImg(data_img, img3);
                    }
                }
            });
        },


        /*---------------------------------------------
            ctx_back関係(背景色)
        ----------------------------------------------*/
        // 背景の色・透明度を変更する関数
        changeCanvasColor(attr) {
            CI_el.inputObj["c_" + attr].addEventListener('change', () => {
                if (attr === 'bgopacity') {
                    this.clearCanvas(CI_el.ctx_back);
                }
                this.setBgcolor();
            });
        },

        // 背景の色のセットする関数
        setBgcolor() {
            let rgba = this.hex2rgb(CI_el.inputObj["c_bgcolor"].value);
            rgba.push(CI_el.inputObj["c_bgopacity"].value);
            CI_el.ctx_back.fillStyle = 'rgba(' + rgba + ')';
            CI_el.ctx_back.fillRect(0, 0, CI_el.canvas_back.width, CI_el.canvas_back.height);
        },


        /*---------------------------------------------
            ctx_img関係(背景画像)
        ----------------------------------------------*/
        // 画像データをcanvasに貼り付ける関数
        setCanvasImg(data_img, img3) {
            let reader = new FileReader();
            // readerの読み込みに成功した時
            reader.onload = function () {
                img3.src = reader.result;
                img3.onload = function () {
                    CI_el.ctx_img.drawImage(img3, 0, 0, img3.width, img3.height, 0, 0, CI_el.inputObj["c_width"].value, CI_el.inputObj["c_height"].value);
                }
            }
            reader.readAsDataURL(data_img);
        },

        // 描画canvasを取得しておく関数
        getImage(ctx) {
            let data = ctx.getImageData(0, 0, CI_el.inputObj["c_width"].value, CI_el.inputObj["c_height"].value);
            return data;
        },

        // 保存しておいた描画canvasを貼り付ける関数
        putImage(ctx, data) {
            ctx.putImageData(data, 0, 0);
        },

        //キャンバスサイズを画像のサイズに変更する関数
        changeCanvasSizeByImg(data_img,img3) {
            if (img3.width > 0) {
                // 描画canvasを取得しておく
                let line = this.getImage(CI_el.ctx_line);
                let font = this.getImage(CI_el.ctx_font);
                // 変更前のサイズ
                let w1 = img3.width;
                let h1 = img3.height;
                // 変更後のサイズ
                let w2 = img3.width;
                let h2 = img3.height;
                // 画像のサイズ調整(max800)
                if (w1 >= h1 && w1 > 800) {    // 横長画像の場合
                    w2 = 800;
                    h2 = 800 * h1 / w1;
                } else if (w1 < h1 && h1 > 800) {
                    h2 = 800;
                    w2 = 800 * w1 / h1;
                }
                CI_el.inputObj["c_width"].value = w2;
                CI_el.inputObj["c_height"].value = h2;
                CI_ar.canvas_arr.forEach(canvas => {
                    canvas["width"] = CI_el.inputObj["c_width"].value;
                    canvas["height"] = CI_el.inputObj["c_height"].value;
                });
                this.setCanvasImg(data_img, img3);
                // 保存しておいたcanvasを貼り付ける
                this.putImage(CI_el.ctx_line, line);
                this.putImage(CI_el.ctx_font, font);
            }
        },


        /*---------------------------------------------
            ctx_text関係(テキスト)
        ----------------------------------------------*/
        // テキストを再描画する関数
        rewriteText() {
            this.clearCanvas(CI_el.ctx_font);
            CI_ar.text_set_arr.forEach(set => {
                set.writingText();
            });
        },

        // 矢印クリックでテキストの移動
        text_move(target) {
            target.addEventListener('click', () => {
                this.clearCanvas(CI_el.ctx_font);
                let ins = CI_ar.text_set_arr[CI_dv.current_idx];
                switch (target.id) {
                    case 'left':
                        ins["position"][0] += CI_dv.fontDefault.move_step * -1;
                        break;
                    case 'right':
                        ins["position"][0] += CI_dv.fontDefault.move_step;
                        break;
                    case 'up':
                        ins["position"][1] += CI_dv.fontDefault.move_step * -1;
                        break;
                    default:
                        ins["position"][1] += CI_dv.fontDefault.move_step;
                }
                this.rewriteText();
            });
        },

        // フォントサイズ/フォントの種類を変更する関数
        changeFontSiFa(target) {
            target.addEventListener('change', e => {
                let ins = CI_ar.text_set_arr[CI_dv.current_idx];
                let key = target.id.slice(2);
                ins[key] = e.target.value;
                this.rewriteText();
            });
        },

        // 斜体/太字に変更
        chengeFontStyle(target) {
            target.addEventListener('change', e => {
                let ins = CI_ar.text_set_arr[CI_dv.current_idx];
                let key = e.target.id.slice(2);
                if (target.checked) {
                    ins[key] = true;
                } else {
                    ins[key] = false;
                }
                this.rewriteText();
            });
        },

        // 新しいテキストセットを作成して、input要素に初期値をセットする関数(テキスト専用)
        createTextSet() {
            let set = new CI_TextSet();
            CI_ar.text_set_arr.push(set);
            let idx = CI_ar.text_set_arr.indexOf(set);
            set.num = idx + 1;
            CI_dv.current_idx = idx;
            set.setSelectOption();
            set.setValueSet();
            this.setStrokeDefault(CI_ar.text_set_arr[CI_dv.current_idx]);
        },

        // テキストセットを1つ削除する関数（引数numはCI_TextSetのnumプロパティ）
        deleteTextSet(ins) {
            ins.removeSelectOption();
            ins = null;
            CI_ar.text_set_arr.splice(CI_dv.current_idx, 1);
            // 1番目のテキストセットをselectedにする
            if (!CI_el.inputObj["f_select"].children[0]) return;
            CI_el.inputObj["f_select"].children[0].selected = true;
            // numをふり直す
            CI_ar.text_set_arr.forEach((ins, idx) => {
                let new_num = idx + 1;
                CI_ar.text_set_arr[idx]["num"] = new_num;
                CI_el.inputObj["f_select"].children[idx].textContent = ins.num + ") " + ins.text;
                CI_el.inputObj["f_select"].children[idx].id = 'textset_' + ins.num;
                CI_el.inputObj["f_select"].children[idx].value = ins.num;
            });
            CI_ar.text_set_arr[0].setValueSet();
            CI_dv.current_idx = 0;
            this.rewriteText();
            this.setStrokeDefault(CI_ar.text_set_arr[CI_dv.current_idx]);
        },

        // 中抜きの初期処理
        setStrokeDefault(ins) {
            if (ins["style_l"]) {
                CI_el.inputObj["f_style_l"].checked = true;
                CI_el.inputObj["f_stroke_w"].parentNode.parentNode.classList.remove('hide');
            } else {
                CI_el.inputObj["f_style_l"].checked = false;
                CI_el.inputObj["f_stroke_w"].parentNode.parentNode.classList.add('hide');
            }
        },

        // フォントのスタイルを初期値にセットする関数 ins(TextSetのインスタンス)
        setFontStyleDefault(ins) {
            if (ins["style_i"]) {
                CI_el.inputObj["f_style_i"].checked = true;
            } else {
                CI_el.inputObj["f_style_i"].checked = false;
            }
            if (ins["style_b"]) {
                CI_el.inputObj["f_style_b"].checked = true;
            } else {
                CI_el.inputObj["f_style_b"].checked = false;
            }
        },


        /*---------------------------------------------
            ctx_line関係(ライン)
        ----------------------------------------------*/
        // ラインのモードを切り替える関数(ペンか消しゴムか)
        changeLineMode() {
            let result;
            CI_el.drawmodes.forEach(radio_btn => {
                if (radio_btn.checked) {
                    result = radio_btn.dataset.mode;
                }
            });
            return result;
        },

        // ラインのモードをセットする関数
        setLineMode(mode) {
            CI_el.ctx_line.globalCompositeOperation = mode;
        },

        // ラインの太さをセットする関数
        setLineBold() {
            CI_el.ctx_line.lineWidth = CI_el.inputObj["l_bold"].value;
        },

        // ラインの色・透明度をセットする関数
        setLineColor() {
            let rgba = this.hex2rgb(CI_el.inputObj["l_color"].value);
            rgba.push(CI_el.inputObj["l_opacity"].value);
            CI_el.ctx_line.strokeStyle = 'rgba(' + rgba + ')';
        },

        // キャンバス上にラインを描画する関数
        draw(x, y) {
            if (CI_dv.click_flag == "1") {
                CI_dv.click_flag = "2";
                CI_el.ctx_line.beginPath();
                CI_el.ctx_line.lineCap = "round";      // 線を角丸にする
                CI_el.ctx_line.moveTo(x, y);
            } else {
                CI_el.ctx_line.lineTo(x, y);
            }
            CI_el.ctx_line.stroke();
        },

        // ラインのモードをデフォルト値に戻す関数
        setLineDefaultMode() {
            CI_el.drawmodes.forEach(el => {
                if (el.value === CI_dv.l_mode) {
                    el.checked = true;
                } else {
                    el.checked = false;
                }
            });
        },

        /*---------------------------------------------
            その他ツール
        ----------------------------------------------*/
        // HEXをRGBに変換する関数
        hex2rgb(hex) {
            if (hex.slice(0, 1) == "#") hex = hex.slice(1);
            if (hex.length == 3) hex = hex.slice(0, 1) + hex.slice(0, 1) + hex.slice(1, 2) + hex.slice(1, 2) + hex.slice(2, 3) + hex.slice(2, 3);
            return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map(str => {
                return parseInt(str, 16);
            });
        },

    }
    window.CI_fn = functions;
});
