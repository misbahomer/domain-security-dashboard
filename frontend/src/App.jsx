
import { useState } from "react";
import "./App.css";

function App() {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkDomain() {
    setResults(null);
    setError("");

    if (!domain.trim()) {
      setError("Please enter a domain.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/dns/all?domain=${encodeURIComponent(domain.trim())}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "DNS lookup failed.");
      }

      setResults(data);
    } catch (err) {
      setError(err.message || "Unable to contact the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>Domain Security Dashboard</h1>
      <p>Check DNS information for a domain.</p>

      <div className="search">
        <input
          type="text"
          placeholder="example.com"
          value={domain}
          onChange={(event) => setDomain(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") checkDomain();
          }}
        />

        <button onClick={checkDomain} disabled={loading}>
          {loading ? "Checking..." : "Check Domain"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {results !== null && (
        <section>
          <h2>DNS Results</h2>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </section>
      )}
    </main>
  );
}

export default App;
