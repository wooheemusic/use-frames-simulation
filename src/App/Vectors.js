

import { useState, useMemo } from 'react';

function toNum(v) {
    return isNaN(v) ? 0 : Number(v);
}

// 1.2 times slow
function getResolutions(r, a, b) {
    const theta = Math.atan2(b, a);
    return [r * Math.cos(theta), r * Math.sin(theta)];
}
function getResolutions2(r, a, b) {
    const ratio = r / Math.sqrt(a * a + b * b);
    return [ratio * a, ratio * b];
}

function dot(A, B) {
    if (A.length !== B.length) throw new Error('different lengths');
    return A.map((el, i) => el * B[i]).reduce((a, b) => a + b);
}

function scalar(a, A) {
    return A.map(el => el * a);
}

// A to B
function project(A, B) {
    const s = dot(A, B) / dot(B, B);
    return scalar(s, B)
}

export default function Vectors({ width = 500, height = 500 }) {
    const cx = width / 2;
    const cy = height / 2;
    const [_x, setX] = useState(100);
    const [_y, setY] = useState(200);
    const [_a, setA] = useState(200);
    const [_b, setB] = useState(100);
    const x = toNum(_x);
    const y = toNum(_y);
    const a = toNum(_a);
    const b = toNum(_b);
    const [px, py] = project([x, y], [a, b]);
    const xx = cx + x;
    const yy = cy - y;
    const aa = cx + a;
    const bb = cy - b;
    const pxx = cx + px;
    const pyy = cx - py;
    return (
        <div>
            <div>
                <div>
                    x1: <input value={_x} onChange={({ target: { value: v } }) => setX(v)} />
                </div>
                <div>
                    y1: <input value={_y} onChange={({ target: { value: v } }) => setY(v)} />
                </div>
                <div>
                    x2: <input value={_a} onChange={({ target: { value: v } }) => setA(v)} />
                </div>
                <div>
                    y2: <input value={_b} onChange={({ target: { value: v } }) => setB(v)} />
                </div>
            </div>
            <svg width={width} height={height} strokeWidth={3} style={{ margin: '5px', backgroundColor: '#fafafa', overflow: 'visible' }}>
                <line x1="0" y1={cy} x2={width} y2={cy} stroke="#333333" />
                <line x1={cx} y1={height} x2={cx} y2="0" stroke="#333333" />
                <line x1={cx} y1={cy} x2={xx} y2={yy} stroke="rgb(250,150,0,0.5)" />
                <line x1={cx} y1={cy} x2={aa} y2={bb} stroke="rgb(0,150,250,0.5)" />
                <line x1={cx} y1={cy} x2={pxx} y2={pyy} stroke="rgb(250,0,0,0.2)" />
                <line x1={xx} y1={yy} x2={pxx} y2={pyy} stroke="#888888" strokeDasharray={4} />
            </svg>
        </div>
    );
}