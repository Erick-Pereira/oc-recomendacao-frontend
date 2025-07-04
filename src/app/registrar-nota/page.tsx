"use client";
import React, { useState, useEffect } from "react";

const paymentOptions = [
  "À vista",
  "10 dias",
  "30 dias",
  "Em 2x iguais",
  "Em 3x iguais",
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
  const [frete, setFrete] = useState("");
  const [recomendado, setRecomendado] = useState<string | null>(null);

  const API_URL = "http://127.0.0.1:8000";
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
        } catch { }
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
        console.error(err);
      }
    };
    fetchAndStore();
  }, []);

  const handleProdutoChange = (
    index: number,
    field: keyof Produto,
    value: string | number
  ) => {
    const novosProdutos = [...produtos];
    if (field === "quantidade" || field === "valor") {
      novosProdutos[index][field] = Number(value) as Produto[typeof field];
    } else {
      novosProdutos[index][field] = value as Produto[typeof field];
    }
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
    (frete !== "" ? Number(frete) : 0);

  useEffect(() => {
    if (
      numeroOC &&
      fornecedor &&
      produtos.every((p) => p.codigo && p.quantidade > 0 && p.valor >= 0) &&
      frete !== "" && Number(frete) >= 0
    ) {
      const payload = {
        nro: Number(numeroOC),
        fornecedor: Number(fornecedor),
        total: Number(total),
        frete: Number(frete),
        qtde: produtos.reduce((acc, p) => acc + p.quantidade, 0),
      };
      fetch(`${API_URL}/oc/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((resp) => resp.json())
        .then((data) => setRecomendado(data.recomendado))
        .catch(() => setRecomendado(null));
    } else {
      setRecomendado(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numeroOC, fornecedor, produtos, frete, total]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nro: Number(numeroOC),
      fornecedor: Number(fornecedor),
      qtde: produtos.reduce((acc, p) => acc + p.quantidade, 0),
      total: Number(total),
      frete: Number(frete),
      forma_pagamento: formaPagamento,
    };

    try {
      const resp = await fetch(`${API_URL}/oc/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error("Erro ao enviar para o backend");
      alert("Nota registrada com sucesso!");
    } catch (err) {
      alert("Erro ao registrar nota!");
      console.error(err);
    }
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
          Nova Ordem de Compra
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
                Código Fornecedor
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
                      Quant.
                    </th>
                    <th
                      style={{ color: "#334155", fontWeight: 600, padding: 8 }}
                    >
                      Valor Unt.
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
              Valor do Frete
              <input
                type="number"
                min={0}
                step={0.01}
                value={frete}
                onChange={(e) => setFrete(e.target.value)}
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
          {recomendado && (
            <div
              style={{
                marginTop: 16,
                textAlign: "center",
                color: "#2563eb",
                fontWeight: 600,
              }}
            >
              Forma de pagamento recomendada: {recomendado}
            </div>
          )}
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
            Registrar Ordem de Compra
          </button>
        </form>
      </div>
    </div>
  );
}
