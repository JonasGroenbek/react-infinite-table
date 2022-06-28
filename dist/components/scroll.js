"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrollToCurrent = void 0;
const scrollToCurrent = (ref, offset = -140, ms = 80) => {
    setTimeout(() => {
        window.scroll({
            top: ref.current.getBoundingClientRect().top + window.pageYOffset + offset,
            behavior: 'smooth',
            //nearest: 'block'
        });
    }, ms);
};
exports.scrollToCurrent = scrollToCurrent;
//# sourceMappingURL=scroll.js.map