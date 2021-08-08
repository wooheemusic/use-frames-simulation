import { useState, useEffect, useMemo } from 'react';

import useFrames from 'use-frames';
import getRange from 'use-frames/tools/getRange';
import { linear, getExponential, getCubicBezier, getMonomial, getQuadraticBezier, getHarmonicForUnit } from 'use-frames/explicits';
import { STIFFNESS, MASS, DAMPING } from 'use-frames/variables';

import './ExplicitFunctions.css';
import View from './View';

const MAX_SAFE_FRAMES = 1000;

const functions = new Map(); // key: function, value: string for HTML representation.
functions.set(linear, 'Linear');
functions.set(getMonomial, 'Monomial');
functions.set(getExponential, 'Exponential');
functions.set(getQuadraticBezier, 'Quadratic-Bezier');
functions.set(getCubicBezier, 'Cubic-Bezier');
functions.set(getHarmonicForUnit, 'Harmonic Oscillator');

function resolveFunction(f, _x1, _y1, _x2, _y2, _base, _exponent, hOption) {
    switch (f) {
        case linear:
            return linear;
        case getMonomial:
            return getMonomial(_exponent);
        case getExponential:
            return getExponential(_base);
        case getQuadraticBezier:
            return getQuadraticBezier(_x1, _y1);
        case getCubicBezier:
            return getCubicBezier(_x1, _y1, _x2, _y2);
        case getHarmonicForUnit:
            return getHarmonicForUnit(hOption);
        default:
            throw new Error('?');
    }
}

function toNum(v, df = 0) {
    return isNaN(v) ? df : Number(v);
}

function toPositive(v, df) {
    return Math.abs(toNum(v, df));
}

function toNatural(v, df) {
    return Math.floor(toPositive(v, df));
}

function toSafeNatural(v, max = MAX_SAFE_FRAMES) {
    v = toNatural(v);
    return v > max ? max : v;
}

function resolveBase(_base) {
    _base = toPositive(_base);
    return _base === 1 || _base === 0 ? Math.exp(1) : _base;
}

function resolveExponent(_exponent) {
    _exponent = toPositive(_exponent);
    return _exponent < 1 ? 1 : _exponent;
}

function resolvedX(x) {
    x = toPositive(x);
    return x > 1 ? 1 : x
}

function resolvedY(y) {
    return toNum(y);
}

