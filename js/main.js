'use strict';

{
    const canvas_line = document.getElementById('canvas_line');         // 描画用キャンバス
    const canvas_font = document.getElementById('canvas_font')          // フォント用キャンバス
    const canvas_img = document.getElementById('canvas_img');           // 背景画像用キャンバス
    const canvas_back = document.getElementById('canvas_back');         // 背景色用キャンバス
    const ctx_line = canvas_line.getContext('2d', { willReadFrequently: true });
    const ctx_font = canvas_font.getContext('2d', { willReadFrequently: true });
    const ctx_img = canvas_img.getContext('2d');
    const ctx_back = canvas_back.getContext('2d');
    let canvas_arr = [canvas_line, canvas_font, canvas_img, canvas_back];      // キャンバスを入れた配列
    let ctx_arr = [ctx_line, ctx_font, ctx_img, ctx_back];                     // ctxを入れた配列
    // ダウンロードボタン
    const dl_btn = document.getElementById('download_img');
    // クリアボタン
    const clear_line = document.getElementById('clear_line');
    const clear_font = document.getElementById('clear_font');
    const clear_img = document.getElementById('clear_img');
    const clear_back = document.getElementById('clear_back');
    const clear_all = document.getElementById('clear_all');
    let clear_arr = [clear_line, clear_font, clear_img, clear_back, clear_all];     // クリアボタンを入れた配列
    // ラインのモード ラジオボタン
    const drawmodes = document.getElementsByName('drawmode');

    // キャンバスのデフォルト値
    let canvasDefault = {
        width: 500,                     // キャンバスの幅
        height: 500,                    // キャンバスの高さ
    }
    // 背景色のデフォルト値
    let backDefault = {
        bgcolor: "#eeeeee",             // キャンバスの背景色
        bgopacity: 1.0,                 // キャンバスの背景色(透明度)
    }
    // ラインのデフォルト値
    let lineDefault = {
        bold: 5,                    // 線の太さ
        color: "#ff0000",           // 線の色
        opacity: 1.0,               // 線の色(透明度)
    }
    // 描画モードのデフォルト値
    let l_mode = "normal";          // 描画モード or 消しゴムモード
    // フォントのデフォルト値
    let fontDefault = {
        select: "",                 // テキストを選択
        style_l: false,             // フォントスタイル(中抜きかどうか)
        style_i: false,             // フォントスタイル(斜体かどうか)
        style_b: false,             // フォントスタイル(太字かどうか)
        stroke_w: 2,                // 中抜きの場合の線の太さ
        size: 50,                   // フォントの大きさ
        family: "ms_g",             // フォントの種類
        color: "#000000",           // フォントの色
        text: "",                   // 文章内容
        position: [30, 80],           // ポジション(左上)
    }
    let fontFamily = {
        ms_g: 'ＭＳ ゴシック',
        ms_p: 'ＭＳ Ｐゴシック',
        ms_m: 'ＭＳ 明朝',
        yu_m: '游明朝',
        yu_g: '游ゴシック',
        hg_me: 'HG明朝E',
        hg_ge: 'HGゴシックE'
    }

    // 各input要素を取得
    const inputObj = {
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
    }
    // 登録したテキストのパラメータを保存しておくクラス
    class TextSet {
        constructor() {
            this.num = 1;                            // テキストセットのキー番号(配列index + 1)
            this.style_l = fontDefault["style_l"];   // フォントスタイル(中抜きかどうか)
            this.style_i = fontDefault["style_i"];   // フォントスタイル(斜体かどうか)
            this.style_b = fontDefault["style_b"];   // フォントスタイル(太字かどうか)
            this.stroke_w = fontDefault["stroke_w"]; // 中抜きの場合の線の太さ
            this.size = fontDefault["size"];         // フォントの大きさ
            this.family = fontDefault["family"];     // フォントの種類
            this.color = fontDefault["color"];       // フォントの色
            this.text = fontDefault["text"];         // 文章内容
            this.position = [...fontDefault["position"]]; // ポジション(左上)
        }

        // 斜体・太字をセット時に使用する文字列を作るメソッド
        getFontStyle() {
            let font_style = '';
            if (this.style_i) {
                font_style += 'italic ';
            }
            if (this.style_b) {
                font_style += 'bold ';
            }
            return font_style;
        }

        // 中抜きのチェックの有無で、使用するコードを変更して描画するメソッド
        writingText() {
            ctx_font.font = this.getFontStyle() + this.size + 'px ' + fontFamily[this.family];
            if (!this.style_l) {
                ctx_font.fillStyle = this.color;
                ctx_font.fillText(this.text, this.position[0], this.position[1]);
            } else {
                ctx_font.strokeStyle = this.color;
                ctx_font.lineWidth = this.stroke_w;
                ctx_font.strokeText(this.text, this.position[0], this.position[1]);
            }
        }

        // 値をセット
        setValueSet() {
            this.setInputValue();
            this.setSelected();
            this.setChecked();
        }

        // input要素の値をセットするメソッド(valueにセットするもの)
        setInputValue() {
            let arr = ['stroke_w', 'size', 'color', 'text'];
            arr.forEach(target => {
                inputObj['f_' + target].value = this[target];
            });
        }
        // selectの値をセットするメソッド(selectedをセットするもの。f_family用)
        setSelected() {
            Array.from(inputObj.f_family.children).forEach((option, idx) => {
                if (option.value == this.family) {
                    inputObj.f_family.children[idx].selected = true;
                } else {
                    inputObj.f_family.children[idx].selected = false;
                }
            });
        }
        // checkboxの値をセットするメソッド(checkedをセットするもの)
        setChecked() {
            let arr = ['style_l', 'style_i', 'style_b'];
            arr.forEach(target => {
                inputObj['f_' + target].checked = this[target];
            });
        }
        // 「選択」に新しくoptionをセットするメソッド
        setSelectOption() {
            let option = document.createElement('option');
            option.id = 'textset_' + this.num;
            option.value = this.num;
            option.selected = true;
            option.textContent = this.num + ') ' + this.text;
            inputObj['f_select'].appendChild(option);
        }
        // 「選択」からoptionを削除するメソッド
        removeSelectOption() {
            let target = document.getElementById('textset_' + this.num);
            inputObj['f_select'].removeChild(target);
        }
    }

    // TextSetのインスタンスを格納する配列
    let text_set_arr = [];
    // 選択中のTextSetのidx
    let current_idx = 0;

    // クリック判定(1:クリック開始, 2:クリック中)
    let click_flag = "0";
    // キャンバスのサイズをセット
    setDefaultSize();

    // 各初期値をinput要素に設定
    setInputDefault(canvasDefault, 'c_');
    setInputDefault(backDefault, 'c_');
    setInputDefault(lineDefault, 'l_');

    // 背景色をセット
    setBgcolor();

    // キャンバスのサイズ変更(changeイベント)
    changeCanvasSize('width');
    changeCanvasSize('height');

    // キャンバスの背景色・透明度を変更(changeイベント)
    changeCanvasColor('bgcolor');
    changeCanvasColor('bgopacity');

    // テキストの初期値をセット
    createTextSet();

    // テキスト関係の要素の初期化
    text_set_arr[0].setValueSet();

    // デフォルトのラインモードに設定
    setLineDefaultMode();

    // ラインのモードを切り替える関数
    function changeLineMode() {
        let result;
        drawmodes.forEach(radio_btn => {
            if (radio_btn.checked) {
                result = radio_btn.dataset.mode;
            }
        });
        return result;
    }

    // キャンバス上でのイベント
    canvas_line.addEventListener('mousedown', e => {
        click_flag = "1";
    });
    canvas_line.addEventListener('mouseup', () => {
        click_flag = "0";
    });
    canvas_line.addEventListener('mousemove', e => {
        if (click_flag == "0") return false;
        draw(e.offsetX, e.offsetY);
    });
    canvas_line.addEventListener('mouseleave', () => {
        click_flag = "0";
    });

    // キャンバス上に描画する関数
    function draw(x, y) {
        let rgba = hex2rgb(inputObj["l_color"].value);
        rgba.push(inputObj["l_opacity"].value);
        ctx_line.globalCompositeOperation = changeLineMode();
        ctx_line.lineWidth = inputObj["l_bold"].value;
        ctx_line.strokeStyle = 'rgba(' + rgba + ')';
        if (click_flag == "1") {
            click_flag = "2";
            ctx_line.beginPath();
            ctx_line.lineCap = "round";      // 線を角丸にする
            ctx_line.moveTo(x, y);
        } else {
            ctx_line.lineTo(x, y);
        }
        ctx_line.stroke();
    }


    // フォント関係の定義
    let left = document.getElementById('left');
    let right = document.getElementById('right');
    let up = document.getElementById('up');
    let down = document.getElementById('down');
    let move_step = 10;
    setFontStyleDefault(text_set_arr[0]);             // font_styleに初期値をセット
    setStrokeDefault(text_set_arr[0]);                // 中抜きにチェックが入っていた場合の初期値セット
    text_set_arr[0].writingText();                    // 中抜きにチェックの有無で初期のテキストのコードを実行

    // テキストを再描画する関数
    function rewriteText() {
        clearCanvas(ctx_font);
        text_set_arr.forEach(set => {
            set.writingText();
        });
    }

    // 中抜きにチェックが入ったら、f_stroke_wのinputを表示する(changeイベント)
    inputObj["f_style_l"].addEventListener('change', e => {
        if (e.target.checked) {
            inputObj["f_stroke_w"].parentNode.parentNode.classList.remove('hide');
            text_set_arr[current_idx]["style_l"] = true;
        } else {
            inputObj["f_stroke_w"].parentNode.parentNode.classList.add('hide');
            text_set_arr[current_idx]["style_l"] = false;
        }
        rewriteText();
    });

    // 中抜きの線の太さを変更する
    inputObj["f_stroke_w"].addEventListener('change', e => {
        text_set_arr[current_idx]["stroke_w"] = e.target.value;
        rewriteText();
    });

    // 矢印クリックでテキストの移動★★★全部のpositionが変わってしまう。
    function text_move(target) {
        target.addEventListener('click', () => {
            clearCanvas(ctx_font);
            let ins = text_set_arr[current_idx];
            switch (target.id) {
                case 'left':
                    ins["position"][0] += move_step * -1;
                    break;
                case 'right':
                    ins["position"][0] += move_step;
                    break;
                case 'up':
                    ins["position"][1] += move_step * -1;
                    break;
                default:
                    ins["position"][1] += move_step;
            }
            rewriteText();
        });
    }
    text_move(left);
    text_move(right);
    text_move(up);
    text_move(down);

    // 入力テキストを表示
    inputObj["f_text"].addEventListener('keyup', e => {
        text_set_arr[current_idx]["text"] = e.target.value;
        let text = (text_set_arr[current_idx]["num"] + ') ' + e.target.value).slice(0, 20);
        inputObj["f_select"].children[current_idx].textContent = text;
        rewriteText();
    });

    // フォントサイズ/フォントの種類を変更する関数
    function changeFontSiFa(target) {
        target.addEventListener('change', e => {
            let ins = text_set_arr[current_idx];
            let key = target.id.slice(2);
            ins[key] = e.target.value;
            rewriteText();
        });
    }
    changeFontSiFa(inputObj["f_size"]);
    changeFontSiFa(inputObj["f_family"]);

    // テキストの色の変更
    inputObj["f_color"].addEventListener('change', e => {
        let key = e.target.id.slice(2);
        text_set_arr[current_idx][key] = e.target.value;
        rewriteText();
    });

    // 斜体/太字に変更
    function chengeFontStyle(target) {
        target.addEventListener('change', e => {
            let ins = text_set_arr[current_idx];
            let key = e.target.id.slice(2);
            if (target.checked) {
                ins[key] = true;
            } else {
                ins[key] = false;
            }
            rewriteText();
        });
    }
    chengeFontStyle(f_style_i);
    chengeFontStyle(f_style_b);

    // テキストセットの追加・削除ボタン
    const text_add = document.getElementById('text_add');           //「追加」ボタン
    const text_remove = document.getElementById('text_remove');     //「削除」ボタン

    // 「追加」クリック時に新しいテキストセットを追加する
    text_add.addEventListener('click', () => {
        createTextSet();
    });

    // 新しいテキストセットを作成して、input要素に初期値をセットする関数(テキスト専用)
    function createTextSet() {
        let set = new TextSet();
        text_set_arr.push(set);
        let idx = text_set_arr.indexOf(set);
        set.num = idx + 1;
        current_idx = idx;
        set.setSelectOption();
        set.setValueSet();
        setStrokeDefault(text_set_arr[current_idx]);
    }

    // 「削除」クリック時に選択中のテキストセットを削除する
    text_remove.addEventListener('click', () => {
        if (text_set_arr.length > 1) {
            deleteTextSet(text_set_arr[current_idx]);
        } else {
            alert('すべてのテキストセットは削除できません。')
        }
    });

    // テキストセットを1つ削除する関数（引数numはTextSetのnumプロパティ）
    function deleteTextSet(ins) {
        ins.removeSelectOption();
        ins = null;
        text_set_arr.splice(current_idx, 1);
        // 1番目のテキストセットをselectedにする
        inputObj["f_select"].children[0].selected = true;
        // numをふり直す
        text_set_arr.forEach((ins, idx) => {
            let new_num = idx + 1;
            text_set_arr[idx]["num"] = new_num;
            inputObj["f_select"].children[idx].textContent = ins.num + ") " + ins.text;
            inputObj["f_select"].children[idx].id = 'textset_' + ins.num;
            inputObj["f_select"].children[idx].value = ins.num;
        });
        text_set_arr[0].setValueSet();
        current_idx = 0;
        rewriteText();
        setStrokeDefault(text_set_arr[current_idx]);
    }

    // 「選択」変更時、該当のテキストセットをセットする
    inputObj["f_select"].addEventListener('change', e => {
        current_idx = e.currentTarget.value - 1;
        text_set_arr[current_idx].setValueSet();
        setStrokeDefault(text_set_arr[current_idx]);
    });



    // 「ファイルを選択」を変更したら画像情報を取得
    let data_img;
    inputObj["base_img"].addEventListener('change', e => {
        // ファイル情報の取得
        data_img = e.target.files[0];
        // 画像データで無ければ処理を終了
        if (!data_img.type.match('image.*')) {
            alert('画像を選択して下さい。');
            return;
        }
        setCanvasImg();
    });

    // 画像データをcanvasに貼り付ける関数
    function setCanvasImg() {
        let reader = new FileReader();
        // readerの読み込みに成功した時
        reader.onload = function () {
            img3.src = reader.result;
            img3.onload = function (){
                ctx_img.drawImage(img3, 0, 0, img3.width, img3.height, 0, 0, inputObj["c_width"].value, inputObj["c_height"].value);
            }
        }
        reader.readAsDataURL(data_img);
    }

    // 描画canvasを取得しておく関数
    function getImage(ctx) {
        let data = ctx.getImageData(0, 0, inputObj["c_width"].value, inputObj["c_height"].value);
        return data;
    }

    // 保存しておいた描画canvasを貼り付ける関数
    function putImage(ctx, data) {
        ctx.putImageData(data, 0, 0);
    }

    // sizebyimg_btnを押したら、キャンバスサイズを画像サイズに変更。max800
    const sizebyimg_btn = document.getElementById('sizebyimg_btn');
    sizebyimg_btn.addEventListener('click', () => {
        if (inputObj["base_img"].files[0]) {
            // 描画canvasを取得しておく
            let line = getImage(ctx_line);
            let font = getImage(ctx_font);
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
            inputObj["c_width"].value = w2;
            inputObj["c_height"].value = h2;
            canvas_arr.forEach(canvas => {
                canvas["width"] = inputObj["c_width"].value;
                canvas["height"] = inputObj["c_height"].value;
            });
            setCanvasImg();
            // 保存しておいたcanvasを貼り付ける
            putImage(ctx_line, line);
            putImage(ctx_font, font);
        }
    });



    // ダウンロードに必要な要素群
    let canvas_marge = document.createElement('canvas');
    let download_a = document.createElement('a');
    let ctx_marge = canvas_marge.getContext('2d');
    let img1 = new Image();
    let img2 = new Image();
    let img3 = new Image();
    let img4 = new Image();

    // ダウンロード
    dl_btn.addEventListener('click', () => {
        canvas_marge.width = inputObj["c_width"].value;
        canvas_marge.height = inputObj["c_height"].value;
        Promise.all([
            new Promise(resolve => {
                img1.onload = resolve;
                img1.src = canvas_line.toDataURL();
            }),
            new Promise(resolve => {
                img2.onload = resolve;
                img2.src = canvas_font.toDataURL();
            }),
            new Promise(resolve => {
                img3.onload = resolve;
                img3.src = canvas_img.toDataURL();
            }),
            new Promise(resolve => {
                img4.onload = resolve;
                img4.src = canvas_back.toDataURL();
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



    // 背景の色・透明度を変更する関数
    function changeCanvasColor(attr) {
        inputObj["c_" + attr].addEventListener('change', () => {
            if (attr === 'bgopacity') {
                clearCanvas(ctx_back);
            }
            setBgcolor();
        });
    }

    // 背景の色のセットする関数
    function setBgcolor() {
        let rgba = hex2rgb(inputObj["c_bgcolor"].value);
        rgba.push(inputObj["c_bgopacity"].value);
        ctx_back.fillStyle = 'rgba(' + rgba + ')';
        ctx_back.fillRect(0, 0, canvas_back.width, canvas_back.height);
    }

    // キャンバスのサイズを変更する関数
    function changeCanvasSize(attr) {
        inputObj["c_" + attr].addEventListener('change', e => {
            let line = getImage(ctx_line);
            let font = getImage(ctx_font);
            canvas_arr.forEach(canvas => {
                canvas[attr] = e.target.value;
                if (canvas.id === 'canvas_line') {
                    putImage(ctx_line, line);
                }
                if (canvas.id === 'canvas_font') {
                    putImage(ctx_font, font);
                }
                if (canvas.id === 'canvas_back') {
                    setBgcolor();
                }
                if (canvas.id === 'canvas_img') {
                    if (data_img) {
                        setCanvasImg();
                    }
                }
            });
        });
    }

    // すべてのキャンバスにデフォルトサイズをセットする関数
    function setDefaultSize() {
        canvas_arr.forEach(canvas => {
            canvas.width = canvasDefault.width;             // キャンバスの幅
            canvas.height = canvasDefault.height;           // キャンバスの高さ
        });
    }

    // input要素に初期値をセットする関数
    function setInputDefault(obj, prefix) {
        Object.entries(obj).forEach(val => {
            inputObj[prefix + val[0]].defaultValue = val[1];
        });
    }
    // input要素を初期値に戻す関数
    function setInputValue(obj, prefix) {
        Object.entries(obj).forEach(val => {
            inputObj[prefix + val[0]].value = val[1];
        });
    }


    // 追加したテキストを全て削除して初期化
    function clearTextSets() {
        text_set_arr.forEach((val, idx) => {
            text_set_arr[idx] = null;
        });
        text_set_arr = [];
        while (inputObj["f_select"].firstChild) {
            inputObj["f_select"].removeChild(inputObj["f_select"].firstChild);
        }
        createTextSet();
        setFontStyleDefault(text_set_arr[0]);
        setStrokeDefault(text_set_arr[0]);
    }

    // フォントのスタイルを初期値にセットする関数 ins(TextSetのインスタンス)
    function setFontStyleDefault(ins) {
        if (ins["style_i"]){
            inputObj["f_style_i"].checked = true;
        } else {
            inputObj["f_style_i"].checked = false;
        }
        if (ins["style_b"]) {
            inputObj["f_style_b"].checked = true;
        } else {
            inputObj["f_style_b"].checked = false;
        }
    }

    // 中抜きの初期処理
    function setStrokeDefault(ins) {
        if (ins["style_l"]) {
            inputObj["f_style_l"].checked = true;
            inputObj["f_stroke_w"].parentNode.parentNode.classList.remove('hide');
        } else {
            inputObj["f_style_l"].checked = false;
            inputObj["f_stroke_w"].parentNode.parentNode.classList.add('hide');
        }
    }

    // ラインのモードをデフォルトに戻す関数
    function setLineDefaultMode() {
        drawmodes.forEach(el => {
            if (el.value === l_mode) {
                el.checked = true;
            } else {
                el.checked = false;
            }
        });
    }

    // クリアボタン(各種)   fontのクリアボタンがまだ★★★
    clear_arr.forEach((clear, index) => {
        clear.addEventListener('click', () => {
            let result;
            if (clear.id === 'clear_all') {
                result = confirm('全てレイヤーをリセットします。');
                if (result) {
                    clearCanvasAll();
                    clearTextSets();

                    setDefaultSize();
                    setLineDefaultMode();
                    setInputValue(canvasDefault, 'c_');
                    setInputValue(backDefault, 'c_');
                    setInputValue(lineDefault, 'l_');
                    setBgcolor();
                }
            } else {
                switch(clear.id){
                    case 'clear_line':
                        result = confirm('ラインをリセットします。');
                        if (result) {
                            clearCanvas(ctx_arr[index]);
                            setLineDefaultMode();
                            setInputValue(lineDefault, 'l_');
                        }
                        break;
                    case 'clear_font':
                        result = confirm('テキストをリセットします。');
                        if (result) {
                            clearCanvas(ctx_arr[index]);
                            clearTextSets();
                        }
                        break;
                    case 'clear_back':
                        result = confirm('背景色をリセットします。');
                        if (result) {
                            clearCanvas(ctx_arr[index]);
                            setInputValue(backDefault, 'c_');
                            setBgcolor();
                        }
                        break;
                    case 'clear_img':
                        result = confirm('背景画像をリセットします。');
                        if (result) {
                            clearCanvas(ctx_arr[index]);
                            base_img.value = '';
                            setBgcolor();
                        }
                        break;
                }
            }
        });
    });

    // キャンバスをクリアする関数
    function clearCanvas(ctx) {
        ctx.clearRect(0, 0, canvas_line.width, canvas_line.height);
    }

    // すべてのキャンバスをクリアする関数
    function clearCanvasAll() {
        ctx_arr.forEach(ctx => {
            clearCanvas(ctx);
        });
    }

    // HEXをRGBに変換する関数
    function hex2rgb(hex) {
        if (hex.slice(0, 1) == "#") hex = hex.slice(1);
        if (hex.length == 3) hex = hex.slice(0, 1) + hex.slice(0, 1) + hex.slice(1, 2) + hex.slice(1, 2) + hex.slice(2, 3) + hex.slice(2, 3);
        return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map(str => {
            return parseInt(str, 16);
        });
    }

    // hb_btnの開閉
    const hb_btn = document.getElementById('hb_btn');
    const control = document.getElementById('control');
    hb_btn.addEventListener('click', () => {
        hb_btn.classList.toggle('active');
        control.classList.toggle('active');
    })
}
