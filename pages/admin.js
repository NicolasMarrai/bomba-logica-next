// pages/admin.js
import { useState, useEffect } from 'react';
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../lib/firebase';

export default function Admin() {
  const [cadastros, setCadastros] = useState([]);
  const [senha, setSenha] = useState('');
  const [autenticado, setAutenticado] = useState(false);

  // SENHA DE ACESSO (altere para uma senha segura)
  const SENHA_ADMIN = 'bomba123';

  useEffect(() => {
    if (autenticado) {
      const cadastrosRef = ref(database, 'nomes');
      onValue(cadastrosRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const lista = Object.entries(data).map(([id, valor]) => ({ id, ...valor }));
          setCadastros(lista);
        }
      });
    }
  }, [autenticado]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (senha === SENHA_ADMIN) {
      setAutenticado(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  const deletarCadastro = (id) => {
    if (confirm('Tem certeza que deseja excluir este cadastro?')) {
      remove(ref(database, `nomes/${id}`));
    }
  };

  if (!autenticado) {
    return (
      <div style={styles.container}>
        <h1>Acesso Restrito</h1>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite a senha de administrador"
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Acessar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>Cadastros Realizados ({cadastros.length})</h1>
      
      <button 
        onClick={() => setAutenticado(false)} 
        style={{ ...styles.button, background: '#f44336' }}
      >
        Sair
      </button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cadastros.map((pessoa) => (
            <tr key={pessoa.id}>
              <td>{pessoa.nome}</td>
              <td>{pessoa.sobrenome}</td>
              <td>
                <button 
                  onClick={() => deletarCadastro(pessoa.id)}
                  style={{ ...styles.button, background: '#ff9800' }}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    margin: '20px 0'
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  button: {
    padding: '10px 15px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  }
};