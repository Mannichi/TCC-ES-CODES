// src/components/FormEtapaVsUnico.tsx
import { useMemo, useState, useEffect } from "react";
import styled, { css } from "styled-components";

const MainForm = styled.section`
	display: flex;
	flex-direction: column;
	width: 100%;
	background: #fff;
	color: #000;
	padding: 20px;
	gap: 14px;
	font-family: Montserrat, Arial, sans-serif;
	h2 { font-size: 22px; font-weight: 600; }
`;

const ToggleGroup = styled.div`
	display: flex; 
    gap: 8px; 
    margin: 8px 0 4px;
	button{
		padding: 8px 14px; 
        border-radius: 6px; 
        border: 1px solid #222;
		background: #000; color: #fff; cursor: pointer;
		transition: transform .12s ease, background .2s;
	}
	button:hover{ background:#222; }
	.outline{ background:#fff; color:#000; }
	.outline:hover{ background:#f5f5f5; }
`;

const MetaBar = styled.div`
	display: grid; 
    grid-template-columns: 1fr auto auto; gap: 8px;
	align-items: center; 
    margin-top: 2px;
	small{ 
        color:#444; 
    }
`;

const ProgressWrap = styled.div`
	background:#eee; 
    height:10px; 
    border-radius:9999px; 
    overflow:hidden;
`;
const Progress = styled.div<{ value:number }>`
	height:10px; 
    background: linear-gradient(90deg, #4acddeff, #22b2c5ff);
	width:${({value})=>value}%; transition:width .25s ease;
`;

const Panel = styled.div`
	border:1px solid #ddd; 
    border-radius:10px; 
    padding:16px; 
    background: #fafafa;
`;

const StepHeader = styled.div`
	display:flex; 
    align-items:center; 
    gap:8px; 
    margin-bottom:14px;
	.pill{ 
        background:#000; 
        color:#fff; 
        border-radius:999px; 
        padding:3px 10px; 
        font-size:12px; 
    }
	h3{ 
        font-size:16px; 
        font-weight:600; 
    }
`;

const Grid = styled.div<{ cols?:number }>`
	display:grid; 
    gap:10px;
	${({cols})=>cols ? css`grid-template-columns:repeat(${cols}, minmax(0,1fr));` : css`grid-template-columns:1fr;`
}
`;

const Input = styled.input<{ invalid?:boolean }>`
	width:100%; 
    padding:10px 12px; 
    border-radius:8px;
	border:1px solid ${({invalid})=>invalid ? "#ef4444" : "#cbd5e1"};
	background:#fff; 
    outline:none;
	&:focus{ 
        border-color:#000; 
    }
`;

const Actions = styled.div`
	display:flex; 
    justify-content:space-between; 
    margin-top:14px; 
    gap:8px;
	button{
		padding:10px 16px; 
        border-radius:8px; 
        border:1px solid #000;
		background:#000; 
        color:#fff; 
        cursor:pointer; 
        transition:background .2s;
	}
	button:hover{ background:#222; }
	.ghost{ 
        background:#fff; color:#000; 
    }
	.ghost:hover{ 
        background:#f5f5f5; 
    }
`;

const Status = styled.p` margin-top:10px; color:#222; `;

type FormData = {
	nome:string; email:string; cpf:string; telefone:string;
	rua:string; numero:string; cidade:string; uf:string;
	cep:string; usuario:string; senha:string; confirmaSenha:string;
};

const rotulos: Record<keyof FormData,string> = {
	nome:"Nome completo", email:"E-mail", cpf:"CPF", telefone:"Telefone",
	rua:"Rua", numero:"Número", cidade:"Cidade", uf:"UF",
	cep:"CEP", usuario:"Usuário", senha:"Senha", confirmaSenha:"Confirmar senha"
};

const campos: (keyof FormData)[] = Object.keys(rotulos) as (keyof FormData)[];
const etapas: (keyof FormData)[][] = [
	["nome","email","cpf","telefone"],
	["rua","numero","cidade","uf"],
	["cep","usuario","senha","confirmaSenha"]
];

function validar(dados:FormData, campos:(keyof FormData)[]) {
	const erros: Partial<Record<keyof FormData, boolean>> = {};
	for(const c of campos){
		const v = String(dados[c] ?? "").trim();
		if(!v) erros[c] = true;
		if(c==="email" && v && !/\S+@\S+\.\S+/.test(v)) erros[c] = true;
	}
	// senha x confirma
	if((campos.includes("senha") || campos.includes("confirmaSenha")) && dados.senha && dados.confirmaSenha){
		if(dados.senha !== dados.confirmaSenha){ erros.senha = true; erros.confirmaSenha = true; }
	}
	return erros;
}

