//import external libraries
import {useNavigate} from "react-router-dom";
import {rocket} from "lucide-react";

function Startscreen() {
    const navigate = useNavigate(); 


    // function for the navigation to the next page
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


            //header for the start screen
            <h1 style= {{
                fontSize: "3rem",
                marginBottom: "1px",
                letterSpacing: "0.1rem"
            }}> Solar System Explorer </h1>






        </div>
)
 

}


