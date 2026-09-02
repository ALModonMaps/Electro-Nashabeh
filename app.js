let session=null,profile=null,currentPage="dashboard",customer={};

const A=id=>document.getElementById(id);

function icons(){
  if(window.lucide)lucide.createIcons();
}

function money(n){
  return "$"+Number(n||0).toFixed(2);
}

function statusAr(s){
  return ({
    unpaid:"غير مدفوعة",
    partial:"مدفوعة جزئيًا",
    paid:"مدفوعة"
  })[s]||s;
}

function receiptNo(){
  let d=new Date();
  let z=n=>String(n).padStart(2,"0");
  return `NSH-${d.getFullYear()}${z(d.getMonth()+1)}${z(d.getDate())}-${z(d.getHours())}${z(d.getMinutes())}${z(d.getSeconds())}`;
}

function getNashabehLogoSrc(){
  let imgs=[...document.querySelectorAll("img")];
  let logo=imgs.find(i=>/nashabeh|logo/i.test(i.src||""));
  return logo?.src||new URL("assets/nashabeh-logo.png",location.href).href;
}

/* =========================================================
   NASHABEH SMART METER
   ========================================================= */

function injectEnhancedStyles(){

  if(A("nashabehEnhancedStyles"))return;

  let st=document.createElement("style");
  st.id="nashabehEnhancedStyles";

  st.textContent=`

  .nashabeh-meter-slot{
    width:190px!important;
    min-width:190px!important;
    max-width:190px!important;
    display:flex!important;
    align-items:center!important;
    justify-content:center!important;
    overflow:visible!important;
    margin:auto!important;
  }

  .nashabeh-smart-meter{
    position:relative;
    width:180px;
    box-sizing:border-box;

    padding:35px 12px 12px;

    border-radius:21px;

    background:
      linear-gradient(
        145deg,
        #e6ecef 0%,
        #9ca7ac 5%,
        #526068 10%,
        #172127 16%,
        #080f14 100%
      );

    border:2px solid #82eaff;

    box-shadow:
      0 0 0 3px rgba(0,221,255,.08),
      0 0 21px rgba(0,221,255,.30),
      0 13px 27px rgba(0,0,0,.55),
      inset 0 0 15px rgba(255,255,255,.12),
      inset 0 -16px 24px rgba(0,0,0,.72);

    animation:
      nshMeterFloat 4.5s ease-in-out infinite,
      nshMeterGlow 3.2s ease-in-out infinite;
  }

  .nashabeh-smart-meter:before,
  .nashabeh-smart-meter:after{
    content:"";
    position:absolute;
    top:92px;

    width:23px;
    height:43px;

    background:
      linear-gradient(145deg,#d7dfe3,#69767d 50%,#2e383d);

    border:1px solid #73828a;

    z-index:-1;

    box-shadow:
      inset 0 0 5px rgba(255,255,255,.3),
      0 4px 8px rgba(0,0,0,.45);
  }

  .nashabeh-smart-meter:before{
    right:-23px;
    border-radius:0 14px 14px 0;
  }

  .nashabeh-smart-meter:after{
    left:-23px;
    border-radius:14px 0 0 14px;
  }

  .nsh-meter-top{
    position:absolute;
    top:13px;
    left:10px;
    right:10px;

    text-align:center;

    color:#edfaff;

    font-family:Arial,sans-serif;
    font-size:6.7px;
    font-weight:800;

    letter-spacing:.04em;

    white-space:nowrap;
  }

  .nsh-meter-scale{
    direction:ltr;

    display:grid;
    grid-template-columns:repeat(6,1fr);

    padding:0 4px 4px;

    color:#d9e6e9;

    font-family:Arial,sans-serif;
    font-size:6px;
    font-weight:700;

    text-align:center;
  }

  .nsh-meter-scale span:last-child{
    color:#16ddff;
  }

  .nsh-meter-display{
    position:relative;

    width:100%;
    min-height:52px;

    box-sizing:border-box;

    display:flex;
    align-items:center;
    justify-content:center;

    overflow:hidden;

    padding:8px 5px 16px;

    border-radius:8px;

    background:
      linear-gradient(180deg,#020604,#061109);

    border:2px solid #173d43;

    box-shadow:
      inset 0 0 17px #000,
      inset 0 0 7px rgba(84,255,49,.16),
      0 0 10px rgba(74,255,46,.18);

    color:#aaff62;

    font-family:"Courier New",Consolas,monospace;
    font-size:22px;
    font-weight:900;

    letter-spacing:.095em;

    text-shadow:
      0 0 4px #75ff4d,
      0 0 9px #55ff32;

    animation:nshScreenPulse 2.4s ease-in-out infinite;
  }

  .nsh-meter-display:before{
    content:"";

    position:absolute;
    inset:0;

    background:
      linear-gradient(
        180deg,
        transparent 0%,
        transparent 40%,
        rgba(156,255,125,.10) 49%,
        rgba(156,255,125,.18) 51%,
        transparent 60%,
        transparent 100%
      );

    transform:translateY(-120%);

    animation:nshMeterScan 2.7s linear infinite;
  }

  .nsh-kwh{
    position:absolute;

    right:7px;
    bottom:4px;

    color:#fff;

    font-family:Arial,sans-serif;
    font-size:8px;
    font-weight:900;

    text-shadow:
      0 0 4px #64ff82,
      0 0 8px rgba(53,255,101,.55);
  }

  .nsh-meter-face{
    margin-top:6px;

    padding:9px;

    border-radius:11px;

    background:
      linear-gradient(150deg,#05090c,#0a1218);

    border:1px solid #27383f;

    box-shadow:
      inset 0 0 13px rgba(0,0,0,.78);
  }

  .nsh-meter-main{
    direction:ltr;

    display:grid;
    grid-template-columns:66px 1fr;
    gap:9px;

    align-items:center;
  }

  .nsh-logo{
    width:62px;
    height:62px;

    box-sizing:border-box;

    display:flex;
    align-items:center;
    justify-content:center;

    border-radius:50%;

    background:
      radial-gradient(circle,#151107,#030405 72%);

    border:1px solid #e0ad00;

    box-shadow:
      0 0 5px rgba(255,199,0,.72),
      0 0 14px rgba(255,184,0,.18),
      inset 0 0 10px #000;
  }

  .nsh-logo img{
    display:block;

    max-width:56px;
    max-height:56px;

    object-fit:contain;

    filter:
      drop-shadow(0 0 4px rgba(255,194,0,.72));
  }

  .nsh-meter-specs{
    direction:ltr;

    text-align:left;

    color:#f1f8fa;

    font-family:Arial,sans-serif;
    font-weight:800;

    line-height:1.8;
  }

  .nsh-meter-specs .voltage{
    font-size:10px;
  }

  .nsh-meter-specs .amp{
    font-size:11px;
  }

  .nsh-meter-specs .brand{
    margin-top:2px;

    color:#afc2c8;

    font-size:6.5px;
    letter-spacing:.06em;
  }

  .nsh-power-strip{
    position:relative;

    height:39px;

    margin-top:9px;

    overflow:hidden;

    border-radius:8px;

    border:1px solid #00cbe7;

    background:
      radial-gradient(
        circle at 15% 50%,
        rgba(0,221,255,.08),
        transparent 42%
      ),
      linear-gradient(180deg,#071217,#03090d);

    box-shadow:
      inset 0 0 10px rgba(0,199,230,.14);
  }

  .nsh-power-strip:before{
    content:"";

    position:absolute;

    top:0;
    left:-45%;

    width:40%;
    height:100%;

    background:
      linear-gradient(
        90deg,
        transparent,
        rgba(54,242,255,.14),
        transparent
      );

    animation:nshSweep 2s linear infinite;
  }

  .nsh-power-strip svg{
    position:absolute;

    left:7px;
    top:5px;

    width:55px;
    height:29px;

    overflow:visible;
  }

  .nsh-wave{
    fill:none;

    stroke:#29f2ff;
    stroke-width:2;

    stroke-linecap:round;
    stroke-linejoin:round;

    stroke-dasharray:8 5;

    filter:
      drop-shadow(0 0 3px #24efff)
      drop-shadow(0 0 6px rgba(0,230,255,.35));

    animation:nshCurrent .48s linear infinite;
  }

  .nsh-smart-label{
    position:absolute;

    left:66px;
    right:23px;
    top:13px;

    text-align:center;

    color:#f0fbff;

    font-family:Arial,sans-serif;
    font-size:7px;
    font-weight:800;

    letter-spacing:.035em;

    white-space:nowrap;
  }

  .nsh-power-led{
    position:absolute;

    right:8px;
    top:15px;

    width:8px;
    height:8px;

    border-radius:50%;

    background:#63ff79;

    box-shadow:
      0 0 4px #63ff79,
      0 0 10px #63ff79;

    animation:nshLed 1s ease-in-out infinite;
  }

  .payment-actions,
  .invoice-actions{
    display:flex;
    gap:6px;
    flex-wrap:wrap;
  }

  .row-btn.print{
    border-color:#12d8ff;
    color:#12d8ff;
  }

  .row-btn.pay{
    border-color:#40ef58;
    color:#40ef58;
  }

  .badge.partial{
    color:#ffc72c;
    border-color:#ffc72c;
  }

  .badge.paid{
    color:#40ef58;
    border-color:#40ef58;
  }

  .badge.unpaid{
    color:#ff6b72;
    border-color:#ff6b72;
  }

  @keyframes nshMeterFloat{

    0%,100%{
      transform:translateY(0);
    }

    50%{
      transform:translateY(-4px);
    }

  }

  @keyframes nshMeterGlow{

    0%,100%{
      box-shadow:
        0 0 0 3px rgba(0,221,255,.07),
        0 0 17px rgba(0,221,255,.24),
        0 13px 27px rgba(0,0,0,.55),
        inset 0 0 15px rgba(255,255,255,.12),
        inset 0 -16px 24px rgba(0,0,0,.72);
    }

    50%{
      box-shadow:
        0 0 0 3px rgba(0,221,255,.13),
        0 0 28px rgba(0,221,255,.40),
        0 15px 31px rgba(0,0,0,.60),
        inset 0 0 15px rgba(255,255,255,.14),
        inset 0 -16px 24px rgba(0,0,0,.72);
    }

  }

  @keyframes nshMeterScan{

    0%{
      transform:translateY(-120%);
    }

    100%{
      transform:translateY(120%);
    }

  }

  @keyframes nshScreenPulse{

    0%,100%{
      text-shadow:
        0 0 4px #75ff4d,
        0 0 8px #55ff32;
    }

    50%{
      text-shadow:
        0 0 6px #8dff69,
        0 0 13px #55ff32,
        0 0 18px rgba(84,255,50,.28);
    }

  }

  @keyframes nshCurrent{

    from{
      stroke-dashoffset:0;
    }

    to{
      stroke-dashoffset:-26;
    }

  }

  @keyframes nshSweep{

    from{
      left:-45%;
    }

    to{
      left:120%;
    }

  }

  @keyframes nshLed{

    0%,100%{
      opacity:.55;
      transform:scale(.82);
    }

    50%{
      opacity:1;
      transform:scale(1.17);
    }

  }

@media(max-width:700px){

  .nashabeh-meter-slot{
    width:112px!important;
    min-width:112px!important;
    max-width:112px!important;
    flex:0 0 112px!important;
    margin:0 auto!important;
    overflow:visible!important;
  }

  .nashabeh-smart-meter{
    width:108px!important;
    padding:24px 7px 7px!important;
    border-radius:15px!important;

    border-width:1px!important;

    box-shadow:
      0 0 0 2px rgba(0,221,255,.07),
      0 0 13px rgba(0,221,255,.25),
      0 8px 18px rgba(0,0,0,.50),
      inset 0 0 10px rgba(255,255,255,.10),
      inset 0 -10px 16px rgba(0,0,0,.70)!important;
  }

  .nashabeh-smart-meter:before,
  .nashabeh-smart-meter:after{
    top:61px!important;
    width:14px!important;
    height:30px!important;
  }

  .nashabeh-smart-meter:before{
    right:-14px!important;
    border-radius:0 9px 9px 0!important;
  }

  .nashabeh-smart-meter:after{
    left:-14px!important;
    border-radius:9px 0 0 9px!important;
  }

  .nsh-meter-scale{
    padding:0 2px 2px!important;
    font-size:4px!important;
  }

  .nsh-meter-display{
    min-height:37px!important;
    padding:5px 3px 11px!important;

    border-radius:6px!important;

    font-size:14px!important;
    letter-spacing:.07em!important;
  }

  .nsh-kwh{
    right:4px!important;
    bottom:2px!important;
    font-size:5px!important;
  }

  .nsh-meter-face{
    margin-top:4px!important;
    padding:5px!important;
    border-radius:7px!important;
  }

  .nsh-meter-main{
    grid-template-columns:39px 1fr!important;
    gap:5px!important;
  }

  .nsh-logo{
    width:37px!important;
    height:37px!important;
  }

  .nsh-logo img{
    max-width:33px!important;
    max-height:33px!important;
  }

  .nsh-meter-specs{
    line-height:1.45!important;
  }

  .nsh-meter-specs .voltage{
    font-size:6px!important;
    white-space:nowrap!important;
  }

  .nsh-meter-specs .amp{
    font-size:7px!important;
  }

  .nsh-meter-specs .brand{
    margin-top:1px!important;
    font-size:4px!important;
    letter-spacing:.02em!important;
  }

  .nsh-power-strip{
    height:25px!important;
    margin-top:5px!important;
    border-radius:6px!important;
  }

  .nsh-power-strip svg{
    left:4px!important;
    top:3px!important;
    width:39px!important;
    height:19px!important;
  }

  .nsh-power-led{
    right:5px!important;
    top:9px!important;
    width:6px!important;
    height:6px!important;
  }

  @keyframes nshMeterFloat{

    0%,100%{
      transform:translateY(0);
    }

    50%{
      transform:translateY(-2px);
    }

  }

}

/* =========================================================
   ADMIN ELECTRICAL AREA BOXES
   ========================================================= */

.energy-area-grid{
  display:grid;
  grid-template-columns:repeat(4,minmax(230px,1fr));
  gap:18px;
}

.energy-box{
  --box-accent:#39f078;
  --box-glow:rgba(57,240,120,.22);
  position:relative;
  min-height:285px;
  overflow:hidden;
  padding:16px;
  border-radius:18px;
  border:1px solid color-mix(in srgb,var(--box-accent) 55%,#17394a);
  background:
    radial-gradient(circle at 85% 10%,var(--box-glow),transparent 34%),
    linear-gradient(145deg,rgba(8,28,37,.98),rgba(3,14,22,.98));
  box-shadow:
    inset 0 0 28px rgba(0,0,0,.45),
    0 12px 32px rgba(0,0,0,.22);
  transition:transform .25s ease,border-color .25s ease,box-shadow .25s ease;
}

.energy-box:hover{
  transform:translateY(-4px);
  box-shadow:
    inset 0 0 28px rgba(0,0,0,.45),
    0 16px 38px rgba(0,0,0,.32),
    0 0 24px var(--box-glow);
}

.energy-box.stable{
  --box-accent:#39f078;
  --box-glow:rgba(57,240,120,.20);
}

.energy-box.monitoring{
  --box-accent:#ffc72c;
  --box-glow:rgba(255,199,44,.19);
}

.energy-box.high_load{
  --box-accent:#ff8c33;
  --box-glow:rgba(255,140,51,.20);
}

.energy-box.outage{
  --box-accent:#ff4757;
  --box-glow:rgba(255,71,87,.22);
}

.energy-box::before{
  content:"";
  position:absolute;
  top:-60px;
  right:-60px;
  width:150px;
  height:150px;
  border-radius:50%;
  background:radial-gradient(circle,var(--box-glow),transparent 68%);
  pointer-events:none;
}

.energy-box::after{
  content:"";
  position:absolute;
  left:-40%;
  bottom:0;
  width:35%;
  height:1px;
  background:linear-gradient(90deg,transparent,var(--box-accent),transparent);
  box-shadow:0 0 8px var(--box-accent);
  animation:electricalBoxSweep 3s linear infinite;
}

.energy-box-top{
  position:relative;
  z-index:2;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  margin-bottom:14px;
}

.energy-box-name{
  display:flex;
  align-items:center;
  gap:10px;
}

.energy-box-name h4{
  margin:0;
  font-size:16px;
  font-weight:800;
  color:#f6fbff;
}

.energy-box-name small{
  display:block;
  margin-top:3px;
  color:#7898a7;
  font-size:8px;
  letter-spacing:.05em;
}

.energy-box-icon{
  position:relative;
  width:47px;
  height:47px;
  flex:0 0 47px;
  display:grid;
  place-items:center;
  border-radius:13px;
  color:var(--box-accent);
  background:linear-gradient(145deg,rgba(14,42,53,.9),rgba(5,19,27,.95));
  border:1px solid color-mix(in srgb,var(--box-accent) 45%,transparent);
  box-shadow:
    inset 0 0 12px rgba(0,0,0,.45),
    0 0 14px var(--box-glow);
}

.energy-box-icon svg{
  width:24px;
  height:24px;
}

.energy-box-led{
  position:absolute;
  right:-2px;
  top:-2px;
  width:9px;
  height:9px;
  border-radius:50%;
  background:var(--box-accent);
  box-shadow:0 0 5px var(--box-accent),0 0 12px var(--box-accent);
  animation:areaStatusLed 1.6s ease-in-out infinite;
}

.energy-status{
  display:flex;
  align-items:center;
  gap:7px;
  padding:6px 9px;
  border-radius:999px;
  color:var(--box-accent);
  font-size:8px;
  font-weight:800;
  border:1px solid color-mix(in srgb,var(--box-accent) 40%,transparent);
  background:color-mix(in srgb,var(--box-accent) 8%,transparent);
}

.energy-status-dot{
  width:6px;
  height:6px;
  border-radius:50%;
  background:var(--box-accent);
  box-shadow:0 0 7px var(--box-accent);
}

.energy-panel{
  position:relative;
  z-index:2;
  margin-bottom:12px;
  padding:11px;
  border-radius:13px;
  background:linear-gradient(180deg,rgba(1,10,15,.72),rgba(8,23,31,.72));
  border:1px solid #173747;
}

.energy-flow{
  position:relative;
  height:42px;
  margin-bottom:10px;
  overflow:hidden;
  border-radius:9px;
  background:linear-gradient(180deg,#030b10,#07151d);
  border:1px solid #143541;
}

.energy-flow svg{
  position:absolute;
  top:6px;
  left:9px;
  width:92px;
  height:28px;
}

.energy-flow-line{
  fill:none;
  stroke:var(--box-accent);
  stroke-width:2;
  stroke-linecap:round;
  stroke-linejoin:round;
  stroke-dasharray:8 6;
  filter:drop-shadow(0 0 4px var(--box-accent));
  animation:areaElectricFlow .6s linear infinite;
}

.energy-flow-label{
  position:absolute;
  right:10px;
  top:10px;
  text-align:right;
}

.energy-flow-label strong{
  display:block;
  color:#e9f8ff;
  font-size:9px;
}

.energy-flow-label small{
  display:block;
  margin-top:2px;
  color:var(--box-accent);
  font-size:7px;
  font-weight:800;
}

.energy-breaker-row{
  display:grid;
  grid-template-columns:1fr 44px;
  align-items:center;
  gap:10px;
}

.energy-breaker{
  position:relative;
  height:42px;
  border-radius:8px;
  border:1px solid #254858;
  background:linear-gradient(145deg,#122934,#06121a);
  box-shadow:inset 0 0 9px rgba(0,0,0,.55);
}

.energy-breaker::before{
  content:"";
  position:absolute;
  left:50%;
  top:7px;
  transform:translateX(-50%);
  width:11px;
  height:25px;
  border-radius:3px;
  background:linear-gradient(180deg,#d5e1e5,#63727a);
  box-shadow:0 0 5px rgba(255,255,255,.16);
}

.energy-box.outage .energy-breaker::before{
  top:11px;
  transform:translateX(-50%) rotate(24deg);
  background:linear-gradient(180deg,#777,#3b4449);
}

.energy-breaker-text small{
  display:block;
  color:#7094a4;
  font-size:7px;
}

.energy-breaker-text b{
  display:block;
  margin-top:2px;
  color:#e9f6fa;
  font-size:10px;
}

.energy-controls{
  position:relative;
  z-index:2;
  display:grid;
  gap:8px;
}

.energy-controls label{
  color:#89a8b5;
  font-size:8px;
}

.energy-controls select,
.energy-controls textarea{
  width:100%;
  margin-top:5px;
  border-radius:9px;
  border:1px solid #245064;
  background:#061b27;
  color:#e8f8ff;
  outline:none;
  padding:9px;
  transition:.2s ease;
}

.energy-controls select:focus,
.energy-controls textarea:focus{
  border-color:var(--box-accent);
  box-shadow:0 0 0 2px var(--box-glow);
}

.energy-controls textarea{
  resize:vertical;
  min-height:55px;
}

.energy-save-btn{
  width:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:7px;
  margin-top:3px;
  padding:10px 12px;
  border-radius:9px;
  border:1px solid color-mix(in srgb,var(--box-accent) 55%,transparent);
  background:linear-gradient(135deg,color-mix(in srgb,var(--box-accent) 16%,#07141b),#07151d);
  color:var(--box-accent);
  font-size:9px;
  font-weight:800;
  cursor:pointer;
  transition:.2s ease;
}

.energy-save-btn:hover{
  transform:translateY(-1px);
  background:color-mix(in srgb,var(--box-accent) 18%,#07151d);
  box-shadow:0 0 15px var(--box-glow);
}

.energy-save-btn svg{
  width:14px;
  height:14px;
}

@keyframes electricalBoxSweep{
  from{
    left:-40%;
  }

  to{
    left:120%;
  }
}

@keyframes areaStatusLed{
  0%,100%{
    opacity:.45;
    transform:scale(.8);
  }

  50%{
    opacity:1;
    transform:scale(1.15);
  }
}

@keyframes areaElectricFlow{
  to{
    stroke-dashoffset:-28;
  }
}

@media(max-width:1350px){

  .energy-area-grid{
    grid-template-columns:repeat(2,minmax(240px,1fr));
  }

}

@media(max-width:700px){

  .energy-area-grid{
    grid-template-columns:1fr;
  }

  .energy-box{
    min-height:auto;
  }

}

`;

  document.head.appendChild(st);

}


/*
  IMPORTANT:
  We completely replace the OLD meter visual.
  لذلك الدوائر والعناصر القديمة لا تبقى موجودة.
*/

function enhanceMeter(){

  let oldScreen=
    document.querySelector(
      ".meter-screen"
    );

  if(!oldScreen)return;

  let oldHost=
    oldScreen.parentElement;

  if(!oldHost)return;

  if(
    oldHost.classList.contains(
      "nashabeh-meter-slot"
    )
  ){
    return;
  }

  let reading=
    oldScreen.textContent
    .trim()||
    "0000000";

  oldHost.className=
    oldHost.className+
    " nashabeh-meter-slot";

  oldHost.innerHTML = `

    <div class="nashabeh-smart-meter">

      <div class="nsh-meter-scale">

        <span>10K</span>
        <span>1K</span>
        <span>100</span>
        <span>10</span>
        <span>1</span>
        <span>0.1</span>

      </div>

      <div class="nsh-meter-display">

        <span class="nsh-reading">
          ${reading}
        </span>

        <span class="nsh-kwh">
          kWh
        </span>

      </div>

      <div class="nsh-meter-face">

        <div class="nsh-meter-main">

          <div class="nsh-logo">

            <img
              src="${getNashabehLogoSrc()}"
              alt="نشابة">

          </div>

          <div class="nsh-meter-specs">

            <div class="voltage">
              230V ~ 50Hz
            </div>

            <div class="amp">
              5A
            </div>

            <div class="brand">
              NASHABEH ENERGY
            </div>

          </div>

        </div>

        <div class="nsh-power-strip">

          <svg
            viewBox="0 0 80 30"
            aria-hidden="true">

            <polyline
              class="nsh-wave"
              points="
              0,15
              9,15
              14,5
              20,26
              26,8
              32,21
              39,15
              47,15
              52,8
              58,24
              64,11
              70,19
              80,15
              ">
            </polyline>

          </svg>

          <span class="nsh-power-led"></span>

        </div>

      </div>

    </div>

  `;

}

/* =========================================================
   PRINTING
   ========================================================= */

function printHtml(title,body){

  let w=
    window.open(
      "",
      "_blank",
      "width=900,height=1000"
    );

  if(!w){

    return alert(
      "اسمح بفتح النوافذ المنبثقة للطباعة"
    );

  }

  let logo=
    getNashabehLogoSrc();

  w.document.write(`

  <!doctype html>

  <html
    dir="rtl"
    lang="ar">

  <head>

    <meta charset="utf-8">

    <title>
      ${title}
    </title>

    <style>

      body{

        font-family:
          Arial,
          Tahoma,
          sans-serif;

        color:#111;

        background:#fff;

        padding:28px;

      }

      .sheet{

        max-width:760px;

        margin:auto;

        border:
          1px solid #ddd;

        border-radius:16px;

        padding:28px;

      }

      .head{

        display:flex;

        justify-content:
          space-between;

        align-items:center;

        border-bottom:
          2px solid #d6a51e;

        padding-bottom:16px;

        margin-bottom:22px;

      }

      .head img{

        width:86px;

        height:86px;

        object-fit:contain;

      }

      .brand h1{

        margin:0;

        color:#b88200;

      }

      .brand p{

        margin:5px 0;

        color:#666;

      }

      .grid{

        display:grid;

        grid-template-columns:
          1fr 1fr;

        gap:12px;

      }

      .cell{

        border:
          1px solid #e5e5e5;

        border-radius:10px;

        padding:10px;

      }

      .cell small{

        display:block;

        color:#777;

        margin-bottom:4px;

      }

      .total{

        font-size:28px;

        font-weight:700;

        color:#b88200;

        margin:22px 0;

      }

      .foot{

        margin-top:28px;

        padding-top:15px;

        border-top:
          1px solid #ddd;

        font-size:12px;

        color:#777;

      }

      @media print{

        body{
          padding:0;
        }

        .sheet{
          border:0;
        }

      }

    </style>

  </head>

  <body>

    <div class="sheet">

      <div class="head">

        <div class="brand">

          <h1>
            إشتراكات نشابة
          </h1>

          <p>
            خدمة الكهرباء والطاقة - طرابلس
          </p>

        </div>

        <img src="${logo}">

      </div>

      ${body}

      <div class="foot">

        تم إصدار هذه الوثيقة إلكترونيًا
        من نظام إشتراكات نشابة.

      </div>

    </div>

    <script>

      window.onload=
        ()=>
        setTimeout(
          ()=>window.print(),
          300
        );

    <\/script>

  </body>

  </html>

  `);

  w.document.close();

}


/* =========================================================
   AUTH
   ========================================================= */

function authMsg(t,ok=false){

  let e=A("authMessage");

  e.textContent=t;

  e.classList.remove(
    "hidden"
  );

  e.style.background=
    ok
      ?"#0d3b20"
      :"#3a1016";

  e.style.color=
    ok
      ?"#8dff9b"
      :"#ff9499";

}


