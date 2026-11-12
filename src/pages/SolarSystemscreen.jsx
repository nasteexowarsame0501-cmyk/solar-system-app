import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SolarSystemscreen() {
    const navigate = useNavigate();
    const [planets, setPlanets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlanets = async () => {
            try {
                const response = await fetch(
                    'https://api.le-systeme-solaire.net/rest/bodies/?filter[]=isPlanet,eq,true&order=semimajorAxis,asc'
                );
                if (!response.ok) {
                    throw new Error(`Request failed: ${response.status}`);
                }
                const data = await response.json();
                setPlanets(data.bodies ?? []);
            } catch (error) {
                console.error('Unable to fetch planets', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlanets();
    }, []);

    if (loading) return <p>Loading planets...</p>;

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
