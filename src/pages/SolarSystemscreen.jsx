import { Container, Button, Spinner } from "react-bootstrap";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';



function OrbitingPlanet({ planet, onSelect }) {
    const groupRef = useRef();


    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += planet.speed * delta;
        }
    });


    const [x, , z] = planet.position;
    const orbitRadius = Math.sqrt(x * x + z * z);
    const ringPoints = [];
    for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        ringPoints.push([Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius]);
    }







//add planets through their id
function SolarSystemscreen() {
    const navigate = useNavigate();
    const [planets, setPlanets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

       useEffect(() => {
            
        const PLANET_LIST = [
            { id: 'mercury', code: '199', name: 'Mercury', color: '#A5A5A5', radius: 0.6, scale: 12 },
            { id: 'venus',   code: '299', name: 'Venus',   color: '#E3BB76', radius: 0.9, scale: 11 },
            { id: 'earth',   code: '399', name: 'Earth',   color: '#2B82C9', radius: 1.0, scale: 10 },
            { id: 'mars',    code: '499', name: 'Mars',    color: '#E27B58', radius: 0.7, scale: 9 },
            { id: 'jupiter', code: '599', name: 'Jupiter', color: '#C88B3A', radius: 2.0, scale: 4.5 },
            { id: 'saturn',  code: '699', name: 'Saturn',  color: '#E4D191', radius: 1.7, scale: 3.2 },
            { id: 'uranus',  code: '799', name: 'Uranus',  color: '#4FD0E7', radius: 1.3, scale: 2.2 },
            { id: 'neptune', code: '899', name: 'Neptune', color: '#4B70DD', radius: 1.3, scale: 1.7 }
        ];



        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        const fetchPlanets = async () => {
            try {
                const loadedPlanets = [];

                for (const planet of PLANET_LIST) {
                    const response = await fetch(
                        `/api/nasa?format=json&COMMAND='${planet.code}'&OBJ_DATA='NO'&MAKE_EPHEM='YES'&EPHEM_TYPE='VECTORS'&CENTER='@sun'&START_TIME='2026-11-12'&STOP_TIME='2026-11-13'&STEP_SIZE='1d'`
                    );

                    if (response.ok) {
                        const data = await response.json();
                        const match = data.result.match(/X\s*=\s*([-\d.E+]+)\s*Y\s*=\s*([-\d.E+]+)\s*Z\s*=\s*([-\d.E+]+)/);

                        if (match) {
                            loadedPlanets.push({
                                ...planet,
                                position: [
                                    parseFloat(match[1]) * planet.scale,
                                    parseFloat(match[3]) * planet.scale,
                                    -parseFloat(match[2]) * planet.scale
                                ]
                            });
                        }
                    }

                    await sleep(150);
                }

                if (loadedPlanets.length === 0) {
                    throw new Error('No planet data returned from NASA API');
                }

                setPlanets(loadedPlanets);
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
                <Canvas camera={{ position: [0, 35, 75]}}>
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
