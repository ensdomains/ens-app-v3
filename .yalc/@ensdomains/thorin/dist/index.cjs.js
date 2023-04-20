"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const we=require("react"),o=require("styled-components"),lt=require("react-transition-state"),wo=require("react-dom"),vo=e=>e&&typeof e=="object"&&"default"in e?e:{default:e};function $r(e){if(e&&e.__esModule)return e;const r=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const l in e)if(l!=="default"){const n=Object.getOwnPropertyDescriptor(e,l);Object.defineProperty(r,l,n.get?n:{enumerable:!0,get:()=>e[l]})}}return r.default=e,Object.freeze(r)}const t=$r(we),d=vo(o),yo=$r(wo),Eo=d.default.div(({theme:e,$shape:r,$noBorder:l})=>o.css`
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

    ${!l&&o.css`
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
  `),xo=d.default.div(({theme:e,$url:r,$disabled:l})=>o.css`
    background: ${r||e.colors.gradients.blue};

    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    ${l&&o.css`
      filter: grayscale(1);
    `}
  `),Co=d.default.img(({$shown:e,$disabled:r})=>o.css`
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
  `),Ne=({label:e,noBorder:r=!1,shape:l="circle",src:n,placeholder:c,decoding:a="async",disabled:i=!1,overlay:u,...s})=>{const p=t.useRef(null),[b,g]=t.useState(!!n),f=t.useCallback(()=>{g(!0)},[g]),v=t.useCallback(()=>{g(!1)},[g]);t.useEffect(()=>{const h=p.current;return h&&(h.addEventListener("load",f),h.addEventListener("loadstart",v),h.addEventListener("error",v)),()=>{h&&(h.removeEventListener("load",f),h.removeEventListener("loadstart",v),h.removeEventListener("error",v))}},[p,v,f]);const E=b&&!!n;return t.createElement(Eo,{$noBorder:!b||r,$shape:l},u,!E&&t.createElement(xo,{$disabled:i,$url:c,"aria-label":e}),t.createElement(Co,{...s,$disabled:i,$shown:E,alt:e,decoding:a,ref:p,src:n,onError:()=>g(!1),onLoad:()=>g(!0)}))};Ne.displayName="Avatar";const ot=d.default.div(({theme:e,$state:r,$empty:l})=>o.css`
    width: 100vw;
    height: 100vh;
    position: fixed;
    overflow: hidden;
    z-index: 999;
    top: 0;
    left: 0;
    transition: ${e.transitionDuration[300]} all
      ${e.transitionTimingFunction.popIn};

    ${!l&&r==="entered"?o.css`
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
  `),wr={none:"none",solid:"solid"},vr={0:"0px",px:"1px","0.375":"0.09375rem","0.5":"0.125rem","0.75":"0.1875rem",1:"0.25rem","1.25":"0.3125rem","1.5":"0.375rem","1.75":"0.4375rem",2:"0.5rem"},yr={none:"0",extraSmall:"2px",small:"4px",medium:"6px",large:"8px",almostExtraLarge:"10px",extraLarge:"12px","2xLarge":"16px","2.5xLarge":"20px","3xLarge":"24px","4xLarge":"40px",full:"9999px",input:"0.5rem",card:"1rem",checkbox:"0.25rem"},K={none:"none","-px":"inset 0 0 0 1px",0:"0 0 0 0","0.02":"0 2px 8px","0.25":"0 2px 12px","0.5":"0 0 0 0.125rem",1:"0 0 0 0.25rem",2:"0 0 0 0.5rem"},ko=[50,100,300,400,500,750],So={Surface:50,Light:100,Bright:300,Primary:400,Dim:500,Active:750},Ft={blue:[216,100,61,{50:[215,100,97]}],indigo:[242,61,58],purple:[280,62,55],pink:[331,67,51,{100:[331,64,88]}],red:[7,76,44,{50:[0,60,94],100:[360,60,85]}],orange:[35,91,50,{100:[36,89,86]}],yellow:[47,86,49,{50:[48,100,90],100:[48,100,85]}],green:[162,72,40,{50:[157,37,93],100:[157,37,85]}],teal:[199,66,49],grey:[240,6,63,{50:[0,0,96],100:[0,0,91],500:[0,0,35],750:[0,0,15]}]},Qe={light:"0 0% 100%",dark:"0 0% 8%"},Ro={background:{hue:"grey",items:{primary:Qe,secondary:"Surface"}},text:{hue:"grey",items:{primary:"Active",secondary:"Dim",tertiary:"Primary",accent:{light:Qe.light,dark:Qe.light}}},border:{hue:"grey",items:{primary:"Light"}}},jt={blue:"linear-gradient(330.4deg, #44BCF0 4.54%, #7298F8 59.2%, #A099FF 148.85%)",green:"linear-gradient(90deg, rgba(68,240,127,1) 4.54%, rgba(114,248,176,1) 59.2%, rgba(153,202,255,1) 148.85%)",red:"linear-gradient(90deg, rgba(240,68,87,1) 4.54%, rgba(248,114,149,1) 59.2%, rgba(212,153,255,1) 148.85%)",purple:"linear-gradient(323.31deg, #DE82FF -15.56%, #7F6AFF 108.43%)",grey:"linear-gradient(330.4deg, #DFDFDF 4.54%, #959595 59.2%, #474747 148.85%)"},Dt=(e,r,l)=>{e==="dark"&&(l=Object.fromEntries(Object.entries(l).map(([c],a,i)=>[c,i[i.length-a-1][1]])));const n=Object.fromEntries(Object.entries(So).map(([c,a])=>[`${r}${c}`,l[a]]));return{...n,[r]:n[`${r}Primary`]}},Nt=e=>`${e[0]} ${e[1]}% ${e[2]}%`,Po=(e,r,l)=>{const n=Object.fromEntries(ko.map(c=>{var i;if((i=l[3])!=null&&i[c])return[c,Nt(l[3][c])];const a=l.slice(0,3);return a[2]=a[2]+(400-c)/10,[c,Nt(a)]}));return{normal:Dt(e,r,Object.fromEntries(Object.entries(n).map(([c,a])=>[c,`hsl(${a})`]))),raw:Dt(e,r,n)}},Vo=(e,r)=>({...jt,accent:jt[e]||r[e]}),zt=(e,r)=>{const l=Object.entries({...Ft,accent:Ft[e]}).reduce((c,a)=>{const[i,u]=a,s=Po(r,i,u);return{...c,...s.normal,raw:{...c.raw,...s.raw}}},{}),n=Object.entries(Ro).reduce((c,a)=>{const[i,u]=a;for(const[s,p]of Object.entries(u.items)){const b=`${i}${s.replace(/^[a-z]/,f=>f.toUpperCase())}`,g=typeof p=="string"?l.raw[`${u.hue}${p}`]:p[r];if(c[b]=`hsl(${g})`,c.raw[b]=g,s==="primary"){const f=i;c[f]=`hsl(${g})`,c.raw[f]=g}}return c},l);return{...n,gradients:Vo(e,n)}},Mo=e=>({light:zt(e,"light"),dark:zt(e,"dark")}),G=Mo("blue"),Er={overlay:"0.1",overlayFallback:"0.5"},xr={0:"0",px:"1px","0.25":"0.0625rem","0.5":"0.125rem","0.75":"0.1875rem",1:"0.25rem","1.25":"0.3125rem","1.5":"0.375rem","1.75":"0.4375rem",2:"0.5rem","2.5":"0.625rem",3:"0.75rem","3.5":"0.875rem",4:"1rem","4.5":"1.125rem",5:"1.25rem","5.5":"1.375rem",6:"1.5rem",7:"1.75rem","7.5":"1.875rem",8:"2rem","8.5":"2.125rem",9:"2.25rem",10:"2.5rem",11:"2.75rem",12:"3rem",13:"3.25rem",14:"3.5rem",15:"3.75rem",16:"4rem",18:"4.5rem",20:"5rem","22.5":"5.625rem",24:"6rem",26:"6.5rem",28:"7rem",30:"7.5rem",32:"8rem",36:"9rem",40:"10rem",44:"11rem",45:"11.25rem",48:"12rem",52:"13rem",56:"14rem",60:"15rem",64:"16rem",72:"18rem",80:"20rem",96:"24rem",112:"28rem",128:"32rem",144:"36rem",168:"42rem",192:"48rem",224:"56rem",256:"64rem",288:"72rem",320:"80rem","1/4":"25%","1/3":"33.333333%","1/2":"50%","2/3":"66.666667%","3/4":"75%",auto:"auto",full:"100%",fit:"fit-content",max:"max-content",min:"min-content",viewHeight:"100vh",viewWidth:"100vw",none:"0"},Cr={mono:'"iAWriter Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',sans:'"Satoshi", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'},fe={headingOne:"2.25rem",headingTwo:"1.875rem",headingThree:"1.625rem",headingFour:"1.375rem",extraLarge:"1.25rem",large:"1.125rem",body:"1rem",small:"0.875rem",extraSmall:"0.75rem"},ve={light:"300",normal:"500",bold:"700",extraBold:"830"},kr={"-0.02":"-0.02em","-0.015":"-0.015em","-0.01":"-0.01em",normal:"0","0.03":"0.03em"},ye={headingOne:"3rem",headingTwo:"2.5rem",headingThree:"2.125rem",headingFour:"1.875rem",extraLarge:"1.625rem",large:"1.5rem",body:"1.25rem",small:"1.25rem",extraSmall:"1rem"},Sr={75:"75ms",100:"100ms",150:"150ms",200:"200ms",300:"300ms",500:"500ms",700:"700ms",1e3:"1000ms"},Rr={linear:"linear",in:"cubic-bezier(0.4, 0, 1, 1)",out:"cubic-bezier(0, 0, 0.2, 1)",inOut:"cubic-bezier(0.42, 0, 0.58, 1)",popIn:"cubic-bezier(0.15, 1.15, 0.6, 1)"},Se={xs:360,sm:640,md:768,lg:1024,xl:1280},Zo={light:{0:`${K[0]} ${G.light.backgroundSecondary}`,"0.02":`${K["0.02"]} ${G.light.backgroundSecondary}`,"0.25":`${K["0.25"]} ${G.light.backgroundSecondary}`,"0.5":`${K["0.5"]} ${G.light.backgroundSecondary}`,1:`${K[1]} ${G.light.backgroundSecondary}`},dark:{0:`${K[0]} ${G.dark.backgroundSecondary}`,"0.02":`${K["0.02"]} ${G.dark.backgroundSecondary}`,"0.25":`${K["0.25"]} ${G.dark.backgroundSecondary}`,"0.5":`${K["0.5"]} ${G.dark.backgroundSecondary}`,1:`${K[1]} ${G.dark.backgroundSecondary}`}},Re={borderStyles:wr,borderWidths:vr,colors:G,fonts:Cr,fontSizes:fe,fontWeights:ve,letterSpacings:kr,lineHeights:ye,opacity:Er,radii:yr,shadows:K,space:xr,breakpoints:Se,transitionDuration:Sr,transitionTimingFunction:Rr,boxShadows:Zo},nt={borderStyles:wr,borderWidths:vr,fonts:Cr,fontSizes:fe,fontWeights:ve,letterSpacings:kr,lineHeights:ye,opacity:Er,radii:yr,shadows:K,space:xr,breakpoints:Se,transitionDuration:Sr,transitionTimingFunction:Rr},Lo={...nt,colors:Re.colors.light,boxShadows:Re.boxShadows.light,mode:"light"},Go={...nt,colors:Re.colors.dark,boxShadows:Re.boxShadows.dark,mode:"dark"},Pr={min:"min-width",max:"max-width"},To=Object.keys(Se),Bo=Object.keys(Pr),J=To.reduce((e,r)=>(e[r]=Bo.reduce((l,n)=>(l[n]=c=>{const a=n==="max"?Se[r]-1:Se[r];return o.css`
        @media (${Pr[n]}: ${a}px) {
          ${c};
        }
      `},l),{}),e),{}),Oo=Object.keys(fe),Ho={headingOne:{weight:"extraBold"},headingTwo:{weight:"bold"},headingThree:{weight:"bold"},headingFour:{weight:"bold"}},Ao=["extraLarge","large","body","small","extraSmall"],Fo={label:{size:fe.extraSmall,lineHeight:ye.extraSmall,weight:ve.normal},labelHeading:{size:fe.small,lineHeight:ye.small,weight:ve.normal}},jo=()=>Object.fromEntries(Oo.map(e=>{var l;const r=((l=Ho[e])==null?void 0:l.weight)||"normal";return[e,{size:fe[e],lineHeight:ye[e],weight:ve[r]}]})),Do=()=>Object.fromEntries(Ao.map(e=>[`${e}Bold`,{size:fe[e],lineHeight:ye[e],weight:ve.bold}])),No=()=>({...Fo,...jo(),...Do()}),at=No(),Pe=e=>{var r;return(r=at[e])==null?void 0:r.size},Ve=e=>{var r;return(r=at[e])==null?void 0:r.lineHeight},tt=e=>{var r;return(r=at[e])==null?void 0:r.weight},zo=e=>{const r=Object.keys(G[e].gradients),l=Object.fromEntries(r.map(a=>[`${a}Gradient`,G[e].gradients[a]])),n=Object.keys(G[e]).filter(([a])=>a!=="gradients"&&a!=="raw"),c=Object.fromEntries(n.map(a=>[a,G[e][a]]));return{...l,...c,tranparent:"transparent",initial:"initial",inherit:"inherit"}},Wo=zo("light"),Wt=["accent","blue","indigo","purple","pink","red","orange","yellow","green","teal","grey"],_o=e=>{const r=Object.fromEntries(Wt.map(s=>[`${s}Primary`,{text:G[e].backgroundPrimary,background:G[e][`${s}Primary`],border:"transparent",hover:G[e][`${s}Bright`]}])),l=Object.fromEntries(Wt.map(s=>[`${s}Secondary`,{text:G[e][`${s}Primary`],background:G[e][`${s}Surface`],border:"transparent",hover:G[e][`${s}Light`]}])),n=Object.keys(G[e].gradients),c=Object.fromEntries(n.map(s=>[`${s}Gradient`,{text:G[e].backgroundPrimary,background:G[e].gradients[s],border:"transparent",hover:G[e].gradients[s]}])),a={text:"initial",background:"transparent",border:"transparent",hover:G[e].greyLight},i={text:G[e].greyPrimary,background:G[e].greyLight,border:G[e].greyLight,hover:G[e].greyLight},u={text:G[e].textPrimary,background:G[e].backgroundPrimary,border:G[e].border,hover:G[e].backgroundSecondary};return{...r,...l,...c,transparent:a,disabled:i,background:u}},Io=_o("light"),Vr=e=>Wo[e],N=(e,r)=>{var l;return(l=Io[e])==null?void 0:l[r]},Yo=d.default.div(({theme:e,$ellipsis:r,$fontVariant:l="body",$color:n,$font:c,$weight:a})=>o.css`
    font-family: ${e.fonts.sans};
    line-height: ${e.lineHeights.body};
    color: ${Vr(n)};

    ${r&&o.css`
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    `}

    ${l&&o.css`
      font-size: ${Pe(l)};
      font-weight: ${tt(l)};
      line-height: ${Ve(l)};
    `}

    ${c==="mono"&&o.css`
      font-family: ${e.fonts.mono};
    `}

    ${a&&o.css`
      font-weight: ${e.fontWeights[a]};
    `};
  `),D=t.forwardRef(({asProp:e,children:r,ellipsis:l,className:n,fontVariant:c="body",font:a="sans",color:i="text",weight:u,...s},p)=>t.createElement(Yo,{...s,$color:i,$ellipsis:l?!0:void 0,$font:a,$fontVariant:c,$weight:u,as:e,className:n,ref:p},r));D.displayName="Typography";const Uo=d.default.div(({theme:e,$alert:r,$hasAction:l})=>o.css`
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

    ${J.sm.min(o.css`
        padding: ${e.space[6]};
        gap: ${e.space[6]};
        align-items: center;
      `)}

    ${l&&o.css`
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
  `),qo=d.default.div(({theme:e})=>o.css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: ${e.space[1]};
  `),Xo=d.default.div(({theme:e,$alert:r,$type:l})=>o.css`
    width: ${e.space[8]};
    height: ${e.space[8]};
    flex: 0 0 ${e.space[8]};

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    ${J.sm.min(o.css`
      width: ${e.space[10]};
      height: ${e.space[10]};
      flex: 0 0 ${e.space[10]};
    `)}

    ${l==="filledCircle"&&o.css`
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
  `),_t=d.default.button(({theme:e})=>o.css`
    position: absolute;
    top: 0;
    right: 0;
    padding: ${e.space[2]};
  `),It=d.default.div(({theme:e,$alert:r,$hasAction:l})=>o.css`
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

    ${l&&o.css`
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
  `),Ko=({alert:e="info",icon:r,hasHref:l,onDismiss:n})=>n?t.createElement(_t,{onClick:()=>n()},t.createElement(It,{$alert:e,$hasAction:!0},r||t.createElement(Ee,null))):l||r?t.createElement(_t,{as:"div"},t.createElement(It,{$alert:e},r||t.createElement(wt,null))):null,Qo=(e,r)=>e!=="info"?"filledCircle":r?"normal":"none",ct=({title:e,alert:r="info",icon:l,iconType:n,as:c,children:a,onDismiss:i,...u})=>{const s=l||(r&&["error","warning"].includes(r)?t.createElement(Ge,null):t.createElement(Ue,null)),p=!!u.href,b=p||!!u.onClick,g=n||Qo(r,l);return t.createElement(Uo,{...u,$alert:r,$hasAction:b,as:c},g!=="none"&&t.createElement(Xo,{$alert:r,$type:g},s),t.createElement(qo,null,e&&t.createElement(D,{fontVariant:"largeBold"},e),t.createElement(D,null,a)),t.createElement(Ko,{alert:r,hasHref:p,icon:u.actionIcon,onDismiss:i}))};ct.displayName="Banner";const ge=d.default.div(()=>o.css`
    border-width: 0;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  `),Jo=o.keyframes`
  100% {
    transform: rotate(1turn);
  }
`,en=d.default.div(({theme:e,$color:r,$size:l})=>o.css`
    animation: ${Jo} 1.1s linear infinite;

    color: ${e.colors[r]};
    stroke: ${e.colors[r]};

    ${()=>{switch(l){case"small":return o.css`
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

    svg {
      display: block;
      height: 100%;
      width: 100%;
    }
  `),pe=t.forwardRef(({accessibilityLabel:e,size:r="small",color:l="text",...n},c)=>t.createElement(en,{$color:l,$size:r,ref:c,...n},e&&t.createElement(ge,null,e),t.createElement("svg",{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},t.createElement("circle",{cx:"12",cy:"12",fill:"none",r:"9",strokeDasharray:"42",strokeLinecap:"round"}),t.createElement("circle",{cx:"12",cy:"12",fill:"none",opacity:"0.25",r:"9",strokeLinecap:"round"}))));pe.displayName="Spinner";const tn=d.default.button(({theme:e,$pressed:r,$shadow:l,$size:n,$colorStyle:c="accentPrimary",$shape:a,$hasCounter:i,$width:u})=>o.css`
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

    background: ${N(c,"background")};
    color: ${N(c,"text")};
    border-color: ${N(c,"border")};

    /* solves sticky problem */
    @media (hover: hover) {
      &:hover {
        transform: translateY(-1px);
        background: ${N(c,"hover")};
      }
      &:active {
        transform: translateY(0px);
      }
    }
    @media (hover: none) {
      &:active {
        transform: translateY(-1px);
        background: ${N(c,"hover")};
      }
    }

    &:disabled {
      cursor: not-allowed;
      background: ${N("disabled","background")};
      transform: none;
      color: ${N("disabled","text")};
      border-color: transparent;
    }

    ${r&&o.css`
      background: ${N(c,"hover")};
    `};

    ${l&&o.css`
      box-shadow: ${e.shadows["0.25"]} ${e.colors.grey};
    `};

    ${n==="small"&&o.css`
      font-size: ${e.fontSizes.small};
      line-height: ${e.lineHeights.small};
      height: ${e.space[10]};
      padding: 0 ${e.space["3.5"]};
      svg {
        display: block;
        width: ${e.space[3]};
        height: ${e.space[3]};
        color: ${N(c,"text")};
      }
    `}

    ${n==="medium"&&o.css`
      font-size: ${e.fontSizes.body};
      line-height: ${e.lineHeights.body};
      height: ${e.space[12]};
      padding: 0 ${e.space[4]};
      svg {
        display: block;
        width: ${e.space[4]};
        height: ${e.space[4]};
        color: ${N(c,"text")};
      }
    `}

    &:disabled svg {
      color: ${N("disabled","text")};
    }

    ${(a==="circle"||a==="rounded")&&o.css`
      border-radius: ${e.radii.full};
    `}

    ${(a==="circle"||a==="square")&&n==="small"&&o.css`
      width: ${e.space[10]};
    `}

    ${(a==="circle"||a==="square")&&n==="medium"&&o.css`
      width: ${e.space[12]};
    `}

    ${i&&o.css`
      padding: 0 ${e.space[12]};
    `}

    ${u&&o.css`
      width: ${e.space[u]};
    `}
  `),rn=d.default.div(({$fullWidth:e})=>o.css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    ${e&&o.css`
      width: 100%;
    `}
  `),ln=d.default.div(({theme:e})=>o.css`
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    padding-right: ${e.space[3]};

    display: flex;
    align-items: center;
    justify-content: flex-end;
    pointer-events: none;
  `),on=d.default.div(({theme:e,$visible:r})=>o.css`
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
  `),nn=d.default.div`
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
`,ze=t.forwardRef(({children:e,disabled:r,href:l,prefix:n,loading:c,rel:a,shape:i,size:u="medium",suffix:s,tabIndex:p,target:b,colorStyle:g="accentPrimary",type:f="button",zIndex:v,onClick:E,pressed:h=!1,shadow:x=!1,width:R,fullWidthContent:w,count:C,shouldShowTooltipIndicator:m,as:$,...Z},H)=>{const T=t.createElement(rn,{$fullWidth:w},e),S=r?"greyPrimary":"backgroundPrimary";let L;if(i==="circle"||i==="square")L=c?t.createElement(pe,{color:S}):T;else{const j=!!n,B=!j&&!s,M=!j&&!!s;let A=n;c&&j?A=t.createElement(pe,{color:S}):c&&B&&(A=t.createElement(pe,{color:S}));let O=s;c&&M&&(O=t.createElement(pe,{color:S})),L=t.createElement(t.Fragment,null,!!A&&A,T,!!O&&O)}return t.createElement(tn,{...Z,$colorStyle:g,$hasCounter:!!C,$pressed:h,$shadow:x,$shape:i,$size:u,$width:R,as:$,disabled:r,href:l,position:v&&"relative",ref:H,rel:a,tabIndex:p,target:b,type:f,zIndex:v,onClick:E},m&&t.createElement(nn,{"data-testid":"tooltip-indicator"},"?"),L,t.createElement(ln,null,t.createElement(on,{$visible:!!C},C)))});ze.displayName="Button";const an=d.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[4]};

    padding: ${e.space[4]};
    border-radius: ${e.radii["2xLarge"]};
    background-color: ${e.colors.backgroundPrimary};
    border: 1px solid ${e.colors.border};

    ${J.sm.min(o.css`
        padding: ${e.space[6]};
      `)}
  `),cn=d.default.div(({theme:e})=>o.css`
    width: calc(100% + 2 * ${e.space[4]});
    height: 1px;
    background: ${e.colors.border};
    margin: 0 -${e.space[4]};
    ${J.sm.min(o.css`
        margin: 0 -${e.space[6]};
        width: calc(100% + 2 * ${e.space[6]});
      `)}
  `),We=({title:e,children:r,...l})=>t.createElement(an,{...l},e&&t.createElement(D,{fontVariant:"headingFour"},e),r);We.displayName="Card";We.Divider=cn;const Me=({children:e,className:r,el:l="div",renderCallback:n})=>{const[c]=t.useState(document.createElement(l));return r&&c.classList.add(r),t.useEffect(()=>(document.body.appendChild(c),n==null||n(),()=>{document.body.removeChild(c)}),[n]),yo.createPortal(e,c)};Me.displayName="Portal";const Yt=(e,r,l,n,c)=>{const a=r.top-l.height-n-c,i=r.left-l.width-n-c,u=window.innerWidth-r.left-r.width-l.width-n-c,s=window.innerHeight-r.top-r.height-l.height-n-c;return e==="top"&&a<0&&s>a?"bottom":e==="right"&&u<0&&i>u?"left":e==="bottom"&&s<0&&a>s?"top":e==="left"&&i<0&&u>i?"right":e},sn=(e,r,l,n)=>{let c="";l==="top"?c=`translate(0, -${r}px)`:l==="right"?c=`translate(${e}px, 0)`:l==="bottom"?c=`translate(0, ${r}px)`:c=`translate(-${e}px, 0);`;let a="";return n==="top"?a=`translate(0, -${r}px)`:n==="right"?a=`translate(${e}px, 0)`:n==="bottom"?a=`translate(0, ${r}px)`:a=`translate(-${e}px, 0);`,{translate:c,mobileTranslate:a}},Ut=e=>typeof e=="number"?`${e}px`:e,dn=d.default.div(({$state:e,$translate:r,$mobileTranslate:l,$width:n,$mobileWidth:c,$x:a,$y:i,$isControlled:u,$transitionDuration:s,$hideOverflow:p})=>[o.css`
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
      width: ${Ut(c)};
      transform: translate3d(0, 0, 0) ${l};
      transition: none;
      opacity: 0;
      pointer-events: none;
      top: 0;
      left: 0;

      ${p&&o.css`
        overflow: hidden;
      `}

      ${e==="preEnter"&&o.css`
        display: block;
        visibility: visible;
        top: ${i}px;
        left: ${a}px;
      `}

      ${e==="entering"&&o.css`
        display: block;
        visibility: visible;
        opacity: 1;
        transition: opacity ${s}ms ease-in-out;
        top: ${i}px;
        left: ${a}px;
      `}

      ${e==="entered"&&o.css`
        display: block;
        visibility: visible;
        opacity: 1;
        transition: opacity ${s}ms ease-in-out;
        top: ${i}px;
        left: ${a}px;

        ${u&&o.css`
          pointer-events: auto;
        `}
      `}

      ${e==="exiting"&&o.css`
        display: block;
        visibility: visible;
        opacity: 0;
        transition: all ${s}ms ease-in-out;
        top: ${i}px;
        left: ${a}px;
      `}
    `,J.sm.min(o.css`
      width: ${Ut(n)};
      transform: translate3d(0, 0, 0) ${r};
    `)]),Ze=({popover:e,placement:r="top",mobilePlacement:l="top",animationFn:n,anchorRef:c,onShowCallback:a,width:i=250,mobileWidth:u=150,useIdealPlacement:s=!1,additionalGap:p=0,transitionDuration:b=350,isOpen:g,align:f="center",hideOverflow:v})=>{const E=t.useRef(),h=g!==void 0,[x,R]=t.useState({top:100,left:100,horizontalClearance:100,verticalClearance:100,idealPlacement:r,idealMobilePlacement:l}),w=t.useCallback(()=>{const B=c==null?void 0:c.current,M=B==null?void 0:B.getBoundingClientRect(),A=E==null?void 0:E.current,O=A==null?void 0:A.getBoundingClientRect();if(!O||!M)return;let P=O.width/2,V=M.width/2,F=O.height/2,te=M.height/2;r==="top"||r==="bottom"?f==="start"?(P=0,V=0):f==="end"&&(P=O.width,V=M.width):f==="start"?(F=0,te=0):f==="end"&&(F=O.height,te=M.height);const ee=window.scrollY+M.y+te-F,_=M.x+V-P,I=P+V+p+10,Y=F+te+p+10,z=Yt(r,M,O,0,0),re=Yt(l,M,O,0,0);R({top:ee,left:_,horizontalClearance:I,verticalClearance:Y,idealPlacement:z,idealMobilePlacement:re})},[r,l,p,c,f]),C=t.useCallback(B=>{B&&(E.current=B,w())},[w]),m=t.useMemo(()=>n?(B,M,A,O)=>n(B,M,A,O):(B,M,A,O)=>sn(B,M,A,O),[n]);t.useEffect(()=>{w();const B=()=>{w()},M=c==null?void 0:c.current;let A,O;return h||(A=()=>{w(),Z(!0),a==null||a()},O=()=>{Z(!1)},M==null||M.addEventListener("mouseenter",A),M==null||M.addEventListener("mouseleave",O)),addEventListener("resize",B),()=>{h||(M==null||M.removeEventListener("mouseenter",A),M==null||M.removeEventListener("mouseleave",O)),removeEventListener("resize",B)}},[r,l,w,p,a,c,h]),t.useEffect(()=>{h&&Z(g)},[h,g]);const[$,Z]=lt.useTransition({preEnter:!0,exit:!0,mountOnEnter:!0,unmountOnExit:!0,timeout:{enter:b,exit:b}}),H=s?x.idealPlacement:r,T=s?x.idealMobilePlacement:l,{translate:S,mobileTranslate:L}=m(x.horizontalClearance,x.verticalClearance,H,T),j=t.useCallback(()=>{w(),a==null||a()},[w,a]);return $==="unmounted"?null:t.createElement(Me,{renderCallback:j},t.createElement(dn,{$hideOverflow:v,$isControlled:h,$mobileTranslate:L,$mobileWidth:u,$state:$,$transitionDuration:b,$translate:S,$width:i,$x:x.left,$y:x.top,"data-testid":"popoverContainer",id:"popoverContainer",ref:C},t.cloneElement(e,{placement:H,mobilePlacement:T,state:$})))};Ze.displayName="DynamicPopover";const un=(e,r,l,n)=>{const c=a=>{e.current&&!e.current.contains(a.target)&&l()};we.useEffect(()=>(n?document.addEventListener(r,c):document.removeEventListener(r,c),()=>{document.removeEventListener(r,c)}),[n])},pn=typeof window<"u"?t.useLayoutEffect:t.useEffect,Je={serverHandoffComplete:!1},fn=()=>{const[e,r]=t.useState(Je.serverHandoffComplete);return t.useEffect(()=>{e||r(!0)},[e]),t.useEffect(()=>{Je.serverHandoffComplete||(Je.serverHandoffComplete=!0)},[]),e},gn="thorin";let mn=0;function qt(){return++mn}const it=()=>{const e=fn(),[r,l]=t.useState(e?qt:null);return pn(()=>{r===null&&l(qt())},[r]),r!=null?`${gn}`+r:void 0},Mr=({description:e,error:r,id:l}={})=>{const n=it();return t.useMemo(()=>{const c=`${n}${l?`-${l}`:""}`,a=`${c}-label`;let i,u;e&&(u={id:`${c}-description`},i=u.id);let s;return r&&(s={id:`${c}-error`},i=`${i?`${i} `:""}${s.id}`),{content:{"aria-describedby":i,"aria-labelledby":a,id:c},description:u,error:s,label:{htmlFor:c,id:a}}},[n,e,r,l])},Xt=t.createContext(void 0),bn=d.default.label(({theme:e,$disabled:r,$readOnly:l,$required:n})=>o.css`
    display: flex;
    flex-basis: auto;
    flex-grow: 2;
    flex-shrink: 1;
    overflow: hidden;
    position: relative;
    cursor: pointer;

    ${l&&o.css`
      cursor: default;
      pointer-events: none;
    `}

    ${r&&o.css`
      cursor: not-allowed;
    `}

    ${n&&o.css`
      ::after {
        content: ' *';
        white-space: pre;
        color: ${e.colors.red};
      }
    `}
  `),hn=d.default(D)(()=>o.css`
    width: 100%;
  `),$n=d.default(D)(()=>o.css`
    flex-basis: auto;
    flex-grow: 0;
    flex-shrink: 2;
    text-align: right;
    overflow: hidden;
    position: relative;
  `),wn=d.default.div(({theme:e,$inline:r})=>o.css`
    display: flex;
    align-items: center;
    padding: 0 ${r?"0":e.space[2]};
    overflow: hidden;
    gap: ${e.space[2]};
  `),vn=({ids:e,label:r,labelSecondary:l,required:n,hideLabel:c,inline:a,disabled:i,readOnly:u})=>{const s=t.createElement(wn,{$inline:a},t.createElement(bn,{$disabled:i,$readOnly:u,$required:n,...e.label},t.createElement(hn,{color:"greyPrimary",ellipsis:!0,fontVariant:"bodyBold"},r,n&&t.createElement(ge,null,"required"))),l&&t.createElement($n,{color:"greyPrimary",ellipsis:!0,fontVariant:"extraSmall"},l));return c?t.createElement(ge,null,s):s},yn=d.default(D)(({theme:e,$inline:r})=>o.css`
    padding: 0 ${r?"0":e.space[2]};
    width: 100%;
    overflow: hidden;
  `),En=d.default(D)(({theme:e,$inline:r})=>`
    padding: 0 ${r?"0":e.space[2]};
`),xn=({ids:e,error:r,description:l,hideLabel:n,inline:c,disabled:a})=>n?null:r?t.createElement(En,{"aria-live":"polite",...e.error,$inline:c,color:"redPrimary",fontVariant:"smallBold"},r):l?t.createElement(yn,{$inline:c,...e.description,color:a?"greyPrimary":"textPrimary",colorScheme:a?"secondary":"primary",ellipsis:!0,fontVariant:"small"},l):null,Kt=d.default.div(({theme:e,$inline:r,$width:l,$reverse:n})=>o.css`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: 'normal';
    gap: ${e.space[2]};
    width: ${e.space[l]};

    ${r&&o.css`
      flex-direction: ${n?"row-reverse":"row"};
      align-items: 'flex-start';
    `}
  `),Cn=d.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[1]};
    flex: 1;
    overflow: hidden;
  `),le=({children:e,description:r,error:l,hideLabel:n,id:c,label:a,labelSecondary:i,required:u,inline:s,readOnly:p,width:b="full",reverse:g=!1,disabled:f,...v})=>{const E=Mr({id:c,description:r!==void 0,error:l!==void 0});let h;typeof e=="function"?h=t.createElement(Xt.Provider,{value:E},t.createElement(Xt.Consumer,null,w=>e(w))):e?h=t.cloneElement(e,E.content):h=e;const x=t.createElement(vn,{...v,ids:E,label:a,labelSecondary:i,required:u,hideLabel:n,inline:s,disabled:f,readOnly:p}),R=t.createElement(xn,{ids:E,error:l,description:r,hideLabel:n,inline:s,disabled:f});return s?t.createElement(Kt,{$inline:s,$reverse:g,$width:b},t.createElement("div",null,h),t.createElement(Cn,null,x,R)):t.createElement(Kt,{$width:b},x,h,R)};le.displayName="Field";const kn=(e,r)=>{const l=r==null?void 0:r.split(", ");if(!l)return!0;const n=Qt(e);return l.some(c=>{const a=Qt(c);return a.type===n.type&&a.subtype===n.subtype})},Qt=e=>{const r=e.split("/");return{type:r[0],subtype:r[1]}},Jt={},st=t.forwardRef(({accept:e,autoFocus:r,children:l,defaultValue:n,disabled:c,error:a,id:i,maxSize:u,name:s,required:p,tabIndex:b,onBlur:g,onChange:f,onError:v,onFocus:E,onReset:h,...x},R)=>{const w=t.useRef(null),C=R||w,[m,$]=t.useState(Jt),Z=a?!0:void 0,H=Mr({id:i,error:Z}),T=t.useCallback((P,V)=>{if(u&&P.size>u*1e6){V==null||V.preventDefault(),v&&v(`File is ${(P.size/1e6).toFixed(2)} MB. Must be smaller than ${u} MB`);return}$(F=>({...F,file:P,name:P.name,type:P.type})),f&&f(P)},[u,f,v]),S=t.useCallback(P=>{const V=P.target.files;!(V!=null&&V.length)||T(V[0],P)},[T]),L=t.useCallback(P=>{P.preventDefault(),$(V=>({...V,droppable:!0}))},[]),j=t.useCallback(P=>{P.preventDefault(),$(V=>({...V,droppable:!1}))},[]),B=t.useCallback(P=>{P.preventDefault(),$(F=>({...F,droppable:!1}));let V;if(P.dataTransfer.items){const F=P.dataTransfer.items;if((F==null?void 0:F[0].kind)!=="file"||(V=F[0].getAsFile(),!V))return}else{const F=P.dataTransfer.files;if(!(F!=null&&F.length))return;V=F[0]}!kn(V.type,e)||T(V,P)},[T,e]),M=t.useCallback(P=>{$(V=>({...V,focused:!0})),E&&E(P)},[E]),A=t.useCallback(P=>{$(V=>({...V,focused:!1})),g&&g(P)},[g]),O=t.useCallback(P=>{P.preventDefault(),$(Jt),C.current&&(C.current.value=""),h&&h()},[C,h]);return t.useEffect(()=>{!n||$({previewUrl:n.url,name:n.name,type:n.type})},[]),t.useEffect(()=>{if(!m.file)return;const P=URL.createObjectURL(m.file);return $(V=>({...V,previewUrl:P})),()=>URL.revokeObjectURL(P)},[m.file]),t.createElement("div",null,t.createElement(ge,null,t.createElement("input",{...x,...H.content,accept:e,"aria-invalid":Z,autoFocus:r,disabled:c,name:s,ref:C,required:p,tabIndex:b,type:"file",onBlur:A,onChange:S,onFocus:M})),t.createElement("label",{...H.label,onDragLeave:j,onDragOver:L,onDrop:B},l({...m,reset:O})))});st.displayName="FileInput";const Sn=d.default.div(({theme:e,$textAlign:r,$textTransform:l,$level:n,$responsive:c,$color:a})=>o.css`
    ${r?o.css`
          text-align: ${r};
        `:""}
    ${l?o.css`
          text-transform: ${l};
        `:""}

  ${()=>{switch(n){case"1":return o.css`
            font-size: ${e.fontSizes.headingOne};
            font-weight: ${e.fontWeights.extraBold};
            line-height: ${e.lineHeights.headingOne};
          `;case"2":return o.css`
            font-size: ${e.fontSizes.headingTwo};
            font-weight: ${e.fontWeights.bold};
            line-height: ${e.lineHeights.headingTwo};
          `;default:return""}}}
  
  ${()=>{if(c)switch(n){case"1":return o.css`
              font-size: ${e.fontSizes.headingTwo};
              line-height: ${e.lineHeights.headingTwo};
              ${J.lg.min(o.css`
                font-size: ${e.fontSizes.headingOne};
                line-height: ${e.lineHeights.headingOne};
              `)}
            `;case"2":return o.css`
              font-size: ${e.fontSizes.extraLarge};
              line-height: ${e.lineHeights.extraLarge};
              ${J.sm.min(o.css`
                font-size: ${e.fontSizes.headingTwo};
                line-height: ${e.lineHeights.headingTwo};
              `)}
            `;default:return""}}}

  ${a&&o.css`
      color: ${Vr(a)};
    `}
  
  font-family: ${e.fonts.sans};
  `),_e=t.forwardRef(({align:e,children:r,as:l="h1",id:n,level:c="2",responsive:a,transform:i,color:u="text",...s},p)=>t.createElement(Sn,{...s,$color:u,$level:c,$responsive:a,$textAlign:e,$textTransform:i,as:l,id:n,ref:p},r));_e.displayName="Heading";const Rn=()=>{const[e,r]=we.useState(!1),l=n=>{navigator.clipboard.writeText(n),r(!0)};return we.useEffect(()=>{let n;return e&&(n=setTimeout(()=>r(!1),1500)),()=>clearTimeout(n)},[e]),{copy:l,copied:e}},Pn=d.default.button(({theme:e,$inline:r})=>o.css`
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
  `),Vn=d.default.div(({theme:e,$inline:r,$size:l})=>o.css`
    display: flex;
    gap: ${e.space[2]};
    align-items: flex-start;
    width: ${l==="large"?e.space[30]:e.space["22.5"]};
    flex: 0 0 ${l==="large"?e.space[30]:e.space["22.5"]};

    ${r&&o.css`
      width: fit-content;
      flex: initial;
    `}
  `),Mn=d.default.div(({theme:e,$inline:r})=>o.css`
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
  `),er=d.default(D)(()=>o.css`
    text-align: left;
    width: 100%;
  `),Zn=d.default.div(({theme:e})=>o.css`
    svg {
      display: block;
      width: ${e.space[5]};
      height: ${e.space[5]};
    }
  `),Ln=d.default(D)(({$inline:e})=>o.css`
    flex: 1;
    text-align: left;
    word-break: break-all;

    ${e&&o.css`
      word-break: initial;
    `}
  `),Gn=d.default.svg(({theme:e,$rotate:r})=>o.css`
    display: block;
    margin-top: ${e.space[1]};
    width: ${e.space[3]};
    height: ${e.space[3]};
    color: ${e.colors.greyPrimary};
    ${r&&o.css`
      transform: rotate(45deg);
    `}
  `),dt=({as:e="button",link:r,size:l="small",inline:n=!1,icon:c,keyLabel:a,keySublabel:i,value:u,children:s,...p})=>{const{copy:b,copied:g}=Rn(),f=e==="a"?{href:r,rel:"nofollow noreferrer",target:"_blank",...p}:{onClick:()=>{b(u)},...p},v=!!c||!!a,E=!!a||!!i,h=typeof a=="string"?t.createElement(er,{$inline:n,color:"grey",ellipsis:!n,fontVariant:l==="large"?"bodyBold":"smallBold"},a):a,x=typeof i=="string"?t.createElement(er,{$inline:n,color:"grey",ellipsis:!n,fontVariant:l==="large"?"smallBold":"extraSmallBold"},i):i,R=r?{$rotate:!0,as:$t}:g?{as:Te}:{as:bt};return t.createElement(Pn,{$inline:n,as:e,...f},v&&t.createElement(Vn,{$inline:n,$size:l},c&&t.createElement(Zn,null,c),E&&t.createElement(Mn,{$inline:n},h,x)),t.createElement(Ln,{$inline:n,fontVariant:l==="large"?"body":"small"},s),t.createElement(Gn,{...R}))};dt.displayName="RecordItem";const Tn=d.default.div(({theme:e,$showTop:r,$showBottom:l})=>o.css`
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
        z-index: 100;
      `}
    }
    &::after {
      bottom: 0;
      ${l&&o.css`
        background-color: hsla(${e.colors.raw.greyLight} / 1);
        z-index: 100;
      `}
    }
  `),tr=d.default.div(()=>o.css`
    display: block;
    height: 0px;
  `),ut=({hideDividers:e=!1,topTriggerPx:r=16,bottomTriggerPx:l=16,onReachedTop:n,onReachedBottom:c,children:a,...i})=>{const u=t.useRef(null),s=t.useRef(null),p=t.useRef(null),b=typeof e=="boolean"?e:!!(e!=null&&e.top),g=typeof e=="boolean"?e:!!(e!=null&&e.bottom),f=t.useRef({onReachedTop:n,onReachedBottom:c}),[v,E]=t.useState(!1),[h,x]=t.useState(!1),R=w=>{var $,Z,H,T;const C=[!1,-1],m=[!1,-1];for(let S=0;S<w.length;S+=1){const L=w[S],j=L.target===s.current?C:m;L.time>j[1]&&(j[0]=L.isIntersecting,j[1]=L.time)}C[1]!==-1&&!b&&E(!C[0]),m[1]!==-1&&!g&&x(!m[0]),C[0]&&((Z=($=f.current).onReachedTop)==null||Z.call($)),m[0]&&((T=(H=f.current).onReachedBottom)==null||T.call(H))};return t.useEffect(()=>{const w=u.current,C=s.current,m=p.current;let $;return w&&C&&m&&($=new IntersectionObserver(R,{root:w,threshold:1,rootMargin:`${r}px 0px ${l}px 0px`}),$.observe(C),$.observe(m)),()=>{$.disconnect()}},[l,r]),t.useEffect(()=>{f.current={onReachedTop:n,onReachedBottom:c}},[n,c]),t.createElement(Tn,{$showBottom:h,$showTop:v,ref:u,...i},t.createElement(tr,{"data-testid":"scrollbox-top-intersect",ref:s}),a,t.createElement(tr,{"data-testid":"scrollbox-bottom-intersect",ref:p}))},Zr=t.createContext(void 0),pt=({children:e,loading:r})=>t.createElement(Zr.Provider,{value:r},e);pt.displayName="SkeletonGroup";const Bn=o.keyframes`
  to {
    background-position-x: -200%;
  }
`,On=d.default.div(({theme:e,$active:r})=>o.css`
    ${r&&o.css`
      background: ${e.colors.greyLight}
        linear-gradient(
          110deg,
          ${e.colors.greyLight} 8%,
          ${e.colors.greySurface} 18%,
          ${e.colors.greyLight} 33%
        );
      background-size: 200% 100%;
      animation: 1.5s ${Bn} infinite linear;
      border-radius: ${e.radii.medium};
      width: ${e.space.fit};
    `}
  `),Hn=d.default.span(({$active:e})=>o.css`
    display: block;
    ${e?o.css`
          visibility: hidden;
          * {
            visibility: hidden !important;
          }
        `:""}
  `),ft=({as:e,children:r,loading:l,...n})=>{const c=t.useContext(Zr),a=l!=null?l:c;return t.createElement(On,{...n,$active:a,as:e},t.createElement(Hn,{$active:a},r))};ft.displayName="Skeleton";const An=d.default.div(({theme:e,$hover:r,$size:l,$colorStyle:n})=>o.css`
    align-items: center;
    display: flex;
    border-radius: ${e.radii.full};
    font-size: ${e.fontSizes.small};
    line-height: ${e.lineHeights.small};
    font-weight: ${e.fontWeights.bold};
    width: ${e.space.max};
    padding: ${e.space["0.5"]} ${e.space[2]};
    background: ${N(n,"background")};
    color: ${N(n,"text")};
    border: 1px solid ${N(n,"border")};
    cursor: default;

    ${l==="small"&&o.css`
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
        background-color: ${N(n,"hover")};
      }
    `}
  `),Ie=({as:e="div",children:r,hover:l,size:n="small",colorStyle:c="accentSecondary",...a})=>t.createElement(An,{...a,$colorStyle:c,$hover:l,$size:n,as:e},r);Ie.displayName="Tag";const Le=({children:e,surface:r,onDismiss:l,noBackground:n=!1,className:c="modal",open:a,renderCallback:i})=>{const[u,s]=lt.useTransition({timeout:{enter:50,exit:300},mountOnEnter:!0,unmountOnExit:!0}),p=t.useRef(null),b=r||ot,g=f=>f.target===p.current&&l&&l();return t.useEffect(()=>{const{style:f,dataset:v}=document.body,E=()=>parseInt(v.backdrops||"0"),h=R=>v.backdrops=String(E()+R),x=(R,w,C)=>{f.width=R,f.position=w,f.top=C};if(s(a||!1),typeof window<"u"&&!n&&a)return E()===0&&x(`${document.body.clientWidth}px`,"fixed",`-${window.scrollY}px`),h(1),()=>{const R=parseFloat(f.top||"0")*-1;E()===1&&(x("","",""),window.scroll({top:R})),h(-1)}},[a,n]),u!=="unmounted"?t.createElement(Me,{className:c,renderCallback:i},l&&t.createElement(b,{$empty:n,$state:u,ref:p,onClick:g}),e({state:u})):null};Le.displayName="Backdrop";const Fn=(e="",r=10,l=5,n=5)=>e.length<r?e:`${e.slice(0,l)}...${e.slice(-n)}`,ce=(e,r)=>e["data-testid"]?String(e["data-testid"]):r,jn=d.default.input(({theme:e,$colorStyle:r="accentPrimary"})=>o.css`
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
      background: ${N(r,"background")};
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
      background: ${N(r,"text")};
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
  `),gt=t.forwardRef(({description:e,disabled:r,error:l,hideLabel:n,id:c,label:a,labelSecondary:i,inline:u=!0,name:s,required:p,tabIndex:b,value:g,checked:f,width:v,onBlur:E,onChange:h,onFocus:x,colorStyle:R="accentPrimary",...w},C)=>{const m=t.useRef(null),$=C||m;return t.createElement(le,{description:e,disabled:r,error:l,hideLabel:n,id:c,inline:u,label:a,labelSecondary:i,required:p,width:v},t.createElement(jn,{...w,"data-testid":ce(w,"checkbox"),"aria-invalid":l?!0:void 0,type:"checkbox",$colorStyle:R,checked:f,disabled:r,name:s,ref:$,tabIndex:b,value:g,onBlur:E,onChange:h,onFocus:x}))});gt.displayName="Checkbox";const Dn=d.default.div(({theme:e,$color:r})=>o.css`
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
  `),Nn=d.default.input(()=>o.css`
    position: absolute;
    width: 1px;
    height: 1px;
  `),zn=d.default.label(({theme:e})=>o.css`
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
  `),Wn=d.default.div(({theme:e})=>o.css`
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
  `),_n=d.default.div(()=>o.css`
    display: flex;
    flex-direction: column;
  `),mt=t.forwardRef(({label:e,subLabel:r,name:l,color:n="blue",disabled:c,...a},i)=>{const u=t.useRef(null),s=i||u,p=it(),b=c?"grey":"text";return t.createElement(Dn,{$color:n},t.createElement(Nn,{disabled:c,id:p,name:l,type:"checkbox",...a,ref:s}),t.createElement(zn,{htmlFor:p,id:"permissions-label"},t.createElement(Wn,{id:"circle"},t.createElement(Te,null)),t.createElement(_n,null,t.createElement(D,{color:b,fontVariant:"bodyBold"},e),r&&t.createElement(D,{color:b,fontVariant:"small"},r))))});mt.displayName="CheckboxRow";const Lr=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M4.5 23.225C1.173 12.416 12.09 2.703 22.438 7.264l65.03 28.657c10.502 4.628 10.502 19.53 0 24.158l-65.03 28.657c-10.348 4.56-21.265-5.153-17.94-15.96L12.122 48 4.5 23.225ZM22.83 54l-6.86 22.304c-.303.983.69 1.866 1.63 1.451l65.03-28.657c.31-.136.454-.297.541-.437.102-.166.175-.395.175-.661s-.073-.495-.175-.661c-.087-.14-.232-.301-.54-.437L17.6 18.245c-.941-.415-1.934.468-1.631 1.45L22.83 42h21.72a6 6 0 0 1 0 12H22.83Z",clipRule:"evenodd"})),Ge=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M48 30a6 6 0 0 1 6 6v12a6 6 0 0 1-12 0V36a6 6 0 0 1 6-6Zm6 34a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M58.873 7.242c-5.757-6.514-15.988-6.514-21.746 0-15.715 17.78-27.914 38.623-35.65 61.07-2.866 8.315 2.358 17.173 10.902 18.842 23.418 4.575 47.824 4.575 71.242 0 8.544-1.669 13.768-10.527 10.903-18.841-7.737-22.448-19.936-43.29-35.651-61.071Zm-12.754 7.947c.98-1.11 2.782-1.11 3.762 0C64.564 31.8 75.96 51.275 83.18 72.223c.461 1.34-.38 2.865-1.858 3.154-21.9 4.278-44.743 4.278-66.642 0-1.478-.289-2.32-1.815-1.858-3.154 7.22-20.948 18.615-40.422 33.298-57.034Z",clipRule:"evenodd"})),Gr=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M22 36a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm16 0a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm22-6a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M18 8C8.059 8 0 16.059 0 26v44c0 9.941 8.059 18 18 18h60c9.941 0 18-8.059 18-18V26c0-9.941-8.059-18-18-18H18Zm-6 18a6 6 0 0 1 6-6h60a6 6 0 0 1 6 6v44a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V26Z",clipRule:"evenodd"})),Tr=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M26 72a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm28-6a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm16 6a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM26 40a6 6 0 0 0 0 12h44a6 6 0 0 0 0-12H26Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M20 10a6 6 0 0 1 12 0v2h32v-2a6 6 0 0 1 12 0v2h2c9.941 0 18 8.059 18 18v44c0 9.941-8.059 18-18 18H18C8.059 92 0 83.941 0 74V30c0-9.941 8.059-18 18-18h2v-2Zm0 16v-2h-2a6 6 0 0 0-6 6v44a6 6 0 0 0 6 6h60a6 6 0 0 0 6-6V30a6 6 0 0 0-6-6h-2v2a6 6 0 0 1-12 0v-2H32v2a6 6 0 0 1-12 0Z",clipRule:"evenodd"})),Br=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 30c-10.493 0-19 8.507-19 19s8.507 19 19 19 19-8.507 19-19-8.507-19-19-19Zm-7 19a7 7 0 1 1 14 0 7 7 0 0 1-14 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M33.504 8a18 18 0 0 0-17.47 13.66l-1.665 6.706C6.169 30.046 0 37.303 0 46v24c0 9.941 8.059 18 18 18h60c9.941 0 18-8.059 18-18V46c0-8.697-6.168-15.954-14.369-17.634l-1.666-6.706A18 18 0 0 0 62.496 8H33.504ZM16.777 40.122l7.413-1.518 3.49-14.05A6 6 0 0 1 33.505 20h28.992a6 6 0 0 1 5.823 4.553l3.491 14.05 7.413 1.52A6.006 6.006 0 0 1 84 46v24a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V46a6.006 6.006 0 0 1 4.777-5.878Z",clipRule:"evenodd"})),Te=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M88.455 28.019a6 6 0 1 0-8.91-8.038l-41.852 46.4L16.16 45.676a6 6 0 0 0-8.318 8.65L33.82 79.304l.094.09c.508.472 1.077.84 1.68 1.104a6.017 6.017 0 0 0 5.183-.177 5.984 5.984 0 0 0 1.7-1.325l45.98-50.977Z"})),Or=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M71.243 32.757a6 6 0 0 1 0 8.486l-24.98 24.98A5.978 5.978 0 0 1 44.7 67.36a6.017 6.017 0 0 1-5.18.105 5.976 5.976 0 0 1-1.611-1.076L24.93 54.409a6 6 0 0 1 8.14-8.818l8.764 8.09 20.923-20.924a6 6 0 0 1 8.486 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Zm0-12c19.882 0 36-16.118 36-36S67.882 12 48 12 12 28.118 12 48s16.118 36 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Hr=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 28c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20Zm-8 20a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 0c-.693 0-1.383.015-2.069.044-5.799.246-10.449 3.635-13.244 7.724l-2.594 3.795c-.39.571-1.06 1.191-2.099 1.793-1.033.598-1.896.864-2.594.918l-4.591.35c-4.926.375-10.176 2.695-13.292 7.576a47.964 47.964 0 0 0-2.091 3.614c-2.686 5.144-2.07 10.862.07 15.319l2.002 4.17c.3.627.502 1.51.502 2.697 0 1.188-.201 2.07-.502 2.697l-2.002 4.17c-2.14 4.457-2.756 10.175-.07 15.32A47.967 47.967 0 0 0 7.517 73.8c3.116 4.881 8.366 7.201 13.292 7.577l4.591.35c.698.053 1.561.32 2.594.917 1.04.602 1.709 1.222 2.1 1.793l2.593 3.795c2.795 4.089 7.445 7.478 13.244 7.724a48.674 48.674 0 0 0 4.138 0c5.799-.246 10.449-3.635 13.244-7.724l2.594-3.795c.39-.571 1.06-1.191 2.099-1.793 1.033-.598 1.897-.864 2.594-.918l4.591-.35c4.926-.375 10.176-2.695 13.292-7.576a47.949 47.949 0 0 0 2.091-3.614c2.686-5.144 2.07-10.862-.07-15.319l-2.002-4.17C88.202 50.07 88 49.187 88 48c0-1.188.201-2.07.502-2.697l2.002-4.17c2.14-4.457 2.756-10.175.07-15.32a47.949 47.949 0 0 0-2.09-3.613c-3.118-4.88-8.368-7.2-13.294-7.577l-4.591-.35c-.697-.053-1.561-.32-2.594-.917-1.04-.602-1.709-1.222-2.1-1.793l-2.593-3.795C60.518 3.679 55.868.29 50.069.044A48.724 48.724 0 0 0 48 0Zm-1.56 12.033a36.657 36.657 0 0 1 3.12 0c1.209.051 2.683.805 3.846 2.507L56 18.335c1.67 2.444 3.875 4.18 5.997 5.408 2.136 1.236 4.737 2.27 7.691 2.496l4.592.35c2.052.156 3.44 1.052 4.089 2.069.56.878 1.084 1.782 1.568 2.709.556 1.065.641 2.714-.25 4.572l-2.003 4.17C76.406 42.773 76 45.54 76 48s.406 5.228 1.684 7.89l2.002 4.17c.892 1.859.807 3.508.25 4.573a36.006 36.006 0 0 1-1.567 2.71c-.65 1.016-2.037 1.912-4.09 2.068l-4.59.35c-2.954.225-5.556 1.26-7.692 2.496-2.122 1.228-4.326 2.964-5.997 5.408l-2.594 3.795c-1.163 1.702-2.637 2.456-3.847 2.507a36.654 36.654 0 0 1-3.118 0c-1.21-.051-2.684-.805-3.847-2.507L40 77.665c-1.67-2.444-3.875-4.18-5.997-5.408-2.136-1.236-4.737-2.27-7.691-2.496l-4.592-.35c-2.052-.156-3.44-1.052-4.089-2.069a35.972 35.972 0 0 1-1.568-2.709c-.556-1.065-.641-2.714.25-4.572l2.003-4.17C19.594 53.227 20 50.46 20 48s-.406-5.228-1.684-7.89l-2.002-4.17c-.892-1.859-.807-3.508-.25-4.573a35.972 35.972 0 0 1 1.567-2.71c.65-1.016 2.037-1.912 4.09-2.068l4.59-.35c2.955-.225 5.556-1.26 7.692-2.496 2.122-1.228 4.326-2.964 5.997-5.408l2.594-3.795c1.163-1.702 2.637-2.456 3.847-2.507Z",clipRule:"evenodd"})),Ar=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M25.856 20.256c1.825-.139 3.558-.79 5.143-1.707 1.58-.914 3.017-2.093 4.048-3.6l2.594-3.795c1.979-2.895 5.041-4.967 8.545-5.116a42.712 42.712 0 0 1 3.628 0c3.504.15 6.566 2.22 8.545 5.116l2.594 3.795c1.031 1.507 2.467 2.686 4.048 3.6 1.585.917 3.317 1.568 5.143 1.707l4.591.35c3.49.266 6.808 1.874 8.69 4.823a41.963 41.963 0 0 1 1.83 3.161c1.622 3.105 1.356 6.788-.16 9.946l-2.002 4.17C82.303 44.351 82 46.176 82 48c0 1.824.304 3.65 1.093 5.294l2.002 4.17c1.516 3.158 1.782 6.84.16 9.946a41.963 41.963 0 0 1-1.83 3.161c-1.882 2.949-5.2 4.557-8.69 4.823l-4.591.35c-1.826.139-3.558.79-5.143 1.707-1.58.914-3.017 2.093-4.048 3.6l-2.594 3.795c-1.979 2.895-5.04 4.967-8.545 5.115a42.662 42.662 0 0 1-3.628 0c-3.504-.148-6.566-2.22-8.545-5.115l-2.594-3.795c-1.031-1.507-2.467-2.686-4.048-3.6-1.585-.917-3.317-1.568-5.143-1.707l-4.591-.35c-3.49-.266-6.808-1.874-8.69-4.823a41.963 41.963 0 0 1-1.83-3.161c-1.622-3.105-1.356-6.788.16-9.946l2.002-4.17C13.697 51.649 14 49.824 14 48c0-1.824-.304-3.65-1.093-5.294l-2.002-4.17c-1.516-3.158-1.782-6.84-.16-9.946a41.963 41.963 0 0 1 1.83-3.161c1.882-2.949 5.2-4.557 8.69-4.823l4.591-.35ZM48 61c7.18 0 13-5.82 13-13s-5.82-13-13-13-13 5.82-13 13 5.82 13 13 13Z",clipRule:"evenodd",opacity:.35}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 28c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20Zm-8 20a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 0c-.693 0-1.383.015-2.069.044-5.799.246-10.449 3.635-13.244 7.724l-2.594 3.795c-.39.571-1.06 1.191-2.099 1.793-1.033.598-1.896.864-2.594.918l-4.591.35c-4.926.375-10.176 2.695-13.292 7.576a47.964 47.964 0 0 0-2.091 3.614c-2.686 5.144-2.07 10.862.07 15.319l2.002 4.17c.3.627.502 1.51.502 2.697 0 1.188-.201 2.07-.502 2.697l-2.002 4.17c-2.14 4.457-2.756 10.175-.07 15.32A47.967 47.967 0 0 0 7.517 73.8c3.116 4.881 8.366 7.201 13.292 7.577l4.591.35c.698.053 1.561.32 2.594.917 1.04.602 1.709 1.222 2.1 1.793l2.593 3.795c2.795 4.089 7.445 7.478 13.244 7.724a48.674 48.674 0 0 0 4.138 0c5.799-.246 10.449-3.635 13.244-7.724l2.594-3.795c.39-.571 1.06-1.191 2.099-1.793 1.033-.598 1.897-.864 2.594-.918l4.591-.35c4.926-.375 10.176-2.695 13.292-7.576a47.949 47.949 0 0 0 2.091-3.614c2.686-5.144 2.07-10.862-.07-15.319l-2.002-4.17C88.202 50.07 88 49.187 88 48c0-1.188.201-2.07.502-2.697l2.002-4.17c2.14-4.457 2.756-10.175.07-15.32a47.949 47.949 0 0 0-2.09-3.613c-3.118-4.88-8.368-7.2-13.294-7.577l-4.591-.35c-.697-.053-1.561-.32-2.594-.917-1.04-.602-1.709-1.222-2.1-1.793l-2.593-3.795C60.518 3.679 55.868.29 50.069.044A48.724 48.724 0 0 0 48 0Zm-1.56 12.033a36.657 36.657 0 0 1 3.12 0c1.209.051 2.683.805 3.846 2.507L56 18.335c1.67 2.444 3.875 4.18 5.997 5.408 2.136 1.236 4.737 2.27 7.691 2.496l4.592.35c2.052.156 3.44 1.052 4.089 2.069.56.878 1.084 1.782 1.568 2.709.556 1.065.641 2.714-.25 4.572l-2.003 4.17C76.406 42.773 76 45.54 76 48s.406 5.228 1.684 7.89l2.002 4.17c.892 1.859.807 3.508.25 4.573a36.006 36.006 0 0 1-1.567 2.71c-.65 1.016-2.037 1.912-4.09 2.068l-4.59.35c-2.954.225-5.556 1.26-7.692 2.496-2.122 1.228-4.326 2.964-5.997 5.408l-2.594 3.795c-1.163 1.702-2.637 2.456-3.847 2.507a36.654 36.654 0 0 1-3.118 0c-1.21-.051-2.684-.805-3.847-2.507L40 77.665c-1.67-2.444-3.875-4.18-5.997-5.408-2.136-1.236-4.737-2.27-7.691-2.496l-4.592-.35c-2.052-.156-3.44-1.052-4.089-2.069a35.972 35.972 0 0 1-1.568-2.709c-.556-1.065-.641-2.714.25-4.572l2.003-4.17C19.594 53.227 20 50.46 20 48s-.406-5.228-1.684-7.89l-2.002-4.17c-.892-1.859-.807-3.508-.25-4.573a35.972 35.972 0 0 1 1.567-2.71c.65-1.016 2.037-1.912 4.09-2.068l4.59-.35c2.955-.225 5.556-1.26 7.692-2.496 2.122-1.228 4.326-2.964 5.997-5.408l2.594-3.795c1.163-1.702 2.637-2.456 3.847-2.507Z",clipRule:"evenodd"})),bt=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M50 96c-7.732 0-14-6.268-14-14V42c0-7.732 6.268-14 14-14h24c7.732 0 14 6.268 14 14v40c0 7.732-6.268 14-14 14H50Zm-2-14a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V42a2 2 0 0 0-2-2H50a2 2 0 0 0-2 2v40Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M22 0C14.268 0 8 6.268 8 14v40c0 7.732 6.268 14 14 14a6 6 0 0 0 0-12 2 2 0 0 1-2-2V14a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2 6 6 0 0 0 12 0c0-7.732-6.268-14-14-14H22Z"})),Fr=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M25.74 37.884C29.59 29.702 37.98 24 47.744 24 61.188 24 72 34.793 72 48S61.188 72 47.744 72a24.31 24.31 0 0 1-12.462-3.404 6 6 0 1 0-6.128 10.317A36.31 36.31 0 0 0 47.744 84C67.719 84 84 67.93 84 48S67.72 12 47.744 12a36.284 36.284 0 0 0-32.04 19.137l-2.012-6.034a6 6 0 0 0-11.384 3.794l7 21a6 6 0 0 0 7.674 3.766l20-7a6 6 0 0 0-3.964-11.326l-7.278 2.547Z"})),jr=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M22 68a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm22-6a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm10 6a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M0 30c0-9.941 8.059-18 18-18h60c9.941 0 18 8.059 18 18v36c0 9.941-8.059 18-18 18H18C8.059 84 0 75.941 0 66V30Zm18-6a6 6 0 0 0-6 6v2h72v-2a6 6 0 0 0-6-6H18Zm-6 42V44h72v22a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6Z",clipRule:"evenodd"})),Ee=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M17.757 26.243a6 6 0 1 1 8.486-8.486L48 39.515l21.757-21.758a6 6 0 1 1 8.486 8.486L56.485 48l21.758 21.757a6 6 0 1 1-8.486 8.486L48 56.485 26.243 78.243a6 6 0 1 1-8.486-8.486L39.515 48 17.757 26.243Z"})),Be=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M66.243 29.757a6 6 0 0 1 0 8.486L56.485 48l9.758 9.757a6 6 0 1 1-8.486 8.486L48 56.485l-9.757 9.758a6 6 0 1 1-8.486-8.486L39.515 48l-9.758-9.757a6 6 0 1 1 8.486-8.486L48 39.515l9.757-9.758a6 6 0 0 1 8.486 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Zm0-12c19.882 0 36-16.118 36-36S67.882 12 48 12 12 28.118 12 48s16.118 36 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Dr=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M96 48c0 26.51-21.49 48-48 48S0 74.51 0 48 21.49 0 48 0s48 21.49 48 48Zm-12 0c0 19.882-16.118 36-36 36a35.836 35.836 0 0 1-20.86-6.656l50.204-50.203A35.836 35.836 0 0 1 84 48ZM18.656 68.86l50.203-50.204A35.836 35.836 0 0 0 48 12c-19.882 0-36 16.118-36 36a35.836 35.836 0 0 0 6.655 20.86Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Nr=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M26 12a2 2 0 0 0-2 2v68a2 2 0 0 0 2 2h44a2 2 0 0 0 2-2V30.387a2 2 0 0 0-.608-1.436L54.485 12.564A2 2 0 0 0 53.093 12H26Zm-14 2c0-7.732 6.268-14 14-14h27.093a14 14 0 0 1 9.743 3.947l16.908 16.387A14 14 0 0 1 84 30.387V82c0 7.732-6.268 14-14 14H26c-7.732 0-14-6.268-14-14V14Z",clipRule:"evenodd"})),zr=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M0 22C0 9.85 9.85 0 22 0s22 9.85 22 22-9.85 22-22 22S0 34.15 0 22Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10ZM0 74c0-12.15 9.85-22 22-22s22 9.85 22 22-9.85 22-22 22S0 86.15 0 74Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10ZM74 0C61.85 0 52 9.85 52 22s9.85 22 22 22 22-9.85 22-22S86.15 0 74 0ZM64 22c0 5.523 4.477 10 10 10s10-4.477 10-10-4.477-10-10-10-10 4.477-10 10ZM52 74c0-12.15 9.85-22 22-22s22 9.85 22 22-9.85 22-22 22-22-9.85-22-22Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Wr=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M22 40c9.941 0 18-8.059 18-18S31.941 4 22 4 4 12.059 4 22s8.059 18 18 18Zm0 52c9.941 0 18-8.059 18-18s-8.059-18-18-18S4 64.059 4 74s8.059 18 18 18Zm70-70c0 9.941-8.059 18-18 18s-18-8.059-18-18S64.059 4 74 4s18 8.059 18 18ZM74 92c9.941 0 18-8.059 18-18s-8.059-18-18-18-18 8.059-18 18 8.059 18 18 18Z",clipRule:"evenodd",opacity:.35}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M0 22C0 9.85 9.85 0 22 0s22 9.85 22 22-9.85 22-22 22S0 34.15 0 22Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10ZM0 74c0-12.15 9.85-22 22-22s22 9.85 22 22-9.85 22-22 22S0 86.15 0 74Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10ZM74 0C61.85 0 52 9.85 52 22s9.85 22 22 22 22-9.85 22-22S86.15 0 74 0ZM64 22c0 5.523 4.477 10 10 10s10-4.477 10-10-4.477-10-10-10-10 4.477-10 10ZM52 74c0-12.15 9.85-22 22-22s22 9.85 22 22-9.85 22-22 22-22-9.85-22-22Zm22 10c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),_r=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"m52.243 88.243 34-34a6 6 0 1 0-8.486-8.486L54 69.515V12a6 6 0 0 0-12 0v57.515L18.243 45.757a6 6 0 0 0-8.486 8.486l33.986 33.985.014.015a6 6 0 0 0 8.486 0Z"})),Ye=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M52.243 70.243a6 6 0 0 1-8.486 0l-30-30a6 6 0 1 1 8.486-8.486L48 57.515l25.757-25.758a6 6 0 1 1 8.486 8.486l-30 30Z",clipRule:"evenodd"})),Ir=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M42 28v25.515l-6.757-6.758a6 6 0 1 0-8.486 8.486l17 17a6.002 6.002 0 0 0 8.485 0l.006-.006 16.995-16.994a6 6 0 1 0-8.486-8.486L54 53.515V28a6 6 0 0 0-12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M0 48C0 21.49 21.49 0 48 0s48 21.49 48 48-21.49 48-48 48S0 74.51 0 48Zm12 0c0-19.882 16.118-36 36-36s36 16.118 36 36-16.118 36-36 36-36-16.118-36-36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Yr=({title:e,titleId:r,...l})=>t.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{d:"M4.00058 9.70969C4.23776 10.2167 4.82477 11.2188 4.82477 11.2188L11.611 0L4.98783 4.62508C4.59318 4.88836 4.2694 5.24473 4.04505 5.66275C3.7434 6.29338 3.58313 6.98229 3.57545 7.68131C3.56777 8.38033 3.71286 9.07259 4.00058 9.70969Z",fill:"#5298FF"}),t.createElement("path",{d:"M1.31159 13.4038C1.38637 14.477 1.68956 15.5217 2.20086 16.4682C2.71216 17.4146 3.41976 18.2409 4.27629 18.8917L11.6021 24C11.6021 24 7.01863 17.3944 3.15267 10.8215C2.76128 10.1271 2.49816 9.36782 2.37592 8.58011C2.3218 8.22341 2.3218 7.86059 2.37592 7.50389C2.27512 7.69068 2.07945 8.07313 2.07945 8.07313C1.68745 8.87262 1.42049 9.72754 1.28787 10.608C1.21154 11.5388 1.21948 12.4745 1.31159 13.4038Z",fill:"#5298FF"}),t.createElement("path",{d:"M20.0011 14.2903C19.7639 13.7833 19.1769 12.7812 19.1769 12.7812L12.3907 24L19.0138 19.3779C19.4085 19.1146 19.7322 18.7582 19.9566 18.3402C20.2587 17.7092 20.4192 17.0198 20.4269 16.3202C20.4346 15.6206 20.2892 14.9278 20.0011 14.2903Z",fill:"#5298FF"}),t.createElement("path",{d:"M22.69 10.5962C22.6153 9.52304 22.3121 8.47827 21.8008 7.53183C21.2895 6.58539 20.5819 5.75911 19.7253 5.10834L12.3996 0C12.3996 0 16.98 6.60556 20.849 13.1785C21.2393 13.8731 21.5014 14.6324 21.6227 15.4199C21.6769 15.7766 21.6769 16.1394 21.6227 16.4961C21.7235 16.3093 21.9192 15.9269 21.9192 15.9269C22.3112 15.1274 22.5782 14.2725 22.7108 13.392C22.7881 12.4613 22.7812 11.5256 22.69 10.5962Z",fill:"#5298FF"}),t.createElement("path",{d:"M4.04505 5.66275C4.2694 5.24473 4.59318 4.88836 4.98783 4.62508L11.611 0L4.82476 11.2217C4.82476 11.2217 4.23182 10.2196 4.00057 9.71266C3.7124 9.07515 3.56707 8.38236 3.57475 7.68278C3.58243 6.98321 3.74296 6.29378 4.04505 5.66275ZM1.31159 13.4038C1.38637 14.477 1.68956 15.5217 2.20086 16.4682C2.71216 17.4146 3.41976 18.2409 4.27629 18.8917L11.6021 24C11.6021 24 7.01863 17.3944 3.15267 10.8215C2.76128 10.1271 2.49816 9.36782 2.37592 8.58011C2.3218 8.22341 2.3218 7.86059 2.37592 7.50389C2.27512 7.69068 2.07945 8.07313 2.07945 8.07313C1.68745 8.87262 1.42049 9.72754 1.28787 10.608C1.21154 11.5388 1.21948 12.4745 1.31159 13.4038ZM19.9892 14.2933C19.752 13.7863 19.165 12.7842 19.165 12.7842L12.3907 24L19.0138 19.3779C19.4085 19.1146 19.7322 18.7582 19.9566 18.3402C20.2587 17.7092 20.4192 17.0198 20.4269 16.3202C20.4346 15.6206 20.2892 14.9278 20.0011 14.2903L19.9892 14.2933ZM22.6782 10.5991C22.6034 9.526 22.3002 8.48124 21.7889 7.53479C21.2776 6.58835 20.57 5.76208 19.7135 5.1113L12.3996 0C12.3996 0 16.98 6.60556 20.849 13.1785C21.2393 13.8731 21.5014 14.6324 21.6227 15.4199C21.6769 15.7766 21.6769 16.1394 21.6227 16.4961C21.7235 16.3093 21.9192 15.9269 21.9192 15.9269C22.3112 15.1274 22.5782 14.2725 22.7108 13.392C22.7881 12.4613 22.7812 11.5256 22.69 10.5962L22.6782 10.5991Z",fill:"#5298FF"})),Ue=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M45.409 4.442 21.525 45.385a3 3 0 0 0 1.103 4.117l23.884 13.647a3 3 0 0 0 2.976 0l23.884-13.647a3 3 0 0 0 1.103-4.117L50.59 4.442c-1.157-1.984-4.025-1.984-5.182 0Z"}),t.createElement("path",{fill:"currentColor",d:"m22.559 59.656 22.983 32.833c1.195 1.706 3.721 1.706 4.916 0L73.44 59.655c.612-.874-.388-1.97-1.315-1.441l-23.63 13.502a1 1 0 0 1-.992 0l-23.63-13.502c-.927-.53-1.927.567-1.315 1.442Z"})),Ur=({title:e,titleId:r,...l})=>t.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{d:"M11.998 0V8.87185L19.4236 12.2225L11.998 0Z",fill:"currentColor",fillOpacity:.8}),t.createElement("path",{d:"M11.998 0L4.57143 12.2225L11.998 8.87185V0Z",fill:"currentColor",fillOpacity:.4}),t.createElement("path",{d:"M11.998 17.9717V24L19.4286 13.6188L11.998 17.9717Z",fill:"currentColor",fillOpacity:.8}),t.createElement("path",{d:"M11.998 24V17.9707L4.57143 13.6188L11.998 24Z",fill:"currentColor",fillOpacity:.4}),t.createElement("path",{d:"M11.998 16.5765L19.4236 12.2226L11.998 8.87386V16.5765Z",fill:"currentColor"}),t.createElement("path",{d:"M4.57143 12.2226L11.998 16.5765V8.87386L4.57143 12.2226Z",fill:"currentColor",fillOpacity:.8})),qr=({title:e,titleId:r,...l})=>t.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{d:"M11.998 0V8.87185L19.4236 12.2225L11.998 0Z",fill:"currentColor",fillOpacity:.602}),t.createElement("path",{d:"M11.998 0L4.57143 12.2225L11.998 8.87185V0Z",fill:"currentColor"}),t.createElement("path",{d:"M11.998 17.9717V24L19.4286 13.6188L11.998 17.9717Z",fill:"currentColor",fillOpacity:.602}),t.createElement("path",{d:"M11.998 24V17.9707L4.57143 13.6188L11.998 24Z",fill:"currentColor"}),t.createElement("path",{d:"M11.998 16.5765L19.4236 12.2226L11.998 8.87386V16.5765Z",fill:"currentColor",fillOpacity:.2}),t.createElement("path",{d:"M4.57143 12.2226L11.998 16.5765V8.87386L4.57143 12.2226Z",fill:"currentColor",fillOpacity:.602})),Xr=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M18 4C8.059 4 0 12.059 0 22v52c0 9.941 8.059 18 18 18h20c9.941 0 18-8.059 18-18v-4a6 6 0 0 0-12 0v4a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V22a6 6 0 0 1 6-6h20a6 6 0 0 1 6 6v4a6 6 0 0 0 12 0v-4c0-9.941-8.059-18-18-18H18Z"}),t.createElement("path",{fill:"currentColor",d:"M94.462 52.011a6 6 0 0 0-.471-8.492L74.014 25.54a6 6 0 0 0-8.028 8.92L74.364 42H38a6 6 0 0 0 0 12h36.364l-8.378 7.54a6 6 0 0 0 8.028 8.92l20-18a5.93 5.93 0 0 0 .448-.449Z"})),Kr=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 28c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20Zm-8 20a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 12c-11.555 0-21.694 5.905-29.276 12.159C11.051 30.489 5.26 37.783 2.29 41.868a11.23 11.23 0 0 0 0 13.264c2.97 4.085 8.76 11.38 16.434 17.709C26.306 79.095 36.445 85 48 85s21.694-5.905 29.276-12.159c7.673-6.33 13.464-13.624 16.434-17.709a11.23 11.23 0 0 0 0-13.264c-2.97-4.085-8.76-11.38-16.434-17.709C69.694 17.905 59.555 12 48 12ZM26.36 63.584C20.026 58.359 15.054 52.23 12.306 48.5c2.748-3.73 7.72-9.859 14.054-15.084C33.033 27.912 40.5 24 48 24s14.967 3.912 21.64 9.416C75.974 38.641 80.946 44.77 83.694 48.5c-2.748 3.73-7.72 9.859-14.054 15.084C62.967 69.088 55.5 73 48 73s-14.967-3.912-21.64-9.416Z",clipRule:"evenodd"})),Qr=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M12.628 48.4C16.224 41.294 27.214 24 48 24c2.766 0 5.328.3 7.703.825a6 6 0 1 0 2.594-11.716A47.514 47.514 0 0 0 48 12C19.107 12 5.122 36.447 1.6 43.625a10.836 10.836 0 0 0 .068 9.702c1.471 2.903 4.368 7.96 8.934 13.14a6 6 0 0 0 9.002-7.934A52.365 52.365 0 0 1 12.628 48.4Zm69.02-14.01a6 6 0 0 1 8.328 1.623 65.09 65.09 0 0 1 4.418 7.602 10.829 10.829 0 0 1-.055 9.698C90.74 60.42 76.733 84 48 84c-1.155 0-2.29-.039-3.404-.114a6 6 0 1 1 .808-11.973c.844.057 1.71.087 2.596.087 20.803 0 31.775-16.72 35.372-23.6a53.684 53.684 0 0 0-3.348-5.682 6 6 0 0 1 1.624-8.329Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M59.723 31.792c-7.82-5.67-18.818-4.982-25.865 2.066-7.047 7.047-7.736 18.045-2.066 25.865L13.757 77.757a6 6 0 1 0 8.486 8.486l64-64a6 6 0 1 0-8.486-8.486L59.723 31.792Zm-8.77 8.77a8.002 8.002 0 0 0-10.39 10.39l10.39-10.39Z",clipRule:"evenodd"})),Jr=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M57.028 14.057C50.441 9.079 41 13.779 41 22.036v1.526a6 6 0 0 0 11.591 2.182L82.047 48 52.591 70.256A6.002 6.002 0 0 0 41 72.437v1.527c0 8.257 9.44 12.957 16.028 7.98l34.365-25.965c5.296-4.001 5.296-11.957 0-15.958L57.028 14.057Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M16.028 14.057C9.441 9.079 0 13.779 0 22.036v51.928c0 8.257 9.44 12.957 16.028 7.98l34.365-25.965c5.295-4.001 5.296-11.957 0-15.958L16.028 14.057ZM12 69.947V26.053L41.047 48 12 69.947Z",clipRule:"evenodd"})),el=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 12c-19.551 0-28.246 5.992-31.795 9.614a.644.644 0 0 0-.17.252 1.069 1.069 0 0 0-.034.425c.04.504.312 1.313 1.005 2.145L39.828 51.82A18 18 0 0 1 44 63.345V80a4 4 0 0 0 8 0V63.345a18 18 0 0 1 4.172-11.524l22.822-27.385c.693-.832.965-1.641 1.005-2.145a1.069 1.069 0 0 0-.034-.425.644.644 0 0 0-.17-.252C76.246 17.992 67.55 12 48 12ZM7.633 13.217C13.793 6.93 25.767 0 48 0c22.233 0 34.207 6.93 40.367 13.217 5.966 6.091 3.67 14.31-.155 18.9L65.391 59.505A6 6 0 0 0 64 63.344V80c0 8.837-7.163 16-16 16s-16-7.163-16-16V63.345a6 6 0 0 0-1.39-3.841L7.787 32.118c-3.826-4.591-6.121-12.81-.155-18.9Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),tl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M46.656 17.497C43.927 28.1 38.483 36.16 33.67 42.944l-.736 1.036C26.815 52.6 22.8 58.254 22.8 65.274c0 6.105 2.309 10.44 5.104 13.452.692-15.463 10.033-27.11 13.693-31.144 2.221-2.449 5.547-2.743 8.02-1.496a6.824 6.824 0 0 1 3.719 6.68c-.307 3.637.344 5.865 1.183 7.52.799 1.578 1.788 2.767 3.197 4.46.328.395.679.817 1.055 1.277 1.83 2.238 4.126 5.28 5.066 9.59.142.653.25 1.317.323 1.993 3.734-3.383 5.918-6.822 7.08-10.137 1.932-5.508 1.4-11.69-1.23-18.444-4.32-11.095-13.762-22.356-23.354-31.528ZM36.289 6.802c.363-4.974 6.52-8.732 11.21-4.716 11.96 10.239 27.197 25.897 33.693 42.585 3.304 8.487 4.539 17.74 1.373 26.768-3.178 9.064-10.436 16.893-22.097 23.204-5.36 2.9-11.915-2.301-9.64-8.38 1.623-4.339 1.585-6.714 1.284-8.093-.307-1.41-1.05-2.619-2.63-4.55-.22-.269-.465-.56-.73-.876-1.445-1.72-3.464-4.123-4.939-7.036l-.105-.21c-2.973 5.887-5.09 13.569-2.977 22.02a6.806 6.806 0 0 1-1.878 6.565 6.705 6.705 0 0 1-7.173 1.382c-4.828-1.948-20.88-9.95-20.88-30.19 0-11.019 6.268-19.762 11.71-27.353.466-.648.924-1.288 1.372-1.92 6.033-8.506 11.522-17.041 12.407-29.2Z",clipRule:"evenodd"})),rl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M16 42a6 6 0 0 1 6-6h16a6 6 0 0 1 0 12H22a6 6 0 0 1-6-6Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M0 18C0 8.059 8.059 0 18 0h24c9.941 0 18 8.059 18 18v18h2c9.941 0 18 8.059 18 18v14c0 1.495.49 2.65 1.028 3.323.53.662.912.677.972.677.06 0 .442-.015.972-.677C83.51 70.649 84 69.495 84 68V32.7L69.726 18.21a6 6 0 0 1 8.548-8.42l14.274 14.488A12 12 0 0 1 96 32.7V68c0 7.518-5.088 16-14 16-8.912 0-14-8.482-14-16V54a6 6 0 0 0-6-6h-2v30c0 9.941-8.059 18-18 18H18C8.059 96 0 87.941 0 78V18Zm48 0a6 6 0 0 0-6-6H18a6 6 0 0 0-6 6v60a6 6 0 0 0 6 6h24a6 6 0 0 0 6-6V18Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),ll=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M15.15 21.393c-2.532 3.395-4.032 8.719-2.588 15.928.42 2.092 1.762 5.1 4.15 8.898 2.324 3.699 5.377 7.738 8.779 11.825 6.8 8.17 14.683 16.161 20.12 21.443 1.36 1.32 3.418 1.32 4.778 0 5.437-5.282 13.32-13.273 20.12-21.443 3.402-4.087 6.455-8.126 8.78-11.825 2.387-3.798 3.73-6.806 4.149-8.898 1.444-7.21-.056-12.533-2.587-15.928C78.317 17.996 74.379 16 69.75 16c-7.945 0-11.555 3.295-13.429 6.118-1.03 1.553-1.637 3.143-1.981 4.362-.17.6-.268 1.083-.32 1.388a7.41 7.41 0 0 0-.048.306l-.003.026a6 6 0 0 1-11.943-.026 7.233 7.233 0 0 0-.047-.306 14.078 14.078 0 0 0-.32-1.388c-.345-1.22-.952-2.81-1.982-4.362C37.804 19.295 34.194 16 26.249 16c-4.628 0-8.566 1.996-11.1 5.393ZM48 13.236C52.218 8.194 59.106 4 69.75 4c8.262 0 15.83 3.662 20.72 10.22 4.892 6.559 6.732 15.485 4.734 25.46-.85 4.235-3.11 8.716-5.756 12.926-2.71 4.31-6.122 8.797-9.716 13.115-7.19 8.64-15.415 16.966-20.982 22.374a15.374 15.374 0 0 1-21.5 0C31.683 82.687 23.46 74.36 16.268 65.72c-3.594-4.318-7.007-8.806-9.716-13.115-2.647-4.21-4.907-8.691-5.756-12.927-1.998-9.974-.158-18.9 4.734-25.46C10.42 7.662 17.988 4 26.25 4 36.893 4 43.781 8.194 48 13.236Z",clipRule:"evenodd"})),ol=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M69.75 9C49.612 9 48 26.793 48 26.793S46.389 9 26.25 9C13.36 9 3.235 20.44 6.68 37.812c2.635 13.296 25.443 36.739 36 47.007a7.58 7.58 0 0 0 10.64 0c10.557-10.268 33.365-33.71 36-47.007C92.765 20.44 82.64 9 69.75 9Z",opacity:.35}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M15.15 21.393c-2.532 3.395-4.032 8.719-2.588 15.928.42 2.092 1.762 5.1 4.15 8.898 2.324 3.699 5.377 7.738 8.779 11.825 6.8 8.17 14.683 16.161 20.12 21.443 1.36 1.32 3.418 1.32 4.778 0 5.437-5.282 13.32-13.273 20.12-21.443 3.402-4.087 6.455-8.126 8.78-11.825 2.387-3.798 3.73-6.806 4.149-8.898 1.444-7.21-.056-12.533-2.587-15.928C78.317 17.996 74.379 16 69.75 16c-7.945 0-11.555 3.295-13.429 6.118-1.03 1.553-1.637 3.143-1.981 4.362-.17.6-.268 1.083-.32 1.388-.027.152-.041.256-.048.306l-.003.026a6 6 0 0 1-11.94 0l-.003-.026a7.596 7.596 0 0 0-.047-.306 14.078 14.078 0 0 0-.32-1.388c-.345-1.22-.952-2.81-1.982-4.362C37.804 19.295 34.194 16 26.249 16c-4.628 0-8.566 1.996-11.1 5.393ZM48 13.236C52.218 8.194 59.106 4 69.75 4c8.262 0 15.83 3.662 20.72 10.22 4.892 6.559 6.732 15.485 4.734 25.46-.85 4.235-3.11 8.716-5.756 12.926-2.71 4.31-6.122 8.797-9.716 13.115-7.19 8.64-15.415 16.966-20.982 22.374a15.374 15.374 0 0 1-21.5 0C31.683 82.687 23.46 74.36 16.268 65.72c-3.594-4.318-7.007-8.806-9.716-13.115-2.647-4.21-4.907-8.691-5.756-12.927-1.998-9.974-.158-18.9 4.734-25.46C10.42 7.662 17.988 4 26.25 4 36.893 4 43.781 8.194 48 13.236Z",clipRule:"evenodd"})),nl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M51.905 5.444a6 6 0 0 0-7.81 0l-42 36a6 6 0 1 0 7.81 9.111L48 17.903l38.095 32.654a6 6 0 1 0 7.81-9.111l-42-36Z"}),t.createElement("path",{fill:"currentColor",d:"M28 58a6 6 0 0 0-12 0v16c0 9.941 8.059 18 18 18h28c9.941 0 18-8.059 18-18V58a6 6 0 0 0-12 0v16a6 6 0 0 1-6 6H34a6 6 0 0 1-6-6V58Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),ht=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M54 26a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm0 16a6 6 0 0 0-10.633-3.812c-.758.921-2.302 1.963-4.176 2.867a26.883 26.883 0 0 1-2.823 1.166l-.142.047-.02.006A6 6 0 0 0 39.78 53.73l-1.766-5.687c1.766 5.687 1.768 5.687 1.768 5.687l.003-.001.005-.002.012-.004.033-.01a18.325 18.325 0 0 0 .395-.13 32.899 32.899 0 0 0 1.771-.66V70a6 6 0 0 0 12 0V42Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Zm0-12c19.882 0 36-16.118 36-36S67.882 12 48 12 12 28.118 12 48s16.118 36 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),al=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M91.243 10.243a6 6 0 1 0-8.486-8.486L41.21 43.305A27.877 27.877 0 0 0 28 40C12.536 40 0 52.536 0 68s12.536 28 28 28 28-12.536 28-28a27.877 27.877 0 0 0-5.648-16.867L66.5 34.985l3.257 3.258a6 6 0 1 0 8.486-8.486L74.985 26.5l3.515-3.515 3.257 3.258a6 6 0 1 0 8.486-8.486L86.985 14.5l4.258-4.257ZM12 68c0-8.837 7.163-16 16-16s16 7.163 16 16-7.163 16-16 16-16-7.163-16-16Z",clipRule:"evenodd"})),cl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M32 18a6 6 0 0 0-12 0v6h-5.86a6.126 6.126 0 0 0-.278 0H6a6 6 0 0 0 0 12h3.712c2.253 6.237 4.715 11.368 8.034 15.918-1.975 1.619-4.277 3.27-7.018 5.053a6 6 0 0 0 6.544 10.058c3.264-2.123 6.15-4.197 8.728-6.367 2.577 2.17 5.464 4.244 8.728 6.367a6 6 0 0 0 6.544-10.058c-2.74-1.783-5.043-3.434-7.018-5.053 3.319-4.55 5.78-9.68 8.034-15.918H46a6 6 0 0 0 0-12h-7.862a6.126 6.126 0 0 0-.278 0H32v-6Zm-6 24.71c-1.213-1.947-2.326-4.136-3.413-6.71h6.826c-1.087 2.574-2.2 4.763-3.413 6.71Zm50.158-2.936c-2.646-4.895-9.67-4.895-12.316 0l-19.12 35.373a6 6 0 1 0 10.556 5.706L57.901 76h24.197l2.624 4.853a6 6 0 1 0 10.556-5.706l-19.12-35.373ZM70 53.618 75.612 64H64.388L70 53.618Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),il=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"m7.757 52.243 34 34a6 6 0 1 0 8.486-8.486L26.485 54H84a6 6 0 0 0 0-12H26.485l23.758-23.757a6 6 0 1 0-8.486-8.486L7.772 43.743l-.015.014a6 6 0 0 0 0 8.486Z"})),sl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M25.757 52.243a6 6 0 0 1 0-8.486l30-30a6 6 0 1 1 8.486 8.486L38.485 48l25.758 25.757a6 6 0 1 1-8.486 8.486l-30-30Z",clipRule:"evenodd"})),dl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M96 48c0 26.51-21.49 48-48 48S0 74.51 0 48 21.49 0 48 0s48 21.49 48 48Zm-12 0a35.836 35.836 0 0 1-6.656 20.86l-8.667-8.668A23.89 23.89 0 0 0 72 48c0-4.46-1.217-8.637-3.337-12.215l8.666-8.666A35.835 35.835 0 0 1 84 48ZM68.837 18.64A35.836 35.836 0 0 0 48 12a35.836 35.836 0 0 0-20.86 6.655l8.668 8.668A23.89 23.89 0 0 1 48 24c4.441 0 8.6 1.206 12.168 3.31l8.67-8.67ZM48 84a35.836 35.836 0 0 0 20.86-6.656l-8.668-8.667A23.89 23.89 0 0 1 48 72c-4.46 0-8.637-1.217-12.215-3.337l-8.666 8.666A35.835 35.835 0 0 0 48 84ZM18.64 68.837A35.836 35.836 0 0 1 12 48a35.836 35.836 0 0 1 6.655-20.86l8.668 8.668A23.89 23.89 0 0 0 24 48c0 4.441 1.206 8.6 3.31 12.168l-8.67 8.67ZM36 48c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12-12-5.373-12-12Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),ul=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"m49.757 53.272-1.514-1.515a6 6 0 1 0-8.486 8.486l1.515 1.514c7.03 7.03 18.427 7.03 25.456 0l23.03-23.029c7.029-7.03 7.029-18.427 0-25.456l-6.03-6.03c-7.03-7.029-18.426-7.029-25.456 0l-9.515 9.515a6 6 0 1 0 8.486 8.486l9.514-9.515a6 6 0 0 1 8.486 0l6.03 6.03a6 6 0 0 1 0 8.485l-23.03 23.03a6 6 0 0 1-8.486 0Z"}),t.createElement("path",{fill:"currentColor",d:"m46.243 42.728 1.514 1.515a6 6 0 0 0 8.486-8.486l-1.515-1.514c-7.03-7.03-18.427-7.03-25.456 0l-23.03 23.03c-7.029 7.029-7.029 18.425 0 25.455l6.03 6.03c7.03 7.029 18.427 7.029 25.456 0l9.515-9.515a6 6 0 1 0-8.486-8.486l-9.514 9.515a6 6 0 0 1-8.486 0l-6.03-6.03a6 6 0 0 1 0-8.485l23.03-23.03a6 6 0 0 1 8.486 0Z"})),pl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M14 28a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 26a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm6 20a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm14-58a6 6 0 0 0 0 12h48a6 6 0 0 0 0-12H34Zm-6 58a6 6 0 0 1 6-6h48a6 6 0 0 1 0 12H34a6 6 0 0 1-6-6Zm6-32a6 6 0 0 0 0 12h48a6 6 0 0 0 0-12H34Z",clipRule:"evenodd"})),fl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M94.243 60.757a6 6 0 0 0-8.486 0L78 68.515V14a6 6 0 0 0-12 0v54.515l-7.757-7.758a6 6 0 0 0-8.486 8.486l18 18a6.002 6.002 0 0 0 8.486 0l18-18a6 6 0 0 0 0-8.486ZM6 28a6 6 0 0 1 0-12h44a6 6 0 0 1 0 12H6ZM0 74a6 6 0 0 0 6 6h28a6 6 0 0 0 0-12H6a6 6 0 0 0-6 6Zm6-20a6 6 0 0 1 0-12h36a6 6 0 0 1 0 12H6Z"})),gl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M94.243 35.243a6 6 0 0 1-8.486 0L78 27.485V82a6 6 0 0 1-12 0V27.485l-7.757 7.758a6 6 0 1 1-8.486-8.486l18-18a6.002 6.002 0 0 1 8.486 0l18 18a6 6 0 0 1 0 8.486ZM6 68a6 6 0 0 0 0 12h44a6 6 0 0 0 0-12H6ZM0 22a6 6 0 0 1 6-6h28a6 6 0 0 1 0 12H6a6 6 0 0 1-6-6Zm6 20a6 6 0 0 0 0 12h36a6 6 0 0 0 0-12H6Z"})),ml=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M48 56a6 6 0 0 1 6 6v4a6 6 0 0 1-12 0v-4a6 6 0 0 1 6-6Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 0C34.745 0 24 10.745 24 24v8.11C15 33.105 8 40.735 8 50v28c0 9.941 8.059 18 18 18h44c9.941 0 18-8.059 18-18V50c0-9.265-7-16.895-16-17.89V24C72 10.745 61.255 0 48 0Zm12 32v-8c0-6.627-5.373-12-12-12s-12 5.373-12 12v8h24ZM26 44a6 6 0 0 0-6 6v28a6 6 0 0 0 6 6h44a6 6 0 0 0 6-6V50a6 6 0 0 0-6-6H26Z",clipRule:"evenodd"})),bl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M48 42c0-5.523-4.477-10-10-10a6 6 0 0 1 0-12c12.15 0 22 9.85 22 22a6 6 0 0 1-12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M72.209 63.724A39.82 39.82 0 0 0 80 40C80 17.909 62.091 0 40 0S0 17.909 0 40s17.909 40 40 40a39.82 39.82 0 0 0 23.724-7.791l18.033 18.034a6 6 0 1 0 8.486-8.486L72.209 63.723ZM40 68c15.464 0 28-12.536 28-28S55.464 12 40 12 12 24.536 12 40s12.536 28 28 28Z",clipRule:"evenodd"})),hl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("circle",{cx:40,cy:40,r:32,fill:"currentColor",opacity:.35}),t.createElement("path",{fill:"currentColor",d:"M48 42c0-5.523-4.477-10-10-10a6 6 0 0 1 0-12c12.15 0 22 9.85 22 22a6 6 0 0 1-12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M72.209 63.724A39.82 39.82 0 0 0 80 40C80 17.909 62.091 0 40 0S0 17.909 0 40s17.909 40 40 40a39.82 39.82 0 0 0 23.724-7.791l18.033 18.034a6 6 0 1 0 8.486-8.486L72.209 63.723ZM40 68c15.464 0 28-12.536 28-28S55.464 12 40 12 12 24.536 12 40s12.536 28 28 28Z",clipRule:"evenodd"})),$l=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M56.86 65.344A35.836 35.836 0 0 1 36 72C16.118 72 0 55.882 0 36S16.118 0 36 0s36 16.118 36 36a35.836 35.836 0 0 1-6.656 20.86l25.899 25.897a6 6 0 1 1-8.486 8.486L56.86 65.345ZM60 36c0 13.255-10.745 24-24 24S12 49.255 12 36s10.745-24 24-24 24 10.745 24 24Z",clipRule:"evenodd"})),wl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 20c-9.941 0-18 8.059-18 18s8.059 18 18 18 18-8.059 18-18-8.059-18-18-18Zm-6 18a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 0C26.235 0 9 18.302 9 40.362c0 15.652 9.428 29.58 17.903 38.996a111.319 111.319 0 0 0 11.985 11.444 73.582 73.582 0 0 0 4.136 3.174c.52.366 1.019.699 1.449.958.19.115.508.3.872.47.145.067.56.258 1.106.4a6.04 6.04 0 0 0 5.347-1.162l.21-.157a118.055 118.055 0 0 0 5.135-4.032c3.26-2.706 7.593-6.586 11.933-11.358C77.548 69.78 87 56.036 87 40.362 87 18.302 69.766 0 48 0ZM21 40.362C21 24.467 33.315 12 48 12s27 12.467 27 28.362c0 11.051-6.865 21.933-14.801 30.658-3.864 4.249-7.76 7.742-10.721 10.201-.597.496-1.155.949-1.666 1.356a79.24 79.24 0 0 1-1.322-1.06A99.3 99.3 0 0 1 35.822 71.33C27.888 62.515 21 51.435 21 40.362Zm22.672 45.477a6.102 6.102 0 0 1 .488-.455l-.004.004c-.04.033-.25.208-.483.451Zm7.013-1.172-.017-.01a.598.598 0 0 0 .015.009h.002Z",clipRule:"evenodd"})),vl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M8 22a6 6 0 0 1 6-6h68a6 6 0 0 1 0 12H14a6 6 0 0 1-6-6Zm0 52a6 6 0 0 1 6-6h68a6 6 0 0 1 0 12H14a6 6 0 0 1-6-6Zm6-32a6 6 0 0 0 0 12h68a6 6 0 0 0 0-12H14Z",clipRule:"evenodd"})),yl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M88 48a6 6 0 0 1-6 6H14a6 6 0 0 1 0-12h68a6 6 0 0 1 6 6Z",clipRule:"evenodd"})),El=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M84 48c0 19.882-16.118 36-36 36S12 67.882 12 48s16.118-36 36-36 36 16.118 36 36Zm12 0c0 26.51-21.49 48-48 48S0 74.51 0 48 21.49 0 48 0s48 21.49 48 48Zm-28 6a6 6 0 0 0 0-12H28a6 6 0 0 0 0 12h40Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),xl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M76 6a6 6 0 0 0-12 0v8a6 6 0 0 0 12 0V6Zm0 32a6 6 0 0 0-12 0v8a6 6 0 0 0 12 0v-8Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M31.438 8.117a8.158 8.158 0 0 1 2.68 8.252A37.596 37.596 0 0 0 33 25.5C33 46.21 49.79 63 70.5 63c3.157 0 6.214-.389 9.13-1.118a8.158 8.158 0 0 1 8.253 2.68c1.942 2.328 2.665 6.005.595 9.245C79.963 87.14 65.018 96 48 96 21.49 96 0 74.51 0 48 0 30.982 8.861 16.037 22.193 7.522c3.24-2.07 6.917-1.347 9.245.595Zm-10.42 16.05A35.858 35.858 0 0 0 12 48c0 19.882 16.118 36 36 36a35.858 35.858 0 0 0 23.834-9.018c-.444.012-.888.018-1.334.018C43.162 75 21 52.838 21 25.5c0-.446.006-.89.018-1.334Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M96 26a6 6 0 0 1-6 6h-8a6 6 0 0 1 0-12h8a6 6 0 0 1 6 6Zm-32 0a6 6 0 0 1-6 6h-8a6 6 0 0 1 0-12h8a6 6 0 0 1 6 6Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Cl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M54 6a6 6 0 0 0-12 0v8a6 6 0 0 0 12 0V6Z"}),t.createElement("path",{fill:"currentColor",d:"M88 26c0-9.941-8.059-18-18-18h-4a6 6 0 0 0 0 12h4a6 6 0 0 1 6 6v52a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6V26a6 6 0 0 1 6-6h4a6 6 0 0 0 0-12h-4C16.059 8 8 16.059 8 26v52c0 9.941 8.059 18 18 18h44c9.941 0 18-8.059 18-18V26Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 24c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16Zm-4 16a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M42.106 73.05c-1.094.489-1.673 1.014-1.968 1.295a6 6 0 0 1-8.276-8.69C33.92 63.695 38.697 60 48 60s14.08 3.695 16.138 5.655a6 6 0 1 1-8.276 8.69c-.295-.281-.874-.806-1.968-1.295C52.786 72.556 50.925 72 48 72c-2.925 0-4.786.556-5.894 1.05Z"})),kl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M50 4a6 6 0 0 0 0 12h21.515L33.757 53.757a6 6 0 1 0 8.486 8.486L80 24.485V46a6 6 0 0 0 12 0V10a6 6 0 0 0-6-6H50Z"}),t.createElement("path",{fill:"currentColor",d:"M16 42a6 6 0 0 1 6-6h8a6 6 0 0 0 0-12h-8c-9.941 0-18 8.059-18 18v32c0 9.941 8.059 18 18 18h32c9.941 0 18-8.059 18-18v-8a6 6 0 0 0-12 0v8a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6V42Z"})),Sl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M76 28c0 15.464-12.536 28-28 28S20 43.464 20 28 32.536 0 48 0s28 12.536 28 28Zm-12 0c0 8.837-7.163 16-16 16s-16-7.163-16-16 7.163-16 16-16 16 7.163 16 16Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M12.915 93.44C16.421 88.434 26.044 76 48 76c21.957 0 31.58 12.433 35.085 17.44a6 6 0 0 0 9.83-6.88C88.421 80.137 75.643 64 48 64S7.58 80.138 3.085 86.56a6 6 0 0 0 9.83 6.88Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Rl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("circle",{cx:48,cy:28,r:22,fill:"currentColor",opacity:.35}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M76 28c0 15.464-12.536 28-28 28S20 43.464 20 28 32.536 0 48 0s28 12.536 28 28Zm-12 0c0 8.837-7.163 16-16 16s-16-7.163-16-16 7.163-16 16-16 16 7.163 16 16Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M12.915 93.44C16.421 88.434 26.044 76 48 76c21.957 0 31.58 12.433 35.085 17.44a6 6 0 0 0 9.83-6.88C88.421 80.137 75.643 64 48 64S7.58 80.138 3.085 86.56a6 6 0 0 0 9.83 6.88Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Pl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M72 6a6 6 0 0 1 12 0v6h6a6 6 0 0 1 0 12h-6v6a6 6 0 0 1-12 0v-6h-6a6 6 0 0 1 0-12h6V6Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M60 38c0 12.15-9.85 22-22 22s-22-9.85-22-22 9.85-22 22-22 22 9.85 22 22Zm-12 0c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M10.915 93.44C13.621 89.577 21.003 80 38 80c16.996 0 24.38 9.576 27.085 13.44a6 6 0 0 0 9.83-6.88C71.221 81.28 60.683 68 38 68 15.316 68 4.78 81.281 1.085 86.56a6 6 0 0 0 9.83 6.88Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Vl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M54 14a6 6 0 0 0-12 0v28H14a6 6 0 0 0 0 12h28v28a6 6 0 0 0 12 0V54h28a6 6 0 0 0 0-12H54V14Z",clipRule:"evenodd"})),Ml=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M48 22a6 6 0 0 1 6 6v14h14a6 6 0 0 1 0 12H54v14a6 6 0 0 1-12 0V54H28a6 6 0 0 1 0-12h14V28a6 6 0 0 1 6-6Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Zm0-12c19.882 0 36-16.118 36-36S67.882 12 48 12 12 28.118 12 48s16.118 36 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Zl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M44.017 33.972c-.013.034-.017.045-.017.028a6 6 0 0 1-12 0c0-7.69 6.996-14 16-14s16 6.31 16 14c0 3.485-.992 6.44-2.891 8.795-1.774 2.2-3.981 3.413-5.456 4.14-.408.201-1.003.477-1.437.678l-.47.22-.037.017A6 6 0 0 1 42 46c.001-3.848 2.19-6.284 4.162-7.642.872-.6 1.769-1.046 2.421-1.358.398-.19.665-.312.9-.42.28-.127.513-.234.865-.408 1.025-.505 1.318-.782 1.42-.909a.612.612 0 0 0 .107-.213c.046-.138.126-.458.126-1.05 0 .017-.004.006-.017-.028C51.885 33.703 51.258 32 48 32s-3.884 1.703-3.983 1.972Zm8.947 14.272c-.007.005-.007.005 0 0Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M54 62a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 88c26.51 0 48-19.7 48-44S74.51 0 48 0 0 19.7 0 44c0 12.22 5.435 23.278 14.21 31.25 1.108 1.007 1.79 2.414 1.79 3.912v10.87c0 3.688 3.854 6.106 7.174 4.503l13.846-6.687a5.27 5.27 0 0 1 3.085-.44c2.569.39 5.206.592 7.895.592Zm36-44c0 16.712-15.114 32-36 32a40.63 40.63 0 0 1-6.095-.457c-3.246-.492-6.794-.099-10.103 1.5l-3.804 1.836c-.084-5.078-2.413-9.507-5.718-12.51C15.769 60.453 12 52.53 12 44c0-16.712 15.113-32 36-32 20.886 0 36 15.288 36 32Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Ll=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",null,t.createElement("path",{fill:"currentColor",d:"M42.951 33.266C42.486 33.672 42 34.396 42 36a6 6 0 0 1-12 0c0-4.395 1.514-8.673 5.049-11.765C38.479 21.233 43.066 20 48 20c4.934 0 9.521 1.233 12.951 4.235C64.486 27.326 66 31.605 66 36c0 4.089-1.055 7.432-3.112 10.117-1.913 2.498-4.359 3.937-5.865 4.816-1.831 1.068-2.369 1.391-2.74 1.793a.13.13 0 0 1-.009.009C54.22 52.783 54 52.976 54 54a6 6 0 0 1-12 0c0-3.9 1.247-7.009 3.466-9.413 1.688-1.829 3.846-3.065 5.115-3.792.144-.082.277-.158.396-.228 1.494-.871 2.048-1.306 2.385-1.747.193-.252.638-.909.638-2.82 0-1.605-.486-2.327-.951-2.734C52.479 32.766 51.066 32 48 32c-3.066 0-4.479.767-5.049 1.266ZM48 76a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Zm0-12c19.882 0 36-16.118 36-36S67.882 12 48 12 12 28.118 12 48s16.118 36 36 36Z",clipRule:"evenodd"}))),Gl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"m88.243 43.757-34-34a6 6 0 1 0-8.486 8.486L69.516 42H12a6 6 0 1 0 0 12h57.515L45.757 77.757a6 6 0 0 0 8.486 8.486l33.985-33.986.015-.014a6 6 0 0 0 0-8.486Z"})),Tl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M70.243 43.757a6 6 0 0 1 0 8.486l-30 30a6 6 0 1 1-8.486-8.486L57.515 48 31.757 22.243a6 6 0 1 1 8.486-8.486l30 30Z",clipRule:"evenodd"})),Bl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M26.22 35.09C26.22 15.93 41.752.4 60.91.4c3.183 0 6.275.43 9.216 1.24 7.392 2.032 7.938 10.632 3.718 14.853L61.8 28.536v5.663h5.663l12.043-12.042c4.22-4.221 12.82-3.675 14.854 3.716a34.723 34.723 0 0 1 1.24 9.217c0 19.159-15.531 34.69-34.69 34.69-2.969 0-5.857-.375-8.618-1.08L30.568 90.423c-6.902 6.901-18.09 6.901-24.992 0-6.901-6.901-6.901-18.09 0-24.992l21.725-21.724a34.745 34.745 0 0 1-1.08-8.618Zm27.925 31.756a.09.09 0 0 0 .003-.003L51.005 63.7l3.143 3.143-.003.003ZM60.91 12.4c-12.531 0-22.69 10.159-22.69 22.69 0 2.611.439 5.107 1.242 7.426 1 2.891.109 5.892-1.82 7.82l-23.58 23.582a5.672 5.672 0 0 0 8.02 8.02l23.581-23.58c1.929-1.929 4.93-2.82 7.821-1.82a22.65 22.65 0 0 0 7.426 1.242c12.531 0 22.69-10.159 22.69-22.69v-.056l-8.47 8.47a9.2 9.2 0 0 1-6.506 2.695H59a9.2 9.2 0 0 1-9.2-9.2v-9.623a9.2 9.2 0 0 1 2.695-6.505l8.47-8.47-.056-.001Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),Ol=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M36.16 1.797c3.055 1.83 5.04 5.222 5.04 9.049v16.875l6.8 4.387 6.8-4.387V10.846c0-3.827 1.985-7.218 5.04-9.049 3.184-1.907 7.414-2 10.877.587C79.982 9.302 86 20.373 86 32.848c0 15.437-9.204 28.712-22.4 34.659V89.6a6 6 0 0 1-12 0V66.907c0-4.841 3.139-8.606 6.876-10.254C67.63 52.617 74 43.47 74 32.848a25.9 25.9 0 0 0-7.2-17.96v13.487a10.8 10.8 0 0 1-4.945 9.075l-8 5.161a10.8 10.8 0 0 1-11.71 0l-8-5.16a10.8 10.8 0 0 1-4.945-9.076V14.887A25.9 25.9 0 0 0 22 32.848c0 10.19 5.86 19.021 14.422 23.288 3.504 1.746 6.378 5.407 6.378 10.028V89.6a6 6 0 0 1-12 0V66.74C18.469 60.472 10 47.654 10 32.848c0-12.475 6.018-23.546 15.283-30.464C28.746-.202 32.976-.11 36.16 1.797Z",clipRule:"evenodd"})),Hl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M54 6a6 6 0 0 0-12 0v8a6 6 0 0 0 12 0V6Zm0 76a6 6 0 0 0-12 0v8a6 6 0 0 0 12 0v-8Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M28 48c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20Zm20-8a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z",clipRule:"evenodd"}),t.createElement("path",{fill:"currentColor",d:"M81.941 14.059a6 6 0 0 1 0 8.485l-5.657 5.657a6 6 0 1 1-8.485-8.485l5.657-5.657a6 6 0 0 1 8.485 0Zm-53.74 53.74a6 6 0 0 1 0 8.485l-5.657 5.657a6 6 0 1 1-8.485-8.485l5.657-5.657a6 6 0 0 1 8.485 0ZM90 54a6 6 0 0 0 0-12h-8a6 6 0 0 0 0 12h8Zm-76 0a6 6 0 0 0 0-12H6a6 6 0 0 0 0 12h8Zm67.941 27.941a6 6 0 0 1-8.485 0l-5.657-5.657a6 6 0 1 1 8.485-8.485l5.657 5.657a6 6 0 0 1 0 8.485Zm-53.74-53.74a6 6 0 0 1-8.485 0l-5.657-5.657a6 6 0 1 1 8.485-8.485l5.657 5.657a6 6 0 0 1 0 8.485Z"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),$t=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"m43.757 7.757-34 34a6 6 0 0 0 8.486 8.486L42 26.485V84a6 6 0 0 0 12 0V26.485l23.757 23.758a6 6 0 0 0 8.486-8.486L52.257 7.772l-.014-.015a6 6 0 0 0-8.486 0Z"})),Al=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M43.757 25.757a6 6 0 0 1 8.486 0l30 30a6 6 0 1 1-8.486 8.486L48 38.485 22.243 64.243a6 6 0 1 1-8.486-8.486l30-30Z",clipRule:"evenodd"})),Fl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("g",{clipPath:"url(#a)"},t.createElement("path",{fill:"currentColor",d:"M54 68V42.485l6.757 6.758a6 6 0 1 0 8.486-8.486l-17-17a6.002 6.002 0 0 0-8.491.006L26.757 40.757a6 6 0 1 0 8.486 8.486L42 42.485V68a6 6 0 0 0 12 0Z"}),t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M96 48c0 26.51-21.49 48-48 48S0 74.51 0 48 21.49 0 48 0s48 21.49 48 48Zm-12 0c0 19.882-16.118 36-36 36S12 67.882 12 48s16.118-36 36-36 36 16.118 36 36Z",clipRule:"evenodd"})),t.createElement("defs",null,t.createElement("clipPath",{id:"a"},t.createElement("rect",{width:96,height:96,fill:"#fff"})))),wt=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",d:"M24 12a6 6 0 0 0 0 12h39.515L13.757 73.757a6 6 0 1 0 8.486 8.486L72 32.485V72a6 6 0 0 0 12 0V19c0-.175-.006-.349-.02-.52a5.986 5.986 0 0 0-1.737-4.723 5.987 5.987 0 0 0-4.722-1.738A7.065 7.065 0 0 0 77 12H24Z"})),jl=({title:e,titleId:r,...l})=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 96 96",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":r,...l},e?t.createElement("title",{id:r},e):null,t.createElement("path",{fill:"currentColor",fillRule:"evenodd",d:"M18 8C8.059 8 0 16.059 0 26v44c0 9.941 8.059 18 18 18h60c9.941 0 18-8.059 18-18V26c0-9.941-8.059-18-18-18H18Zm66 24v-6a6 6 0 0 0-6-6H18a6 6 0 0 0-6 6v44a6 6 0 0 0 6 6h60a6 6 0 0 0 6-6v-6h-8c-8.837 0-16-7.163-16-16s7.163-16 16-16h8Zm0 20h-8a4 4 0 0 1 0-8h8v8Z",clipRule:"evenodd"})),In=d.default.div(()=>o.css`
    position: relative;
  `),Yn=d.default.div(({theme:e,$disabled:r,$size:l})=>o.css`
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

    ${()=>{switch(l){case"small":return o.css`
            height: ${e.space[16]};
            width: ${e.space[16]};
          `;case"large":return o.css`
            font-size: ${e.fontSizes.extraLarge};
            line-height: ${e.lineHeights.extraLarge};
            margin-top: -${e.space["0.5"]};
            height: ${e.space[24]};
            width: ${e.space[24]};
          `;default:return""}}}
  `),Un=d.default.div(({theme:e,$disabled:r,$size:l,$color:n})=>o.css`
    stroke: ${e.colors.accent};

    color: ${e.colors[n]};

    ${r&&o.css`
      color: ${e.colors.greyLight};
    `}

    ${()=>{switch(l){case"small":return o.css`
            height: ${e.space[16]};
            width: ${e.space[16]};
            stroke-width: ${e.space[1]};
          `;case"large":return o.css`
            height: ${e.space[24]};
            width: ${e.space[24]};
            stroke-width: ${e.space[1]};
          `;default:return""}}}
  `),qn=d.default.circle(({$finished:e})=>o.css`
    transition: all 1s linear, stroke-width 0.2s ease-in-out 1s;

    ${e&&o.css`
      stroke-width: 0;
    `}
  `),vt=t.forwardRef(({accessibilityLabel:e,color:r="textSecondary",size:l="small",countdownSeconds:n,startTimestamp:c,disabled:a,callback:i,...u},s)=>{const p=t.useMemo(()=>Math.ceil((c||Date.now())/1e3),[c]),b=t.useMemo(()=>p+n,[p,n]),g=t.useCallback(()=>Math.max(b-Math.ceil(Date.now()/1e3),0),[b]),[f,v]=t.useState(n);return t.useEffect(()=>{if(!a){v(g());const E=setInterval(()=>{const h=g();h===0&&(clearInterval(E),i&&i()),v(h)},1e3);return()=>clearInterval(E)}},[g,i,n,a]),t.createElement(In,{...u,"data-testid":ce(u,"countdown-circle")},t.createElement(Yn,{$size:l,$disabled:a},a&&n,!a&&(f>0?f:t.createElement(Te,{"data-testid":"countdown-complete-check",id:"countdown-complete-check"}))),t.createElement(Un,{$color:r,$disabled:a,$size:l,ref:s},e&&t.createElement(ge,null,e),t.createElement("svg",{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},t.createElement(qn,{$finished:f===0,cx:"12",cy:"12",fill:"none",r:"9",strokeDasharray:`${48*(f/n)}, 56`,strokeLinecap:"round"}),t.createElement("circle",{cx:"12",cy:"12",fill:"none",opacity:a?"1":"0.25",r:"9",strokeLinecap:"round"}))))});vt.displayName="CountdownCircle";const rr={extraSmall:{width:"22.5",height:"7"},small:{width:"26",height:"10"},medium:{width:"32",height:"12"}},ae={extraSmall:{width:"10",height:"5.5",translateX:"5"},small:{width:"12",height:"8",translateX:"6"},medium:{width:"15",height:"10",translateX:"7.5"}},Xn=d.default.div(({theme:e,$size:r})=>o.css`
    position: relative;
    width: fit-content;

    label {
      position: absolute;
      left: 50%;
      top: 50%;
      width: ${e.space[ae[r].width]};
      height: ${e.space[ae[r].height]};
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
  `),Kn=d.default.input(({theme:e,$size:r="medium"})=>o.css`
    position: relative;
    background-color: ${e.colors.greySurface};
    height: ${e.space[rr[r].height]};
    width: ${e.space[rr[r].width]};
    border-radius: ${r==="extraSmall"?e.radii.full:e.radii.large};

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
      border-radius: ${r==="extraSmall"?e.radii.full:e.space["1.5"]};
      transform: translateX(-${e.space[ae[r].translateX]});
      transition: transform 0.3s ease-in-out, background-color 0.1s ease-in-out;
    }

    &:checked::after {
      transform: translateX(${e.space[ae[r].translateX]});
    }

    &:disabled::after {
      background-color: ${e.colors.greyPrimary};
    }
  `),yt=t.forwardRef(({size:e="medium",disabled:r,fiat:l="usd",...n},c)=>{const a=it();return t.createElement(Xn,{$size:e},t.createElement(Kn,{disabled:r,id:a,ref:c,type:"checkbox",...n,$size:e}),t.createElement("label",{htmlFor:a,id:"eth"},"ETH"),t.createElement("label",{htmlFor:a,id:"fiat"},l.toLocaleUpperCase()))});yt.displayName="CurrencyToggle";const lr=d.default.div(({theme:e,$shortThrow:r,$direction:l,$state:n})=>o.css`
  padding: ${e.space["1.5"]};
  width: 100%;

  ${l==="up"&&o.css`
      bottom: 100%;
    `}

  z-index: 0;
  opacity: 0;

  ${n==="entered"&&o.css`
      z-index: 1;
    `}

  background-color: ${e.colors.background};
  border-radius: ${e.radii["2xLarge"]};

  border: 1px solid ${e.colors.border};
  transition: all 0.35s cubic-bezier(1, 0, 0.22, 1.6);
  margin-${l==="down"?"top":"bottom"}: ${e.space["1.5"]};

  transform: translateY(calc(${l==="down"?"-1":"1"} * ${e.space[12]}));

  ${r&&o.css`
      transform: translateY(
        calc(${l==="down"?"-1":"1"} * ${e.space["2.5"]})
      );
    `}

  ${(n==="entering"||n==="entered")&&o.css`
      transform: translateY(0);
      opacity: 1;
    `}
`),Dl=({theme:e,$labelAlign:r})=>o.css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${e.space[1]};
  width: 100%;

  ${r&&o.css`
    & > * {
      justify-content: ${r};
    }
  `}
`,Qn=d.default.div(Dl),Jn=d.default(ut)(Dl,({theme:e})=>o.css`
    padding-right: ${e.space[1]};
  `),or=d.default.button(({theme:e,$color:r,disabled:l,$showIndicator:n})=>o.css`
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

    color: ${e.colors[r||"textPrimary"]};

    svg {
      min-width: ${e.space[4]};
      width: ${e.space[4]};
      height: ${e.space[4]};
      color: ${e.colors[r||"text"]};
    }
    ${l&&o.css`
      color: ${e.colors.textTertiary};
      cursor: not-allowed;
    `}

    justify-content: flex-start;

    &:hover {
      background: ${e.colors.greySurface};
    }

    ${n&&o.css`
      position: relative;
      padding-right: ${e.space[6]};
      &::after {
        position: absolute;
        content: '';
        top: 50%;
        right: ${e.space[3]};
        transform: translateY(-50%);
        width: ${e.space[2]};
        height: ${e.space[2]};
        border-radius: ${e.radii.full};
        background: ${e.colors[typeof n=="boolean"?"accent":n]};
      }
    `}
  `),ea=({setIsOpen:e,item:r})=>{const l=t.useRef(null),n=t.cloneElement(r,{...r.props,ref:l}),c=t.useCallback(()=>{e(!1)},[e]);return t.useEffect(()=>{const a=l.current;return a==null||a.addEventListener("click",c),()=>{a==null||a.removeEventListener("click",c)}},[c,r]),n},ta=t.forwardRef(({items:e,setIsOpen:r,shortThrow:l,labelAlign:n,direction:c,state:a,height:i,...u},s)=>{const p=e.map(g=>{if(t.isValidElement(g))return ea({item:g,setIsOpen:r});const{color:f,value:v,icon:E,label:h,onClick:x,disabled:R,as:w,wrapper:C,showIndicator:m}=g,$={$hasColor:!!f,$color:f,$showIndicator:m,disabled:R,onClick:()=>{r(!1),x==null||x(v)},as:w,children:t.createElement(t.Fragment,null,E,h)};return C?C(t.createElement(or,{...$,type:"button"}),v||h):t.createElement(or,{...$,key:v||h,type:"button"})}),b=t.useMemo(()=>({$shortThrow:l,$direction:c,$state:a,...u,"data-testid":"dropdown-menu",ref:s}),[l,c,a,u,s]);return i?t.createElement(lr,{...b},t.createElement(Jn,{$labelAlign:n,style:{height:i}},p)):t.createElement(lr,{...b},t.createElement(Qn,{$labelAlign:n},p))}),ra=d.default(e=>t.createElement(Ye,{...e}))(({theme:e,$open:r,$direction:l})=>o.css`
    margin-left: ${e.space[1]};
    width: ${e.space[3]};
    margin-right: ${e.space["0.5"]};
    transition-duration: ${e.transitionDuration[200]};
    transition-property: all;
    transition-timing-function: ${e.transitionTimingFunction.inOut};
    transform: rotate(${l==="down"?"0deg":"180deg"});
    display: flex;

    & > svg {
      fill: currentColor;
    }
    fill: currentColor;

    ${r&&o.css`
      transform: rotate(${l==="down"?"180deg":"0deg"});
    `}
  `),qe=({children:e,buttonProps:r,items:l=[],chevron:n=!0,align:c="left",menuLabelAlign:a,width:i=150,mobileWidth:u=i,shortThrow:s=!1,keepMenuOnTop:p=!1,label:b,direction:g="down",isOpen:f,setIsOpen:v,indicatorColor:E,...h})=>{const x=t.useRef(),R=t.useRef(null),w=t.useState(!1),{colors:C}=o.useTheme(),m=t.useMemo(()=>l.some(S=>"showIndicator"in S&&S.showIndicator),[l]),[$,Z]=v?[f,v]:w,H=t.useMemo(()=>({...r,"data-indicator":m&&!$,style:{...r==null?void 0:r.style,"--indicator-color":E?C[E]:C.accent},className:`${r==null?void 0:r.className} indicator-container`}),[r,m,E,C,$]);t.useEffect(()=>{const S=L=>{var j,B;!((j=x.current)!=null&&j.contains(L.target))&&!((B=R.current)!=null&&B.contains(L.target))&&Z(!1)};return $?document.addEventListener("mousedown",S):document.removeEventListener("mousedown",S),()=>{document.removeEventListener("mousedown",S)}},[x,$,Z]);const T=e?t.Children.map(e,S=>t.isValidElement(S)?t.cloneElement(S,{...H,zindex:"10",pressed:$?"true":void 0,onClick:()=>Z(L=>!L),ref:R}):null):t.createElement(ze,{"data-testid":"dropdown-btn",pressed:$,ref:R,suffix:n&&t.createElement(ra,{$direction:g,$open:$}),width:"fit",onClick:()=>Z(S=>!S),...H},b);return t.createElement(t.Fragment,null,T,t.createElement(Ze,{additionalGap:-10,align:c==="left"?"start":"end",anchorRef:R,hideOverflow:!p,isOpen:$,mobilePlacement:g==="down"?"bottom":"top",mobileWidth:u,placement:g==="down"?"bottom":"top",popover:t.createElement(ta,{direction:g,items:l,labelAlign:a,setIsOpen:Z,shortThrow:s,...h,ref:x}),width:i}))};qe.displayName="Dropdown";const la=d.default.fieldset(({theme:e})=>o.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[4]};
  `),oa=d.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[1]};
    padding: 0 ${e.space[4]};
  `),na=d.default.div(({theme:e})=>o.css`
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: ${e.space[3]};
  `),aa=d.default.div(({theme:e})=>o.css`
    color: ${e.colors.textSecondary};
    font-size: ${e.fontSizes.body};
    line-height: ${e.lineHeights.body};
  `),ca=d.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[4]};
  `),Et=({children:e,description:r,disabled:l,form:n,legend:c,name:a,status:i,...u})=>{let s,p;switch(i){case"complete":{s="Complete",p="green";break}case"required":case"pending":{s=i==="pending"?"Pending":"Required",p="accent";break}case"optional":{s="Optional",p="grey";break}}return typeof i=="object"&&(s=i.name,p=i.tone),t.createElement(la,{...u,disabled:l,form:n,name:a},t.createElement(oa,null,t.createElement(na,null,t.createElement(_e,{as:"legend",level:"2",responsive:!0},c),p&&s&&t.createElement(Ie,{color:p},s)),t.createElement(aa,null,r)),t.createElement(ca,null,e))};Et.displayName="FieldSet";const ia=d.default.div(({theme:e,$type:r,$alignment:l})=>o.css`
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

    ${l==="horizontal"&&o.css`
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
  `),sa=d.default.div(({theme:e,$type:r})=>o.css`
    width: ${e.space[6]};
    height: ${e.space[6]};

    color: ${e.colors.blue};

    ${r==="warning"&&o.css`
      color: ${e.colors.yellow};
    `}
    ${r==="error"&&o.css`
      color: ${e.colors.red};
    `}
  `),xt=({type:e="info",alignment:r="vertical",children:l,...n})=>{const c=e==="info"?ht:Ge;return t.createElement(ia,{$alignment:r,$type:e,...n},t.createElement(sa,{$type:e,as:c}),l)};xt.displayName="Helper";const da=(e,r)=>{var a,i;const l=(a=Object.getOwnPropertyDescriptor(e,"value"))==null?void 0:a.set,n=Object.getPrototypeOf(e),c=(i=Object.getOwnPropertyDescriptor(n,"value"))==null?void 0:i.set;if(c&&l!==c)c.call(e,r);else if(l)l.call(e,r);else throw new Error("The given element does not have a value setter")},ue={small:{outerPadding:"3.5",gap:"2",icon:"3",iconPadding:"8.5",height:"10"},medium:{outerPadding:"4",gap:"2",icon:"4",iconPadding:"10",height:"12"},large:{outerPadding:"4",gap:"2",icon:"5",iconPadding:"11",height:"16"},extraLarge:{outerPadding:"6",gap:"2",icon:"6",iconPadding:"14",height:"20"}},Q=(e,r,l)=>e.space[ue[r][l]],rt=(e,r,l,n)=>l?n?`calc(-${e.space[ue[r].outerPadding]} - ${e.space[l]} - ${e.space[ue[r].gap]})`:`calc(${e.space[ue[r].outerPadding]} + ${e.space[l]} + ${e.space[ue[r].gap]})`:n?`-${e.space[ue[r].iconPadding]}`:e.space[ue[r].iconPadding],ua={small:"large",medium:"large",large:"2.5xLarge",extraLarge:"2.5xLarge"},pa=(e,r)=>e.radii[ua[r]],fa={small:"small",medium:"body",large:"large",extraLarge:"headingThree"},De=e=>fa[e],ga=d.default.div(({theme:e,$size:r,$hasError:l,$userStyles:n,$validated:c,$showDot:a})=>o.css`
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

    ${a&&c&&o.css`
      :after {
        background: ${e.colors.greenPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${a&&!l&&o.css`
      &:focus-within:after {
        background: ${e.colors.bluePrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${l&&a&&o.css`
      :after {
        background: ${e.colors.redPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

  ${n}
  `),Nl=d.default.label(({theme:e,$size:r})=>o.css`
    display: flex;
    align-items: center;
    gap: ${e.space[2]};

    height: ${e.space.full};
    color: ${e.colors.greyPrimary};
    background: ${e.colors.greySurface};
    font-size: ${Pe(De(r))};
    line-height: ${Ve(De(r))};
    font-weight: ${e.fontWeights.normal};
    padding: 0 ${Q(e,r,"outerPadding")};

    svg {
      display: block;
      color: ${e.colors.greyPrimary};
    }
  `),ma=d.default(Nl)(()=>o.css`
    order: -2;
  `),ba=d.default.div(({theme:e,$size:r,$iconWidth:l})=>o.css`
    order: -1;
    padding-left: ${Q(e,r,"outerPadding")};
    flex: 0 0 ${rt(e,r,l)};
    margin-right: ${rt(e,r,l,!0)};
    display: flex;
    align-items: center;
    justify-content: flex-start;
    pointer-events: none;
    svg {
      display: block;
      width: ${l?e.space[l]:Q(e,r,"icon")};
      height: ${l?e.space[l]:Q(e,r,"icon")};
      color: ${e.colors.greyPrimary};
    }
    z-index: 1;
  `),ha=d.default.button(({theme:e,$size:r})=>o.css`
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
  `),$a=d.default.input(({theme:e,$size:r,$hasIcon:l,$hasAction:n,$hasError:c,$iconWidth:a})=>o.css`
    background-color: transparent;
    position: relative;
    width: ${e.space.full};
    height: ${e.space.full};
    font-weight: ${e.fontWeights.normal};
    text-overflow: ellipsis;
    color: ${e.colors.textPrimary};
    padding: 0 ${Q(e,r,"outerPadding")};
    font-size: ${Pe(De(r))};
    line-height: ${Ve(De(r))};

    ${l&&o.css`
      padding-left: ${rt(e,r,a)};
    `}

    ${n&&o.css`
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

    ${c&&o.css`
      color: ${e.colors.redPrimary};
    `}
  `),wa=d.default.div(({theme:e,$size:r,$hasError:l,$disabled:n,$readOnly:c,$alwaysShowAction:a})=>o.css`
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

    ${n&&o.css`
      border-color: ${e.colors.border};
      background-color: ${e.colors.greyLight};
    `}

    ${l&&o.css`
      border-color: ${e.colors.redPrimary};
      cursor: default;
    `}

    ${!l&&!c&&o.css`
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

    ${!a&&o.css`
      input:placeholder-shown ~ button {
        opacity: 0;
        transform: scale(0.8);
        pointer-events: none;
      }
    `}
  `),Ct=t.forwardRef(({autoFocus:e,autoComplete:r="off",autoCorrect:l,defaultValue:n,description:c,disabled:a,error:i,validated:u,showDot:s,hideLabel:p,id:b,inputMode:g,icon:f,iconWidth:v,actionIcon:E,alwaysShowAction:h=!1,label:x,labelSecondary:R,name:w="clear-button",placeholder:C,prefix:m,prefixAs:$,readOnly:Z,required:H,spellCheck:T,suffix:S,suffixAs:L,clearable:j=!1,tabIndex:B,type:M="text",units:A,value:O,width:P,onBlur:V,onChange:F,onFocus:te,onClickAction:ee,size:_="medium",parentStyles:I,...Y},z)=>{const re=t.useRef(null),X=z||re,oe=C?`${C!=null?C:""}${A?` ${A}`:""}`:void 0,ie=i?!0:void 0,me=M==="email"?"text":M,be=j||!!ee,se=W=>{var U;if(W.preventDefault(),W.stopPropagation(),ee)return ee(),(U=X.current)==null?void 0:U.focus();X.current&&(da(X.current,""),X.current.dispatchEvent(new Event("input",{bubbles:!0})),X.current.focus())};return t.createElement(le,{description:c,disabled:a,error:i,hideLabel:p,id:b,label:x,labelSecondary:R,readOnly:Z,required:H,width:P},W=>t.createElement(ga,{$disabled:a,$hasError:ie,$validated:u,$showDot:s,$suffix:S!==void 0,$size:_,$userStyles:I,$ids:W},t.createElement(wa,{$alwaysShowAction:h,$disabled:!!a,$hasError:!!i,$readOnly:!!Z,$size:_},t.createElement($a,{ref:X,...Y,...W==null?void 0:W.content,"aria-invalid":ie,$hasAction:be,$hasError:!!i,$hasIcon:!!f,$iconWidth:v,$size:_,autoComplete:r,autoCorrect:l,autoFocus:e,defaultValue:n,disabled:a,inputMode:g,name:w,placeholder:oe,readOnly:Z,spellCheck:T,tabIndex:B,type:me,value:O,onBlur:V,onChange:F,onFocus:te}),m&&t.createElement(ma,{"aria-hidden":"true",as:$,...W==null?void 0:W.label,$size:_},m),f&&t.createElement(ba,{$iconWidth:v,$size:_},f),be&&t.createElement(ha,{$size:_,"data-testid":"input-action-button",onClick:se,onMouseDown:U=>U.preventDefault()},E||t.createElement(Be,null)),S&&t.createElement(Nl,{$size:_,"aria-hidden":"true",...W==null?void 0:W.label,...L?{as:L}:{}},S))))});Ct.displayName="Input";const va=d.default.div(({theme:e,$state:r,$alignTop:l})=>o.css`
    width: 100%;

    position: fixed;
    left: 0;
    z-index: 9999;

    ${l?o.css`
          top: 0;
        `:o.css`
          bottom: 0;
        `}

    display: flex;
    flex-direction: row;

    ${J.sm.min(o.css`
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
          transform: translateY(${l?"-":""}128px);
        `}
  `),Oe=({children:e,backdropSurface:r,onDismiss:l,open:n,alignTop:c,renderCallback:a,...i})=>t.createElement(Le,{open:n,renderCallback:a,surface:r,onDismiss:l},({state:u})=>t.createElement(va,{$alignTop:c,$state:u,...i},e));Oe.displayName="Modal";const ya=d.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${e.space[2]};
    flex-gap: ${e.space[2]};
  `),Ea=d.default.button(({theme:e,$selected:r,$size:l})=>o.css`
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

    ${l==="small"&&o.css`
      font-size: ${e.fontSizes.small};
      line-height: ${e.lineHeights.small};
      border-radius: ${e.space[2]};
      min-width: ${e.space[9]};
      height: ${e.space[9]};
    `}
  `),xa=d.default.p(({theme:e})=>o.css`
    font-size: ${e.fontSizes.small};
    font-weight: ${e.fontWeights.bold};
    color: ${e.colors.greyPrimary};
  `),zl=({total:e,current:r,max:l=5,size:n="medium",alwaysShowFirst:c,alwaysShowLast:a,showEllipsis:i=!0,onChange:u,...s})=>{const p=Math.floor(l/2),b=Math.max(Math.min(Math.max(r-p,1),e-l+1),1),g=Array.from({length:l},(f,v)=>b+v).filter(f=>f<=e);return e>l&&(c&&b>1?i?(g[0]=-1,g.unshift(1)):g[0]=1:i&&b>1&&g.unshift(-1),a&&e>r+p?i?(g[g.length-1]=-1,g.push(e)):g[g.length-1]=e:i&&e>r+p&&g.push(-1)),t.createElement(ya,{...s,"data-testid":ce(s,"pagebuttons")},g.map((f,v)=>f===-1?t.createElement(xa,{"data-testid":"pagebutton-dots",key:`${f}-${v}`},"..."):t.createElement(Ea,{$selected:f===r,$size:n,"data-testid":"pagebutton",key:f,type:"button",onClick:()=>u(f)},f)))},Wl=(e,r)=>r==="small"?e[10]:r==="medium"?e[45]:e[80],nr=d.default.div(({theme:e,$size:r,$hasDropdown:l,$open:n})=>o.css`
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

    ${l&&o.css`
      cursor: pointer;
      &:hover {
        transform: translateY(-1px);
        filter: brightness(1.05);
      }
    `}

    ${n&&o.css`
      background-color: ${e.colors.border};
    `}

    width: ${Wl(e.space,r)};

    ${r==="small"&&o.css`
      height: ${e.space[10]};
      padding: 0;
      border: none;
    `}

    ${r==="medium"&&o.css`
      height: ${e.space[12]};
      padding-right: ${e.space[4]};
    `}

    ${r==="large"&&o.css`
      width: fit-content;
      height: ${e.space[14]};
      max-width: ${e.space[80]};
      padding-right: ${e.space[5]};
    `}
  `),Ca=d.default.div(({theme:e,$size:r})=>o.css`
    width: ${e.space[10]};
    flex: 0 0 ${e.space[10]};
    ${r==="large"&&o.css`
      width: ${e.space[12]};
      flex: 0 0 ${e.space[12]};
    `}
  `),ka=d.default.div(({theme:e,$size:r})=>o.css`
    display: ${r==="small"?"none":"block"};
    min-width: ${e.space.none};
  `),Sa=d.default(D)(()=>o.css`
    line-height: initial;
  `),ar=({size:e,avatar:r,address:l,ensName:n})=>t.createElement(t.Fragment,null,t.createElement(Ca,{$size:e},t.createElement(Ne,{label:"profile-avatar",...typeof r=="string"?{src:r}:r||{}})),t.createElement(ka,{$size:e},t.createElement(Sa,{color:"text","data-testid":"profile-title",ellipsis:!0,fontVariant:e==="large"?"headingFour":"bodyBold",forwardedAs:"h3"},n||Fn(l,e==="large"?30:10,e==="large"?10:5,e==="large"?10:5)))),kt=({size:e="medium",avatar:r,dropdownItems:l,address:n,ensName:c,alignDropdown:a="left",indicatorColor:i,...u})=>{const{space:s}=o.useTheme(),[p,b]=t.useState(!1);return l?t.createElement(qe,{width:Wl(s,e),indicatorColor:i,items:l,isOpen:p,setIsOpen:b,align:a},t.createElement(nr,{...u,$hasDropdown:!0,$open:p,$size:e,onClick:()=>b(!p)},t.createElement(ar,{size:e,avatar:r,address:n,ensName:c}))):t.createElement(nr,{...u,"data-testid":ce(u,"profile"),$open:p,$size:e},t.createElement(ar,{size:e,avatar:r,address:n,ensName:c}))};kt.displayName="Profile";const Ra=d.default.input(({theme:e,$colorStyle:r})=>o.css`
    cursor: pointer;
    font: inherit;
    border-radius: 50%;
    display: grid;
    place-content: center;
    transition: transform 150ms ease-in-out;
    width: ${e.space[5]};
    flex: 0 0 ${e.space[5]};
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
      background: ${N(r,"background")};
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
      background: ${N(r,"hover")};
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
  `),St=t.forwardRef(({description:e,disabled:r,error:l,inline:n=!0,hideLabel:c,id:a,label:i,labelSecondary:u,name:s,required:p,tabIndex:b,value:g,checked:f,width:v,colorStyle:E="accentPrimary",onBlur:h,onChange:x,onFocus:R,...w},C)=>{const m=t.useRef(null),$=C||m;return t.createElement(le,{description:e,error:l,hideLabel:c,id:a,inline:n,label:i,labelSecondary:u,required:p,width:v,disabled:r},t.createElement(Ra,{$colorStyle:E,...w,"aria-invalid":l?!0:void 0,"aria-selected":f?!0:void 0,"data-testid":ce(w,"radio"),type:"radio",role:"radio",checked:f,disabled:r,name:s,ref:$,tabIndex:b,value:g,onBlur:h,onChange:x,onFocus:R}))});St.displayName="RadioButton";const _l=e=>{let r=!1,l=!1;const n=()=>{r=!0,e.preventDefault()},c=()=>{l=!0,e.stopPropagation()};return{nativeEvent:e,currentTarget:e.currentTarget,target:e.target,bubbles:e.bubbles,cancelable:e.cancelable,defaultPrevented:e.defaultPrevented,eventPhase:e.eventPhase,isTrusted:e.isTrusted,preventDefault:n,isDefaultPrevented:()=>r,stopPropagation:c,isPropagationStopped:()=>l,persist:()=>{},timeStamp:e.timeStamp,type:e.type}},Pa=d.default.div(({theme:e,$inline:r})=>o.css`
    display: flex;
    flex-direction: ${r?"row":"column"};
    gap: ${e.space[2]};
    justify-content: flex-start;
    flex-wrap: ${r?"wrap":"nowrap"};
  `),Rt=t.forwardRef(({value:e,children:r,inline:l=!1,onChange:n,onBlur:c,...a},i)=>{const u=t.useRef(null),s=i||u,p=t.useRef(null),[b,g]=t.useState(!1),[f,v]=t.useState(e);t.useEffect(()=>{e&&e!=f&&v(e)},[e]);const E=w=>{v(w.target.value),n&&n(w)},h=()=>{p.current&&p.current.focus()},x=w=>{c&&c(w)},R=(w,C="radiogroup")=>{if(n&&w){const m=document.createElement("input");m.value=w,m.name=C;const $=new Event("change",{bubbles:!0});Object.defineProperty($,"target",{writable:!1,value:m});const Z=_l($);n(Z)}};return t.createElement(Pa,{$inline:l,...a,"data-testid":ce(a,"radiogroup"),ref:s,role:"radiogroup",onFocus:h},t.Children.map(r,w=>{w.props.checked&&!b&&(g(!0),f!==w.props.value&&(v(w.props.value),g(!0),R(w.props.value,w.props.name)));const C=w.props.value===f;return t.cloneElement(w,{ref:C?p:void 0,checked:C,onChange:E,onBlur:x})}))});Rt.displayName="RadioButtonGroup";var Ae=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Va=typeof Ae=="object"&&Ae&&Ae.Object===Object&&Ae,Ma=Va,Za=Ma,La=typeof self=="object"&&self&&self.Object===Object&&self,Ga=Za||La||Function("return this")(),Ta=Ga,Ba=Ta,Oa=Ba.Symbol,Pt=Oa;function Ha(e,r){for(var l=-1,n=e==null?0:e.length,c=Array(n);++l<n;)c[l]=r(e[l],l,e);return c}var Aa=Ha,Fa=Array.isArray,ja=Fa,cr=Pt,Il=Object.prototype,Da=Il.hasOwnProperty,Na=Il.toString,ke=cr?cr.toStringTag:void 0;function za(e){var r=Da.call(e,ke),l=e[ke];try{e[ke]=void 0;var n=!0}catch{}var c=Na.call(e);return n&&(r?e[ke]=l:delete e[ke]),c}var Wa=za,_a=Object.prototype,Ia=_a.toString;function Ya(e){return Ia.call(e)}var Ua=Ya,ir=Pt,qa=Wa,Xa=Ua,Ka="[object Null]",Qa="[object Undefined]",sr=ir?ir.toStringTag:void 0;function Ja(e){return e==null?e===void 0?Qa:Ka:sr&&sr in Object(e)?qa(e):Xa(e)}var ec=Ja;function tc(e){return e!=null&&typeof e=="object"}var rc=tc,lc=ec,oc=rc,nc="[object Symbol]";function ac(e){return typeof e=="symbol"||oc(e)&&lc(e)==nc}var cc=ac,dr=Pt,ic=Aa,sc=ja,dc=cc,uc=1/0,ur=dr?dr.prototype:void 0,pr=ur?ur.toString:void 0;function Yl(e){if(typeof e=="string")return e;if(sc(e))return ic(e,Yl)+"";if(dc(e))return pr?pr.call(e):"";var r=e+"";return r=="0"&&1/e==-uc?"-0":r}var pc=Yl,fc=pc;function gc(e){return e==null?"":fc(e)}var mc=gc,bc=mc,hc=0;function $c(e){var r=++hc;return bc(e)+r}var wc=$c;const et="CREATE_OPTION_VALUE",vc=d.default.div(({theme:e,$size:r,$showDot:l,$hasError:n,$validated:c,$open:a,$disabled:i,$readOnly:u})=>o.css`
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

    ${l&&!i&&c&&!a&&o.css`
      :after {
        background: ${e.colors.greenPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${l&&!i&&!n&&a&&o.css`
      :after {
        background: ${e.colors.bluePrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${n&&!i&&l&&o.css`
      :after {
        background: ${e.colors.redPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${u&&o.css`
      cursor: default;
      pointer-events: none;
    `}
  `),yc=d.default.div(({theme:e,$open:r,$hasError:l,$disabled:n,$size:c,$ids:a})=>o.css`
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

    ${l&&o.css`
      border-color: ${e.colors.redPrimary};
      label {
        color: ${e.colors.redPrimary};
      }
    `}

    ${c==="small"&&o.css`
      padding-left: ${e.space["3.5"]};
    `}

    ${n&&o.css`
      background: ${e.colors.greyLight};
      color: ${e.colors.greyPrimary};
      cursor: not-allowed;
    `}

    input#${a==null?void 0:a.content.id} ~ button#chevron svg {
      color: ${e.colors.textPrimary};
    }

    input#${a==null?void 0:a.content.id}:placeholder-shown ~ button#chevron {
      svg {
        color: ${e.colors.greyPrimary};
      }
    }

    input#${a==null?void 0:a.content.id}:disabled ~ button#chevron {
      svg {
        color: ${e.colors.greyPrimary};
      }
    }

    input#${a==null?void 0:a.content.id}:disabled ~ * {
      color: ${e.colors.greyPrimary};
      background: ${e.colors.greyLight};
      cursor: not-allowed;
    }
  `),Ec=d.default.input(()=>o.css`
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    appearance: none;
    visibility: hidden;
  `),Ul=d.default.div(()=>o.css`
    flex: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  `),xc=d.default(Ul)(({theme:e})=>o.css`
    color: ${e.colors.greyPrimary};
    pointer-events: none;
  `),Cc=d.default.input(({theme:e})=>o.css`
    flex: 1;
    background: transparent;
    padding-right: 0;
    height: 100%;
    color: ${e.colors.textPrimary};

    &::placeholder {
      color: ${e.colors.greyPrimary};
    }
  `),ql=d.default.button(({theme:e,$size:r})=>o.css`
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
  `),kc=d.default(ql)(({theme:e,$open:r,$direction:l})=>o.css`
    display: flex;
    cursor: pointer;

    svg {
      fill: currentColor;
      transform: ${l==="up"?"rotate(180deg)":"rotate(0deg)"};
      transition-duration: ${e.transitionDuration[200]};
      transition-property: all;
      transition-timing-function: ${e.transitionTimingFunction.inOut};
    }
    fill: currentColor;

    ${r&&o.css`
      svg {
        transform: ${l==="up"?"rotate(0deg)":"rotate(180deg)"};
      }
    `}
  `),Sc=d.default.div(({theme:e,$state:r,$direction:l,$rows:n,$size:c,$align:a})=>o.css`
    display: ${r==="exited"?"none":"block"};
    position: absolute;
    visibility: hidden;
    opacity: 0;
    overflow: hidden;

    border: 1px solid ${e.colors.border};
    padding: ${e.space[2]};
    min-width: ${e.space.full};
    ${a==="right"?o.css`
          right: 0;
        `:o.css`
          left: 0;
        `}
    border-radius: ${e.radii["2xLarge"]};
    background: ${e.colors.background};
    transition: all 0.3s cubic-bezier(1, 0, 0.22, 1.6), z-index 0.3s linear;

    font-size: ${e.fontSizes.body};
    line-height: ${e.lineHeights.body};

    ${c==="small"&&o.css`
      font-size: ${e.fontSizes.small};
    `}

    ${r==="entered"?o.css`
          z-index: 20;
          visibility: visible;
          top: ${l==="up"?"auto":`calc(100% + ${e.space[2]})`};
          bottom: ${l==="up"?`calc(100% + ${e.space[2]})`:"auto"};
          opacity: 1;
        `:o.css`
          z-index: 1;
          visibility: hidden;
          top: ${l==="up"?"auto":`calc(100% - ${e.space[12]})`};
          bottom: ${l==="up"?`calc(100% - ${e.space[12]})`:"auto"};
          opacity: 0;
        `}

    ${n&&o.css`
      padding-right: ${e.space[1]};
    `}
  `),Rc=(e,r,l)=>l==="small"?`calc(${e.space[9]} * ${r})`:`calc(${e.space[11]} * ${r})`,Pc=d.default.div(({theme:e,$rows:r,$direction:l,$size:n})=>o.css`
    display: flex;
    flex-direction: ${l==="up"?"column-reverse":"column"};
    align-items: flex-start;
    justify-content: space-between;
    gap: ${e.space[1]};
    overflow-y: ${r?"scroll":"hidden"};
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    ${r&&o.css`
      max-height: ${Rc(e,r,n)};
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
  `),Vc=d.default.button(({theme:e,$selected:r,$highlighted:l,$color:n,$size:c})=>o.css`
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
    font-weight: ${tt("body")};
    line-height: ${Ve("body")};
    text-align: left;

    svg {
      display: block;
      width: ${e.space[4]};
      height: ${e.space[4]};
      color: ${e.colors.textPrimary};
    }

    ${n&&o.css`
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

    ${l&&o.css`
      background-color: ${e.colors.greySurface};
    `}

    ${r&&o.css`
      background-color: ${e.colors.greyLight};
    `}

    ${c==="small"&&o.css`
      height: ${e.space[9]};
      flex: 0 0 ${e.space[9]};
      font-size: ${Pe("small")};
      font-weight: ${tt("small")};
      line-height: ${Ve("small")};
    `}
  `),Mc=d.default.div(({theme:e})=>o.css`
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
  `),Zc=e=>(r,l)=>{if(l.label){const n=l.label.trim().toLowerCase();n.indexOf(e)!==-1&&r.options.push(l),n===e&&(r.exactMatch=!0)}return r};var Xl=(e=>(e.ArrowUp="ArrowUp",e.ArrowDown="ArrowDown",e.Enter="Enter",e))(Xl||{});const Lc=(e,r,l)=>typeof l=="string"?l:(l==null?void 0:l[e])||r,fr=(e,r,l)=>typeof l=="number"?l:(l==null?void 0:l[e])||r,Vt=t.forwardRef(({description:e,disabled:r,autocomplete:l=!1,createable:n=!1,createablePrefix:c="Add ",placeholder:a,direction:i="down",error:u,hideLabel:s,inline:p,id:b,label:g,labelSecondary:f,required:v,tabIndex:E=-1,readOnly:h=!1,width:x,onBlur:R,onChange:w,onFocus:C,onCreate:m,options:$,rows:Z,emptyListMessage:H="No results",name:T,value:S,size:L="medium",padding:j,inputSize:B,align:M,validated:A,showDot:O=!1,...P},V)=>{const F=t.useRef(null),te=V||F,ee=t.useRef(null),_=t.useRef(null),[I,Y]=t.useState(""),[z,re]=t.useState(""),X=n&&z!=="",oe=n||l,[ie]=t.useState(b||wc()),[me,be]=t.useState("");t.useEffect(()=>{S!==me&&S!==void 0&&be(S)},[S]);const se=($==null?void 0:$.find(y=>y.value===me))||null,W=(y,k)=>{if(!(y!=null&&y.disabled)){if((y==null?void 0:y.value)===et)m&&m(z);else if(y!=null&&y.value&&(be(y==null?void 0:y.value),k)){const q=k.nativeEvent||k,Ce=new q.constructor(q.type,q);Object.defineProperties(Ce,{target:{writable:!0,value:{value:y.value,name:T}},currentTarget:{writable:!0,value:{value:y.value,name:T}}}),w&&w(Ce)}}},U=t.useMemo(()=>{if(!oe||z==="")return $;const y=z.trim().toLowerCase(),{options:k,exactMatch:q}=(Array.isArray($)?$:[$]).reduce(Zc(y),{options:[],exactMatch:!1});return[...k,...X&&!q?[{label:`${c}"${z}"`,value:et}]:[]]},[$,X,oe,z,c]),[Xe,he]=t.useState(-1),He=t.useCallback(y=>{const k=U[y];if(k&&!k.disabled&&k.value!==et){he(y),Y(k.label||"");return}Y(z),he(y)},[U,z,Y,he]),Bt=y=>{var q;let k=Xe;do{if(y==="previous"?k--:k++,k<0)return He(-1);if(U[k]&&!((q=U[k])!=null&&q.disabled))return He(k)}while(U[k])},oo=y=>{const k=U[Xe];k&&W(k,y),Ot()},[ne,de]=t.useState(!1),$e=!r&&ne,no=z!==""&&oe,ao=fr("min",4,B),co=fr("max",20,B),io=Math.min(Math.max(ao,z.length),co),[Ke,so]=lt.useTransition({timeout:{enter:0,exit:300},preEnter:!0});we.useEffect(()=>{so($e)},[$e]),we.useEffect(()=>{!ne&&Ke==="unmounted"&&Ot()},[ne,Ke]);const uo=Lc("inner",L==="small"?"3":"4",j),Ot=()=>{re(""),Y(""),he(-1)},po=()=>{oe&&!ne&&de(!0),oe||de(!ne)},Ht=y=>{if(!ne)return y.stopPropagation(),y.preventDefault(),de(!0);y.key in Xl&&(y.preventDefault(),y.stopPropagation(),y.key==="ArrowUp"?Bt(i==="up"?"next":"previous"):y.key==="ArrowDown"&&Bt(i==="up"?"previous":"next"),y.key==="Enter"&&(oo(y),de(!1)))},fo=y=>{const k=y.currentTarget.value;re(k),Y(k),he(-1)},go=y=>{y.stopPropagation(),re(""),Y(""),he(-1)},mo=()=>{He(-1)},bo=y=>k=>{k.stopPropagation(),W(y,k),de(!1)},ho=y=>{const k=Number(y.currentTarget.getAttribute("data-option-index"));isNaN(k)||He(k)};un(ee,"click",()=>de(!1),ne);const At=({option:y,...k})=>y?t.createElement(t.Fragment,null,y.prefix&&t.createElement("div",null,y.prefix),t.createElement(Ul,{...k},y.node?y.node:y.label||y.value)):null;return t.createElement(le,{"data-testid":"select",description:e,disabled:r,error:u,hideLabel:s,id:ie,inline:p,label:g,labelSecondary:f,readOnly:h,required:v,width:x},y=>t.createElement(vc,{...P,"aria-controls":`listbox-${ie}`,"aria-expanded":"true","aria-haspopup":"listbox","aria-invalid":u?!0:void 0,"data-testid":"select-container",role:"combobox",onClick:po,onKeyDown:Ht,$disabled:!!r,$hasError:!!u,$open:$e,$readOnly:h,$showDot:O,$size:L,$validated:!!A,id:`combo-${ie}`,ref:ee,tabIndex:E,onBlur:R,onFocus:C},t.createElement(yc,{$disabled:!!r,$hasError:!!u,$ids:y,$open:$e,$size:L},t.createElement(Ec,{ref:te,...y==null?void 0:y.content,"aria-hidden":!0,disabled:r,name:T,placeholder:a,readOnly:h,tabIndex:-1,value:me,onChange:k=>{const q=k.target.value,Ce=$==null?void 0:$.find($o=>$o.value===q);Ce&&(be(Ce.value),w&&w(k))},onFocus:()=>{var k;_.current?_.current.focus():(k=ee.current)==null||k.focus()}}),oe&&$e?t.createElement(Cc,{autoCapitalize:"none",autoComplete:"off",autoFocus:!0,"data-testid":"select-input",placeholder:(se==null?void 0:se.label)||a,ref:_,size:io,spellCheck:"false",style:{flex:"1",height:"100%"},value:I,onChange:fo,onKeyDown:k=>Ht(k)}):se?t.createElement(At,{"data-testid":"selected",option:se}):t.createElement(xc,null,a),no?t.createElement(ql,{$size:L,type:"button",onClick:go},t.createElement(Be,null)):h?null:t.createElement(kc,{$direction:i,$open:$e,$size:L,id:"chevron",type:"button",onClick:()=>de(!ne)},t.createElement(Ye,null))),t.createElement(Sc,{$align:M,$direction:i,$rows:Z,$size:L,$state:Ke,id:`listbox-${ie}`,role:"listbox",tabIndex:-1,onMouseLeave:mo},t.createElement(Pc,{$direction:i,$rows:Z,$size:L},U.length===0&&t.createElement(Mc,null,H),U.map((k,q)=>t.createElement(Vc,{$selected:(k==null?void 0:k.value)===me,$highlighted:q===Xe,$gap:uo,$color:k.color,$size:L,"data-option-index":q,"data-testid":`select-option-${k.value}`,disabled:k.disabled,key:k.value,role:"option",type:"button",onClick:bo(k),onMouseOver:ho},t.createElement(At,{option:k})))))))});Vt.displayName="Select";const Gc=d.default.div(({theme:e})=>o.css`
    width: ${e.space.full};
  `),gr=({theme:e})=>o.css`
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
`,Tc=d.default.input(({theme:e,disabled:r})=>o.css`
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

    ${r&&o.css`
      opacity: 0.5;
      filter: grayscale(100%);
      cursor: not-allowed;
    `}
  `),Mt=t.forwardRef(({label:e,description:r,error:l,hideLabel:n,inline:c,labelSecondary:a,required:i,width:u,defaultValue:s,disabled:p,id:b,name:g,readOnly:f,tabIndex:v,value:E,min:h=1,max:x=100,onChange:R,onBlur:w,onFocus:C,step:m="any",...$},Z)=>{const H=t.useRef(null),T=Z||H;return t.createElement(le,{label:e,description:r,error:l,hideLabel:n,inline:c,labelSecondary:a,required:i,width:u,id:b},S=>t.createElement(Gc,null,t.createElement(Tc,{ref:T,type:"range",...$,...S==null?void 0:S.content,defaultValue:s,disabled:p,name:g,readOnly:f,tabIndex:v,value:E,min:h,max:x,onChange:R,onBlur:w,onFocus:C,step:m})))});Mt.displayName="Slider";const Bc=d.default.div(({theme:e,$error:r,$validated:l,$showDot:n,$alwaysShowAction:c,$disabled:a})=>o.css`
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

    ${n&&!a&&r&&o.css`
      &:after {
        background-color: ${e.colors.redPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${n&&!a&&l&&!r&&o.css`
      &:after {
        background-color: ${e.colors.greenPrimary};
        transform: scale(1);
        opacity: 1;
      }
    `}

    ${n&&!r&&o.css`
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

    ${!c&&o.css`
      textarea:placeholder-shown ~ button {
        opacity: 0;
        transform: scale(0.8);
      }
    `}
  `),Oc=d.default.textarea(({theme:e,$size:r,$hasAction:l,$error:n})=>o.css`
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
      ${l?e.space[10]:e.space[4]} ${e.space["3.5"]}
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
        ${l?e.space[9]:e.space["3.5"]}
        ${e.space["2.5"]} ${e.space["3.5"]};
    `}

    ${n&&o.css`
      border-color: ${e.colors.redPrimary};
      color: ${e.colors.redPrimary};
    `}

    ${!n&&o.css`
      &:focus-within {
        border-color: ${e.colors.bluePrimary};
      }
    `}

    &:read-only {
      border-color: ${e.colors.border};
      cursor: default;
    }
  `),Hc=d.default.button(({theme:e,$size:r})=>o.css`
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
  `),Zt=t.forwardRef(({autoCorrect:e,autoFocus:r,clearable:l=!1,defaultValue:n,description:c,disabled:a,error:i,validated:u,showDot:s,hideLabel:p,id:b,label:g,labelSecondary:f,maxLength:v,name:E="textarea",placeholder:h,readOnly:x,required:R,rows:w=5,size:C="medium",spellCheck:m,tabIndex:$,value:Z,width:H,actionIcon:T,alwaysShowAction:S=!1,onClickAction:L,onChange:j,onBlur:B,onFocus:M,...A},O)=>{const P=t.useRef(null),V=O||P,F=i?!0:void 0,te=l||!!L,ee=()=>{var re,X;if(!j)return V.current&&(V.current.value=""),(re=V.current)==null?void 0:re.focus();const I=document.createElement("input");I.value="",I.name=E;const Y=new Event("change",{bubbles:!0});Object.defineProperties(Y,{target:{writable:!1,value:I},currentTarget:{writable:!1,value:I}});const z=_l(Y);j(z),(X=V.current)==null||X.focus()},_=()=>{if(L)return L();ee()};return t.createElement(le,{description:c,disabled:a,error:i,hideLabel:p,id:b,label:g,labelSecondary:f,readOnly:x,required:R,width:H},I=>t.createElement(Bc,{$alwaysShowAction:S,$disabled:a,$error:!!i,$showDot:s,$validated:u},t.createElement(Oc,{...A,...I==null?void 0:I.content,"aria-invalid":F,$error:F,$hasAction:te,$showDot:s,$size:C,$validated:u,autoCorrect:e,autoFocus:r,defaultValue:n,disabled:a,maxLength:v,name:E,placeholder:h,readOnly:x,ref:V,rows:w,spellCheck:m,tabIndex:$,value:Z,onBlur:B,onChange:j,onFocus:M}),(l||L)&&t.createElement(Hc,{$size:C,type:"button",onClick:_},T||t.createElement(Be,null))))});Zt.displayName="Textarea";const mr={small:{width:"12",height:"7"},medium:{width:"12",height:"8"},large:{width:"16",height:"10"}},Fe={small:{diameter:"5",translateX:"2.5"},medium:{diameter:"6",translateX:"2"},large:{diameter:"8",translateX:"3"}},Ac=d.default.input(({theme:e,$size:r="medium"})=>o.css`
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
      width: ${e.space[Fe[r].diameter]};
      height: ${e.space[Fe[r].diameter]};
      border-radius: ${e.radii.full};
      transform: translateX(-${e.space[Fe[r].translateX]});
      transition: transform 0.3s ease-in-out, background-color 0.1s ease-in-out;
    }

    &:checked::after {
      transform: translateX(${e.space[Fe[r].translateX]});
    }

    &:disabled::after {
      background-color: ${e.colors.greyPrimary};
    }
  `),Lt=t.forwardRef(({size:e="medium",...r},l)=>t.createElement(Ac,{ref:l,type:"checkbox",...r,$size:e}));Lt.displayName="Toggle";const br={top:`
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
  `},Fc=d.default.div(({theme:e,$placement:r,$mobilePlacement:l})=>o.css`
    position: relative;
    pointer-events: none;
    box-sizing: border-box;
    filter: drop-shadow(0px 0px 1px #e8e8e8)
      drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2));
    border-radius: ${e.radii.large};
    padding: ${e.space["2.5"]} ${e.space["2.5"]} ${e.space["2.5"]}
      ${e.space["3.5"]};
    background: ${e.colors.background};

    ${br[l]}
    ${J.sm.min(o.css`
      &:before {
        display: none;
      }
      &:after {
        display: none;
      }
      ${br[r]}
    `)}
  `),jc=({placement:e,mobilePlacement:r,children:l})=>t.createElement(Fc,{$mobilePlacement:r,$placement:e,"data-testid":"tooltip-popover"},l),Gt=({content:e,placement:r="top",mobilePlacement:l="top",children:n,...c})=>{const a=t.useRef(null),i=t.Children.only(n),u=t.cloneElement(i,{ref:a}),s=t.createElement(jc,{mobilePlacement:l,placement:r},e);return t.createElement(t.Fragment,null,t.createElement(Ze,{anchorRef:a,mobilePlacement:l,placement:r,popover:s,...c}),u)};Gt.displayName="Tooltip";const Dc=d.default.button(({theme:e})=>o.css`
    position: absolute;
    top: ${e.space[2]};
    right: ${e.space[2]};
    width: ${e.space[8]};
    height: ${e.space[8]};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition-property: all;
    transition-duration: ${e.transitionDuration[150]};
    transition-timing-function: ${e.transitionTimingFunction.inOut};
    border-radius: ${e.radii.full};
    background-color: transparent;

    &:hover {
      background-color: ${e.colors.greySurface};
      transform: translateY(-1px);
    }

    svg {
      display: block;
      width: ${e.space[4]};
      height: ${e.space[4]};
      color: ${e.colors.greyPrimary};
    }
  `),Kl=d.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${e.space[4]};
    padding: ${e.space[4]};
    border-radius: ${e.radii["3xLarge"]};
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    background-color: ${e.colors.background};
    position: relative;
    width: 100%;
    ${J.sm.min(o.css`
      min-width: ${e.space[64]};
      max-width: 80vw;
      border-radius: ${e.radii["3xLarge"]};
      padding: ${e.space[6]};
      gap: ${e.space[6]};
    `)}
  `),Nc=d.default.div(({theme:e,$alert:r})=>o.css`
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
  `),zc=({alert:e})=>{const r=!!e&&["error","warning"].includes(e);return t.createElement(Nc,{$alert:e},r?t.createElement(Ge,null):t.createElement(Ue,null))},Wc=d.default(D)(()=>o.css`
    text-align: center;
  `),_c=d.default(D)(({theme:e})=>o.css`
    font-size: ${e.fontSizes.body};
    line-height: ${e.lineHeights.body};
    font-weight: ${e.fontWeights.bold};
    color: ${e.colors.textSecondary};
    text-align: center;

    padding: 0 ${e.space[4]};
    max-width: ${e.space[72]};
  `),Ic=d.default.div(({theme:e})=>o.css`
    display: flex;
    align-items: center;
    justify-content: stretch;
    flex-direction: column;
    gap: ${e.space[2]};
    width: ${e.space.full};
    ${J.sm.min(o.css`
      flex-direction: row;
    `)}
  `),Yc=d.default.div(({theme:e})=>o.css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${e.space[4]};
  `),Uc=d.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${e.space[1]};
  `),qc=d.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${e.space[2]};
  `),Xc=d.default.div(({theme:e,$type:r})=>o.css`
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
  `),Ql=({title:e,subtitle:r,alert:l})=>t.createElement(Uc,null,l&&t.createElement(zc,{alert:l}),e&&(typeof e!="string"&&e||t.createElement(Wc,{fontVariant:"headingFour"},e)),r&&(typeof r!="string"&&r||t.createElement(_c,null,r))),Jl=({leading:e,trailing:r,currentStep:l,stepCount:n,stepStatus:c})=>{const a=t.useCallback(p=>p===l?c||"inProgress":p<(l||0)?"completed":"notStarted",[l,c]),i=e||r;return i||!!n?t.createElement(Yc,null,n&&t.createElement(qc,{"data-testid":"step-container"},Array.from({length:n},(p,b)=>t.createElement(Xc,{$type:a(b),"data-testid":`step-item-${b}-${a(b)}`,key:b}))),i&&t.createElement(Ic,null,e,r)):null},hr=({open:e,onDismiss:r,alert:l,title:n,subtitle:c,children:a,currentStep:i,stepCount:u,stepStatus:s,...p})=>t.createElement(Oe,{...p,open:e,onDismiss:r},t.createElement(Kl,null,t.createElement(Ql,{alert:l,title:n,subtitle:c,currentStep:i,stepCount:u,stepStatus:s}),a)),je=({onClick:e})=>t.createElement(Dc,{"data-testid":"close-icon",onClick:e},t.createElement(Ee,null)),xe=({children:e,onDismiss:r,onClose:l,open:n,variant:c="closable",...a})=>{if(c==="actionable"){const{trailing:i,leading:u,alert:s,title:p,subtitle:b,center:g,currentStep:f,stepCount:v,stepStatus:E,...h}=a,x=l||r;return t.createElement(hr,{...h,alert:s,open:n,subtitle:b,title:p,onDismiss:r},e,t.createElement(Jl,{leading:u,trailing:i,center:g,currentStep:f,stepCount:v,stepStatus:E}),x&&t.createElement(je,{onClick:x}))}else if(c==="closable"){const{alert:i,title:u,subtitle:s,...p}=a,b=l||r;return t.createElement(hr,{...p,alert:i,open:n,subtitle:s,title:u,onDismiss:r},e,b&&t.createElement(je,{onClick:b}))}return t.createElement(Oe,{onDismiss:r,open:n},t.createElement(Kl,null,e,l&&t.createElement(je,{onClick:l})))};xe.displayName="Dialog";xe.Footer=Jl;xe.Heading=Ql;xe.CloseButton=je;const eo=d.default.svg(({theme:e})=>o.css`
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
  `),to=d.default.div(({theme:e,$state:r,$top:l,$left:n,$right:c,$bottom:a,$mobile:i,$popped:u})=>o.css`
    position: fixed;
    z-index: 10000;

    width: 92.5%;
    left: 3.75%;
    top: calc(100vh / 100 * 2.5);

    ${u&&o.css`
      width: 95%;
      left: 2.5%;
      touch-action: none;
    `}

    ${!i&&o.css`
      max-width: ${e.space[112]};
      top: unset;
      left: unset;

      ${l&&`top: ${e.space[l]};`}
      ${n&&`left: ${e.space[n]};`}
      ${c&&`right: ${e.space[c]};`}
      ${a&&`bottom: ${e.space[a]};`}
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
  `),ro=d.default(D)(({theme:e})=>o.css`
    font-size: ${e.fontSizes.headingFour};
    line-height: ${e.lineHeights.headingFour};
  `),Kc=d.default.div(({theme:e})=>o.css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: ${e.space[3]};
    margin-bottom: calc(-1 * ${e.space[2]});
  `),Qc=d.default.div(({theme:e})=>o.css`
    width: ${e.space[8]};
    height: ${e.space[1]};
    border-radius: ${e.radii.full};
    background: ${e.colors.border};
  `),Jc=()=>t.createElement(Kc,null,t.createElement(Qc,null)),ei=({onClose:e,title:r,description:l,top:n="4",left:c,right:a="4",bottom:i,state:u,children:s,...p})=>t.createElement(to,{...p,"data-testid":ce(p,"toast-desktop"),$bottom:i,$left:c,$mobile:!1,$right:a,$state:u,$top:n},t.createElement(eo,{as:Ee,"data-testid":"toast-close-icon",onClick:()=>e()}),t.createElement(ro,{fontVariant:"large",weight:"bold"},r),t.createElement(D,null,l),s&&t.createElement(lo,null,s)),lo=d.default.div(({theme:e})=>o.css`
    margin-top: ${e.space[3]};
    width: 100%;
  `),ti=({onClose:e,open:r,title:l,description:n,left:c,right:a="4",bottom:i,state:u,children:s,popped:p,setPopped:b,...g})=>{const{space:f}=o.useTheme(),v=t.useRef(null),[E,h]=t.useState(.025*window.innerHeight),[x,R]=t.useState([]);t.useEffect(()=>{r&&h(.025*window.innerHeight)},[r]),t.useEffect(()=>{var $;const m=.025*window.innerHeight;if(x.length&&!p){let Z=!1,H=x[x.length-1];H===void 0&&(H=x[x.length-2]||0,Z=!0);const T=parseInt(getComputedStyle(document.documentElement).fontSize),S=x[0]-H;if(Z)parseFloat(f[8])*T>((($=v.current)==null?void 0:$.offsetHeight)||0)-S?e():(h(m),R([]));else if(S*-1>parseFloat(f[32])*T)h(m*2),b(!0);else if(S>0)h(m-S);else{const L=.25*(S^2);h(m-L)}}},[x]);const w=t.useCallback(m=>{var $;m.preventDefault(),R([($=m.targetTouches.item(0))==null?void 0:$.pageY])},[]),C=t.useCallback(m=>{m.preventDefault(),R($=>{var Z;return[...$,(Z=m.targetTouches.item(0))==null?void 0:Z.pageY]})},[]);return t.useEffect(()=>{const m=v.current;return m==null||m.addEventListener("touchstart",w,{passive:!1,capture:!1}),m==null||m.addEventListener("touchmove",C,{passive:!1,capture:!1}),()=>{m==null||m.removeEventListener("touchstart",w,{capture:!1}),m==null||m.removeEventListener("touchmove",C,{capture:!1})}},[]),t.useEffect(()=>{const m=v.current;p&&(m==null||m.removeEventListener("touchstart",w,{capture:!1}),m==null||m.removeEventListener("touchmove",C,{capture:!1}))},[p]),t.createElement(to,{...g,"data-testid":ce(g,"toast-touch"),style:{top:`${E}px`},onClick:()=>b(!0),onTouchEnd:()=>R(m=>[...m,void 0]),$bottom:i,$left:c,$mobile:!0,$popped:p,$right:a,$state:u,ref:v},t.createElement(ro,{fontVariant:"large",weight:"bold"},l),t.createElement(D,null,n),p&&t.createElement(t.Fragment,null,s&&t.createElement(lo,null,s),t.createElement(eo,{as:Ee,"data-testid":"toast-close-icon",onClick:m=>{m.stopPropagation(),e()}})),!p&&t.createElement(Jc,null))},Tt=({onClose:e,open:r,msToShow:l=8e3,variant:n="desktop",...c})=>{const[a,i]=t.useState(!1),u=t.useRef();return t.useEffect(()=>{if(r)return i(!1),u.current=setTimeout(()=>e(),l||8e3),()=>{clearTimeout(u.current),e()}},[r]),t.useEffect(()=>{a&&clearTimeout(u.current)},[a]),t.createElement(Le,{className:"toast",noBackground:!0,open:r,onDismiss:n==="touch"&&a?()=>e():void 0},({state:s})=>n==="touch"?t.createElement(ti,{...c,open:r,popped:a,setPopped:i,state:s,onClose:e}):t.createElement(ei,{...c,open:r,state:s,onClose:e}))};Tt.displayName="Toast";const ri=Object.freeze(Object.defineProperty({__proto__:null,Avatar:Ne,BackdropSurface:ot,Banner:ct,Button:ze,Card:We,DynamicPopover:Ze,Field:le,FileInput:st,Heading:_e,Portal:Me,RecordItem:dt,ScrollBox:ut,Skeleton:ft,Spinner:pe,Tag:Ie,Typography:D,VisuallyHidden:ge,Backdrop:Le,Checkbox:gt,CheckboxRow:mt,CountdownCircle:vt,CurrencyToggle:yt,Dropdown:qe,FieldSet:Et,Helper:xt,Input:Ct,Modal:Oe,PageButtons:zl,Profile:kt,RadioButton:St,RadioButtonGroup:Rt,Select:Vt,SkeletonGroup:pt,Slider:Mt,Textarea:Zt,Toggle:Lt,Tooltip:Gt,Dialog:xe,Toast:Tt,AeroplaneSVG:Lr,AlertSVG:Ge,BrowserSVG:Gr,CalendarSVG:Tr,CameraSVG:Br,CheckSVG:Te,CheckCircleSVG:Or,CogSVG:Hr,CogActiveSVG:Ar,CopySVG:bt,CounterClockwiseArrowSVG:Fr,CreditCardSVG:jr,CrossSVG:Ee,CrossCircleSVG:Be,DisabledSVG:Dr,DocumentSVG:Nr,DotGridSVG:zr,DotGridActiveSVG:Wr,DownArrowSVG:_r,DownChevronSVG:Ye,DownCircleSVG:Ir,EnsSVG:Yr,EthSVG:Ue,EthTransparentSVG:Ur,EthTransparentInvertedSVG:qr,ExitSVG:Xr,EyeSVG:Kr,EyeStrikethroughSVG:Qr,FastForwardSVG:Jr,FilterSVG:el,FlameSVG:tl,GasPumpSVG:rl,HeartSVG:ll,HeartActiveSVG:ol,HouseSVG:nl,InfoCircleSVG:ht,KeySVG:al,LanguageSVG:cl,LeftArrowSVG:il,LeftChevronSVG:sl,LifebuoySVG:dl,LinkSVG:ul,ListSVG:pl,ListDownSVG:fl,ListUpSVG:gl,LockSVG:ml,MagnifyingGlassSVG:bl,MagnifyingGlassActiveSVG:hl,MagnifyingGlassSimpleSVG:$l,MarkerSVG:wl,MenuSVG:vl,MinusSVG:yl,MinusCircleSVG:El,MoonSVG:xl,NametagSVG:Cl,OutlinkSVG:kl,PersonSVG:Sl,PersonActiveSVG:Rl,PersonPlusSVG:Pl,PlusSVG:Vl,PlusCircleSVG:Ml,QuestionBubbleSVG:Zl,QuestionCircleSVG:Ll,RightArrowSVG:Gl,RightChevronSVG:Tl,SpannerSVG:Bl,SpannerAltSVG:Ol,SunSVG:Hl,UpArrowSVG:$t,UpChevronSVG:Al,UpCircleSVG:Fl,UpRightArrowSVG:wt,WalletSVG:jl},Symbol.toStringTag,{value:"Module"})),li=o.createGlobalStyle(({theme:e})=>o.css`
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

    .indicator-container {
      position: relative;
      &::after {
        position: absolute;
        top: -${e.space["0.5"]};
        right: -${e.space["0.5"]};
        content: '';
        width: ${e.space[4]};
        height: ${e.space[4]};
        background-color: var(--indicator-color);
        border-radius: ${e.radii.full};
        border: ${e.space["0.5"]} solid ${e.colors.greySurface};
        transform: scale(0);
        opacity: 0;
        transition: all 0.2s ease-in-out;
      }
      &[type='button']::after {
        top: -${e.space[1]};
        right: -${e.space[1]};
      }
      &[data-indicator='true']::after {
        transform: scale(1);
        opacity: 1;
      }
    }
  `),oi=li;exports.AeroplaneSVG=Lr;exports.AlertSVG=Ge;exports.Avatar=Ne;exports.Backdrop=Le;exports.BackdropSurface=ot;exports.Banner=ct;exports.BrowserSVG=Gr;exports.Button=ze;exports.CalendarSVG=Tr;exports.CameraSVG=Br;exports.Card=We;exports.CheckCircleSVG=Or;exports.CheckSVG=Te;exports.Checkbox=gt;exports.CheckboxRow=mt;exports.CogActiveSVG=Ar;exports.CogSVG=Hr;exports.Components=ri;exports.CopySVG=bt;exports.CountdownCircle=vt;exports.CounterClockwiseArrowSVG=Fr;exports.CreditCardSVG=jr;exports.CrossCircleSVG=Be;exports.CrossSVG=Ee;exports.CurrencyToggle=yt;exports.Dialog=xe;exports.DisabledSVG=Dr;exports.DocumentSVG=Nr;exports.DotGridActiveSVG=Wr;exports.DotGridSVG=zr;exports.DownArrowSVG=_r;exports.DownChevronSVG=Ye;exports.DownCircleSVG=Ir;exports.Dropdown=qe;exports.DynamicPopover=Ze;exports.EnsSVG=Yr;exports.EthSVG=Ue;exports.EthTransparentInvertedSVG=qr;exports.EthTransparentSVG=Ur;exports.ExitSVG=Xr;exports.EyeSVG=Kr;exports.EyeStrikethroughSVG=Qr;exports.FastForwardSVG=Jr;exports.Field=le;exports.FieldSet=Et;exports.FileInput=st;exports.FilterSVG=el;exports.FlameSVG=tl;exports.GasPumpSVG=rl;exports.Heading=_e;exports.HeartActiveSVG=ol;exports.HeartSVG=ll;exports.Helper=xt;exports.HouseSVG=nl;exports.InfoCircleSVG=ht;exports.Input=Ct;exports.KeySVG=al;exports.LanguageSVG=cl;exports.LeftArrowSVG=il;exports.LeftChevronSVG=sl;exports.LifebuoySVG=dl;exports.LinkSVG=ul;exports.ListDownSVG=fl;exports.ListSVG=pl;exports.ListUpSVG=gl;exports.LockSVG=ml;exports.MagnifyingGlassActiveSVG=hl;exports.MagnifyingGlassSVG=bl;exports.MagnifyingGlassSimpleSVG=$l;exports.MarkerSVG=wl;exports.MenuSVG=vl;exports.MinusCircleSVG=El;exports.MinusSVG=yl;exports.Modal=Oe;exports.MoonSVG=xl;exports.NametagSVG=Cl;exports.OutlinkSVG=kl;exports.PageButtons=zl;exports.PersonActiveSVG=Rl;exports.PersonPlusSVG=Pl;exports.PersonSVG=Sl;exports.PlusCircleSVG=Ml;exports.PlusSVG=Vl;exports.Portal=Me;exports.Profile=kt;exports.QuestionBubbleSVG=Zl;exports.QuestionCircleSVG=Ll;exports.RadioButton=St;exports.RadioButtonGroup=Rt;exports.RecordItem=dt;exports.RightArrowSVG=Gl;exports.RightChevronSVG=Tl;exports.ScrollBox=ut;exports.Select=Vt;exports.Skeleton=ft;exports.SkeletonGroup=pt;exports.Slider=Mt;exports.SpannerAltSVG=Ol;exports.SpannerSVG=Bl;exports.Spinner=pe;exports.SunSVG=Hl;exports.Tag=Ie;exports.Textarea=Zt;exports.ThorinGlobalStyles=oi;exports.Toast=Tt;exports.Toggle=Lt;exports.Tooltip=Gt;exports.Typography=D;exports.UpArrowSVG=$t;exports.UpChevronSVG=Al;exports.UpCircleSVG=Fl;exports.UpRightArrowSVG=wt;exports.VisuallyHidden=ge;exports.WalletSVG=jl;exports.baseTheme=nt;exports.darkTheme=Go;exports.lightTheme=Lo;exports.mq=J;exports.tokens=Re;
