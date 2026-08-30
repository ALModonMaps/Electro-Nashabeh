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
  let x=imgs.find(i=>/nashabeh|logo/i.test(i.src||""));
  return x?.src||new URL("assets/nashabeh-logo.png",location.href).href;
}

/* =========================================================
   SMART METER DESIGN
   ========================================================= */

function injectEnhancedStyles(){
  if(A("nashabehEnhancedStyles"))return;

  let st=document.createElement("style");
  st.id="nashabehEnhancedStyles";

  st.textContent=`

  .nashabeh-smart-meter{
    position:relative!important;
    width:235px!important;
    min-height:300px!important;
    box-sizing:border-box!important;
    margin:auto!important;
    padding:43px 17px 17px!important;

    background:
      linear-gradient(145deg,
        #f1f6f8 0%,
        #a7b2b8 7%,
        #536169 13%,
        #10191f 19%,
        #081117 100%)!important;

    border:2px solid #8defff!important;
    border-radius:26px!important;

    box-shadow:
      0 0 0 3px rgba(41,225,255,.10),
      0 0 24px rgba(0,213,255,.38),
      0 14px 35px rgba(0,0,0,.55),
      inset 0 0 22px rgba(255,255,255,.12),
      inset 0 -18px 32px rgba(0,0,0,.65)!important;

    overflow:visible!important;

    animation:
      meterFloat 4.5s ease-in-out infinite,
      meterGlow 3s ease-in-out infinite;
  }

  .nashabeh-smart-meter::before,
  .nashabeh-smart-meter::after{
    content:"";
    position:absolute;
    top:112px;
    width:31px;
    height:54px;

    background:
      linear-gradient(145deg,#d7dfe2,#7d898f 45%,#303b41);

    border:2px solid #73838a;
    z-index:-1;

    box-shadow:
      inset 0 0 7px rgba(255,255,255,.28),
      0 5px 12px rgba(0,0,0,.4);
  }

  .nashabeh-smart-meter::before{
    right:-31px;
    border-radius:0 18px 18px 0;
  }

  .nashabeh-smart-meter::after{
    left:-31px;
    border-radius:18px 0 0 18px;
  }

  .nashabeh-meter-title{
    position:absolute;
    top:17px;
    left:14px;
    right:14px;

    color:#f4fbff;
    text-align:center;

    font-family:Arial,sans-serif;
    font-size:8px;
    font-weight:800;

    letter-spacing:.055em;
    opacity:.94;

    text-shadow:0 0 5px rgba(255,255,255,.22);
  }

  .nashabeh-smart-meter .meter-screen{
    position:relative!important;

    display:flex!important;
    align-items:center!important;
    justify-content:center!important;

    width:100%!important;
    min-height:67px!important;

    box-sizing:border-box!important;

    margin:0!important;
    padding:10px 7px 18px!important;

    background:
      linear-gradient(180deg,#020605 0%,#061008 100%)!important;

    border:
      2px solid #153d44!important;

    border-radius:11px!important;

    color:#a8ff61!important;

    font-family:"Courier New",Consolas,monospace!important;
    font-size:27px!important;
    font-weight:900!important;

    letter-spacing:.115em!important;
    line-height:1!important;

    text-align:center!important;

    box-shadow:
      inset 0 0 20px #000,
      inset 0 0 7px rgba(91,255,48,.20),
      0 0 15px rgba(59,255,47,.20)!important;

    text-shadow:
      0 0 4px #7cff52,
      0 0 10px #5bff32!important;

    overflow:hidden!important;

    animation:screenPulse 2.5s ease-in-out infinite;
  }

  .nashabeh-smart-meter .meter-screen::before{
    content:"";
    position:absolute;
    inset:0;

    background:
      linear-gradient(
        180deg,
        transparent 0%,
        transparent 38%,
        rgba(178,255,150,.10) 48%,
        rgba(178,255,150,.18) 50%,
        transparent 58%,
        transparent 100%
      );

    transform:translateY(-125%);

    animation:
      meterScan 2.8s linear infinite;

    pointer-events:none;
  }

  .nashabeh-smart-meter .meter-screen::after{
    content:"kWh"!important;

    position:absolute!important;
    right:9px!important;
    bottom:5px!important;

    margin:0!important;

    font-family:Arial,sans-serif!important;
    font-size:10px!important;
    font-weight:900!important;

    letter-spacing:.03em!important;

    color:#ffffff!important;
    opacity:1!important;

    text-shadow:
      0 0 5px #66ff83,
      0 0 10px rgba(49,255,100,.6)!important;
  }

  .meter-scale{
    direction:ltr;

    display:grid;
    grid-template-columns:repeat(6,1fr);

    padding:6px 5px 2px;

    color:#dbe6e9;

    font-family:Arial,sans-serif;
    font-size:7px;
    font-weight:700;

    text-align:center;
  }

  .meter-scale span:last-child{
    color:#13ddff;
  }

  .meter-face{
    margin-top:7px;

    padding:11px;

    background:
      linear-gradient(150deg,#050a0d,#0b141a);

    border:
      1px solid #26363d;

    border-radius:14px;

    box-shadow:
      inset 0 0 18px rgba(0,0,0,.7);
  }

  .meter-middle{
    display:grid;
    grid-template-columns:86px 1fr;
    gap:13px;

    align-items:center;

    direction:ltr;
  }

  .meter-logo-wrap{
    width:82px;
    height:82px;

    box-sizing:border-box;

    display:flex;
    align-items:center;
    justify-content:center;

    border-radius:50%;

    background:
      radial-gradient(circle,#13100a,#050505 69%);

    border:
      1px solid #e4b400;

    box-shadow:
      0 0 5px #ffc400,
      0 0 18px rgba(255,196,0,.23),
      inset 0 0 13px #000;
  }

  .meter-logo-wrap img{
    display:block;

    max-width:73px;
    max-height:73px;

    object-fit:contain;

    filter:
      drop-shadow(0 0 4px #ffc400)
      drop-shadow(0 0 8px rgba(255,186,0,.35));
  }

  .meter-specs{
    direction:ltr;
    text-align:left;

    color:#f2f8fa;

    font-family:Arial,sans-serif;
    font-weight:800;

    line-height:1.9;
  }

  .meter-specs .volt{
    font-size:12px;
  }

  .meter-specs .amp{
    font-size:12px;
  }

  .meter-specs .energy-name{
    margin-top:3px;

    color:#cddde2;

    font-size:8px;
    letter-spacing:.075em;
  }

  .meter-current-strip{
    position:relative;

    height:52px;

    margin-top:11px;

    overflow:hidden;

    border:
      1px solid #00cfe9;

    border-radius:11px;

    background:
      radial-gradient(circle at 20% 50%,rgba(0,221,255,.08),transparent 45%),
      linear-gradient(180deg,#061218,#03090d);

    box-shadow:
      inset 0 0 13px rgba(0,181,213,.18),
      0 0 8px rgba(0,225,255,.09);
  }

  .meter-current-strip::before{
    content:"";
    position:absolute;

    width:35%;
    height:100%;

    top:0;
    left:-40%;

    background:
      linear-gradient(
        90deg,
        transparent,
        rgba(49,244,255,.11),
        transparent
      );

    animation:
      currentSweep 2.1s linear infinite;
  }

  .meter-current-strip svg{
    position:absolute;

    left:9px;
    top:8px;

    width:74px;
    height:35px;

    overflow:visible;
  }

  .meter-current-line{
    fill:none;

    stroke:#39f5ff;
    stroke-width:2;

    stroke-linecap:round;
    stroke-linejoin:round;

    stroke-dasharray:9 6;

    filter:
      drop-shadow(0 0 3px #25f3ff)
      drop-shadow(0 0 6px rgba(0,231,255,.45));

    animation:
      flowCurrent .55s linear infinite;
  }

  .meter-current-text{
    position:absolute;

    right:31px;
    top:18px;

    color:#edfaff;

    font-family:Arial,sans-serif;
    font-size:9px;
    font-weight:800;

    letter-spacing:.06em;
  }

  .meter-current-led{
    position:absolute;

    right:10px;
    top:21px;

    width:9px;
    height:9px;

    border-radius:50%;

    background:#61ff79;

    box-shadow:
      0 0 5px #61ff79,
      0 0 12px #61ff79;

    animation:
      powerBlink 1s ease-in-out infinite;
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

  @keyframes meterFloat{
    0%,100%{
      transform:translateY(0);
    }

    50%{
      transform:translateY(-5px);
    }
  }

  @keyframes meterGlow{
    0%,100%{
      box-shadow:
        0 0 0 3px rgba(41,225,255,.08),
        0 0 20px rgba(0,213,255,.28),
        0 14px 35px rgba(0,0,0,.55),
        inset 0 0 22px rgba(255,255,255,.12),
        inset 0 -18px 32px rgba(0,0,0,.65);
    }

    50%{
      box-shadow:
        0 0 0 4px rgba(41,225,255,.13),
        0 0 35px rgba(0,213,255,.46),
        0 16px 40px rgba(0,0,0,.6),
        inset 0 0 22px rgba(255,255,255,.14),
        inset 0 -18px 32px rgba(0,0,0,.65);
    }
  }

  @keyframes meterScan{
    0%{
      transform:translateY(-125%);
    }

    100%{
      transform:translateY(125%);
    }
  }

  @keyframes screenPulse{
    0%,100%{
      text-shadow:
        0 0 4px #75ff4f,
        0 0 8px #50ff2d;
    }

    50%{
      text-shadow:
        0 0 6px #8cff62,
        0 0 14px #50ff2d,
        0 0 20px rgba(70,255,45,.35);
    }
  }

  @keyframes flowCurrent{
    from{
      stroke-dashoffset:0;
    }

    to{
      stroke-dashoffset:-30;
    }
  }

  @keyframes powerBlink{
    0%,100%{
      opacity:.55;
      transform:scale(.82);
    }

    50%{
      opacity:1;
      transform:scale(1.15);
    }
  }

  @keyframes currentSweep{
    from{
      left:-40%;
    }

    to{
      left:120%;
    }
  }

  @media(max-width:850px){

    .nashabeh-smart-meter{
      width:205px!important;
      min-height:285px!important;
    }

    .nashabeh-smart-meter .meter-screen{
      font-size:23px!important;
    }

    .meter-middle{
      grid-template-columns:72px 1fr;
    }

    .meter-logo-wrap{
      width:68px;
      height:68px;
    }

    .meter-logo-wrap img{
      max-width:61px;
      max-height:61px;
    }

    .meter-specs .volt,
    .meter-specs .amp{
      font-size:10px;
    }

    .meter-current-text{
      font-size:8px;
    }
  }

  `;

  document.head.appendChild(st);
}

