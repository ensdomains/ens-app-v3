"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const he=require("react"),o=require("styled-components"),xr=require("react-dom"),at=require("react-transition-state"),Ro=e=>e&&typeof e=="object"&&"default"in e?e:{default:e};function Cr(e){if(e&&e.__esModule)return e;const r=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const n in e)if(n!=="default"){const a=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(r,n,a.get?a:{enumerable:!0,get:()=>e[n]})}}return r.default=e,Object.freeze(r)}const t=Cr(he),u=Ro(o),Po=Cr(xr),Lo=u.default.div(({theme:e,$shape:r,$noBorder:n})=>o.css`
    ${()=>{switch(r){case"circle":return o.css`
            border-radius: ${e.radii.full};
            &:after {
              border-radius: ${e.radii.full};
            }
          `;case"square":return o.css`
          border-radius: ${e.radii["2xLarge"]}
          &:after {
            border-radius: ${e.radii["2xLarge"]}
          }
        `;default:return o.css``}}}

    ${!n&&o.css`
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
  `),Vo=u.default.div(({theme:e,$url:r,$disabled:n})=>o.css`
    background: ${r||e.colors.gradients.blue};

    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    ${n&&o.css`
      filter: grayscale(1);
    `}
  `),Mo=u.default.img(({$shown:e,$disabled:r})=>o.css`
    height: 100%;
    width: 100%;
    object-fit: cover;
    display: none;

    ${e&&o.css`
      display: block;
    `}

    ${r&&o.css`
      filter: grayscale(1);
    `}
  `),je=({label:e,noBorder:r=!1,shape:n="circle",src:a,placeholder:l,decoding:i="async",disabled:c=!1,...d})=>{const s=t.useRef(null),[f,$]=t.useState(!!a),p=t.useCallback(()=>{$(!0)},[$]),g=t.useCallback(()=>{$(!1)},[$]);t.useEffect(()=>{const E=s.current;return E&&(E.addEventListener("load",p),E.addEventListener("loadstart",g),E.addEventListener("error",g)),()=>{E&&(E.removeEventListener("load",p),E.removeEventListener("loadstart",g),E.removeEventListener("error",g))}},[s,g,p]);const w=f&&!!a;return t.createElement(Lo,{$noBorder:!f||r,$shape:n},!w&&t.createElement(Vo,{$disabled:c,$url:l,"aria-label":e}),t.createElement(Mo,{...d,$disabled:c,$shown:w,alt:e,decoding:i,ref:s,src:a,onError:()=>$(!1),onLoad:()=>$(!0)}))};je.displayName="Avatar";const lt=u.default.div(({theme:e,$state:r,$empty:n})=>o.css`
    width: 100vw;
    height: 100vh;
    position: fixed;
    overflow: hidden;
    z-index: 999;
    top: 0;
    left: 0;
    transition: ${e.transitionDuration[300]} all
      ${e.transitionTimingFunction.popIn};

    ${!n&&r==="entered"?o.css`
          background-color: rgba(0, 0, 0, ${e.opacity.overlayFallback});

          @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
            backdrop-filter: blur(16px);
            background-color: rgba(0, 0, 0, ${e.opacity.overlay});
          }
        `:o.css`
          background-color: rgba(0, 0, 0, 0);
          @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
            backdrop-filter: blur(0px);
          }
        `}
  `),kr={none:"none",solid:"solid"},Sr={0:"0px",px:"1px","0.375":"0.09375rem","0.5":"0.125rem","0.75":"0.1875rem",1:"0.25rem","1.25":"0.3125rem","1.5":"0.375rem","1.75":"0.4375rem",2:"0.5rem"},Rr={none:"0",extraSmall:"2px",small:"4px",medium:"6px",large:"8px",almostExtraLarge:"10px",extraLarge:"12px","2xLarge":"16px","2.5xLarge":"20px","3xLarge":"24px","4xLarge":"40px",full:"9999px",input:"0.5rem",card:"1rem",checkbox:"0.25rem"},X={none:"none","-px":"inset 0 0 0 1px",0:"0 0 0 0","0.02":"0 2px 8px","0.25":"0 2px 12px","0.5":"0 0 0 0.125rem",1:"0 0 0 0.25rem",2:"0 0 0 0.5rem"},Zo=[50,100,300,400,500,750],To={Surface:50,Light:100,Bright:300,Primary:400,Dim:500,Active:750},Dt={blue:[216,100,61,{50:[215,100,97]}],indigo:[242,61,58],purple:[280,62,55],pink:[331,67,51,{100:[331,64,88]}],red:[7,76,44,{50:[0,60,94],100:[360,60,85]}],orange:[35,91,50,{100:[36,89,86]}],yellow:[47,86,49,{50:[48,100,90],100:[48,100,85]}],green:[162,72,40,{50:[157,37,93],100:[157,37,85]}],teal:[199,66,49],grey:[240,6,63,{50:[0,0,96],100:[0,0,91],500:[0,0,35],750:[0,0,15]}]},Je={light:"0 0% 100%",dark:"0 0% 8%"},Go={background:{hue:"grey",items:{primary:Je,secondary:"Surface"}},text:{hue:"grey",items:{primary:"Active",secondary:"Dim",tertiary:"Primary",accent:{light:Je.light,dark:Je.light}}},border:{hue:"grey",items:{primary:"Light"}}},zt={blue:"linear-gradient(330.4deg, #44BCF0 4.54%, #7298F8 59.2%, #A099FF 148.85%)",green:"linear-gradient(90deg, rgba(68,240,127,1) 4.54%, rgba(114,248,176,1) 59.2%, rgba(153,202,255,1) 148.85%)",red:"linear-gradient(90deg, rgba(240,68,87,1) 4.54%, rgba(248,114,149,1) 59.2%, rgba(212,153,255,1) 148.85%)",purple:"linear-gradient(323.31deg, #DE82FF -15.56%, #7F6AFF 108.43%)",grey:"linear-gradient(330.4deg, #DFDFDF 4.54%, #959595 59.2%, #474747 148.85%)"},Nt=(e,r,n)=>{e==="dark"&&(n=Object.fromEntries(Object.entries(n).map(([l],i,c)=>[l,c[c.length-i-1][1]])));const a=Object.fromEntries(Object.entries(To).map(([l,i])=>[`${r}${l}`,n[i]]));return{...a,[r]:a[`${r}Primary`]}},It=e=>`${e[0]} ${e[1]}% ${e[2]}%`,Bo=(e,r,n)=>{const a=Object.fromEntries(Zo.map(l=>{var c;if((c=n[3])!=null&&c[l])return[l,It(n[3][l])];const i=n.slice(0,3);return i[2]=i[2]+(400-l)/10,[l,It(i)]}));return{normal:Nt(e,r,Object.fromEntries(Object.entries(a).map(([l,i])=>[l,`hsl(${i})`]))),raw:Nt(e,r,a)}},Oo=(e,r)=>({...zt,accent:zt[e]||r[e]}),_t=(e,r)=>{const n=Object.entries({...Dt,accent:Dt[e]}).reduce((l,i)=>{const[c,d]=i,s=Bo(r,c,d);return{...l,...s.normal,raw:{...l.raw,...s.raw}}},{}),a=Object.entries(Go).reduce((l,i)=>{const[c,d]=i;for(const[s,f]of Object.entries(d.items)){const $=`${c}${s.replace(/^[a-z]/,g=>g.toUpperCase())}`,p=typeof f=="string"?n.raw[`${d.hue}${f}`]:f[r];if(l[$]=`hsl(${p})`,l.raw[$]=p,s==="primary"){const g=c;l[g]=`hsl(${p})`,l.raw[g]=p}}return l},n);return{...a,gradients:Oo(e,a)}},Ao=e=>({light:_t(e,"light"),dark:_t(e,"dark")}),G=Ao("blue"),Pr={overlay:"0.1",overlayFallback:"0.5"},Lr={0:"0",px:"1px","0.25":"0.0625rem","0.5":"0.125rem","0.75":"0.1875rem",1:"0.25rem","1.25":"0.3125rem","1.5":"0.375rem","1.75":"0.4375rem",2:"0.5rem","2.5":"0.625rem",3:"0.75rem","3.5":"0.875rem",4:"1rem","4.5":"1.125rem",5:"1.25rem","5.5":"1.375rem",6:"1.5rem",7:"1.75rem","7.5":"1.875rem",8:"2rem","8.5":"2.125rem",9:"2.25rem",10:"2.5rem",11:"2.75rem",12:"3rem",13:"3.25rem",14:"3.5rem",15:"3.75rem",16:"4rem",18:"4.5rem",20:"5rem","22.5":"5.625rem",24:"6rem",26:"6.5rem",28:"7rem",30:"7.5rem",32:"8rem",36:"9rem",40:"10rem",44:"11rem",45:"11.25rem",48:"12rem",52:"13rem",56:"14rem",60:"15rem",64:"16rem",72:"18rem",80:"20rem",96:"24rem",112:"28rem",128:"32rem",144:"36rem",168:"42rem",192:"48rem",224:"56rem",256:"64rem",288:"72rem",320:"80rem","1/4":"25%","1/3":"33.333333%","1/2":"50%","2/3":"66.666667%","3/4":"75%",auto:"auto",full:"100%",fit:"fit-content",max:"max-content",min:"min-content",viewHeight:"100vh",viewWidth:"100vw",none:"0"},Vr={mono:'"iAWriter Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',sans:'"Satoshi", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'},pe={headingOne:"2.25rem",headingTwo:"1.875rem",headingThree:"1.625rem",headingFour:"1.375rem",extraLarge:"1.25rem",large:"1.125rem",body:"1rem",small:"0.875rem",extraSmall:"0.75rem"},we={light:"300",normal:"500",bold:"700",extraBold:"830"},Mr={"-0.02":"-0.02em","-0.015":"-0.015em","-0.01":"-0.01em",normal:"0","0.03":"0.03em"},ve={headingOne:"3rem",headingTwo:"2.5rem",headingThree:"2.125rem",headingFour:"1.875rem",extraLarge:"1.625rem",large:"1.5rem",body:"1.25rem",small:"1.25rem",extraSmall:"1rem"},Zr={75:"75ms",100:"100ms",150:"150ms",200:"200ms",300:"300ms",500:"500ms",700:"700ms",1e3:"1000ms"},Tr={linear:"linear",in:"cubic-bezier(0.4, 0, 1, 1)",out:"cubic-bezier(0, 0, 0.2, 1)",inOut:"cubic-bezier(0.42, 0, 0.58, 1)",popIn:"cubic-bezier(0.15, 1.15, 0.6, 1)"},Fe={xs:360,sm:640,md:768,lg:1024,xl:1280},Ho={light:{0:`${X[0]} ${G.light.backgroundSecondary}`,"0.02":`${X["0.02"]} ${G.light.backgroundSecondary}`,"0.25":`${X["0.25"]} ${G.light.backgroundSecondary}`,"0.5":`${X["0.5"]} ${G.light.backgroundSecondary}`,1:`${X[1]} ${G.light.backgroundSecondary}`},dark:{0:`${X[0]} ${G.dark.backgroundSecondary}`,"0.02":`${X["0.02"]} ${G.dark.backgroundSecondary}`,"0.25":`${X["0.25"]} ${G.dark.backgroundSecondary}`,"0.5":`${X["0.5"]} ${G.dark.backgroundSecondary}`,1:`${X[1]} ${G.dark.backgroundSecondary}`}},Re={borderStyles:kr,borderWidths:Sr,colors:G,fonts:Vr,fontSizes:pe,fontWeights:we,letterSpacings:Mr,lineHeights:ve,opacity:Pr,radii:Rr,shadows:X,space:Lr,breakpoints:Fe,transitionDuration:Zr,transitionTimingFunction:Tr,boxShadows:Ho},it={borderStyles:kr,borderWidths:Sr,fonts:Vr,fontSizes:pe,fontWeights:we,letterSpacings:Mr,lineHeights:ve,opacity:Pr,radii:Rr,shadows:X,space:Lr,breakpoints:Fe,transitionDuration:Zr,transitionTimingFunction:Tr},jo={...it,colors:Re.colors.light,boxShadows:Re.boxShadows.light,mode:"light"},Fo={...it,colors:Re.colors.dark,boxShadows:Re.boxShadows.dark,mode:"dark"},Gr={min:"min-width",max:"max-width"},Do=Object.keys(Fe),zo=Object.keys(Gr),_=Do.reduce((e,r)=>(e[r]=zo.reduce((n,a)=>(n[a]=l=>o.css`
        @media (${Gr[a]}: ${Fe[r]}px) {
          ${l};
        }
      `,n),{}),e),{}),No=Object.keys(pe),Io={headingOne:{weight:"extraBold"},headingTwo:{weight:"bold"},headingThree:{weight:"bold"},headingFour:{weight:"bold"}},_o=["extraLarge","large","body","small","extraSmall"],Wo={label:{size:pe.extraSmall,lineHeight:ve.extraSmall,weight:we.normal},labelHeading:{size:pe.small,lineHeight:ve.small,weight:we.normal}},Uo=()=>Object.fromEntries(No.map(e=>{var n;const r=((n=Io[e])==null?void 0:n.weight)||"normal";return[e,{size:pe[e],lineHeight:ve[e],weight:we[r]}]})),Yo=()=>Object.fromEntries(_o.map(e=>[`${e}Bold`,{size:pe[e],lineHeight:ve[e],weight:we.bold}])),qo=()=>({...Wo,...Uo(),...Yo()}),ct=qo(),Pe=e=>{var r;return(r=ct[e])==null?void 0:r.size},Le=e=>{var r;return(r=ct[e])==null?void 0:r.lineHeight},nt=e=>{var r;return(r=ct[e])==null?void 0:r.weight},Xo=e=>{const r=Object.keys(G[e].gradients),n=Object.fromEntries(r.map(i=>[`${i}Gradient`,G[e].gradients[i]])),a=Object.keys(G[e]).filter(([i])=>i!=="gradients"&&i!=="raw"),l=Object.fromEntries(a.map(i=>[i,G[e][i]]));return{...n,...l,tranparent:"transparent",initial:"initial",inherit:"inherit"}},Ko=Xo("light"),Wt=["accent","blue","indigo","purple","pink","red","orange","yellow","green","teal","grey"],Qo=e=>{const r=Object.fromEntries(Wt.map(s=>[`${s}Primary`,{text:G[e].backgroundPrimary,background:G[e][`${s}Primary`],border:"transparent",hover:G[e][`${s}Bright`]}])),n=Object.fromEntries(Wt.map(s=>[`${s}Secondary`,{text:G[e][`${s}Primary`],background:G[e][`${s}Surface`],border:"transparent",hover:G[e][`${s}Light`]}])),a=Object.keys(G[e].gradients),l=Object.fromEntries(a.map(s=>[`${s}Gradient`,{text:G[e].backgroundPrimary,background:G[e].gradients[s],border:"transparent",hover:G[e].gradients[s]}])),i={text:"initial",background:"transparent",border:"transparent",hover:G[e].greyLight},c={text:G[e].greyPrimary,background:G[e].greyLight,border:G[e].greyLight,hover:G[e].greyLight},d={text:G[e].textPrimary,background:G[e].backgroundPrimary,border:G[e].border,hover:G[e].backgroundSecondary};return{...r,...n,...l,transparent:i,disabled:c,background:d}},Jo=Qo("light"),Br=e=>Ko[e],H=(e,r)=>{var n;return(n=Jo[e])==null?void 0:n[r]},ea=u.default.div(({theme:e,$ellipsis:r,$fontVariant:n="body",$color:a,$font:l,$weight:i})=>o.css`
    font-family: ${e.fonts.sans};
    line-height: ${e.lineHeights.body};
    color: ${Br(a)};

    ${r&&o.css`
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    `}

    ${n&&o.css`
      font-size: ${Pe(n)};
      font-weight: ${nt(n)};
      line-height: ${Le(n)};
    `}

    ${l==="mono"&&o.css`
      font-family: ${e.fonts.mono};
    `}

    ${i&&o.css`
      font-weight: ${e.fontWeights[i]};
    `};
  `),A=t.forwardRef(({asProp:e,children:r,ellipsis:n,className:a,fontVariant:l="body",font:i="sans",color:c="text",weight:d,...s},f)=>t.createElement(ea,{...s,$color:c,$ellipsis:n?!0:void 0,$font:i,$fontVariant:l,$weight:d,as:e,className:a,ref:f},r));A.displayName="Typography";const ta=u.default.div(({theme:e,$alert:r,$hasAction:n})=>o.css`
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

    ${_.md.min(o.css`
        padding: ${e.space[6]};
        gap: ${e.space[6]};
        align-items: center;
      `)}

    ${n&&o.css`
      padding-right: ${e.space[8]};
      &:hover {
        transform: translateY(-1px);
        background: ${e.colors.greySurface};
        ${r==="error"&&o.css`
          background: ${e.colors.redLight};
        `}
        ${r==="warning"&&o.css`
          background: ${e.colors.yellowLight};
        `}
      }
    `}

    ${r==="error"&&o.css`
      background: ${e.colors.redSurface};
      border: 1px solid ${e.colors.redPrimary};
    `}

    ${r==="warning"&&o.css`
      background: ${e.colors.yellowSurface};
      border: 1px solid ${e.colors.yellowPrimary};
    `};
  `),ra=u.default.div(({theme:e})=>o.css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: ${e.space[1]};
  `),na=u.default.div(({theme:e,$alert:r,$type:n})=>o.css`
    width: ${e.space[8]};
    height: ${e.space[8]};
    flex: 0 0 ${e.space[8]};

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    ${_.md.min(o.css`
      width: ${e.space[10]};
      height: ${e.space[10]};
      flex: 0 0 ${e.space[10]};
    `)}

    ${n==="filledCircle"&&o.css`
      color: ${e.colors.backgroundPrimary};
      border-radius: ${e.radii.full};

      svg {
        transform: scale(0.5);
      }

      ${r==="info"&&o.css`
        background: ${e.colors.text};
      `}
    `}

    ${r==="error"&&o.css`
      background: ${e.colors.redPrimary};
    `}

    ${r==="warning"&&o.css`
      background: ${e.colors.yellowPrimary};
    `}
  `),Ut=u.default.button(({theme:e})=>o.css`
    position: absolute;
    top: 0;
    right: 0;
    padding: ${e.space[2]};
  `),Yt=u.default.div(({theme:e,$alert:r,$hasAction:n})=>o.css`
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

    ${r==="error"&&o.css`
      background: ${e.colors.backgroundPrimary};
      color: ${e.colors.redPrimary};
    `}

    ${r==="warning"&&o.css`
      background: ${e.colors.backgroundPrimary};
      color: ${e.colors.yellowPrimary};
    `}

    ${n&&o.css`
      cursor: pointer;
      &:hover {
        transform: translateY(-1px);
        background: ${e.colors.accentLight};
        color: ${e.colors.accentDim};
        ${r==="error"&&o.css`
          background: ${e.colors.redLight};
          color: ${e.colors.redDim};
        `}
        ${r==="warning"&&o.css`
          background: ${e.colors.yellowLight};
          color: ${e.colors.yellowDim};
        `}
      }
    `}
  `),oa=({alert:e="info",icon:r,hasHref:n,onDismiss:a})=>a?t.createElement(Ut,{onClick:()=>a()},t.createElement(Yt,{$alert:e,$hasAction:!0},r||t.createElement(wt,null))):n||r?t.createElement(Ut,{as:"div"},t.createElement(Yt,{$alert:e},r||t.createElement(Et,null))):null,aa=(e,r)=>e!=="info"?"filledCircle":r?"normal":"none",st=({title:e,alert:r="info",icon:n,iconType:a,as:l,children:i,onDismiss:c,...d})=>{const s=n||(r&&["error","warning"].includes(r)?t.createElement(Me,null):t.createElement(Ye,null)),f=!!d.href,$=f||!!d.onClick,p=a||aa(r,n);return t.createElement(ta,{...d,$alert:r,$hasAction:$,as:l},p!=="none"&&t.createElement(na,{$alert:r,$type:p},s),t.createElement(ra,null,e&&t.createElement(A,{fontVariant:"largeBold"},e),t.createElement(A,null,i)),t.createElement(oa,{alert:r,hasHref:f,icon:d.actionIcon,onDismiss:c}))};st.displayName="Banner";const fe=u.default.div(()=>o.css`
    border-width: 0;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  `),la=o.keyframes`
  100% {
    transform: rotate(1turn);
  }
`,ia=u.default.div(({theme:e,$color:r,$size:n})=>o.css`
    animation: ${la} 1.1s linear infinite;

    color: ${e.colors[r]};
    stroke: ${e.colors[r]};

    ${()=>{switch(n){case"small":return o.css`
            height: ${e.space[4]};
            width: ${e.space[4]};
            stroke-width: ${e.space[1]};
          `;case"medium":return o.css`
            height: ${e.space[6]};
            stroke-width: ${e.space["1.25"]};
            width: ${e.space[6]};
          `;case"large":return o.css`
            height: ${e.space[16]};
            stroke-width: ${e.space[1]};
            width: ${e.space[16]};
          `;default:return""}}}
  `),ue=t.forwardRef(({accessibilityLabel:e,size:r="small",color:n="text",...a},l)=>t.createElement(ia,{$color:n,$size:r,ref:l,...a},e&&t.createElement(fe,null,e),t.createElement("svg",{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},t.createElement("circle",{cx:"12",cy:"12",fill:"none",r:"9",strokeDasharray:"42",strokeLinecap:"round"}),t.createElement("circle",{cx:"12",cy:"12",fill:"none",opacity:"0.25",r:"9",strokeLinecap:"round"}))));ue.displayName="Spinner";const ca=u.default.button(({theme:e,$pressed:r,$shadow:n,$size:a,$colorStyle:l="accentPrimary",$shape:i,$hasCounter:c,$width:d})=>o.css`
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

    background: ${H(l,"background")};
    color: ${H(l,"text")};
    border-color: ${H(l,"border")};

    &:hover {
      transform: translateY(-1px);
      background: ${H(l,"hover")};
    }

    &:active {
      transform: translateY(0px);
    }

    &:disabled {
      cursor: not-allowed;
      background: ${H("disabled","background")};
      transform: none;
      color: ${H("disabled","text")};
      border-color: transparent;
    }

    ${r&&o.css`
      background: ${H(l,"hover")};
    `};

    ${n&&o.css`
      box-shadow: ${e.shadows["0.25"]} ${e.colors.grey};
    `};

    ${a==="small"&&o.css`
      font-size: ${e.fontSizes.small};
      line-height: ${e.lineHeights.small};
      height: ${e.space[10]};
      padding: 0 ${e.space["3.5"]};
      svg {
        display: block;
        width: ${e.space[3]};
        height: ${e.space[3]};
        color: ${H(l,"text")};
      }
    `}

    ${a==="medium"&&o.css`
      font-size: ${e.fontSizes.body};
      line-height: ${e.lineHeights.body};
      height: ${e.space[12]};
      padding: 0 ${e.space[4]};
      svg {
        display: block;
        width: ${e.space[4]};
        height: ${e.space[4]};
        color: ${H(l,"text")};
      }
    `}

    &:disabled svg {
      color: ${H("disabled","text")};
    }

    ${(i==="circle"||i==="rounded")&&o.css`
      border-radius: ${e.radii.full};
    `}

    ${(i==="circle"||i==="square")&&a==="small"&&o.css`
      width: ${e.space[10]};
    `}

    ${(i==="circle"||i==="square")&&a==="medium"&&o.css`
      width: ${e.space[12]};
    `}

    ${c&&o.css`
      padding: 0 ${e.space[12]};
    `}

    ${d&&o.css`
      width: ${e.space[d]};
    `}
  `),sa=u.default.div(({$fullWidth:e})=>o.css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    ${e&&o.css`
      width: 100%;
    `}
  `),da=u.default.div(({theme:e})=>o.css`
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    padding-right: ${e.space[3]};

    display: flex;
    align-items: center;
    justify-content: flex-end;
    pointer-events: none;
  `),ua=u.default.div(({theme:e,$visible:r})=>o.css`
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

    ${!r&&o.css`
      transform: scale(0.3);
      opacity: 0;
    `}
  `),pa=u.default.div`
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
`,De=t.forwardRef(({children:e,disabled:r,href:n,prefix:a,loading:l,rel:i,shape:c,size:d="medium",suffix:s,tabIndex:f,target:$,colorStyle:p="accentPrimary",type:g="button",zIndex:w,onClick:E,pressed:x=!1,shadow:k=!1,width:L,fullWidthContent:v,count:y,shouldShowTooltipIndicator:m,as:b,...h},V)=>{const R=t.createElement(sa,{$fullWidth:v},e),M=r?"greyPrimary":"backgroundPrimary";let P;if(c==="circle"||c==="square")P=l?t.createElement(ue,{color:M}):R;else{const O=!!a,W=!O&&!s,U=!O&&!!s;let F=a;l&&O?F=t.createElement(ue,{color:M}):l&&W&&(F=t.createElement(ue,{color:M}));let Q=s;l&&U&&(Q=t.createElement(ue,{color:M})),P=t.createElement(t.Fragment,null,!!F&&F,R,!!Q&&Q)}return t.createElement(ca,{...h,$colorStyle:p,$hasCounter:!!y,$pressed:x,$shadow:k,$shape:c,$size:d,$width:L,as:b,disabled:r,href:n,position:w&&"relative",ref:V,rel:i,tabIndex:f,target:$,type:g,zIndex:w,onClick:E},m&&t.createElement(pa,{"data-testid":"tooltip-indicator"},"?"),P,t.createElement(da,null,t.createElement(ua,{$visible:!!y},y)))});De.displayName="Button";const fa=u.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[4]};

    padding: ${e.space[4]};
    border-radius: ${e.radii["2xLarge"]};
    background-color: ${e.colors.backgroundPrimary};
    border: 1px solid ${e.colors.border};

    ${_.md.min(o.css`
        padding: ${e.space[6]};
      `)}
  `),ga=u.default.div(({theme:e})=>o.css`
    width: calc(100% + 2 * ${e.space[4]});
    height: 1px;
    background: ${e.colors.border};
    margin: 0 -${e.space[4]};
    ${_.md.min(o.css`
        margin: 0 -${e.space[6]};
        width: calc(100% + 2 * ${e.space[6]});
      `)}
  `),ze=({title:e,children:r,...n})=>t.createElement(fa,{...n},e&&t.createElement(A,{fontVariant:"headingFour"},e),r);ze.displayName="Card";ze.Divider=ga;var Be=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function ma(e){var r=typeof e;return e!=null&&(r=="object"||r=="function")}var Or=ma,ba=typeof Be=="object"&&Be&&Be.Object===Object&&Be,$a=ba,ha=$a,wa=typeof self=="object"&&self&&self.Object===Object&&self,va=ha||wa||Function("return this")(),Ar=va,ya=Ar,Ea=function(){return ya.Date.now()},xa=Ea,Ca=/\s/;function ka(e){for(var r=e.length;r--&&Ca.test(e.charAt(r)););return r}var Sa=ka,Ra=Sa,Pa=/^\s+/;function La(e){return e&&e.slice(0,Ra(e)+1).replace(Pa,"")}var Va=La,Ma=Ar,Za=Ma.Symbol,dt=Za,qt=dt,Hr=Object.prototype,Ta=Hr.hasOwnProperty,Ga=Hr.toString,ke=qt?qt.toStringTag:void 0;function Ba(e){var r=Ta.call(e,ke),n=e[ke];try{e[ke]=void 0;var a=!0}catch{}var l=Ga.call(e);return a&&(r?e[ke]=n:delete e[ke]),l}var Oa=Ba,Aa=Object.prototype,Ha=Aa.toString;function ja(e){return Ha.call(e)}var Fa=ja,Xt=dt,Da=Oa,za=Fa,Na="[object Null]",Ia="[object Undefined]",Kt=Xt?Xt.toStringTag:void 0;function _a(e){return e==null?e===void 0?Ia:Na:Kt&&Kt in Object(e)?Da(e):za(e)}var Wa=_a;function Ua(e){return e!=null&&typeof e=="object"}var Ya=Ua,qa=Wa,Xa=Ya,Ka="[object Symbol]";function Qa(e){return typeof e=="symbol"||Xa(e)&&qa(e)==Ka}var jr=Qa,Ja=Va,Qt=Or,el=jr,Jt=0/0,tl=/^[-+]0x[0-9a-f]+$/i,rl=/^0b[01]+$/i,nl=/^0o[0-7]+$/i,ol=parseInt;function al(e){if(typeof e=="number")return e;if(el(e))return Jt;if(Qt(e)){var r=typeof e.valueOf=="function"?e.valueOf():e;e=Qt(r)?r+"":r}if(typeof e!="string")return e===0?e:+e;e=Ja(e);var n=rl.test(e);return n||nl.test(e)?ol(e.slice(2),n?2:8):tl.test(e)?Jt:+e}var ll=al,il=Or,et=xa,er=ll,cl="Expected a function",sl=Math.max,dl=Math.min;function ul(e,r,n){var a,l,i,c,d,s,f=0,$=!1,p=!1,g=!0;if(typeof e!="function")throw new TypeError(cl);r=er(r)||0,il(n)&&($=!!n.leading,p="maxWait"in n,i=p?sl(er(n.maxWait)||0,r):i,g="trailing"in n?!!n.trailing:g);function w(h){var V=a,R=l;return a=l=void 0,f=h,c=e.apply(R,V),c}function E(h){return f=h,d=setTimeout(L,r),$?w(h):c}function x(h){var V=h-s,R=h-f,M=r-V;return p?dl(M,i-R):M}function k(h){var V=h-s,R=h-f;return s===void 0||V>=r||V<0||p&&R>=i}function L(){var h=et();if(k(h))return v(h);d=setTimeout(L,x(h))}function v(h){return d=void 0,g&&a?w(h):(a=l=void 0,c)}function y(){d!==void 0&&clearTimeout(d),f=0,a=s=l=d=void 0}function m(){return d===void 0?c:v(et())}function b(){var h=et(),V=k(h);if(a=arguments,l=this,s=h,V){if(d===void 0)return E(s);if(p)return clearTimeout(d),d=setTimeout(L,r),w(s)}return d===void 0&&(d=setTimeout(L,r)),c}return b.cancel=y,b.flush=m,b}var pl=ul;const Se=350,tr=(e,r,n,a,l)=>{const i=r.top-n.height-a-l,c=r.left-n.width-a-l,d=window.innerWidth-r.left-r.width-n.width-a-l,s=window.innerHeight-r.top-r.height-n.height-a-l;return e==="top"&&i<0&&s>i?"bottom":e==="right"&&d<0&&c>d?"left":e==="bottom"&&s<0&&i>s?"top":e==="left"&&c<0&&d>c?"right":e},fl=(e,r,n,a)=>{let l="";n==="top"?l=`translate(0, -${r}px)`:n==="right"?l=`translate(${e}px, 0)`:n==="bottom"?l=`translate(0, ${r}px)`:l=`translate(-${e}px, 0);`;let i="";return a==="top"?i=`translate(0, -${r}px)`:a==="right"?i=`translate(${e}px, 0)`:a==="bottom"?i=`translate(0, ${r}px)`:i=`translate(-${e}px, 0);`,{translate:l,mobileTranslate:i}},gl=u.default.div(({$state:e,$translate:r,$mobileTranslate:n,$width:a,$mobileWidth:l,$x:i,$y:c})=>[o.css`
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
    z-index: 20;
    width: ${l}px;
    transform: translate3d(0, 0, 0) ${n};
    transition: none;
    opacity: 0;
    pointer-events: none;
    top: 0;
    left: 0;

    ${e==="preEnter"&&o.css`
      display: block;
      visibility: visible;
      top: ${c}px;
      left: ${i}px;
    `}

    ${e==="entering"&&o.css`
      display: block;
      visibility: visible;
      opacity: 1;
      transition: opacity ${Se}ms ease-in-out;
      top: ${c}px;
      left: ${i}px;
    `}

      ${e==="entered"&&o.css`
      display: block;
      visibility: visible;
      opacity: 1;
      transition: opacity ${Se}ms ease-in-out;
      top: ${c}px;
      left: ${i}px;
    `}

      ${e==="exiting"&&o.css`
      display: block;
      visibility: visible;
      opacity: 0;
      transition: all ${Se}ms ease-in-out;
      top: ${c}px;
      left: ${i}px;
    `}
  `,_.md.min(o.css`
    width: ${a}px;
    transform: translate3d(0, 0, 0) ${r};
  `)]),Ne=({popover:e,placement:r="top",mobilePlacement:n="top",animationFn:a,anchorRef:l,onShowCallback:i,width:c=250,mobileWidth:d=150,useIdealPlacement:s=!1,additionalGap:f=0})=>{const $=t.useRef(null),[p,g]=t.useState({top:100,left:100,horizontalClearance:100,verticalClearance:100,idealPlacement:r,idealMobilePlacement:n}),w=t.useCallback(()=>{const b=l==null?void 0:l.current,h=b==null?void 0:b.getBoundingClientRect(),V=$==null?void 0:$.current,R=V==null?void 0:V.getBoundingClientRect();if(!R||!h)return;const M=window.scrollY+h.y+h.height/2-R.height/2,P=h.x+h.width/2-R.width/2,O=R.width/2+h.width/2+f+10,W=R.height/2+h.height/2+f+10;r==="bottom"&&console.log(R.height,h.height,f);const U=tr(r,h,R,0,0),F=tr(n,h,R,0,0);g({top:M,left:P,horizontalClearance:O,verticalClearance:W,idealPlacement:U,idealMobilePlacement:F})},[r,n,f,l]),E=t.useMemo(()=>a?(b,h,V,R)=>a(b,h,V,R):(b,h,V,R)=>fl(b,h,V,R),[a]);t.useEffect(()=>{w();const b=()=>{k(!0)},h=()=>{k(!1)},V=()=>{w()},R=pl(w,500),M=()=>{R()},P=l==null?void 0:l.current;return P==null||P.addEventListener("mouseenter",b),P==null||P.addEventListener("mouseleave",h),addEventListener("resize",V),window.addEventListener("scroll",M),()=>{P==null||P.removeEventListener("mouseenter",b),P==null||P.removeEventListener("mouseleave",h),removeEventListener("resize",V),window.removeEventListener("scroll",M)}},[r,n,w,f,i,l]);const[x,k]=at.useTransition({preEnter:!0,exit:!0,mountOnEnter:!0,unmountOnExit:!0,timeout:{enter:Se,exit:Se}}),L=s?p.idealPlacement:r,v=s?p.idealMobilePlacement:n,{translate:y,mobileTranslate:m}=E(p.horizontalClearance,p.verticalClearance,L,v);return xr.createPortal(t.createElement(gl,{$mobileTranslate:m,$mobileWidth:d,$state:x,$translate:y,$width:c,$x:p.left,$y:p.top,"data-testid":"popoverContainer",id:"popoverContainer",ref:$},t.cloneElement(e,{placement:L,mobilePlacement:v})),document==null?void 0:document.body)};Ne.displayName="DynamicPopover";const ml=(e,r,n,a)=>{const l=i=>{e.current&&!e.current.contains(i.target)&&n()};he.useEffect(()=>(a?document.addEventListener(r,l):document.removeEventListener(r,l),()=>{document.removeEventListener(r,l)}),[a])},bl=typeof window<"u"?t.useLayoutEffect:t.useEffect,tt={serverHandoffComplete:!1},$l=()=>{const[e,r]=t.useState(tt.serverHandoffComplete);return t.useEffect(()=>{e||r(!0)},[e]),t.useEffect(()=>{tt.serverHandoffComplete||(tt.serverHandoffComplete=!0)},[]),e},hl="thorin";let wl=0;function rr(){return++wl}const ut=()=>{const e=$l(),[r,n]=t.useState(e?rr:null);return bl(()=>{r===null&&n(rr())},[r]),r!=null?`${hl}`+r:void 0},Fr=({description:e,error:r,id:n}={})=>{const a=ut();return t.useMemo(()=>{const l=`${a}${n?`-${n}`:""}`,i=`${l}-label`;let c,d;e&&(d={id:`${l}-description`},c=d.id);let s;return r&&(s={id:`${l}-error`},c=`${c?`${c} `:""}${s.id}`),{content:{"aria-describedby":c,"aria-labelledby":i,id:l},description:d,error:s,label:{htmlFor:l,id:i}}},[a,e,r,n])},nr=t.createContext(void 0),vl=u.default.label(({theme:e,$disabled:r,$readOnly:n,$required:a})=>o.css`
    display: flex;
    flex-basis: auto;
    flex-grow: 2;
    flex-shrink: 1;
    overflow: hidden;
    position: relative;
    cursor: pointer;

    ${n&&o.css`
      cursor: default;
      pointer-events: none;
    `}

    ${r&&o.css`
      cursor: not-allowed;
    `}

    ${a&&o.css`
      ::after {
        content: ' *';
        white-space: pre;
        color: ${e.colors.red};
      }
    `}
  `),yl=u.default(A)(()=>o.css``),El=u.default(A)(()=>o.css`
    flex-basis: auto;
    flex-grow: 0;
    flex-shrink: 2;
    text-align: right;
    overflow: hidden;
    position: relative;
  `),xl=u.default.div(({theme:e,$inline:r})=>o.css`
    display: flex;
    align-items: center;
    padding: 0 ${r?"0":e.space[2]};
    overflow: hidden;
    gap: ${e.space[2]};
  `),Cl=({ids:e,label:r,labelSecondary:n,required:a,hideLabel:l,inline:i,disabled:c,readOnly:d})=>{const s=t.createElement(xl,{$inline:i},t.createElement(vl,{$disabled:c,$readOnly:d,$required:a,...e.label},t.createElement(yl,{color:"greyPrimary",ellipsis:!0,fontVariant:"bodyBold"},r,a&&t.createElement(fe,null,"required"))),n&&t.createElement(El,{color:"greyPrimary",ellipsis:!0,fontVariant:"extraSmall"},n));return l?t.createElement(fe,null,s):s},kl=u.default(A)(({theme:e,$inline:r})=>o.css`
    padding: 0 ${r?"0":e.space[2]};
    width: 100%;
    overflow: hidden;
  `),Sl=u.default(A)(({theme:e,$inline:r})=>`
    padding: 0 ${r?"0":e.space[2]};
