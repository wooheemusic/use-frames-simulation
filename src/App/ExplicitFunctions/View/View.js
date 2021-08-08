import Descartes from './Descartes';
import Figure from './Figure';
import Translate from './Translate';

export default function View({ x, y, X, Y }) {
    return (
        <>
            <div style={{ flex: 'none' }}>
                <Figure x={x} y={y} />
                <Translate v={x} />
                <Translate v={y} />
                <Descartes x={x} y={y} X={X} Y={Y} />
            </div>
        </>
    );
}