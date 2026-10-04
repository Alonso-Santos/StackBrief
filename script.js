const $ = id => document.getElementById(id);
const brl = v => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
function aviso(t){const el=$('toast');el.textContent=t;el.classList.add('on');clearTimeout(aviso.t);aviso.t=setTimeout(()=>el.classList.remove('on'),2200)}

// Menu e rodapé
$('menuBtn').onclick=()=>$('cats').classList.toggle('aberto');
document.querySelectorAll('#cats a').forEach(a=>a.onclick=()=>$('cats').classList.remove('aberto'));
$('ano').textContent=new Date().getFullYear();


// Slider
const slides=$('slides'),total=slides.children.length;let idx=0,timer;
const dots=$('dots');
for(let i=0;i<total;i++){const d=document.createElement('button');d.setAttribute('aria-label','Banner '+(i+1));d.onclick=()=>ir(i);dots.appendChild(d)}
function ir(i){idx=(i+total)%total;slides.style.transform=`translateX(-${idx*100}%)`;[...dots.children].forEach((d,k)=>d.classList.toggle('on',k===idx));$('slider').classList.toggle('t-azul',slides.children[idx].classList.contains('s2'));clearInterval(timer);timer=setInterval(()=>{if(!document.documentElement.classList.contains("a11y-anim"))ir(idx+1)},6000)}
$('ant').onclick=()=>ir(idx-1);$('prox').onclick=()=>ir(idx+1);ir(0);

// Produtos
const produtos=[
  {id:1,nome:'4 em 1 Beauty Stick',desc:'Corretivo + Blush + Bronzer + Pó',preco:100.00,tag:'Mais vendido',img:'imagens/prod-kit.jpeg',est:4.5,n:124},
  {id:2,nome:'Base Líquida Glow',desc:'Cobertura média | Acabamento natural',preco:50.00,img:'imagens/prod-base.jpeg',est:4.5,n:98},
  {id:3,nome:'Pó Compacto Velvet',desc:'Toque aveludado | Longa duração',preco:33.00,img:'imagens/prod-po.jpeg',est:4,n:76}
];
let car=0,favs=new Set();
function render(lista){
  $('grid').innerHTML=lista.map(p=>`
  <article class="prod">
    ${p.tag?`<span class="tag">${p.tag}</span>`:''}
    <button class="fav ${favs.has(p.id)?'on':''}" data-fav="${p.id}" aria-label="Favoritar"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5S3.5 15 3.5 8.9A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.5 1.9C20.5 15 12 20.5 12 20.5Z"/></svg></button>
    <div class="foto">${p.img?`<img src="${p.img}" alt="${p.nome}">`:'<span>Foto do produto</span>'}</div>
    <div class="info"><h3>${p.nome}</h3><p class="desc">${p.desc}</p>
    <div class="stars">${'★'.repeat(Math.floor(p.est))}${p.est%1?'½':''} <span style="color:#777">(${p.n})</span></div>
    <div class="preco"><strong>${brl(p.preco)}</strong><button class="btn" data-add="${p.id}" aria-label="Adicionar ${p.nome} ao carrinho"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/><path d="M3 4h2.5l2.2 11h10.6L20.5 8H6.2"/></svg><span class="t-add"> Adicionar</span></button></div></div>
  </article>`).join('')||'<p style="grid-column:1/-1;text-align:center">Nenhum produto encontrado.</p>';
}
render(produtos);
$('grid').addEventListener('click',e=>{
  const add=e.target.closest('[data-add]'),fav=e.target.closest('[data-fav]');
  if(add){car++;$('nCar').textContent=car;aviso('Produto adicionado ao carrinho')}
  if(fav){const id=+fav.dataset.fav;favs.has(id)?favs.delete(id):favs.add(id);$('nFav').textContent=favs.size;$('nFav2').textContent=favs.size;render(filtrados())}
});
const filtrados=()=>produtos.filter(p=>(p.nome+p.desc).toLowerCase().includes($('q').value.trim().toLowerCase()));
$('busca').onsubmit=e=>{e.preventDefault();render(filtrados());document.getElementById('produtos').scrollIntoView()};
$('btnCarrinho').onclick=()=>aviso(car?`${car} item(ns) no carrinho`:'Seu carrinho está vazio');
function mostraFavs(){
  if(!favs.size){aviso('Você ainda não tem favoritos');return}
  render(produtos.filter(p=>favs.has(p.id)));
  $('produtos').scrollIntoView({behavior:'smooth'});
}
$('btnFav').onclick=mostraFavs;
$('tabFav').onclick=mostraFavs;
$('verTodos').onclick=()=>{$('q').value='';render(produtos)};
// Barra inferior: marca a aba ativa
document.querySelectorAll('#tabbar [data-tab]').forEach(el=>el.addEventListener('click',()=>{
  document.querySelectorAll('#tabbar [data-tab]').forEach(t=>t.classList.remove('on'));el.classList.add('on');
}));

