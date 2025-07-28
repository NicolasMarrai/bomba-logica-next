// pages/index.js
import { useState } from 'react';
import { ref, push } from 'firebase/database';
import { database } from '../lib/firebase';

export default function Home() {
  const [enviado, setEnviado] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [alerta, setAlerta] = useState(false);
  const [ataque, setAtaque] = useState(false);
  const [final, setFinal] = useState(false);
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');

  const enviarFormulario = async (e) => {
    e.preventDefault();

    if (!nome || !sobrenome) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      await push(ref(database, 'nomes'), {
        nome: nome,
        sobrenome: sobrenome,
        timestamp: Date.now()
      });

      setMensagem(`⚠️ ${nome.toUpperCase()} ENTROU NA REDE. DISPOSITIVO COMPROMETIDO.`);
      setEnviado(true);
      setAlerta(true);

      setTimeout(() => {
        setAlerta(false);
        setAtaque(true);
        new Audio('/alerta.mp3').play();

        setTimeout(() => {
          setAtaque(false);
          setFinal(true);
        }, 4000);
      }, 4000);

    } catch (error) {
      console.error("Erro ao salvar no Firebase:", error);
      alert("Ocorreu um erro. Tente novamente.");
    }
  };

  // Estilos responsivos
  const styles = {
    container: {
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      textAlign: 'center',
      padding: '20px',
      maxWidth: '100%',
      minHeight: '100vh',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      boxSizing: 'border-box'
    },
    formContainer: {
      background: 'linear-gradient(145deg, #1a1a1a, #2d2d2d)',
      padding: '25px',
      borderRadius: '15px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      border: '1px solid rgba(255,255,255,0.1)',
      maxWidth: '450px',
      margin: '0 auto',
      width: '90%'
    },
    title: {
      color: '#fff',
      fontSize: 'clamp(1.5rem, 5vw, 2rem)',
      marginBottom: '15px',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
    },
    subtitle: {
      color: '#aaa',
      fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
      marginBottom: '25px',
      lineHeight: '1.5'
    },
    input: {
      padding: '15px',
      fontSize: '16px',
      borderRadius: '10px',
      border: 'none',
      marginBottom: '15px',
      width: '100%',
      boxSizing: 'border-box',
      background: 'rgba(255,255,255,0.9)',
      boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)',
      color: '#000' // Adicionado para garantir texto preto
    },
    button: {
      padding: '15px',
      background: 'linear-gradient(135deg, #0061ff, #60efff)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      width: '100%',
      boxShadow: '0 4px 15px rgba(0, 97, 255, 0.3)',
      transition: 'transform 0.2s, box-shadow 0.2s'
    },
    alertBox: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'linear-gradient(145deg, #ff0000, #8b0000)',
      color: 'white',
      padding: '25px',
      fontSize: 'clamp(1rem, 4vw, 1.4rem)',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(255,0,0,0.4)',
      zIndex: 1000,
      width: '85%',
      maxWidth: '400px',
      textAlign: 'center',
      border: '2px solid rgba(255,255,255,0.2)'
    },
    attackScreen: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(45deg, #000000, #3a0000)',
      color: '#ff4d4d',
      fontSize: 'clamp(1.2rem, 5vw, 1.8rem)',
      fontWeight: 'bold',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      zIndex: 9999,
      padding: '20px',
      lineHeight: '1.4'
    },
    finalMessage: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'linear-gradient(145deg, #000000, #1a1a1a)',
      color: '#ff4d4d',
      padding: '30px',
      fontSize: 'clamp(1rem, 4vw, 1.4rem)',
      fontWeight: 'bold',
      borderRadius: '15px',
      textAlign: 'center',
      zIndex: 9999,
      width: '85%',
      maxWidth: '400px',
      boxShadow: '0 10px 30px rgba(255,0,0,0.3)',
      border: '2px solid rgba(255,0,0,0.2)'
    },
    closeHint: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: '0.8rem',
      marginTop: '20px'
    }
  };

  return (
    <div style={styles.container}>
      {!enviado && (
        <div style={styles.formContainer}>
          <h1 style={styles.title}>Projeto Educativo: Bomba-Lógica</h1>
          <p style={styles.subtitle}>
            Preencha seu nome abaixo para participar de uma simulação educativa sobre segurança digital.
          </p>

          <form onSubmit={enviarFormulario} style={{ display: 'flex', flexDirection: 'column' }}>
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={styles.input}
              required
            />

            <input
              type="text"
              placeholder="Sobrenome"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              style={styles.input}
              required
            />

            <button 
              type="submit"
              style={styles.button}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              ATIVAR SIMULAÇÃO
            </button>
          </form>
        </div>
      )}

      {alerta && (
        <div style={styles.alertBox}>
          {mensagem}
        </div>
      )}

      {ataque && (
        <div style={styles.attackScreen}>
          ⚠️ ATENÇÃO! SEU DISPOSITIVO FOI COMPROMETIDO!
          <br /><br />
          VOCÊ CLICOU EM UM LINK DESCONHECIDO SEM SABER A ORIGEM.
        </div>
      )}

      {final && (
        <div 
          style={styles.finalMessage}
          onClick={() => {
            setFinal(false);
            setEnviado(false);
            setNome('');
            setSobrenome('');
          }}
        >
          VIU COMO É FÁCIL TE ENGANAR?
          <br /><br />
          TOME CUIDADO AO ESCANEAR QR CODES OU CLICAR EM LINKS DESCONHECIDOS.
          <br /><br />
          <span style={styles.closeHint}>(Toque para fechar)</span>
        </div>
      )}

      {/* Adicionando estilos globais inline */}
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 0.9; }
          100% { opacity: 1; }
        }
        body {
          background: #121212;
          margin: 0;
          padding: 0;
          color: white;
          transition: background 0.3s ease; /* Adicionado para transição suave */
        }
        input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(0, 97, 255, 0.5);
        }
      `}</style>
    </div>
  );
}