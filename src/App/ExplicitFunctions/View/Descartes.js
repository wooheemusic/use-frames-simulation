import { useMemo } from 'react';

export default function Descartes({ x, y, X, Y, width = 300, height = 300 }) {
    const yy = height * (1 - y);
    const xx = width * x;
    const path = useMemo(() => {
        return X.map((x, i) => {
            return <circle key={String(x)} r="1" cx={width * x} cy={height * (1 - Y[i])} stroke="#888888"/>
        });
    }, [X, Y])
    return (
        <div>
            <svg width={width} height={height} style={{ margin: '5px', backgroundColor: '#fafafa', overflow: 'visible' }}>
                {path}
                <line x1="0" y1={height} x2={width} y2={height} stroke="#333333" />
                <line x1="0" y1={height} x2="0" y2="0" stroke="#333333" />
                <line x1="0" y1={yy} x2={width} y2={yy} stroke="#888888" />
                <line x1={xx} y1={height} x2={xx} y2="0" stroke="#888888" />
                <circle r="5" cx={xx} cy={yy} stroke="red" fill="red" />
            </svg>
        </div>
    );
}