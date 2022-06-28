  
  export const scrollToCurrent = (ref: React.MutableRefObject<HTMLDivElement>, offset = -140, ms = 80) => {
    setTimeout(() => {
      window.scroll({
        top: ref.current.getBoundingClientRect().top + window.pageYOffset + offset,
        behavior: 'smooth',
        //nearest: 'block'
      })
    }, ms)
  }