function enhanceMeter(){
  let screen=document.querySelector(".meter-screen");

  if(!screen)return;

  let host=screen.parentElement;

  if(!host)return;

  host.classList.add("nashabeh-smart-meter");

  if(host.querySelector(".nashabeh-meter-title"))return;

  let title=document.createElement("div");
  title.className="nashabeh-meter-title";
  title.textContent="AC SINGLE PHASE TWO WIRE STATIC kWh METER";

  host.insertBefore(title,screen);

  let scale=document.createElement("div");

  scale.className="meter-scale";

  scale.innerHTML=`
    <span>10K</span>
    <span>1K</span>
    <span>100</span>
    <span>10</span>
    <span>1</span>
    <span>0.1</span>
  `;

  screen.insertAdjacentElement("afterend",scale);

  let face=document.createElement("div");
  face.className="meter-face";

  face.innerHTML=`
    <div class="meter-middle">

      <div class="meter-logo-wrap">
        <img
          src="${getNashabehLogoSrc()}"
          alt="نشابة">
      </div>

      <div class="meter-specs">

        <div class="volt">
          230V ~ 50Hz
        </div>

        <div class="amp">
          5A
        </div>

        <div class="energy-name">
          NASHABEH ENERGY
        </div>

      </div>

    </div>

    <div class="meter-current-strip">

      <svg
        viewBox="0 0 80 30"
        aria-hidden="true">

        <polyline
          class="meter-current-line"
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

      <span class="meter-current-text">
        SMART ENERGY METER
      </span>

      <span class="meter-current-led"></span>

    </div>
  `;

  scale.insertAdjacentElement("afterend",face);
}

