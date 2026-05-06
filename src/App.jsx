import { useRef, useState, useEffect, useCallback } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  AnimatePresence,
  animate,
} from 'framer-motion'
import './index.css'

const EASE = [0.16, 1, 0.3, 1]       // expo-out: snel start, zacht einde
const EASE_OUT = [0.16, 1, 0.3, 1]
const SPRING = { type: 'spring', stiffness: 72, damping: 18 }

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconHart({ color = 'var(--accent)' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <path d="M11 19s-8-5.5-8-11a5 5 0 0 1 8-4A5 5 0 0 1 19 8c0 5.5-8 11-8 11Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}
function IconGrafiek({ color = 'var(--accent)' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <path d="M3 17 L7 11 L11 13 L15 7 L19 9" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 20h16" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
function IconStructuur({ color = 'var(--accent)' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <rect x="3" y="3" width="6" height="6" rx="1.5" stroke={color} strokeWidth="1.6" />
      <rect x="13" y="3" width="6" height="6" rx="1.5" stroke={color} strokeWidth="1.6" />
      <rect x="3" y="13" width="6" height="6" rx="1.5" stroke={color} strokeWidth="1.6" />
      <rect x="13" y="13" width="6" height="6" rx="1.5" stroke={color} strokeWidth="1.6" />
    </svg>
  )
}
function IconTijd({ color = 'var(--accent)' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="1.6" />
      <path d="M11 7v4l3 2" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Custom Cursor ─────────────────────────────────────────────────────────────

function Cursor() {
  const mx = useMotionValue(-100)
  const my = useMotionValue(-100)
  const [hov, setHov] = useState(false)

  const sdx = useSpring(mx, { stiffness: 900, damping: 45 })
  const sdy = useSpring(my, { stiffness: 900, damping: 45 })
  const rlx = useSpring(mx, { stiffness: 160, damping: 28 })
  const rly = useSpring(my, { stiffness: 160, damping: 28 })

  const dotX = useTransform(sdx, v => v - 3)
  const dotY = useTransform(sdy, v => v - 3)
  const ringX = useTransform(rlx, v => v - 17)
  const ringY = useTransform(rly, v => v - 17)

  useEffect(() => {
    const onMove = (e) => { mx.set(e.clientX); my.set(e.clientY) }
    const onOver = (e) => setHov(!!e.target.closest('a, button, [data-hover]'))
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [])

  return (
    <>
      <motion.div className="cursor-dot" style={{ x: dotX, y: dotY, scale: hov ? 0 : 1 }} />
      <motion.div className="cursor-ring" style={{ x: ringX, y: ringY, scale: hov ? 1.9 : 1, opacity: hov ? 0.9 : 0.6 }} />
    </>
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })
  return (
    <motion.div style={{
      scaleX,
      position: 'fixed', top: 0, left: 0, right: 0,
      height: 2,
      background: 'linear-gradient(90deg, var(--accent), #5BAA8A)',
      transformOrigin: '0%',
      zIndex: 1001,
    }} />
  )
}

// ─── Navigation ───────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Over mij', href: '#over' },
  { label: 'Diensten', href: '#diensten' },
  { label: 'Ervaring', href: '#ervaring' },
  { label: 'Aanpak', href: '#aanpak' },
]

function Nav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => scrollY.on('change', v => setScrolled(v > 50)), [scrollY])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
        background: scrolled ? 'rgba(248,246,241,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(18px) saturate(180%)' : 'none',
        boxShadow: scrolled ? '0 1px 0 rgba(26,43,56,0.07)' : 'none',
        transition: 'background 0.5s, backdrop-filter 0.5s, box-shadow 0.5s',
      }}
    >
      <nav style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 2.5rem',
        height: 74, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="#" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: 1 }} data-hover>
          <span style={{ fontFamily: 'Fraunces', fontSize: '1.35rem', color: 'var(--dark)', letterSpacing: '-0.02em' }}>MSFS</span>
          <span style={{ fontSize: '0.58rem', color: 'var(--accent)', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, marginTop: 2 }}>Monique Smeding</span>
          <span style={{ fontSize: '0.52rem', color: 'var(--mid)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginTop: 1, opacity: 0.7 }}>Financieel Specialist</span>
        </a>

        <ul className="nav-links" style={{ display: 'flex', gap: '2.5rem', listStyle: 'none', alignItems: 'center' }}>
          {NAV_LINKS.map(({ label, href }, i) => (
            <li key={href}>
              <motion.a
                href={href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: EASE }}
                className="nav-link"
                style={{ color: 'var(--mid)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}
                data-hover
              >
                {label}
              </motion.a>
            </li>
          ))}
          <li>
            <motion.a
              href="#contact"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.72, duration: 0.5, ease: EASE }}
              style={{
                background: 'var(--dark)', color: '#fff',
                textDecoration: 'none', padding: '0.55rem 1.5rem',
                borderRadius: 100, fontSize: '0.82rem', fontWeight: 500,
                display: 'inline-block',
              }}
              whileHover={{ background: 'var(--accent)', scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING}
              data-hover
            >
              Contact
            </motion.a>
          </li>
        </ul>

        <motion.button
          className="hamburger"
          onClick={() => setMobileOpen(o => !o)}
          style={{ background: 'none', border: 'none', padding: 8, display: 'none', color: 'var(--dark)' }}
          whileTap={{ scale: 0.9 }}
          data-hover
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {mobileOpen
              ? <><path d="M5 5L19 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M19 5L5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></>
              : <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            }
          </svg>
        </motion.button>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
              animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
              exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              style={{
                position: 'fixed', top: 74, left: 0, right: 0,
                background: 'rgba(248,246,241,0.97)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: '1px solid var(--border)',
                padding: '2rem 2.5rem 2.5rem',
                display: 'flex', flexDirection: 'column', gap: '1.5rem',
              }}
            >
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.a
                  key={href} href={href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, ease: EASE }}
                  style={{ color: 'var(--dark)', textDecoration: 'none', fontSize: '1.5rem', fontFamily: 'Fraunces', fontWeight: 400 }}
                >
                  {label}
                </motion.a>
              ))}
              <a
                href="#contact" onClick={() => setMobileOpen(false)}
                style={{ background: 'var(--accent)', color: '#fff', padding: '0.85rem 1.5rem', borderRadius: 100, fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', textAlign: 'center', marginTop: '0.5rem' }}
              >
                Contact
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}

// ─── Magnetic Button ───────────────────────────────────────────────────────────

function MagneticBtn({ children, href, dark }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 22 })
  const sy = useSpring(y, { stiffness: 220, damping: 22 })

  const track = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.28)
    y.set((e.clientY - r.top - r.height / 2) * 0.28)
  }
  const reset = () => { x.set(0); y.set(0) }

  return (
    <motion.a
      ref={ref} href={href}
      onMouseMove={track} onMouseLeave={reset}
      style={{
        x: sx, y: sy,
        background: dark ? 'var(--dark)' : 'transparent',
        color: dark ? '#fff' : 'var(--dark)',
        border: dark ? 'none' : '1.5px solid var(--border)',
        textDecoration: 'none',
        padding: '0.9rem 2.2rem',
        borderRadius: 100,
        fontSize: '0.88rem', fontWeight: 600,
        display: 'inline-block', letterSpacing: '0.01em',
      }}
      whileHover={{ scale: 1.06, ...(dark ? { background: 'var(--accent)' } : { borderColor: 'var(--dark)' }) }}
      whileTap={{ scale: 0.96 }}
      transition={SPRING}
      data-hover
    >
      {children}
    </motion.a>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

// ─── Scroll indicator (verbergt zodra gebruiker scrollt) ──────────────────────

function ScrollIndicator() {
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    return scrollY.on('change', v => setVisible(v < 30))
  }, [scrollY])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: visible ? 2.2 : 0 }}
          style={{
            position: 'absolute', bottom: '2.5rem', left: '2.5rem',
            display: 'flex', alignItems: 'center', gap: '0.8rem',
            pointerEvents: 'none',
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, var(--accent), transparent)' }}
          />
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--mid)', opacity: 0.5 }}>Scroll</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── LinkedIn floating button ─────────────────────────────────────────────────