function showFirstAdmin(){

  A("loginPane")
    .classList
    .add("hidden");

  A("firstAdminPane")
    .classList
    .remove("hidden");

}


function showLogin(){

  A("firstAdminPane")
    .classList
    .add("hidden");

  A("loginPane")
    .classList
    .remove("hidden");

}


async function login(){

  try{

    let {error}=
      await sb.auth
      .signInWithPassword({

        email:
          A("loginEmail")
          .value
          .trim(),

        password:
          A("loginPassword")
          .value

      });

    if(error){

      return authMsg(
        error.message
      );

    }

    await boot();

  }
  catch(e){

    authMsg(
      e?.message||
      "تعذر الاتصال بالخدمة. جرّب مجددًا."
    );

  }

}


async function createFirstAdmin(){

  let full_name=
    A("adminName")
    .value
    .trim();

  let email=
    A("adminEmail")
    .value
    .trim();

  let phone=
    A("adminPhone")
    .value
    .trim();

  let password=
    A("adminPassword")
    .value;

  if(
    !full_name||
    !email||
    password.length<8
  ){

    return authMsg(
      "أدخل الاسم والإيميل وكلمة مرور 8 أحرف على الأقل"
    );

  }

  let {data,error}=
    await sb.auth
    .signUp({

      email,

      password,

      options:{
        data:{
          full_name,
          phone
        }
      }

    });

  if(error){

    return authMsg(
      error.message
    );

  }

  if(!data.session){

    return authMsg(

      "تم إنشاء الحساب. أكد البريد إذا طلب Supabase ذلك ثم سجّل الدخول.",

      true

    );

  }

  let r=
    await sb.functions
    .invoke(
      "bootstrap-admin",
      {
        body:{}
      }
    );

  if(r.error){

    return authMsg(
      "تم الحساب لكن لم يترقّ للمدير: "+
      r.error.message
    );

  }

  boot();

}


async function logout(){

  await sb.auth.signOut();

  location.reload();

}


/* =========================================================
   BOOT
   ========================================================= */

async function boot(){

  let s=
    (
      await sb.auth
      .getSession()
    )
    .data
    .session;

  if(!s)return;

  session=s;

  let q=
    await sb
    .from("profiles")
    .select("*,areas(*)")
    .eq(
      "id",
      s.user.id
    )
    .single();

  if(q.error){

    return authMsg(
      q.error.message
    );

  }

  profile=q.data;

  A("authScreen")
    .classList
    .add("hidden");

  A("topbar")
    .classList
    .remove("hidden");

  A("appRoot")
    .classList
    .remove("hidden");

  A("loggedUser")
    .textContent=

      profile.full_name+
      " · "+
      (
        profile.role==="admin"
          ?"مدير"
          :"مشترك"
      );

  if(
    profile.role==="admin"
  ){

    A("adminApp")
      .classList
      .remove("hidden");

    A("customerApp")
      .classList
      .add("hidden");

    renderAdmin(
      "dashboard"
    );

  }
  else{

    A("customerApp")
      .classList
      .remove("hidden");

    A("adminApp")
      .classList
      .add("hidden");

    loadCustomer();

  }

  icons();

}


/* =========================================================
   STATUS
   ========================================================= */

function stateAr(s){

  return({

    stable:
      "الشبكة مستقرة",

    monitoring:
      "قيد المتابعة",

    high_load:
      "ضغط مرتفع",

    outage:
      "انقطاع عام"

  })[s]||
  "غير محدد";

}


function stateClass(s){

  return(
    s==="stable"
      ?"stable"
      :
    s==="high_load"||
    s==="outage"
      ?"danger"
      :"warning"
  );

}


/* =========================================================
   CUSTOMER LOAD
   ========================================================= */

async function loadCustomer(){

  let uid=
    session.user.id;

  let [
    m,
    i,
    p,
    f,
    n
  ]=
  await Promise.all([

    sb.from("meters")
      .select("*")
      .eq(
        "customer_id",
        uid
      )
      .eq(
        "active",
        true
      )
      .maybeSingle(),

    /*
      مهم جداً:
      أحدث فاتورة فعلياً حسب تاريخ إنشائها.
      مش billing_month.
    */

    sb.from("invoices")
      .select("*")
      .eq(
        "customer_id",
        uid
      )
      .order(
        "created_at",
        {
          ascending:false
        }
      )
      .limit(1)
      .maybeSingle(),

    sb.from("payments")
      .select(
        "*,invoices(billing_month,amount,status)"
      )
      .eq(
        "customer_id",
        uid
      )
      .order(
        "paid_at",
        {
          ascending:false
        }
      ),

    sb.from("fault_reports")
      .select("*")
      .eq(
        "customer_id",
        uid
      )
      .order(
        "created_at",
        {
          ascending:false
        }
      ),

    sb.from("notifications")
      .select("*")
      .order(
        "created_at",
        {
          ascending:false
        }
      )

  ]);

  customer={

    profile,

    area:
      profile.areas,

    meter:
      m.data,

    invoice:
      i.data,

    payments:
      p.data||[],

    faults:
      f.data||[],

    notifications:
      (n.data||[])
      .filter(
        x=>
          !x.area_id||
          x.area_id===
          profile.area_id||
          x.customer_id===
          uid
      ),

    readings:[]

  };

  if(customer.meter){

    customer.readings=
      (
        await sb
        .from(
          "meter_readings"
        )
        .select("*")
        .eq(
          "meter_id",
          customer.meter.id
        )
        .order(
          "reading_date",
          {
            ascending:false
          }
        )
      ).data||[];

  }

  renderCustomer();

}


/* =========================================================
   CUSTOMER HOME
   ========================================================= */

function renderCustomer(){

  injectEnhancedStyles();

  let c=
    customer.profile;

  let a=
    customer.area;

  let m=
    customer.meter;

  let inv=
    customer.invoice;

  let r=
    customer.readings[0];

  A("customerName")
    .textContent=
    c.full_name;

  A("customerArea")
    .textContent=
    a?.name||
    "غير محددة";

  A("customerMeter")
    .textContent=
    m?.meter_number||
    "غير مربوط";

  let oldScreen=
    document
    .querySelector(
      ".meter-screen"
    );

  if(oldScreen){

    oldScreen.textContent=
      String(
        r?.reading_value??
        0
      )
      .padStart(
        7,
        "0"
      );

  }

  enhanceMeter();

  let st=
    A("customerStatus");

  st.className=
    "status "+
    (
      c.active
        ?"active"
        :"inactive"
    );

  st.innerHTML=
    c.active
      ?
    '<i data-lucide="circle-check-big"></i> اشتراك فعّال'
      :
    '<i data-lucide="circle-x"></i> اشتراك غير فعّال';

  A("networkCard")
    .className=

      "panel network-card "+
      stateClass(
        a?.network_status
      );

  A("networkStateText")
    .textContent=
    stateAr(
      a?.network_status
    );

  A("networkMessage")
    .textContent=

      a?.status_message||
      (
        "حالة شبكة "+
        (a?.name||"")
      );

  A("currentBill")
    .textContent=

      inv
        ?money(inv.amount)
        :"$ 0.00";

  let billDate=
    document
    .querySelector(
      ".bill-card p"
    );

  if(billDate){

    billDate.innerHTML=

      '<i data-lucide="calendar-days"></i> '+
      (
        inv?.due_date||
        "لا توجد فاتورة"
      );

  }

  A("notifCount")
    .textContent=
    customer
    .notifications
    .length;

  icons();

}


/* =========================================================
   CUSTOMER BOTTOM NAV
   ========================================================= */

function setBottom(btn){

  if(!btn)return;

  document
  .querySelectorAll(
    ".customer-bottom-nav button"
  )
  .forEach(
    x=>
      x.classList.remove(
        "active"
      )
  );

  btn.classList.add(
    "active"
  );

}


function showCustomerHome(btn){

  A("customerContent")
    .innerHTML="";

  setBottom(btn);

}


/* =========================================================
   CUSTOMER PAGES
   ========================================================= */

async function showCustomerTab(type,btn){

  setBottom(btn);

  let p=
    A("customerContent");

  let c=
    customer.profile;

  let inv=
    customer.invoice;

  let m=
    customer.meter;

  if(type==="invoice"){

    p.innerHTML=

      inv
      ?`

      <h3>
        فاتورتي
      </h3>

      <div class="detail-row">

        <span>
          القراءة السابقة
        </span>

        <b>
          ${inv.previous_reading}
        </b>

      </div>

      <div class="detail-row">

        <span>
          القراءة الحالية
        </span>

        <b>
          ${inv.current_reading}
        </b>

      </div>

      <div class="detail-row">

        <span>
          الاستهلاك
        </span>

        <b style="color:#12d8ff">

          ${
            inv.consumption_kwh??
            inv.consumption??
            Math.max(
              0,
              Number(
                inv.current_reading
              )-
              Number(
                inv.previous_reading
              )
            )
          }
          kWh

        </b>

      </div>

      <div class="detail-row">

        <span>
          سعر الكيلوواط
        </span>

        <b>

          $${
            Number(
              inv.price_per_kwh||
              inv.kwh_price||
              0
            )
            .toFixed(2)
          }
          / kWh

        </b>

      </div>

      <div class="detail-row">

        <span>
          القيمة
        </span>

        <b style="color:#ffc72c">

          ${money(inv.amount)}

        </b>

      </div>

      <div class="detail-row">

        <span>
          الحالة
        </span>

        <b>
          ${statusAr(inv.status)}
        </b>

      </div>

      <div class="detail-row">

        <span>
          الاستحقاق
        </span>

        <b>
          ${inv.due_date||"-"}
        </b>

      </div>

      <button
        class="action-btn"
        onclick="printCustomerInvoice()">

        طباعة الفاتورة

      </button>

      `
      :`

      <h3>
        فاتورتي
      </h3>

      <p>
        لا توجد فاتورة بعد.
      </p>

      `;

  }

  if(type==="payments"){

    p.innerHTML=

      "<h3>دفعاتي</h3>"+

      (
        customer
        .payments
        .length

        ?
        customer
        .payments
        .map(
          x=>`

          <div class="detail-row">

            <span>

              ${
                x.invoices
                ?.billing_month||
                ""
              }

              ·

              ${
                x.payment_method||
                "cash"
              }

            </span>

            <b style="color:#40ef58">

              ${money(x.amount)}

            </b>

          </div>

          `
        )
        .join("")

        :

        "<p>لا توجد دفعات.</p>"

      );

  }

  if(type==="readings"){

    p.innerHTML=

      "<h3>قراءات العداد</h3>"+

      (
        customer
        .readings
        .length

        ?
        customer
        .readings
        .map(
          x=>`

          <div class="detail-row">

            <span>

              ${x.billing_month}
              ·
              ${x.reading_date}

            </span>

            <b>
              ${x.reading_value}
            </b>

          </div>

          `
        )
        .join("")

        :

        "<p>لا توجد قراءات.</p>"

      );

  }

  if(type==="account"){

    p.innerHTML=`

      <h3>
        حسابي
      </h3>

      <div class="detail-row">

        <span>
          الاسم
        </span>

        <b>
          ${c.full_name}
        </b>

      </div>

      <div class="detail-row">

        <span>
          الهاتف
        </span>

        <b>
          ${c.phone||"-"}
        </b>

      </div>

      <div class="detail-row">

        <span>
          رقم العداد
        </span>

        <b>
          ${m?.meter_number||"-"}
        </b>

      </div>

      <div class="detail-row">

        <span>
          العلبة
        </span>

        <b>
          ${customer.area?.name||"-"}
        </b>

      </div>

    `;

  }

  if(type==="notifications"){

    p.innerHTML=

      "<h3>التنبيهات</h3>"+

      (
        customer
        .notifications
        .length

        ?

        customer
        .notifications
        .map(
          x=>`

          <div class="notification-item">

            <b>
              ${x.title}
            </b>

            <p>
              ${x.message}
            </p>

          </div>

          `
        )
        .join("")

        :

        "<p>لا توجد تنبيهات.</p>"

      );

  }

  if(type==="faults"){

    let h=
      "<h3>أعطالي</h3>";

    for(
      let f of customer.faults
    ){

      let im="";

      if(f.image_path){

        let u=
          await sb.storage
          .from(
            "fault-images"
          )
          .createSignedUrl(
            f.image_path,
            600
          );

        if(
          u.data?.signedUrl
        ){

          im=`

          <img
            class="fault-thumb"
            src="${u.data.signedUrl}">

          `;

        }

      }

      h+=`

        <div class="fault-item">

          <b>

            #${f.id}
            ·
            ${f.fault_type}

          </b>

          <p>
            ${f.description||""}
          </p>

          <p>

            الحالة:
            ${f.status}

            ${
              f.admin_note
                ?" · "+f.admin_note
                :""
            }

          </p>

          ${im}

        </div>

      `;

    }

    p.innerHTML=h;

  }

  icons();

}


function printCustomerInvoice(){

  if(
    !customer.invoice
  )return;

  printInvoiceData(

    customer.invoice,

    {

      full_name:
        customer.profile.full_name,

      phone:
        customer.profile.phone,

      area:
        customer.area?.name,

      meter_number:
        customer.meter?.meter_number

    }

  );

}


/* =========================================================
   CUSTOMER FAULT
   ========================================================= */

function openFaultDialog(){

  A("faultDialog")
    .showModal();

  icons();

}


async function submitFault(){

  let type=
    A("faultType")
    .value;

  let description=
    A("faultDescription")
    .value;

  let file=
    document
    .querySelector(
      '#faultDialog input[type="file"]'
    )
    .files[0];

  if(!type){

    return alert(
      "اختر نوع العطل"
    );

  }

  let image_path=null;

  if(file){

    image_path=

      session.user.id+
      "/"+
      Date.now()+
      "."+
      file.name
      .split(".")
      .pop();

    let up=
      await sb.storage
      .from(
        "fault-images"
      )
      .upload(
        image_path,
        file
      );

    if(up.error){

      return alert(

        "فشل رفع الصورة: "+
        up.error.message

      );

    }

  }

  let r=
    await sb
    .from(
      "fault_reports"
    )
    .insert({

      customer_id:
        session.user.id,

      area_id:
        profile.area_id,

      meter_id:
        customer.meter?.id||
        null,

      fault_type:
        type,

      description,

      image_path

    });

  if(r.error){

    return alert(
      r.error.message
    );

  }

  A("faultDialog")
    .close();

  await loadCustomer();

  showCustomerTab(
    "faults"
  );

  alert(
    "تم إرسال البلاغ للإدارة"
  );

}

/* =========================================================
   ADMIN HEADER
   ========================================================= */

function header(t,d,a=""){

  return `

    <div class="admin-header">

      <div>

        <span class="eyebrow">

          NASHABEH ENERGY CONTROL CENTER

        </span>

        <h2>
          ${t}
        </h2>

        <p>
          ${d}
        </p>

      </div>

      ${a}

    </div>

  `;

}


/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */

async function renderAdmin(page="dashboard"){

  currentPage=page;

  document
  .querySelectorAll(
    ".side"
  )
  .forEach(

    b=>

    b.classList.toggle(
      "active",
      b.dataset.page===page
    )

  );

  let c=
    A("adminContent");

  if(page==="dashboard"){

    let[
      pr,
      ar,
      me,
      fa,
      iv,
      pay
    ]=
    await Promise.all([

      sb.from("profiles")
        .select(
          "id,active,role"
        ),

      sb.from("areas")
        .select("*"),

      sb.from("meters")
        .select(
          "id",
          {
            count:"exact"
          }
        ),

      sb.from("fault_reports")
        .select(
          "id,status"
        ),

      sb.from("invoices")
        .select(
          "id,amount,status"
        ),

      sb.from("payments")
        .select(
          "invoice_id,amount"
        )

    ]);

    let ps=
      (pr.data||[])
      .filter(
        x=>
        x.role==="customer"
      );

    let open=
      (fa.data||[])
      .filter(
        x=>
        x.status!=="resolved"
      )
      .length;

    let paidMap={};

    for(
      let x of
      (pay.data||[])
    ){

      paidMap[
        x.invoice_id
      ]=

      (
        paidMap[
          x.invoice_id
        ]||
        0
      )+

      Number(
        x.amount
      );

    }

    let unpaid=

      (iv.data||[])
      .reduce(

        (s,x)=>

        s+
        Math.max(
          0,
          Number(
            x.amount
          )-
          Number(
            paidMap[x.id]||
            0
          )
        ),

        0

      );

    c.innerHTML=

      header(
        "لوحة التحكم",
        "بيانات حقيقية من Supabase."
      )

      +

      `

      <div class="stats">

        <article class="stat cyan">

          <i data-lucide="users-round"></i>

          <div>

            <small>
              المشتركون
            </small>

            <strong>
              ${ps.length}
            </strong>

          </div>

        </article>

        <article class="stat green">

          <i data-lucide="circle-check-big"></i>

          <div>

            <small>
              فعّالة
            </small>

            <strong>

              ${
                ps.filter(
                  x=>x.active
                )
                .length
              }

            </strong>

          </div>

        </article>

        <article class="stat red">

          <i data-lucide="circle-x"></i>

          <div>

            <small>
              غير فعّالة
            </small>

            <strong>

              ${
                ps.filter(
                  x=>!x.active
                )
                .length
              }

            </strong>

          </div>

        </article>

        <article class="stat gold">

          <i data-lucide="receipt-text"></i>

          <div>

            <small>
              المستحق
            </small>

            <strong>
              ${money(unpaid)}
            </strong>

          </div>

        </article>

        <article class="stat blue">

          <i data-lucide="wrench"></i>

          <div>

            <small>
              أعطال مفتوحة
            </small>

            <strong>
              ${open}
            </strong>

          </div>

        </article>

        <article class="stat teal">

          <i data-lucide="boxes"></i>

          <div>

            <small>
              العلب
            </small>

            <strong>

              ${
                (ar.data||[])
                .length
              }

            </strong>

          </div>

        </article>

        <article class="stat lime">

          <i data-lucide="gauge"></i>

          <div>

            <small>
              العدادات
            </small>

            <strong>
              ${me.count||0}
            </strong>

          </div>

        </article>

      </div>

      <article class="panel admin-card">

        <div class="section-title">

          <div>

            <h3>
              العلب والمناطق
            </h3>

          </div>

        </div>

        <div class="boxes-grid">

          ${
            (ar.data||[])
            .map(
              x=>`

              <div
                class="area-card ${stateClass(x.network_status)}">

                <h4>
                  ${x.name}
                </h4>

                <p>
                  ${stateAr(x.network_status)}
                </p>

              </div>

              `
            )
            .join("")
          }

        </div>

      </article>

      `;

  }

  if(page==="subscribers"){
    await subscribers(c);
  }

  if(page==="areas"){
    await areas(c);
  }

  if(page==="meters"){
    await meters(c);
  }

  if(page==="invoices"){
    await invoices(c);
  }

  if(page==="payments"){
    await payments(c);
  }

  if(page==="faults"){
    await faults(c);
  }

  if(page==="notifications"){
    await notifications(c);
  }

  if(page==="settings"){
    await settings(c);
  }

  icons();

}


/* =========================================================
   SUBSCRIBERS
   ========================================================= */

async function subscribers(c){

  let areas=
    (
      await sb
      .from("areas")
      .select("*")
      .order("name")
    ).data||[];

  let ps=
    (
      await sb
      .from("profiles")
      .select(
        "*,areas(name)"
      )
      .eq(
        "role",
        "customer"
      )
      .order(
        "created_at",
        {
          ascending:false
        }
      )
    ).data||[];

  c.innerHTML=

    header(
      "المشتركون",
      "إنشاء حساب مشترك وربطه بالعداد والعلبة والقراءة الافتتاحية."
    )

    +

    `

    <article class="panel admin-card">

      <div class="admin-form">

        <label>

          الاسم

          <input id="newName">

        </label>

        <label>

          الإيميل

          <input
            id="newEmail"
            type="email"
            autocomplete="off">

        </label>

        <label>

          الهاتف

          <input id="newPhone">

        </label>

        <label>

          كلمة المرور

          <input
            id="newPassword"
            type="password"
            autocomplete="new-password"
            placeholder="8 أحرف على الأقل">

        </label>

        <label>

          العلبة

          <select id="newArea">

            ${
              areas.map(
                a=>`

                <option
                  value="${a.id}">

                  ${a.name}

                </option>

                `
              )
              .join("")
            }

          </select>

        </label>

        <label>

          رقم العداد

          <input
            id="newMeter"
            autocomplete="off"
            placeholder="مثال: 756">

        </label>

        <label>

          القراءة الحالية عند بدء النظام

          <input
            id="newInitialReading"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            placeholder="مثال: 850">

        </label>

        <div class="full">

          <button
            class="action-btn"
            onclick="createCustomer()">

            إنشاء حساب المشترك

          </button>

        </div>

      </div>

    </article>

    <article class="panel admin-card">

      <div class="table-wrap">

        <table class="admin-table">

          <thead>

            <tr>

              <th>
                الاسم
              </th>

              <th>
                الهاتف
              </th>

              <th>
                المنطقة
              </th>

              <th>
                الحالة
              </th>

              <th>
                تغيير
              </th>

            </tr>

          </thead>

          <tbody>

            ${
              ps.map(
                p=>`

                <tr>

                  <td>
                    ${p.full_name}
                  </td>

                  <td>
                    ${p.phone||"-"}
                  </td>

                  <td>
                    ${
                      p.areas?.name||
                      "-"
                    }
                  </td>

                  <td>

                    <span
                      class="badge ${p.active?"active":"inactive"}">

                      ${
                        p.active
                        ?"فعّال"
                        :"غير فعّال"
                      }

                    </span>

                  </td>

                  <td>

                    <button
                      class="row-btn"
                      onclick="toggleCustomer('${p.id}',${!p.active})">

                      ${
                        p.active
                        ?"تعطيل"
                        :"تفعيل"
                      }

                    </button>

                  </td>

                </tr>

                `
              )
              .join("")
            }

          </tbody>

        </table>

      </div>

    </article>

    `;

}


async function createCustomer(){

  let full_name=
    A("newName")
    .value
    .trim();

  let email=
    A("newEmail")
    .value
    .trim();

  let phone=
    A("newPhone")
    .value
    .trim();

  let password=
    A("newPassword")
    .value;

  let area_id=
    A("newArea")
    .value;

  let meter_number=
    A("newMeter")
    .value
    .trim();

  let initial_reading=
    A("newInitialReading")
    .value
    .trim();

  if(!full_name){

    return alert(
      "أدخل اسم المشترك"
    );

  }

  if(!email){

    return alert(
      "أدخل البريد الإلكتروني"
    );

  }

  if(
    !password||
    password.length<8
  ){

    return alert(
      "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
    );

  }

  if(!meter_number){

    return alert(
      "أدخل رقم العداد"
    );

  }

  if(
    initial_reading===""||
    isNaN(
      Number(
        initial_reading
      )
    )||
    Number(
      initial_reading
    )<0
  ){

    return alert(
      "أدخل القراءة الحالية للعداد بشكل صحيح"
    );

  }

  let body={

    full_name,

    email,

    phone,

    password,

    area_id,

    meter_number,

    initial_reading

  };

  let r=
    await sb.functions
    .invoke(
      "create-customer",
      {
        body
      }
    );

  if(r.error){

    return alert(
      r.error.message
    );

  }

  alert(
    "تم إنشاء الحساب والعداد وحفظ القراءة الافتتاحية"
  );

  renderAdmin(
    "subscribers"
  );

}


async function toggleCustomer(id,active){

  let r=
    await sb
    .from("profiles")
    .update({
      active
    })
    .eq(
      "id",
      id
    );

  if(r.error){

    return alert(
      r.error.message
    );

  }

  renderAdmin(
    "subscribers"
  );

}


/* =========================================================
   AREAS
   ========================================================= */

async function areas(c){

  let ar=
    (
      await sb
      .from("areas")
      .select("*")
      .order("name")
    ).data||[];

  function areaStatusLabel(status){

    return({

      stable:"ONLINE",
      monitoring:"MONITOR",
      high_load:"HIGH LOAD",
      outage:"OUTAGE"

    })[status]||"UNKNOWN";

  }

  function breakerStatus(status){

    return(
      status==="outage"
      ?"MAIN BREAKER OFF"
      :"MAIN BREAKER ON"
    );

  }

  c.innerHTML=

    header(
      "العلب والمناطق",
      "مركز مراقبة وتوزيع الطاقة وحالة الشبكة لكل منطقة."
    )

    +

    `

    <article class="panel admin-card">

      <div class="energy-area-grid">

        ${
          ar.map(
            a=>`

            <div
              class="energy-box ${a.network_status||"stable"}">

              <div class="energy-box-top">

                <div class="energy-box-name">

                  <div class="energy-box-icon">

                    <i data-lucide="circuit-board"></i>

                    <span class="energy-box-led"></span>

                  </div>

                  <div>

                    <h4>${a.name}</h4>

                    <small>
                      ELECTRICAL DISTRIBUTION BOX
                    </small>

                  </div>

                </div>

                <div class="energy-status">

                  <span class="energy-status-dot"></span>

                  ${areaStatusLabel(a.network_status)}

                </div>

              </div>

              <div class="energy-panel">

                <div class="energy-flow">

                  <svg viewBox="0 0 100 30" aria-hidden="true">

                    <polyline
                      class="energy-flow-line"
                      points="
                      0,15
                      10,15
                      15,5
                      22,26
                      29,8
                      36,21
                      44,15
                      56,15
                      62,7
                      69,24
                      76,10
                      83,19
                      100,15
                      ">
                    </polyline>

                  </svg>

                  <div class="energy-flow-label">

                    <strong>
                      POWER DISTRIBUTION
                    </strong>

                    <small>
                      ${stateAr(a.network_status)}
                    </small>

                  </div>

                </div>

                <div class="energy-breaker-row">

                  <div class="energy-breaker-text">

                    <small>
                      MAIN DISTRIBUTION
                    </small>

                    <b>
                      ${breakerStatus(a.network_status)}
                    </b>

                  </div>

                  <div class="energy-breaker"></div>

                </div>

              </div>

              <div class="energy-controls">

                <label>

                  حالة الشبكة

                  <select id="as_${a.id}">

                    <option value="stable" ${a.network_status==="stable"?"selected":""}>
                      مستقرة
                    </option>

                    <option value="monitoring" ${a.network_status==="monitoring"?"selected":""}>
                      متابعة
                    </option>

                    <option value="high_load" ${a.network_status==="high_load"?"selected":""}>
                      ضغط مرتفع
                    </option>

                    <option value="outage" ${a.network_status==="outage"?"selected":""}>
                      انقطاع عام
                    </option>

                  </select>

                </label>

                <label>

                  رسالة للمشتركين

                  <textarea
                    id="am_${a.id}"
                    rows="2"
                    placeholder="مثال: الشبكة تعمل بصورة طبيعية">${a.status_message||""}</textarea>

                </label>

                <button
                  class="energy-save-btn"
                  onclick="saveArea('${a.id}')">

                  <i data-lucide="save"></i>

                  تحديث حالة العلبة

                </button>

              </div>

            </div>

            `
          )
          .join("")
        }

      </div>

    </article>

    `;

}


