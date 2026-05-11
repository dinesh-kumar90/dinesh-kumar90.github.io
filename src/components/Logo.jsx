import { motion } from "framer-motion";

const CYAN = "#8aebff";
const GREEN = "#4ade80";
const VIOLET = "#a78bfa";
const BLUE = "#378ADD";
const ORANGE = "#fb923c";
const PINK = "#f472b6";
const BG_HEX = "#0f2040";

const ease = [0.34, 1.56, 0.64, 1];

function popIn(delay = 0) {
  return {
    initial: { opacity: 0, scale: 0.4, rotate: -20 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    transition: { duration: 0.55, delay, ease },
  };
}

function slideRight(delay = 0) {
  return {
    initial: { opacity: 0, x: -18 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, delay, ease: "easeOut" },
  };
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: "easeOut" },
  };
}

/**
 * DKLogo — animated personal logo for Dinesh Kumar
 *
 * Props:
 *   width   — total rendered width in px (default: 520)
 *   compact — true = header/nav mode: hides pills, ghost code,
 *             dev tags, tagline, underline, brackets (default: false)
 *   height  — optional manual override; auto-computed from mode if omitted
 *
 * Usage:
 *   <Logo />                  // hero / full size
 *   <Logo compact width={200} /> // nav header
 */
export default function Logo({ width = 520, compact = false, height }) {
  const VW = compact ? 320 : 520;
  const VH = compact ? 60  : 220;

  const HCX     = compact ? 30  : 76;
  const HCY     = compact ? 30  : 110;
  const HEX_R   = compact ? 18  : 34;
  const orbitR  = compact ? 24  : 44;
  const pulseR  = compact ? 20  : 36;

  const TEXT_X    = compact ? 62   : 155;
  const DK_Y      = compact ? 37   : 116;
  const DK_SIZE   = compact ? 28   : 52;
  const NAME_Y    = compact ? 53   : 143;
  const NAME_SIZE = compact ? 12    : 14;

  const computedHeight = height ?? (VH * (width / VW));

  // Flat-top hexagon point generator
  const hexPoints = (cx, cy, r) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: compact ? "flex-start" : "center",
        padding: compact ? "0" : "0",
      }}
    >
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width={width}
        height={computedHeight}
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace", overflow: "visible" }}
      >
        {/* Pulse ring */}
        <motion.circle
          cx={HCX} cy={HCY}
          fill="none" stroke={CYAN} strokeWidth={0.8}
          initial={{ r: pulseR, opacity: 0.18 }}
          animate={{ r: [pulseR, pulseR + 5, pulseR], opacity: [0.18, 0.06, 0.18] }}
          transition={{ duration: 3, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Orbit ring */}
        <motion.circle
          cx={HCX} cy={HCY} r={orbitR}
          fill="none" stroke={CYAN} strokeWidth={0.7}
          strokeDasharray="5 4"
          initial={{ pathLength: 0, opacity: 0, rotate: 0 }}
          animate={{ pathLength: 1, opacity: 0.5, rotate: 360 }}
          transition={{
            pathLength: { duration: 0.9, delay: 0.3, ease: "easeOut" },
            opacity:    { duration: 0.9, delay: 0.3 },
            rotate:     { duration: 14, delay: 1.2, repeat: Infinity, ease: "linear" },
          }}
          style={{ originX: `${HCX}px`, originY: `${HCY}px` }}
        />

        {/* Orbiting dot */}
        <motion.g
          style={{ originX: `${HCX}px`, originY: `${HCY}px` }}
          initial={{ rotate: 0, opacity: 0 }}
          animate={{ rotate: 360, opacity: 1 }}
          transition={{
            rotate:  { duration: 9, delay: 1.1, repeat: Infinity, ease: "linear" },
            opacity: { duration: 0.4, delay: 1.1 },
          }}
        >
          <circle cx={HCX} cy={HCY - orbitR} r={compact ? 2.5 : 4} fill={CYAN} opacity={0.9} />
        </motion.g>

        {/* Hexagon */}
        <motion.g
          {...popIn(0.1)}
          animate={{ opacity: 1, scale: 1, rotate: 0, y: [0, compact ? -3 : -5, 0] }}
          transition={{
            opacity: { duration: 0.55, delay: 0.1 },
            scale:   { duration: 0.55, delay: 0.1, ease },
            y:       { duration: 3.5, delay: 1.2, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{ originX: `${HCX}px`, originY: `${HCY}px` }}
        >
          <polygon
            points={hexPoints(HCX, HCY, HEX_R)}
            fill={BG_HEX}
            stroke={CYAN}
            strokeWidth={compact ? 1.4 : 2}
          />
          <text
            x={HCX} y={HCY}
            fontSize={compact ? 10 : 18}
            fontWeight={700} fill={CYAN}
            textAnchor="middle" dominantBaseline="middle"
          >
            {"{ }"}
          </text>
        </motion.g>

        {/* Full-mode only: lambda triangle + diamond */}
        {!compact && (
          <>
            <motion.g {...popIn(0.85)} style={{ originX: "108px", originY: "76px" }}>
              <polygon points="108,68 120,84 96,84" fill="none" stroke={GREEN} strokeWidth={1.5} strokeLinejoin="round" opacity={0.85} />
              <text x={108} y={80} fontSize={8} fill={GREEN} textAnchor="middle" dominantBaseline="middle">λ</text>
            </motion.g>
            <motion.g {...popIn(1.0)} style={{ originX: "44px", originY: "140px" }}>
              <polygon points="44,130 54,140 44,150 34,140" fill="none" stroke={VIOLET} strokeWidth={1.5} strokeLinejoin="round" opacity={0.85} />
            </motion.g>
          </>
        )}

        {/* <dev> tag — full only */}
        {!compact && (
          <motion.text {...fadeUp(0.7)} x={TEXT_X} y={68} fontSize={11} fill={GREEN} opacity={0.7}>
            {"<dev>"}
          </motion.text>
        )}

        {/* DK monogram */}
        <motion.text
          {...popIn(0.9)}
          x={TEXT_X} y={DK_Y}
          fontSize={DK_SIZE} fontWeight={700} fill={CYAN}
          dominantBaseline="auto" letterSpacing={compact ? -1 : -2}
          style={{ originX: `${TEXT_X}px`, originY: `${DK_Y - 16}px` }}
        >
          DK
        </motion.text>

        {/* Underline — full only */}
        {!compact && (
          <motion.line
            x1={155} y1={122} x2={375} y2={122}
            stroke={CYAN} strokeWidth={1.5} opacity={0.4}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 0.7, delay: 1.5, ease: "easeOut" }}
          />
        )}

        {/* Full name */}
        <motion.text
          {...slideRight(compact ? 0.7 : 1.3)}
          x={TEXT_X} y={NAME_Y}
          fontSize={NAME_SIZE} fill="#94a3b8"
          letterSpacing={compact ? 2 : 3}
        >
          DINESH KUMAR
        </motion.text>

        {/* Tagline + cursor + </dev> — full only */}
        {!compact && (
          <>
            <motion.text {...fadeUp(1.7)} x={155} y={165} fontSize={11} fill={GREEN} opacity={0.8}>
              Senior Technical Lead &amp; Architect
            </motion.text>
            <motion.rect
              x={372} y={155} width={7} height={12} fill={GREEN} rx={1}
              initial={{ opacity: 0 }}
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 0.9, delay: 2, repeat: Infinity, ease: "linear", times: [0, 0.45, 0.5, 1] }}
            />
            <motion.text {...fadeUp(0.7)} x={155} y={187} fontSize={11} fill={GREEN} opacity={0.7}>
              {"</dev>"}
            </motion.text>
          </>
        )}

        {/* Ghost code — full only */}
        {!compact && ["const dk = {", "  role: 'lead',", '  stack: "∞"', "}"].map((line, i) => (
          <motion.text key={i} {...fadeUp(0.5 + i * 0.1)} x={410} y={72 + i * 13} fontSize={9.5} fill={CYAN} opacity={0.18}>
            {line}
          </motion.text>
        ))}

        {/* Brackets — full only */}
        {!compact && (
          <>
            <motion.path d="M134 90 L124 90 L124 130 L134 130" fill="none" stroke={CYAN} strokeWidth={1.5} strokeLinecap="round" opacity={0.35}
                         initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.35 }} transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }} />
            <motion.path d="M388 90 L398 90 L398 130 L388 130" fill="none" stroke={CYAN} strokeWidth={1.5} strokeLinecap="round" opacity={0.35}
                         initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.35 }} transition={{ duration: 0.7, delay: 0.65, ease: "easeOut" }} />
          </>
        )}

        {/* Language pills — full only */}
        {!compact && [
          { x: 157, w: 30, label: "TS",    color: BLUE   },
          { x: 194, w: 32, label: "PHP",   color: GREEN  },
          { x: 233, w: 34, label: "AWS",   color: VIOLET },
          { x: 274, w: 30, label: "Go",    color: ORANGE },
          { x: 311, w: 42, label: "React", color: PINK   },
        ].map((pill, i) => (
          <motion.g key={pill.label} {...fadeUp(2.0 + i * 0.07)}>
            <rect x={pill.x} y={196} width={pill.w} height={14} rx={3} fill="none" stroke={pill.color} strokeWidth={0.8} opacity={0.6} />
            <text x={pill.x + pill.w / 2} y={206} fontSize={8} fill={pill.color} textAnchor="middle" opacity={0.8}>{pill.label}</text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