function LinkedInButton() {
  const { scrollY } = useScroll()
  const [show, setShow] = useState(false)

  useEffect(() => {
    return scrollY.on('change', v => setShow(v > 120))
  }, [scrollY])

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="https://www.linkedin.com/in/moniquesmeding"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          whileHover={{ scale: 1.06, y: -3 }}
          whileTap={{ scale: 0.97 }}
          data-hover
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 400,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: 100,
            padding: '0.65rem 1.2rem 0.65rem 0.8rem',
            boxShadow: '0 8px 32px rgba(26,43,56,0.12), 0 2px 8px rgba(26,43,56,0.06)',
            textDecoration: 'none',
            color: 'var(--dark)',
          }}
        >
          {/* LinkedIn logo */}
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: '#0A66C2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--dark)', lineHeight: 1.1, letterSpacing: '-0.01em' }}>Monique Smeding</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--mid)', letterSpacing: '0.04em' }}>LinkedIn profiel</div>
          </div>
        </motion.a>
      )}
    </AnimatePresence>
  )
}

function HeroCard({ sx, sy }) {
  const cx = useTransform(sx, v => v * -0.45)
  const cy = useTransform(sy, v => v * -0.3)

  return (
    <motion.div
      style={{ x: cx, y: cy, width: 420, position: 'relative' }}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.1, ease: EASE, delay: 0.5 }}
    >
      {/* Main card */}
      <div style={{
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 40px 80px rgba(26,43,56,0.13), 0 0 0 1px rgba(26,43,56,0.05)',
        padding: '2rem 2rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--accent), transparent)' }} />

        <svg viewBox="0 0 380 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
          {[55, 115, 175, 230].map((yv, i) => (
            <motion.line key={yv} x1="30" y1={yv} x2="360" y2={yv}
              stroke="#E4E1D9" strokeWidth="1" strokeDasharray="4 4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.0 + i * 0.07 }}
            />
          ))}
          <motion.path
            d="M 50 230 C 90 210, 120 160, 160 138 S 230 98, 278 74 S 340 50, 360 44 L 360 250 L 50 250 Z"
            fill="var(--accent)" fillOpacity="0.07"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.9 }}
          />
          <motion.path
            d="M 50 230 C 90 210, 120 160, 160 138 S 230 98, 278 74 S 340 50, 360 44"
            stroke="var(--accent)" strokeWidth="2.5" fill="none" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.2, ease: EASE, delay: 1.0 }}
          />
          {[[160, 138], [230, 98], [302, 62]].map(([cx2, cy2], i) => (
            <motion.circle key={i} cx={cx2} cy={cy2} r={5}
              fill="#fff" stroke="var(--accent)" strokeWidth="2"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 1.8 + i * 0.15 }}
            />
          ))}
          {['Q1', 'Q2', 'Q3', 'Q4'].map((q, i) => (
            <motion.text key={q} x={72 + i * 88} y={268}
              fill="#6B7E8A" fontSize="11" textAnchor="middle" fontFamily="Plus Jakarta Sans"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.2 + i * 0.07 }}
            >{q}</motion.text>
          ))}
        </svg>

        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 2.3 }}
          style={{
            position: 'absolute', bottom: '1.6rem', right: '1.6rem',
            background: 'var(--accent)', borderRadius: 12,
            padding: '0.7rem 1.1rem',
          }}
        >
          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Resultaat</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', fontFamily: 'Fraunces', lineHeight: 1 }}>+34%</div>
        </motion.div>
      </div>

      {/* Floating badge top-right */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 2.5 }}
        style={{
          position: 'absolute', top: -22, right: -28,
          background: '#fff', borderRadius: 14,
          padding: '0.85rem 1.1rem',
          boxShadow: '0 12px 40px rgba(26,43,56,0.14)',
          display: 'flex', alignItems: 'center', gap: '0.65rem',
        }}
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M2 10 L5 7 L8 8.5 L12 4" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
        <div>
          <div style={{ fontSize: '0.6rem', color: 'var(--mid)', marginBottom: 1 }}>Inzicht</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--dark)' }}>Helder ✓</div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Hero() {
  const sectionRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const sx = useSpring(mouseX, { stiffness: 90, damping: 22 })
  const sy = useSpring(mouseY, { stiffness: 90, damping: 22 })

  const onMove = useCallback((e) => {
    const r = sectionRef.current?.getBoundingClientRect()
    if (!r) return
    mouseX.set((e.clientX - r.left - r.width / 2) / 45)
    mouseY.set((e.clientY - r.top - r.height / 2) / 45)
  }, [])

  const words1 = ['Grip', 'op', 'cijfers.']
  const words2 = ['Richting', 'voor', 'de', 'organisatie.']

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        padding: '10rem 2.5rem 6rem',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Ambient blobs */}
      {[
        { l: '58%', t: '8%', s: 560, c: 'rgba(43,122,94,0.07)', d: 0.3 },
        { l: '70%', t: '55%', s: 320, c: 'rgba(43,122,94,0.05)', d: 0.6 },
        { l: '-4%', t: '58%', s: 440, c: 'rgba(26,43,56,0.04)', d: 0.9 },
      ].map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: b.d }}
          style={{
            position: 'absolute', left: b.l, top: b.t,
            width: b.s, height: b.s,
            borderRadius: '50%', background: b.c,
            filter: 'blur(70px)', pointerEvents: 'none',
          }}
        />
      ))}

      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr auto', gap: '4rem', alignItems: 'center', position: 'relative' }}>
        <div>
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.7rem', marginBottom: '2.5rem' }}
          >
            <motion.span
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
              style={{ display: 'block', width: 30, height: 1.5, background: 'var(--accent)', transformOrigin: 'left' }}
            />
            <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)' }}>
              Financieel interim advies · MSFS
            </span>
            <motion.span
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
              style={{ display: 'block', width: 30, height: 1.5, background: 'var(--accent)', transformOrigin: 'right' }}
            />
          </motion.div>

          <div style={{ overflow: 'hidden', marginBottom: '0.6rem' }}>
            <h1 style={{ fontSize: 'clamp(3.8rem, 7vw, 7.5rem)', color: 'var(--dark)', letterSpacing: '-0.035em', lineHeight: 1.05 }}>
              {words1.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.85, ease: EASE_OUT, delay: 0.38 + i * 0.1 }}
                  style={{ display: 'inline-block', marginRight: '0.22em' }}
                >
                  {w}
                </motion.span>
              ))}
            </h1>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: 'clamp(3.8rem, 7vw, 7.5rem)', letterSpacing: '-0.035em', lineHeight: 1.05 }}>
              {words2.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.85, ease: EASE_OUT, delay: 0.7 + i * 0.1 }}
                  style={{
                    display: 'inline-block', marginRight: '0.22em',
                    color: i === 0 ? 'var(--accent)' : 'var(--dark)',
                    fontStyle: i === 0 ? 'italic' : 'normal',
                  }}
                >
                  {w}
                </motion.span>
              ))}
            </h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 1.15 }}
            style={{ fontSize: '1.08rem', color: 'var(--mid)', lineHeight: 1.8, maxWidth: 420, marginBottom: '3rem' }}
          >
            Financieel inzicht dat verder gaat dan rapportages — en leidt tot betere keuzes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 1.35 }}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}
          >
            <MagneticBtn href="#diensten" dark>Ontdek het werk ↓</MagneticBtn>
            <MagneticBtn href="#contact" dark>Neem contact op</MagneticBtn>
            <MagneticBtn href="#over" dark>Wie is Monique?</MagneticBtn>
          </motion.div>
        </div>

        <div className="hero-card-wrapper">
          <HeroCard sx={sx} sy={sy} />
        </div>
      </div>

      {/* Scroll indicator — verdwijnt zodra gebruiker scrollt */}
      <ScrollIndicator />

      <style>{`
        @media (max-width: 900px) { .hero-card-wrapper { display: none !important; } }
      `}</style>
    </section>
  )
}

