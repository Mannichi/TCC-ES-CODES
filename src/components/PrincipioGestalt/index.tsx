// src/components/PrincipioGestalt.tsx
import { useState } from "react";
import styled, { css } from "styled-components";

const AreaGestalt = styled.section`
	display: flex;
	flex-direction: column;
	gap: 14px;
	width: 100%;
	background: #fff;
	color: #000;
	padding: 20px;
	font-family: Montserrat, Arial, sans-serif;

	h2 { font-size: 22px; font-weight: 600; }
`;

const PainelControles = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 12px;
	align-items: center;

	label { display: flex; flex-direction: column; gap: 6px; font-size: 14px; }
	input[type="range"] { width: 100%; }
	button {
		padding: 8px 12px;
		border: 1px solid #000;
		background: #000;
		color: #fff;
		border-radius: 8px;
		cursor: pointer;
		transition: background .2s;
	}
	button:hover { background: #222; }
`;

const Quadro = styled.div`
	border: 1px solid #e5e7eb;
	border-radius: 12px;
	background: #fafafa;
	padding: 16px;
`;

const GradeCartoes = styled.div<{ $espacamento: number }>`
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: ${({ $espacamento }) => `${$espacamento}px`};
`;

const Cartao = styled.div<{
	$alinhamento: "left" | "center" | "right";
	$destacado?: boolean;
}>`
	border: 1px solid #cbd5e1;
	border-radius: 10px;
	padding: 12px;
	text-align: ${({ $alinhamento }) => $alinhamento};
	background: #fff;
	transition: box-shadow .2s, transform .2s, background .2s;

	${({ $destacado }) =>
		$destacado &&
		css`
			background: #fef3c7; /* semelhança/contraste */
			border-color: #f59e0b;
			box-shadow: 0 4px 14px rgba(245, 158, 11, .25);
		`}

	h4 { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
	p { font-size: 13px; color: #444; }
`;

const PrincipioGestalt = () => {
	const [espacamento, setEspacamento] = useState(16); // Proximidade
	const [alinhamento, setAlinhamento] = useState<"left" | "center" | "right">("left"); // Alinhamento
	const [grupoDestacado, setGrupoDestacado] = useState(false); // Semelhança/contraste

	return (
		<AreaGestalt>
			<h2>Gestalt - Proximidade, Alinhamento e Semelhança</h2>

			<PainelControles>
				<label>
					<span>Proximidade (espaçamento): {espacamento}px</span>
					<input
						type="range"
						min={4}
						max={48}
						value={espacamento}
						onChange={(e) => setEspacamento(parseInt(e.target.value))}
					/>
				</label>

				<label>
					<span>Alinhamento</span>
					<div style={{ display: "flex", gap: 8 }}>
						<button onClick={() => setAlinhamento("left")}>Esquerda</button>
						<button onClick={() => setAlinhamento("center")}>Centro</button>
						<button onClick={() => setAlinhamento("right")}>Direita</button>
					</div>
				</label>

				<label>
					<span>Semelhança/Contraste</span>
					<button onClick={() => setGrupoDestacado((g) => !g)}>
						{grupoDestacado ? "Remover destaque" : "Destacar grupo"}
					</button>
				</label>
			</PainelControles>

			<Quadro>
				<GradeCartoes $espacamento={espacamento}>
					{Array.from({ length: 6 }).map((_, i) => (
						<Cartao
							key={i}
							$alinhamento={alinhamento}
							$destacado={grupoDestacado && i >= 2 && i <= 3} // grupo central
						>
							<h4>Cartão {i + 1}</h4>
							<p>
								Conteúdo de exemplo. Perceba como o agrupamento visual
								muda com a proximidade e o alinhamento.
							</p>
						</Cartao>
					))}
				</GradeCartoes>
			</Quadro>

			<small style={{ color: "#444" }}>
				Dicas: aumentar o espaçamento separa grupos (proximidade);
				manter títulos/alinhamentos coerentes reforça previsibilidade (alinhamento);
				destacar estilo de um subconjunto cria agrupamento por semelhança (contraste).
			</small>
		</AreaGestalt>
	);
}

export default PrincipioGestalt
