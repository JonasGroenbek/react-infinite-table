export const scrollToCurrent = (
    ref: React.MutableRefObject<HTMLDivElement>,
    //amount of pixels it should offset when scrolling to the element
    offset = -140,
    //the amount of milliseconds it should wait until it starts scrolling
    ms = 80
) => {
    setTimeout(() => {
        window.scroll({
            top: ref.current.getBoundingClientRect().top + window.pageYOffset + offset,
            behavior: 'smooth',
        })
    }, ms)
}
