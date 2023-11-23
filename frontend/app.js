import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // 從後端 API 獲取資料
        axios.get('http://localhost:3002/data')
            .then((response) => {
                console.log('response:', response);
                setData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div>
            <h1>資料展示</h1>
            <ul>
                {data.map(item => (
                    <li key={item.id}>
                        {item.t_name} - {item.method}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
