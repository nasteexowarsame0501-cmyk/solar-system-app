//import needed paragarmas for this screen 

import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useRef } from 'react';



//add facts about each planet 

function PlanetDetailScreen() {

const PLANET_DATA = {
    mercury: {
        code: '199',
        name: 'Mercury',
        color:'#A5A5A5',
        type: 'terrestial planet',
        diameter: '4 879km',
        orbitPeriod: '88 days',
        dayLength: '58,6 earth days',
        moons: 0,
        description: 'the smaller planet in our solar system. No athmosphere causes the temperature differences to be large through the nigh/day.'
    },

    venus: {
        code: '299',
        name: 'venus',
        color: "#E3BB76",
        type: 'terrestial planet',
        diamater: '12 104km', 
        orbitPeriod: '225 days',
        dayLength: '243 earth days',
        moons: 0,
        description: 'earths sized neighbouring planet that is covered by an atmosphere composed of sulfuric acis and carbon dioxide.'
    },

    earth: {
        code: '399',
        name: 'Earth',
        color: '#2B82C9',
        type: 'terrestial planet',
        diameter: '12 742km',
        daylength: '365,25 earth days',
        moons: 1,
        description: 'Our home planets and the only known orb that has life/water'
    }, 

    mars: {
        code: '499',
        name: 'Mars',
        color: '#E27B58',
        type: 'Kiviplaneetta',
        diameter: '6 779 km',
        orbitPeriod: '687 päivää',
        dayLength: '24 h 37 min',
        moons: 2,
        description: 'Punainen planeetta, joka on saanut värinsä maaperän rautaoksidista eli ruosteesta. Marsissa sijaitsee aurinkokunnan korkein tulivuori, Olympus Mons.'
    },
    jupiter: {
        code: '599',
        name: 'Jupiter',
        color: '#C88B3A',
        type: 'Kaasujättiläinen',
        diameter: '139 820 km',
        orbitPeriod: '11,9 vuotta',
        dayLength: '9 h 55 min',
        moons: 95,
        description: 'Our solar systems largest planet. Its known feature is its red shape , which is larger that earth'
    },
    saturn: {
        code: '699',
        name: 'Saturnus (Saturn)',
        color: '#E4D191',
        type: 'Kaasujättiläinen',
        diameter: '116 460 km',
        orbitPeriod: '29,5 vuotta',
        dayLength: '10 h 33 min',
        moons: 146,
        description: 'Known for its spectacular and extensive ring system, which is composed mainly of ice and rock dust'
    },
    uranus: {
        code: '799',
        name: 'Uranus',
        color: '#4FD0E7',
        type: 'Jääjättiläinen',
        diameter: '50 724 km',
        orbitPeriod: '84 vuotta',
        dayLength: '17 h 14 min',
        moons: 28,
        description: 'A blue-green ice giant whose rotational axis is tilted almost on its side (98 degrees), causing it to appear to roll along its orbit.'
    },
    neptune: {
        code: '899',
        name: 'Neptunus (Neptune)',
        color: '#4B70DD',
        type: 'Jääjättiläinen',
        diameter: '49 244 km',
        orbitPeriod: '164,8 vuotta',
        dayLength: '16 h 6 min',
        moons: 16,
        description: 'The outermost major planet in the solar system. The strongest winds in the solar system blow there, reaching speeds of up to 2,100 km/h '
    }

}

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

function PlanetDetailScreen() {
    const{planetID} = useParams();
    const naviagte = useNavigate();

    const [distanceAU, setDistanceAU] = useState(null);
    const [loading, setLoading] = useState(true);

    const planetInfo = PLANET_DATA[planetID?.toLowerCase()];


    useEffect(() => {
        if(!planetInfo){
            setLoading(false);
            return;
        }
    }

    const fetchLivePosition = async () => {
        try{
            const response = await fetch (
             `/api/nasa?format=json&COMMAND='${planetInfo.code}'&OBJ_DATA='NO'&MAKE_EPHEM='YES'&EPHEM_TYPE='VECTORS'&CENTER='@sun'&START_TIME='2026-11-12'&STOP_TIME='2026-11-13'&STEP_SIZE='1d'`
            
            );

            if(response.ok){
                const data = await response.json();
                const match = data.result.macth(/X\)s*=\s*([-\d.E+]+)\s*Y\s*=\s*([-\d.E+]+)\s*Z\s*=\s*([-\d.E+]+)/);


                if(match) {
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

}, [planetID, planetInfo]; 


const pageStyle = {
    minHeight: '100vh',
    width: '100vw',
    background: 'radial-gradient(circle at center, #0e3057 0%, #0d122e 100%)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column'

};































}

export default PlanetDetailScreen; 


