if (document.getElementById('dxtWidget')) {
  console.log("Widget já está rodando.");
} else {

  const widget = document.createElement('div');
  widget.id = 'dxtWidget';
  widget.style = `
    position:fixed;
    bottom:20px;
    right:20px;
    width:280px;
    height:400px;
    background:#fff;
    border-radius:6px;
    box-shadow:0 2px 6px rgba(0,0,0,0.1);
    z-index:9999;
    display:flex;
    flex-direction:column;
    font-family:sans-serif;
    overflow:hidden;
    border:1px solid #ccc;
    color:#000;
  `;
  widget.innerHTML = `
    <style>
      #dxtWidget button:hover {background:#eee;}
      #dxtWidget.collapsed {opacity:0; pointer-events:none;}
      #dxtWidget #iaMessages {
        flex:1; padding:10px; overflow-y:auto; font-size:14px;
      }
      #dxtWidgetHeader {
        background:#f7f7f7;
        padding:10px;
        font-weight:bold;
        text-align:center;
        border-bottom:1px solid #ddd;
        cursor:move;
      }
      #dxtWidgetFooter {
        background:#f7f7f7;
        padding:6px;
        font-size:12px;
        text-align:center;
        border-top:1px solid #ddd;
        color:#555;
      }
      #dxtWidgetFooter a {
        color:#0077cc;
        text-decoration:none;
      }
      #dxtWidgetFooter a:hover {
        text-decoration:underline;
      }
    </style>
    <div id="dxtWidgetHeader">dxtChat - danexxed's team</div>
    <div id="iaMessages"></div>
    <form id="iaForm" style="display:flex; border-top:1px solid #ddd;">
      <input type="text" id="iaInput" placeholder="Digite aqui..."
             style="flex:1; border:none; padding:10px; background:#fff; color:#000; border-right:1px solid #ddd;" />
      <button type="submit" style="border:none; background:#f0f0f0; color:#000; padding:0 15px;">➤</button>
    </form>
    <div id="dxtWidgetFooter">
      © 2025 <a href="https://danexxedteam.vercel.app" target="_blank">danexxedteam.vercel.app</a>
    </div>
  `;

  document.body.appendChild(widget);

  const header = document.getElementById('dxtWidgetHeader');
  const messages = document.getElementById('iaMessages');
  const form = document.getElementById('iaForm');
  const input = document.getElementById('iaInput');

  
  (function makeDraggable(element) {
    let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;
    header.onmousedown = function(e) {
      e.preventDefault();
      mouseX = e.clientX;
      mouseY = e.clientY;
      document.onmousemove = drag;
      document.onmouseup = stopDrag;
    };
    function drag(e) {
      e.preventDefault();
      offsetX = mouseX - e.clientX;
      offsetY = mouseY - e.clientY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      element.style.top = (element.offsetTop - offsetY) + "px";
      element.style.left = (element.offsetLeft - offsetX) + "px";
    }
    function stopDrag() {
      document.onmousemove = null;
      document.onmouseup = null;
    }
  })(widget);

 
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const text = input.value.trim();
    if(!text) return;
    messages.innerHTML += `<div><b>Você:</b> ${text}</div>`;
    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    const loading = document.createElement('div');
    loading.id = 'iaLoading';
    loading.style = 'color:#888;font-style:italic;';
    loading.innerText = 'Pensando...';
    messages.appendChild(loading);
    messages.scrollTop = messages.scrollHeight;

    try {
      const res = await fetch("https://32f72b76-6030-42b8-a4f1-7b917478ce96-00-352w8eo1fg3gf.riker.replit.dev/proxy", {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          model: 'Project-Model-2.0',
          messages: [{ content: text }]
        })
      });

      if(!res.ok) throw new Error("HTTP " + res.status);

      const data = await res.json();
      loading.remove();
      const reply = data.text || "Resposta inesperada da API.";
      messages.innerHTML += `<div><b>IA:</b> ${reply}</div>`;
      messages.scrollTop = messages.scrollHeight;
    } catch(err) {
      loading.remove();
      messages.innerHTML += `<div style="color:red;">Erro ao se comunicar com a IA:<br>${err.message}</div>`;
      messages.scrollTop = messages.scrollHeight;
      console.error(err);
    }
  });

 
  let collapsed = false;
  window.addEventListener('keydown', e => {
    if(e.key === '1') {
      collapsed = !collapsed;
      collapsed ? widget.classList.add('collapsed') : widget.classList.remove('collapsed');
    }
  });
}