// ─── Marquee ──────────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  'Financieel inzicht', '·', 'Business control', '·', 'Interim management', '·',
  'Procesverbetering', '·', 'Zorg & publieke sector', '·', 'Stuurinformatie', '·',
  'Financieel advies', '·', 'Organisatieontwikkeling', '·',
]

function Marquee() {
  return (
    <div style={{ background: 'var(--dark)', padding: '0.95rem 0', overflow: 'hidden', display: 'flex' }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
        style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', whiteSpace: 'nowrap', width: 'max-content' }}
      >
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span key={i} style={{
            fontSize: item === '·' ? '0.4rem' : '0.72rem',
            fontWeight: item === '·' ? 400 : 600,
            letterSpacing: item === '·' ? 0 : '0.12em',
            textTransform: 'uppercase',
            color: item === '·' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.8)',
            paddingRight: item !== '·' ? 0 : '2.5rem',
          }}>{item}</span>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function Counter({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '80px' })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    const ctrl = animate(0, to, {
      duration: 2.2,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: v => setN(Math.round(v)),
    })
    return () => ctrl.stop()
  }, [inView, to])

  return (
    <span ref={ref} style={{ fontFamily: 'Fraunces', fontSize: 'clamp(2.8rem, 4.5vw, 4rem)', color: 'var(--dark)', letterSpacing: '-0.04em', lineHeight: 1 }}>
      {n}{suffix}
    </span>
  )
}

