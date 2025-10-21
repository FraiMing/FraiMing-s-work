import { useEffect, useState } from 'react'
import Favorites from './Favorites'
import useLocalStorage from './useLocalStorage.jsx'
import './index.css'

//命名由ai规范过一遍，方便读懂（原命名一坨）
export default function App() {
  const storageKey = 'hitokotoFavoritesV1'
  const [hitokoto, setHitokoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useLocalStorage(storageKey, [])
  const [showFavorites, setShowFavorites] = useState(false)

  async function fetchHitokoto() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('https://v1.hitokoto.cn/')
      //{"id","uuid","hitokoto","type","from","from_who","creator","creator_uid","reviewer","commit_from","created_at","length"}
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setHitokoto(data)
    } catch (e) {
      setError(e.message)
      setHitokoto(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHitokoto()
  }, [])

  function getKey(item) {
  if (!item) { return (null) }
  return (item.id)
}

  function isFavorited(item) {
    if (!item) { return (false) }
    const k = getKey(item)
    if (!k) { return (false) }
    return (favorites.some(f => getKey(f) === k))
  }

  function addFavorite(item) {
    if (!item) { return }
    setFavorites([item, ...favorites])
  }

  function removeFavorite(ID) {
    if (!ID) { return }
    setFavorites(prev => prev.filter(f => (f.id) !== ID))
  }

  function toggleFavorite() {
    if (!hitokoto) { return }
    const k = getKey(hitokoto)
    const already = isFavorited(hitokoto)
    if (already) { removeFavorite(k)
    } else {
      addFavorite(hitokoto)
    }
  }

  function openFavorite(item) {
    setHitokoto(item)
  }

  function toggleFavoritesPanel() {
    setShowFavorites(prev => !prev)
  }

  return (
    <div className="background bg-gray-950 min-h-screen grid place-items-center">
      <div className='text-sky-500 text-xl font-momo fixed top-4 left-10'>一言（Hitokoto）</div>
      <div className="w-full px-4">
        <div className="main bg-slate-950 rounded-lg w-full shadow-lg mx-auto max-h-[calc(100vh-6rem)] overflow-auto">
          <div className="card text-sky-300 p-10 text-2xl">
            {loading && <p className="muted justify-center w-full flex">加载中…</p>}

            {error && <p className="justify-center w-full flex">获取失败：{error}</p>}

            {!loading && !error && hitokoto && (
              <>
                <div className="hitokoto justify-center w-full flex mt-10">「{hitokoto.hitokoto}」</div>
                <div className="meta text-right mt-10 mr-30">
                  — {hitokoto.from_who && hitokoto.from ? `${hitokoto.from_who} · ${hitokoto.from}` : hitokoto.from_who || hitokoto.from || '未知来源'}
                </div>
              </>
            )}
          </div>

          <div className="actions text-violet-500 w-full flex justify-between p-10">
            <button onClick={fetchHitokoto} disabled={loading}>
              刷新
            </button>
            <button
            onClick={toggleFavorite}
            disabled={loading}
            >
              {isFavorited(hitokoto) ? '已收藏' : '收藏'}
            </button>
          </div>
        </div>
      </div>

      <div className="sidebar fixed right-4 top-4">
        <div className={`drawer bg-slate-950/80 backdrop-blur rounded-lg shadow-lg p-3 w-[min(92vw,28rem)] max-h-[80vh] overflow-auto border ${showFavorites ? 'border-slate-900' : 'border-slate-950'}`}>
          <div className="sidebar-header flex items-center justify-between gap-3">
            <div className="text-sky-400/80 text-sm">收藏</div>
            <button
              className="rounded-md text-violet-500 p-1 text-sm"
              onClick={toggleFavoritesPanel}
              aria-controls="favoritesPanel"
            >
              {showFavorites ? '收起' : '展开'}
            </button>
          </div>

          <Favorites
            id="favoritesPanel"
            isOpen={showFavorites}
            favorites={favorites}
            onRemove={(Id) => removeFavorite(Id)}
            onOpen={openFavorite}
            onClear={() => setFavorites([])}
          />
        </div>
      </div>
    </div>
  )
}