/* =========================================================
   PRINT
   ========================================================= */

function printHtml(title,body){
  let w=window.open("","_blank","width=900,height=1000");

  if(!w){
    return alert("اسمح بفتح النوافذ المنبثقة للطباعة");
  }

  let logo=getNashabehLogoSrc();

  w.document.write(`
  <!doctype html>

  <html dir="rtl" lang="ar">

  <head>

  <meta charset="utf-8">

  <title>${title}</title>

  <style>

  body{
    font-family:Arial,Tahoma,sans-serif;
    color:#111;
    background:#fff;
    padding:28px;
  }

  .sheet{
    max-width:760px;
    margin:auto;

    border:1px solid #ddd;
    border-radius:16px;

    padding:28px;
  }

  .head{
    display:flex;
    justify-content:space-between;
    align-items:center;

    border-bottom:2px solid #d6a51e;

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
    grid-template-columns:1fr 1fr;
    gap:12px;
  }

  .cell{
    border:1px solid #e5e5e5;
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

    border-top:1px solid #ddd;

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
      تم إصدار هذه الوثيقة إلكترونيًا من نظام إشتراكات نشابة.
    </div>

  </div>

  <script>
  window.onload=()=>setTimeout(()=>window.print(),300)
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

  e.classList.remove("hidden");

  e.style.background=
    ok?"#0d3b20":"#3a1016";

  e.style.color=
    ok?"#8dff9b":"#ff9499";
}

function showFirstAdmin(){
  A("loginPane").classList.add("hidden");
  A("firstAdminPane").classList.remove("hidden");
}

function showLogin(){
  A("firstAdminPane").classList.add("hidden");
  A("loginPane").classList.remove("hidden");
}

async function login(){
  try{

    let {error}=
      await sb.auth.signInWithPassword({

        email:
          A("loginEmail").value.trim(),

        password:
          A("loginPassword").value

      });

    if(error){
      return authMsg(error.message);
    }

    await boot();

  }catch(e){

    authMsg(
      e?.message||
      "تعذر الاتصال بالخدمة. جرّب مجددًا."
    );

  }
}

async function createFirstAdmin(){

  let full_name=
    A("adminName").value.trim();

  let email=
    A("adminEmail").value.trim();

  let phone=
    A("adminPhone").value.trim();

  let password=
    A("adminPassword").value;

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
    await sb.auth.signUp({

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
    return authMsg(error.message);
  }

  if(!data.session){

    return authMsg(
      "تم إنشاء الحساب. أكد البريد إذا طلب Supabase ذلك ثم سجّل الدخول.",
      true
    );

  }

  let r=
    await sb.functions.invoke(
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
    (await sb.auth.getSession())
    .data.session;

  if(!s)return;

  session=s;

  let q=
    await sb
    .from("profiles")
    .select("*,areas(*)")
    .eq("id",s.user.id)
    .single();

  if(q.error){
    return authMsg(q.error.message);
  }

  profile=q.data;

  A("authScreen")
    .classList.add("hidden");

  A("topbar")
    .classList.remove("hidden");

  A("appRoot")
    .classList.remove("hidden");

  A("loggedUser").textContent=
    profile.full_name+
    " · "+
    (
      profile.role==="admin"
      ?"مدير"
      :"مشترك"
    );

  if(profile.role==="admin"){

    A("adminApp")
      .classList.remove("hidden");

    A("customerApp")
      .classList.add("hidden");

    renderAdmin("dashboard");

  }else{

    A("customerApp")
      .classList.remove("hidden");

    A("adminApp")
      .classList.add("hidden");

    loadCustomer();

  }

  icons();
}

/* =========================================================
   CUSTOMER
   ========================================================= */

function stateAr(s){

  return ({
    stable:"الشبكة مستقرة",
    monitoring:"قيد المتابعة",
    high_load:"ضغط مرتفع",
    outage:"انقطاع عام"
  })[s]||"غير محدد";

}

function stateClass(s){

  return s==="stable"
    ?"stable"
    :s==="high_load"||
     s==="outage"
      ?"danger"
      :"warning";

}

async function loadCustomer(){

  let uid=session.user.id;

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
      .eq("customer_id",uid)
      .eq("active",true)
      .maybeSingle(),

    /* أحدث فاتورة فعلية */
    sb.from("invoices")
      .select("*")
      .eq("customer_id",uid)
      .order("created_at",{ascending:false})
      .limit(1)
      .maybeSingle(),

    sb.from("payments")
      .select(
        "*,invoices(billing_month,amount,status)"
      )
      .eq("customer_id",uid)
      .order("paid_at",{ascending:false}),

    sb.from("fault_reports")
      .select("*")
      .eq("customer_id",uid)
      .order("created_at",{ascending:false}),

    sb.from("notifications")
      .select("*")
      .order("created_at",{ascending:false})

  ]);

  customer={

    profile,

    area:profile.areas,

    meter:m.data,

    invoice:i.data,

    payments:p.data||[],

    faults:f.data||[],

    notifications:
      (n.data||[])
      .filter(
        x=>
          !x.area_id||
          x.area_id===profile.area_id||
          x.customer_id===uid
      ),

    readings:[]

  };

  if(customer.meter){

    customer.readings=
      (
        await sb
        .from("meter_readings")
        .select("*")
        .eq(
          "meter_id",
          customer.meter.id
        )
        .order(
          "reading_date",
          {ascending:false}
        )
      ).data||[];

  }

  renderCustomer();
}

function renderCustomer(){

  injectEnhancedStyles();

  let c=customer.profile;

  let a=customer.area;

  let m=customer.meter;

  let inv=customer.invoice;

  let r=customer.readings[0];

  A("customerName").textContent=
    c.full_name;

  A("customerArea").textContent=
    a?.name||
    "غير محددة";

  A("customerMeter").textContent=
    m?.meter_number||
    "غير مربوط";

  let screen=
    document.querySelector(
      ".meter-screen"
    );

  if(screen){

    screen.textContent=
      String(
        r?.reading_value??0
      )
      .padStart(
        7,
        "0"
      );

  }

  enhanceMeter();

  let st=A("customerStatus");

  st.className=
    "status "+
    (
      c.active
      ?"active"
      :"inactive"
    );

  st.innerHTML=
    c.active
    ?'<i data-lucide="circle-check-big"></i> اشتراك فعّال'
    :'<i data-lucide="circle-x"></i> اشتراك غير فعّال';

  A("networkCard").className=
    "panel network-card "+
    stateClass(
      a?.network_status
    );

  A("networkStateText").textContent=
    stateAr(
      a?.network_status
    );

  A("networkMessage").textContent=
    a?.status_message||
    (
      "حالة شبكة "+
      (a?.name||"")
    );

  A("currentBill").textContent=
    inv
    ?money(inv.amount)
    :"$ 0.00";

  let bp=
    document.querySelector(
      ".bill-card p"
    );

  if(bp){

    bp.innerHTML=
      '<i data-lucide="calendar-days"></i> '+
      (
        inv?.due_date||
        "لا توجد فاتورة"
      );

  }

  A("notifCount").textContent=
    customer.notifications.length;

  icons();
}

/* =========================================================
   CUSTOMER TABS
   ========================================================= */

function setBottom(btn){

  if(!btn)return;

  document
  .querySelectorAll(
    ".customer-bottom-nav button"
  )
  .forEach(
    x=>
      x.classList.remove("active")
  );

  btn.classList.add("active");
}

function showCustomerHome(btn){

  A("customerContent")
    .innerHTML="";

  setBottom(btn);

}

async function showCustomerTab(type,btn){

  setBottom(btn);

  let p=A("customerContent");

  let c=customer.profile;

  let inv=customer.invoice;

  let m=customer.meter;

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
              Number(inv.current_reading)-
              Number(inv.previous_reading)
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
        customer.payments.length
        ?customer.payments.map(
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
        ).join("")
        :"<p>لا توجد دفعات.</p>"
      );

  }

  if(type==="readings"){

    p.innerHTML=
      "<h3>قراءات العداد</h3>"+
      (
        customer.readings.length
        ?customer.readings.map(
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
        ).join("")
        :"<p>لا توجد قراءات.</p>"
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
        customer.notifications.length
        ?customer.notifications.map(
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
        ).join("")
        :"<p>لا توجد تنبيهات.</p>"
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
          .from("fault-images")
          .createSignedUrl(
            f.image_path,
            600
          );

        if(u.data?.signedUrl){

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

  if(!customer.invoice)return;

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
   FAULT REPORT CUSTOMER
   ========================================================= */

function openFaultDialog(){

  A("faultDialog")
    .showModal();

  icons();

}

async function submitFault(){

  let type=
    A("faultType").value;

  let description=
    A("faultDescription").value;

  let file=
    document.querySelector(
      '#faultDialog input[type="file"]'
    ).files[0];

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
      .from("fault-images")
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
    .from("fault_reports")
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
   ADMIN
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

async function renderAdmin(page="dashboard"){

  currentPage=page;

  document
  .querySelectorAll(".side")
  .forEach(
    b=>
      b.classList.toggle(
        "active",
        b.dataset.page===page
      )
  );

  let c=A("adminContent");

  if(page==="dashboard"){

    let [
      pr,
      ar,
      me,
      fa,
      iv,
      pay
    ]=
    await Promise.all([

      sb.from("profiles")
        .select("id,active,role"),

      sb.from("areas")
        .select("*"),

      sb.from("meters")
        .select(
          "id",
          {count:"exact"}
        ),

      sb.from("fault_reports")
        .select("id,status"),

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

    for(let x of(pay.data||[])){

      paidMap[x.invoice_id]=
        (
          paidMap[x.invoice_id]||
          0
        )+
        Number(x.amount);

    }

    let unpaid=
      (iv.data||[])
      .reduce(
        (s,x)=>
          s+
          Math.max(
            0,
            Number(x.amount)-
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
      )+

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
                ).length
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
                ).length
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
              ${(ar.data||[]).length}
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
        {ascending:false}
      )
    ).data||[];

  c.innerHTML=

  header(
    "المشتركون",
    "إنشاء حساب مشترك وربطه بالعداد والعلبة والقراءة الافتتاحية."
  )+

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

              <option value="${a.id}">
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
                  ${p.areas?.name||"-"}
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
    await sb.functions.invoke(
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

  c.innerHTML=

  header(
    "العلب والمناطق",
    "الحالة تظهر فورًا عند المشترك."
  )+

  `

  <article class="panel admin-card">

    <div class="boxes-grid">

      ${
        ar.map(
          a=>`

          <div class="area-card area-editor">

            <h4>
              ${a.name}
            </h4>

            <select id="as_${a.id}">

              <option
                value="stable"
                ${a.network_status==="stable"?"selected":""}>

                مستقرة

              </option>

              <option
                value="monitoring"
                ${a.network_status==="monitoring"?"selected":""}>

                متابعة

              </option>

              <option
                value="high_load"
                ${a.network_status==="high_load"?"selected":""}>

                ضغط مرتفع

              </option>

              <option
                value="outage"
                ${a.network_status==="outage"?"selected":""}>

                انقطاع عام

              </option>

            </select>

            <textarea
              id="am_${a.id}"
              rows="2">${a.status_message||""}</textarea>

            <button
              class="row-btn"
              onclick="saveArea('${a.id}')">

              حفظ

            </button>

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
        A("as_"+id).value,

      status_message:
        A("am_"+id).value

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
   METERS
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
        {ascending:false}
      )
    ).data||[];

  c.innerHTML=

  header(
    "العدادات",
    "رقم العداد والقراءة تدخل يدويًا."
  )+

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
                      )-
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
        A("mn_"+id).value

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
        {ascending:false}
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
              )-
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
  )+

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

  let sel=A("ivMeter");

  if(
    !sel||
    !sel.options.length
  )return;

  let o=
    sel.options[
      sel.selectedIndex
    ];

  A("ivPrev").value=
    o.dataset.last||
    "0";

  A("ivCur").value="";

  A("ivConsumption").value=
    "0";

  A("ivAmount").value=
    "$0.00";

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

  A("ivConsumption").value=
    cons;

  A("ivAmount").value=
    money(
      cons*price
    );

}

async function createInvoice(){

  let sel=A("ivMeter");

  let o=
    sel.options[
      sel.selectedIndex
    ];

  let previous=
    Number(
      A("ivPrev").value
    );

  let currentRaw=
    A("ivCur")
    .value
    .trim();

  let price=
    Number(
      A("ivPrice").value
    );

  let month=
    A("ivMonth").value;

  let due=
    A("ivDue").value;

  if(!month){

    return alert(
      "اختر شهر الفاتورة"
    );

  }

  if(currentRaw===""){

    return alert(
      "أدخل القراءة الحالية"
    );

  }

  let current=
    Number(currentRaw);

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
    .from("invoices")
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

      consumption:
        consumption,

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
    .from("meter_readings")
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

  let [
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
        {ascending:false}
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
        {ascending:false}
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

  for(let x of pays){

    paidBy[x.invoice_id]=
      (
        paidBy[x.invoice_id]||
        0
      )+
      Number(x.amount);

  }

  let opts=
    invs.map(
      i=>{

        let rem=
          Math.max(
            0,
            Number(i.amount)-
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
  )+

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

  let s=A("payInvoice");

  if(
    !s||
    !s.options.length
  )return;

  A("payAmount").value=
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

  let s=A("payInvoice");

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
      A("payAmount").value
    );

  let remaining=
    Number(
      o.dataset.remaining
    );

  let method=
    A("payMethod").value;

  let reference=
    A("payReference")
    .value
    .trim();

  let note=
    A("payNote")
    .value
    .trim();

  if(
    !Number.isFinite(amount)||
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
        {ascending:false}
      )
    ).data||[];

  window._faults=
    fs;

  c.innerHTML=

  header(
    "الأعطال",
    "بلاغات حقيقية مع الصور والحالة."
  )+

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
                    f.areas?.name||
                    "-"
                  }
                </td>

                <td>
                  ${f.fault_type}
                </td>

                <td>

                  <span class="badge ${f.status}">
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
    window._faults.find(
      x=>x.id===id
    );

  let img="";

  if(f.image_path){

    let u=
      await sb.storage
      .from("fault-images")
      .createSignedUrl(
        f.image_path,
        600
      );

    if(u.data?.signedUrl){

      img=`
      <img
        class="fault-thumb-large"
        src="${u.data.signedUrl}">
      `;

    }

  }

  let old=
    A("faultAdminDialog");

  if(old){
    old.remove();
  }

  let d=
    document.createElement(
      "dialog"
    );

  d.id=
    "faultAdminDialog";

  d.innerHTML=`

  <form method="dialog">

    <div class="dialog-title">

      <div>
        <i data-lucide="wrench"></i>
      </div>

      <div>

        <small>
          بلاغ #${f.id}
        </small>

        <h3>
          ${f.fault_type}
        </h3>

      </div>

    </div>

    <p>
      ${f.description||""}
    </p>

    ${img}

    <label>

      الحالة

      <select id="faStatus">

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

          جاري الإصلاح

        </option>

        <option
          value="resolved"
          ${f.status==="resolved"?"selected":""}>

          تم الحل

        </option>

      </select>

    </label>

    <label>

      ملاحظة للمشترك

      <textarea
        id="faNote"
        rows="3">${f.admin_note||""}</textarea>

    </label>

    <div class="dialog-actions">

      <button
        value="cancel"
        class="cancel">

        إغلاق

      </button>

      <button
        type="button"
        class="send"
        onclick="saveFaultAdmin(${f.id})">

        حفظ

      </button>

    </div>

  </form>

  `;

  document.body.appendChild(d);

  d.showModal();

  icons();

}

async function saveFaultAdmin(id){

  let r=
    await sb
    .from("fault_reports")
    .update({

      status:
        A("faStatus").value,

      admin_note:
        A("faNote").value,

      updated_at:
        new Date()
        .toISOString()

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

  A("faultAdminDialog")
    .close();

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
        {ascending:false}
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
  )+

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
              n.areas?.name||
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

  A("notifArea").innerHTML=

    '<option value="">الكل</option>'+

    window._areas.map(
      a=>`

      <option value="${a.id}">
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
        A("notifArea").value||
        null,

      title:
        A("notifTitle").value,

      message:
        A("notifMessage").value,

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
      .from("app_settings")
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
  )+

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

        <p style="color:#8fa7b8;font-size:10px">

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
      A("setKwhPrice").value
    );

  if(
    !Number.isFinite(price)||
    price<0
  ){

    return alert(
      "أدخل سعرًا صحيحًا"
    );

  }

  let r=
    await sb
    .from("app_settings")
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
   NAV
   ========================================================= */

document
.querySelectorAll(".side")
.forEach(
  b=>
    b.onclick=()=>{

      renderAdmin(
        b.dataset.page
      );

      A("sidebar")
      .classList
      .remove("open");

    }
);

A("mobileMenuBtn").onclick=
  ()=>
    A("sidebar")
    .classList
    .toggle("open");

injectEnhancedStyles();

boot();