async function saveArea(id){

  let r=
    await sb
    .from("areas")
    .update({

      network_status:
        A("as_"+id)
        .value,

      status_message:
        A("am_"+id)
        .value

    })
    .eq(
      "id",
      id
    );

  if(r.error){

    return alert(
      r.error.message
    );

  }

  alert(
    "تم تحديث العلبة"
  );

}

/* =========================================================
   METERS ADMIN
   ========================================================= */

async function meters(c){

  let ms=
    (
      await sb
      .from("meters")
      .select(
        "*,profiles(full_name),meter_readings(*)"
      )
      .order(
        "created_at",
        {
          ascending:false
        }
      )
    ).data||[];

  c.innerHTML=

    header(
      "العدادات",
      "رقم العداد والقراءة تدخل يدويًا."
    )

    +

    `

    <article class="panel admin-card">

      <div class="table-wrap">

        <table class="admin-table">

          <thead>

            <tr>

              <th>
                المشترك
              </th>

              <th>
                رقم العداد
              </th>

              <th>
                آخر قراءة
              </th>

              <th>
                الإجراء
              </th>

            </tr>

          </thead>

          <tbody>

            ${
              ms.map(
                m=>{

                  let rr=
                    (
                      m.meter_readings||
                      []
                    )
                    .sort(
                      (a,b)=>

                        new Date(
                          b.reading_date
                        )
                        -
                        new Date(
                          a.reading_date
                        )

                    )[0];

                  return `

                    <tr>

                      <td>

                        ${
                          m.profiles
                          ?.full_name||
                          "-"
                        }

                      </td>

                      <td>

                        <input
                          class="meter-inline"
                          id="mn_${m.id}"
                          value="${m.meter_number}">

                      </td>

                      <td>

                        ${
                          rr?.reading_value??
                          "-"
                        }

                      </td>

                      <td>

                        <button
                          class="row-btn"
                          onclick="saveMeter('${m.id}')">

                          حفظ الرقم

                        </button>

                        <button
                          class="row-btn"
                          onclick="addReading('${m.id}')">

                          قراءة جديدة

                        </button>

                      </td>

                    </tr>

                  `;

                }
              )
              .join("")
            }

          </tbody>

        </table>

      </div>

    </article>

    `;

}


async function saveMeter(id){

  let r=
    await sb
    .from("meters")
    .update({

      meter_number:
        A("mn_"+id)
        .value

    })
    .eq(
      "id",
      id
    );

  if(r.error){

    return alert(
      r.error.message
    );

  }

  alert(
    "تم تغيير رقم العداد"
  );

}


async function addReading(id){

  let v=
    prompt(
      "أدخل القراءة الحالية كما تظهر على العداد"
    );

  if(v===null)return;

  let m=
    prompt(
      "شهر القراءة YYYY-MM-01",
      "2026-08-01"
    );

  let d=
    prompt(
      "تاريخ القراءة YYYY-MM-DD",
      new Date()
      .toISOString()
      .slice(0,10)
    );

  let r=
    await sb
    .from("meter_readings")
    .insert({

      meter_id:id,

      reading_value:
        Number(v),

      billing_month:m,

      reading_date:d

    });

  if(r.error){

    return alert(
      r.error.message
    );

  }

  alert(
    "تم حفظ القراءة"
  );

  renderAdmin(
    "meters"
  );

}

/* =========================================================
   INVOICES
   ========================================================= */

async function invoices(c){

  let ms=
    (
      await sb
      .from("meters")
      .select(
        "id,meter_number,customer_id,profiles(full_name,phone,area_id,areas(name)),meter_readings(reading_value,reading_date,billing_month)"
      )
    ).data||[];

  let iv=
    (
      await sb
      .from("invoices")
      .select(
        "*,profiles(full_name,phone,areas(name)),meters(meter_number)"
      )
      .order(
        "created_at",
        {
          ascending:false
        }
      )
    ).data||[];

  let s=
    (
      await sb
      .from("app_settings")
      .select(
        "kwh_price,currency"
      )
      .eq(
        "id",
        1
      )
      .single()
    ).data||
    {

      kwh_price:.65,

      currency:"USD"

    };

  window._invoices=iv;

  let options=

    ms.map(
      m=>{

        let rr=
          (
            m.meter_readings||
            []
          )
          .sort(
            (a,b)=>

              new Date(
                b.reading_date
              )
              -
              new Date(
                a.reading_date
              )

          )[0];

        let last=
          rr?.reading_value??
          0;

        return `

          <option
            value="${m.id}"
            data-customer="${m.customer_id}"
            data-last="${last}">

            ${
              m.profiles
              ?.full_name||
              "-"
            }

            ·

            ${m.meter_number}

          </option>

        `;

      }
    )
    .join("");

  c.innerHTML=

    header(
      "الفواتير",
      "أدخل القراءة الحالية فقط، والنظام يحسب الاستهلاك والقيمة تلقائيًا."
    )

    +

    `

    <article class="panel admin-card">

      <div class="admin-form">

        <label>

          العداد

          <select
            id="ivMeter"
            onchange="setInvoiceMeterDefaults()">

            ${options}

          </select>

        </label>

        <label>

          شهر الفاتورة

          <input
            id="ivMonth"
            type="month">

        </label>

        <label>

          القراءة السابقة

          <input
            id="ivPrev"
            type="text"
            readonly>

        </label>

        <label>

          القراءة الحالية

          <input
            id="ivCur"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            placeholder="أدخل القراءة الحالية"
            oninput="updateInvoicePreview()">

        </label>

        <label>

          الاستهلاك kWh

          <input
            id="ivConsumption"
            type="text"
            readonly>

        </label>

        <label>

          سعر 1 kWh

          <input
            id="ivPrice"
            type="text"
            value="${Number(s.kwh_price).toFixed(2)}"
            readonly>

        </label>

        <label>

          قيمة الفاتورة

          <input
            id="ivAmount"
            type="text"
            readonly>

        </label>

        <label>

          الاستحقاق

          <input
            id="ivDue"
            type="date">

        </label>

        <div class="full">

          <button
            class="action-btn"
            onclick="createInvoice()">

            حفظ الفاتورة

          </button>

        </div>

      </div>

    </article>


    <article class="panel admin-card">

      <div class="table-wrap">

        <table class="admin-table">

          <thead>

            <tr>

              <th>
                المشترك
              </th>

              <th>
                العداد
              </th>

              <th>
                الشهر
              </th>

              <th>
                السابقة
              </th>

              <th>
                الحالية
              </th>

              <th>
                الاستهلاك
              </th>

              <th>
                سعر kWh
              </th>

              <th>
                القيمة
              </th>

              <th>
                الحالة
              </th>

              <th>
                الإجراء
              </th>

            </tr>

          </thead>

          <tbody>

            ${
              iv.map(
                i=>`

                <tr>

                  <td>

                    ${
                      i.profiles
                      ?.full_name||
                      "-"
                    }

                  </td>

                  <td>

                    ${
                      i.meters
                      ?.meter_number||
                      "-"
                    }

                  </td>

                  <td>

                    ${i.billing_month}

                  </td>

                  <td>

                    ${i.previous_reading}

                  </td>

                  <td>

                    ${i.current_reading}

                  </td>

                  <td>

                    ${
                      i.consumption_kwh??
                      i.consumption??
                      0
                    }
                    kWh

                  </td>

                  <td>

                    $${
                      Number(
                        i.price_per_kwh||
                        i.kwh_price||
                        0
                      )
                      .toFixed(2)
                    }

                  </td>

                  <td>

                    ${money(i.amount)}

                  </td>

                  <td>

                    <span
                      class="badge ${i.status}">

                      ${statusAr(i.status)}

                    </span>

                  </td>

                  <td>

                    <div class="invoice-actions">

                      <button
                        class="row-btn print"
                        onclick="printInvoice('${i.id}')">

                        طباعة

                      </button>

                      ${
                        i.status!=="paid"
                        ?`

                        <button
                          class="row-btn pay"
                          onclick="renderAdmin('payments')">

                          تسديد

                        </button>

                        `
                        :""
                      }

                    </div>

                  </td>

                </tr>

                `
              )
              .join("")
            }

          </tbody>

        </table>

      </div>

    </article>

    `;

  setInvoiceMeterDefaults();

}


function setInvoiceMeterDefaults(){

  let sel=
    A("ivMeter");

  if(
    !sel||
    !sel.options.length
  )return;

  let o=
    sel.options[
      sel.selectedIndex
    ];

  A("ivPrev")
    .value=
    o.dataset.last||
    "0";

  A("ivCur")
    .value="";

  A("ivConsumption")
    .value="0";

  A("ivAmount")
    .value="0.00";

}


function updateInvoicePreview(){

  let prev=
    Number(
      A("ivPrev").value||
      0
    );

  let cur=
    Number(
      A("ivCur").value||
      0
    );

  let price=
    Number(
      A("ivPrice").value||
      0
    );

  let cons=
    cur>=prev
    ?cur-prev
    :0;

  A("ivConsumption")
    .value=
    cons;

  A("ivAmount")
  .value=
  (
    cons*
    price
  ).toFixed(2);

}


async function createInvoice(){

  let sel=
    A("ivMeter");

  let o=
    sel.options[
      sel.selectedIndex
    ];

  let previous=
    Number(
      A("ivPrev")
      .value
    );

  let currentRaw=
    A("ivCur")
    .value
    .trim();

  let price=
    Number(
      A("ivPrice")
      .value
    );

  let month=
    A("ivMonth")
    .value;

  let due=
    A("ivDue")
    .value;

  if(!month){

    return alert(
      "اختر شهر الفاتورة"
    );

  }

  if(
    currentRaw===""
  ){

    return alert(
      "أدخل القراءة الحالية"
    );

  }

  let current=
    Number(
      currentRaw
    );

  if(
    !Number.isFinite(
      current
    )
  ){

    return alert(
      "أدخل القراءة الحالية"
    );

  }

  if(
    current<
    previous
  ){

    return alert(
      "القراءة الحالية لا يمكن أن تكون أقل من القراءة السابقة"
    );

  }

  if(!due){

    return alert(
      "اختر تاريخ الاستحقاق"
    );

  }

  let consumption=
    current-
    previous;

  let amount=
    Number(
      (
        consumption*
        price
      )
      .toFixed(2)
    );

  let billing_month=
    month+
    "-01";

  let r=
    await sb
    .from(
      "invoices"
    )
    .insert({

      customer_id:
        o.dataset.customer,

      meter_id:
        sel.value,

      billing_month,

      previous_reading:
        previous,

      current_reading:
        current,


      consumption_kwh:
        consumption,

      kwh_price:
        price,

      price_per_kwh:
        price,

      amount,

      due_date:
        due,

      status:
        "unpaid"

    });

  if(r.error){

    return alert(
      r.error.message
    );

  }

  let reading=
    await sb
    .from(
      "meter_readings"
    )
    .upsert(
      {

        meter_id:
          sel.value,

        reading_value:
          current,

        billing_month,

        reading_date:
          new Date()
          .toISOString()
          .slice(0,10)

      },
      {

        onConflict:
          "meter_id,billing_month"

      }
    );

  if(reading.error){

    return alert(

      "تم حفظ الفاتورة لكن تعذر تحديث قراءة العداد: "+
      reading.error.message

    );

  }

  alert(

    `تم حفظ الفاتورة: ${consumption} kWh × $${price.toFixed(2)} = ${money(amount)}`

  );

  renderAdmin(
    "invoices"
  );

}


/* =========================================================
   PRINT INVOICE
   ========================================================= */

function printInvoice(id){

  let i=
    (
      window._invoices||
      []
    )
    .find(
      x=>x.id===id
    );

  if(!i)return;

  printInvoiceData(
    i,
    {

      full_name:
        i.profiles?.full_name,

      phone:
        i.profiles?.phone,

      area:
        i.profiles?.areas?.name,

      meter_number:
        i.meters?.meter_number

    }
  );

}


function printInvoiceData(i,u){

  let cons=

    i.consumption_kwh??
    i.consumption??
    Math.max(
      0,
      Number(
        i.current_reading
      )-
      Number(
        i.previous_reading
      )
    );

  let rate=
    Number(
      i.price_per_kwh||
      i.kwh_price||
      0
    );

  printHtml(

    "فاتورة إشتراكات نشابة",

    `

      <h2>
        فاتورة كهرباء
      </h2>

      <div class="grid">

        <div class="cell">

          <small>
            المشترك
          </small>

          <b>
            ${u.full_name||"-"}
          </b>

        </div>

        <div class="cell">

          <small>
            رقم العداد
          </small>

          <b>
            ${u.meter_number||"-"}
          </b>

        </div>

        <div class="cell">

          <small>
            المنطقة / العلبة
          </small>

          <b>
            ${u.area||"-"}
          </b>

        </div>

        <div class="cell">

          <small>
            شهر الفاتورة
          </small>

          <b>
            ${i.billing_month}
          </b>

        </div>

        <div class="cell">

          <small>
            القراءة السابقة
          </small>

          <b>
            ${i.previous_reading}
          </b>

        </div>

        <div class="cell">

          <small>
            القراءة الحالية
          </small>

          <b>
            ${i.current_reading}
          </b>

        </div>

        <div class="cell">

          <small>
            الاستهلاك
          </small>

          <b>
            ${cons} kWh
          </b>

        </div>

        <div class="cell">

          <small>
            سعر 1 kWh
          </small>

          <b>
            $${rate.toFixed(2)}
          </b>

        </div>

        <div class="cell">

          <small>
            الاستحقاق
          </small>

          <b>
            ${i.due_date||"-"}
          </b>

        </div>

        <div class="cell">

          <small>
            الحالة
          </small>

          <b>
            ${statusAr(i.status)}
          </b>

        </div>

      </div>

      <div class="total">

        الإجمالي:
        ${money(i.amount)}

      </div>

    `

  );

}

/* =========================================================
   PAYMENTS
   ========================================================= */

async function payments(c){

  let[
    p,
    iv
  ]=
  await Promise.all([

    sb.from("payments")
      .select(
        "*,profiles(full_name),invoices(billing_month,amount,status)"
      )
      .order(
        "paid_at",
        {
          ascending:false
        }
      ),

    sb.from("invoices")
      .select(
        "*,profiles(full_name),meters(meter_number)"
      )
      .neq(
        "status",
        "paid"
      )
      .order(
        "created_at",
        {
          ascending:false
        }
      )

  ]);

  let pays=
    p.data||
    [];

  let invs=
    iv.data||
    [];

  window._payments=
    pays;

  let paidBy={};

  for(
    let x of pays
  ){

    paidBy[
      x.invoice_id
    ]=

    (
      paidBy[
        x.invoice_id
      ]||
      0
    )
    +
    Number(
      x.amount
    );

  }

  let opts=

    invs.map(
      i=>{

        let rem=

          Math.max(
            0,

            Number(
              i.amount
            )
            -
            Number(
              paidBy[i.id]||
              0
            )
          );

        return `

          <option
            value="${i.id}"
            data-customer="${i.customer_id}"
            data-total="${i.amount}"
            data-paid="${paidBy[i.id]||0}"
            data-remaining="${rem}">

            ${
              i.profiles
              ?.full_name||
              "-"
            }

            ·

            ${i.billing_month}

            ·

            متبقي
            ${money(rem)}

          </option>

        `;

      }
    )
    .join("");

  c.innerHTML=

    header(
      "الدفعات",
      "تسجيل دفعة كاملة أو جزئية وإصدار إيصال."
    )

    +

    `

    <article class="panel admin-card">

      <div class="admin-form">

        <label>

          الفاتورة

          <select
            id="payInvoice"
            onchange="setPaymentDefaults()">

            ${opts}

          </select>

        </label>

        <label>

          المبلغ المدفوع

          <input
            id="payAmount"
            type="text"
            inputmode="decimal">

        </label>

        <label>

          طريقة الدفع

          <select
            id="payMethod">

            <option value="cash">
              نقدًا Cash
            </option>

            <option value="bank_transfer">
              تحويل مصرفي
            </option>

            <option value="other">
              أخرى
            </option>

          </select>

        </label>

        <label>

          مرجع / رقم عملية

          <input
            id="payReference"
            autocomplete="off">

        </label>

        <label class="full">

          ملاحظة

          <input
            id="payNote"
            autocomplete="off">

        </label>

        <div class="full">

          <button
            class="action-btn"
            onclick="recordPayment()">

            تسجيل الدفعة وإصدار إيصال

          </button>

        </div>

      </div>

    </article>

    <article class="panel admin-card">

      <div class="table-wrap">

        <table class="admin-table">

          <thead>

            <tr>

              <th>
                المشترك
              </th>

              <th>
                الشهر
              </th>

              <th>
                القيمة
              </th>

              <th>
                الطريقة
              </th>

              <th>
                الإيصال
              </th>

              <th>
                التاريخ
              </th>

              <th>
                الإجراء
              </th>

            </tr>

          </thead>

          <tbody>

            ${
              pays.map(
                x=>`

                <tr>

                  <td>

                    ${
                      x.profiles
                      ?.full_name||
                      "-"
                    }

                  </td>

                  <td>

                    ${
                      x.invoices
                      ?.billing_month||
                      "-"
                    }

                  </td>

                  <td>

                    ${money(x.amount)}

                  </td>

                  <td>

                    ${
                      x.payment_method||
                      "cash"
                    }

                  </td>

                  <td>

                    ${
                      x.receipt_no||
                      "-"
                    }

                  </td>

                  <td>

                    ${
                      new Date(
                        x.paid_at
                      )
                      .toLocaleString(
                        "ar-LB"
                      )
                    }

                  </td>

                  <td>

                    <button
                      class="row-btn print"
                      onclick="printReceipt('${x.id}')">

                      طباعة إيصال

                    </button>

                  </td>

                </tr>

                `
              )
              .join("")
            }

          </tbody>

        </table>

      </div>

    </article>

    `;

  setPaymentDefaults();

}


function setPaymentDefaults(){

  let s=
    A("payInvoice");

  if(
    !s||
    !s.options.length
  )return;

  A("payAmount")
    .value=

    Number(
      s.options[
        s.selectedIndex
      ]
      .dataset
      .remaining||
      0
    )
    .toFixed(2);

}


async function recordPayment(){

  let s=
    A("payInvoice");

  if(
    !s||
    !s.options.length
  ){

    return alert(
      "لا توجد فواتير مستحقة"
    );

  }

  let o=
    s.options[
      s.selectedIndex
    ];

  let amount=
    Number(
      A("payAmount")
      .value
    );

  let remaining=
    Number(
      o.dataset
      .remaining
    );

  let method=
    A("payMethod")
    .value;

  let reference=
    A("payReference")
    .value
    .trim();

  let note=
    A("payNote")
    .value
    .trim();

  if(
    !Number.isFinite(
      amount
    )||
    amount<=0
  ){

    return alert(
      "أدخل مبلغًا صحيحًا"
    );

  }

  if(
    amount>
    remaining+.001
  ){

    return alert(
      "المبلغ أكبر من الرصيد المتبقي"
    );

  }

  let rec=
    receiptNo();

  let r=
    await sb
    .from("payments")
    .insert({

      invoice_id:
        s.value,

      customer_id:
        o.dataset.customer,

      amount,

      payment_method:
        method,

      receipt_no:
        rec,

      reference:
        reference||
        null,

      note:
        note||
        null

    })
    .select(
      "*,profiles(full_name),invoices(billing_month,amount,status)"
    )
    .single();

  if(r.error){

    return alert(
      r.error.message
    );

  }

  alert(
    `تم تسجيل الدفعة بنجاح. رقم الإيصال: ${rec}`
  );

  window._lastPayment=
    r.data;

  printReceiptData(
    r.data
  );

  renderAdmin(
    "payments"
  );

}


function printReceipt(id){

  let x=
    (
      window._payments||
      []
    )
    .find(
      y=>y.id===id
    );

  if(x){

    printReceiptData(x);

  }

}


function printReceiptData(x){

  printHtml(

    "إيصال دفع - إشتراكات نشابة",

    `

      <h2>
        إيصال قبض
      </h2>

      <div class="grid">

        <div class="cell">

          <small>
            رقم الإيصال
          </small>

          <b>
            ${x.receipt_no||"-"}
          </b>

        </div>

        <div class="cell">

          <small>
            المشترك
          </small>

          <b>

            ${
              x.profiles
              ?.full_name||
              "-"
            }

          </b>

        </div>

        <div class="cell">

          <small>
            شهر الفاتورة
          </small>

          <b>

            ${
              x.invoices
              ?.billing_month||
              "-"
            }

          </b>

        </div>

        <div class="cell">

          <small>
            طريقة الدفع
          </small>

          <b>

            ${
              x.payment_method||
              "cash"
            }

          </b>

        </div>

        <div class="cell">

          <small>
            المرجع
          </small>

          <b>

            ${
              x.reference||
              "-"
            }

          </b>

        </div>

        <div class="cell">

          <small>
            التاريخ
          </small>

          <b>

            ${
              new Date(
                x.paid_at||
                Date.now()
              )
              .toLocaleString(
                "ar-LB"
              )
            }

          </b>

        </div>

      </div>

      <div class="total">

        المبلغ المقبوض:
        ${money(x.amount)}

      </div>

    `

  );

}

/* =========================================================
   FAULTS ADMIN
   ========================================================= */

async function faults(c){

  let fs=
    (
      await sb
      .from("fault_reports")
      .select(
        "*,profiles(full_name),areas(name),meters(meter_number)"
      )
      .order(
        "created_at",
        {
          ascending:false
        }
      )
    ).data||[];

  window._faults=
    fs;

  c.innerHTML=

    header(
      "الأعطال",
      "بلاغات حقيقية مع الصور والحالة."
    )

    +

    `

    <article class="panel admin-card">

      <div class="table-wrap">

        <table class="admin-table">

          <thead>

            <tr>

              <th>#</th>

              <th>
                المشترك
              </th>

              <th>
                المنطقة
              </th>

              <th>
                العطل
              </th>

              <th>
                الحالة
              </th>

              <th>
                الإجراء
              </th>

            </tr>

          </thead>

          <tbody>

            ${
              fs.map(
                f=>`

                <tr>

                  <td>
                    #${f.id}
                  </td>

                  <td>

                    ${
                      f.profiles
                      ?.full_name||
                      "-"
                    }

                  </td>

                  <td>

                    ${
                      f.areas
                      ?.name||
                      "-"
                    }

                  </td>

                  <td>

                    ${f.fault_type}

                  </td>

                  <td>

                    <span
                      class="badge ${f.status}">

                      ${f.status}

                    </span>

                  </td>

                  <td>

                    <button
                      class="row-btn"
                      onclick="openFaultAdmin(${f.id})">

                      فتح

                    </button>

                  </td>

                </tr>

                `
              )
              .join("")
            }

          </tbody>

        </table>

      </div>

    </article>

    `;

}


async function openFaultAdmin(id){

  let f=
    window._faults
    .find(
      x=>x.id===id
    );

  let img="";

  if(f.image_path){

    let u=
      await sb.storage
      .from(
        "fault-images"
      )
      .createSignedUrl(
        f.image_path,
        600
      );

    if(
      u.data
      ?.signedUrl
    ){

      img=`

        <img
          class="fault-thumb-large"
          src="${u.data.signedUrl}">

      `;

    }

  }

  let old=
    A(
      "faultAdminDialog"
    );

  if(old){

    old.remove();

  }

  let d=
    document
    .createElement(
      "dialog"
    );

  d.id=
    "faultAdminDialog";

  d.innerHTML=`

    <form method="dialog">

      <div class="dialog-title">

        <div>

          <i data-lucide="wrench"></i>

          <strong>
            بلاغ عطل #${f.id}
          </strong>

        </div>

        <button
          class="icon-btn"
          value="cancel">

          <i data-lucide="x"></i>

        </button>

      </div>

      <div class="dialog-content">

        <div class="detail-row">

          <span>
            المشترك
          </span>

          <b>

            ${
              f.profiles
              ?.full_name||
              "-"
            }

          </b>

        </div>

        <div class="detail-row">

          <span>
            المنطقة
          </span>

          <b>

            ${
              f.areas
              ?.name||
              "-"
            }

          </b>

        </div>

        <div class="detail-row">

          <span>
            رقم العداد
          </span>

          <b>

            ${
              f.meters
              ?.meter_number||
              "-"
            }

          </b>

        </div>

        <div class="detail-row">

          <span>
            نوع العطل
          </span>

          <b>
            ${f.fault_type}
          </b>

        </div>

        <div class="detail-row">

          <span>
            الوصف
          </span>

          <b>
            ${f.description||"-"}
          </b>

        </div>

        ${img}

        <label>

          حالة البلاغ

          <select id="faultAdminStatus">

            <option
              value="open"
              ${f.status==="open"?"selected":""}>

              مفتوح

            </option>

            <option
              value="scheduled"
              ${f.status==="scheduled"?"selected":""}>

              مجدول

            </option>

            <option
              value="repairing"
              ${f.status==="repairing"?"selected":""}>

              قيد التصليح

            </option>

            <option
              value="resolved"
              ${f.status==="resolved"?"selected":""}>

              تم الحل

            </option>

          </select>

        </label>

        <label>

          ملاحظة الإدارة

          <textarea
            id="faultAdminNote"
            rows="4">${f.admin_note||""}</textarea>

        </label>

        <button
          type="button"
          class="action-btn"
          onclick="saveFaultAdmin(${f.id})">

          حفظ التحديث

        </button>

      </div>

    </form>

  `;

  document.body
  .appendChild(d);

  d.showModal();

  icons();

}


async function saveFaultAdmin(id){

  let status=
    A("faultAdminStatus")
    .value;

  let admin_note=
    A("faultAdminNote")
    .value
    .trim();

  let r=
    await sb
    .from("fault_reports")
    .update({

      status,

      admin_note:
        admin_note||
        null

    })
    .eq(
      "id",
      id
    );

  if(r.error){

    return alert(
      r.error.message
    );

  }

  let d=
    A(
      "faultAdminDialog"
    );

  if(d){

    d.close();
    d.remove();

  }

  alert(
    "تم تحديث البلاغ"
  );

  renderAdmin(
    "faults"
  );

}

/* =========================================================
   NOTIFICATIONS
   ========================================================= */

async function notifications(c){

  let ar=
    (
      await sb
      .from("areas")
      .select("*")
    ).data||[];

  let ns=
    (
      await sb
      .from("notifications")
      .select(
        "*,areas(name)"
      )
      .order(
        "created_at",
        {
          ascending:false
        }
      )
    ).data||[];

  window._areas=
    ar;

  c.innerHTML=

    header(
      "التنبيهات",
      "إرسال تنبيه عام أو لمنطقة.",
      `

        <button
          class="primary"
          onclick="openNotificationDialog()">

          إرسال تنبيه

        </button>

      `
    )

    +

    `

      <article class="panel admin-card">

        ${
          ns.map(
            n=>`

              <div class="notification-item">

                <b>

                  ${n.title}
                  ·
                  ${
                    n.areas
                    ?.name||
                    "الكل"
                  }

                </b>

                <p>
                  ${n.message}
                </p>

              </div>

            `
          )
          .join("")
        }

      </article>

    `;

}


