import { useState, useEffect, useRef, useCallback } from 'react';
import createUseSpring from 'use-frames/createUseSpring';
import { STIFFNESS, MASS, DAMPING } from 'use-frames/variables';
import getToRAF from 'to-raf';

const toRAF = getToRAF();
const useSpring = createUseSpring(3);

export default function DynamicSimulator() {
    const [_s, setS] = useState(STIFFNESS);
    const [_d, setD] = useState(DAMPING);
    const [_m, setM] = useState(MASS);

    const s = (Number.isNaN(_s) || _s <= 0) ? STIFFNESS : _s;
    const d = (Number.isNaN(_d) || _d < 0) ? DAMPING : _d;
    const m = (Number.isNaN(_m) || _m < 0) ? MASS : _m;

    const [[x, y, z], setXYZ] = useState([0, 0, 0]); // mouse and key q/w

    const [x1, y1, z1, setSpring1] = useSpring(x, y, z);
    const [x2, y2, z2, setSpring2] = useSpring(x1, y1, z1);
    const [x3, y3, z3, setSpring3] = useSpring(x2, y2, z2);

    useEffect(() => {
        setSpring1({ stiffness: s, damping: d, mass: m });
        setSpring2({ stiffness: s, damping: d, mass: m });
        setSpring3({ stiffness: s, damping: d, mass: m });
    }, [s, d, m])

    const b = 3;
    const ref = useRef(null);
    const handleMouseMove = useCallback(e => {
        toRAF(() => {
            if (ref.current) {
                const rec = ref.current.getBoundingClientRect();
                setXYZ(([_, __, _z]) => [
                    Math.min(Math.max(e.clientX - (rec.left + b), 0), rec.right - rec.left - b * 2),
                    Math.min(Math.max(e.clientY - (rec.top + b), 0), rec.bottom - rec.top - b * 3),
                    _z
                ]);
            }
        })
    }, [])

    const handleClick = useCallback(() => {
        setXYZ(([_x, _y, _z]) => [_x, _y, _z + 1]);
    }, [])

    useEffect(() => {
        window.document.addEventListener('keydown', ({ code }) => {
            toRAF(() => {
                // console.log(code);
                if (ref.current) {
                    if (code === 'KeyQ') setXYZ(([_x, _y, _z]) => [_x, _y, _z + 1]);
                    if (code === 'KeyW') setXYZ(([_x, _y, _z]) => [_x, _y, _z - 1]);
                }
            })
        })
    }, [])

    return (
        <>
            <div>
                stiffness: <input value={_s} onChange={({ target: { value: v } }) => setS(v)} /> {s}
            </div>
            <div>
                damping: <input value={_d} onChange={({ target: { value: v } }) => setD(v)} /> {d}
            </div>
            <div>
                mass: <input value={_m} onChange={({ target: { value: v } }) => setM(v)} /> {m}
            </div>
            <div ref={ref} style={{ position: 'relative', width: 500, transform: 'translateX(1rem)' }} onMouseMove={handleMouseMove} onClick={handleClick}>
                <svg style={{ width: 500, height: 500, border: `${b}px solid #aaaaaa`, overflow: 'visible' }}>
                    <circle r={b * 4 * (1 / 1 + Math.abs(z - z1))} cx={x1} cy={y1} fill={`hsl(100, 100%, 50%, ${.5})`} />
                    <circle r={b * 4 * (1 / 1 + Math.abs(z - z2))} cx={x2} cy={y2} fill={`hsl(200, 100%, 50%, ${.5})`} />
                    <circle r={b * 4 * (1 / 1 + Math.abs(z - z3))} cx={x3} cy={y3} fill={`hsl(300, 100%, 50%, ${.5})`} />
                </svg>
            </div>
        </>
    );
}
