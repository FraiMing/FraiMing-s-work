import { useMemo, useState } from 'react'

export default function Favorites({ id, isOpen = false, favorites = [], onRemove, onOpen, onClear }) {

  const [query, setQuery] = useState('')

  //ai写的搜索逻辑，能读懂（好高级哦 CwC ）
  const q = query.trim().toLowerCase()

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
    <div className={`favorites ${isOpen ? '' : 'hidden'}`}>
      <div className="fav-search-wrap bg-slate-900 rounded-lg m-4 flex-grow px-3 py-2 flex items-center justify-between">
        <div className="fav-search">
          <input
            onChange={e => setQuery(e.target.value)}
            placeholder="搜索收藏（按内容/来源/作者）"
            className='w-70 bg-transparent border-none outline-none text-sky-500 text-sm'
          />
        </div>
      </div>

      {(<>
          <div>
            <button onClick={onClear} className="p-2 text-violet-500 small">清空全部</button>
          </div>
          <span className="fav-list">
            {filtered.map(f => {
              return (
                <div key={f.id} className="fav-item border-b border-slate-900 last:border-0">
                  <div className="fav-body text-sky-400" onClick={() => onOpen(f)}>
                    <div className="fav-text m-5 text-sky-300">「{f.hitokoto}」</div>
                    <div className="fav-meta text-right text-sky-400">— {f.from_who && f.from ? `${f.from_who} · ${f.from}` : f.from_who || f.from || '未知来源'}</div>
                  </div>
                  <div className="fav-tools">
                    <button onClick={() => onRemove(f.id)} className="text-sm danger text-sky-400/80 m-2">删除</button>
                  </div>
                </div>
              )
            })}
          </span>
        </>
      )}
    </div>
  )
}