function openNotificationDialog(){

  A("notifArea")
    .innerHTML=

      '<option value="">الكل</option>'+

      window._areas
      .map(
        a=>`

          <option
            value="${a.id}">

            ${a.name}

          </option>

        `
      )
      .join("");

  A("notificationDialog")
    .showModal();

  icons();

}


async function sendNotification(){

  let r=
    await sb
    .from("notifications")
    .insert({

      area_id:
        A("notifArea")
        .value||
        null,

      title:
        A("notifTitle")
        .value,

      message:
        A("notifMessage")
        .value,

      severity:
        "warning"

    });

  if(r.error){

    return alert(
      r.error.message
    );

  }

  A("notificationDialog")
    .close();

  alert(
    "تم إرسال التنبيه"
  );

  renderAdmin(
    "notifications"
  );

}


/* =========================================================
   SETTINGS
   ========================================================= */

async function settings(c){

  let s=
    (
      await sb
      .from(
        "app_settings"
      )
      .select("*")
      .eq(
        "id",
        1
      )
      .single()
    ).data||
    {

      kwh_price:.65,

      currency:"USD"

    };

  c.innerHTML=

    header(
      "الإعدادات",
      "إعدادات التسعير العامة للمنصة."
    )

    +

    `

      <article class="panel admin-card">

        <div class="admin-form">

          <label>

            سعر 1 kWh بالدولار

            <input
              id="setKwhPrice"
              type="text"
              inputmode="decimal"
              value="${Number(s.kwh_price).toFixed(2)}">

          </label>

          <label>

            العملة

            <input
              value="${s.currency||"USD"}"
              readonly>

          </label>

          <div class="full">

            <p
              style="
                color:#8fa7b8;
                font-size:10px
              ">

              كل فاتورة جديدة تحفظ سعر الكيلو المستخدم فيها،
              لذلك تغيير السعر لاحقًا لا يغيّر الفواتير القديمة.

            </p>

            <button
              class="action-btn"
              onclick="saveSettings()">

              حفظ سعر الكيلوواط

            </button>

          </div>

        </div>

      </article>

    `;

}


async function saveSettings(){

  let price=
    Number(
      A("setKwhPrice")
      .value
    );

  if(
    !Number.isFinite(
      price
    )||
    price<0
  ){

    return alert(
      "أدخل سعرًا صحيحًا"
    );

  }

  let r=
    await sb
    .from(
      "app_settings"
    )
    .update({

      kwh_price:
        price,

      updated_at:
        new Date()
        .toISOString()

    })
    .eq(
      "id",
      1
    );

  if(r.error){

    return alert(
      r.error.message
    );

  }

  alert(

    "تم تحديث سعر الكيلوواط إلى $"+
    price.toFixed(2)

  );

  renderAdmin(
    "settings"
  );

}


/* =========================================================
   NAVIGATION
   ========================================================= */

document
.querySelectorAll(
  ".side"
)
.forEach(

  b=>

  b.onclick=()=>{

    renderAdmin(
      b.dataset.page
    );

    A("sidebar")
      .classList
      .remove(
        "open"
      );

  }

);

A("mobileMenuBtn")
  .onclick=

  ()=>{

    A("sidebar")
      .classList
      .toggle(
        "open"
      );

  };

/* =========================================================
   ADMIN PREMIUM V2 — DASHBOARD + METERS
   ========================================================= */

function injectAdminPremiumV2Styles(){

  if(A("nashabehAdminPremiumV2"))return;

  let st=
    document.createElement(
      "style"
    );

  st.id=
    "nashabehAdminPremiumV2";

  st.textContent=`

  .control-center{
    display:grid;
    gap:18px;
  }

  .control-hero{
    position:relative;
    overflow:hidden;

    display:grid;
    grid-template-columns:minmax(0,1.45fr) minmax(280px,.55fr);
    gap:18px;

    min-height:185px;

    padding:22px;

    border-radius:22px;

    border:
      1px solid rgba(35,211,255,.22);

    background:
      radial-gradient(
        circle at 12% 20%,
        rgba(0,224,255,.13),
        transparent 28%
      ),
      radial-gradient(
        circle at 90% 0%,
        rgba(255,191,36,.10),
        transparent 27%
      ),
      linear-gradient(
        145deg,
        #061c28 0%,
        #03131d 58%,
        #07141b 100%
      );

    box-shadow:
      inset 0 0 38px rgba(0,0,0,.35),
      0 18px 45px rgba(0,0,0,.22);
  }

  .control-hero::after{
    content:"";

    position:absolute;

    left:-25%;
    bottom:0;

    width:25%;
    height:1px;

    background:
      linear-gradient(
        90deg,
        transparent,
        #1ce7ff,
        transparent
      );

    box-shadow:
      0 0 12px #1ce7ff;

    animation:
      ccSweep 4s linear infinite;
  }

  .control-hero-copy{
    position:relative;
    z-index:2;
    align-self:center;
  }

  .control-eyebrow{
    display:inline-flex;
    align-items:center;
    gap:7px;

    margin-bottom:10px;

    padding:6px 9px;

    border-radius:999px;

    border:
      1px solid rgba(36,229,255,.28);

    background:
      rgba(13,69,86,.27);

    color:#46e7ff;

    font-size:8px;
    font-weight:900;

    letter-spacing:.08em;
  }

  .control-live-dot{
    width:7px;
    height:7px;

    border-radius:50%;

    background:#36f47a;

    box-shadow:
      0 0 6px #36f47a,
      0 0 13px #36f47a;

    animation:
      ccPulse 1.4s ease-in-out infinite;
  }

  .control-hero h2{
    margin:0;

    color:#f5fbff;

    font-size:24px;

    line-height:1.25;
  }

  .control-hero p{
    max-width:620px;

    margin:9px 0 0;

    color:#88a8b8;

    font-size:10px;

    line-height:1.8;
  }

  .control-grid-visual{
    position:relative;

    min-height:138px;

    display:grid;
    place-items:center;

    border-radius:18px;

    border:
      1px solid rgba(43,203,255,.20);

    background:
      linear-gradient(
        rgba(41,203,255,.055) 1px,
        transparent 1px
      ),
      linear-gradient(
        90deg,
        rgba(41,203,255,.055) 1px,
        transparent 1px
      ),
      rgba(1,12,18,.52);

    background-size:
      18px 18px;

    overflow:hidden;
  }

  .control-grid-visual::before{
    content:"";

    position:absolute;

    inset:18px;

    border:
      1px dashed rgba(51,235,255,.18);

    border-radius:14px;
  }

  .grid-core{
    position:relative;

    width:84px;
    height:84px;

    display:grid;
    place-items:center;

    border-radius:24px;

    border:
      1px solid rgba(63,237,255,.4);

    color:#49ecff;

    background:
      radial-gradient(
        circle,
        rgba(21,213,255,.15),
        rgba(4,22,30,.96) 68%
      );

    box-shadow:
      0 0 24px rgba(28,221,255,.17),
      inset 0 0 18px rgba(0,0,0,.46);
  }

  .grid-core svg{
    width:38px;
    height:38px;

    filter:
      drop-shadow(
        0 0 7px rgba(44,232,255,.48)
      );
  }

  .grid-orbit{
    position:absolute;

    width:116px;
    height:116px;

    border:
      1px solid rgba(50,228,255,.16);

    border-radius:50%;

    animation:
      ccRotate 8s linear infinite;
  }

  .grid-orbit::before,
  .grid-orbit::after{
    content:"";

    position:absolute;

    width:7px;
    height:7px;

    border-radius:50%;

    background:#ffd02c;

    box-shadow:
      0 0 8px #ffd02c;
  }

  .grid-orbit::before{
    top:-4px;
    left:50%;
  }

  .grid-orbit::after{
    bottom:-4px;
    left:50%;

    background:#39f078;

    box-shadow:
      0 0 8px #39f078;
  }

  .control-stats{
    display:grid;

    grid-template-columns:
      repeat(
        4,
        minmax(0,1fr)
      );

    gap:12px;
  }

  .control-kpi{
    --kpi:#33e8ff;
    --kpi-bg:
      rgba(51,232,255,.12);

    position:relative;

    min-height:105px;

    overflow:hidden;

    display:flex;
    align-items:center;
    gap:12px;

    padding:15px;

    border-radius:17px;

    border:
      1px solid
      color-mix(
        in srgb,
        var(--kpi) 28%,
        #18394a
      );

    background:
      radial-gradient(
        circle at 86% 10%,
        var(--kpi-bg),
        transparent 36%
      ),
      linear-gradient(
        145deg,
        rgba(7,27,37,.98),
        rgba(3,16,24,.98)
      );

    box-shadow:
      inset 0 0 22px rgba(0,0,0,.28);

    transition:.22s ease;
  }

  .control-kpi:hover{
    transform:
      translateY(-3px);

    border-color:
      color-mix(
        in srgb,
        var(--kpi) 52%,
        #173a49
      );

    box-shadow:
      inset 0 0 22px rgba(0,0,0,.32),
      0 11px 28px rgba(0,0,0,.24),
      0 0 18px var(--kpi-bg);
  }

  .control-kpi.green{
    --kpi:#3bf278;
    --kpi-bg:
      rgba(59,242,120,.12);
  }

  .control-kpi.red{
    --kpi:#ff5b69;
    --kpi-bg:
      rgba(255,91,105,.12);
  }

  .control-kpi.gold{
    --kpi:#ffc72c;
    --kpi-bg:
      rgba(255,199,44,.12);
  }

  .control-kpi.blue{
    --kpi:#5e9cff;
    --kpi-bg:
      rgba(94,156,255,.12);
  }

  .control-kpi.teal{
    --kpi:#20e0c0;
    --kpi-bg:
      rgba(32,224,192,.12);
  }

  .control-kpi.lime{
    --kpi:#9af35d;
    --kpi-bg:
      rgba(154,243,93,.12);
  }

  .control-kpi-icon{
    width:45px;
    height:45px;

    flex:
      0 0 45px;

    display:grid;
    place-items:center;

    border-radius:13px;

    color:
      var(--kpi);

    border:
      1px solid
      color-mix(
        in srgb,
        var(--kpi) 38%,
        transparent
      );

    background:
      rgba(2,16,23,.72);

    box-shadow:
      0 0 15px var(--kpi-bg),
      inset 0 0 9px rgba(0,0,0,.36);
  }

  .control-kpi-icon svg{
    width:21px;
    height:21px;
  }

  .control-kpi small{
    display:block;

    color:#789baa;

    font-size:8px;

    margin-bottom:3px;
  }

  .control-kpi strong{
    display:block;

    color:#f3fbff;

    font-size:22px;

    line-height:1;
  }

  .control-kpi em{
    display:block;

    margin-top:6px;

    color:
      var(--kpi);

    font-size:7px;
    font-style:normal;
    font-weight:800;
  }

  .network-overview{
    padding:17px;

    border-radius:19px;

    border:
      1px solid #153b4d;

    background:
      linear-gradient(
        145deg,
        rgba(5,24,34,.97),
        rgba(2,14,21,.98)
      );

    box-shadow:
      inset 0 0 28px rgba(0,0,0,.3);
  }

  .network-overview-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;

    margin-bottom:13px;
  }

  .network-overview-head h3{
    margin:0;

    color:#effaff;

    font-size:14px;
  }

  .network-overview-head p{
    margin:3px 0 0;

    color:#6f91a0;

    font-size:8px;
  }

  .network-open-btn{
    display:inline-flex;
    align-items:center;
    gap:6px;

    padding:8px 11px;

    border-radius:9px;

    border:
      1px solid rgba(255,199,44,.36);

    background:
      rgba(255,199,44,.08);

    color:#ffd34a;

    font-size:8px;
    font-weight:800;

    cursor:pointer;
  }

  .network-open-btn svg{
    width:13px;
    height:13px;
  }

  .network-mini-grid{
    display:grid;

    grid-template-columns:
      repeat(
        4,
        minmax(0,1fr)
      );

    gap:9px;
  }

  .network-mini{
    --net:#39f078;

    position:relative;

    display:flex;
    align-items:center;
    gap:9px;

    min-height:68px;

    padding:10px;

    border-radius:12px;

    border:
      1px solid
      color-mix(
        in srgb,
        var(--net) 25%,
        #173848
      );

    background:
      linear-gradient(
        145deg,
        rgba(5,24,32,.94),
        rgba(2,14,21,.96)
      );

    cursor:pointer;

    transition:.2s ease;
  }

  .network-mini:hover{
    transform:
      translateY(-2px);

    box-shadow:
      0 0 14px
      color-mix(
        in srgb,
        var(--net) 12%,
        transparent
      );
  }

  .network-mini.monitoring{
    --net:#ffc72c;
  }

  .network-mini.high_load{
    --net:#ff8c33;
  }

  .network-mini.outage{
    --net:#ff5967;
  }

  .network-mini-led{
    width:10px;
    height:10px;

    flex:
      0 0 10px;

    border-radius:50%;

    background:
      var(--net);

    box-shadow:
      0 0 5px var(--net),
      0 0 12px var(--net);

    animation:
      ccPulse 1.5s ease-in-out infinite;
  }

  .network-mini b{
    display:block;

    color:#eef9fd;

    font-size:9px;
  }

  .network-mini small{
    display:block;

    margin-top:3px;

    color:
      var(--net);

    font-size:7px;
    font-weight:800;
  }

  .meters-control-grid{
    display:grid;

    grid-template-columns:
      repeat(
        3,
        minmax(260px,1fr)
      );

    gap:16px;
  }

  .meter-admin-unit{
    --meter-accent:#35e9ff;

    position:relative;

    overflow:hidden;

    padding:16px;

    border-radius:20px;

    border:
      1px solid rgba(41,212,242,.28);

    background:
      radial-gradient(
        circle at 90% 0%,
        rgba(36,218,255,.11),
        transparent 34%
      ),
      linear-gradient(
        145deg,
        #071e2a,
        #03141d 68%,
        #06131a
      );

    box-shadow:
      inset 0 0 26px rgba(0,0,0,.38),
      0 13px 30px rgba(0,0,0,.20);
  }

  .meter-admin-unit.inactive{
    --meter-accent:#ff6471;

    border-color:
      rgba(255,100,113,.25);
  }

  .meter-admin-unit::after{
    content:"";

    position:absolute;

    left:-35%;
    bottom:0;

    width:30%;
    height:1px;

    background:
      linear-gradient(
        90deg,
        transparent,
        var(--meter-accent),
        transparent
      );

    box-shadow:
      0 0 8px var(--meter-accent);

    animation:
      ccSweep 3.3s linear infinite;
  }

  .meter-admin-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;

    margin-bottom:13px;
  }

  .meter-user{
    display:flex;
    align-items:center;
    gap:9px;

    min-width:0;
  }

  .meter-user-icon{
    position:relative;

    width:42px;
    height:42px;

    flex:
      0 0 42px;

    display:grid;
    place-items:center;

    border-radius:12px;

    color:
      var(--meter-accent);

    border:
      1px solid
      color-mix(
        in srgb,
        var(--meter-accent) 35%,
        transparent
      );

    background:#051823;

    box-shadow:
      0 0 13px
      color-mix(
        in srgb,
        var(--meter-accent) 13%,
        transparent
      );
  }

  .meter-user-icon svg{
    width:21px;
    height:21px;
  }

  .meter-user-led{
    position:absolute;

    right:-2px;
    top:-2px;

    width:8px;
    height:8px;

    border-radius:50%;

    background:
      var(--meter-accent);

    box-shadow:
      0 0 5px var(--meter-accent),
      0 0 10px var(--meter-accent);

    animation:
      ccPulse 1.4s ease-in-out infinite;
  }

  .meter-user b{
    display:block;

    overflow:hidden;

    text-overflow:ellipsis;

    white-space:nowrap;

    color:#f1f9fd;

    font-size:11px;
  }

  .meter-user small{
    display:block;

    margin-top:2px;

    color:#708f9d;

    font-size:7px;
  }

  .meter-state-pill{
    padding:5px 8px;

    border-radius:999px;

    color:
      var(--meter-accent);

    border:
      1px solid
      color-mix(
        in srgb,
        var(--meter-accent) 38%,
        transparent
      );

    background:
      color-mix(
        in srgb,
        var(--meter-accent) 8%,
        transparent
      );

    font-size:7px;
    font-weight:900;
  }

  .meter-digital{
    position:relative;

    overflow:hidden;

    min-height:84px;

    display:flex;
    align-items:center;
    justify-content:center;

    margin-bottom:12px;

    border-radius:14px;

    border:
      1px solid #1c4b57;

    background:
      linear-gradient(
        180deg,
        #020806,
        #07110b
      );

    box-shadow:
      inset 0 0 20px #000,
      0 0 15px rgba(48,255,117,.06);
  }

  .meter-digital::before{
    content:"";

    position:absolute;

    inset:0;

    background:
      linear-gradient(
        180deg,
        transparent 0 40%,
        rgba(117,255,137,.07) 49%,
        rgba(117,255,137,.13) 51%,
        transparent 60%
      );

    transform:
      translateY(-120%);

    animation:
      meterAdminScan 2.7s linear infinite;
  }

  .meter-digital strong{
    position:relative;
    z-index:2;

    color:#9cff6a;

    font-family:
      "Courier New",
      Consolas,
      monospace;

    font-size:27px;

    letter-spacing:.11em;

    text-shadow:
      0 0 5px #69ff47,
      0 0 12px rgba(87,255,69,.5);
  }

  .meter-digital span{
    position:absolute;

    right:11px;
    bottom:7px;

    color:#d8fce2;

    font-size:7px;
    font-weight:900;
  }

  .meter-wavebar{
    position:relative;

    height:36px;

    margin-bottom:12px;

    overflow:hidden;

    border-radius:10px;

    border:
      1px solid #173b47;

    background:#041119;
  }

  .meter-wavebar svg{
    position:absolute;

    left:8px;
    top:4px;

    width:105px;
    height:28px;
  }

  .meter-wavebar polyline{
    fill:none;

    stroke:
      var(--meter-accent);

    stroke-width:2;

    stroke-dasharray:
      8 6;

    filter:
      drop-shadow(
        0 0 4px var(--meter-accent)
      );

    animation:
      areaElectricFlow .55s linear infinite;
  }

  .meter-wavebar label{
    position:absolute;

    right:9px;
    top:8px;

    color:#789ba8;

    font-size:6px;

    text-align:right;
  }

  .meter-wavebar label b{
    display:block;

    color:
      var(--meter-accent);

    font-size:8px;

    margin-top:1px;
  }

  .meter-admin-controls{
    display:grid;

    grid-template-columns:
      1fr auto;

    gap:8px;

    align-items:end;
  }

  .meter-admin-controls label{
    color:#7f9eaa;

    font-size:7px;
  }

  .meter-admin-controls input{
    width:100%;

    box-sizing:border-box;

    margin-top:5px;

    padding:9px 10px;

    border-radius:9px;

    border:
      1px solid #245064;

    background:#061a24;

    color:#eaf9ff;

    outline:none;
  }

  .meter-admin-controls input:focus{
    border-color:
      var(--meter-accent);

    box-shadow:
      0 0 0 2px
      color-mix(
        in srgb,
        var(--meter-accent) 12%,
        transparent
      );
  }

  .meter-admin-actions{
    display:flex;

    gap:7px;

    margin-top:9px;
  }

  .meter-admin-actions button{
    flex:1;

    display:flex;
    align-items:center;
    justify-content:center;
    gap:6px;

    min-height:36px;

    border-radius:9px;

    border:
      1px solid #285468;

    background:#071b26;

    color:#acd0dd;

    font-size:8px;
    font-weight:800;

    cursor:pointer;

    transition:.2s ease;
  }

  .meter-admin-actions button:hover{
    transform:
      translateY(-1px);

    border-color:
      var(--meter-accent);

    color:
      var(--meter-accent);
  }

  .meter-admin-actions button.primary-meter{
    border-color:
      color-mix(
        in srgb,
        var(--meter-accent) 48%,
        #24485a
      );

    color:
      var(--meter-accent);

    background:
      color-mix(
        in srgb,
        var(--meter-accent) 7%,
        #071b26
      );
  }

  .meter-admin-actions svg{
    width:13px;
    height:13px;
  }

  .meters-summary{
    display:grid;

    grid-template-columns:
      repeat(
        3,
        minmax(0,1fr)
      );

    gap:10px;

    margin-bottom:15px;
  }

  .meter-summary-card{
    display:flex;
    align-items:center;
    gap:10px;

    padding:12px;

    border-radius:13px;

    border:
      1px solid #193e4e;

    background:
      linear-gradient(
        145deg,
        rgba(7,27,37,.96),
        rgba(3,15,22,.96)
      );
  }

  .meter-summary-card i,
  .meter-summary-card svg{
    width:18px;
    height:18px;

    color:#43eaff;
  }

  .meter-summary-card small{
    display:block;

    color:#7798a5;

    font-size:7px;
  }

  .meter-summary-card b{
    display:block;

    color:#f3fbff;

    font-size:16px;

    margin-top:2px;
  }

  @keyframes ccSweep{

    from{
      left:-35%;
    }

    to{
      left:120%;
    }

  }

  @keyframes ccPulse{

    0%,100%{
      opacity:.5;
      transform:scale(.82);
    }

    50%{
      opacity:1;
      transform:scale(1.14);
    }

  }

  @keyframes ccRotate{

    to{
      transform:rotate(360deg);
    }

  }

  @keyframes meterAdminScan{

    from{
      transform:translateY(-120%);
    }

    to{
      transform:translateY(120%);
    }

  }

  @media(max-width:1250px){

    .control-stats{
      grid-template-columns:
        repeat(
          2,
          minmax(0,1fr)
        );
    }

    .network-mini-grid{
      grid-template-columns:
        repeat(
          2,
          minmax(0,1fr)
        );
    }

    .meters-control-grid{
      grid-template-columns:
        repeat(
          2,
          minmax(250px,1fr)
        );
    }

  }

  @media(max-width:760px){

    .control-hero{
      grid-template-columns:1fr;
      padding:15px;
    }

    .control-grid-visual{
      min-height:120px;
    }

    .control-stats{
      grid-template-columns:
        1fr 1fr;
    }

    .control-kpi{
      min-height:88px;
      padding:11px;
    }

    .control-kpi strong{
      font-size:18px;
    }

    .network-mini-grid{
      grid-template-columns:1fr;
    }

    .meters-control-grid{
      grid-template-columns:1fr;
    }

    .meters-summary{
      grid-template-columns:1fr;
    }

  }

  `;

  document.head
    .appendChild(st);

}


function adminKpi(
  icon,
  label,
  value,
  cls="",
  sub="LIVE DATA"
){

  return `

    <article class="control-kpi ${cls}">

      <div class="control-kpi-icon">

        <i data-lucide="${icon}"></i>

      </div>

      <div>

        <small>
          ${label}
        </small>

        <strong>
          ${value}
        </strong>

        <em>
          ${sub}
        </em>

      </div>

    </article>

  `;

}


async function renderDashboardPremium(c){

  let[
    pr,
    ar,
    me,
    fa,
    iv,
    pay
  ]=
  await Promise.all([

    sb.from("profiles")
      .select(
        "id,active,role"
      ),

    sb.from("areas")
      .select("*"),

    sb.from("meters")
      .select("id"),

    sb.from("fault_reports")
      .select(
        "id,status"
      ),

    sb.from("invoices")
      .select(
        "id,amount,status"
      ),

    sb.from("payments")
      .select(
        "invoice_id,amount"
      )

  ]);

  let ps=
    (pr.data||[])
    .filter(
      x=>
      x.role==="customer"
    );

  let areasData=
    ar.data||
    [];

  let meterCount=
    (me.data||[])
    .length;

  let open=
    (fa.data||[])
    .filter(
      x=>
      x.status!=="resolved"
    )
    .length;

  let paidMap={};

  for(
    let x of
    (pay.data||[])
  ){

    paidMap[
      x.invoice_id
    ]=

      (
        paidMap[
          x.invoice_id
        ]||
        0
      )

      +

      Number(
        x.amount||
        0
      );

  }

  let unpaid=
    (iv.data||[])
    .reduce(

      (sum,x)=>

        sum+

        Math.max(
          0,

          Number(
            x.amount||
            0
          )

          -

          Number(
            paidMap[
              x.id
            ]||
            0
          )
        ),

      0

    );

  let active=
    ps.filter(
      x=>x.active
    )
    .length;

  let inactive=
    ps.length-
    active;

  let stableAreas=
    areasData
    .filter(
      x=>
      x.network_status===
      "stable"
    )
    .length;

  c.innerHTML=

    header(
      "لوحة التحكم",
      "مركز المراقبة الرئيسي لإشتراكات وشبكة نشابة."
    )

    +

    `

    <div class="control-center">

      <section class="control-hero">

        <div class="control-hero-copy">

          <div class="control-eyebrow">

            <span class="control-live-dot"></span>

            NASHABEH ELECTRICAL CONTROL CENTER

          </div>

          <h2>
            الشبكة تحت المراقبة
          </h2>

          <p>

            متابعة مباشرة للمشتركين والعدادات والفواتير
            والأعطال وحالة علب التوزيع من لوحة تحكم واحدة.

          </p>

        </div>

        <div class="control-grid-visual">

          <div class="grid-orbit"></div>

          <div class="grid-core">

            <i data-lucide="zap"></i>

          </div>

        </div>

      </section>

      <section class="control-stats">

        ${adminKpi(
          "users-round",
          "المشتركون",
          ps.length,
          "",
          "CUSTOMERS"
        )}

        ${adminKpi(
          "circle-check-big",
          "اشتراكات فعّالة",
          active,
          "green",
          "ACTIVE"
        )}

        ${adminKpi(
          "circle-x",
          "غير فعّالة",
          inactive,
          "red",
          "INACTIVE"
        )}

        ${adminKpi(
          "receipt-text",
          "إجمالي المستحق",
          money(unpaid),
          "gold",
          "OUTSTANDING"
        )}

        ${adminKpi(
          "wrench",
          "أعطال مفتوحة",
          open,
          "blue",
          "INCIDENTS"
        )}

        ${adminKpi(
          "boxes",
          "علب التوزيع",
          areasData.length,
          "teal",
          `${stableAreas} STABLE`
        )}

        ${adminKpi(
          "gauge",
          "العدادات",
          meterCount,
          "lime",
          "SMART METERS"
        )}

      </section>

      <section class="network-overview">

        <div class="network-overview-head">

          <div>

            <h3>
              حالة شبكة التوزيع
            </h3>

            <p>

              مؤشر سريع لكل علبة —
              التفاصيل الكاملة موجودة في صفحة العلب والمناطق.

            </p>

          </div>

          <button
            class="network-open-btn"
            onclick="renderAdmin('areas')">

            <i data-lucide="circuit-board"></i>

            فتح مركز العلب

          </button>

        </div>

        <div class="network-mini-grid">

          ${
            areasData
            .map(
              a=>`

              <div
                class="network-mini ${a.network_status||"stable"}"
                onclick="renderAdmin('areas')">

                <span class="network-mini-led"></span>

                <div>

                  <b>
                    ${a.name}
                  </b>

                  <small>
                    ${stateAr(a.network_status)}
                  </small>

                </div>

              </div>

              `
            )
            .join("")
          }

        </div>

      </section>

    </div>

    `;

}


