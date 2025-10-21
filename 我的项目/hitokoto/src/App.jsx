import { useEffect, useState } from 'react'
import Favorites from './Favorites'
import { useLocalStorage } from './useLocalStorage.jsx'
import './index.css'

const STORAGE_KEY = 'hitokotoFavorites'

function getKey(item) {
  if (!item) { return (null) }
  return (item.id ?? null)
}

export default function App() {
  const [hitokoto, setHitokoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEY, [])
  const [showFavorites, setShowFavorites] = useState(false)

  async function fetchHitokoto() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('https://v1.hitokoto.cn/')
      /*{
        "id": 1234,
        "hitokoto": "一言内容",
        "type": "类型",
        "from": "出处",
        "from_who": "作者",
        "creator": "添加者",
        "created_at": "创建时间"
      }*/
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

  function isFavorited(item) {
    if (!item) { return (false) }
    const k = getKey(item)
    if (!k) { return (false) }
    return (favorites.some(f => getKey(f) === k))
  }

  function addFavorite(item) {
    if (!item) { return }
    const localId = item.id
    const toSave = { ...item, _localId: localId, savedAt: Date.now() }
    setFavorites([toSave, ...favorites])
  }

  function removeFavorite(Id) {
    if (!Id) { return }
    setFavorites(prev => prev.filter(f => (f.id) !== Id))
  }

  function toggleFavorite() {
    if (!hitokoto) { return }
    const k = getKey(hitokoto)
    const already = isFavorited(hitokoto)
    if (already) {
      // 找到对应收藏项的本地 id 并删除
      const found = favorites.find(f => {
        return ((f.id) === k || (f.hitokoto && hitokoto.hitokoto && f.hitokoto === hitokoto.hitokoto))
      })
      if (found) { removeFavorite(found.id) }
    } else {
      addFavorite(hitokoto)
    }
  }

  function openFavorite(item) {
    // 在主区域显示被点开的收藏项
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

            {error && <p className="error justify-center w-full flex">获取失败：{error}</p>}

            {!loading && !error && hitokoto && (
              <>
                <div className="hitokoto justify-center w-full flex mt-10">「{hitokoto.hitokoto}」</div>
                <div className="meta text-right mt-10 mr-30">
                  — {hitokoto.from_who ? `${hitokoto.from_who} · ${hitokoto.from}` : (hitokoto.from || '未知来源')}
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
            disabled={loading || !hitokoto}
            className={`fav ${isFavorited(hitokoto) ? 'active' : ''}`}
            style={{ marginLeft: 8 }}
            >
              {isFavorited(hitokoto) ? '已收藏' : '收藏'}
            </button>
          </div>
        </div>
      </div>

      <div className="sidebar fixed right-4 top-4">
        <div className="drawer bg-slate-950/80 backdrop-blur rounded-lg shadow-lg p-3 w-[min(92vw,28rem)] max-h-[80vh] overflow-auto border border-slate-900">
          <div className="sidebar-header flex items-center justify-between gap-3">
            <div className="text-sky-400/80 text-sm">收藏</div>
            <button
              className="toggle-fav rounded-md text-sky-300 p-1 text-sm"
              onClick={toggleFavoritesPanel}
              aria-expanded={showFavorites}
              aria-controls="favorites-panel"
              title={showFavorites ? '收起收藏' : '展开收藏'}
            >
              {showFavorites ? '收起' : '展开'}
            </button>
          </div>

          <Favorites
            id="favorites-panel"
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