export default function ExplicitFunctions(props) {

    // motion
    const [_n, setN] = useState(120);
    const [_from, setFrom] = useState(0);
    const [_to, setTo] = useState(() => _n);
    const [{ f }, _setF] = useState({ f: linear });
    function setF(_f) {
        _setF({ f: _f })
    }

    const n = toSafeNatural(_n);
    const from = toSafeNatural(_from);
    const to = toSafeNatural(_to);

    // function
    const [_x1, setX1] = useState(1);
    const [_y1, setY1] = useState(0);
    const [_x2, setX2] = useState(0);
    const [_y2, setY2] = useState(1);
    const [_base, setBase] = useState(Math.exp(1));
    const [_exponent, setExponent] = useState(2);

    const x1 = resolvedX(_x1);
    const y1 = resolvedY(_y1);
    const x2 = resolvedX(_x2);
    const y2 = resolvedY(_y2);
    const base = resolveBase(_base);
    const exponent = resolveExponent(_exponent);

    // oscillator
    const [_c, setC] = useState(DAMPING);
    const [_k, setK] = useState(STIFFNESS);
    const [_m, setM] = useState(MASS);
    const [_d0, setD0] = useState(1);
    const [_v0, setV0] = useState(0);
    const [_hp, setHP] = useState(6);
    const c = toNum(_c);
    const d0 = toNum(_d0);
    const v0 = toNum(_v0);
    const k = toNum(_k);
    const m = toNum(_m);
    const hp = toNum(_hp);
    const options = { damping: c, stiffness: k, mass: m, initPosition: d0, initSpeed: v0, halfPeriods: hp }

    const Y = useMemo(() => getRange(n, resolveFunction(f, x1, y1, x2, y2, base, exponent, options))
        , [
            n,
            f,
            !(f === getCubicBezier || f === getQuadraticBezier) || x1,
            !(f === getCubicBezier || f === getQuadraticBezier) || y1,
            f !== getCubicBezier || x2,
            f !== getCubicBezier || y2,
            f !== getExponential || base,
            f !== getMonomial || exponent,
            f !== getHarmonicForUnit || c,
            f !== getHarmonicForUnit || k,
            f !== getHarmonicForUnit || m,
            f !== getHarmonicForUnit || d0,
            f !== getHarmonicForUnit || v0,
            f !== getHarmonicForUnit || hp,
        ]);

    // counter function
    const X = useMemo(() => getRange(n, linear), [n]);

    const [x, setMotionX] = useFrames({ range: X, from, to, onEnd: () => ({ restart: Date.now() }) })
    const [y, setMotionY] = useFrames({ range: Y, from, to, onEnd: () => ({ restart: Date.now() }) });

    useEffect(() => {
        setMotionX({ from });
        setMotionY({ from });
    }, [from]);

    useEffect(() => {
        setMotionX({ to });
        setMotionY({ to });
    }, [to]);

    useEffect(() => {
        setMotionX({ range: X });
        setMotionY({ range: Y });
    }, [Y]);

    let disable = false;

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ flex: 'none' }}>
                <div>
                    n: <input value={_n} onChange={({ target: { value: v } }) => {
                        setN(v);
                        setTo(v);
                    }} /> {n}
                </div>
                <div>
                    from: <input value={_from} onChange={({ target: { value: v } }) => setFrom(v)} /> {from}
                </div>
                <div>
                    to: <input value={_to} onChange={({ target: { value: v } }) => setTo(v)} /> {to}
                </div>
                <div className="function-select">
                    {Array.from(functions.keys()).map(key => (
                        <div key={functions.get(key)} className={'function-option' + (f === key ? ' selected' : '')} onClick={() => setF(key)}>
                            {functions.get(key)}
                        </div>
                    ))}
                </div>

                <div>
                    function: {functions.get(f)}
                </div>

                {f === getMonomial &&
                    <div>
                        exponent: <input value={_exponent} onChange={({ target: { value: v } }) => setExponent(v)} /> {exponent}
                    </div>
                }
                {f === getExponential &&
                    <div>
                        base: <input value={_base} onChange={({ target: { value: v } }) => setBase(v)} /> {base}
                    </div>
                }
                {(f === getCubicBezier || f === getQuadraticBezier) &&
                    <>
                        <div>
                            x1: <input value={_x1} onChange={({ target: { value: v } }) => setX1(v)} /> {x1}
                        </div>
                        <div>
                            y1: <input value={_y1} onChange={({ target: { value: v } }) => setY1(v)} /> {y1}
                        </div>
                    </>
                }
                {(f === getCubicBezier) &&
                    <>
                        <div>
                            x2: <input value={_x2} onChange={({ target: { value: v } }) => setX2(v)} /> {x2}
                        </div>
                        <div>
                            y2: <input value={_y2} onChange={({ target: { value: v } }) => setY2(v)} /> {y2}
                        </div>
                    </>
                }
                {(f === getHarmonicForUnit) &&
                    <div>
                        <div>Damping: <input value={_c} onChange={({ target: { value: v } }) => setC(v)} /> {c}</div>
                        <div>Stiffness: <input value={_k} onChange={({ target: { value: v } }) => setK(v)} /> {k}</div>
                        <div>Mass: <input value={_m} onChange={({ target: { value: v } }) => setM(v)} /> {m}</div>
                        <div>Initial Position: <input disabled={disable} value={_d0} onChange={({ target: { value: v } }) => setD0(v)} /> {d0}</div>
                        <div>Initial Velocity: <input disabled={disable} value={_v0} onChange={({ target: { value: v } }) => setV0(v)} /> {v0}</div>
                        <div>Number of Half-periods: <input value={_hp} onChange={({ target: { value: v } }) => setHP(v)} /> {hp}</div>
                    </div>
                }
            </div>
            <View x={x} y={y} X={X} Y={Y} />
        </div>
    );
}