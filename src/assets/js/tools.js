export function debounce(fn, wait, immediate) {
  let timeout = null
  return function() {
    const context = this
    const args = [...arguments]
    /* 如果定时器存在，清除上一次的定时器 */
    if (timeout) clearTimeout(timeout)
    /* 如果需要立即执行 */
    if (immediate) {
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      /* 第一次执行callnow为true,后续通过定时器控制 */
      if (callNow) fn.apply(context, args)
    } else {
      timeout = setTimeout(() => {
        fn.apply(context, args)
      }, wait)
    }
  }
}
/* 设定节流算法 */
export function throttle(fn, wait) {
  let timeout
  return function() {
    const context = this
    const args = [...arguments]
    /* 如果定时器不存在，则设定一个定时器，wait时间后执行
        如果定时器存在，则不做处理
        这样在定时器存在的这段事件里，函数只会被调用一次
    */
    if (!timeout) {
      timeout = setTimeout(() => {
        fn.apply(context, args)
      }, wait)
    }
  }
}