const FormEtapaVsUnico = () => {
	const [modo,setModo] = useState<"etapas"|"unico">("etapas");
	const [etapa,setEtapa] = useState(1);
	const [dados,setDados] = useState<FormData>({
		nome:"", 
        email:"", 
        cpf:"", 
        telefone:"",
		rua:"", 
        numero:"", 
        cidade:"", 
        uf:"",
		cep:"", 
        usuario:"", 
        senha:"", 
        confirmaSenha:""
	});
	const [invalidos,setInvalidos] = useState<Partial<Record<keyof FormData,boolean>>>({});
	const [status,setStatus] = useState(""); const [enviando,setEnviando] = useState(false);

	const visiveis = useMemo(()=> modo==="unico" ? campos : etapas[etapa-1], [modo,etapa]);
	const carga = useMemo(()=>{
		const n = visiveis.length, ref = 7;
		const pct = Math.min(100, Math.max(0, Math.round((n/(ref*2))*100)));
		return { n, pct, alerta: n>9 };
	}, [visiveis.length]);
	const progresso = useMemo(()=> modo==="unico" ? 100 : Math.round((etapa/etapas.length)*100), [modo,etapa]);
	const tempoProcesso = useMemo(()=> 300 + 120*visiveis.length, [visiveis.length]);

	const onChange = (campo:keyof FormData, valor:string)=>{
		setDados(d=>({...d,[campo]:valor}));
		if(invalidos[campo]) setInvalidos(i=>({...i,[campo]:false}));
	};

	const runDelay = (msgInicio:string, onDone:()=>void)=>{
		setStatus(msgInicio); setEnviando(true);
		setTimeout(()=>{ setEnviando(false); setStatus(""); onDone(); }, tempoProcesso);
	};

	const avançar = ()=>{
		if(modo==="unico") return;
		const erros = validar(dados, etapas[etapa-1]);
		setInvalidos(erros);
		if(Object.keys(erros).length) return;
		runDelay("Validando etapa...", ()=> setEtapa(e=>Math.min(e+1, etapas.length)));
	};

	const voltar = ()=>{ if(modo!=="unico") setEtapa(e=>Math.max(1, e-1)); };

	const enviar = ()=>{
		const alvo = modo==="unico" ? campos : etapas[etapas.length-1];
		const erros = validar(dados, alvo);
		setInvalidos(erros);
		if(Object.keys(erros).length) return;
		setStatus("Processando envio..."); setEnviando(true);
		setTimeout(()=>{ setEnviando(false); setStatus("Formulário enviado com sucesso!"); }, tempoProcesso);
	};

	useEffect(()=>{ setStatus(""); setEnviando(false); if(modo==="etapas") setEtapa(1); }, [modo]);

	return (
		<MainForm>
			<h2>Formulário: Etapas vs. Página Única</h2>

			<ToggleGroup>
				<button className={modo==="etapas" ? "" : "outline"} onClick={()=>setModo("etapas")}>Etapas</button>
				<button className={modo==="unico" ? "" : "outline"} onClick={()=>setModo("unico")}>Página única</button>
			</ToggleGroup>

			<MetaBar>
				<ProgressWrap><Progress value={progresso}/></ProgressWrap>
				<small>Campos visíveis: <b>{carga.n}</b></small>
				<small>Carga estimada: <b>{carga.pct}%</b>{carga.alerta ? " • alta" : ""}</small>
			</MetaBar>

			<Panel>
				{modo==="etapas" && (
					<StepHeader>
						<span className="pill">Etapa {etapa} de {etapas.length}</span>
						<h3>Preencha os campos abaixo</h3>
					</StepHeader>
				)}

				<Grid cols={2}>
					{visiveis.map((c)=>(
						<label key={c}>
							<small>{rotulos[c]}</small>
							<Input
								invalid={!!invalidos[c]}
								type={c.includes("senha") ? "password" : "text"}
								placeholder={rotulos[c]}
								value={dados[c]}
								onChange={(e)=>onChange(c, e.target.value)}
							/>
						</label>
					))}
				</Grid>

				{modo==="etapas" ? (
					<Actions>
						<button className="ghost" onClick={voltar} disabled={etapa===1 || enviando}>Voltar</button>
						{etapa<etapas.length ? (
							<button onClick={avançar} disabled={enviando}>{enviando ? "Validando..." : "Avançar"}</button>
						) : (
							<button onClick={enviar} disabled={enviando}>{enviando ? "Enviando..." : "Enviar"}</button>
						)}
					</Actions>
				) : (
					<Actions style={{justifyContent:"flex-end"}}>
						<button onClick={enviar} disabled={enviando}>{enviando ? "Enviando..." : "Enviar"}</button>
					</Actions>
				)}

				{status && <Status>{status}</Status>}
			</Panel>
		</MainForm>
	);
}

export default FormEtapaVsUnico