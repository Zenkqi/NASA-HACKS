import { mount } from '../../scenes/SolarSystem.jsx';

export default function SolarSystemComponent() {
    const containerRef = useCallback(mount, []);
    return <div className="Solar-system-container" ref={containerRef}></div>
}