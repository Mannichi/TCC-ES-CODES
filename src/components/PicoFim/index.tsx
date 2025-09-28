// src/components/CarregamentoPicoFim.tsx
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Area = styled.section`
	display: flex;
	flex-direction: column;
	gap: 10px;
	width: 100%;
	max-width: 640px;
	margin: 0 auto;
	padding: 24px;
	font-family: Montserrat, Arial, sans-serif;
	color: #111827;
`;

const Cartao = styled.div`
    display: flex;
    flex-direction: column;
	border: 1px solid #e5e7eb;
	border-radius: 12px;
	background: #fafafa;
	padding: 20px;
	box-shadow: 0 2px 8px rgba(0,0,0,.05);
    gap: 10px;
`;

const Titulo = styled.h2`
	font-size: 22px;
	font-weight: 700;
`;

const Texto = styled.p`
	font-size: 14px;
	color: #374151;
`;

const BarraFundo = styled.div`
	height: 12px;
	width: 100%;
	background: #e5e7eb;
	border-radius: 9px;
	overflow: hidden;
`;

const Barra = styled.div<{ $progresso: number }>`
	height: 12px;
	width: ${({ $progresso }) => $progresso}%;
	background: linear-gradient(90deg, #60a5fa, #2563eb);
	transition: width .12s ease;
`;

const Linha = styled.hr`
	border: none;
	border-top: 1px solid #e5e7eb;
`;

const Info = styled.div`
	display: grid;
	gap: 6px;
	font-size: 13px;
	color: #444;
`;

const GrupoBotoes = styled.div`
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
`;

const Botao = styled.button`
	padding: 10px 16px;
	border-radius: 8px;
	border: 1px solid #111827;
	background: #111827;
	color: #fff;
	cursor: pointer;
	transition: background .2s;
	&:hover { background: #1f2937; }
	&:disabled { opacity: .6; cursor: not-allowed; }
`;

const RegraPicoFim = () =>{
	const [progresso, setProgresso] = useState(0);
	const [rodando, setRodando] = useState(false);
	const [mensagem, setMensagem] = useState("Pronto para iniciar…");
	const [log, setLog] = useState<string[]>([]);
	const stallTimerRef = useRef<number | null>(null);
	const tickTimerRef = useRef<number | null>(null);

	// limpa timers ao desmontar
	useEffect(()=>{
		return ()=>{
			if (stallTimerRef.current) window.clearTimeout(stallTimerRef.current);
			if (tickTimerRef.current) window.clearInterval(tickTimerRef.current);
		};
	}, []);

	const reset = ()=>{
		if (stallTimerRef.current) window.clearTimeout(stallTimerRef.current);
		if (tickTimerRef.current) window.clearInterval(tickTimerRef.current);
		stallTimerRef.current = null;
		tickTimerRef.current = null;
		setRodando(false);
		setProgresso(0);
		setMensagem("Pronto para iniciar…");
		setLog([]);
	};

	const iniciar = ()=>{
		reset();
		setRodando(true);
		setMensagem("Carregando… início gradual (pode levar alguns segundos)");
		setLog(l=>[...l, "Início: pequenos avanços (sensação de lentidão controlada)"]);

		// Fase 1 — INÍCIO LENTO até ~40% (incrementos pequenos, intervalos maiores)
		let fase:"inicio"|"pico"|"fim" = "inicio";

		// função de avanço conforme a fase
		const tick = ()=>{
			setProgresso(previa => {
				if (fase === "inicio"){
					const prox = Math.min(40, previa + 2);
					if (prox >= 40){
						// entra no PICO NEGATIVO (travada)
						fase = "pico";
						if (tickTimerRef.current) window.clearInterval(tickTimerRef.current);
						setMensagem("Pico negativo: travado momentaneamente… ❌");
						setLog(l=>[...l, "Pico negativo: interrupção perceptível (travada simulada)"]);
						stallTimerRef.current = window.setTimeout(()=>{
							// Fase 3 — FIM RÁPIDO
							fase = "fim";
							setMensagem("Retomando… final rápido até concluir ✅");
							setLog(l=>[...l, "Fim acelerado: conclusão rápida após o pico"]);
							tickTimerRef.current = window.setInterval(()=>{
								setProgresso(p=>{
									const proximo = Math.min(100, p + 7);
									if (proximo >= 100){
										encerrar();
									}
									return proximo;
								});
							}, 80); 
						}, 2200); 
					} else {
						// mantém fase início
					}
					return prox;
				}
				return previa;
			});
		};
		// intervalo mais lento no início
		tickTimerRef.current = window.setInterval(tick, 300);
	};

	const encerrar = ()=>{
		if (stallTimerRef.current) window.clearTimeout(stallTimerRef.current);
		if (tickTimerRef.current) window.clearInterval(tickTimerRef.current);
		stallTimerRef.current = null;
		tickTimerRef.current = null;
		setRodando(false);
		setMensagem("Concluído: sua memória tenderá a valorizar o pico (travada) e o fim rápido.");
		setLog(l=>[...l, "Concluído: lembrança guiada pelo pico e pelo fim (Regra de Pico-Fim)"]);
	};

	return (
		<Area>
			<Cartao>
				<Titulo>Regra de Pico-Fim - Simulação de Carregamento</Titulo>
				<Texto>
					Simula uma experiência com início lento, um <b>pico negativo</b> (travada) no meio
					e um <b>fim rápido</b>. Usuários tendem a lembrar do pico e do fim ao avaliar a experiência.
				</Texto>
				<BarraFundo>
					<Barra $progresso={progresso}/>
				</BarraFundo>
				<Texto>
					Progresso: <b>{progresso}%</b>
				</Texto>
				<Texto>{mensagem}</Texto>
				<GrupoBotoes>
					<Botao onClick={iniciar} disabled={rodando || progresso >= 100}>Iniciar</Botao>
					<Botao onClick={reset} disabled={rodando && progresso < 100}>Reiniciar</Botao>
				</GrupoBotoes>
				<Linha/>
				<Info>
					<Texto><b>Diário da interação</b></Texto>
					{
                        log.length === 0 ? 
                            <Texto>Nenhum evento registrado ainda.</Texto> 
                        : 
                        log.map((linha, i)=>(
						    <Texto key={i}>• {linha}</Texto>
					    ))
                    }
				</Info>
			</Cartao>
		</Area>
	);
}

export default RegraPicoFim