function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '80px' })

  return (
    <section ref={ref} style={{ padding: '5rem 2.5rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }} className="stats-grid">
        {[
          { to: 15, suffix: '+', label: 'Jaar ervaring in finance & control' },
          { to: 30, suffix: '+', label: 'Organisaties begeleid' },
          { to: 100, suffix: '%', label: 'Betrokkenheid bij elk traject' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.05, ease: EASE, delay: i * 0.18 }}
            style={{
              paddingLeft: '2rem',
              borderLeft: '2px solid var(--border)',
            }}
          >
            <Counter to={s.to} suffix={s.suffix} />
            <p style={{ fontSize: '0.85rem', color: 'var(--mid)', lineHeight: 1.6, marginTop: '0.5rem', maxWidth: 200 }}>{s.label}</p>
          </motion.div>
        ))}
      </div>
      <style>{`@media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  )
}

// ─── Intro banner ─────────────────────────────────────────────────────────────

function IntroBanner() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '80px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const xShift = useTransform(scrollYProgress, [0, 1], ['-2%', '2%'])

  return (
    <section ref={ref} style={{ background: 'var(--dark)', padding: '8rem 2.5rem', overflow: 'hidden' }}>
      <motion.div style={{ x: xShift, maxWidth: 1000, margin: '0 auto' }}>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
          style={{
            fontFamily: 'Fraunces', fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
            color: '#fff', lineHeight: 1.4, fontStyle: 'italic', fontWeight: 300,
            letterSpacing: '-0.01em',
          }}
        >
          "Grip op cijfers is één ding. Weten wat je ermee moet doen is waar het verschil ontstaat."
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
          style={{ width: 48, height: 1.5, background: 'var(--accent)', marginTop: '2rem', transformOrigin: 'left' }}
        />
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: 0.75 }}
          style={{ display: 'block', marginTop: '1.1rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.14em', textTransform: 'uppercase' }}
        >
          — Monique Smeding
        </motion.span>
      </motion.div>
    </section>
  )
}

// ─── Over Monique ─────────────────────────────────────────────────────────────

function OverMonique() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '60px' })

  return (
    <section id="over" style={{ padding: '9rem 2.5rem' }} ref={ref}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '5fr 4fr', gap: '7rem', alignItems: 'start' }} className="over-grid">
        <div>
          <motion.span
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.8rem' }}
          >
            <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--accent)' }} />
            Over mij
          </motion.span>

          <div style={{ overflow: 'hidden' }}>
            <motion.h2
              initial={{ y: '100%' }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.1 }}
              style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4rem)', color: 'var(--dark)', marginBottom: '2.2rem', letterSpacing: '-0.03em', lineHeight: 0.95 }}
            >
              Ik ben Monique<br />
              <em style={{ color: 'var(--accent)' }}>Smeding</em>
            </motion.h2>
          </div>

          {[
            'Financieel specialist en interim adviseur. Ik help organisaties om financiële informatie te vertalen naar heldere inzichten en concrete sturing.',
            'In veel organisaties zijn cijfers volop aanwezig, maar ontbreekt het aan overzicht, duiding of samenhang. Dat is precies waar ik het verschil maak. Ik breng structuur, stel de juiste vragen en zorg dat cijfers gaan werken voor de organisatie — niet andersom.',
            'Vanuit mijn bedrijf MSFS werk ik voor organisaties binnen onder andere zorg en publieke dienstverlening. Ik word vaak ingezet in situaties waar tijdelijke versterking nodig is, processen beter moeten of waar meer grip en rust gewenst is.',
          ].map((p, i) => (
            <motion.p key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.05, ease: EASE, delay: 0.22 + i * 0.14 }}
              style={{ color: 'var(--mid)', lineHeight: 1.9, marginBottom: '1.2rem', fontSize: '1rem' }}
            >
              {p}
            </motion.p>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {[
            { label: 'Zorg & publieke dienstverlening', icon: IconHart, nr: '01' },
            { label: 'Tijdelijke versterking binnen finance', icon: IconTijd, nr: '02' },
            { label: 'Business control & financieel advies', icon: IconGrafiek, nr: '03' },
            { label: 'Structuur in complexe omgevingen', icon: IconStructuur, nr: '04' },
          ].map(({ label, icon: Icon, nr }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, x: 14 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.0, ease: EASE, delay: 0.28 + i * 0.12 }}
              whileHover={{ x: 6 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '1.1rem',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '1.1rem 1.3rem', cursor: 'default',
              }}
              data-hover
            >
              <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon />
              </div>
              <span style={{ fontSize: '0.88rem', color: 'var(--dark)', fontWeight: 500, flex: 1 }}>{label}</span>
              <span style={{ fontSize: '0.62rem', color: 'var(--border)', fontFamily: 'Fraunces' }}>{nr}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 860px) { .over-grid { grid-template-columns: 1fr !important; gap: 3rem !important; } }`}</style>
    </section>
  )
}

