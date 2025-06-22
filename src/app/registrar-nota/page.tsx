"use client";
import React, { useState, useEffect } from "react";

const paymentOptions = [
  "A vista",
  "10 dias",
  "30 dias",
  "em 2x iguais",
  "em 3x iguais",
];

interface Produto {
  codigo: string;
  quantidade: number;
  valor: number;
}

export default function RegistrarNota() {
  const [numeroOC, setNumeroOC] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [formaPagamento, setFormaPagamento] = useState(paymentOptions[0]);
  const [produtos, setProdutos] = useState<Produto[]>([
    { codigo: "", quantidade: 1, valor: 0 },
  ]);
  const [frete, setFrete] = useState(0);

  const API_URL = "https://api.exemplo.com/dados";
  const STORAGE_KEY = "dadosApi";

  useEffect(() => {
    const fetchAndStore = async () => {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (parsed.data && parsed.dataAtualizacao) {
            const dataArmazenada = new Date(parsed.dataAtualizacao);
            const agora = new Date();
            const diffDias =
              (agora.getTime() - dataArmazenada.getTime()) /
              (1000 * 60 * 60 * 24);
            if (diffDias <= 7) return; 
          }
        } catch {}
      }
      // Buscar da API
      try {
        const resp = await fetch(API_URL);
        if (!resp.ok) throw new Error("Erro ao buscar API");
        const data = await resp.json();
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ data, dataAtualizacao: new Date().toISOString() })
        );
      } catch (err) {
        // Trate o erro se necessário
      }
    };
    fetchAndStore();
  }, []);

  const handleProdutoChange = (
    index: number,
    field: keyof Produto,
    value: any
  ) => {
    const novosProdutos = [...produtos];
    novosProdutos[index][field] =
      field === "quantidade" || field === "valor" ? Number(value) : value;
    setProdutos(novosProdutos);
  };

  const adicionarProduto = () => {
    setProdutos([...produtos, { codigo: "", quantidade: 1, valor: 0 }]);
  };

  const removerProduto = (index: number) => {
    if (produtos.length === 1) return;
    setProdutos(produtos.filter((_, i) => i !== index));
  };

  const total =
    produtos.reduce((acc, p) => acc + p.quantidade * p.valor, 0) +
    Number(frete);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode enviar os dados para uma API ou processar como desejar
    alert(
      "Nota registrada com sucesso!\n" +
        JSON.stringify(
          { numeroOC, fornecedor, formaPagamento, produtos, frete, total },
          null,
          2
        )
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%)",
        color: "var(--foreground)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          maxWidth: 600,
          width: "100%",
          padding: 32,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 6px 32px #0002",
          color: "#222",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2
          style={{
            color: "#1e293b",
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 24,
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          Registrar Nota de Compra
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: "#334155", fontWeight: 500 }}>
                Número OC
                <input
                  required
                  value={numeroOC}
                  onChange={(e) => setNumeroOC(e.target.value)}
                  style={{
                    width: "100%",
                    color: "#222",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    borderRadius: 8,
                    padding: 8,
                    marginTop: 4,
                    fontSize: 15,
                  }}
                />
              </label>
            </div>
            <div style={{ flex: 2 }}>
              <label style={{ color: "#334155", fontWeight: 500 }}>
                Fornecedor
                <input
                  required
                  value={fornecedor}
                  onChange={(e) => setFornecedor(e.target.value)}
                  style={{
                    width: "100%",
                    color: "#222",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    borderRadius: 8,
                    padding: 8,
                    marginTop: 4,
                    fontSize: 15,
                  }}
                />
              </label>
            </div>
          </div>
          <div>
            <label style={{ color: "#334155", fontWeight: 500 }}>
              Forma de pagamento
              <select
                value={formaPagamento}
                onChange={(e) => setFormaPagamento(e.target.value)}
                style={{
                  width: "100%",
                  color: "#222",
                  background: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  borderRadius: 8,
                  padding: 8,
                  marginTop: 4,
                  fontSize: 15,
                }}
              >
                {paymentOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label
              style={{
                color: "#334155",
                fontWeight: 500,
                marginBottom: 8,
                display: "block",
              }}
            >
              Produtos
            </label>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                  background: "#f8fafc",
                  borderRadius: 8,
                  boxShadow: "0 1px 4px #0001",
                }}
              >
                <thead>
                  <tr style={{ background: "#e0e7ff" }}>
                    <th
                      style={{
                        color: "#334155",
                        fontWeight: 600,
                        padding: 8,
                        borderTopLeftRadius: 8,
                      }}
                    >
                      Cód. Produto
                    </th>
                    <th
                      style={{ color: "#334155", fontWeight: 600, padding: 8 }}
                    >
                      Quantidade
                    </th>
                    <th
                      style={{ color: "#334155", fontWeight: 600, padding: 8 }}
                    >
                      Valor
                    </th>
                    <th style={{ width: 60, borderTopRightRadius: 8 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((produto, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: 6 }}>
                        <input
                          required
                          value={produto.codigo}
                          onChange={(e) =>
                            handleProdutoChange(idx, "codigo", e.target.value)
                          }
                          style={{
                            width: "100%",
                            color: "#222",
                            background: "#fff",
                            border: "1px solid #cbd5e1",
                            borderRadius: 6,
                            padding: 6,
                            fontSize: 15,
                          }}
                        />
                      </td>
                      <td style={{ padding: 6 }}>
                        <input
                          required
                          type="number"
                          min={1}
                          value={produto.quantidade}
                          onChange={(e) =>
                            handleProdutoChange(
                              idx,
                              "quantidade",
                              e.target.value
                            )
                          }
                          style={{
                            width: 70,
                            color: "#222",
                            background: "#fff",
                            border: "1px solid #cbd5e1",
                            borderRadius: 6,
                            padding: 6,
                            fontSize: 15,
                          }}
                        />
                      </td>
                      <td style={{ padding: 6 }}>
                        <input
                          required
                          type="number"
                          min={0}
                          step={0.01}
                          value={produto.valor}
                          onChange={(e) =>
                            handleProdutoChange(idx, "valor", e.target.value)
                          }
                          style={{
                            width: 90,
                            color: "#222",
                            background: "#fff",
                            border: "1px solid #cbd5e1",
                            borderRadius: 6,
                            padding: 6,
                            fontSize: 15,
                          }}
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => removerProduto(idx)}
                          disabled={produtos.length === 1}
                          style={{
                            color: "#b91c1c",
                            background: "none",
                            border: "none",
                            cursor:
                              produtos.length === 1 ? "not-allowed" : "pointer",
                            fontWeight: 600,
                            fontSize: 15,
                          }}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={adicionarProduto}
              style={{
                marginTop: 12,
                color: "#fff",
                background: "#6366f1",
                border: "none",
                borderRadius: 6,
                padding: "8px 20px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 15,
                boxShadow: "0 1px 4px #0001",
              }}
            >
              Adicionar Produto
            </button>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <label style={{ color: "#334155", fontWeight: 500, flex: 1 }}>
              Frete
              <input
                type="number"
                min={0}
                step={0.01}
                value={frete}
                onChange={(e) => setFrete(Number(e.target.value))}
                style={{
                  width: "100%",
                  color: "#222",
                  background: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  borderRadius: 8,
                  padding: 8,
                  marginTop: 4,
                  fontSize: 15,
                }}
              />
            </label>
            <div
              style={{
                fontWeight: 700,
                fontSize: 18,
                color: "#1e293b",
                flex: 1,
                textAlign: "right",
              }}
            >
              Total:{" "}
              <span style={{ color: "#16a34a" }}>R$ {total.toFixed(2)}</span>
            </div>
          </div>
          <button
            type="submit"
            style={{
              padding: "12px 0",
              fontWeight: 700,
              color: "#fff",
              background: "#16a34a",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 17,
              marginTop: 8,
              boxShadow: "0 2px 8px #0001",
              letterSpacing: 1,
            }}
          >
            Registrar Nota
          </button>
        </form>
      </div>
    </div>
  );
}
