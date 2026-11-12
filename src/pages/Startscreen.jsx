//import external libraries
import {useNavigate} from "react-router-dom";
import {Rocket} from "lucide-react";
import { Container, Button } from 'react-bootstrap';


function Startscreen() {
    const navigate = useNavigate(); 


    // (1) function for the navigation to the next page
    // (2) lets add header and subheader 
    // (3) add button to navigate user to the next page
    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            background: 'radial-gradient(circle at center, #1B2735 0%, #090a0f 100%)',
            color: "white",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "20px"
        }}>
           
            <h1 style= {{
                fontSize: "3rem",
                marginBottom: "1px",
                letterSpacing: "0.1rem"
            }}> Solar System Explorer </h1>
            
            
            <div>
                <Container>
            <p style={{
                fontSize: "1.5rem",
                marginBottom: "2rem",
                letterSpacing: "0.05rem" 
            }} > Explore our solar system </p>

            <button onClick={() => {
                navigate("/solar-system")} 
            }
            onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.1)"}}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1.0)"}}

            style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: '15px 19px',
                fontSize: "1.3rem",
                fontWeight: "bold",
                color: "white",
                backgroundColor: 'black',
                border: "none",
                borderradius: "50px",
                cursor: "pointer",
                boxShadow: "0 0 25px rgba(9, 82, 137, 0.5)",
                transition: "transform 0.2s"
            }}
            
              > 
              <Rocket size = {25}/>
                start
            </button>
            </Container>
            </div>
        </div>
  );
  }

export default Startscreen;