meters=
async function(c){

  let ms=
    (
      await sb
      .from("meters")
      .select(
        "*,profiles(full_name),meter_readings(*)"
      )
      .order(
        "created_at",
        {
          ascending:false
        }
      )
    ).data||
    [];

  let readingValues=[];

  let cards=
    ms.map(
      m=>{

        let rr=
          (
            m.meter_readings||
            []
          )
          .sort(
            (a,b)=>

              new Date(
                b.reading_date
              )

              -

              new Date(
                a.reading_date
              )
          )[0];

        let reading=
          Number(
            rr?.reading_value??
            0
          );

        readingValues
          .push(
            reading
          );

        let display=
          String(
            Math.trunc(
              reading
            )
          )
          .padStart(
            7,
            "0"
          );

        let isActive=
          m.active!==
          false;

        return `

          <article class="meter-admin-unit ${isActive?"":"inactive"}">

            <div class="meter-admin-head">

              <div class="meter-user">

                <div class="meter-user-icon">

                  <i data-lucide="gauge"></i>

                  <span class="meter-user-led"></span>

                </div>

                <div>

                  <b>

                    ${
                      m.profiles
                      ?.full_name||
                      "مشترك غير معروف"
                    }

                  </b>

                  <small>

                    METER ID ·
                    ${m.id}

                  </small>

                </div>

              </div>

              <span class="meter-state-pill">

                ${
                  isActive
                  ?"ONLINE"
                  :"OFFLINE"
                }

              </span>

            </div>

            <div class="meter-digital">

              <strong>
                ${display}
              </strong>

              <span>
                kWh
              </span>

            </div>

            <div class="meter-wavebar">

              <svg
                viewBox="0 0 120 28"
                aria-hidden="true">

                <polyline
                  points="
                  0,14
                  12,14
                  18,4
                  25,24
                  33,7
                  41,20
                  49,14
                  60,14
                  67,6
                  75,23
                  83,9
                  91,19
                  101,14
                  120,14
                  ">
                </polyline>

              </svg>

              <label>

                POWER SIGNAL

                <b>

                  ${
                    isActive
                    ?"LIVE"
                    :"OFFLINE"
                  }

                </b>

              </label>

            </div>

            <div class="meter-admin-controls">

              <label>

                رقم العداد

                <input
                  id="mn_${m.id}"
                  value="${m.meter_number||""}"
                  autocomplete="off">

              </label>

              <span class="meter-state-pill">

                READ
                ${rr?.reading_date||"--"}

              </span>

            </div>

            <div class="meter-admin-actions">

              <button
                onclick="saveMeter('${m.id}')">

                <i data-lucide="save"></i>

                حفظ الرقم

              </button>

              <button
                class="primary-meter"
                onclick="addReading('${m.id}')">

                <i data-lucide="plus-circle"></i>

                قراءة جديدة

              </button>

            </div>

          </article>

        `;

      }
    )
    .join("");

  let maxReading=
    readingValues.length
    ?
    Math.max(
      ...readingValues
    )
    :
    0;

  let avgReading=

    readingValues.length

    ?

    readingValues
    .reduce(
      (a,b)=>
      a+b,
      0
    )
    /
    readingValues.length

    :

    0;

  c.innerHTML=

    header(
      "العدادات",
      "Smart Meter Center — مراقبة القراءات وإدارة أرقام العدادات."
    )

    +

    `

      <section class="meters-summary">

        <div class="meter-summary-card">

          <i data-lucide="gauge"></i>

          <div>

            <small>
              إجمالي العدادات
            </small>

            <b>
              ${ms.length}
            </b>

          </div>

        </div>

        <div class="meter-summary-card">

          <i data-lucide="activity"></i>

          <div>

            <small>
              متوسط آخر قراءة
            </small>

            <b>
              ${Math.round(avgReading)} kWh
            </b>

          </div>

        </div>

        <div class="meter-summary-card">

          <i data-lucide="arrow-up-right"></i>

          <div>

            <small>
              أعلى قراءة حالية
            </small>

            <b>
              ${Math.round(maxReading)} kWh
            </b>

          </div>

        </div>

      </section>

      <section class="meters-control-grid">

        ${
          cards
          ||
          `
          <div class="panel admin-card">
            <p>
              لا توجد عدادات بعد.
            </p>
          </div>
          `
        }

      </section>

    `;

};


const renderAdminOriginalV2=
  renderAdmin;


renderAdmin=
async function(
  page="dashboard"
){

  injectAdminPremiumV2Styles();

  if(
    page!==
    "dashboard"
  ){

    return renderAdminOriginalV2(
      page
    );

  }

  currentPage=
    page;

  document
    .querySelectorAll(
      ".side"
    )
    .forEach(
      b=>

      b.classList.toggle(
        "active",
        b.dataset.page===
        page
      )

    );

  let c=
    A("adminContent");

  await renderDashboardPremium(
    c
  );

  icons();

};




/* =========================================================
   ADMIN PREMIUM V3
   POWER GRID CORE + INCIDENTS + ALERT CENTER
   ========================================================= */

function injectAdminPremiumV3Styles(){

  if(A("nashabehAdminPremiumV3"))return;

  let st=
    document.createElement("style");

  st.id=
    "nashabehAdminPremiumV3";

  st.textContent=`

  /* =========================
     POWER GRID CORE
     ========================= */

  .power-grid-core{
    position:relative;
    width:100%;
    min-height:150px;
    overflow:hidden;
    display:grid;
    place-items:center;
  }

  .power-grid-board{
    position:absolute;
    inset:14px;
    border-radius:18px;
    overflow:hidden;

    border:
      1px solid rgba(43,226,255,.18);

    background:
      linear-gradient(
        rgba(36,207,235,.045) 1px,
        transparent 1px
      ),
      linear-gradient(
        90deg,
        rgba(36,207,235,.045) 1px,
        transparent 1px
      ),
      radial-gradient(
        circle at center,
        rgba(0,218,255,.08),
        transparent 55%
      );

    background-size:
      20px 20px,
      20px 20px,
      auto;
  }

  .power-grid-board::after{
    content:"";
    position:absolute;
    inset:0;

    background:
      linear-gradient(
        90deg,
        transparent,
        rgba(45,236,255,.10),
        transparent
      );

    transform:translateX(-110%);
    animation:gridBoardScan 4.2s linear infinite;
  }

  .power-circuit-line{
    position:absolute;
    z-index:2;
    height:1px;
    background:
      linear-gradient(
        90deg,
        transparent,
        rgba(42,225,255,.35),
        #38ecff,
        rgba(42,225,255,.35),
        transparent
      );

    box-shadow:
      0 0 8px rgba(42,225,255,.38);
  }

  .power-circuit-line.horizontal-a{
    width:34%;
    left:3%;
    top:50%;
  }

  .power-circuit-line.horizontal-b{
    width:34%;
    right:3%;
    top:50%;
  }

  .power-circuit-line.vertical-a{
    width:27%;
    left:36.5%;
    top:18%;
    transform:rotate(90deg);
  }

  .power-circuit-line.vertical-b{
    width:27%;
    left:36.5%;
    bottom:18%;
    transform:rotate(90deg);
  }

  .power-node{
    position:absolute;
    z-index:4;

    width:9px;
    height:9px;

    border-radius:50%;

    background:#2cf27a;

    box-shadow:
      0 0 5px #2cf27a,
      0 0 14px rgba(44,242,122,.75);

    animation:
      powerNodePulse 1.4s ease-in-out infinite;
  }

  .power-node.n1{
    left:13%;
    top:47%;
  }

  .power-node.n2{
    right:13%;
    top:47%;
    animation-delay:.35s;
  }

  .power-node.n3{
    left:49%;
    top:15%;
    background:#ffd12c;
    box-shadow:
      0 0 5px #ffd12c,
      0 0 14px rgba(255,209,44,.75);
    animation-delay:.7s;
  }

  .power-node.n4{
    left:49%;
    bottom:15%;
    animation-delay:1s;
  }

  .power-core-shell{
    position:relative;
    z-index:5;

    width:122px;
    height:122px;

    display:grid;
    place-items:center;

    clip-path:
      polygon(
        25% 6%,
        75% 6%,
        96% 25%,
        96% 75%,
        75% 94%,
        25% 94%,
        4% 75%,
        4% 25%
      );

    background:
      linear-gradient(
        145deg,
        rgba(42,228,255,.75),
        rgba(14,73,91,.22) 28%,
        rgba(2,17,24,.98) 48%,
        rgba(19,117,133,.40)
      );

    filter:
      drop-shadow(
        0 0 16px rgba(40,226,255,.22)
      );
  }

  .power-core-inner{
    width:104px;
    height:104px;

    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;

    clip-path:
      polygon(
        25% 5%,
        75% 5%,
        95% 25%,
        95% 75%,
        75% 95%,
        25% 95%,
        5% 75%,
        5% 25%
      );

    background:
      radial-gradient(
        circle at 50% 40%,
        rgba(24,220,255,.17),
        transparent 38%
      ),
      linear-gradient(
        145deg,
        #061c27,
        #020b10
      );

    border:
      1px solid rgba(75,235,255,.28);

    text-align:center;
  }

  .power-core-icon{
    width:32px;
    height:32px;

    margin-bottom:5px;

    color:#45efff;

    filter:
      drop-shadow(
        0 0 7px rgba(69,239,255,.75)
      );

    animation:
      coreEnergyPulse 2s ease-in-out infinite;
  }

  .power-core-inner strong{
    color:#dffbff;
    font-size:8px;
    letter-spacing:.08em;
  }

  .power-core-inner small{
    margin-top:3px;
    color:#3ff17c;
    font-size:6px;
    font-weight:900;
    letter-spacing:.08em;
  }

  .power-spec{
    position:absolute;
    z-index:6;

    padding:5px 7px;

    border-radius:7px;

    border:
      1px solid rgba(49,210,235,.17);

    background:
      rgba(2,14,20,.78);

    color:#688f9f;

    font-size:6px;
    font-weight:800;
  }

  .power-spec.voltage{
    left:8%;
    bottom:15%;
  }

  .power-spec.frequency{
    right:8%;
    bottom:15%;
  }

  .power-data-stream{
    position:absolute;
    z-index:3;

    width:7px;
    height:7px;

    border-radius:50%;

    background:#7ef8ff;

    box-shadow:
      0 0 7px #52efff;

    animation:
      powerDataMove 2.3s linear infinite;
  }


  /* =========================
     INCIDENT CONTROL CENTER
     ========================= */

  .incident-summary{
    display:grid;
    grid-template-columns:
      repeat(4,minmax(0,1fr));

    gap:11px;
    margin-bottom:16px;
  }

  .incident-stat{
    --incident:#4deaff;

    display:flex;
    align-items:center;
    gap:10px;

    min-height:72px;

    padding:12px;

    border-radius:14px;

    border:
      1px solid
      color-mix(
        in srgb,
        var(--incident) 26%,
        #183b49
      );

    background:
      radial-gradient(
        circle at 85% 10%,
        color-mix(
          in srgb,
          var(--incident) 10%,
          transparent
        ),
        transparent 38%
      ),
      linear-gradient(
        145deg,
        #061c27,
        #03141c
      );
  }

  .incident-stat.open{
    --incident:#ff5b68;
  }

  .incident-stat.repairing{
    --incident:#ffae32;
  }

  .incident-stat.resolved{
    --incident:#39ef78;
  }

  .incident-stat.total{
    --incident:#42e9ff;
  }

  .incident-stat-icon{
    width:39px;
    height:39px;

    display:grid;
    place-items:center;

    flex:0 0 39px;

    border-radius:11px;

    color:var(--incident);

    border:
      1px solid
      color-mix(
        in srgb,
        var(--incident) 35%,
        transparent
      );

    background:
      rgba(2,14,20,.68);

    box-shadow:
      0 0 13px
      color-mix(
        in srgb,
        var(--incident) 10%,
        transparent
      );
  }

  .incident-stat-icon svg{
    width:18px;
    height:18px;
  }

  .incident-stat small{
    display:block;
    color:#7496a5;
    font-size:7px;
  }

  .incident-stat b{
    display:block;
    margin-top:2px;
    color:#f2fbff;
    font-size:17px;
  }

  .incident-grid{
    display:grid;
    grid-template-columns:
      repeat(2,minmax(0,1fr));

    gap:14px;
  }

  .incident-card{
    --incident:#ff5b68;

    position:relative;
    overflow:hidden;

    padding:15px;

    border-radius:18px;

    border:
      1px solid
      color-mix(
        in srgb,
        var(--incident) 29%,
        #193a48
      );

    background:
      radial-gradient(
        circle at 92% 0%,
        color-mix(
          in srgb,
          var(--incident) 10%,
          transparent
        ),
        transparent 36%
      ),
      linear-gradient(
        145deg,
        #071e29,
        #03131c
      );

    box-shadow:
      inset 0 0 24px rgba(0,0,0,.30);

    transition:.22s ease;
  }

  .incident-card:hover{
    transform:translateY(-3px);

    box-shadow:
      inset 0 0 24px rgba(0,0,0,.32),
      0 13px 28px rgba(0,0,0,.22),
      0 0 18px
      color-mix(
        in srgb,
        var(--incident) 8%,
        transparent
      );
  }

  .incident-card.scheduled{
    --incident:#ffd13b;
  }

  .incident-card.repairing{
    --incident:#ff9e32;
  }

  .incident-card.resolved{
    --incident:#39ef78;
  }

  .incident-card::after{
    content:"";

    position:absolute;
    left:-35%;
    bottom:0;

    width:30%;
    height:1px;

    background:
      linear-gradient(
        90deg,
        transparent,
        var(--incident),
        transparent
      );

    box-shadow:
      0 0 8px var(--incident);

    animation:
      incidentSweep 3.5s linear infinite;
  }

  .incident-card-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:10px;

    margin-bottom:13px;
  }

  .incident-number{
    display:flex;
    align-items:center;
    gap:8px;
  }

  .incident-led{
    width:9px;
    height:9px;

    border-radius:50%;

    background:var(--incident);

    box-shadow:
      0 0 5px var(--incident),
      0 0 12px var(--incident);

    animation:
      powerNodePulse 1.25s ease-in-out infinite;
  }

  .incident-number small{
    display:block;
    color:#668a9a;
    font-size:6px;
  }

  .incident-number b{
    display:block;
    color:#effaff;
    font-size:10px;
  }

  .incident-status{
    padding:5px 8px;

    border-radius:999px;

    color:var(--incident);

    border:
      1px solid
      color-mix(
        in srgb,
        var(--incident) 38%,
        transparent
      );

    background:
      color-mix(
        in srgb,
        var(--incident) 7%,
        transparent
      );

    font-size:6px;
    font-weight:900;
    letter-spacing:.06em;
  }

  .incident-title{
    display:flex;
    align-items:center;
    gap:9px;

    margin-bottom:12px;
  }

  .incident-title-icon{
    width:37px;
    height:37px;

    display:grid;
    place-items:center;

    border-radius:10px;

    color:var(--incident);

    border:
      1px solid
      color-mix(
        in srgb,
        var(--incident) 28%,
        transparent
      );

    background:#051720;
  }

  .incident-title-icon svg{
    width:18px;
    height:18px;
  }

  .incident-title h4{
    margin:0;
    color:#f0f9fd;
    font-size:11px;
  }

  .incident-title p{
    margin:3px 0 0;
    color:#7193a1;
    font-size:7px;
  }

  .incident-data{
    display:grid;
    grid-template-columns:
      repeat(3,minmax(0,1fr));

    gap:7px;

    margin-bottom:12px;
  }

  .incident-data div{
    padding:8px;

    border-radius:9px;

    border:
      1px solid #163946;

    background:
      rgba(2,14,20,.52);
  }

  .incident-data small{
    display:block;
    color:#628593;
    font-size:6px;
  }

  .incident-data b{
    display:block;

    margin-top:3px;

    color:#dff3fa;

    font-size:8px;

    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }

  .incident-open{
    width:100%;

    min-height:35px;

    display:flex;
    align-items:center;
    justify-content:center;
    gap:6px;

    border-radius:9px;

    border:
      1px solid
      color-mix(
        in srgb,
        var(--incident) 40%,
        #244654
      );

    background:
      color-mix(
        in srgb,
        var(--incident) 6%,
        #061923
      );

    color:var(--incident);

    font-size:8px;
    font-weight:900;

    cursor:pointer;

    transition:.2s ease;
  }

  .incident-open:hover{
    filter:brightness(1.18);
    transform:translateY(-1px);
  }

  .incident-open svg{
    width:13px;
    height:13px;
  }


  /* =========================
     NETWORK ALERT CENTER
     ========================= */

  .alert-center-top{
    position:relative;
    overflow:hidden;

    display:grid;
    grid-template-columns:
      1fr auto;

    gap:15px;
    align-items:center;

    margin-bottom:15px;
    padding:17px;

    border-radius:18px;

    border:
      1px solid rgba(50,220,255,.24);

    background:
      radial-gradient(
        circle at 10% 30%,
        rgba(28,218,255,.10),
        transparent 30%
      ),
      linear-gradient(
        145deg,
        #071e29,
        #03141d
      );
  }

  .alert-center-title{
    display:flex;
    align-items:center;
    gap:11px;
  }

  .alert-radio{
    position:relative;

    width:46px;
    height:46px;

    display:grid;
    place-items:center;

    border-radius:14px;

    color:#47ecff;

    border:
      1px solid rgba(71,236,255,.35);

    background:#041821;

    box-shadow:
      0 0 17px rgba(48,228,255,.10);
  }

  .alert-radio svg{
    width:22px;
    height:22px;
  }

  .alert-radio::before,
  .alert-radio::after{
    content:"";

    position:absolute;

    border:
      1px solid rgba(61,232,255,.28);

    border-radius:50%;

    animation:
      radioWave 2s ease-out infinite;
  }

  .alert-radio::before{
    width:56px;
    height:56px;
  }

  .alert-radio::after{
    width:70px;
    height:70px;
    animation-delay:.8s;
  }

  .alert-center-title h3{
    margin:0;
    color:#f1fbff;
    font-size:14px;
  }

  .alert-center-title p{
    margin:4px 0 0;
    color:#7395a3;
    font-size:7px;
  }

  .new-alert-btn{
    display:flex;
    align-items:center;
    justify-content:center;
    gap:7px;

    min-height:39px;

    padding:0 14px;

    border-radius:10px;

    border:
      1px solid rgba(255,204,45,.48);

    background:
      linear-gradient(
        145deg,
        rgba(255,198,30,.17),
        rgba(110,75,0,.14)
      );

    color:#ffd448;

    font-size:8px;
    font-weight:900;

    cursor:pointer;
  }

  .new-alert-btn svg{
    width:14px;
    height:14px;
  }

  .alert-summary{
    display:grid;
    grid-template-columns:
      repeat(3,minmax(0,1fr));

    gap:10px;
    margin-bottom:15px;
  }

  .alert-summary-card{
    display:flex;
    align-items:center;
    gap:10px;

    padding:11px;

    border-radius:12px;

    border:
      1px solid #193d4b;

    background:
      linear-gradient(
        145deg,
        #061b25,
        #03131b
      );
  }

  .alert-summary-card svg{
    width:18px;
    height:18px;
    color:#42e9ff;
  }

  .alert-summary-card small{
    display:block;
    color:#6f919f;
    font-size:6px;
  }

  .alert-summary-card b{
    display:block;
    margin-top:2px;
    color:#effaff;
    font-size:14px;
  }

  .alert-feed{
    display:grid;
    gap:10px;
  }

  .network-alert{
    position:relative;

    display:grid;
    grid-template-columns:auto 1fr auto;

    gap:12px;
    align-items:center;

    padding:13px;

    border-radius:14px;

    border:
      1px solid #193e4c;

    background:
      linear-gradient(
        145deg,
        rgba(7,28,38,.98),
        rgba(3,15,22,.98)
      );

    transition:.2s ease;
  }

  .network-alert:hover{
    transform:translateX(-3px);
    border-color:#286074;
  }

  .network-alert-icon{
    position:relative;

    width:42px;
    height:42px;

    display:grid;
    place-items:center;

    border-radius:12px;

    color:#ffc934;

    border:
      1px solid rgba(255,201,52,.28);

    background:
      rgba(255,201,52,.06);
  }

  .network-alert-icon svg{
    width:19px;
    height:19px;
  }

  .network-alert-icon::after{
    content:"";

    position:absolute;
    right:4px;
    top:4px;

    width:6px;
    height:6px;

    border-radius:50%;

    background:#39ef78;

    box-shadow:
      0 0 6px #39ef78;
  }

  .network-alert h4{
    margin:0;
    color:#f1f9fc;
    font-size:10px;
  }

  .network-alert p{
    margin:4px 0 0;

    color:#7899a6;

    font-size:8px;
    line-height:1.6;
  }

  .alert-target{
    text-align:left;
    min-width:105px;
  }

  .alert-target span{
    display:inline-flex;
    align-items:center;
    gap:5px;

    padding:5px 7px;

    border-radius:999px;

    color:#43e9ff;

    border:
      1px solid rgba(67,233,255,.25);

    background:
      rgba(67,233,255,.05);

    font-size:6px;
    font-weight:900;
  }

  .alert-target small{
    display:block;

    margin-top:5px;

    color:#557b89;

    font-size:6px;
  }

  .empty-control-state{
    padding:28px;

    text-align:center;

    border-radius:16px;

    border:
      1px dashed #245061;

    color:#7194a1;

    background:
      rgba(3,17,24,.45);
  }

  .empty-control-state svg{
    width:28px;
    height:28px;
    margin-bottom:8px;
    color:#3fdff5;
  }


  /* =========================
     ANIMATIONS
     ========================= */

  @keyframes gridBoardScan{

    from{
      transform:translateX(-110%);
    }

    to{
      transform:translateX(110%);
    }

  }

  @keyframes powerNodePulse{

    0%,100%{
      opacity:.48;
      transform:scale(.78);
    }

    50%{
      opacity:1;
      transform:scale(1.2);
    }

  }

  @keyframes coreEnergyPulse{

    0%,100%{
      opacity:.72;
      transform:scale(.92);
    }

    50%{
      opacity:1;
      transform:scale(1.08);
    }

  }

  @keyframes powerDataMove{

    0%{
      left:12%;
      top:49%;
      opacity:0;
    }

    15%{
      opacity:1;
    }

    50%{
      left:49%;
      top:49%;
    }

    85%{
      opacity:1;
    }

    100%{
      left:86%;
      top:49%;
      opacity:0;
    }

  }

  @keyframes incidentSweep{

    from{
      left:-35%;
    }

    to{
      left:120%;
    }

  }

  @keyframes radioWave{

    0%{
      transform:scale(.6);
      opacity:.8;
    }

    100%{
      transform:scale(1.25);
      opacity:0;
    }

  }


  /* =========================
     RESPONSIVE
     ========================= */

  @media(max-width:1050px){

    .incident-summary{
      grid-template-columns:
        repeat(2,minmax(0,1fr));
    }

    .incident-grid{
      grid-template-columns:1fr;
    }

  }

  @media(max-width:700px){

    .incident-summary{
      grid-template-columns:1fr 1fr;
    }

    .incident-data{
      grid-template-columns:1fr;
    }

    .alert-center-top{
      grid-template-columns:1fr;
    }

    .new-alert-btn{
      width:100%;
    }

    .alert-summary{
      grid-template-columns:1fr;
    }

    .network-alert{
      grid-template-columns:auto 1fr;
    }

    .alert-target{
      grid-column:1/-1;
      text-align:right;
    }

    .power-grid-core{
      min-height:135px;
    }

    .power-core-shell{
      width:108px;
      height:108px;
    }

    .power-core-inner{
      width:91px;
      height:91px;
    }

  }

  `;

  document.head
    .appendChild(st);

}


/* =========================================================
   NEW POWER GRID VISUAL
   ========================================================= */

function buildPowerGridCore(){

  return `

    <div class="power-grid-core">

      <div class="power-grid-board"></div>

      <div class="power-circuit-line horizontal-a"></div>
      <div class="power-circuit-line horizontal-b"></div>
      <div class="power-circuit-line vertical-a"></div>
      <div class="power-circuit-line vertical-b"></div>

      <span class="power-node n1"></span>
      <span class="power-node n2"></span>
      <span class="power-node n3"></span>
      <span class="power-node n4"></span>

      <span class="power-data-stream"></span>

      <div class="power-core-shell">

        <div class="power-core-inner">

          <i
            class="power-core-icon"
            data-lucide="cpu">
          </i>

          <strong>
            GRID CORE
          </strong>

          <small>
            SYSTEM ONLINE
          </small>

        </div>

      </div>

      <span class="power-spec voltage">
        230V · LIVE
      </span>

      <span class="power-spec frequency">
        50Hz · STABLE
      </span>

    </div>

  `;

}


/* Replace only the old rotating dashboard visual */

function upgradeDashboardPowerCore(){

  let visual=
    document.querySelector(
      ".control-grid-visual"
    );

  if(!visual)return;

  visual.innerHTML=
    buildPowerGridCore();

}


/* =========================================================
   INCIDENT CONTROL CENTER
   ========================================================= */

function incidentStatusName(status){

  return({

    open:"OPEN",

    scheduled:"SCHEDULED",

    repairing:"REPAIRING",

    resolved:"RESOLVED"

  })[status]||
  String(status||"OPEN")
  .toUpperCase();

}


function incidentStatusArabic(status){

  return({

    open:"بلاغ مفتوح",

    scheduled:"مجدول",

    repairing:"قيد التصليح",

    resolved:"تم الحل"

  })[status]||
  status;

}


