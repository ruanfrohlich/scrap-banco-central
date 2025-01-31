const t=window,e=document.getElementById("calculateBtn");if(e){async function a(e,a){return await t.fetchBCB.fetch({codSegmento:"1",codModalidade:a,tipoModalidade:"D",periodo:e})}async function o(){let t=document.getElementById("startDate")?.value,o=document.getElementById("financingType")?.value,n=document.getElementById("contractRate")?.value,d=document.getElementById("result");if(!d)return;if(d.textContent="",!t){d.textContent="Por favor, selecione a data inicial.";return}if(!n){d.textContent="Por favor, insira a taxa de juros do contrato.";return}let i=parseFloat(n);if(isNaN(i)){d.textContent="Taxa de juros inválida. Digite um número válido.";return}try{if(!e)return;e.innerText="Carregando",e.setAttribute("disabled","");let n=await a(t,o);e.removeAttribute("disabled"),e.innerText="Calcular";let r=1.5*n,c=`\u{2022} Per\xedodo inicial: ${t}
`;c+=`\u{2022} C\xf3digo do Financiamento: ${o}

Taxa m\xe9dia do per\xedodo (simulada): ${n.toFixed(2)}% ao m\xeas.
Taxa do contrato: ${i.toFixed(2)}% ao m\xeas.

`,i>r?c+="Resultado: A taxa do contrato está mais de 50% acima da média (ABUSIVA).":c+="Resultado: A taxa do contrato NÃO está 50% acima da média.",d.textContent=c}catch(t){console.error(t),d.textContent="Ocorreu um erro ao buscar dados do BCB."}}e.addEventListener("click",o)}
//# sourceMappingURL=index.bdf67e95.js.map