// ─── Diensten ─────────────────────────────────────────────────────────────────

const DIENSTEN = [
  { icon: IconTijd, nr: '01', titel: 'Interim Finance & Control', tekst: 'Tijdelijke versterking wanneer capaciteit of specifieke expertise nodig is. Ik stap snel in, maak mij de organisatie eigen en zorg dat het werk doorgaat én verbetert. Denk aan rollen als business controller, financieel adviseur of ondersteuning binnen de financiële functie.' },
  { icon: IconGrafiek, nr: '02', titel: 'Financieel inzicht & sturing', tekst: 'Cijfers zijn pas waardevol als ze richting geven. Ik help bij het opzetten en verbeteren van rapportages, het creëren van overzicht en samenhang, en het vertalen van cijfers naar concrete stuurinformatie. Zodat management en directie beter onderbouwde keuzes kunnen maken.' },
  { icon: IconStructuur, nr: '03', titel: 'Procesverbetering', tekst: 'Efficiënte processen zorgen voor rust, betrouwbaarheid en tijdswinst. Ik analyseer bestaande werkwijzen, breng knelpunten in beeld en help bij het verbeteren en structureren van financiële processen. Praktisch, haalbaar en passend bij de organisatie.' },
  { icon: IconHart, nr: '04', titel: 'Ondersteuning bij verandering', tekst: 'Verandering vraagt om overzicht en duidelijke financiële kaders. Ik ondersteun organisaties bij groei of herinrichting, verandertrajecten en het creëren van grip tijdens dynamische fases. Met aandacht voor zowel de inhoud als de organisatie eromheen.' },
]

