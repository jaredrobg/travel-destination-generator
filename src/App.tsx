import { useState } from "react";
import type { FormEvent } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import type {Schema} from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";

import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});

function App(){
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (event: FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    setLoading(true);

    try{
      const formData = new FormData(event.currentTarget);
      const {data, errors} = await amplifyClient.queries.askBedrock({
        interests: [formData.get("interests")?.toString()||""],
      });

      if(!errors){
        setResult(data?.body || "No data requested");
      }
      else{
        console.log("Errors: ", errors);
      }
    } catch (error){
      alert(`An error occurred: ${error}`);
    } finally{
      setLoading(false);
    }
  }

  return(
    <div className="app-container">
      <div className="header-container">
        <h1 className="main-header">Travel Destination
          <span className="highlight"> AI</span> 
        </h1>
        <p className="description">
          My personal generator
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="search-container">
          <label className="wide-input-label">Simply type in your interests</label>
          <input
            type="text"
            className="wide-input"
            id="interests"
            name="interests"
            placeholder="beach, hiking, culture..." 
          />

          <button type="submit" className="search-button">Go</button>
        </div>
      </form>

      <div className="result-container">
        {loading ? (
          <div className="loader-container">
            <p>Loeading...</p>
            <Loader size="large"/>
            <Placeholder size="large"/>
            <Placeholder size="large"/>
            <Placeholder size="large"/>
          </div>
        ):(
          result && <p className="result">{result}</p>
        )}
      </div>
    </div>
  )
}

export default App;