// Simulador (regra de negócio ajustável pelo Marketing)
const PERCENTUAL_ECONOMIA={'0':0.15,'1':0.25,'3':0.35};
const LIMITE_GASTO_ALTO=200;
$('formCalc').addEventListener('submit',e=>{
  e.preventDefault();
  const nome=$('nome').value.trim(),gasto=parseFloat($('gasto').value),ret=$('retoques').value,erro=$('erro'),box=$('resultado');
  erro.textContent='';box.classList.remove('ativo');
  if(nome.length<2)return erro.textContent='Por favor, informe seu nome.';
  if(isNaN(gasto)||gasto<=0)return erro.textContent='Informe um gasto mensal válido, maior que zero.';
  if(ret==='')return erro.textContent='Selecione quantas vezes você retoca a make por dia.';
  const eco=gasto*12*PERCENTUAL_ECONOMIA[ret],alta=gasto>=LIMITE_GASTO_ALTO||ret==='3';
  $('msg').textContent=`${nome}, com a Selene Glow você pode economizar até:`;
  $('valor').textContent=`${brl(eco)} por ano`;
  $('classe').textContent=alta?'Perfil com alto potencial de economia: o kit 4 em 1 foi feito para você!':'Perfil com boa economia: qualidade profissional sem pesar no bolso.';
  box.classList.add('ativo');
});

// Newsletter
$('formNews').addEventListener('submit',e=>{
  e.preventDefault();const v=$('email').value.trim(),ok=$('okNews');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){ok.style.color='#b3402a';ok.textContent='Informe um e-mail válido.';return}
  ok.style.color='#2f7a4d';ok.textContent='Cadastro realizado! Obrigado por fazer parte da Selene Glow.';$('email').value='';
});

// ===== Menu de acessibilidade =====
(function(){
  const H=document.documentElement,KEY='selene-a11y';
  const PAD={tam:100,br:100,ct:100,gr:0,inv:0,fonte:0,esp:0,neg:0,links:0,cur:0,anim:0};
  const TAMANHOS=[100,112,125,140,160];
  let st=Object.assign({},PAD);
  try{Object.assign(st,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
  try{if(!localStorage.getItem(KEY)&&matchMedia('(prefers-reduced-motion: reduce)').matches)st.anim=1}catch(e){}
  const fab=$('a11yFab'),painel=$('a11yPanel');
  function aplica(){
    H.style.fontSize=st.tam===100?'':st.tam+'%';
    H.style.setProperty('--a-br',st.br/100);H.style.setProperty('--a-ct',st.ct/100);
    H.style.setProperty('--a-gr',st.gr?1:0);H.style.setProperty('--a-inv',st.inv?1:0);H.style.setProperty('--a-hue',st.inv?'180deg':'0deg');
    const filtro=st.br!==100||st.ct!==100||st.gr||st.inv;
    H.classList.toggle('a11y-f',!!filtro);H.classList.toggle('a11y-inv',!!st.inv);
    ['fonte','esp','neg','links','cur','anim'].forEach(k=>H.classList.toggle('a11y-'+k,!!st[k]));
    $('a11yTamVal').textContent=st.tam+'%';$('a11yBrVal').textContent=st.br+'%';$('a11yCtVal').textContent=st.ct+'%';
    $('a11yBr').value=st.br;$('a11yCt').value=st.ct;
    painel.querySelectorAll('.a11y-sw').forEach(b=>b.setAttribute('aria-checked',st[b.dataset.a]?'true':'false'));
    $('a11yMenos').disabled=st.tam<=TAMANHOS[0];$('a11yMais').disabled=st.tam>=TAMANHOS[TAMANHOS.length-1];
    try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}
  }
  function abre(v){
    painel.hidden=!v;fab.setAttribute('aria-expanded',v);
    fab.setAttribute('aria-label',v?'Fechar menu de acessibilidade':'Abrir menu de acessibilidade');
    if(v)$('a11yClose').focus();else fab.focus();
  }
  fab.onclick=()=>abre(painel.hidden);$('a11yClose').onclick=()=>abre(false);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!painel.hidden)abre(false)});
  document.addEventListener('click',e=>{if(!painel.hidden&&!painel.contains(e.target)&&!fab.contains(e.target))abre(false)});
  $('a11yMais').onclick=()=>{const i=TAMANHOS.indexOf(st.tam);st.tam=TAMANHOS[Math.min(i<0?0:i+1,TAMANHOS.length-1)];aplica()};
  $('a11yMenos').onclick=()=>{const i=TAMANHOS.indexOf(st.tam);st.tam=TAMANHOS[Math.max((i<0?0:i)-1,0)];aplica()};
  $('a11yBr').oninput=e=>{st.br=+e.target.value;aplica()};$('a11yCt').oninput=e=>{st.ct=+e.target.value;aplica()};
  painel.querySelectorAll('.a11y-sw').forEach(b=>b.onclick=()=>{st[b.dataset.a]=st[b.dataset.a]?0:1;aplica()});
  $('a11yReset').onclick=()=>{st=Object.assign({},PAD);aplica();aviso('Ajustes restaurados')};
  // posição: canto superior direito, logo abaixo do cabeçalho fixo
  const cab=document.querySelector('header');
  function pos(){H.style.setProperty('--a11y-top',Math.round(Math.max(cab.getBoundingClientRect().bottom,0)+12)+'px')}
  addEventListener('scroll',pos,{passive:true});addEventListener('resize',pos);addEventListener('load',pos);
  if(window.ResizeObserver)new ResizeObserver(pos).observe(cab);
  pos();aplica();
})();
