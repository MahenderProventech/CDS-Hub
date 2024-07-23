import React, { useState } from 'react';

const FormulaValidationApi = ({ roundeValue, expression, actualFormula, onAddVariable ,resData}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [responseData, setResponseData] = useState(null);

    const handleValidation = () => {
        setIsLoading(true);
        setError(null);
       
        const apiUrl = `http://172.26.8.225:8086/api/Formulas/FormulaValidation?expression=${encodeURIComponent(actualFormula)}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then(data => {
                // Assuming responseData.item2 contains raw value data
                const rawData = data.item2; // Access raw value data from the API response
                setResponseData({ item2: rawData }); // Set responseData with raw value data
                resData({ item2: rawData })
                setIsLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setIsLoading(false);    
            });
    };

    const handleAddAsVariable = () => {
        if (responseData) {
            const roundedValue = responseData.item2.toFixed(roundeValue);
            onAddVariable(roundedValue);
            // saveData(responseData); // Pass responseData to saveData
            // alert(roundedValue);
            console.log("Raw Value",responseData.item2);
        }
    };

    return (
        <div>
            {error && <div>Error: {error}</div>}
            {/* {responseData && (
                <div>
                    <p>Raw Value: {responseData.item2}</p>
                    <p>Rounded Value: {responseData.item2.toFixed(roundeValue)}</p>
                  
                </div>
            )}
            {!isLoading && !responseData && (
                <button onClick={handleValidation}>
                    Validate Formula
                </button>
            )} */}
        </div>
    );
};

 

export default FormulaValidationApi;
