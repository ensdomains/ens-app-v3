"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const we=require("react"),l=require("styled-components"),br=require("react-dom"),ot=require("react-transition-state"),$l=e=>e&&typeof e=="object"&&"default"in e?e:{default:e};function hr(e){if(e&&e.__esModule)return e;const r=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const o in e)if(o!=="default"){const a=Object.getOwnPropertyDescriptor(e,o);Object.defineProperty(r,o,a.get?a:{enumerable:!0,get:()=>e[o]})}}return r.default=e,Object.freeze(r)}const t=hr(we),s=$l(l),wl=hr(br),vl=s.default.div(({theme:e,$shape:r,$noBorder:o})=>l.css`
    ${()=>{switch(r){case"circle":return l.css`
            border-radius: ${e.radii.full};
            &:after {
              border-radius: ${e.radii.full};
            }
          `;case"square":return l.css`
          border-radius: ${e.radii["2xLarge"]}
          &:after {
            border-radius: ${e.radii["2xLarge"]}
          }
        `;default:return l.css``}}}

    ${!o&&l.css`
      &::after {
        box-shadow: ${e.shadows["-px"]} ${e.colors.backgroundSecondary};
        content: '';
        inset: 0;
        position: absolute;
      }
    `}

    background-color: ${e.colors.backgroundSecondary};

    width: 100%;
    padding-bottom: 100%;

    > * {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    overflow: hidden;
    position: relative;
  `),yl=s.default.div(({theme:e,$url:r,$disabled:o})=>l.css`
    background: ${r||e.colors.gradients.blue};

    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    ${o&&l.css`
      filter: grayscale(1);
    `}
  `),El=s.default.img(({$shown:e,$disabled:r})=>l.css`
    height: 100%;
    width: 100%;
    object-fit: cover;
    display: none;

    ${e&&l.css`
      display: block;
    `}

    ${r&&l.css`
      filter: grayscale(1);
    `}
  `),je=({label:e,noBorder:r=!1,shape:o="circle",src:a,placeholder:i,decoding:n="async",disabled:c=!1,overlay:u,...d})=>{const p=t.useRef(null),[h,f]=t.useState(!!a),g=t.useCallback(()=>{f(!0)},[f]),$=t.useCallback(()=>{f(!1)},[f]);t.useEffect(()=>{const b=p.current;return b&&(b.addEventListener("load",g),b.addEventListener("loadstart",$),b.addEventListener("error",$)),()=>{b&&(b.removeEventListener("load",g),b.removeEventListener("loadstart",$),b.removeEventListener("error",$))}},[p,$,g]);const x=h&&!!a;return t.createElement(vl,{$noBorder:!h||r,$shape:o},u,!x&&t.createElement(yl,{$disabled:c,$url:i,"aria-label":e}),t.createElement(El,{...d,$disabled:c,$shown:x,alt:e,decoding:n,ref:p,src:a,onError:()=>f(!1),onLoad:()=>f(!0)}))};je.displayName="Avatar";const lt=s.default.div(({theme:e,$state:r,$empty:o})=>l.css`
    width: 100vw;
    height: 100vh;
    position: fixed;
    overflow: hidden;
    z-index: 999;
    top: 0;
    left: 0;
    transition: ${e.transitionDuration[300]} all
      ${e.transitionTimingFunction.popIn};

    ${!o&&r==="entered"?l.css`
          background-color: rgba(0, 0, 0, ${e.opacity.overlayFallback});

          @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
            backdrop-filter: blur(16px);
            background-color: rgba(0, 0, 0, ${e.opacity.overlay});
          }
        `:l.css`
          background-color: rgba(0, 0, 0, 0);
          @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
            backdrop-filter: blur(0px);
          }
        `}
  `),$r={none:"none",solid:"solid"},wr={0:"0px",px:"1px","0.375":"0.09375rem","0.5":"0.125rem","0.75":"0.1875rem",1:"0.25rem","1.25":"0.3125rem","1.5":"0.375rem","1.75":"0.4375rem",2:"0.5rem"},vr={none:"0",extraSmall:"2px",small:"4px",medium:"6px",large:"8px",almostExtraLarge:"10px",extraLarge:"12px","2xLarge":"16px","2.5xLarge":"20px","3xLarge":"24px","4xLarge":"40px",full:"9999px",input:"0.5rem",card:"1rem",checkbox:"0.25rem"},K={none:"none","-px":"inset 0 0 0 1px",0:"0 0 0 0","0.02":"0 2px 8px","0.25":"0 2px 12px","0.5":"0 0 0 0.125rem",1:"0 0 0 0.25rem",2:"0 0 0 0.5rem"},xl=[50,100,300,400,500,750],Cl={Surface:50,Light:100,Bright:300,Primary:400,Dim:500,Active:750},At={blue:[216,100,61,{50:[215,100,97]}],indigo:[242,61,58],purple:[280,62,55],pink:[331,67,51,{100:[331,64,88]}],red:[7,76,44,{50:[0,60,94],100:[360,60,85]}],orange:[35,91,50,{100:[36,89,86]}],yellow:[47,86,49,{50:[48,100,90],100:[48,100,85]}],green:[162,72,40,{50:[157,37,93],100:[157,37,85]}],teal:[199,66,49],grey:[240,6,63,{50:[0,0,96],100:[0,0,91],500:[0,0,35],750:[0,0,15]}]},Qe={light:"0 0% 100%",dark:"0 0% 8%"},kl={background:{hue:"grey",items:{primary:Qe,secondary:"Surface"}},text:{hue:"grey",items:{primary:"Active",secondary:"Dim",tertiary:"Primary",accent:{light:Qe.light,dark:Qe.light}}},border:{hue:"grey",items:{primary:"Light"}}},jt={blue:"linear-gradient(330.4deg, #44BCF0 4.54%, #7298F8 59.2%, #A099FF 148.85%)",green:"linear-gradient(90deg, rgba(68,240,127,1) 4.54%, rgba(114,248,176,1) 59.2%, rgba(153,202,255,1) 148.85%)",red:"linear-gradient(90deg, rgba(240,68,87,1) 4.54%, rgba(248,114,149,1) 59.2%, rgba(212,153,255,1) 148.85%)",purple:"linear-gradient(323.31deg, #DE82FF -15.56%, #7F6AFF 108.43%)",grey:"linear-gradient(330.4deg, #DFDFDF 4.54%, #959595 59.2%, #474747 148.85%)"},Ft=(e,r,o)=>{e==="dark"&&(o=Object.fromEntries(Object.entries(o).map(([i],n,c)=>[i,c[c.length-n-1][1]])));const a=Object.fromEntries(Object.entries(Cl).map(([i,n])=>[`${r}${i}`,o[n]]));return{...a,[r]:a[`${r}Primary`]}},Dt=e=>`${e[0]} ${e[1]}% ${e[2]}%`,Sl=(e,r,o)=>{const a=Object.fromEntries(xl.map(i=>{var c;if((c=o[3])!=null&&c[i])return[i,Dt(o[3][i])];const n=o.slice(0,3);return n[2]=n[2]+(400-i)/10,[i,Dt(n)]}));return{normal:Ft(e,r,Object.fromEntries(Object.entries(a).map(([i,n])=>[i,`hsl(${n})`]))),raw:Ft(e,r,a)}},Rl=(e,r)=>({...jt,accent:jt[e]||r[e]}),zt=(e,r)=>{const o=Object.entries({...At,accent:At[e]}).reduce((i,n)=>{const[c,u]=n,d=Sl(r,c,u);return{...i,...d.normal,raw:{...i.raw,...d.raw}}},{}),a=Object.entries(kl).reduce((i,n)=>{const[c,u]=n;for(const[d,p]of Object.entries(u.items)){const h=`${c}${d.replace(/^[a-z]/,g=>g.toUpperCase())}`,f=typeof p=="string"?o.raw[`${u.hue}${p}`]:p[r];if(i[h]=`hsl(${f})`,i.raw[h]=f,d==="primary"){const g=c;i[g]=`hsl(${f})`,i.raw[g]=f}}return i},o);return{...a,gradients:Rl(e,a)}},Pl=e=>({light:zt(e,"light"),dark:zt(e,"dark")}),M=Pl("blue"),yr={overlay:"0.1",overlayFallback:"0.5"},Er={0:"0",px:"1px","0.25":"0.0625rem","0.5":"0.125rem","0.75":"0.1875rem",1:"0.25rem","1.25":"0.3125rem","1.5":"0.375rem","1.75":"0.4375rem",2:"0.5rem","2.5":"0.625rem",3:"0.75rem","3.5":"0.875rem",4:"1rem","4.5":"1.125rem",5:"1.25rem","5.5":"1.375rem",6:"1.5rem",7:"1.75rem","7.5":"1.875rem",8:"2rem","8.5":"2.125rem",9:"2.25rem",10:"2.5rem",11:"2.75rem",12:"3rem",13:"3.25rem",14:"3.5rem",15:"3.75rem",16:"4rem",18:"4.5rem",20:"5rem","22.5":"5.625rem",24:"6rem",26:"6.5rem",28:"7rem",30:"7.5rem",32:"8rem",36:"9rem",40:"10rem",44:"11rem",45:"11.25rem",48:"12rem",52:"13rem",56:"14rem",60:"15rem",64:"16rem",72:"18rem",80:"20rem",96:"24rem",112:"28rem",128:"32rem",144:"36rem",168:"42rem",192:"48rem",224:"56rem",256:"64rem",288:"72rem",320:"80rem","1/4":"25%","1/3":"33.333333%","1/2":"50%","2/3":"66.666667%","3/4":"75%",auto:"auto",full:"100%",fit:"fit-content",max:"max-content",min:"min-content",viewHeight:"100vh",viewWidth:"100vw",none:"0"},xr={mono:'"iAWriter Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',sans:'"Satoshi", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'},fe={headingOne:"2.25rem",headingTwo:"1.875rem",headingThree:"1.625rem",headingFour:"1.375rem",extraLarge:"1.25rem",large:"1.125rem",body:"1rem",small:"0.875rem",extraSmall:"0.75rem"},ve={light:"300",normal:"500",bold:"700",extraBold:"830"},Cr={"-0.02":"-0.02em","-0.015":"-0.015em","-0.01":"-0.01em",normal:"0","0.03":"0.03em"},ye={headingOne:"3rem",headingTwo:"2.5rem",headingThree:"2.125rem",headingFour:"1.875rem",extraLarge:"1.625rem",large:"1.5rem",body:"1.25rem",small:"1.25rem",extraSmall:"1rem"},kr={75:"75ms",100:"100ms",150:"150ms",200:"200ms",300:"300ms",500:"500ms",700:"700ms",1e3:"1000ms"},Sr={linear:"linear",in:"cubic-bezier(0.4, 0, 1, 1)",out:"cubic-bezier(0, 0, 0.2, 1)",inOut:"cubic-bezier(0.42, 0, 0.58, 1)",popIn:"cubic-bezier(0.15, 1.15, 0.6, 1)"},Fe={xs:360,sm:640,md:768,lg:1024,xl:1280},Ll={light:{0:`${K[0]} ${M.light.backgroundSecondary}`,"0.02":`${K["0.02"]} ${M.light.backgroundSecondary}`,"0.25":`${K["0.25"]} ${M.light.backgroundSecondary}`,"0.5":`${K["0.5"]} ${M.light.backgroundSecondary}`,1:`${K[1]} ${M.light.backgroundSecondary}`},dark:{0:`${K[0]} ${M.dark.backgroundSecondary}`,"0.02":`${K["0.02"]} ${M.dark.backgroundSecondary}`,"0.25":`${K["0.25"]} ${M.dark.backgroundSecondary}`,"0.5":`${K["0.5"]} ${M.dark.backgroundSecondary}`,1:`${K[1]} ${M.dark.backgroundSecondary}`}},Se={borderStyles:$r,borderWidths:wr,colors:M,fonts:xr,fontSizes:fe,fontWeights:ve,letterSpacings:Cr,lineHeights:ye,opacity:yr,radii:vr,shadows:K,space:Er,breakpoints:Fe,transitionDuration:kr,transitionTimingFunction:Sr,boxShadows:Ll},at={borderStyles:$r,borderWidths:wr,fonts:xr,fontSizes:fe,fontWeights:ve,letterSpacings:Cr,lineHeights:ye,opacity:yr,radii:vr,shadows:K,space:Er,breakpoints:Fe,transitionDuration:kr,transitionTimingFunction:Sr},Vl={...at,colors:Se.colors.light,boxShadows:Se.boxShadows.light,mode:"light"},Zl={...at,colors:Se.colors.dark,boxShadows:Se.boxShadows.dark,mode:"dark"},Rr={min:"min-width",max:"max-width"},Ml=Object.keys(Fe),Gl=Object.keys(Rr),U=Ml.reduce((e,r)=>(e[r]=Gl.reduce((o,a)=>(o[a]=i=>l.css`
        @media (${Rr[a]}: ${Fe[r]}px) {
          ${i};
        }
      `,o),{}),e),{}),Tl=Object.keys(fe),Bl={headingOne:{weight:"extraBold"},headingTwo:{weight:"bold"},headingThree:{weight:"bold"},headingFour:{weight:"bold"}},Ol=["extraLarge","large","body","small","extraSmall"],Hl={label:{size:fe.extraSmall,lineHeight:ye.extraSmall,weight:ve.normal},labelHeading:{size:fe.small,lineHeight:ye.small,weight:ve.normal}},Al=()=>Object.fromEntries(Tl.map(e=>{var o;const r=((o=Bl[e])==null?void 0:o.weight)||"normal";return[e,{size:fe[e],lineHeight:ye[e],weight:ve[r]}]})),jl=()=>Object.fromEntries(Ol.map(e=>[`${e}Bold`,{size:fe[e],lineHeight:ye[e],weight:ve.bold}])),Fl=()=>({...Hl,...Al(),...jl()}),nt=Fl(),Re=e=>{var r;return(r=nt[e])==null?void 0:r.size},Pe=e=>{var r;return(r=nt[e])==null?void 0:r.lineHeight},tt=e=>{var r;return(r=nt[e])==null?void 0:r.weight},Dl=e=>{const r=Object.keys(M[e].gradients),o=Object.fromEntries(r.map(n=>[`${n}Gradient`,M[e].gradients[n]])),a=Object.keys(M[e]).filter(([n])=>n!=="gradients"&&n!=="raw"),i=Object.fromEntries(a.map(n=>[n,M[e][n]]));return{...o,...i,tranparent:"transparent",initial:"initial",inherit:"inherit"}},zl=Dl("light"),Nt=["accent","blue","indigo","purple","pink","red","orange","yellow","green","teal","grey"],Nl=e=>{const r=Object.fromEntries(Nt.map(d=>[`${d}Primary`,{text:M[e].backgroundPrimary,background:M[e][`${d}Primary`],border:"transparent",hover:M[e][`${d}Bright`]}])),o=Object.fromEntries(Nt.map(d=>[`${d}Secondary`,{text:M[e][`${d}Primary`],background:M[e][`${d}Surface`],border:"transparent",hover:M[e][`${d}Light`]}])),a=Object.keys(M[e].gradients),i=Object.fromEntries(a.map(d=>[`${d}Gradient`,{text:M[e].backgroundPrimary,background:M[e].gradients[d],border:"transparent",hover:M[e].gradients[d]}])),n={text:"initial",background:"transparent",border:"transparent",hover:M[e].greyLight},c={text:M[e].greyPrimary,background:M[e].greyLight,border:M[e].greyLight,hover:M[e].greyLight},u={text:M[e].textPrimary,background:M[e].backgroundPrimary,border:M[e].border,hover:M[e].backgroundSecondary};return{...r,...o,...i,transparent:n,disabled:c,background:u}},Wl=Nl("light"),Pr=e=>zl[e],F=(e,r)=>{var o;return(o=Wl[e])==null?void 0:o[r]},_l=s.default.div(({theme:e,$ellipsis:r,$fontVariant:o="body",$color:a,$font:i,$weight:n})=>l.css`
    font-family: ${e.fonts.sans};
    line-height: ${e.lineHeights.body};
    color: ${Pr(a)};

    ${r&&l.css`
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    `}

    ${o&&l.css`
      font-size: ${Re(o)};
      font-weight: ${tt(o)};
      line-height: ${Pe(o)};
    `}

    ${i==="mono"&&l.css`
      font-family: ${e.fonts.mono};
    `}

    ${n&&l.css`
      font-weight: ${e.fontWeights[n]};
    `};
  `),A=t.forwardRef(({asProp:e,children:r,ellipsis:o,className:a,fontVariant:i="body",font:n="sans",color:c="text",weight:u,...d},p)=>t.createElement(_l,{...d,$color:c,$ellipsis:o?!0:void 0,$font:n,$fontVariant:i,$weight:u,as:e,className:a,ref:p},r));A.displayName="Typography";const Il=s.default.div(({theme:e,$alert:r,$hasAction:o})=>l.css`
    position: relative;
    background: ${e.colors.backgroundPrimary};
    border: 1px solid ${e.colors.border};
    border-radius: ${e.radii["2xLarge"]};
    padding: ${e.space[4]};
    display: flex;
    align-items: stretch;
    gap: ${e.space[4]};
    width: ${e.space.full};
    transition: all 150ms ease-in-out;

    ${U.md.min(l.css`
        padding: ${e.space[6]};
        gap: ${e.space[6]};
        align-items: center;
      `)}

    ${o&&l.css`
      padding-right: ${e.space[8]};
      &:hover {
        transform: translateY(-1px);
        background: ${e.colors.greySurface};
        ${r==="error"&&l.css`
          background: ${e.colors.redLight};
        `}
        ${r==="warning"&&l.css`
          background: ${e.colors.yellowLight};
        `}
      }
    `}

    ${r==="error"&&l.css`
      background: ${e.colors.redSurface};
      border: 1px solid ${e.colors.redPrimary};
    `}

    ${r==="warning"&&l.css`
      background: ${e.colors.yellowSurface};
      border: 1px solid ${e.colors.yellowPrimary};
    `};
  `),Ul=s.default.div(({theme:e})=>l.css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: ${e.space[1]};
  `),Yl=s.default.div(({theme:e,$alert:r,$type:o})=>l.css`
    width: ${e.space[8]};
    height: ${e.space[8]};
    flex: 0 0 ${e.space[8]};

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    ${U.md.min(l.css`
      width: ${e.space[10]};
      height: ${e.space[10]};
      flex: 0 0 ${e.space[10]};
    `)}

    ${o==="filledCircle"&&l.css`
      color: ${e.colors.backgroundPrimary};
      border-radius: ${e.radii.full};

      svg {
        transform: scale(0.5);
      }

      ${r==="info"&&l.css`
        background: ${e.colors.text};
      `}
    `}

    ${r==="error"&&l.css`
      background: ${e.colors.redPrimary};
    `}

    ${r==="warning"&&l.css`
      background: ${e.colors.yellowPrimary};
    `}
  `),Wt=s.default.button(({theme:e})=>l.css`
    position: absolute;
    top: 0;
    right: 0;
    padding: ${e.space[2]};
  `),_t=s.default.div(({theme:e,$alert:r,$hasAction:o})=>l.css`
    width: ${e.space[5]};
    height: ${e.space[5]};
    border-radius: ${e.radii.full};
    background: ${e.colors.accentSurface};
    color: ${e.colors.accentPrimary};
    transition: all 150ms ease-in-out;

    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      display: block;
      width: ${e.space[3]};
      height: ${e.space[3]};
    }

    ${r==="error"&&l.css`
      background: ${e.colors.backgroundPrimary};
      color: ${e.colors.redPrimary};
    `}

    ${r==="warning"&&l.css`
      background: ${e.colors.backgroundPrimary};
      color: ${e.colors.yellowPrimary};
    `}

    ${o&&l.css`
      cursor: pointer;
      &:hover {
        transform: translateY(-1px);
        background: ${e.colors.accentLight};
        color: ${e.colors.accentDim};
        ${r==="error"&&l.css`
          background: ${e.colors.redLight};
          color: ${e.colors.redDim};
        `}
        ${r==="warning"&&l.css`
          background: ${e.colors.yellowLight};
          color: ${e.colors.yellowDim};
        `}
      }
    `}
  `),ql=({alert:e="info",icon:r,hasHref:o,onDismiss:a})=>a?t.createElement(Wt,{onClick:()=>a()},t.createElement(_t,{$alert:e,$hasAction:!0},r||t.createElement(Ee,null))):o||r?t.createElement(Wt,{as:"div"},t.createElement(_t,{$alert:e},r||t.createElement($t,null))):null,Xl=(e,r)=>e!=="info"?"filledCircle":r?"normal":"none",it=({title:e,alert:r="info",icon:o,iconType:a,as:i,children:n,onDismiss:c,...u})=>{const d=o||(r&&["error","warning"].includes(r)?t.createElement(Ve,null):t.createElement(Ye,null)),p=!!u.href,h=p||!!u.onClick,f=a||Xl(r,o);return t.createElement(Il,{...u,$alert:r,$hasAction:h,as:i},f!=="none"&&t.createElement(Yl,{$alert:r,$type:f},d),t.createElement(Ul,null,e&&t.createElement(A,{fontVariant:"largeBold"},e),t.createElement(A,null,n)),t.createElement(ql,{alert:r,hasHref:p,icon:u.actionIcon,onDismiss:c}))};it.displayName="Banner";const ge=s.default.div(()=>l.css`
    border-width: 0;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  `),Kl=l.keyframes`
  100% {
    transform: rotate(1turn);
  }
`,Ql=s.default.div(({theme:e,$color:r,$size:o})=>l.css`
    animation: ${Kl} 1.1s linear infinite;

    color: ${e.colors[r]};
    stroke: ${e.colors[r]};

    ${()=>{switch(o){case"small":return l.css`
            height: ${e.space[4]};
            width: ${e.space[4]};
            stroke-width: ${e.space[1]};
          `;case"medium":return l.css`
            height: ${e.space[6]};
            stroke-width: ${e.space["1.25"]};
            width: ${e.space[6]};
          `;case"large":return l.css`
            height: ${e.space[16]};
            stroke-width: ${e.space[1]};
            width: ${e.space[16]};
          `;default:return""}}}
  `),pe=t.forwardRef(({accessibilityLabel:e,size:r="small",color:o="text",...a},i)=>t.createElement(Ql,{$color:o,$size:r,ref:i,...a},e&&t.createElement(ge,null,e),t.createElement("svg",{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},t.createElement("circle",{cx:"12",cy:"12",fill:"none",r:"9",strokeDasharray:"42",strokeLinecap:"round"}),t.createElement("circle",{cx:"12",cy:"12",fill:"none",opacity:"0.25",r:"9",strokeLinecap:"round"}))));pe.displayName="Spinner";const Jl=s.default.button(({theme:e,$pressed:r,$shadow:o,$size:a,$colorStyle:i="accentPrimary",$shape:n,$hasCounter:c,$width:u})=>l.css`
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${e.space[2]};

    transition-property: all;
    transition-duration: ${e.transitionDuration[150]};
    transition-timing-function: ${e.transitionTimingFunction.inOut};
    width: 100%;
    border-radius: ${e.radii.large};
    font-weight: ${e.fontWeights.bold};
    border-width: ${e.borderWidths.px};
    border-style: ${e.borderStyles.solid};

    background: ${F(i,"background")};
    color: ${F(i,"text")};
    border-color: ${F(i,"border")};

    /* solves sticky problem */
    @media (hover: hover) {
      &:hover {
        transform: translateY(-1px);
        background: ${F(i,"hover")};
      }
      &:active {
        transform: translateY(0px);
      }
    }
    @media (hover: none) {
      &:active {
        transform: translateY(-1px);
        background: ${F(i,"hover")};
      }
    }

    &:disabled {
      cursor: not-allowed;
      background: ${F("disabled","background")};
      transform: none;
      color: ${F("disabled","text")};
      border-color: transparent;
    }

    ${r&&l.css`
      background: ${F(i,"hover")};
    `};

    ${o&&l.css`
      box-shadow: ${e.shadows["0.25"]} ${e.colors.grey};
    `};

    ${a==="small"&&l.css`
      font-size: ${e.fontSizes.small};
      line-height: ${e.lineHeights.small};
      height: ${e.space[10]};
      padding: 0 ${e.space["3.5"]};
      svg {
        display: block;
        width: ${e.space[3]};
        height: ${e.space[3]};
        color: ${F(i,"text")};
      }
    `}

    ${a==="medium"&&l.css`
      font-size: ${e.fontSizes.body};
      line-height: ${e.lineHeights.body};
      height: ${e.space[12]};
      padding: 0 ${e.space[4]};
      svg {
        display: block;
        width: ${e.space[4]};
        height: ${e.space[4]};
        color: ${F(i,"text")};
      }
    `}

    &:disabled svg {
      color: ${F("disabled","text")};
    }

    ${(n==="circle"||n==="rounded")&&l.css`
      border-radius: ${e.radii.full};
    `}

    ${(n==="circle"||n==="square")&&a==="small"&&l.css`
      width: ${e.space[10]};
    `}

    ${(n==="circle"||n==="square")&&a==="medium"&&l.css`
      width: ${e.space[12]};
    `}

    ${c&&l.css`
      padding: 0 ${e.space[12]};
    `}

    ${u&&l.css`
      width: ${e.space[u]};
    `}
  `),ea=s.default.div(({$fullWidth:e})=>l.css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    ${e&&l.css`
      width: 100%;
    `}
  `),ta=s.default.div(({theme:e})=>l.css`
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    padding-right: ${e.space[3]};

    display: flex;
    align-items: center;
    justify-content: flex-end;
    pointer-events: none;
  `),ra=s.default.div(({theme:e,$visible:r})=>l.css`
    display: flex;
    padding: 0 ${e.space[1]};
    justify-content: center;
    align-items: center;
    border: 2px solid white;
    border-radius: ${e.radii.full};
    font-size: ${e.space[3]};
    min-width: ${e.space[6]};
    height: ${e.space[6]};
    box-sizing: border-box;
    transform: scale(1);
    opacity: 1;
    transition: all 0.3s ease-in-out;

    ${!r&&l.css`
      transform: scale(0.3);
      opacity: 0;
    `}
  `),oa=s.default.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9b911;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  position: absolute;
  right: -10px;
  top: -10px;
  color: white;
`,De=t.forwardRef(({children:e,disabled:r,href:o,prefix:a,loading:i,rel:n,shape:c,size:u="medium",suffix:d,tabIndex:p,target:h,colorStyle:f="accentPrimary",type:g="button",zIndex:$,onClick:x,pressed:b=!1,shadow:k=!1,width:L,fullWidthContent:y,count:v,shouldShowTooltipIndicator:m,as:w,...Z},H)=>{const B=t.createElement(ea,{$fullWidth:y},e),R=r?"greyPrimary":"backgroundPrimary";let C;if(c==="circle"||c==="square")C=i?t.createElement(pe,{color:R}):B;else{const G=!!a,T=!G&&!d,N=!G&&!!d;let j=a;i&&G?j=t.createElement(pe,{color:R}):i&&T&&(j=t.createElement(pe,{color:R}));let D=d;i&&N&&(D=t.createElement(pe,{color:R})),C=t.createElement(t.Fragment,null,!!j&&j,B,!!D&&D)}return t.createElement(Jl,{...Z,$colorStyle:f,$hasCounter:!!v,$pressed:b,$shadow:k,$shape:c,$size:u,$width:L,as:w,disabled:r,href:o,position:$&&"relative",ref:H,rel:n,tabIndex:p,target:h,type:g,zIndex:$,onClick:x},m&&t.createElement(oa,{"data-testid":"tooltip-indicator"},"?"),C,t.createElement(ta,null,t.createElement(ra,{$visible:!!v},v)))});De.displayName="Button";const la=s.default.div(({theme:e})=>l.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[4]};

    padding: ${e.space[4]};
    border-radius: ${e.radii["2xLarge"]};
    background-color: ${e.colors.backgroundPrimary};
    border: 1px solid ${e.colors.border};

    ${U.md.min(l.css`
        padding: ${e.space[6]};
      `)}
  `),aa=s.default.div(({theme:e})=>l.css`
    width: calc(100% + 2 * ${e.space[4]});
    height: 1px;
    background: ${e.colors.border};
    margin: 0 -${e.space[4]};
    ${U.md.min(l.css`
        margin: 0 -${e.space[6]};
        width: calc(100% + 2 * ${e.space[6]});
      `)}
  `),ze=({title:e,children:r,...o})=>t.createElement(la,{...o},e&&t.createElement(A,{fontVariant:"headingFour"},e),r);ze.displayName="Card";ze.Divider=aa;const It=(e,r,o,a,i)=>{const n=r.top-o.height-a-i,c=r.left-o.width-a-i,u=window.innerWidth-r.left-r.width-o.width-a-i,d=window.innerHeight-r.top-r.height-o.height-a-i;return e==="top"&&n<0&&d>n?"bottom":e==="right"&&u<0&&c>u?"left":e==="bottom"&&d<0&&n>d?"top":e==="left"&&c<0&&u>c?"right":e},na=(e,r,o,a)=>{let i="";o==="top"?i=`translate(0, -${r}px)`:o==="right"?i=`translate(${e}px, 0)`:o==="bottom"?i=`translate(0, ${r}px)`:i=`translate(-${e}px, 0);`;let n="";return a==="top"?n=`translate(0, -${r}px)`:a==="right"?n=`translate(${e}px, 0)`:a==="bottom"?n=`translate(0, ${r}px)`:n=`translate(-${e}px, 0);`,{translate:i,mobileTranslate:n}},ia=s.default.div(({$state:e,$translate:r,$mobileTranslate:o,$width:a,$mobileWidth:i,$x:n,$y:c,$isControlled:u,$transitionDuration:d})=>[l.css`
      /* stylelint-disable */
      -webkit-backface-visibility: hidden;
      -moz-backface-visibility: hidden;
      -webkit-transform: translate3d(0, 0, 0);
      -moz-transform: translate3d(0, 0, 0);
      /* stylelint-enable */

      /* Default state is unmounted */
      display: block;
      box-sizing: border-box;
      visibility: hidden;
      position: absolute;
      z-index: 99999;
      width: ${i}px;
      transform: translate3d(0, 0, 0) ${o};
      transition: none;
      opacity: 0;
      pointer-events: none;
      top: 0;
      left: 0;

      ${e==="preEnter"&&l.css`
        display: block;
        visibility: visible;
        top: ${c}px;
        left: ${n}px;
      `}

      ${e==="entering"&&l.css`
        display: block;
        visibility: visible;
        opacity: 1;
        transition: opacity ${d}ms ease-in-out;
        top: ${c}px;
        left: ${n}px;
      `}

      ${e==="entered"&&l.css`
        display: block;
        visibility: visible;
        opacity: 1;
        transition: opacity ${d}ms ease-in-out;
        top: ${c}px;
        left: ${n}px;

        ${u&&l.css`
          pointer-events: auto;
        `}
      `}

      ${e==="exiting"&&l.css`
        display: block;
        visibility: visible;
        opacity: 0;
        transition: all ${d}ms ease-in-out;
        top: ${c}px;
        left: ${n}px;
      `}
    `,U.md.min(l.css`
      width: ${a}px;
      transform: translate3d(0, 0, 0) ${r};
    `)]),Ne=({popover:e,placement:r="top",mobilePlacement:o="top",animationFn:a,anchorRef:i,onShowCallback:n,width:c=250,mobileWidth:u=150,useIdealPlacement:d=!1,additionalGap:p=0,transitionDuration:h=350,isOpen:f,align:g="center"})=>{const $=t.useRef(null),x=f!==void 0,[b,k]=t.useState({top:100,left:100,horizontalClearance:100,verticalClearance:100,idealPlacement:r,idealMobilePlacement:o}),L=t.useCallback(()=>{const R=i==null?void 0:i.current,C=R==null?void 0:R.getBoundingClientRect(),G=$==null?void 0:$.current,T=G==null?void 0:G.getBoundingClientRect();if(!T||!C)return;let N=T.width/2,j=C.width/2,D=T.height/2,P=C.height/2;r==="top"||r==="bottom"?g==="start"?(N=0,j=-j):g==="end"&&(N=T.width,j=C.width):g==="start"?(D=0,P=0):g==="end"&&(D=T.height,P=C.height);const V=window.scrollY+C.y+P-D,O=C.x+j-N,ie=N+j+p+10,J=D+P+p+10,W=It(r,C,T,0,0),_=It(o,C,T,0,0);k({top:V,left:O,horizontalClearance:ie,verticalClearance:J,idealPlacement:W,idealMobilePlacement:_})},[r,o,p,i,g]),y=t.useMemo(()=>a?(R,C,G,T)=>a(R,C,G,T):(R,C,G,T)=>na(R,C,G,T),[a]);t.useEffect(()=>{L();const R=()=>{L()},C=i==null?void 0:i.current;let G,T;return x||(G=()=>{L(),m(!0),n==null||n()},T=()=>{m(!1)},C==null||C.addEventListener("mouseenter",G),C==null||C.addEventListener("mouseleave",T)),addEventListener("resize",R),()=>{x||(C==null||C.removeEventListener("mouseenter",G),C==null||C.removeEventListener("mouseleave",T)),removeEventListener("resize",R)}},[r,o,L,p,n,i,x]),t.useEffect(()=>{x&&m(f)},[x,f]);const[v,m]=ot.useTransition({preEnter:!0,exit:!0,mountOnEnter:!0,unmountOnExit:!0,timeout:{enter:h,exit:h}}),w=d?b.idealPlacement:r,Z=d?b.idealMobilePlacement:o,{translate:H,mobileTranslate:B}=y(b.horizontalClearance,b.verticalClearance,w,Z);return br.createPortal(t.createElement(ia,{$isControlled:x,$mobileTranslate:B,$mobileWidth:u,$state:v,$transitionDuration:h,$translate:H,$width:c,$x:b.left,$y:b.top,"data-testid":"popoverContainer",id:"popoverContainer",ref:$},t.cloneElement(e,{placement:w,mobilePlacement:Z})),document==null?void 0:document.body)};Ne.displayName="DynamicPopover";const ca=(e,r,o,a)=>{const i=n=>{e.current&&!e.current.contains(n.target)&&o()};we.useEffect(()=>(a?document.addEventListener(r,i):document.removeEventListener(r,i),()=>{document.removeEventListener(r,i)}),[a])},sa=typeof window<"u"?t.useLayoutEffect:t.useEffect,Je={serverHandoffComplete:!1},da=()=>{const[e,r]=t.useState(Je.serverHandoffComplete);return t.useEffect(()=>{e||r(!0)},[e]),t.useEffect(()=>{Je.serverHandoffComplete||(Je.serverHandoffComplete=!0)},[]),e},ua="thorin";let pa=0;function Ut(){return++pa}const ct=()=>{const e=da(),[r,o]=t.useState(e?Ut:null);return sa(()=>{r===null&&o(Ut())},[r]),r!=null?`${ua}`+r:void 0},Lr=({description:e,error:r,id:o}={})=>{const a=ct();return t.useMemo(()=>{const i=`${a}${o?`-${o}`:""}`,n=`${i}-label`;let c,u;e&&(u={id:`${i}-description`},c=u.id);let d;return r&&(d={id:`${i}-error`},c=`${c?`${c} `:""}${d.id}`),{content:{"aria-describedby":c,"aria-labelledby":n,id:i},description:u,error:d,label:{htmlFor:i,id:n}}},[a,e,r,o])},Yt=t.createContext(void 0),fa=s.default.label(({theme:e,$disabled:r,$readOnly:o,$required:a})=>l.css`
    display: flex;
    flex-basis: auto;
    flex-grow: 2;
    flex-shrink: 1;
    overflow: hidden;
    position: relative;
    cursor: pointer;

    ${o&&l.css`
      cursor: default;
      pointer-events: none;
    `}

    ${r&&l.css`
      cursor: not-allowed;
    `}

    ${a&&l.css`
      ::after {
        content: ' *';
        white-space: pre;
        color: ${e.colors.red};
      }
    `}
  `),ga=s.default(A)(()=>l.css``),ma=s.default(A)(()=>l.css`
    flex-basis: auto;
    flex-grow: 0;
    flex-shrink: 2;
    text-align: right;
    overflow: hidden;
    position: relative;
  `),ba=s.default.div(({theme:e,$inline:r})=>l.css`
    display: flex;
    align-items: center;
    padding: 0 ${r?"0":e.space[2]};
    overflow: hidden;
    gap: ${e.space[2]};
  `),ha=({ids:e,label:r,labelSecondary:o,required:a,hideLabel:i,inline:n,disabled:c,readOnly:u})=>{const d=t.createElement(ba,{$inline:n},t.createElement(fa,{$disabled:c,$readOnly:u,$required:a,...e.label},t.createElement(ga,{color:"greyPrimary",ellipsis:!0,fontVariant:"bodyBold"},r,a&&t.createElement(ge,null,"required"))),o&&t.createElement(ma,{color:"greyPrimary",ellipsis:!0,fontVariant:"extraSmall"},o));return i?t.createElement(ge,null,d):d},$a=s.default(A)(({theme:e,$inline:r})=>l.css`
    padding: 0 ${r?"0":e.space[2]};
    width: 100%;
    overflow: hidden;
  `),wa=s.default(A)(({theme:e,$inline:r})=>`
    padding: 0 ${r?"0":e.space[2]};
`),va=({ids:e,error:r,description:o,hideLabel:a,inline:i,disabled:n})=>a?null:r?t.createElement(wa,{"aria-live":"polite",...e.error,$inline:i,color:"redPrimary",fontVariant:"smallBold"},r):o?t.createElement($a,{$inline:i,...e.description,color:n?"greyPrimary":"textPrimary",colorScheme:n?"secondary":"primary",ellipsis:!0,fontVariant:"small"},o):null,qt=s.default.div(({theme:e,$inline:r,$width:o,$reverse:a})=>l.css`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: 'normal';
    gap: ${e.space[2]};
    width: ${e.space[o]};

    ${r&&l.css`
      flex-direction: ${a?"row-reverse":"row"};
      align-items: 'flex-start';
    `}
  `),ya=s.default.div(({theme:e})=>l.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[1]};
    flex: 1;
    overflow: hidden;
  `),te=({children:e,description:r,error:o,hideLabel:a,id:i,label:n,labelSecondary:c,required:u,inline:d,readOnly:p,width:h="full",reverse:f=!1,disabled:g,...$})=>{const x=Lr({id:i,description:r!==void 0,error:o!==void 0});let b;typeof e=="function"?b=t.createElement(Yt.Provider,{value:x},t.createElement(Yt.Consumer,null,y=>e(y))):e?b=t.cloneElement(e,x.content):b=e;const k=t.createElement(ha,{...$,ids:x,label:n,labelSecondary:c,required:u,hideLabel:a,inline:d,disabled:g,readOnly:p}),L=t.createElement(va,{ids:x,error:o,description:r,hideLabel:a,inline:d,disabled:g});return d?t.createElement(qt,{$inline:d,$reverse:f,$width:h},t.createElement("div",null,b),t.createElement(ya,null,k,L)):t.createElement(qt,{$width:h},k,b,L)};te.displayName="Field";const Ea=(e,r)=>{const o=r==null?void 0:r.split(", ");if(!o)return!0;const a=Xt(e);return o.some(i=>{const n=Xt(i);return n.type===a.type&&n.subtype===a.subtype})},Xt=e=>{const r=e.split("/");return{type:r[0],subtype:r[1]}},Kt={},st=t.forwardRef(({accept:e,autoFocus:r,children:o,defaultValue:a,disabled:i,error:n,id:c,maxSize:u,name:d,required:p,tabIndex:h,onBlur:f,onChange:g,onError:$,onFocus:x,onReset:b,...k},L)=>{const y=t.useRef(null),v=L||y,[m,w]=t.useState(Kt),Z=n?!0:void 0,H=Lr({id:c,error:Z}),B=t.useCallback((P,V)=>{if(u&&P.size>u*1e6){V==null||V.preventDefault(),$&&$(`File is ${(P.size/1e6).toFixed(2)} MB. Must be smaller than ${u} MB`);return}w(O=>({...O,file:P,name:P.name,type:P.type})),g&&g(P)},[u,g,$]),R=t.useCallback(P=>{const V=P.target.files;!(V!=null&&V.length)||B(V[0],P)},[B]),C=t.useCallback(P=>{P.preventDefault(),w(V=>({...V,droppable:!0}))},[]),G=t.useCallback(P=>{P.preventDefault(),w(V=>({...V,droppable:!1}))},[]),T=t.useCallback(P=>{P.preventDefault(),w(O=>({...O,droppable:!1}));let V;if(P.dataTransfer.items){const O=P.dataTransfer.items;if((O==null?void 0:O[0].kind)!=="file"||(V=O[0].getAsFile(),!V))return}else{const O=P.dataTransfer.files;if(!(O!=null&&O.length))return;V=O[0]}!Ea(V.type,e)||B(V,P)},[B,e]),N=t.useCallback(P=>{w(V=>({...V,focused:!0})),x&&x(P)},[x]),j=t.useCallback(P=>{w(V=>({...V,focused:!1})),f&&f(P)},[f]),D=t.useCallback(P=>{P.preventDefault(),w(Kt),v.current&&(v.current.value=""),b&&b()},[v,b]);return t.useEffect(()=>{!a||w({previewUrl:a.url,name:a.name,type:a.type})},[]),t.useEffect(()=>{if(!m.file)return;const P=URL.createObjectURL(m.file);return w(V=>({...V,previewUrl:P})),()=>URL.revokeObjectURL(P)},[m.file]),t.createElement("div",null,t.createElement(ge,null,t.createElement("input",{...k,...H.content,accept:e,"aria-invalid":Z,autoFocus:r,disabled:i,name:d,ref:v,required:p,tabIndex:h,type:"file",onBlur:j,onChange:R,onFocus:N})),t.createElement("label",{...H.label,onDragLeave:G,onDragOver:C,onDrop:T},o({...m,reset:D})))});st.displayName="FileInput";const xa=s.default.div(({theme:e,$textAlign:r,$textTransform:o,$level:a,$responsive:i,$color:n})=>l.css`
    ${r?l.css`
          text-align: ${r};
        `:""}
    ${o?l.css`
          text-transform: ${o};
        `:""}

  ${()=>{switch(a){case"1":return l.css`
            font-size: ${e.fontSizes.headingOne};
            font-weight: ${e.fontWeights.extraBold};
            line-height: ${e.lineHeights.headingOne};
          `;case"2":return l.css`
            font-size: ${e.fontSizes.headingTwo};
            font-weight: ${e.fontWeights.bold};
            line-height: ${e.lineHeights.headingTwo};
          `;default:return""}}}
  
  ${()=>{if(i)switch(a){case"1":return l.css`
              font-size: ${e.fontSizes.headingTwo};
              line-height: ${e.lineHeights.headingTwo};
              ${U.lg.min(l.css`
                font-size: ${e.fontSizes.headingOne};
                line-height: ${e.lineHeights.headingOne};
              `)}
            `;case"2":return l.css`
              font-size: ${e.fontSizes.extraLarge};
              line-height: ${e.lineHeights.extraLarge};
              ${U.sm.min(l.css`
                font-size: ${e.fontSizes.headingTwo};
                line-height: ${e.lineHeights.headingTwo};
              `)}
            `;default:return""}}}

  ${n&&l.css`
      color: ${Pr(n)};
    `}
  
  font-family: ${e.fonts.sans};
  `),We=t.forwardRef(({align:e,children:r,as:o="h1",id:a,level:i="2",responsive:n,transform:c,color:u="text",...d},p)=>t.createElement(xa,{...d,$color:u,$level:i,$responsive:n,$textAlign:e,$textTransform:c,as:o,id:a,ref:p},r));We.displayName="Heading";const _e=({children:e,className:r,el:o="div"})=>{const[a]=t.useState(document.createElement(o));return r&&a.classList.add(r),t.useEffect(()=>(document.body.appendChild(a),()=>{document.body.removeChild(a)}),[]),wl.createPortal(e,a)};_e.displayName="Portal";const Ca=()=>{const[e,r]=we.useState(!1),o=a=>{navigator.clipboard.writeText(a),r(!0)};return we.useEffect(()=>{let a;return e&&(a=setTimeout(()=>r(!1),1500)),()=>clearTimeout(a)},[e]),{copy:o,copied:e}},ka=s.default.button(({theme:e,$inline:r})=>l.css`
    display: flex;
    align-items: flex-start;

    gap: ${e.space[2]};
    padding: ${e.space["2.5"]} ${e.space[3]};
    width: 100%;
    height: fit-content;
    background: ${e.colors.greySurface};
    border: 1px solid ${e.colors.border};
    border-radius: ${e.radii.large};
    transition: all 150ms ease-in-out;
    cursor: pointer;

    ${r&&l.css`
      width: fit-content;
      height: ${e.space[10]};
    `}

    &:hover {
      transform: translateY(-1px);
      background: ${e.colors.greyLight};
    }
  `),Sa=s.default.div(({theme:e,$inline:r,$size:o})=>l.css`
    display: flex;
    gap: ${e.space[2]};
    align-items: flex-start;
    width: ${o==="large"?e.space[30]:e.space["22.5"]};
    flex: 0 0 ${o==="large"?e.space[30]:e.space["22.5"]};

    ${r&&l.css`
      width: fit-content;
      flex: initial;
    `}
  `),Ra=s.default.div(({theme:e,$inline:r})=>l.css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    overflow: hidden;

    ${r&&l.css`
      flex-direction: row;
      gap: ${e.space[2]};
      align-items: center;
    `}
  `),Qt=s.default(A)(()=>l.css`
    text-align: left;
    width: 100%;
  `),Pa=s.default.div(({theme:e})=>l.css`
    svg {
      display: block;
      width: ${e.space[5]};
      height: ${e.space[5]};
    }
  `),La=s.default(A)(({$inline:e})=>l.css`
    flex: 1;
    text-align: left;
    word-break: break-all;

    ${e&&l.css`
      word-break: initial;
    `}
  `),Va=s.default.svg(({theme:e,$rotate:r})=>l.css`
    display: block;
    margin-top: ${e.space[1]};
    width: ${e.space[3]};
    height: ${e.space[3]};
    color: ${e.colors.greyPrimary};
    ${r&&l.css`
      transform: rotate(45deg);
    `}
  `),dt=({link:e,size:r="small",inline:o=!1,icon:a,keyLabel:i,keySublabel:n,value:c,children:u,...d})=>{const{copy:p,copied:h}=Ca(),f=e?"a":void 0,g=!!a||!!i,$=!!i||!!n,x=typeof i=="string"?t.createElement(Qt,{$inline:o,color:"grey",ellipsis:!o,fontVariant:r==="large"?"bodyBold":"smallBold"},i):i,b=typeof n=="string"?t.createElement(Qt,{$inline:o,color:"grey",ellipsis:!o,fontVariant:r==="large"?"smallBold":"extraSmallBold"},n):n,k=e?{$rotate:!0,as:ht}:h?{as:Ze}:{as:mt};return t.createElement(ka,{$inline:o,as:f,href:e,rel:"nofollow noreferrer",target:"_blank",type:"button",onClick:()=>{e||p(c)},...d},g&&t.createElement(Sa,{$inline:o,$size:r},a&&t.createElement(Pa,null,a),$&&t.createElement(Ra,{$inline:o},x,b)),t.createElement(La,{$inline:o,fontVariant:r==="large"?"body":"small"},u),t.createElement(Va,{...k}))};dt.displayName="RecordItem";const Za=s.default.div(({theme:e,$showTop:r,$showBottom:o})=>l.css`
    overflow: auto;
    position: relative;

    border-color: ${e.colors.greyLight};
    transition: border-color 0.15s ease-in-out;

    /* stylelint-disable-next-line selector-pseudo-element-no-unknown */
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    &::-webkit-scrollbar {
      background-color: transparent;
    }

    &::-webkit-scrollbar:vertical {
      width: ${e.space["1.5"]};
      background-color: transparent;
    }

    &::-webkit-scrollbar:horizontal {
      height: ${e.space["1.5"]};
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb:vertical {
      border: none;
      border-radius: ${e.radii.full};
      border-right-style: inset;
      border-right-width: calc(100vw + 100vh);
      border-color: inherit;
    }

    &::-webkit-scrollbar-thumb:horizontal {
      border: none;
      border-radius: ${e.radii.full};
      border-bottom-style: inset;
      border-bottom-width: calc(100vw + 100vh);
      border-color: inherit;
    }

    &::-webkit-scrollbar-button {
      display: none;
    }

    &:hover {
      border-color: ${e.colors.greyBright};
    }

    &::before,
    &::after {
      content: '';
      position: sticky;
      left: 0;
      width: 100%;
      display: block;
      height: ${e.space.px};
      background-color: hsla(${e.colors.raw.greyLight} / 0);
      transition: background-color 0.15s ease-in-out;
    }

    &::before {
      top: 0;
      ${r&&l.css`
        background-color: hsla(${e.colors.raw.greyLight} / 1);
        z-index: 100;
      `}
    }
    &::after {
      bottom: 0;
      ${o&&l.css`
        background-color: hsla(${e.colors.raw.greyLight} / 1);
        z-index: 100;
      `}
    }
  `),Jt=s.default.div(()=>l.css`
    display: block;
    height: 0px;
  `),Vr=({hideDividers:e=!1,topTriggerPx:r=16,bottomTriggerPx:o=16,onReachedTop:a,onReachedBottom:i,children:n,...c})=>{const u=t.useRef(null),d=t.useRef(null),p=t.useRef(null),h=typeof e=="boolean"?e:!!(e!=null&&e.top),f=typeof e=="boolean"?e:!!(e!=null&&e.bottom),g=t.useRef({onReachedTop:a,onReachedBottom:i}),[$,x]=t.useState(!1),[b,k]=t.useState(!1),L=y=>{var w,Z,H,B;const v=[!1,-1],m=[!1,-1];for(let R=0;R<y.length;R+=1){const C=y[R],G=C.target===d.current?v:m;C.time>G[1]&&(G[0]=C.isIntersecting,G[1]=C.time)}v[1]!==-1&&!h&&x(!v[0]),m[1]!==-1&&!f&&k(!m[0]),v[0]&&((Z=(w=g.current).onReachedTop)==null||Z.call(w)),m[0]&&((B=(H=g.current).onReachedBottom)==null||B.call(H))};return t.useEffect(()=>{const y=u.current,v=d.current,m=p.current;let w;return y&&v&&m&&(w=new IntersectionObserver(L,{root:y,threshold:1,rootMargin:`${r}px 0px ${o}px 0px`}),w.observe(v),w.observe(m)),()=>{w.disconnect()}},[o,r]),t.useEffect(()=>{g.current={onReachedTop:a,onReachedBottom:i}},[a,i]),t.createElement(Za,{$showBottom:b,$showTop:$,ref:u,...c},t.createElement(Jt,{"data-testid":"scrollbox-top-intersect",ref:d}),n,t.createElement(Jt,{"data-testid":"scrollbox-bottom-intersect",ref:p}))},Zr=t.createContext(void 0),ut=({children:e,loading:r})=>t.createElement(Zr.Provider,{value:r},e);ut.displayName="SkeletonGroup";const Ma=l.keyframes`
  to {
    background-position-x: -200%;
  }
`,Ga=s.default.div(({theme:e,$active:r})=>l.css`
    ${r&&l.css`
      background: ${e.colors.greyLight}
        linear-gradient(
          110deg,
          ${e.colors.greyLight} 8%,
          ${e.colors.greySurface} 18%,
          ${e.colors.greyLight} 33%
        );
      background-size: 200% 100%;
      animation: 1.5s ${Ma} infinite linear;
      border-radius: ${e.radii.medium};
      width: ${e.space.fit};
    `}
  `),Ta=s.default.span(({$active:e})=>l.css`
    display: block;
    ${e?l.css`
          visibility: hidden;
          * {
            visibility: hidden !important;
          }
        `:""}
  `),pt=({as:e,children:r,loading:o,...a})=>{const i=t.useContext(Zr),n=o!=null?o:i;return t.createElement(Ga,{...a,$active:n,as:e},t.createElement(Ta,{$active:n},r))};pt.displayName="Skeleton";const Ba=s.default.div(({theme:e,$hover:r,$size:o,$colorStyle:a})=>l.css`
    align-items: center;
    display: flex;
    border-radius: ${e.radii.full};
    font-size: ${e.fontSizes.small};
    line-height: ${e.lineHeights.small};
    font-weight: ${e.fontWeights.bold};
    width: ${e.space.max};
    padding: ${e.space["0.5"]} ${e.space[2]};
    background: ${F(a,"background")};
    color: ${F(a,"text")};
    border: 1px solid ${F(a,"border")};
    cursor: default;

    ${o==="small"&&l.css`
      font-size: ${e.fontSizes.extraSmall};
      line-height: ${e.lineHeights.extraSmall};
    `}

    ${r&&l.css`
      transition-duration: ${e.transitionDuration[150]};
      transition-property: color, border-color, background-color;
      transition-timing-function: ${e.transitionTimingFunction.inOut};

      &:hover,
      &:active {
        transform: translateY(-1px);
        background-color: ${F(a,"hover")};
      }
    `}
  `),Ie=({as:e="div",children:r,hover:o,size:a="small",colorStyle:i="accentSecondary",...n})=>t.createElement(Ba,{...n,$colorStyle:i,$hover:o,$size:a,as:e},r);Ie.displayName="Tag";const Le=({children:e,surface:r,onDismiss:o,noBackground:a=!1,className:i="modal",open:n})=>{const[c,u]=ot.useTransition({timeout:{enter:50,exit:300},mountOnEnter:!0,unmountOnExit:!0}),d=t.useRef(null),p=r||lt,h=f=>f.target===d.current&&o&&o();return t.useEffect(()=>{const{style:f,dataset:g}=document.body,$=()=>parseInt(g.backdrops||"0"),x=k=>g.backdrops=String($()+k),b=(k,L,y)=>{f.width=k,f.position=L,f.top=y};if(u(n||!1),typeof window<"u"&&!a&&n)return $()===0&&b(`${document.body.clientWidth}px`,"fixed",`-${window.scrollY}px`),x(1),()=>{const k=parseFloat(f.top||"0")*-1;$()===1&&(b("","",""),window.scroll({top:k})),x(-1)}},[n,a]),c!=="unmounted"?t.createElement(_e,{className:i},o&&t.createElement(p,{$empty:a,$state:c,ref:d,onClick:h}),e({state:c})):null};Le.displayName="Backdrop";const Oa=(e="",r=10,o=5,a=5)=>e.length<r?e:`${e.slice(0,o)}...${e.slice(-a)}`,re=(e,r)=>e["data-testid"]?String(e["data-testid"]):r,Ha=s.default.input(({theme:e,$colorStyle:r="accentPrimary"})=>l.css`
    font: inherit;
    display: grid;
    position: relative;
    place-content: center;
    transition: transform 150ms ease-in-out, filter 150ms ease-in-out;
    cursor: pointer;

    width: ${e.space[5]};
    height: ${e.space[5]};
    border-radius: ${e.radii.small};
    background-color: ${e.colors.border};

    &:checked {
      background: ${F(r,"background")};
    }

    &::before {
      content: '';
      background: ${e.colors.border};
      mask-image: ${`url('data:image/svg+xml; utf8, <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12.625L10.125 20.125L22 3.875" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></svg>')`};
      mask-repeat: no-repeat;
      width: ${e.space[3]};
      height: ${e.space[3]};
      transition: all 90ms ease-in-out;
    }

    &:hover {
      transform: translateY(-1px);
    }

    &:hover::before,
    &:checked::before {
      background: ${F(r,"text")};
    }

    &:disabled {
      cursor: not-allowed;
    }

    &:disabled::before,
    &:disabled:hover::before {
      background: ${e.colors.border};
    }

    &:disabled:checked,
    &:disabled:checked:hover {
      background: ${e.colors.border};
    }

    &:disabled:checked::before,
    &:disabled:checked:hover::before {
      background: ${e.colors.greyPrimary};
    }
  `),ft=t.forwardRef(({description:e,disabled:r,error:o,hideLabel:a,id:i,label:n,labelSecondary:c,inline:u=!0,name:d,required:p,tabIndex:h,value:f,checked:g,width:$,onBlur:x,onChange:b,onFocus:k,colorStyle:L="accentPrimary",...y},v)=>{const m=t.useRef(null),w=v||m;return t.createElement(te,{description:e,disabled:r,error:o,hideLabel:a,id:i,inline:u,label:n,labelSecondary:c,required:p,width:$},t.createElement(Ha,{...y,"data-testid":re(y,"checkbox"),"aria-invalid":o?!0:void 0,type:"checkbox",$colorStyle:L,checked:g,disabled:r,name:d,ref:w,tabIndex:h,value:f,onBlur:x,onChange:b,onFocus:k}))});ft.displayName="Checkbox";const Aa=s.default.div(({theme:e,$color:r})=>l.css`
    position: relative;
    width: 100%;

    input ~ label:hover {
      transform: translateY(-1px);
    }

    input ~ label:hover div#circle {
      background: ${e.colors.border};
    }

    input:checked ~ label {
      background: ${e.colors[`${r}Surface`]};
      border-color: transparent;
    }

    input:disabled ~ label {
      cursor: not-allowed;
    }

    input:checked ~ label div#circle {
      background: ${e.colors[`${r}Primary`]};
      border-color: transparent;
    }

    input:disabled ~ label div#circle,
    input:disabled ~ label:hover div#circle {
      background: ${e.colors.greySurface};
    }

    input:checked ~ label:hover div#circle {
      background: ${e.colors[`${r}Bright`]};
    }

    input:disabled ~ label,
    input:disabled ~ label:hover {
      background: ${e.colors.greySurface};
      transform: initial;
    }

    input:disabled ~ label div#circle svg,
    input:disabled ~ label:hover div#circle svg {
      color: ${e.colors.greySurface};
    }

    input:disabled:checked ~ label div#circle,
    input:disabled:checked ~ label:hover div#circle {
      background: ${e.colors.border};
    }

    input:disabled:checked ~ label div#circle svg,
    input:disabled:checked ~ label:hover div#circle svg {
      color: ${e.colors.greyPrimary};
    }
  `),ja=s.default.input(()=>l.css`
    position: absolute;
    width: 1px;
    height: 1px;
  `),Fa=s.default.label(({theme:e})=>l.css`
    display: flex;
    align-items: center;
    gap: ${e.space[4]};

    width: 100%;
    height: 100%;
    padding: ${e.space[4]};

    border-radius: ${e.space[2]};
    border: 1px solid ${e.colors.border};

    cursor: pointer;

    transition: all 0.3s ease-in-out;
  `),Da=s.default.div(({theme:e})=>l.css`
    display: flex;
    align-items: center;
    justify-content: center;

    flex: 0 0 ${e.space[7]};
    width: ${e.space[7]};
    height: ${e.space[7]};
    border-radius: ${e.radii.full};
    border: 1px solid ${e.colors.border};

    transition: all 0.3s ease-in-out;

    svg {
      display: block;
      color: ${e.colors.backgroundPrimary};
      width: ${e.space[4]};
      height: ${e.space[4]};
    }
  `),za=s.default.div(()=>l.css`
    display: flex;
    flex-direction: column;
  `),gt=t.forwardRef(({label:e,subLabel:r,name:o,color:a="blue",disabled:i,...n},c)=>{const u=t.useRef(null),d=c||u,p=ct(),h=i?"grey":"text";return t.createElement(Aa,{$color:a},t.createElement(ja,{disabled:i,id:p,name:o,type:"checkbox",...n,ref:d}),t.createElement(Fa,{htmlFor:p,id:"permissions-label"},t.createElement(Da,{id:"circle"},t.createElement(Ze,null)),t.createElement(za,null,t.createElement(A,{color:h,fontVariant:"bodyBold"},e),r&&t.createElement(A,{color:h,fontVariant:"small"},r))))});gt.displayName="CheckboxRow";const Mr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M4.5 23.225C1.173 12.416 12.09 2.703 22.438 7.264l65.03 28.657c10.502 4.628 10.502 19.53 0 24.158l-65.03 28.657c-10.348 4.56-21.265-5.153-17.94-15.96L12.122 48 4.5 23.225ZM22.83 54l-6.86 22.304c-.303.983.69 1.866 1.63 1.451l65.03-28.657c.31-.136.454-.297.541-.437.102-.166.175-.395.175-.661s-.073-.495-.175-.661c-.087-.14-.232-.301-.54-.437L17.6 18.245c-.941-.415-1.934.468-1.631 1.45L22.83 42h21.72a6 6 0 0 1 0 12H22.83Z",clipRule:"evenodd"})),Ve=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M48 30a6 6 0 0 1 6 6v12a6 6 0 0 1-12 0V36a6 6 0 0 1 6-6Zm6 34a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M58.873 7.242c-5.757-6.514-15.988-6.514-21.746 0-15.715 17.78-27.914 38.623-35.65 61.07-2.866 8.315 2.358 17.173 10.902 18.842 23.418 4.575 47.824 4.575 71.242 0 8.544-1.669 13.768-10.527 10.903-18.841-7.737-22.448-19.936-43.29-35.651-61.071Zm-12.754 7.947c.98-1.11 2.782-1.11 3.762 0C64.564 31.8 75.96 51.275 83.18 72.223c.461 1.34-.38 2.865-1.858 3.154-21.9 4.278-44.743 4.278-66.642 0-1.478-.289-2.32-1.815-1.858-3.154 7.22-20.948 18.615-40.422 33.298-57.034Z",clipRule:"evenodd"})),Gr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M22 36a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm16 0a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm22-6a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M18 8C8.059 8 0 16.059 0 26v44c0 9.941 8.059 18 18 18h60c9.941 0 18-8.059 18-18V26c0-9.941-8.059-18-18-18H18Zm-6 18a6 6 0 0 1 6-6h60a6 6 0 0 1 6 6v44a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V26Z",clipRule:"evenodd"})),Tr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M26 72a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm28-6a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm16 6a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM26 40a6 6 0 0 0 0 12h44a6 6 0 0 0 0-12H26Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M20 10a6 6 0 0 1 12 0v2h32v-2a6 6 0 0 1 12 0v2h2c9.941 0 18 8.059 18 18v44c0 9.941-8.059 18-18 18H18C8.059 92 0 83.941 0 74V30c0-9.941 8.059-18 18-18h2v-2Zm0 16v-2h-2a6 6 0 0 0-6 6v44a6 6 0 0 0 6 6h60a6 6 0 0 0 6-6V30a6 6 0 0 0-6-6h-2v2a6 6 0 0 1-12 0v-2H32v2a6 6 0 0 1-12 0Z",clipRule:"evenodd"})),Br=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 30c-10.493 0-19 8.507-19 19s8.507 19 19 19 19-8.507 19-19-8.507-19-19-19Zm-7 19a7 7 0 1 1 14 0 7 7 0 0 1-14 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M33.504 8a18 18 0 0 0-17.47 13.66l-1.665 6.706C6.169 30.046 0 37.303 0 46v24c0 9.941 8.059 18 18 18h60c9.941 0 18-8.059 18-18V46c0-8.697-6.168-15.954-14.369-17.634l-1.666-6.706A18 18 0 0 0 62.496 8H33.504ZM16.777 40.122l7.413-1.518 3.49-14.05A6 6 0 0 1 33.505 20h28.992a6 6 0 0 1 5.823 4.553l3.491 14.05 7.413 1.52A6.006 6.006 0 0 1 84 46v24a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V46a6.006 6.006 0 0 1 4.777-5.878Z",clipRule:"evenodd"})),Ze=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M88.455 28.019a6 6 0 1 0-8.91-8.038l-41.852 46.4L16.16 45.676a6 6 0 0 0-8.318 8.65L33.82 79.304l.094.09c.508.472 1.077.84 1.68 1.104a6.017 6.017 0 0 0 5.183-.177 5.984 5.984 0 0 0 1.7-1.325l45.98-50.977Z"})),Or=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M71.243 32.757a6 6 0 0 1 0 8.486l-24.98 24.98A5.978 5.978 0 0 1 44.7 67.36a6.017 6.017 0 0 1-5.18.105 5.976 5.976 0 0 1-1.611-1.076L24.93 54.409a6 6 0 0 1 8.14-8.818l8.764 8.09 20.923-20.924a6 6 0 0 1 8.486 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Zm0-12c19.882 0 36-16.118 36-36S67.882 12 48 12 12 28.118 12 48s16.118 36 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Hr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 28c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20Zm-8 20a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 0c-.693 0-1.383.015-2.069.044-5.799.246-10.449 3.635-13.244 7.724l-2.594 3.795c-.39.571-1.06 1.191-2.099 1.793-1.033.598-1.896.864-2.594.918l-4.591.35c-4.926.375-10.176 2.695-13.292 7.576a47.964 47.964 0 0 0-2.091 3.614c-2.686 5.144-2.07 10.862.07 15.319l2.002 4.17c.3.627.502 1.51.502 2.697 0 1.188-.201 2.07-.502 2.697l-2.002 4.17c-2.14 4.457-2.756 10.175-.07 15.32A47.967 47.967 0 0 0 7.517 73.8c3.116 4.881 8.366 7.201 13.292 7.577l4.591.35c.698.053 1.561.32 2.594.917 1.04.602 1.709 1.222 2.1 1.793l2.593 3.795c2.795 4.089 7.445 7.478 13.244 7.724a48.674 48.674 0 0 0 4.138 0c5.799-.246 10.449-3.635 13.244-7.724l2.594-3.795c.39-.571 1.06-1.191 2.099-1.793 1.033-.598 1.897-.864 2.594-.918l4.591-.35c4.926-.375 10.176-2.695 13.292-7.576a47.949 47.949 0 0 0 2.091-3.614c2.686-5.144 2.07-10.862-.07-15.319l-2.002-4.17C88.202 50.07 88 49.187 88 48c0-1.188.201-2.07.502-2.697l2.002-4.17c2.14-4.457 2.756-10.175.07-15.32a47.949 47.949 0 0 0-2.09-3.613c-3.118-4.88-8.368-7.2-13.294-7.577l-4.591-.35c-.697-.053-1.561-.32-2.594-.917-1.04-.602-1.709-1.222-2.1-1.793l-2.593-3.795C60.518 3.679 55.868.29 50.069.044A48.724 48.724 0 0 0 48 0Zm-1.56 12.033a36.657 36.657 0 0 1 3.12 0c1.209.051 2.683.805 3.846 2.507L56 18.335c1.67 2.444 3.875 4.18 5.997 5.408 2.136 1.236 4.737 2.27 7.691 2.496l4.592.35c2.052.156 3.44 1.052 4.089 2.069.56.878 1.084 1.782 1.568 2.709.556 1.065.641 2.714-.25 4.572l-2.003 4.17C76.406 42.773 76 45.54 76 48s.406 5.228 1.684 7.89l2.002 4.17c.892 1.859.807 3.508.25 4.573a36.006 36.006 0 0 1-1.567 2.71c-.65 1.016-2.037 1.912-4.09 2.068l-4.59.35c-2.954.225-5.556 1.26-7.692 2.496-2.122 1.228-4.326 2.964-5.997 5.408l-2.594 3.795c-1.163 1.702-2.637 2.456-3.847 2.507a36.654 36.654 0 0 1-3.118 0c-1.21-.051-2.684-.805-3.847-2.507L40 77.665c-1.67-2.444-3.875-4.18-5.997-5.408-2.136-1.236-4.737-2.27-7.691-2.496l-4.592-.35c-2.052-.156-3.44-1.052-4.089-2.069a35.972 35.972 0 0 1-1.568-2.709c-.556-1.065-.641-2.714.25-4.572l2.003-4.17C19.594 53.227 20 50.46 20 48s-.406-5.228-1.684-7.89l-2.002-4.17c-.892-1.859-.807-3.508-.25-4.573a35.972 35.972 0 0 1 1.567-2.71c.65-1.016 2.037-1.912 4.09-2.068l4.59-.35c2.955-.225 5.556-1.26 7.692-2.496 2.122-1.228 4.326-2.964 5.997-5.408l2.594-3.795c1.163-1.702 2.637-2.456 3.847-2.507Z",clipRule:"evenodd"})),Ar=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M25.856 20.256c1.825-.139 3.558-.79 5.143-1.707 1.58-.914 3.017-2.093 4.048-3.6l2.594-3.795c1.979-2.895 5.041-4.967 8.545-5.116a42.712 42.712 0 0 1 3.628 0c3.504.15 6.566 2.22 8.545 5.116l2.594 3.795c1.031 1.507 2.467 2.686 4.048 3.6 1.585.917 3.317 1.568 5.143 1.707l4.591.35c3.49.266 6.808 1.874 8.69 4.823a41.963 41.963 0 0 1 1.83 3.161c1.622 3.105 1.356 6.788-.16 9.946l-2.002 4.17C82.303 44.351 82 46.176 82 48c0 1.824.304 3.65 1.093 5.294l2.002 4.17c1.516 3.158 1.782 6.84.16 9.946a41.963 41.963 0 0 1-1.83 3.161c-1.882 2.949-5.2 4.557-8.69 4.823l-4.591.35c-1.826.139-3.558.79-5.143 1.707-1.58.914-3.017 2.093-4.048 3.6l-2.594 3.795c-1.979 2.895-5.04 4.967-8.545 5.115a42.662 42.662 0 0 1-3.628 0c-3.504-.148-6.566-2.22-8.545-5.115l-2.594-3.795c-1.031-1.507-2.467-2.686-4.048-3.6-1.585-.917-3.317-1.568-5.143-1.707l-4.591-.35c-3.49-.266-6.808-1.874-8.69-4.823a41.963 41.963 0 0 1-1.83-3.161c-1.622-3.105-1.356-6.788.16-9.946l2.002-4.17C13.697 51.649 14 49.824 14 48c0-1.824-.304-3.65-1.093-5.294l-2.002-4.17c-1.516-3.158-1.782-6.84-.16-9.946a41.963 41.963 0 0 1 1.83-3.161c1.882-2.949 5.2-4.557 8.69-4.823l4.591-.35ZM48 61c7.18 0 13-5.82 13-13s-5.82-13-13-13-13 5.82-13 13 5.82 13 13 13Z",clipRule:"evenodd",opacity:.35}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 28c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20Zm-8 20a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 0c-.693 0-1.383.015-2.069.044-5.799.246-10.449 3.635-13.244 7.724l-2.594 3.795c-.39.571-1.06 1.191-2.099 1.793-1.033.598-1.896.864-2.594.918l-4.591.35c-4.926.375-10.176 2.695-13.292 7.576a47.964 47.964 0 0 0-2.091 3.614c-2.686 5.144-2.07 10.862.07 15.319l2.002 4.17c.3.627.502 1.51.502 2.697 0 1.188-.201 2.07-.502 2.697l-2.002 4.17c-2.14 4.457-2.756 10.175-.07 15.32A47.967 47.967 0 0 0 7.517 73.8c3.116 4.881 8.366 7.201 13.292 7.577l4.591.35c.698.053 1.561.32 2.594.917 1.04.602 1.709 1.222 2.1 1.793l2.593 3.795c2.795 4.089 7.445 7.478 13.244 7.724a48.674 48.674 0 0 0 4.138 0c5.799-.246 10.449-3.635 13.244-7.724l2.594-3.795c.39-.571 1.06-1.191 2.099-1.793 1.033-.598 1.897-.864 2.594-.918l4.591-.35c4.926-.375 10.176-2.695 13.292-7.576a47.949 47.949 0 0 0 2.091-3.614c2.686-5.144 2.07-10.862-.07-15.319l-2.002-4.17C88.202 50.07 88 49.187 88 48c0-1.188.201-2.07.502-2.697l2.002-4.17c2.14-4.457 2.756-10.175.07-15.32a47.949 47.949 0 0 0-2.09-3.613c-3.118-4.88-8.368-7.2-13.294-7.577l-4.591-.35c-.697-.053-1.561-.32-2.594-.917-1.04-.602-1.709-1.222-2.1-1.793l-2.593-3.795C60.518 3.679 55.868.29 50.069.044A48.724 48.724 0 0 0 48 0Zm-1.56 12.033a36.657 36.657 0 0 1 3.12 0c1.209.051 2.683.805 3.846 2.507L56 18.335c1.67 2.444 3.875 4.18 5.997 5.408 2.136 1.236 4.737 2.27 7.691 2.496l4.592.35c2.052.156 3.44 1.052 4.089 2.069.56.878 1.084 1.782 1.568 2.709.556 1.065.641 2.714-.25 4.572l-2.003 4.17C76.406 42.773 76 45.54 76 48s.406 5.228 1.684 7.89l2.002 4.17c.892 1.859.807 3.508.25 4.573a36.006 36.006 0 0 1-1.567 2.71c-.65 1.016-2.037 1.912-4.09 2.068l-4.59.35c-2.954.225-5.556 1.26-7.692 2.496-2.122 1.228-4.326 2.964-5.997 5.408l-2.594 3.795c-1.163 1.702-2.637 2.456-3.847 2.507a36.654 36.654 0 0 1-3.118 0c-1.21-.051-2.684-.805-3.847-2.507L40 77.665c-1.67-2.444-3.875-4.18-5.997-5.408-2.136-1.236-4.737-2.27-7.691-2.496l-4.592-.35c-2.052-.156-3.44-1.052-4.089-2.069a35.972 35.972 0 0 1-1.568-2.709c-.556-1.065-.641-2.714.25-4.572l2.003-4.17C19.594 53.227 20 50.46 20 48s-.406-5.228-1.684-7.89l-2.002-4.17c-.892-1.859-.807-3.508-.25-4.573a35.972 35.972 0 0 1 1.567-2.71c.65-1.016 2.037-1.912 4.09-2.068l4.59-.35c2.955-.225 5.556-1.26 7.692-2.496 2.122-1.228 4.326-2.964 5.997-5.408l2.594-3.795c1.163-1.702 2.637-2.456 3.847-2.507Z",clipRule:"evenodd"})),mt=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M50 96c-7.732 0-14-6.268-14-14V42c0-7.732 6.268-14 14-14h24c7.732 0 14 6.268 14 14v40c0 7.732-6.268 14-14 14H50Zm-2-14a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V42a2 2 0 0 0-2-2H50a2 2 0 0 0-2 2v40Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M22 0C14.268 0 8 6.268 8 14v40c0 7.732 6.268 14 14 14a6 6 0 0 0 0-12 2 2 0 0 1-2-2V14a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2 6 6 0 0 0 12 0c0-7.732-6.268-14-14-14H22Z"})),jr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M25.74 37.884C29.59 29.702 37.98 24 47.744 24 61.188 24 72 34.793 72 48S61.188 72 47.744 72a24.31 24.31 0 0 1-12.462-3.404 6 6 0 1 0-6.128 10.317A36.31 36.31 0 0 0 47.744 84C67.719 84 84 67.93 84 48S67.72 12 47.744 12a36.284 36.284 0 0 0-32.04 19.137l-2.012-6.034a6 6 0 0 0-11.384 3.794l7 21a6 6 0 0 0 7.674 3.766l20-7a6 6 0 0 0-3.964-11.326l-7.278 2.547Z"})),Fr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M22 68a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm22-6a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm10 6a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M0 30c0-9.941 8.059-18 18-18h60c9.941 0 18 8.059 18 18v36c0 9.941-8.059 18-18 18H18C8.059 84 0 75.941 0 66V30Zm18-6a6 6 0 0 0-6 6v2h72v-2a6 6 0 0 0-6-6H18Zm-6 42V44h72v22a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6Z",clipRule:"evenodd"})),Ee=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M17.757 26.243a6 6 0 1 1 8.486-8.486L48 39.515l21.757-21.758a6 6 0 1 1 8.486 8.486L56.485 48l21.758 21.757a6 6 0 1 1-8.486 8.486L48 56.485 26.243 78.243a6 6 0 1 1-8.486-8.486L39.515 48 17.757 26.243Z"})),Me=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M66.243 29.757a6 6 0 0 1 0 8.486L56.485 48l9.758 9.757a6 6 0 1 1-8.486 8.486L48 56.485l-9.757 9.758a6 6 0 1 1-8.486-8.486L39.515 48l-9.758-9.757a6 6 0 1 1 8.486-8.486L48 39.515l9.757-9.758a6 6 0 0 1 8.486 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Zm0-12c19.882 0 36-16.118 36-36S67.882 12 48 12 12 28.118 12 48s16.118 36 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Dr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M96 48c0 26.51-21.49 48-48 48S0 74.51 0 48 21.49 0 48 0s48 21.49 48 48Zm-12 0c0 19.882-16.118 36-36 36a35.836 35.836 0 0 1-20.86-6.656l50.204-50.203A35.836 35.836 0 0 1 84 48ZM18.656 68.86l50.203-50.204A35.836 35.836 0 0 0 48 12c-19.882 0-36 16.118-36 36a35.836 35.836 0 0 0 6.655 20.86Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),zr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M26 12a2 2 0 0 0-2 2v68a2 2 0 0 0 2 2h44a2 2 0 0 0 2-2V30.387a2 2 0 0 0-.608-1.436L54.485 12.564A2 2 0 0 0 53.093 12H26Zm-14 2c0-7.732 6.268-14 14-14h27.093a14 14 0 0 1 9.743 3.947l16.908 16.387A14 14 0 0 1 84 30.387V82c0 7.732-6.268 14-14 14H26c-7.732 0-14-6.268-14-14V14Z",clipRule:"evenodd"})),Nr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M0 22C0 9.85 9.85 0 22 0s22 9.85 22 22-9.85 22-22 22S0 34.15 0 22Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10ZM0 74c0-12.15 9.85-22 22-22s22 9.85 22 22-9.85 22-22 22S0 86.15 0 74Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10ZM74 0C61.85 0 52 9.85 52 22s9.85 22 22 22 22-9.85 22-22S86.15 0 74 0ZM64 22c0 5.523 4.477 10 10 10s10-4.477 10-10-4.477-10-10-10-10 4.477-10 10ZM52 74c0-12.15 9.85-22 22-22s22 9.85 22 22-9.85 22-22 22-22-9.85-22-22Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Wr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M22 40c9.941 0 18-8.059 18-18S31.941 4 22 4 4 12.059 4 22s8.059 18 18 18Zm0 52c9.941 0 18-8.059 18-18s-8.059-18-18-18S4 64.059 4 74s8.059 18 18 18Zm70-70c0 9.941-8.059 18-18 18s-18-8.059-18-18S64.059 4 74 4s18 8.059 18 18ZM74 92c9.941 0 18-8.059 18-18s-8.059-18-18-18-18 8.059-18 18 8.059 18 18 18Z",clipRule:"evenodd",opacity:.35}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M0 22C0 9.85 9.85 0 22 0s22 9.85 22 22-9.85 22-22 22S0 34.15 0 22Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10ZM0 74c0-12.15 9.85-22 22-22s22 9.85 22 22-9.85 22-22 22S0 86.15 0 74Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10ZM74 0C61.85 0 52 9.85 52 22s9.85 22 22 22 22-9.85 22-22S86.15 0 74 0ZM64 22c0 5.523 4.477 10 10 10s10-4.477 10-10-4.477-10-10-10-10 4.477-10 10ZM52 74c0-12.15 9.85-22 22-22s22 9.85 22 22-9.85 22-22 22-22-9.85-22-22Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),_r=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"m52.243 88.243 34-34a6 6 0 1 0-8.486-8.486L54 69.515V12a6 6 0 0 0-12 0v57.515L18.243 45.757a6 6 0 0 0-8.486 8.486l33.986 33.985.014.015a6 6 0 0 0 8.486 0Z"})),Ue=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M52.243 70.243a6 6 0 0 1-8.486 0l-30-30a6 6 0 1 1 8.486-8.486L48 57.515l25.757-25.758a6 6 0 1 1 8.486 8.486l-30 30Z",clipRule:"evenodd"})),Ir=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M42 28v25.515l-6.757-6.758a6 6 0 1 0-8.486 8.486l17 17a6.002 6.002 0 0 0 8.485 0l.006-.006 16.995-16.994a6 6 0 1 0-8.486-8.486L54 53.515V28a6 6 0 0 0-12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M0 48C0 21.49 21.49 0 48 0s48 21.49 48 48-21.49 48-48 48S0 74.51 0 48Zm12 0c0-19.882 16.118-36 36-36s36 16.118 36 36-16.118 36-36 36-36-16.118-36-36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Ur=({title:e,titleId:r,...o})=>t.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{d:"M4.00058 9.70969C4.23776 10.2167 4.82477 11.2188 4.82477 11.2188L11.611 0L4.98783 4.62508C4.59318 4.88836 4.2694 5.24473 4.04505 5.66275C3.7434 6.29338 3.58313 6.98229 3.57545 7.68131C3.56777 8.38033 3.71286 9.07259 4.00058 9.70969Z",fill:"#5298FF"}),t.createElement("path",{d:"M1.31159 13.4038C1.38637 14.477 1.68956 15.5217 2.20086 16.4682C2.71216 17.4146 3.41976 18.2409 4.27629 18.8917L11.6021 24C11.6021 24 7.01863 17.3944 3.15267 10.8215C2.76128 10.1271 2.49816 9.36782 2.37592 8.58011C2.3218 8.22341 2.3218 7.86059 2.37592 7.50389C2.27512 7.69068 2.07945 8.07313 2.07945 8.07313C1.68745 8.87262 1.42049 9.72754 1.28787 10.608C1.21154 11.5388 1.21948 12.4745 1.31159 13.4038Z",fill:"#5298FF"}),t.createElement("path",{d:"M20.0011 14.2903C19.7639 13.7833 19.1769 12.7812 19.1769 12.7812L12.3907 24L19.0138 19.3779C19.4085 19.1146 19.7322 18.7582 19.9566 18.3402C20.2587 17.7092 20.4192 17.0198 20.4269 16.3202C20.4346 15.6206 20.2892 14.9278 20.0011 14.2903Z",fill:"#5298FF"}),t.createElement("path",{d:"M22.69 10.5962C22.6153 9.52304 22.3121 8.47827 21.8008 7.53183C21.2895 6.58539 20.5819 5.75911 19.7253 5.10834L12.3996 0C12.3996 0 16.98 6.60556 20.849 13.1785C21.2393 13.8731 21.5014 14.6324 21.6227 15.4199C21.6769 15.7766 21.6769 16.1394 21.6227 16.4961C21.7235 16.3093 21.9192 15.9269 21.9192 15.9269C22.3112 15.1274 22.5782 14.2725 22.7108 13.392C22.7881 12.4613 22.7812 11.5256 22.69 10.5962Z",fill:"#5298FF"}),t.createElement("path",{d:"M4.04505 5.66275C4.2694 5.24473 4.59318 4.88836 4.98783 4.62508L11.611 0L4.82476 11.2217C4.82476 11.2217 4.23182 10.2196 4.00057 9.71266C3.7124 9.07515 3.56707 8.38236 3.57475 7.68278C3.58243 6.98321 3.74296 6.29378 4.04505 5.66275ZM1.31159 13.4038C1.38637 14.477 1.68956 15.5217 2.20086 16.4682C2.71216 17.4146 3.41976 18.2409 4.27629 18.8917L11.6021 24C11.6021 24 7.01863 17.3944 3.15267 10.8215C2.76128 10.1271 2.49816 9.36782 2.37592 8.58011C2.3218 8.22341 2.3218 7.86059 2.37592 7.50389C2.27512 7.69068 2.07945 8.07313 2.07945 8.07313C1.68745 8.87262 1.42049 9.72754 1.28787 10.608C1.21154 11.5388 1.21948 12.4745 1.31159 13.4038ZM19.9892 14.2933C19.752 13.7863 19.165 12.7842 19.165 12.7842L12.3907 24L19.0138 19.3779C19.4085 19.1146 19.7322 18.7582 19.9566 18.3402C20.2587 17.7092 20.4192 17.0198 20.4269 16.3202C20.4346 15.6206 20.2892 14.9278 20.0011 14.2903L19.9892 14.2933ZM22.6782 10.5991C22.6034 9.526 22.3002 8.48124 21.7889 7.53479C21.2776 6.58835 20.57 5.76208 19.7135 5.1113L12.3996 0C12.3996 0 16.98 6.60556 20.849 13.1785C21.2393 13.8731 21.5014 14.6324 21.6227 15.4199C21.6769 15.7766 21.6769 16.1394 21.6227 16.4961C21.7235 16.3093 21.9192 15.9269 21.9192 15.9269C22.3112 15.1274 22.5782 14.2725 22.7108 13.392C22.7881 12.4613 22.7812 11.5256 22.69 10.5962L22.6782 10.5991Z",fill:"#5298FF"})),Ye=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M45.409 4.442 21.525 45.385a3 3 0 0 0 1.103 4.117l23.884 13.647a3 3 0 0 0 2.976 0l23.884-13.647a3 3 0 0 0 1.103-4.117L50.59 4.442c-1.157-1.984-4.025-1.984-5.182 0Z"}),t.createElement("path",{fill:"currentColor",d:"m22.559 59.656 22.983 32.833c1.195 1.706 3.721 1.706 4.916 0L73.44 59.655c.612-.874-.388-1.97-1.315-1.441l-23.63 13.502a1 1 0 0 1-.992 0l-23.63-13.502c-.927-.53-1.927.567-1.315 1.442Z"})),Yr=({title:e,titleId:r,...o})=>t.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{d:"M11.998 0V8.87185L19.4236 12.2225L11.998 0Z",fill:"currentColor",fillOpacity:.8}),t.createElement("path",{d:"M11.998 0L4.57143 12.2225L11.998 8.87185V0Z",fill:"currentColor",fillOpacity:.4}),t.createElement("path",{d:"M11.998 17.9717V24L19.4286 13.6188L11.998 17.9717Z",fill:"currentColor",fillOpacity:.8}),t.createElement("path",{d:"M11.998 24V17.9707L4.57143 13.6188L11.998 24Z",fill:"currentColor",fillOpacity:.4}),t.createElement("path",{d:"M11.998 16.5765L19.4236 12.2226L11.998 8.87386V16.5765Z",fill:"currentColor"}),t.createElement("path",{d:"M4.57143 12.2226L11.998 16.5765V8.87386L4.57143 12.2226Z",fill:"currentColor",fillOpacity:.8})),qr=({title:e,titleId:r,...o})=>t.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{d:"M11.998 0V8.87185L19.4236 12.2225L11.998 0Z",fill:"currentColor",fillOpacity:.602}),t.createElement("path",{d:"M11.998 0L4.57143 12.2225L11.998 8.87185V0Z",fill:"currentColor"}),t.createElement("path",{d:"M11.998 17.9717V24L19.4286 13.6188L11.998 17.9717Z",fill:"currentColor",fillOpacity:.602}),t.createElement("path",{d:"M11.998 24V17.9707L4.57143 13.6188L11.998 24Z",fill:"currentColor"}),t.createElement("path",{d:"M11.998 16.5765L19.4236 12.2226L11.998 8.87386V16.5765Z",fill:"currentColor",fillOpacity:.2}),t.createElement("path",{d:"M4.57143 12.2226L11.998 16.5765V8.87386L4.57143 12.2226Z",fill:"currentColor",fillOpacity:.602})),Xr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M18 4C8.059 4 0 12.059 0 22v52c0 9.941 8.059 18 18 18h20c9.941 0 18-8.059 18-18v-4a6 6 0 0 0-12 0v4a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V22a6 6 0 0 1 6-6h20a6 6 0 0 1 6 6v4a6 6 0 0 0 12 0v-4c0-9.941-8.059-18-18-18H18Z"}),t.createElement("path",{fill:"currentColor",d:"M94.462 52.011a6 6 0 0 0-.471-8.492L74.014 25.54a6 6 0 0 0-8.028 8.92L74.364 42H38a6 6 0 0 0 0 12h36.364l-8.378 7.54a6 6 0 0 0 8.028 8.92l20-18a5.93 5.93 0 0 0 .448-.449Z"})),Kr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 28c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20Zm-8 20a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 12c-11.555 0-21.694 5.905-29.276 12.159C11.051 30.489 5.26 37.783 2.29 41.868a11.23 11.23 0 0 0 0 13.264c2.97 4.085 8.76 11.38 16.434 17.709C26.306 79.095 36.445 85 48 85s21.694-5.905 29.276-12.159c7.673-6.33 13.464-13.624 16.434-17.709a11.23 11.23 0 0 0 0-13.264c-2.97-4.085-8.76-11.38-16.434-17.709C69.694 17.905 59.555 12 48 12ZM26.36 63.584C20.026 58.359 15.054 52.23 12.306 48.5c2.748-3.73 7.72-9.859 14.054-15.084C33.033 27.912 40.5 24 48 24s14.967 3.912 21.64 9.416C75.974 38.641 80.946 44.77 83.694 48.5c-2.748 3.73-7.72 9.859-14.054 15.084C62.967 69.088 55.5 73 48 73s-14.967-3.912-21.64-9.416Z",clipRule:"evenodd"})),Qr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M12.628 48.4C16.224 41.294 27.214 24 48 24c2.766 0 5.328.3 7.703.825a6 6 0 1 0 2.594-11.716A47.514 47.514 0 0 0 48 12C19.107 12 5.122 36.447 1.6 43.625a10.836 10.836 0 0 0 .068 9.702c1.471 2.903 4.368 7.96 8.934 13.14a6 6 0 0 0 9.002-7.934A52.365 52.365 0 0 1 12.628 48.4Zm69.02-14.01a6 6 0 0 1 8.328 1.623 65.09 65.09 0 0 1 4.418 7.602 10.829 10.829 0 0 1-.055 9.698C90.74 60.42 76.733 84 48 84c-1.155 0-2.29-.039-3.404-.114a6 6 0 1 1 .808-11.973c.844.057 1.71.087 2.596.087 20.803 0 31.775-16.72 35.372-23.6a53.684 53.684 0 0 0-3.348-5.682 6 6 0 0 1 1.624-8.329Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M59.723 31.792c-7.82-5.67-18.818-4.982-25.865 2.066-7.047 7.047-7.736 18.045-2.066 25.865L13.757 77.757a6 6 0 1 0 8.486 8.486l64-64a6 6 0 1 0-8.486-8.486L59.723 31.792Zm-8.77 8.77a8.002 8.002 0 0 0-10.39 10.39l10.39-10.39Z",clipRule:"evenodd"})),Jr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M57.028 14.057C50.441 9.079 41 13.779 41 22.036v1.526a6 6 0 0 0 11.591 2.182L82.047 48 52.591 70.256A6.002 6.002 0 0 0 41 72.437v1.527c0 8.257 9.44 12.957 16.028 7.98l34.365-25.965c5.296-4.001 5.296-11.957 0-15.958L57.028 14.057Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M16.028 14.057C9.441 9.079 0 13.779 0 22.036v51.928c0 8.257 9.44 12.957 16.028 7.98l34.365-25.965c5.295-4.001 5.296-11.957 0-15.958L16.028 14.057ZM12 69.947V26.053L41.047 48 12 69.947Z",clipRule:"evenodd"})),eo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 12c-19.551 0-28.246 5.992-31.795 9.614a.644.644 0 0 0-.17.252 1.069 1.069 0 0 0-.034.425c.04.504.312 1.313 1.005 2.145L39.828 51.82A18 18 0 0 1 44 63.345V80a4 4 0 0 0 8 0V63.345a18 18 0 0 1 4.172-11.524l22.822-27.385c.693-.832.965-1.641 1.005-2.145a1.069 1.069 0 0 0-.034-.425.644.644 0 0 0-.17-.252C76.246 17.992 67.55 12 48 12ZM7.633 13.217C13.793 6.93 25.767 0 48 0c22.233 0 34.207 6.93 40.367 13.217 5.966 6.091 3.67 14.31-.155 18.9L65.391 59.505A6 6 0 0 0 64 63.344V80c0 8.837-7.163 16-16 16s-16-7.163-16-16V63.345a6 6 0 0 0-1.39-3.841L7.787 32.118c-3.826-4.591-6.121-12.81-.155-18.9Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),to=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M46.656 17.497C43.927 28.1 38.483 36.16 33.67 42.944l-.736 1.036C26.815 52.6 22.8 58.254 22.8 65.274c0 6.105 2.309 10.44 5.104 13.452.692-15.463 10.033-27.11 13.693-31.144 2.221-2.449 5.547-2.743 8.02-1.496a6.824 6.824 0 0 1 3.719 6.68c-.307 3.637.344 5.865 1.183 7.52.799 1.578 1.788 2.767 3.197 4.46.328.395.679.817 1.055 1.277 1.83 2.238 4.126 5.28 5.066 9.59.142.653.25 1.317.323 1.993 3.734-3.383 5.918-6.822 7.08-10.137 1.932-5.508 1.4-11.69-1.23-18.444-4.32-11.095-13.762-22.356-23.354-31.528ZM36.289 6.802c.363-4.974 6.52-8.732 11.21-4.716 11.96 10.239 27.197 25.897 33.693 42.585 3.304 8.487 4.539 17.74 1.373 26.768-3.178 9.064-10.436 16.893-22.097 23.204-5.36 2.9-11.915-2.301-9.64-8.38 1.623-4.339 1.585-6.714 1.284-8.093-.307-1.41-1.05-2.619-2.63-4.55-.22-.269-.465-.56-.73-.876-1.445-1.72-3.464-4.123-4.939-7.036l-.105-.21c-2.973 5.887-5.09 13.569-2.977 22.02a6.806 6.806 0 0 1-1.878 6.565 6.705 6.705 0 0 1-7.173 1.382c-4.828-1.948-20.88-9.95-20.88-30.19 0-11.019 6.268-19.762 11.71-27.353.466-.648.924-1.288 1.372-1.92 6.033-8.506 11.522-17.041 12.407-29.2Z",clipRule:"evenodd"})),ro=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M16 42a6 6 0 0 1 6-6h16a6 6 0 0 1 0 12H22a6 6 0 0 1-6-6Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M0 18C0 8.059 8.059 0 18 0h24c9.941 0 18 8.059 18 18v18h2c9.941 0 18 8.059 18 18v14c0 1.495.49 2.65 1.028 3.323.53.662.912.677.972.677.06 0 .442-.015.972-.677C83.51 70.649 84 69.495 84 68V32.7L69.726 18.21a6 6 0 0 1 8.548-8.42l14.274 14.488A12 12 0 0 1 96 32.7V68c0 7.518-5.088 16-14 16-8.912 0-14-8.482-14-16V54a6 6 0 0 0-6-6h-2v30c0 9.941-8.059 18-18 18H18C8.059 96 0 87.941 0 78V18Zm48 0a6 6 0 0 0-6-6H18a6 6 0 0 0-6 6v60a6 6 0 0 0 6 6h24a6 6 0 0 0 6-6V18Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),oo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M15.15 21.393c-2.532 3.395-4.032 8.719-2.588 15.928.42 2.092 1.762 5.1 4.15 8.898 2.324 3.699 5.377 7.738 8.779 11.825 6.8 8.17 14.683 16.161 20.12 21.443 1.36 1.32 3.418 1.32 4.778 0 5.437-5.282 13.32-13.273 20.12-21.443 3.402-4.087 6.455-8.126 8.78-11.825 2.387-3.798 3.73-6.806 4.149-8.898 1.444-7.21-.056-12.533-2.587-15.928C78.317 17.996 74.379 16 69.75 16c-7.945 0-11.555 3.295-13.429 6.118-1.03 1.553-1.637 3.143-1.981 4.362-.17.6-.268 1.083-.32 1.388a7.41 7.41 0 0 0-.048.306l-.003.026a6 6 0 0 1-11.943-.026 7.233 7.233 0 0 0-.047-.306 14.078 14.078 0 0 0-.32-1.388c-.345-1.22-.952-2.81-1.982-4.362C37.804 19.295 34.194 16 26.249 16c-4.628 0-8.566 1.996-11.1 5.393ZM48 13.236C52.218 8.194 59.106 4 69.75 4c8.262 0 15.83 3.662 20.72 10.22 4.892 6.559 6.732 15.485 4.734 25.46-.85 4.235-3.11 8.716-5.756 12.926-2.71 4.31-6.122 8.797-9.716 13.115-7.19 8.64-15.415 16.966-20.982 22.374a15.374 15.374 0 0 1-21.5 0C31.683 82.687 23.46 74.36 16.268 65.72c-3.594-4.318-7.007-8.806-9.716-13.115-2.647-4.21-4.907-8.691-5.756-12.927-1.998-9.974-.158-18.9 4.734-25.46C10.42 7.662 17.988 4 26.25 4 36.893 4 43.781 8.194 48 13.236Z",clipRule:"evenodd"})),lo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M69.75 9C49.612 9 48 26.793 48 26.793S46.389 9 26.25 9C13.36 9 3.235 20.44 6.68 37.812c2.635 13.296 25.443 36.739 36 47.007a7.58 7.58 0 0 0 10.64 0c10.557-10.268 33.365-33.71 36-47.007C92.765 20.44 82.64 9 69.75 9Z",opacity:.35}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M15.15 21.393c-2.532 3.395-4.032 8.719-2.588 15.928.42 2.092 1.762 5.1 4.15 8.898 2.324 3.699 5.377 7.738 8.779 11.825 6.8 8.17 14.683 16.161 20.12 21.443 1.36 1.32 3.418 1.32 4.778 0 5.437-5.282 13.32-13.273 20.12-21.443 3.402-4.087 6.455-8.126 8.78-11.825 2.387-3.798 3.73-6.806 4.149-8.898 1.444-7.21-.056-12.533-2.587-15.928C78.317 17.996 74.379 16 69.75 16c-7.945 0-11.555 3.295-13.429 6.118-1.03 1.553-1.637 3.143-1.981 4.362-.17.6-.268 1.083-.32 1.388-.027.152-.041.256-.048.306l-.003.026a6 6 0 0 1-11.94 0l-.003-.026a7.596 7.596 0 0 0-.047-.306 14.078 14.078 0 0 0-.32-1.388c-.345-1.22-.952-2.81-1.982-4.362C37.804 19.295 34.194 16 26.249 16c-4.628 0-8.566 1.996-11.1 5.393ZM48 13.236C52.218 8.194 59.106 4 69.75 4c8.262 0 15.83 3.662 20.72 10.22 4.892 6.559 6.732 15.485 4.734 25.46-.85 4.235-3.11 8.716-5.756 12.926-2.71 4.31-6.122 8.797-9.716 13.115-7.19 8.64-15.415 16.966-20.982 22.374a15.374 15.374 0 0 1-21.5 0C31.683 82.687 23.46 74.36 16.268 65.72c-3.594-4.318-7.007-8.806-9.716-13.115-2.647-4.21-4.907-8.691-5.756-12.927-1.998-9.974-.158-18.9 4.734-25.46C10.42 7.662 17.988 4 26.25 4 36.893 4 43.781 8.194 48 13.236Z",clipRule:"evenodd"})),ao=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M51.905 5.444a6 6 0 0 0-7.81 0l-42 36a6 6 0 1 0 7.81 9.111L48 17.903l38.095 32.654a6 6 0 1 0 7.81-9.111l-42-36Z"}),t.createElement("path",{fill:"currentColor",d:"M28 58a6 6 0 0 0-12 0v16c0 9.941 8.059 18 18 18h28c9.941 0 18-8.059 18-18V58a6 6 0 0 0-12 0v16a6 6 0 0 1-6 6H34a6 6 0 0 1-6-6V58Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),bt=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M54 26a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm0 16a6 6 0 0 0-10.633-3.812c-.758.921-2.302 1.963-4.176 2.867a26.883 26.883 0 0 1-2.823 1.166l-.142.047-.02.006A6 6 0 0 0 39.78 53.73l-1.766-5.687c1.766 5.687 1.768 5.687 1.768 5.687l.003-.001.005-.002.012-.004.033-.01a18.325 18.325 0 0 0 .395-.13 32.899 32.899 0 0 0 1.771-.66V70a6 6 0 0 0 12 0V42Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Zm0-12c19.882 0 36-16.118 36-36S67.882 12 48 12 12 28.118 12 48s16.118 36 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),no=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M91.243 10.243a6 6 0 1 0-8.486-8.486L41.21 43.305A27.877 27.877 0 0 0 28 40C12.536 40 0 52.536 0 68s12.536 28 28 28 28-12.536 28-28a27.877 27.877 0 0 0-5.648-16.867L66.5 34.985l3.257 3.258a6 6 0 1 0 8.486-8.486L74.985 26.5l3.515-3.515 3.257 3.258a6 6 0 1 0 8.486-8.486L86.985 14.5l4.258-4.257ZM12 68c0-8.837 7.163-16 16-16s16 7.163 16 16-7.163 16-16 16-16-7.163-16-16Z",clipRule:"evenodd"})),io=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M32 18a6 6 0 0 0-12 0v6h-5.86a6.126 6.126 0 0 0-.278 0H6a6 6 0 0 0 0 12h3.712c2.253 6.237 4.715 11.368 8.034 15.918-1.975 1.619-4.277 3.27-7.018 5.053a6 6 0 0 0 6.544 10.058c3.264-2.123 6.15-4.197 8.728-6.367 2.577 2.17 5.464 4.244 8.728 6.367a6 6 0 0 0 6.544-10.058c-2.74-1.783-5.043-3.434-7.018-5.053 3.319-4.55 5.78-9.68 8.034-15.918H46a6 6 0 0 0 0-12h-7.862a6.126 6.126 0 0 0-.278 0H32v-6Zm-6 24.71c-1.213-1.947-2.326-4.136-3.413-6.71h6.826c-1.087 2.574-2.2 4.763-3.413 6.71Zm50.158-2.936c-2.646-4.895-9.67-4.895-12.316 0l-19.12 35.373a6 6 0 1 0 10.556 5.706L57.901 76h24.197l2.624 4.853a6 6 0 1 0 10.556-5.706l-19.12-35.373ZM70 53.618 75.612 64H64.388L70 53.618Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),co=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"m7.757 52.243 34 34a6 6 0 1 0 8.486-8.486L26.485 54H84a6 6 0 0 0 0-12H26.485l23.758-23.757a6 6 0 1 0-8.486-8.486L7.772 43.743l-.015.014a6 6 0 0 0 0 8.486Z"})),so=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M25.757 52.243a6 6 0 0 1 0-8.486l30-30a6 6 0 1 1 8.486 8.486L38.485 48l25.758 25.757a6 6 0 1 1-8.486 8.486l-30-30Z",clipRule:"evenodd"})),uo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M96 48c0 26.51-21.49 48-48 48S0 74.51 0 48 21.49 0 48 0s48 21.49 48 48Zm-12 0a35.836 35.836 0 0 1-6.656 20.86l-8.667-8.668A23.89 23.89 0 0 0 72 48c0-4.46-1.217-8.637-3.337-12.215l8.666-8.666A35.835 35.835 0 0 1 84 48ZM68.837 18.64A35.836 35.836 0 0 0 48 12a35.836 35.836 0 0 0-20.86 6.655l8.668 8.668A23.89 23.89 0 0 1 48 24c4.441 0 8.6 1.206 12.168 3.31l8.67-8.67ZM48 84a35.836 35.836 0 0 0 20.86-6.656l-8.668-8.667A23.89 23.89 0 0 1 48 72c-4.46 0-8.637-1.217-12.215-3.337l-8.666 8.666A35.835 35.835 0 0 0 48 84ZM18.64 68.837A35.836 35.836 0 0 1 12 48a35.836 35.836 0 0 1 6.655-20.86l8.668 8.668A23.89 23.89 0 0 0 24 48c0 4.441 1.206 8.6 3.31 12.168l-8.67 8.67ZM36 48c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12-12-5.373-12-12Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),po=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"m49.757 53.272-1.514-1.515a6 6 0 1 0-8.486 8.486l1.515 1.514c7.03 7.03 18.427 7.03 25.456 0l23.03-23.029c7.029-7.03 7.029-18.427 0-25.456l-6.03-6.03c-7.03-7.029-18.426-7.029-25.456 0l-9.515 9.515a6 6 0 1 0 8.486 8.486l9.514-9.515a6 6 0 0 1 8.486 0l6.03 6.03a6 6 0 0 1 0 8.485l-23.03 23.03a6 6 0 0 1-8.486 0Z"}),t.createElement("path",{fill:"currentColor",d:"m46.243 42.728 1.514 1.515a6 6 0 0 0 8.486-8.486l-1.515-1.514c-7.03-7.03-18.427-7.03-25.456 0l-23.03 23.03c-7.029 7.029-7.029 18.425 0 25.455l6.03 6.03c7.03 7.029 18.427 7.029 25.456 0l9.515-9.515a6 6 0 1 0-8.486-8.486l-9.514 9.515a6 6 0 0 1-8.486 0l-6.03-6.03a6 6 0 0 1 0-8.485l23.03-23.03a6 6 0 0 1 8.486 0Z"})),fo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M14 28a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 26a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm6 20a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm14-58a6 6 0 0 0 0 12h48a6 6 0 0 0 0-12H34Zm-6 58a6 6 0 0 1 6-6h48a6 6 0 0 1 0 12H34a6 6 0 0 1-6-6Zm6-32a6 6 0 0 0 0 12h48a6 6 0 0 0 0-12H34Z",clipRule:"evenodd"})),go=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M94.243 60.757a6 6 0 0 0-8.486 0L78 68.515V14a6 6 0 0 0-12 0v54.515l-7.757-7.758a6 6 0 0 0-8.486 8.486l18 18a6.002 6.002 0 0 0 8.486 0l18-18a6 6 0 0 0 0-8.486ZM6 28a6 6 0 0 1 0-12h44a6 6 0 0 1 0 12H6ZM0 74a6 6 0 0 0 6 6h28a6 6 0 0 0 0-12H6a6 6 0 0 0-6 6Zm6-20a6 6 0 0 1 0-12h36a6 6 0 0 1 0 12H6Z"})),mo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M94.243 35.243a6 6 0 0 1-8.486 0L78 27.485V82a6 6 0 0 1-12 0V27.485l-7.757 7.758a6 6 0 1 1-8.486-8.486l18-18a6.002 6.002 0 0 1 8.486 0l18 18a6 6 0 0 1 0 8.486ZM6 68a6 6 0 0 0 0 12h44a6 6 0 0 0 0-12H6ZM0 22a6 6 0 0 1 6-6h28a6 6 0 0 1 0 12H6a6 6 0 0 1-6-6Zm6 20a6 6 0 0 0 0 12h36a6 6 0 0 0 0-12H6Z"})),bo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M48 56a6 6 0 0 1 6 6v4a6 6 0 0 1-12 0v-4a6 6 0 0 1 6-6Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 0C34.745 0 24 10.745 24 24v8.11C15 33.105 8 40.735 8 50v28c0 9.941 8.059 18 18 18h44c9.941 0 18-8.059 18-18V50c0-9.265-7-16.895-16-17.89V24C72 10.745 61.255 0 48 0Zm12 32v-8c0-6.627-5.373-12-12-12s-12 5.373-12 12v8h24ZM26 44a6 6 0 0 0-6 6v28a6 6 0 0 0 6 6h44a6 6 0 0 0 6-6V50a6 6 0 0 0-6-6H26Z",clipRule:"evenodd"})),ho=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M48 42c0-5.523-4.477-10-10-10a6 6 0 0 1 0-12c12.15 0 22 9.85 22 22a6 6 0 0 1-12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M72.209 63.724A39.82 39.82 0 0 0 80 40C80 17.909 62.091 0 40 0S0 17.909 0 40s17.909 40 40 40a39.82 39.82 0 0 0 23.724-7.791l18.033 18.034a6 6 0 1 0 8.486-8.486L72.209 63.723ZM40 68c15.464 0 28-12.536 28-28S55.464 12 40 12 12 24.536 12 40s12.536 28 28 28Z",clipRule:"evenodd"})),$o=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("circle",{cx:40,cy:40,r:32,fill:"currentColor",opacity:.35}),t.createElement("path",{fill:"currentColor",d:"M48 42c0-5.523-4.477-10-10-10a6 6 0 0 1 0-12c12.15 0 22 9.85 22 22a6 6 0 0 1-12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M72.209 63.724A39.82 39.82 0 0 0 80 40C80 17.909 62.091 0 40 0S0 17.909 0 40s17.909 40 40 40a39.82 39.82 0 0 0 23.724-7.791l18.033 18.034a6 6 0 1 0 8.486-8.486L72.209 63.723ZM40 68c15.464 0 28-12.536 28-28S55.464 12 40 12 12 24.536 12 40s12.536 28 28 28Z",clipRule:"evenodd"})),wo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M56.86 65.344A35.836 35.836 0 0 1 36 72C16.118 72 0 55.882 0 36S16.118 0 36 0s36 16.118 36 36a35.836 35.836 0 0 1-6.656 20.86l25.899 25.897a6 6 0 1 1-8.486 8.486L56.86 65.345ZM60 36c0 13.255-10.745 24-24 24S12 49.255 12 36s10.745-24 24-24 24 10.745 24 24Z",clipRule:"evenodd"})),vo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 20c-9.941 0-18 8.059-18 18s8.059 18 18 18 18-8.059 18-18-8.059-18-18-18Zm-6 18a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 0C26.235 0 9 18.302 9 40.362c0 15.652 9.428 29.58 17.903 38.996a111.319 111.319 0 0 0 11.985 11.444 73.582 73.582 0 0 0 4.136 3.174c.52.366 1.019.699 1.449.958.19.115.508.3.872.47.145.067.56.258 1.106.4a6.04 6.04 0 0 0 5.347-1.162l.21-.157a118.055 118.055 0 0 0 5.135-4.032c3.26-2.706 7.593-6.586 11.933-11.358C77.548 69.78 87 56.036 87 40.362 87 18.302 69.766 0 48 0ZM21 40.362C21 24.467 33.315 12 48 12s27 12.467 27 28.362c0 11.051-6.865 21.933-14.801 30.658-3.864 4.249-7.76 7.742-10.721 10.201-.597.496-1.155.949-1.666 1.356a79.24 79.24 0 0 1-1.322-1.06A99.3 99.3 0 0 1 35.822 71.33C27.888 62.515 21 51.435 21 40.362Zm22.672 45.477a6.102 6.102 0 0 1 .488-.455l-.004.004c-.04.033-.25.208-.483.451Zm7.013-1.172-.017-.01a.598.598 0 0 0 .015.009h.002Z",clipRule:"evenodd"})),yo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M8 22a6 6 0 0 1 6-6h68a6 6 0 0 1 0 12H14a6 6 0 0 1-6-6Zm0 52a6 6 0 0 1 6-6h68a6 6 0 0 1 0 12H14a6 6 0 0 1-6-6Zm6-32a6 6 0 0 0 0 12h68a6 6 0 0 0 0-12H14Z",clipRule:"evenodd"})),Eo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M88 48a6 6 0 0 1-6 6H14a6 6 0 0 1 0-12h68a6 6 0 0 1 6 6Z",clipRule:"evenodd"})),xo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M84 48c0 19.882-16.118 36-36 36S12 67.882 12 48s16.118-36 36-36 36 16.118 36 36Zm12 0c0 26.51-21.49 48-48 48S0 74.51 0 48 21.49 0 48 0s48 21.49 48 48Zm-28 6a6 6 0 0 0 0-12H28a6 6 0 0 0 0 12h40Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Co=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M76 6a6 6 0 0 0-12 0v8a6 6 0 0 0 12 0V6Zm0 32a6 6 0 0 0-12 0v8a6 6 0 0 0 12 0v-8Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M31.438 8.117a8.158 8.158 0 0 1 2.68 8.252A37.596 37.596 0 0 0 33 25.5C33 46.21 49.79 63 70.5 63c3.157 0 6.214-.389 9.13-1.118a8.158 8.158 0 0 1 8.253 2.68c1.942 2.328 2.665 6.005.595 9.245C79.963 87.14 65.018 96 48 96 21.49 96 0 74.51 0 48 0 30.982 8.861 16.037 22.193 7.522c3.24-2.07 6.917-1.347 9.245.595Zm-10.42 16.05A35.858 35.858 0 0 0 12 48c0 19.882 16.118 36 36 36a35.858 35.858 0 0 0 23.834-9.018c-.444.012-.888.018-1.334.018C43.162 75 21 52.838 21 25.5c0-.446.006-.89.018-1.334Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M96 26a6 6 0 0 1-6 6h-8a6 6 0 0 1 0-12h8a6 6 0 0 1 6 6Zm-32 0a6 6 0 0 1-6 6h-8a6 6 0 0 1 0-12h8a6 6 0 0 1 6 6Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),ko=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M54 6a6 6 0 0 0-12 0v8a6 6 0 0 0 12 0V6Z"}),t.createElement("path",{fill:"currentColor",d:"M88 26c0-9.941-8.059-18-18-18h-4a6 6 0 0 0 0 12h4a6 6 0 0 1 6 6v52a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6V26a6 6 0 0 1 6-6h4a6 6 0 0 0 0-12h-4C16.059 8 8 16.059 8 26v52c0 9.941 8.059 18 18 18h44c9.941 0 18-8.059 18-18V26Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 24c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16Zm-4 16a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M42.106 73.05c-1.094.489-1.673 1.014-1.968 1.295a6 6 0 0 1-8.276-8.69C33.92 63.695 38.697 60 48 60s14.08 3.695 16.138 5.655a6 6 0 1 1-8.276 8.69c-.295-.281-.874-.806-1.968-1.295C52.786 72.556 50.925 72 48 72c-2.925 0-4.786.556-5.894 1.05Z"})),So=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M50 4a6 6 0 0 0 0 12h21.515L33.757 53.757a6 6 0 1 0 8.486 8.486L80 24.485V46a6 6 0 0 0 12 0V10a6 6 0 0 0-6-6H50Z"}),t.createElement("path",{fill:"currentColor",d:"M16 42a6 6 0 0 1 6-6h8a6 6 0 0 0 0-12h-8c-9.941 0-18 8.059-18 18v32c0 9.941 8.059 18 18 18h32c9.941 0 18-8.059 18-18v-8a6 6 0 0 0-12 0v8a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6V42Z"})),Ro=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M76 28c0 15.464-12.536 28-28 28S20 43.464 20 28 32.536 0 48 0s28 12.536 28 28Zm-12 0c0 8.837-7.163 16-16 16s-16-7.163-16-16 7.163-16 16-16 16 7.163 16 16Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M12.915 93.44C16.421 88.434 26.044 76 48 76c21.957 0 31.58 12.433 35.085 17.44a6 6 0 0 0 9.83-6.88C88.421 80.137 75.643 64 48 64S7.58 80.138 3.085 86.56a6 6 0 0 0 9.83 6.88Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Po=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("circle",{cx:48,cy:28,r:22,fill:"currentColor",opacity:.35}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M76 28c0 15.464-12.536 28-28 28S20 43.464 20 28 32.536 0 48 0s28 12.536 28 28Zm-12 0c0 8.837-7.163 16-16 16s-16-7.163-16-16 7.163-16 16-16 16 7.163 16 16Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M12.915 93.44C16.421 88.434 26.044 76 48 76c21.957 0 31.58 12.433 35.085 17.44a6 6 0 0 0 9.83-6.88C88.421 80.137 75.643 64 48 64S7.58 80.138 3.085 86.56a6 6 0 0 0 9.83 6.88Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Lo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M72 6a6 6 0 0 1 12 0v6h6a6 6 0 0 1 0 12h-6v6a6 6 0 0 1-12 0v-6h-6a6 6 0 0 1 0-12h6V6Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M60 38c0 12.15-9.85 22-22 22s-22-9.85-22-22 9.85-22 22-22 22 9.85 22 22Zm-12 0c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M10.915 93.44C13.621 89.577 21.003 80 38 80c16.996 0 24.38 9.576 27.085 13.44a6 6 0 0 0 9.83-6.88C71.221 81.28 60.683 68 38 68 15.316 68 4.78 81.281 1.085 86.56a6 6 0 0 0 9.83 6.88Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Vo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M54 14a6 6 0 0 0-12 0v28H14a6 6 0 0 0 0 12h28v28a6 6 0 0 0 12 0V54h28a6 6 0 0 0 0-12H54V14Z",clipRule:"evenodd"})),Zo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M48 22a6 6 0 0 1 6 6v14h14a6 6 0 0 1 0 12H54v14a6 6 0 0 1-12 0V54H28a6 6 0 0 1 0-12h14V28a6 6 0 0 1 6-6Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Zm0-12c19.882 0 36-16.118 36-36S67.882 12 48 12 12 28.118 12 48s16.118 36 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Mo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M44.017 33.972c-.013.034-.017.045-.017.028a6 6 0 0 1-12 0c0-7.69 6.996-14 16-14s16 6.31 16 14c0 3.485-.992 6.44-2.891 8.795-1.774 2.2-3.981 3.413-5.456 4.14-.408.201-1.003.477-1.437.678l-.47.22-.037.017A6 6 0 0 1 42 46c.001-3.848 2.19-6.284 4.162-7.642.872-.6 1.769-1.046 2.421-1.358.398-.19.665-.312.9-.42.28-.127.513-.234.865-.408 1.025-.505 1.318-.782 1.42-.909a.612.612 0 0 0 .107-.213c.046-.138.126-.458.126-1.05 0 .017-.004.006-.017-.028C51.885 33.703 51.258 32 48 32s-3.884 1.703-3.983 1.972Zm8.947 14.272c-.007.005-.007.005 0 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M54 62a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 88c26.51 0 48-19.7 48-44S74.51 0 48 0 0 19.7 0 44c0 12.22 5.435 23.278 14.21 31.25 1.108 1.007 1.79 2.414 1.79 3.912v10.87c0 3.688 3.854 6.106 7.174 4.503l13.846-6.687a5.27 5.27 0 0 1 3.085-.44c2.569.39 5.206.592 7.895.592Zm36-44c0 16.712-15.114 32-36 32a40.63 40.63 0 0 1-6.095-.457c-3.246-.492-6.794-.099-10.103 1.5l-3.804 1.836c-.084-5.078-2.413-9.507-5.718-12.51C15.769 60.453 12 52.53 12 44c0-16.712 15.113-32 36-32 20.886 0 36 15.288 36 32Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Go=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M42.951 33.266C42.486 33.672 42 34.396 42 36a6 6 0 0 1-12 0c0-4.395 1.514-8.673 5.049-11.765C38.479 21.233 43.066 20 48 20c4.934 0 9.521 1.233 12.951 4.235C64.486 27.326 66 31.605 66 36c0 4.089-1.055 7.432-3.112 10.117-1.913 2.498-4.359 3.937-5.865 4.816-1.831 1.068-2.369 1.391-2.74 1.793a.13.13 0 0 1-.009.009C54.22 52.783 54 52.976 54 54a6 6 0 0 1-12 0c0-3.9 1.247-7.009 3.466-9.413 1.688-1.829 3.846-3.065 5.115-3.792.144-.082.277-.158.396-.228 1.494-.871 2.048-1.306 2.385-1.747.193-.252.638-.909.638-2.82 0-1.605-.486-2.327-.951-2.734C52.479 32.766 51.066 32 48 32c-3.066 0-4.479.767-5.049 1.266ZM48 76a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Zm0-12c19.882 0 36-16.118 36-36S67.882 12 48 12 12 28.118 12 48s16.118 36 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),To=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"m88.243 43.757-34-34a6 6 0 1 0-8.486 8.486L69.516 42H12a6 6 0 1 0 0 12h57.515L45.757 77.757a6 6 0 0 0 8.486 8.486l33.985-33.986.015-.014a6 6 0 0 0 0-8.486Z"})),Bo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M70.243 43.757a6 6 0 0 1 0 8.486l-30 30a6 6 0 1 1-8.486-8.486L57.515 48 31.757 22.243a6 6 0 1 1 8.486-8.486l30 30Z",clipRule:"evenodd"})),Oo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M26.22 35.09C26.22 15.93 41.752.4 60.91.4c3.183 0 6.275.43 9.216 1.24 7.392 2.032 7.938 10.632 3.718 14.853L61.8 28.536v5.663h5.663l12.043-12.042c4.22-4.221 12.82-3.675 14.854 3.716a34.723 34.723 0 0 1 1.24 9.217c0 19.159-15.531 34.69-34.69 34.69-2.969 0-5.857-.375-8.618-1.08L30.568 90.423c-6.902 6.901-18.09 6.901-24.992 0-6.901-6.901-6.901-18.09 0-24.992l21.725-21.724a34.745 34.745 0 0 1-1.08-8.618Zm27.925 31.756a.09.09 0 0 0 .003-.003L51.005 63.7l3.143 3.143-.003.003ZM60.91 12.4c-12.531 0-22.69 10.159-22.69 22.69 0 2.611.439 5.107 1.242 7.426 1 2.891.109 5.892-1.82 7.82l-23.58 23.582a5.672 5.672 0 0 0 8.02 8.02l23.581-23.58c1.929-1.929 4.93-2.82 7.821-1.82a22.65 22.65 0 0 0 7.426 1.242c12.531 0 22.69-10.159 22.69-22.69v-.056l-8.47 8.47a9.2 9.2 0 0 1-6.506 2.695H59a9.2 9.2 0 0 1-9.2-9.2v-9.623a9.2 9.2 0 0 1 2.695-6.505l8.47-8.47-.056-.001Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Ho=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M36.16 1.797c3.055 1.83 5.04 5.222 5.04 9.049v16.875l6.8 4.387 6.8-4.387V10.846c0-3.827 1.985-7.218 5.04-9.049 3.184-1.907 7.414-2 10.877.587C79.982 9.302 86 20.373 86 32.848c0 15.437-9.204 28.712-22.4 34.659V89.6a6 6 0 0 1-12 0V66.907c0-4.841 3.139-8.606 6.876-10.254C67.63 52.617 74 43.47 74 32.848a25.9 25.9 0 0 0-7.2-17.96v13.487a10.8 10.8 0 0 1-4.945 9.075l-8 5.161a10.8 10.8 0 0 1-11.71 0l-8-5.16a10.8 10.8 0 0 1-4.945-9.076V14.887A25.9 25.9 0 0 0 22 32.848c0 10.19 5.86 19.021 14.422 23.288 3.504 1.746 6.378 5.407 6.378 10.028V89.6a6 6 0 0 1-12 0V66.74C18.469 60.472 10 47.654 10 32.848c0-12.475 6.018-23.546 15.283-30.464C28.746-.202 32.976-.11 36.16 1.797Z",clipRule:"evenodd"})),Ao=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M54 6a6 6 0 0 0-12 0v8a6 6 0 0 0 12 0V6Zm0 76a6 6 0 0 0-12 0v8a6 6 0 0 0 12 0v-8Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M28 48c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20Zm20-8a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M81.941 14.059a6 6 0 0 1 0 8.485l-5.657 5.657a6 6 0 1 1-8.485-8.485l5.657-5.657a6 6 0 0 1 8.485 0Zm-53.74 53.74a6 6 0 0 1 0 8.485l-5.657 5.657a6 6 0 1 1-8.485-8.485l5.657-5.657a6 6 0 0 1 8.485 0ZM90 54a6 6 0 0 0 0-12h-8a6 6 0 0 0 0 12h8Zm-76 0a6 6 0 0 0 0-12H6a6 6 0 0 0 0 12h8Zm67.941 27.941a6 6 0 0 1-8.485 0l-5.657-5.657a6 6 0 1 1 8.485-8.485l5.657 5.657a6 6 0 0 1 0 8.485Zm-53.74-53.74a6 6 0 0 1-8.485 0l-5.657-5.657a6 6 0 1 1 8.485-8.485l5.657 5.657a6 6 0 0 1 0 8.485Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),ht=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"m43.757 7.757-34 34a6 6 0 0 0 8.486 8.486L42 26.485V84a6 6 0 0 0 12 0V26.485l23.757 23.758a6 6 0 0 0 8.486-8.486L52.257 7.772l-.014-.015a6 6 0 0 0-8.486 0Z"})),jo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M43.757 25.757a6 6 0 0 1 8.486 0l30 30a6 6 0 1 1-8.486 8.486L48 38.485 22.243 64.243a6 6 0 1 1-8.486-8.486l30-30Z",clipRule:"evenodd"})),Fo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M54 68V42.485l6.757 6.758a6 6 0 1 0 8.486-8.486l-17-17a6.002 6.002 0 0 0-8.491.006L26.757 40.757a6 6 0 1 0 8.486 8.486L42 42.485V68a6 6 0 0 0 12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M96 48c0 26.51-21.49 48-48 48S0 74.51 0 48 21.49 0 48 0s48 21.49 48 48Zm-12 0c0 19.882-16.118 36-36 36S12 67.882 12 48s16.118-36 36-36 36 16.118 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),$t=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M24 12a6 6 0 0 0 0 12h39.515L13.757 73.757a6 6 0 1 0 8.486 8.486L72 32.485V72a6 6 0 0 0 12 0V19c0-.175-.006-.349-.02-.52a5.986 5.986 0 0 0-1.737-4.723 5.987 5.987 0 0 0-4.722-1.738A7.065 7.065 0 0 0 77 12H24Z"})),Do=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M18 8C8.059 8 0 16.059 0 26v44c0 9.941 8.059 18 18 18h60c9.941 0 18-8.059 18-18V26c0-9.941-8.059-18-18-18H18Zm66 24v-6a6 6 0 0 0-6-6H18a6 6 0 0 0-6 6v44a6 6 0 0 0 6 6h60a6 6 0 0 0 6-6v-6h-8c-8.837 0-16-7.163-16-16s7.163-16 16-16h8Zm0 20h-8a4 4 0 0 1 0-8h8v8Z",clipRule:"evenodd"})),Na=s.default.div(()=>l.css`
    position: relative;
  `),Wa=s.default.div(({theme:e,$disabled:r,$size:o})=>l.css`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: ${e.fontWeights.extraBold};

    color: ${e.colors.accent};

    ${r&&l.css`
      color: ${e.colors.greyLight};
    `}

    #countdown-complete-check {
      stroke-width: ${e.borderWidths["1.5"]};
      overflow: visible;
      display: block;
    }

    ${()=>{switch(o){case"small":return l.css`
            height: ${e.space[16]};
            width: ${e.space[16]};
          `;case"large":return l.css`
            font-size: ${e.fontSizes.extraLarge};
            line-height: ${e.lineHeights.extraLarge};
            margin-top: -${e.space["0.5"]};
            height: ${e.space[24]};
            width: ${e.space[24]};
          `;default:return""}}}
  `),_a=s.default.div(({theme:e,$disabled:r,$size:o,$color:a})=>l.css`
    stroke: ${e.colors.accent};

    color: ${e.colors[a]};

    ${r&&l.css`
      color: ${e.colors.greyLight};
    `}

    ${()=>{switch(o){case"small":return l.css`
            height: ${e.space[16]};
            width: ${e.space[16]};
            stroke-width: ${e.space[1]};
          `;case"large":return l.css`
            height: ${e.space[24]};
            width: ${e.space[24]};
            stroke-width: ${e.space[1]};
          `;default:return""}}}
  `),Ia=s.default.circle(({$finished:e})=>l.css`
    transition: all 1s linear, stroke-width 0.2s ease-in-out 1s;

    ${e&&l.css`
      stroke-width: 0;
    `}
  `),wt=t.forwardRef(({accessibilityLabel:e,color:r="textSecondary",size:o="small",countdownSeconds:a,startTimestamp:i,disabled:n,callback:c,...u},d)=>{const p=t.useMemo(()=>Math.ceil((i||Date.now())/1e3),[i]),h=t.useMemo(()=>p+a,[p,a]),f=t.useCallback(()=>Math.max(h-Math.ceil(Date.now()/1e3),0),[h]),[g,$]=t.useState(a);return t.useEffect(()=>{if(!n){$(f());const x=setInterval(()=>{const b=f();b===0&&(clearInterval(x),c&&c()),$(b)},1e3);return()=>clearInterval(x)}},[f,c,a,n]),t.createElement(Na,{...u,"data-testid":re(u,"countdown-circle")},t.createElement(Wa,{$size:o,$disabled:n},n&&a,!n&&(g>0?g:t.createElement(Ze,{"data-testid":"countdown-complete-check",id:"countdown-complete-check"}))),t.createElement(_a,{$color:r,$disabled:n,$size:o,ref:d},e&&t.createElement(ge,null,e),t.createElement("svg",{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},t.createElement(Ia,{$finished:g===0,cx:"12",cy:"12",fill:"none",r:"9",strokeDasharray:`${48*(g/a)}, 56`,strokeLinecap:"round"}),t.createElement("circle",{cx:"12",cy:"12",fill:"none",opacity:n?"1":"0.25",r:"9",strokeLinecap:"round"}))))});wt.displayName="CountdownCircle";const er={extraSmall:{width:"22.5",height:"7"},small:{width:"26",height:"10"},medium:{width:"32",height:"12"}},ne={extraSmall:{width:"10",height:"5.5",translateX:"5"},small:{width:"12",height:"8",translateX:"6"},medium:{width:"15",height:"10",translateX:"7.5"}},Ua=s.default.div(({theme:e,$size:r})=>l.css`
    position: relative;
    width: fit-content;

    label {
      position: absolute;
      left: 50%;
      top: 50%;
      width: ${e.space[ne[r].width]};
      height: ${e.space[ne[r].height]};
      font-size: ${e.fontSizes.small};
      font-weight: ${r==="extraSmall"?e.fontWeights.normal:e.fontWeights.bold};
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.1s linear;
      cursor: pointer;
    }

    label#eth {
      color: ${e.colors.textAccent};
      transform: translate(-50%, -50%)
        translateX(-${e.space[ne[r].translateX]});
    }

    label#fiat {
      color: ${e.colors.greyPrimary};
      transform: translate(-50%, -50%)
        translateX(${e.space[ne[r].translateX]});
    }

    input[type='checkbox']:checked ~ label#eth {
      color: ${e.colors.greyPrimary};
    }

    input[type='checkbox']:checked ~ label#fiat {
      color: ${e.colors.textAccent};
    }

    input[type='checkbox']:disabled ~ label#eth {
      color: ${e.colors.backgroundPrimary};
    }

    input[type='checkbox']:disabled ~ label#fiat {
      color: ${e.colors.greyPrimary};
    }

    input[type='checkbox']:disabled:checked ~ label#fiat {
      color: ${e.colors.backgroundPrimary};
    }

    input[type='checkbox']:disabled:checked ~ label#eth {
      color: ${e.colors.greyPrimary};
    }

    input[type='checkbox']:disabled ~ label {
      cursor: not-allowed;
    }
  `),Ya=s.default.input(({theme:e,$size:r="medium"})=>l.css`
    position: relative;
    background-color: ${e.colors.greySurface};
    height: ${e.space[er[r].height]};
    width: ${e.space[er[r].width]};
    border-radius: ${r==="extraSmall"?e.radii.full:e.radii.large};

    display: flex;
    align-items: center;
    justify-content: center;

    &::after {
      content: '';
      display: block;
      position: absolute;
      background-color: ${e.colors.bluePrimary};
      width: ${e.space[ne[r].width]};
      height: ${e.space[ne[r].height]};
      border-radius: ${r==="extraSmall"?e.radii.full:e.space["1.5"]};
      transform: translateX(-${e.space[ne[r].translateX]});
      transition: transform 0.3s ease-in-out, background-color 0.1s ease-in-out;
    }

    &:checked::after {
      transform: translateX(${e.space[ne[r].translateX]});
    }

    &:disabled::after {
      background-color: ${e.colors.greyPrimary};
    }
  `),vt=t.forwardRef(({size:e="medium",disabled:r,fiat:o="usd",...a},i)=>{const n=ct();return t.createElement(Ua,{$size:e},t.createElement(Ya,{disabled:r,id:n,ref:i,type:"checkbox",...a,$size:e}),t.createElement("label",{htmlFor:n,id:"eth"},"ETH"),t.createElement("label",{htmlFor:n,id:"fiat"},o.toLocaleUpperCase()))});vt.displayName="CurrencyToggle";const qa=s.default.div(()=>l.css`
    max-width: max-content;
    position: relative;
  `),Xa=s.default.div(({theme:e,$opened:r,$inner:o,$shortThrow:a,$align:i,$labelAlign:n,$direction:c})=>l.css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: ${e.space[1]};
    position: absolute;

    ${c==="up"&&l.css`
      bottom: 100%;
    `}

    ${n&&l.css`
      & > button {
        justify-content: ${n};
      }
    `}

    ${r?l.css`
          visibility: visible;
          opacity: 1;
        `:l.css`
          z-index: 1;
          visibility: hidden;
          opacity: 0;
        `}

    padding: ${e.space["1.5"]};
    background-color: ${e.colors.background};
    border-radius: ${e.radii["2xLarge"]};

    ${o?l.css`
      border-radius: ${e.radii.almostExtraLarge};
      border-${c==="down"?"top":"bottom"}-left-radius: none;
      border-${c==="down"?"top":"bottom"}-right-radius: none;
      border-width: ${e.space.px};
      border-${c==="down"?"top":"bottom"}-width: 0;
      border-color: ${e.colors.border};
      padding: 0 ${e.space["1.5"]};
      padding-${c==="down"?"top":"bottom"}: ${e.space["2.5"]};
      padding-${c==="down"?"bottom":"top"}: ${e.space["1.5"]};
      margin-${c==="down"?"top":"bottom"}: -${e.space["2.5"]};
      transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6);
    `:l.css`
          border: 1px solid ${e.colors.border};
        `}

    ${()=>r?l.css`
          transition: all 0.35s cubic-bezier(1, 0, 0.22, 1.6), width 0s linear,
            z-index 0s linear 0.35s;
        `:l.css`
        transition: all 0.35s cubic-bezier(1, 0, 0.22, 1.6), width 0s linear,
          z-index 0s linear 0s;
      `}

    ${()=>{if(!r&&!a)return l.css`
          margin-${c==="down"?"top":"bottom"}: calc(-1 * ${e.space[12]});
        `;if(!r&&a)return l.css`
          margin-${c==="down"?"top":"bottom"}: calc(-1 * ${e.space["2.5"]});
        `;if(r&&!o)return l.css`
          z-index: 20;
          margin-${c==="down"?"top":"bottom"}: ${e.space["1.5"]};
        `}}

  ${i==="left"?l.css`
          left: 0;
        `:l.css`
          right: 0;
        `}
  `),tr=s.default.button(({theme:e,$inner:r,$hasColor:o,$color:a,disabled:i})=>l.css`
    align-items: center;
    cursor: pointer;
    display: flex;
    gap: ${e.space[2]};
    width: ${e.space.full};
    height: ${e.space[12]};
    padding: ${e.space[3]};
    border-radius: ${e.radii.large};
    font-weight: ${e.fontWeights.normal};
    transition-duration: 0.15s;
    transition-property: color, transform, filter;
    transition-timing-function: ease-in-out;

    &:active {
      transform: translateY(0px);
      filter: brightness(1);
    }

    color: ${e.colors[a||"textPrimary"]};

    svg {
      width: ${e.space[4]};
      height: ${e.space[4]};
      color: ${e.colors[a||"text"]};
    }
    ${i&&l.css`
      color: ${e.colors.textTertiary};
      cursor: not-allowed;
    `}

    ${()=>{if(r)return l.css`
          justify-content: center;

          &:hover {
            color: ${e.colors.accent};
          }
        `;if(!r)return l.css`
          justify-content: flex-start;

          &:hover {
            background: ${e.colors.greySurface};
          }
        `}}

    ${()=>{if(r&&!o)return l.css`
          color: ${e.colors.greyPrimary};
        `}}
  `),Ka=({setIsOpen:e,item:r})=>{const o=t.useRef(null),a=t.cloneElement(r,{...r.props,ref:o}),i=t.useCallback(()=>{e(!1)},[e]);return t.useEffect(()=>{const n=o.current;return n==null||n.addEventListener("click",i),()=>{n==null||n.removeEventListener("click",i)}},[i,r]),a},Qa=({items:e,setIsOpen:r,isOpen:o,width:a,inner:i,align:n,shortThrow:c,keepMenuOnTop:u,labelAlign:d,direction:p})=>t.createElement(Xa,{$opened:o,$inner:i,$align:n,$shortThrow:c,$labelAlign:d,$direction:p,style:{width:i||a&&parseInt(a)>100?`${a}px`:"150px",zIndex:u?100:void 0}},e.map(h=>{if(t.isValidElement(h))return Ka({item:h,setIsOpen:r});const{color:f,value:g,icon:$,label:x,onClick:b,disabled:k,as:L,wrapper:y}=h,v={$inner:i,$hasColor:!!f,$color:f,disabled:k,onClick:()=>{r(!1),b==null||b(g)},as:L,children:t.createElement(t.Fragment,null,$,x)};return y?y(t.createElement(tr,{...v,type:"button"}),g||x):t.createElement(tr,{...v,key:g||x,type:"button"})})),Ja=s.default.button(({theme:e,$size:r,$open:o,$direction:a})=>l.css`
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${e.space[4]};
    border-width: ${e.space.px};
    font-weight: ${e.fontWeights.normal};
    cursor: pointer;
    position: relative;
    border-color: ${e.colors.border};
    background-color: ${e.colors.background};

    ${()=>{switch(r){case"small":return l.css`
            padding: ${e.space["0.5"]} ${e.space["0.25"]};
          `;case"medium":return l.css`
            padding: ${e.space["2.5"]} ${e.space["3.5"]};
          `;default:return""}}}

    ${()=>{if(o)return l.css`
          border-${a==="down"?"top":"bottom"}-left-radius: ${e.radii.almostExtraLarge};
          border-${a==="down"?"top":"bottom"}-right-radius: ${e.radii.almostExtraLarge};
          border-${a==="down"?"bottom":"top"}-left-radius: none;
          border-${a==="down"?"bottom":"top"}-right-radius: none;
          border-${a==="down"?"bottom":"top"}-width: 0;
          color: ${e.colors.textTertiary};
          transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6),
            0.3s color ease-in-out, 0.2s border-radius ease-in-out,
            0s border-width 0.1s, 0s padding linear;

          &:hover {
            color: ${e.colors.accent};
          }
        `;if(!o)return l.css`
          color: ${e.colors.textSecondary};
          border-radius: ${e.radii.almostExtraLarge};
          transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6),
            0.15s color ease-in-out, 0s border-width 0.15s,
            0.15s border-color ease-in-out, 0s padding linear;

          &:hover {
            border-color: ${e.colors.border};
          }
        `}}
  `),rr=s.default(e=>t.createElement(Ue,{...e}))(({theme:e,$open:r,$direction:o})=>l.css`
    margin-left: ${e.space[1]};
    width: ${e.space[3]};
    margin-right: ${e.space["0.5"]};
    transition-duration: ${e.transitionDuration[200]};
    transition-property: all;
    transition-timing-function: ${e.transitionTimingFunction.inOut};
    transform: rotate(${o==="down"?"0deg":"180deg"});
    display: flex;

    & > svg {
      fill: currentColor;
    }
    fill: currentColor;

    ${r&&l.css`
      transform: rotate(${o==="down"?"180deg":"0deg"});
    `}
  `),en=s.default.div(()=>l.css`
    z-index: 10;
    position: relative;
  `),qe=({children:e,buttonProps:r,items:o=[],inner:a=!1,chevron:i=!0,align:n="left",menuLabelAlign:c,shortThrow:u=!1,keepMenuOnTop:d=!1,size:p="medium",label:h,direction:f="down",isOpen:g,setIsOpen:$,inheritContentWidth:x=!1,...b})=>{const k=t.useRef(),[L,y]=t.useState(!1),[v,m]=$?[g,$]:[L,y],w=Z=>{k.current&&!k.current.contains(Z.target)&&m(!1)};return t.useEffect(()=>(v?document.addEventListener("mousedown",w):document.removeEventListener("mousedown",w),()=>{document.removeEventListener("mousedown",w)}),[k,v]),t.createElement(qa,{ref:k,...b,"data-testid":re(b,"dropdown")},!e&&a&&t.createElement(Ja,{$direction:f,$open:v,$size:p,type:"button",onClick:()=>m(!v)},h,i&&t.createElement(rr,{$direction:f,$open:v})),!e&&!a&&t.createElement(en,null,t.createElement(De,{...r,pressed:v,suffix:i&&t.createElement(rr,{$direction:f,$open:v}),onClick:()=>m(!v)},h)),t.Children.map(e,Z=>t.isValidElement(Z)?t.cloneElement(Z,{...r,zindex:"10",pressed:v?"true":void 0,onClick:()=>m(!v)}):null),t.createElement(Qa,{align:n,direction:f,inner:a,isOpen:v,items:o,keepMenuOnTop:d,labelAlign:c,setIsOpen:m,shortThrow:u,width:(a||x)&&k.current&&k.current.getBoundingClientRect().width.toFixed(2)}))};qe.displayName="Dropdown";const tn=s.default.fieldset(({theme:e})=>l.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[4]};
  `),rn=s.default.div(({theme:e})=>l.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[1]};
    padding: 0 ${e.space[4]};
  `),on=s.default.div(({theme:e})=>l.css`
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: ${e.space[3]};
  `),ln=s.default.div(({theme:e})=>l.css`
    color: ${e.colors.textSecondary};
    font-size: ${e.fontSizes.body};
    line-height: ${e.lineHeights.body};
  `),an=s.default.div(({theme:e})=>l.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[4]};
  `),yt=({children:e,description:r,disabled:o,form:a,legend:i,name:n,status:c,...u})=>{let d,p;switch(c){case"complete":{d="Complete",p="green";break}case"required":case"pending":{d=c==="pending"?"Pending":"Required",p="accent";break}case"optional":{d="Optional",p="grey";break}}return typeof c=="object"&&(d=c.name,p=c.tone),t.createElement(tn,{...u,disabled:o,form:a,name:n},t.createElement(rn,null,t.createElement(on,null,t.createElement(We,{as:"legend",level:"2",responsive:!0},i),p&&d&&t.createElement(Ie,{color:p},d)),t.createElement(ln,null,r)),t.createElement(an,null,e))};yt.displayName="FieldSet";const nn=s.default.div(({theme:e,$type:r,$alignment:o})=>l.css`
    width: ${e.space.full};
    padding: ${e.space[6]} ${e.space[4]};

    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    gap: ${e.space[2]};
    border-radius: ${e.radii.large};

    text-align: center;
    overflow-x: auto;

    ${o==="horizontal"&&l.css`
      flex-direction: row;
      justify-content: flex-start;
      gap: ${e.space[4]};
      padding: ${e.space[4]};
      text-align: left;
    `}

    background-color: ${e.colors.blueSurface};
    border: ${e.borderWidths.px} solid ${e.colors.blue};

    ${r==="warning"&&l.css`
      background-color: ${e.colors.yellowSurface};
      border-color: ${e.colors.yellow};
    `}

    ${r==="error"&&l.css`
      background-color: ${e.colors.redSurface};
      border-color: ${e.colors.red};
    `}
  `),cn=s.default.div(({theme:e,$type:r})=>l.css`
    width: ${e.space[6]};
    height: ${e.space[6]};

    color: ${e.colors.blue};

    ${r==="warning"&&l.css`
      color: ${e.colors.yellow};
    `}
    ${r==="error"&&l.css`
      color: ${e.colors.red};
    `}
  `),Et=({type:e="info",alignment:r="vertical",children:o,...a})=>{const i=e==="info"?bt:Ve;return t.createElement(nn,{$alignment:r,$type:e,...a},t.createElement(cn,{$type:e,as:i}),o)};Et.displayName="Helper";const sn=(e,r)=>{var n,c;const o=(n=Object.getOwnPropertyDescriptor(e,"value"))==null?void 0:n.set,a=Object.getPrototypeOf(e),i=(c=Object.getOwnPropertyDescriptor(a,"value"))==null?void 0:c.set;if(i&&o!==i)i.call(e,r);else if(o)o.call(e,r);else throw new Error("The given element does not have a value setter")},ue={small:{outerPadding:"3.5",gap:"2",icon:"3",iconPadding:"8.5",height:"10"},medium:{outerPadding:"4",gap:"2",icon:"4",iconPadding:"10",height:"12"},large:{outerPadding:"4",gap:"2",icon:"5",iconPadding:"11",height:"16"},extraLarge:{outerPadding:"6",gap:"2",icon:"6",iconPadding:"14",height:"20"}},Q=(e,r,o)=>e.space[ue[r][o]],rt=(e,r,o,a)=>o?a?`calc(-${e.space[ue[r].outerPadding]} - ${e.space[o]} - ${e.space[ue[r].gap]})`:`calc(${e.space[ue[r].outerPadding]} + ${e.space[o]} + ${e.space[ue[r].gap]})`:a?`-${e.space[ue[r].iconPadding]}`:e.space[ue[r].iconPadding],dn={small:"large",medium:"large",large:"2.5xLarge",extraLarge:"2.5xLarge"},un=(e,r)=>e.radii[dn[r]],pn={small:"small",medium:"body",large:"large",extraLarge:"headingThree"},Ae=e=>pn[e],fn=s.default.div(({theme:e,$size:r,$hasError:o,$userStyles:a,$validated:i,$showDot:n})=>l.css`
    position: relative;
    height: ${Q(e,r,"height")};
    display: flex;
    transition-duration: ${e.transitionDuration[150]};
    transition-property: color, border-color, background-color;
    transition-timing-function: ${e.transitionTimingFunction.inOut};

    :after {
      content: '';
      position: absolute;
      width: ${e.space[4]};
      height: ${e.space[4]};
      border: 2px solid ${e.colors.backgroundPrimary};
      box-sizing: border-box;
      border-radius: 50%;
      right: -${e.space["1.5"]};
      top: -${e.space["1.5"]};
      transition: all 0.3s ease-out;
      transform: scale(0.3);
      opacity: 0;
    }

    ${n&&i&&l.css`
      :after {
        background: ${e.colors.greenPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${n&&!o&&l.css`
      &:focus-within:after {
        background: ${e.colors.bluePrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${o&&n&&l.css`
      :after {
        background: ${e.colors.redPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

  ${a}
  `),zo=s.default.label(({theme:e,$size:r})=>l.css`
    display: flex;
    align-items: center;
    gap: ${e.space[2]};

    height: ${e.space.full};
    color: ${e.colors.greyPrimary};
    background: ${e.colors.greySurface};
    font-size: ${Re(Ae(r))};
    line-height: ${Pe(Ae(r))};
    font-weight: ${e.fontWeights.normal};
    padding: 0 ${Q(e,r,"outerPadding")};

    svg {
      display: block;
      color: ${e.colors.greyPrimary};
    }
  `),gn=s.default(zo)(()=>l.css`
    order: -2;
  `),mn=s.default.div(({theme:e,$size:r,$iconWidth:o})=>l.css`
    order: -1;
    padding-left: ${Q(e,r,"outerPadding")};
    flex: 0 0 ${rt(e,r,o)};
    margin-right: ${rt(e,r,o,!0)};
    display: flex;
    align-items: center;
    justify-content: flex-start;
    pointer-events: none;
    svg {
      display: block;
      width: ${o?e.space[o]:Q(e,r,"icon")};
      height: ${o?e.space[o]:Q(e,r,"icon")};
      color: ${e.colors.greyPrimary};
    }
    z-index: 1;
  `),bn=s.default.button(({theme:e,$size:r})=>l.css`
    padding-right: ${Q(e,r,"outerPadding")};
    margin-left: -${Q(e,r,"iconPadding")};
    flex: 0 0 ${Q(e,r,"iconPadding")};
    display: flex;
    justify-content: flex-end;
    align-items: center;
    transition: all 0.1s ease-in-out;
    transform: scale(1);
    opacity: 1;
    cursor: pointer;

    svg {
      display: block;
      width: ${Q(e,r,"icon")};
      height: ${Q(e,r,"icon")};
      color: ${e.colors.greyPrimary};
      transition: all 150ms ease-in-out;
    }

    &:hover svg {
      color: ${e.colors.greyBright};
      transform: translateY(-1px);
    }
  `),hn=s.default.input(({theme:e,$size:r,$hasIcon:o,$hasAction:a,$hasError:i,$iconWidth:n})=>l.css`
    background-color: transparent;
    position: relative;
    width: ${e.space.full};
    height: ${e.space.full};
    font-weight: ${e.fontWeights.normal};
    text-overflow: ellipsis;
    color: ${e.colors.textPrimary};
    padding: 0 ${Q(e,r,"outerPadding")};
    font-size: ${Re(Ae(r))};
    line-height: ${Pe(Ae(r))};

    ${o&&l.css`
      padding-left: ${rt(e,r,n)};
    `}

    ${a&&l.css`
      padding-right: ${Q(e,r,"iconPadding")};
    `}

    &::placeholder {
      color: ${e.colors.greyPrimary};
      font-weight: ${r==="large"||r==="extraLarge"?e.fontWeights.bold:e.fontWeights.normal};
    }

    &:read-only {
      cursor: default;
    }

    &:disabled {
      background: ${e.colors.greyLight};
      cursor: not-allowed;
      color: ${e.colors.greyPrimary};
    }

    ${i&&l.css`
      color: ${e.colors.redPrimary};
    `}
  `),$n=s.default.div(({theme:e,$size:r,$hasError:o,$disabled:a,$readOnly:i,$alwaysShowAction:n})=>l.css`
    position: relative;
    background-color: ${e.colors.backgroundPrimary};
    border-radius: ${un(e,r)};
    border-width: ${e.space.px};
    border-color: ${e.colors.border};
    color: ${e.colors.textPrimary};
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    transition-duration: ${e.transitionDuration[150]};
    transition-property: color, border-color, background-color;
    transition-timing-function: ${e.transitionTimingFunction.inOut};

    ${a&&l.css`
      border-color: ${e.colors.border};
      background-color: ${e.colors.greyLight};
    `}

    ${o&&l.css`
      border-color: ${e.colors.redPrimary};
      cursor: default;
    `}

    ${!o&&!i&&l.css`
      &:focus-within {
        border-color: ${e.colors.accentBright};
      }
    `}

    input ~ label {
      cursor: text;
    }

    input:read-only ~ label,
    input:read-only ~ button {
      cursor: default;
    }

    input:disabled ~ label,
    input:disabled ~ button {
      background: ${e.colors.greyLight};
      cursor: not-allowed;
    }

    input:disabled ~ button,
    input:read-only ~ button {
      opacity: 0;
      transform: scale(0.8);
      pointer-events: none;
    }

    ${!n&&l.css`
      input:placeholder-shown ~ button {
        opacity: 0;
        transform: scale(0.8);
        pointer-events: none;
      }
    `}
  `),xt=t.forwardRef(({autoFocus:e,autoComplete:r="off",autoCorrect:o,defaultValue:a,description:i,disabled:n,error:c,validated:u,showDot:d,hideLabel:p,id:h,inputMode:f,icon:g,iconWidth:$,actionIcon:x,alwaysShowAction:b=!1,label:k,labelSecondary:L,name:y="clear-button",placeholder:v,prefix:m,prefixAs:w,readOnly:Z,required:H,spellCheck:B,suffix:R,suffixAs:C,clearable:G=!1,tabIndex:T,type:N="text",units:j,value:D,width:P,onBlur:V,onChange:O,onFocus:ie,onClickAction:J,size:W="medium",parentStyles:_,...ee},I)=>{const oe=t.useRef(null),X=I||oe,le=v?`${v!=null?v:""}${j?` ${j}`:""}`:void 0,ce=c?!0:void 0,me=N==="email"?"text":N,be=G||!!J,se=z=>{var Y;if(z.preventDefault(),z.stopPropagation(),J)return J(),(Y=X.current)==null?void 0:Y.focus();X.current&&(sn(X.current,""),X.current.dispatchEvent(new Event("input",{bubbles:!0})),X.current.focus())};return t.createElement(te,{description:i,disabled:n,error:c,hideLabel:p,id:h,label:k,labelSecondary:L,readOnly:Z,required:H,width:P},z=>t.createElement(fn,{$disabled:n,$hasError:ce,$validated:u,$showDot:d,$suffix:R!==void 0,$size:W,$userStyles:_,$ids:z},t.createElement($n,{$alwaysShowAction:b,$disabled:!!n,$hasError:!!c,$readOnly:!!Z,$size:W},t.createElement(hn,{ref:X,...ee,...z==null?void 0:z.content,"aria-invalid":ce,$hasAction:be,$hasError:!!c,$hasIcon:!!g,$iconWidth:$,$size:W,autoComplete:r,autoCorrect:o,autoFocus:e,defaultValue:a,disabled:n,inputMode:f,name:y,placeholder:le,readOnly:Z,spellCheck:B,tabIndex:T,type:me,value:D,onBlur:V,onChange:O,onFocus:ie}),m&&t.createElement(gn,{"aria-hidden":"true",as:w,...z==null?void 0:z.label,$size:W},m),g&&t.createElement(mn,{$iconWidth:$,$size:W},g),be&&t.createElement(bn,{$size:W,"data-testid":"input-action-button",onClick:se,onMouseDown:Y=>Y.preventDefault()},x||t.createElement(Me,null)),R&&t.createElement(zo,{$size:W,"aria-hidden":"true",...z==null?void 0:z.label,...C?{as:C}:{}},R))))});xt.displayName="Input";const wn=s.default.div(({theme:e,$state:r,$alignTop:o})=>l.css`
    width: 100%;

    position: fixed;
    left: 0;
    z-index: 9999;

    ${o?l.css`
          top: 0;
        `:l.css`
          bottom: 0;
        `}

    display: flex;
    flex-direction: row;

    ${U.sm.min(l.css`
      width: min-content;

      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      bottom: initial;
    `)}

    transition: ${e.transitionDuration[300]} all
      ${e.transitionTimingFunction.popIn};

    ${r==="entered"?l.css`
          opacity: 1;
          transform: translateY(0px);
        `:l.css`
          opacity: 0;
          transform: translateY(${o?"-":""}128px);
        `}
  `),Ge=({children:e,backdropSurface:r,onDismiss:o,open:a,alignTop:i,...n})=>t.createElement(Le,{open:a,surface:r,onDismiss:o},({state:c})=>t.createElement(wn,{$alignTop:i,$state:c,...n},e));Ge.displayName="Modal";const vn=s.default.div(({theme:e})=>l.css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${e.space[2]};
    flex-gap: ${e.space[2]};
  `),yn=s.default.button(({theme:e,$selected:r,$size:o})=>l.css`
    background-color: ${e.colors.background};
    transition: all 0.15s ease-in-out;
    cursor: pointer;
    font-size: ${e.fontSizes.body};
    line-height: ${e.lineHeights.body};
    font-weight: ${e.fontWeights.bold};
    border-radius: ${e.radii.extraLarge};

    min-width: ${e.space[10]};
    height: ${e.space[10]};
    border: 1px solid ${e.colors.border};
    padding: ${e.space[2]};

    ${r?l.css`
          cursor: default;
          pointer-events: none;
          color: ${e.colors.accent};
        `:l.css`
          color: ${e.colors.greyPrimary};
          &:hover {
            background-color: ${e.colors.greySurface};
          }
        `}

    ${o==="small"&&l.css`
      font-size: ${e.fontSizes.small};
      line-height: ${e.lineHeights.small};
      border-radius: ${e.space[2]};
      min-width: ${e.space[9]};
      height: ${e.space[9]};
    `}
  `),En=s.default.p(({theme:e})=>l.css`
    font-size: ${e.fontSizes.small};
    font-weight: ${e.fontWeights.bold};
    color: ${e.colors.greyPrimary};
  `),No=({total:e,current:r,max:o=5,size:a="medium",alwaysShowFirst:i,alwaysShowLast:n,showEllipsis:c=!0,onChange:u,...d})=>{const p=Math.floor(o/2),h=Math.max(Math.min(Math.max(r-p,1),e-o+1),1),f=Array.from({length:o},(g,$)=>h+$).filter(g=>g<=e);return e>o&&(i&&h>1?c?(f[0]=-1,f.unshift(1)):f[0]=1:c&&h>1&&f.unshift(-1),n&&e>r+p?c?(f[f.length-1]=-1,f.push(e)):f[f.length-1]=e:c&&e>r+p&&f.push(-1)),t.createElement(vn,{...d,"data-testid":re(d,"pagebuttons")},f.map((g,$)=>g===-1?t.createElement(En,{"data-testid":"pagebutton-dots",key:`${g}-${$}`},"..."):t.createElement(yn,{$selected:g===r,$size:a,"data-testid":"pagebutton",key:g,type:"button",onClick:()=>u(g)},g)))},or=s.default.div(({theme:e,$size:r,$hasDropdown:o,$open:a})=>l.css`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    gap: ${e.space[2]};
    border-radius: ${e.radii.full};
    transition-duration: ${e.transitionDuration[150]};
    transition-property: color, border-color, background-color, transform,
      filter;
    transition-timing-function: ${e.transitionTimingFunction.inOut};
    position: relative;
    z-index: 10;
    padding: ${e.space[1]};
    background-color: ${e.colors.backgroundPrimary};
    width: fit-content;

    ${o&&l.css`
      cursor: pointer;
      &:hover {
        transform: translateY(-1px);
        filter: brightness(1.05);
      }
    `}

    ${a&&l.css`
      background-color: ${e.colors.border};
    `}

    ${r==="small"&&l.css`
      height: ${e.space[10]};
      width: ${e.space[10]};
      padding: 0;
      border: none;
    `}

    ${r==="medium"&&l.css`
      height: ${e.space[12]};
      width: ${e.space[45]};
      padding-right: ${e.space[4]};
    `}

    ${r==="large"&&l.css`
      height: ${e.space[14]};
      max-width: ${e.space[80]};
      padding-right: ${e.space[5]};
    `}
  `),xn=s.default.div(({theme:e,$size:r})=>l.css`
    width: ${e.space[10]};
    flex: 0 0 ${e.space[10]};
    ${r==="large"&&l.css`
      width: ${e.space[12]};
      flex: 0 0 ${e.space[12]};
    `}
  `),Cn=s.default.div(({theme:e,$size:r})=>l.css`
    display: ${r==="small"?"none":"block"};
    min-width: ${e.space.none};
  `),kn=s.default(A)(()=>l.css`
    line-height: initial;
  `),lr=({size:e,avatar:r,address:o,ensName:a})=>t.createElement(t.Fragment,null,t.createElement(xn,{$size:e},t.createElement(je,{label:"profile-avatar",...typeof r=="string"?{src:r}:r||{}})),t.createElement(Cn,{$size:e},t.createElement(kn,{color:"text","data-testid":"profile-title",ellipsis:!0,fontVariant:e==="large"?"headingFour":"bodyBold",forwardedAs:"h3"},a||Oa(o,e==="large"?30:10,e==="large"?10:5,e==="large"?10:5)))),Ct=({size:e="medium",avatar:r,dropdownItems:o,address:a,ensName:i,alignDropdown:n="right",...c})=>{const[u,d]=t.useState(!1);return o?t.createElement(qe,{items:o,isOpen:u,setIsOpen:d,align:n,inheritContentWidth:!0},t.createElement(or,{...c,$hasDropdown:!0,$open:u,$size:e,onClick:()=>d(!u)},t.createElement(lr,{size:e,avatar:r,address:a,ensName:i}))):t.createElement(or,{...c,"data-testid":re(c,"profile"),$open:u,$size:e},t.createElement(lr,{size:e,avatar:r,address:a,ensName:i}))};Ct.displayName="Profile";const Sn=s.default.input(({theme:e,$colorStyle:r})=>l.css`
    cursor: pointer;
    font: inherit;
    border-radius: 50%;
    display: grid;
    place-content: center;
    transition: transform 150ms ease-in-out;
    width: ${e.space[5]};
    height: ${e.space[5]};
    background-color: ${e.colors.border};

    &::before {
      content: '';
      width: ${e.space[3]};
      height: ${e.space[3]};
      border-radius: 50%;
      transition: all 150ms ease-in-out;
      background: ${e.colors.border};
      background-size: 100% 100%;
      background-position: center;
    }

    &:checked::before {
      background: ${F(r,"background")};
    }

    &:disabled {
      cursor: not-allowed;
    }

    &:hover::before {
      background: ${e.colors.greyBright};
    }

    &:disabled::before {
      background: ${e.colors.border};
    }

    &:checked:hover::before {
      background: ${F(r,"hover")};
    }

    &:disabled:checked::before,
    &:disabled:checked:hover::before {
      background: ${e.colors.greyPrimary};
    }

    &:hover {
      transform: translateY(-1px);
    }

    &:disabled:hover {
      transform: initial;
    }
  `),kt=t.forwardRef(({description:e,disabled:r,error:o,inline:a=!0,hideLabel:i,id:n,label:c,labelSecondary:u,name:d,required:p,tabIndex:h,value:f,checked:g,width:$,colorStyle:x="accentPrimary",onBlur:b,onChange:k,onFocus:L,...y},v)=>{const m=t.useRef(null),w=v||m;return t.createElement(te,{description:e,error:o,hideLabel:i,id:n,inline:a,label:c,labelSecondary:u,required:p,width:$,disabled:r},t.createElement(Sn,{$colorStyle:x,...y,"aria-invalid":o?!0:void 0,"aria-selected":g?!0:void 0,"data-testid":re(y,"radio"),type:"radio",role:"radio",checked:g,disabled:r,name:d,ref:w,tabIndex:h,value:f,onBlur:b,onChange:k,onFocus:L}))});kt.displayName="RadioButton";const Wo=e=>{let r=!1,o=!1;const a=()=>{r=!0,e.preventDefault()},i=()=>{o=!0,e.stopPropagation()};return{nativeEvent:e,currentTarget:e.currentTarget,target:e.target,bubbles:e.bubbles,cancelable:e.cancelable,defaultPrevented:e.defaultPrevented,eventPhase:e.eventPhase,isTrusted:e.isTrusted,preventDefault:a,isDefaultPrevented:()=>r,stopPropagation:i,isPropagationStopped:()=>o,persist:()=>{},timeStamp:e.timeStamp,type:e.type}},Rn=s.default.div(({theme:e,$inline:r})=>l.css`
    display: flex;
    flex-direction: ${r?"row":"column"};
    gap: ${e.space[2]};
    justify-content: flex-start;
    flex-wrap: ${r?"wrap":"nowrap"};
  `),St=t.forwardRef(({value:e,children:r,inline:o=!1,onChange:a,onBlur:i,...n},c)=>{const u=t.useRef(null),d=c||u,p=t.useRef(null),[h,f]=t.useState(!1),[g,$]=t.useState(e);t.useEffect(()=>{e&&e!=g&&$(e)},[e]);const x=y=>{$(y.target.value),a&&a(y)},b=()=>{p.current&&p.current.focus()},k=y=>{i&&i(y)},L=(y,v="radiogroup")=>{if(a&&y){const m=document.createElement("input");m.value=y,m.name=v;const w=new Event("change",{bubbles:!0});Object.defineProperty(w,"target",{writable:!1,value:m});const Z=Wo(w);a(Z)}};return t.createElement(Rn,{$inline:o,...n,"data-testid":re(n,"radiogroup"),ref:d,role:"radiogroup",onFocus:b},t.Children.map(r,y=>{y.props.checked&&!h&&(f(!0),g!==y.props.value&&($(y.props.value),f(!0),L(y.props.value,y.props.name)));const v=y.props.value===g;return t.cloneElement(y,{ref:v?p:void 0,checked:v,onChange:x,onBlur:k})}))});St.displayName="RadioButtonGroup";var Be=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Pn=typeof Be=="object"&&Be&&Be.Object===Object&&Be,Ln=Pn,Vn=Ln,Zn=typeof self=="object"&&self&&self.Object===Object&&self,Mn=Vn||Zn||Function("return this")(),Gn=Mn,Tn=Gn,Bn=Tn.Symbol,Rt=Bn;function On(e,r){for(var o=-1,a=e==null?0:e.length,i=Array(a);++o<a;)i[o]=r(e[o],o,e);return i}var Hn=On,An=Array.isArray,jn=An,ar=Rt,_o=Object.prototype,Fn=_o.hasOwnProperty,Dn=_o.toString,ke=ar?ar.toStringTag:void 0;function zn(e){var r=Fn.call(e,ke),o=e[ke];try{e[ke]=void 0;var a=!0}catch{}var i=Dn.call(e);return a&&(r?e[ke]=o:delete e[ke]),i}var Nn=zn,Wn=Object.prototype,_n=Wn.toString;function In(e){return _n.call(e)}var Un=In,nr=Rt,Yn=Nn,qn=Un,Xn="[object Null]",Kn="[object Undefined]",ir=nr?nr.toStringTag:void 0;function Qn(e){return e==null?e===void 0?Kn:Xn:ir&&ir in Object(e)?Yn(e):qn(e)}var Jn=Qn;function ei(e){return e!=null&&typeof e=="object"}var ti=ei,ri=Jn,oi=ti,li="[object Symbol]";function ai(e){return typeof e=="symbol"||oi(e)&&ri(e)==li}var ni=ai,cr=Rt,ii=Hn,ci=jn,si=ni,di=1/0,sr=cr?cr.prototype:void 0,dr=sr?sr.toString:void 0;function Io(e){if(typeof e=="string")return e;if(ci(e))return ii(e,Io)+"";if(si(e))return dr?dr.call(e):"";var r=e+"";return r=="0"&&1/e==-di?"-0":r}var ui=Io,pi=ui;function fi(e){return e==null?"":pi(e)}var gi=fi,mi=gi,bi=0;function hi(e){var r=++bi;return mi(e)+r}var $i=hi;const et="CREATE_OPTION_VALUE",wi=s.default.div(({theme:e,$size:r,$showDot:o,$hasError:a,$validated:i,$open:n,$disabled:c,$readOnly:u})=>l.css`
    cursor: pointer;
    position: relative;

    height: ${e.space[12]};
    font-size: ${e.fontSizes.body};
    line-height: ${e.lineHeights.body};

    :after {
      content: '';
      position: absolute;
      width: ${e.space[4]};
      height: ${e.space[4]};
      border: 2px solid ${e.colors.backgroundPrimary};
      box-sizing: border-box;
      border-radius: 50%;
      right: -${e.space["1.5"]};
      top: -${e.space["1.5"]};
      transition: all 0.3s ease-out;
      transform: scale(0.3);
      opacity: 0;
    }

    ${r==="small"&&l.css`
      font-size: ${e.fontSizes.small};
      line-height: ${e.lineHeights.small};
      height: ${e.space[10]};
    `}

    ${o&&!c&&i&&!n&&l.css`
      :after {
        background: ${e.colors.greenPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${o&&!c&&!a&&n&&l.css`
      :after {
        background: ${e.colors.bluePrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${a&&!c&&o&&l.css`
      :after {
        background: ${e.colors.redPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${u&&l.css`
      cursor: default;
      pointer-events: none;
    `}
  `),vi=s.default.div(({theme:e,$open:r,$hasError:o,$disabled:a,$size:i,$ids:n})=>l.css`
    flex: 1;
    display: flex;
    align-items: center;
    height: 100%;
    gap: ${e.space[2]};
    padding-left: ${e.space[4]};
    background: ${e.colors.backgroundPrimary};

    overflow: hidden;
    border: 1px solid ${e.colors.border};
    border-radius: ${e.radii.large};

    svg {
      display: block;
    }

    ${r&&l.css`
      border-color: ${e.colors.bluePrimary};
    `}

    ${o&&l.css`
      border-color: ${e.colors.redPrimary};
      label {
        color: ${e.colors.redPrimary};
      }
    `}

    ${i==="small"&&l.css`
      padding-left: ${e.space["3.5"]};
    `}

    ${a&&l.css`
      background: ${e.colors.greyLight};
      color: ${e.colors.greyPrimary};
      cursor: not-allowed;
    `}

    input#${n==null?void 0:n.content.id} ~ button#chevron svg {
      color: ${e.colors.textPrimary};
    }

    input#${n==null?void 0:n.content.id}:placeholder-shown ~ button#chevron {
      svg {
        color: ${e.colors.greyPrimary};
      }
    }

    input#${n==null?void 0:n.content.id}:disabled ~ button#chevron {
      svg {
        color: ${e.colors.greyPrimary};
      }
    }

    input#${n==null?void 0:n.content.id}:disabled ~ * {
      color: ${e.colors.greyPrimary};
      background: ${e.colors.greyLight};
      cursor: not-allowed;
    }
  `),yi=s.default.input(()=>l.css`
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    appearance: none;
    visibility: hidden;
  `),Uo=s.default.div(()=>l.css`
    flex: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  `),Ei=s.default(Uo)(({theme:e})=>l.css`
    color: ${e.colors.greyPrimary};
    pointer-events: none;
  `),xi=s.default.input(({theme:e})=>l.css`
    flex: 1;
    background: transparent;
    padding-right: 0;
    height: 100%;
    color: ${e.colors.textPrimary};

    &::placeholder {
      color: ${e.colors.greyPrimary};
    }
  `),Yo=s.default.button(({theme:e,$size:r})=>l.css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    margin: 0;
    padding: 0;
    padding-right: ${e.space[4]};
    padding-left: ${e.space[2]};

    svg {
      display: block;
      width: ${r==="small"?e.space[3]:e.space[4]};
      path {
        color: ${e.colors.greyPrimary};
      }
    }

    ${r==="small"&&l.css`
      padding-right: ${e.space["3.5"]};
    `}
  `),Ci=s.default(Yo)(({theme:e,$open:r,$direction:o})=>l.css`
    display: flex;
    cursor: pointer;

    svg {
      fill: currentColor;
      transform: ${o==="up"?"rotate(180deg)":"rotate(0deg)"};
      transition-duration: ${e.transitionDuration[200]};
      transition-property: all;
      transition-timing-function: ${e.transitionTimingFunction.inOut};
    }
    fill: currentColor;

    ${r&&l.css`
      svg {
        transform: ${o==="up"?"rotate(0deg)":"rotate(180deg)"};
      }
    `}
  `),ki=s.default.div(({theme:e,$state:r,$direction:o,$rows:a,$size:i,$align:n})=>l.css`
    display: ${r==="exited"?"none":"block"};
    position: absolute;
    visibility: hidden;
    opacity: 0;
    overflow: hidden;

    border: 1px solid ${e.colors.border};
    padding: ${e.space[2]};
    min-width: ${e.space.full};
    ${n==="right"?l.css`
          right: 0;
        `:l.css`
          left: 0;
        `}
    border-radius: ${e.radii["2xLarge"]};
    background: ${e.colors.background};
    transition: all 0.3s cubic-bezier(1, 0, 0.22, 1.6), z-index 0.3s linear;

    font-size: ${e.fontSizes.body};
    line-height: ${e.lineHeights.body};

    ${i==="small"&&l.css`
      font-size: ${e.fontSizes.small};
    `}

    ${r==="entered"?l.css`
          z-index: 20;
          visibility: visible;
          top: ${o==="up"?"auto":`calc(100% + ${e.space[2]})`};
          bottom: ${o==="up"?`calc(100% + ${e.space[2]})`:"auto"};
          opacity: 1;
        `:l.css`
          z-index: 1;
          visibility: hidden;
          top: ${o==="up"?"auto":`calc(100% - ${e.space[12]})`};
          bottom: ${o==="up"?`calc(100% - ${e.space[12]})`:"auto"};
          opacity: 0;
        `}

    ${a&&l.css`
      padding-right: ${e.space[1]};
    `}
  `),Si=(e,r,o)=>o==="small"?`calc(${e.space[9]} * ${r})`:`calc(${e.space[11]} * ${r})`,Ri=s.default.div(({theme:e,$rows:r,$direction:o,$size:a})=>l.css`
    display: flex;
    flex-direction: ${o==="up"?"column-reverse":"column"};
    align-items: flex-start;
    justify-content: space-between;
    gap: ${e.space[1]};
    overflow-y: ${r?"scroll":"hidden"};
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    ${r&&l.css`
      max-height: ${Si(e,r,a)};
      border-color: hsla(${e.colors.raw.greyActive} / 0.05);
      transition: border-color 0.15s ease-in-out;
      padding-right: ${e.space[1]};

      /* stylelint-disable-next-line selector-pseudo-element-no-unknown */
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }

      &::-webkit-scrollbar {
        width: ${e.space["1.5"]};
        background-color: transparent;
      }

      &::-webkit-scrollbar-thumb {
        border: none;
        border-radius: ${e.radii.full};
        border-right-style: inset;
        border-right-width: calc(100vw + 100vh);
        border-color: inherit;
      }

      &::-webkit-scrollbar-button {
        display: none;
      }

      &:hover {
        border-color: hsla(${e.colors.raw.greyActive} / 0.2);
      }
    `};
  `),Pi=s.default.button(({theme:e,$selected:r,$highlighted:o,$color:a,$size:i})=>l.css`
    align-items: center;
    cursor: pointer;
    display: flex;
    gap: ${e.space[2]};
    width: ${e.space.full};
    height: ${e.space[11]};
    flex: 0 0 ${e.space[11]};
    padding: 0 ${e.space[3]};
    justify-content: flex-start;
    transition-duration: ${e.transitionDuration[150]};
    transition-property: all;
    transition-timing-function: ${e.transitionTimingFunction.inOut};
    border-radius: ${e.radii.large};
    white-space: nowrap;
    color: ${e.colors.textPrimary};
    font-size: ${Re("body")};
    font-weight: ${tt("body")};
    line-height: ${Pe("body")};
    text-align: left;

    svg {
      display: block;
      width: ${e.space[4]};
      height: ${e.space[4]};
      color: ${e.colors.textPrimary};
    }

    ${a&&l.css`
      color: ${e.colors[a]};
      svg {
        color: ${e.colors[a]};
      }
    `}

    &:disabled {
      color: ${e.colors.greyPrimary};
      cursor: not-allowed;

      &:hover {
        background-color: transparent;
      }

      svg {
        color: ${e.colors.greyPrimary};
      }
    }

    ${o&&l.css`
      background-color: ${e.colors.greySurface};
    `}

    ${r&&l.css`
      background-color: ${e.colors.greyLight};
    `}

    ${i==="small"&&l.css`
      height: ${e.space[9]};
      flex: 0 0 ${e.space[9]};
      font-size: ${Re("small")};
      font-weight: ${tt("small")};
      line-height: ${Pe("small")};
    `}
  `),Li=s.default.div(({theme:e})=>l.css`
    align-items: center;
    display: flex;
    gap: ${e.space[3]};
    width: ${e.space.full};
    height: ${e.space[9]};
    padding: 0 ${e.space[2]};
    justify-content: flex-start;
    transition-duration: ${e.transitionDuration[150]};
    transition-property: all;
    transition-timing-function: ${e.transitionTimingFunction.inOut};
    border-radius: ${e.radii.medium};
    margin: ${e.space["0.5"]} 0;
    font-style: italic;
    white-space: nowrap;
  `),Vi=e=>(r,o)=>{if(o.label){const a=o.label.trim().toLowerCase();a.indexOf(e)!==-1&&r.options.push(o),a===e&&(r.exactMatch=!0)}return r};var qo=(e=>(e.ArrowUp="ArrowUp",e.ArrowDown="ArrowDown",e.Enter="Enter",e))(qo||{});const Zi=(e,r,o)=>typeof o=="string"?o:(o==null?void 0:o[e])||r,ur=(e,r,o)=>typeof o=="number"?o:(o==null?void 0:o[e])||r,Pt=t.forwardRef(({description:e,disabled:r,autocomplete:o=!1,createable:a=!1,createablePrefix:i="Add ",placeholder:n,direction:c="down",error:u,hideLabel:d,inline:p,id:h,label:f,labelSecondary:g,required:$,tabIndex:x=-1,readOnly:b=!1,width:k,onBlur:L,onChange:y,onFocus:v,onCreate:m,options:w,rows:Z,emptyListMessage:H="No results",name:B,value:R,size:C="medium",padding:G,inputSize:T,align:N,validated:j,showDot:D=!1,...P},V)=>{const O=t.useRef(null),ie=V||O,J=t.useRef(null),W=t.useRef(null),[_,ee]=t.useState(""),[I,oe]=t.useState(""),X=a&&I!=="",le=a||o,[ce]=t.useState(h||$i()),[me,be]=t.useState("");t.useEffect(()=>{R!==me&&R!==void 0&&be(R)},[R]);const se=(w==null?void 0:w.find(E=>E.value===me))||null,z=(E,S)=>{if(!(E!=null&&E.disabled)){if((E==null?void 0:E.value)===et)m&&m(I);else if(E!=null&&E.value&&(be(E==null?void 0:E.value),S)){const q=S.nativeEvent||S,Ce=new q.constructor(q.type,q);Object.defineProperties(Ce,{target:{writable:!0,value:{value:E.value,name:B}},currentTarget:{writable:!0,value:{value:E.value,name:B}}}),y&&y(Ce)}}},Y=t.useMemo(()=>{if(!le||I==="")return w;const E=I.trim().toLowerCase(),{options:S,exactMatch:q}=(Array.isArray(w)?w:[w]).reduce(Vi(E),{options:[],exactMatch:!1});return[...S,...X&&!q?[{label:`${i}"${I}"`,value:et}]:[]]},[w,X,le,I,i]),[Xe,he]=t.useState(-1),Te=t.useCallback(E=>{const S=Y[E];if(S&&!S.disabled&&S.value!==et){he(E),ee(S.label||"");return}ee(I),he(E)},[Y,I,ee,he]),Tt=E=>{var q;let S=Xe;do{if(E==="previous"?S--:S++,S<0)return Te(-1);if(Y[S]&&!((q=Y[S])!=null&&q.disabled))return Te(S)}while(Y[S])},ll=E=>{const S=Y[Xe];S&&z(S,E),Bt()},[ae,de]=t.useState(!1),$e=!r&&ae,al=I!==""&&le,nl=ur("min",4,T),il=ur("max",20,T),cl=Math.min(Math.max(nl,I.length),il),[Ke,sl]=ot.useTransition({timeout:{enter:0,exit:300},preEnter:!0});we.useEffect(()=>{sl($e)},[$e]),we.useEffect(()=>{!ae&&Ke==="unmounted"&&Bt()},[ae,Ke]);const dl=Zi("inner",C==="small"?"3":"4",G),Bt=()=>{oe(""),ee(""),he(-1)},ul=()=>{le&&!ae&&de(!0),le||de(!ae)},Ot=E=>{if(!ae)return E.stopPropagation(),E.preventDefault(),de(!0);E.key in qo&&(E.preventDefault(),E.stopPropagation(),E.key==="ArrowUp"?Tt(c==="up"?"next":"previous"):E.key==="ArrowDown"&&Tt(c==="up"?"previous":"next"),E.key==="Enter"&&(ll(E),de(!1)))},pl=E=>{const S=E.currentTarget.value;oe(S),ee(S),he(-1)},fl=E=>{E.stopPropagation(),oe(""),ee(""),he(-1)},gl=()=>{Te(-1)},ml=E=>S=>{S.stopPropagation(),z(E,S),de(!1)},bl=E=>{const S=Number(E.currentTarget.getAttribute("data-option-index"));isNaN(S)||Te(S)};ca(J,"click",()=>de(!1),ae);const Ht=({option:E,...S})=>E?t.createElement(t.Fragment,null,E.prefix&&t.createElement("div",null,E.prefix),t.createElement(Uo,{...S},E.node?E.node:E.label||E.value)):null;return t.createElement(te,{"data-testid":"select",description:e,disabled:r,error:u,hideLabel:d,id:ce,inline:p,label:f,labelSecondary:g,readOnly:b,required:$,width:k},E=>t.createElement(wi,{...P,"aria-controls":`listbox-${ce}`,"aria-expanded":"true","aria-haspopup":"listbox","aria-invalid":u?!0:void 0,"data-testid":"select-container",role:"combobox",onClick:ul,onKeyDown:Ot,$disabled:!!r,$hasError:!!u,$open:$e,$readOnly:b,$showDot:D,$size:C,$validated:!!j,id:`combo-${ce}`,ref:J,tabIndex:x,onBlur:L,onFocus:v},t.createElement(vi,{$disabled:!!r,$hasError:!!u,$ids:E,$open:$e,$size:C},t.createElement(yi,{ref:ie,...E==null?void 0:E.content,"aria-hidden":!0,disabled:r,name:B,placeholder:n,readOnly:b,tabIndex:-1,value:me,onChange:S=>{const q=S.target.value,Ce=w==null?void 0:w.find(hl=>hl.value===q);Ce&&(be(Ce.value),y&&y(S))},onFocus:()=>{var S;W.current?W.current.focus():(S=J.current)==null||S.focus()}}),le&&$e?t.createElement(xi,{autoCapitalize:"none",autoComplete:"off",autoFocus:!0,"data-testid":"select-input",placeholder:(se==null?void 0:se.label)||n,ref:W,size:cl,spellCheck:"false",style:{flex:"1",height:"100%"},value:_,onChange:pl,onKeyDown:S=>Ot(S)}):se?t.createElement(Ht,{"data-testid":"selected",option:se}):t.createElement(Ei,null,n),al?t.createElement(Yo,{$size:C,type:"button",onClick:fl},t.createElement(Me,null)):b?null:t.createElement(Ci,{$direction:c,$open:$e,$size:C,id:"chevron",type:"button",onClick:()=>de(!ae)},t.createElement(Ue,null))),t.createElement(ki,{$align:N,$direction:c,$rows:Z,$size:C,$state:Ke,id:`listbox-${ce}`,role:"listbox",tabIndex:-1,onMouseLeave:gl},t.createElement(Ri,{$direction:c,$rows:Z,$size:C},Y.length===0&&t.createElement(Li,null,H),Y.map((S,q)=>t.createElement(Pi,{$selected:(S==null?void 0:S.value)===me,$highlighted:q===Xe,$gap:dl,$color:S.color,$size:C,"data-option-index":q,"data-testid":`select-option-${S.value}`,disabled:S.disabled,key:S.value,role:"option",type:"button",onClick:ml(S),onMouseOver:bl},t.createElement(Ht,{option:S})))))))});Pt.displayName="Select";const Mi=s.default.div(({theme:e})=>l.css`
    width: ${e.space.full};
  `),pr=({theme:e})=>l.css`
  width: ${e.space[4]};
  height: ${e.space[4]};
  background: ${e.colors.accent};
  border-radius: ${e.radii.full};
  cursor: pointer;
  transition: filter 0.15s ease-in-out;
  filter: brightness(1);
  &:hover {
    filter: brightness(0.95);
  }
  &:active {
    filter: brightness(0.875);
  }
`,Gi=s.default.input(({theme:e,disabled:r})=>l.css`
    appearance: none;
    width: ${e.space.full};
    height: ${e.space["1.5"]};
    background: hsla(${e.colors.raw.accent} / 0.4);
    border-radius: ${e.radii.full};
    outline: none;

    &::-webkit-slider-thumb {
      appearance: none;
      ${pr}
    }

    &::-moz-range-thumb {
      ${pr}
    }

    &:hover {
      background: hsla(${e.colors.raw.accent} / 0.45);
    }

    ${r&&l.css`
      opacity: 0.5;
      filter: grayscale(100%);
      cursor: not-allowed;
    `}
  `),Lt=t.forwardRef(({label:e,description:r,error:o,hideLabel:a,inline:i,labelSecondary:n,required:c,width:u,defaultValue:d,disabled:p,id:h,name:f,readOnly:g,tabIndex:$,value:x,min:b=1,max:k=100,onChange:L,onBlur:y,onFocus:v,step:m="any",...w},Z)=>{const H=t.useRef(null),B=Z||H;return t.createElement(te,{label:e,description:r,error:o,hideLabel:a,inline:i,labelSecondary:n,required:c,width:u,id:h},R=>t.createElement(Mi,null,t.createElement(Gi,{ref:B,type:"range",...w,...R==null?void 0:R.content,defaultValue:d,disabled:p,name:f,readOnly:g,tabIndex:$,value:x,min:b,max:k,onChange:L,onBlur:y,onFocus:v,step:m})))});Lt.displayName="Slider";const Ti=s.default.div(({theme:e,$error:r,$validated:o,$showDot:a,$alwaysShowAction:i,$disabled:n})=>l.css`
    position: relative;
    background-color: ${e.colors.backgroundSecondary};
    border-radius: ${e.radii.large};
    color: ${e.colors.text};
    display: flex;
    transition-duration: ${e.transitionDuration[150]};
    transition-property: color, border-color, background-color;
    transition-timing-function: ${e.transitionTimingFunction.inOut};

    :after {
      content: '';
      position: absolute;
      width: ${e.space[4]};
      height: ${e.space[4]};
      border: 2px solid ${e.colors.backgroundPrimary};
      right: -${e.space["1.5"]};
      top: -${e.space["1.5"]};
      border-radius: ${e.radii.full};
      transition: all 0.3s ease-in-out;
      transform: scale(0.3);
      opacity: 0;
    }

    ${a&&!n&&r&&l.css`
      &:after {
        background-color: ${e.colors.redPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${a&&!n&&o&&!r&&l.css`
      &:after {
        background-color: ${e.colors.greenPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${a&&!r&&l.css`
      &:focus-within::after {
        background-color: ${e.colors.bluePrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    textarea:disabled ~ button {
      opacity: 0;
      transform: scale(0.8);
    }

    ${!i&&l.css`
      textarea:placeholder-shown ~ button {
        opacity: 0;
        transform: scale(0.8);
      }
    `}
  `),Bi=s.default.textarea(({theme:e,$size:r,$hasAction:o,$error:a})=>l.css`
    position: relative;
    color: ${e.colors.textPrimary};
    background-color: ${e.colors.backgroundPrimary};
    border-color: ${e.colors.border};
    border-width: 1px;
    border-style: solid;

    display: flex;
    font-family: ${e.fonts.sans};
    font-size: ${e.fontSizes.body};
    font-weight: ${e.fontWeights.normal};
    min-height: ${e.space[14]};
    padding: ${e.space["3.5"]}
      ${o?e.space[10]:e.space[4]} ${e.space["3.5"]}
      ${e.space[4]};
    width: ${e.space.full};
    border-radius: ${e.radii.large};
    overflow: hidden;
    resize: none;
    outline: none;
    transition: all 0.3s ease-in-out;

    &::placeholder {
      color: ${e.colors.greyPrimary};
    }

    &:disabled {
      color: ${e.colors.greyPrimary};
      background: ${e.colors.greyLight};
    }

    ${r==="small"&&l.css`
      font-size: ${e.fontSizes.small};
      line-height: ${e.lineHeights.small};
      padding: ${e.space["2.5"]}
        ${o?e.space[9]:e.space["3.5"]}
        ${e.space["2.5"]} ${e.space["3.5"]};
    `}

    ${a&&l.css`
      border-color: ${e.colors.redPrimary};
      color: ${e.colors.redPrimary};
    `}

    ${!a&&l.css`
      &:focus-within {
        border-color: ${e.colors.bluePrimary};
      }
    `}

    &:read-only {
      border-color: ${e.colors.border};
      cursor: default;
    }
  `),Oi=s.default.button(({theme:e,$size:r})=>l.css`
    position: absolute;
    top: 0;
    right: 0;
    width: ${r==="small"?e.space[10]:e.space[12]};
    height: ${r==="small"?e.space[10]:e.space[12]};
    transition: all 0.1s ease-in-out;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      display: block;
      width: ${r==="small"?e.space[3]:e.space[4]};
      height: ${r==="small"?e.space[3]:e.space[4]};
      color: ${e.colors.greyPrimary};
      transition: all 0.1s ease-in-out;
    }

    &:hover svg {
      color: ${e.colors.greyBright};
      transform: translateY(-1px);
    }
  `),Vt=t.forwardRef(({autoCorrect:e,autoFocus:r,clearable:o=!1,defaultValue:a,description:i,disabled:n,error:c,validated:u,showDot:d,hideLabel:p,id:h,label:f,labelSecondary:g,maxLength:$,name:x="textarea",placeholder:b,readOnly:k,required:L,rows:y=5,size:v="medium",spellCheck:m,tabIndex:w,value:Z,width:H,actionIcon:B,alwaysShowAction:R=!1,onClickAction:C,onChange:G,onBlur:T,onFocus:N,...j},D)=>{const P=t.useRef(null),V=D||P,O=c?!0:void 0,ie=o||!!C,J=()=>{var oe,X;if(!G)return V.current&&(V.current.value=""),(oe=V.current)==null?void 0:oe.focus();const _=document.createElement("input");_.value="",_.name=x;const ee=new Event("change",{bubbles:!0});Object.defineProperties(ee,{target:{writable:!1,value:_},currentTarget:{writable:!1,value:_}});const I=Wo(ee);G(I),(X=V.current)==null||X.focus()},W=()=>{if(C)return C();J()};return t.createElement(te,{description:i,disabled:n,error:c,hideLabel:p,id:h,label:f,labelSecondary:g,readOnly:k,required:L,width:H},_=>t.createElement(Ti,{$alwaysShowAction:R,$disabled:n,$error:!!c,$showDot:d,$validated:u},t.createElement(Bi,{...j,..._==null?void 0:_.content,"aria-invalid":O,$error:O,$hasAction:ie,$showDot:d,$size:v,$validated:u,autoCorrect:e,autoFocus:r,defaultValue:a,disabled:n,maxLength:$,name:x,placeholder:b,readOnly:k,ref:V,rows:y,spellCheck:m,tabIndex:w,value:Z,onBlur:T,onChange:G,onFocus:N}),(o||C)&&t.createElement(Oi,{$size:v,type:"button",onClick:W},B||t.createElement(Me,null))))});Vt.displayName="Textarea";const fr={small:{width:"12",height:"7"},medium:{width:"12",height:"8"},large:{width:"16",height:"10"}},Oe={small:{diameter:"5",translateX:"2.5"},medium:{diameter:"6",translateX:"2"},large:{diameter:"8",translateX:"3"}},Hi=s.default.input(({theme:e,$size:r="medium"})=>l.css`
    position: relative;
    background-color: ${e.colors.border};
    height: ${e.space[fr[r].height]};
    width: ${e.space[fr[r].width]};
    border-radius: ${e.radii.full};
    transition: background-color 0.1s ease-in-out;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    &:checked {
      background-color: ${e.colors.bluePrimary};
    }

    &:disabled {
      cursor: not-allowed;
    }

    &::after {
      content: '';
      display: block;
      position: absolute;
      background-color: ${e.colors.backgroundPrimary};
      width: ${e.space[Oe[r].diameter]};
      height: ${e.space[Oe[r].diameter]};
      border-radius: ${e.radii.full};
      transform: translateX(-${e.space[Oe[r].translateX]});
      transition: transform 0.3s ease-in-out, background-color 0.1s ease-in-out;
    }

    &:checked::after {
      transform: translateX(${e.space[Oe[r].translateX]});
    }

    &:disabled::after {
      background-color: ${e.colors.greyPrimary};
    }
  `),Zt=t.forwardRef(({size:e="medium",...r},o)=>t.createElement(Hi,{ref:o,type:"checkbox",...r,$size:e}));Zt.displayName="Toggle";const gr={top:`
    &:after {
      display: initial;
      content: '';
      position: absolute;
      bottom: -18px;
      left: 0;
      right: 0;
      margin: 0 auto;
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-top-color: white;
    }
  `,bottom:`
    &:after {
      display: initial;
      content: '';
      position: absolute;
      top: -18px;
      left: 0;
      right: 0;
      margin: 0 auto;
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-bottom-color: white;
    }
  `,left:`
    display: flex;
    align-items: center;
    &:before {
      display: initial;
      content: '';
      position: absolute;
      right: -18px;
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-left-color: white;
    }
  `,right:`
    display: flex;
    align-items: center;
    &:before {
      display: initial;
      content: '';
      position: absolute;
      left: -18px;
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-right-color: white;
    }
  `},Ai=s.default.div(({theme:e,$placement:r,$mobilePlacement:o})=>l.css`
    position: relative;
    pointer-events: none;
    box-sizing: border-box;
    filter: drop-shadow(0px 0px 1px #e8e8e8)
      drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2));
    border-radius: ${e.radii.large};
    padding: ${e.space["2.5"]} ${e.space["2.5"]} ${e.space["2.5"]}
      ${e.space["3.5"]};
    background: ${e.colors.background};

    ${gr[o]}
    ${U.md.min(l.css`
      &:before {
        display: none;
      }
      &:after {
        display: none;
      }
      ${gr[r]}
    `)}
  `),ji=({placement:e,mobilePlacement:r,children:o})=>t.createElement(Ai,{$mobilePlacement:r,$placement:e,"data-testid":"tooltip-popover"},o),Mt=({content:e,placement:r="top",mobilePlacement:o="top",children:a,...i})=>{const n=t.useRef(null),c=t.Children.only(a),u=t.cloneElement(c,{ref:n}),d=t.createElement(ji,{mobilePlacement:o,placement:r},e);return t.createElement(t.Fragment,null,t.createElement(Ne,{anchorRef:n,mobilePlacement:o,placement:r,popover:d,...i}),u)};Mt.displayName="Tooltip";const Fi=s.default.button(({theme:e})=>l.css`
    position: absolute;
    top: ${e.space[3]};
    right: ${e.space[3]};
    color: ${e.colors.greyPrimary};
    cursor: pointer;
    transition-property: all;
    transition-duration: ${e.transitionDuration[150]};
    transition-timing-function: ${e.transitionTimingFunction.inOut};

    &:hover {
      opacity: 0.7;
    }

    svg {
      display: block;
      width: ${e.space[9]};
      height: ${e.space[9]};
      padding: ${e.space["1.5"]};
    }
  `),Xo=s.default.div(({theme:e})=>l.css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: ${e.space[6]};

    padding: ${e.space["3.5"]};
    border-radius: ${e.radii["3xLarge"]};
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    background-color: ${e.colors.background};
    position: relative;
    width: 100%;
    ${U.sm.min(l.css`
      width: initial;
    `)}
    ${U.md.min(l.css`
      max-width: 80vw;
      border-radius: ${e.radii["3xLarge"]};
    `)}
  `),Di=s.default.div(({theme:e,$alert:r})=>l.css`
    width: ${e.space[8]};
    height: ${e.space[8]};
    flex: 0 0 ${e.space[8]};

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    ${r==="error"&&l.css`
      background: ${e.colors.redPrimary};
      color: ${e.colors.backgroundPrimary};
      border-radius: ${e.radii.full};

      svg {
        transform: scale(0.5);
      }
    `}

    ${r==="warning"&&l.css`
      background: ${e.colors.yellowPrimary};
      color: ${e.colors.backgroundPrimary};
      border-radius: ${e.radii.full};

      svg {
        transform: scale(0.5);
      }
    `}
  `),zi=({alert:e})=>{const r=!!e&&["error","warning"].includes(e);return t.createElement(Di,{$alert:e},r?t.createElement(Ve,null):t.createElement(Ye,null))},Ni=s.default(A)(()=>l.css`
    text-align: center;
  `),Wi=s.default(A)(({theme:e})=>l.css`
    font-size: ${e.fontSizes.body};
    line-height: ${e.lineHeights.body};
    font-weight: ${e.fontWeights.bold};
    color: ${e.colors.textSecondary};
    text-align: center;

    padding: 0 ${e.space[4]};
    max-width: ${e.space[72]};
  `),_i=s.default.div(({theme:e})=>l.css`
    display: flex;
    align-items: center;
    justify-content: stretch;
    flex-direction: column;
    gap: ${e.space[2]};
    width: ${e.space.full};
    ${U.sm.min(l.css`
      flex-direction: row;
    `)}
  `),Ii=s.default.div(({theme:e})=>l.css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${e.space[4]};
  `),Ui=s.default.div(({theme:e})=>l.css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${e.space[1]};
  `),Ko=s.default.div(({theme:e})=>l.css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${e.space[5]};
    ${U.sm.min(l.css`
      min-width: ${e.space[64]};
    `)}
  `),Yi=s.default.div(({theme:e})=>l.css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${e.space[2]};
  `),qi=s.default.div(({theme:e,$type:r})=>l.css`
    border-radius: ${e.radii.full};
    width: ${e.space["3.5"]};
    height: ${e.space["3.5"]};
    ${r==="notStarted"&&l.css`
      border: ${e.borderWidths["0.5"]} ${e.borderStyles.solid}
        ${e.colors.border};
    `}
    ${r==="inProgress"&&l.css`
      border: ${e.borderWidths["0.5"]} ${e.borderStyles.solid}
        ${e.colors.accent};
    `}
    ${r==="completed"&&l.css`
      background-color: ${e.colors.accent};
    `}
  `),Qo=({title:e,subtitle:r,alert:o})=>t.createElement(Ui,null,o&&t.createElement(zi,{alert:o}),e&&(typeof e!="string"&&e||t.createElement(Ni,{fontVariant:"headingFour"},e)),r&&(typeof r!="string"&&r||t.createElement(Wi,null,r))),Jo=({leading:e,trailing:r,currentStep:o,stepCount:a,stepStatus:i})=>{const n=t.useCallback(p=>p===o?i||"inProgress":p<(o||0)?"completed":"notStarted",[o,i]),c=e||r;return c||!!a?t.createElement(Ii,null,a&&t.createElement(Yi,{"data-testid":"step-container"},Array.from({length:a},(p,h)=>t.createElement(qi,{$type:n(h),"data-testid":`step-item-${h}-${n(h)}`,key:h}))),c&&t.createElement(_i,null,e,r)):null},mr=({open:e,onDismiss:r,alert:o,title:a,subtitle:i,children:n,currentStep:c,stepCount:u,stepStatus:d,...p})=>t.createElement(Ge,{...p,open:e,onDismiss:r},t.createElement(Xo,null,t.createElement(Ko,null,t.createElement(Qo,{alert:o,title:a,subtitle:i,currentStep:c,stepCount:u,stepStatus:d}),n))),He=({onClick:e})=>t.createElement(Fi,{"data-testid":"close-icon",onClick:e},t.createElement(Ee,null)),xe=({children:e,onDismiss:r,onClose:o,open:a,variant:i="closable",...n})=>{if(i==="actionable"){const{trailing:c,leading:u,alert:d,title:p,subtitle:h,center:f,currentStep:g,stepCount:$,stepStatus:x,...b}=n,k=o||r;return t.createElement(mr,{...b,alert:d,open:a,subtitle:h,title:p,onDismiss:r},e,t.createElement(Jo,{leading:u,trailing:c,center:f,currentStep:g,stepCount:$,stepStatus:x}),k&&t.createElement(He,{onClick:k}))}else if(i==="closable"){const{alert:c,title:u,subtitle:d,...p}=n,h=o||r;return t.createElement(mr,{...p,alert:c,open:a,subtitle:d,title:u,onDismiss:r},e,h&&t.createElement(He,{onClick:h}))}return t.createElement(Ge,{onDismiss:r,open:a},t.createElement(Xo,null,t.createElement(Ko,null,e),o&&t.createElement(He,{onClick:o})))};xe.displayName="Dialog";xe.Footer=Jo;xe.Heading=Qo;xe.CloseButton=He;const el=s.default.svg(({theme:e})=>l.css`
    position: absolute;
    top: ${e.space["2.5"]};
    right: ${e.space["2.5"]};
    width: ${e.space[9]};
    height: ${e.space[9]};
    padding: ${e.space["1.5"]};
    opacity: 0.5;
    cursor: pointer;
    transition-property: all;
    transition-duration: ${e.transitionDuration[150]};
    transition-timing-function: ${e.transitionTimingFunction.inOut};

    &:hover {
      opacity: 0.7;
    }
  `),tl=s.default.div(({theme:e,$state:r,$top:o,$left:a,$right:i,$bottom:n,$mobile:c,$popped:u})=>l.css`
    position: fixed;
    z-index: 10000;

    width: 92.5%;
    left: 3.75%;
    top: calc(100vh / 100 * 2.5);

    ${u&&l.css`
      width: 95%;
      left: 2.5%;
      touch-action: none;
    `}

    ${!c&&l.css`
      max-width: ${e.space[112]};
      top: unset;
      left: unset;

      ${o&&`top: ${e.space[o]};`}
      ${a&&`left: ${e.space[a]};`}
      ${i&&`right: ${e.space[i]};`}
      ${n&&`bottom: ${e.space[n]};`}
    `}

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: ${e.space["4.5"]};

    background: hsla(${e.colors.raw.backgroundPrimary} / 0.8);
    box-shadow: ${e.boxShadows["0.02"]};
    border: ${e.borderWidths.px} solid ${e.colors.greySurface};
    backdrop-filter: blur(16px);
    border-radius: ${e.radii["2xLarge"]};

    transition: ${e.transitionDuration[300]} all
      ${e.transitionTimingFunction.popIn};

    ${r==="entered"?l.css`
          opacity: 1;
          transform: translateY(0px);
        `:l.css`
          opacity: 0;
          transform: translateY(-64px);
        `}
  `),rl=s.default(A)(({theme:e})=>l.css`
    font-size: ${e.fontSizes.headingFour};
    line-height: ${e.lineHeights.headingFour};
  `),Xi=s.default.div(({theme:e})=>l.css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: ${e.space[3]};
    margin-bottom: calc(-1 * ${e.space[2]});
  `),Ki=s.default.div(({theme:e})=>l.css`
    width: ${e.space[8]};
    height: ${e.space[1]};
    border-radius: ${e.radii.full};
    background: ${e.colors.border};
  `),Qi=()=>t.createElement(Xi,null,t.createElement(Ki,null)),Ji=({onClose:e,title:r,description:o,top:a="4",left:i,right:n="4",bottom:c,state:u,children:d,...p})=>t.createElement(tl,{...p,"data-testid":re(p,"toast-desktop"),$bottom:c,$left:i,$mobile:!1,$right:n,$state:u,$top:a},t.createElement(el,{as:Ee,"data-testid":"toast-close-icon",onClick:()=>e()}),t.createElement(rl,{fontVariant:"large",weight:"bold"},r),t.createElement(A,null,o),d&&t.createElement(ol,null,d)),ol=s.default.div(({theme:e})=>l.css`
    margin-top: ${e.space[3]};
    width: 100%;
  `),ec=({onClose:e,open:r,title:o,description:a,left:i,right:n="4",bottom:c,state:u,children:d,popped:p,setPopped:h,...f})=>{const{space:g}=l.useTheme(),$=t.useRef(null),[x,b]=t.useState(.025*window.innerHeight),[k,L]=t.useState([]);t.useEffect(()=>{r&&b(.025*window.innerHeight)},[r]),t.useEffect(()=>{var w;const m=.025*window.innerHeight;if(k.length&&!p){let Z=!1,H=k[k.length-1];H===void 0&&(H=k[k.length-2]||0,Z=!0);const B=parseInt(getComputedStyle(document.documentElement).fontSize),R=k[0]-H;if(Z)parseFloat(g[8])*B>(((w=$.current)==null?void 0:w.offsetHeight)||0)-R?e():(b(m),L([]));else if(R*-1>parseFloat(g[32])*B)b(m*2),h(!0);else if(R>0)b(m-R);else{const C=.25*(R^2);b(m-C)}}},[k]);const y=t.useCallback(m=>{var w;m.preventDefault(),L([(w=m.targetTouches.item(0))==null?void 0:w.pageY])},[]),v=t.useCallback(m=>{m.preventDefault(),L(w=>{var Z;return[...w,(Z=m.targetTouches.item(0))==null?void 0:Z.pageY]})},[]);return t.useEffect(()=>{const m=$.current;return m==null||m.addEventListener("touchstart",y,{passive:!1,capture:!1}),m==null||m.addEventListener("touchmove",v,{passive:!1,capture:!1}),()=>{m==null||m.removeEventListener("touchstart",y,{capture:!1}),m==null||m.removeEventListener("touchmove",v,{capture:!1})}},[]),t.useEffect(()=>{const m=$.current;p&&(m==null||m.removeEventListener("touchstart",y,{capture:!1}),m==null||m.removeEventListener("touchmove",v,{capture:!1}))},[p]),t.createElement(tl,{...f,"data-testid":re(f,"toast-touch"),style:{top:`${x}px`},onClick:()=>h(!0),onTouchEnd:()=>L(m=>[...m,void 0]),$bottom:c,$left:i,$mobile:!0,$popped:p,$right:n,$state:u,ref:$},t.createElement(rl,{fontVariant:"large",weight:"bold"},o),t.createElement(A,null,a),p&&t.createElement(t.Fragment,null,d&&t.createElement(ol,null,d),t.createElement(el,{as:Ee,"data-testid":"toast-close-icon",onClick:m=>{m.stopPropagation(),e()}})),!p&&t.createElement(Qi,null))},Gt=({onClose:e,open:r,msToShow:o=8e3,variant:a="desktop",...i})=>{const[n,c]=t.useState(!1),u=t.useRef();return t.useEffect(()=>{if(r)return c(!1),u.current=setTimeout(()=>e(),o||8e3),()=>{clearTimeout(u.current),e()}},[r]),t.useEffect(()=>{n&&clearTimeout(u.current)},[n]),t.createElement(Le,{className:"toast",noBackground:!0,open:r,onDismiss:a==="touch"&&n?()=>e():void 0},({state:d})=>a==="touch"?t.createElement(ec,{...i,open:r,popped:n,setPopped:c,state:d,onClose:e}):t.createElement(Ji,{...i,open:r,state:d,onClose:e}))};Gt.displayName="Toast";const tc=Object.freeze(Object.defineProperty({__proto__:null,Avatar:je,BackdropSurface:lt,Banner:it,Button:De,Card:ze,DynamicPopover:Ne,Field:te,FileInput:st,Heading:We,Portal:_e,RecordItem:dt,ScrollBox:Vr,Skeleton:pt,Spinner:pe,Tag:Ie,Typography:A,VisuallyHidden:ge,Backdrop:Le,Checkbox:ft,CheckboxRow:gt,CountdownCircle:wt,CurrencyToggle:vt,Dropdown:qe,FieldSet:yt,Helper:Et,Input:xt,Modal:Ge,PageButtons:No,Profile:Ct,RadioButton:kt,RadioButtonGroup:St,Select:Pt,SkeletonGroup:ut,Slider:Lt,Textarea:Vt,Toggle:Zt,Tooltip:Mt,Dialog:xe,Toast:Gt,AeroplaneSVG:Mr,AlertSVG:Ve,BrowserSVG:Gr,CalendarSVG:Tr,CameraSVG:Br,CheckSVG:Ze,CheckCircleSVG:Or,CogSVG:Hr,CogActiveSVG:Ar,CopySVG:mt,CounterClockwiseArrowSVG:jr,CreditCardSVG:Fr,CrossSVG:Ee,CrossCircleSVG:Me,DisabledSVG:Dr,DocumentSVG:zr,DotGridSVG:Nr,DotGridActiveSVG:Wr,DownArrowSVG:_r,DownChevronSVG:Ue,DownCircleSVG:Ir,EnsSVG:Ur,EthSVG:Ye,EthTransparentSVG:Yr,EthTransparentInvertedSVG:qr,ExitSVG:Xr,EyeSVG:Kr,EyeStrikethroughSVG:Qr,FastForwardSVG:Jr,FilterSVG:eo,FlameSVG:to,GasPumpSVG:ro,HeartSVG:oo,HeartActiveSVG:lo,HouseSVG:ao,InfoCircleSVG:bt,KeySVG:no,LanguageSVG:io,LeftArrowSVG:co,LeftChevronSVG:so,LifebuoySVG:uo,LinkSVG:po,ListSVG:fo,ListDownSVG:go,ListUpSVG:mo,LockSVG:bo,MagnifyingGlassSVG:ho,MagnifyingGlassActiveSVG:$o,MagnifyingGlassSimpleSVG:wo,MarkerSVG:vo,MenuSVG:yo,MinusSVG:Eo,MinusCircleSVG:xo,MoonSVG:Co,NametagSVG:ko,OutlinkSVG:So,PersonSVG:Ro,PersonActiveSVG:Po,PersonPlusSVG:Lo,PlusSVG:Vo,PlusCircleSVG:Zo,QuestionBubbleSVG:Mo,QuestionCircleSVG:Go,RightArrowSVG:To,RightChevronSVG:Bo,SpannerSVG:Oo,SpannerAltSVG:Ho,SunSVG:Ao,UpArrowSVG:ht,UpChevronSVG:jo,UpCircleSVG:Fo,UpRightArrowSVG:$t,WalletSVG:Do},Symbol.toStringTag,{value:"Module"})),rc=l.createGlobalStyle(({theme:e})=>l.css`
    *,
    ::before,
    ::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: ${e.fonts.sans};
      border-color: ${e.colors.greyLight};
      border-style: ${e.borderStyles.solid};
      border-width: 0;
      color: currentColor;
      font-size: 100%;
      font-feature-settings: 'ss01' on, 'ss03' on;
      vertical-align: baseline;
    }

    [data-js-focus-visible] &:focus:not([data-focus-visible-added]) {
      outline: none;
    }

    html {
      font-size: ${e.fontSizes.body};
      color: ${e.colors.text};
      text-rendering: optimizeLegibility;
      background: radial-gradient(
          40.48% 67.6% at 50% 32.4%,
          #ecf4ff 0%,
          #f7f7ff 52.77%,
          #f7f7f7 100%
        ),
        #ffffff;
    }

    body {
      line-height: normal;
    }

    article,
    aside,
    details,
    div,
    figcaption,
    figure,
    footer,
    header,
    hgroup,
    menu,
    nav,
    section {
      display: block;
    }

    ul,
    ol {
      list-style: none;
    }

    blockquote {
      quotes: none;

      &::before,
      &::after {
        content: '';
      }
    }

    table {
      border-collapse: collapse;
      border-spacing: 0;
    }

    fieldset {
      display: block;
      appearance: none;
      outline: none;
      &:placeholder {
        color: ${e.colors.text};
        opacity: 1;
      }
    }

    mark {
      background-color: transparent;
      color: inherit;
    }

    select {
      display: block;
      appearance: none;
      outline: none;
      &:placeholder {
        color: ${e.colors.text};
        opacity: 1;
      }

      &:-ms-expand {
        display: none;
      }
    }

    input {
      display: block;
      appearance: none;
      outline: none;
      &:placeholder {
        color: ${e.colors.text};
        opacity: 1;
      }
      &::-webkit-outer-spin-button {
        webkit-appearance: none;
      }
      &::-webkit-inner-spin-button {
        webkit-appearance: none;
      }
      &::-ms-clear {
        display: none;
      }
      &::-webkit-search-cancel-button {
        webkit-appearance: none;
      }
    }

    button {
      background: none;
    }

    a {
      text-decoration: none;
      color: inherit;
    }
  `),oc=rc;exports.AeroplaneSVG=Mr;exports.AlertSVG=Ve;exports.Avatar=je;exports.Backdrop=Le;exports.BackdropSurface=lt;exports.Banner=it;exports.BrowserSVG=Gr;exports.Button=De;exports.CalendarSVG=Tr;exports.CameraSVG=Br;exports.Card=ze;exports.CheckCircleSVG=Or;exports.CheckSVG=Ze;exports.Checkbox=ft;exports.CheckboxRow=gt;exports.CogActiveSVG=Ar;exports.CogSVG=Hr;exports.Components=tc;exports.CopySVG=mt;exports.CountdownCircle=wt;exports.CounterClockwiseArrowSVG=jr;exports.CreditCardSVG=Fr;exports.CrossCircleSVG=Me;exports.CrossSVG=Ee;exports.CurrencyToggle=vt;exports.Dialog=xe;exports.DisabledSVG=Dr;exports.DocumentSVG=zr;exports.DotGridActiveSVG=Wr;exports.DotGridSVG=Nr;exports.DownArrowSVG=_r;exports.DownChevronSVG=Ue;exports.DownCircleSVG=Ir;exports.Dropdown=qe;exports.DynamicPopover=Ne;exports.EnsSVG=Ur;exports.EthSVG=Ye;exports.EthTransparentInvertedSVG=qr;exports.EthTransparentSVG=Yr;exports.ExitSVG=Xr;exports.EyeSVG=Kr;exports.EyeStrikethroughSVG=Qr;exports.FastForwardSVG=Jr;exports.Field=te;exports.FieldSet=yt;exports.FileInput=st;exports.FilterSVG=eo;exports.FlameSVG=to;exports.GasPumpSVG=ro;exports.Heading=We;exports.HeartActiveSVG=lo;exports.HeartSVG=oo;exports.Helper=Et;exports.HouseSVG=ao;exports.InfoCircleSVG=bt;exports.Input=xt;exports.KeySVG=no;exports.LanguageSVG=io;exports.LeftArrowSVG=co;exports.LeftChevronSVG=so;exports.LifebuoySVG=uo;exports.LinkSVG=po;exports.ListDownSVG=go;exports.ListSVG=fo;exports.ListUpSVG=mo;exports.LockSVG=bo;exports.MagnifyingGlassActiveSVG=$o;exports.MagnifyingGlassSVG=ho;exports.MagnifyingGlassSimpleSVG=wo;exports.MarkerSVG=vo;exports.MenuSVG=yo;exports.MinusCircleSVG=xo;exports.MinusSVG=Eo;exports.Modal=Ge;exports.MoonSVG=Co;exports.NametagSVG=ko;exports.OutlinkSVG=So;exports.PageButtons=No;exports.PersonActiveSVG=Po;exports.PersonPlusSVG=Lo;exports.PersonSVG=Ro;exports.PlusCircleSVG=Zo;exports.PlusSVG=Vo;exports.Portal=_e;exports.Profile=Ct;exports.QuestionBubbleSVG=Mo;exports.QuestionCircleSVG=Go;exports.RadioButton=kt;exports.RadioButtonGroup=St;exports.RecordItem=dt;exports.RightArrowSVG=To;exports.RightChevronSVG=Bo;exports.ScrollBox=Vr;exports.Select=Pt;exports.Skeleton=pt;exports.SkeletonGroup=ut;exports.Slider=Lt;exports.SpannerAltSVG=Ho;exports.SpannerSVG=Oo;exports.Spinner=pe;exports.SunSVG=Ao;exports.Tag=Ie;exports.Textarea=Vt;exports.ThorinGlobalStyles=oc;exports.Toast=Gt;exports.Toggle=Zt;exports.Tooltip=Mt;exports.Typography=A;exports.UpArrowSVG=ht;exports.UpChevronSVG=jo;exports.UpCircleSVG=Fo;exports.UpRightArrowSVG=$t;exports.VisuallyHidden=ge;exports.WalletSVG=Do;exports.baseTheme=at;exports.darkTheme=Zl;exports.lightTheme=Vl;exports.mq=U;exports.tokens=Se;
