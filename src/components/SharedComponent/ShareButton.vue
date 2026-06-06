<template>
  <div>
    <!-- Trigger button -->
    <button class="yt-btn" @click="open = true">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
      Share
    </button>

    <!-- Overlay -->
    <Teleport to="body">
      <div v-if="open" class="share-overlay" @click="open = false" />

      <div v-if="open" class="share-popup">
        <!-- Header -->
        <div class="popup-header">
          <h3>Share</h3>
          <button class="close-btn" @click="open = false" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- Social icons -->
        <div class="social-row">
          <button
            v-for="s in socials"
            :key="s.name"
            class="social-item"
            @click="shareTo(s)"
          >
            <div class="social-icon" :style="{ background: s.bg }">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" v-html="s.icon" />
            </div>
            <span>{{ s.name }}</span>
          </button>
        </div>

        <!-- Mode toggle -->
        <div class="mode-row">
          <button :class="['mode-btn', { active: mode === 'link' }]" @click="mode = 'link'">Link</button>
          <button :class="['mode-btn', { active: mode === 'embed' }]" @click="mode = 'embed'">Embed</button>
        </div>

        <!-- Start at -->
        <div class="start-at-row">
          <label class="start-at-label">
            <input type="checkbox" v-model="startAtEnabled" />
            Start at
          </label>
          <input
            class="start-at-input"
            v-model="startAt"
            :disabled="!startAtEnabled"
            placeholder="0:00"
          />
        </div>

        <!-- Embed code preview -->
        <div v-if="mode === 'embed'" class="embed-box">{{ embedCode }}</div>

        <!-- Copy row -->
        <div class="copy-row">
          <input class="copy-input" :value="shareUrl" readonly />
          <button :class="['copy-btn', { copied }]" @click="copyLink">
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ─── Props ────────────────────────────────────────────────────────────────────
const props = defineProps({
  /** URL đầy đủ của video, ví dụ: https://youtu.be/abc123 */
  url: {
    type: String,
    default: 'https://youtu.be/dQw4w9WgXcQ',
  },
})

// ─── State ────────────────────────────────────────────────────────────────────
const open = ref(false)
const copied = ref(false)
const mode = ref('link')          // 'link' | 'embed'
const startAtEnabled = ref(false)
const startAt = ref('0:00')

// ─── Computed ─────────────────────────────────────────────────────────────────
const shareUrl = computed(() => {
  if (!startAtEnabled.value || !startAt.value) return props.url

  const parts = startAt.value.split(':').map(Number)
  const seconds = parts.length === 2
    ? parts[0] * 60 + parts[1]
    : parts[0]

  return `${props.url}?t=${seconds}`
})

const embedCode = computed(() => {
  const src = shareUrl.value
    .replace('youtu.be/', 'www.youtube.com/embed/')
    .replace('watch?v=', 'embed/')
  return `<iframe width="560" height="315" src="${src}" frameborder="0" allowfullscreen></iframe>`
})

// ─── Methods ──────────────────────────────────────────────────────────────────
const copyLink = async () => {
  try {
    const text = mode.value === 'embed' ? embedCode.value : shareUrl.value
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // fallback: select input
  }
}

const shareTo = (social) => {
  const encoded = encodeURIComponent(shareUrl.value)
  const urls = {
    WhatsApp: `https://wa.me/?text=${encoded}`,
    Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    'Twitter/X': `https://twitter.com/intent/tweet?url=${encoded}`,
    Email: `mailto:?body=${encoded}`,
    Telegram: `https://t.me/share/url?url=${encoded}`,
    Reddit: `https://reddit.com/submit?url=${encoded}`,
  }
  if (urls[social.name]) window.open(urls[social.name], '_blank')
}

