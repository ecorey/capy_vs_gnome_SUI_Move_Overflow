import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardContext } from './CardContext'; 
import { useWallet } from '@suiet/wallet-kit';  
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Package, RANDOM } from '../../../scripts/config';

// UNDER CONSTRUCTION

const Turn = () => {
    const [message, setMessage] = useState('');
    const fullText = "Would you like to ATTACK or PASS.";
    const [cardMessage, setCardMessage] = useState('');
    const cardFullText = "What card would you like to attack with?";
    const [actionValue, setActionValue] = useState(null);
    const [cardType, setCardType] = useState('');
    const [defenseChoice, setDefenseChoice] = useState('');
    const [isFinal, setIsFinal] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState('Player 1'); 
    const { player1, player2 } = useCardContext();  
    const navigate = useNavigate();
    const { signAndExecuteTransactionBlock } = useWallet(); 

    // Read game and turn key from local storage
    const gameSetup = JSON.parse(localStorage.getItem('gameSetup')) || { game: "Not set", turnkey: "Not set" };
    const GAME = gameSetup.game;
    const TurnKey = gameSetup.turnkey;

    // Define player addresses
    const playerOneAddress = player1.address;
    const playerTwoAddress = player2.address;

    // Get player cards based on currentPlayer
    const playerCards = currentPlayer === 'Player 1' ? player1 : player2;
    const opponentCards = currentPlayer === 'Player 1' ? player2 : player1;

    // gets card ids for attacker
    const possible_attack_general = playerCards.generalId;
    const possible_attack_monster = playerCards.monsterId;
    const possible_attack_rider = playerCards.riderId;
    const possible_attack_soldier = playerCards.soldierId;

    // gets card ids for defender
    const possible_defense_general = opponentCards.generalId;
    const possible_defense_monster = opponentCards.monsterId;
    const possible_defense_rider = opponentCards.riderId;
    const possible_defense_soldier = opponentCards.soldierId;

    // State variable for the chosen attack card
    const [AttackCard, setAttackCard] = useState('');

    useEffect(() => {
        if (message.length < fullText.length) {
            const timer = setTimeout(() => {
                setMessage(currentMessage => currentMessage + fullText.charAt(message.length));
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [message, fullText]);

    useEffect(() => {
        if (actionValue === 55 && cardMessage.length < cardFullText.length) {
            const timer = setTimeout(() => {
                setCardMessage(currentMessage => currentMessage + cardFullText.charAt(cardMessage.length));
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [cardMessage, cardFullText, actionValue]);

    const handleNewChange = (e) => {
        if (!isFinal) {
            setActionValue(Number(e.target.value));
        }
    };

    const handleCardTypeChange = (e) => {
        if (!isFinal) {
            setCardType(e.target.value);
        }
    };

    const handleDefenseChoiceChange = (e) => {
        setDefenseChoice(Number(e.target.value));
    };

    const handleTurn = async () => {
        if (!AttackCard) {
            console.error('AttackCard is not set');
            return;
        }

        const txb = new TransactionBlock();
        txb.setGasBudget(1000000000);

        txb.moveCall({
            target: `${Package}::card_deck::turn_trial`,
            arguments: [
                txb.object(RANDOM),
                txb.object(TurnKey),  
                txb.object(GAME),
                txb.object(AttackCard),
                txb.object(currentPlayer === 'Player 1' ? player1.confirmDeck : player2.confirmDeck),
                txb.pure(defenseChoice),
                txb.object(currentPlayer === 'Player 1' ? player2.confirmDeck : player1.confirmDeck),
                txb.pure(playerOneAddress),
                txb.pure(playerTwoAddress),
                txb.object(possible_defense_general),
                txb.object(possible_defense_monster),
                txb.object(possible_defense_rider),
                txb.object(possible_defense_soldier),
            ],
        });

        try {
            const gameData = await signAndExecuteTransactionBlock({ transactionBlock: txb });
            console.log('Game Started!', gameData);
            alert(`Congrats! Game Started! \n Digest: ${gameData.digest}`);
        } catch (e) {
            console.error('Sorry, Game NOT Started', e);
        }
    };

    const handleButtonClick = () => {
        // Set the correct attack card based on card type
        if (cardType === "general") {
            setAttackCard(possible_attack_general);
        } else if (cardType === "monster") {
            setAttackCard(possible_attack_monster);
        } else if (cardType === "rider") {
            setAttackCard(possible_attack_rider);
        } else if (cardType === "soldier") {
            setAttackCard(possible_attack_soldier);
        }

        setIsFinal(true);
    };

    useEffect(() => {
        if (isFinal) {
            handleTurn();
        }
    }, [isFinal, AttackCard]); // Added AttackCard to the dependency array

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '20px auto', textAlign: 'center', fontFamily: 'Pixelify sans, sans-serif', whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
            <select
                onChange={(e) => setCurrentPlayer(e.target.value)}
                style={{ padding: '10px', marginBottom: '20px', fontFamily: 'Pixelify sans', fontSize: '16px' }}
            >
                <option value="Player 1">Player 1</option>
                <option value="Player 2">Player 2</option>
            </select>
            <div style={scrollTextStyle}>
                {message}
            </div>
            {message.length === fullText.length && !isFinal && (
                <select style={selectStyle} onChange={handleNewChange}>
                    <option value="">Select Action</option>
                    <option value="55">ATTACK</option>
                    <option value="77">PASS</option>
                </select>
            )}
            {actionValue === 55 && cardMessage && !isFinal && (
                <div style={{ marginTop: '20px' }}>
                    <p style={scrollTextStyle}>{cardMessage}</p>
                    <select style={selectStyle} onChange={handleCardTypeChange}>
                        <option value="">Select Card</option>
                        <option value="general">General</option>
                        <option value="monster">Monster</option>
                        <option value="rider">Rider</option>
                        <option value="soldier">Soldier</option>
                    </select>
                    <select style={selectStyle} onChange={handleDefenseChoiceChange}>
                        <option value="">Select Defense</option>
                        <option value="1">Backline Defense Stance</option>
                        <option value="2">Frontline Defense Stance</option>
                    </select>
                </div>
            )}
            {actionValue === 55 && cardType && defenseChoice && !isFinal && (
                <button 
                    onClick={handleButtonClick}
                    style={{ width: '100%', padding: '10px', marginTop: '20px', backgroundColor: 'blue', color: 'white', fontSize: '16px', cursor: 'pointer' }}
                >
                    Perform Battle Action
                </button>
            )}
            {isFinal && (
                <>
                    <p style={scrollTextStyle}>
                        Selected Action: {actionValue === 55 ? 'ATTACK' : 'PASS'}
                        {cardType && ` with ${cardType}`}, Defense: {defenseChoice}
                    </p>
                    <button 
                        onClick={() => navigate('/')}
                        style={{ width: '100%', padding: '10px', marginTop: '20px', backgroundColor: 'blue', color: 'white', fontSize: '16px', cursor: 'pointer' }}
                    >
                        Home
                    </button>
                </>
            )}
        </div>
    );
};

const scrollTextStyle = {
    backgroundColor: '#232323',
    color: 'white',
    fontFamily: 'Pixelify sans',
    padding: '10px',
    fontSize: '22px',
    overflow: 'hidden',
    minHeight: '50px',
    margin: '10px 0'
};

const selectStyle = {
    marginTop: '10px',
    padding: '10px',
    fontFamily: 'Pixelify sans',
    fontSize: '16px',
};

export default Turn;
