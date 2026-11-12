import { Container, Button, Spinner } from "react-bootstrap";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

function SolarSystemscreen() {
    const navigate = useNavigate();
    const [planets, setPlanets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlanets = async () => {
            try {
                const response = await fetch(
                    "/api/nasa?format=json&COMMAND='399'&OBJ_DATA='NO'&MAKE_EPHEM='YES'&EPHEM_TYPE='VECTORS'&CENTER='@sun'&START_TIME='2026-11-12'&STOP_TIME='2026-11-13'&STEP_SIZE='1d'",
                );

                if (!response.ok) {
                    throw new Error(`Request failed: ${response.status}`);
                }

                const data = await response.json();
                const match = data.result.match(/X\s*=\s*([-\d.E+]+)\s*Y\s*=\s*([-\d.E+]+)\s*Z\s*=\s*([-\d.E+]+)/);

                if (match) {
                    setPlanets([{
                        id: 'earth',
                        name: 'Earth',
                        position: [
                            parseFloat(match[1]) * 15,
                            parseFloat(match[3]) * 15,
                            -parseFloat(match[2]) * 15,
                        ],
                        radius: 0.7,
                        color: 'blue',
                    }]);
                }
            } catch (error) {
                console.error('Unable to fetch planets', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlanets();
    }, []);

  const pageStyle = {
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        background: 'radial-gradient(circle at center, #0e3057 0%, #0d122e 100%)',
        color: "white",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px"
    };

    if (loading) {
        return (
            <div style={pageStyle}>
                <Spinner animation="border" variant="light" className="mb-3" />
                <p>Loading planets...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={pageStyle}>
                <p>Failure to fetch planets: {error}</p>
                <Button variant="outline-light" onClick={() => navigate('/')} className="mt-3">
                    Back
                </Button>
            </div>
        );
    }

    return (
        <div style={{ ...pageStyle, padding: 0, position: 'relative' }}>
            <Container fluid className="position-absolute top-0 start-0 p-3 d-flex justify-content-between align-items-center" style={{ zIndex: 10 }}>
                <Button variant="outline-light" onClick={() => navigate('/')}>
                    Back
                </Button>
                <h1 className="h4 m-0">Solar System Planets</h1>
                <div className="d-flex gap-2">
                    {planets.map((planet) => (
                        <Button
                            key={planet.id}
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/planet/${planet.id}`)}
                        >
                            {planet.name}
                        </Button>
                    ))}
                </div>
            </Container>


            <div style={{ width: '100vw', height: '100vh' }}>
                <Canvas camera={{ position: [0, 20, 35]}}>
                    <ambientLight intensity={0.3} />
                    <pointLight position={[0, 0, 0]} intensity={2.5} color="#ffffff" />
                    <Stars radius={200} depth={50} count={5000} factor={4} />


                    <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[2.5, 32, 32]} />
                        <meshBasicMaterial color="#FDB813" />
                    </mesh>

                    {planets.map((planet) => (
                        <mesh
                            key={planet.id}
                            position={planet.position}
                            onClick={() => navigate(`/planet/${planet.id}`)}
                            onPointerOver={() => (document.body.style.cursor = 'pointer')}
                            onPointerOut={() => (document.body.style.cursor = 'auto')}
                        >
                            <sphereGeometry args={[planet.radius, 32, 32]} />
                            <meshStandardMaterial color={planet.color} />
                        </mesh>
                    ))}

                    <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                </Canvas>
            </div>
        </div>
    );
}

export default SolarSystemscreen;
