
const scale = 10;
export default function Translate({ v, inverse = false }) {
    const width = 25;
    return (
        <div>
            <svg width={scale * width} height={scale * 2} style={{ backgroundColor: "#eeeeee", overflow: 'visible' }}
            // viewBox="0 0 12 2"
            >
                <circle cx={scale} cy={scale} r={scale} fill="#888888" style={{ transform: `translateX(${(inverse? 1- v : v) * scale * (width - 2)}px)` }} />
            </svg>
        </div>
    );
}