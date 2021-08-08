export default function Figure({ x, y, fixed = 2 }) {
    return (
        <>
            <div>
                x: {x.toFixed(fixed)}
            </div>
            <div>
                y: {y.toFixed(fixed)}
            </div>
        </>
    );
}