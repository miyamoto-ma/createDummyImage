'use strict';

window.addEventListener('DOMContentLoaded', () => {
    /*---------------------------------------------------
        登録したテキストのパラメータを保存しておくクラス
    -----------------------------------------------------*/
    class TextSet {
        // 初期値の入ったインスタンス作成するためのコンストラクタ
        constructor() {
            this.num = 1;                                       // テキストセットのキー番号(配列index + 1)
            this.style_l = CI_dv.fontDefault["style_l"];        // フォントスタイル(中抜きかどうか)
            this.style_i = CI_dv.fontDefault["style_i"];        // フォントスタイル(斜体かどうか)
            this.style_b = CI_dv.fontDefault["style_b"];        // フォントスタイル(太字かどうか)
            this.stroke_w = CI_dv.fontDefault["stroke_w"];      // 中抜きの場合の線の太さ
            this.size = CI_dv.fontDefault["size"];              // フォントの大きさ
            this.family = CI_dv.fontDefault["family"];          // フォントの種類
            this.color = CI_dv.fontDefault["color"];            // フォントの色
            this.text = CI_dv.fontDefault["text"];              // 文章内容
            this.position = [...CI_dv.fontDefault["position"]]; // ポジション(左上)
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
            CI_el.ctx_font.font = this.getFontStyle() + this.size + 'px ' + CI_dv.fontFamily[this.family];
            if (!this.style_l) {
                CI_el.ctx_font.fillStyle = this.color;
                CI_el.ctx_font.fillText(this.text, this.position[0], this.position[1]);
            } else {
                CI_el.ctx_font.strokeStyle = this.color;
                CI_el.ctx_font.lineWidth = this.stroke_w;
                CI_el.ctx_font.strokeText(this.text, this.position[0], this.position[1]);
            }
        }

        // 各要素に値をまとめてセット
        setValueSet() {
            this.setInputValue();
            this.setSelected();
            this.setChecked();
        }

        // input要素の値をセットするメソッド(valueにセットするもの)
        setInputValue() {
            let arr = ['stroke_w', 'size', 'color', 'text'];
            arr.forEach(target => {
                CI_el.inputObj['f_' + target].value = this[target];
            });
        }

        // selectの値をセットするメソッド(selectedをセットするもの。f_family用)
        setSelected() {
            Array.from(CI_el.inputObj.f_family.children).forEach((option, idx) => {
                if (option.value == this.family) {
                    CI_el.inputObj.f_family.children[idx].selected = true;
                } else {
                    CI_el.inputObj.f_family.children[idx].selected = false;
                }
            });
        }

        // checkboxの値をセットするメソッド(checkedをセットするもの)
        setChecked() {
            let arr = ['style_l', 'style_i', 'style_b'];
            arr.forEach(target => {
                CI_el.inputObj['f_' + target].checked = this[target];
            });
        }

        // 「選択」に新しくoption要素をセットするメソッド(「追加」ボタン用)
        setSelectOption() {
            let option = document.createElement('option');
            option.id = 'textset_' + this.num;
            option.value = this.num;
            option.selected = true;
            option.textContent = this.num + ') ' + this.text;
            CI_el.inputObj['f_select'].appendChild(option);
        }

        // 「選択」からoption要素を削除するメソッド(「削除」ボタン用)
        removeSelectOption() {
            let target = document.getElementById('textset_' + this.num);
            CI_el.inputObj['f_select'].removeChild(target);
        }
    }

    window.CI_TextSet = TextSet;
});
