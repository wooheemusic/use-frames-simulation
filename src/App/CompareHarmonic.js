import useDynamicHarmonic from 'use-frames/useDynamicHarmonic';
import useHarmonic from 'use-frames/useHarmonic';

const size = 300;
const frequency = 360;

export default function DynamicFrame() {

    const [o, setO] = useDynamicHarmonic({ d: 1, v: 0 }, { frequency });

    const [y] = useHarmonic(frequency, undefined, {
        onEnd: () => {
            setO({ d: 1, v: 0 });
            return { restart: Date.now() }
        }
    })

    return (
        <div>
            <div>
                o for dynamic, O for explicit
            </div>
            <div style={{ width: '1rem', transform: `translateX(${size - (o.d) * size}px)` }}>o</div>
            <div style={{ width: '1rem', transform: `translateX(${size - y * size}px)` }}>O</div>
        </div>
    );
}