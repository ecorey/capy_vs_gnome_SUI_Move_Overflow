import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardContext } from './CardContext';

const EnterDefenseCards = () => {
    const navigate = useNavigate();
    const { player, setPlayer, player1, player2, handleChange } = useCardContext();
    const data = player === 'Player 1' ? player1 : player2;
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true); 
        setTimeout(() => {
            navigate('/outputdata');  
        }, 1500);  
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'Pixelify sans, sans-serif', maxWidth: '800px', margin: '40px auto', background: '#f0f0f0', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>Configure Cards</h2>
            <select
                value={player}
                onChange={e => setPlayer(e.target.value)}
                style={{ width: '100%', marginBottom: '20px', padding: '12px', fontSize: '16px', fontFamily: 'Pixelify sans' }}
            >
                <option value="Player 1">Player 1</option>
                <option value="Player 2">Player 2</option>
            </select>
            <input type="text" placeholder="General ID" value={data.generalId} onChange={e => handleChange(e, 'generalId')} style={{ width: '100%', marginBottom: '20px', padding: '12px', fontSize: '16px', fontFamily: 'Pixelify sans' }} />
            <input type="text" placeholder="Monster ID" value={data.monsterId} onChange={e => handleChange(e, 'monsterId')} style={{ width: '100%', marginBottom: '20px', padding: '12px', fontSize: '16px', fontFamily: 'Pixelify sans' }} />
            <input type="text" placeholder="Rider ID" value={data.riderId} onChange={e => handleChange(e, 'riderId')} style={{ width: '100%', marginBottom: '20px', padding: '12px', fontSize: '16px', fontFamily: 'Pixelify sans' }} />
            <input type="text" placeholder="Soldier ID" value={data.soldierId} onChange={e => handleChange(e, 'soldierId')} style={{ width: '100%', marginBottom: '20px', padding: '12px', fontSize: '16px', fontFamily: 'Pixelify sans' }} />
            <button onClick={handleSave} style={{ width: '100%', padding: '15px', backgroundColor: 'blue', color: 'white', fontSize: '18px', cursor: 'pointer', marginTop: '20px' }}>
                Save Configuration
            </button>
            {saved && <p style={{ color: 'green' }}>Data saved! Redirecting...</p>}
        </div>
    );
};

export default EnterDefenseCards;
