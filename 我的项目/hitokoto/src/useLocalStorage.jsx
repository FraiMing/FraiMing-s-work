import { useState, useEffect, useRef } from 'react'

export function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return (raw ? JSON.parse(raw) : initialValue)
    } catch (e) {
      console.warn('读取 localStorage 失败', e)
      return (initialValue)
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch (e) {
      console.warn('写入 localStorage 失败', e)
    }
  }, [key, state])

  // 多标签同步（当其他标签修改同一 key，会触发 storage 事件）
  useEffect(() => {
    function onStorage(e) {
      if (e.key !== key) { return }
      try {
        if (e.newValue == null) { setState(initialValue) } else { setState(JSON.parse(e.newValue)) }
      } catch (err) {
        console.warn('解析 storage 事件数据失败', err)
      }
    }
    window.addEventListener('storage', onStorage)
    return (() => window.removeEventListener('storage', onStorage))
  }, [key, initialValue])

  return ([state, setState])
}