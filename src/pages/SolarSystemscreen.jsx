import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Card, Row, Col, Spinner } from "react-bootstrap";


function SolarSystemscreen() {
    const navigate = useNavigate();
    const [planets, setPlanets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlanets = async () => {
            try {
                const response = await fetch(
                    'https://api.le-systeme-solaire.net/rest/bodies/?filter[]=isPlanet,eq,true&order=semimajorAxis,asc',
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_SOLAR_API_KEY}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`Request failed: ${response.status}`);
                }

                const data = await response.json();
                setPlanets(data.bodies ?? []);

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
            <div style={{ ...pageStyle, justifyContent: 'center' }}>
                <p>Loading planets...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ ...pageStyle, justifyContent: 'center' }}>
                <p>Failure to fetch planets: {error}</p>
                <button onClick={() => navigate('/')} style={{ marginTop: '16px' }}>Back</button>
            </div>
        );
    }

    return (
        <div>
            <button onClick={() => navigate('/')}>Back</button>
            <h1>Solar system planets</h1>

            <div>
                {planets.map((planet) => (
                    <button
                        key={planet.id}
                        onClick={() => navigate(`/planet/${planet.id}`)}
                    >
                        {planet.englishName}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default SolarSystemscreen;
