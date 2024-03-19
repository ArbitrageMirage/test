import React, { useState } from 'react';

const RequestComponent = () => {
    const [inputValue, setInputValue] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [requestsSent, setRequestsSent] = useState(0);
    const [responses, setResponses] = useState([]);

    const handleStartButtonClick = async () => {
        setIsButtonDisabled(true);
        const concurrencyLimit = parseInt(inputValue);
        const requestsPerSecond = parseInt(inputValue);
        let receivedResponses = 0;

        for (let i = 1; i <= 1000; i++) {
            if (i % concurrencyLimit === 0) {
                await new Promise(resolve => setTimeout(resolve, 1000 / requestsPerSecond));
            }

            fetch('http://localhost:3001/api', {
                method: 'POST',
                body: JSON.stringify({ index: i }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Request failed');
                    }
                })
                .then(data => {
                    setResponses(prevResponses => [...prevResponses, data.index]);
                    setRequestsSent(prevCount => prevCount + 1);
                    receivedResponses++;
                })
                .catch(error => {
                    console.error('Error during fetch:', error);
                });

            // Check if received responses reached 1000
            if (receivedResponses === 1000) {
                setIsButtonDisabled(false);
            }
        }
    };

    return (
        <div>
            <input
                type="number"
                min="0"
                max="100"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                required
            />
            <button onClick={handleStartButtonClick} disabled={isButtonDisabled}>
                Start
            </button>
            <p>Requests Sent: {requestsSent}</p>
            <ul>
                {responses.map((response, index) => (
                    <li key={index}>Response Index: {response}</li>
                ))}
            </ul>
        </div>
    );
};

export default RequestComponent;
