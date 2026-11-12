//import needed paragarmas for this screen 

import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useRef } from 'react';


//rotation the the planets
function RotatingPlanet({color, hasRings}) {
    const meshRef = useRef();

    useFrame((_, delta) => {
        if(meshRef.current) {
            meshRef.current.rotation.y += 0.4 * delta; 
        }
    });

    return (
        <group ref={meshRef}>
            <mesh>
                <sphereGeometry args={[2.2, 64, 64]} />
                <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
            </mesh>

            {hasRings && (
                <mesh rotation={[Math.PI/2.5, 0, 0]}>
                    <ringGeometry args={[2.8, 4.2, 64]}/>
                    <meshStandardMaterial color= '#C8B588' side={2} transparent opacity={0.8} />

                </mesh>
            )}

        </group>
    )
}

const PLANET_DATA = {
    mercury: {
        code: '199',
        name: 'Mercury',
        color: '#A5A5A5',
        type: 'terrestial planet',
        diameter: '4 879 km',
        orbitPeriod: '88 days',
        dayLength: '58.6 earth days',
        moons: 0,
        description: 'The smallest planet in our solar system. No atmosphere causes the temperature differences to be large between night and day.'
    },

    venus: {
        code: '299',
        name: 'Venus',
        color: '#E3BB76',
        type: 'terrestial planet',
        diameter: '12 104 km',
        orbitPeriod: '225 days',
        dayLength: '243 earth days',
        moons: 0,
        description: 'Earth-sized neighbouring planet covered by an atmosphere made mostly of carbon dioxide and sulfuric acid clouds.'
    },

    earth: {
        code: '399',
        name: 'Earth',
        color: '#2B82C9',
        type: 'terrestial planet',
        diameter: '12 742 km',
        orbitPeriod: '365.25 days',
        dayLength: '24 hours',
        moons: 1,
        description: 'Our home planet and the only known world with liquid water and life.'
    },

    mars: {
        code: '499',
        name: 'Mars',
        color: '#E27B58',
        type: 'Rocky planet',
        diameter: '6 779 km',
        orbitPeriod: '687 days',
        dayLength: '24 h 37 min',
        moons: 2,
        description: 'The red planet gets its color from iron oxide in the soil. It is home to Olympus Mons, the tallest volcano in the solar system.'
    },
    jupiter: {
        code: '599',
        name: 'Jupiter',
        color: '#C88B3A',
        type: 'Gas giant',
        diameter: '139 820 km',
        orbitPeriod: '11.9 years',
        dayLength: '9 h 55 min',
        moons: 95,
        description: 'The largest planet in our solar system, known for its massive storms and immense size.'
    },
    saturn: {
        code: '699',
        name: 'Saturn',
        color: '#E4D191',
        type: 'Gas giant',
        diameter: '116 460 km',
        orbitPeriod: '29.5 years',
        dayLength: '10 h 33 min',
        moons: 146,
        description: 'Known for its spectacular ring system, composed mostly of ice particles and rocky dust.'
    },
    uranus: {
        code: '799',
        name: 'Uranus',
        color: '#4FD0E7',
        type: 'Ice giant',
        diameter: '50 724 km',
        orbitPeriod: '84 years',
        dayLength: '17 h 14 min',
        moons: 28,
        description: 'A blue-green ice giant whose axis is tilted almost 98 degrees, causing it to roll through space.'
    },
    neptune: {
        code: '899',
        name: 'Neptune',
        color: '#4B70DD',
        type: 'Ice giant',
        diameter: '49 244 km',
        orbitPeriod: '164.8 years',
        dayLength: '16 h 6 min',
        moons: 16,
        description: 'The outermost major planet in the solar system, famous for its extremely powerful winds.'
    }
};

