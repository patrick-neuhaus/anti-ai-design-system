// ui_kits/default/components/forms/FileUpload.jsx
// FileUpload — dropzone with drag/drop + click-to-select. Single or multi.
// When to use: file capture in forms (CSV import, image upload).
// When NOT to use: paste-only flows. Async chunked uploads (use specialized lib).

const FileUpload = ({ accept, multiple = false, onFiles, disabled = false, hint, maxSizeMB }) => {
  const inputRef = React.useRef(null);
  const [drag, setDrag] = React.useState(false);
  const [files, setFiles] = React.useState([]);

  const accept_files = (list) => {
    const arr = Array.from(list ?? []);
    setFiles(multiple ? arr : arr.slice(0, 1));
    onFiles?.(multiple ? arr : arr[0] ?? null);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    if (disabled) return;
    accept_files(e.dataTransfer.files);
  };

  return (
    <div>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        style={{
          border: `1.5px dashed hsl(var(--${drag ? "ring" : "border"}))`,
          borderRadius: 12,
          padding: "28px 16px",
          textAlign: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          background: drag ? "hsl(var(--ring) / .06)" : "hsl(var(--muted) / .4)",
          transition: "background-color .15s, border-color .15s",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <div style={{
          display: "inline-flex", width: 40, height: 40, borderRadius: 10,
          background: "hsl(var(--card))", color: "hsl(var(--muted-foreground))",
          alignItems: "center", justifyContent: "center", marginBottom: 10,
          border: "1px solid hsl(var(--border))",
        }}>
          <Icon.Upload size={18} />
        </div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "hsl(var(--foreground))" }}>
          Clique pra escolher ou arraste aqui
        </div>
        {hint && <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>{hint}</div>}
        {maxSizeMB && (
          <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>
            Máx {maxSizeMB} MB{accept ? ` · ${accept}` : ""}
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => accept_files(e.target.files)}
        style={{ display: "none" }}
        disabled={disabled}
      />
      {files.length > 0 && (
        <ul style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6, listStyle: "none", padding: 0 }}>
          {files.map((f, i) => (
            <li key={i} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 10px", borderRadius: 8,
              background: "hsl(var(--muted))",
              fontSize: 12, color: "hsl(var(--foreground))",
            }}>
              <Icon.FileText size={12} />
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
              <span style={{ color: "hsl(var(--muted-foreground))" }}>{(f.size / 1024).toFixed(1)} KB</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

window.FileUpload = FileUpload;