// ─── Social list ──────────────────────────────────────────────────────────────
const socials = [
  {
    name: 'WhatsApp',
    bg: '#25D366',
    icon: `<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="white"/><path d="M11.5 2C6.275 2 2 6.275 2 11.5c0 1.67.45 3.233 1.237 4.582L2 22l6.12-1.22A9.452 9.452 0 0 0 11.5 21C16.725 21 21 16.725 21 11.5S16.725 2 11.5 2z" stroke="white" stroke-width="1.5"/>`,
  },
  {
    name: 'Facebook',
    bg: '#1877F2',
    icon: `<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="white" stroke-width="1.5" fill="none"/>`,
  },
  {
    name: 'Twitter/X',
    bg: '#000',
    icon: `<path d="M4 4l16 16M4 20L20 4" stroke="white" stroke-width="2"/>`,
  },
  {
    name: 'Email',
    bg: '#EA4335',
    icon: `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="white" stroke-width="1.5" fill="none"/><polyline points="22,6 12,13 2,6" stroke="white" stroke-width="1.5" fill="none"/>`,
  },
  {
    name: 'Telegram',
    bg: '#2CA5E0',
    icon: `<line x1="22" y1="2" x2="11" y2="13" stroke="white" stroke-width="1.5"/><polygon points="22 2 15 22 11 13 2 9 22 2" stroke="white" stroke-width="1.5" fill="none"/>`,
  },
  {
    name: 'Reddit',
    bg: '#FF4500',
    icon: `<circle cx="12" cy="12" r="10" stroke="white" stroke-width="1.5" fill="none"/><circle cx="8.5" cy="13" r="1" fill="white"/><circle cx="15.5" cy="13" r="1" fill="white"/><path d="M9 16c1 1 5 1 6 0" stroke="white" stroke-width="1.2" stroke-linecap="round" fill="none"/>`,
  },
]
</script>

<style scoped>
/* ── Trigger button ── */
.yt-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #272727;
  border: none;
  border-radius: 18px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.15s;
  font-family: inherit;
}
.yt-btn:hover { background: #3a3a3a; }

/* ── Overlay ── */
.share-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  animation: fadeIn 0.15s ease;
}

/* ── Popup ── */
.share-popup {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #282828;
  border-radius: 12px;
  width: 448px;
  max-width: calc(100vw - 2rem);
  z-index: 1000;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.7);
  overflow: hidden;
  animation: popIn 0.18s ease;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  border-bottom: 1px solid #3a3a3a;
}
.popup-header h3 { color: #fff; font-size: 15px; font-weight: 600; margin: 0; }

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #aaa;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.close-btn:hover { background: #3a3a3a; color: #fff; }

/* ── Social row ── */
.social-row {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  overflow-x: auto;
  scrollbar-width: none;
}
.social-row::-webkit-scrollbar { display: none; }

.social-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  min-width: 60px;
  padding: 0;
}
.social-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.12s, filter 0.12s;
}
.social-item:hover .social-icon { transform: scale(1.08); filter: brightness(1.15); }
.social-item span { color: #aaa; font-size: 11px; white-space: nowrap; }

/* ── Mode toggle ── */
.mode-row {
  display: flex;
  gap: 8px;
  padding: 0 20px 14px;
}
.mode-btn {
  background: none;
  border: 1px solid #444;
  border-radius: 20px;
  color: #fff;
  font-size: 12px;
  padding: 4px 14px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  font-family: inherit;
}
.mode-btn:hover { border-color: #aaa; }
.mode-btn.active { background: #fff; color: #000; border-color: #fff; }

/* ── Start at ── */
.start-at-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px 14px;
}
.start-at-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #aaa;
  font-size: 13px;
  cursor: pointer;
}
.start-at-input {
  background: #3a3a3a;
  border: 1px solid #555;
  border-radius: 6px;
  color: #fff;
  font-size: 13px;
  padding: 4px 8px;
  width: 72px;
  outline: none;
  font-family: inherit;
}
.start-at-input:focus { border-color: #aaa; }
.start-at-input:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Embed box ── */
.embed-box {
  margin: 0 20px 14px;
  background: #1a1a1a;
  border-radius: 8px;
  padding: 10px 12px;
  color: #aaa;
  font-size: 11px;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
  border: 1px solid #3a3a3a;
  max-height: 80px;
  overflow-y: auto;
}

/* ── Copy row ── */
.copy-row {
  display: flex;
  padding: 0 20px 20px;
}
.copy-input {
  flex: 1;
  background: #3a3a3a;
  border: 1px solid #444;
  border-right: none;
  border-radius: 8px 0 0 8px;
  color: #fff;
  font-size: 13px;
  padding: 8px 12px;
  outline: none;
  font-family: inherit;
  min-width: 0;
}
.copy-btn {
  background: #fff;
  border: none;
  border-radius: 0 8px 8px 0;
  color: #000;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 18px;
  cursor: pointer;
  transition: background 0.15s;
  font-family: inherit;
  white-space: nowrap;
}
.copy-btn:hover { background: #e8e8e8; }
.copy-btn.copied { background: #3ea96b; color: #fff; }

/* ── Animations ── */
@keyframes fadeIn {
  from { opacity: 0; } to { opacity: 1; }
}
@keyframes popIn {
  from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
</style>
