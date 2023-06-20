'use strict';

{
    const canvas = document.getElementById('canvas');           // 描画用キャンバス
    const canvas_img = document.getElementById('canvas_img');   // 背景画像用キャンバス
    const canvas_back = document.getElementById('canvas_back'); // 背景色用キャンバス
    const ctx = canvas.getContext('2d', {willReadFrequently: true});
    const ctx_img = canvas_img.getContext('2d');
    const ctx_back = canvas_back.getContext('2d');
    let canvas_arr = [canvas, canvas_img, canvas_back];         // キャンバスを入れた配列
    let ctx_arr = [ctx, ctx_img, ctx_back];                     // ctxを入れた配列
    // ダウンロードボタン
    const dl_btn = document.getElementById('download_img');
    // クリアボタン
    const clear_line = document.getElementById('clear_line');
    const clear_img = document.getElementById('clear_img');
    const clear_back = document.getElementById('clear_back');
    const clear_all = document.getElementById('clear_all');
    let clear_arr = [clear_line, clear_img, clear_back, clear_all];     // クリアボタンを入れた配列

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
    // フォントのデフォルト値
    let fontDefault = {
        size: 30,                   // フォントの大きさ
        color: "#000000",           // フォントの色
        opacity: 1.0,               // フォントの色(透明度)
        text: "",                   // 文章内容
    }
    let click_flag = "0";     // クリック判定(1:クリック開始, 2:クリック中)

    // 各input要素を取得
    const inputObj = {
        c_width: document.getElementById('c_width'),        // キャンバスの幅の要素
        c_height: document.getElementById('c_height'),      // キャンバスの高さの要素
        c_bgcolor: document.getElementById('c_bgcolor'),    // キャンバスの背景色の要素
        c_bgopacity: document.getElementById('c_bgopacity'), // キャンバスの背景色(透明度)
        l_bold: document.getElementById('l_bold'),          // 線の太さ
        l_color: document.getElementById('l_color'),        // 線の色
        l_opacity: document.getElementById('l_opacity'),    // 線の色(透明度)
        f_size: document.getElementById('f_size'),          // フォントサイズの要素
        f_color: document.getElementById('f_color'),        // フォント色の要素
        f_opacity: document.getElementById('f_opacity'),    // フォント色(透明度)
        f_text: document.getElementById('text'),            // 文章の要素
        base_img: document.getElementById('base_img'),      // 画像を取得
    }
    // ・・・フィルターのような機能も後で作ってみる


    // キャンバスのサイズをセット
    setDefaultSize();

    // 各初期値をinput要素に設定
    setInputDefault(canvasDefault, 'c_');
    setInputDefault(backDefault, 'c_');
    setInputDefault(lineDefault, 'l_');
    setInputDefault(fontDefault, 'f_');

    // 背景色をセット
    setBgcolor();

    // キャンバスのサイズ変更(changeイベント)
    changeCanvasSize('width');
    changeCanvasSize('height');

    // キャンバスの背景色・透明度を変更(changeイベント)
    changeCanvasColor('bgcolor');
    changeCanvasColor('bgopacity');




    // キャンバス上でのイベント
    canvas.addEventListener('mousedown', e => {
        click_flag = "1";
    });
    canvas.addEventListener('mouseup', () => {
        click_flag = "0";
    });
    canvas.addEventListener('mousemove', e => {
        if (click_flag == "0") return false;
        draw(e.offsetX, e.offsetY);
    });
    canvas.addEventListener('mouseleave', () => {
        click_flag = "0";
    });

    // キャンバス上に描画する関数
    function draw(x, y) {
        let rgba = hex2rgb(inputObj["l_color"].value);
        rgba.push(inputObj["l_opacity"].value);
        ctx.lineWidth = inputObj["l_bold"].value;
        ctx.strokeStyle = 'rgba(' + rgba + ')';
        if (click_flag == "1") {
            click_flag = "2";
            ctx.beginPath();
            ctx.lineCap = "round";      // 線を角丸にする
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

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
            img2.src = reader.result;
            img2.onload = function (){
                ctx_img.drawImage(img2, 0, 0, img2.width, img2.height, 0, 0, inputObj["c_width"].value, inputObj["c_height"].value);
            }
        }
        reader.readAsDataURL(data_img);
    }

    // 描画canvasを取得しておく関数(線やテキスト用)
    function getLine() {
        let data = ctx.getImageData(0, 0, inputObj["c_width"].value, inputObj["c_height"].value);
        return data;
    }

    // 保存しておいた描画canvasを貼り付ける関数(線やテキスト用)
    function putLine(data) {
        ctx.putImageData(data, 0, 0);
    }

    // sizebyimg_btnを押したら、キャンバスサイズを画像サイズに変更。max800
    const sizebyimg_btn = document.getElementById('sizebyimg_btn');
    sizebyimg_btn.addEventListener('click', () => {
        if (inputObj["base_img"].files[0]) {
            // 描画canvasを取得しておく
            let line = getLine();
            // 変更前のサイズ
            let w1 = img2.width;
            let h1 = img2.height;
            // 変更後のサイズ
            let w2 = img2.width;
            let h2 = img2.height;
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
            // 保存しておいた描画canvasを貼り付ける
            putLine(line);
        }
    });



    // ダウンロードに必要な要素群
    let canvas_marge = document.createElement('canvas');
    let download_a = document.createElement('a');
    let ctx_marge = canvas_marge.getContext('2d');
    let img1 = new Image();
    let img2 = new Image();
    let img3 = new Image();

    // ダウンロード
    dl_btn.addEventListener('click', () => {
        canvas_marge.width = inputObj["c_width"].value;
        canvas_marge.height = inputObj["c_height"].value;
        Promise.all([
            new Promise(resolve => {
                img1.onload = resolve;
                img1.src = canvas.toDataURL();
            }),
            new Promise(resolve => {
                img2.onload = resolve;
                img2.src = canvas_img.toDataURL();
            }),
            new Promise(resolve => {
                img3.onload = resolve;
                img3.src = canvas_back.toDataURL();
            })
        ]).then(() => {
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

    // クリアボタン(各種)   imgのクリアボタンがまだ★★★
    clear_arr.forEach((clear, index) => {
        clear.addEventListener('click', () => {
            if (clear.id === 'clear_all') {
                clearCanvasAll();
                setDefaultSize();
                setInputValue(canvasDefault, 'c_');
                setInputValue(backDefault, 'c_');
                setInputValue(lineDefault, 'l_');
                setInputValue(fontDefault, 'f_');
                setBgcolor();
            } else {
                clearCanvas(ctx_arr[index]);
                switch(clear.id){
                    case 'clear_line':
                        setInputValue(lineDefault, 'l_');
                        setInputValue(fontDefault, 'f_');
                        break;
                    case 'clear_back':
                        setInputValue(backDefault, 'c_');
                        setBgcolor();
                        break;
                    case 'clear_img':
                        base_img.value = '';
                        setBgcolor();
                }
            }
        });
    });



    // input要素に初期値をセットする関数
    function setInputDefault(Obj, prefix) {
        Object.entries(Obj).forEach(val => {
            inputObj[prefix + val[0]].defaultValue = val[1];
        });
    }
    // input要素を初期値に戻す関数
    function setInputValue(Obj, prefix) {
        Object.entries(Obj).forEach(val => {
            inputObj[prefix + val[0]].value = val[1];
        });
    }

    // キャンバスのサイズを変更する関数
    function changeCanvasSize(attr) {
        inputObj["c_" + attr].addEventListener('change', e => {
            let line = getLine();
            canvas_arr.forEach(canvas => {
                canvas[attr] = e.target.value;
                if (canvas.id === 'canvas') {
                    putLine(line);
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

    // 線の

    // キャンバスをクリアする関数
    function clearCanvas(ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // すべてのキャンバスをクリアする関数
    function clearCanvasAll() {
        ctx_arr.forEach(ctx => {
            clearCanvas(ctx);
        });
    }

    // すべてのキャンバスにデフォルトサイズをセットする関数
    function setDefaultSize() {
        canvas_arr.forEach(canvas => {
            canvas.width = canvasDefault.width;             // キャンバスの幅
            canvas.height = canvasDefault.height;           // キャンバスの高さ
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
}
