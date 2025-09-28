// src/pages/PaginaNaoEncontrada.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import styled from "styled-components";

const Area404 = styled.section`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	text-align: center;
	gap: 14px;
	background: #ffffff;
	color: #111827;
	font-family: Montserrat, Arial, sans-serif;
	padding: 24px;
`;

const Cartao = styled.div`
	max-width: 560px;
	border: 1px solid #e5e7eb;
	border-radius: 12px;
	background: #f9fafb;
	padding: 24px;
`;

const Titulo = styled.h1`
	font-size: 28px;
	font-weight: 700;ss
	margin-bottom: 6px;
`;

const Texto = styled.p`
	font-size: 14px;
	color: #374151;
`

const Linha = styled.hr`
	border: none;
	border-top: 1px solid #e5e7eb;
	margin: 14px 0;
`;

const Info = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 8px;
	text-align: left;
	background: #fff;
	border: 1px dashed #e5e7eb;
	border-radius: 8px;
	padding: 12px;
	word-break: break-all;
`;

const Botao = styled.button`
	margin-top: 8px;
	padding: 10px 16px;
	border-radius: 8px;
	border: 1px solid #111827;
	background: #111827;
	color: #fff;
	cursor: pointer;
	transition: background .2s;
	width: 100%;
	max-width: 260px;
	&:hover { 
        background: #1f2937; 
    }
`

const Page404 = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const path = "/";
	const segundos = 10;

	const [restante, setRestante] = useState(segundos);

	useEffect(()=>{
		const timer = setInterval(()=>{
			setRestante((s)=> Math.max(0, s - 1));
		}, 1000);
		return ()=> clearInterval(timer);
	}, []);

	useEffect(()=>{
		if(restante === 0){
			navigate(path, { replace: true });
		}
	}, [restante, navigate]);

	return (
		<Area404>
			<Cartao>
				<Titulo>404 - Página não encontrada</Titulo>
				<Texto>
					Não localizamos nenhuma rota que corresponda a: <b>{pathname}</b>
				</Texto>

				<Linha />

				<Info>
					<Texto>A rota acessada não existe no aplicativo.</Texto>
					<Texto>
						<b>O que faremos?</b> Você será redirecionado em <b>{restante}</b> segundo(s).
					</Texto>
					<Texto>
						Se preferir, clique no botão abaixo para ir agora.
					</Texto>
				</Info>

				<Botao onClick={()=> navigate(path, { replace: true })}>
					Ir para a página inicial
				</Botao>
			</Cartao>
		</Area404>
	);
}

export default Page404;