// pages/index.js

import { useState } from 'react';

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

    setMensagem(`⚠️ ${nome.toUpperCase()} ENTROU NA REDE. DISPOSITIVO COMPROMETIDO.`);
    setEnviado(true);
    setAlerta(true);

    // Envia para o Firebase (opcional: ainda vamos conectar)
    // Aqui só simula

    setTimeout(() => {
      setAlerta(false);
      setAtaque(true);
      const audio = document.getElementById("somAlerta");
      if (audio) audio.play();

      setTimeout(() => {
        setAtaque(false);
        setFinal(true);
      }, 4000);
    }, 4000);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px' }}>
      {!enviado && (
        <form onSubmit={enviarFormulario} style={{ maxWidth: '400px', margin: '0 auto' }}>
          <h2>Projeto Educativo: Bomba-Lógica</h2>
          <p>Preencha seu nome abaixo. Ao enviar, você estará participando de uma simulação educativa.</p>

          <label>Nome:</label><br />
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required /><br /><br />

          <label>Sobrenome:</label><br />
          <input type="text" value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} required /><br /><br />

          <button type="submit">Enviar</button>
        </form>
      )}

      {alerta && (
        <div style={{
          position: 'fixed', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
          backgroundColor: 'black', color: 'red', padding: '30px', fontSize: '22px',
          borderRadius: '10px', boxShadow: '0 0 20px red'
        }}>
          {mensagem}
        </div>
      )}

      {ataque && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'black', color: 'red', fontSize: '24px', fontWeight: 'bold',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          animation: 'piscar 0.8s infinite', zIndex: 9999
        }}>
          ⚠️ ATENÇÃO! SEU DISPOSITIVO FOI COMPROMETIDO!<br /><br />
          VOCÊ CLICOU EM UM LINK DESCONHECIDO SEM SABER A ORIGEM.
        </div>
      )}

      {final && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          backgroundColor: 'black', color: 'red', padding: '30px',
          fontSize: '20px', fontWeight: 'bold', borderRadius: '10px'
        }}>
          VIU COMO É FÁCIL TE ENGANAR?<br /><br />
          TOME CUIDADO AO ESCANEAR QR CODES,<br />
          OU SEU DISPOSITIVO PODE SER DANIFICADO.
        </div>
      )}

      {/* 🔊 SOM */}
      <audio id="somAlerta" src="/alerta.mp3" preload="auto" />
    </div>
  );
}
