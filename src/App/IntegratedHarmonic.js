// https://en.wikipedia.org/wiki/Simple_harmonic_motion
// https://en.wikipedia.org/wiki/Harmonic_oscillator
// https://en.wikipedia.org/wiki/Damping#Damped_sine_wave
// https://kr.mathworks.com/help/symbolic/physics-damped-harmonic-oscillator.html
// http://hyperphysics.phy-astr.gsu.edu/hbase/oscda.html
// http://farside.ph.utexas.edu/teaching/315/Waves/node10.html

import { useState, useMemo, useCallback } from 'react';
import getRange from 'use-frames/tools/getRange';
import getHarmonic from 'use-frames/explicits/getHarmonic';

function toNum(v, df = 0) {
    return isNaN(v) ? df : Number(v);
}

function arr(n) {
    const a = [];
    for (let i = 0; i < n; i++) {
        a[i] = void 0;
    }
    return a;
}

export default function IntegratedHarmonic({ width = 500, height = 1000, domainLength = 1 }) {
    const cx = 0;
    const rangeLength = domainLength * height / width;
    const cy = rangeLength / 2;
    const lineWidth = domainLength / 200;
    function corX(__x) {
        return cx + __x;
    }
    function corY(__y) {
        return cy - __y;
    }

    const xlines = useMemo(() => {
        return arr(Math.floor(domainLength) + 1).map((_, i) => {
            return <line x1={i} y1="0" x2={i} y2={rangeLength} stroke="#666666" strokeWidth={lineWidth / 10} />
        })
    }, [domainLength]);

    const ylines = useMemo(() => {
        return arr(Math.floor(rangeLength) + 1).map((_, i) => {
            return <line x1="0" y1={i} x2={domainLength} y2={i} stroke="#666666" strokeWidth={lineWidth / 10} />
        })
    }, [Math.floor(rangeLength)]);

    const [_n, setN] = useState(500);
    const __n = toNum(_n);
    const n = __n > 2000 ? 2000 : __n;
    const [_fz, setFZ] = useState(0);
    const fz = toNum(_fz);

    const [_c, setC] = useState(80);
    const [_d0, setD0] = useState(1);
    const [_v0, setV0] = useState(0);
    const [_k, setK] = useState(10000);
    const [_m, setM] = useState(15);
    const [_hp, setHP] = useState(0);
    const c = toNum(_c);
    const d0 = toNum(_d0);
    const v0 = toNum(_v0);
    const k = toNum(_k);
    const m = toNum(_m);
    const hp = toNum(_hp);

    // integrated way
    const w = useMemo(() => Math.sqrt(k / m), [k, m]);
    // console.log(w);
    const domain = useMemo(() => getRange(n, x => x).map(el => el * domainLength), [n]);

    // const F = useCallback(t => d0 * Math.cos(w * t) + v0 / w * Math.sin(w * t), [d0, v0, w]); // slow, T(F)/T(d2) is 0.8
    // const range = useMemo(() => domain.map(F), [domain, F]);
    // const cs = useMemo(() => domain.map((x, i) => {
    //     const vcy = corY(range[i])
    //     const isCyNaN = isNaN(vcy) || Math.abs(vcy) === Infinity
    //     return isCyNaN ? <text x="1" y="1" fontSize="1">error</text> : <circle strokeWidth={lineWidth / 2} r={lineWidth} cx={corX(x)} cy={vcy} stroke="rgb(250,150,0,0.5)" fill="transparent" />
    // }), [domain, range]);

    const A = useMemo(() => Math.sqrt(d0 * d0 + (v0 / w) ** 2), [d0, v0, w])
    console.log('A', A);
    const p = useMemo(() => Math.atan2(v0 / w, d0), [d0, v0, w])
    const F2 = useCallback(t => A * Math.cos(w * t - p), [A, p, w]);
    const range2 = useMemo(() => domain.map(F2), [domain, F2]);
    const cs2 = useMemo(() => domain.map((x, i) => {
        const vcy = corY(range2[i])
        const isCyNaN = isNaN(vcy) || Math.abs(vcy) === Infinity
        const fontSize = rangeLength / 20;
        return isCyNaN ? <text x={fontSize} y={fontSize} fontSize={fontSize}>error</text> : <circle strokeWidth={lineWidth / 2} r={lineWidth} cx={corX(x)} cy={vcy} stroke="rgb(0,150,250,0.5)" fill="transparent" />
    }), [domain, range2]);

    const zz = useMemo(() => c / 2 / Math.sqrt(m * k), [c, m, k])
    const z = fz > 0 ? fz : zz;
    const ezw = useMemo(() => Math.exp(-z * w), [z, w]);
    const z2w = useMemo(() => Math.sqrt(1 - z * z) * w, [z, w]);
    // const F3 = useCallback(t => A * (ezw ** t) * Math.cos(z2w * t - p), [A, ezw, z2w, p])
    const F3 = useMemo(() => getHarmonic({ damping: c, stiffness: k, mass: m, initPosition: d0, initSpeed: v0, halfPeriods: hp }));
    const range3 = useMemo(() => domain.map(F3), [domain, F3]);
    const cs3 = useMemo(() => domain.map((x, i) => {
        const vcy = corY(range3[i])
        const isCyNaN = isNaN(vcy) || Math.abs(vcy) === Infinity
        const fontSize = rangeLength / 20;
        return isCyNaN ? <text x={fontSize} y={fontSize} fontSize={fontSize}>error</text> : <circle strokeWidth={lineWidth / 2} r={lineWidth} cx={corX(x)} cy={vcy} stroke="rgb(250,150,0,0.5)" fill="transparent" />
    }), [domain, range3]);


    return (
        <div>
            <div>
                <div>c<input value={_c} onChange={({ target: { value: v } }) => setC(v)} /></div>
                <div>n<input value={_n} onChange={({ target: { value: v } }) => setN(v)} /></div>
                <div>d0<input value={_d0} onChange={({ target: { value: v } }) => setD0(v)} /></div>
                <div>v0<input value={_v0} onChange={({ target: { value: v } }) => setV0(v)} /></div>
                <div>k<input value={_k} onChange={({ target: { value: v } }) => setK(v)} /></div>
                <div>m<input value={_m} onChange={({ target: { value: v } }) => setM(v)} /></div>
                <div>fz<input value={_fz} onChange={({ target: { value: v } }) => setFZ(v)} /></div>
            </div>
            <svg strokeWidth={lineWidth} style={{ margin: '5px', backgroundColor: '#fafafa', overflow: 'visible' }} viewBox={`0 0 ${domainLength} ${rangeLength}`} width={width} height={height} >
                {xlines}
                {ylines}
                <line x1="0" y1={cy} x2={domainLength} y2={cy} stroke="#333333" strokeWidth={lineWidth} />
                <line x1={cx} y1={rangeLength} x2={cx} y2="0" stroke="#333333" strokeWidth={lineWidth} />
                {cs2}
                {cs3}
            </svg>
        </div>
    );
}