faults=
async function(c){

  let fs=
    (
      await sb
      .from("fault_reports")
      .select(
        "*,profiles(full_name),areas(name),meters(meter_number)"
      )
      .order(
        "created_at",
        {
          ascending:false
        }
      )
    ).data||
    [];

  window._faults=
    fs;

  let openCount=
    fs.filter(
      x=>x.status==="open"
    ).length;

  let repairingCount=
    fs.filter(
      x=>
      x.status==="repairing"||
      x.status==="scheduled"
    ).length;

  let resolvedCount=
    fs.filter(
      x=>x.status==="resolved"
    ).length;

  c.innerHTML=

    header(
      "الأعطال",
      "Incident Control Center — متابعة البلاغات وحالة أعمال الصيانة."
    )

    +

    `

      <section class="incident-summary">

        <article class="incident-stat total">

          <div class="incident-stat-icon">
            <i data-lucide="radio-tower"></i>
          </div>

          <div>
            <small>
              إجمالي البلاغات
            </small>

            <b>
              ${fs.length}
            </b>
          </div>

        </article>


        <article class="incident-stat open">

          <div class="incident-stat-icon">
            <i data-lucide="triangle-alert"></i>
          </div>

          <div>
            <small>
              بلاغات مفتوحة
            </small>

            <b>
              ${openCount}
            </b>
          </div>

        </article>


        <article class="incident-stat repairing">

          <div class="incident-stat-icon">
            <i data-lucide="wrench"></i>
          </div>

          <div>
            <small>
              قيد المعالجة
            </small>

            <b>
              ${repairingCount}
            </b>
          </div>

        </article>


        <article class="incident-stat resolved">

          <div class="incident-stat-icon">
            <i data-lucide="circle-check-big"></i>
          </div>

          <div>
            <small>
              تم حلها
            </small>

            <b>
              ${resolvedCount}
            </b>
          </div>

        </article>

      </section>


      <section class="incident-grid">

        ${
          fs.map(
            f=>`

            <article
              class="incident-card ${f.status||"open"}">

              <div class="incident-card-head">

                <div class="incident-number">

                  <span class="incident-led"></span>

                  <div>

                    <small>
                      INCIDENT REPORT
                    </small>

                    <b>
                      #${f.id}
                    </b>

                  </div>

                </div>

                <span class="incident-status">

                  ${incidentStatusName(f.status)}

                </span>

              </div>


              <div class="incident-title">

                <div class="incident-title-icon">

                  <i data-lucide="zap-off"></i>

                </div>

                <div>

                  <h4>
                    ${f.fault_type||"عطل كهربائي"}
                  </h4>

                  <p>
                    ${incidentStatusArabic(f.status)}
                  </p>

                </div>

              </div>


              <div class="incident-data">

                <div>

                  <small>
                    المشترك
                  </small>

                  <b>
                    ${
                      f.profiles
                      ?.full_name||
                      "-"
                    }
                  </b>

                </div>

                <div>

                  <small>
                    المنطقة
                  </small>

                  <b>
                    ${
                      f.areas
                      ?.name||
                      "-"
                    }
                  </b>

                </div>

                <div>

                  <small>
                    رقم العداد
                  </small>

                  <b>
                    ${
                      f.meters
                      ?.meter_number||
                      "-"
                    }
                  </b>

                </div>

              </div>


              <button
                class="incident-open"
                onclick="openFaultAdmin(${f.id})">

                <i data-lucide="scan-search"></i>

                فتح مركز البلاغ

              </button>

            </article>

            `
          )
          .join("")

          ||

          `

          <div class="empty-control-state">

            <i data-lucide="shield-check"></i>

            <div>
              لا توجد بلاغات أعطال حاليًا
            </div>

          </div>

          `
        }

      </section>

    `;

}


/* =========================================================
   NETWORK ALERT CENTER
   ========================================================= */

notifications=
async function(c){

  let ar=
    (
      await sb
      .from("areas")
      .select("*")
    ).data||
    [];

  let ns=
    (
      await sb
      .from("notifications")
      .select(
        "*,areas(name)"
      )
      .order(
        "created_at",
        {
          ascending:false
        }
      )
    ).data||
    [];

  window._areas=
    ar;

  let allNetwork=
    ns.filter(
      n=>!n.area_id
    ).length;

  let areaAlerts=
    ns.filter(
      n=>!!n.area_id
    ).length;

  c.innerHTML=

    header(
      "التنبيهات",
      "Network Alert Center — إدارة رسائل الشبكة والمشتركين."
    )

    +

    `

      <section class="alert-center-top">

        <div class="alert-center-title">

          <div class="alert-radio">

            <i data-lucide="radio"></i>

          </div>

          <div>

            <h3>
              مركز بث التنبيهات
            </h3>

            <p>
              إرسال تحديثات الشبكة والتنبيهات
              العامة أو المخصصة لمنطقة محددة.
            </p>

          </div>

        </div>


        <button
          class="new-alert-btn"
          onclick="openNotificationDialog()">

          <i data-lucide="send"></i>

          NEW ALERT · إرسال تنبيه

        </button>

      </section>


      <section class="alert-summary">

        <article class="alert-summary-card">

          <i data-lucide="bell-ring"></i>

          <div>

            <small>
              إجمالي التنبيهات
            </small>

            <b>
              ${ns.length}
            </b>

          </div>

        </article>


        <article class="alert-summary-card">

          <i data-lucide="radio-tower"></i>

          <div>

            <small>
              بث لكل الشبكة
            </small>

            <b>
              ${allNetwork}
            </b>

          </div>

        </article>


        <article class="alert-summary-card">

          <i data-lucide="map-pin"></i>

          <div>

            <small>
              تنبيهات المناطق
            </small>

            <b>
              ${areaAlerts}
            </b>

          </div>

        </article>

      </section>


      <section class="alert-feed">

        ${
          ns.map(
            n=>{

              let when=
                n.created_at
                ?
                new Date(
                  n.created_at
                )
                .toLocaleString(
                  "ar-LB"
                )
                :
                "-";

              return `

                <article class="network-alert">

                  <div class="network-alert-icon">

                    <i data-lucide="bell-ring"></i>

                  </div>

                  <div>

                    <h4>
                      ${n.title||"تنبيه الشبكة"}
                    </h4>

                    <p>
                      ${n.message||""}
                    </p>

                  </div>

                  <div class="alert-target">

                    <span>

                      <i data-lucide="${
                        n.area_id
                        ?"map-pin"
                        :"radio-tower"
                      }"></i>

                      ${
                        n.areas
                        ?.name||
                        "ALL NETWORK"
                      }

                    </span>

                    <small>
                      ${when}
                    </small>

                  </div>

                </article>

              `;

            }
          )
          .join("")

          ||

          `

            <div class="empty-control-state">

              <i data-lucide="bell-off"></i>

              <div>
                لا توجد تنبيهات مرسلة بعد
              </div>

            </div>

          `
        }

      </section>

    `;

}


/* =========================================================
   CONNECT V3 TO CURRENT PREMIUM DASHBOARD
   ========================================================= */

const renderAdminPremiumV2=
  renderAdmin;


renderAdmin=
async function(
  page="dashboard"
){

  injectAdminPremiumV3Styles();

  await renderAdminPremiumV2(
    page
  );

  if(
    page==="dashboard"
  ){

    upgradeDashboardPowerCore();

    icons();

  }

};

/* =========================================================
   ADMIN PREMIUM V4
   BILLING CONTROL + PAYMENT & RECEIPT CENTER
   ========================================================= */

function injectAdminPremiumV4Styles(){

  if(A("nashabehAdminPremiumV4"))return;

  let st=
    document.createElement("style");

  st.id=
    "nashabehAdminPremiumV4";

  st.textContent=`

  /* =====================================================
     SHARED FINANCE UI
     ===================================================== */

  .finance-summary{
    display:grid;
    grid-template-columns:repeat(4,minmax(0,1fr));
    gap:11px;
    margin-bottom:16px;
  }

  .finance-stat{
    --finance:#39eaff;

    position:relative;
    overflow:hidden;

    display:flex;
    align-items:center;
    gap:10px;

    min-height:76px;

    padding:12px;

    border-radius:15px;

    border:
      1px solid
      color-mix(
        in srgb,
        var(--finance) 28%,
        #183b49
      );

    background:
      radial-gradient(
        circle at 88% 8%,
        color-mix(
          in srgb,
          var(--finance) 11%,
          transparent
        ),
        transparent 40%
      ),
      linear-gradient(
        145deg,
        #061d28,
        #03141c
      );

    box-shadow:
      inset 0 0 20px rgba(0,0,0,.25);
  }

  .finance-stat.total{
    --finance:#43eaff;
  }

  .finance-stat.paid{
    --finance:#39ef78;
  }

  .finance-stat.partial{
    --finance:#ffc934;
  }

  .finance-stat.unpaid{
    --finance:#ff5c69;
  }

  .finance-stat-icon{
    width:41px;
    height:41px;

    flex:0 0 41px;

    display:grid;
    place-items:center;

    border-radius:12px;

    color:var(--finance);

    border:
      1px solid
      color-mix(
        in srgb,
        var(--finance) 36%,
        transparent
      );

    background:
      rgba(2,15,21,.75);

    box-shadow:
      0 0 14px
      color-mix(
        in srgb,
        var(--finance) 10%,
        transparent
      );
  }

  .finance-stat-icon svg{
    width:19px;
    height:19px;
  }

  .finance-stat small{
    display:block;
    color:#718f9d;
    font-size:7px;
  }

  .finance-stat b{
    display:block;

    margin-top:2px;

    color:#f3fbff;

    font-size:18px;
  }

  .finance-stat em{
    display:block;

    margin-top:3px;

    color:var(--finance);

    font-size:6px;
    font-style:normal;
    font-weight:900;
  }


  /* =====================================================
     BILLING TERMINAL
     ===================================================== */

  .billing-terminal{
    position:relative;
    overflow:hidden;

    margin-bottom:16px;

    padding:17px;

    border-radius:20px;

    border:
      1px solid rgba(48,218,255,.25);

    background:
      radial-gradient(
        circle at 90% 0%,
        rgba(24,218,255,.10),
        transparent 34%
      ),
      linear-gradient(
        145deg,
        #071f2a,
        #03151e
      );

    box-shadow:
      inset 0 0 28px rgba(0,0,0,.30),
      0 12px 30px rgba(0,0,0,.16);
  }

  .billing-terminal::after{
    content:"";

    position:absolute;
    left:-35%;
    bottom:0;

    width:30%;
    height:1px;

    background:
      linear-gradient(
        90deg,
        transparent,
        #43eaff,
        transparent
      );

    box-shadow:
      0 0 9px #43eaff;

    animation:
      billingSweep 4s linear infinite;
  }

  .billing-terminal-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;

    margin-bottom:15px;
  }

  .billing-terminal-title{
    display:flex;
    align-items:center;
    gap:10px;
  }

  .billing-terminal-icon{
    position:relative;

    width:44px;
    height:44px;

    display:grid;
    place-items:center;

    border-radius:13px;

    color:#42eaff;

    border:
      1px solid rgba(66,234,255,.34);

    background:#041821;

    box-shadow:
      0 0 16px rgba(44,226,255,.10);
  }

  .billing-terminal-icon svg{
    width:21px;
    height:21px;
  }

  .billing-terminal-icon::after{
    content:"";

    position:absolute;
    right:4px;
    top:4px;

    width:6px;
    height:6px;

    border-radius:50%;

    background:#39ef78;

    box-shadow:
      0 0 6px #39ef78;

    animation:
      financeLed 1.5s ease-in-out infinite;
  }

  .billing-terminal-title h3{
    margin:0;

    color:#f2fbff;

    font-size:13px;
  }

  .billing-terminal-title p{
    margin:3px 0 0;

    color:#7194a2;

    font-size:7px;
  }

  .billing-price-tag{
    padding:6px 9px;

    border-radius:999px;

    border:
      1px solid rgba(255,202,45,.32);

    background:
      rgba(255,202,45,.06);

    color:#ffd142;

    font-size:7px;
    font-weight:900;
  }

  .billing-form-grid{
    display:grid;

    grid-template-columns:
      repeat(4,minmax(0,1fr));

    gap:10px;
  }

  .billing-field{
    min-width:0;
  }

  .billing-field.span2{
    grid-column:span 2;
  }

  .billing-field label{
    display:block;

    margin-bottom:5px;

    color:#7899a7;

    font-size:7px;
  }

  .billing-field input,
  .billing-field select{
    width:100%;

    box-sizing:border-box;

    min-height:38px;

    padding:9px 10px;

    border-radius:10px;

    border:
      1px solid #21495a;

    outline:none;

    background:#061923;

    color:#edf9fd;

    transition:.2s ease;
  }

  .billing-field input:focus,
  .billing-field select:focus{
    border-color:#43eaff;

    box-shadow:
      0 0 0 2px rgba(67,234,255,.08);
  }

  .billing-field input[readonly]{
    color:#78ddeb;
    background:#04151d;
  }

  .billing-preview{
    display:grid;

    grid-template-columns:
      repeat(3,minmax(0,1fr));

    gap:8px;

    margin-top:12px;
  }

  .billing-preview-box{
    padding:10px;

    border-radius:11px;

    border:
      1px solid #173d4b;

    background:
      rgba(2,15,21,.56);

    text-align:center;
  }

  .billing-preview-box small{
    display:block;

    color:#678b99;

    font-size:6px;
  }

  .billing-preview-box strong{
    display:block;

    margin-top:4px;

    color:#e9f9fd;

    font-size:12px;
  }

  .billing-preview-box.amount strong{
    color:#ffd043;

    font-size:18px;

    text-shadow:
      0 0 8px rgba(255,208,67,.16);
  }

  .billing-save{
    width:100%;

    min-height:40px;

    display:flex;
    align-items:center;
    justify-content:center;
    gap:7px;

    margin-top:12px;

    border-radius:10px;

    border:
      1px solid rgba(67,234,255,.42);

    background:
      linear-gradient(
        145deg,
        rgba(30,204,234,.14),
        rgba(4,34,46,.9)
      );

    color:#48eaff;

    font-size:8px;
    font-weight:900;

    cursor:pointer;

    transition:.2s ease;
  }

  .billing-save:hover{
    transform:translateY(-1px);

    box-shadow:
      0 0 16px rgba(50,226,255,.10);
  }

  .billing-save svg{
    width:14px;
    height:14px;
  }


  /* =====================================================
     INVOICE LEDGER
     ===================================================== */

  .billing-ledger{
    border-radius:19px;

    border:
      1px solid #173d4c;

    background:
      linear-gradient(
        145deg,
        rgba(5,24,33,.97),
        rgba(2,14,21,.98)
      );

    overflow:hidden;
  }

  .billing-ledger-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;

    padding:14px 15px;

    border-bottom:
      1px solid #173846;
  }

  .billing-ledger-head h3{
    margin:0;

    color:#eefaff;

    font-size:12px;
  }

  .billing-ledger-head small{
    color:#668a98;

    font-size:7px;
  }

  .ledger-count{
    padding:5px 8px;

    border-radius:999px;

    border:
      1px solid rgba(62,228,255,.24);

    background:
      rgba(62,228,255,.05);

    color:#42e9ff;

    font-size:6px;
    font-weight:900;
  }

  .invoice-ledger-list{
    display:grid;
  }

  .invoice-ledger-row{
    --invoice:#ff5b69;

    display:grid;

    grid-template-columns:
      minmax(150px,1.2fr)
      minmax(95px,.75fr)
      minmax(90px,.65fr)
      minmax(110px,.75fr)
      minmax(90px,.6fr)
      minmax(110px,.75fr)
      auto;

    gap:10px;
    align-items:center;

    min-height:67px;

    padding:10px 14px;

    border-bottom:
      1px solid #123441;

    transition:.2s ease;
  }

  .invoice-ledger-row:last-child{
    border-bottom:0;
  }

  .invoice-ledger-row:hover{
    background:
      color-mix(
        in srgb,
        var(--invoice) 3%,
        rgba(5,25,34,.96)
      );
  }

  .invoice-ledger-row.paid{
    --invoice:#39ef78;
  }

  .invoice-ledger-row.partial{
    --invoice:#ffc934;
  }

  .invoice-client{
    display:flex;
    align-items:center;
    gap:9px;

    min-width:0;
  }

  .invoice-client-icon{
    position:relative;

    width:34px;
    height:34px;

    flex:0 0 34px;

    display:grid;
    place-items:center;

    border-radius:10px;

    color:var(--invoice);

    border:
      1px solid
      color-mix(
        in srgb,
        var(--invoice) 28%,
        transparent
      );

    background:#041720;
  }

  .invoice-client-icon svg{
    width:16px;
    height:16px;
  }

  .invoice-client b{
    display:block;

    color:#eaf7fc;

    font-size:9px;

    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }

  .invoice-client small{
    display:block;

    margin-top:2px;

    color:#648795;

    font-size:6px;
  }

  .ledger-cell small{
    display:block;

    color:#638694;

    font-size:6px;
  }

  .ledger-cell b{
    display:block;

    margin-top:3px;

    color:#e4f5fa;

    font-size:8px;
  }

  .ledger-amount b{
    color:#ffd044;

    font-size:11px;
  }

  .invoice-state{
    display:inline-flex;
    align-items:center;
    gap:5px;

    padding:5px 7px;

    border-radius:999px;

    color:var(--invoice);

    border:
      1px solid
      color-mix(
        in srgb,
        var(--invoice) 34%,
        transparent
      );

    background:
      color-mix(
        in srgb,
        var(--invoice) 6%,
        transparent
      );

    font-size:6px;
    font-weight:900;
  }

  .invoice-state::before{
    content:"";

    width:5px;
    height:5px;

    border-radius:50%;

    background:var(--invoice);

    box-shadow:
      0 0 5px var(--invoice);
  }

  .ledger-actions{
    display:flex;
    gap:5px;
  }

  .ledger-action{
    width:31px;
    height:31px;

    display:grid;
    place-items:center;

    padding:0;

    border-radius:8px;

    border:
      1px solid #245063;

    background:#061923;

    color:#87b6c6;

    cursor:pointer;

    transition:.2s ease;
  }

  .ledger-action:hover{
    color:#42eaff;
    border-color:#42eaff;
  }

  .ledger-action.pay{
    color:#42ef7a;
    border-color:rgba(66,239,122,.28);
  }

  .ledger-action svg{
    width:13px;
    height:13px;
  }


  /* =====================================================
     PAYMENT TERMINAL
     ===================================================== */

  .payment-terminal{
    display:grid;

    grid-template-columns:
      minmax(0,1.15fr)
      minmax(260px,.45fr);

    gap:14px;

    margin-bottom:16px;
  }

  .payment-console,
  .payment-screen{
    border-radius:19px;

    border:
      1px solid #193f4e;

    background:
      linear-gradient(
        145deg,
        #071e29,
        #03141d
      );

    box-shadow:
      inset 0 0 25px rgba(0,0,0,.28);
  }

  .payment-console{
    padding:16px;
  }

  .payment-console-head{
    display:flex;
    align-items:center;
    gap:10px;

    margin-bottom:14px;
  }

  .payment-console-head-icon{
    width:42px;
    height:42px;

    display:grid;
    place-items:center;

    border-radius:12px;

    color:#42ef7a;

    border:
      1px solid rgba(66,239,122,.30);

    background:#041820;

    box-shadow:
      0 0 15px rgba(66,239,122,.08);
  }

  .payment-console-head-icon svg{
    width:20px;
    height:20px;
  }

  .payment-console-head h3{
    margin:0;

    color:#effaff;

    font-size:12px;
  }

  .payment-console-head p{
    margin:3px 0 0;

    color:#6e91a0;

    font-size:7px;
  }

  .payment-form-grid{
    display:grid;

    grid-template-columns:
      repeat(2,minmax(0,1fr));

    gap:9px;
  }

  .payment-form-grid .full{
    grid-column:1/-1;
  }

  .payment-form-grid label{
    color:#7697a5;

    font-size:7px;
  }

  .payment-form-grid input,
  .payment-form-grid select{
    width:100%;

    box-sizing:border-box;

    min-height:38px;

    margin-top:5px;

    padding:9px 10px;

    border-radius:10px;

    border:
      1px solid #214a5a;

    background:#061923;

    color:#edf9fd;

    outline:none;
  }

  .payment-form-grid input:focus,
  .payment-form-grid select:focus{
    border-color:#42ef7a;

    box-shadow:
      0 0 0 2px rgba(66,239,122,.07);
  }

  .payment-submit{
    width:100%;

    min-height:40px;

    display:flex;
    align-items:center;
    justify-content:center;
    gap:7px;

    border-radius:10px;

    border:
      1px solid rgba(66,239,122,.40);

    background:
      linear-gradient(
        145deg,
        rgba(66,239,122,.12),
        rgba(3,32,21,.75)
      );

    color:#45ef7c;

    font-size:8px;
    font-weight:900;

    cursor:pointer;
  }

  .payment-submit svg{
    width:14px;
    height:14px;
  }

  .payment-screen{
    position:relative;

    overflow:hidden;

    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;

    padding:16px;

    text-align:center;
  }

  .payment-screen::before{
    content:"";

    position:absolute;
    inset:12px;

    border-radius:13px;

    border:
      1px dashed rgba(66,239,122,.16);
  }

  .payment-screen-icon{
    position:relative;
    z-index:2;

    width:58px;
    height:58px;

    display:grid;
    place-items:center;

    margin-bottom:9px;

    border-radius:18px;

    color:#42ef7a;

    border:
      1px solid rgba(66,239,122,.32);

    background:
      radial-gradient(
        circle,
        rgba(66,239,122,.12),
        #041712 70%
      );

    box-shadow:
      0 0 21px rgba(66,239,122,.10);
  }

  .payment-screen-icon svg{
    width:27px;
    height:27px;
  }

  .payment-screen small{
    position:relative;
    z-index:2;

    color:#658a77;

    font-size:6px;
  }

  .payment-screen strong{
    position:relative;
    z-index:2;

    display:block;

    margin-top:5px;

    color:#9cffaf;

    font-family:
      "Courier New",
      monospace;

    font-size:19px;

    letter-spacing:.06em;

    text-shadow:
      0 0 8px rgba(85,255,116,.25);
  }

  .payment-screen span{
    position:relative;
    z-index:2;

    display:inline-flex;

    margin-top:8px;

    padding:5px 8px;

    border-radius:999px;

    color:#42ef7a;

    border:
      1px solid rgba(66,239,122,.25);

    background:
      rgba(66,239,122,.05);

    font-size:6px;
    font-weight:900;
  }


  /* =====================================================
     RECEIPT FEED
     ===================================================== */

  .receipt-center{
    overflow:hidden;

    border-radius:19px;

    border:
      1px solid #183d4b;

    background:
      linear-gradient(
        145deg,
        #061c27,
        #03141c
      );
  }

  .receipt-center-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:10px;

    padding:14px 15px;

    border-bottom:
      1px solid #163846;
  }

  .receipt-center-head h3{
    margin:0;

    color:#effaff;

    font-size:12px;
  }

  .receipt-center-head p{
    margin:3px 0 0;

    color:#668a98;

    font-size:7px;
  }

  .receipt-list{
    display:grid;
  }

  .receipt-row{
    display:grid;

    grid-template-columns:
      minmax(150px,1fr)
      minmax(90px,.6fr)
      minmax(95px,.65fr)
      minmax(115px,.8fr)
      minmax(130px,.9fr)
      auto;

    gap:10px;
    align-items:center;

    min-height:62px;

    padding:10px 14px;

    border-bottom:
      1px solid #123440;

    transition:.2s ease;
  }

  .receipt-row:last-child{
    border-bottom:0;
  }

  .receipt-row:hover{
    background:
      rgba(66,239,122,.025);
  }

  .receipt-client{
    display:flex;
    align-items:center;
    gap:8px;

    min-width:0;
  }

  .receipt-icon{
    width:33px;
    height:33px;

    flex:0 0 33px;

    display:grid;
    place-items:center;

    border-radius:10px;

    color:#42ef7a;

    border:
      1px solid rgba(66,239,122,.25);

    background:#041710;
  }

  .receipt-icon svg{
    width:15px;
    height:15px;
  }

  .receipt-client b{
    display:block;

    color:#eaf7fb;

    font-size:9px;

    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }

  .receipt-client small{
    display:block;

    margin-top:2px;

    color:#638695;

    font-size:6px;
  }

  .receipt-data small{
    display:block;

    color:#628593;

    font-size:6px;
  }

  .receipt-data b{
    display:block;

    margin-top:3px;

    color:#deeff5;

    font-size:8px;
  }

  .receipt-money b{
    color:#68f391;

    font-size:11px;
  }

  .receipt-number b{
    color:#ffd043;

    font-family:
      "Courier New",
      monospace;

    font-size:7px;
  }

  .receipt-print{
    width:32px;
    height:32px;

    display:grid;
    place-items:center;

    border-radius:8px;

    border:
      1px solid #245064;

    background:#061923;

    color:#43eaff;

    cursor:pointer;
  }

  .receipt-print svg{
    width:14px;
    height:14px;
  }


  /* =====================================================
     EMPTY STATE
     ===================================================== */

  .finance-empty{
    padding:28px;

    text-align:center;

    color:#70929f;
  }

  .finance-empty svg{
    width:27px;
    height:27px;

    margin-bottom:7px;

    color:#42eaff;
  }


  /* =====================================================
     ANIMATIONS
     ===================================================== */

  @keyframes billingSweep{

    from{
      left:-35%;
    }

    to{
      left:120%;
    }

  }

  @keyframes financeLed{

    0%,100%{
      opacity:.45;
      transform:scale(.82);
    }

    50%{
      opacity:1;
      transform:scale(1.15);
    }

  }


  /* =====================================================
     RESPONSIVE
     ===================================================== */

  @media(max-width:1200px){

    .finance-summary{
      grid-template-columns:
        repeat(2,minmax(0,1fr));
    }

    .billing-form-grid{
      grid-template-columns:
        repeat(2,minmax(0,1fr));
    }

    .invoice-ledger-row{
      grid-template-columns:
        minmax(150px,1fr)
        repeat(3,minmax(85px,.65fr))
        auto;
    }

    .invoice-ledger-row
    .hide-md{
      display:none;
    }

    .receipt-row{
      grid-template-columns:
        minmax(140px,1fr)
        repeat(3,minmax(90px,.7fr))
        auto;
    }

    .receipt-row
    .hide-md{
      display:none;
    }

  }

  @media(max-width:780px){

    .finance-summary{
      grid-template-columns:1fr 1fr;
    }

    .billing-form-grid{
      grid-template-columns:1fr;
    }

    .billing-field.span2{
      grid-column:auto;
    }

    .billing-preview{
      grid-template-columns:1fr;
    }

    .payment-terminal{
      grid-template-columns:1fr;
    }

    .payment-form-grid{
      grid-template-columns:1fr;
    }

    .payment-form-grid .full{
      grid-column:auto;
    }

    .invoice-ledger-row{
      grid-template-columns:1fr auto;

      padding:12px;
    }

    .invoice-ledger-row
    .ledger-cell{
      display:none;
    }

    .invoice-ledger-row
    .ledger-actions{
      grid-column:1/-1;
      justify-content:flex-end;
    }

    .receipt-row{
      grid-template-columns:1fr auto;

      padding:12px;
    }

    .receipt-row
    .receipt-data{
      display:none;
    }

  }

  `;

  document.head
    .appendChild(st);

}


/* =========================================================
   INVOICE HELPERS
   ========================================================= */

function invoiceStatusEnglish(status){

  return({

    paid:"PAID",

    partial:"PARTIAL",

    unpaid:"UNPAID"

  })[status]||
  String(status||"UNPAID")
  .toUpperCase();

}


function paymentMethodArabic(method){

  return({

    cash:"نقدًا",

    bank_transfer:"تحويل مصرفي",

    other:"أخرى"

  })[method]||
  method||
  "نقدًا";

}


/* =========================================================
   BILLING CONTROL CENTER
   ========================================================= */

