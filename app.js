const products = [
  {id:'orbit',name:'Orbita',category:'Abstrakcja',base:69,color:'#e2e4da',tag:'NASZ WYBÓR',description:'Kobalt, słońce i trochę przyciągania. Geometryczna kompozycja, która dobrze czuje się tam, gdzie brakuje koloru.'},
  {id:'slow',name:'Wolniej',category:'Typografia',base:59,color:'#e6dcd5',tag:'DOBRE SŁOWO',description:'Nie wszystko musi być na wczoraj. Typograficzne przypomnienie, że można złapać oddech i zostać na chwilę.'},
  {id:'leaves',name:'Zielnik',category:'Natura',base:69,color:'#dfe3d6',tag:'',description:'Zieleń bez podlewania. Rytmiczne kształty liści i ciepły odcień papieru w spokojnej, botanicznej kompozycji.'},
  {id:'blue',name:'Błękitna godzina',category:'Abstrakcja',base:79,color:'#dce0e5',tag:'',description:'Między dniem a wieczorem. Warstwy błękitu i spokojny horyzont, który pozwala myślom popłynąć dalej.'},
  {id:'ciao',name:'Ciao, bella!',category:'Typografia',base:59,color:'#e8dfd1',tag:'CIAO!',description:'Trochę włoskiego słońca bez pakowania walizki. Czerwone litery i mały moment beztroski na Twojej ścianie.'},
  {id:'sun',name:'Południe',category:'Natura',base:69,color:'#e6d9c8',tag:'',description:'Słońce, które nigdzie się nie spieszy. Ciepły pejzaż zbudowany z prostych form, piasku i terakoty.'},
  {id:'balance',name:'Równowaga',category:'Abstrakcja',base:79,color:'#e4dfdb',tag:'',description:'Dwie formy, wspólny rytm. Wyrazisty duet czerni i różu dla tych, którzy lubią proste rzeczy z charakterem.'},
  {id:'here',name:'Tu i teraz',category:'Typografia',base:59,color:'#e3e5cf',tag:'',description:'Mały manifest codzienności. Soczysta zieleń i litery, obok których trudno przejść obojętnie.'}
];
const formats = ['30 × 40 cm','50 × 70 cm','70 × 100 cm'];
const frames = ['Bez ramy','Czarna','Naturalna'];
const money = value => new Intl.NumberFormat('pl-PL',{style:'currency',currency:'PLN',maximumFractionDigits:0}).format(value);
const findProduct = id => products.find(p=>p.id===id);
const unitPrice = item => findProduct(item.id).base + [0,40,90][item.size] + (item.frame ? [55,90,140][item.size] : 0);
const itemKey = item => `${item.id}-${item.size}-${item.frame}`;
let category='all', sort='featured', search='', detail=null, cart=[], toastTimer;
let storageWorks=true;
try {
  const saved=JSON.parse(localStorage.getItem('na-sciane-cart')||'[]');
  if(Array.isArray(saved)) {
    for(const item of saved.slice(0,24)) {
      if(!item||!findProduct(item.id)||!Number.isInteger(item.size)||item.size<0||item.size>2||!Number.isInteger(item.frame)||item.frame<0||item.frame>2||!Number.isInteger(item.qty)||item.qty<1) continue;
      const existing=cart.find(row=>itemKey(row)===itemKey(item));
      if(existing)existing.qty=Math.min(10,existing.qty+item.qty);
      else cart.push({id:item.id,size:item.size,frame:item.frame,qty:Math.min(10,item.qty)});
    }
  }
}catch{storageWorks=false;}
const productDialog=document.querySelector('#product-dialog');
const cartDialog=document.querySelector('#cart-dialog');
const checkoutDialog=document.querySelector('#checkout-dialog');
let returnFocus=null;
let modalScroll=0;
function openDialog(dialog){
  const another=document.querySelector('dialog[open]');
  if(!another){
    returnFocus=document.activeElement;
    modalScroll=window.scrollY;
    document.body.style.setProperty('--modal-scroll', `-${modalScroll}px`);
  }
  else another.close();
  document.body.classList.add('modal-open');
  dialog.showModal();
}
document.querySelectorAll('dialog').forEach(dialog=>{
  dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{
    if(document.querySelector('dialog[open]'))return;
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('--modal-scroll');
    window.scrollTo({top:modalScroll,behavior:'instant'});
    if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
  });
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const box=dialog.getBoundingClientRect();
    if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();
  });
});
function notify(text){
  const toast=document.querySelector('#toast');
  clearTimeout(toastTimer);toast.textContent=text;toast.hidden=false;
  toastTimer=setTimeout(()=>{toast.hidden=true;},3500);
}
function saveCart(){
  try{localStorage.setItem('na-sciane-cart',JSON.stringify(cart));storageWorks=true;}catch{storageWorks=false;}
  document.querySelector('#cart-count').textContent=cart.reduce((sum,item)=>sum+item.qty,0);
}
function renderProducts(){
  const query=search.toLocaleLowerCase('pl');
  let visible=products.filter(p=>(category==='all'||p.category===category)&&`${p.name} ${p.category} ${p.description}`.toLocaleLowerCase('pl').includes(query));
  if(sort==='price-up')visible.sort((a,b)=>a.base-b.base);
  if(sort==='price-down')visible.sort((a,b)=>b.base-a.base);
  if(sort==='name')visible.sort((a,b)=>a.name.localeCompare(b.name,'pl'));
  document.querySelector('#products').innerHTML=visible.map(p=>`<article class="product-card"><button class="product-open" data-product="${p.id}" aria-label="Zobacz plakat ${p.name}"><span class="product-stage" style="--stage:${p.color}"><img src="assets/${p.id}.svg?v=2" alt="${p.name} — ${p.category}" width="400" height="560" loading="lazy">${p.tag?`<span class="product-tag">${p.tag}</span>`:''}<span class="product-view">Przyjrzyj się bliżej ↗</span></span><span class="product-title"><strong>${p.name}</strong><span>od ${money(p.base)}</span></span><span class="product-category">${p.category} · 3 formaty</span></button></article>`).join('');
  document.querySelector('#results').textContent=`Wyświetlono ${visible.length} z ${products.length} plakatów`;
  document.querySelector('#empty-search').hidden=visible.length>0;
}
document.querySelector('#products').addEventListener('click',e=>{const button=e.target.closest('[data-product]');if(button)openProduct(button.dataset.product);});
document.querySelector('.exhibition-wall').addEventListener('click',e=>{const button=e.target.closest('[data-product]');if(button)openProduct(button.dataset.product);});
document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{
  category=button.dataset.category;
  document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  renderProducts();
}));
document.querySelector('#sort').addEventListener('change',e=>{sort=e.target.value;renderProducts();});
document.querySelector('#search').addEventListener('input',e=>{search=e.target.value.trim();renderProducts();});
document.querySelector('#reset-search').addEventListener('click',()=>{search='';category='all';document.querySelector('#search').value='';document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category==='all')));renderProducts();});
function openProduct(id){
  const p=findProduct(id);if(!p)return;
  detail={id,size:0,frame:0};
  document.querySelector('#product-detail').innerHTML=`<div class="detail-grid"><div class="detail-art" style="--stage:${p.color}"><img id="detail-art" src="assets/${p.id}.svg?v=2" alt="Plakat ${p.name}" width="400" height="560"></div><div class="detail-copy"><p class="eyebrow">${p.category.toUpperCase()} / KOLEKCJA 01</p><h2 id="detail-name">${p.name}</h2><p>${p.description}</p><p class="detail-price" id="detail-price" aria-live="polite"></p><p class="price-note">Cena demonstracyjna za wybrany wariant.</p><fieldset class="choices"><legend>01 / Wybierz format</legend><div class="choice-buttons">${formats.map((f,i)=>`<button data-size="${i}" aria-pressed="${i===0}">${f}</button>`).join('')}</div></fieldset><fieldset class="choices"><legend>02 / A może w ramie?</legend><div class="choice-buttons">${frames.map((f,i)=>`<button data-frame="${i}" aria-pressed="${i===0}">${f}</button>`).join('')}</div></fieldset><button class="button primary add-button" id="add-cart">Dodaj do koszyka <span aria-hidden="true">+</span></button><p class="detail-fine">Projekt demonstracyjny. Wybór nie stanowi zakupu; niczego nie wysyłamy i nie pobieramy płatności.</p></div></div>`;
  updateDetail();openDialog(productDialog);
}
function updateDetail(){
  document.querySelector('#detail-price').textContent=money(unitPrice(detail));
  productDialog.querySelectorAll('[data-size]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.size)===detail.size)));
  productDialog.querySelectorAll('[data-frame]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.frame)===detail.frame)));
  const art=document.querySelector('#detail-art');art.classList.toggle('framed',detail.frame>0);art.style.borderColor=detail.frame===1?'#24251f':detail.frame===2?'#ba9870':'transparent';
}
productDialog.addEventListener('click',e=>{
  const size=e.target.closest('[data-size]'),frame=e.target.closest('[data-frame]');
  if(size){detail.size=Number(size.dataset.size);updateDetail();}
  if(frame){detail.frame=Number(frame.dataset.frame);updateDetail();}
  if(e.target.closest('#add-cart')){
    const existing=cart.find(item=>itemKey(item)===itemKey(detail));
    if(existing?.qty>=10){notify('Maksymalnie 10 sztuk jednego wariantu.');return;}
    if(!existing&&cart.length>=24){notify('Koszyk mieści do 24 różnych wariantów.');return;}
    if(existing)existing.qty++;else cart.push({...detail,qty:1});
    saveCart();productDialog.close();notify(storageWorks?'Dodano do koszyka. Dobry wybór!':'Dodano. Przeglądarka nie pozwala zapisać koszyka na później.');
  }
});
function renderCart(){
  document.querySelector('#cart-items').innerHTML=cart.length?cart.map((item,index)=>{const p=findProduct(item.id);return `<article class="cart-item"><img src="assets/${p.id}.svg?v=2" alt="Plakat ${p.name}" width="78" height="110"><div><h3>${p.name}</h3><p>${formats[item.size]} · ${frames[item.frame]}</p><p class="item-price">${money(unitPrice(item)*item.qty)}</p><div class="item-actions"><div class="quantity"><button data-cart-action="minus" data-index="${index}" aria-label="Zmniejsz ilość plakatu ${p.name}" ${item.qty===1?'disabled':''}>−</button><span aria-label="Liczba sztuk">${item.qty}</span><button data-cart-action="plus" data-index="${index}" aria-label="Zwiększ ilość plakatu ${p.name}" ${item.qty===10?'disabled':''}>+</button></div><button class="remove-item" data-cart-action="remove" data-index="${index}" aria-label="Usuń ${p.name} z koszyka">Usuń</button></div></div></article>`;}).join(''):'<div class="empty-cart">Jeszcze trochę pustej ściany.<p>Wybierz plakat z kolekcji i zajrzyj tu ponownie.</p><button class="text-button" id="back-collection">Odkryj kolekcję</button></div>';
  document.querySelector('#cart-bottom').innerHTML=cart.length?`<div class="cart-total"><p class="total-row"><span>Suma produktów</span><strong>${money(cart.reduce((sum,item)=>sum+unitPrice(item)*item.qty,0))}</strong></p><p>Demo sklepu: brak płatności i dostawy. Ceny służą prezentacji działania koszyka.${storageWorks?'':' Koszyk pozostaje tylko do zamknięcia strony.'}</p><button class="button primary" id="checkout">Zobacz podsumowanie <span aria-hidden="true">→</span></button><button class="clear-cart" id="clear-cart">Wyczyść koszyk</button></div>`:'';
}
document.querySelector('[data-open-cart]').addEventListener('click',()=>{renderCart();openDialog(cartDialog);});
cartDialog.addEventListener('click',e=>{
  const b=e.target.closest('[data-cart-action]');
  if(b){const index=Number(b.dataset.index),item=cart[index];if(!item)return;const action=b.dataset.cartAction;if(action==='remove')cart.splice(index,1);if(action==='minus')item.qty=Math.max(1,item.qty-1);if(action==='plus')item.qty=Math.min(10,item.qty+1);saveCart();renderCart();cartDialog.querySelector('[data-cart-action]')?.focus({preventScroll:true});}
  if(e.target.closest('#clear-cart')){cart=[];saveCart();renderCart();cartDialog.querySelector('#back-collection')?.focus();}
  if(e.target.closest('#back-collection')){cartDialog.close();document.querySelector('#katalog').scrollIntoView();}
  if(e.target.closest('#checkout'))openCheckout();
});
function openCheckout(){
  if(!cart.length)return;
  const total=cart.reduce((sum,item)=>sum+unitPrice(item)*item.qty,0);
  document.querySelector('#checkout-content').innerHTML=`<p class="eyebrow">OSTATNI KROK / DEMO</p><h2 id="checkout-title">Twoja mała galeria.</h2><p>Tak wyglądałoby Twoje zamówienie. To wyłącznie symulacja — nie potrzebujemy adresu, danych karty ani numeru telefonu.</p><ul class="checkout-list">${cart.map(item=>`<li><span>${findProduct(item.id).name} × ${item.qty}<br><small>${formats[item.size]} · ${frames[item.frame]}</small></span><strong>${money(unitPrice(item)*item.qty)}</strong></li>`).join('')}</ul><p class="total-row"><span>Suma produktów</span><strong>${money(total)}</strong></p><button class="button primary" id="confirm-demo">Zakończ demonstrację <span aria-hidden="true">✓</span></button><p>Nie składamy prawdziwego zamówienia. Żadna płatność nie zostanie pobrana.</p>`;
  openDialog(checkoutDialog);
}
checkoutDialog.addEventListener('click',e=>{
  if(e.target.closest('#confirm-demo')){
    cart=[];saveCart();document.querySelector('#checkout-content').innerHTML='<span class="success-mark" aria-hidden="true">✓</span><p class="eyebrow">I TO CAŁA HISTORIA</p><h2 id="checkout-title" tabindex="-1">Dobry gust.<br>Dobry dzień.</h2><p>Demonstracja zakończona. Nie wysłaliśmy zamówienia ani danych i nie pobraliśmy pieniędzy. Koszyk został wyczyszczony — możesz zacząć nową kompozycję.</p><button class="button primary" id="finish-demo">Wracam do plakatów <span aria-hidden="true">↗</span></button>';document.querySelector('#checkout-title').focus();
  }
  if(e.target.closest('#finish-demo'))checkoutDialog.close();
});
window.addEventListener('storage',e=>{if(e.key==='na-sciane-cart')notify('Koszyk zmienił się w innej karcie. Odśwież stronę, żeby wczytać zmiany.');});
renderProducts();saveCart();
