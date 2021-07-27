import { useState, useEffect, useMemo } from 'react';

import useFrames from 'use-frames';
import getRange from 'use-frames/tools/getRange';
import { linear, getExponential, getCubicBezier, getMonomial, getQuadraticBezier } from 'use-frames/explicits';

import './App.css';
import View from './View';

const functions = new Map(); // key: function, value: string for HTML representation.
functions.set(linear, 'Linear');
functions.set(getMonomial, 'Monomial');
functions.set(getExponential, 'Exponential');
functions.set(getQuadraticBezier, 'Quadratic-Bezier');
functions.set(getCubicBezier, 'Cubic-Bezier');

function resolveFunction(f, x1, y1, x2, y2, base, exponent) {
    switch (f) {
        case linear:
            return linear;
        case getMonomial:
            return getMonomial(exponent);
        case getExponential:
            return getExponential(base);
        case getQuadraticBezier:
            return getQuadraticBezier(x1, y1);
        case getCubicBezier:
            return getCubicBezier(x1, y1, x2, y2);
        default:
            throw new Error('?');
    }
}

function getResolvedNum(v) {
    return isNaN(v) ? 0 : Math.abs(Number(v));
}

function getResolvedNatural(v) {
    return Math.floor(getResolvedNum(v));
}

function getResolvedBase(base) {
    base = getResolvedNum(base);
    return base === 1 || base === 0 ? Math.exp(1) : base;
}

function getResolvedExponent(exponent) {
    exponent = getResolvedNum(exponent);
    return exponent < 1 ? 1 : exponent;
}

function getResolvedX(x) {
    x = getResolvedNum(x);
    return x > 1 ? 1 : x
}

function getResolvedY(y) {
    return isNaN(y) ? 0 : Number(y);
}

export default function App(props) {

    // motion
    const [n, setN] = useState(60);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(() => n);
    const [{ f }, _setF] = useState({ f: linear });
    function setF(_f) {
        _setF({ f: _f })
    }
    
    const rn = getResolvedNatural(n);
    const rf = getResolvedNatural(from);
    const rt = getResolvedNatural(to);

    // function
    const [x1, setX1] = useState(0);
    const [y1, setY1] = useState(0);
    const [x2, setX2] = useState(0);
    const [y2, setY2] = useState(0);
    const [base, setBase] = useState(Math.exp(1));
    const [exponent, setExponent] = useState(2);

    const rx1 = getResolvedX(x1);
    const ry1 = getResolvedY(y1);
    const rx2 = getResolvedX(x2);
    const ry2 = getResolvedY(y2);
    const rb = getResolvedBase(base);
    const re = getResolvedExponent(exponent);

    const Y = useMemo(() => getRange(rn, resolveFunction(f, rx1, ry1, rx2, ry2, rb, re))
        , [
            rn,
            f,
            !(f === getCubicBezier || f === getQuadraticBezier) || rx1,
            !(f === getCubicBezier || f === getQuadraticBezier) || ry1,
            f !== getCubicBezier || rx2,
            f !== getCubicBezier || ry2,
            f !== getExponential || rb,
            f !== getMonomial || re,
        ]);

    // counter function
    const X = useMemo(() => getRange(rn, linear), [rn]);

    const [x, setMotionX] = useFrames({ range: X, from: rf, to: rt, onEnd: () => ({ restart: Date.now() }) })
    const [y, setMotionY] = useFrames({ range: Y, from: rf, to: rt, onEnd: () => ({ restart: Date.now() }) });

    useEffect(() => {
        setMotionX({ from: rf });
        setMotionY({ from: rf });
    }, [rf]);

    useEffect(() => {
        setMotionX({ to: rt });
        setMotionY({ to: rt });
    }, [rt]);

    useEffect(() => {
        setMotionX({ range: X });
        setMotionY({ range: Y });
    }, [Y]);

    return (
        <div>
            <div>
                n: <input value={n} onChange={({ target: { value: v } }) => {
                    setN(v);
                    setTo(v);
                }} /> {rn}
            </div>
            <div>
                from: <input value={from} onChange={({ target: { value: v } }) => setFrom(v)} /> {rf}
            </div>
            <div>
                to: <input value={to} onChange={({ target: { value: v } }) => setTo(v)} /> {rt}
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

            { f === getMonomial &&
                <div>
                    exponent: <input value={exponent} onChange={({ target: { value: v } }) => setExponent(v)} /> {re}
                </div>
            }
            { f === getExponential &&
                <div>
                    base: <input value={base} onChange={({ target: { value: v } }) => setBase(v)} /> {rb}
                </div>
            }
            { (f === getCubicBezier || f === getQuadraticBezier) &&
                <div>
                    x1: <input value={x1} onChange={({ target: { value: v } }) => setX1(v)} /> {rx1}
                </div>
            }
            { (f === getCubicBezier || f === getQuadraticBezier) &&
                <div>
                    y1: <input value={y1} onChange={({ target: { value: v } }) => setY1(v)} /> {ry1}
                </div>
            }
            { (f === getCubicBezier) &&
                <div>
                    x2: <input value={x2} onChange={({ target: { value: v } }) => setX2(v)} /> {rx2}
                </div>
            }
            { (f === getCubicBezier) &&
                <div>
                    y2: <input value={y2} onChange={({ target: { value: v } }) => setY2(v)} /> {ry2}
                </div>
            }

            <View x={x} y={y} X={X} Y={Y} />
        </div>
    );
}