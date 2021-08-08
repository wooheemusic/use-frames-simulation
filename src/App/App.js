import ExplicitFunctions from './ExplicitFunctions';
import DynamicSimulator from './DynamicSimulator';
import CompareHarmonic from './CompareHarmonic';
import Vectors from './Vectors';

export default function App(props) {
    return (
        <>
            <h1>use-frames Simulator</h1>
            <p>
                git : <a href="https://github.com/wooheemusic/use-frames">https://github.com/wooheemusic/use-frames</a>
            </p>
            <p>
                npm: <a href="https://www.npmjs.com/package/use-frames">https://www.npmjs.com/package/use-frames</a>
            </p>

            <h2>Explicit functions with useFrames</h2>
            <ExplicitFunctions />

            <h2>Dynamic system for harmonic oscillator with useDynamicFrames</h2>
            <p>No validation is applied. Press F5 on error</p>
            <p>Press q or w to change perspectives</p>
            <DynamicSimulator />

            <h2>Difference between dynamic aproximation and explicit purity</h2>
            <CompareHarmonic />

            <h2>Extra vector projection</h2>
            <Vectors />
        </>
    );
}