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
	button:hover { background-color: #333; }

	.texto-opcao { margin-top: 24px; }

	.grid {
		display: flex;
        box-sizing: border-box;
        flex-wrap: wrap;
        width: 100%;
        height: auto;
        gap: 10px;

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

const LeiHicks = () =>{
	const [opcoes, setOpcoes] = useState(6);
	// Hick's Law: T = a + b * log2(n + 1)
	const a = 250; // ms
	const b = 150; // ms/bit
	const tempoBase = useMemo(
		() => Math.round(a + b * Math.log2(opcoes + 1)),
		[opcoes]
	);
	// Critério: "quanto mais distante do primeiro botão, maior o ms"
	// i = 0 → +0%; i = n-1 → +AUMENTO_MAX
	const aumento_maximo = 0.40; // +40% no mais distante (ajuste se quiser)
	const msPorOpcao = useMemo(()=>{
		if (opcoes <= 1) return [tempoBase];
		const maxIndex = opcoes - 1;
		return Array.from({ length: opcoes }, (_, i) => {
			const fracDist = i / maxIndex;                // 0 .. 1
			const fator = 1 + fracDist * aumento_maximo;     // 1.00 .. 1.40
			return Math.max(50, Math.round(tempoBase * fator));
		});
	}, [opcoes, tempoBase]);

	const [escolha, setEscolha] = useState<string | null>(null);
	const [delaySelecionado, setDelaySelecionado] = useState<number | null>(null);
	const [mensagem, setMensagem] = useState("");

	useEffect(()=>{
		if (!escolha || !delaySelecionado) return;
		setMensagem(`Processando ${escolha}…`);
		const t = setTimeout(()=>{
			setMensagem(`Você escolheu a ${escolha}. (Tempo estimado: ${delaySelecionado} ms)`);
		}, delaySelecionado);
		return ()=> clearTimeout(t);
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
				onChange={(e)=>{
					setOpcoes(parseInt(e.target.value));
					setEscolha(null);
					setDelaySelecionado(null);
					setMensagem("");
				}}
			/>

			<p>Tempo base (Lei de Hick) para n={opcoes}: <b>{tempoBase} ms</b></p>

			<div className="grid">
				{Array.from({ length: opcoes }).map((_, i)=>(
					<div key={i} className="item">
						<button
							onClick={()=>{
								setEscolha(`Opção ${i+1}`);
								setDelaySelecionado(msPorOpcao[i]);
							}}
						>
							Opção {i+1}
						</button>
						<span className="ms">~ {msPorOpcao[i]} ms</span>
					</div>
				))}
			</div>

			{mensagem && <p className="texto-opcao">{mensagem}</p>}
		</MainHicks>
	);
}

export default LeiHicks