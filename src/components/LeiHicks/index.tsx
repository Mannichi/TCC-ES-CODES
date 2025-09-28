// src/components/LeiHicks.tsx
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
	font-family: Montserrat, Arial, sans-serif;

	button {
		margin: 10px;
		width: 120px;
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
        margin-top: 24px; 
    }

	.grid {
		display: flex;
        box-sizing: border-box;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;  
	}

	.item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}

	.ms {
		font-size: 12px;
		color: #444;
	}
`;

const LeiHicks = () => {
	const [opcoes, setOpcoes] = useState(4);

	// Hick's Law: T = a + b * log2(n + 1)
	const a = 250; // ms
	const b = 150; // ms/bit
	const tempoBase = useMemo(
		() => Math.round(a + b * Math.log2(opcoes + 1)),
		[opcoes]
	);

	// variações determinísticas por opção (±20%)
	const variacoes = useMemo(() => {
		const jitter = (i: number) => {
			const r = Math.abs(Math.sin((i + 1) * 12.9898) * 43758.5453) % 1;
			return (r - 0.5) * 0.4; // -0.2 .. +0.2  (±20%)
		};
		return Array.from({ length: opcoes }, (_, i) => jitter(i));
	}, [opcoes]);

	// ms por botão (base * (1 + variação[i])), com limites
	const msPorOpcao = useMemo(
		() =>
			Array.from({ length: opcoes }, (_, i) =>
				Math.max(50, Math.round(tempoBase * (1 + variacoes[i])))
			),
		[opcoes, tempoBase, variacoes]
	);

	const [escolha, setEscolha] = useState<string | null>(null);
	const [delaySelecionado, setDelaySelecionado] = useState<number | null>(null);
	const [mensagem, setMensagem] = useState("");

	// sempre que a escolha + delay mudarem, agenda a mensagem com o atraso da opção
	useEffect(() => {
		if (!escolha || !delaySelecionado) return;
		setMensagem(`Processando ${escolha}…`);
		const t = setTimeout(() => {
			setMensagem(
				`Você escolheu a ${escolha}. (Tempo estimado: ${delaySelecionado} ms)`
			);
		}, delaySelecionado);
		return () => clearTimeout(t);
	}, [escolha, delaySelecionado]);

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
					setDelaySelecionado(null);
					setMensagem("");
				}}
			/>

			<p>
				Tempo base pela Lei de Hick (n={opcoes}): <b>{tempoBase} ms</b>
			</p>

			<div className="grid">
				{Array.from({ length: opcoes }).map((_, i) => (
					<div key={i} className="item">
						<button
							onClick={() => {
								setEscolha(`Opção ${i + 1}`);
								setDelaySelecionado(msPorOpcao[i]);
							}}
						>
							Opção {i + 1}
						</button>
						<span className="ms">~ {msPorOpcao[i]} ms</span>
					</div>
				))}
			</div>

			{mensagem && <p className="texto-opcao">{mensagem}</p>}
		</MainHicks>
	);
}

export default LeiHicks;