function PlanetDetailScreen() {
    const { planetID } = useParams();
    const navigate = useNavigate();

    const [distanceAU, setDistanceAU] = useState(null);
    const [loading, setLoading] = useState(true);

    const planetInfo = PLANET_DATA[planetID?.toLowerCase()];

    useEffect(() => {
        if (!planetInfo) {
            setLoading(false);
            return;
        }

        const fetchLivePosition = async () => {
            try {
                const response = await fetch(
                    `/api/nasa?format=json&COMMAND='${planetInfo.code}'&OBJ_DATA='NO'&MAKE_EPHEM='YES'&EPHEM_TYPE='VECTORS'&CENTER='@sun'&START_TIME='2026-11-12'&STOP_TIME='2026-11-13'&STEP_SIZE='1d'`
                );

                if (response.ok) {
                    const data = await response.json();
                    const match = data.result?.match(/X\)\s*=\s*([-\d.E+]+)\s*Y\s*=\s*([-\d.E+]+)\s*Z\s*=\s*([-\d.E+]+)/i);

                    if (match) {
                        const x = parseFloat(match[1]);
                        const y = parseFloat(match[2]);
                        const z = parseFloat(match[3]);
                        const dist = Math.sqrt(x * x + y * y + z * z);
                        setDistanceAU(dist.toFixed(3));
                    }
                }
            } catch (error) {
                console.error('Location search failed', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLivePosition();
    }, [planetInfo]);

    const pageStyle = {
        minHeight: '100vh',
        width: '100vw',
        background: 'radial-gradient(circle at center, #0e3057 0%, #0d122e 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column'
    };

    if (!planetInfo) {
        return (
            <div style={pageStyle} className="justify-content-center align-items-center">
                <h3>Planet {planetID} not found</h3>
                <Button variant="outline-light" className="mt-3" onClick={() => navigate('/solarsystem')}>
                    Back
                </Button>
            </div>
        );
    }

    return (
        <div style={pageStyle}>
            <Container fluid className="p-3 d-flex justify-content-between align-items-center">
                <Button variant="outline-light" onClick={() => navigate(-1)}>
                Return
                </Button>
                <h2 className="h4 m-0">{planetInfo.name}</h2>
                <div style={{ width: '90px' }} />
            </Container>

            <Container className="flex-grow-1 d-flex align-items-center py-4">
                <Row className="w-100 align-items-center g-4">
                    <Col md={6} style={{ height: '450px' }}>
                        <Canvas camera={{ position: [0, 1.5, 7] }}>
                            <ambientLight intensity={0.8} />
                            <pointLight position={[10, 10, 10]} intensity={2.5} />
                            <Stars radius={100} depth={50} count={2500} factor={4} />

                            <RotatingPlanet
                                color={planetInfo.color}
                                hasRings={planetID.toLowerCase() === 'saturn'}
                            />

                            <OrbitControls enableZoom={false} enablePan={false} />
                        </Canvas>
                    </Col>

                    <Col md={6}>
                        <Card
                            style={{
                                backgroundColor: 'rgba(13, 18, 46, 0.85)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '16px',
                                color: 'white'
                            }}
                            className="p-4 shadow-lg"
                        >
                            <Card.Body>
                                <Card.Title as="h1" className="mb-2">{planetInfo.name}</Card.Title>
                                <Card.Subtitle className="mb-3 text-info">
                                    {planetInfo.type}
                                </Card.Subtitle>

                                <Card.Text className="mb-4" style={{ lineHeight: '1.6' }}>
                                    {planetInfo.description}
                                </Card.Text>

                                <hr style={{ borderColor: 'rgba(255,255,255,0.2)' }} />

                                <Row className="g-3 mt-1">
                                    <Col sm={6}>
                                        <strong>Halkaisija:</strong>
                                        <div>{planetInfo.diameter}</div>
                                    </Col>
                                    <Col sm={6}>
                                        <strong>Orbit period:</strong>
                                        <div>{planetInfo.orbitPeriod}</div>
                                    </Col>
                                    <Col sm={6}>
                                        <strong>Day length:</strong>
                                        <div>{planetInfo.dayLength}</div>
                                    </Col>
                                    <Col sm={6}>
                                        <strong>Moons:</strong>
                                        <div>{planetInfo.moons}</div>
                                    </Col>
                                    <Col sm={6}>
                                        <strong>Distance from Sun:</strong>
                                        <div>{loading ? 'Loading...' : `${distanceAU ?? 'N/A'} AU`}</div>
                                    </Col>
                                    <Col sm={6}>
                                        <strong>Type:</strong>
                                        <div>{planetInfo.type}</div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default PlanetDetailScreen;
