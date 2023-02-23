"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const he=require("react"),l=require("styled-components"),hr=require("react-dom"),lt=require("react-transition-state"),wl=e=>e&&typeof e=="object"&&"default"in e?e:{default:e};function wr(e){if(e&&e.__esModule)return e;const r=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const o in e)if(o!=="default"){const n=Object.getOwnPropertyDescriptor(e,o);Object.defineProperty(r,o,n.get?n:{enumerable:!0,get:()=>e[o]})}}return r.default=e,Object.freeze(r)}const t=wr(he),s=wl(l),vl=wr(hr),yl=s.default.div(({theme:e,$shape:r,$noBorder:o})=>l.css`
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
  `),El=s.default.div(({theme:e,$url:r,$disabled:o})=>l.css`
    background: ${r||e.colors.gradients.blue};

    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    ${o&&l.css`
      filter: grayscale(1);
    `}
  `),xl=s.default.img(({$shown:e,$disabled:r})=>l.css`
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
  `),Fe=({label:e,noBorder:r=!1,shape:o="circle",src:n,placeholder:a,decoding:i="async",disabled:c=!1,...u})=>{const d=t.useRef(null),[p,b]=t.useState(!!n),f=t.useCallback(()=>{b(!0)},[b]),g=t.useCallback(()=>{b(!1)},[b]);t.useEffect(()=>{const y=d.current;return y&&(y.addEventListener("load",f),y.addEventListener("loadstart",g),y.addEventListener("error",g)),()=>{y&&(y.removeEventListener("load",f),y.removeEventListener("loadstart",g),y.removeEventListener("error",g))}},[d,g,f]);const h=p&&!!n;return t.createElement(yl,{$noBorder:!p||r,$shape:o},!h&&t.createElement(El,{$disabled:c,$url:a,"aria-label":e}),t.createElement(xl,{...u,$disabled:c,$shown:h,alt:e,decoding:i,ref:d,src:n,onError:()=>b(!1),onLoad:()=>b(!0)}))};Fe.displayName="Avatar";const nt=s.default.div(({theme:e,$state:r,$empty:o})=>l.css`
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
  `),vr={none:"none",solid:"solid"},yr={0:"0px",px:"1px","0.375":"0.09375rem","0.5":"0.125rem","0.75":"0.1875rem",1:"0.25rem","1.25":"0.3125rem","1.5":"0.375rem","1.75":"0.4375rem",2:"0.5rem"},Er={none:"0",extraSmall:"2px",small:"4px",medium:"6px",large:"8px",almostExtraLarge:"10px",extraLarge:"12px","2xLarge":"16px","2.5xLarge":"20px","3xLarge":"24px","4xLarge":"40px",full:"9999px",input:"0.5rem",card:"1rem",checkbox:"0.25rem"},X={none:"none","-px":"inset 0 0 0 1px",0:"0 0 0 0","0.02":"0 2px 8px","0.25":"0 2px 12px","0.5":"0 0 0 0.125rem",1:"0 0 0 0.25rem",2:"0 0 0 0.5rem"},Cl=[50,100,300,400,500,750],kl={Surface:50,Light:100,Bright:300,Primary:400,Dim:500,Active:750},jt={blue:[216,100,61,{50:[215,100,97]}],indigo:[242,61,58],purple:[280,62,55],pink:[331,67,51,{100:[331,64,88]}],red:[7,76,44,{50:[0,60,94],100:[360,60,85]}],orange:[35,91,50,{100:[36,89,86]}],yellow:[47,86,49,{50:[48,100,90],100:[48,100,85]}],green:[162,72,40,{50:[157,37,93],100:[157,37,85]}],teal:[199,66,49],grey:[240,6,63,{50:[0,0,96],100:[0,0,91],500:[0,0,35],750:[0,0,15]}]},Je={light:"0 0% 100%",dark:"0 0% 8%"},Sl={background:{hue:"grey",items:{primary:Je,secondary:"Surface"}},text:{hue:"grey",items:{primary:"Active",secondary:"Dim",tertiary:"Primary",accent:{light:Je.light,dark:Je.light}}},border:{hue:"grey",items:{primary:"Light"}}},Ft={blue:"linear-gradient(330.4deg, #44BCF0 4.54%, #7298F8 59.2%, #A099FF 148.85%)",green:"linear-gradient(90deg, rgba(68,240,127,1) 4.54%, rgba(114,248,176,1) 59.2%, rgba(153,202,255,1) 148.85%)",red:"linear-gradient(90deg, rgba(240,68,87,1) 4.54%, rgba(248,114,149,1) 59.2%, rgba(212,153,255,1) 148.85%)",purple:"linear-gradient(323.31deg, #DE82FF -15.56%, #7F6AFF 108.43%)",grey:"linear-gradient(330.4deg, #DFDFDF 4.54%, #959595 59.2%, #474747 148.85%)"},Dt=(e,r,o)=>{e==="dark"&&(o=Object.fromEntries(Object.entries(o).map(([a],i,c)=>[a,c[c.length-i-1][1]])));const n=Object.fromEntries(Object.entries(kl).map(([a,i])=>[`${r}${a}`,o[i]]));return{...n,[r]:n[`${r}Primary`]}},zt=e=>`${e[0]} ${e[1]}% ${e[2]}%`,Rl=(e,r,o)=>{const n=Object.fromEntries(Cl.map(a=>{var c;if((c=o[3])!=null&&c[a])return[a,zt(o[3][a])];const i=o.slice(0,3);return i[2]=i[2]+(400-a)/10,[a,zt(i)]}));return{normal:Dt(e,r,Object.fromEntries(Object.entries(n).map(([a,i])=>[a,`hsl(${i})`]))),raw:Dt(e,r,n)}},Pl=(e,r)=>({...Ft,accent:Ft[e]||r[e]}),Nt=(e,r)=>{const o=Object.entries({...jt,accent:jt[e]}).reduce((a,i)=>{const[c,u]=i,d=Rl(r,c,u);return{...a,...d.normal,raw:{...a.raw,...d.raw}}},{}),n=Object.entries(Sl).reduce((a,i)=>{const[c,u]=i;for(const[d,p]of Object.entries(u.items)){const b=`${c}${d.replace(/^[a-z]/,g=>g.toUpperCase())}`,f=typeof p=="string"?o.raw[`${u.hue}${p}`]:p[r];if(a[b]=`hsl(${f})`,a.raw[b]=f,d==="primary"){const g=c;a[g]=`hsl(${f})`,a.raw[g]=f}}return a},o);return{...n,gradients:Pl(e,n)}},Vl=e=>({light:Nt(e,"light"),dark:Nt(e,"dark")}),Z=Vl("blue"),xr={overlay:"0.1",overlayFallback:"0.5"},Cr={0:"0",px:"1px","0.25":"0.0625rem","0.5":"0.125rem","0.75":"0.1875rem",1:"0.25rem","1.25":"0.3125rem","1.5":"0.375rem","1.75":"0.4375rem",2:"0.5rem","2.5":"0.625rem",3:"0.75rem","3.5":"0.875rem",4:"1rem","4.5":"1.125rem",5:"1.25rem","5.5":"1.375rem",6:"1.5rem",7:"1.75rem","7.5":"1.875rem",8:"2rem","8.5":"2.125rem",9:"2.25rem",10:"2.5rem",11:"2.75rem",12:"3rem",13:"3.25rem",14:"3.5rem",15:"3.75rem",16:"4rem",18:"4.5rem",20:"5rem","22.5":"5.625rem",24:"6rem",26:"6.5rem",28:"7rem",30:"7.5rem",32:"8rem",36:"9rem",40:"10rem",44:"11rem",45:"11.25rem",48:"12rem",52:"13rem",56:"14rem",60:"15rem",64:"16rem",72:"18rem",80:"20rem",96:"24rem",112:"28rem",128:"32rem",144:"36rem",168:"42rem",192:"48rem",224:"56rem",256:"64rem",288:"72rem",320:"80rem","1/4":"25%","1/3":"33.333333%","1/2":"50%","2/3":"66.666667%","3/4":"75%",auto:"auto",full:"100%",fit:"fit-content",max:"max-content",min:"min-content",viewHeight:"100vh",viewWidth:"100vw",none:"0"},kr={mono:'"iAWriter Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',sans:'"Satoshi", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'},pe={headingOne:"2.25rem",headingTwo:"1.875rem",headingThree:"1.625rem",headingFour:"1.375rem",extraLarge:"1.25rem",large:"1.125rem",body:"1rem",small:"0.875rem",extraSmall:"0.75rem"},we={light:"300",normal:"500",bold:"700",extraBold:"830"},Sr={"-0.02":"-0.02em","-0.015":"-0.015em","-0.01":"-0.01em",normal:"0","0.03":"0.03em"},ve={headingOne:"3rem",headingTwo:"2.5rem",headingThree:"2.125rem",headingFour:"1.875rem",extraLarge:"1.625rem",large:"1.5rem",body:"1.25rem",small:"1.25rem",extraSmall:"1rem"},Rr={75:"75ms",100:"100ms",150:"150ms",200:"200ms",300:"300ms",500:"500ms",700:"700ms",1e3:"1000ms"},Pr={linear:"linear",in:"cubic-bezier(0.4, 0, 1, 1)",out:"cubic-bezier(0, 0, 0.2, 1)",inOut:"cubic-bezier(0.42, 0, 0.58, 1)",popIn:"cubic-bezier(0.15, 1.15, 0.6, 1)"},De={xs:360,sm:640,md:768,lg:1024,xl:1280},Ll={light:{0:`${X[0]} ${Z.light.backgroundSecondary}`,"0.02":`${X["0.02"]} ${Z.light.backgroundSecondary}`,"0.25":`${X["0.25"]} ${Z.light.backgroundSecondary}`,"0.5":`${X["0.5"]} ${Z.light.backgroundSecondary}`,1:`${X[1]} ${Z.light.backgroundSecondary}`},dark:{0:`${X[0]} ${Z.dark.backgroundSecondary}`,"0.02":`${X["0.02"]} ${Z.dark.backgroundSecondary}`,"0.25":`${X["0.25"]} ${Z.dark.backgroundSecondary}`,"0.5":`${X["0.5"]} ${Z.dark.backgroundSecondary}`,1:`${X[1]} ${Z.dark.backgroundSecondary}`}},Re={borderStyles:vr,borderWidths:yr,colors:Z,fonts:kr,fontSizes:pe,fontWeights:we,letterSpacings:Sr,lineHeights:ve,opacity:xr,radii:Er,shadows:X,space:Cr,breakpoints:De,transitionDuration:Rr,transitionTimingFunction:Pr,boxShadows:Ll},at={borderStyles:vr,borderWidths:yr,fonts:kr,fontSizes:pe,fontWeights:we,letterSpacings:Sr,lineHeights:ve,opacity:xr,radii:Er,shadows:X,space:Cr,breakpoints:De,transitionDuration:Rr,transitionTimingFunction:Pr},Zl={...at,colors:Re.colors.light,boxShadows:Re.boxShadows.light,mode:"light"},Ml={...at,colors:Re.colors.dark,boxShadows:Re.boxShadows.dark,mode:"dark"},Vr={min:"min-width",max:"max-width"},Gl=Object.keys(De),Tl=Object.keys(Vr),W=Gl.reduce((e,r)=>(e[r]=Tl.reduce((o,n)=>(o[n]=a=>l.css`
        @media (${Vr[n]}: ${De[r]}px) {
          ${a};
        }
      `,o),{}),e),{}),Bl=Object.keys(pe),Ol={headingOne:{weight:"extraBold"},headingTwo:{weight:"bold"},headingThree:{weight:"bold"},headingFour:{weight:"bold"}},Al=["extraLarge","large","body","small","extraSmall"],Hl={label:{size:pe.extraSmall,lineHeight:ve.extraSmall,weight:we.normal},labelHeading:{size:pe.small,lineHeight:ve.small,weight:we.normal}},jl=()=>Object.fromEntries(Bl.map(e=>{var o;const r=((o=Ol[e])==null?void 0:o.weight)||"normal";return[e,{size:pe[e],lineHeight:ve[e],weight:we[r]}]})),Fl=()=>Object.fromEntries(Al.map(e=>[`${e}Bold`,{size:pe[e],lineHeight:ve[e],weight:we.bold}])),Dl=()=>({...Hl,...jl(),...Fl()}),it=Dl(),Pe=e=>{var r;return(r=it[e])==null?void 0:r.size},Ve=e=>{var r;return(r=it[e])==null?void 0:r.lineHeight},rt=e=>{var r;return(r=it[e])==null?void 0:r.weight},zl=e=>{const r=Object.keys(Z[e].gradients),o=Object.fromEntries(r.map(i=>[`${i}Gradient`,Z[e].gradients[i]])),n=Object.keys(Z[e]).filter(([i])=>i!=="gradients"&&i!=="raw"),a=Object.fromEntries(n.map(i=>[i,Z[e][i]]));return{...o,...a,tranparent:"transparent",initial:"initial",inherit:"inherit"}},Nl=zl("light"),It=["accent","blue","indigo","purple","pink","red","orange","yellow","green","teal","grey"],Il=e=>{const r=Object.fromEntries(It.map(d=>[`${d}Primary`,{text:Z[e].backgroundPrimary,background:Z[e][`${d}Primary`],border:"transparent",hover:Z[e][`${d}Bright`]}])),o=Object.fromEntries(It.map(d=>[`${d}Secondary`,{text:Z[e][`${d}Primary`],background:Z[e][`${d}Surface`],border:"transparent",hover:Z[e][`${d}Light`]}])),n=Object.keys(Z[e].gradients),a=Object.fromEntries(n.map(d=>[`${d}Gradient`,{text:Z[e].backgroundPrimary,background:Z[e].gradients[d],border:"transparent",hover:Z[e].gradients[d]}])),i={text:"initial",background:"transparent",border:"transparent",hover:Z[e].greyLight},c={text:Z[e].greyPrimary,background:Z[e].greyLight,border:Z[e].greyLight,hover:Z[e].greyLight},u={text:Z[e].textPrimary,background:Z[e].backgroundPrimary,border:Z[e].border,hover:Z[e].backgroundSecondary};return{...r,...o,...a,transparent:i,disabled:c,background:u}},Wl=Il("light"),Lr=e=>Nl[e],H=(e,r)=>{var o;return(o=Wl[e])==null?void 0:o[r]},_l=s.default.div(({theme:e,$ellipsis:r,$fontVariant:o="body",$color:n,$font:a,$weight:i})=>l.css`
    font-family: ${e.fonts.sans};
    line-height: ${e.lineHeights.body};
    color: ${Lr(n)};

    ${r&&l.css`
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    `}

    ${o&&l.css`
      font-size: ${Pe(o)};
      font-weight: ${rt(o)};
      line-height: ${Ve(o)};
    `}

    ${a==="mono"&&l.css`
      font-family: ${e.fonts.mono};
    `}

    ${i&&l.css`
      font-weight: ${e.fontWeights[i]};
    `};
  `),O=t.forwardRef(({asProp:e,children:r,ellipsis:o,className:n,fontVariant:a="body",font:i="sans",color:c="text",weight:u,...d},p)=>t.createElement(_l,{...d,$color:c,$ellipsis:o?!0:void 0,$font:i,$fontVariant:a,$weight:u,as:e,className:n,ref:p},r));O.displayName="Typography";const Ul=s.default.div(({theme:e,$alert:r,$hasAction:o})=>l.css`
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

    ${W.md.min(l.css`
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
  `),Yl=s.default.div(({theme:e})=>l.css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: ${e.space[1]};
  `),ql=s.default.div(({theme:e,$alert:r,$type:o})=>l.css`
    width: ${e.space[8]};
    height: ${e.space[8]};
    flex: 0 0 ${e.space[8]};

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    ${W.md.min(l.css`
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
  `),Xl=({alert:e="info",icon:r,hasHref:o,onDismiss:n})=>n?t.createElement(Wt,{onClick:()=>n()},t.createElement(_t,{$alert:e,$hasAction:!0},r||t.createElement(ye,null))):o||r?t.createElement(Wt,{as:"div"},t.createElement(_t,{$alert:e},r||t.createElement(wt,null))):null,Kl=(e,r)=>e!=="info"?"filledCircle":r?"normal":"none",ct=({title:e,alert:r="info",icon:o,iconType:n,as:a,children:i,onDismiss:c,...u})=>{const d=o||(r&&["error","warning"].includes(r)?t.createElement(Ze,null):t.createElement(qe,null)),p=!!u.href,b=p||!!u.onClick,f=n||Kl(r,o);return t.createElement(Ul,{...u,$alert:r,$hasAction:b,as:a},f!=="none"&&t.createElement(ql,{$alert:r,$type:f},d),t.createElement(Yl,null,e&&t.createElement(O,{fontVariant:"largeBold"},e),t.createElement(O,null,i)),t.createElement(Xl,{alert:r,hasHref:p,icon:u.actionIcon,onDismiss:c}))};ct.displayName="Banner";const fe=s.default.div(()=>l.css`
    border-width: 0;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  `),Ql=l.keyframes`
  100% {
    transform: rotate(1turn);
  }
`,Jl=s.default.div(({theme:e,$color:r,$size:o})=>l.css`
    animation: ${Ql} 1.1s linear infinite;

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
  `),ue=t.forwardRef(({accessibilityLabel:e,size:r="small",color:o="text",...n},a)=>t.createElement(Jl,{$color:o,$size:r,ref:a,...n},e&&t.createElement(fe,null,e),t.createElement("svg",{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},t.createElement("circle",{cx:"12",cy:"12",fill:"none",r:"9",strokeDasharray:"42",strokeLinecap:"round"}),t.createElement("circle",{cx:"12",cy:"12",fill:"none",opacity:"0.25",r:"9",strokeLinecap:"round"}))));ue.displayName="Spinner";const en=s.default.button(({theme:e,$pressed:r,$shadow:o,$size:n,$colorStyle:a="accentPrimary",$shape:i,$hasCounter:c,$width:u})=>l.css`
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

    background: ${H(a,"background")};
    color: ${H(a,"text")};
    border-color: ${H(a,"border")};

    &:hover {
      transform: translateY(-1px);
      background: ${H(a,"hover")};
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

    ${r&&l.css`
      background: ${H(a,"hover")};
    `};

    ${o&&l.css`
      box-shadow: ${e.shadows["0.25"]} ${e.colors.grey};
    `};

    ${n==="small"&&l.css`
      font-size: ${e.fontSizes.small};
      line-height: ${e.lineHeights.small};
      height: ${e.space[10]};
      padding: 0 ${e.space["3.5"]};
      svg {
        display: block;
        width: ${e.space[3]};
        height: ${e.space[3]};
        color: ${H(a,"text")};
      }
    `}

    ${n==="medium"&&l.css`
      font-size: ${e.fontSizes.body};
      line-height: ${e.lineHeights.body};
      height: ${e.space[12]};
      padding: 0 ${e.space[4]};
      svg {
        display: block;
        width: ${e.space[4]};
        height: ${e.space[4]};
        color: ${H(a,"text")};
      }
    `}

    &:disabled svg {
      color: ${H("disabled","text")};
    }

    ${(i==="circle"||i==="rounded")&&l.css`
      border-radius: ${e.radii.full};
    `}

    ${(i==="circle"||i==="square")&&n==="small"&&l.css`
      width: ${e.space[10]};
    `}

    ${(i==="circle"||i==="square")&&n==="medium"&&l.css`
      width: ${e.space[12]};
    `}

    ${c&&l.css`
      padding: 0 ${e.space[12]};
    `}

    ${u&&l.css`
      width: ${e.space[u]};
    `}
  `),tn=s.default.div(({$fullWidth:e})=>l.css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    ${e&&l.css`
      width: 100%;
    `}
  `),rn=s.default.div(({theme:e})=>l.css`
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    padding-right: ${e.space[3]};

    display: flex;
    align-items: center;
    justify-content: flex-end;
    pointer-events: none;
  `),on=s.default.div(({theme:e,$visible:r})=>l.css`
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
  `),ln=s.default.div`
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
`,ze=t.forwardRef(({children:e,disabled:r,href:o,prefix:n,loading:a,rel:i,shape:c,size:u="medium",suffix:d,tabIndex:p,target:b,colorStyle:f="accentPrimary",type:g="button",zIndex:h,onClick:y,pressed:x=!1,shadow:C=!1,width:P,fullWidthContent:w,count:v,shouldShowTooltipIndicator:m,as:$,...S},T)=>{const R=t.createElement(tn,{$fullWidth:w},e),M=r?"greyPrimary":"backgroundPrimary";let G;if(c==="circle"||c==="square")G=a?t.createElement(ue,{color:M}):R;else{const A=!!n,_=!A&&!d,U=!A&&!!d;let F=n;a&&A?F=t.createElement(ue,{color:M}):a&&_&&(F=t.createElement(ue,{color:M}));let Q=d;a&&U&&(Q=t.createElement(ue,{color:M})),G=t.createElement(t.Fragment,null,!!F&&F,R,!!Q&&Q)}return t.createElement(en,{...S,$colorStyle:f,$hasCounter:!!v,$pressed:x,$shadow:C,$shape:c,$size:u,$width:P,as:$,disabled:r,href:o,position:h&&"relative",ref:T,rel:i,tabIndex:p,target:b,type:g,zIndex:h,onClick:y},m&&t.createElement(ln,{"data-testid":"tooltip-indicator"},"?"),G,t.createElement(rn,null,t.createElement(on,{$visible:!!v},v)))});ze.displayName="Button";const nn=s.default.div(({theme:e})=>l.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[4]};

    padding: ${e.space[4]};
    border-radius: ${e.radii["2xLarge"]};
    background-color: ${e.colors.backgroundPrimary};
    border: 1px solid ${e.colors.border};

    ${W.md.min(l.css`
        padding: ${e.space[6]};
      `)}
  `),an=s.default.div(({theme:e})=>l.css`
    width: calc(100% + 2 * ${e.space[4]});
    height: 1px;
    background: ${e.colors.border};
    margin: 0 -${e.space[4]};
    ${W.md.min(l.css`
        margin: 0 -${e.space[6]};
        width: calc(100% + 2 * ${e.space[6]});
      `)}
  `),Ne=({title:e,children:r,...o})=>t.createElement(nn,{...o},e&&t.createElement(O,{fontVariant:"headingFour"},e),r);Ne.displayName="Card";Ne.Divider=an;const Se=350,Ut=(e,r,o,n,a)=>{const i=r.top-o.height-n-a,c=r.left-o.width-n-a,u=window.innerWidth-r.left-r.width-o.width-n-a,d=window.innerHeight-r.top-r.height-o.height-n-a;return e==="top"&&i<0&&d>i?"bottom":e==="right"&&u<0&&c>u?"left":e==="bottom"&&d<0&&i>d?"top":e==="left"&&c<0&&u>c?"right":e},cn=(e,r,o,n)=>{let a="";o==="top"?a=`translate(0, -${r}px)`:o==="right"?a=`translate(${e}px, 0)`:o==="bottom"?a=`translate(0, ${r}px)`:a=`translate(-${e}px, 0);`;let i="";return n==="top"?i=`translate(0, -${r}px)`:n==="right"?i=`translate(${e}px, 0)`:n==="bottom"?i=`translate(0, ${r}px)`:i=`translate(-${e}px, 0);`,{translate:a,mobileTranslate:i}},sn=s.default.div(({$state:e,$translate:r,$mobileTranslate:o,$width:n,$mobileWidth:a,$x:i,$y:c})=>[l.css`
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
    width: ${a}px;
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
      left: ${i}px;
    `}

    ${e==="entering"&&l.css`
      display: block;
      visibility: visible;
      opacity: 1;
      transition: opacity ${Se}ms ease-in-out;
      top: ${c}px;
      left: ${i}px;
    `}

      ${e==="entered"&&l.css`
      display: block;
      visibility: visible;
      opacity: 1;
      transition: opacity ${Se}ms ease-in-out;
      top: ${c}px;
      left: ${i}px;
    `}

      ${e==="exiting"&&l.css`
      display: block;
      visibility: visible;
      opacity: 0;
      transition: all ${Se}ms ease-in-out;
      top: ${c}px;
      left: ${i}px;
    `}
  `,W.md.min(l.css`
    width: ${n}px;
    transform: translate3d(0, 0, 0) ${r};
  `)]),Ie=({popover:e,placement:r="top",mobilePlacement:o="top",animationFn:n,anchorRef:a,onShowCallback:i,width:c=250,mobileWidth:u=150,useIdealPlacement:d=!1,additionalGap:p=0})=>{const b=t.useRef(null),[f,g]=t.useState({top:100,left:100,horizontalClearance:100,verticalClearance:100,idealPlacement:r,idealMobilePlacement:o}),h=t.useCallback(()=>{const $=a==null?void 0:a.current,S=$==null?void 0:$.getBoundingClientRect(),T=b==null?void 0:b.current,R=T==null?void 0:T.getBoundingClientRect();if(!R||!S)return;const M=window.scrollY+S.y+S.height/2-R.height/2,G=S.x+S.width/2-R.width/2,A=R.width/2+S.width/2+p+10,_=R.height/2+S.height/2+p+10;r==="bottom"&&console.log(R.height,S.height,p);const U=Ut(r,S,R,0,0),F=Ut(o,S,R,0,0);g({top:M,left:G,horizontalClearance:A,verticalClearance:_,idealPlacement:U,idealMobilePlacement:F})},[r,o,p,a]),y=t.useMemo(()=>n?($,S,T,R)=>n($,S,T,R):($,S,T,R)=>cn($,S,T,R),[n]);t.useEffect(()=>{h();const $=()=>{h(),C(!0),i==null||i()},S=()=>{C(!1)},T=()=>{h()},R=a==null?void 0:a.current;return R==null||R.addEventListener("mouseenter",$),R==null||R.addEventListener("mouseleave",S),addEventListener("resize",T),()=>{R==null||R.removeEventListener("mouseenter",$),R==null||R.removeEventListener("mouseleave",S),removeEventListener("resize",T)}},[r,o,h,p,i,a]);const[x,C]=lt.useTransition({preEnter:!0,exit:!0,mountOnEnter:!0,unmountOnExit:!0,timeout:{enter:Se,exit:Se}}),P=d?f.idealPlacement:r,w=d?f.idealMobilePlacement:o,{translate:v,mobileTranslate:m}=y(f.horizontalClearance,f.verticalClearance,P,w);return hr.createPortal(t.createElement(sn,{$mobileTranslate:m,$mobileWidth:u,$state:x,$translate:v,$width:c,$x:f.left,$y:f.top,"data-testid":"popoverContainer",id:"popoverContainer",ref:b},t.cloneElement(e,{placement:P,mobilePlacement:w})),document==null?void 0:document.body)};Ie.displayName="DynamicPopover";const dn=(e,r,o,n)=>{const a=i=>{e.current&&!e.current.contains(i.target)&&o()};he.useEffect(()=>(n?document.addEventListener(r,a):document.removeEventListener(r,a),()=>{document.removeEventListener(r,a)}),[n])},un=typeof window<"u"?t.useLayoutEffect:t.useEffect,et={serverHandoffComplete:!1},pn=()=>{const[e,r]=t.useState(et.serverHandoffComplete);return t.useEffect(()=>{e||r(!0)},[e]),t.useEffect(()=>{et.serverHandoffComplete||(et.serverHandoffComplete=!0)},[]),e},fn="thorin";let gn=0;function Yt(){return++gn}const st=()=>{const e=pn(),[r,o]=t.useState(e?Yt:null);return un(()=>{r===null&&o(Yt())},[r]),r!=null?`${fn}`+r:void 0},Zr=({description:e,error:r,id:o}={})=>{const n=st();return t.useMemo(()=>{const a=`${n}${o?`-${o}`:""}`,i=`${a}-label`;let c,u;e&&(u={id:`${a}-description`},c=u.id);let d;return r&&(d={id:`${a}-error`},c=`${c?`${c} `:""}${d.id}`),{content:{"aria-describedby":c,"aria-labelledby":i,id:a},description:u,error:d,label:{htmlFor:a,id:i}}},[n,e,r,o])},qt=t.createContext(void 0),mn=s.default.label(({theme:e,$disabled:r,$readOnly:o,$required:n})=>l.css`
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

    ${n&&l.css`
      ::after {
        content: ' *';
        white-space: pre;
        color: ${e.colors.red};
      }
    `}
  `),bn=s.default(O)(()=>l.css``),$n=s.default(O)(()=>l.css`
    flex-basis: auto;
    flex-grow: 0;
    flex-shrink: 2;
    text-align: right;
    overflow: hidden;
    position: relative;
  `),hn=s.default.div(({theme:e,$inline:r})=>l.css`
    display: flex;
    align-items: center;
    padding: 0 ${r?"0":e.space[2]};
    overflow: hidden;
    gap: ${e.space[2]};
  `),wn=({ids:e,label:r,labelSecondary:o,required:n,hideLabel:a,inline:i,disabled:c,readOnly:u})=>{const d=t.createElement(hn,{$inline:i},t.createElement(mn,{$disabled:c,$readOnly:u,$required:n,...e.label},t.createElement(bn,{color:"greyPrimary",ellipsis:!0,fontVariant:"bodyBold"},r,n&&t.createElement(fe,null,"required"))),o&&t.createElement($n,{color:"greyPrimary",ellipsis:!0,fontVariant:"extraSmall"},o));return a?t.createElement(fe,null,d):d},vn=s.default(O)(({theme:e,$inline:r})=>l.css`
    padding: 0 ${r?"0":e.space[2]};
    width: 100%;
    overflow: hidden;
  `),yn=s.default(O)(({theme:e,$inline:r})=>`
    padding: 0 ${r?"0":e.space[2]};
`),En=({ids:e,error:r,description:o,hideLabel:n,inline:a,disabled:i})=>n?null:r?t.createElement(yn,{"aria-live":"polite",...e.error,$inline:a,color:"redPrimary",fontVariant:"smallBold"},r):o?t.createElement(vn,{$inline:a,...e.description,color:i?"greyPrimary":"textPrimary",colorScheme:i?"secondary":"primary",ellipsis:!0,fontVariant:"small"},o):null,Xt=s.default.div(({theme:e,$inline:r,$width:o,$reverse:n})=>l.css`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: 'normal';
    gap: ${e.space[2]};
    width: ${e.space[o]};

    ${r&&l.css`
      flex-direction: ${n?"row-reverse":"row"};
      align-items: 'flex-start';
    `}
  `),xn=s.default.div(({theme:e})=>l.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[1]};
    flex: 1;
    overflow: hidden;
  `),te=({children:e,description:r,error:o,hideLabel:n,id:a,label:i,labelSecondary:c,required:u,inline:d,readOnly:p,width:b="full",reverse:f=!1,disabled:g,...h})=>{const y=Zr({id:a,description:r!==void 0,error:o!==void 0});let x;typeof e=="function"?x=t.createElement(qt.Provider,{value:y},t.createElement(qt.Consumer,null,w=>e(w))):e?x=t.cloneElement(e,y.content):x=e;const C=t.createElement(wn,{...h,ids:y,label:i,labelSecondary:c,required:u,hideLabel:n,inline:d,disabled:g,readOnly:p}),P=t.createElement(En,{ids:y,error:o,description:r,hideLabel:n,inline:d,disabled:g});return d?t.createElement(Xt,{$inline:d,$reverse:f,$width:b},t.createElement("div",null,x),t.createElement(xn,null,C,P)):t.createElement(Xt,{$width:b},C,x,P)};te.displayName="Field";const Cn=(e,r)=>{const o=r==null?void 0:r.split(", ");if(!o)return!0;const n=Kt(e);return o.some(a=>{const i=Kt(a);return i.type===n.type&&i.subtype===n.subtype})},Kt=e=>{const r=e.split("/");return{type:r[0],subtype:r[1]}},Qt={},dt=t.forwardRef(({accept:e,autoFocus:r,children:o,defaultValue:n,disabled:a,error:i,id:c,maxSize:u,name:d,required:p,tabIndex:b,onBlur:f,onChange:g,onError:h,onFocus:y,onReset:x,...C},P)=>{const w=t.useRef(null),v=P||w,[m,$]=t.useState(Qt),S=i?!0:void 0,T=Zr({id:c,error:S}),R=t.useCallback((V,L)=>{if(u&&V.size>u*1e6){L==null||L.preventDefault(),h&&h(`File is ${(V.size/1e6).toFixed(2)} MB. Must be smaller than ${u} MB`);return}$(B=>({...B,file:V,name:V.name,type:V.type})),g&&g(V)},[u,g,h]),M=t.useCallback(V=>{const L=V.target.files;!(L!=null&&L.length)||R(L[0],V)},[R]),G=t.useCallback(V=>{V.preventDefault(),$(L=>({...L,droppable:!0}))},[]),A=t.useCallback(V=>{V.preventDefault(),$(L=>({...L,droppable:!1}))},[]),_=t.useCallback(V=>{V.preventDefault(),$(B=>({...B,droppable:!1}));let L;if(V.dataTransfer.items){const B=V.dataTransfer.items;if((B==null?void 0:B[0].kind)!=="file"||(L=B[0].getAsFile(),!L))return}else{const B=V.dataTransfer.files;if(!(B!=null&&B.length))return;L=B[0]}!Cn(L.type,e)||R(L,V)},[R,e]),U=t.useCallback(V=>{$(L=>({...L,focused:!0})),y&&y(V)},[y]),F=t.useCallback(V=>{$(L=>({...L,focused:!1})),f&&f(V)},[f]),Q=t.useCallback(V=>{V.preventDefault(),$(Qt),v.current&&(v.current.value=""),x&&x()},[v,x]);return t.useEffect(()=>{!n||$({previewUrl:n.url,name:n.name,type:n.type})},[]),t.useEffect(()=>{if(!m.file)return;const V=URL.createObjectURL(m.file);return $(L=>({...L,previewUrl:V})),()=>URL.revokeObjectURL(V)},[m.file]),t.createElement("div",null,t.createElement(fe,null,t.createElement("input",{...C,...T.content,accept:e,"aria-invalid":S,autoFocus:r,disabled:a,name:d,ref:v,required:p,tabIndex:b,type:"file",onBlur:F,onChange:M,onFocus:U})),t.createElement("label",{...T.label,onDragLeave:A,onDragOver:G,onDrop:_},o({...m,reset:Q})))});dt.displayName="FileInput";const kn=s.default.div(({theme:e,$textAlign:r,$textTransform:o,$level:n,$responsive:a,$color:i})=>l.css`
    ${r?l.css`
          text-align: ${r};
        `:""}
    ${o?l.css`
          text-transform: ${o};
        `:""}

  ${()=>{switch(n){case"1":return l.css`
            font-size: ${e.fontSizes.headingOne};
            font-weight: ${e.fontWeights.extraBold};
            line-height: ${e.lineHeights.headingOne};
          `;case"2":return l.css`
            font-size: ${e.fontSizes.headingTwo};
            font-weight: ${e.fontWeights.bold};
            line-height: ${e.lineHeights.headingTwo};
          `;default:return""}}}
  
  ${()=>{if(a)switch(n){case"1":return l.css`
              font-size: ${e.fontSizes.headingTwo};
              line-height: ${e.lineHeights.headingTwo};
              ${W.lg.min(l.css`
                font-size: ${e.fontSizes.headingOne};
                line-height: ${e.lineHeights.headingOne};
              `)}
            `;case"2":return l.css`
              font-size: ${e.fontSizes.extraLarge};
              line-height: ${e.lineHeights.extraLarge};
              ${W.sm.min(l.css`
                font-size: ${e.fontSizes.headingTwo};
                line-height: ${e.lineHeights.headingTwo};
              `)}
            `;default:return""}}}

  ${i&&l.css`
      color: ${Lr(i)};
    `}
  
  font-family: ${e.fonts.sans};
  `),We=t.forwardRef(({align:e,children:r,as:o="h1",id:n,level:a="2",responsive:i,transform:c,color:u="text",...d},p)=>t.createElement(kn,{...d,$color:u,$level:a,$responsive:i,$textAlign:e,$textTransform:c,as:o,id:n,ref:p},r));We.displayName="Heading";const _e=({children:e,className:r,el:o="div"})=>{const[n]=t.useState(document.createElement(o));return r&&n.classList.add(r),t.useEffect(()=>(document.body.appendChild(n),()=>{document.body.removeChild(n)}),[]),vl.createPortal(e,n)};_e.displayName="Portal";const Sn=()=>{const[e,r]=he.useState(!1),o=n=>{navigator.clipboard.writeText(n),r(!0)};return he.useEffect(()=>{let n;return e&&(n=setTimeout(()=>r(!1),1500)),()=>clearTimeout(n)},[e]),{copy:o,copied:e}},Rn=s.default.button(({theme:e,$inline:r})=>l.css`
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
  `),Pn=s.default.div(({theme:e,$inline:r,$size:o})=>l.css`
    display: flex;
    gap: ${e.space[2]};
    align-items: flex-start;
    width: ${o==="large"?e.space[30]:e.space["22.5"]};
    flex: 0 0 ${o==="large"?e.space[30]:e.space["22.5"]};

    ${r&&l.css`
      width: fit-content;
      flex: initial;
    `}
  `),Vn=s.default.div(({theme:e,$inline:r})=>l.css`
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
  `),Jt=s.default(O)(()=>l.css`
    text-align: left;
    width: 100%;
  `),Ln=s.default.div(({theme:e})=>l.css`
    svg {
      display: block;
      width: ${e.space[5]};
      height: ${e.space[5]};
    }
  `),Zn=s.default(O)(({$inline:e})=>l.css`
    flex: 1;
    text-align: left;
    word-break: break-all;

    ${e&&l.css`
      word-break: initial;
    `}
  `),Mn=s.default.svg(({theme:e,$rotate:r})=>l.css`
    display: block;
    margin-top: ${e.space[1]};
    width: ${e.space[3]};
    height: ${e.space[3]};
    color: ${e.colors.greyPrimary};
    ${r&&l.css`
      transform: rotate(45deg);
    `}
  `),ut=({link:e,size:r="small",inline:o=!1,icon:n,keyLabel:a,keySublabel:i,value:c,children:u,...d})=>{const{copy:p,copied:b}=Sn(),f=e?"a":void 0,g=!!n||!!a,h=!!a||!!i,y=typeof a=="string"?t.createElement(Jt,{$inline:o,color:"grey",ellipsis:!o,fontVariant:r==="large"?"bodyBold":"smallBold"},a):a,x=typeof i=="string"?t.createElement(Jt,{$inline:o,color:"grey",ellipsis:!o,fontVariant:r==="large"?"smallBold":"extraSmallBold"},i):i,C=e?{$rotate:!0,as:ht}:b?{as:Me}:{as:bt};return t.createElement(Rn,{$inline:o,as:f,href:e,rel:"nofollow noreferrer",target:"_blank",type:"button",onClick:()=>{e||p(c)},...d},g&&t.createElement(Pn,{$inline:o,$size:r},n&&t.createElement(Ln,null,n),h&&t.createElement(Vn,{$inline:o},y,x)),t.createElement(Zn,{$inline:o,fontVariant:r==="large"?"body":"small"},u),t.createElement(Mn,{...C}))};ut.displayName="RecordItem";const Gn=s.default.div(({theme:e,$showTop:r,$showBottom:o})=>l.css`
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
  `),er=s.default.div(()=>l.css`
    display: block;
    height: 0px;
  `),Mr=({hideDividers:e=!1,topTriggerPx:r=16,bottomTriggerPx:o=16,onReachedTop:n,onReachedBottom:a,children:i,...c})=>{const u=t.useRef(null),d=t.useRef(null),p=t.useRef(null),b=typeof e=="boolean"?e:!!(e!=null&&e.top),f=typeof e=="boolean"?e:!!(e!=null&&e.bottom),g=t.useRef({onReachedTop:n,onReachedBottom:a}),[h,y]=t.useState(!1),[x,C]=t.useState(!1),P=w=>{var $,S,T,R;const v=[!1,-1],m=[!1,-1];for(let M=0;M<w.length;M+=1){const G=w[M],A=G.target===d.current?v:m;G.time>A[1]&&(A[0]=G.isIntersecting,A[1]=G.time)}v[1]!==-1&&!b&&y(!v[0]),m[1]!==-1&&!f&&C(!m[0]),v[0]&&((S=($=g.current).onReachedTop)==null||S.call($)),m[0]&&((R=(T=g.current).onReachedBottom)==null||R.call(T))};return t.useEffect(()=>{const w=u.current,v=d.current,m=p.current;let $;return w&&v&&m&&($=new IntersectionObserver(P,{root:w,threshold:1,rootMargin:`${r}px 0px ${o}px 0px`}),$.observe(v),$.observe(m)),()=>{$.disconnect()}},[o,r]),t.useEffect(()=>{g.current={onReachedTop:n,onReachedBottom:a}},[n,a]),t.createElement(Gn,{$showBottom:x,$showTop:h,ref:u,...c},t.createElement(er,{"data-testid":"scrollbox-top-intersect",ref:d}),i,t.createElement(er,{"data-testid":"scrollbox-bottom-intersect",ref:p}))},Gr=t.createContext(void 0),pt=({children:e,loading:r})=>t.createElement(Gr.Provider,{value:r},e);pt.displayName="SkeletonGroup";const Tn=l.keyframes`
  to {
    background-position-x: -200%;
  }
`,Bn=s.default.div(({theme:e,$active:r})=>l.css`
    ${r&&l.css`
      background: ${e.colors.greyLight}
        linear-gradient(
          110deg,
          ${e.colors.greyLight} 8%,
          ${e.colors.greySurface} 18%,
          ${e.colors.greyLight} 33%
        );
      background-size: 200% 100%;
      animation: 1.5s ${Tn} infinite linear;
      border-radius: ${e.radii.medium};
      width: ${e.space.fit};
    `}
  `),On=s.default.span(({$active:e})=>l.css`
    display: block;
    ${e?l.css`
          visibility: hidden;
        `:""}
  `),ft=({as:e,children:r,loading:o,...n})=>{const a=t.useContext(Gr),i=o!=null?o:a;return t.createElement(Bn,{...n,$active:i,as:e},t.createElement(On,{$active:i},r))};ft.displayName="Skeleton";const An=s.default.div(({theme:e,$hover:r,$size:o,$colorStyle:n})=>l.css`
    align-items: center;
    display: flex;
    border-radius: ${e.radii.full};
    font-size: ${e.fontSizes.small};
    line-height: ${e.lineHeights.small};
    font-weight: ${e.fontWeights.bold};
    width: ${e.space.max};
    padding: ${e.space["0.5"]} ${e.space[2]};
    background: ${H(n,"background")};
    color: ${H(n,"text")};
    border: 1px solid ${H(n,"border")};
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
        background-color: ${H(n,"hover")};
      }
    `}
  `),Ue=({as:e="div",children:r,hover:o,size:n="small",colorStyle:a="accentSecondary",...i})=>t.createElement(An,{...i,$colorStyle:a,$hover:o,$size:n,as:e},r);Ue.displayName="Tag";const Le=({children:e,surface:r,onDismiss:o,noBackground:n=!1,className:a="modal",open:i})=>{const[c,u]=lt.useTransition({timeout:{enter:50,exit:300},mountOnEnter:!0,unmountOnExit:!0}),d=t.useRef(null),p=r||nt,b=f=>f.target===d.current&&o&&o();return t.useEffect(()=>{const{style:f,dataset:g}=document.body,h=()=>parseInt(g.backdrops||"0"),y=C=>g.backdrops=String(h()+C),x=(C,P,w)=>{f.width=C,f.position=P,f.top=w};if(u(i||!1),typeof window<"u"&&!n&&i)return h()===0&&x(`${document.body.clientWidth}px`,"fixed",`-${window.scrollY}px`),y(1),()=>{const C=parseFloat(f.top||"0")*-1;h()===1&&(x("","",""),window.scroll({top:C})),y(-1)}},[i,n]),c!=="unmounted"?t.createElement(_e,{className:a},o&&t.createElement(p,{$empty:n,$state:c,ref:d,onClick:b}),e({state:c})):null};Le.displayName="Backdrop";const Hn=(e="",r=10,o=5,n=5)=>e.length<r?e:`${e.slice(0,o)}...${e.slice(-n)}`,re=(e,r)=>e["data-testid"]?String(e["data-testid"]):r,jn=s.default.input(({theme:e,$colorStyle:r="accentPrimary"})=>l.css`
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
  `),gt=t.forwardRef(({description:e,disabled:r,error:o,hideLabel:n,id:a,label:i,labelSecondary:c,inline:u=!0,name:d,required:p,tabIndex:b,value:f,checked:g,width:h,onBlur:y,onChange:x,onFocus:C,colorStyle:P="accentPrimary",...w},v)=>{const m=t.useRef(null),$=v||m;return t.createElement(te,{description:e,disabled:r,error:o,hideLabel:n,id:a,inline:u,label:i,labelSecondary:c,required:p,width:h},t.createElement(jn,{...w,"data-testid":re(w,"checkbox"),"aria-invalid":o?!0:void 0,type:"checkbox",$colorStyle:P,checked:g,disabled:r,name:d,ref:$,tabIndex:b,value:f,onBlur:y,onChange:x,onFocus:C}))});gt.displayName="Checkbox";const Fn=s.default.div(({theme:e,$color:r})=>l.css`
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
  `),Dn=s.default.input(()=>l.css`
    position: absolute;
    width: 1px;
    height: 1px;
  `),zn=s.default.label(({theme:e})=>l.css`
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
  `),Nn=s.default.div(({theme:e})=>l.css`
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
  `),In=s.default.div(()=>l.css`
    display: flex;
    flex-direction: column;
  `),mt=t.forwardRef(({label:e,subLabel:r,name:o,color:n="blue",disabled:a,...i},c)=>{const u=t.useRef(null),d=c||u,p=st(),b=a?"grey":"text";return t.createElement(Fn,{$color:n},t.createElement(Dn,{disabled:a,id:p,name:o,type:"checkbox",...i,ref:d}),t.createElement(zn,{htmlFor:p,id:"permissions-label"},t.createElement(Nn,{id:"circle"},t.createElement(Me,null)),t.createElement(In,null,t.createElement(O,{color:b,fontVariant:"bodyBold"},e),r&&t.createElement(O,{color:b,fontVariant:"small"},r))))});mt.displayName="CheckboxRow";const Tr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M4.5 23.225C1.173 12.416 12.09 2.703 22.438 7.264l65.03 28.657c10.502 4.628 10.502 19.53 0 24.158l-65.03 28.657c-10.348 4.56-21.265-5.153-17.94-15.96L12.122 48 4.5 23.225ZM22.83 54l-6.86 22.304c-.303.983.69 1.866 1.63 1.451l65.03-28.657c.31-.136.454-.297.541-.437.102-.166.175-.395.175-.661s-.073-.495-.175-.661c-.087-.14-.232-.301-.54-.437L17.6 18.245c-.941-.415-1.934.468-1.631 1.45L22.83 42h21.72a6 6 0 0 1 0 12H22.83Z",clipRule:"evenodd"})),Ze=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M48 30a6 6 0 0 1 6 6v12a6 6 0 0 1-12 0V36a6 6 0 0 1 6-6Zm6 34a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M58.873 7.242c-5.757-6.514-15.988-6.514-21.746 0-15.715 17.78-27.914 38.623-35.65 61.07-2.866 8.315 2.358 17.173 10.902 18.842 23.418 4.575 47.824 4.575 71.242 0 8.544-1.669 13.768-10.527 10.903-18.841-7.737-22.448-19.936-43.29-35.651-61.071Zm-12.754 7.947c.98-1.11 2.782-1.11 3.762 0C64.564 31.8 75.96 51.275 83.18 72.223c.461 1.34-.38 2.865-1.858 3.154-21.9 4.278-44.743 4.278-66.642 0-1.478-.289-2.32-1.815-1.858-3.154 7.22-20.948 18.615-40.422 33.298-57.034Z",clipRule:"evenodd"})),Br=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M22 36a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm16 0a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm22-6a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M18 8C8.059 8 0 16.059 0 26v44c0 9.941 8.059 18 18 18h60c9.941 0 18-8.059 18-18V26c0-9.941-8.059-18-18-18H18Zm-6 18a6 6 0 0 1 6-6h60a6 6 0 0 1 6 6v44a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V26Z",clipRule:"evenodd"})),Or=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M26 72a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm28-6a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm16 6a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM26 40a6 6 0 0 0 0 12h44a6 6 0 0 0 0-12H26Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M20 10a6 6 0 0 1 12 0v2h32v-2a6 6 0 0 1 12 0v2h2c9.941 0 18 8.059 18 18v44c0 9.941-8.059 18-18 18H18C8.059 92 0 83.941 0 74V30c0-9.941 8.059-18 18-18h2v-2Zm0 16v-2h-2a6 6 0 0 0-6 6v44a6 6 0 0 0 6 6h60a6 6 0 0 0 6-6V30a6 6 0 0 0-6-6h-2v2a6 6 0 0 1-12 0v-2H32v2a6 6 0 0 1-12 0Z",clipRule:"evenodd"})),Ar=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 30c-10.493 0-19 8.507-19 19s8.507 19 19 19 19-8.507 19-19-8.507-19-19-19Zm-7 19a7 7 0 1 1 14 0 7 7 0 0 1-14 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M33.504 8a18 18 0 0 0-17.47 13.66l-1.665 6.706C6.169 30.046 0 37.303 0 46v24c0 9.941 8.059 18 18 18h60c9.941 0 18-8.059 18-18V46c0-8.697-6.168-15.954-14.369-17.634l-1.666-6.706A18 18 0 0 0 62.496 8H33.504ZM16.777 40.122l7.413-1.518 3.49-14.05A6 6 0 0 1 33.505 20h28.992a6 6 0 0 1 5.823 4.553l3.491 14.05 7.413 1.52A6.006 6.006 0 0 1 84 46v24a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V46a6.006 6.006 0 0 1 4.777-5.878Z",clipRule:"evenodd"})),Me=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M88.455 28.019a6 6 0 1 0-8.91-8.038l-41.852 46.4L16.16 45.676a6 6 0 0 0-8.318 8.65L33.82 79.304l.094.09c.508.472 1.077.84 1.68 1.104a6.017 6.017 0 0 0 5.183-.177 5.984 5.984 0 0 0 1.7-1.325l45.98-50.977Z"})),Hr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M71.243 32.757a6 6 0 0 1 0 8.486l-24.98 24.98A5.978 5.978 0 0 1 44.7 67.36a6.017 6.017 0 0 1-5.18.105 5.976 5.976 0 0 1-1.611-1.076L24.93 54.409a6 6 0 0 1 8.14-8.818l8.764 8.09 20.923-20.924a6 6 0 0 1 8.486 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Zm0-12c19.882 0 36-16.118 36-36S67.882 12 48 12 12 28.118 12 48s16.118 36 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),jr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 28c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20Zm-8 20a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 0c-.693 0-1.383.015-2.069.044-5.799.246-10.449 3.635-13.244 7.724l-2.594 3.795c-.39.571-1.06 1.191-2.099 1.793-1.033.598-1.896.864-2.594.918l-4.591.35c-4.926.375-10.176 2.695-13.292 7.576a47.964 47.964 0 0 0-2.091 3.614c-2.686 5.144-2.07 10.862.07 15.319l2.002 4.17c.3.627.502 1.51.502 2.697 0 1.188-.201 2.07-.502 2.697l-2.002 4.17c-2.14 4.457-2.756 10.175-.07 15.32A47.967 47.967 0 0 0 7.517 73.8c3.116 4.881 8.366 7.201 13.292 7.577l4.591.35c.698.053 1.561.32 2.594.917 1.04.602 1.709 1.222 2.1 1.793l2.593 3.795c2.795 4.089 7.445 7.478 13.244 7.724a48.674 48.674 0 0 0 4.138 0c5.799-.246 10.449-3.635 13.244-7.724l2.594-3.795c.39-.571 1.06-1.191 2.099-1.793 1.033-.598 1.897-.864 2.594-.918l4.591-.35c4.926-.375 10.176-2.695 13.292-7.576a47.949 47.949 0 0 0 2.091-3.614c2.686-5.144 2.07-10.862-.07-15.319l-2.002-4.17C88.202 50.07 88 49.187 88 48c0-1.188.201-2.07.502-2.697l2.002-4.17c2.14-4.457 2.756-10.175.07-15.32a47.949 47.949 0 0 0-2.09-3.613c-3.118-4.88-8.368-7.2-13.294-7.577l-4.591-.35c-.697-.053-1.561-.32-2.594-.917-1.04-.602-1.709-1.222-2.1-1.793l-2.593-3.795C60.518 3.679 55.868.29 50.069.044A48.724 48.724 0 0 0 48 0Zm-1.56 12.033a36.657 36.657 0 0 1 3.12 0c1.209.051 2.683.805 3.846 2.507L56 18.335c1.67 2.444 3.875 4.18 5.997 5.408 2.136 1.236 4.737 2.27 7.691 2.496l4.592.35c2.052.156 3.44 1.052 4.089 2.069.56.878 1.084 1.782 1.568 2.709.556 1.065.641 2.714-.25 4.572l-2.003 4.17C76.406 42.773 76 45.54 76 48s.406 5.228 1.684 7.89l2.002 4.17c.892 1.859.807 3.508.25 4.573a36.006 36.006 0 0 1-1.567 2.71c-.65 1.016-2.037 1.912-4.09 2.068l-4.59.35c-2.954.225-5.556 1.26-7.692 2.496-2.122 1.228-4.326 2.964-5.997 5.408l-2.594 3.795c-1.163 1.702-2.637 2.456-3.847 2.507a36.654 36.654 0 0 1-3.118 0c-1.21-.051-2.684-.805-3.847-2.507L40 77.665c-1.67-2.444-3.875-4.18-5.997-5.408-2.136-1.236-4.737-2.27-7.691-2.496l-4.592-.35c-2.052-.156-3.44-1.052-4.089-2.069a35.972 35.972 0 0 1-1.568-2.709c-.556-1.065-.641-2.714.25-4.572l2.003-4.17C19.594 53.227 20 50.46 20 48s-.406-5.228-1.684-7.89l-2.002-4.17c-.892-1.859-.807-3.508-.25-4.573a35.972 35.972 0 0 1 1.567-2.71c.65-1.016 2.037-1.912 4.09-2.068l4.59-.35c2.955-.225 5.556-1.26 7.692-2.496 2.122-1.228 4.326-2.964 5.997-5.408l2.594-3.795c1.163-1.702 2.637-2.456 3.847-2.507Z",clipRule:"evenodd"})),Fr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M25.856 20.256c1.825-.139 3.558-.79 5.143-1.707 1.58-.914 3.017-2.093 4.048-3.6l2.594-3.795c1.979-2.895 5.041-4.967 8.545-5.116a42.712 42.712 0 0 1 3.628 0c3.504.15 6.566 2.22 8.545 5.116l2.594 3.795c1.031 1.507 2.467 2.686 4.048 3.6 1.585.917 3.317 1.568 5.143 1.707l4.591.35c3.49.266 6.808 1.874 8.69 4.823a41.963 41.963 0 0 1 1.83 3.161c1.622 3.105 1.356 6.788-.16 9.946l-2.002 4.17C82.303 44.351 82 46.176 82 48c0 1.824.304 3.65 1.093 5.294l2.002 4.17c1.516 3.158 1.782 6.84.16 9.946a41.963 41.963 0 0 1-1.83 3.161c-1.882 2.949-5.2 4.557-8.69 4.823l-4.591.35c-1.826.139-3.558.79-5.143 1.707-1.58.914-3.017 2.093-4.048 3.6l-2.594 3.795c-1.979 2.895-5.04 4.967-8.545 5.115a42.662 42.662 0 0 1-3.628 0c-3.504-.148-6.566-2.22-8.545-5.115l-2.594-3.795c-1.031-1.507-2.467-2.686-4.048-3.6-1.585-.917-3.317-1.568-5.143-1.707l-4.591-.35c-3.49-.266-6.808-1.874-8.69-4.823a41.963 41.963 0 0 1-1.83-3.161c-1.622-3.105-1.356-6.788.16-9.946l2.002-4.17C13.697 51.649 14 49.824 14 48c0-1.824-.304-3.65-1.093-5.294l-2.002-4.17c-1.516-3.158-1.782-6.84-.16-9.946a41.963 41.963 0 0 1 1.83-3.161c1.882-2.949 5.2-4.557 8.69-4.823l4.591-.35ZM48 61c7.18 0 13-5.82 13-13s-5.82-13-13-13-13 5.82-13 13 5.82 13 13 13Z",clipRule:"evenodd",opacity:.35}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 28c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20Zm-8 20a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 0c-.693 0-1.383.015-2.069.044-5.799.246-10.449 3.635-13.244 7.724l-2.594 3.795c-.39.571-1.06 1.191-2.099 1.793-1.033.598-1.896.864-2.594.918l-4.591.35c-4.926.375-10.176 2.695-13.292 7.576a47.964 47.964 0 0 0-2.091 3.614c-2.686 5.144-2.07 10.862.07 15.319l2.002 4.17c.3.627.502 1.51.502 2.697 0 1.188-.201 2.07-.502 2.697l-2.002 4.17c-2.14 4.457-2.756 10.175-.07 15.32A47.967 47.967 0 0 0 7.517 73.8c3.116 4.881 8.366 7.201 13.292 7.577l4.591.35c.698.053 1.561.32 2.594.917 1.04.602 1.709 1.222 2.1 1.793l2.593 3.795c2.795 4.089 7.445 7.478 13.244 7.724a48.674 48.674 0 0 0 4.138 0c5.799-.246 10.449-3.635 13.244-7.724l2.594-3.795c.39-.571 1.06-1.191 2.099-1.793 1.033-.598 1.897-.864 2.594-.918l4.591-.35c4.926-.375 10.176-2.695 13.292-7.576a47.949 47.949 0 0 0 2.091-3.614c2.686-5.144 2.07-10.862-.07-15.319l-2.002-4.17C88.202 50.07 88 49.187 88 48c0-1.188.201-2.07.502-2.697l2.002-4.17c2.14-4.457 2.756-10.175.07-15.32a47.949 47.949 0 0 0-2.09-3.613c-3.118-4.88-8.368-7.2-13.294-7.577l-4.591-.35c-.697-.053-1.561-.32-2.594-.917-1.04-.602-1.709-1.222-2.1-1.793l-2.593-3.795C60.518 3.679 55.868.29 50.069.044A48.724 48.724 0 0 0 48 0Zm-1.56 12.033a36.657 36.657 0 0 1 3.12 0c1.209.051 2.683.805 3.846 2.507L56 18.335c1.67 2.444 3.875 4.18 5.997 5.408 2.136 1.236 4.737 2.27 7.691 2.496l4.592.35c2.052.156 3.44 1.052 4.089 2.069.56.878 1.084 1.782 1.568 2.709.556 1.065.641 2.714-.25 4.572l-2.003 4.17C76.406 42.773 76 45.54 76 48s.406 5.228 1.684 7.89l2.002 4.17c.892 1.859.807 3.508.25 4.573a36.006 36.006 0 0 1-1.567 2.71c-.65 1.016-2.037 1.912-4.09 2.068l-4.59.35c-2.954.225-5.556 1.26-7.692 2.496-2.122 1.228-4.326 2.964-5.997 5.408l-2.594 3.795c-1.163 1.702-2.637 2.456-3.847 2.507a36.654 36.654 0 0 1-3.118 0c-1.21-.051-2.684-.805-3.847-2.507L40 77.665c-1.67-2.444-3.875-4.18-5.997-5.408-2.136-1.236-4.737-2.27-7.691-2.496l-4.592-.35c-2.052-.156-3.44-1.052-4.089-2.069a35.972 35.972 0 0 1-1.568-2.709c-.556-1.065-.641-2.714.25-4.572l2.003-4.17C19.594 53.227 20 50.46 20 48s-.406-5.228-1.684-7.89l-2.002-4.17c-.892-1.859-.807-3.508-.25-4.573a35.972 35.972 0 0 1 1.567-2.71c.65-1.016 2.037-1.912 4.09-2.068l4.59-.35c2.955-.225 5.556-1.26 7.692-2.496 2.122-1.228 4.326-2.964 5.997-5.408l2.594-3.795c1.163-1.702 2.637-2.456 3.847-2.507Z",clipRule:"evenodd"})),bt=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M50 96c-7.732 0-14-6.268-14-14V42c0-7.732 6.268-14 14-14h24c7.732 0 14 6.268 14 14v40c0 7.732-6.268 14-14 14H50Zm-2-14a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V42a2 2 0 0 0-2-2H50a2 2 0 0 0-2 2v40Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M22 0C14.268 0 8 6.268 8 14v40c0 7.732 6.268 14 14 14a6 6 0 0 0 0-12 2 2 0 0 1-2-2V14a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2 6 6 0 0 0 12 0c0-7.732-6.268-14-14-14H22Z"})),Dr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M25.74 37.884C29.59 29.702 37.98 24 47.744 24 61.188 24 72 34.793 72 48S61.188 72 47.744 72a24.31 24.31 0 0 1-12.462-3.404 6 6 0 1 0-6.128 10.317A36.31 36.31 0 0 0 47.744 84C67.719 84 84 67.93 84 48S67.72 12 47.744 12a36.284 36.284 0 0 0-32.04 19.137l-2.012-6.034a6 6 0 0 0-11.384 3.794l7 21a6 6 0 0 0 7.674 3.766l20-7a6 6 0 0 0-3.964-11.326l-7.278 2.547Z"})),zr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M22 68a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm22-6a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm10 6a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M0 30c0-9.941 8.059-18 18-18h60c9.941 0 18 8.059 18 18v36c0 9.941-8.059 18-18 18H18C8.059 84 0 75.941 0 66V30Zm18-6a6 6 0 0 0-6 6v2h72v-2a6 6 0 0 0-6-6H18Zm-6 42V44h72v22a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6Z",clipRule:"evenodd"})),ye=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M17.757 26.243a6 6 0 1 1 8.486-8.486L48 39.515l21.757-21.758a6 6 0 1 1 8.486 8.486L56.485 48l21.758 21.757a6 6 0 1 1-8.486 8.486L48 56.485 26.243 78.243a6 6 0 1 1-8.486-8.486L39.515 48 17.757 26.243Z"})),Ge=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M66.243 29.757a6 6 0 0 1 0 8.486L56.485 48l9.758 9.757a6 6 0 1 1-8.486 8.486L48 56.485l-9.757 9.758a6 6 0 1 1-8.486-8.486L39.515 48l-9.758-9.757a6 6 0 1 1 8.486-8.486L48 39.515l9.757-9.758a6 6 0 0 1 8.486 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Zm0-12c19.882 0 36-16.118 36-36S67.882 12 48 12 12 28.118 12 48s16.118 36 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Nr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M96 48c0 26.51-21.49 48-48 48S0 74.51 0 48 21.49 0 48 0s48 21.49 48 48Zm-12 0c0 19.882-16.118 36-36 36a35.836 35.836 0 0 1-20.86-6.656l50.204-50.203A35.836 35.836 0 0 1 84 48ZM18.656 68.86l50.203-50.204A35.836 35.836 0 0 0 48 12c-19.882 0-36 16.118-36 36a35.836 35.836 0 0 0 6.655 20.86Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Ir=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M26 12a2 2 0 0 0-2 2v68a2 2 0 0 0 2 2h44a2 2 0 0 0 2-2V30.387a2 2 0 0 0-.608-1.436L54.485 12.564A2 2 0 0 0 53.093 12H26Zm-14 2c0-7.732 6.268-14 14-14h27.093a14 14 0 0 1 9.743 3.947l16.908 16.387A14 14 0 0 1 84 30.387V82c0 7.732-6.268 14-14 14H26c-7.732 0-14-6.268-14-14V14Z",clipRule:"evenodd"})),Wr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M0 22C0 9.85 9.85 0 22 0s22 9.85 22 22-9.85 22-22 22S0 34.15 0 22Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10ZM0 74c0-12.15 9.85-22 22-22s22 9.85 22 22-9.85 22-22 22S0 86.15 0 74Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10ZM74 0C61.85 0 52 9.85 52 22s9.85 22 22 22 22-9.85 22-22S86.15 0 74 0ZM64 22c0 5.523 4.477 10 10 10s10-4.477 10-10-4.477-10-10-10-10 4.477-10 10ZM52 74c0-12.15 9.85-22 22-22s22 9.85 22 22-9.85 22-22 22-22-9.85-22-22Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),_r=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M22 40c9.941 0 18-8.059 18-18S31.941 4 22 4 4 12.059 4 22s8.059 18 18 18Zm0 52c9.941 0 18-8.059 18-18s-8.059-18-18-18S4 64.059 4 74s8.059 18 18 18Zm70-70c0 9.941-8.059 18-18 18s-18-8.059-18-18S64.059 4 74 4s18 8.059 18 18ZM74 92c9.941 0 18-8.059 18-18s-8.059-18-18-18-18 8.059-18 18 8.059 18 18 18Z",clipRule:"evenodd",opacity:.35}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M0 22C0 9.85 9.85 0 22 0s22 9.85 22 22-9.85 22-22 22S0 34.15 0 22Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10ZM0 74c0-12.15 9.85-22 22-22s22 9.85 22 22-9.85 22-22 22S0 86.15 0 74Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10ZM74 0C61.85 0 52 9.85 52 22s9.85 22 22 22 22-9.85 22-22S86.15 0 74 0ZM64 22c0 5.523 4.477 10 10 10s10-4.477 10-10-4.477-10-10-10-10 4.477-10 10ZM52 74c0-12.15 9.85-22 22-22s22 9.85 22 22-9.85 22-22 22-22-9.85-22-22Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Ur=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"m52.243 88.243 34-34a6 6 0 1 0-8.486-8.486L54 69.515V12a6 6 0 0 0-12 0v57.515L18.243 45.757a6 6 0 0 0-8.486 8.486l33.986 33.985.014.015a6 6 0 0 0 8.486 0Z"})),Ye=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M52.243 70.243a6 6 0 0 1-8.486 0l-30-30a6 6 0 1 1 8.486-8.486L48 57.515l25.757-25.758a6 6 0 1 1 8.486 8.486l-30 30Z",clipRule:"evenodd"})),Yr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M42 28v25.515l-6.757-6.758a6 6 0 1 0-8.486 8.486l17 17a6.002 6.002 0 0 0 8.485 0l.006-.006 16.995-16.994a6 6 0 1 0-8.486-8.486L54 53.515V28a6 6 0 0 0-12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M0 48C0 21.49 21.49 0 48 0s48 21.49 48 48-21.49 48-48 48S0 74.51 0 48Zm12 0c0-19.882 16.118-36 36-36s36 16.118 36 36-16.118 36-36 36-36-16.118-36-36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),qr=({title:e,titleId:r,...o})=>t.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{d:"M4.00058 9.70969C4.23776 10.2167 4.82477 11.2188 4.82477 11.2188L11.611 0L4.98783 4.62508C4.59318 4.88836 4.2694 5.24473 4.04505 5.66275C3.7434 6.29338 3.58313 6.98229 3.57545 7.68131C3.56777 8.38033 3.71286 9.07259 4.00058 9.70969Z",fill:"#5298FF"}),t.createElement("path",{d:"M1.31159 13.4038C1.38637 14.477 1.68956 15.5217 2.20086 16.4682C2.71216 17.4146 3.41976 18.2409 4.27629 18.8917L11.6021 24C11.6021 24 7.01863 17.3944 3.15267 10.8215C2.76128 10.1271 2.49816 9.36782 2.37592 8.58011C2.3218 8.22341 2.3218 7.86059 2.37592 7.50389C2.27512 7.69068 2.07945 8.07313 2.07945 8.07313C1.68745 8.87262 1.42049 9.72754 1.28787 10.608C1.21154 11.5388 1.21948 12.4745 1.31159 13.4038Z",fill:"#5298FF"}),t.createElement("path",{d:"M20.0011 14.2903C19.7639 13.7833 19.1769 12.7812 19.1769 12.7812L12.3907 24L19.0138 19.3779C19.4085 19.1146 19.7322 18.7582 19.9566 18.3402C20.2587 17.7092 20.4192 17.0198 20.4269 16.3202C20.4346 15.6206 20.2892 14.9278 20.0011 14.2903Z",fill:"#5298FF"}),t.createElement("path",{d:"M22.69 10.5962C22.6153 9.52304 22.3121 8.47827 21.8008 7.53183C21.2895 6.58539 20.5819 5.75911 19.7253 5.10834L12.3996 0C12.3996 0 16.98 6.60556 20.849 13.1785C21.2393 13.8731 21.5014 14.6324 21.6227 15.4199C21.6769 15.7766 21.6769 16.1394 21.6227 16.4961C21.7235 16.3093 21.9192 15.9269 21.9192 15.9269C22.3112 15.1274 22.5782 14.2725 22.7108 13.392C22.7881 12.4613 22.7812 11.5256 22.69 10.5962Z",fill:"#5298FF"}),t.createElement("path",{d:"M4.04505 5.66275C4.2694 5.24473 4.59318 4.88836 4.98783 4.62508L11.611 0L4.82476 11.2217C4.82476 11.2217 4.23182 10.2196 4.00057 9.71266C3.7124 9.07515 3.56707 8.38236 3.57475 7.68278C3.58243 6.98321 3.74296 6.29378 4.04505 5.66275ZM1.31159 13.4038C1.38637 14.477 1.68956 15.5217 2.20086 16.4682C2.71216 17.4146 3.41976 18.2409 4.27629 18.8917L11.6021 24C11.6021 24 7.01863 17.3944 3.15267 10.8215C2.76128 10.1271 2.49816 9.36782 2.37592 8.58011C2.3218 8.22341 2.3218 7.86059 2.37592 7.50389C2.27512 7.69068 2.07945 8.07313 2.07945 8.07313C1.68745 8.87262 1.42049 9.72754 1.28787 10.608C1.21154 11.5388 1.21948 12.4745 1.31159 13.4038ZM19.9892 14.2933C19.752 13.7863 19.165 12.7842 19.165 12.7842L12.3907 24L19.0138 19.3779C19.4085 19.1146 19.7322 18.7582 19.9566 18.3402C20.2587 17.7092 20.4192 17.0198 20.4269 16.3202C20.4346 15.6206 20.2892 14.9278 20.0011 14.2903L19.9892 14.2933ZM22.6782 10.5991C22.6034 9.526 22.3002 8.48124 21.7889 7.53479C21.2776 6.58835 20.57 5.76208 19.7135 5.1113L12.3996 0C12.3996 0 16.98 6.60556 20.849 13.1785C21.2393 13.8731 21.5014 14.6324 21.6227 15.4199C21.6769 15.7766 21.6769 16.1394 21.6227 16.4961C21.7235 16.3093 21.9192 15.9269 21.9192 15.9269C22.3112 15.1274 22.5782 14.2725 22.7108 13.392C22.7881 12.4613 22.7812 11.5256 22.69 10.5962L22.6782 10.5991Z",fill:"#5298FF"})),qe=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M45.409 4.442 21.525 45.385a3 3 0 0 0 1.103 4.117l23.884 13.647a3 3 0 0 0 2.976 0l23.884-13.647a3 3 0 0 0 1.103-4.117L50.59 4.442c-1.157-1.984-4.025-1.984-5.182 0Z"}),t.createElement("path",{fill:"currentColor",d:"m22.559 59.656 22.983 32.833c1.195 1.706 3.721 1.706 4.916 0L73.44 59.655c.612-.874-.388-1.97-1.315-1.441l-23.63 13.502a1 1 0 0 1-.992 0l-23.63-13.502c-.927-.53-1.927.567-1.315 1.442Z"})),Xr=({title:e,titleId:r,...o})=>t.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{d:"M11.998 0V8.87185L19.4236 12.2225L11.998 0Z",fill:"currentColor",fillOpacity:.8}),t.createElement("path",{d:"M11.998 0L4.57143 12.2225L11.998 8.87185V0Z",fill:"currentColor",fillOpacity:.4}),t.createElement("path",{d:"M11.998 17.9717V24L19.4286 13.6188L11.998 17.9717Z",fill:"currentColor",fillOpacity:.8}),t.createElement("path",{d:"M11.998 24V17.9707L4.57143 13.6188L11.998 24Z",fill:"currentColor",fillOpacity:.4}),t.createElement("path",{d:"M11.998 16.5765L19.4236 12.2226L11.998 8.87386V16.5765Z",fill:"currentColor"}),t.createElement("path",{d:"M4.57143 12.2226L11.998 16.5765V8.87386L4.57143 12.2226Z",fill:"currentColor",fillOpacity:.8})),Kr=({title:e,titleId:r,...o})=>t.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{d:"M11.998 0V8.87185L19.4236 12.2225L11.998 0Z",fill:"currentColor",fillOpacity:.602}),t.createElement("path",{d:"M11.998 0L4.57143 12.2225L11.998 8.87185V0Z",fill:"currentColor"}),t.createElement("path",{d:"M11.998 17.9717V24L19.4286 13.6188L11.998 17.9717Z",fill:"currentColor",fillOpacity:.602}),t.createElement("path",{d:"M11.998 24V17.9707L4.57143 13.6188L11.998 24Z",fill:"currentColor"}),t.createElement("path",{d:"M11.998 16.5765L19.4236 12.2226L11.998 8.87386V16.5765Z",fill:"currentColor",fillOpacity:.2}),t.createElement("path",{d:"M4.57143 12.2226L11.998 16.5765V8.87386L4.57143 12.2226Z",fill:"currentColor",fillOpacity:.602})),Qr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M18 4C8.059 4 0 12.059 0 22v52c0 9.941 8.059 18 18 18h20c9.941 0 18-8.059 18-18v-4a6 6 0 0 0-12 0v4a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V22a6 6 0 0 1 6-6h20a6 6 0 0 1 6 6v4a6 6 0 0 0 12 0v-4c0-9.941-8.059-18-18-18H18Z"}),t.createElement("path",{fill:"currentColor",d:"M94.462 52.011a6 6 0 0 0-.471-8.492L74.014 25.54a6 6 0 0 0-8.028 8.92L74.364 42H38a6 6 0 0 0 0 12h36.364l-8.378 7.54a6 6 0 0 0 8.028 8.92l20-18a5.93 5.93 0 0 0 .448-.449Z"})),Jr=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 28c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20Zm-8 20a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 12c-11.555 0-21.694 5.905-29.276 12.159C11.051 30.489 5.26 37.783 2.29 41.868a11.23 11.23 0 0 0 0 13.264c2.97 4.085 8.76 11.38 16.434 17.709C26.306 79.095 36.445 85 48 85s21.694-5.905 29.276-12.159c7.673-6.33 13.464-13.624 16.434-17.709a11.23 11.23 0 0 0 0-13.264c-2.97-4.085-8.76-11.38-16.434-17.709C69.694 17.905 59.555 12 48 12ZM26.36 63.584C20.026 58.359 15.054 52.23 12.306 48.5c2.748-3.73 7.72-9.859 14.054-15.084C33.033 27.912 40.5 24 48 24s14.967 3.912 21.64 9.416C75.974 38.641 80.946 44.77 83.694 48.5c-2.748 3.73-7.72 9.859-14.054 15.084C62.967 69.088 55.5 73 48 73s-14.967-3.912-21.64-9.416Z",clipRule:"evenodd"})),eo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M12.628 48.4C16.224 41.294 27.214 24 48 24c2.766 0 5.328.3 7.703.825a6 6 0 1 0 2.594-11.716A47.514 47.514 0 0 0 48 12C19.107 12 5.122 36.447 1.6 43.625a10.836 10.836 0 0 0 .068 9.702c1.471 2.903 4.368 7.96 8.934 13.14a6 6 0 0 0 9.002-7.934A52.365 52.365 0 0 1 12.628 48.4Zm69.02-14.01a6 6 0 0 1 8.328 1.623 65.09 65.09 0 0 1 4.418 7.602 10.829 10.829 0 0 1-.055 9.698C90.74 60.42 76.733 84 48 84c-1.155 0-2.29-.039-3.404-.114a6 6 0 1 1 .808-11.973c.844.057 1.71.087 2.596.087 20.803 0 31.775-16.72 35.372-23.6a53.684 53.684 0 0 0-3.348-5.682 6 6 0 0 1 1.624-8.329Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M59.723 31.792c-7.82-5.67-18.818-4.982-25.865 2.066-7.047 7.047-7.736 18.045-2.066 25.865L13.757 77.757a6 6 0 1 0 8.486 8.486l64-64a6 6 0 1 0-8.486-8.486L59.723 31.792Zm-8.77 8.77a8.002 8.002 0 0 0-10.39 10.39l10.39-10.39Z",clipRule:"evenodd"})),to=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M57.028 14.057C50.441 9.079 41 13.779 41 22.036v1.526a6 6 0 0 0 11.591 2.182L82.047 48 52.591 70.256A6.002 6.002 0 0 0 41 72.437v1.527c0 8.257 9.44 12.957 16.028 7.98l34.365-25.965c5.296-4.001 5.296-11.957 0-15.958L57.028 14.057Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M16.028 14.057C9.441 9.079 0 13.779 0 22.036v51.928c0 8.257 9.44 12.957 16.028 7.98l34.365-25.965c5.295-4.001 5.296-11.957 0-15.958L16.028 14.057ZM12 69.947V26.053L41.047 48 12 69.947Z",clipRule:"evenodd"})),ro=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 12c-19.551 0-28.246 5.992-31.795 9.614a.644.644 0 0 0-.17.252 1.069 1.069 0 0 0-.034.425c.04.504.312 1.313 1.005 2.145L39.828 51.82A18 18 0 0 1 44 63.345V80a4 4 0 0 0 8 0V63.345a18 18 0 0 1 4.172-11.524l22.822-27.385c.693-.832.965-1.641 1.005-2.145a1.069 1.069 0 0 0-.034-.425.644.644 0 0 0-.17-.252C76.246 17.992 67.55 12 48 12ZM7.633 13.217C13.793 6.93 25.767 0 48 0c22.233 0 34.207 6.93 40.367 13.217 5.966 6.091 3.67 14.31-.155 18.9L65.391 59.505A6 6 0 0 0 64 63.344V80c0 8.837-7.163 16-16 16s-16-7.163-16-16V63.345a6 6 0 0 0-1.39-3.841L7.787 32.118c-3.826-4.591-6.121-12.81-.155-18.9Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),oo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M46.656 17.497C43.927 28.1 38.483 36.16 33.67 42.944l-.736 1.036C26.815 52.6 22.8 58.254 22.8 65.274c0 6.105 2.309 10.44 5.104 13.452.692-15.463 10.033-27.11 13.693-31.144 2.221-2.449 5.547-2.743 8.02-1.496a6.824 6.824 0 0 1 3.719 6.68c-.307 3.637.344 5.865 1.183 7.52.799 1.578 1.788 2.767 3.197 4.46.328.395.679.817 1.055 1.277 1.83 2.238 4.126 5.28 5.066 9.59.142.653.25 1.317.323 1.993 3.734-3.383 5.918-6.822 7.08-10.137 1.932-5.508 1.4-11.69-1.23-18.444-4.32-11.095-13.762-22.356-23.354-31.528ZM36.289 6.802c.363-4.974 6.52-8.732 11.21-4.716 11.96 10.239 27.197 25.897 33.693 42.585 3.304 8.487 4.539 17.74 1.373 26.768-3.178 9.064-10.436 16.893-22.097 23.204-5.36 2.9-11.915-2.301-9.64-8.38 1.623-4.339 1.585-6.714 1.284-8.093-.307-1.41-1.05-2.619-2.63-4.55-.22-.269-.465-.56-.73-.876-1.445-1.72-3.464-4.123-4.939-7.036l-.105-.21c-2.973 5.887-5.09 13.569-2.977 22.02a6.806 6.806 0 0 1-1.878 6.565 6.705 6.705 0 0 1-7.173 1.382c-4.828-1.948-20.88-9.95-20.88-30.19 0-11.019 6.268-19.762 11.71-27.353.466-.648.924-1.288 1.372-1.92 6.033-8.506 11.522-17.041 12.407-29.2Z",clipRule:"evenodd"})),lo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M16 42a6 6 0 0 1 6-6h16a6 6 0 0 1 0 12H22a6 6 0 0 1-6-6Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M0 18C0 8.059 8.059 0 18 0h24c9.941 0 18 8.059 18 18v18h2c9.941 0 18 8.059 18 18v14c0 1.495.49 2.65 1.028 3.323.53.662.912.677.972.677.06 0 .442-.015.972-.677C83.51 70.649 84 69.495 84 68V32.7L69.726 18.21a6 6 0 0 1 8.548-8.42l14.274 14.488A12 12 0 0 1 96 32.7V68c0 7.518-5.088 16-14 16-8.912 0-14-8.482-14-16V54a6 6 0 0 0-6-6h-2v30c0 9.941-8.059 18-18 18H18C8.059 96 0 87.941 0 78V18Zm48 0a6 6 0 0 0-6-6H18a6 6 0 0 0-6 6v60a6 6 0 0 0 6 6h24a6 6 0 0 0 6-6V18Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),no=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M15.15 21.393c-2.532 3.395-4.032 8.719-2.588 15.928.42 2.092 1.762 5.1 4.15 8.898 2.324 3.699 5.377 7.738 8.779 11.825 6.8 8.17 14.683 16.161 20.12 21.443 1.36 1.32 3.418 1.32 4.778 0 5.437-5.282 13.32-13.273 20.12-21.443 3.402-4.087 6.455-8.126 8.78-11.825 2.387-3.798 3.73-6.806 4.149-8.898 1.444-7.21-.056-12.533-2.587-15.928C78.317 17.996 74.379 16 69.75 16c-7.945 0-11.555 3.295-13.429 6.118-1.03 1.553-1.637 3.143-1.981 4.362-.17.6-.268 1.083-.32 1.388a7.41 7.41 0 0 0-.048.306l-.003.026a6 6 0 0 1-11.943-.026 7.233 7.233 0 0 0-.047-.306 14.078 14.078 0 0 0-.32-1.388c-.345-1.22-.952-2.81-1.982-4.362C37.804 19.295 34.194 16 26.249 16c-4.628 0-8.566 1.996-11.1 5.393ZM48 13.236C52.218 8.194 59.106 4 69.75 4c8.262 0 15.83 3.662 20.72 10.22 4.892 6.559 6.732 15.485 4.734 25.46-.85 4.235-3.11 8.716-5.756 12.926-2.71 4.31-6.122 8.797-9.716 13.115-7.19 8.64-15.415 16.966-20.982 22.374a15.374 15.374 0 0 1-21.5 0C31.683 82.687 23.46 74.36 16.268 65.72c-3.594-4.318-7.007-8.806-9.716-13.115-2.647-4.21-4.907-8.691-5.756-12.927-1.998-9.974-.158-18.9 4.734-25.46C10.42 7.662 17.988 4 26.25 4 36.893 4 43.781 8.194 48 13.236Z",clipRule:"evenodd"})),ao=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M69.75 9C49.612 9 48 26.793 48 26.793S46.389 9 26.25 9C13.36 9 3.235 20.44 6.68 37.812c2.635 13.296 25.443 36.739 36 47.007a7.58 7.58 0 0 0 10.64 0c10.557-10.268 33.365-33.71 36-47.007C92.765 20.44 82.64 9 69.75 9Z",opacity:.35}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M15.15 21.393c-2.532 3.395-4.032 8.719-2.588 15.928.42 2.092 1.762 5.1 4.15 8.898 2.324 3.699 5.377 7.738 8.779 11.825 6.8 8.17 14.683 16.161 20.12 21.443 1.36 1.32 3.418 1.32 4.778 0 5.437-5.282 13.32-13.273 20.12-21.443 3.402-4.087 6.455-8.126 8.78-11.825 2.387-3.798 3.73-6.806 4.149-8.898 1.444-7.21-.056-12.533-2.587-15.928C78.317 17.996 74.379 16 69.75 16c-7.945 0-11.555 3.295-13.429 6.118-1.03 1.553-1.637 3.143-1.981 4.362-.17.6-.268 1.083-.32 1.388-.027.152-.041.256-.048.306l-.003.026a6 6 0 0 1-11.94 0l-.003-.026a7.596 7.596 0 0 0-.047-.306 14.078 14.078 0 0 0-.32-1.388c-.345-1.22-.952-2.81-1.982-4.362C37.804 19.295 34.194 16 26.249 16c-4.628 0-8.566 1.996-11.1 5.393ZM48 13.236C52.218 8.194 59.106 4 69.75 4c8.262 0 15.83 3.662 20.72 10.22 4.892 6.559 6.732 15.485 4.734 25.46-.85 4.235-3.11 8.716-5.756 12.926-2.71 4.31-6.122 8.797-9.716 13.115-7.19 8.64-15.415 16.966-20.982 22.374a15.374 15.374 0 0 1-21.5 0C31.683 82.687 23.46 74.36 16.268 65.72c-3.594-4.318-7.007-8.806-9.716-13.115-2.647-4.21-4.907-8.691-5.756-12.927-1.998-9.974-.158-18.9 4.734-25.46C10.42 7.662 17.988 4 26.25 4 36.893 4 43.781 8.194 48 13.236Z",clipRule:"evenodd"})),io=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M51.905 5.444a6 6 0 0 0-7.81 0l-42 36a6 6 0 1 0 7.81 9.111L48 17.903l38.095 32.654a6 6 0 1 0 7.81-9.111l-42-36Z"}),t.createElement("path",{fill:"currentColor",d:"M28 58a6 6 0 0 0-12 0v16c0 9.941 8.059 18 18 18h28c9.941 0 18-8.059 18-18V58a6 6 0 0 0-12 0v16a6 6 0 0 1-6 6H34a6 6 0 0 1-6-6V58Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),$t=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M54 26a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm0 16a6 6 0 0 0-10.633-3.812c-.758.921-2.302 1.963-4.176 2.867a26.883 26.883 0 0 1-2.823 1.166l-.142.047-.02.006A6 6 0 0 0 39.78 53.73l-1.766-5.687c1.766 5.687 1.768 5.687 1.768 5.687l.003-.001.005-.002.012-.004.033-.01a18.325 18.325 0 0 0 .395-.13 32.899 32.899 0 0 0 1.771-.66V70a6 6 0 0 0 12 0V42Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Zm0-12c19.882 0 36-16.118 36-36S67.882 12 48 12 12 28.118 12 48s16.118 36 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),co=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M91.243 10.243a6 6 0 1 0-8.486-8.486L41.21 43.305A27.877 27.877 0 0 0 28 40C12.536 40 0 52.536 0 68s12.536 28 28 28 28-12.536 28-28a27.877 27.877 0 0 0-5.648-16.867L66.5 34.985l3.257 3.258a6 6 0 1 0 8.486-8.486L74.985 26.5l3.515-3.515 3.257 3.258a6 6 0 1 0 8.486-8.486L86.985 14.5l4.258-4.257ZM12 68c0-8.837 7.163-16 16-16s16 7.163 16 16-7.163 16-16 16-16-7.163-16-16Z",clipRule:"evenodd"})),so=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M32 18a6 6 0 0 0-12 0v6h-5.86a6.126 6.126 0 0 0-.278 0H6a6 6 0 0 0 0 12h3.712c2.253 6.237 4.715 11.368 8.034 15.918-1.975 1.619-4.277 3.27-7.018 5.053a6 6 0 0 0 6.544 10.058c3.264-2.123 6.15-4.197 8.728-6.367 2.577 2.17 5.464 4.244 8.728 6.367a6 6 0 0 0 6.544-10.058c-2.74-1.783-5.043-3.434-7.018-5.053 3.319-4.55 5.78-9.68 8.034-15.918H46a6 6 0 0 0 0-12h-7.862a6.126 6.126 0 0 0-.278 0H32v-6Zm-6 24.71c-1.213-1.947-2.326-4.136-3.413-6.71h6.826c-1.087 2.574-2.2 4.763-3.413 6.71Zm50.158-2.936c-2.646-4.895-9.67-4.895-12.316 0l-19.12 35.373a6 6 0 1 0 10.556 5.706L57.901 76h24.197l2.624 4.853a6 6 0 1 0 10.556-5.706l-19.12-35.373ZM70 53.618 75.612 64H64.388L70 53.618Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),uo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"m7.757 52.243 34 34a6 6 0 1 0 8.486-8.486L26.485 54H84a6 6 0 0 0 0-12H26.485l23.758-23.757a6 6 0 1 0-8.486-8.486L7.772 43.743l-.015.014a6 6 0 0 0 0 8.486Z"})),po=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M25.757 52.243a6 6 0 0 1 0-8.486l30-30a6 6 0 1 1 8.486 8.486L38.485 48l25.758 25.757a6 6 0 1 1-8.486 8.486l-30-30Z",clipRule:"evenodd"})),fo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M96 48c0 26.51-21.49 48-48 48S0 74.51 0 48 21.49 0 48 0s48 21.49 48 48Zm-12 0a35.836 35.836 0 0 1-6.656 20.86l-8.667-8.668A23.89 23.89 0 0 0 72 48c0-4.46-1.217-8.637-3.337-12.215l8.666-8.666A35.835 35.835 0 0 1 84 48ZM68.837 18.64A35.836 35.836 0 0 0 48 12a35.836 35.836 0 0 0-20.86 6.655l8.668 8.668A23.89 23.89 0 0 1 48 24c4.441 0 8.6 1.206 12.168 3.31l8.67-8.67ZM48 84a35.836 35.836 0 0 0 20.86-6.656l-8.668-8.667A23.89 23.89 0 0 1 48 72c-4.46 0-8.637-1.217-12.215-3.337l-8.666 8.666A35.835 35.835 0 0 0 48 84ZM18.64 68.837A35.836 35.836 0 0 1 12 48a35.836 35.836 0 0 1 6.655-20.86l8.668 8.668A23.89 23.89 0 0 0 24 48c0 4.441 1.206 8.6 3.31 12.168l-8.67 8.67ZM36 48c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12-12-5.373-12-12Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),go=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"m49.757 53.272-1.514-1.515a6 6 0 1 0-8.486 8.486l1.515 1.514c7.03 7.03 18.427 7.03 25.456 0l23.03-23.029c7.029-7.03 7.029-18.427 0-25.456l-6.03-6.03c-7.03-7.029-18.426-7.029-25.456 0l-9.515 9.515a6 6 0 1 0 8.486 8.486l9.514-9.515a6 6 0 0 1 8.486 0l6.03 6.03a6 6 0 0 1 0 8.485l-23.03 23.03a6 6 0 0 1-8.486 0Z"}),t.createElement("path",{fill:"currentColor",d:"m46.243 42.728 1.514 1.515a6 6 0 0 0 8.486-8.486l-1.515-1.514c-7.03-7.03-18.427-7.03-25.456 0l-23.03 23.03c-7.029 7.029-7.029 18.425 0 25.455l6.03 6.03c7.03 7.029 18.427 7.029 25.456 0l9.515-9.515a6 6 0 1 0-8.486-8.486l-9.514 9.515a6 6 0 0 1-8.486 0l-6.03-6.03a6 6 0 0 1 0-8.485l23.03-23.03a6 6 0 0 1 8.486 0Z"})),mo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M14 28a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 26a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm6 20a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm14-58a6 6 0 0 0 0 12h48a6 6 0 0 0 0-12H34Zm-6 58a6 6 0 0 1 6-6h48a6 6 0 0 1 0 12H34a6 6 0 0 1-6-6Zm6-32a6 6 0 0 0 0 12h48a6 6 0 0 0 0-12H34Z",clipRule:"evenodd"})),bo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M94.243 60.757a6 6 0 0 0-8.486 0L78 68.515V14a6 6 0 0 0-12 0v54.515l-7.757-7.758a6 6 0 0 0-8.486 8.486l18 18a6.002 6.002 0 0 0 8.486 0l18-18a6 6 0 0 0 0-8.486ZM6 28a6 6 0 0 1 0-12h44a6 6 0 0 1 0 12H6ZM0 74a6 6 0 0 0 6 6h28a6 6 0 0 0 0-12H6a6 6 0 0 0-6 6Zm6-20a6 6 0 0 1 0-12h36a6 6 0 0 1 0 12H6Z"})),$o=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M94.243 35.243a6 6 0 0 1-8.486 0L78 27.485V82a6 6 0 0 1-12 0V27.485l-7.757 7.758a6 6 0 1 1-8.486-8.486l18-18a6.002 6.002 0 0 1 8.486 0l18 18a6 6 0 0 1 0 8.486ZM6 68a6 6 0 0 0 0 12h44a6 6 0 0 0 0-12H6ZM0 22a6 6 0 0 1 6-6h28a6 6 0 0 1 0 12H6a6 6 0 0 1-6-6Zm6 20a6 6 0 0 0 0 12h36a6 6 0 0 0 0-12H6Z"})),ho=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M48 56a6 6 0 0 1 6 6v4a6 6 0 0 1-12 0v-4a6 6 0 0 1 6-6Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 0C34.745 0 24 10.745 24 24v8.11C15 33.105 8 40.735 8 50v28c0 9.941 8.059 18 18 18h44c9.941 0 18-8.059 18-18V50c0-9.265-7-16.895-16-17.89V24C72 10.745 61.255 0 48 0Zm12 32v-8c0-6.627-5.373-12-12-12s-12 5.373-12 12v8h24ZM26 44a6 6 0 0 0-6 6v28a6 6 0 0 0 6 6h44a6 6 0 0 0 6-6V50a6 6 0 0 0-6-6H26Z",clipRule:"evenodd"})),wo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M48 42c0-5.523-4.477-10-10-10a6 6 0 0 1 0-12c12.15 0 22 9.85 22 22a6 6 0 0 1-12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M72.209 63.724A39.82 39.82 0 0 0 80 40C80 17.909 62.091 0 40 0S0 17.909 0 40s17.909 40 40 40a39.82 39.82 0 0 0 23.724-7.791l18.033 18.034a6 6 0 1 0 8.486-8.486L72.209 63.723ZM40 68c15.464 0 28-12.536 28-28S55.464 12 40 12 12 24.536 12 40s12.536 28 28 28Z",clipRule:"evenodd"})),vo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("circle",{cx:40,cy:40,r:32,fill:"currentColor",opacity:.35}),t.createElement("path",{fill:"currentColor",d:"M48 42c0-5.523-4.477-10-10-10a6 6 0 0 1 0-12c12.15 0 22 9.85 22 22a6 6 0 0 1-12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M72.209 63.724A39.82 39.82 0 0 0 80 40C80 17.909 62.091 0 40 0S0 17.909 0 40s17.909 40 40 40a39.82 39.82 0 0 0 23.724-7.791l18.033 18.034a6 6 0 1 0 8.486-8.486L72.209 63.723ZM40 68c15.464 0 28-12.536 28-28S55.464 12 40 12 12 24.536 12 40s12.536 28 28 28Z",clipRule:"evenodd"})),yo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M56.86 65.344A35.836 35.836 0 0 1 36 72C16.118 72 0 55.882 0 36S16.118 0 36 0s36 16.118 36 36a35.836 35.836 0 0 1-6.656 20.86l25.899 25.897a6 6 0 1 1-8.486 8.486L56.86 65.345ZM60 36c0 13.255-10.745 24-24 24S12 49.255 12 36s10.745-24 24-24 24 10.745 24 24Z",clipRule:"evenodd"})),Eo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 20c-9.941 0-18 8.059-18 18s8.059 18 18 18 18-8.059 18-18-8.059-18-18-18Zm-6 18a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 0C26.235 0 9 18.302 9 40.362c0 15.652 9.428 29.58 17.903 38.996a111.319 111.319 0 0 0 11.985 11.444 73.582 73.582 0 0 0 4.136 3.174c.52.366 1.019.699 1.449.958.19.115.508.3.872.47.145.067.56.258 1.106.4a6.04 6.04 0 0 0 5.347-1.162l.21-.157a118.055 118.055 0 0 0 5.135-4.032c3.26-2.706 7.593-6.586 11.933-11.358C77.548 69.78 87 56.036 87 40.362 87 18.302 69.766 0 48 0ZM21 40.362C21 24.467 33.315 12 48 12s27 12.467 27 28.362c0 11.051-6.865 21.933-14.801 30.658-3.864 4.249-7.76 7.742-10.721 10.201-.597.496-1.155.949-1.666 1.356a79.24 79.24 0 0 1-1.322-1.06A99.3 99.3 0 0 1 35.822 71.33C27.888 62.515 21 51.435 21 40.362Zm22.672 45.477a6.102 6.102 0 0 1 .488-.455l-.004.004c-.04.033-.25.208-.483.451Zm7.013-1.172-.017-.01a.598.598 0 0 0 .015.009h.002Z",clipRule:"evenodd"})),xo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M8 22a6 6 0 0 1 6-6h68a6 6 0 0 1 0 12H14a6 6 0 0 1-6-6Zm0 52a6 6 0 0 1 6-6h68a6 6 0 0 1 0 12H14a6 6 0 0 1-6-6Zm6-32a6 6 0 0 0 0 12h68a6 6 0 0 0 0-12H14Z",clipRule:"evenodd"})),Co=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M88 48a6 6 0 0 1-6 6H14a6 6 0 0 1 0-12h68a6 6 0 0 1 6 6Z",clipRule:"evenodd"})),ko=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M84 48c0 19.882-16.118 36-36 36S12 67.882 12 48s16.118-36 36-36 36 16.118 36 36Zm12 0c0 26.51-21.49 48-48 48S0 74.51 0 48 21.49 0 48 0s48 21.49 48 48Zm-28 6a6 6 0 0 0 0-12H28a6 6 0 0 0 0 12h40Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),So=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M76 6a6 6 0 0 0-12 0v8a6 6 0 0 0 12 0V6Zm0 32a6 6 0 0 0-12 0v8a6 6 0 0 0 12 0v-8Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M31.438 8.117a8.158 8.158 0 0 1 2.68 8.252A37.596 37.596 0 0 0 33 25.5C33 46.21 49.79 63 70.5 63c3.157 0 6.214-.389 9.13-1.118a8.158 8.158 0 0 1 8.253 2.68c1.942 2.328 2.665 6.005.595 9.245C79.963 87.14 65.018 96 48 96 21.49 96 0 74.51 0 48 0 30.982 8.861 16.037 22.193 7.522c3.24-2.07 6.917-1.347 9.245.595Zm-10.42 16.05A35.858 35.858 0 0 0 12 48c0 19.882 16.118 36 36 36a35.858 35.858 0 0 0 23.834-9.018c-.444.012-.888.018-1.334.018C43.162 75 21 52.838 21 25.5c0-.446.006-.89.018-1.334Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M96 26a6 6 0 0 1-6 6h-8a6 6 0 0 1 0-12h8a6 6 0 0 1 6 6Zm-32 0a6 6 0 0 1-6 6h-8a6 6 0 0 1 0-12h8a6 6 0 0 1 6 6Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Ro=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M54 6a6 6 0 0 0-12 0v8a6 6 0 0 0 12 0V6Z"}),t.createElement("path",{fill:"currentColor",d:"M88 26c0-9.941-8.059-18-18-18h-4a6 6 0 0 0 0 12h4a6 6 0 0 1 6 6v52a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6V26a6 6 0 0 1 6-6h4a6 6 0 0 0 0-12h-4C16.059 8 8 16.059 8 26v52c0 9.941 8.059 18 18 18h44c9.941 0 18-8.059 18-18V26Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 24c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16Zm-4 16a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M42.106 73.05c-1.094.489-1.673 1.014-1.968 1.295a6 6 0 0 1-8.276-8.69C33.92 63.695 38.697 60 48 60s14.08 3.695 16.138 5.655a6 6 0 1 1-8.276 8.69c-.295-.281-.874-.806-1.968-1.295C52.786 72.556 50.925 72 48 72c-2.925 0-4.786.556-5.894 1.05Z"})),Po=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M50 4a6 6 0 0 0 0 12h21.515L33.757 53.757a6 6 0 1 0 8.486 8.486L80 24.485V46a6 6 0 0 0 12 0V10a6 6 0 0 0-6-6H50Z"}),t.createElement("path",{fill:"currentColor",d:"M16 42a6 6 0 0 1 6-6h8a6 6 0 0 0 0-12h-8c-9.941 0-18 8.059-18 18v32c0 9.941 8.059 18 18 18h32c9.941 0 18-8.059 18-18v-8a6 6 0 0 0-12 0v8a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6V42Z"})),Vo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M76 28c0 15.464-12.536 28-28 28S20 43.464 20 28 32.536 0 48 0s28 12.536 28 28Zm-12 0c0 8.837-7.163 16-16 16s-16-7.163-16-16 7.163-16 16-16 16 7.163 16 16Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M12.915 93.44C16.421 88.434 26.044 76 48 76c21.957 0 31.58 12.433 35.085 17.44a6 6 0 0 0 9.83-6.88C88.421 80.137 75.643 64 48 64S7.58 80.138 3.085 86.56a6 6 0 0 0 9.83 6.88Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Lo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M72 6a6 6 0 0 1 12 0v6h6a6 6 0 0 1 0 12h-6v6a6 6 0 0 1-12 0v-6h-6a6 6 0 0 1 0-12h6V6Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M60 38c0 12.15-9.85 22-22 22s-22-9.85-22-22 9.85-22 22-22 22 9.85 22 22Zm-12 0c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M10.915 93.44C13.621 89.577 21.003 80 38 80c16.996 0 24.38 9.576 27.085 13.44a6 6 0 0 0 9.83-6.88C71.221 81.28 60.683 68 38 68 15.316 68 4.78 81.281 1.085 86.56a6 6 0 0 0 9.83 6.88Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Zo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M54 14a6 6 0 0 0-12 0v28H14a6 6 0 0 0 0 12h28v28a6 6 0 0 0 12 0V54h28a6 6 0 0 0 0-12H54V14Z",clipRule:"evenodd"})),Mo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M48 22a6 6 0 0 1 6 6v14h14a6 6 0 0 1 0 12H54v14a6 6 0 0 1-12 0V54H28a6 6 0 0 1 0-12h14V28a6 6 0 0 1 6-6Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Zm0-12c19.882 0 36-16.118 36-36S67.882 12 48 12 12 28.118 12 48s16.118 36 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Go=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M44.017 33.972c-.013.034-.017.045-.017.028a6 6 0 0 1-12 0c0-7.69 6.996-14 16-14s16 6.31 16 14c0 3.485-.992 6.44-2.891 8.795-1.774 2.2-3.981 3.413-5.456 4.14-.408.201-1.003.477-1.437.678l-.47.22-.037.017A6 6 0 0 1 42 46c.001-3.848 2.19-6.284 4.162-7.642.872-.6 1.769-1.046 2.421-1.358.398-.19.665-.312.9-.42.28-.127.513-.234.865-.408 1.025-.505 1.318-.782 1.42-.909a.612.612 0 0 0 .107-.213c.046-.138.126-.458.126-1.05 0 .017-.004.006-.017-.028C51.885 33.703 51.258 32 48 32s-3.884 1.703-3.983 1.972Zm8.947 14.272c-.007.005-.007.005 0 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M54 62a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 88c26.51 0 48-19.7 48-44S74.51 0 48 0 0 19.7 0 44c0 12.22 5.435 23.278 14.21 31.25 1.108 1.007 1.79 2.414 1.79 3.912v10.87c0 3.688 3.854 6.106 7.174 4.503l13.846-6.687a5.27 5.27 0 0 1 3.085-.44c2.569.39 5.206.592 7.895.592Zm36-44c0 16.712-15.114 32-36 32a40.63 40.63 0 0 1-6.095-.457c-3.246-.492-6.794-.099-10.103 1.5l-3.804 1.836c-.084-5.078-2.413-9.507-5.718-12.51C15.769 60.453 12 52.53 12 44c0-16.712 15.113-32 36-32 20.886 0 36 15.288 36 32Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),To=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M42.951 33.266C42.486 33.672 42 34.396 42 36a6 6 0 0 1-12 0c0-4.395 1.514-8.673 5.049-11.765C38.479 21.233 43.066 20 48 20c4.934 0 9.521 1.233 12.951 4.235C64.486 27.326 66 31.605 66 36c0 4.089-1.055 7.432-3.112 10.117-1.913 2.498-4.359 3.937-5.865 4.816-1.831 1.068-2.369 1.391-2.74 1.793a.13.13 0 0 1-.009.009C54.22 52.783 54 52.976 54 54a6 6 0 0 1-12 0c0-3.9 1.247-7.009 3.466-9.413 1.688-1.829 3.846-3.065 5.115-3.792.144-.082.277-.158.396-.228 1.494-.871 2.048-1.306 2.385-1.747.193-.252.638-.909.638-2.82 0-1.605-.486-2.327-.951-2.734C52.479 32.766 51.066 32 48 32c-3.066 0-4.479.767-5.049 1.266ZM48 76a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Zm0-12c19.882 0 36-16.118 36-36S67.882 12 48 12 12 28.118 12 48s16.118 36 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Bo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"m88.243 43.757-34-34a6 6 0 1 0-8.486 8.486L69.516 42H12a6 6 0 1 0 0 12h57.515L45.757 77.757a6 6 0 0 0 8.486 8.486l33.985-33.986.015-.014a6 6 0 0 0 0-8.486Z"})),Oo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M70.243 43.757a6 6 0 0 1 0 8.486l-30 30a6 6 0 1 1-8.486-8.486L57.515 48 31.757 22.243a6 6 0 1 1 8.486-8.486l30 30Z",clipRule:"evenodd"})),Ao=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M26.22 35.09C26.22 15.93 41.752.4 60.91.4c3.183 0 6.275.43 9.216 1.24 7.392 2.032 7.938 10.632 3.718 14.853L61.8 28.536v5.663h5.663l12.043-12.042c4.22-4.221 12.82-3.675 14.854 3.716a34.723 34.723 0 0 1 1.24 9.217c0 19.159-15.531 34.69-34.69 34.69-2.969 0-5.857-.375-8.618-1.08L30.568 90.423c-6.902 6.901-18.09 6.901-24.992 0-6.901-6.901-6.901-18.09 0-24.992l21.725-21.724a34.745 34.745 0 0 1-1.08-8.618Zm27.925 31.756a.09.09 0 0 0 .003-.003L51.005 63.7l3.143 3.143-.003.003ZM60.91 12.4c-12.531 0-22.69 10.159-22.69 22.69 0 2.611.439 5.107 1.242 7.426 1 2.891.109 5.892-1.82 7.82l-23.58 23.582a5.672 5.672 0 0 0 8.02 8.02l23.581-23.58c1.929-1.929 4.93-2.82 7.821-1.82a22.65 22.65 0 0 0 7.426 1.242c12.531 0 22.69-10.159 22.69-22.69v-.056l-8.47 8.47a9.2 9.2 0 0 1-6.506 2.695H59a9.2 9.2 0 0 1-9.2-9.2v-9.623a9.2 9.2 0 0 1 2.695-6.505l8.47-8.47-.056-.001Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Ho=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M36.16 1.797c3.055 1.83 5.04 5.222 5.04 9.049v16.875l6.8 4.387 6.8-4.387V10.846c0-3.827 1.985-7.218 5.04-9.049 3.184-1.907 7.414-2 10.877.587C79.982 9.302 86 20.373 86 32.848c0 15.437-9.204 28.712-22.4 34.659V89.6a6 6 0 0 1-12 0V66.907c0-4.841 3.139-8.606 6.876-10.254C67.63 52.617 74 43.47 74 32.848a25.9 25.9 0 0 0-7.2-17.96v13.487a10.8 10.8 0 0 1-4.945 9.075l-8 5.161a10.8 10.8 0 0 1-11.71 0l-8-5.16a10.8 10.8 0 0 1-4.945-9.076V14.887A25.9 25.9 0 0 0 22 32.848c0 10.19 5.86 19.021 14.422 23.288 3.504 1.746 6.378 5.407 6.378 10.028V89.6a6 6 0 0 1-12 0V66.74C18.469 60.472 10 47.654 10 32.848c0-12.475 6.018-23.546 15.283-30.464C28.746-.202 32.976-.11 36.16 1.797Z",clipRule:"evenodd"})),jo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M54 6a6 6 0 0 0-12 0v8a6 6 0 0 0 12 0V6Zm0 76a6 6 0 0 0-12 0v8a6 6 0 0 0 12 0v-8Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M28 48c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20Zm20-8a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M81.941 14.059a6 6 0 0 1 0 8.485l-5.657 5.657a6 6 0 1 1-8.485-8.485l5.657-5.657a6 6 0 0 1 8.485 0Zm-53.74 53.74a6 6 0 0 1 0 8.485l-5.657 5.657a6 6 0 1 1-8.485-8.485l5.657-5.657a6 6 0 0 1 8.485 0ZM90 54a6 6 0 0 0 0-12h-8a6 6 0 0 0 0 12h8Zm-76 0a6 6 0 0 0 0-12H6a6 6 0 0 0 0 12h8Zm67.941 27.941a6 6 0 0 1-8.485 0l-5.657-5.657a6 6 0 1 1 8.485-8.485l5.657 5.657a6 6 0 0 1 0 8.485Zm-53.74-53.74a6 6 0 0 1-8.485 0l-5.657-5.657a6 6 0 1 1 8.485-8.485l5.657 5.657a6 6 0 0 1 0 8.485Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),ht=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"m43.757 7.757-34 34a6 6 0 0 0 8.486 8.486L42 26.485V84a6 6 0 0 0 12 0V26.485l23.757 23.758a6 6 0 0 0 8.486-8.486L52.257 7.772l-.014-.015a6 6 0 0 0-8.486 0Z"})),Fo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M43.757 25.757a6 6 0 0 1 8.486 0l30 30a6 6 0 1 1-8.486 8.486L48 38.485 22.243 64.243a6 6 0 1 1-8.486-8.486l30-30Z",clipRule:"evenodd"})),Do=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M54 68V42.485l6.757 6.758a6 6 0 1 0 8.486-8.486l-17-17a6.002 6.002 0 0 0-8.491.006L26.757 40.757a6 6 0 1 0 8.486 8.486L42 42.485V68a6 6 0 0 0 12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M96 48c0 26.51-21.49 48-48 48S0 74.51 0 48 21.49 0 48 0s48 21.49 48 48Zm-12 0c0 19.882-16.118 36-36 36S12 67.882 12 48s16.118-36 36-36 36 16.118 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),wt=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M24 12a6 6 0 0 0 0 12h39.515L13.757 73.757a6 6 0 1 0 8.486 8.486L72 32.485V72a6 6 0 0 0 12 0V19c0-.175-.006-.349-.02-.52a5.986 5.986 0 0 0-1.737-4.723 5.987 5.987 0 0 0-4.722-1.738A7.065 7.065 0 0 0 77 12H24Z"})),zo=({title:e,titleId:r,...o})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...o},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M18 8C8.059 8 0 16.059 0 26v44c0 9.941 8.059 18 18 18h60c9.941 0 18-8.059 18-18V26c0-9.941-8.059-18-18-18H18Zm66 24v-6a6 6 0 0 0-6-6H18a6 6 0 0 0-6 6v44a6 6 0 0 0 6 6h60a6 6 0 0 0 6-6v-6h-8c-8.837 0-16-7.163-16-16s7.163-16 16-16h8Zm0 20h-8a4 4 0 0 1 0-8h8v8Z",clipRule:"evenodd"})),Wn=s.default.div(()=>l.css`
    position: relative;
  `),_n=s.default.div(({theme:e,$disabled:r,$size:o})=>l.css`
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
  `),Un=s.default.div(({theme:e,$disabled:r,$size:o,$color:n})=>l.css`
    stroke: ${e.colors.accent};

    color: ${e.colors[n]};

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
  `),Yn=s.default.circle(({$finished:e})=>l.css`
    transition: all 1s linear, stroke-width 0.2s ease-in-out 1s;

    ${e&&l.css`
      stroke-width: 0;
    `}
  `),vt=t.forwardRef(({accessibilityLabel:e,color:r="textSecondary",size:o="small",countdownSeconds:n,startTimestamp:a,disabled:i,callback:c,...u},d)=>{const p=t.useMemo(()=>Math.ceil((a||Date.now())/1e3),[a]),b=t.useMemo(()=>p+n,[p,n]),f=t.useCallback(()=>Math.max(b-Math.ceil(Date.now()/1e3),0),[b]),[g,h]=t.useState(n);return t.useEffect(()=>{if(!i){h(f());const y=setInterval(()=>{const x=f();x===0&&(clearInterval(y),c&&c()),h(x)},1e3);return()=>clearInterval(y)}},[f,c,n,i]),t.createElement(Wn,{...u,"data-testid":re(u,"countdown-circle")},t.createElement(_n,{$size:o,$disabled:i},i&&n,!i&&(g>0?g:t.createElement(Me,{"data-testid":"countdown-complete-check",id:"countdown-complete-check"}))),t.createElement(Un,{$color:r,$disabled:i,$size:o,ref:d},e&&t.createElement(fe,null,e),t.createElement("svg",{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},t.createElement(Yn,{$finished:g===0,cx:"12",cy:"12",fill:"none",r:"9",strokeDasharray:`${48*(g/n)}, 56`,strokeLinecap:"round"}),t.createElement("circle",{cx:"12",cy:"12",fill:"none",opacity:i?"1":"0.25",r:"9",strokeLinecap:"round"}))))});vt.displayName="CountdownCircle";const tr={small:{width:"26",height:"10"},medium:{width:"32",height:"12"}},ae={small:{width:"12",height:"8",translateX:"6"},medium:{width:"15",height:"10",translateX:"7.5"}},qn=s.default.div(({theme:e,$size:r})=>l.css`
    position: relative;
    width: fit-content;

    label {
      position: absolute;
      left: 50%;
      top: 50%;
      width: ${e.space[ae[r].width]};
      height: ${e.space[ae[r].height]};
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
        translateX(-${e.space[ae[r].translateX]});
    }

    label#fiat {
      color: ${e.colors.greyPrimary};
      transform: translate(-50%, -50%)
        translateX(${e.space[ae[r].translateX]});
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
  `),Xn=s.default.input(({theme:e,$size:r="medium"})=>l.css`
    position: relative;
    background-color: ${e.colors.greySurface};
    height: ${e.space[tr[r].height]};
    width: ${e.space[tr[r].width]};
    border-radius: ${e.radii.large};

    display: flex;
    align-items: center;
    justify-content: center;

    &::after {
      content: '';
      display: block;
      position: absolute;
      background-color: ${e.colors.bluePrimary};
      width: ${e.space[ae[r].width]};
      height: ${e.space[ae[r].height]};
      border-radius: ${e.space["1.5"]};
      transform: translateX(-${e.space[ae[r].translateX]});
      transition: transform 0.3s ease-in-out, background-color 0.1s ease-in-out;
    }

    &:checked::after {
      transform: translateX(${e.space[ae[r].translateX]});
    }

    &:disabled::after {
      background-color: ${e.colors.greyPrimary};
    }
  `),yt=t.forwardRef(({size:e="medium",disabled:r,...o},n)=>{const a=st();return t.createElement(qn,{$size:e},t.createElement(Xn,{disabled:r,id:a,ref:n,type:"checkbox",...o,$size:e}),t.createElement("label",{htmlFor:a,id:"eth"},"ETH"),t.createElement("label",{htmlFor:a,id:"fiat"},"USD"))});yt.displayName="CurrencyToggle";const Kn=s.default.div(()=>l.css`
    max-width: max-content;
    position: relative;
  `),Qn=s.default.div(({theme:e,$opened:r,$inner:o,$shortThrow:n,$align:a,$labelAlign:i,$direction:c})=>l.css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: ${e.space[1]};
    position: absolute;

    ${c==="up"&&l.css`
      bottom: 100%;
    `}

    ${i&&l.css`
      & > button {
        justify-content: ${i};
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

    ${()=>{if(!r&&!n)return l.css`
          margin-${c==="down"?"top":"bottom"}: calc(-1 * ${e.space[12]});
        `;if(!r&&n)return l.css`
          margin-${c==="down"?"top":"bottom"}: calc(-1 * ${e.space["2.5"]});
        `;if(r&&!o)return l.css`
          z-index: 20;
          margin-${c==="down"?"top":"bottom"}: ${e.space["1.5"]};
        `}}

  ${a==="left"?l.css`
          left: 0;
        `:l.css`
          right: 0;
        `}
  `),rr=s.default.button(({theme:e,$inner:r,$hasColor:o,$color:n,disabled:a})=>l.css`
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

    color: ${e.colors[n||"textPrimary"]};

    svg {
      width: ${e.space[4]};
      height: ${e.space[4]};
      color: ${e.colors[n||"text"]};
    }
    ${a&&l.css`
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
  `),Jn=({setIsOpen:e,item:r})=>{const o=t.useRef(null),n=t.cloneElement(r,{...r.props,ref:o}),a=t.useCallback(()=>{e(!1)},[e]);return t.useEffect(()=>{const i=o.current;return i==null||i.addEventListener("click",a),()=>{i==null||i.removeEventListener("click",a)}},[a,r]),n},ea=({items:e,setIsOpen:r,isOpen:o,width:n,inner:a,align:i,shortThrow:c,keepMenuOnTop:u,labelAlign:d,direction:p})=>t.createElement(Qn,{$opened:o,$inner:a,$align:i,$shortThrow:c,$labelAlign:d,$direction:p,style:{width:a||n&&parseInt(n)>100?`${n}px`:"150px",zIndex:u?100:void 0}},e.map(b=>{if(t.isValidElement(b))return Jn({item:b,setIsOpen:r});const{color:f,value:g,icon:h,label:y,onClick:x,disabled:C,as:P,wrapper:w}=b,v={$inner:a,$hasColor:!!f,$color:f,disabled:C,onClick:()=>{r(!1),x==null||x(g)},as:P,children:t.createElement(t.Fragment,null,h,y)};return w?w(t.createElement(rr,{...v,type:"button"}),g||y):t.createElement(rr,{...v,key:g||y,type:"button"})})),ta=s.default.button(({theme:e,$size:r,$open:o,$direction:n})=>l.css`
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
          border-${n==="down"?"top":"bottom"}-left-radius: ${e.radii.almostExtraLarge};
          border-${n==="down"?"top":"bottom"}-right-radius: ${e.radii.almostExtraLarge};
          border-${n==="down"?"bottom":"top"}-left-radius: none;
          border-${n==="down"?"bottom":"top"}-right-radius: none;
          border-${n==="down"?"bottom":"top"}-width: 0;
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
  `),or=s.default(e=>t.createElement(Ye,{...e}))(({theme:e,$open:r,$direction:o})=>l.css`
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
  `),ra=s.default.div(()=>l.css`
    z-index: 10;
    position: relative;
  `),Xe=({children:e,buttonProps:r,items:o=[],inner:n=!1,chevron:a=!0,align:i="left",menuLabelAlign:c,shortThrow:u=!1,keepMenuOnTop:d=!1,size:p="medium",label:b,direction:f="down",isOpen:g,setIsOpen:h,inheritContentWidth:y=!1,...x})=>{const C=t.useRef(),[P,w]=t.useState(!1),[v,m]=h?[g,h]:[P,w],$=S=>{C.current&&!C.current.contains(S.target)&&m(!1)};return t.useEffect(()=>(v?document.addEventListener("mousedown",$):document.removeEventListener("mousedown",$),()=>{document.removeEventListener("mousedown",$)}),[C,v]),t.createElement(Kn,{ref:C,...x,"data-testid":re(x,"dropdown")},!e&&n&&t.createElement(ta,{$direction:f,$open:v,$size:p,type:"button",onClick:()=>m(!v)},b,a&&t.createElement(or,{$direction:f,$open:v})),!e&&!n&&t.createElement(ra,null,t.createElement(ze,{...r,pressed:v,suffix:a&&t.createElement(or,{$direction:f,$open:v}),onClick:()=>m(!v)},b)),t.Children.map(e,S=>t.isValidElement(S)?t.cloneElement(S,{...r,zindex:"10",pressed:v?"true":void 0,onClick:()=>m(!v)}):null),t.createElement(ea,{align:i,direction:f,inner:n,isOpen:v,items:o,keepMenuOnTop:d,labelAlign:c,setIsOpen:m,shortThrow:u,width:(n||y)&&C.current&&C.current.getBoundingClientRect().width.toFixed(2)}))};Xe.displayName="Dropdown";const oa=s.default.fieldset(({theme:e})=>l.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[4]};
  `),la=s.default.div(({theme:e})=>l.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[1]};
    padding: 0 ${e.space[4]};
  `),na=s.default.div(({theme:e})=>l.css`
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: ${e.space[3]};
  `),aa=s.default.div(({theme:e})=>l.css`
    color: ${e.colors.textSecondary};
    font-size: ${e.fontSizes.body};
    line-height: ${e.lineHeights.body};
  `),ia=s.default.div(({theme:e})=>l.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[4]};
  `),Et=({children:e,description:r,disabled:o,form:n,legend:a,name:i,status:c,...u})=>{let d,p;switch(c){case"complete":{d="Complete",p="green";break}case"required":case"pending":{d=c==="pending"?"Pending":"Required",p="accent";break}case"optional":{d="Optional",p="grey";break}}return typeof c=="object"&&(d=c.name,p=c.tone),t.createElement(oa,{...u,disabled:o,form:n,name:i},t.createElement(la,null,t.createElement(na,null,t.createElement(We,{as:"legend",level:"2",responsive:!0},a),p&&d&&t.createElement(Ue,{color:p},d)),t.createElement(aa,null,r)),t.createElement(ia,null,e))};Et.displayName="FieldSet";const ca=s.default.div(({theme:e,$type:r,$alignment:o})=>l.css`
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
  `),sa=s.default.div(({theme:e,$type:r})=>l.css`
    width: ${e.space[6]};
    height: ${e.space[6]};

    color: ${e.colors.blue};

    ${r==="warning"&&l.css`
      color: ${e.colors.yellow};
    `}
    ${r==="error"&&l.css`
      color: ${e.colors.red};
    `}
  `),xt=({type:e="info",alignment:r="vertical",children:o,...n})=>{const a=e==="info"?$t:Ze;return t.createElement(ca,{$alignment:r,$type:e,...n},t.createElement(sa,{$type:e,as:a}),o)};xt.displayName="Helper";const da=(e,r)=>{var i,c;const o=(i=Object.getOwnPropertyDescriptor(e,"value"))==null?void 0:i.set,n=Object.getPrototypeOf(e),a=(c=Object.getOwnPropertyDescriptor(n,"value"))==null?void 0:c.set;if(a&&o!==a)a.call(e,r);else if(o)o.call(e,r);else throw new Error("The given element does not have a value setter")},de={small:{outerPadding:"3.5",gap:"2",icon:"3",iconPadding:"8.5",height:"10"},medium:{outerPadding:"4",gap:"2",icon:"4",iconPadding:"10",height:"12"},large:{outerPadding:"4",gap:"2",icon:"5",iconPadding:"11",height:"16"},extraLarge:{outerPadding:"6",gap:"2",icon:"6",iconPadding:"14",height:"20"}},K=(e,r,o)=>e.space[de[r][o]],ot=(e,r,o,n)=>o?n?`calc(-${e.space[de[r].outerPadding]} - ${e.space[o]} - ${e.space[de[r].gap]})`:`calc(${e.space[de[r].outerPadding]} + ${e.space[o]} + ${e.space[de[r].gap]})`:n?`-${e.space[de[r].iconPadding]}`:e.space[de[r].iconPadding],ua={small:"large",medium:"large",large:"2.5xLarge",extraLarge:"2.5xLarge"},pa=(e,r)=>e.radii[ua[r]],fa={small:"small",medium:"body",large:"large",extraLarge:"headingThree"},je=e=>fa[e],ga=s.default.div(({theme:e,$size:r,$hasError:o,$userStyles:n,$validated:a,$showDot:i})=>l.css`
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

    ${i&&a&&l.css`
      :after {
        background: ${e.colors.greenPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${i&&!o&&l.css`
      &:focus-within:after {
        background: ${e.colors.bluePrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${o&&i&&l.css`
      :after {
        background: ${e.colors.redPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

  ${n}
  `),No=s.default.label(({theme:e,$size:r})=>l.css`
    display: flex;
    align-items: center;
    gap: ${e.space[2]};

    height: ${e.space.full};
    color: ${e.colors.greyPrimary};
    background: ${e.colors.greySurface};
    font-size: ${Pe(je(r))};
    line-height: ${Ve(je(r))};
    font-weight: ${e.fontWeights.normal};
    padding: 0 ${K(e,r,"outerPadding")};

    svg {
      display: block;
      color: ${e.colors.greyPrimary};
    }
  `),ma=s.default(No)(()=>l.css`
    order: -2;
  `),ba=s.default.div(({theme:e,$size:r,$iconWidth:o})=>l.css`
    order: -1;
    padding-left: ${K(e,r,"outerPadding")};
    flex: 0 0 ${ot(e,r,o)};
    margin-right: ${ot(e,r,o,!0)};
    display: flex;
    align-items: center;
    justify-content: flex-start;
    pointer-events: none;
    svg {
      display: block;
      width: ${o?e.space[o]:K(e,r,"icon")};
      height: ${o?e.space[o]:K(e,r,"icon")};
      color: ${e.colors.greyPrimary};
    }
    z-index: 1;
  `),$a=s.default.button(({theme:e,$size:r})=>l.css`
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
  `),ha=s.default.input(({theme:e,$size:r,$hasIcon:o,$hasAction:n,$hasError:a,$iconWidth:i})=>l.css`
    background-color: transparent;
    position: relative;
    width: ${e.space.full};
    height: ${e.space.full};
    font-weight: ${e.fontWeights.normal};
    text-overflow: ellipsis;
    color: ${e.colors.textPrimary};
    padding: 0 ${K(e,r,"outerPadding")};
    font-size: ${Pe(je(r))};
    line-height: ${Ve(je(r))};

    ${o&&l.css`
      padding-left: ${ot(e,r,i)};
    `}

    ${n&&l.css`
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

    ${a&&l.css`
      color: ${e.colors.redPrimary};
    `}
  `),wa=s.default.div(({theme:e,$size:r,$hasError:o,$disabled:n,$readOnly:a,$alwaysShowAction:i})=>l.css`
    position: relative;
    background-color: ${e.colors.backgroundPrimary};
    border-radius: ${pa(e,r)};
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

    ${n&&l.css`
      border-color: ${e.colors.border};
      background-color: ${e.colors.greyLight};
    `}

    ${o&&l.css`
      border-color: ${e.colors.redPrimary};
      cursor: default;
    `}

    ${!o&&!a&&l.css`
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

    ${!i&&l.css`
      input:placeholder-shown ~ button {
        opacity: 0;
        transform: scale(0.8);
        pointer-events: none;
      }
    `}
  `),Ct=t.forwardRef(({autoFocus:e,autoComplete:r="off",autoCorrect:o,defaultValue:n,description:a,disabled:i,error:c,validated:u,showDot:d,hideLabel:p,id:b,inputMode:f,icon:g,iconWidth:h,actionIcon:y,alwaysShowAction:x=!1,label:C,labelSecondary:P,name:w="clear-button",placeholder:v,prefix:m,prefixAs:$,readOnly:S,required:T,spellCheck:R,suffix:M,suffixAs:G,clearable:A=!1,tabIndex:_,type:U="text",units:F,value:Q,width:V,onBlur:L,onChange:B,onFocus:xe,onClickAction:ee,size:z="medium",parentStyles:Y,...J},D)=>{const oe=t.useRef(null),q=D||oe,le=v?`${v!=null?v:""}${F?` ${F}`:""}`:void 0,ie=c?!0:void 0,ge=U==="email"?"text":U,me=A||!!ee,ce=j=>{var N;if(j.preventDefault(),j.stopPropagation(),ee)return ee(),(N=q.current)==null?void 0:N.focus();q.current&&(da(q.current,""),q.current.dispatchEvent(new Event("input",{bubbles:!0})),q.current.focus())};return t.createElement(te,{description:a,disabled:i,error:c,hideLabel:p,id:b,label:C,labelSecondary:P,readOnly:S,required:T,width:V},j=>t.createElement(ga,{$disabled:i,$hasError:ie,$validated:u,$showDot:d,$suffix:M!==void 0,$size:z,$userStyles:Y,$ids:j},t.createElement(wa,{$alwaysShowAction:x,$disabled:!!i,$hasError:!!c,$readOnly:!!S,$size:z},t.createElement(ha,{ref:q,...J,...j==null?void 0:j.content,"aria-invalid":ie,$hasAction:me,$hasError:!!c,$hasIcon:!!g,$iconWidth:h,$size:z,autoComplete:r,autoCorrect:o,autoFocus:e,defaultValue:n,disabled:i,inputMode:f,name:w,placeholder:le,readOnly:S,spellCheck:R,tabIndex:_,type:ge,value:Q,onBlur:L,onChange:B,onFocus:xe}),m&&t.createElement(ma,{"aria-hidden":"true",as:$,...j==null?void 0:j.label,$size:z},m),g&&t.createElement(ba,{$iconWidth:h,$size:z},g),me&&t.createElement($a,{$size:z,"data-testid":"input-action-button",onClick:ce,onMouseDown:N=>N.preventDefault()},y||t.createElement(Ge,null)),M&&t.createElement(No,{$size:z,"aria-hidden":"true",...j==null?void 0:j.label,...G?{as:G}:{}},M))))});Ct.displayName="Input";const va=s.default.div(({theme:e,$state:r})=>l.css`
    width: 95%;

    position: fixed;
    left: 2.5%;
    z-index: 9999;
    bottom: ${e.space[4]};

    display: flex;
    flex-direction: row;

    ${W.sm.min(l.css`
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
          transform: translateY(128px);
        `}
  `),Te=({children:e,backdropSurface:r,onDismiss:o,open:n,...a})=>t.createElement(Le,{open:n,surface:r,onDismiss:o},({state:i})=>t.createElement(va,{$state:i,...a},e));Te.displayName="Modal";const ya=s.default.div(({theme:e})=>l.css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${e.space[2]};
    flex-gap: ${e.space[2]};
  `),Ea=s.default.button(({theme:e,$selected:r,$size:o})=>l.css`
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
  `),xa=s.default.p(({theme:e})=>l.css`
    font-size: ${e.fontSizes.small};
    font-weight: ${e.fontWeights.bold};
    color: ${e.colors.greyPrimary};
  `),Io=({total:e,current:r,max:o=5,size:n="medium",alwaysShowFirst:a,alwaysShowLast:i,showEllipsis:c=!0,onChange:u,...d})=>{const p=Math.floor(o/2),b=Math.max(Math.min(Math.max(r-p,1),e-o+1),1),f=Array.from({length:o},(g,h)=>b+h).filter(g=>g<=e);return e>o&&(a&&b>1?c?(f[0]=-1,f.unshift(1)):f[0]=1:c&&b>1&&f.unshift(-1),i&&e>r+p?c?(f[f.length-1]=-1,f.push(e)):f[f.length-1]=e:c&&e>r+p&&f.push(-1)),t.createElement(ya,{...d,"data-testid":re(d,"pagebuttons")},f.map((g,h)=>g===-1?t.createElement(xa,{"data-testid":"pagebutton-dots",key:`${g}-${h}`},"..."):t.createElement(Ea,{$selected:g===r,$size:n,"data-testid":"pagebutton",key:g,type:"button",onClick:()=>u(g)},g)))},lr=s.default.div(({theme:e,$size:r,$hasDropdown:o,$open:n})=>l.css`
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

    ${o&&l.css`
      cursor: pointer;
      &:hover {
        transform: translateY(-1px);
        filter: brightness(1.05);
      }
    `}

    ${n&&l.css`
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
  `),Ca=s.default.div(({theme:e,$size:r})=>l.css`
    width: ${e.space[10]};
    flex: 0 0 ${e.space[10]};
    ${r==="large"&&l.css`
      width: ${e.space[12]};
      flex: 0 0 ${e.space[12]};
    `}
  `),ka=s.default.div(({theme:e,$size:r})=>l.css`
    display: ${r==="small"?"none":"block"};
    min-width: ${e.space.none};
    > div:first-child {
      margin-bottom: -${e.space["0.5"]};
    }
  `),nr=s.default(O)(()=>l.css`
    line-height: initial;
  `),ar=({size:e,avatar:r,address:o,ensName:n})=>t.createElement(t.Fragment,null,t.createElement(Ca,{$size:e},t.createElement(Fe,{label:"profile-avatar",...typeof r=="string"?{src:r}:r||{}})),t.createElement(ka,{$size:e},t.createElement(nr,{color:n?"text":"grey","data-testid":"profile-title",ellipsis:!0,fontVariant:e==="large"?"headingFour":"bodyBold",forwardedAs:"h3"},n||"No name set"),t.createElement(nr,{color:n?"grey":"text","data-testid":"profile-address",fontVariant:"small",forwardedAs:"h4"},Hn(o,e==="large"?30:10,e==="large"?10:5,e==="large"?10:5)))),kt=({size:e="medium",avatar:r,dropdownItems:o,address:n,ensName:a,alignDropdown:i="right",...c})=>{const[u,d]=t.useState(!1);return o?t.createElement(Xe,{items:o,isOpen:u,setIsOpen:d,align:i,inheritContentWidth:!0},t.createElement(lr,{...c,$hasDropdown:!0,$open:u,$size:e,onClick:()=>d(!u)},t.createElement(ar,{size:e,avatar:r,address:n,ensName:a}))):t.createElement(lr,{...c,"data-testid":re(c,"profile"),$open:u,$size:e},t.createElement(ar,{size:e,avatar:r,address:n,ensName:a}))};kt.displayName="Profile";const Sa=s.default.input(({theme:e,$colorStyle:r})=>l.css`
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
  `),St=t.forwardRef(({description:e,disabled:r,error:o,inline:n=!0,hideLabel:a,id:i,label:c,labelSecondary:u,name:d,required:p,tabIndex:b,value:f,checked:g,width:h,colorStyle:y="accentPrimary",onBlur:x,onChange:C,onFocus:P,...w},v)=>{const m=t.useRef(null),$=v||m;return t.createElement(te,{description:e,error:o,hideLabel:a,id:i,inline:n,label:c,labelSecondary:u,required:p,width:h,disabled:r},t.createElement(Sa,{$colorStyle:y,...w,"aria-invalid":o?!0:void 0,"aria-selected":g?!0:void 0,"data-testid":re(w,"radio"),type:"radio",role:"radio",checked:g,disabled:r,name:d,ref:$,tabIndex:b,value:f,onBlur:x,onChange:C,onFocus:P}))});St.displayName="RadioButton";const Wo=e=>{let r=!1,o=!1;const n=()=>{r=!0,e.preventDefault()},a=()=>{o=!0,e.stopPropagation()};return{nativeEvent:e,currentTarget:e.currentTarget,target:e.target,bubbles:e.bubbles,cancelable:e.cancelable,defaultPrevented:e.defaultPrevented,eventPhase:e.eventPhase,isTrusted:e.isTrusted,preventDefault:n,isDefaultPrevented:()=>r,stopPropagation:a,isPropagationStopped:()=>o,persist:()=>{},timeStamp:e.timeStamp,type:e.type}},Ra=s.default.div(({theme:e,$inline:r})=>l.css`
    display: flex;
    flex-direction: ${r?"row":"column"};
    gap: ${e.space[2]};
    justify-content: flex-start;
    flex-wrap: ${r?"wrap":"nowrap"};
  `),Rt=t.forwardRef(({value:e,children:r,inline:o=!1,onChange:n,onBlur:a,...i},c)=>{const u=t.useRef(null),d=c||u,p=t.useRef(null),[b,f]=t.useState(!1),[g,h]=t.useState(e);t.useEffect(()=>{e&&e!=g&&h(e)},[e]);const y=w=>{h(w.target.value),n&&n(w)},x=()=>{p.current&&p.current.focus()},C=w=>{a&&a(w)},P=(w,v="radiogroup")=>{if(n&&w){const m=document.createElement("input");m.value=w,m.name=v;const $=new Event("change",{bubbles:!0});Object.defineProperty($,"target",{writable:!1,value:m});const S=Wo($);n(S)}};return t.createElement(Ra,{$inline:o,...i,"data-testid":re(i,"radiogroup"),ref:d,role:"radiogroup",onFocus:x},t.Children.map(r,w=>{w.props.checked&&!b&&(f(!0),g!==w.props.value&&(h(w.props.value),f(!0),P(w.props.value,w.props.name)));const v=w.props.value===g;return t.cloneElement(w,{ref:v?p:void 0,checked:v,onChange:y,onBlur:C})}))});Rt.displayName="RadioButtonGroup";var Oe=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Pa=typeof Oe=="object"&&Oe&&Oe.Object===Object&&Oe,Va=Pa,La=Va,Za=typeof self=="object"&&self&&self.Object===Object&&self,Ma=La||Za||Function("return this")(),Ga=Ma,Ta=Ga,Ba=Ta.Symbol,Pt=Ba;function Oa(e,r){for(var o=-1,n=e==null?0:e.length,a=Array(n);++o<n;)a[o]=r(e[o],o,e);return a}var Aa=Oa,Ha=Array.isArray,ja=Ha,ir=Pt,_o=Object.prototype,Fa=_o.hasOwnProperty,Da=_o.toString,ke=ir?ir.toStringTag:void 0;function za(e){var r=Fa.call(e,ke),o=e[ke];try{e[ke]=void 0;var n=!0}catch{}var a=Da.call(e);return n&&(r?e[ke]=o:delete e[ke]),a}var Na=za,Ia=Object.prototype,Wa=Ia.toString;function _a(e){return Wa.call(e)}var Ua=_a,cr=Pt,Ya=Na,qa=Ua,Xa="[object Null]",Ka="[object Undefined]",sr=cr?cr.toStringTag:void 0;function Qa(e){return e==null?e===void 0?Ka:Xa:sr&&sr in Object(e)?Ya(e):qa(e)}var Ja=Qa;function ei(e){return e!=null&&typeof e=="object"}var ti=ei,ri=Ja,oi=ti,li="[object Symbol]";function ni(e){return typeof e=="symbol"||oi(e)&&ri(e)==li}var ai=ni,dr=Pt,ii=Aa,ci=ja,si=ai,di=1/0,ur=dr?dr.prototype:void 0,pr=ur?ur.toString:void 0;function Uo(e){if(typeof e=="string")return e;if(ci(e))return ii(e,Uo)+"";if(si(e))return pr?pr.call(e):"";var r=e+"";return r=="0"&&1/e==-di?"-0":r}var ui=Uo,pi=ui;function fi(e){return e==null?"":pi(e)}var gi=fi,mi=gi,bi=0;function $i(e){var r=++bi;return mi(e)+r}var hi=$i;const tt="CREATE_OPTION_VALUE",wi=s.default.div(({theme:e,$size:r,$showDot:o,$hasError:n,$validated:a,$open:i,$disabled:c,$readOnly:u})=>l.css`
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

    ${o&&!c&&a&&!i&&l.css`
      :after {
        background: ${e.colors.greenPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${o&&!c&&!n&&i&&l.css`
      :after {
        background: ${e.colors.bluePrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${n&&!c&&o&&l.css`
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
  `),vi=s.default.div(({theme:e,$open:r,$hasError:o,$disabled:n,$size:a,$ids:i})=>l.css`
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

    ${a==="small"&&l.css`
      padding-left: ${e.space["3.5"]};
    `}

    ${n&&l.css`
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
  `),yi=s.default.input(()=>l.css`
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    appearance: none;
    visibility: hidden;
  `),Yo=s.default.div(()=>l.css`
    flex: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  `),Ei=s.default(Yo)(({theme:e})=>l.css`
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
  `),qo=s.default.button(({theme:e,$size:r})=>l.css`
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
  `),Ci=s.default(qo)(({theme:e,$open:r,$direction:o})=>l.css`
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
  `),ki=s.default.div(({theme:e,$state:r,$direction:o,$rows:n,$size:a,$align:i})=>l.css`
    display: ${r==="exited"?"none":"block"};
    position: absolute;
    visibility: hidden;
    opacity: 0;
    overflow: hidden;

    border: 1px solid ${e.colors.border};
    padding: ${e.space[2]};
    min-width: ${e.space.full};
    ${i==="right"?l.css`
          right: 0;
        `:l.css`
          left: 0;
        `}
    border-radius: ${e.radii["2xLarge"]};
    background: ${e.colors.background};
    transition: all 0.3s cubic-bezier(1, 0, 0.22, 1.6), z-index 0.3s linear;

    font-size: ${e.fontSizes.body};
    line-height: ${e.lineHeights.body};

    ${a==="small"&&l.css`
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

    ${n&&l.css`
      padding-right: ${e.space[1]};
    `}
  `),Si=(e,r,o)=>o==="small"?`calc(${e.space[9]} * ${r})`:`calc(${e.space[11]} * ${r})`,Ri=s.default.div(({theme:e,$rows:r,$direction:o,$size:n})=>l.css`
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
      max-height: ${Si(e,r,n)};
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
  `),Pi=s.default.button(({theme:e,$selected:r,$highlighted:o,$color:n,$size:a})=>l.css`
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
    font-weight: ${rt("body")};
    line-height: ${Ve("body")};
    text-align: left;

    svg {
      display: block;
      width: ${e.space[4]};
      height: ${e.space[4]};
      color: ${e.colors.textPrimary};
    }

    ${n&&l.css`
      color: ${e.colors[n]};
      svg {
        color: ${e.colors[n]};
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

    ${a==="small"&&l.css`
      height: ${e.space[9]};
      flex: 0 0 ${e.space[9]};
      font-size: ${Pe("small")};
      font-weight: ${rt("small")};
      line-height: ${Ve("small")};
    `}
  `),Vi=s.default.div(({theme:e})=>l.css`
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
  `),Li=e=>(r,o)=>{if(o.label){const n=o.label.trim().toLowerCase();n.indexOf(e)!==-1&&r.options.push(o),n===e&&(r.exactMatch=!0)}return r};var Xo=(e=>(e.ArrowUp="ArrowUp",e.ArrowDown="ArrowDown",e.Enter="Enter",e))(Xo||{});const Zi=(e,r,o)=>typeof o=="string"?o:(o==null?void 0:o[e])||r,fr=(e,r,o)=>typeof o=="number"?o:(o==null?void 0:o[e])||r,Vt=t.forwardRef(({description:e,disabled:r,autocomplete:o=!1,createable:n=!1,createablePrefix:a="Add ",placeholder:i,direction:c="down",error:u,hideLabel:d,inline:p,id:b,label:f,labelSecondary:g,required:h,tabIndex:y=-1,readOnly:x=!1,width:C,onBlur:P,onChange:w,onFocus:v,onCreate:m,options:$,rows:S,emptyListMessage:T="No results",name:R,value:M,size:G="medium",padding:A,inputSize:_,align:U,validated:F,showDot:Q=!1,...V},L)=>{const B=t.useRef(null),xe=L||B,ee=t.useRef(null),z=t.useRef(null),[Y,J]=t.useState(""),[D,oe]=t.useState(""),q=n&&D!=="",le=n||o,[ie]=t.useState(b||hi()),[ge,me]=t.useState("");t.useEffect(()=>{M!==ge&&M!==void 0&&me(M)},[M]);const ce=($==null?void 0:$.find(E=>E.value===ge))||null,j=(E,k)=>{if(!(E!=null&&E.disabled)){if((E==null?void 0:E.value)===tt)m&&m(D);else if(E!=null&&E.value&&(me(E==null?void 0:E.value),k)){const I=k.nativeEvent||k,Ce=new I.constructor(I.type,I);Object.defineProperties(Ce,{target:{writable:!0,value:{value:E.value,name:R}},currentTarget:{writable:!0,value:{value:E.value,name:R}}}),w&&w(Ce)}}},N=t.useMemo(()=>{if(!le||D==="")return $;const E=D.trim().toLowerCase(),{options:k,exactMatch:I}=(Array.isArray($)?$:[$]).reduce(Li(E),{options:[],exactMatch:!1});return[...k,...q&&!I?[{label:`${a}"${D}"`,value:tt}]:[]]},[$,q,le,D,a]),[Ke,be]=t.useState(-1),Be=t.useCallback(E=>{const k=N[E];if(k&&!k.disabled&&k.value!==tt){be(E),J(k.label||"");return}J(D),be(E)},[N,D,J,be]),Bt=E=>{var I;let k=Ke;do{if(E==="previous"?k--:k++,k<0)return Be(-1);if(N[k]&&!((I=N[k])!=null&&I.disabled))return Be(k)}while(N[k])},nl=E=>{const k=N[Ke];k&&j(k,E),Ot()},[ne,se]=t.useState(!1),$e=!r&&ne,al=D!==""&&le,il=fr("min",4,_),cl=fr("max",20,_),sl=Math.min(Math.max(il,D.length),cl),[Qe,dl]=lt.useTransition({timeout:{enter:0,exit:300},preEnter:!0});he.useEffect(()=>{dl($e)},[$e]),he.useEffect(()=>{!ne&&Qe==="unmounted"&&Ot()},[ne,Qe]);const ul=Zi("inner",G==="small"?"3":"4",A),Ot=()=>{oe(""),J(""),be(-1)},pl=()=>{le&&!ne&&se(!0),le||se(!ne)},At=E=>{if(!ne)return E.stopPropagation(),E.preventDefault(),se(!0);E.key in Xo&&(E.preventDefault(),E.stopPropagation(),E.key==="ArrowUp"?Bt(c==="up"?"next":"previous"):E.key==="ArrowDown"&&Bt(c==="up"?"previous":"next"),E.key==="Enter"&&(nl(E),se(!1)))},fl=E=>{const k=E.currentTarget.value;oe(k),J(k),be(-1)},gl=E=>{E.stopPropagation(),oe(""),J(""),be(-1)},ml=()=>{Be(-1)},bl=E=>k=>{k.stopPropagation(),j(E,k),se(!1)},$l=E=>{const k=Number(E.currentTarget.getAttribute("data-option-index"));isNaN(k)||Be(k)};dn(ee,"click",()=>se(!1),ne);const Ht=({option:E,...k})=>E?t.createElement(t.Fragment,null,E.prefix&&t.createElement("div",null,E.prefix),t.createElement(Yo,{...k},E.node?E.node:E.label||E.value)):null;return t.createElement(te,{"data-testid":"select",description:e,disabled:r,error:u,hideLabel:d,id:ie,inline:p,label:f,labelSecondary:g,readOnly:x,required:h,width:C},E=>t.createElement(wi,{...V,"aria-controls":`listbox-${ie}`,"aria-expanded":"true","aria-haspopup":"listbox","aria-invalid":u?!0:void 0,"data-testid":"select-container",role:"combobox",onClick:pl,onKeyDown:At,$disabled:!!r,$hasError:!!u,$open:$e,$readOnly:x,$showDot:Q,$size:G,$validated:!!F,id:`combo-${ie}`,ref:ee,tabIndex:y,onBlur:P,onFocus:v},t.createElement(vi,{$disabled:!!r,$hasError:!!u,$ids:E,$open:$e,$size:G},t.createElement(yi,{ref:xe,...E==null?void 0:E.content,"aria-hidden":!0,disabled:r,name:R,placeholder:i,readOnly:x,tabIndex:-1,value:ge,onChange:k=>{const I=k.target.value,Ce=$==null?void 0:$.find(hl=>hl.value===I);Ce&&(me(Ce.value),w&&w(k))},onFocus:()=>{var k;z.current?z.current.focus():(k=ee.current)==null||k.focus()}}),le&&$e?t.createElement(xi,{autoCapitalize:"none",autoComplete:"off",autoFocus:!0,"data-testid":"select-input",placeholder:(ce==null?void 0:ce.label)||i,ref:z,size:sl,spellCheck:"false",style:{flex:"1",height:"100%"},value:Y,onChange:fl,onKeyDown:k=>At(k)}):ce?t.createElement(Ht,{"data-testid":"selected",option:ce}):t.createElement(Ei,null,i),al?t.createElement(qo,{$size:G,type:"button",onClick:gl},t.createElement(Ge,null)):x?null:t.createElement(Ci,{$direction:c,$open:$e,$size:G,id:"chevron",type:"button",onClick:()=>se(!ne)},t.createElement(Ye,null))),t.createElement(ki,{$align:U,$direction:c,$rows:S,$size:G,$state:Qe,id:`listbox-${ie}`,role:"listbox",tabIndex:-1,onMouseLeave:ml},t.createElement(Ri,{$direction:c,$rows:S,$size:G},N.length===0&&t.createElement(Vi,null,T),N.map((k,I)=>t.createElement(Pi,{$selected:(k==null?void 0:k.value)===ge,$highlighted:I===Ke,$gap:ul,$color:k.color,$size:G,"data-option-index":I,"data-testid":`select-option-${k.value}`,disabled:k.disabled,key:k.value,role:"option",type:"button",onClick:bl(k),onMouseOver:$l},t.createElement(Ht,{option:k})))))))});Vt.displayName="Select";const Mi=s.default.div(({theme:e})=>l.css`
    width: ${e.space.full};
  `),gr=({theme:e})=>l.css`
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
      ${gr}
    }

    &::-moz-range-thumb {
      ${gr}
    }

    &:hover {
      background: hsla(${e.colors.raw.accent} / 0.45);
    }

    ${r&&l.css`
      opacity: 0.5;
      filter: grayscale(100%);
      cursor: not-allowed;
    `}
  `),Lt=t.forwardRef(({label:e,description:r,error:o,hideLabel:n,inline:a,labelSecondary:i,required:c,width:u,defaultValue:d,disabled:p,id:b,name:f,readOnly:g,tabIndex:h,value:y,min:x=1,max:C=100,onChange:P,onBlur:w,onFocus:v,step:m="any",...$},S)=>{const T=t.useRef(null),R=S||T;return t.createElement(te,{label:e,description:r,error:o,hideLabel:n,inline:a,labelSecondary:i,required:c,width:u,id:b},M=>t.createElement(Mi,null,t.createElement(Gi,{ref:R,type:"range",...$,...M==null?void 0:M.content,defaultValue:d,disabled:p,name:f,readOnly:g,tabIndex:h,value:y,min:x,max:C,onChange:P,onBlur:w,onFocus:v,step:m})))});Lt.displayName="Slider";const Ti=s.default.div(({theme:e,$error:r,$validated:o,$showDot:n,$alwaysShowAction:a,$disabled:i})=>l.css`
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

    ${n&&!i&&r&&l.css`
      &:after {
        background-color: ${e.colors.redPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${n&&!i&&o&&!r&&l.css`
      &:after {
        background-color: ${e.colors.greenPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${n&&!r&&l.css`
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

    ${!a&&l.css`
      textarea:placeholder-shown ~ button {
        opacity: 0;
        transform: scale(0.8);
      }
    `}
  `),Bi=s.default.textarea(({theme:e,$size:r,$hasAction:o,$error:n})=>l.css`
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

    ${n&&l.css`
      border-color: ${e.colors.redPrimary};
      color: ${e.colors.redPrimary};
    `}

    ${!n&&l.css`
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
  `),Zt=t.forwardRef(({autoCorrect:e,autoFocus:r,clearable:o=!1,defaultValue:n,description:a,disabled:i,error:c,validated:u,showDot:d,hideLabel:p,id:b,label:f,labelSecondary:g,maxLength:h,name:y="textarea",placeholder:x,readOnly:C,required:P,rows:w=5,size:v="medium",spellCheck:m,tabIndex:$,value:S,width:T,actionIcon:R,alwaysShowAction:M=!1,onClickAction:G,onChange:A,onBlur:_,onFocus:U,...F},Q)=>{const V=t.useRef(null),L=Q||V,B=c?!0:void 0,xe=o||!!G,ee=()=>{var oe,q;if(!A)return L.current&&(L.current.value=""),(oe=L.current)==null?void 0:oe.focus();const Y=document.createElement("input");Y.value="",Y.name=y;const J=new Event("change",{bubbles:!0});Object.defineProperties(J,{target:{writable:!1,value:Y},currentTarget:{writable:!1,value:Y}});const D=Wo(J);A(D),(q=L.current)==null||q.focus()},z=()=>{if(G)return G();ee()};return t.createElement(te,{description:a,disabled:i,error:c,hideLabel:p,id:b,label:f,labelSecondary:g,readOnly:C,required:P,width:T},Y=>t.createElement(Ti,{$alwaysShowAction:M,$disabled:i,$error:!!c,$showDot:d,$validated:u},t.createElement(Bi,{...F,...Y==null?void 0:Y.content,"aria-invalid":B,$error:B,$hasAction:xe,$showDot:d,$size:v,$validated:u,autoCorrect:e,autoFocus:r,defaultValue:n,disabled:i,maxLength:h,name:y,placeholder:x,readOnly:C,ref:L,rows:w,spellCheck:m,tabIndex:$,value:S,onBlur:_,onChange:A,onFocus:U}),(o||G)&&t.createElement(Oi,{$size:v,type:"button",onClick:z},R||t.createElement(Ge,null))))});Zt.displayName="Textarea";const mr={small:{width:"12",height:"7"},medium:{width:"12",height:"8"},large:{width:"16",height:"10"}},Ae={small:{diameter:"5",translateX:"2.5"},medium:{diameter:"6",translateX:"2"},large:{diameter:"8",translateX:"3"}},Ai=s.default.input(({theme:e,$size:r="medium"})=>l.css`
    position: relative;
    background-color: ${e.colors.border};
    height: ${e.space[mr[r].height]};
    width: ${e.space[mr[r].width]};
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
      width: ${e.space[Ae[r].diameter]};
      height: ${e.space[Ae[r].diameter]};
      border-radius: ${e.radii.full};
      transform: translateX(-${e.space[Ae[r].translateX]});
      transition: transform 0.3s ease-in-out, background-color 0.1s ease-in-out;
    }

    &:checked::after {
      transform: translateX(${e.space[Ae[r].translateX]});
    }

    &:disabled::after {
      background-color: ${e.colors.greyPrimary};
    }
  `),Mt=t.forwardRef(({size:e="medium",...r},o)=>t.createElement(Ai,{ref:o,type:"checkbox",...r,$size:e}));Mt.displayName="Toggle";const br={top:`
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
  `},Hi=s.default.div(({theme:e,$placement:r,$mobilePlacement:o})=>l.css`
    position: relative;
    pointer-events: none;
    box-sizing: border-box;
    filter: drop-shadow(0px 0px 1px #e8e8e8)
      drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2));
    border-radius: ${e.radii.large};
    padding: ${e.space["2.5"]} ${e.space["2.5"]} ${e.space["2.5"]}
      ${e.space["3.5"]};
    background: ${e.colors.background};

    ${br[o]}
    ${W.md.min(l.css`
      &:before {
        display: none;
      }
      &:after {
        display: none;
      }
      ${br[r]}
    `)}
  `),ji=({placement:e,mobilePlacement:r,children:o})=>t.createElement(Hi,{$mobilePlacement:r,$placement:e,"data-testid":"tooltip-popover"},o),Gt=({content:e,placement:r="top",mobilePlacement:o="top",children:n,...a})=>{const i=t.useRef(null),c=t.Children.only(n),u=t.cloneElement(c,{ref:i}),d=t.createElement(ji,{mobilePlacement:o,placement:r},e);return t.createElement(t.Fragment,null,t.createElement(Ie,{anchorRef:i,mobilePlacement:o,placement:r,popover:d,...a}),u)};Gt.displayName="Tooltip";const Fi=s.default.button(({theme:e})=>l.css`
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
  `),Ko=s.default.div(({theme:e})=>l.css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: ${e.space[6]};

    padding: ${e.space["3.5"]};
    border-radius: ${e.radii["3xLarge"]};
    background-color: ${e.colors.background};
    position: relative;
    width: 100%;
    ${W.sm.min(l.css`
      width: initial;
    `)}
    ${W.md.min(l.css`
      max-width: 80vw;
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
  `),zi=({alert:e})=>{const r=!!e&&["error","warning"].includes(e);return t.createElement(Di,{$alert:e},r?t.createElement(Ze,null):t.createElement(qe,null))},Ni=s.default(O)(()=>l.css`
    text-align: center;
  `),Ii=s.default(O)(({theme:e})=>l.css`
    font-size: ${e.fontSizes.body};
    line-height: ${e.lineHeights.body};
    font-weight: ${e.fontWeights.bold};
    color: ${e.colors.textSecondary};
    text-align: center;

    padding: 0 ${e.space[4]};
    max-width: ${e.space[72]};
  `),Wi=s.default.div(({theme:e,$center:r})=>l.css`
    display: flex;
    align-items: center;
    justify-content: stretch;
    flex-direction: ${r?"column":"row"};
    gap: ${e.space[2]};
    width: ${e.space.full};
    max-width: ${e.space[96]};
  `),_i=s.default.div(({theme:e})=>l.css`
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
  `),Qo=s.default.div(({theme:e})=>l.css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${e.space[5]};
    ${W.sm.min(l.css`
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
  `),Jo=({title:e,subtitle:r,alert:o})=>t.createElement(Ui,null,o&&t.createElement(zi,{alert:o}),e&&(typeof e!="string"&&e||t.createElement(Ni,{fontVariant:"headingFour"},e)),r&&(typeof r!="string"&&r||t.createElement(Ii,null,r))),el=({leading:e,trailing:r,center:o,currentStep:n,stepCount:a,stepStatus:i})=>{const c=t.useCallback(b=>b===n?i||"inProgress":b<(n||0)?"completed":"notStarted",[n,i]),u=e||r;return u||!!a?t.createElement(_i,null,a&&t.createElement(Yi,{"data-testid":"step-container"},Array.from({length:a},(b,f)=>t.createElement(qi,{$type:c(f),"data-testid":`step-item-${f}-${c(f)}`,key:f}))),u&&t.createElement(Wi,{$center:o},e||!o&&t.createElement("div",{style:{flexGrow:1}}),r||!o&&t.createElement("div",{style:{flexGrow:1}}))):null},$r=({open:e,onDismiss:r,alert:o,title:n,subtitle:a,children:i,currentStep:c,stepCount:u,stepStatus:d,...p})=>t.createElement(Te,{...p,open:e,onDismiss:r},t.createElement(Ko,null,t.createElement(Qo,null,t.createElement(Jo,{alert:o,title:n,subtitle:a,currentStep:c,stepCount:u,stepStatus:d}),i))),He=({onClick:e})=>t.createElement(Fi,{"data-testid":"close-icon",onClick:e},t.createElement(ye,null)),Ee=({children:e,onDismiss:r,onClose:o,open:n,variant:a="closable",...i})=>{if(a==="actionable"){const{trailing:c,leading:u,alert:d,title:p,subtitle:b,center:f,currentStep:g,stepCount:h,stepStatus:y,...x}=i,C=o||r;return t.createElement($r,{...x,alert:d,open:n,subtitle:b,title:p,onDismiss:r},e,t.createElement(el,{leading:u,trailing:c,center:f,currentStep:g,stepCount:h,stepStatus:y}),C&&t.createElement(He,{onClick:C}))}else if(a==="closable"){const{alert:c,title:u,subtitle:d,...p}=i,b=o||r;return t.createElement($r,{...p,alert:c,open:n,subtitle:d,title:u,onDismiss:r},e,b&&t.createElement(He,{onClick:b}))}return t.createElement(Te,{onDismiss:r,open:n},t.createElement(Ko,null,t.createElement(Qo,null,e),o&&t.createElement(He,{onClick:o})))};Ee.displayName="Dialog";Ee.Footer=el;Ee.Heading=Jo;Ee.CloseButton=He;const tl=s.default.svg(({theme:e})=>l.css`
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
  `),rl=s.default.div(({theme:e,$state:r,$top:o,$left:n,$right:a,$bottom:i,$mobile:c,$popped:u})=>l.css`
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
      ${n&&`left: ${e.space[n]};`}
      ${a&&`right: ${e.space[a]};`}
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

    ${r==="entered"?l.css`
          opacity: 1;
          transform: translateY(0px);
        `:l.css`
          opacity: 0;
          transform: translateY(-64px);
        `}
  `),ol=s.default(O)(({theme:e})=>l.css`
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
  `),Qi=()=>t.createElement(Xi,null,t.createElement(Ki,null)),Ji=({onClose:e,title:r,description:o,top:n="4",left:a,right:i="4",bottom:c,state:u,children:d,...p})=>t.createElement(rl,{...p,"data-testid":re(p,"toast-desktop"),$bottom:c,$left:a,$mobile:!1,$right:i,$state:u,$top:n},t.createElement(tl,{as:ye,"data-testid":"toast-close-icon",onClick:()=>e()}),t.createElement(ol,{fontVariant:"large",weight:"bold"},r),t.createElement(O,null,o),d&&t.createElement(ll,null,d)),ll=s.default.div(({theme:e})=>l.css`
    margin-top: ${e.space[3]};
    width: 100%;
  `),ec=({onClose:e,open:r,title:o,description:n,left:a,right:i="4",bottom:c,state:u,children:d,popped:p,setPopped:b,...f})=>{const{space:g}=l.useTheme(),h=t.useRef(null),[y,x]=t.useState(.025*window.innerHeight),[C,P]=t.useState([]);t.useEffect(()=>{r&&x(.025*window.innerHeight)},[r]),t.useEffect(()=>{var $;const m=.025*window.innerHeight;if(C.length&&!p){let S=!1,T=C[C.length-1];T===void 0&&(T=C[C.length-2]||0,S=!0);const R=parseInt(getComputedStyle(document.documentElement).fontSize),M=C[0]-T;if(S)parseFloat(g[8])*R>((($=h.current)==null?void 0:$.offsetHeight)||0)-M?e():(x(m),P([]));else if(M*-1>parseFloat(g[32])*R)x(m*2),b(!0);else if(M>0)x(m-M);else{const G=.25*(M^2);x(m-G)}}},[C]);const w=t.useCallback(m=>{var $;m.preventDefault(),P([($=m.targetTouches.item(0))==null?void 0:$.pageY])},[]),v=t.useCallback(m=>{m.preventDefault(),P($=>{var S;return[...$,(S=m.targetTouches.item(0))==null?void 0:S.pageY]})},[]);return t.useEffect(()=>{const m=h.current;return m==null||m.addEventListener("touchstart",w,{passive:!1,capture:!1}),m==null||m.addEventListener("touchmove",v,{passive:!1,capture:!1}),()=>{m==null||m.removeEventListener("touchstart",w,{capture:!1}),m==null||m.removeEventListener("touchmove",v,{capture:!1})}},[]),t.useEffect(()=>{const m=h.current;p&&(m==null||m.removeEventListener("touchstart",w,{capture:!1}),m==null||m.removeEventListener("touchmove",v,{capture:!1}))},[p]),t.createElement(rl,{...f,"data-testid":re(f,"toast-touch"),style:{top:`${y}px`},onClick:()=>b(!0),onTouchEnd:()=>P(m=>[...m,void 0]),$bottom:c,$left:a,$mobile:!0,$popped:p,$right:i,$state:u,ref:h},t.createElement(ol,{fontVariant:"large",weight:"bold"},o),t.createElement(O,null,n),p&&t.createElement(t.Fragment,null,d&&t.createElement(ll,null,d),t.createElement(tl,{as:ye,"data-testid":"toast-close-icon",onClick:m=>{m.stopPropagation(),e()}})),!p&&t.createElement(Qi,null))},Tt=({onClose:e,open:r,msToShow:o=8e3,variant:n="desktop",...a})=>{const[i,c]=t.useState(!1),u=t.useRef();return t.useEffect(()=>{if(r)return c(!1),u.current=setTimeout(()=>e(),o||8e3),()=>{clearTimeout(u.current),e()}},[r]),t.useEffect(()=>{i&&clearTimeout(u.current)},[i]),t.createElement(Le,{className:"toast",noBackground:!0,open:r,onDismiss:n==="touch"&&i?()=>e():void 0},({state:d})=>n==="touch"?t.createElement(ec,{...a,open:r,popped:i,setPopped:c,state:d,onClose:e}):t.createElement(Ji,{...a,open:r,state:d,onClose:e}))};Tt.displayName="Toast";const tc=Object.freeze(Object.defineProperty({__proto__:null,Avatar:Fe,BackdropSurface:nt,Banner:ct,Button:ze,Card:Ne,DynamicPopover:Ie,Field:te,FileInput:dt,Heading:We,Portal:_e,RecordItem:ut,ScrollBox:Mr,Skeleton:ft,Spinner:ue,Tag:Ue,Typography:O,VisuallyHidden:fe,Backdrop:Le,Checkbox:gt,CheckboxRow:mt,CountdownCircle:vt,CurrencyToggle:yt,Dropdown:Xe,FieldSet:Et,Helper:xt,Input:Ct,Modal:Te,PageButtons:Io,Profile:kt,RadioButton:St,RadioButtonGroup:Rt,Select:Vt,SkeletonGroup:pt,Slider:Lt,Textarea:Zt,Toggle:Mt,Tooltip:Gt,Dialog:Ee,Toast:Tt,AeroplaneSVG:Tr,AlertSVG:Ze,BrowserSVG:Br,CalendarSVG:Or,CameraSVG:Ar,CheckSVG:Me,CheckCircleSVG:Hr,CogSVG:jr,CogActiveSVG:Fr,CopySVG:bt,CounterClockwiseArrowSVG:Dr,CreditCardSVG:zr,CrossSVG:ye,CrossCircleSVG:Ge,DisabledSVG:Nr,DocumentSVG:Ir,DotGridSVG:Wr,DotGridActiveSVG:_r,DownArrowSVG:Ur,DownChevronSVG:Ye,DownCircleSVG:Yr,EnsSVG:qr,EthSVG:qe,EthTransparentSVG:Xr,EthTransparentInvertedSVG:Kr,ExitSVG:Qr,EyeSVG:Jr,EyeStrikethroughSVG:eo,FastForwardSVG:to,FilterSVG:ro,FlameSVG:oo,GasPumpSVG:lo,HeartSVG:no,HeartActiveSVG:ao,HouseSVG:io,InfoCircleSVG:$t,KeySVG:co,LanguageSVG:so,LeftArrowSVG:uo,LeftChevronSVG:po,LifebuoySVG:fo,LinkSVG:go,ListSVG:mo,ListDownSVG:bo,ListUpSVG:$o,LockSVG:ho,MagnifyingGlassSVG:wo,MagnifyingGlassActiveSVG:vo,MagnifyingGlassSimpleSVG:yo,MarkerSVG:Eo,MenuSVG:xo,MinusSVG:Co,MinusCircleSVG:ko,MoonSVG:So,NametagSVG:Ro,OutlinkSVG:Po,PersonSVG:Vo,PersonPlusSVG:Lo,PlusSVG:Zo,PlusCircleSVG:Mo,QuestionBubbleSVG:Go,QuestionCircleSVG:To,RightArrowSVG:Bo,RightChevronSVG:Oo,SpannerSVG:Ao,SpannerAltSVG:Ho,SunSVG:jo,UpArrowSVG:ht,UpChevronSVG:Fo,UpCircleSVG:Do,UpRightArrowSVG:wt,WalletSVG:zo},Symbol.toStringTag,{value:"Module"})),rc=l.createGlobalStyle(({theme:e})=>l.css`
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
  `),oc=rc;exports.AeroplaneSVG=Tr;exports.AlertSVG=Ze;exports.Avatar=Fe;exports.Backdrop=Le;exports.BackdropSurface=nt;exports.Banner=ct;exports.BrowserSVG=Br;exports.Button=ze;exports.CalendarSVG=Or;exports.CameraSVG=Ar;exports.Card=Ne;exports.CheckCircleSVG=Hr;exports.CheckSVG=Me;exports.Checkbox=gt;exports.CheckboxRow=mt;exports.CogActiveSVG=Fr;exports.CogSVG=jr;exports.Components=tc;exports.CopySVG=bt;exports.CountdownCircle=vt;exports.CounterClockwiseArrowSVG=Dr;exports.CreditCardSVG=zr;exports.CrossCircleSVG=Ge;exports.CrossSVG=ye;exports.CurrencyToggle=yt;exports.Dialog=Ee;exports.DisabledSVG=Nr;exports.DocumentSVG=Ir;exports.DotGridActiveSVG=_r;exports.DotGridSVG=Wr;exports.DownArrowSVG=Ur;exports.DownChevronSVG=Ye;exports.DownCircleSVG=Yr;exports.Dropdown=Xe;exports.DynamicPopover=Ie;exports.EnsSVG=qr;exports.EthSVG=qe;exports.EthTransparentInvertedSVG=Kr;exports.EthTransparentSVG=Xr;exports.ExitSVG=Qr;exports.EyeSVG=Jr;exports.EyeStrikethroughSVG=eo;exports.FastForwardSVG=to;exports.Field=te;exports.FieldSet=Et;exports.FileInput=dt;exports.FilterSVG=ro;exports.FlameSVG=oo;exports.GasPumpSVG=lo;exports.Heading=We;exports.HeartActiveSVG=ao;exports.HeartSVG=no;exports.Helper=xt;exports.HouseSVG=io;exports.InfoCircleSVG=$t;exports.Input=Ct;exports.KeySVG=co;exports.LanguageSVG=so;exports.LeftArrowSVG=uo;exports.LeftChevronSVG=po;exports.LifebuoySVG=fo;exports.LinkSVG=go;exports.ListDownSVG=bo;exports.ListSVG=mo;exports.ListUpSVG=$o;exports.LockSVG=ho;exports.MagnifyingGlassActiveSVG=vo;exports.MagnifyingGlassSVG=wo;exports.MagnifyingGlassSimpleSVG=yo;exports.MarkerSVG=Eo;exports.MenuSVG=xo;exports.MinusCircleSVG=ko;exports.MinusSVG=Co;exports.Modal=Te;exports.MoonSVG=So;exports.NametagSVG=Ro;exports.OutlinkSVG=Po;exports.PageButtons=Io;exports.PersonPlusSVG=Lo;exports.PersonSVG=Vo;exports.PlusCircleSVG=Mo;exports.PlusSVG=Zo;exports.Portal=_e;exports.Profile=kt;exports.QuestionBubbleSVG=Go;exports.QuestionCircleSVG=To;exports.RadioButton=St;exports.RadioButtonGroup=Rt;exports.RecordItem=ut;exports.RightArrowSVG=Bo;exports.RightChevronSVG=Oo;exports.ScrollBox=Mr;exports.Select=Vt;exports.Skeleton=ft;exports.SkeletonGroup=pt;exports.Slider=Lt;exports.SpannerAltSVG=Ho;exports.SpannerSVG=Ao;exports.Spinner=ue;exports.SunSVG=jo;exports.Tag=Ue;exports.Textarea=Zt;exports.ThorinGlobalStyles=oc;exports.Toast=Tt;exports.Toggle=Mt;exports.Tooltip=Gt;exports.Typography=O;exports.UpArrowSVG=ht;exports.UpChevronSVG=Fo;exports.UpCircleSVG=Do;exports.UpRightArrowSVG=wt;exports.VisuallyHidden=fe;exports.WalletSVG=zo;exports.baseTheme=at;exports.darkTheme=Ml;exports.lightTheme=Zl;exports.mq=W;exports.tokens=Re;
