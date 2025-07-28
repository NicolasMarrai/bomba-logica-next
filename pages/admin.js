import { useState, useEffect } from 'react';
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../lib/firebase';

export default function Admin() {
  const [cadastros, setCadastros] = useState([]);
  const [senha, setSenha] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [loading, setLoading] = useState(false);

  // SENHA - Altere para uma mais segura!
  const SENHA_ADMIN = 'bomba123';

  useEffect(() => {
    if (autenticado) {
      setLoading(true);
      const cadastrosRef = ref(database, 'nomes');
      
      const unsubscribe = onValue(cadastrosRef, (snapshot) => {
        const data = snapshot.val();
        console.log('Dados recebidos:', data);
        
        if (data) {
          const lista = Object.entries(data).map(([id, item]) => ({ 
            id, 
            ...item 
          }));
          setCadastros(lista);
        } else {
          console.log('Nenhum cadastro encontrado.');
          setCadastros([]);
        }
        setLoading(false);
      });

      return () => unsubscribe();
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
    if (confirm('Excluir este cadastro permanentemente?')) {
      remove(ref(database, `nomes/${id}`));
    }
  };

  if (!autenticado) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h1 style={styles.loginTitle}>Acesso Restrito</h1>
          <form onSubmit={handleLogin} style={styles.loginForm}>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite a senha de administrador"
              style={styles.loginInput}
              required
            />
            <button type="submit" style={styles.loginButton}>
              Acessar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.adminContainer}>
      <div style={styles.header}>
        <h1 style={styles.title}>Cadastros Realizados ({cadastros.length})</h1>
        <button 
          onClick={() => setAutenticado(false)} 
          style={styles.logoutButton}
        >
          Sair
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>
          <p>Carregando...</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.tableHeader}>Nome</th>
                <th style={styles.tableHeader}>Sobrenome</th>
                <th style={styles.tableHeader}>Data/Hora</th>
                <th style={styles.tableHeader}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {cadastros.map((pessoa) => (
                <tr key={pessoa.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{pessoa.nome}</td>
                  <td style={styles.tableCell}>{pessoa.sobrenome}</td>
                  <td style={styles.tableCell}>
                    {new Date(pessoa.timestamp).toLocaleString('pt-BR')}
                  </td>
                  <td style={styles.tableCell}>
                    <button 
                      onClick={() => deletarCadastro(pessoa.id)}
                      style={styles.deleteButton}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: "'Segoe UI', Roboto, sans-serif"
  },
  loginCard: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center'
  },
  loginTitle: {
    color: '#333',
    marginBottom: '1.5rem',
    fontSize: '1.5rem'
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  loginInput: {
    padding: '12px 15px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border 0.3s',
    ':focus': {
      borderColor: '#4CAF50'
    }
  },
  loginButton: {
    padding: '12px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background 0.3s',
    ':hover': {
      background: '#45a049'
    }
  },
  adminContainer: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', Roboto, sans-serif"
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    color: '#333',
    fontSize: '1.8rem',
    margin: 0
  },
  logoutButton: {
    padding: '10px 20px',
    background: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background 0.3s',
    ':hover': {
      background: '#d32f2f'
    }
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    color: '#666'
  },
  tableContainer: {
    overflowX: 'auto',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    borderRadius: '10px',
    backgroundColor: 'white'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  tableHeaderRow: {
    backgroundColor: '#4CAF50',
    color: 'white'
  },
  tableHeader: {
    padding: '15px',
    textAlign: 'left',
    fontWeight: '600'
  },
  tableRow: {
    borderBottom: '1px solid #eee',
    ':hover': {
      backgroundColor: '#f9f9f9'
    }
  },
  tableCell: {
    padding: '15px',
    color: '#555'
  },
  deleteButton: {
    padding: '8px 16px',
    background: '#ff9800',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background 0.3s',
    ':hover': {
      background: '#e68a00'
    }
  }
};