`),Rl=({ids:e,error:r,description:n,hideLabel:a,inline:l,disabled:i})=>a?null:r?t.createElement(Sl,{"aria-live":"polite",...e.error,$inline:l,color:"redPrimary",fontVariant:"smallBold"},r):n?t.createElement(kl,{$inline:l,...e.description,color:i?"greyPrimary":"textPrimary",colorScheme:i?"secondary":"primary",ellipsis:!0,fontVariant:"small"},n):null,or=u.default.div(({theme:e,$inline:r,$width:n,$reverse:a})=>o.css`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: 'normal';
    gap: ${e.space[2]};
    width: ${e.space[n]};

    ${r&&o.css`
      flex-direction: ${a?"row-reverse":"row"};
      align-items: 'flex-start';
    `}
  `),Pl=u.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[1]};
    flex: 1;
    overflow: hidden;
  `),te=({children:e,description:r,error:n,hideLabel:a,id:l,label:i,labelSecondary:c,required:d,inline:s,readOnly:f,width:$="full",reverse:p=!1,disabled:g,...w})=>{const E=Fr({id:l,description:r!==void 0,error:n!==void 0});let x;typeof e=="function"?x=t.createElement(nr.Provider,{value:E},t.createElement(nr.Consumer,null,v=>e(v))):e?x=t.cloneElement(e,E.content):x=e;const k=t.createElement(Cl,{...w,ids:E,label:i,labelSecondary:c,required:d,hideLabel:a,inline:s,disabled:g,readOnly:f}),L=t.createElement(Rl,{ids:E,error:n,description:r,hideLabel:a,inline:s,disabled:g});return s?t.createElement(or,{$inline:s,$reverse:p,$width:$},t.createElement("div",null,x),t.createElement(Pl,null,k,L)):t.createElement(or,{$width:$},k,x,L)};te.displayName="Field";const Ll=(e,r)=>{const n=r==null?void 0:r.split(", ");if(!n)return!0;const a=ar(e);return n.some(l=>{const i=ar(l);return i.type===a.type&&i.subtype===a.subtype})},ar=e=>{const r=e.split("/");return{type:r[0],subtype:r[1]}},lr={},pt=t.forwardRef(({accept:e,autoFocus:r,children:n,defaultValue:a,disabled:l,error:i,id:c,maxSize:d,name:s,required:f,tabIndex:$,onBlur:p,onChange:g,onError:w,onFocus:E,onReset:x,...k},L)=>{const v=t.useRef(null),y=L||v,[m,b]=t.useState(lr),h=i?!0:void 0,V=Fr({id:c,error:h}),R=t.useCallback((Z,T)=>{if(d&&Z.size>d*1e6){T==null||T.preventDefault(),w&&w(`File is ${(Z.size/1e6).toFixed(2)} MB. Must be smaller than ${d} MB`);return}b(B=>({...B,file:Z,name:Z.name,type:Z.type})),g&&g(Z)},[d,g,w]),M=t.useCallback(Z=>{const T=Z.target.files;!(T!=null&&T.length)||R(T[0],Z)},[R]),P=t.useCallback(Z=>{Z.preventDefault(),b(T=>({...T,droppable:!0}))},[]),O=t.useCallback(Z=>{Z.preventDefault(),b(T=>({...T,droppable:!1}))},[]),W=t.useCallback(Z=>{Z.preventDefault(),b(B=>({...B,droppable:!1}));let T;if(Z.dataTransfer.items){const B=Z.dataTransfer.items;if((B==null?void 0:B[0].kind)!=="file"||(T=B[0].getAsFile(),!T))return}else{const B=Z.dataTransfer.files;if(!(B!=null&&B.length))return;T=B[0]}!Ll(T.type,e)||R(T,Z)},[R,e]),U=t.useCallback(Z=>{b(T=>({...T,focused:!0})),E&&E(Z)},[E]),F=t.useCallback(Z=>{b(T=>({...T,focused:!1})),p&&p(Z)},[p]),Q=t.useCallback(Z=>{Z.preventDefault(),b(lr),y.current&&(y.current.value=""),x&&x()},[y,x]);return t.useEffect(()=>{!a||b({previewUrl:a.url,name:a.name,type:a.type})},[]),t.useEffect(()=>{if(!m.file)return;const Z=URL.createObjectURL(m.file);return b(T=>({...T,previewUrl:Z})),()=>URL.revokeObjectURL(Z)},[m.file]),t.createElement("div",null,t.createElement(fe,null,t.createElement("input",{...k,...V.content,accept:e,"aria-invalid":h,autoFocus:r,disabled:l,name:s,ref:y,required:f,tabIndex:$,type:"file",onBlur:F,onChange:M,onFocus:U})),t.createElement("label",{...V.label,onDragLeave:O,onDragOver:P,onDrop:W},n({...m,reset:Q})))});pt.displayName="FileInput";const Vl=u.default.div(({theme:e,$textAlign:r,$textTransform:n,$level:a,$responsive:l,$color:i})=>o.css`
    ${r?o.css`
          text-align: ${r};
        `:""}
    ${n?o.css`
          text-transform: ${n};
        `:""}

  ${()=>{switch(a){case"1":return o.css`
            font-size: ${e.fontSizes.headingOne};
            font-weight: ${e.fontWeights.extraBold};
            line-height: ${e.lineHeights.headingOne};
          `;case"2":return o.css`
            font-size: ${e.fontSizes.headingTwo};
            font-weight: ${e.fontWeights.bold};
            line-height: ${e.lineHeights.headingTwo};
          `;default:return""}}}
  
  ${()=>{if(l)switch(a){case"1":return o.css`
              font-size: ${e.fontSizes.headingTwo};
              line-height: ${e.lineHeights.headingTwo};
              ${_.lg.min(o.css`
                font-size: ${e.fontSizes.headingOne};
                line-height: ${e.lineHeights.headingOne};
              `)}
            `;case"2":return o.css`
              font-size: ${e.fontSizes.extraLarge};
              line-height: ${e.lineHeights.extraLarge};
              ${_.sm.min(o.css`
                font-size: ${e.fontSizes.headingTwo};
                line-height: ${e.lineHeights.headingTwo};
              `)}
            `;default:return""}}}

  ${i&&o.css`
      color: ${Br(i)};
    `}
  
  font-family: ${e.fonts.sans};
  `),Ie=t.forwardRef(({align:e,children:r,as:n="h1",id:a,level:l="2",responsive:i,transform:c,color:d="text",...s},f)=>t.createElement(Vl,{...s,$color:d,$level:l,$responsive:i,$textAlign:e,$textTransform:c,as:n,id:a,ref:f},r));Ie.displayName="Heading";const _e=({children:e,className:r,el:n="div"})=>{const[a]=t.useState(document.createElement(n));return r&&a.classList.add(r),t.useEffect(()=>(document.body.appendChild(a),()=>{document.body.removeChild(a)}),[]),Po.createPortal(e,a)};_e.displayName="Portal";const Ml=()=>{const[e,r]=he.useState(!1),n=a=>{navigator.clipboard.writeText(a),r(!0)};return he.useEffect(()=>{let a;return e&&(a=setTimeout(()=>r(!1),1500)),()=>clearTimeout(a)},[e]),{copy:n,copied:e}},Zl=u.default.button(({theme:e,$inline:r})=>o.css`
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

    ${r&&o.css`
      width: fit-content;
      height: ${e.space[10]};
    `}

    &:hover {
      transform: translateY(-1px);
      background: ${e.colors.greyLight};
    }
  `),Tl=u.default.div(({theme:e,$inline:r,$size:n})=>o.css`
    display: flex;
    gap: ${e.space[2]};
    align-items: flex-start;
    width: ${n==="large"?e.space[30]:e.space["22.5"]};
    flex: 0 0 ${n==="large"?e.space[30]:e.space["22.5"]};

    ${r&&o.css`
      width: fit-content;
      flex: initial;
    `}
  `),Gl=u.default.div(({theme:e,$inline:r})=>o.css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    overflow: hidden;

    ${r&&o.css`
      flex-direction: row;
      gap: ${e.space[2]};
      align-items: center;
    `}
  `),ir=u.default(A)(()=>o.css`
    text-align: left;
    width: 100%;
  `),Bl=u.default.div(({theme:e})=>o.css`
    svg {
      display: block;
      width: ${e.space[5]};
      height: ${e.space[5]};
    }
  `),Ol=u.default(A)(({$inline:e})=>o.css`
    flex: 1;
    text-align: left;
    word-break: break-all;

    ${e&&o.css`
      word-break: initial;
    `}
  `),Al=u.default.svg(({theme:e,$rotate:r})=>o.css`
    display: block;
    margin-top: ${e.space[1]};
    width: ${e.space[3]};
    height: ${e.space[3]};
    color: ${e.colors.greyPrimary};
    ${r&&o.css`
      transform: rotate(45deg);
    `}
  `),ft=({link:e,size:r="small",inline:n=!1,icon:a,keyLabel:l,keySublabel:i,value:c,children:d,...s})=>{const{copy:f,copied:$}=Ml(),p=e?"a":void 0,g=!!a||!!l,w=!!l||!!i,E=typeof l=="string"?t.createElement(ir,{$inline:n,color:"grey",ellipsis:!n,fontVariant:r==="large"?"bodyBold":"smallBold"},l):l,x=typeof i=="string"?t.createElement(ir,{$inline:n,color:"grey",ellipsis:!n,fontVariant:r==="large"?"smallBold":"extraSmallBold"},i):i,k=e?{$rotate:!0,as:yt}:$?{as:Ze}:{as:ht};return t.createElement(Zl,{$inline:n,as:p,href:e,rel:"nofollow noreferrer",target:"_blank",type:"button",onClick:()=>{e||f(c)},...s},g&&t.createElement(Tl,{$inline:n,$size:r},a&&t.createElement(Bl,null,a),w&&t.createElement(Gl,{$inline:n},E,x)),t.createElement(Ol,{$inline:n,fontVariant:r==="large"?"body":"small"},d),t.createElement(Al,{...k}))};ft.displayName="RecordItem";const Hl=u.default.div(({theme:e,$showTop:r,$showBottom:n})=>o.css`
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
      ${r&&o.css`
        background-color: hsla(${e.colors.raw.greyLight} / 1);
      `}
    }
    &::after {
      bottom: 0;
      ${n&&o.css`
        background-color: hsla(${e.colors.raw.greyLight} / 1);
      `}
    }
  `),cr=u.default.div(()=>o.css`
    display: block;
    height: 0px;
  `),Dr=({hideDividers:e=!1,topTriggerPx:r=16,bottomTriggerPx:n=16,onReachedTop:a,onReachedBottom:l,children:i,...c})=>{const d=t.useRef(null),s=t.useRef(null),f=t.useRef(null),$=typeof e=="boolean"?e:!!(e!=null&&e.top),p=typeof e=="boolean"?e:!!(e!=null&&e.bottom),g=t.useRef({onReachedTop:a,onReachedBottom:l}),[w,E]=t.useState(!1),[x,k]=t.useState(!1),L=v=>{var b,h,V,R;const y=[!1,-1],m=[!1,-1];for(let M=0;M<v.length;M+=1){const P=v[M],O=P.target===s.current?y:m;P.time>O[1]&&(O[0]=P.isIntersecting,O[1]=P.time)}y[1]!==-1&&!$&&E(!y[0]),m[1]!==-1&&!p&&k(!m[0]),y[0]&&((h=(b=g.current).onReachedTop)==null||h.call(b)),m[0]&&((R=(V=g.current).onReachedBottom)==null||R.call(V))};return t.useEffect(()=>{const v=d.current,y=s.current,m=f.current;let b;return v&&y&&m&&(b=new IntersectionObserver(L,{root:v,threshold:1,rootMargin:`${r}px 0px ${n}px 0px`}),b.observe(y),b.observe(m)),()=>{b.disconnect()}},[n,r]),t.useEffect(()=>{g.current={onReachedTop:a,onReachedBottom:l}},[a,l]),t.createElement(Hl,{$showBottom:x,$showTop:w,ref:d,...c},t.createElement(cr,{"data-testid":"scrollbox-top-intersect",ref:s}),i,t.createElement(cr,{"data-testid":"scrollbox-bottom-intersect",ref:f}))},zr=t.createContext(void 0),gt=({children:e,loading:r})=>t.createElement(zr.Provider,{value:r},e);gt.displayName="SkeletonGroup";const jl=o.keyframes`
  to {
    background-position-x: -200%;
  }
