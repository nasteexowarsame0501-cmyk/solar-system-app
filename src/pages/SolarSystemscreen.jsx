import {useNavigate} from "react-router-dom";
import{ useState, useEffect} from 'react'


function SolarSystemscreen() {
    const navigate = useNavigate();
    const [planets, setplanets] = useState([]);
    const [loading, setloading] = useState(true);


    const API_KEY = '8dd11810-cb9d-4925-970c-8e228246731c';

    useEffect(() => {
        const fetchPlanets = async() => {
            try {
                const response = await fetch("https://le-systeme-solaire.net[]=isPlanet,eq,true&order=semimajorAxis,as",
                    {
                        headers: {
                            Authroization: 'Bearer $(API_KEY)',
                        }, 
                    
                    }
                    const data = await response.json();
                    setplanets(data.bodies);

            } catch (error){
                console.error("Incorrcet API", error)
            } finally {
                setLoading(false);
            }
        };

        fetchPlanets();
    }, []); 


    if (loading) return <p> loading planets </p>


    return (
        <div>
            <button onClick={() => navigate('/')} > back </button> 
            <h1> solar systems planets </h1>


            
            
        </div>
    )



























}


export default function SolarSystemscreen() {
  return <h1>Näkymä 1</h1>;
}