function TiltCard({ dienst }) {
  const ref = useRef(null)
  const [hov, setHov] = useState(false)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 220, damping: 22 })
  const sry = useSpring(ry, { stiffness: 220, damping: 22 })

  const track = (e) => {
    const r = ref.current.getBoundingClientRect()
    rx.set(-(((e.clientY - r.top) / r.height) - 0.5) * 14)
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 14)
  }
  const leave = () => { rx.set(0); ry.set(0); setHov(false) }

  return (
    <motion.div
      ref={ref}
      variants={{ hidden: { y: 24, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
      transition={{ duration: 1.1, ease: EASE }}
      onMouseMove={track}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={leave}
      style={{
        rotateX: srx, rotateY: sry,
        transformPerspective: 900, transformStyle: 'preserve-3d',
        background: 'var(--surface)',
        border: `1px solid ${hov ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 18, padding: '2.4rem',
        position: 'relative', overflow: 'hidden',
        cursor: 'default',
        boxShadow: hov ? '0 24px 60px rgba(43,122,94,0.12)' : '0 4px 20px rgba(26,43,56,0.04)',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      data-hover
    >
      <div style={{
        position: 'absolute', bottom: '-0.4rem', right: '1.2rem',
        fontFamily: 'Fraunces', fontSize: '6rem', lineHeight: 1, fontWeight: 400,
        color: hov ? 'var(--accent-light)' : 'var(--border)',
        transition: 'color 0.35s', userSelect: 'none', pointerEvents: 'none',
      }}>
        {dienst.nr}
      </div>

      <motion.div
        animate={hov
          ? { rotate: 8, scale: 1.08, background: 'var(--accent)' }
          : { rotate: 0, scale: 1, background: 'var(--accent-light)' }
        }
        transition={SPRING}
        style={{ width: 52, height: 52, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.7rem' }}
      >
        <dienst.icon color={hov ? '#fff' : 'var(--accent)'} />
      </motion.div>

      <h3 style={{ fontFamily: 'Fraunces', fontSize: '1.3rem', color: 'var(--dark)', marginBottom: '0.9rem', fontWeight: 400, letterSpacing: '-0.01em' }}>
        {dienst.titel}
      </h3>
      <p style={{ fontSize: '0.88rem', color: 'var(--mid)', lineHeight: 1.85, position: 'relative' }}>
        {dienst.tekst}
      </p>
    </motion.div>
  )
}

function Diensten() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '60px' })

  return (
    <section id="diensten" style={{ padding: '9rem 2.5rem', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeader label="Diensten" title="Waar ik bij help" />
        <motion.div
          ref={ref}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.18 } } }}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}
          className="diensten-grid"
        >
          {DIENSTEN.map(d => <TiltCard key={d.titel} dienst={d} />)}
        </motion.div>
      </div>
      <style>{`@media (max-width: 720px) { .diensten-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  )
}

// ─── Ervaring ─────────────────────────────────────────────────────────────────

const CASES = [
  {
    org: 'Stichting Dichterbij',
    sector: 'Gehandicaptenzorg',
    tekst: 'Bijgedragen aan het versterken van financieel inzicht binnen een zorgorganisatie waar veel samenkomt: mens, middelen en maatschappelijke verantwoordelijkheid.',
    nr: '01', kleur: 'var(--accent)',
  },
  {
    org: 'Parkeerservice',
    sector: 'Publieke dienstverlening',
    tekst: 'Structuur aangebracht en financiële processen verbeterd, zodat er beter gestuurd kon worden op resultaten en er meer grip ontstond op de bedrijfsvoering.',
    nr: '02', kleur: '#1A4A6E',
  },
]

function Ervaring() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '60px' })

  return (
    <section id="ervaring" style={{ padding: '9rem 2.5rem', background: 'var(--dark)' }} ref={ref}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeader label="Ervaring" title="Ervaring die werkt in de praktijk" dark />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, ease: EASE, delay: 0.15 }}
          style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', maxWidth: 520, margin: '-1.5rem auto 4rem', lineHeight: 1.85 }}
        >
          In mijn opdrachten werk ik in dynamische en vaak complexe omgevingen.
        </motion.p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }} className="cases-grid">
          {CASES.map((c, i) => (
            <motion.div key={c.org}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.1, ease: EASE, delay: 0.18 + i * 0.18 }}
              whileHover={{ y: -8, boxShadow: '0 32px 64px rgba(0,0,0,0.4)' }}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 18, padding: '3rem',
                position: 'relative', overflow: 'hidden', cursor: 'default',
              }}
              data-hover
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: 3, bottom: 0, background: c.kleur, borderRadius: '18px 0 0 18px' }} />
              <div style={{
                position: 'absolute', top: '0.5rem', right: '1.5rem',
                fontFamily: 'Fraunces', fontSize: '9rem', lineHeight: 1,
                color: 'rgba(255,255,255,0.025)', userSelect: 'none', pointerEvents: 'none',
              }}>{c.nr}</div>

              <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: c.kleur, marginBottom: '0.9rem' }}>
                {c.sector}
              </p>
              <h3 style={{ fontFamily: 'Fraunces', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', color: '#fff', fontWeight: 400, marginBottom: '1.3rem', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
                {c.org}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.42)', lineHeight: 1.9 }}>
                {c.tekst}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 720px) { .cases-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  )
}

