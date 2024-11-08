//run command : npm run dev

import { useState } from 'react';
import { Book, Users, ArrowRight, Moon, Sun, Table2 } from 'lucide-react';
import './App.css';

function App() {

  
  const [totalBooks, setTotalBooks] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dpTable, setDpTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setDpTable([]);
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          total_books: parseInt(totalBooks),
          group_size: parseInt(groupSize)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Something went wrong');
      }

      const data = await response.json();
      setResult(data.result);
      setDpTable(data.dp_table);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={`app ${isDark ? 'dark' : 'light'}`}>
      <button
        onClick={() => setIsDark(!isDark)}
        className="theme-toggle"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="icon" />
        ) : (
          <Moon className="icon" />
        )}
      </button>

      <div className="container">
        <div className="card">
          <header className="header">
            <div className="logo-container">
              <Book className="logo" />
            </div>
            <h1>Book Arrangement Calculator</h1>
            <p>Calculate possible arrangements for your book collection</p>
          </header>

          <form onSubmit={handleSubmit} className="form">
            <div className="input-grid">
              <div className="input-group">
                <label>Total Books</label>
                <div className="input-wrapper">
                  <Book className="input-icon" />
                  <input
                    type="number"
                    value={totalBooks}
                    onChange={(e) => setTotalBooks(e.target.value)}
                    min="1"
                    disabled={loading}
                    placeholder="Enter number of books"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Group Size</label>
                <div className="input-wrapper">
                  <Users className="input-icon" />
                  <input
                    type="number"
                    value={groupSize}
                    onChange={(e) => setGroupSize(e.target.value)}
                    min="1"
                    disabled={loading}
                    placeholder="Enter group size"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? (
                <div className="spinner" />
              ) : (
                <>
                  Calculate
                  <ArrowRight className="button-icon" />
                </>
              )}
            </button>
          </form>
          

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}



          {result !== null && (
            <div className="result-card">
              <h3>Results</h3>
              <div className="result-content" style={{maxHeight: '100px', overflowY: 'auto'}}>
                <div style={{display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                  <span className="result-label" style={{marginRight: '10px'}}>Possible Arrangements:</span>
                  <span className="result-value">{result.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {dpTable.length > 0 && (
            <div className="table-section">
              <div className="table-header">
                <Table2 className="table-icon" />
                <h3>Dynamic Programming Table</h3>
              </div>
              <div className="table-wrapper">
                <table>
                  <tbody>
                    {dpTable.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className={
                              i === dpTable.length - 1 && j === row.length - 1
                                ? 'highlight'
                                : ''
                            }
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;