invoices=
async function(c){

  let[
    metersResult,
    invoicesResult,
    settingsResult,
    paymentsResult
  ]=
  await Promise.all([

    sb.from("meters")
      .select(
        "id,meter_number,customer_id,profiles(full_name,phone,area_id,areas(name)),meter_readings(reading_value,reading_date,billing_month)"
      ),

    sb.from("invoices")
      .select(
        "*,profiles(full_name,phone,areas(name)),meters(meter_number)"
      )
      .order(
        "created_at",
        {
          ascending:false
        }
      ),

    sb.from("app_settings")
      .select(
        "kwh_price,currency"
      )
      .eq(
        "id",
        1
      )
      .single(),

    sb.from("payments")
      .select(
        "invoice_id,amount"
      )

  ]);


  let ms=
    metersResult.data||
    [];

  let iv=
    invoicesResult.data||
    [];

  let s=
    settingsResult.data||
    {
      kwh_price:.65,
      currency:"USD"
    };

  let pays=
    paymentsResult.data||
    [];


  window._invoices=
    iv;


  let paidBy={};

  for(
    let p of pays
  ){

    paidBy[
      p.invoice_id
    ]=
      (
        paidBy[
          p.invoice_id
        ]||
        0
      )
      +
      Number(
        p.amount||
        0
      );

  }


  let totalValue=
    iv.reduce(
      (sum,i)=>
        sum+
        Number(
          i.amount||
          0
        ),
      0
    );


  let paidValue=
    iv
    .filter(
      i=>i.status==="paid"
    )
    .reduce(
      (sum,i)=>
        sum+
        Number(
          i.amount||
          0
        ),
      0
    );


  let outstanding=
    iv.reduce(
      (sum,i)=>
        sum+
        Math.max(
          0,
          Number(
            i.amount||
            0
          )
          -
          Number(
            paidBy[
              i.id
            ]||
            0
          )
        ),
      0
    );


  let partialCount=
    iv.filter(
      i=>i.status==="partial"
    ).length;


  let unpaidCount=
    iv.filter(
      i=>i.status==="unpaid"
    ).length;


  let options=
    ms.map(
      m=>{

        let rr=
          (
            m.meter_readings||
            []
          )
          .sort(
            (a,b)=>
              new Date(
                b.reading_date
              )
              -
              new Date(
                a.reading_date
              )
          )[0];

        let last=
          rr?.reading_value??
          0;

        return `

          <option
            value="${m.id}"
            data-customer="${m.customer_id}"
            data-last="${last}">

            ${
              m.profiles
              ?.full_name||
              "-"
            }

            ·

            ${m.meter_number}

          </option>

        `;

      }
    )
    .join("");


  c.innerHTML=

    header(
      "الفواتير",
      "Billing Control Center — إصدار الفواتير ومتابعة الاستهلاك والتحصيل."
    )

    +

    `

      <section class="finance-summary">

        <article class="finance-stat total">

          <div class="finance-stat-icon">
            <i data-lucide="files"></i>
          </div>

          <div>

            <small>
              إجمالي الفواتير
            </small>

            <b>
              ${money(totalValue)}
            </b>

            <em>
              ${iv.length} INVOICES
            </em>

          </div>

        </article>


        <article class="finance-stat paid">

          <div class="finance-stat-icon">
            <i data-lucide="badge-check"></i>
          </div>

          <div>

            <small>
              فواتير مدفوعة
            </small>

            <b>
              ${money(paidValue)}
            </b>

            <em>
              ${
                iv.filter(
                  i=>i.status==="paid"
                ).length
              }
              PAID
            </em>

          </div>

        </article>


        <article class="finance-stat partial">

          <div class="finance-stat-icon">
            <i data-lucide="circle-dollar-sign"></i>
          </div>

          <div>

            <small>
              مدفوعة جزئيًا
            </small>

            <b>
              ${partialCount}
            </b>

            <em>
              PARTIAL
            </em>

          </div>

        </article>


        <article class="finance-stat unpaid">

          <div class="finance-stat-icon">
            <i data-lucide="triangle-alert"></i>
          </div>

          <div>

            <small>
              الرصيد المستحق
            </small>

            <b>
              ${money(outstanding)}
            </b>

            <em>
              ${unpaidCount} UNPAID
            </em>

          </div>

        </article>

      </section>


      <section class="billing-terminal">

        <div class="billing-terminal-head">

          <div class="billing-terminal-title">

            <div class="billing-terminal-icon">
              <i data-lucide="calculator"></i>
            </div>

            <div>

              <h3>
                إصدار فاتورة جديدة
              </h3>

              <p>
                أدخل القراءة الحالية فقط —
                النظام يحسب الاستهلاك والقيمة تلقائيًا.
              </p>

            </div>

          </div>

          <span class="billing-price-tag">

            CURRENT RATE ·
            ${money(s.kwh_price)}
            / kWh

          </span>

        </div>


        <div class="billing-form-grid">

          <div class="billing-field span2">

            <label>
              المشترك والعداد
            </label>

            <select
              id="ivMeter"
              onchange="setInvoiceMeterDefaults()">

              ${options}

            </select>

          </div>


          <div class="billing-field">

            <label>
              شهر الفاتورة
            </label>

            <input
              id="ivMonth"
              type="month">

          </div>


          <div class="billing-field">

            <label>
              الاستحقاق
            </label>

            <input
              id="ivDue"
              type="date">

          </div>


          <div class="billing-field">

            <label>
              القراءة السابقة
            </label>

            <input
              id="ivPrev"
              type="text"
              readonly>

          </div>


          <div class="billing-field">

            <label>
              القراءة الحالية
            </label>

            <input
              id="ivCur"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              placeholder="أدخل القراءة الحالية"
              oninput="updateInvoicePreview()">

          </div>


          <div class="billing-field">

            <label>
              سعر 1 kWh
            </label>

            <input
              id="ivPrice"
              type="text"
              value="${Number(s.kwh_price).toFixed(2)}"
              readonly>

          </div>


          <div class="billing-field">

            <label>
              الاستهلاك kWh
            </label>

            <input
              id="ivConsumption"
              type="text"
              readonly>

          </div>

        </div>


        <div class="billing-preview">

          <div class="billing-preview-box">

            <small>
              PREVIOUS READING
            </small>

            <strong id="billingPrevVisual">
              —
            </strong>

          </div>


          <div class="billing-preview-box">

            <small>
              CONSUMPTION
            </small>

            <strong id="billingConsumptionVisual">
              0 kWh
            </strong>

          </div>


          <div class="billing-preview-box amount">

            <small>
              INVOICE TOTAL
            </small>

            <strong id="billingAmountVisual">
              $0.00
            </strong>

          </div>

        </div>


        <input
          id="ivAmount"
          type="hidden"
          readonly>


        <button
          class="billing-save"
          onclick="createInvoice()">

          <i data-lucide="file-plus-2"></i>

          إصدار وحفظ الفاتورة

        </button>

      </section>


      <section class="billing-ledger">

        <div class="billing-ledger-head">

          <div>

            <h3>
              سجل الفواتير
            </h3>

            <small>
              Billing Ledger · أحدث الفواتير أولًا
            </small>

          </div>

          <span class="ledger-count">
            ${iv.length} RECORDS
          </span>

        </div>


        <div class="invoice-ledger-list">

          ${
            iv.map(
              i=>{

                let consumption=
                  i.consumption_kwh??
                  i.consumption??
                  0;

                let status=
                  i.status||
                  "unpaid";

                return `

                  <article
                    class="invoice-ledger-row ${status}">

                    <div class="invoice-client">

                      <div class="invoice-client-icon">
                        <i data-lucide="user-round"></i>
                      </div>

                      <div>

                        <b>
                          ${
                            i.profiles
                            ?.full_name||
                            "-"
                          }
                        </b>

                        <small>
                          METER ·
                          ${
                            i.meters
                            ?.meter_number||
                            "-"
                          }
                        </small>

                      </div>

                    </div>


                    <div class="ledger-cell">

                      <small>
                        الشهر
                      </small>

                      <b>
                        ${i.billing_month||"-"}
                      </b>

                    </div>


                    <div class="ledger-cell hide-md">

                      <small>
                        القراءة
                      </small>

                      <b>
                        ${i.previous_reading}
                        →
                        ${i.current_reading}
                      </b>

                    </div>


                    <div class="ledger-cell hide-md">

                      <small>
                        الاستهلاك
                      </small>

                      <b>
                        ${consumption} kWh
                      </b>

                    </div>


                    <div class="ledger-cell">

                      <small>
                        السعر
                      </small>

                      <b>

                        $${
                          Number(
                            i.price_per_kwh||
                            i.kwh_price||
                            0
                          )
                          .toFixed(2)
                        }

                      </b>

                    </div>


                    <div class="ledger-cell ledger-amount">

                      <small>
                        القيمة
                      </small>

                      <b>
                        ${money(i.amount)}
                      </b>

                    </div>


                    <div>

                      <span class="invoice-state">

                        ${invoiceStatusEnglish(status)}

                      </span>

                      <div class="ledger-actions">

                        <button
                          class="ledger-action"
                          title="طباعة"
                          onclick="printInvoice('${i.id}')">

                          <i data-lucide="printer"></i>

                        </button>

                        ${
                          status!=="paid"
                          ?`

                            <button
                              class="ledger-action pay"
                              title="تسديد"
                              onclick="renderAdmin('payments')">

                              <i data-lucide="circle-dollar-sign"></i>

                            </button>

                          `
                          :""
                        }

                      </div>

                    </div>

                  </article>

                `;

              }
            )
            .join("")

            ||

            `

              <div class="finance-empty">

                <i data-lucide="file-x-2"></i>

                <div>
                  لا توجد فواتير حتى الآن
                </div>

              </div>

            `
          }

        </div>

      </section>

    `;


  setInvoiceMeterDefaults();

  syncBillingVisuals();

}


/* =========================================================
   BILLING VISUAL SYNC
   ========================================================= */

function syncBillingVisuals(){

  let prev=
    A("ivPrev");

  let con=
    A("ivConsumption");

  let amount=
    A("ivAmount");

  let p=
    A("billingPrevVisual");

  let c=
    A("billingConsumptionVisual");

  let a=
    A("billingAmountVisual");


  if(
    p&&
    prev
  ){

    p.textContent=
      prev.value||
      "—";

  }


  if(
    c&&
    con
  ){

    c.textContent=
      (
        con.value||
        "0"
      )
      +
      " kWh";

  }


  if(
    a&&
    amount
  ){

    a.textContent=
      money(
        amount.value||
        0
      );

  }

}


/* preserve old calculation then update premium visual */

const setInvoiceMeterDefaultsPremiumBase=
  setInvoiceMeterDefaults;


setInvoiceMeterDefaults=
function(){

  setInvoiceMeterDefaultsPremiumBase();

  setTimeout(
    syncBillingVisuals,
    0
  );

};


const updateInvoicePreviewPremiumBase=
  updateInvoicePreview;


updateInvoicePreview=
function(){

  updateInvoicePreviewPremiumBase();

  syncBillingVisuals();

};


/* =========================================================
   PAYMENT & RECEIPT CENTER
   ========================================================= */

payments=
async function(c){

  let[
    p,
    iv
  ]=
  await Promise.all([

    sb.from("payments")
      .select(
        "*,profiles(full_name),invoices(billing_month,amount,status)"
      )
      .order(
        "paid_at",
        {
          ascending:false
        }
      ),

    sb.from("invoices")
      .select(
        "*,profiles(full_name),meters(meter_number)"
      )
      .neq(
        "status",
        "paid"
      )
      .order(
        "created_at",
        {
          ascending:false
        }
      )

  ]);


  let pays=
    p.data||
    [];

  let invs=
    iv.data||
    [];


  window._payments=
    pays;


  let paidBy={};


  for(
    let x of pays
  ){

    paidBy[
      x.invoice_id
    ]=
      (
        paidBy[
          x.invoice_id
        ]||
        0
      )
      +
      Number(
        x.amount||
        0
      );

  }


  let opts=
    invs.map(
      i=>{

        let rem=
          Math.max(
            0,
            Number(
              i.amount
            )
            -
            Number(
              paidBy[
                i.id
              ]||
              0
            )
          );

        return `

          <option
            value="${i.id}"
            data-customer="${i.customer_id}"
            data-total="${i.amount}"
            data-paid="${paidBy[i.id]||0}"
            data-remaining="${rem}">

            ${
              i.profiles
              ?.full_name||
              "-"
            }

            ·
            ${i.billing_month}

            · متبقي
            ${money(rem)}

          </option>

        `;

      }
    )
    .join("");


  let totalCollected=
    pays.reduce(
      (sum,x)=>
        sum+
        Number(
          x.amount||
          0
        ),
      0
    );


  let today=
    new Date()
    .toISOString()
    .slice(
      0,
      10
    );


  let todayCollected=
    pays
    .filter(
      x=>
        String(
          x.paid_at||
          ""
        )
        .slice(
          0,
          10
        )===
        today
    )
    .reduce(
      (sum,x)=>
        sum+
        Number(
          x.amount||
          0
        ),
      0
    );


  let remainingTotal=
    invs.reduce(
      (sum,i)=>
        sum+
        Math.max(
          0,
          Number(
            i.amount||
            0
          )
          -
          Number(
            paidBy[
              i.id
            ]||
            0
          )
        ),
      0
    );


  c.innerHTML=

    header(
      "الدفعات",
      "Payment & Receipt Center — تسجيل التحصيل وإصدار الإيصالات."
    )

    +

    `

      <section class="finance-summary">

        <article class="finance-stat total">

          <div class="finance-stat-icon">
            <i data-lucide="receipt-text"></i>
          </div>

          <div>

            <small>
              عدد الدفعات
            </small>

            <b>
              ${pays.length}
            </b>

            <em>
              RECEIPTS
            </em>

          </div>

        </article>


        <article class="finance-stat paid">

          <div class="finance-stat-icon">
            <i data-lucide="circle-dollar-sign"></i>
          </div>

          <div>

            <small>
              إجمالي المقبوض
            </small>

            <b>
              ${money(totalCollected)}
            </b>

            <em>
              COLLECTED
            </em>

          </div>

        </article>


        <article class="finance-stat partial">

          <div class="finance-stat-icon">
            <i data-lucide="calendar-check-2"></i>
          </div>

          <div>

            <small>
              مقبوض اليوم
            </small>

            <b>
              ${money(todayCollected)}
            </b>

            <em>
              TODAY
            </em>

          </div>

        </article>


        <article class="finance-stat unpaid">

          <div class="finance-stat-icon">
            <i data-lucide="clock-3"></i>
          </div>

          <div>

            <small>
              متبقي للتحصيل
            </small>

            <b>
              ${money(remainingTotal)}
            </b>

            <em>
              OUTSTANDING
            </em>

          </div>

        </article>

      </section>


      <section class="payment-terminal">

        <article class="payment-console">

          <div class="payment-console-head">

            <div class="payment-console-head-icon">

              <i data-lucide="credit-card"></i>

            </div>

            <div>

              <h3>
                تسجيل دفعة
              </h3>

              <p>
                دفعة كاملة أو جزئية مع إصدار رقم إيصال تلقائي.
              </p>

            </div>

          </div>


          <div class="payment-form-grid">

            <label class="full">

              الفاتورة

              <select
                id="payInvoice"
                onchange="setPaymentDefaults()">

                ${opts}

              </select>

            </label>


            <label>

              المبلغ المدفوع

              <input
                id="payAmount"
                type="text"
                inputmode="decimal"
                oninput="syncPaymentScreen()">

            </label>


            <label>

              طريقة الدفع

              <select id="payMethod">

                <option value="cash">
                  نقدًا Cash
                </option>

                <option value="bank_transfer">
                  تحويل مصرفي
                </option>

                <option value="other">
                  أخرى
                </option>

              </select>

            </label>


            <label>

              مرجع / رقم عملية

              <input
                id="payReference"
                autocomplete="off">

            </label>


            <label>

              ملاحظة

              <input
                id="payNote"
                autocomplete="off">

            </label>


            <div class="full">

              <button
                class="payment-submit"
                onclick="recordPayment()">

                <i data-lucide="badge-dollar-sign"></i>

                تسجيل الدفعة وإصدار الإيصال

              </button>

            </div>

          </div>

        </article>


        <aside class="payment-screen">

          <div class="payment-screen-icon">

            <i data-lucide="wallet-cards"></i>

          </div>

          <small>
            PAYMENT AMOUNT
          </small>

          <strong id="paymentScreenAmount">
            $0.00
          </strong>

          <span>
            TERMINAL READY
          </span>

        </aside>

      </section>


      <section class="receipt-center">

        <div class="receipt-center-head">

          <div>

            <h3>
              سجل الإيصالات
            </h3>

            <p>
              Receipt History · أحدث عمليات القبض أولًا
            </p>

          </div>

          <span class="ledger-count">
            ${pays.length} RECEIPTS
          </span>

        </div>


        <div class="receipt-list">

          ${
            pays.map(
              x=>`

                <article class="receipt-row">

                  <div class="receipt-client">

                    <div class="receipt-icon">
                      <i data-lucide="user-round-check"></i>
                    </div>

                    <div>

                      <b>
                        ${
                          x.profiles
                          ?.full_name||
                          "-"
                        }
                      </b>

                      <small>
                        ${
                          x.invoices
                          ?.billing_month||
                          "-"
                        }
                      </small>

                    </div>

                  </div>


                  <div class="receipt-data receipt-money">

                    <small>
                      المبلغ
                    </small>

                    <b>
                      ${money(x.amount)}
                    </b>

                  </div>


                  <div class="receipt-data">

                    <small>
                      الطريقة
                    </small>

                    <b>
                      ${paymentMethodArabic(x.payment_method)}
                    </b>

                  </div>


                  <div class="receipt-data receipt-number">

                    <small>
                      رقم الإيصال
                    </small>

                    <b>
                      ${x.receipt_no||"-"}
                    </b>

                  </div>


                  <div class="receipt-data hide-md">

                    <small>
                      التاريخ
                    </small>

                    <b>

                      ${
                        new Date(
                          x.paid_at
                        )
                        .toLocaleString(
                          "ar-LB"
                        )
                      }

                    </b>

                  </div>


                  <button
                    class="receipt-print"
                    title="طباعة الإيصال"
                    onclick="printReceipt('${x.id}')">

                    <i data-lucide="printer"></i>

                  </button>

                </article>

              `
            )
            .join("")

            ||

            `

              <div class="finance-empty">

                <i data-lucide="receipt"></i>

                <div>
                  لا توجد دفعات مسجلة بعد
                </div>

              </div>

            `
          }

        </div>

      </section>

    `;


  setPaymentDefaults();

  syncPaymentScreen();

}


/* =========================================================
   PAYMENT SCREEN SYNC
   ========================================================= */

function syncPaymentScreen(){

  let amount=
    A("payAmount");

  let screen=
    A("paymentScreenAmount");


  if(
    !screen
  )return;


  screen.textContent=
    money(
      amount?.value||
      0
    );

}


const setPaymentDefaultsPremiumBase=
  setPaymentDefaults;


setPaymentDefaults=
function(){

  setPaymentDefaultsPremiumBase();

  setTimeout(
    syncPaymentScreen,
    0
  );

};


/* =========================================================
   LOAD V4 STYLES
   ========================================================= */

/* =========================================================
   ADMIN PREMIUM V5
   CUSTOMER MANAGEMENT + SYSTEM CONFIGURATION
   ========================================================= */

function injectAdminPremiumV5Styles(){

  if(A("nashabehAdminPremiumV5"))return;

  let st=
    document.createElement("style");

  st.id=
    "nashabehAdminPremiumV5";

  st.textContent=`

  /* =====================================================
     CUSTOMERS SUMMARY
     ===================================================== */

  .customer-admin-summary{
    display:grid;
    grid-template-columns:
      repeat(3,minmax(0,1fr));

    gap:11px;

    margin-bottom:16px;
  }

  .customer-admin-stat{
    --cust:#43eaff;

    min-height:78px;

    display:flex;
    align-items:center;
    gap:11px;

    padding:13px;

    border-radius:15px;

    border:
      1px solid
      color-mix(
        in srgb,
        var(--cust) 27%,
        #173b49
      );

    background:
      radial-gradient(
        circle at 88% 8%,
        color-mix(
          in srgb,
          var(--cust) 10%,
          transparent
        ),
        transparent 40%
      ),
      linear-gradient(
        145deg,
        #061d28,
        #03141c
      );

    box-shadow:
      inset 0 0 22px rgba(0,0,0,.28);
  }

  .customer-admin-stat.active{
    --cust:#39ef78;
  }

  .customer-admin-stat.inactive{
    --cust:#ff5d69;
  }

  .customer-admin-stat-icon{
    width:42px;
    height:42px;

    flex:0 0 42px;

    display:grid;
    place-items:center;

    border-radius:12px;

    color:var(--cust);

    border:
      1px solid
      color-mix(
        in srgb,
        var(--cust) 35%,
        transparent
      );

    background:#041820;

    box-shadow:
      0 0 14px
      color-mix(
        in srgb,
        var(--cust) 9%,
        transparent
      );
  }

  .customer-admin-stat-icon svg{
    width:20px;
    height:20px;
  }

  .customer-admin-stat small{
    display:block;

    color:#6f919f;

    font-size:7px;
  }

  .customer-admin-stat b{
    display:block;

    margin-top:2px;

    color:#effaff;

    font-size:19px;
  }

  .customer-admin-stat em{
    display:block;

    margin-top:3px;

    color:var(--cust);

    font-size:6px;
    font-style:normal;
    font-weight:900;
  }


  /* =====================================================
     NEW CUSTOMER TERMINAL
     ===================================================== */

  .customer-create-terminal{
    position:relative;
    overflow:hidden;

    margin-bottom:16px;

    padding:17px;

    border-radius:20px;

    border:
      1px solid rgba(46,220,255,.24);

    background:
      radial-gradient(
        circle at 92% 0%,
        rgba(39,223,255,.10),
        transparent 34%
      ),
      linear-gradient(
        145deg,
        #071e29,
        #03141d
      );

    box-shadow:
      inset 0 0 27px rgba(0,0,0,.28);
  }

  .customer-create-terminal::after{
    content:"";

    position:absolute;

    left:-30%;
    bottom:0;

    width:28%;
    height:1px;

    background:
      linear-gradient(
        90deg,
        transparent,
        #43eaff,
        transparent
      );

    box-shadow:
      0 0 8px #43eaff;

    animation:
      customerAdminSweep 4s linear infinite;
  }

  .customer-create-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;

    margin-bottom:15px;
  }

  .customer-create-title{
    display:flex;
    align-items:center;
    gap:10px;
  }

  .customer-create-icon{
    position:relative;

    width:44px;
    height:44px;

    display:grid;
    place-items:center;

    border-radius:13px;

    color:#43eaff;

    border:
      1px solid rgba(67,234,255,.34);

    background:#041821;
  }

  .customer-create-icon svg{
    width:21px;
    height:21px;
  }

  .customer-create-icon::after{
    content:"";

    position:absolute;

    right:4px;
    top:4px;

    width:6px;
    height:6px;

    border-radius:50%;

    background:#39ef78;

    box-shadow:
      0 0 6px #39ef78;

    animation:
      financeLed 1.4s ease-in-out infinite;
  }

  .customer-create-title h3{
    margin:0;

    color:#f2fbff;

    font-size:13px;
  }

  .customer-create-title p{
    margin:3px 0 0;

    color:#7194a2;

    font-size:7px;
  }

  .customer-create-tag{
    padding:6px 9px;

    border-radius:999px;

    border:
      1px solid rgba(57,239,120,.27);

    background:
      rgba(57,239,120,.05);

    color:#3def7c;

    font-size:6px;
    font-weight:900;
  }

  .customer-create-grid{
    display:grid;

    grid-template-columns:
      repeat(4,minmax(0,1fr));

    gap:10px;
  }

  .customer-create-field{
    min-width:0;
  }

  .customer-create-field.span2{
    grid-column:span 2;
  }

  .customer-create-field label{
    display:block;

    margin-bottom:5px;

    color:#7798a6;

    font-size:7px;
  }

  .customer-create-field input,
  .customer-create-field select{
    width:100%;

    box-sizing:border-box;

    min-height:39px;

    padding:9px 10px;

    border-radius:10px;

    border:
      1px solid #214a5a;

    outline:none;

    background:#061923;

    color:#ecf8fc;
  }

  .customer-create-field input:focus,
  .customer-create-field select:focus{
    border-color:#43eaff;

    box-shadow:
      0 0 0 2px rgba(67,234,255,.08);
  }

  .create-customer-btn{
    width:100%;

    min-height:41px;

    display:flex;
    align-items:center;
    justify-content:center;
    gap:7px;

    margin-top:12px;

    border-radius:10px;

    border:
      1px solid rgba(57,239,120,.38);

    background:
      linear-gradient(
        145deg,
        rgba(57,239,120,.12),
        rgba(3,35,22,.76)
      );

    color:#43ef7e;

    font-size:8px;
    font-weight:900;

    cursor:pointer;

    transition:.2s ease;
  }

  .create-customer-btn:hover{
    transform:translateY(-1px);

    box-shadow:
      0 0 16px rgba(57,239,120,.09);
  }

  .create-customer-btn svg{
    width:14px;
    height:14px;
  }


  /* =====================================================
     CUSTOMER CARDS
     ===================================================== */

  .customers-center{
    border-radius:19px;

    border:
      1px solid #173d4b;

    background:
      linear-gradient(
        145deg,
        #061c27,
        #03141c
      );

    overflow:hidden;
  }

  .customers-center-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;

    padding:14px 15px;

    border-bottom:
      1px solid #173846;
  }

  .customers-center-head h3{
    margin:0;

    color:#effaff;

    font-size:12px;
  }

  .customers-center-head p{
    margin:3px 0 0;

    color:#658997;

    font-size:7px;
  }

  .customers-grid{
    display:grid;

    grid-template-columns:
      repeat(3,minmax(250px,1fr));

    gap:12px;

    padding:14px;
  }

  .customer-unit{
    --customer-state:#39ef78;

    position:relative;
    overflow:hidden;

    padding:14px;

    border-radius:16px;

    border:
      1px solid
      color-mix(
        in srgb,
        var(--customer-state) 25%,
        #173b49
      );

    background:
      radial-gradient(
        circle at 92% 4%,
        color-mix(
          in srgb,
          var(--customer-state) 9%,
          transparent
        ),
        transparent 36%
      ),
      linear-gradient(
        145deg,
        #071e29,
        #03141c
      );

    transition:.2s ease;
  }

  .customer-unit.inactive{
    --customer-state:#ff5d69;
  }

  .customer-unit:hover{
    transform:translateY(-3px);

    box-shadow:
      0 12px 25px rgba(0,0,0,.20);
  }

  .customer-unit-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:10px;

    margin-bottom:13px;
  }

  .customer-avatar{
    display:flex;
    align-items:center;
    gap:9px;

    min-width:0;
  }

  .customer-avatar-icon{
    position:relative;

    width:42px;
    height:42px;

    flex:0 0 42px;

    display:grid;
    place-items:center;

    border-radius:12px;

    color:var(--customer-state);

    border:
      1px solid
      color-mix(
        in srgb,
        var(--customer-state) 32%,
        transparent
      );

    background:#041720;
  }

  .customer-avatar-icon svg{
    width:20px;
    height:20px;
  }

  .customer-avatar-icon::after{
    content:"";

    position:absolute;

    right:3px;
    top:3px;

    width:7px;
    height:7px;

    border-radius:50%;

    background:var(--customer-state);

    box-shadow:
      0 0 6px var(--customer-state);
  }

  .customer-avatar b{
    display:block;

    color:#eff9fd;

    font-size:10px;

    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }

  .customer-avatar small{
    display:block;

    margin-top:2px;

    color:#668996;

    font-size:6px;
  }

  .customer-state{
    padding:5px 8px;

    border-radius:999px;

    color:var(--customer-state);

    border:
      1px solid
      color-mix(
        in srgb,
        var(--customer-state) 35%,
        transparent
      );

    background:
      color-mix(
        in srgb,
        var(--customer-state) 6%,
        transparent
      );

    font-size:6px;
    font-weight:900;
  }

  .customer-data-grid{
    display:grid;

    grid-template-columns:
      repeat(2,minmax(0,1fr));

    gap:7px;

    margin-bottom:11px;
  }

  .customer-data-box{
    padding:8px;

    border-radius:9px;

    border:
      1px solid #163946;

    background:
      rgba(2,14,20,.52);
  }

  .customer-data-box small{
    display:block;

    color:#608491;

    font-size:6px;
  }

  .customer-data-box b{
    display:block;

    margin-top:3px;

    color:#dff2f8;

    font-size:8px;

    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }

  .customer-toggle{
    width:100%;

    min-height:35px;

    display:flex;
    align-items:center;
    justify-content:center;
    gap:6px;

    border-radius:9px;

    border:
      1px solid
      color-mix(
        in srgb,
        var(--customer-state) 35%,
        #234754
      );

    background:
      color-mix(
        in srgb,
        var(--customer-state) 5%,
        #061923
      );

    color:var(--customer-state);

    font-size:8px;
    font-weight:900;

    cursor:pointer;
  }

  .customer-toggle svg{
    width:13px;
    height:13px;
  }


  /* =====================================================
     SYSTEM CONFIGURATION
     ===================================================== */

  .system-config-layout{
    display:grid;

    grid-template-columns:
      minmax(0,1.15fr)
      minmax(280px,.55fr);

    gap:15px;
  }

  .config-console,
  .rate-monitor{
    position:relative;
    overflow:hidden;

    border-radius:20px;

    border:
      1px solid #193f4e;

    background:
      linear-gradient(
        145deg,
        #071e29,
        #03141d
      );

    box-shadow:
      inset 0 0 27px rgba(0,0,0,.28);
  }

  .config-console{
    padding:17px;
  }

  .config-console-head{
    display:flex;
    align-items:center;
    gap:10px;

    margin-bottom:16px;
  }

  .config-console-icon{
    width:44px;
    height:44px;

    display:grid;
    place-items:center;

    border-radius:13px;

    color:#42eaff;

    border:
      1px solid rgba(66,234,255,.32);

    background:#041821;
  }

  .config-console-icon svg{
    width:21px;
    height:21px;
  }

  .config-console-head h3{
    margin:0;

    color:#effaff;

    font-size:13px;
  }

  .config-console-head p{
    margin:3px 0 0;

    color:#7093a0;

    font-size:7px;
  }

  .config-field{
    margin-bottom:11px;
  }

  .config-field label{
    display:block;

    margin-bottom:5px;

    color:#7596a4;

    font-size:7px;
  }

  .config-field input{
    width:100%;

    box-sizing:border-box;

    min-height:41px;

    padding:9px 11px;

    border-radius:10px;

    border:
      1px solid #214a5a;

    background:#061923;

    color:#ecf8fc;

    outline:none;

    font-size:12px;
  }

  .config-field input:focus{
    border-color:#ffd043;

    box-shadow:
      0 0 0 2px rgba(255,208,67,.07);
  }

  .config-field input[readonly]{
    color:#45eaff;
  }

  .config-warning{
    display:flex;
    align-items:flex-start;
    gap:8px;

    margin:12px 0;

    padding:10px;

    border-radius:10px;

    border:
      1px solid rgba(255,202,45,.22);

    background:
      rgba(255,202,45,.045);

    color:#a99452;

    font-size:7px;
    line-height:1.7;
  }

  .config-warning svg{
    width:15px;
    height:15px;

    flex:0 0 15px;

    color:#ffd043;
  }

  .config-save{
    width:100%;

    min-height:41px;

    display:flex;
    align-items:center;
    justify-content:center;
    gap:7px;

    border-radius:10px;

    border:
      1px solid rgba(255,208,67,.37);

    background:
      linear-gradient(
        145deg,
        rgba(255,205,53,.13),
        rgba(53,39,3,.7)
      );

    color:#ffd044;

    font-size:8px;
    font-weight:900;

    cursor:pointer;
  }

  .config-save svg{
    width:14px;
    height:14px;
  }

  .rate-monitor{
    min-height:295px;

    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;

    padding:18px;

    text-align:center;
  }

  .rate-monitor::before{
    content:"";

    position:absolute;

    inset:15px;

    border-radius:14px;

    border:
      1px dashed rgba(255,208,67,.17);
  }

  .rate-monitor-icon{
    position:relative;
    z-index:2;

    width:62px;
    height:62px;

    display:grid;
    place-items:center;

    margin-bottom:11px;

    border-radius:19px;

    color:#ffd043;

    border:
      1px solid rgba(255,208,67,.32);

    background:
      radial-gradient(
        circle,
        rgba(255,208,67,.11),
        #171305 70%
      );

    box-shadow:
      0 0 22px rgba(255,208,67,.08);
  }

  .rate-monitor-icon svg{
    width:28px;
    height:28px;
  }

  .rate-monitor small{
    position:relative;
    z-index:2;

    color:#817749;

    font-size:6px;
    font-weight:900;
  }

  .rate-monitor strong{
    position:relative;
    z-index:2;

    display:block;

    margin-top:6px;

    color:#ffd94b;

    font-family:
      "Courier New",
      monospace;

    font-size:29px;

    text-shadow:
      0 0 10px rgba(255,208,67,.22);
  }

  .rate-monitor span{
    position:relative;
    z-index:2;

    display:inline-flex;

    margin-top:8px;

    padding:5px 8px;

    border-radius:999px;

    color:#39ef78;

    border:
      1px solid rgba(57,239,120,.24);

    background:
      rgba(57,239,120,.05);

    font-size:6px;
    font-weight:900;
  }


  /* =====================================================
     ANIMATIONS / RESPONSIVE
     ===================================================== */

  @keyframes customerAdminSweep{

    from{
      left:-30%;
    }

    to{
      left:120%;
    }

  }

  @media(max-width:1200px){

    .customers-grid{
      grid-template-columns:
        repeat(2,minmax(240px,1fr));
    }

    .customer-create-grid{
      grid-template-columns:
        repeat(2,minmax(0,1fr));
    }

  }

  @media(max-width:800px){

    .customer-admin-summary{
      grid-template-columns:1fr;
    }

    .customers-grid{
      grid-template-columns:1fr;
    }

    .customer-create-grid{
      grid-template-columns:1fr;
    }

    .customer-create-field.span2{
      grid-column:auto;
    }

    .system-config-layout{
      grid-template-columns:1fr;
    }

  }

  `;

  document.head
    .appendChild(st);

}