// ─── Aanpak ───────────────────────────────────────────────────────────────────

const PIJLERS = [
  { nr: '01', titel: 'Overzicht en rust', tekst: 'Ik breng structuur in complexe situaties. Overzicht is de basis van goede sturing.' },
  { nr: '02', titel: 'Duidelijke stuurinformatie', tekst: 'Geen dikke rapporten, maar heldere inzichten en concrete stappen die direct bruikbaar zijn.' },
  { nr: '03', titel: 'Voortgang en resultaat', tekst: 'Ik werk praktisch en betrokken. Met oog voor de mensen in de organisatie — want daar wordt het verschil gemaakt.' },
]

function Aanpak() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '60px' })

  return (
    <section id="aanpak" style={{ padding: '9rem 2.5rem', background: 'var(--surface)', borderTop: '1px solid var(--border)' }} ref={ref}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeader label="Aanpak" title="Gestructureerd, praktisch en betrokken" />
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          {PIJLERS.map((p, i) => (
            <motion.div key={p.nr}
              initial={{ opacity: 0, x: -14 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.05, ease: EASE, delay: 0.12 + i * 0.18 }}
              style={{
                display: 'grid', gridTemplateColumns: '72px 1fr',
                gap: '2.5rem', padding: '2.8rem 0',
                borderBottom: i < PIJLERS.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <motion.div
                initial={{ scale: 0.6, rotate: -5 }}
                animate={inView ? { scale: 1, rotate: 0 } : {}}
                transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.3 + i * 0.18 }}
                style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: 'var(--accent-light)', border: '1.5px solid var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Fraunces', fontSize: '1.05rem', color: 'var(--accent)', flexShrink: 0,
                }}
              >
                {p.nr}
              </motion.div>
              <div style={{ paddingTop: '0.85rem' }}>
                <h3 style={{ fontFamily: 'Fraunces', fontSize: '1.4rem', color: 'var(--dark)', marginBottom: '0.7rem', fontWeight: 400, letterSpacing: '-0.01em' }}>
                  {p.titel}
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--mid)', lineHeight: 1.88 }}>{p.tekst}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTABanner() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '80px' })

  return (
    <section ref={ref} style={{ padding: '8rem 2.5rem', background: 'var(--accent)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-30%', right: '-8%', width: '55vw', height: '55vw', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.09)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-35%', left: '-6%', width: '42vw', height: '42vw', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.07)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem' }}
        >
          Klaar om te starten?
        </motion.p>
        <div style={{ overflow: 'hidden' }}>
          <motion.h2
            initial={{ y: '100%' }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.85, ease: EASE_OUT, delay: 0.1 }}
            style={{ fontFamily: 'Fraunces', fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', color: '#fff', marginBottom: '1.3rem', letterSpacing: '-0.025em', lineHeight: 1.05 }}
          >
            Op zoek naar tijdelijke versterking of meer grip op je financiële sturing?
          </motion.h2>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.95, ease: EASE, delay: 0.25 }}
          style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.85, marginBottom: '2.8rem', fontSize: '1.05rem' }}
        >
          Ik denk graag met je mee — vrijblijvend en concreet.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.95, ease: EASE, delay: 0.35 }}
        >
          <motion.a
            href="#contact"
            style={{ display: 'inline-block', background: '#fff', color: 'var(--accent)', padding: '1.05rem 2.8rem', borderRadius: 100, fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.01em' }}
            whileHover={{ scale: 1.06, boxShadow: '0 18px 44px rgba(0,0,0,0.22)' }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING}
            data-hover
          >
            Neem contact op →
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '80px' })

  return (
    <section id="contact" style={{ padding: '9rem 2.5rem' }} ref={ref}>
      <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.8rem' }}
        >
          <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--accent)' }} />
          Contact
          <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--accent)' }} />
        </motion.span>

        <div style={{ overflow: 'hidden' }}>
          <motion.h2
            initial={{ y: '100%' }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.08 }}
            style={{ fontFamily: 'Fraunces', fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', color: 'var(--dark)', marginBottom: '1.6rem', letterSpacing: '-0.03em', lineHeight: 1.0 }}
          >
            Laten we<br /><em style={{ color: 'var(--accent)' }}>kennismaken</em>
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.95, ease: EASE, delay: 0.2 }}
          style={{ color: 'var(--mid)', lineHeight: 1.9, marginBottom: '3rem', fontSize: '1.05rem' }}
        >
          Een eerste gesprek is altijd vrijblijvend en concreet.
          Ik reageer zo snel mogelijk.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.95, ease: EASE, delay: 0.3 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}
        >
          <motion.a
            href="mailto:info@msfs.nl"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'var(--dark)', color: '#fff', padding: '0.95rem 2rem', borderRadius: 100, fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.01em' }}
            whileHover={{ background: 'var(--accent)', scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING}
            data-hover
          >
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
              <path d="M2 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M2 5l8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Stuur een e-mail
          </motion.a>
          <motion.a
            href="https://www.linkedin.com/in/moniquesmeding"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'transparent', color: 'var(--dark)', border: '1.5px solid var(--border)', padding: '0.95rem 2rem', borderRadius: 100, fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.01em' }}
            whileHover={{ borderColor: 'var(--accent)', color: 'var(--accent)', scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING}
            data-hover
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.0, ease: EASE, delay: 0.45 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}
        >
          {[
            'Vrijblijvend kennismakingsgesprek',
            'Reactie binnen één werkdag',
            'Altijd concreet advies',
          ].map((l, i) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--mid)' }}>{l}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ background: 'var(--dark)', padding: '5rem 2.5rem 3.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '3rem', marginBottom: '2.5rem', overflow: 'hidden' }}>
          <p style={{ fontFamily: 'Fraunces', fontSize: 'clamp(4rem, 9vw, 9rem)', color: 'rgba(255,255,255,0.04)', lineHeight: 0.85, letterSpacing: '-0.05em', userSelect: 'none', lineHeight: 1 }}>
            MSFS
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', color: '#fff', marginBottom: 6, letterSpacing: '-0.01em' }}>MSFS</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.28)', lineHeight: 1.65 }}>
              Monique Smeding<br />Financieel Specialist
            </div>
          </div>
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            {NAV_LINKS.map(({ label, href }) => (
              <a key={href} href={href}
                style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.25s' }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.75)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
                data-hover
              >
                {label}
              </a>
            ))}
          </div>
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.18)' }}>
            © 2026 MSFS · KvK 12345678
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ label, title, dark }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '80px' })
  const textColor = dark ? '#fff' : 'var(--dark)'

  return (
    <div ref={ref} style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.7rem', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.1rem' }}
      >
        <motion.span
          initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          style={{ display: 'block', width: 22, height: 1.5, background: 'var(--accent)', transformOrigin: 'left' }}
        />
        {label}
        <motion.span
          initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          style={{ display: 'block', width: 22, height: 1.5, background: 'var(--accent)', transformOrigin: 'right' }}
        />
      </motion.span>
      <div style={{ overflow: 'hidden' }}>
        <motion.h2
          initial={{ y: '100%' }}
          animate={inView ? { y: 0 } : {}}
          transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.12 }}
          style={{ fontSize: 'clamp(1.9rem, 3.8vw, 3rem)', color: textColor, letterSpacing: '-0.025em', lineHeight: 1.05 }}
        >
          {title}
        </motion.h2>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function MSFSWebsite() {
  return (
    <>
      <Cursor />
      <ProgressBar />
      <LinkedInButton />
      <Nav />
      <Hero />
      <Marquee />
      <Stats />
      <IntroBanner />
      <OverMonique />
      <Diensten />
      <Ervaring />
      <Aanpak />
      <CTABanner />
      <Contact />
      <Footer />
    </>
  )
}
