import { useMemo, useState } from 'react'

export default function Favorites({ id, isOpen = true, favorites = [], onRemove, onOpen, onClear }) {
  const [query, setQuery] = useState('')

  // 规范化搜索关键字
  const q = query.trim().toLowerCase()

  // 过滤：在 hitokoto 文本、作者(from_who) 和 来源(from) 中进行不区分大小写的包含匹配
  const filtered = useMemo(() => {
    if (!q) { return (favorites) }
    return (favorites.filter(f => {
      const text = [
        f.hitokoto || '',
        f.from_who || '',
        f.from || ''
      ].join(' ').toLowerCase()
      return (text.includes(q))
    }))
  }, [favorites, q])

  return (
    <div id={id} className={`favorites ${isOpen ? '' : 'collapsed'}`}>
      {/* 搜索框 + 计数 */}
      <div className="fav-search-wrap bg-slate-900 rounded-lg m-4 flex-grow px-3 py-2 flex items-center justify-between gap-2">
        <div className="fav-search">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜索收藏（按内容/来源/作者）"
            aria-label="搜索收藏"
            className='w-70 bg-transparent border-none outline-none text-sky-500 text-sm'
          />
          {query && (
            <button className="small text-violet-500" onClick={() => setQuery('')}>清除</button>
          )}
        </div>
      </div>

      {favorites.length === 0 ? (
        <p className="muted text-sky-500">还没有收藏，点「收藏」把喜欢的一言保存到这里。</p>
      ) : (
        <>
          <div className="fav-actions">
            <button onClick={onClear} className="small p-2 text-violet-500">清空全部</button>
          </div>
          <ul className="fav-list">
            {filtered.map((f, idx) => {
              const key = f._localId ?? f.id ?? f.uuid ?? `${idx}-${(f.hitokoto || '').slice(0, 30)}`
              return (
                <li key={key} className="fav-item border-b border-slate-900 last:border-0">
                  <div className="fav-body text-sky-400" onClick={() => onOpen(f)}>
                    <div className="fav-text m-5">「{f.hitokoto}」</div>
                    <div className="fav-meta text-right">——{f.from_who ? `${f.from_who} · ${f.from}` : f.from || '未知'}</div>
                  </div>
                  <div className="fav-tools">
                    <button onClick={() => onRemove(f._localId ?? f.id ?? f.uuid)} className="text-sm danger text-violet-500 m-2">删除</button>
                  </div>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}