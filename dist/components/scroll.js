"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrollToCurrent = void 0;
const scrollToCurrent = (ref, 
//amount of pixels it should offset when scrolling to the element
offset = -140, 
//the amount of milliseconds it should wait until it starts scrolling
ms = 80) => {
    setTimeout(() => {
        window.scroll({
            top: ref.current.getBoundingClientRect().top + window.pageYOffset + offset,
            behavior: 'smooth',
        });
    }, ms);
};
exports.scrollToCurrent = scrollToCurrent;
//# sourceMappingURL=scroll.js.map