`,Fl=u.default.div(({theme:e,$active:r})=>o.css`
    ${r&&o.css`
      background: ${e.colors.greyLight}
        linear-gradient(
          110deg,
          ${e.colors.greyLight} 8%,
          ${e.colors.greySurface} 18%,
          ${e.colors.greyLight} 33%
        );
      background-size: 200% 100%;
      animation: 1.5s ${jl} infinite linear;
      border-radius: ${e.radii.medium};
      width: ${e.space.fit};
    `}
  `),Dl=u.default.span(({$active:e})=>o.css`
    display: block;
    ${e?o.css`
          visibility: hidden;
        `:""}
  `),mt=({as:e,children:r,loading:n,...a})=>{const l=t.useContext(zr),i=n!=null?n:l;return t.createElement(Fl,{...a,$active:i,as:e},t.createElement(Dl,{$active:i},r))};mt.displayName="Skeleton";const zl=u.default.div(({theme:e,$hover:r,$size:n,$colorStyle:a})=>o.css`
    align-items: center;
    display: flex;
    border-radius: ${e.radii.full};
    font-size: ${e.fontSizes.small};
    line-height: ${e.lineHeights.small};
    font-weight: ${e.fontWeights.bold};
    width: ${e.space.max};
    padding: ${e.space["0.5"]} ${e.space[2]};
    background: ${H(a,"background")};
    color: ${H(a,"text")};
    border: 1px solid ${H(a,"border")};
    cursor: default;

    ${n==="small"&&o.css`
      font-size: ${e.fontSizes.extraSmall};
      line-height: ${e.lineHeights.extraSmall};
    `}

    ${r&&o.css`
      transition-duration: ${e.transitionDuration[150]};
      transition-property: color, border-color, background-color;
      transition-timing-function: ${e.transitionTimingFunction.inOut};

      &:hover,
      &:active {
        transform: translateY(-1px);
        background-color: ${H(a,"hover")};
      }
    `}
  `),We=({as:e="div",children:r,hover:n,size:a="small",colorStyle:l="accentSecondary",...i})=>t.createElement(zl,{...i,$colorStyle:l,$hover:n,$size:a,as:e},r);We.displayName="Tag";const Ve=({children:e,surface:r,onDismiss:n,noBackground:a=!1,className:l="modal",open:i})=>{const[c,d]=at.useTransition({timeout:{enter:50,exit:300},mountOnEnter:!0,unmountOnExit:!0}),s=t.useRef(null),f=r||lt,$=p=>p.target===s.current&&n&&n();return t.useEffect(()=>{const{style:p,dataset:g}=document.body,w=()=>parseInt(g.backdrops||"0"),E=k=>g.backdrops=String(w()+k),x=(k,L,v)=>{p.width=k,p.position=L,p.top=v};if(d(i||!1),typeof window<"u"&&!a&&i)return w()===0&&x(`${document.body.clientWidth}px`,"fixed",`-${window.scrollY}px`),E(1),()=>{const k=parseFloat(p.top||"0")*-1;w()===1&&(x("","",""),window.scroll({top:k})),E(-1)}},[i,a]),c!=="unmounted"?t.createElement(_e,{className:l},n&&t.createElement(f,{$empty:a,$state:c,ref:s,onClick:$}),e({state:c})):null};Ve.displayName="Backdrop";const Nl=(e="",r=10,n=5,a=5)=>e.length<r?e:`${e.slice(0,n)}...${e.slice(-a)}`,re=(e,r)=>e["data-testid"]?String(e["data-testid"]):r,Il=u.default.input(({theme:e,$colorStyle:r="accentPrimary"})=>o.css`
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
      background: ${H(r,"background")};
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
      background: ${H(r,"text")};
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
  `),bt=t.forwardRef(({description:e,disabled:r,error:n,hideLabel:a,id:l,label:i,labelSecondary:c,inline:d=!0,name:s,required:f,tabIndex:$,value:p,checked:g,width:w,onBlur:E,onChange:x,onFocus:k,colorStyle:L="accentPrimary",...v},y)=>{const m=t.useRef(null),b=y||m;return t.createElement(te,{description:e,disabled:r,error:n,hideLabel:a,id:l,inline:d,label:i,labelSecondary:c,required:f,width:w},t.createElement(Il,{...v,"data-testid":re(v,"checkbox"),"aria-invalid":n?!0:void 0,type:"checkbox",$colorStyle:L,checked:g,disabled:r,name:s,ref:b,tabIndex:$,value:p,onBlur:E,onChange:x,onFocus:k}))});bt.displayName="Checkbox";const _l=u.default.div(({theme:e,$color:r})=>o.css`
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
  `),Wl=u.default.input(()=>o.css`
    position: absolute;
    width: 1px;
    height: 1px;
  `),Ul=u.default.label(({theme:e})=>o.css`
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
  `),Yl=u.default.div(({theme:e})=>o.css`
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
  `),ql=u.default.div(()=>o.css`
    display: flex;
    flex-direction: column;
  `),$t=t.forwardRef(({label:e,name:r,color:n="blue",...a},l)=>{const i=t.useRef(null),c=l||i,d=ut();return t.createElement(_l,{$color:n},t.createElement(Wl,{id:d,name:r,type:"checkbox",...a,ref:c}),t.createElement(Ul,{htmlFor:d,id:"permissions-label"},t.createElement(Yl,{id:"circle"},t.createElement(Ze,null)),t.createElement(ql,null,t.createElement(A,{color:"text",fontVariant:"bodyBold"},e))))});$t.displayName="CheckboxRow";const Nr=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M4.5 23.225C1.173 12.416 12.09 2.703 22.438 7.264l65.03 28.657c10.502 4.628 10.502 19.53 0 24.158l-65.03 28.657c-10.348 4.56-21.265-5.153-17.94-15.96L12.122 48 4.5 23.225ZM22.83 54l-6.86 22.304c-.303.983.69 1.866 1.63 1.451l65.03-28.657c.31-.136.454-.297.541-.437.102-.166.175-.395.175-.661s-.073-.495-.175-.661c-.087-.14-.232-.301-.54-.437L17.6 18.245c-.941-.415-1.934.468-1.631 1.45L22.83 42h21.72a6 6 0 0 1 0 12H22.83Z",clipRule:"evenodd"})),Me=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M48 30a6 6 0 0 1 6 6v12a6 6 0 0 1-12 0V36a6 6 0 0 1 6-6Zm6 34a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M58.873 7.242c-5.757-6.514-15.988-6.514-21.746 0-15.715 17.78-27.914 38.623-35.65 61.07-2.866 8.315 2.358 17.173 10.902 18.842 23.418 4.575 47.824 4.575 71.242 0 8.544-1.669 13.768-10.527 10.903-18.841-7.737-22.448-19.936-43.29-35.651-61.071Zm-12.754 7.947c.98-1.11 2.782-1.11 3.762 0C64.564 31.8 75.96 51.275 83.18 72.223c.461 1.34-.38 2.865-1.858 3.154-21.9 4.278-44.743 4.278-66.642 0-1.478-.289-2.32-1.815-1.858-3.154 7.22-20.948 18.615-40.422 33.298-57.034Z",clipRule:"evenodd"})),Ir=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M22 36a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm16 0a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm22-6a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M18 8C8.059 8 0 16.059 0 26v44c0 9.941 8.059 18 18 18h60c9.941 0 18-8.059 18-18V26c0-9.941-8.059-18-18-18H18Zm-6 18a6 6 0 0 1 6-6h60a6 6 0 0 1 6 6v44a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V26Z",clipRule:"evenodd"})),_r=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M26 72a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm28-6a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm16 6a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM26 40a6 6 0 0 0 0 12h44a6 6 0 0 0 0-12H26Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M20 10a6 6 0 0 1 12 0v2h32v-2a6 6 0 0 1 12 0v2h2c9.941 0 18 8.059 18 18v44c0 9.941-8.059 18-18 18H18C8.059 92 0 83.941 0 74V30c0-9.941 8.059-18 18-18h2v-2Zm0 16v-2h-2a6 6 0 0 0-6 6v44a6 6 0 0 0 6 6h60a6 6 0 0 0 6-6V30a6 6 0 0 0-6-6h-2v2a6 6 0 0 1-12 0v-2H32v2a6 6 0 0 1-12 0Z",clipRule:"evenodd"})),Wr=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 30c-10.493 0-19 8.507-19 19s8.507 19 19 19 19-8.507 19-19-8.507-19-19-19Zm-7 19a7 7 0 1 1 14 0 7 7 0 0 1-14 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M33.504 8a18 18 0 0 0-17.47 13.66l-1.665 6.706C6.169 30.046 0 37.303 0 46v24c0 9.941 8.059 18 18 18h60c9.941 0 18-8.059 18-18V46c0-8.697-6.168-15.954-14.369-17.634l-1.666-6.706A18 18 0 0 0 62.496 8H33.504ZM16.777 40.122l7.413-1.518 3.49-14.05A6 6 0 0 1 33.505 20h28.992a6 6 0 0 1 5.823 4.553l3.491 14.05 7.413 1.52A6.006 6.006 0 0 1 84 46v24a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V46a6.006 6.006 0 0 1 4.777-5.878Z",clipRule:"evenodd"})),Ze=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M88.455 28.019a6 6 0 1 0-8.91-8.038l-41.852 46.4L16.16 45.676a6 6 0 0 0-8.318 8.65L33.82 79.304l.094.09c.508.472 1.077.84 1.68 1.104a6.017 6.017 0 0 0 5.183-.177 5.984 5.984 0 0 0 1.7-1.325l45.98-50.977Z"})),Ur=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M71.243 32.757a6 6 0 0 1 0 8.486l-24.98 24.98A5.978 5.978 0 0 1 44.7 67.36a6.017 6.017 0 0 1-5.18.105 5.976 5.976 0 0 1-1.611-1.076L24.93 54.409a6 6 0 0 1 8.14-8.818l8.764 8.09 20.923-20.924a6 6 0 0 1 8.486 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Zm0-12c19.882 0 36-16.118 36-36S67.882 12 48 12 12 28.118 12 48s16.118 36 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Yr=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 28c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20Zm-8 20a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 0c-.693 0-1.383.015-2.069.044-5.799.246-10.449 3.635-13.244 7.724l-2.594 3.795c-.39.571-1.06 1.191-2.099 1.793-1.033.598-1.896.864-2.594.918l-4.591.35c-4.926.375-10.176 2.695-13.292 7.576a47.964 47.964 0 0 0-2.091 3.614c-2.686 5.144-2.07 10.862.07 15.319l2.002 4.17c.3.627.502 1.51.502 2.697 0 1.188-.201 2.07-.502 2.697l-2.002 4.17c-2.14 4.457-2.756 10.175-.07 15.32A47.967 47.967 0 0 0 7.517 73.8c3.116 4.881 8.366 7.201 13.292 7.577l4.591.35c.698.053 1.561.32 2.594.917 1.04.602 1.709 1.222 2.1 1.793l2.593 3.795c2.795 4.089 7.445 7.478 13.244 7.724a48.674 48.674 0 0 0 4.138 0c5.799-.246 10.449-3.635 13.244-7.724l2.594-3.795c.39-.571 1.06-1.191 2.099-1.793 1.033-.598 1.897-.864 2.594-.918l4.591-.35c4.926-.375 10.176-2.695 13.292-7.576a47.949 47.949 0 0 0 2.091-3.614c2.686-5.144 2.07-10.862-.07-15.319l-2.002-4.17C88.202 50.07 88 49.187 88 48c0-1.188.201-2.07.502-2.697l2.002-4.17c2.14-4.457 2.756-10.175.07-15.32a47.949 47.949 0 0 0-2.09-3.613c-3.118-4.88-8.368-7.2-13.294-7.577l-4.591-.35c-.697-.053-1.561-.32-2.594-.917-1.04-.602-1.709-1.222-2.1-1.793l-2.593-3.795C60.518 3.679 55.868.29 50.069.044A48.724 48.724 0 0 0 48 0Zm-1.56 12.033a36.657 36.657 0 0 1 3.12 0c1.209.051 2.683.805 3.846 2.507L56 18.335c1.67 2.444 3.875 4.18 5.997 5.408 2.136 1.236 4.737 2.27 7.691 2.496l4.592.35c2.052.156 3.44 1.052 4.089 2.069.56.878 1.084 1.782 1.568 2.709.556 1.065.641 2.714-.25 4.572l-2.003 4.17C76.406 42.773 76 45.54 76 48s.406 5.228 1.684 7.89l2.002 4.17c.892 1.859.807 3.508.25 4.573a36.006 36.006 0 0 1-1.567 2.71c-.65 1.016-2.037 1.912-4.09 2.068l-4.59.35c-2.954.225-5.556 1.26-7.692 2.496-2.122 1.228-4.326 2.964-5.997 5.408l-2.594 3.795c-1.163 1.702-2.637 2.456-3.847 2.507a36.654 36.654 0 0 1-3.118 0c-1.21-.051-2.684-.805-3.847-2.507L40 77.665c-1.67-2.444-3.875-4.18-5.997-5.408-2.136-1.236-4.737-2.27-7.691-2.496l-4.592-.35c-2.052-.156-3.44-1.052-4.089-2.069a35.972 35.972 0 0 1-1.568-2.709c-.556-1.065-.641-2.714.25-4.572l2.003-4.17C19.594 53.227 20 50.46 20 48s-.406-5.228-1.684-7.89l-2.002-4.17c-.892-1.859-.807-3.508-.25-4.573a35.972 35.972 0 0 1 1.567-2.71c.65-1.016 2.037-1.912 4.09-2.068l4.59-.35c2.955-.225 5.556-1.26 7.692-2.496 2.122-1.228 4.326-2.964 5.997-5.408l2.594-3.795c1.163-1.702 2.637-2.456 3.847-2.507Z",clipRule:"evenodd"})),qr=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M25.856 20.256c1.825-.139 3.558-.79 5.143-1.707 1.58-.914 3.017-2.093 4.048-3.6l2.594-3.795c1.979-2.895 5.041-4.967 8.545-5.116a42.712 42.712 0 0 1 3.628 0c3.504.15 6.566 2.22 8.545 5.116l2.594 3.795c1.031 1.507 2.467 2.686 4.048 3.6 1.585.917 3.317 1.568 5.143 1.707l4.591.35c3.49.266 6.808 1.874 8.69 4.823a41.963 41.963 0 0 1 1.83 3.161c1.622 3.105 1.356 6.788-.16 9.946l-2.002 4.17C82.303 44.351 82 46.176 82 48c0 1.824.304 3.65 1.093 5.294l2.002 4.17c1.516 3.158 1.782 6.84.16 9.946a41.963 41.963 0 0 1-1.83 3.161c-1.882 2.949-5.2 4.557-8.69 4.823l-4.591.35c-1.826.139-3.558.79-5.143 1.707-1.58.914-3.017 2.093-4.048 3.6l-2.594 3.795c-1.979 2.895-5.04 4.967-8.545 5.115a42.662 42.662 0 0 1-3.628 0c-3.504-.148-6.566-2.22-8.545-5.115l-2.594-3.795c-1.031-1.507-2.467-2.686-4.048-3.6-1.585-.917-3.317-1.568-5.143-1.707l-4.591-.35c-3.49-.266-6.808-1.874-8.69-4.823a41.963 41.963 0 0 1-1.83-3.161c-1.622-3.105-1.356-6.788.16-9.946l2.002-4.17C13.697 51.649 14 49.824 14 48c0-1.824-.304-3.65-1.093-5.294l-2.002-4.17c-1.516-3.158-1.782-6.84-.16-9.946a41.963 41.963 0 0 1 1.83-3.161c1.882-2.949 5.2-4.557 8.69-4.823l4.591-.35ZM48 61c7.18 0 13-5.82 13-13s-5.82-13-13-13-13 5.82-13 13 5.82 13 13 13Z",clipRule:"evenodd",opacity:.35}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 28c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20Zm-8 20a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 0c-.693 0-1.383.015-2.069.044-5.799.246-10.449 3.635-13.244 7.724l-2.594 3.795c-.39.571-1.06 1.191-2.099 1.793-1.033.598-1.896.864-2.594.918l-4.591.35c-4.926.375-10.176 2.695-13.292 7.576a47.964 47.964 0 0 0-2.091 3.614c-2.686 5.144-2.07 10.862.07 15.319l2.002 4.17c.3.627.502 1.51.502 2.697 0 1.188-.201 2.07-.502 2.697l-2.002 4.17c-2.14 4.457-2.756 10.175-.07 15.32A47.967 47.967 0 0 0 7.517 73.8c3.116 4.881 8.366 7.201 13.292 7.577l4.591.35c.698.053 1.561.32 2.594.917 1.04.602 1.709 1.222 2.1 1.793l2.593 3.795c2.795 4.089 7.445 7.478 13.244 7.724a48.674 48.674 0 0 0 4.138 0c5.799-.246 10.449-3.635 13.244-7.724l2.594-3.795c.39-.571 1.06-1.191 2.099-1.793 1.033-.598 1.897-.864 2.594-.918l4.591-.35c4.926-.375 10.176-2.695 13.292-7.576a47.949 47.949 0 0 0 2.091-3.614c2.686-5.144 2.07-10.862-.07-15.319l-2.002-4.17C88.202 50.07 88 49.187 88 48c0-1.188.201-2.07.502-2.697l2.002-4.17c2.14-4.457 2.756-10.175.07-15.32a47.949 47.949 0 0 0-2.09-3.613c-3.118-4.88-8.368-7.2-13.294-7.577l-4.591-.35c-.697-.053-1.561-.32-2.594-.917-1.04-.602-1.709-1.222-2.1-1.793l-2.593-3.795C60.518 3.679 55.868.29 50.069.044A48.724 48.724 0 0 0 48 0Zm-1.56 12.033a36.657 36.657 0 0 1 3.12 0c1.209.051 2.683.805 3.846 2.507L56 18.335c1.67 2.444 3.875 4.18 5.997 5.408 2.136 1.236 4.737 2.27 7.691 2.496l4.592.35c2.052.156 3.44 1.052 4.089 2.069.56.878 1.084 1.782 1.568 2.709.556 1.065.641 2.714-.25 4.572l-2.003 4.17C76.406 42.773 76 45.54 76 48s.406 5.228 1.684 7.89l2.002 4.17c.892 1.859.807 3.508.25 4.573a36.006 36.006 0 0 1-1.567 2.71c-.65 1.016-2.037 1.912-4.09 2.068l-4.59.35c-2.954.225-5.556 1.26-7.692 2.496-2.122 1.228-4.326 2.964-5.997 5.408l-2.594 3.795c-1.163 1.702-2.637 2.456-3.847 2.507a36.654 36.654 0 0 1-3.118 0c-1.21-.051-2.684-.805-3.847-2.507L40 77.665c-1.67-2.444-3.875-4.18-5.997-5.408-2.136-1.236-4.737-2.27-7.691-2.496l-4.592-.35c-2.052-.156-3.44-1.052-4.089-2.069a35.972 35.972 0 0 1-1.568-2.709c-.556-1.065-.641-2.714.25-4.572l2.003-4.17C19.594 53.227 20 50.46 20 48s-.406-5.228-1.684-7.89l-2.002-4.17c-.892-1.859-.807-3.508-.25-4.573a35.972 35.972 0 0 1 1.567-2.71c.65-1.016 2.037-1.912 4.09-2.068l4.59-.35c2.955-.225 5.556-1.26 7.692-2.496 2.122-1.228 4.326-2.964 5.997-5.408l2.594-3.795c1.163-1.702 2.637-2.456 3.847-2.507Z",clipRule:"evenodd"})),ht=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M50 96c-7.732 0-14-6.268-14-14V42c0-7.732 6.268-14 14-14h24c7.732 0 14 6.268 14 14v40c0 7.732-6.268 14-14 14H50Zm-2-14a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V42a2 2 0 0 0-2-2H50a2 2 0 0 0-2 2v40Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M22 0C14.268 0 8 6.268 8 14v40c0 7.732 6.268 14 14 14a6 6 0 0 0 0-12 2 2 0 0 1-2-2V14a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2 6 6 0 0 0 12 0c0-7.732-6.268-14-14-14H22Z"})),Xr=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M25.74 37.884C29.59 29.702 37.98 24 47.744 24 61.188 24 72 34.793 72 48S61.188 72 47.744 72a24.31 24.31 0 0 1-12.462-3.404 6 6 0 1 0-6.128 10.317A36.31 36.31 0 0 0 47.744 84C67.719 84 84 67.93 84 48S67.72 12 47.744 12a36.284 36.284 0 0 0-32.04 19.137l-2.012-6.034a6 6 0 0 0-11.384 3.794l7 21a6 6 0 0 0 7.674 3.766l20-7a6 6 0 0 0-3.964-11.326l-7.278 2.547Z"})),Kr=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M22 68a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm22-6a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm10 6a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M0 30c0-9.941 8.059-18 18-18h60c9.941 0 18 8.059 18 18v36c0 9.941-8.059 18-18 18H18C8.059 84 0 75.941 0 66V30Zm18-6a6 6 0 0 0-6 6v2h72v-2a6 6 0 0 0-6-6H18Zm-6 42V44h72v22a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6Z",clipRule:"evenodd"})),wt=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M17.757 26.243a6 6 0 1 1 8.486-8.486L48 39.515l21.757-21.758a6 6 0 1 1 8.486 8.486L56.485 48l21.758 21.757a6 6 0 1 1-8.486 8.486L48 56.485 26.243 78.243a6 6 0 1 1-8.486-8.486L39.515 48 17.757 26.243Z"})),ye=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M66.243 29.757a6 6 0 0 1 0 8.486L56.485 48l9.758 9.757a6 6 0 1 1-8.486 8.486L48 56.485l-9.757 9.758a6 6 0 1 1-8.486-8.486L39.515 48l-9.758-9.757a6 6 0 1 1 8.486-8.486L48 39.515l9.757-9.758a6 6 0 0 1 8.486 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Zm0-12c19.882 0 36-16.118 36-36S67.882 12 48 12 12 28.118 12 48s16.118 36 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Qr=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M96 48c0 26.51-21.49 48-48 48S0 74.51 0 48 21.49 0 48 0s48 21.49 48 48Zm-12 0c0 19.882-16.118 36-36 36a35.836 35.836 0 0 1-20.86-6.656l50.204-50.203A35.836 35.836 0 0 1 84 48ZM18.656 68.86l50.203-50.204A35.836 35.836 0 0 0 48 12c-19.882 0-36 16.118-36 36a35.836 35.836 0 0 0 6.655 20.86Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Jr=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M26 12a2 2 0 0 0-2 2v68a2 2 0 0 0 2 2h44a2 2 0 0 0 2-2V30.387a2 2 0 0 0-.608-1.436L54.485 12.564A2 2 0 0 0 53.093 12H26Zm-14 2c0-7.732 6.268-14 14-14h27.093a14 14 0 0 1 9.743 3.947l16.908 16.387A14 14 0 0 1 84 30.387V82c0 7.732-6.268 14-14 14H26c-7.732 0-14-6.268-14-14V14Z",clipRule:"evenodd"})),en=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M0 22C0 9.85 9.85 0 22 0s22 9.85 22 22-9.85 22-22 22S0 34.15 0 22Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10ZM0 74c0-12.15 9.85-22 22-22s22 9.85 22 22-9.85 22-22 22S0 86.15 0 74Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10ZM74 0C61.85 0 52 9.85 52 22s9.85 22 22 22 22-9.85 22-22S86.15 0 74 0ZM64 22c0 5.523 4.477 10 10 10s10-4.477 10-10-4.477-10-10-10-10 4.477-10 10ZM52 74c0-12.15 9.85-22 22-22s22 9.85 22 22-9.85 22-22 22-22-9.85-22-22Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),tn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M22 40c9.941 0 18-8.059 18-18S31.941 4 22 4 4 12.059 4 22s8.059 18 18 18Zm0 52c9.941 0 18-8.059 18-18s-8.059-18-18-18S4 64.059 4 74s8.059 18 18 18Zm70-70c0 9.941-8.059 18-18 18s-18-8.059-18-18S64.059 4 74 4s18 8.059 18 18ZM74 92c9.941 0 18-8.059 18-18s-8.059-18-18-18-18 8.059-18 18 8.059 18 18 18Z",clipRule:"evenodd",opacity:.35}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M0 22C0 9.85 9.85 0 22 0s22 9.85 22 22-9.85 22-22 22S0 34.15 0 22Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10ZM0 74c0-12.15 9.85-22 22-22s22 9.85 22 22-9.85 22-22 22S0 86.15 0 74Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10ZM74 0C61.85 0 52 9.85 52 22s9.85 22 22 22 22-9.85 22-22S86.15 0 74 0ZM64 22c0 5.523 4.477 10 10 10s10-4.477 10-10-4.477-10-10-10-10 4.477-10 10ZM52 74c0-12.15 9.85-22 22-22s22 9.85 22 22-9.85 22-22 22-22-9.85-22-22Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),rn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"m52.243 88.243 34-34a6 6 0 1 0-8.486-8.486L54 69.515V12a6 6 0 0 0-12 0v57.515L18.243 45.757a6 6 0 0 0-8.486 8.486l33.986 33.985.014.015a6 6 0 0 0 8.486 0Z"})),Ue=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M52.243 70.243a6 6 0 0 1-8.486 0l-30-30a6 6 0 1 1 8.486-8.486L48 57.515l25.757-25.758a6 6 0 1 1 8.486 8.486l-30 30Z",clipRule:"evenodd"})),nn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M42 28v25.515l-6.757-6.758a6 6 0 1 0-8.486 8.486l17 17a6.002 6.002 0 0 0 8.485 0l.006-.006 16.995-16.994a6 6 0 1 0-8.486-8.486L54 53.515V28a6 6 0 0 0-12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M0 48C0 21.49 21.49 0 48 0s48 21.49 48 48-21.49 48-48 48S0 74.51 0 48Zm12 0c0-19.882 16.118-36 36-36s36 16.118 36 36-16.118 36-36 36-36-16.118-36-36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),on=({title:e,titleId:r,...n})=>t.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{d:"M4.00058 9.70969C4.23776 10.2167 4.82477 11.2188 4.82477 11.2188L11.611 0L4.98783 4.62508C4.59318 4.88836 4.2694 5.24473 4.04505 5.66275C3.7434 6.29338 3.58313 6.98229 3.57545 7.68131C3.56777 8.38033 3.71286 9.07259 4.00058 9.70969Z",fill:"#5298FF"}),t.createElement("path",{d:"M1.31159 13.4038C1.38637 14.477 1.68956 15.5217 2.20086 16.4682C2.71216 17.4146 3.41976 18.2409 4.27629 18.8917L11.6021 24C11.6021 24 7.01863 17.3944 3.15267 10.8215C2.76128 10.1271 2.49816 9.36782 2.37592 8.58011C2.3218 8.22341 2.3218 7.86059 2.37592 7.50389C2.27512 7.69068 2.07945 8.07313 2.07945 8.07313C1.68745 8.87262 1.42049 9.72754 1.28787 10.608C1.21154 11.5388 1.21948 12.4745 1.31159 13.4038Z",fill:"#5298FF"}),t.createElement("path",{d:"M20.0011 14.2903C19.7639 13.7833 19.1769 12.7812 19.1769 12.7812L12.3907 24L19.0138 19.3779C19.4085 19.1146 19.7322 18.7582 19.9566 18.3402C20.2587 17.7092 20.4192 17.0198 20.4269 16.3202C20.4346 15.6206 20.2892 14.9278 20.0011 14.2903Z",fill:"#5298FF"}),t.createElement("path",{d:"M22.69 10.5962C22.6153 9.52304 22.3121 8.47827 21.8008 7.53183C21.2895 6.58539 20.5819 5.75911 19.7253 5.10834L12.3996 0C12.3996 0 16.98 6.60556 20.849 13.1785C21.2393 13.8731 21.5014 14.6324 21.6227 15.4199C21.6769 15.7766 21.6769 16.1394 21.6227 16.4961C21.7235 16.3093 21.9192 15.9269 21.9192 15.9269C22.3112 15.1274 22.5782 14.2725 22.7108 13.392C22.7881 12.4613 22.7812 11.5256 22.69 10.5962Z",fill:"#5298FF"}),t.createElement("path",{d:"M4.04505 5.66275C4.2694 5.24473 4.59318 4.88836 4.98783 4.62508L11.611 0L4.82476 11.2217C4.82476 11.2217 4.23182 10.2196 4.00057 9.71266C3.7124 9.07515 3.56707 8.38236 3.57475 7.68278C3.58243 6.98321 3.74296 6.29378 4.04505 5.66275ZM1.31159 13.4038C1.38637 14.477 1.68956 15.5217 2.20086 16.4682C2.71216 17.4146 3.41976 18.2409 4.27629 18.8917L11.6021 24C11.6021 24 7.01863 17.3944 3.15267 10.8215C2.76128 10.1271 2.49816 9.36782 2.37592 8.58011C2.3218 8.22341 2.3218 7.86059 2.37592 7.50389C2.27512 7.69068 2.07945 8.07313 2.07945 8.07313C1.68745 8.87262 1.42049 9.72754 1.28787 10.608C1.21154 11.5388 1.21948 12.4745 1.31159 13.4038ZM19.9892 14.2933C19.752 13.7863 19.165 12.7842 19.165 12.7842L12.3907 24L19.0138 19.3779C19.4085 19.1146 19.7322 18.7582 19.9566 18.3402C20.2587 17.7092 20.4192 17.0198 20.4269 16.3202C20.4346 15.6206 20.2892 14.9278 20.0011 14.2903L19.9892 14.2933ZM22.6782 10.5991C22.6034 9.526 22.3002 8.48124 21.7889 7.53479C21.2776 6.58835 20.57 5.76208 19.7135 5.1113L12.3996 0C12.3996 0 16.98 6.60556 20.849 13.1785C21.2393 13.8731 21.5014 14.6324 21.6227 15.4199C21.6769 15.7766 21.6769 16.1394 21.6227 16.4961C21.7235 16.3093 21.9192 15.9269 21.9192 15.9269C22.3112 15.1274 22.5782 14.2725 22.7108 13.392C22.7881 12.4613 22.7812 11.5256 22.69 10.5962L22.6782 10.5991Z",fill:"#5298FF"})),Ye=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M45.409 4.442 21.525 45.385a3 3 0 0 0 1.103 4.117l23.884 13.647a3 3 0 0 0 2.976 0l23.884-13.647a3 3 0 0 0 1.103-4.117L50.59 4.442c-1.157-1.984-4.025-1.984-5.182 0Z"}),t.createElement("path",{fill:"currentColor",d:"m22.559 59.656 22.983 32.833c1.195 1.706 3.721 1.706 4.916 0L73.44 59.655c.612-.874-.388-1.97-1.315-1.441l-23.63 13.502a1 1 0 0 1-.992 0l-23.63-13.502c-.927-.53-1.927.567-1.315 1.442Z"})),an=({title:e,titleId:r,...n})=>t.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{d:"M11.998 0V8.87185L19.4236 12.2225L11.998 0Z",fill:"currentColor",fillOpacity:.8}),t.createElement("path",{d:"M11.998 0L4.57143 12.2225L11.998 8.87185V0Z",fill:"currentColor",fillOpacity:.4}),t.createElement("path",{d:"M11.998 17.9717V24L19.4286 13.6188L11.998 17.9717Z",fill:"currentColor",fillOpacity:.8}),t.createElement("path",{d:"M11.998 24V17.9707L4.57143 13.6188L11.998 24Z",fill:"currentColor",fillOpacity:.4}),t.createElement("path",{d:"M11.998 16.5765L19.4236 12.2226L11.998 8.87386V16.5765Z",fill:"currentColor"}),t.createElement("path",{d:"M4.57143 12.2226L11.998 16.5765V8.87386L4.57143 12.2226Z",fill:"currentColor",fillOpacity:.8})),ln=({title:e,titleId:r,...n})=>t.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{d:"M11.998 0V8.87185L19.4236 12.2225L11.998 0Z",fill:"currentColor",fillOpacity:.602}),t.createElement("path",{d:"M11.998 0L4.57143 12.2225L11.998 8.87185V0Z",fill:"currentColor"}),t.createElement("path",{d:"M11.998 17.9717V24L19.4286 13.6188L11.998 17.9717Z",fill:"currentColor",fillOpacity:.602}),t.createElement("path",{d:"M11.998 24V17.9707L4.57143 13.6188L11.998 24Z",fill:"currentColor"}),t.createElement("path",{d:"M11.998 16.5765L19.4236 12.2226L11.998 8.87386V16.5765Z",fill:"currentColor",fillOpacity:.2}),t.createElement("path",{d:"M4.57143 12.2226L11.998 16.5765V8.87386L4.57143 12.2226Z",fill:"currentColor",fillOpacity:.602})),qe=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M18 4C8.059 4 0 12.059 0 22v52c0 9.941 8.059 18 18 18h20c9.941 0 18-8.059 18-18v-4a6 6 0 0 0-12 0v4a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V22a6 6 0 0 1 6-6h20a6 6 0 0 1 6 6v4a6 6 0 0 0 12 0v-4c0-9.941-8.059-18-18-18H18Z"}),t.createElement("path",{fill:"currentColor",d:"M94.462 52.011a6 6 0 0 0-.471-8.492L74.014 25.54a6 6 0 0 0-8.028 8.92L74.364 42H38a6 6 0 0 0 0 12h36.364l-8.378 7.54a6 6 0 0 0 8.028 8.92l20-18a5.93 5.93 0 0 0 .448-.449Z"})),cn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 28c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20Zm-8 20a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 12c-11.555 0-21.694 5.905-29.276 12.159C11.051 30.489 5.26 37.783 2.29 41.868a11.23 11.23 0 0 0 0 13.264c2.97 4.085 8.76 11.38 16.434 17.709C26.306 79.095 36.445 85 48 85s21.694-5.905 29.276-12.159c7.673-6.33 13.464-13.624 16.434-17.709a11.23 11.23 0 0 0 0-13.264c-2.97-4.085-8.76-11.38-16.434-17.709C69.694 17.905 59.555 12 48 12ZM26.36 63.584C20.026 58.359 15.054 52.23 12.306 48.5c2.748-3.73 7.72-9.859 14.054-15.084C33.033 27.912 40.5 24 48 24s14.967 3.912 21.64 9.416C75.974 38.641 80.946 44.77 83.694 48.5c-2.748 3.73-7.72 9.859-14.054 15.084C62.967 69.088 55.5 73 48 73s-14.967-3.912-21.64-9.416Z",clipRule:"evenodd"})),sn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M12.628 48.4C16.224 41.294 27.214 24 48 24c2.766 0 5.328.3 7.703.825a6 6 0 1 0 2.594-11.716A47.514 47.514 0 0 0 48 12C19.107 12 5.122 36.447 1.6 43.625a10.836 10.836 0 0 0 .068 9.702c1.471 2.903 4.368 7.96 8.934 13.14a6 6 0 0 0 9.002-7.934A52.365 52.365 0 0 1 12.628 48.4Zm69.02-14.01a6 6 0 0 1 8.328 1.623 65.09 65.09 0 0 1 4.418 7.602 10.829 10.829 0 0 1-.055 9.698C90.74 60.42 76.733 84 48 84c-1.155 0-2.29-.039-3.404-.114a6 6 0 1 1 .808-11.973c.844.057 1.71.087 2.596.087 20.803 0 31.775-16.72 35.372-23.6a53.684 53.684 0 0 0-3.348-5.682 6 6 0 0 1 1.624-8.329Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M59.723 31.792c-7.82-5.67-18.818-4.982-25.865 2.066-7.047 7.047-7.736 18.045-2.066 25.865L13.757 77.757a6 6 0 1 0 8.486 8.486l64-64a6 6 0 1 0-8.486-8.486L59.723 31.792Zm-8.77 8.77a8.002 8.002 0 0 0-10.39 10.39l10.39-10.39Z",clipRule:"evenodd"})),dn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M57.028 14.057C50.441 9.079 41 13.779 41 22.036v1.526a6 6 0 0 0 11.591 2.182L82.047 48 52.591 70.256A6.002 6.002 0 0 0 41 72.437v1.527c0 8.257 9.44 12.957 16.028 7.98l34.365-25.965c5.296-4.001 5.296-11.957 0-15.958L57.028 14.057Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M16.028 14.057C9.441 9.079 0 13.779 0 22.036v51.928c0 8.257 9.44 12.957 16.028 7.98l34.365-25.965c5.295-4.001 5.296-11.957 0-15.958L16.028 14.057ZM12 69.947V26.053L41.047 48 12 69.947Z",clipRule:"evenodd"})),un=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 12c-19.551 0-28.246 5.992-31.795 9.614a.644.644 0 0 0-.17.252 1.069 1.069 0 0 0-.034.425c.04.504.312 1.313 1.005 2.145L39.828 51.82A18 18 0 0 1 44 63.345V80a4 4 0 0 0 8 0V63.345a18 18 0 0 1 4.172-11.524l22.822-27.385c.693-.832.965-1.641 1.005-2.145a1.069 1.069 0 0 0-.034-.425.644.644 0 0 0-.17-.252C76.246 17.992 67.55 12 48 12ZM7.633 13.217C13.793 6.93 25.767 0 48 0c22.233 0 34.207 6.93 40.367 13.217 5.966 6.091 3.67 14.31-.155 18.9L65.391 59.505A6 6 0 0 0 64 63.344V80c0 8.837-7.163 16-16 16s-16-7.163-16-16V63.345a6 6 0 0 0-1.39-3.841L7.787 32.118c-3.826-4.591-6.121-12.81-.155-18.9Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),pn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M46.656 17.497C43.927 28.1 38.483 36.16 33.67 42.944l-.736 1.036C26.815 52.6 22.8 58.254 22.8 65.274c0 6.105 2.309 10.44 5.104 13.452.692-15.463 10.033-27.11 13.693-31.144 2.221-2.449 5.547-2.743 8.02-1.496a6.824 6.824 0 0 1 3.719 6.68c-.307 3.637.344 5.865 1.183 7.52.799 1.578 1.788 2.767 3.197 4.46.328.395.679.817 1.055 1.277 1.83 2.238 4.126 5.28 5.066 9.59.142.653.25 1.317.323 1.993 3.734-3.383 5.918-6.822 7.08-10.137 1.932-5.508 1.4-11.69-1.23-18.444-4.32-11.095-13.762-22.356-23.354-31.528ZM36.289 6.802c.363-4.974 6.52-8.732 11.21-4.716 11.96 10.239 27.197 25.897 33.693 42.585 3.304 8.487 4.539 17.74 1.373 26.768-3.178 9.064-10.436 16.893-22.097 23.204-5.36 2.9-11.915-2.301-9.64-8.38 1.623-4.339 1.585-6.714 1.284-8.093-.307-1.41-1.05-2.619-2.63-4.55-.22-.269-.465-.56-.73-.876-1.445-1.72-3.464-4.123-4.939-7.036l-.105-.21c-2.973 5.887-5.09 13.569-2.977 22.02a6.806 6.806 0 0 1-1.878 6.565 6.705 6.705 0 0 1-7.173 1.382c-4.828-1.948-20.88-9.95-20.88-30.19 0-11.019 6.268-19.762 11.71-27.353.466-.648.924-1.288 1.372-1.92 6.033-8.506 11.522-17.041 12.407-29.2Z",clipRule:"evenodd"})),fn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M16 42a6 6 0 0 1 6-6h16a6 6 0 0 1 0 12H22a6 6 0 0 1-6-6Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M0 18C0 8.059 8.059 0 18 0h24c9.941 0 18 8.059 18 18v18h2c9.941 0 18 8.059 18 18v14c0 1.495.49 2.65 1.028 3.323.53.662.912.677.972.677.06 0 .442-.015.972-.677C83.51 70.649 84 69.495 84 68V32.7L69.726 18.21a6 6 0 0 1 8.548-8.42l14.274 14.488A12 12 0 0 1 96 32.7V68c0 7.518-5.088 16-14 16-8.912 0-14-8.482-14-16V54a6 6 0 0 0-6-6h-2v30c0 9.941-8.059 18-18 18H18C8.059 96 0 87.941 0 78V18Zm48 0a6 6 0 0 0-6-6H18a6 6 0 0 0-6 6v60a6 6 0 0 0 6 6h24a6 6 0 0 0 6-6V18Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),gn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M15.15 21.393c-2.532 3.395-4.032 8.719-2.588 15.928.42 2.092 1.762 5.1 4.15 8.898 2.324 3.699 5.377 7.738 8.779 11.825 6.8 8.17 14.683 16.161 20.12 21.443 1.36 1.32 3.418 1.32 4.778 0 5.437-5.282 13.32-13.273 20.12-21.443 3.402-4.087 6.455-8.126 8.78-11.825 2.387-3.798 3.73-6.806 4.149-8.898 1.444-7.21-.056-12.533-2.587-15.928C78.317 17.996 74.379 16 69.75 16c-7.945 0-11.555 3.295-13.429 6.118-1.03 1.553-1.637 3.143-1.981 4.362-.17.6-.268 1.083-.32 1.388a7.41 7.41 0 0 0-.048.306l-.003.026a6 6 0 0 1-11.943-.026 7.233 7.233 0 0 0-.047-.306 14.078 14.078 0 0 0-.32-1.388c-.345-1.22-.952-2.81-1.982-4.362C37.804 19.295 34.194 16 26.249 16c-4.628 0-8.566 1.996-11.1 5.393ZM48 13.236C52.218 8.194 59.106 4 69.75 4c8.262 0 15.83 3.662 20.72 10.22 4.892 6.559 6.732 15.485 4.734 25.46-.85 4.235-3.11 8.716-5.756 12.926-2.71 4.31-6.122 8.797-9.716 13.115-7.19 8.64-15.415 16.966-20.982 22.374a15.374 15.374 0 0 1-21.5 0C31.683 82.687 23.46 74.36 16.268 65.72c-3.594-4.318-7.007-8.806-9.716-13.115-2.647-4.21-4.907-8.691-5.756-12.927-1.998-9.974-.158-18.9 4.734-25.46C10.42 7.662 17.988 4 26.25 4 36.893 4 43.781 8.194 48 13.236Z",clipRule:"evenodd"})),mn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M69.75 9C49.612 9 48 26.793 48 26.793S46.389 9 26.25 9C13.36 9 3.235 20.44 6.68 37.812c2.635 13.296 25.443 36.739 36 47.007a7.58 7.58 0 0 0 10.64 0c10.557-10.268 33.365-33.71 36-47.007C92.765 20.44 82.64 9 69.75 9Z",opacity:.35}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M15.15 21.393c-2.532 3.395-4.032 8.719-2.588 15.928.42 2.092 1.762 5.1 4.15 8.898 2.324 3.699 5.377 7.738 8.779 11.825 6.8 8.17 14.683 16.161 20.12 21.443 1.36 1.32 3.418 1.32 4.778 0 5.437-5.282 13.32-13.273 20.12-21.443 3.402-4.087 6.455-8.126 8.78-11.825 2.387-3.798 3.73-6.806 4.149-8.898 1.444-7.21-.056-12.533-2.587-15.928C78.317 17.996 74.379 16 69.75 16c-7.945 0-11.555 3.295-13.429 6.118-1.03 1.553-1.637 3.143-1.981 4.362-.17.6-.268 1.083-.32 1.388-.027.152-.041.256-.048.306l-.003.026a6 6 0 0 1-11.94 0l-.003-.026a7.596 7.596 0 0 0-.047-.306 14.078 14.078 0 0 0-.32-1.388c-.345-1.22-.952-2.81-1.982-4.362C37.804 19.295 34.194 16 26.249 16c-4.628 0-8.566 1.996-11.1 5.393ZM48 13.236C52.218 8.194 59.106 4 69.75 4c8.262 0 15.83 3.662 20.72 10.22 4.892 6.559 6.732 15.485 4.734 25.46-.85 4.235-3.11 8.716-5.756 12.926-2.71 4.31-6.122 8.797-9.716 13.115-7.19 8.64-15.415 16.966-20.982 22.374a15.374 15.374 0 0 1-21.5 0C31.683 82.687 23.46 74.36 16.268 65.72c-3.594-4.318-7.007-8.806-9.716-13.115-2.647-4.21-4.907-8.691-5.756-12.927-1.998-9.974-.158-18.9 4.734-25.46C10.42 7.662 17.988 4 26.25 4 36.893 4 43.781 8.194 48 13.236Z",clipRule:"evenodd"})),bn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M51.905 5.444a6 6 0 0 0-7.81 0l-42 36a6 6 0 1 0 7.81 9.111L48 17.903l38.095 32.654a6 6 0 1 0 7.81-9.111l-42-36Z"}),t.createElement("path",{fill:"currentColor",d:"M28 58a6 6 0 0 0-12 0v16c0 9.941 8.059 18 18 18h28c9.941 0 18-8.059 18-18V58a6 6 0 0 0-12 0v16a6 6 0 0 1-6 6H34a6 6 0 0 1-6-6V58Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),vt=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M54 26a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm0 16a6 6 0 0 0-10.633-3.812c-.758.921-2.302 1.963-4.176 2.867a26.883 26.883 0 0 1-2.823 1.166l-.142.047-.02.006A6 6 0 0 0 39.78 53.73l-1.766-5.687c1.766 5.687 1.768 5.687 1.768 5.687l.003-.001.005-.002.012-.004.033-.01a18.325 18.325 0 0 0 .395-.13 32.899 32.899 0 0 0 1.771-.66V70a6 6 0 0 0 12 0V42Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Zm0-12c19.882 0 36-16.118 36-36S67.882 12 48 12 12 28.118 12 48s16.118 36 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),$n=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M91.243 10.243a6 6 0 1 0-8.486-8.486L41.21 43.305A27.877 27.877 0 0 0 28 40C12.536 40 0 52.536 0 68s12.536 28 28 28 28-12.536 28-28a27.877 27.877 0 0 0-5.648-16.867L66.5 34.985l3.257 3.258a6 6 0 1 0 8.486-8.486L74.985 26.5l3.515-3.515 3.257 3.258a6 6 0 1 0 8.486-8.486L86.985 14.5l4.258-4.257ZM12 68c0-8.837 7.163-16 16-16s16 7.163 16 16-7.163 16-16 16-16-7.163-16-16Z",clipRule:"evenodd"})),hn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M32 18a6 6 0 0 0-12 0v6h-5.86a6.126 6.126 0 0 0-.278 0H6a6 6 0 0 0 0 12h3.712c2.253 6.237 4.715 11.368 8.034 15.918-1.975 1.619-4.277 3.27-7.018 5.053a6 6 0 0 0 6.544 10.058c3.264-2.123 6.15-4.197 8.728-6.367 2.577 2.17 5.464 4.244 8.728 6.367a6 6 0 0 0 6.544-10.058c-2.74-1.783-5.043-3.434-7.018-5.053 3.319-4.55 5.78-9.68 8.034-15.918H46a6 6 0 0 0 0-12h-7.862a6.126 6.126 0 0 0-.278 0H32v-6Zm-6 24.71c-1.213-1.947-2.326-4.136-3.413-6.71h6.826c-1.087 2.574-2.2 4.763-3.413 6.71Zm50.158-2.936c-2.646-4.895-9.67-4.895-12.316 0l-19.12 35.373a6 6 0 1 0 10.556 5.706L57.901 76h24.197l2.624 4.853a6 6 0 1 0 10.556-5.706l-19.12-35.373ZM70 53.618 75.612 64H64.388L70 53.618Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),wn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"m7.757 52.243 34 34a6 6 0 1 0 8.486-8.486L26.485 54H84a6 6 0 0 0 0-12H26.485l23.758-23.757a6 6 0 1 0-8.486-8.486L7.772 43.743l-.015.014a6 6 0 0 0 0 8.486Z"})),vn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M25.757 52.243a6 6 0 0 1 0-8.486l30-30a6 6 0 1 1 8.486 8.486L38.485 48l25.758 25.757a6 6 0 1 1-8.486 8.486l-30-30Z",clipRule:"evenodd"})),yn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M96 48c0 26.51-21.49 48-48 48S0 74.51 0 48 21.49 0 48 0s48 21.49 48 48Zm-12 0a35.836 35.836 0 0 1-6.656 20.86l-8.667-8.668A23.89 23.89 0 0 0 72 48c0-4.46-1.217-8.637-3.337-12.215l8.666-8.666A35.835 35.835 0 0 1 84 48ZM68.837 18.64A35.836 35.836 0 0 0 48 12a35.836 35.836 0 0 0-20.86 6.655l8.668 8.668A23.89 23.89 0 0 1 48 24c4.441 0 8.6 1.206 12.168 3.31l8.67-8.67ZM48 84a35.836 35.836 0 0 0 20.86-6.656l-8.668-8.667A23.89 23.89 0 0 1 48 72c-4.46 0-8.637-1.217-12.215-3.337l-8.666 8.666A35.835 35.835 0 0 0 48 84ZM18.64 68.837A35.836 35.836 0 0 1 12 48a35.836 35.836 0 0 1 6.655-20.86l8.668 8.668A23.89 23.89 0 0 0 24 48c0 4.441 1.206 8.6 3.31 12.168l-8.67 8.67ZM36 48c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12-12-5.373-12-12Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),En=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"m49.757 53.272-1.514-1.515a6 6 0 1 0-8.486 8.486l1.515 1.514c7.03 7.03 18.427 7.03 25.456 0l23.03-23.029c7.029-7.03 7.029-18.427 0-25.456l-6.03-6.03c-7.03-7.029-18.426-7.029-25.456 0l-9.515 9.515a6 6 0 1 0 8.486 8.486l9.514-9.515a6 6 0 0 1 8.486 0l6.03 6.03a6 6 0 0 1 0 8.485l-23.03 23.03a6 6 0 0 1-8.486 0Z"}),t.createElement("path",{fill:"currentColor",d:"m46.243 42.728 1.514 1.515a6 6 0 0 0 8.486-8.486l-1.515-1.514c-7.03-7.03-18.427-7.03-25.456 0l-23.03 23.03c-7.029 7.029-7.029 18.425 0 25.455l6.03 6.03c7.03 7.029 18.427 7.029 25.456 0l9.515-9.515a6 6 0 1 0-8.486-8.486l-9.514 9.515a6 6 0 0 1-8.486 0l-6.03-6.03a6 6 0 0 1 0-8.485l23.03-23.03a6 6 0 0 1 8.486 0Z"})),xn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M14 28a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 26a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm6 20a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm14-58a6 6 0 0 0 0 12h48a6 6 0 0 0 0-12H34Zm-6 58a6 6 0 0 1 6-6h48a6 6 0 0 1 0 12H34a6 6 0 0 1-6-6Zm6-32a6 6 0 0 0 0 12h48a6 6 0 0 0 0-12H34Z",clipRule:"evenodd"})),Cn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M94.243 60.757a6 6 0 0 0-8.486 0L78 68.515V14a6 6 0 0 0-12 0v54.515l-7.757-7.758a6 6 0 0 0-8.486 8.486l18 18a6.002 6.002 0 0 0 8.486 0l18-18a6 6 0 0 0 0-8.486ZM6 28a6 6 0 0 1 0-12h44a6 6 0 0 1 0 12H6ZM0 74a6 6 0 0 0 6 6h28a6 6 0 0 0 0-12H6a6 6 0 0 0-6 6Zm6-20a6 6 0 0 1 0-12h36a6 6 0 0 1 0 12H6Z"})),kn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M94.243 35.243a6 6 0 0 1-8.486 0L78 27.485V82a6 6 0 0 1-12 0V27.485l-7.757 7.758a6 6 0 1 1-8.486-8.486l18-18a6.002 6.002 0 0 1 8.486 0l18 18a6 6 0 0 1 0 8.486ZM6 68a6 6 0 0 0 0 12h44a6 6 0 0 0 0-12H6ZM0 22a6 6 0 0 1 6-6h28a6 6 0 0 1 0 12H6a6 6 0 0 1-6-6Zm6 20a6 6 0 0 0 0 12h36a6 6 0 0 0 0-12H6Z"})),Sn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M48 56a6 6 0 0 1 6 6v4a6 6 0 0 1-12 0v-4a6 6 0 0 1 6-6Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 0C34.745 0 24 10.745 24 24v8.11C15 33.105 8 40.735 8 50v28c0 9.941 8.059 18 18 18h44c9.941 0 18-8.059 18-18V50c0-9.265-7-16.895-16-17.89V24C72 10.745 61.255 0 48 0Zm12 32v-8c0-6.627-5.373-12-12-12s-12 5.373-12 12v8h24ZM26 44a6 6 0 0 0-6 6v28a6 6 0 0 0 6 6h44a6 6 0 0 0 6-6V50a6 6 0 0 0-6-6H26Z",clipRule:"evenodd"})),Rn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M48 42c0-5.523-4.477-10-10-10a6 6 0 0 1 0-12c12.15 0 22 9.85 22 22a6 6 0 0 1-12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M72.209 63.724A39.82 39.82 0 0 0 80 40C80 17.909 62.091 0 40 0S0 17.909 0 40s17.909 40 40 40a39.82 39.82 0 0 0 23.724-7.791l18.033 18.034a6 6 0 1 0 8.486-8.486L72.209 63.723ZM40 68c15.464 0 28-12.536 28-28S55.464 12 40 12 12 24.536 12 40s12.536 28 28 28Z",clipRule:"evenodd"})),Pn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("circle",{cx:40,cy:40,r:32,fill:"currentColor",opacity:.35}),t.createElement("path",{fill:"currentColor",d:"M48 42c0-5.523-4.477-10-10-10a6 6 0 0 1 0-12c12.15 0 22 9.85 22 22a6 6 0 0 1-12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M72.209 63.724A39.82 39.82 0 0 0 80 40C80 17.909 62.091 0 40 0S0 17.909 0 40s17.909 40 40 40a39.82 39.82 0 0 0 23.724-7.791l18.033 18.034a6 6 0 1 0 8.486-8.486L72.209 63.723ZM40 68c15.464 0 28-12.536 28-28S55.464 12 40 12 12 24.536 12 40s12.536 28 28 28Z",clipRule:"evenodd"})),Ln=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M56.86 65.344A35.836 35.836 0 0 1 36 72C16.118 72 0 55.882 0 36S16.118 0 36 0s36 16.118 36 36a35.836 35.836 0 0 1-6.656 20.86l25.899 25.897a6 6 0 1 1-8.486 8.486L56.86 65.345ZM60 36c0 13.255-10.745 24-24 24S12 49.255 12 36s10.745-24 24-24 24 10.745 24 24Z",clipRule:"evenodd"})),Vn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 20c-9.941 0-18 8.059-18 18s8.059 18 18 18 18-8.059 18-18-8.059-18-18-18Zm-6 18a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 0C26.235 0 9 18.302 9 40.362c0 15.652 9.428 29.58 17.903 38.996a111.319 111.319 0 0 0 11.985 11.444 73.582 73.582 0 0 0 4.136 3.174c.52.366 1.019.699 1.449.958.19.115.508.3.872.47.145.067.56.258 1.106.4a6.04 6.04 0 0 0 5.347-1.162l.21-.157a118.055 118.055 0 0 0 5.135-4.032c3.26-2.706 7.593-6.586 11.933-11.358C77.548 69.78 87 56.036 87 40.362 87 18.302 69.766 0 48 0ZM21 40.362C21 24.467 33.315 12 48 12s27 12.467 27 28.362c0 11.051-6.865 21.933-14.801 30.658-3.864 4.249-7.76 7.742-10.721 10.201-.597.496-1.155.949-1.666 1.356a79.24 79.24 0 0 1-1.322-1.06A99.3 99.3 0 0 1 35.822 71.33C27.888 62.515 21 51.435 21 40.362Zm22.672 45.477a6.102 6.102 0 0 1 .488-.455l-.004.004c-.04.033-.25.208-.483.451Zm7.013-1.172-.017-.01a.598.598 0 0 0 .015.009h.002Z",clipRule:"evenodd"})),Mn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M8 22a6 6 0 0 1 6-6h68a6 6 0 0 1 0 12H14a6 6 0 0 1-6-6Zm0 52a6 6 0 0 1 6-6h68a6 6 0 0 1 0 12H14a6 6 0 0 1-6-6Zm6-32a6 6 0 0 0 0 12h68a6 6 0 0 0 0-12H14Z",clipRule:"evenodd"})),Zn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M88 48a6 6 0 0 1-6 6H14a6 6 0 0 1 0-12h68a6 6 0 0 1 6 6Z",clipRule:"evenodd"})),Tn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M84 48c0 19.882-16.118 36-36 36S12 67.882 12 48s16.118-36 36-36 36 16.118 36 36Zm12 0c0 26.51-21.49 48-48 48S0 74.51 0 48 21.49 0 48 0s48 21.49 48 48Zm-28 6a6 6 0 0 0 0-12H28a6 6 0 0 0 0 12h40Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Gn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M76 6a6 6 0 0 0-12 0v8a6 6 0 0 0 12 0V6Zm0 32a6 6 0 0 0-12 0v8a6 6 0 0 0 12 0v-8Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M31.438 8.117a8.158 8.158 0 0 1 2.68 8.252A37.596 37.596 0 0 0 33 25.5C33 46.21 49.79 63 70.5 63c3.157 0 6.214-.389 9.13-1.118a8.158 8.158 0 0 1 8.253 2.68c1.942 2.328 2.665 6.005.595 9.245C79.963 87.14 65.018 96 48 96 21.49 96 0 74.51 0 48 0 30.982 8.861 16.037 22.193 7.522c3.24-2.07 6.917-1.347 9.245.595Zm-10.42 16.05A35.858 35.858 0 0 0 12 48c0 19.882 16.118 36 36 36a35.858 35.858 0 0 0 23.834-9.018c-.444.012-.888.018-1.334.018C43.162 75 21 52.838 21 25.5c0-.446.006-.89.018-1.334Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M96 26a6 6 0 0 1-6 6h-8a6 6 0 0 1 0-12h8a6 6 0 0 1 6 6Zm-32 0a6 6 0 0 1-6 6h-8a6 6 0 0 1 0-12h8a6 6 0 0 1 6 6Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Bn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M54 6a6 6 0 0 0-12 0v8a6 6 0 0 0 12 0V6Z"}),t.createElement("path",{fill:"currentColor",d:"M88 26c0-9.941-8.059-18-18-18h-4a6 6 0 0 0 0 12h4a6 6 0 0 1 6 6v52a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6V26a6 6 0 0 1 6-6h4a6 6 0 0 0 0-12h-4C16.059 8 8 16.059 8 26v52c0 9.941 8.059 18 18 18h44c9.941 0 18-8.059 18-18V26Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 24c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16Zm-4 16a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M42.106 73.05c-1.094.489-1.673 1.014-1.968 1.295a6 6 0 0 1-8.276-8.69C33.92 63.695 38.697 60 48 60s14.08 3.695 16.138 5.655a6 6 0 1 1-8.276 8.69c-.295-.281-.874-.806-1.968-1.295C52.786 72.556 50.925 72 48 72c-2.925 0-4.786.556-5.894 1.05Z"})),On=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M50 4a6 6 0 0 0 0 12h21.515L33.757 53.757a6 6 0 1 0 8.486 8.486L80 24.485V46a6 6 0 0 0 12 0V10a6 6 0 0 0-6-6H50Z"}),t.createElement("path",{fill:"currentColor",d:"M16 42a6 6 0 0 1 6-6h8a6 6 0 0 0 0-12h-8c-9.941 0-18 8.059-18 18v32c0 9.941 8.059 18 18 18h32c9.941 0 18-8.059 18-18v-8a6 6 0 0 0-12 0v8a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6V42Z"})),An=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M76 28c0 15.464-12.536 28-28 28S20 43.464 20 28 32.536 0 48 0s28 12.536 28 28Zm-12 0c0 8.837-7.163 16-16 16s-16-7.163-16-16 7.163-16 16-16 16 7.163 16 16Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M12.915 93.44C16.421 88.434 26.044 76 48 76c21.957 0 31.58 12.433 35.085 17.44a6 6 0 0 0 9.83-6.88C88.421 80.137 75.643 64 48 64S7.58 80.138 3.085 86.56a6 6 0 0 0 9.83 6.88Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Hn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M72 6a6 6 0 0 1 12 0v6h6a6 6 0 0 1 0 12h-6v6a6 6 0 0 1-12 0v-6h-6a6 6 0 0 1 0-12h6V6Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M60 38c0 12.15-9.85 22-22 22s-22-9.85-22-22 9.85-22 22-22 22 9.85 22 22Zm-12 0c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M10.915 93.44C13.621 89.577 21.003 80 38 80c16.996 0 24.38 9.576 27.085 13.44a6 6 0 0 0 9.83-6.88C71.221 81.28 60.683 68 38 68 15.316 68 4.78 81.281 1.085 86.56a6 6 0 0 0 9.83 6.88Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),jn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M54 14a6 6 0 0 0-12 0v28H14a6 6 0 0 0 0 12h28v28a6 6 0 0 0 12 0V54h28a6 6 0 0 0 0-12H54V14Z",clipRule:"evenodd"})),Fn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M48 22a6 6 0 0 1 6 6v14h14a6 6 0 0 1 0 12H54v14a6 6 0 0 1-12 0V54H28a6 6 0 0 1 0-12h14V28a6 6 0 0 1 6-6Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Zm0-12c19.882 0 36-16.118 36-36S67.882 12 48 12 12 28.118 12 48s16.118 36 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Dn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M44.017 33.972c-.013.034-.017.045-.017.028a6 6 0 0 1-12 0c0-7.69 6.996-14 16-14s16 6.31 16 14c0 3.485-.992 6.44-2.891 8.795-1.774 2.2-3.981 3.413-5.456 4.14-.408.201-1.003.477-1.437.678l-.47.22-.037.017A6 6 0 0 1 42 46c.001-3.848 2.19-6.284 4.162-7.642.872-.6 1.769-1.046 2.421-1.358.398-.19.665-.312.9-.42.28-.127.513-.234.865-.408 1.025-.505 1.318-.782 1.42-.909a.612.612 0 0 0 .107-.213c.046-.138.126-.458.126-1.05 0 .017-.004.006-.017-.028C51.885 33.703 51.258 32 48 32s-3.884 1.703-3.983 1.972Zm8.947 14.272c-.007.005-.007.005 0 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M54 62a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 88c26.51 0 48-19.7 48-44S74.51 0 48 0 0 19.7 0 44c0 12.22 5.435 23.278 14.21 31.25 1.108 1.007 1.79 2.414 1.79 3.912v10.87c0 3.688 3.854 6.106 7.174 4.503l13.846-6.687a5.27 5.27 0 0 1 3.085-.44c2.569.39 5.206.592 7.895.592Zm36-44c0 16.712-15.114 32-36 32a40.63 40.63 0 0 1-6.095-.457c-3.246-.492-6.794-.099-10.103 1.5l-3.804 1.836c-.084-5.078-2.413-9.507-5.718-12.51C15.769 60.453 12 52.53 12 44c0-16.712 15.113-32 36-32 20.886 0 36 15.288 36 32Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),zn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M42.951 33.266C42.486 33.672 42 34.396 42 36a6 6 0 0 1-12 0c0-4.395 1.514-8.673 5.049-11.765C38.479 21.233 43.066 20 48 20c4.934 0 9.521 1.233 12.951 4.235C64.486 27.326 66 31.605 66 36c0 4.089-1.055 7.432-3.112 10.117-1.913 2.498-4.359 3.937-5.865 4.816-1.831 1.068-2.369 1.391-2.74 1.793a.13.13 0 0 1-.009.009C54.22 52.783 54 52.976 54 54a6 6 0 0 1-12 0c0-3.9 1.247-7.009 3.466-9.413 1.688-1.829 3.846-3.065 5.115-3.792.144-.082.277-.158.396-.228 1.494-.871 2.048-1.306 2.385-1.747.193-.252.638-.909.638-2.82 0-1.605-.486-2.327-.951-2.734C52.479 32.766 51.066 32 48 32c-3.066 0-4.479.767-5.049 1.266ZM48 76a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Zm0-12c19.882 0 36-16.118 36-36S67.882 12 48 12 12 28.118 12 48s16.118 36 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Nn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"m88.243 43.757-34-34a6 6 0 1 0-8.486 8.486L69.516 42H12a6 6 0 1 0 0 12h57.515L45.757 77.757a6 6 0 0 0 8.486 8.486l33.985-33.986.015-.014a6 6 0 0 0 0-8.486Z"})),In=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M70.243 43.757a6 6 0 0 1 0 8.486l-30 30a6 6 0 1 1-8.486-8.486L57.515 48 31.757 22.243a6 6 0 1 1 8.486-8.486l30 30Z",clipRule:"evenodd"})),_n=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M26.22 35.09C26.22 15.93 41.752.4 60.91.4c3.183 0 6.275.43 9.216 1.24 7.392 2.032 7.938 10.632 3.718 14.853L61.8 28.536v5.663h5.663l12.043-12.042c4.22-4.221 12.82-3.675 14.854 3.716a34.723 34.723 0 0 1 1.24 9.217c0 19.159-15.531 34.69-34.69 34.69-2.969 0-5.857-.375-8.618-1.08L30.568 90.423c-6.902 6.901-18.09 6.901-24.992 0-6.901-6.901-6.901-18.09 0-24.992l21.725-21.724a34.745 34.745 0 0 1-1.08-8.618Zm27.925 31.756a.09.09 0 0 0 .003-.003L51.005 63.7l3.143 3.143-.003.003ZM60.91 12.4c-12.531 0-22.69 10.159-22.69 22.69 0 2.611.439 5.107 1.242 7.426 1 2.891.109 5.892-1.82 7.82l-23.58 23.582a5.672 5.672 0 0 0 8.02 8.02l23.581-23.58c1.929-1.929 4.93-2.82 7.821-1.82a22.65 22.65 0 0 0 7.426 1.242c12.531 0 22.69-10.159 22.69-22.69v-.056l-8.47 8.47a9.2 9.2 0 0 1-6.506 2.695H59a9.2 9.2 0 0 1-9.2-9.2v-9.623a9.2 9.2 0 0 1 2.695-6.505l8.47-8.47-.056-.001Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Wn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M36.16 1.797c3.055 1.83 5.04 5.222 5.04 9.049v16.875l6.8 4.387 6.8-4.387V10.846c0-3.827 1.985-7.218 5.04-9.049 3.184-1.907 7.414-2 10.877.587C79.982 9.302 86 20.373 86 32.848c0 15.437-9.204 28.712-22.4 34.659V89.6a6 6 0 0 1-12 0V66.907c0-4.841 3.139-8.606 6.876-10.254C67.63 52.617 74 43.47 74 32.848a25.9 25.9 0 0 0-7.2-17.96v13.487a10.8 10.8 0 0 1-4.945 9.075l-8 5.161a10.8 10.8 0 0 1-11.71 0l-8-5.16a10.8 10.8 0 0 1-4.945-9.076V14.887A25.9 25.9 0 0 0 22 32.848c0 10.19 5.86 19.021 14.422 23.288 3.504 1.746 6.378 5.407 6.378 10.028V89.6a6 6 0 0 1-12 0V66.74C18.469 60.472 10 47.654 10 32.848c0-12.475 6.018-23.546 15.283-30.464C28.746-.202 32.976-.11 36.16 1.797Z",clipRule:"evenodd"})),Un=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M54 6a6 6 0 0 0-12 0v8a6 6 0 0 0 12 0V6Zm0 76a6 6 0 0 0-12 0v8a6 6 0 0 0 12 0v-8Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M28 48c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20Zm20-8a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M81.941 14.059a6 6 0 0 1 0 8.485l-5.657 5.657a6 6 0 1 1-8.485-8.485l5.657-5.657a6 6 0 0 1 8.485 0Zm-53.74 53.74a6 6 0 0 1 0 8.485l-5.657 5.657a6 6 0 1 1-8.485-8.485l5.657-5.657a6 6 0 0 1 8.485 0ZM90 54a6 6 0 0 0 0-12h-8a6 6 0 0 0 0 12h8Zm-76 0a6 6 0 0 0 0-12H6a6 6 0 0 0 0 12h8Zm67.941 27.941a6 6 0 0 1-8.485 0l-5.657-5.657a6 6 0 1 1 8.485-8.485l5.657 5.657a6 6 0 0 1 0 8.485Zm-53.74-53.74a6 6 0 0 1-8.485 0l-5.657-5.657a6 6 0 1 1 8.485-8.485l5.657 5.657a6 6 0 0 1 0 8.485Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),yt=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"m43.757 7.757-34 34a6 6 0 0 0 8.486 8.486L42 26.485V84a6 6 0 0 0 12 0V26.485l23.757 23.758a6 6 0 0 0 8.486-8.486L52.257 7.772l-.014-.015a6 6 0 0 0-8.486 0Z"})),Yn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M43.757 25.757a6 6 0 0 1 8.486 0l30 30a6 6 0 1 1-8.486 8.486L48 38.485 22.243 64.243a6 6 0 1 1-8.486-8.486l30-30Z",clipRule:"evenodd"})),qn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M54 68V42.485l6.757 6.758a6 6 0 1 0 8.486-8.486l-17-17a6.002 6.002 0 0 0-8.491.006L26.757 40.757a6 6 0 1 0 8.486 8.486L42 42.485V68a6 6 0 0 0 12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M96 48c0 26.51-21.49 48-48 48S0 74.51 0 48 21.49 0 48 0s48 21.49 48 48Zm-12 0c0 19.882-16.118 36-36 36S12 67.882 12 48s16.118-36 36-36 36 16.118 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Et=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M24 12a6 6 0 0 0 0 12h39.515L13.757 73.757a6 6 0 1 0 8.486 8.486L72 32.485V72a6 6 0 0 0 12 0V19c0-.175-.006-.349-.02-.52a5.986 5.986 0 0 0-1.737-4.723 5.987 5.987 0 0 0-4.722-1.738A7.065 7.065 0 0 0 77 12H24Z"})),Xn=({title:e,titleId:r,...n})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...n},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M18 8C8.059 8 0 16.059 0 26v44c0 9.941 8.059 18 18 18h60c9.941 0 18-8.059 18-18V26c0-9.941-8.059-18-18-18H18Zm66 24v-6a6 6 0 0 0-6-6H18a6 6 0 0 0-6 6v44a6 6 0 0 0 6 6h60a6 6 0 0 0 6-6v-6h-8c-8.837 0-16-7.163-16-16s7.163-16 16-16h8Zm0 20h-8a4 4 0 0 1 0-8h8v8Z",clipRule:"evenodd"})),Xl=u.default.div(()=>o.css`
    position: relative;
  `),Kl=u.default.div(({theme:e,$disabled:r,$size:n})=>o.css`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: ${e.fontWeights.extraBold};

    color: ${e.colors.accent};

    ${r&&o.css`
      color: ${e.colors.greyLight};
    `}

    #countdown-complete-check {
      stroke-width: ${e.borderWidths["1.5"]};
      overflow: visible;
      display: block;
    }

    ${()=>{switch(n){case"small":return o.css`
            height: ${e.space[16]};
            width: ${e.space[16]};
          `;case"large":return o.css`
            font-size: ${e.fontSizes.extraLarge};
            line-height: ${e.lineHeights.extraLarge};
            margin-top: -${e.space["0.5"]};
            height: ${e.space[24]};
            width: ${e.space[24]};
          `;default:return""}}}
  `),Ql=u.default.div(({theme:e,$disabled:r,$size:n,$color:a})=>o.css`
    stroke: ${e.colors.accent};

    color: ${e.colors[a]};

    ${r&&o.css`
      color: ${e.colors.greyLight};
    `}

    ${()=>{switch(n){case"small":return o.css`
            height: ${e.space[16]};
            width: ${e.space[16]};
            stroke-width: ${e.space[1]};
          `;case"large":return o.css`
            height: ${e.space[24]};
            width: ${e.space[24]};
            stroke-width: ${e.space[1]};
          `;default:return""}}}
  `),Jl=u.default.circle(({$finished:e})=>o.css`
    transition: all 1s linear, stroke-width 0.2s ease-in-out 1s;

    ${e&&o.css`
      stroke-width: 0;
    `}
  `),xt=t.forwardRef(({accessibilityLabel:e,color:r="textSecondary",size:n="small",countdownSeconds:a,startTimestamp:l,disabled:i,callback:c,...d},s)=>{const f=t.useMemo(()=>Math.ceil((l||Date.now())/1e3),[l]),$=t.useMemo(()=>f+a,[f,a]),p=t.useCallback(()=>Math.max($-Math.ceil(Date.now()/1e3),0),[$]),[g,w]=t.useState(a);return t.useEffect(()=>{if(!i){w(p());const E=setInterval(()=>{const x=p();x===0&&(clearInterval(E),c&&c()),w(x)},1e3);return()=>clearInterval(E)}},[p,c,a,i]),t.createElement(Xl,{...d,"data-testid":re(d,"countdown-circle")},t.createElement(Kl,{$size:n,$disabled:i},i&&a,!i&&(g>0?g:t.createElement(Ze,{"data-testid":"countdown-complete-check",id:"countdown-complete-check"}))),t.createElement(Ql,{$color:r,$disabled:i,$size:n,ref:s},e&&t.createElement(fe,null,e),t.createElement("svg",{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},t.createElement(Jl,{$finished:g===0,cx:"12",cy:"12",fill:"none",r:"9",strokeDasharray:`${48*(g/a)}, 56`,strokeLinecap:"round"}),t.createElement("circle",{cx:"12",cy:"12",fill:"none",opacity:i?"1":"0.25",r:"9",strokeLinecap:"round"}))))});xt.displayName="CountdownCircle";const sr={small:{width:"26",height:"10"},medium:{width:"32",height:"12"}},le={small:{width:"12",height:"8",translateX:"6"},medium:{width:"15",height:"10",translateX:"7.5"}},ei=u.default.div(({theme:e,$size:r})=>o.css`
    position: relative;
    width: fit-content;

    label {
      position: absolute;
      left: 50%;
      top: 50%;
      width: ${e.space[le[r].width]};
      height: ${e.space[le[r].height]};
      font-size: ${e.fontSizes.small};
      font-weight: ${e.fontWeights.bold};
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.1s linear;
      cursor: pointer;
    }

    label#eth {
      color: ${e.colors.textAccent};
      transform: translate(-50%, -50%)
        translateX(-${e.space[le[r].translateX]});
    }

    label#fiat {
      color: ${e.colors.greyPrimary};
      transform: translate(-50%, -50%)
        translateX(${e.space[le[r].translateX]});
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
  `),ti=u.default.input(({theme:e,$size:r="medium"})=>o.css`
    position: relative;
    background-color: ${e.colors.greySurface};
    height: ${e.space[sr[r].height]};
    width: ${e.space[sr[r].width]};
    border-radius: ${e.radii.large};

    display: flex;
    align-items: center;
    justify-content: center;

    &::after {
      content: '';
      display: block;
      position: absolute;
      background-color: ${e.colors.bluePrimary};
      width: ${e.space[le[r].width]};
      height: ${e.space[le[r].height]};
      border-radius: ${e.space["1.5"]};
      transform: translateX(-${e.space[le[r].translateX]});
      transition: transform 0.3s ease-in-out, background-color 0.1s ease-in-out;
    }

    &:checked::after {
      transform: translateX(${e.space[le[r].translateX]});
    }

    &:disabled::after {
      background-color: ${e.colors.greyPrimary};
    }
  `),Ct=t.forwardRef(({size:e="medium",disabled:r,...n},a)=>{const l=ut();return t.createElement(ei,{$size:e},t.createElement(ti,{disabled:r,id:l,ref:a,type:"checkbox",...n,$size:e}),t.createElement("label",{htmlFor:l,id:"eth"},"ETH"),t.createElement("label",{htmlFor:l,id:"fiat"},"USD"))});Ct.displayName="CurrencyToggle";const ri=u.default.div(()=>o.css`
    max-width: max-content;
    position: relative;
  `),ni=u.default.div(({theme:e,$opened:r,$inner:n,$shortThrow:a,$align:l,$labelAlign:i,$direction:c})=>o.css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: ${e.space[1]};
    position: absolute;

    ${c==="up"&&o.css`
      bottom: 100%;
    `}

    ${i&&o.css`
      & > button {
        justify-content: ${i};
      }
    `}

    ${r?o.css`
          visibility: visible;
          opacity: 1;
        `:o.css`
          z-index: 1;
          visibility: hidden;
          opacity: 0;
        `}

    padding: ${e.space["1.5"]};
    background-color: ${e.colors.background};
    border-radius: ${e.radii["2xLarge"]};

    ${n?o.css`
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
    `:o.css`
          border: 1px solid ${e.colors.border};
        `}

    ${()=>r?o.css`
          transition: all 0.35s cubic-bezier(1, 0, 0.22, 1.6), width 0s linear,
            z-index 0s linear 0.35s;
        `:o.css`
        transition: all 0.35s cubic-bezier(1, 0, 0.22, 1.6), width 0s linear,
          z-index 0s linear 0s;
      `}

    ${()=>{if(!r&&!a)return o.css`
          margin-${c==="down"?"top":"bottom"}: calc(-1 * ${e.space[12]});
        `;if(!r&&a)return o.css`
          margin-${c==="down"?"top":"bottom"}: calc(-1 * ${e.space["2.5"]});
        `;if(r&&!n)return o.css`
          z-index: 20;
          margin-${c==="down"?"top":"bottom"}: ${e.space["1.5"]};
        `}}

  ${l==="left"?o.css`
          left: 0;
        `:o.css`
          right: 0;
        `}
  `),dr=u.default.button(({theme:e,$inner:r,$hasColor:n,$color:a,disabled:l})=>o.css`
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
    ${l&&o.css`
      color: ${e.colors.textTertiary};
      cursor: not-allowed;
    `}

    ${()=>{if(r)return o.css`
          justify-content: center;

          &:hover {
            color: ${e.colors.accent};
          }
        `;if(!r)return o.css`
          justify-content: flex-start;

          &:hover {
            background: ${e.colors.greySurface};
          }
        `}}

    ${()=>{if(r&&!n)return o.css`
          color: ${e.colors.greyPrimary};
        `}}
  `),oi=({setIsOpen:e,item:r})=>{const n=t.useRef(null),a=t.cloneElement(r,{...r.props,ref:n}),l=t.useCallback(()=>{e(!1)},[e]);return t.useEffect(()=>{const i=n.current;return i==null||i.addEventListener("click",l),()=>{i==null||i.removeEventListener("click",l)}},[l,r]),a},ai=({items:e,setIsOpen:r,isOpen:n,width:a,inner:l,align:i,shortThrow:c,keepMenuOnTop:d,labelAlign:s,direction:f})=>t.createElement(ni,{$opened:n,$inner:l,$align:i,$shortThrow:c,$labelAlign:s,$direction:f,style:{width:l||a&&parseInt(a)>100?`${a}px`:"150px",zIndex:d?100:void 0}},e.map($=>{if(t.isValidElement($))return oi({item:$,setIsOpen:r});const{color:p,value:g,icon:w,label:E,onClick:x,disabled:k,as:L,wrapper:v}=$,y={$inner:l,$hasColor:!!p,$color:p,disabled:k,onClick:()=>{r(!1),x==null||x(g)},as:L,children:t.createElement(t.Fragment,null,w,E)};return v?v(t.createElement(dr,{...y,type:"button"}),g||E):t.createElement(dr,{...y,key:g||E,type:"button"})})),li=u.default.button(({theme:e,$size:r,$open:n,$direction:a})=>o.css`
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

    ${()=>{switch(r){case"small":return o.css`
            padding: ${e.space["0.5"]} ${e.space["0.25"]};
          `;case"medium":return o.css`
            padding: ${e.space["2.5"]} ${e.space["3.5"]};
          `;default:return""}}}

    ${()=>{if(n)return o.css`
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
        `;if(!n)return o.css`
          color: ${e.colors.textSecondary};
          border-radius: ${e.radii.almostExtraLarge};
          transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6),
            0.15s color ease-in-out, 0s border-width 0.15s,
            0.15s border-color ease-in-out, 0s padding linear;

          &:hover {
            border-color: ${e.colors.border};
          }
        `}}
  `),ur=u.default(e=>t.createElement(Ue,{...e}))(({theme:e,$open:r,$direction:n})=>o.css`
    margin-left: ${e.space[1]};
    width: ${e.space[3]};
    margin-right: ${e.space["0.5"]};
    transition-duration: ${e.transitionDuration[200]};
    transition-property: all;
    transition-timing-function: ${e.transitionTimingFunction.inOut};
    transform: rotate(${n==="down"?"0deg":"180deg"});
    display: flex;

    & > svg {
      fill: currentColor;
    }
    fill: currentColor;

    ${r&&o.css`
      transform: rotate(${n==="down"?"180deg":"0deg"});
    `}
  `),ii=u.default.div(()=>o.css`
    z-index: 10;
    position: relative;
  `),Xe=({children:e,buttonProps:r,items:n=[],inner:a=!1,chevron:l=!0,align:i="left",menuLabelAlign:c,shortThrow:d=!1,keepMenuOnTop:s=!1,size:f="medium",label:$,direction:p="down",isOpen:g,setIsOpen:w,inheritContentWidth:E=!1,...x})=>{const k=t.useRef(),[L,v]=t.useState(!1),[y,m]=w?[g,w]:[L,v],b=h=>{k.current&&!k.current.contains(h.target)&&m(!1)};return t.useEffect(()=>(y?document.addEventListener("mousedown",b):document.removeEventListener("mousedown",b),()=>{document.removeEventListener("mousedown",b)}),[k,y]),t.createElement(ri,{ref:k,...x,"data-testid":re(x,"dropdown")},!e&&a&&t.createElement(li,{$direction:p,$open:y,$size:f,type:"button",onClick:()=>m(!y)},$,l&&t.createElement(ur,{$direction:p,$open:y})),!e&&!a&&t.createElement(ii,null,t.createElement(De,{...r,pressed:y,suffix:l&&t.createElement(ur,{$direction:p,$open:y}),onClick:()=>m(!y)},$)),t.Children.map(e,h=>t.isValidElement(h)?t.cloneElement(h,{...r,zindex:"10",pressed:y?"true":void 0,onClick:()=>m(!y)}):null),t.createElement(ai,{align:i,direction:p,inner:a,isOpen:y,items:n,keepMenuOnTop:s,labelAlign:c,setIsOpen:m,shortThrow:d,width:(a||E)&&k.current&&k.current.getBoundingClientRect().width.toFixed(2)}))};Xe.displayName="Dropdown";const ci=u.default.fieldset(({theme:e})=>o.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[4]};
  `),si=u.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[1]};
    padding: 0 ${e.space[4]};
  `),di=u.default.div(({theme:e})=>o.css`
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: ${e.space[3]};
  `),ui=u.default.div(({theme:e})=>o.css`
    color: ${e.colors.textSecondary};
    font-size: ${e.fontSizes.body};
    line-height: ${e.lineHeights.body};
  `),pi=u.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[4]};
  `),kt=({children:e,description:r,disabled:n,form:a,legend:l,name:i,status:c,...d})=>{let s,f;switch(c){case"complete":{s="Complete",f="green";break}case"required":case"pending":{s=c==="pending"?"Pending":"Required",f="accent";break}case"optional":{s="Optional",f="grey";break}}return typeof c=="object"&&(s=c.name,f=c.tone),t.createElement(ci,{...d,disabled:n,form:a,name:i},t.createElement(si,null,t.createElement(di,null,t.createElement(Ie,{as:"legend",level:"2",responsive:!0},l),f&&s&&t.createElement(We,{color:f},s)),t.createElement(ui,null,r)),t.createElement(pi,null,e))};kt.displayName="FieldSet";const fi=u.default.div(({theme:e,$type:r,$alignment:n})=>o.css`
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

    ${n==="horizontal"&&o.css`
      flex-direction: row;
      justify-content: flex-start;
      gap: ${e.space[4]};
      padding: ${e.space[4]};
      text-align: left;
    `}

    background-color: ${e.colors.blueSurface};
    border: ${e.borderWidths.px} solid ${e.colors.blue};

    ${r==="warning"&&o.css`
      background-color: ${e.colors.yellowSurface};
      border-color: ${e.colors.yellow};
    `}

    ${r==="error"&&o.css`
      background-color: ${e.colors.redSurface};
      border-color: ${e.colors.red};
    `}
  `),gi=u.default.div(({theme:e,$type:r})=>o.css`
    width: ${e.space[6]};
    height: ${e.space[6]};

    color: ${e.colors.blue};

    ${r==="warning"&&o.css`
      color: ${e.colors.yellow};
    `}
    ${r==="error"&&o.css`
      color: ${e.colors.red};
    `}
  `),St=({type:e="info",alignment:r="vertical",children:n,...a})=>{const l=e==="info"?vt:Me;return t.createElement(fi,{$alignment:r,$type:e,...a},t.createElement(gi,{$type:e,as:l}),n)};St.displayName="Helper";const mi=(e,r)=>{var i,c;const n=(i=Object.getOwnPropertyDescriptor(e,"value"))==null?void 0:i.set,a=Object.getPrototypeOf(e),l=(c=Object.getOwnPropertyDescriptor(a,"value"))==null?void 0:c.set;if(l&&n!==l)l.call(e,r);else if(n)n.call(e,r);else throw new Error("The given element does not have a value setter")},de={small:{outerPadding:"3.5",gap:"2",icon:"3",iconPadding:"8.5",height:"10"},medium:{outerPadding:"4",gap:"2",icon:"4",iconPadding:"10",height:"12"},large:{outerPadding:"4",gap:"2",icon:"5",iconPadding:"11",height:"16"},extraLarge:{outerPadding:"6",gap:"2",icon:"6",iconPadding:"14",height:"20"}},K=(e,r,n)=>e.space[de[r][n]],ot=(e,r,n,a)=>n?a?`calc(-${e.space[de[r].outerPadding]} - ${e.space[n]} - ${e.space[de[r].gap]})`:`calc(${e.space[de[r].outerPadding]} + ${e.space[n]} + ${e.space[de[r].gap]})`:a?`-${e.space[de[r].iconPadding]}`:e.space[de[r].iconPadding],bi={small:"large",medium:"large",large:"2.5xLarge",extraLarge:"2.5xLarge"},$i=(e,r)=>e.radii[bi[r]],hi={small:"small",medium:"body",large:"large",extraLarge:"headingThree"},He=e=>hi[e],wi=u.default.div(({theme:e,$size:r,$hasError:n,$userStyles:a,$validated:l,$showDot:i})=>o.css`
    position: relative;
    height: ${K(e,r,"height")};
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

    ${i&&l&&o.css`
      :after {
        background: ${e.colors.greenPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${i&&!n&&o.css`
      &:focus-within:after {
        background: ${e.colors.bluePrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${n&&i&&o.css`
      :after {
        background: ${e.colors.redPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

  ${a}
  `),Kn=u.default.label(({theme:e,$size:r})=>o.css`
    display: flex;
    align-items: center;
    gap: ${e.space[2]};

    height: ${e.space.full};
    color: ${e.colors.greyPrimary};
    background: ${e.colors.greySurface};
    font-size: ${Pe(He(r))};
    line-height: ${Le(He(r))};
    font-weight: ${e.fontWeights.normal};
    padding: 0 ${K(e,r,"outerPadding")};

    svg {
      display: block;
      color: ${e.colors.greyPrimary};
    }
  `),vi=u.default(Kn)(()=>o.css`
    order: -2;
  `),yi=u.default.div(({theme:e,$size:r,$iconWidth:n})=>o.css`
    order: -1;
    padding-left: ${K(e,r,"outerPadding")};
    flex: 0 0 ${ot(e,r,n)};
    margin-right: ${ot(e,r,n,!0)};
    display: flex;
    align-items: center;
    justify-content: flex-start;
    pointer-events: none;
    svg {
      display: block;
      width: ${n?e.space[n]:K(e,r,"icon")};
      height: ${n?e.space[n]:K(e,r,"icon")};
      color: ${e.colors.greyPrimary};
    }
    z-index: 1;
  `),Ei=u.default.button(({theme:e,$size:r})=>o.css`
    padding-right: ${K(e,r,"outerPadding")};
    margin-left: -${K(e,r,"iconPadding")};
    flex: 0 0 ${K(e,r,"iconPadding")};
    display: flex;
    justify-content: flex-end;
    align-items: center;
    transition: all 0.1s ease-in-out;
    transform: scale(1);
    opacity: 1;
    cursor: pointer;

    svg {
      display: block;
      width: ${K(e,r,"icon")};
      height: ${K(e,r,"icon")};
      color: ${e.colors.greyPrimary};
      transition: all 150ms ease-in-out;
    }

    &:hover svg {
      color: ${e.colors.greyBright};
      transform: translateY(-1px);
    }
  `),xi=u.default.input(({theme:e,$size:r,$hasIcon:n,$hasAction:a,$hasError:l,$iconWidth:i})=>o.css`
    background-color: transparent;
    position: relative;
    width: ${e.space.full};
    height: ${e.space.full};
    font-weight: ${e.fontWeights.normal};
    text-overflow: ellipsis;
    color: ${e.colors.textPrimary};
    padding: 0 ${K(e,r,"outerPadding")};
    font-size: ${Pe(He(r))};
    line-height: ${Le(He(r))};

    ${n&&o.css`
      padding-left: ${ot(e,r,i)};
    `}

    ${a&&o.css`
      padding-right: ${K(e,r,"iconPadding")};
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

    ${l&&o.css`
      color: ${e.colors.redPrimary};
    `}
  `),Ci=u.default.div(({theme:e,$size:r,$hasError:n,$disabled:a,$readOnly:l,$alwaysShowAction:i})=>o.css`
    position: relative;
    background-color: ${e.colors.backgroundPrimary};
    border-radius: ${$i(e,r)};
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

    ${a&&o.css`
      border-color: ${e.colors.border};
      background-color: ${e.colors.greyLight};
    `}

    ${n&&o.css`
      border-color: ${e.colors.redPrimary};
      cursor: default;
    `}

    ${!n&&!l&&o.css`
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

    ${!i&&o.css`
      input:placeholder-shown ~ button {
        opacity: 0;
        transform: scale(0.8);
        pointer-events: none;
      }
    `}
  `),Rt=t.forwardRef(({autoFocus:e,autoComplete:r="off",autoCorrect:n,defaultValue:a,description:l,disabled:i,error:c,validated:d,showDot:s,hideLabel:f,id:$,inputMode:p,icon:g,iconWidth:w,actionIcon:E,alwaysShowAction:x=!1,label:k,labelSecondary:L,name:v="clear-button",placeholder:y,prefix:m,prefixAs:b,readOnly:h,required:V,spellCheck:R,suffix:M,suffixAs:P,clearable:O=!1,tabIndex:W,type:U="text",units:F,value:Q,width:Z,onBlur:T,onChange:B,onFocus:xe,onClickAction:ee,size:z="medium",parentStyles:Y,...J},D)=>{const ne=t.useRef(null),q=D||ne,oe=y?`${y!=null?y:""}${F?` ${F}`:""}`:void 0,ie=c?!0:void 0,ge=U==="email"?"text":U,me=O||!!ee,ce=j=>{var N;if(j.preventDefault(),j.stopPropagation(),ee)return ee(),(N=q.current)==null?void 0:N.focus();q.current&&(mi(q.current,""),q.current.dispatchEvent(new Event("input",{bubbles:!0})),q.current.focus())};return t.createElement(te,{description:l,disabled:i,error:c,hideLabel:f,id:$,label:k,labelSecondary:L,readOnly:h,required:V,width:Z},j=>t.createElement(wi,{$disabled:i,$hasError:ie,$validated:d,$showDot:s,$suffix:M!==void 0,$size:z,$userStyles:Y,$ids:j},t.createElement(Ci,{$alwaysShowAction:x,$disabled:!!i,$hasError:!!c,$readOnly:!!h,$size:z},t.createElement(xi,{ref:q,...J,...j==null?void 0:j.content,"aria-invalid":ie,$hasAction:me,$hasError:!!c,$hasIcon:!!g,$iconWidth:w,$size:z,autoComplete:r,autoCorrect:n,autoFocus:e,defaultValue:a,disabled:i,inputMode:p,name:v,placeholder:oe,readOnly:h,spellCheck:R,tabIndex:W,type:ge,value:Q,onBlur:T,onChange:B,onFocus:xe}),m&&t.createElement(vi,{"aria-hidden":"true",as:b,...j==null?void 0:j.label,$size:z},m),g&&t.createElement(yi,{$iconWidth:w,$size:z},g),me&&t.createElement(Ei,{$size:z,"data-testid":"input-action-button",onClick:ce,onMouseDown:N=>N.preventDefault()},E||t.createElement(ye,null)),M&&t.createElement(Kn,{$size:z,"aria-hidden":"true",...j==null?void 0:j.label,...P?{as:P}:{}},M))))});Rt.displayName="Input";const ki=u.default.div(({theme:e,$state:r})=>o.css`
    width: 95%;

    position: fixed;
    left: 2.5%;
    z-index: 9999;
    bottom: ${e.space[4]};

    display: flex;
    flex-direction: row;

    ${_.sm.min(o.css`
      width: min-content;

      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      bottom: initial;
    `)}

    transition: ${e.transitionDuration[300]} all
      ${e.transitionTimingFunction.popIn};

    ${r==="entered"?o.css`
          opacity: 1;
          transform: translateY(0px);
        `:o.css`
          opacity: 0;
          transform: translateY(128px);
        `}
  `),Te=({children:e,backdropSurface:r,onDismiss:n,open:a,...l})=>t.createElement(Ve,{open:a,surface:r,onDismiss:n},({state:i})=>t.createElement(ki,{$state:i,...l},e));Te.displayName="Modal";const Si=u.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${e.space[2]};
    flex-gap: ${e.space[2]};
  `),Ri=u.default.button(({theme:e,$selected:r,$size:n})=>o.css`
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

    ${r?o.css`
          cursor: default;
          pointer-events: none;
          color: ${e.colors.accent};
        `:o.css`
          color: ${e.colors.greyPrimary};
          &:hover {
            background-color: ${e.colors.greySurface};
          }
        `}

    ${n==="small"&&o.css`
      font-size: ${e.fontSizes.small};
      line-height: ${e.lineHeights.small};
      border-radius: ${e.space[2]};
      min-width: ${e.space[9]};
      height: ${e.space[9]};
    `}
  `),Pi=u.default.p(({theme:e})=>o.css`
    font-size: ${e.fontSizes.small};
    font-weight: ${e.fontWeights.bold};
    color: ${e.colors.greyPrimary};
  `),Qn=({total:e,current:r,max:n=5,size:a="medium",alwaysShowFirst:l,alwaysShowLast:i,showEllipsis:c=!0,onChange:d,...s})=>{const f=Math.floor(n/2),$=Math.max(Math.min(Math.max(r-f,1),e-n+1),1),p=Array.from({length:n},(g,w)=>$+w).filter(g=>g<=e);return e>n&&(l&&$>1?c?(p[0]=-1,p.unshift(1)):p[0]=1:c&&$>1&&p.unshift(-1),i&&e>r+f?c?(p[p.length-1]=-1,p.push(e)):p[p.length-1]=e:c&&e>r+f&&p.push(-1)),t.createElement(Si,{...s,"data-testid":re(s,"pagebuttons")},p.map((g,w)=>g===-1?t.createElement(Pi,{"data-testid":"pagebutton-dots",key:`${g}-${w}`},"..."):t.createElement(Ri,{$selected:g===r,$size:a,"data-testid":"pagebutton",key:g,type:"button",onClick:()=>d(g)},g)))},pr=u.default.div(({theme:e,$size:r,$hasDropdown:n,$open:a})=>o.css`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    gap: ${e.space[2]};
    border: 1px solid ${e.colors.border};
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

    ${n&&o.css`
      cursor: pointer;
      &:hover {
        transform: translateY(-1px);
        filter: brightness(1.05);
      }
    `}

    ${a&&o.css`
      background-color: ${e.colors.border};
    `}

    ${r==="small"&&o.css`
      height: ${e.space[10]};
      width: ${e.space[10]};
      padding: 0;
      border: none;
    `}

    ${r==="medium"&&o.css`
      height: ${e.space[12]};
      width: ${e.space[45]};
      padding-right: ${e.space[4]};
    `}

    ${r==="large"&&o.css`
      height: ${e.space[14]};
      max-width: ${e.space[80]};
      padding-right: ${e.space[5]};
    `}
  `),Li=u.default.div(({theme:e,$size:r})=>o.css`
    width: ${e.space[10]};
    flex: 0 0 ${e.space[10]};
    ${r==="large"&&o.css`
      width: ${e.space[12]};
      flex: 0 0 ${e.space[12]};
    `}
  `),Vi=u.default.div(({theme:e,$size:r})=>o.css`
    display: ${r==="small"?"none":"block"};
    min-width: ${e.space.none};
    > div:first-child {
      margin-bottom: -${e.space["0.5"]};
    }
  `),fr=u.default(A)(()=>o.css`
    line-height: initial;
  `),gr=({size:e,avatar:r,address:n,ensName:a})=>t.createElement(t.Fragment,null,t.createElement(Li,{$size:e},t.createElement(je,{label:"profile-avatar",...typeof r=="string"?{src:r}:r||{}})),t.createElement(Vi,{$size:e},t.createElement(fr,{color:a?"text":"grey","data-testid":"profile-title",ellipsis:!0,fontVariant:e==="large"?"headingFour":"bodyBold",forwardedAs:"h3"},a||"No name set"),t.createElement(fr,{color:a?"grey":"text","data-testid":"profile-address",fontVariant:"small",forwardedAs:"h4"},Nl(n,e==="large"?30:10,e==="large"?10:5,e==="large"?10:5)))),Pt=({size:e="medium",avatar:r,dropdownItems:n,address:a,ensName:l,alignDropdown:i="right",...c})=>{const[d,s]=t.useState(!1);return n?t.createElement(Xe,{items:n,isOpen:d,setIsOpen:s,align:i,inheritContentWidth:!0},t.createElement(pr,{...c,$hasDropdown:!0,$open:d,$size:e,onClick:()=>s(!d)},t.createElement(gr,{size:e,avatar:r,address:a,ensName:l}))):t.createElement(pr,{...c,"data-testid":re(c,"profile"),$open:d,$size:e},t.createElement(gr,{size:e,avatar:r,address:a,ensName:l}))};Pt.displayName="Profile";const Mi=u.default.input(({theme:e,$colorStyle:r})=>o.css`
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
      background: ${H(r,"background")};
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
      background: ${H(r,"hover")};
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
  `),Lt=t.forwardRef(({description:e,disabled:r,error:n,inline:a=!0,hideLabel:l,id:i,label:c,labelSecondary:d,name:s,required:f,tabIndex:$,value:p,checked:g,width:w,colorStyle:E="accentPrimary",onBlur:x,onChange:k,onFocus:L,...v},y)=>{const m=t.useRef(null),b=y||m;return t.createElement(te,{description:e,error:n,hideLabel:l,id:i,inline:a,label:c,labelSecondary:d,required:f,width:w,disabled:r},t.createElement(Mi,{$colorStyle:E,...v,"aria-invalid":n?!0:void 0,"aria-selected":g?!0:void 0,"data-testid":re(v,"radio"),type:"radio",role:"radio",checked:g,disabled:r,name:s,ref:b,tabIndex:$,value:p,onBlur:x,onChange:k,onFocus:L}))});Lt.displayName="RadioButton";const Jn=e=>{let r=!1,n=!1;const a=()=>{r=!0,e.preventDefault()},l=()=>{n=!0,e.stopPropagation()};return{nativeEvent:e,currentTarget:e.currentTarget,target:e.target,bubbles:e.bubbles,cancelable:e.cancelable,defaultPrevented:e.defaultPrevented,eventPhase:e.eventPhase,isTrusted:e.isTrusted,preventDefault:a,isDefaultPrevented:()=>r,stopPropagation:l,isPropagationStopped:()=>n,persist:()=>{},timeStamp:e.timeStamp,type:e.type}},Zi=u.default.div(({theme:e,$inline:r})=>o.css`
    display: flex;
    flex-direction: ${r?"row":"column"};
    gap: ${e.space[2]};
    justify-content: flex-start;
    flex-wrap: ${r?"wrap":"nowrap"};
  `),Vt=t.forwardRef(({value:e,children:r,inline:n=!1,onChange:a,onBlur:l,...i},c)=>{const d=t.useRef(null),s=c||d,f=t.useRef(null),[$,p]=t.useState(!1),[g,w]=t.useState(e);t.useEffect(()=>{e&&e!=g&&w(e)},[e]);const E=v=>{w(v.target.value),a&&a(v)},x=()=>{f.current&&f.current.focus()},k=v=>{l&&l(v)},L=(v,y="radiogroup")=>{if(a&&v){const m=document.createElement("input");m.value=v,m.name=y;const b=new Event("change",{bubbles:!0});Object.defineProperty(b,"target",{writable:!1,value:m});const h=Jn(b);a(h)}};return t.createElement(Zi,{$inline:n,...i,"data-testid":re(i,"radiogroup"),ref:s,role:"radiogroup",onFocus:x},t.Children.map(r,v=>{v.props.checked&&!$&&(p(!0),g!==v.props.value&&(w(v.props.value),p(!0),L(v.props.value,v.props.name)));const y=v.props.value===g;return t.cloneElement(v,{ref:y?f:void 0,checked:y,onChange:E,onBlur:k})}))});Vt.displayName="RadioButtonGroup";function Ti(e,r){for(var n=-1,a=e==null?0:e.length,l=Array(a);++n<a;)l[n]=r(e[n],n,e);return l}var Gi=Ti,Bi=Array.isArray,Oi=Bi,mr=dt,Ai=Gi,Hi=Oi,ji=jr,Fi=1/0,br=mr?mr.prototype:void 0,$r=br?br.toString:void 0;function eo(e){if(typeof e=="string")return e;if(Hi(e))return Ai(e,eo)+"";if(ji(e))return $r?$r.call(e):"";var r=e+"";return r=="0"&&1/e==-Fi?"-0":r}var Di=eo,zi=Di;function Ni(e){return e==null?"":zi(e)}var Ii=Ni,_i=Ii,Wi=0;function Ui(e){var r=++Wi;return _i(e)+r}var Yi=Ui;const rt="CREATE_OPTION_VALUE",qi=u.default.div(({theme:e,$size:r,$showDot:n,$hasError:a,$validated:l,$open:i,$disabled:c,$readOnly:d})=>o.css`
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

    ${r==="small"&&o.css`
      font-size: ${e.fontSizes.small};
      line-height: ${e.lineHeights.small};
      height: ${e.space[10]};
    `}

    ${n&&!c&&l&&!i&&o.css`
      :after {
        background: ${e.colors.greenPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${n&&!c&&!a&&i&&o.css`
      :after {
        background: ${e.colors.bluePrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${a&&!c&&n&&o.css`
      :after {
        background: ${e.colors.redPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${d&&o.css`
      cursor: default;
      pointer-events: none;
    `}
  `),Xi=u.default.div(({theme:e,$open:r,$hasError:n,$disabled:a,$size:l,$ids:i})=>o.css`
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

    ${r&&o.css`
      border-color: ${e.colors.bluePrimary};
    `}

    ${n&&o.css`
      border-color: ${e.colors.redPrimary};
      label {
        color: ${e.colors.redPrimary};
      }
    `}

    ${l==="small"&&o.css`
      padding-left: ${e.space["3.5"]};
    `}

    ${a&&o.css`
      background: ${e.colors.greyLight};
      color: ${e.colors.greyPrimary};
      cursor: not-allowed;
    `}

    input#${i==null?void 0:i.content.id} ~ button#chevron svg {
      color: ${e.colors.textPrimary};
    }

    input#${i==null?void 0:i.content.id}:placeholder-shown ~ button#chevron {
      svg {
        color: ${e.colors.greyPrimary};
      }
    }

    input#${i==null?void 0:i.content.id}:disabled ~ button#chevron {
      svg {
        color: ${e.colors.greyPrimary};
      }
    }

    input#${i==null?void 0:i.content.id}:disabled ~ * {
      color: ${e.colors.greyPrimary};
      background: ${e.colors.greyLight};
      cursor: not-allowed;
    }
  `),Ki=u.default.input(()=>o.css`
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    appearance: none;
    visibility: hidden;
  `),to=u.default.div(()=>o.css`
    flex: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  `),Qi=u.default(to)(({theme:e})=>o.css`
    color: ${e.colors.greyPrimary};
    pointer-events: none;
  `),Ji=u.default.input(({theme:e})=>o.css`
    flex: 1;
    background: transparent;
    padding-right: 0;
    height: 100%;
    color: ${e.colors.textPrimary};

    &::placeholder {
      color: ${e.colors.greyPrimary};
    }
  `),ro=u.default.button(({theme:e,$size:r})=>o.css`
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

    ${r==="small"&&o.css`
      padding-right: ${e.space["3.5"]};
    `}
  `),ec=u.default(ro)(({theme:e,$open:r,$direction:n})=>o.css`
    display: flex;
    cursor: pointer;

    svg {
      fill: currentColor;
      transform: ${n==="up"?"rotate(180deg)":"rotate(0deg)"};
      transition-duration: ${e.transitionDuration[200]};
      transition-property: all;
      transition-timing-function: ${e.transitionTimingFunction.inOut};
    }
    fill: currentColor;

    ${r&&o.css`
      svg {
        transform: ${n==="up"?"rotate(0deg)":"rotate(180deg)"};
      }
    `}
  `),tc=u.default.div(({theme:e,$state:r,$direction:n,$rows:a,$size:l,$align:i})=>o.css`
    display: ${r==="exited"?"none":"block"};
    position: absolute;
    visibility: hidden;
    opacity: 0;
    overflow: hidden;

    border: 1px solid ${e.colors.border};
    padding: ${e.space[2]};
    min-width: ${e.space.full};
    ${i==="right"?o.css`
          right: 0;
        `:o.css`
          left: 0;
        `}
    border-radius: ${e.radii["2xLarge"]};
    background: ${e.colors.background};
    transition: all 0.3s cubic-bezier(1, 0, 0.22, 1.6), z-index 0.3s linear;

    font-size: ${e.fontSizes.body};
    line-height: ${e.lineHeights.body};

    ${l==="small"&&o.css`
      font-size: ${e.fontSizes.small};
    `}

    ${r==="entered"?o.css`
          z-index: 20;
          visibility: visible;
          top: ${n==="up"?"auto":`calc(100% + ${e.space[2]})`};
          bottom: ${n==="up"?`calc(100% + ${e.space[2]})`:"auto"};
          opacity: 1;
        `:o.css`
          z-index: 1;
          visibility: hidden;
          top: ${n==="up"?"auto":`calc(100% - ${e.space[12]})`};
          bottom: ${n==="up"?`calc(100% - ${e.space[12]})`:"auto"};
          opacity: 0;
        `}

    ${a&&o.css`
      padding-right: ${e.space[1]};
    `}
  `),rc=(e,r,n)=>n==="small"?`calc(${e.space[9]} * ${r})`:`calc(${e.space[11]} * ${r})`,nc=u.default.div(({theme:e,$rows:r,$direction:n,$size:a})=>o.css`
    display: flex;
    flex-direction: ${n==="up"?"column-reverse":"column"};
    align-items: flex-start;
    justify-content: space-between;
    gap: ${e.space[1]};
    overflow-y: ${r?"scroll":"hidden"};
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    ${r&&o.css`
      max-height: ${rc(e,r,a)};
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
  `),oc=u.default.button(({theme:e,$selected:r,$highlighted:n,$color:a,$size:l})=>o.css`
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
    font-size: ${Pe("body")};
    font-weight: ${nt("body")};
    line-height: ${Le("body")};
    text-align: left;

    svg {
      display: block;
      width: ${e.space[4]};
      height: ${e.space[4]};
      color: ${e.colors.textPrimary};
    }

    ${a&&o.css`
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

    ${n&&o.css`
      background-color: ${e.colors.greySurface};
    `}

    ${r&&o.css`
      background-color: ${e.colors.greyLight};
    `}

    ${l==="small"&&o.css`
      height: ${e.space[9]};
      flex: 0 0 ${e.space[9]};
      font-size: ${Pe("small")};
      font-weight: ${nt("small")};
      line-height: ${Le("small")};
    `}
  `),ac=u.default.div(({theme:e})=>o.css`
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
  `),lc=e=>(r,n)=>{if(n.label){const a=n.label.trim().toLowerCase();a.indexOf(e)!==-1&&r.options.push(n),a===e&&(r.exactMatch=!0)}return r};var no=(e=>(e.ArrowUp="ArrowUp",e.ArrowDown="ArrowDown",e.Enter="Enter",e))(no||{});const ic=(e,r,n)=>typeof n=="string"?n:(n==null?void 0:n[e])||r,hr=(e,r,n)=>typeof n=="number"?n:(n==null?void 0:n[e])||r,Mt=t.forwardRef(({description:e,disabled:r,autocomplete:n=!1,createable:a=!1,createablePrefix:l="Add ",placeholder:i,direction:c="down",error:d,hideLabel:s,inline:f,id:$,label:p,labelSecondary:g,required:w,tabIndex:E=-1,readOnly:x=!1,width:k,onBlur:L,onChange:v,onFocus:y,onCreate:m,options:b,rows:h,emptyListMessage:V="No results",name:R,value:M,size:P="medium",padding:O,inputSize:W,align:U,validated:F,showDot:Q=!1,...Z},T)=>{const B=t.useRef(null),xe=T||B,ee=t.useRef(null),z=t.useRef(null),[Y,J]=t.useState(""),[D,ne]=t.useState(""),q=a&&D!=="",oe=a||n,[ie]=t.useState($||Yi()),[ge,me]=t.useState("");t.useEffect(()=>{M!==ge&&M!==void 0&&me(M)},[M]);const ce=(b==null?void 0:b.find(C=>C.value===ge))||null,j=(C,S)=>{if(!(C!=null&&C.disabled)){if((C==null?void 0:C.value)===rt)m&&m(D);else if(C!=null&&C.value&&(me(C==null?void 0:C.value),S)){const I=S.nativeEvent||S,Ce=new I.constructor(I.type,I);Object.defineProperties(Ce,{target:{writable:!0,value:{value:C.value,name:R}},currentTarget:{writable:!0,value:{value:C.value,name:R}}}),v&&v(Ce)}}},N=t.useMemo(()=>{if(!oe||D==="")return b;const C=D.trim().toLowerCase(),{options:S,exactMatch:I}=(Array.isArray(b)?b:[b]).reduce(lc(C),{options:[],exactMatch:!1});return[...S,...q&&!I?[{label:`${l}"${D}"`,value:rt}]:[]]},[b,q,oe,D,l]),[Ke,be]=t.useState(-1),Ge=t.useCallback(C=>{const S=N[C];if(S&&!S.disabled&&S.value!==rt){be(C),J(S.label||"");return}J(D),be(C)},[N,D,J,be]),At=C=>{var I;let S=Ke;do{if(C==="previous"?S--:S++,S<0)return Ge(-1);if(N[S]&&!((I=N[S])!=null&&I.disabled))return Ge(S)}while(N[S])},fo=C=>{const S=N[Ke];S&&j(S,C),Ht()},[ae,se]=t.useState(!1),$e=!r&&ae,go=D!==""&&oe,mo=hr("min",4,W),bo=hr("max",20,W),$o=Math.min(Math.max(mo,D.length),bo),[Qe,ho]=at.useTransition({timeout:{enter:0,exit:300},preEnter:!0});he.useEffect(()=>{ho($e)},[$e]),he.useEffect(()=>{!ae&&Qe==="unmounted"&&Ht()},[ae,Qe]);const wo=ic("inner",P==="small"?"3":"4",O),Ht=()=>{ne(""),J(""),be(-1)},vo=()=>{oe&&!ae&&se(!0),oe||se(!ae)},jt=C=>{if(!ae)return C.stopPropagation(),C.preventDefault(),se(!0);C.key in no&&(C.preventDefault(),C.stopPropagation(),C.key==="ArrowUp"?At(c==="up"?"next":"previous"):C.key==="ArrowDown"&&At(c==="up"?"previous":"next"),C.key==="Enter"&&(fo(C),se(!1)))},yo=C=>{const S=C.currentTarget.value;ne(S),J(S),be(-1)},Eo=C=>{C.stopPropagation(),ne(""),J(""),be(-1)},xo=()=>{Ge(-1)},Co=C=>S=>{S.stopPropagation(),j(C,S),se(!1)},ko=C=>{const S=Number(C.currentTarget.getAttribute("data-option-index"));isNaN(S)||Ge(S)};ml(ee,"click",()=>se(!1),ae);const Ft=({option:C,...S})=>C?t.createElement(t.Fragment,null,C.prefix&&t.createElement("div",null,C.prefix),t.createElement(to,{...S},C.node?C.node:C.label||C.value)):null;return t.createElement(te,{"data-testid":"select",description:e,disabled:r,error:d,hideLabel:s,id:ie,inline:f,label:p,labelSecondary:g,readOnly:x,required:w,width:k},C=>t.createElement(qi,{...Z,"aria-controls":`listbox-${ie}`,"aria-expanded":"true","aria-haspopup":"listbox","aria-invalid":d?!0:void 0,"data-testid":"select-container",role:"combobox",onClick:vo,onKeyDown:jt,$disabled:!!r,$hasError:!!d,$open:$e,$readOnly:x,$showDot:Q,$size:P,$validated:!!F,id:`combo-${ie}`,ref:ee,tabIndex:E,onBlur:L,onFocus:y},t.createElement(Xi,{$disabled:!!r,$hasError:!!d,$ids:C,$open:$e,$size:P},t.createElement(Ki,{ref:xe,...C==null?void 0:C.content,"aria-hidden":!0,disabled:r,name:R,placeholder:i,readOnly:x,tabIndex:-1,value:ge,onChange:S=>{const I=S.target.value,Ce=b==null?void 0:b.find(So=>So.value===I);Ce&&(me(Ce.value),v&&v(S))},onFocus:()=>{var S;z.current?z.current.focus():(S=ee.current)==null||S.focus()}}),oe&&$e?t.createElement(Ji,{autoCapitalize:"none",autoComplete:"off",autoFocus:!0,"data-testid":"select-input",placeholder:(ce==null?void 0:ce.label)||i,ref:z,size:$o,spellCheck:"false",style:{flex:"1",height:"100%"},value:Y,onChange:yo,onKeyDown:S=>jt(S)}):ce?t.createElement(Ft,{"data-testid":"selected",option:ce}):t.createElement(Qi,null,i),go?t.createElement(ro,{$size:P,type:"button",onClick:Eo},t.createElement(ye,null)):x?null:t.createElement(ec,{$direction:c,$open:$e,$size:P,id:"chevron",type:"button",onClick:()=>se(!ae)},t.createElement(Ue,null))),t.createElement(tc,{$align:U,$direction:c,$rows:h,$size:P,$state:Qe,id:`listbox-${ie}`,role:"listbox",tabIndex:-1,onMouseLeave:xo},t.createElement(nc,{$direction:c,$rows:h,$size:P},N.length===0&&t.createElement(ac,null,V),N.map((S,I)=>t.createElement(oc,{$selected:(S==null?void 0:S.value)===ge,$highlighted:I===Ke,$gap:wo,$color:S.color,$size:P,"data-option-index":I,"data-testid":`select-option-${S.value}`,disabled:S.disabled,key:S.value,role:"option",type:"button",onClick:Co(S),onMouseOver:ko},t.createElement(Ft,{option:S})))))))});Mt.displayName="Select";const cc=u.default.div(({theme:e})=>o.css`
    width: ${e.space.full};
  `),wr=({theme:e})=>o.css`
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
`,sc=u.default.input(({theme:e,disabled:r})=>o.css`
    appearance: none;
    width: ${e.space.full};
    height: ${e.space["1.5"]};
    background: hsla(${e.colors.raw.accent} / 0.4);
    border-radius: ${e.radii.full};
    outline: none;

    &::-webkit-slider-thumb {
      appearance: none;
      ${wr}
    }

    &::-moz-range-thumb {
      ${wr}
    }

    &:hover {
      background: hsla(${e.colors.raw.accent} / 0.45);
    }

    ${r&&o.css`
      opacity: 0.5;
      filter: grayscale(100%);
      cursor: not-allowed;
    `}
  `),Zt=t.forwardRef(({label:e,description:r,error:n,hideLabel:a,inline:l,labelSecondary:i,required:c,width:d,defaultValue:s,disabled:f,id:$,name:p,readOnly:g,tabIndex:w,value:E,min:x=1,max:k=100,onChange:L,onBlur:v,onFocus:y,step:m="any",...b},h)=>{const V=t.useRef(null),R=h||V;return t.createElement(te,{label:e,description:r,error:n,hideLabel:a,inline:l,labelSecondary:i,required:c,width:d,id:$},M=>t.createElement(cc,null,t.createElement(sc,{ref:R,type:"range",...b,...M==null?void 0:M.content,defaultValue:s,disabled:f,name:p,readOnly:g,tabIndex:w,value:E,min:x,max:k,onChange:L,onBlur:v,onFocus:y,step:m})))});Zt.displayName="Slider";const dc=u.default.div(({theme:e,$error:r,$validated:n,$showDot:a,$alwaysShowAction:l,$disabled:i})=>o.css`
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

    ${a&&!i&&r&&o.css`
      &:after {
        background-color: ${e.colors.redPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${a&&!i&&n&&!r&&o.css`
      &:after {
        background-color: ${e.colors.greenPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${a&&!r&&o.css`
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

    ${!l&&o.css`
      textarea:placeholder-shown ~ button {
        opacity: 0;
        transform: scale(0.8);
      }
    `}
  `),uc=u.default.textarea(({theme:e,$size:r,$hasAction:n,$error:a})=>o.css`
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
      ${n?e.space[10]:e.space[4]} ${e.space["3.5"]}
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

    ${r==="small"&&o.css`
      font-size: ${e.fontSizes.small};
      line-height: ${e.lineHeights.small};
      padding: ${e.space["2.5"]}
        ${n?e.space[9]:e.space["3.5"]}
        ${e.space["2.5"]} ${e.space["3.5"]};
    `}

    ${a&&o.css`
      border-color: ${e.colors.redPrimary};
      color: ${e.colors.redPrimary};
    `}

    ${!a&&o.css`
      &:focus-within {
        border-color: ${e.colors.bluePrimary};
      }
    `}

    &:read-only {
      border-color: ${e.colors.border};
      cursor: default;
    }
  `),pc=u.default.button(({theme:e,$size:r})=>o.css`
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
  `),Tt=t.forwardRef(({autoCorrect:e,autoFocus:r,clearable:n=!1,defaultValue:a,description:l,disabled:i,error:c,validated:d,showDot:s,hideLabel:f,id:$,label:p,labelSecondary:g,maxLength:w,name:E="textarea",placeholder:x,readOnly:k,required:L,rows:v=5,size:y="medium",spellCheck:m,tabIndex:b,value:h,width:V,actionIcon:R,alwaysShowAction:M=!1,onClickAction:P,onChange:O,onBlur:W,onFocus:U,...F},Q)=>{const Z=t.useRef(null),T=Q||Z,B=c?!0:void 0,xe=n||!!P,ee=()=>{var ne,q;if(!O)return T.current&&(T.current.value=""),(ne=T.current)==null?void 0:ne.focus();const Y=document.createElement("input");Y.value="",Y.name=E;const J=new Event("change",{bubbles:!0});Object.defineProperties(J,{target:{writable:!1,value:Y},currentTarget:{writable:!1,value:Y}});const D=Jn(J);O(D),(q=T.current)==null||q.focus()},z=()=>{if(P)return P();ee()};return t.createElement(te,{description:l,disabled:i,error:c,hideLabel:f,id:$,label:p,labelSecondary:g,readOnly:k,required:L,width:V},Y=>t.createElement(dc,{$alwaysShowAction:M,$disabled:i,$error:!!c,$showDot:s,$validated:d},t.createElement(uc,{...F,...Y==null?void 0:Y.content,"aria-invalid":B,$error:B,$hasAction:xe,$showDot:s,$size:y,$validated:d,autoCorrect:e,autoFocus:r,defaultValue:a,disabled:i,maxLength:w,name:E,placeholder:x,readOnly:k,ref:T,rows:v,spellCheck:m,tabIndex:b,value:h,onBlur:W,onChange:O,onFocus:U}),(n||P)&&t.createElement(pc,{$size:y,type:"button",onClick:z},R||t.createElement(ye,null))))});Tt.displayName="Textarea";const vr={small:{width:"12",height:"7"},medium:{width:"12",height:"8"},large:{width:"16",height:"10"}},Oe={small:{diameter:"5",translateX:"2.5"},medium:{diameter:"6",translateX:"2"},large:{diameter:"8",translateX:"3"}},fc=u.default.input(({theme:e,$size:r="medium"})=>o.css`
    position: relative;
    background-color: ${e.colors.border};
    height: ${e.space[vr[r].height]};
    width: ${e.space[vr[r].width]};
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
  `),Gt=t.forwardRef(({size:e="medium",...r},n)=>t.createElement(fc,{ref:n,type:"checkbox",...r,$size:e}));Gt.displayName="Toggle";const yr={top:`
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
  `},gc=u.default.div(({theme:e,$placement:r,$mobilePlacement:n})=>o.css`
    position: relative;
    pointer-events: none;
    box-sizing: border-box;
    filter: drop-shadow(0px 0px 1px #e8e8e8)
      drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2));
    border-radius: ${e.radii.large};
    padding: ${e.space["2.5"]} ${e.space["2.5"]} ${e.space["2.5"]}
      ${e.space["3.5"]};
    /* border-color: ${e.colors.border}; */
    background: ${e.colors.background};

    ${yr[n]}
    ${_.md.min(o.css`
      &:before {
        display: none;
      }
      &:after {
        display: none;
      }
      ${yr[r]}
    `)}
  `),mc=({placement:e,mobilePlacement:r,children:n})=>t.createElement(gc,{$mobilePlacement:r,$placement:e,"data-testid":"tooltip-popover"},n),Bt=({content:e,placement:r="top",mobilePlacement:n="top",children:a,...l})=>{const i=t.useRef(null),c=t.Children.only(a),d=t.cloneElement(c,{ref:i}),s=t.createElement(mc,{mobilePlacement:n,placement:r},e);return t.createElement(t.Fragment,null,t.createElement(Ne,{anchorRef:i,mobilePlacement:n,placement:r,popover:s,...l}),d)};Bt.displayName="Tooltip";const bc=u.default.button(({theme:e})=>o.css`
    position: absolute;
    top: ${e.space[1]};
    right: ${e.space[1]};
    padding: ${e.space[3]};
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
      width: ${e.space[6]};
      height: ${e.space[6]};
    }
  `),oo=u.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: ${e.space[6]};

    padding: ${e.space["3.5"]};
    border-radius: ${e.radii["3xLarge"]};
    background-color: ${e.colors.background};
    position: relative;
    width: 100%;
    ${_.sm.min(o.css`
      width: initial;
    `)}
    ${_.md.min(o.css`
      max-width: 80vw;
    `)}
  `),$c=u.default.div(({theme:e,$alert:r})=>o.css`
    width: ${e.space[8]};
    height: ${e.space[8]};
    flex: 0 0 ${e.space[8]};

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    ${r==="error"&&o.css`
      background: ${e.colors.redPrimary};
      color: ${e.colors.backgroundPrimary};
      border-radius: ${e.radii.full};

      svg {
        transform: scale(0.5);
      }
    `}

    ${r==="warning"&&o.css`
      background: ${e.colors.yellowPrimary};
      color: ${e.colors.backgroundPrimary};
      border-radius: ${e.radii.full};

      svg {
        transform: scale(0.5);
      }
    `}
  `),hc=({alert:e})=>{const r=!!e&&["error","warning"].includes(e);return t.createElement($c,{$alert:e},r?t.createElement(Me,null):t.createElement(Ye,null))},wc=u.default(A)(()=>o.css`
    text-align: center;
  `),vc=u.default(A)(({theme:e})=>o.css`
    font-size: ${e.fontSizes.body};
    line-height: ${e.lineHeights.body};
    font-weight: ${e.fontWeights.bold};
    color: ${e.colors.textSecondary};
    text-align: center;

    padding: 0 ${e.space[4]};
    max-width: ${e.space[72]};
  `),yc=u.default.div(({theme:e,$center:r})=>o.css`
    display: flex;
    align-items: center;
    justify-content: stretch;
    flex-direction: ${r?"column":"row"};
    gap: ${e.space[2]};
    width: ${e.space.full};
    max-width: ${e.space[96]};
  `),Ec=u.default.div(({theme:e})=>o.css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${e.space[4]};
  `),xc=u.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${e.space[1]};
  `),ao=u.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${e.space[5]};
    ${_.sm.min(o.css`
      min-width: ${e.space[64]};
    `)}
  `),Cc=u.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${e.space[2]};
  `),kc=u.default.div(({theme:e,$type:r})=>o.css`
    border-radius: ${e.radii.full};
    width: ${e.space["3.5"]};
    height: ${e.space["3.5"]};
    ${r==="notStarted"&&o.css`
      border: ${e.borderWidths["0.5"]} ${e.borderStyles.solid}
        ${e.colors.border};
    `}
    ${r==="inProgress"&&o.css`
      border: ${e.borderWidths["0.5"]} ${e.borderStyles.solid}
        ${e.colors.accent};
    `}
    ${r==="completed"&&o.css`
      background-color: ${e.colors.accent};
    `}
  `),lo=({title:e,subtitle:r,alert:n})=>t.createElement(xc,null,n&&t.createElement(hc,{alert:n}),e&&(typeof e!="string"&&e||t.createElement(wc,{fontVariant:"headingFour"},e)),r&&(typeof r!="string"&&r||t.createElement(vc,null,r))),io=({leading:e,trailing:r,center:n,currentStep:a,stepCount:l,stepStatus:i})=>{const c=t.useCallback($=>$===a?i||"inProgress":$<(a||0)?"completed":"notStarted",[a,i]),d=e||r;return d||!!l?t.createElement(Ec,null,l&&t.createElement(Cc,{"data-testid":"step-container"},Array.from({length:l},($,p)=>t.createElement(kc,{$type:c(p),"data-testid":`step-item-${p}-${c(p)}`,key:p}))),d&&t.createElement(yc,{$center:n},e||!n&&t.createElement("div",{style:{flexGrow:1}}),r||!n&&t.createElement("div",{style:{flexGrow:1}}))):null},Er=({open:e,onDismiss:r,alert:n,title:a,subtitle:l,children:i,currentStep:c,stepCount:d,stepStatus:s,...f})=>t.createElement(Te,{...f,open:e,onDismiss:r},t.createElement(oo,null,t.createElement(ao,null,t.createElement(lo,{alert:n,title:a,subtitle:l,currentStep:c,stepCount:d,stepStatus:s}),i))),Ae=({onClick:e})=>t.createElement(bc,{"data-testid":"close-icon",onClick:e},t.createElement(ye,null)),Ee=({children:e,onDismiss:r,onClose:n=r,open:a,variant:l="closable",...i})=>{if(l==="actionable"){const{trailing:c,leading:d,alert:s,title:f,subtitle:$,center:p,currentStep:g,stepCount:w,stepStatus:E,...x}=i;return t.createElement(Er,{...x,alert:s,open:a,subtitle:$,title:f,onDismiss:r},e,t.createElement(io,{leading:d,trailing:c,center:p,currentStep:g,stepCount:w,stepStatus:E}),n&&t.createElement(Ae,{onClick:n}))}else if(l==="closable"){const{alert:c,title:d,subtitle:s,...f}=i;return t.createElement(Er,{...f,alert:c,open:a,subtitle:s,title:d,onDismiss:r},e,n&&t.createElement(Ae,{onClick:n}))}return t.createElement(Te,{onDismiss:r,open:a},t.createElement(oo,null,t.createElement(ao,null,e),n&&t.createElement(Ae,{onClick:n})))};Ee.displayName="Dialog";Ee.Footer=io;Ee.Heading=lo;Ee.CloseButton=Ae;const co=u.default.div(({theme:e})=>o.css`
    position: absolute;
    top: ${e.space["2.5"]};
    right: ${e.space["2.5"]};
    height: ${e.space[8]};
    width: ${e.space[8]};
    opacity: 0.5;
    cursor: pointer;
    transition-property: all;
    transition-duration: ${e.transitionDuration[150]};
    transition-timing-function: ${e.transitionTimingFunction.inOut};

    &:hover {
      opacity: 0.7;
    }
  `),so=u.default.div(({theme:e,$state:r,$top:n,$left:a,$right:l,$bottom:i,$mobile:c,$popped:d})=>o.css`
    position: fixed;
    z-index: 10000;

    width: 92.5%;
    left: 3.75%;
    top: calc(100vh / 100 * 2.5);

    ${d&&o.css`
      width: 95%;
      left: 2.5%;
      touch-action: none;
    `}

    ${!c&&o.css`
      max-width: ${e.space[112]};
      top: unset;
      left: unset;

      ${n&&`top: ${e.space[n]};`}
      ${a&&`left: ${e.space[a]};`}
      ${l&&`right: ${e.space[l]};`}
      ${i&&`bottom: ${e.space[i]};`}
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

    ${r==="entered"?o.css`
          opacity: 1;
          transform: translateY(0px);
        `:o.css`
          opacity: 0;
          transform: translateY(-64px);
        `}
  `),uo=u.default(A)(({theme:e})=>o.css`
    font-size: ${e.fontSizes.headingFour};
    line-height: ${e.lineHeights.headingFour};
  `),Sc=u.default.div(({theme:e})=>o.css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: ${e.space[3]};
    margin-bottom: calc(-1 * ${e.space[2]});
  `),Rc=u.default.div(({theme:e})=>o.css`
    width: ${e.space[8]};
    height: ${e.space[1]};
    border-radius: ${e.radii.full};
    background: ${e.colors.border};
  `),Pc=()=>t.createElement(Sc,null,t.createElement(Rc,null)),Lc=({onClose:e,title:r,description:n,top:a="4",left:l,right:i="4",bottom:c,state:d,children:s,...f})=>t.createElement(so,{...f,"data-testid":re(f,"toast-desktop"),$bottom:c,$left:l,$mobile:!1,$right:i,$state:d,$top:a},t.createElement(co,{as:qe,"data-testid":"toast-close-icon",onClick:()=>e()}),t.createElement(uo,{fontVariant:"large",weight:"bold"},r),t.createElement(A,null,n),s&&t.createElement(po,null,s)),po=u.default.div(({theme:e})=>o.css`
    margin-top: ${e.space[3]};
    width: 100%;
  `),Vc=({onClose:e,open:r,title:n,description:a,left:l,right:i="4",bottom:c,state:d,children:s,popped:f,setPopped:$,...p})=>{const{space:g}=o.useTheme(),w=t.useRef(null),[E,x]=t.useState(.025*window.innerHeight),[k,L]=t.useState([]);t.useEffect(()=>{r&&x(.025*window.innerHeight)},[r]),t.useEffect(()=>{var b;const m=.025*window.innerHeight;if(k.length&&!f){let h=!1,V=k[k.length-1];V===void 0&&(V=k[k.length-2]||0,h=!0);const R=parseInt(getComputedStyle(document.documentElement).fontSize),M=k[0]-V;if(h)parseFloat(g[8])*R>(((b=w.current)==null?void 0:b.offsetHeight)||0)-M?e():(x(m),L([]));else if(M*-1>parseFloat(g[32])*R)x(m*2),$(!0);else if(M>0)x(m-M);else{const P=.25*(M^2);x(m-P)}}},[k]);const v=t.useCallback(m=>{var b;m.preventDefault(),L([(b=m.targetTouches.item(0))==null?void 0:b.pageY])},[]),y=t.useCallback(m=>{m.preventDefault(),L(b=>{var h;return[...b,(h=m.targetTouches.item(0))==null?void 0:h.pageY]})},[]);return t.useEffect(()=>{const m=w.current;return m==null||m.addEventListener("touchstart",v,{passive:!1,capture:!1}),m==null||m.addEventListener("touchmove",y,{passive:!1,capture:!1}),()=>{m==null||m.removeEventListener("touchstart",v,{capture:!1}),m==null||m.removeEventListener("touchmove",y,{capture:!1})}},[]),t.useEffect(()=>{const m=w.current;f&&(m==null||m.removeEventListener("touchstart",v,{capture:!1}),m==null||m.removeEventListener("touchmove",y,{capture:!1}))},[f]),t.createElement(so,{...p,"data-testid":re(p,"toast-touch"),style:{top:`${E}px`},onClick:()=>$(!0),onTouchEnd:()=>L(m=>[...m,void 0]),$bottom:c,$left:l,$mobile:!0,$popped:f,$right:i,$state:d,ref:w},t.createElement(uo,{fontVariant:"large",weight:"bold"},n),t.createElement(A,null,a),f&&t.createElement(t.Fragment,null,s&&t.createElement(po,null,s),t.createElement(co,{as:qe,"data-testid":"toast-close-icon",onClick:m=>{m.stopPropagation(),e()}})),!f&&t.createElement(Pc,null))},Ot=({onClose:e,open:r,msToShow:n=8e3,variant:a="desktop",...l})=>{const[i,c]=t.useState(!1),d=t.useRef();return t.useEffect(()=>{if(r)return c(!1),d.current=setTimeout(()=>e(),n||8e3),()=>{clearTimeout(d.current),e()}},[r]),t.useEffect(()=>{i&&clearTimeout(d.current)},[i]),t.createElement(Ve,{className:"toast",noBackground:!0,open:r,onDismiss:a==="touch"&&i?()=>e():void 0},({state:s})=>a==="touch"?t.createElement(Vc,{...l,open:r,popped:i,setPopped:c,state:s,onClose:e}):t.createElement(Lc,{...l,open:r,state:s,onClose:e}))};Ot.displayName="Toast";const Mc=Object.freeze(Object.defineProperty({__proto__:null,Avatar:je,BackdropSurface:lt,Banner:st,Button:De,Card:ze,DynamicPopover:Ne,Field:te,FileInput:pt,Heading:Ie,Portal:_e,RecordItem:ft,ScrollBox:Dr,Skeleton:mt,Spinner:ue,Tag:We,Typography:A,VisuallyHidden:fe,Backdrop:Ve,Checkbox:bt,CheckboxRow:$t,CountdownCircle:xt,CurrencyToggle:Ct,Dropdown:Xe,FieldSet:kt,Helper:St,Input:Rt,Modal:Te,PageButtons:Qn,Profile:Pt,RadioButton:Lt,RadioButtonGroup:Vt,Select:Mt,SkeletonGroup:gt,Slider:Zt,Textarea:Tt,Toggle:Gt,Tooltip:Bt,Dialog:Ee,Toast:Ot,AeroplaneSVG:Nr,AlertSVG:Me,BrowserSVG:Ir,CalendarSVG:_r,CameraSVG:Wr,CheckSVG:Ze,CheckCircleSVG:Ur,CogSVG:Yr,CogActiveSVG:qr,CopySVG:ht,CounterClockwiseArrowSVG:Xr,CreditCardSVG:Kr,CrossSVG:wt,CrossCircleSVG:ye,DisabledSVG:Qr,DocumentSVG:Jr,DotGridSVG:en,DotGridActiveSVG:tn,DownArrowSVG:rn,DownChevronSVG:Ue,DownCircleSVG:nn,EnsSVG:on,EthSVG:Ye,EthTransparentSVG:an,EthTransparentInvertedSVG:ln,ExitSVG:qe,EyeSVG:cn,EyeStrikethroughSVG:sn,FastForwardSVG:dn,FilterSVG:un,FlameSVG:pn,GasPumpSVG:fn,HeartSVG:gn,HeartActiveSVG:mn,HouseSVG:bn,InfoCircleSVG:vt,KeySVG:$n,LanguageSVG:hn,LeftArrowSVG:wn,LeftChevronSVG:vn,LifebuoySVG:yn,LinkSVG:En,ListSVG:xn,ListDownSVG:Cn,ListUpSVG:kn,LockSVG:Sn,MagnifyingGlassSVG:Rn,MagnifyingGlassActiveSVG:Pn,MagnifyingGlassSimpleSVG:Ln,MarkerSVG:Vn,MenuSVG:Mn,MinusSVG:Zn,MinusCircleSVG:Tn,MoonSVG:Gn,NametagSVG:Bn,OutlinkSVG:On,PersonSVG:An,PersonPlusSVG:Hn,PlusSVG:jn,PlusCircleSVG:Fn,QuestionBubbleSVG:Dn,QuestionCircleSVG:zn,RightArrowSVG:Nn,RightChevronSVG:In,SpannerSVG:_n,SpannerAltSVG:Wn,SunSVG:Un,UpArrowSVG:yt,UpChevronSVG:Yn,UpCircleSVG:qn,UpRightArrowSVG:Et,WalletSVG:Xn},Symbol.toStringTag,{value:"Module"})),Zc=o.createGlobalStyle(({theme:e})=>o.css`
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
  `),Tc=Zc;exports.AeroplaneSVG=Nr;exports.AlertSVG=Me;exports.Avatar=je;exports.Backdrop=Ve;exports.BackdropSurface=lt;exports.Banner=st;exports.BrowserSVG=Ir;exports.Button=De;exports.CalendarSVG=_r;exports.CameraSVG=Wr;exports.Card=ze;exports.CheckCircleSVG=Ur;exports.CheckSVG=Ze;exports.Checkbox=bt;exports.CheckboxRow=$t;exports.CogActiveSVG=qr;exports.CogSVG=Yr;exports.Components=Mc;exports.CopySVG=ht;exports.CountdownCircle=xt;exports.CounterClockwiseArrowSVG=Xr;exports.CreditCardSVG=Kr;exports.CrossCircleSVG=ye;exports.CrossSVG=wt;exports.CurrencyToggle=Ct;exports.Dialog=Ee;exports.DisabledSVG=Qr;exports.DocumentSVG=Jr;exports.DotGridActiveSVG=tn;exports.DotGridSVG=en;exports.DownArrowSVG=rn;exports.DownChevronSVG=Ue;exports.DownCircleSVG=nn;exports.Dropdown=Xe;exports.DynamicPopover=Ne;exports.EnsSVG=on;exports.EthSVG=Ye;exports.EthTransparentInvertedSVG=ln;exports.EthTransparentSVG=an;exports.ExitSVG=qe;exports.EyeSVG=cn;exports.EyeStrikethroughSVG=sn;exports.FastForwardSVG=dn;exports.Field=te;exports.FieldSet=kt;exports.FileInput=pt;exports.FilterSVG=un;exports.FlameSVG=pn;exports.GasPumpSVG=fn;exports.Heading=Ie;exports.HeartActiveSVG=mn;exports.HeartSVG=gn;exports.Helper=St;exports.HouseSVG=bn;exports.InfoCircleSVG=vt;exports.Input=Rt;exports.KeySVG=$n;exports.LanguageSVG=hn;exports.LeftArrowSVG=wn;exports.LeftChevronSVG=vn;exports.LifebuoySVG=yn;exports.LinkSVG=En;exports.ListDownSVG=Cn;exports.ListSVG=xn;exports.ListUpSVG=kn;exports.LockSVG=Sn;exports.MagnifyingGlassActiveSVG=Pn;exports.MagnifyingGlassSVG=Rn;exports.MagnifyingGlassSimpleSVG=Ln;exports.MarkerSVG=Vn;exports.MenuSVG=Mn;exports.MinusCircleSVG=Tn;exports.MinusSVG=Zn;exports.Modal=Te;exports.MoonSVG=Gn;exports.NametagSVG=Bn;exports.OutlinkSVG=On;exports.PageButtons=Qn;exports.PersonPlusSVG=Hn;exports.PersonSVG=An;exports.PlusCircleSVG=Fn;exports.PlusSVG=jn;exports.Portal=_e;exports.Profile=Pt;exports.QuestionBubbleSVG=Dn;exports.QuestionCircleSVG=zn;exports.RadioButton=Lt;exports.RadioButtonGroup=Vt;exports.RecordItem=ft;exports.RightArrowSVG=Nn;exports.RightChevronSVG=In;exports.ScrollBox=Dr;exports.Select=Mt;exports.Skeleton=mt;exports.SkeletonGroup=gt;exports.Slider=Zt;exports.SpannerAltSVG=Wn;exports.SpannerSVG=_n;exports.Spinner=ue;exports.SunSVG=Un;exports.Tag=We;exports.Textarea=Tt;exports.ThorinGlobalStyles=Tc;exports.Toast=Ot;exports.Toggle=Gt;exports.Tooltip=Bt;exports.Typography=A;exports.UpArrowSVG=yt;exports.UpChevronSVG=Yn;exports.UpCircleSVG=qn;exports.UpRightArrowSVG=Et;exports.VisuallyHidden=fe;exports.WalletSVG=Xn;exports.baseTheme=it;exports.darkTheme=Fo;exports.lightTheme=jo;exports.mq=_;exports.tokens=Re;
