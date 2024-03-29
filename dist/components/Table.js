"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const scroll_1 = require("./scroll");
const IconX_1 = __importDefault(require("./IconX"));
const TableContainer = styled_components_1.default.div `
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    margin-bottom: 30px;
    ${({ nested }) => nested &&
    'padding:2rem; background-color:#f9f9f9;border-left: 1px solid rgba(0, 0, 0, 0.05);border-right: 1px solid rgba(0, 0, 0, 0.05);border-bottom: 1px solid rgba(0, 0, 0, 0.05);'};
`;
const Row = styled_components_1.default.div `
    display: flex;
    flex: 0 100px 1em;
    flex-direction: row;
    flex-wrap: nowrap;
    height: 80px;
    ${({ expanded }) => expanded &&
    'border-bottom: 1px solid rgba(0, 0, 0, 0.05); background-color:#f1f1f1;margin-bottom:0!important;'};
`;
const HeaderColumn = styled_components_1.default.div `
    ${({ width }) => `flex-shrink: ${width ? '0' : '1'}`};
    ${({ width }) => width && `flex-basis: ${width}px;`}
`;
const Column = styled_components_1.default.div `
    ${({ width }) => `flex-shrink: ${width ? '0' : '1'}`};
    ${({ width }) => width && `flex-basis: ${width}px;`}
    ${({ expander }) => expander && 'cursor: pointer;'}
`;
function Table({ expandConfig, nested, isScrollable, infinityScrollConfig, datasource, columns, }) {
    const [expandedRow, setExpandedRow] = (0, react_1.useState)(null);
    const [infinityScrollEnd, setInfinityScrollEnd] = (0, react_1.useState)(infinityScrollConfig ? infinityScrollConfig.gap : 100);
    const [scrollY, setScrollY] = (0, react_1.useState)(0);
    const [rowRefs, setRowRefs] = (0, react_1.useState)([]);
    const tableRef = (0, react_1.useRef)();
    const getRefKey = (index) => {
        var _a;
        return ((_a = rowRefs[index]) === null || _a === void 0 ? void 0 : _a.current) ? JSON.stringify(rowRefs[index].current) : null;
    };
    const isExpanded = (index) => {
        return getRefKey(index) !== null && getRefKey(index) === expandedRow;
    };
    const updateScrollY = () => setScrollY(window.pageYOffset);
    // when a new row expands, access create the references for scrolling
    (0, react_1.useEffect)(() => {
        setRowRefs((rowRefs) => datasource.map((_, i) => rowRefs[i] || (0, react_1.createRef)()));
    }, [datasource]);
    (0, react_1.useEffect)(() => {
        if (infinityScrollConfig) {
            if ((tableRef === null || tableRef === void 0 ? void 0 : tableRef.current) && tableRef.current.getBoundingClientRect().bottom < scrollY) {
                setInfinityScrollEnd(infinityScrollEnd + infinityScrollConfig.gap);
            }
        }
    }, [infinityScrollConfig, infinityScrollEnd, scrollY]);
    (0, react_1.useEffect)(() => {
        if (infinityScrollConfig) {
            const listenScroll = () => {
                window.addEventListener('scroll', updateScrollY);
            };
            listenScroll();
            return () => {
                window.removeEventListener('scroll', updateScrollY);
            };
        }
    }, []);
    const shouldExpandRow = (jsonRef) => jsonRef !== null && jsonRef !== void 0 ? jsonRef : (expandedRow === jsonRef && expandConfig !== undefined);
    const expandedContent = (element) => {
        if (!expandConfig) {
            return;
        }
        if (element[expandConfig.datasourceIndex] === undefined ||
            element[expandConfig.datasourceIndex].length === 0) {
            return react_1.default.createElement("p", null, "No content");
        }
        else {
            return (react_1.default.createElement("div", null,
                react_1.default.createElement("div", null,
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("div", { onClick: () => setExpandedRow(null) },
                            react_1.default.createElement(IconX_1.default, { height: 10, width: 10 })),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("p", null, expandConfig.datasourceIndex))),
                    react_1.default.createElement(Table, { columns: columns, datasource: [element] }),
                    react_1.default.createElement(Table, { columns: expandConfig.columns, isScrollable: expandConfig.isScrollable, datasource: element[expandConfig.datasourceIndex], expandConfig: expandConfig.expandConfig, nested: true }))));
        }
    };
    const generateColumns = (element, i) => {
        return columns.map((column, i) => {
            return (react_1.default.createElement(Column, { style: column.style, width: column.width, expander: column.expander, key: column.key, onClick: () => {
                    if (column.onClick !== undefined) {
                        column.onClick(element);
                    }
                    if (column.expander && getRefKey(i)) {
                        if (expandedRow === getRefKey(i)) {
                            setExpandedRow(null);
                        }
                        else {
                            if (isScrollable && rowRefs[i]) {
                                (0, scroll_1.scrollToCurrent)(rowRefs[i]);
                            }
                            setExpandedRow(getRefKey(i));
                        }
                    }
                } }, column.component(column.index !== undefined
                ? element[column.index]
                : element)));
        });
    };
    const generateRows = () => {
        let elements = datasource;
        if (elements === undefined) {
            return;
        }
        if (infinityScrollConfig) {
            elements = elements.slice(0, infinityScrollEnd + infinityScrollConfig.gap);
        }
        return elements.map((element, i) => {
            return (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(Row, { key: i, ref: rowRefs[i], expanded: isExpanded(i) }, generateColumns(element, i)),
                isExpanded(i) && expandedContent(element)));
        });
    };
    const generateHeader = () => {
        return (react_1.default.createElement(Row, null, columns.map((column, i) => {
            return (react_1.default.createElement(HeaderColumn, { key: i, width: column.width },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("label", null, column.headerText))));
        })));
    };
    return (react_1.default.createElement(TableContainer, { isScrollable: isScrollable, ref: () => tableRef, nested: nested },
        generateHeader(),
        generateRows()));
}
exports.default = Table;
//# sourceMappingURL=Table.js.map