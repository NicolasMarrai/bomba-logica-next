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
      // Envia para o Firebase
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

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      textAlign: 'center', 
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      {!enviado && (
        <form onSubmit={enviarFormulario} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h2>Projeto Educativo: Bomba-Lógica</h2>
          <p>Preencha seu nome abaixo. Ao enviar, você estará participando de uma simulação educativa.</p>

          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{ padding: '10px', fontSize: '16px' }}
            required
          />

          <input
            type="text"
            placeholder="Sobrenome"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
            style={{ padding: '10px', fontSize: '16px' }}
            required
          />

          <button 
            type="submit"
            style={{
              padding: '10px',
              background: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Enviar
          </button>
        </form>
      )}

      {alerta && (
        <div style={{
          position: 'fixed',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'black',
          color: 'red',
          padding: '30px',
          fontSize: '22px',
          borderRadius: '10px',
          boxShadow: '0 0 20px red',
          zIndex: 1000
        }}>
          {mensagem}
        </div>
      )}

      {ataque && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'black',
          color: 'red',
          fontSize: '24px',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          animation: 'piscar 0.8s infinite',
          zIndex: 9999
        }}>
          ⚠️ ATENÇÃO! SEU DISPOSITIVO FOI COMPROMETIDO!
          <br /><br />
          VOCÊ CLICOU EM UM LINK DESCONHECIDO SEM SABER A ORIGEM.
        </div>
      )}

      {final && (
        <div 
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'black',
            color: 'red',
            padding: '30px',
            fontSize: '20px',
            fontWeight: 'bold',
            borderRadius: '10px',
            textAlign: 'center',
            zIndex: 9999
          }}
          onClick={() => {
            setFinal(false);
            setEnviado(false);
            setNome('');
            setSobrenome('');
          }}
        >
          VIU COMO É FÁCIL TE ENGANAR?
          <br /><br />
          TOME CUIDADO AO ESCANEAR QR CODES,
          <br />
          OU SEU DISPOSITIVO PODE SER DANIFICADO.
          <br /><br />
          <small>(Clique para fechar)</small>
        </div>
      )}
    </div>
  );
}