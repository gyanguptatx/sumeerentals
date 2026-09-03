(() => {
  const menuButton = document.getElementById('menuButton');
  const nav = document.getElementById('mainNav');
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  const gallery = window.SUMEE_GALLERY || [];
  const track = document.getElementById('galleryTrack');
  const dots = document.getElementById('galleryDots');
  const dialog = document.getElementById('galleryDialog');
  const dialogImage = document.getElementById('dialogImage');
  const dialogCaption = document.getElementById('dialogCaption');

  gallery.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.className = 'gallery-card';
    btn.type = 'button';
    btn.innerHTML = `<img src="${item.src}" alt="${item.alt}" loading="${i < 5 ? 'eager' : 'lazy'}">`;
    btn.addEventListener('click', () => {
      dialogImage.src = item.src;
      dialogImage.alt = item.alt;
      if (dialogCaption) dialogCaption.textContent = '';
      dialog.showModal();
    });
    track.appendChild(btn);
  });

  const visibleCount = () => window.innerWidth <= 520 ? 2 : window.innerWidth <= 820 ? 3 : 5;
  const pages = () => Math.max(1, Math.ceil(gallery.length / visibleCount()));
  let page = 0;
  function renderDots(){
    dots.innerHTML = '';
    for(let i=0;i<pages();i++){
      const d=document.createElement('span');
      if(i===page) d.classList.add('active');
      dots.appendChild(d);
    }
  }
  function go(delta){
    page = (page + delta + pages()) % pages();
    const card = track.querySelector('.gallery-card');
    if(!card) return;
    const gap = 12;
    const scroll = page * visibleCount() * (card.getBoundingClientRect().width + gap);
    track.scrollTo({left:scroll,behavior:'smooth'});
    renderDots();
  }
  document.getElementById('galleryPrev').addEventListener('click',()=>go(-1));
  document.getElementById('galleryNext').addEventListener('click',()=>go(1));
  window.addEventListener('resize',()=>{page=0;track.scrollLeft=0;renderDots()});
  renderDots();

  document.getElementById('dialogClose').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog) dialog.close()});

  document.getElementById('quoteForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const type = document.getElementById('eventType').value;
    const date = document.getElementById('eventDate').value;
    const details = document.getElementById('details').value.trim();
    const parts = [
      'Hi SuMee Party Rentals, I would like a quote.',
      name ? `Name: ${name}` : '',
      phone ? `Phone: ${phone}` : '',
      type ? `Event: ${type}` : '',
      date ? `Date: ${date}` : '',
      details ? `Details: ${details}` : ''
    ].filter(Boolean);
    window.location.href = `sms:+14696667742?body=${encodeURIComponent(parts.join('\n'))}`;
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