/* =========================================================
   CUSTOMER MANAGEMENT CENTER
   ========================================================= */

subscribers=
async function(c){

  let[
    areasResult,
    profilesResult,
    metersResult
  ]=
  await Promise.all([

    sb.from("areas")
      .select("*")
      .order("name"),

    sb.from("profiles")
      .select(
        "*,areas(name)"
      )
      .eq(
        "role",
        "customer"
      )
      .order(
        "created_at",
        {
          ascending:false
        }
      ),

    sb.from("meters")
      .select(
        "customer_id,meter_number"
      )

  ]);


  let areas=
    areasResult.data||
    [];

  let ps=
    profilesResult.data||
    [];

  let metersData=
    metersResult.data||
    [];


  let meterMap={};

  metersData
  .forEach(
    m=>{

      meterMap[
        m.customer_id
      ]=
        m.meter_number;

    }
  );


  let active=
    ps.filter(
      p=>p.active
    ).length;


  let inactive=
    ps.length-
    active;


  c.innerHTML=

    header(
      "المشتركون",
      "Customer Management Center — إنشاء وإدارة حسابات المشتركين."
    )

    +

    `

      <section class="customer-admin-summary">

        <article class="customer-admin-stat">

          <div class="customer-admin-stat-icon">

            <i data-lucide="users-round"></i>

          </div>

          <div>

            <small>
              إجمالي المشتركين
            </small>

            <b>
              ${ps.length}
            </b>

            <em>
              CUSTOMERS
            </em>

          </div>

        </article>


        <article class="customer-admin-stat active">

          <div class="customer-admin-stat-icon">

            <i data-lucide="circle-check-big"></i>

          </div>

          <div>

            <small>
              اشتراكات فعّالة
            </small>

            <b>
              ${active}
            </b>

            <em>
              ACTIVE
            </em>

          </div>

        </article>


        <article class="customer-admin-stat inactive">

          <div class="customer-admin-stat-icon">

            <i data-lucide="circle-x"></i>

          </div>

          <div>

            <small>
              اشتراكات غير فعّالة
            </small>

            <b>
              ${inactive}
            </b>

            <em>
              INACTIVE
            </em>

          </div>

        </article>

      </section>


      <section class="customer-create-terminal">

        <div class="customer-create-head">

          <div class="customer-create-title">

            <div class="customer-create-icon">

              <i data-lucide="user-plus"></i>

            </div>

            <div>

              <h3>
                إضافة مشترك جديد
              </h3>

              <p>
                إنشاء الحساب وربطه مباشرة بالمنطقة والعداد والقراءة الافتتاحية.
              </p>

            </div>

          </div>

          <span class="customer-create-tag">
            NEW CUSTOMER TERMINAL
          </span>

        </div>


        <div class="customer-create-grid">

          <div class="customer-create-field span2">

            <label>
              الاسم الكامل
            </label>

            <input
              id="newName"
              autocomplete="off"
              placeholder="اسم المشترك">

          </div>


          <div class="customer-create-field">

            <label>
              رقم الهاتف
            </label>

            <input
              id="newPhone"
              autocomplete="off"
              placeholder="+961 ...">

          </div>


          <div class="customer-create-field">

            <label>
              البريد الإلكتروني
            </label>

            <input
              id="newEmail"
              type="email"
              autocomplete="off"
              placeholder="email@example.com">

          </div>


          <div class="customer-create-field">

            <label>
              كلمة المرور
            </label>

            <input
              id="newPassword"
              type="password"
              autocomplete="new-password"
              placeholder="8 أحرف على الأقل">

          </div>


          <div class="customer-create-field">

            <label>
              المنطقة / العلبة
            </label>

            <select id="newArea">

              ${
                areas.map(
                  a=>`

                    <option
                      value="${a.id}">

                      ${a.name}

                    </option>

                  `
                )
                .join("")
              }

            </select>

          </div>


          <div class="customer-create-field">

            <label>
              رقم العداد
            </label>

            <input
              id="newMeter"
              autocomplete="off"
              placeholder="مثال: 756">

          </div>


          <div class="customer-create-field">

            <label>
              القراءة الافتتاحية
            </label>

            <input
              id="newInitialReading"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              placeholder="مثال: 850">

          </div>

        </div>


        <button
          class="create-customer-btn"
          onclick="createCustomer()">

          <i data-lucide="user-plus"></i>

          إنشاء حساب المشترك وتفعيل العداد

        </button>

      </section>


      <section class="customers-center">

        <div class="customers-center-head">

          <div>

            <h3>
              قاعدة المشتركين
            </h3>

            <p>
              Customer Registry · جميع المشتركين المسجلين في النظام
            </p>

          </div>

          <span class="ledger-count">
            ${ps.length} CUSTOMERS
          </span>

        </div>


        <div class="customers-grid">

          ${
            ps.map(
              p=>{

                let isActive=
                  !!p.active;

                return `

                  <article
                    class="customer-unit ${
                      isActive
                      ?""
                      :"inactive"
                    }">

                    <div class="customer-unit-head">

                      <div class="customer-avatar">

                        <div class="customer-avatar-icon">

                          <i data-lucide="user-round"></i>

                        </div>

                        <div>

                          <b>
                            ${p.full_name}
                          </b>

                          <small>
                            CUSTOMER ACCOUNT
                          </small>

                        </div>

                      </div>

                      <span class="customer-state">

                        ${
                          isActive
                          ?"ACTIVE"
                          :"INACTIVE"
                        }

                      </span>

                    </div>


                    <div class="customer-data-grid">

                      <div class="customer-data-box">

                        <small>
                          الهاتف
                        </small>

                        <b>
                          ${p.phone||"-"}
                        </b>

                      </div>


                      <div class="customer-data-box">

                        <small>
                          المنطقة
                        </small>

                        <b>
                          ${
                            p.areas
                            ?.name||
                            "-"
                          }
                        </b>

                      </div>


                      <div class="customer-data-box">

                        <small>
                          رقم العداد
                        </small>

                        <b>
                          ${
                            meterMap[
                              p.id
                            ]||
                            "-"
                          }
                        </b>

                      </div>


                      <div class="customer-data-box">

                        <small>
                          الحالة
                        </small>

                        <b>

                          ${
                            isActive
                            ?"اشتراك فعّال"
                            :"موقوف"
                          }

                        </b>

                      </div>

                    </div>


                    <button
                      class="customer-toggle"
                      onclick="toggleCustomer(
                        '${p.id}',
                        ${!isActive}
                      )">

                      <i
                        data-lucide="${
                          isActive
                          ?"circle-x"
                          :"circle-check-big"
                        }">
                      </i>

                      ${
                        isActive
                        ?"تعطيل الاشتراك"
                        :"تفعيل الاشتراك"
                      }

                    </button>

                  </article>

                `;

              }
            )
            .join("")

            ||

            `

              <div class="finance-empty">

                <i data-lucide="users-round"></i>

                <div>
                  لا يوجد مشتركون حتى الآن
                </div>

              </div>

            `
          }

        </div>

      </section>

    `;

}


/* =========================================================
   SYSTEM CONFIGURATION CENTER
   ========================================================= */

settings=
async function(c){

  let s=
    (
      await sb
      .from(
        "app_settings"
      )
      .select("*")
      .eq(
        "id",
        1
      )
      .single()
    ).data
    ||
    {
      kwh_price:.65,
      currency:"USD"
    };


  c.innerHTML=

    header(
      "الإعدادات",
      "System Configuration — إدارة التسعير والإعدادات العامة."
    )

    +

    `

      <section class="system-config-layout">

        <article class="config-console">

          <div class="config-console-head">

            <div class="config-console-icon">

              <i data-lucide="settings"></i>

            </div>

            <div>

              <h3>
                إعدادات التسعير
              </h3>

              <p>
                التحكم بالسعر المعتمد للفواتير الجديدة.
              </p>

            </div>

          </div>


          <div class="config-field">

            <label>
              سعر 1 kWh بالدولار
            </label>

            <input
              id="setKwhPrice"
              type="text"
              inputmode="decimal"
              value="${Number(s.kwh_price).toFixed(2)}"
              oninput="syncRateMonitor()">

          </div>


          <div class="config-field">

            <label>
              العملة
            </label>

            <input
              value="${s.currency||"USD"}"
              readonly>

          </div>


          <div class="config-warning">

            <i data-lucide="triangle-alert"></i>

            <div>

              تغيير سعر الكيلوواط يؤثر فقط على
              الفواتير الجديدة.

              الفواتير القديمة تحتفظ بالسعر الذي
              تم إصدارها عليه.

            </div>

          </div>


          <button
            class="config-save"
            onclick="saveSettings()">

            <i data-lucide="save"></i>

            حفظ إعدادات التسعير

          </button>

        </article>


        <aside class="rate-monitor">

          <div class="rate-monitor-icon">

            <i data-lucide="circle-dollar-sign"></i>

          </div>

          <small>
            CURRENT ENERGY RATE
          </small>

          <strong id="rateMonitorValue">

            $${Number(s.kwh_price).toFixed(2)}

          </strong>

          <span>
            USD / kWh · ACTIVE
          </span>

        </aside>

      </section>

    `;

}


/* =========================================================
   RATE MONITOR
   ========================================================= */

function syncRateMonitor(){

  let field=
    A("setKwhPrice");

  let monitor=
    A("rateMonitorValue");


  if(
    !field||
    !monitor
  )return;


  let value=
    Number(
      field.value
    );


  monitor.textContent=

    Number.isFinite(value)

    ?

    "$"+
    value.toFixed(2)

    :

    "$0.00";

}


/* =========================================================
   LOAD V5
   ========================================================= */
/* =========================================================
   PART 13A
   PHONE AUTH + CUSTOMER PHONE MANAGEMENT
   ========================================================= */


/* =========================================================
   PHONE NORMALIZATION
   ========================================================= */

function normalizeNashabehPhone(value){

  let phone=
    String(
      value||
      ""
    )
    .trim()
    .replace(
      /[\s\-().]/g,
      ""
    );

  if(!phone){
    return "";
  }

  if(
    phone.startsWith(
      "00"
    )
  ){

    phone=
      "+"+
      phone.slice(2);

  }
  else if(
    phone.startsWith("+")
  ){

    /* already international */

  }
  else if(
    phone.startsWith("961")
  ){

    phone=
      "+"+
      phone;

  }
  else if(
    phone.startsWith("0")
  ){

    phone=
      "+961"+
      phone.slice(1);

  }
  else{

    phone=
      "+961"+
      phone;

  }

  return phone;

}


/* =========================================================
   LOGIN UI
   customer = phone + password
   admin can still use email + password
   ========================================================= */

function preparePhoneLoginUI(){

  let field=
    A("loginEmail");

  if(!field)return;

  field.type=
    "text";

  field.inputMode=
    "tel";

  field.autocomplete=
    "username";

  field.placeholder=
    "رقم الهاتف للمشترك أو بريد الإدارة";

  let label=
    field.closest(
      "label"
    );

  if(label){

    let nodes=
      [
        ...label.childNodes
      ];

    let textNode=
      nodes.find(
        n=>
          n.nodeType===
          Node.TEXT_NODE
          &&
          n.textContent.trim()
      );

    if(textNode){

      textNode.textContent=
        " الهاتف / بريد الإدارة ";

    }

  }

}


/* =========================================================
   NEW LOGIN
   detects phone or email automatically
   ========================================================= */

login=
async function(){

  try{

    let identity=
      A("loginEmail")
      ?.value
      ?.trim()||
      "";

    let password=
      A("loginPassword")
      ?.value||
      "";

    if(
      !identity||
      !password
    ){

      return authMsg(
        "أدخل رقم الهاتف وكلمة المرور"
      );

    }

    let credentials={
      password
    };

    /*
      ADMIN:
      email@example.com

      CUSTOMER:
      70xxxxxx
      03xxxxxx
      +961...
    */

    if(
      identity.includes("@")
    ){

      credentials.email=
        identity;

    }
    else{

      let phone=
        normalizeNashabehPhone(
          identity
        );

      if(
        !/^\+\d{8,15}$/
        .test(phone)
      ){

        return authMsg(
          "رقم الهاتف غير صحيح"
        );

      }

      credentials.phone=
        phone;

    }

    let{
      error
    }=
    await sb.auth
    .signInWithPassword(
      credentials
    );

    if(error){

      return authMsg(
        identity.includes("@")
        ?
        "تعذر تسجيل الدخول. تحقق من البريد وكلمة المرور."
        :
        "تعذر تسجيل الدخول. تحقق من رقم الهاتف وكلمة المرور."
      );

    }

    await boot();

  }
  catch(e){

    authMsg(
      e?.message||
      "تعذر الاتصال بالخدمة. جرّب مجددًا."
    );

  }

};


/* =========================================================
   NEW CUSTOMER CREATION
   PHONE + PASSWORD ONLY
   ========================================================= */

createCustomer=
async function(){

  let full_name=
    A("newName")
    ?.value
    ?.trim()||
    "";

  let phone=
    normalizeNashabehPhone(
      A("newPhone")
      ?.value||
      ""
    );

  let password=
    A("newPassword")
    ?.value||
    "";

  let area_id=
    A("newArea")
    ?.value||
    "";

  let meter_number=
    A("newMeter")
    ?.value
    ?.trim()||
    "";

  let initial_reading=
    A("newInitialReading")
    ?.value
    ?.trim()||
    "";

  if(!full_name){

    return alert(
      "أدخل اسم المشترك"
    );

  }

  if(
    !phone||
    !/^\+\d{8,15}$/
    .test(phone)
  ){

    return alert(
      "أدخل رقم هاتف صحيح"
    );

  }

  if(
    !password||
    password.length<8
  ){

    return alert(
      "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
    );

  }

  if(!area_id){

    return alert(
      "اختر المنطقة"
    );

  }

  if(!meter_number){

    return alert(
      "أدخل رقم العداد"
    );

  }

  if(
    initial_reading===""||
    isNaN(
      Number(
        initial_reading
      )
    )||
    Number(
      initial_reading
    )<0
  ){

    return alert(
      "أدخل القراءة الحالية للعداد بشكل صحيح"
    );

  }

  let body={

    full_name,

    phone,

    password,

    area_id,

    meter_number,

    initial_reading

  };

  let r=
    await sb.functions
    .invoke(
      "create-customer",
      {
        body
      }
    );

  if(r.error){

    return alert(
      r.error.message
    );

  }

  if(
    r.data?.error
  ){

    return alert(
      r.data.error
    );

  }

  alert(
    "تم إنشاء المشترك بنجاح\n\n"+
    "رقم الدخول: "+
    phone+
    "\n"+
    "تم ربط العداد وحفظ القراءة الافتتاحية."
  );

  renderAdmin(
    "subscribers"
  );

};


/* =========================================================
   SYNC OLD CUSTOMER TO PHONE AUTH
   Keeps same account/password/data
   ========================================================= */

async function syncCustomerPhoneAuth(
  customerId,
  button
){

  if(
    !customerId
  )return;

  let originalText=
    button
    ?.innerHTML||
    "";

  if(button){

    button.disabled=
      true;

    button.innerHTML=
      `
        <i data-lucide="loader-circle"></i>
        جاري تفعيل الدخول بالهاتف...
      `;

    icons();

  }

  try{

    let r=
      await sb.functions
      .invoke(
        "sync-customer-phone-auth",
        {
          body:{
            customer_id:
              customerId
          }
        }
      );

    if(r.error){

      throw r.error;

    }

    if(
      r.data?.error
    ){

      throw new Error(
        r.data.error
      );

    }

    if(button){

      button.innerHTML=
        `
          <i data-lucide="circle-check"></i>
          PHONE LOGIN ACTIVE
        `;

      button.classList
      .add(
        "phone-ready"
      );

      icons();

    }

    alert(
      "تم تفعيل تسجيل الدخول بالهاتف بنجاح.\n\n"+
      "رقم الدخول:\n"+
      (
        r.data?.phone||
        ""
      )+
      "\n\n"+
      "كلمة المرور بقيت نفسها."
    );

  }
  catch(e){

    if(button){

      button.disabled=
        false;

      button.innerHTML=
        originalText;

      icons();

    }

    alert(
      "تعذر تفعيل الدخول بالهاتف:\n"+
      (
        e?.message||
        e
      )
    );

  }

}


/* =========================================================
   UPGRADE CUSTOMER MANAGEMENT UI
   remove email + add phone-login button
   ========================================================= */

const subscribersPhoneBase=
  subscribers;

subscribers=
async function(c){

  await subscribersPhoneBase(
    c
  );

  /*
    Remove email field from
    New Customer Terminal
  */

  let emailInput=
    A("newEmail");

  if(emailInput){

    let field=
      emailInput.closest(
        ".customer-create-field"
      );

    if(field){

      field.remove();

    }

  }


  /*
    Improve phone field
  */

  let phoneInput=
    A("newPhone");

  if(phoneInput){

    phoneInput.type=
      "tel";

    phoneInput.inputMode=
      "tel";

    phoneInput.placeholder=
      "مثال: 70330820";

    phoneInput.autocomplete=
      "off";

  }


  /*
    Load customers in exact same order
    as V5 cards
  */

  let result=
    await sb
    .from(
      "profiles"
    )
    .select(
      "id,full_name,phone"
    )
    .eq(
      "role",
      "customer"
    )
    .order(
      "created_at",
      {
        ascending:false
      }
    );

  let customers=
    result.data||
    [];

  let cards=
    [
      ...document
      .querySelectorAll(
        ".customer-unit"
      )
    ];


  cards.forEach(
    (
      card,
      index
    )=>{

      let customer=
        customers[index];

      if(
        !customer
      )return;


      let old=
        card.querySelector(
          ".phone-auth-btn"
        );

      if(old)return;


      let button=
        document
        .createElement(
          "button"
        );

      button.className=
        "phone-auth-btn";

      button.type=
        "button";

      button.innerHTML=
        `
          <i data-lucide="smartphone"></i>

          تفعيل الدخول برقم الهاتف
        `;

      button.onclick=
        ()=>syncCustomerPhoneAuth(
          customer.id,
          button
        );


      let toggle=
        card.querySelector(
          ".customer-toggle"
        );

      if(toggle){

        toggle
        .insertAdjacentElement(
          "beforebegin",
          button
        );

      }
      else{

        card
        .appendChild(
          button
        );

      }

    }
  );

  icons();

};


/* =========================================================
   PART 13A STYLES
   ========================================================= */

function injectPhoneAuthStyles(){

  if(
    A("nashabehPhoneAuthStyles")
  )return;

  let st=
    document
    .createElement(
      "style"
    );

  st.id=
    "nashabehPhoneAuthStyles";

  st.textContent=`

    .phone-auth-btn{

      width:100%;

      min-height:38px;

      display:flex;

      align-items:center;
      justify-content:center;

      gap:7px;

      margin-top:8px;

      padding:9px 11px;

      border-radius:10px;

      border:
        1px solid
        rgba(49,220,255,.30);

      background:
        linear-gradient(
          145deg,
          rgba(39,216,255,.10),
          rgba(4,24,34,.95)
        );

      color:#43eaff;

      font-size:8px;

      font-weight:900;

      cursor:pointer;

      transition:.2s ease;

    }

    .phone-auth-btn:hover{

      transform:
        translateY(-1px);

      box-shadow:
        0 0 15px
        rgba(55,224,255,.12);

      border-color:#43eaff;

    }

    .phone-auth-btn:disabled{

      cursor:default;

      opacity:.72;

    }

    .phone-auth-btn.phone-ready{

      color:#42ef78;

      border-color:
        rgba(66,239,120,.35);

      background:
        rgba(66,239,120,.06);

    }

    .phone-auth-btn svg{

      width:14px;
      height:14px;

    }

  `;

  document.head
  .appendChild(st);

}


/* =========================================================
   INITIALIZE PART 13A
   ========================================================= */

injectPhoneAuthStyles();

preparePhoneLoginUI();
injectAdminPremiumV5Styles();

injectAdminPremiumV4Styles();

injectAdminPremiumV3Styles();

injectAdminPremiumV2Styles();

injectEnhancedStyles();

boot();
