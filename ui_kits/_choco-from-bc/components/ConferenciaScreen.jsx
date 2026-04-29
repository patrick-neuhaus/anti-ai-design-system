// ConferenciaScreen — barcode bipagem screen with progress and divergence.
const ConferenciaScreen = () => {
  const [scanned, setScanned] = React.useState(7);
  const [code, setCode] = React.useState("");
  const total = 12;
  const pct = Math.round((scanned / total) * 100);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim()) { setScanned((n) => Math.min(total, n + 1)); setCode(""); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PageHeader
        title="Conferência de Expedição"
        subtitle="Escolha o romaneio para conferir e bipe os códigos."
        actions={<button className="btn btn-outline btn-sm"><Icon.ChevronLeft size={14} /> Voltar</button>}
      />

      {/* Romaneio context */}
      <div className="card" style={{ padding: 20, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
        <Field label="Romaneio" value="RM-2024-001846" mono />
        <Field label="Transportadora" value="Expresso Mineiro" />
        <Field label="Placa" value="DEF2E45" mono />
        <Field label="Motorista" value="Marcos Silva" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Bipagem */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "hsla(33 47% 53% / .1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon.ScanBarcode size={20} color="hsl(33 47% 53%)" />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>Bipagem</h3>
              <p style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Aponte o leitor para o código de barras</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input className="field mono" autoFocus placeholder="Código EAN ou SKU"
              value={code} onChange={(e) => setCode(e.target.value)} />
            <button type="submit" className="btn btn-primary">Bipar</button>
          </form>

          <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ fontWeight: 500 }}>Progresso</span>
            <span className="mono">{scanned}/{total} caixas</span>
          </div>
          <div style={{ height: 8, background: "var(--muted)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: "hsl(338 55% 23%)", transition: "width .25s ease-out" }}/>
          </div>
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 6 }}>{pct}% concluído</div>

          <div style={{ marginTop: 16, padding: 12, background: "hsla(0 100% 50% / .06)", border: "1px solid hsla(0 100% 50% / .2)", borderRadius: 12, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Icon.AlertCircle size={16} color="hsl(0 100% 50%)" />
            <div style={{ fontSize: 12 }}>
              <strong style={{ color: "hsl(0 100% 50%)" }}>1 divergência</strong>
              <span className="muted"> — EAN <span className="mono">7891234567890</span> não encontrado.</span>
            </div>
          </div>
        </div>

        {/* SKU breakdown */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600 }}>Itens esperados</h3>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2 }}>Lista de SKUs do romaneio</p>
          </div>
          <table className="tbl">
            <thead><tr>
              <th>SKU</th><th>Descrição</th>
              <th style={{ textAlign: "right" }}>Esperado</th>
              <th style={{ textAlign: "right" }}>Bipado</th>
              <th></th>
            </tr></thead>
            <tbody>
              {[
                { sku: "BC-CALL-811-2.5",  desc: "Callebaut 811 Dark Callets 2,5kg", exp: 4, bip: 4 },
                { sku: "BC-CALL-823-2.5",  desc: "Callebaut 823 Milk Callets 2,5kg", exp: 4, bip: 3 },
                { sku: "BC-CALL-W2-2.5",   desc: "Callebaut W2 White Callets 2,5kg", exp: 2, bip: 0 },
                { sku: "BC-CACAO-100",     desc: "Cocoa Powder 100% 1kg",            exp: 2, bip: 0 },
              ].map((r) => {
                const ok = r.bip === r.exp;
                return (
                  <tr key={r.sku}>
                    <td className="mono" style={{ fontSize: 12 }}>{r.sku}</td>
                    <td>{r.desc}</td>
                    <td style={{ textAlign: "right" }}>{r.exp}</td>
                    <td style={{ textAlign: "right" }} className="mono">{r.bip}</td>
                    <td style={{ width: 32 }}>
                      {ok ? <Icon.CheckCircle size={16} color="hsl(152 85% 30%)" />
                          : <span className="muted">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: 16, borderTop: "1px solid var(--border)" }}>
            <button className="btn btn-outline btn-sm">Adicionar volume extra</button>
            <button className="btn btn-primary btn-sm">Finalizar conferência</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value, mono }) => (
  <div>
    <div className="eyebrow" style={{ marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 14, fontWeight: 500, fontFamily: mono ? "var(--font-mono)" : "inherit" }}>{value}</div>
  </div>
);

window.ConferenciaScreen = ConferenciaScreen;
