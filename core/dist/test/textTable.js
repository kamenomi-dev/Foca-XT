"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const systemInfo_1 = __importDefault(require("../util/systemInfo"));
class CTextTable {
    static TABLE_SCROLL_TYPE = {
        THIN: ['─', '│', '┌', '┐', '└', '┘', '┼', '├', '┤', '┬', '┴'],
        THICK: ['━', '┃', '┏', '┓', '┗', '┛', '╋', '┣', '┫', '┳', '┻'],
        DOUBLE: ['═', '║', '╔', '╗', '╚', '╝', '╬', '╠', '╣', '╦', '╩']
    };
    static TABLE_PADDING_SPACE = ' ';
    TABLE_MAXLENGTH = [0];
    TABLE_CONFIG;
    TABLE_DATA = new Array;
    constructor(config = {
        scrollStyle: 'THIN',
        paddingWidth: 0,
        withinBorder: false
    }) {
        this.TABLE_CONFIG = config;
    }
    ;
    tableItemWidth(colIdx = 0) {
        return this.TABLE_MAXLENGTH[colIdx] + 2 * this.TABLE_CONFIG.paddingWidth;
    }
    ;
    addItem(items) {
        if (items.some(val => Array.isArray(val)))
            items.forEach(row => {
                this.TABLE_DATA.push(row);
            });
        else
            this.TABLE_DATA.push(items);
        this.TABLE_DATA.forEach(row => {
            row.forEach((item, colIdx) => {
                this.TABLE_MAXLENGTH[colIdx] = Math.max(item.length, this.TABLE_MAXLENGTH[colIdx] || 0);
            });
        });
        return this;
    }
    ;
    generate() {
        const firstLen = this.TABLE_DATA.length; // 没什么用，减少对类变量使用 x 更美观 √
        const withBorder = this.TABLE_CONFIG.withinBorder;
        const scrollStyle = CTextTable.TABLE_SCROLL_TYPE[this.TABLE_CONFIG.scrollStyle];
        let textTable = '';
        if (withBorder) {
            textTable = scrollStyle[2];
            this.TABLE_DATA.forEach(row => row.forEach((col, colIdx) => {
                textTable
                    = textTable
                        + scrollStyle[0].repeat(this.tableItemWidth(colIdx)) + scrollStyle[9];
            }));
            textTable
                = textTable
                    + scrollStyle[3]
                    + '\n';
        }
        ;
        this.TABLE_DATA.forEach((row, itemX) => {
            if (withBorder)
                textTable += scrollStyle[1];
            row.forEach((item, itemY) => {
                let itemPadding = CTextTable.TABLE_PADDING_SPACE.repeat(this.TABLE_CONFIG.paddingWidth);
                let outItem = item;
                let leftPos = Math.floor((this.TABLE_MAXLENGTH[itemY] - item.length) * 0.5) + item.length;
                outItem = item.padStart(leftPos + Number(this.TABLE_MAXLENGTH[itemY] * 0.5 > leftPos), CTextTable.TABLE_PADDING_SPACE);
                outItem = outItem.padEnd(this.TABLE_MAXLENGTH[itemY], CTextTable.TABLE_PADDING_SPACE);
                textTable
                    = textTable
                        + itemPadding
                        + outItem
                        + itemPadding
                        + scrollStyle[1];
            });
            if (withBorder)
                textTable += '\n';
            else
                textTable = textTable.slice(0, -1) + '\n';
            if (itemX != this.TABLE_DATA.length - 1) {
                let colScroll = '';
                this.TABLE_DATA[itemX].forEach((col, colIdx, rowArray) => {
                    colScroll += scrollStyle[0].repeat(this.tableItemWidth(colIdx));
                    if (colIdx != rowArray.length - 1)
                        colScroll += scrollStyle[6];
                });
                if (withBorder)
                    colScroll
                        = scrollStyle[7]
                            + colScroll
                            + scrollStyle[8];
                textTable += colScroll + '\n';
            }
            ;
        });
        if (withBorder) {
            textTable += scrollStyle[4];
            this.TABLE_DATA.forEach(row => row.forEach((col, colIdx) => {
                textTable += scrollStyle[0].repeat(this.tableItemWidth(colIdx)) + scrollStyle[10];
            }));
            textTable
                += scrollStyle[5]
                    + '\n';
        }
        ;
        return textTable;
    }
    ;
}
;
let systemInfo = new systemInfo_1.default;
let textTable = new CTextTable({
    paddingWidth: 2,
    scrollStyle: 'THIN',
    withinBorder: false
});
textTable
    .addItem(['platform: ', systemInfo.OS_PLATFORM, 'upTime: ', (systemInfo.OS_UP_TIME / 60 / 60).toFixed(2) + 'Hour'])
    .addItem(['CPU: ', systemInfo.OS_BASIC_CPU, 'Usage: ', (systemInfo.OS_DETAIL_CPU.usage * 100).toFixed(2) + '%'])
    .addItem(['MEM: ', 'N/A', 'Usage: ', (systemInfo.OS_DETAIL_MEM.percent * 100).toFixed(2) + '%']);
// textTable.addItem([
//   ['platform: ', systemInfo.OS_PLATFORM , 'upTime: ', (systemInfo.OS_UP_TIME / 60 / 60).toFixed(2) + 'Hour'    ],
//   ['CPU: '     , systemInfo.OS_BASIC_CPU, 'Usage: ' , (systemInfo.OS_DETAIL_CPU.usage * 100).toFixed(2) + '%'  ],
//   ['MEM: '     , 'N/A'                  , 'Usage: ' , (systemInfo.OS_DETAIL_MEM.percent * 100).toFixed(2) + '%']
// ]);
console.log(textTable.generate());
process.exit();
