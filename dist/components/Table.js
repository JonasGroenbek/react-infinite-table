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
const TableContainer = styled_components_1.default.div ``;
const Row = styled_components_1.default.div `
  ${({ expanded }) => expanded &&
    `
    `};
`;
const Column = styled_components_1.default.div `
   ${({ width }) => `flex-shrink: ${width ? '0' : '1'}`};
   ${({ width }) => width && `flex-basis: ${width}px;`}
   ${({ expander }) => expander && 'cursor: pointer;'}
`;
const HeaderColumn = styled_components_1.default.div `
     ${({ width }) => `flex-shrink: ${width ? '0' : '1'}`};
     ${({ width }) => width && `flex-basis: ${width}px;`}
`;
const Button = styled_components_1.default.button.attrs({
    className: 'myClass'
}) ``;
function Table({ expandConfig, nested, isScrollable, infinityScrollConfig, datasource, columns, }) {
    console.log('in');
    const [expandedRow, setExpandedRow] = (0, react_1.useState)();
    console.log('out');
    const [infinityScrollEnd, setInfinityScrollEnd] = (0, react_1.useState)(infinityScrollConfig ? infinityScrollConfig.gap : 100);
    const [scrollY, setScrollY] = (0, react_1.useState)(0);
    const [rowRefs, setRowRefs] = (0, react_1.useState)([]);
    const tableRef = (0, react_1.useRef)();
    const updateScrollY = () => setScrollY(window.pageYOffset);
    //when a new row expands, access create the references for scrolling
    (0, react_1.useEffect)(() => {
        setRowRefs((rowRefs) => datasource
            .map((_, i) => rowRefs[i] || (0, react_1.createRef)()));
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
    const shouldExpandRow = (id) => expandedRow === id && expandConfig !== undefined;
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
                        react_1.default.createElement("div", { onClick: () => setExpandedRow(undefined) },
                            react_1.default.createElement(IconX_1.default, null)),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("p", null, expandConfig.datasourceIndex))),
                    react_1.default.createElement(Table, { columns: columns, datasource: [element] }),
                    react_1.default.createElement(Table, { columns: expandConfig.columns, isScrollable: expandConfig.isScrollable, datasource: element[expandConfig.datasourceIndex], expandConfig: expandConfig.expandConfig, nested: true }))));
        }
    };
    const generateColumns = (element) => {
        return columns.map((column, i) => {
            return (react_1.default.createElement(Column, Object.assign({}, column.style, { amountOfColumns: columns.length, width: column.width, expander: column.expander, key: column.key, onClick: () => {
                    if (column.onClick !== undefined) {
                        column.onClick(element.id);
                    }
                    if (column.expander) {
                        if (expandedRow === element.id) {
                            setExpandedRow(undefined);
                        }
                        else {
                            if (isScrollable && rowRefs[i]) {
                                (0, scroll_1.scrollToCurrent)(rowRefs[i]);
                            }
                            setExpandedRow(element.id);
                        }
                    }
                } }), column.component(column.index ? element[column.index] : element)));
        });
    };
    //should sort here
    const generateRows = () => {
        let elements = datasource;
        if (elements === undefined) {
            return;
        }
        if (infinityScrollConfig) {
            elements = elements.slice(0, infinityScrollEnd + infinityScrollConfig.gap);
        }
        return elements.map(element => {
            return (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(Row, { ref: () => { var _a; return (_a = rowRefs[element.id]) !== null && _a !== void 0 ? _a : null; }, expanded: expandedRow === element.id, key: element.id }, generateColumns(element)),
                shouldExpandRow(element.id) && expandedContent(element)));
        });
    };
    const generateHeader = () => {
        return (react_1.default.createElement(Row, null, columns.map(column => {
            return (react_1.default.createElement(HeaderColumn, { width: column.width },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("label", null, column.headerText))));
        })));
    };
    return (react_1.default.createElement(TableContainer, { isScrollable: isScrollable, ref: () => tableRef, nested: nested },
        react_1.default.createElement("div", null,
            react_1.default.createElement("div", null,
                generateHeader(),
                generateRows()))));
}
exports.default = Table;
//# sourceMappingURL=Table.js.map