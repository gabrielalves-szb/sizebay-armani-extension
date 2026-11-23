import { useState, useRef, useEffect } from "react";
import "./App.css";
import { processCsvData } from "./processor";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  // Estado para saber se estamos no modo popup ou aba cheia
  const [isPopup, setIsPopup] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detecta se estamos rodando num popup pequeno ou numa aba grande
  useEffect(() => {
    if (window.innerWidth > 500) {
      setIsPopup(false);
    }
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Função para abrir a extensão em uma nova aba segura
  const handleOpenInTab = () => {
    if (chrome && chrome.tabs) {
      chrome.tabs.create({ url: "index.html" });
    } else {
      // Fallback para desenvolvimento local
      window.open(window.location.href, "_blank");
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("1. Arquivo selecionado:", file.name);
    setIsLoading(true);

    try {
      const textContent = await file.text();
      console.log("2. Arquivo lido. Tamanho:", textContent.length);

      const csvOutput = processCsvData(textContent);
      console.log(
        "3. Processamento concluído. Linhas:",
        csvOutput.split("\n").length
      );

      const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      if (typeof chrome !== "undefined" && chrome.downloads) {
        console.log("4. Tentando download via Chrome API...");
        chrome.downloads.download(
          {
            url: url,
            filename: "output_processed.csv",
            saveAs: true,
          },
          (downloadId) => {
            if (chrome.runtime.lastError) {
              console.error("ERRO:", chrome.runtime.lastError.message);
              alert("Erro: " + chrome.runtime.lastError.message);
            } else {
              console.log("Download iniciado! ID:", downloadId);
            }
          }
        );
      } else {
        console.log("4. Tentando download via Link HTML...");
        const a = document.createElement("a");
        a.href = url;
        a.download = "output_processed.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      setTimeout(() => window.URL.revokeObjectURL(url), 2000);
    } catch (error) {
      console.error("ERRO CRÍTICO:", error);
      alert("Erro ao processar arquivo: " + String(error));
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="extension-container">
      {/* Cabeçalho com botão de expandir */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: "15px",
        }}
      >
        <h2 style={{ margin: 0 }}>Armani Processor</h2>
        {isPopup && (
          <button
            onClick={handleOpenInTab}
            title="Abrir em nova aba para evitar erros"
            style={{
              padding: "5px 10px",
              fontSize: "0.8rem",
              background: "#444",
            }}
          >
            ↗ Expandir
          </button>
        )}
      </div>

      <p style={{ fontSize: "0.8rem", color: "#aaa", marginBottom: "20px" }}>
        {isPopup
          ? "Dica: Se o download falhar, clique em 'Expandir' acima."
          : "Modo Seguro: Pode processar arquivos sem interrupções."}
      </p>

      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {isLoading ? (
        <p className="loading">Processando...</p>
      ) : (
        <button onClick={handleButtonClick} style={{ width: "100%" }}>
          Selecionar CSV
        </button>
      )}
    </div>
  );
}

export default App;
