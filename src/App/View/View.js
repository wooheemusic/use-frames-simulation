import Descartes from './views/Descartes';
import Figure from './views/Figure';
import Translate from './views/Translate';

export default function View({ x, y, X, Y }) {
    return (
        <>
            <Figure x={x} y={y} />
            <Translate v={x} />
            <Translate v={y} />
            <Descartes x={x} y={y} X={X} Y={Y}/>
        </>
    );
}