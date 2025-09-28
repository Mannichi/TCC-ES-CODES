import { useMemo, useState, useEffect } from "react";
import styled from "styled-components";

const MainHicks = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  color: #000;
  align-items: flex-start;
  padding: 20px;
  gap: 10px;

  button {
    margin: 10px;
    width: 120px;
    font-family: Montserrat, sans-serif;
    background-color: #000;
    color: #fff;
    border-radius: 5px;
    border: 1px solid #000;
    padding: 8px;
    cursor: pointer;
    transition: background 0.2s;
  }

  button:hover {
    background-color: #333;
  }

  .texto-opcao {
    margin-top: 40px;
  }
`;

const LeiHicks = () => {
    const [opcoes, setOpcoes] = useState(4);

    // Fórmula da Lei de Hick: T = a + b * log2(n + 1)
    const a = 250;
    const b = 150;
    const tempoDecisao = useMemo(
        () => Math.round(a + b * Math.log2(opcoes + 1)),
        [opcoes]
    );

    const [escolha, setEscolha] = useState<string | null>(null);
    const [mensagem, setMensagem] = useState("");

  // sempre que a escolha muda, agenda a mensagem com atraso
    useEffect(() => {
        if (escolha) {
        setMensagem("Processando escolha...");
        const timer = setTimeout(() => {
            setMensagem(
            `Você escolheu a ${escolha}. (Tempo médio estimado: ${tempoDecisao} ms)`
            );
        }, tempoDecisao);
        return () => clearTimeout(timer);
        }
    }, [escolha, tempoDecisao]);

  return (
        <MainHicks>
            <h2>Simulador da Lei de Hick</h2>

            <label>Número de opções: {opcoes}</label>
            <input
                type="range"
                min={2}
                max={20}
                value={opcoes}
                onChange={(e) => {
                setOpcoes(parseInt(e.target.value));
                setEscolha(null);
                setMensagem("");
                }}
            />

            <p>
                Tempo estimado de decisão: <b>{tempoDecisao} ms</b>
            </p>

            <div>
                {Array.from({ length: opcoes }).map((_, i) => (
                <button key={i} onClick={() => setEscolha(`Opção ${i + 1}`)}>
                    Opção {i + 1}
                </button>
                ))}
            </div>

            {mensagem && <p className="texto-opcao">{mensagem}</p>}
        </MainHicks>
    );
};

export default LeiHicks;
