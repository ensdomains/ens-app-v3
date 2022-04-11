"use strict";var dr=Object.defineProperty,ur=Object.defineProperties;var mr=Object.getOwnPropertyDescriptors;var te=Object.getOwnPropertySymbols;var ze=Object.prototype.hasOwnProperty,He=Object.prototype.propertyIsEnumerable;var je=(e,o,n)=>o in e?dr(e,o,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[o]=n,l=(e,o)=>{for(var n in o||(o={}))ze.call(o,n)&&je(e,n,o[n]);if(te)for(var n of te(o))He.call(o,n)&&je(e,n,o[n]);return e},H=(e,o)=>ur(e,mr(o));var N=(e,o)=>{var n={};for(var a in e)ze.call(e,a)&&o.indexOf(a)<0&&(n[a]=e[a]);if(e!=null&&te)for(var a of te(e))o.indexOf(a)<0&&He.call(e,a)&&(n[a]=e[a]);return n};Object.defineProperty(exports,"__esModule",{value:!0});exports[Symbol.toStringTag]="Module";var Oe=require("react"),_=require("styled-components"),gr=require("react-dom");function We(e){return e&&typeof e=="object"&&"default"in e?e:{default:e}}function Fe(e){if(e&&e.__esModule)return e;var o={__proto__:null,[Symbol.toStringTag]:"Module"};return e&&Object.keys(e).forEach(function(n){if(n!=="default"){var a=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(o,n,a.get?a:{enumerable:!0,get:function(){return e[n]}})}}),o.default=e,Object.freeze(o)}var r=Fe(Oe),pr=We(Oe),c=We(_),fr=Fe(gr);const hr={none:"none",solid:"solid"},$r={"0":"0px",px:"1px","0.375":"0.09375rem","0.5":"0.125rem","0.75":"0.1875rem","1":"0.25rem","1.25":"0.3125rem","1.5":"0.375rem","1.75":"0.4375rem","2":"0.5rem"},br={none:"0",medium:"6px",large:"8px",almostExtraLarge:"10px",extraLarge:"12px","2xLarge":"16px","2.5xLarge":"20px","3xLarge":"24px","4xLarge":"40px",full:"9999px"},D={none:"none","-px":"inset 0 0 0 1px","0":"0 0 0 0","0.02":"0 2px 8px","0.25":"0 2px 12px","0.5":"0 0 0 0.125rem","1":"0 0 0 0.25rem","2":"0 0 0 0.5rem"},C={light:{blue:"82, 152, 255",green:"73, 179, 147",indigo:"88, 84, 214",orange:"255, 149, 0",pink:"255, 45, 85",purple:"175, 82, 222",red:"213, 85, 85",teal:"90, 200, 250",yellow:"255, 204, 0",grey:"232, 232, 235"},dark:{blue:"82, 152, 255",green:"73, 179, 147",indigo:"94, 92, 230",orange:"255, 159, 10",pink:"255, 55, 95",purple:"191, 90, 242",red:"213, 85, 85",teal:"100, 210, 255",yellow:"255, 214, 10",grey:"59, 59, 61"}},re={light:{blue:`rgb(${C.light.blue})`,green:`rgb(${C.light.green})`,indigo:`rgb(${C.light.indigo})`,orange:`rgb(${C.light.orange})`,pink:`rgb(${C.light.pink})`,purple:`rgb(${C.light.purple})`,red:`rgb(${C.light.red})`,teal:`rgb(${C.light.teal})`,yellow:`rgb(${C.light.yellow})`,grey:`rgb(${C.light.grey})`},dark:{blue:`rgb(${C.dark.blue})`,green:`rgb(${C.dark.green})`,indigo:`rgb(${C.dark.indigo})`,orange:`rgb(${C.dark.orange})`,pink:`rgb(${C.dark.pink})`,purple:`rgb(${C.dark.purple})`,red:`rgb(${C.dark.red})`,teal:`rgb(${C.dark.teal})`,yellow:`rgb(${C.dark.yellow})`,grey:`rgb(${C.dark.grey})`}},oe={light:{blue:"linear-gradient(330.4deg, #44BCF0 4.54%, #7298F8 59.2%, #A099FF 148.85%)",green:"linear-gradient(90deg, rgba(68,240,127,1) 4.54%, rgba(114,248,176,1) 59.2%, rgba(153,202,255,1) 148.85%)",red:"linear-gradient(90deg, rgba(240,68,87,1) 4.54%, rgba(248,114,149,1) 59.2%, rgba(212,153,255,1) 148.85%)"},dark:{blue:"linear-gradient(330.4deg, #44BCF0 4.54%, #7298F8 59.2%, #A099FF 148.85%)",green:"linear-gradient(90deg, rgba(68,240,127,1) 4.54%, rgba(114,248,176,1) 59.2%, rgba(153,202,255,1) 148.85%)",red:"linear-gradient(90deg, rgba(240,68,87,1) 4.54%, rgba(248,114,149,1) 59.2%, rgba(212,153,255,1) 148.85%)"}},v={light:{accent:"0.7",accentSecondary:"0.15",accentSecondaryHover:"0.2",backgroundHide:"0.1",backgroundHideFallback:"0.5",foregroundSecondary:"0.05",foregroundSecondaryHover:"0.035",foregroundTertiary:"0.033",groupBorder:"0.075",border:"0.3",borderSecondary:"0.12",borderTertiary:"0.05",text:"0.8",textSecondary:"0.65",textSecondaryHover:"0.7",textTertiary:"0.4",textTertiaryHover:"0.5",textPlaceholder:"0.25"},dark:{accent:"0.66",accentSecondary:"0.2",accentSecondaryHover:"0.25",backgroundHide:"0.1",backgroundHideFallback:"0.5",foregroundSecondary:"0.1",foregroundSecondaryHover:"0.15",foregroundTertiary:"0.04",groupBorder:"0",border:"0.3",borderSecondary:"0.12",borderTertiary:"0.05",text:"0.7",textSecondary:"0.5",textSecondaryHover:"0.65",textTertiary:"0.35",textTertiaryHover:"0.4",textPlaceholder:"0.25"}},I={base:{black:"rgb(0, 0, 0)",white:"rgb(255, 255, 255)",current:"currentColor",inherit:"inherit",transparent:"transparent"},light:l({accent:`${re.light.blue}`,accentSecondary:`rgba(${C.light.blue}, ${v.light.accentSecondary})`,accentSecondaryHover:`rgba(${C.light.blue}, ${v.light.accentSecondary})`,accentTertiary:`rgba(${C.light.blue}, calc(${v.light.accentSecondary} * 0.5))`,accentText:"rgb(255, 255, 255)",accentGradient:oe.light.blue,background:"rgb(255, 255, 255)",backgroundHide:`rgba(0,0,0, ${v.light.backgroundHide})`,backgroundSecondary:"rgb(246, 246, 248)",backgroundTertiary:"246, 246, 248",border:`rgb(0,0,0, ${v.light.border})`,borderSecondary:`rgb(0,0,0, ${v.light.borderSecondary})`,foreground:"rgb(0, 0, 0)",foregroundSecondary:`rgba(0,0,0, ${v.light.foregroundSecondary})`,foregroundSecondaryHover:`rgba(0,0,0, ${v.light.foregroundSecondaryHover})`,foregroundTertiary:`rgba(0,0,0, ${v.light.foregroundTertiary})`,groupBackground:"rgb(253, 253, 255)",groupBorder:"rgb(0, 0, 0)",gradients:oe.light,text:`rgb(0,0,0, ${v.light.text})`,textPlaceholder:`rgb(0, 0, 0, ${v.light.textPlaceholder})`,textSecondary:`rgb(0, 0, 0, ${v.light.textSecondary})`,textTertiary:`rgb(0, 0, 0, ${v.light.textTertiary})`},re.light),dark:l({accent:`${re.dark.blue}`,accentSecondary:`rgba(${C.dark.blue}, ${v.dark.accentSecondary})`,accentSecondaryHover:`rgba(${C.dark.blue}, ${v.dark.accentSecondary})`,accentTertiary:`rgba(${C.dark.blue}, calc(${v.dark.accentSecondary} * 0.5))`,accentText:"rgb(255, 255, 255)",accentGradient:oe.dark.blue,background:"rgb(20, 20, 20)",backgroundHide:`rgba(255,255,255, ${v.dark.backgroundHide})`,backgroundSecondary:"rgb(10, 10, 10)",backgroundTertiary:"rgb(20, 20, 20)",border:`rgb(255,255,255, ${v.dark.border})`,borderSecondary:`rgb(255,255,255, ${v.dark.borderSecondary})`,foreground:"rgb(255, 255, 255)",foregroundSecondary:`rgba(255,255,255, ${v.dark.foregroundSecondary})`,foregroundSecondaryHover:`rgba(255,255,255, ${v.dark.foregroundSecondaryHover})`,foregroundTertiary:`rgba(255,255,255, ${v.dark.foregroundTertiary})`,groupBackground:"rgb(10, 10, 10)",groupBorder:"rgb(255, 255, 255)",gradients:oe.dark,text:`rgb(255,255,255, ${v.dark.text})`,textPlaceholder:`rgb(255, 255, 255, ${v.dark.textPlaceholder})`,textSecondary:`rgb(255, 255, 255, ${v.dark.textSecondary})`,textTertiary:`rgb(255, 255, 255, ${v.light.textTertiary})`},re.dark)},wr={"0":"0","30":".3","50":".5","70":".7","100":"1"},Cr={"0":"0",px:"1px","0.25":"0.0625rem","0.5":"0.125rem","0.75":"0.1875rem","1":"0.25rem","1.25":"0.3125rem","1.5":"0.375rem","1.75":"0.4375rem","2":"0.5rem","2.5":"0.625rem","3":"0.75rem","3.5":"0.875rem","4":"1rem","4.5":"1.125rem","5":"1.25rem","6":"1.5rem","7":"1.75rem","8":"2rem","9":"2.25rem","10":"2.5rem","11":"2.75rem","12":"3rem","13":"3.25rem","14":"3.5rem","15":"3.75rem","16":"4rem","18":"4.5rem","20":"5rem","24":"6rem","28":"7rem","32":"8rem","36":"9rem","40":"10rem","44":"11rem","48":"12rem","52":"13rem","56":"14rem","60":"15rem","64":"16rem","72":"18rem","80":"20rem","96":"24rem","112":"28rem","128":"32rem","144":"36rem","168":"42rem","192":"48rem","224":"56rem","256":"64rem","288":"72rem","320":"80rem","1/4":"25%","1/3":"33.333333%","1/2":"50%","2/3":"66.666667%","3/4":"75%",auto:"auto",full:"100%",fit:"fit-content",max:"max-content",min:"min-content",viewHeight:"100vh",viewWidth:"100vw",none:"0"},vr={mono:'"iAWriter Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',sans:'"Satoshi", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'},kr={headingOne:"3rem",headingTwo:"1.875rem",headingThree:"1.625rem",extraLarge:"1.3125rem",large:"1.125rem",small:"0.9375rem",label:"0.8125rem",base:"1.0625rem",root:"16px"},yr={light:"300",normal:"400",medium:"500",semiBold:"550",bold:"650"},xr={"-0.02":"-0.02em","-0.015":"-0.015em","-0.01":"-0.01em",normal:"0","0.03":"0.03em"},Sr={normal:"normal",none:"1","1.25":"1.25","1.375":"1.375","1.5":"1.5","1.625":"1.625","2":"2"},Er={"75":"75ms","100":"100ms","150":"150ms","200":"200ms","300":"300ms","500":"500ms","700":"700ms","1000":"1000ms"},Lr={linear:"linear",in:"cubic-bezier(0.4, 0, 1, 1)",out:"cubic-bezier(0, 0, 0.2, 1)",inOut:"cubic-bezier(0.42, 0, 0.58, 1)"},de={sm:640,md:768,lg:1024,xl:1280},Vr={light:{"0":`${D["0"]} ${I.light.foregroundSecondary}`,"0.02":`${D["0.02"]} ${I.light.foregroundSecondary}`,"0.25":`${D["0.25"]} ${I.light.foregroundSecondary}`,"0.5":`${D["0.5"]} ${I.light.foregroundSecondary}`,"1":`${D["1"]} ${I.light.foregroundSecondary}`},dark:{"0":`${D["0"]} ${I.dark.foregroundSecondary}`,"0.02":`${D["0.02"]} ${I.dark.foregroundSecondary}`,"0.25":`${D["0.25"]} ${I.dark.foregroundSecondary}`,"0.5":`${D["0.5"]} ${I.dark.foregroundSecondary}`,"1":`${D["1"]} ${I.dark.foregroundSecondary}`}},t={borderStyles:hr,borderWidths:$r,colors:I,fonts:vr,fontSizes:kr,fontWeights:yr,letterSpacings:xr,lineHeights:Sr,opacity:wr,radii:br,shades:v,shadows:D,space:Cr,breakpoints:de,transitionDuration:Er,transitionTimingFunction:Lr,boxShadows:Vr,accentsRaw:C},Mr=c.default.div`
  ${({shape:e})=>{switch(e){case"circle":return`
          border-radius: ${t.radii.full};
          &:after {
            border-radius: ${t.radii.full};
          }
        `;case"square":return`
          border-radius: ${t.radii["2xLarge"]}
          &:after {
            border-radius: ${t.radii["2xLarge"]}
          }
        `;default:return""}}}

  ${({theme:e,noBorder:o})=>!o&&`
      &:after {
      box-shadow: ${t.shadows["-px"]} ${t.colors[e.mode].foregroundTertiary};
    content: '';
    inset: 0;
    position: absolute;
      }   
      }      
  `}

  ${({theme:e,size:o})=>`
      height: ${t.space[o]};
      width: ${t.space[o]};
      min-width: ${t.space[o]};
      background-color: ${t.colors[e.mode].foregroundSecondary};
      
       
  `}
  
  overflow: hidden;
  position: relative;
`,Tr=c.default.div`
  ${({theme:e})=>`
    background: ${t.colors[e.mode].gradients.blue};
  `}

  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`,Gr=c.default.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`,ue=({label:e,placeholder:o,noBorder:n,shape:a="circle",size:i="12",src:d})=>r.createElement(Mr,{shape:a,size:i,noBorder:o||n},o?r.createElement(Tr,{"aria-label":e}):r.createElement(Gr,{decoding:"async",src:d,alt:e})),Rr=c.default.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  overflow: hidden;
  top: 0;
  ${({theme:e})=>`
    backgroundColor: ${t.shades[e.mode].backgroundHideFallback};
    
    @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    backdrop-filter: blur(30px);
    background-color: ${t.shades[e.mode].backgroundHide};
  }
  `}
`,me=e=>pr.default.createElement(Rr,l({},e)),Z=c.default.div`
  border-width: 0;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`,Br=_.keyframes`
  100% {
    transform: rotate(1turn);
  }
`,zr=c.default.div`
  animation: ${Br} 1.1s linear infinite;

  ${({theme:e,color:o})=>`
    color: ${t.colors[e.mode][o]};
    stroke: ${t.colors[e.mode][o]};
  `}

  ${({size:e})=>{switch(e){case"small":return`
          height: ${t.space["6"]};
          stroke-width: ${t.space["1.25"]};
          width: ${t.space["6"]};
        `;case"large":return`
          height: ${t.space["16"]};
          stroke-width: ${t.space["1.25"]};
          width: ${t.space["16"]};
        `;default:return""}}}
`,q=r.forwardRef(({accessibilityLabel:e,size:o="small",color:n="accent"},a)=>r.createElement(zr,{color:n,ref:a,size:o},e&&r.createElement(Z,null,e),r.createElement("svg",{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},r.createElement("circle",{cx:"12",cy:"12",fill:"none",r:"9",strokeDasharray:"42",strokeLinecap:"round"}),r.createElement("circle",{cx:"12",cy:"12",fill:"none",opacity:"0.25",r:"9",strokeLinecap:"round"}))));q.displayName="Spinner";const Hr=c.default.div`
  ${({theme:e,color:o,weight:n,font:a,size:i})=>`
      color: ${t.colors[e.mode][o]};
      font-family: ${t.fonts[a]};
      letter-spacing: ${t.letterSpacings["-0.01"]};
      font-size: ${t.fontSizes[i]};
      font-weight: ${t.fontWeights[n]};
      letter-spacing: ${t.letterSpacings["-0.015"]};
      line-height: ${t.lineHeights["1.5"]};
  `}

  ${({ellipsis:e})=>e&&`
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
  `}

  ${({variant:e,theme:o})=>{switch(e){case"small":return`
          font-size: ${t.fontSizes.small};
          font-weight: ${t.fontWeights.normal};
          letter-spacing: ${t.letterSpacings["-0.01"]};
          line-height: ${t.lineHeights["1.5"]};
        `;case"large":return`
          font-size: ${t.fontSizes.large};
          font-weight: ${t.fontWeights.normal};
          letter-spacing: ${t.letterSpacings["-0.02"]};
          line-height: ${t.lineHeights["2"]};
        `;case"extraLarge":return`
          font-size: ${t.fontSizes.extraLarge};
          font-weight: ${t.fontWeights.medium};
          letter-spacing: ${t.letterSpacings["-0.02"]};
          line-height: ${t.lineHeights["2"]};
        `;case"label":return`
          color: ${t.colors[o.mode].text};
          font-size: ${t.fontSizes.label};
          font-weight: ${t.fontWeights.semiBold};
          letter-spacing: ${t.letterSpacings["-0.01"]};
          text-transform: capitalize;
        `;case"labelHeading":return`
          color: ${t.colors[o.mode].text};
          font-size: ${t.fontSizes.small};
          font-weight: ${t.fontWeights.semiBold};
          letter-spacing: ${t.letterSpacings["-0.01"]};
          text-transform: capitalize;
        `;default:return""}}}

  ${({weight:e})=>`
      font-weight: ${t.fontWeights[e]};
  `}
`,P=r.forwardRef(({as:e="div",children:o,ellipsis:n,variant:a,className:i,weight:d="normal",font:u="sans",color:s="text",size:m="base"},b)=>r.createElement(Hr,{as:e,variant:a,ellipsis:n?!0:void 0,className:i,weight:d,font:u,color:s,size:m,ref:b},o));P.displayName="Typography";const jr=({center:e,size:o,side:n})=>e&&`
  position: absolute;
  ${n}: ${o==="medium"?t.space["4"]:t.space["5"]};
`,ne=(e,o,n)=>{if(o==="accent")return t.colors[e][n];switch(n){case"accent":return t.colors[e][o];case"accentText":return t.colors.base.white;case"accentGradient":return t.colors[e].gradients[o];case"accentSecondary":return`rgba(${t.accentsRaw[e][o]}, ${t.shades[e][n]})`;case"accentSecondaryHover":return`rgba(${t.accentsRaw[e][o]}, ${t.shades[e][n]})`;default:return""}},Or=c.default.button`
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: ${t.space["4"]};
  justify-content: center;
  transition-propery: all;
  transition-duration: ${t.transitionDuration["150"]};
  transition-timing-function: ${t.transitionTimingFunction.inOut};
  letter-spacing: ${t.letterSpacings["-0.01"]};

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
  }

  &:active {
    transform: translateY(0px);
    filter: brightness(1);
  }

  ${({theme:e,disabled:o,center:n,pressed:a,shadowless:i})=>`
    ${o?"cursor: not-allowed":""};
    ${n?"position: relative":""};
    ${a?"brightness(0.95)":""};
    ${i?"box-shadow: none !important":""};
    
    box-shadow: ${t.shadows["0.25"]} ${t.colors[e.mode].grey};
    
    &:disabled {
      background-color: ${t.colors[e.mode].grey};
      transform: translateY(0px);
      filter: brightness(1);
    }
  `}

  ${({shape:e})=>{switch(e){case"circle":return`
          border-radius: ${t.radii.full};
        `;default:return""}}}
  ${({size:e})=>{switch(e){case"extraSmall":return`
          border-radius: ${t.radii.large};
          font-size: ${t.fontSizes.small};
          padding: ${t.space["2"]};
        `;case"small":return`
          border-radius: ${t.radii.large};
          font-size: ${t.fontSizes.small};
          height: ${t.space["10"]};
          padding: 0 ${t.space["4"]};
        `;case"medium":return`
          border-radius: ${t.radii.extraLarge};
          font-size: ${t.fontSizes.large};
          padding: ${t.space["3.5"]} ${t.space["4"]};
        `;default:return""}}}
  ${({theme:e,variant:o,tone:n})=>{switch(o){case"primary":return`
          color: ${ne(e.mode,n,"accentText")};
          background: ${ne(e.mode,n,"accent")};
        `;case"secondary":return`
          color: ${t.colors[e.mode].textSecondary};
          background: ${t.colors[e.mode].grey};
        `;case"action":return`
          color: ${ne(e.mode,n,"accentText")};
          background: ${ne(e.mode,n,"accentGradient")};
        `;case"transparent":return`
          color: ${t.colors[e.mode].textTertiary};
          
          &:hover {
              background-color: ${t.colors[e.mode].foregroundTertiary};
          }
          
          &:active {
              background-color: ${t.colors[e.mode].foregroundTertiary};
          }
        `;default:return""}}}
  
  ${({size:e,shape:o})=>o==="square"?`border-radius: ${e==="small"?t.radii.large:t.radii["2xLarge"]};`:""}

  ${({size:e,center:o})=>e==="medium"&&o?`
        padding-left: ${t.space["14"]};
        padding-right: ${t.space["14"]};
      `:""}

  ${({theme:e,shadowless:o,pressed:n,variant:a})=>o&&n&&a==="transparent"?`
        background-color: ${t.colors[e.mode].backgroundSecondary};
      `:""}
`,Wr=c.default.div`
  ${jr}
`,Fr=c.default.div``,Dr=c.default(P)`
  color: inherit;
  font-size: inherit;
  font-weight: ${t.fontWeights.semiBold};
`,ae=r.forwardRef(({center:e,children:o,disabled:n,href:a,prefix:i,loading:d,rel:u,shape:s,size:m="medium",suffix:b,tabIndex:g,target:p,tone:h="accent",type:k,variant:x="primary",width:T,zIndex:B,onClick:G,pressed:L=!1,shadowless:E=!1},w)=>{const y=r.createElement(Dr,{ellipsis:!0},o);let V;return s?V=d?r.createElement(q,null):y:V=r.createElement(r.Fragment,null,i&&r.createElement(Wr,{center:e,size:m,side:"left"},i),y,(d||b)&&r.createElement(Fr,{center:e,size:m,side:"right"},d?r.createElement(q,null):b)),r.createElement(Or,{variant:x,tone:h,size:m,shape:s,shadowless:E,pressed:L,center:e,disabled:n,href:a,ref:w,rel:u,tabIndex:g,target:p,type:k,onClick:G,zIndex:B,position:B&&"relative",width:T!=null?T:"100%"},V)});ae.displayName="Button";const Ir=Object.keys(de).reduce((e,o)=>{const n=de[o],a=e;return a[o]=(...i)=>_.css`
      @media screen and (min-width: ${n}px) {
        ${_.css(...i)}
      }
    `,a},{}),K=Ir,Zr=c.default.div`
  padding: ${t.space["6"]};
  border-radius: ${t.radii["2xLarge"]};

  ${K.lg`
    border-radius: ${t.radii["3xLarge"]};
  `}

  ${({dark:e})=>e?`background-color: ${t.colors.base.black};`:`background-color: ${t.colors.base.white};`}

  ${({dark:e,shadow:o})=>!e&&o&&`
        box-shadow: 0px 0px ${t.radii["2xLarge"]} rgba(0,0,0,0.1);
        border-radius: ${t.radii["2xLarge"]};
        
        ${K.lg`
            box-shadow: 0px 0px ${t.radii["3xLarge"]} rgba(0,0,0,0.1);
            border-radius: ${t.radii["3xLarge"]};
        `}
    `}
`,ge=({children:e,shadow:o})=>{const{mode:n,forcedMode:a}=_.useTheme();return r.createElement(Zr,{dark:(a!=null?a:n)==="dark",shadow:o},e)},Pr=typeof window!="undefined"?r.useLayoutEffect:r.useEffect,pe={serverHandoffComplete:!1},_r=()=>{const[e,o]=r.useState(pe.serverHandoffComplete);return r.useEffect(()=>{e||o(!0)},[e]),r.useEffect(()=>{pe.serverHandoffComplete||(pe.serverHandoffComplete=!0)},[]),e},Ar="thorin";let Ur=0;function De(){return++Ur}const Nr=()=>{const e=_r(),[o,n]=r.useState(e?De:null);return Pr(()=>{o===null&&n(De())},[o]),o!=null?`${Ar}`+o:void 0},Ie=({description:e,error:o,id:n}={})=>{const a=Nr();return r.useMemo(()=>{const i=`${a}${n?`-${n}`:""}`,d=`${i}-label`;let u,s;e&&(s={id:`${i}-description`},u=s.id);let m;return o&&(m={id:`${i}-error`},u=`${u?`${u} `:""}${m.id}`),{content:{"aria-describedby":u,"aria-labelledby":d,id:i},description:s,error:m,label:{htmlFor:i,id:d}}},[a,e,o,n])},Ze=r.createContext(void 0),Yr=c.default.label`
  ${({theme:e})=>`
  color: ${t.colors[e.mode].textTertiary};
  font-weight: ${t.fontWeights.semiBold};
  margin-right: ${t.space["4"]};
`}
`,qr=c.default.div`
  display: flex;
  align-items: flex-end;
  justify-conetn: space-between;
  padding-left: ${t.space["4"]};
  padding-right: ${t.space["4"]};
  padding-top: 0;
  padding-bottom: 0;
`,ie=({ids:e,label:o,labelSecondary:n,required:a})=>r.createElement(qr,null,r.createElement(Yr,l({},e.label),o," ",a&&r.createElement(Z,null,"(required)")),n&&n),Pe=c.default.div`
  ${({inline:e})=>e?"align-items: center":""};
  display: flex;
  flex-direction: ${({inline:e})=>e?"row":"column"};
  gap: ${t.space[2]};
  width: ${({width:e})=>t.space[e]};
`,Kr=c.default.div`
  display: flex;
  flex-direction: column;
  gap: ${t.space[2]};
`,_e=c.default.div`
  padding: 0 ${t.space["4"]};
  color: ${({mode:e})=>t.shades[e].textSecondary};
`,Ae=c.default.div`
  color: ${({theme:e})=>t.colors[e.mode].red};
  padding: 0 ${t.space[4]};
`,A=({children:e,description:o,error:n,hideLabel:a,id:i,label:d,labelSecondary:u,required:s,inline:m,width:b="full"})=>{const g=Ie({id:i,description:o!==void 0,error:n!==void 0}),{mode:p}=_.useTheme();let h;return typeof e=="function"?h=r.createElement(Ze.Provider,{value:g},r.createElement(Ze.Consumer,null,k=>e(k))):e?h=r.cloneElement(e,g.content):h=e,m?r.createElement(Pe,{inline:m,width:b},r.createElement("div",null,h),r.createElement(Kr,null,a?r.createElement(Z,null,r.createElement(ie,{ids:g,label:d,labelSecondary:u,required:s})):r.createElement(ie,{ids:g,label:d,labelSecondary:u,required:s}),o&&r.createElement(_e,{mode:p},o),n&&r.createElement(Ae,l({"aria-live":"polite"},g.error),n))):r.createElement(Pe,{width:b},a?r.createElement(Z,null,r.createElement(ie,{ids:g,label:d,labelSecondary:u,required:s})):r.createElement(ie,{ids:g,label:d,labelSecondary:u,required:s}),h,o&&r.createElement(_e,l({mode:p},g.description),o),n&&r.createElement(Ae,l({"aria-live":"polite"},g.error),n))},Xr=(e,o)=>{const n=o==null?void 0:o.split(", ");if(!n)return!0;const a=Ue(e);return n.some(i=>{const d=Ue(i);return d.type===a.type&&d.subtype===a.subtype})},Ue=e=>{const o=e.split("/");return{type:o[0],subtype:o[1]}},Ne={},fe=r.forwardRef(({accept:e,autoFocus:o,children:n,defaultValue:a,disabled:i,error:d,id:u,maxSize:s,name:m,required:b,tabIndex:g,onBlur:p,onChange:h,onError:k,onFocus:x,onReset:T},B)=>{const G=r.useRef(null),L=B||G,[E,w]=r.useState(Ne),y=d?!0:void 0,V=Ie({id:u,error:y}),z=r.useCallback(($,S)=>{if(s&&$.size>s*1e6){S==null||S.preventDefault(),k&&k(`File is ${($.size/1e6).toFixed(2)} MB. Must be smaller than ${s} MB`);return}w(R=>H(l({},R),{file:$,name:$.name,type:$.type})),h&&h($)},[s,h,k]),O=r.useCallback($=>{const S=$.target.files;!(S==null?void 0:S.length)||z(S[0],$)},[z]),W=r.useCallback($=>{$.preventDefault(),w(S=>H(l({},S),{droppable:!0}))},[]),f=r.useCallback($=>{$.preventDefault(),w(S=>H(l({},S),{droppable:!1}))},[]),j=r.useCallback($=>{$.preventDefault(),w(R=>H(l({},R),{droppable:!1}));let S;if($.dataTransfer.items){const R=$.dataTransfer.items;if((R==null?void 0:R[0].kind)!=="file"||(S=R[0].getAsFile(),!S))return}else{const R=$.dataTransfer.files;if(!(R==null?void 0:R.length))return;S=R[0]}!Xr(S.type,e)||z(S,$)},[z,e]),F=r.useCallback($=>{w(S=>H(l({},S),{focused:!0})),x&&x($)},[x]),se=r.useCallback($=>{w(S=>H(l({},S),{focused:!1})),p&&p($)},[p]),Q=r.useCallback($=>{$.preventDefault(),w(Ne),L.current&&(L.current.value=""),T&&T()},[L,T]);return r.useEffect(()=>{!a||w({previewUrl:a.url,name:a.name,type:a.type})},[]),r.useEffect(()=>{if(!E.file)return;const $=URL.createObjectURL(E.file);return w(S=>H(l({},S),{previewUrl:$})),()=>URL.revokeObjectURL($)},[E.file]),r.createElement("div",{ref:B},r.createElement(Z,null,r.createElement("input",l({accept:e,"aria-invalid":y,autoFocus:o,disabled:i,name:m,ref:L,required:b,tabIndex:g,type:"file",onBlur:se,onChange:O,onFocus:F},V.content))),r.createElement("label",H(l({},V.label),{onDragLeave:f,onDragOver:W,onDrop:j}),n(H(l({},E),{reset:Q}))))});fe.displayName="FileInput";const Jr=c.default.div`
  ${({textAlign:e,textTransform:o})=>`
    ${e?`text-align: ${e};`:""}
    ${o?`text-transform: ${o};`:""}
  `}

  ${({level:e})=>{switch(e){case"1":return`
          font-size: ${t.fontSizes.headingOne};
          font-weight: ${t.fontWeights.semiBold};
          letter-spacing: ${t.letterSpacings["-0.02"]};
          line-height: 4rem;
        `;case"2":return`
          font-size: ${t.fontSizes.headingTwo};
          font-weight: ${t.fontWeights.semiBold};
          letter-spacing: ${t.letterSpacings["-0.02"]};
          line-height: 2.5rem;
        `;default:return""}}}
  
  ${({responsive:e,level:o})=>{if(e)switch(o){case"1":return`
          font-size: ${t.fontSizes.headingTwo};
          
          ${K.sm`
            font-size: ${t.fontSizes.headingOne};
          `}
        `;case"2":return`
          font-size: ${t.fontSizes.extraLarge};
          letter-spacing: normal;
          
          ${K.sm`
            font-size: ${t.fontSizes.headingTwo};
            letter-spacing: -0.02;
          `}
        `;default:return""}}}
  
  font-family: ${t.fonts.sans};
`,he=({align:e,children:o,as:n="h1",id:a,level:i="2",responsive:d,transform:u})=>r.createElement(Jr,{as:n,id:a,textAlign:e,textTransform:u,level:i,responsive:d},o),$e=({children:e,className:o,el:n="div"})=>{const[a]=r.useState(document.createElement(n));return o&&a.classList.add(o),r.useEffect(()=>(document.body.appendChild(a),()=>{document.body.removeChild(a)}),[]),fr.createPortal(e,a)},Ye=r.createContext(void 0),qe=({children:e,loading:o})=>r.createElement(Ye.Provider,{value:o},e),Qr=c.default.div`
  ${({theme:e,active:o})=>o&&`
     background-color: ${t.colors[e.mode].foregroundSecondary};
     border-radius: ${t.radii.medium};
     width: ${t.space.fit};
  `}
`,eo=c.default.span`
  display: block;
  ${({active:e})=>e?"visibility: hidden;":""}
`,Ke=({as:e,children:o,loading:n})=>{const a=r.useContext(Ye),i=n!=null?n:a;return r.createElement(Qr,{active:i,as:e},r.createElement(eo,{active:i},o))},to=c.default.div`
  line-height: normal;
  align-items: center;
  display: flex;
  border-radius: ${t.radii.full};
  font-weight: ${t.fontWeights.medium};
  width: ${t.space.max};

  ${({hover:e})=>e&&`
      transition-duration: ${t.transitionDuration["150"]};
      transition-property: colors;
      transition-timing-function: ${t.transitionTimingFunction.inOut};
  `}

  ${({size:e})=>{switch(e){case"small":return`
          height: ${t.space["5"]};
          font-size: ${t.fontSizes.label};
        `;case"medium":return`
          height: ${t.space["6"]};
          font-size: ${t.fontSizes.small};
        `;default:return""}}}

  ${({tone:e,theme:o})=>{switch(e){case"accent":return`
          color: ${t.colors[o.mode].accent};
          background-color: ${t.colors[o.mode].accentTertiary};
        `;case"secondary":return`
          color: ${t.colors[o.mode].textTertiary};
          background-color: ${t.colors[o.mode].foregroundTertiary};
        `;case"blue":return`
          color: ${t.colors[o.mode].blue};
          background-color: rgba(${t.accentsRaw[o.mode].blue}, calc(${t.shades[o.mode].accentSecondary} * 0.5));
        `;case"green":return`
          color: ${t.colors[o.mode].green};
          background-color: rgba(${t.accentsRaw[o.mode].green}, calc(${t.shades[o.mode].accentSecondary} * 0.5));
        `;case"red":return`
          color: ${t.colors[o.mode].red};
          background-color: rgba(${t.accentsRaw[o.mode].red}, calc(${t.shades[o.mode].accentSecondary} * 0.5));
        `;default:return""}}}
  
  ${({hover:e,tone:o,theme:n})=>{if(e&&o==="accent")return`
        background-color: ${t.colors[n.mode].accentTertiary};
      
        &:hover:active {
        background-color: ${t.colors[n.mode].accentSecondary};
        }
        `;if(e&&o==="secondary")return`
        color: ${t.colors[n.mode].textSecondary};
        background-color: ${t.colors[n.mode].foregroundTertiary};
      
        &:hover:active {
          color: ${t.colors[n.mode].text};
          background-color: ${t.colors[n.mode].foregroundSecondary};
        }
        `;if(e&&o==="blue")return`
        &:hover:active {
          background-color: rgb(${t.colors[n.mode].blue});
        }
        `;if(e&&o==="green")return`
        &:hover:active {
          background-color: rgb(${t.colors[n.mode].green});
        }
        `;if(e&&o==="red")return`
        &:hover:active {
          background-color: rgb(${t.colors[n.mode].red});
        }
        `}}
`,ro=c.default.label`
  align-items: center;
  border-radius: ${t.radii.full};
  display: flex;
  height: ${t.space.full};
  padding: 0 ${t.space["2"]};

  ${({theme:e})=>`
    box-shadow: 0 0 0 2px ${t.colors[e.mode].background};
  `}
`,oo=c.default.div`
  padding: 0 ${t.space["2"]};
`,be=({as:e="div",children:o,hover:n,label:a,size:i="medium",tone:d="secondary"})=>r.createElement(to,{as:e,hover:n,size:i,tone:d},a&&r.createElement(ro,null,r.createElement("span",null,a)),r.createElement(oo,{as:e},o)),no=c.default.div`
  align-items: center;
  justify-content: center;
  display: flex;
  height: ${t.space.full};
  width: ${t.space.full};
`,we=({children:e,surface:o,onDismiss:n,open:a})=>{const i=r.useRef(null),d=o||me,u=s=>s.target===i.current&&n&&n();return a?r.createElement($e,{className:"modal"},r.createElement(d,{onClick:u},r.createElement(no,{ref:i},e))):null},ao=c.default.input`
  cursor: pointer;
  margin: ${t.space["1"]} 0;

  ${({theme:e,variant:o})=>{switch(o){case"regular":return`
          width: ${t.space["7"]};
          height: ${t.space["7"]};
          font: inherit;
          border-radius: ${t.space["2"]};
          display: grid;
          place-content: center;
          transition: transform 150ms ease-in-out, filter 150ms ease-in-out;
          
          &:hover {
            transform: translateY(-1px);
            filter: contrast(0.7);
          }
          
          &:active {
            transform: translateY(0px);
            filter: contrast(1);
          }
          
          &::before {
            content: '';
            background-color: ${t.colors[e.mode].accent};
            mask-image: ${`url('data:image/svg+xml; utf8, <svg width="${t.space["4"]}" height="${t.space["4"]}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12.625L10.125 20.125L22 3.875" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></svg>')`};
            width: ${t.space["4"]};
            height: ${t.space["4"]};
            transform: scale(0);
            transition: transform 90ms ease-in-out;
          }
          
          &:checked::before {
            transform: scale(1);
          }
        `;case"switch":return`
          display: grid;
          place-content: center;
          transition: transform 150ms ease-in-out, filter 150ms ease-in-out;
          background-color: ${t.colors[e.mode].accent};
          filter: grayscale(1) brightness(1.5);
          
          &:hover {
            transform: translateY(-1px);
            filter: contrast(0.7);
          }
          
          &:active {
            transform: translateY(0px);
            filter: grayscale(1) brightness(1.5);
          }
          
          &:checked:hover {
            filter: grayscale(0) brightness(1.05);
          }
          
          &:checked:active {
            filter: grayscale(0) brightness(1);
          }
          
          &::before {
            content: '';
            background-color: ${t.colors.base.white};
            border-radius: ${t.radii.full};
            transform: translateX(-50%);
            transition: transform 90ms ease-in-out;
          }
          
          &:checked::before {
            transform: translateX(50%);
          }
          
          &:checked {
            filter: grayscale(0) brightness(1);
          }
        `;default:return""}}}

  ${({theme:e,color:o})=>{switch(o){case"grey":return`
          background-color: ${t.colors[e.mode].grey};
        `;case"white":return`
          background-color: white;
        `;default:return""}}}

  ${({variant:e,size:o})=>{if(e==="switch"&&o)switch(o){case"small":return`
            width: ${t.space["7"]};
        `;case"medium":return`
        `;case"large":return`
        `;default:return""}}}
`,Ce=r.forwardRef((y,w)=>{var V=y,{description:e,disabled:o,error:n,hideLabel:a,id:i,label:d,labelSecondary:u,name:s,required:m,tabIndex:b,value:g,checked:p,width:h,onBlur:k,onChange:x,onFocus:T,variant:B="regular",color:G="grey",size:L="small"}=V,E=N(V,["description","disabled","error","hideLabel","id","label","labelSecondary","name","required","tabIndex","value","checked","width","onBlur","onChange","onFocus","variant","color","size"]);const z=r.useRef(null),O=w||z;return r.createElement(A,{description:e,error:n,hideLabel:a,id:i,inline:!0,label:d,labelSecondary:u,required:m,width:h},r.createElement(ao,l({"aria-invalid":n?!0:void 0,"data-testid":"checkbox",ref:O,type:"checkbox"},l({color:G,variant:B,size:L,disabled:o,name:s,tabIndex:b,value:g,onBlur:k,onChange:x,onFocus:T,checked:p},E))))});Ce.displayName="Checkbox";const io=c.default.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;

  ${({theme:e})=>`
    color: ${t.colors[e.mode].accent};
  `}

  ${({theme:e,disabled:o})=>o&&`
    color: ${t.colors[e.mode].textPlaceholder};
  `}

  ${({size:e})=>{switch(e){case"small":return`
          height: ${t.space["16"]};
          width: ${t.space["16"]};
        `;case"large":return`
          font-size: ${t.fontSizes.extraLarge};
          margin-top: -${t.space["0.5"]};
          height: ${t.space["24"]};
          width: ${t.space["24"]};
        `;default:return""}}}
`,lo=c.default.div`
  ${({theme:e})=>`
    stroke: ${t.colors[e.mode].accent};
  `}

  ${({theme:e,color:o})=>`
    color: ${t.colors[e.mode][o]};
  `}

  ${({theme:e,disabled:o})=>o&&`
    color: ${t.colors[e.mode].foregroundSecondary};
  `}

  ${({size:e})=>{switch(e){case"small":return`
          height: ${t.space["16"]};
          width: ${t.space["16"]};
          stroke-width: ${t.space["1"]};
        `;case"large":return`
          height: ${t.space["24"]};
          width: ${t.space["24"]};
          stroke-width: ${t.space["1"]};
        `;default:return""}}}
`,co=c.default.circle`
  transition: all 1s linear, stroke-width 0.2s ease-in-out 1s;

  ${({finished:e})=>e&&"stroke-width: 0;"}
`,ve=r.forwardRef(({accessibilityLabel:e,color:o="textSecondary",size:n="small",countdownAmount:a,disabled:i,callback:d},u)=>{const[s,m]=r.useState(0),[b,g]=r.useState(0);return r.useEffect(()=>{if(m(a),!i){g(a);const p=setInterval(()=>{g(h=>(h===1&&(clearInterval(p),d&&d()),h-1?h-1:0))},1e3);return()=>clearInterval(p)}},[d,a,i]),r.createElement("div",{"data-testid":"countdown-circle",style:{position:"relative"}},r.createElement(io,{size:n,disabled:i},i?s:b),r.createElement(lo,{size:n,disabled:i,color:o,ref:u},e&&r.createElement(Z,null,e),r.createElement("svg",{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},r.createElement(co,{cx:"12",cy:"12",fill:"none",finished:b===0,r:"9",strokeDasharray:`${48*(b/s)}, 56`,strokeLinecap:"round"}),r.createElement("circle",{cx:"12",cy:"12",fill:"none",opacity:i?"1":"0.25",r:"9",strokeLinecap:"round"}))))});ve.displayName="CountdownCircle";const X=e=>r.createElement("svg",l({width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e),r.createElement("path",{d:"M11.2552 17.8659C11.6526 18.3095 12.3474 18.3095 12.7448 17.8659L22.5063 6.97001C23.0833 6.32597 22.6262 5.30274 21.7615 5.30274H2.2385C1.37381 5.30274 0.916704 6.32597 1.49369 6.97001L11.2552 17.8659Z",fill:"currentColor"})),so=c.default.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: ${t.radii.medium};
  position: absolute;

  ${({opened:e})=>e?`
    visibility: visible;
    opacity: 100;
  `:`
    z-index: 0;
    visibility: hidden;
    opacity: 0;
  `}

  ${({theme:e,inner:o})=>o?`
    background-color: ${t.colors[e.mode].grey};
    border-radius: ${t.radii.almostExtraLarge};
    border-top-radius: none;
    box-shadow: 0;
    border-width: ${t.space.px};
    border-top-width: 0;
    border-color: ${t.colors[e.mode].borderSecondary};
    padding-top: ${t.space["2.5"]};
    padding: 0 ${t.space["1.5"]};
    padding-bottom: ${t.space["1.5"]};
    margin-top: -${t.space["2.5"]};
    transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6);
  `:`
    padding: ${t.space["1.5"]};
    background-color: ${t.colors[e.mode].groupBackground};
    box-shadow: ${t.boxShadows[e.mode]["0.02"]};
    border-radius: ${t.radii["2xLarge"]};
  `}

  ${({opened:e,inner:o})=>{if(e&&!o)return`
      z-index: 20;
      margin-top: ${t.space["1.5"]};
      transition: all 0.3s cubic-bezier(1, 0, 0.22, 1.6), width 0s linear, z-index 0s linear 0.3s;
    `;if(!e&&!o)return`
        transition: all 0.3s cubic-bezier(1, 0, 0.22, 1.6), width 0s linear, z-index 0s linear 0s;
      `;if(e&&o)return`
        transition: all 0.35s cubic-bezier(1, 0, 0.22, 1.6), width 0s linear, z-index 0s linear 0.35s;
      `;if(!e&&o)return`
        transition: all 0.35s cubic-bezier(1, 0, 0.22, 1.6), width 0s linear, z-index 0s linear 0s;
      `}}

  ${({opened:e,shortThrow:o})=>{if(!e&&o)return`
      margin-top: -${t.space["2.5"]};
    `;if(!e&&!o)return`
      margin-top: -${t.space["12"]};
    `}}
`,uo=c.default.button`
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: ${t.space["4"]};
  width: ${t.space.full};
  height: ${t.space["12"]};
  padding: ${t.space["3"]};
  font-weight: ${t.fontWeights.semiBold};
  transition: 0.15s all ease-in-out;
  letter-spacing: -0.01em;

  &:active {
    transform: translateY(0px);
    filter: brightness(1);
  }

  ${({theme:e,color:o})=>`
    color: ${t.colors[e.mode][o||"accent"]};
  
    &:disabled {
      color: ${t.colors[e.mode].textTertiary}
    }
  `}

  ${({theme:e,inner:o})=>{if(o)return`
      justify-content: center;
    
      &:hover {
        color: ${t.colors[e.mode].accent};
      }
    `;if(!o)return`
      justify-content: flex-start;
      
      &:hover {
        transform: translateY(-1x);
        filter: brightness(1.05);
      }
    `}}

  ${({theme:e,inner:o,hasColor:n})=>{if(o&&!n)return`
      color: ${t.colors[e.mode].textSecondary};  
    `}}
`,mo=({items:e,setIsOpen:o,isOpen:n,width:a,inner:i,align:d,shortThrow:u,keepMenuOnTop:s})=>r.createElement(so,{opened:n,inner:i,align:d,shortThrow:u,style:{width:i||a&&parseInt(a)>100?`${a}px`:"150px",zIndex:s?100:void 0}},e.map(({label:m,color:b,disabled:g,onClick:p})=>r.createElement(uo,{inner:i,hasColor:!!b,color:b,disabled:g,key:m,onClick:()=>Promise.resolve(o(!1)).then(p)},m))),go=c.default.button`
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${t.space["4"]};
  border-width: ${t.space.px};
  font-weight: ${t.fontWeights.semiBold};
  cursor: pointer;
  position: relative;

  ${({theme:e})=>`
    border-color: ${t.colors[e.mode].borderSecondary};
  `}

  ${({size:e})=>{switch(e){case"small":return`
          padding: ${t.space["0.5"]} ${t.space["0.25"]};
        `;case"medium":return`
          padding: ${t.space["2.5"]} ${t.space["3.5"]};
        `;default:return""}}}

  ${({theme:e,open:o})=>{if(o)return`
      border-top-left-radius: ${t.radii.almostExtraLarge};
      border-top-right-radius: ${t.radii.almostExtraLarge};
      border-bottom-left-radius: none;
      border-bottom-right-radius: none;
      border-bottom-width: 0;
      background-color: ${t.colors[e.mode].grey};
      color: ${t.colors[e.mode].textTertiary};
      transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6), 0.3s color ease-in-out, 0.2s border-radius ease-in-out, 0s border-width 0.1s;
      
      &:hover {
        color: ${t.colors[e.mode].accent};
      }
      `;if(!o)return`
      background-color: ${t.colors[e.mode].background};
      color: ${t.colors[e.mode].textSecondary};
      border-radius: ${t.radii.almostExtraLarge};
      box-shadow: ${t.boxShadows[e.mode]["0.02"]};
      transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6), 0.15s color ease-in-out, 0s border-width 0.15s, 0.15s border-color ease-in-out;
      
      &:hover {
        border-color: ${t.colors[e.mode].border};
      }
      `}}
`,Xe=c.default(X)`
  margin-left: ${t.space["1"]};
  width: ${t.space["3"]};
  margin-right: ${t.space["0.5"]};
  transition-duration: ${t.transitionDuration["200"]};
  transition-property: all;
  transition-timing-function: ${t.transitionTimingFunction.inOut};
  opacity: 0.3;
  transform: rotate(0deg);
  display: flex;

  & > svg {
    fill: currentColor;
  }
  fill: currentColor;

  ${({open:e})=>e&&`
      opacity: 1;
      transform: rotate(180deg);
  `}
`,le=({children:e,buttonProps:o,items:n=[],inner:a=!1,chevron:i=!0,align:d="left",shortThrow:u=!1,keepMenuOnTop:s=!1,size:m="medium",label:b})=>{const g=r.useRef(),[p,h]=r.useState(!1),k=x=>{g.current&&!g.current.contains(x.target)&&h(!1)};return r.useEffect(()=>(p?document.addEventListener("mousedown",k):document.removeEventListener("mousedown",k),()=>{document.removeEventListener("mousedown",k)}),[g,p]),r.createElement("div",{"data-testid":"dropdown",ref:g,style:{maxWidth:t.space.max,position:"relative"}},!e&&a&&r.createElement(go,{open:p,size:m,onClick:()=>h(!p)},b,i&&r.createElement(Xe,{open:p})),!e&&!a&&r.createElement(ae,H(l({},o),{pressed:p,suffix:i&&r.createElement(Xe,{open:p}),zIndex:"10",onClick:()=>h(!p)}),b),r.Children.map(e,x=>{if(r.isValidElement(x))return r.cloneElement(x,H(l({},o),{zindex:10,onClick:()=>h(!p)}))}),r.createElement(mo,{width:g.current&&g.current.getBoundingClientRect().width.toFixed(2),align:d,inner:a,isOpen:p,items:n,setIsOpen:h,shortThrow:u,keepMenuOnTop:s}))};le.displayName="Dropdown";const po=c.default.fieldset`
  display: flex;
  flex-direction: column;
  gap: ${t.space["4"]};
`,fo=c.default.div`
  display: flex;
  flex-direction: column;
  gap: ${t.space["1"]};
  padding: 0 ${t.space["4"]};
`,ho=c.default.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: ${t.space["3"]};
`,$o=c.default.div`
  ${({theme:e})=>`
    color: ${t.colors[e.mode].textSecondary};
    font-size: ${t.fontSizes.base};
  `}
`,bo=c.default.div`
  display: flex;
  flex-direction: column;
  gap: ${t.space["4"]};
`,Je=({children:e,description:o,disabled:n,form:a,legend:i,name:d,status:u})=>{let s,m;switch(u){case"complete":{s="Complete",m="green";break}case"required":case"pending":{s=u==="pending"?"Pending":"Required",m="accent";break}case"optional":{s="Optional",m="secondary";break}}return typeof u=="object"&&(s=u.name,m=u.tone),r.createElement(po,{disabled:n,form:a,name:d},r.createElement(fo,null,r.createElement(ho,null,r.createElement(he,{as:"legend",level:"2",responsive:!0},i),m&&s&&r.createElement(be,{tone:m},s)),r.createElement($o,null,o)),r.createElement(bo,null,e))},ke=c.default.div`
  ${({theme:e})=>`
    background-color: ${t.colors[e.mode].backgroundSecondary};
    border-radius: ${t.radii["2xLarge"]};
    border-width: ${t.space["0.75"]};
    border-color: ${t.colors.base.transparent};
    color: ${t.colors[e.mode].text};
    display: flex;
    transition-duration: ${t.transitionDuration["150"]};
    transition-property: colors;
    transition-timing-function: ${t.transitionTimingFunction.inOut};
    
    &:focus-within {
      border-color: ${t.colors[e.mode].accentSecondary};
    }
  `}

  ${({theme:e,disabled:o})=>o&&`
      border-color: ${t.colors[e.mode].foregroundSecondary};
      background-color: ${t.colors[e.mode].background};
  `}

  ${({theme:e,error:o})=>o&&`
      border-color: ${t.colors[e.mode].red};
      cursor: default;
      
      &:focus-within {
        border-color: ${t.colors[e.mode].red};
      }
  `}

  ${({suffix:e})=>e&&`
      height: ${t.space["16"]};
  `}

  ${({size:e})=>{switch(e){case"medium":return`
          height: ${t.space["14"]};
        `;case"large":return`
          height: ${t.space["16"]};
        `;case"extraLarge":return`
          height: ${t.space["18"]};
        `;default:return""}}}
  ${({userStyles:e})=>e}
`,wo=c.default.label`
  align-items: center;
  display: flex;
  height: ${t.space.full};
  line-height: normal;
  color: inherit;
  font-family: ${t.fonts.sans};
  font-weight: ${t.fontWeights.medium};
  padding-left: ${t.space["4"]};
  padding-right: ${t.space["2"]};
`,Co=c.default.label`
  align-items: center;
  display: flex;
  height: ${t.space.full};
  line-height: normal;
  color: inherit;
  font-family: ${t.fonts.sans};
  font-weight: ${t.fontWeights.medium};
  padding-left: ${t.space["2"]};
  padding-right: ${t.space["2"]};
`,vo=c.default.div`
  overflow: hidden;
  position: relative;
  width: ${t.space.full};
`,ko=c.default.input`
  ${({theme:e})=>`
    background-color: ${t.colors.base.transparent};
    position: relative;
    width: ${t.space.full};
    height: ${t.space.full};
    padding: 0 ${t.space["4"]};
    font-weight: ${t.fontWeights.medium};
    
    &::placeholder {
        color: ${t.colors[e.mode].textPlaceholder};
        font-weight: ${t.fontWeights.bold};
    }
  `}

  ${({disabled:e})=>e&&`
        opacity ${t.opacity["50"]};
        cursor: not-allowed;
  `}

  ${({type:e})=>e==="number"&&`
        font-feature-settings: 'kern' 1,  'tnum' 1, 'calt' 0;
        font-variant-numeric: tabular-nums;
  `}

  ${({size:e})=>{switch(e){case"medium":return`
          font-size: ${t.fontSizes.base};
        `;case"large":return`
          font-size: ${t.fontSizes.large};
        `;case"extraLarge":return`
          font-size: ${t.fontSizes.headingThree};
          padding: 0 ${t.space["6"]};
        `;default:return""}}}
`,yo=c.default.div`
  border-color: ${t.colors.base.transparent};
  inset: 0;
  position: absolute;
  pointer-events: none;
  white-space: pre;
  line-height: normal;

  ${({type:e})=>e==="number"&&`
        font-feature-settings: 'kern' 1,  'tnum' 1, 'calt' 0;
        font-variant-numeric: tabular-nums;
  `}
`,xo=c.default.span`
  ${({theme:e})=>`
    color: ${t.colors[e.mode].text};
  `}
`,So=c.default.div`
  display: flex;
  align-items: center;
  ${({suffix:e})=>e&&`padding-right: ${t.space["4"]};`}
`,Eo=c.default.button`
  ${({theme:e})=>`
      background-color: ${t.colors[e.mode].foregroundSecondary};
      border-radius: ${t.radii.medium};
      color: ${t.colors[e.mode].textSecondary};
      cursor: pointer;
      font-size: ${t.fontSizes.label};
      font-weight: ${t.fontWeights.semiBold};
      height: ${t.space.max};
      line-height: none;
      padding: ${t.space["2"]};
      text-transform: uppercase;
      transition-duration: ${t.transitionDuration["150"]};
      transition-property: colors;
      transition-timing-function: ${t.transitionTimingFunction.inOut};
      visibility: hidden;
      
      &:hover {
        color: ${t.colors[e.mode].text};
      }
      
      ${ke}:hover & {
        visibility: visible;
      }
      
      ${ke}:focus-within & {
        visibility: visible;
      }
  `}
`,ye=r.forwardRef((S,$)=>{var R=S,{autoFocus:e,autoComplete:o,autoCorrect:n,defaultValue:a,description:i,disabled:d,error:u,hideLabel:s,id:m,inputMode:b,label:g,labelSecondary:p,name:h,placeholder:k,prefix:x,readOnly:T,required:B,spellCheck:G,suffix:L,tabIndex:E,type:w="text",units:y,value:V,width:z,onBlur:O,onChange:W,onFocus:f,onKeyDown:j,size:F="medium",parentStyles:se}=R,Q=N(R,["autoFocus","autoComplete","autoCorrect","defaultValue","description","disabled","error","hideLabel","id","inputMode","label","labelSecondary","name","placeholder","prefix","readOnly","required","spellCheck","suffix","tabIndex","type","units","value","width","onBlur","onChange","onFocus","onKeyDown","size","parentStyles"]);const nr=r.useRef(null),ee=$||nr,[Me,Te]=r.useState({ghostValue:V||a}),ar=k?`${k!=null?k:""}${y?` ${y}`:""}`:void 0,Ge=u?!0:void 0,Y=Q.max,Re=w==="number"?"number":"text",ir=r.useCallback(M=>{const U=M.target.value;Te(Be=>H(l({},Be),{ghostValue:U}))},[]),lr=r.useCallback(M=>{if(w==="number"){const U=M.key;["E","e","+"].includes(U)&&M.preventDefault()}j&&j(M)},[w,j]),cr=r.useCallback(M=>{var U;(U=M.target)==null||U.blur()},[]),sr=r.useCallback(()=>{W?W({target:{value:Y}}):ee.current&&(ee.current.value=Y),!!y&&Te(M=>H(l({},M),{ghostValue:Y}))},[ee,Y,y,W]);return r.createElement(A,{description:i,error:u,hideLabel:s,id:m,label:g,labelSecondary:p,required:B,width:z},M=>r.createElement(ke,{disabled:d,error:Ge,suffix:L!==void 0,size:F,userStyles:se},x&&r.createElement(wo,l({"aria-hidden":"true"},M==null?void 0:M.label),x),r.createElement(vo,null,r.createElement(ko,l(l({"aria-invalid":Ge,autoComplete:o,autoCorrect:n,autoFocus:e,defaultValue:a,disabled:d,inputMode:b,name:h,placeholder:ar,readOnly:T,ref:ee,size:F,spellCheck:G,tabIndex:E,type:Re,value:V,onBlur:O,onChange:W,onFocus:f,onInput:ir,onKeyDown:w==="number"?lr:j,onWheel:w==="number"?cr:void 0},Q),M==null?void 0:M.content)),y&&Me.ghostValue&&r.createElement(yo,{"aria-hidden":"true","data-testid":"ghost",type:Re},r.createElement("span",{style:{visibility:"hidden"}},Me.ghostValue," "),r.createElement(xo,null,y))),Y&&r.createElement(So,{suffix:L},r.createElement(Eo,{onClick:sr},"Max")),L&&r.createElement(Co,l({"aria-hidden":"true"},M==null?void 0:M.label),L)))});ye.displayName="Input";const Qe=e=>r.createElement("svg",l({width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e),r.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12C24 8.8174 22.7357 5.76516 20.4853 3.51472C18.2348 1.26428 15.1826 0 12 0C8.8174 0 5.76516 1.26428 3.51472 3.51472C1.26428 5.76516 0 8.8174 0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853C5.76516 22.7357 8.8174 24 12 24ZM17.5605 10.9395L13.0605 6.4395C12.7776 6.16626 12.3987 6.01507 12.0054 6.01849C11.6121 6.02191 11.2359 6.17966 10.9578 6.45777C10.6797 6.73588 10.5219 7.1121 10.5185 7.5054C10.5151 7.89869 10.6663 8.2776 10.9395 8.5605L12.879 10.5H7.5C7.10218 10.5 6.72064 10.658 6.43934 10.9393C6.15804 11.2206 6 11.6022 6 12C6 12.3978 6.15804 12.7794 6.43934 13.0607C6.72064 13.342 7.10218 13.5 7.5 13.5H12.879L10.9395 15.4395C10.7962 15.5779 10.682 15.7434 10.6033 15.9264C10.5247 16.1094 10.4834 16.3062 10.4816 16.5054C10.4799 16.7046 10.5178 16.9021 10.5933 17.0864C10.6687 17.2708 10.7801 17.4383 10.9209 17.5791C11.0617 17.7199 11.2292 17.8313 11.4136 17.9067C11.5979 17.9822 11.7954 18.0201 11.9946 18.0184C12.1938 18.0166 12.3906 17.9753 12.5736 17.8967C12.7566 17.818 12.9221 17.7038 13.0605 17.5605L17.5605 13.0605C17.8417 12.7792 17.9997 12.3977 17.9997 12C17.9997 11.6023 17.8417 11.2208 17.5605 10.9395Z",fill:"black"})),et=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M14 5l7 7m0 0l-7 7m7-7H3"})),tt=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 10l7-7m0 0l7 7m-7-7v18"})),rt=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"})),ot=e=>r.createElement("svg",l({width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e),r.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12C24 8.8174 22.7357 5.76516 20.4853 3.51472C18.2348 1.26428 15.1826 0 12 0C8.8174 0 5.76516 1.26428 3.51472 3.51472C1.26428 5.76516 0 8.8174 0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853C5.76516 22.7357 8.8174 24 12 24ZM10.0605 7.9395C9.7776 7.66626 9.39869 7.51507 9.0054 7.51849C8.6121 7.52191 8.23588 7.67966 7.95777 7.95777C7.67966 8.23588 7.52191 8.6121 7.51849 9.0054C7.51507 9.39869 7.66626 9.7776 7.9395 10.0605L9.879 12L7.9395 13.9395C7.79624 14.0779 7.68196 14.2434 7.60335 14.4264C7.52473 14.6094 7.48336 14.8062 7.48162 15.0054C7.47989 15.2046 7.51785 15.4021 7.59327 15.5864C7.66869 15.7708 7.78007 15.9383 7.92091 16.0791C8.06175 16.2199 8.22922 16.3313 8.41357 16.4067C8.59791 16.4822 8.79543 16.5201 8.9946 16.5184C9.19377 16.5166 9.3906 16.4753 9.57361 16.3967C9.75661 16.318 9.92213 16.2038 10.0605 16.0605L12 14.121L13.9395 16.0605C14.2224 16.3337 14.6013 16.4849 14.9946 16.4815C15.3879 16.4781 15.7641 16.3203 16.0422 16.0422C16.3203 15.7641 16.4781 15.3879 16.4815 14.9946C16.4849 14.6013 16.3337 14.2224 16.0605 13.9395L14.121 12L16.0605 10.0605C16.3337 9.7776 16.4849 9.39869 16.4815 9.0054C16.4781 8.6121 16.3203 8.23588 16.0422 7.95777C15.7641 7.67966 15.3879 7.52191 14.9946 7.51849C14.6013 7.51507 14.2224 7.66626 13.9395 7.9395L12 9.879L10.0605 7.9395Z",fill:"black"})),nt=e=>r.createElement("svg",l({width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e),r.createElement("path",{d:"M2 12.625L10.125 20.125L22 3.875",stroke:"currentColor",strokeWidth:3,strokeLinecap:"round",strokeLinejoin:"round"})),at=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 9l-7 7-7-7"})),it=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 19l-7-7 7-7"})),lt=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 5l7 7-7 7"})),ct=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 15l7-7 7 7"})),xe=e=>r.createElement("svg",l({width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e),r.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M0.584985 0.610577C0.959663 0.235635 1.46777 0.0250036 1.99756 0.0250036C2.52736 0.0250036 3.03546 0.235635 3.41014 0.610577L11.9875 9.19658L20.5649 0.610577C20.7492 0.419556 20.9697 0.267192 21.2134 0.162374C21.4572 0.0575557 21.7194 0.00238315 21.9846 7.55141e-05C22.2499 -0.00223212 22.513 0.0483709 22.7586 0.148933C23.0041 0.249494 23.2272 0.398001 23.4148 0.585786C23.6024 0.773571 23.7508 0.996876 23.8512 1.24267C23.9517 1.48846 24.0022 1.75182 23.9999 2.01738C23.9976 2.28294 23.9425 2.54538 23.8378 2.78938C23.7331 3.03339 23.5809 3.25408 23.39 3.43858L14.8127 12.0246L23.39 20.6106C23.754 20.9878 23.9554 21.493 23.9508 22.0174C23.9463 22.5418 23.7361 23.0434 23.3657 23.4142C22.9953 23.785 22.4941 23.9954 21.9703 23.9999C21.4464 24.0045 20.9417 23.8029 20.5649 23.4386L11.9875 14.8526L3.41014 23.4386C3.03332 23.8029 2.52862 24.0045 2.00475 23.9999C1.48089 23.9954 0.979766 23.785 0.609323 23.4142C0.238879 23.0434 0.0287522 22.5418 0.0241999 22.0174C0.0196477 21.493 0.221035 20.9878 0.584985 20.6106L9.16235 12.0246L0.584985 3.43858C0.210419 3.06352 0 2.5549 0 2.02458C0 1.49425 0.210419 0.985632 0.584985 0.610577V0.610577Z",fill:"black"})),st=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"})),dt=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"}),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"})),ut=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"})),mt=e=>r.createElement("svg",l({width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e),r.createElement("path",{d:"M6.85715 10.2857C6.85715 9.3764 7.21837 8.50433 7.86135 7.86135C8.50433 7.21837 9.3764 6.85715 10.2857 6.85715H20.5714C21.4807 6.85715 22.3528 7.21837 22.9958 7.86135C23.6388 8.50433 24 9.3764 24 10.2857V20.5714C24 21.4807 23.6388 22.3528 22.9958 22.9958C22.3528 23.6388 21.4807 24 20.5714 24H10.2857C9.3764 24 8.50433 23.6388 7.86135 22.9958C7.21837 22.3528 6.85715 21.4807 6.85715 20.5714V10.2857Z",fill:"black"}),r.createElement("path",{d:"M3.42857 0C2.51926 0 1.64719 0.361223 1.00421 1.00421C0.361223 1.64719 0 2.51926 0 3.42857V13.7143C0 14.6236 0.361223 15.4957 1.00421 16.1387C1.64719 16.7816 2.51926 17.1429 3.42857 17.1429V6.42857C3.42857 4.77172 4.77172 3.42857 6.42857 3.42857H17.1429C17.1429 2.51926 16.7816 1.64719 16.1387 1.00421C15.4957 0.361223 14.6236 0 13.7143 0H3.42857Z",fill:"black"})),gt=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"})),pt=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"})),ft=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"})),ht=e=>r.createElement("svg",l({viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em"},e),r.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M6.41439 13.6844L12.0452 21.7082C12.1448 21.8501 12.3551 21.8501 12.4546 21.7081L18.0764 13.6884L12.4479 16.1153L12.25 16.2007L12.052 16.1153L6.41439 13.6844ZM6.12744 12.4717L12.25 15.1117L18.3441 12.4839L12.4655 2.37075C12.3693 2.20517 12.1302 2.20487 12.0336 2.3702L6.12744 12.4717Z",fill:"black"})),$t=e=>r.createElement("svg",l({width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e),r.createElement("path",{d:"M11.998 0V8.87185L19.4236 12.2225L11.998 0Z",fill:"black",fillOpacity:.8}),r.createElement("path",{d:"M11.998 0L4.57143 12.2225L11.998 8.87185V0Z",fill:"black",fillOpacity:.4}),r.createElement("path",{d:"M11.998 17.9717V24L19.4286 13.6188L11.998 17.9717Z",fill:"black",fillOpacity:.8}),r.createElement("path",{d:"M11.998 24V17.9707L4.57143 13.6188L11.998 24Z",fill:"black",fillOpacity:.4}),r.createElement("path",{d:"M11.998 16.5765L19.4236 12.2226L11.998 8.87386V16.5765Z",fill:"black"}),r.createElement("path",{d:"M4.57143 12.2226L11.998 16.5765V8.87386L4.57143 12.2226Z",fill:"black",fillOpacity:.8})),bt=e=>r.createElement("svg",l({width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e),r.createElement("path",{d:"M11.998 0V8.87185L19.4236 12.2225L11.998 0Z",fill:"black",fillOpacity:.602}),r.createElement("path",{d:"M11.998 0L4.57143 12.2225L11.998 8.87185V0Z",fill:"black"}),r.createElement("path",{d:"M11.998 17.9717V24L19.4286 13.6188L11.998 17.9717Z",fill:"black",fillOpacity:.602}),r.createElement("path",{d:"M11.998 24V17.9707L4.57143 13.6188L11.998 24Z",fill:"black"}),r.createElement("path",{d:"M11.998 16.5765L19.4236 12.2226L11.998 8.87386V16.5765Z",fill:"black",fillOpacity:.2}),r.createElement("path",{d:"M4.57143 12.2226L11.998 16.5765V8.87386L4.57143 12.2226Z",fill:"black",fillOpacity:.602})),wt=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"})),Ct=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"})),vt=e=>r.createElement("svg",l({width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e),r.createElement("rect",{width:24,height:24,fill:"url(#paint0_linear_2_3)"}),r.createElement("defs",null,r.createElement("linearGradient",{id:"paint0_linear_2_3",x1:15.986,y1:26.8444,x2:-7.34084,y2:-14.214,gradientUnits:"userSpaceOnUse"},r.createElement("stop",{stopColor:"#44BCF0"}),r.createElement("stop",{offset:.378795,stopColor:"#7298F8"}),r.createElement("stop",{offset:1,stopColor:"#A099FF"})))),kt=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"})),yt=e=>r.createElement("svg",l({viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em"},e),r.createElement("path",{d:"M4.85714 2C4.09938 2 3.37266 2.30102 2.83684 2.83684C2.30102 3.37266 2 4.09938 2 4.85714V7.71429C2 8.47205 2.30102 9.19877 2.83684 9.73459C3.37266 10.2704 4.09938 10.5714 4.85714 10.5714H7.71429C8.47205 10.5714 9.19877 10.2704 9.73459 9.73459C10.2704 9.19877 10.5714 8.47205 10.5714 7.71429V4.85714C10.5714 4.09938 10.2704 3.37266 9.73459 2.83684C9.19877 2.30102 8.47205 2 7.71429 2H4.85714ZM4.85714 13.4286C4.09938 13.4286 3.37266 13.7296 2.83684 14.2654C2.30102 14.8012 2 15.528 2 16.2857V19.1429C2 19.9006 2.30102 20.6273 2.83684 21.1632C3.37266 21.699 4.09938 22 4.85714 22H7.71429C8.47205 22 9.19877 21.699 9.73459 21.1632C10.2704 20.6273 10.5714 19.9006 10.5714 19.1429V16.2857C10.5714 15.528 10.2704 14.8012 9.73459 14.2654C9.19877 13.7296 8.47205 13.4286 7.71429 13.4286H4.85714ZM13.4286 4.85714C13.4286 4.09938 13.7296 3.37266 14.2654 2.83684C14.8012 2.30102 15.528 2 16.2857 2H19.1429C19.9006 2 20.6273 2.30102 21.1632 2.83684C21.699 3.37266 22 4.09938 22 4.85714V7.71429C22 8.47205 21.699 9.19877 21.1632 9.73459C20.6273 10.2704 19.9006 10.5714 19.1429 10.5714H16.2857C15.528 10.5714 14.8012 10.2704 14.2654 9.73459C13.7296 9.19877 13.4286 8.47205 13.4286 7.71429V4.85714ZM13.4286 16.2857C13.4286 15.528 13.7296 14.8012 14.2654 14.2654C14.8012 13.7296 15.528 13.4286 16.2857 13.4286H19.1429C19.9006 13.4286 20.6273 13.7296 21.1632 14.2654C21.699 14.8012 22 15.528 22 16.2857V19.1429C22 19.9006 21.699 20.6273 21.1632 21.1632C20.6273 21.699 19.9006 22 19.1429 22H16.2857C15.528 22 14.8012 21.699 14.2654 21.1632C13.7296 20.6273 13.4286 19.9006 13.4286 19.1429V16.2857Z",fill:"black"})),xt=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"})),St=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"})),Et=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 6h16M4 10h16M4 14h16M4 18h16"})),Lt=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"})),Vt=e=>r.createElement("svg",l({width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e),r.createElement("path",{d:"M4.00058 9.70969C4.23776 10.2167 4.82477 11.2188 4.82477 11.2188L11.611 0L4.98783 4.62508C4.59318 4.88836 4.2694 5.24473 4.04505 5.66275C3.7434 6.29338 3.58313 6.98229 3.57545 7.68131C3.56777 8.38033 3.71286 9.07259 4.00058 9.70969Z",fill:"#5298FF"}),r.createElement("path",{d:"M1.31159 13.4038C1.38637 14.477 1.68956 15.5217 2.20086 16.4682C2.71216 17.4146 3.41976 18.2409 4.27629 18.8917L11.6021 24C11.6021 24 7.01863 17.3944 3.15267 10.8215C2.76128 10.1271 2.49816 9.36782 2.37592 8.58011C2.3218 8.22341 2.3218 7.86059 2.37592 7.50389C2.27512 7.69068 2.07945 8.07313 2.07945 8.07313C1.68745 8.87262 1.42049 9.72754 1.28787 10.608C1.21154 11.5388 1.21948 12.4745 1.31159 13.4038Z",fill:"#5298FF"}),r.createElement("path",{d:"M20.0011 14.2903C19.7639 13.7833 19.1769 12.7812 19.1769 12.7812L12.3907 24L19.0138 19.3779C19.4085 19.1146 19.7322 18.7582 19.9566 18.3402C20.2587 17.7092 20.4192 17.0198 20.4269 16.3202C20.4346 15.6206 20.2892 14.9278 20.0011 14.2903Z",fill:"#5298FF"}),r.createElement("path",{d:"M22.69 10.5962C22.6153 9.52304 22.3121 8.47827 21.8008 7.53183C21.2895 6.58539 20.5819 5.75911 19.7253 5.10834L12.3996 0C12.3996 0 16.98 6.60556 20.849 13.1785C21.2393 13.8731 21.5014 14.6324 21.6227 15.4199C21.6769 15.7766 21.6769 16.1394 21.6227 16.4961C21.7235 16.3093 21.9192 15.9269 21.9192 15.9269C22.3112 15.1274 22.5782 14.2725 22.7108 13.392C22.7881 12.4613 22.7812 11.5256 22.69 10.5962Z",fill:"#5298FF"}),r.createElement("path",{d:"M4.04505 5.66275C4.2694 5.24473 4.59318 4.88836 4.98783 4.62508L11.611 0L4.82476 11.2217C4.82476 11.2217 4.23182 10.2196 4.00057 9.71266C3.7124 9.07515 3.56707 8.38236 3.57475 7.68278C3.58243 6.98321 3.74296 6.29378 4.04505 5.66275ZM1.31159 13.4038C1.38637 14.477 1.68956 15.5217 2.20086 16.4682C2.71216 17.4146 3.41976 18.2409 4.27629 18.8917L11.6021 24C11.6021 24 7.01863 17.3944 3.15267 10.8215C2.76128 10.1271 2.49816 9.36782 2.37592 8.58011C2.3218 8.22341 2.3218 7.86059 2.37592 7.50389C2.27512 7.69068 2.07945 8.07313 2.07945 8.07313C1.68745 8.87262 1.42049 9.72754 1.28787 10.608C1.21154 11.5388 1.21948 12.4745 1.31159 13.4038ZM19.9892 14.2933C19.752 13.7863 19.165 12.7842 19.165 12.7842L12.3907 24L19.0138 19.3779C19.4085 19.1146 19.7322 18.7582 19.9566 18.3402C20.2587 17.7092 20.4192 17.0198 20.4269 16.3202C20.4346 15.6206 20.2892 14.9278 20.0011 14.2903L19.9892 14.2933ZM22.6782 10.5991C22.6034 9.526 22.3002 8.48124 21.7889 7.53479C21.2776 6.58835 20.57 5.76208 19.7135 5.1113L12.3996 0C12.3996 0 16.98 6.60556 20.849 13.1785C21.2393 13.8731 21.5014 14.6324 21.6227 15.4199C21.6769 15.7766 21.6769 16.1394 21.6227 16.4961C21.7235 16.3093 21.9192 15.9269 21.9192 15.9269C22.3112 15.1274 22.5782 14.2725 22.7108 13.392C22.7881 12.4613 22.7812 11.5256 22.69 10.5962L22.6782 10.5991Z",fill:"#5298FF"})),Mt=e=>r.createElement("svg",l({width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e),r.createElement("path",{d:"M1.5 3.1579H22.5",stroke:"black",strokeWidth:3,strokeLinecap:"round"}),r.createElement("path",{d:"M1.5 12H22.5",stroke:"black",strokeWidth:3,strokeLinecap:"round"}),r.createElement("path",{d:"M1.5 20.8421H22.5",stroke:"black",strokeWidth:3,strokeLinecap:"round"})),Tt=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"})),Gt=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"})),Rt=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 4v16m8-8H4"})),Bt=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 6v6m0 0v6m0-6h6m-6 0H6"})),zt=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"})),Ht=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})),jt=e=>r.createElement("svg",l({viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{d:"M21 3.00006L15 9.00006L12 12.0001H3M15 3.00006H21H15ZM21 3.00006V9.00006V3.00006Z",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"}),r.createElement("path",{d:"M21 21.0001L15 15.0001M15 21.0001H21H15ZM21 21.0001V15.0001V21.0001Z",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"})),Ot=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"})),Wt=e=>r.createElement("svg",l({width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e),r.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M10 5C9.34339 5 8.69321 5.12933 8.08658 5.3806C7.47995 5.63188 6.92876 6.00017 6.46447 6.46447C6.00017 6.92876 5.63188 7.47995 5.3806 8.08658C5.12933 8.69321 5 9.34339 5 10C5 10.6566 5.12933 11.3068 5.3806 11.9134C5.63188 12.52 6.00017 13.0712 6.46447 13.5355C6.63214 13.7032 6.81114 13.8584 7 14C7 13.0807 7.18106 12.1705 7.53284 11.3212C7.88463 10.4719 8.40024 9.70026 9.05025 9.05025C9.70026 8.40024 10.4719 7.88463 11.3212 7.53284C12.1705 7.18106 13.0807 7 14 7C14 7 14 7 14 7C13.8589 6.81181 13.7038 6.63276 13.5355 6.46447C12.5979 5.52678 11.3261 5 10 5ZM16.5277 7.47231C16.1793 6.57251 15.6452 5.74574 14.9497 5.05025C13.637 3.7375 11.8565 3 10 3C9.08075 3 8.1705 3.18106 7.32122 3.53284C6.47194 3.88463 5.70026 4.40024 5.05025 5.05025C4.40024 5.70026 3.88463 6.47194 3.53284 7.32122C3.18106 8.1705 3 9.08075 3 10C3 10.9193 3.18106 11.8295 3.53284 12.6788C3.88463 13.5281 4.40024 14.2997 5.05025 14.9497C5.70026 15.5998 6.47194 16.1154 7.32122 16.4672C7.37137 16.4879 7.42174 16.5081 7.47231 16.5277C7.49189 16.5783 7.51207 16.6286 7.53284 16.6788C7.88463 17.5281 8.40024 18.2997 9.05025 18.9497C9.70026 19.5998 10.4719 20.1154 11.3212 20.4672C12.1705 20.8189 13.0807 21 14 21C15.8565 21 17.637 20.2625 18.9497 18.9497C20.2625 17.637 21 15.8565 21 14C21 12.1435 20.2625 10.363 18.9497 9.05025C18.2543 8.35477 17.4275 7.82074 16.5277 7.47231ZM12.0866 9.3806C12.6932 9.12933 13.3434 9 14 9C15.3261 9 16.5979 9.52678 17.5355 10.4645C18.4732 11.4021 19 12.6739 19 14C19 15.3261 18.4732 16.5979 17.5355 17.5355C16.5979 18.4732 15.3261 19 14 19C13.3434 19 12.6932 18.8707 12.0866 18.6194C11.48 18.3681 10.9288 17.9998 10.4645 17.5355C10.0002 17.0712 9.63188 16.52 9.3806 15.9134C9.12933 15.3068 9 14.6566 9 14C9 13.3434 9.12933 12.6932 9.3806 12.0866C9.63188 11.48 10.0002 10.9288 10.4645 10.4645C10.9288 10.0002 11.48 9.63188 12.0866 9.3806Z",fill:"black"})),Ft=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"})),Dt=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"})),It=e=>r.createElement("svg",l({viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em"},e),r.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M12 10.4C12.7956 10.4 13.5587 10.0629 14.1213 9.46274C14.6839 8.86263 15 8.04869 15 7.2C15 6.35131 14.6839 5.53737 14.1213 4.93726C13.5587 4.33714 12.7956 4 12 4C11.2044 4 10.4413 4.33714 9.87868 4.93726C9.31607 5.53737 9 6.35131 9 7.2C9 8.04869 9.31607 8.86263 9.87868 9.46274C10.4413 10.0629 11.2044 10.4 12 10.4ZM5 20C5 19.0195 5.18106 18.0485 5.53284 17.1426C5.88463 16.2367 6.40024 15.4136 7.05025 14.7203C7.70026 14.0269 8.47194 13.4769 9.32122 13.1017C10.1705 12.7265 11.0807 12.5333 12 12.5333C12.9193 12.5333 13.8295 12.7265 14.6788 13.1017C15.5281 13.4769 16.2997 14.0269 16.9497 14.7203C17.5998 15.4136 18.1154 16.2367 18.4672 17.1426C18.8189 18.0485 19 19.0195 19 20H5Z",fill:"black"})),Zt=e=>r.createElement("svg",l({viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em"},e),r.createElement("path",{d:"M11 8C11 8.79565 10.6839 9.55871 10.1213 10.1213C9.55871 10.6839 8.79565 11 8 11C7.20435 11 6.44129 10.6839 5.87868 10.1213C5.31607 9.55871 5 8.79565 5 8C5 7.20435 5.31607 6.44129 5.87868 5.87868C6.44129 5.31607 7.20435 5 8 5C8.79565 5 9.55871 5.31607 10.1213 5.87868C10.6839 6.44129 11 7.20435 11 8ZM19 8C19 8.39397 18.9224 8.78407 18.7716 9.14805C18.6209 9.51203 18.3999 9.84274 18.1213 10.1213C17.8427 10.3999 17.512 10.6209 17.1481 10.7716C16.7841 10.9224 16.394 11 16 11C15.606 11 15.2159 10.9224 14.8519 10.7716C14.488 10.6209 14.1573 10.3999 13.8787 10.1213C13.6001 9.84274 13.3791 9.51203 13.2284 9.14805C13.0776 8.78407 13 8.39397 13 8C13 7.20435 13.3161 6.44129 13.8787 5.87868C14.4413 5.31607 15.2044 5 16 5C16.7956 5 17.5587 5.31607 18.1213 5.87868C18.6839 6.44129 19 7.20435 19 8ZM14.93 19C14.976 18.673 15 18.34 15 18C15.0023 16.4289 14.4737 14.903 13.5 13.67C14.2601 13.2312 15.1223 13.0001 16 13.0001C16.8776 13.0001 17.7399 13.2311 18.4999 13.67C19.26 14.1088 19.8912 14.74 20.3301 15.5C20.7689 16.2601 21 17.1223 21 18V19H14.93ZM8 13C9.32608 13 10.5979 13.5268 11.5355 14.4645C12.4732 15.4021 13 16.6739 13 18V19H3V18C3 16.6739 3.52678 15.4021 4.46447 14.4645C5.40215 13.5268 6.67392 13 8 13Z",fill:"black"})),Pt=e=>r.createElement("svg",l({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em"},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"})),Lo=c.default.div`
  display: flex;
  flex-direction: row;
`,Vo=c.default(xe)`
  height: ${t.space["6"]};
  width: ${t.space["6"]};
  margin-top: -${t.space["6"]};
  opacity: ${t.opacity["30"]};
  cursor: pointer;
  padding: ${t.space["1.25"]};
  transition-propery: all;
  transition-duration: ${t.transitionDuration["150"]};
  transition-timing-function: ${t.transitionTimingFunction.inOut};

  &:hover {
    opacity: 0.5;
  }
`,Se=d=>{var u=d,{children:e,backdropSurface:o,onDismiss:n,open:a}=u,i=N(u,["children","backdropSurface","onDismiss","open"]);return r.createElement(we,{open:a,onDismiss:n,surface:o},r.createElement(Lo,null,r.createElement(ge,l({},i),e),n&&r.createElement(Vo,{"data-testid":"close-icon",onClick:n})))},Mo=(e="",o=10,n=5,a=5)=>e.length<o?e:`${e.slice(0,n)}...${e.slice(-a)}`,_t=c.default.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-radius: ${t.radii.full};
  transition-duration: ${t.transitionDuration["150"]};
  transition-property: colors;
  transition-timing-function: ${t.transitionTimingFunction.inOut};
  position: relative;
  z-index: 10;
  padding: ${t.space["2"]} ${t.space["4"]} ${t.space["2"]}
    ${t.space["2.5"]};

  ${({hasChevron:e})=>e&&`
      cursor: pointer;
      &:hover {
        transform: translateY(-1px);s
        filter: brightness(1.05);
      }
  `}

  ${({open:e,theme:o})=>e?`
      box-shadow: ${t.shadows["0"]};
      background-color: ${t.colors[o.mode].foregroundSecondary};
  `:`
      box-shadow: ${t.shadows["0.25"]};
      color: ${t.colors[o.mode].foregroundSecondary};
      background-color: ${t.colors[o.mode].groupBackground};
  `}

  ${({size:e})=>{switch(e){case"small":return`
          max-width: ${t.space["48"]};
        `;case"medium":return`
          max-width: ${t.space["52"]};
        `;case"large":return`
          max-width: ${t.space["80"]};
        `;default:return""}}}

  ${({size:e,hasChevron:o})=>{if(e==="small"&&o)return`
      max-width: ${t.space["52"]};
    `;if(e==="medium"&&o)return`
      max-width: ${t.space["56"]};
    `;if(e==="large"&&o)return`
      max-width: calc(${t.space["80"]} + ${t.space["4"]});
    `}}
`,To=c.default(X)`
  margin-left: ${t.space["1"]};
  width: ${t.space["3"]};
  margin-right: ${t.space["0.5"]};
  transition-duration: ${t.transitionDuration["200"]};
  transition-property: all;
  transition-timing-function: ${t.transitionTimingFunction.inOut};
  opacity: 0.3;
  transform: rotate(0deg);
  display: flex;

  & > svg {
    fill: currentColor;
  }
  fill: currentColor;

  ${({open:e})=>e&&`
      opacity: 1;
      transform: rotate(180deg);
  `}
`,Go=c.default.div`
  display: ${({size:e})=>e==="small"?"none":"block"};
  margin: 0 ${t.space["1.5"]};
  min-width: ${t.space.none};
`,At=({size:e,avatar:o,avatarAs:n,address:a,ensName:i})=>r.createElement(r.Fragment,null,r.createElement(ue,{as:n,label:"profile-avatar",placeholder:!o,src:o}),r.createElement(Go,{size:e},r.createElement(P,{as:"h3",color:i?"text":"textTertiary",ellipsis:!0,variant:i&&e==="large"?"extraLarge":"large",weight:"bold"},i||"No name set"),r.createElement(P,{as:"h4",color:i?"textTertiary":"text",variant:"small",weight:"bold"},Mo(a,e==="large"?30:10,e==="large"?10:5,e==="large"?10:5)))),Ut=({size:e="medium",avatar:o,avatarAs:n,dropdownItems:a,address:i,ensName:d,alignDropdown:u="left"})=>{const[s,m]=r.useState(!1);return a?r.createElement(le,{items:a,isOpen:s,setIsOpen:m,align:u},r.createElement(_t,{size:e,hasChevron:!0,open:s,onClick:()=>m(!s)},r.createElement(At,{size:e,avatar:o,avatarAs:n,address:i,ensName:d}),r.createElement(To,{open:s}))):r.createElement(_t,{size:e,open:s,"data-testid":"profile"},r.createElement(At,{size:e,avatar:o,avatarAs:n,address:i,ensName:d}))},Ro=c.default.input`
  width: ${t.space["6"]};
  height: ${t.space["6"]};
  margin: ${t.space["2"]} 0;
  cursor: pointer;
  font: inherit;
  border-radius: 50%;
  display: grid;
  place-content: center;
  transition: transform 150ms ease-in-out, filter 150ms ease-in-out;

  &:hover {
    transform: translateY(-1px);
    filter: contrast(0.7);
  }

  &:active {
    transform: translateY(0px);
    filter: contrast(1);
  }

  &:checked::before {
    transform: scale(1);
  }

  ${({theme:e})=>`
    background-color: ${t.colors[e.mode].backgroundHide};
  
    &::before {
        content: '';
        width: ${t.space["4.5"]};
        height: ${t.space["4.5"]};
        border-radius: 50%;
        transform: scale(0);
        transition: transform 90ms ease-in-out;
        background-image: ${t.colors[e.mode].gradients.blue};
        background-size: 100% 100%;
        background-position: center;
      }
  `}
`,Ee=r.forwardRef((L,G)=>{var E=L,{description:e,disabled:o,error:n,hideLabel:a,id:i,label:d,labelSecondary:u,name:s,required:m,tabIndex:b,value:g,checked:p,width:h,onBlur:k,onChange:x,onFocus:T}=E,B=N(E,["description","disabled","error","hideLabel","id","label","labelSecondary","name","required","tabIndex","value","checked","width","onBlur","onChange","onFocus"]);const w=r.useRef(null),y=G||w;return r.createElement(A,{description:e,error:n,hideLabel:a,id:i,inline:!0,label:d,labelSecondary:u,required:m,width:h},r.createElement(Ro,l({"aria-invalid":n?!0:void 0,"data-testid":"radio",ref:y,type:"radio"},l({disabled:o,name:s,tabIndex:b,value:g,onBlur:k,onChange:x,onFocus:T,checked:p},B))))});Ee.displayName="RadioButton";const Nt=({children:e,currentValue:o,onChange:n})=>{const[a,i]=r.useState(null),[d,u]=r.useState(!1);return r.useEffect(()=>{o&&i(o)},[o]),r.createElement(r.Fragment,null,r.Children.map(e,s=>(s.props.checked&&a!==s.props.value&&!d&&(i(s.props.value),u(!0)),r.cloneElement(s,{checked:s.props.value===a,onChange:()=>{i(s.props.value),n&&n(s.props.value)}}))))};var ce=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{},Bo=typeof ce=="object"&&ce&&ce.Object===Object&&ce,zo=Bo,Ho=zo,jo=typeof self=="object"&&self&&self.Object===Object&&self,Oo=Ho||jo||Function("return this")(),Wo=Oo,Fo=Wo,Do=Fo.Symbol,Le=Do;function Io(e,o){for(var n=-1,a=e==null?0:e.length,i=Array(a);++n<a;)i[n]=o(e[n],n,e);return i}var Zo=Io,Po=Array.isArray,_o=Po,Yt=Le,qt=Object.prototype,Ao=qt.hasOwnProperty,Uo=qt.toString,J=Yt?Yt.toStringTag:void 0;function No(e){var o=Ao.call(e,J),n=e[J];try{e[J]=void 0;var a=!0}catch(d){}var i=Uo.call(e);return a&&(o?e[J]=n:delete e[J]),i}var Yo=No,qo=Object.prototype,Ko=qo.toString;function Xo(e){return Ko.call(e)}var Jo=Xo,Kt=Le,Qo=Yo,en=Jo,tn="[object Null]",rn="[object Undefined]",Xt=Kt?Kt.toStringTag:void 0;function on(e){return e==null?e===void 0?rn:tn:Xt&&Xt in Object(e)?Qo(e):en(e)}var nn=on;function an(e){return e!=null&&typeof e=="object"}var ln=an,cn=nn,sn=ln,dn="[object Symbol]";function un(e){return typeof e=="symbol"||sn(e)&&cn(e)==dn}var mn=un,Jt=Le,gn=Zo,pn=_o,fn=mn,hn=1/0,Qt=Jt?Jt.prototype:void 0,er=Qt?Qt.toString:void 0;function tr(e){if(typeof e=="string")return e;if(pn(e))return gn(e,tr)+"";if(fn(e))return er?er.call(e):"";var o=e+"";return o=="0"&&1/e==-hn?"-0":o}var $n=tr,bn=$n;function wn(e){return e==null?"":bn(e)}var Cn=wn,vn=Cn,kn=0;function yn(e){var o=++kn;return vn(e)+o}var xn=yn;const Sn=c.default.div`
  ${({theme:e})=>`
    background: ${t.colors[e.mode].background};
    border-color: ${t.colors[e.mode].backgroundHide};
    border-width: ${t.space.px};
    border-radius: ${t.radii.extraLarge};
    cursor: pointer;
    position: relative;
    padding: ${t.space["4"]};
    height: ${t.space["14"]};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
  `}

  ${({disabled:e,theme:o})=>e&&`
    cursor: not-allowed;
    background: ${t.colors[o.mode].backgroundTertiary};
  `}
`,En=c.default.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  gap: ${t.space["4"]};
`,Ln=c.default(X)`
  margin-left: ${t.space["1"]};
  width: ${t.space["3"]};
  margin-right: ${t.space["0.5"]};
  transition-duration: ${t.transitionDuration["200"]};
  transition-property: all;
  transition-timing-function: ${t.transitionTimingFunction.inOut};
  opacity: 0.3;
  transform: rotate(0deg);
  display: flex;

  & > svg {
    fill: currentColor;
  }
  fill: currentColor;

  ${({open:e})=>e&&`
      opacity: 1;
      transform: rotate(180deg);
  `}

  ${({disabled:e})=>e&&`
      opacity: 0.1;
  `}
`,Vn=c.default.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: ${t.space["1.5"]};
  padding: ${t.space["1.5"]};
  position: absolute;
  visibility: hidden;
  opacity: 0;
  width: ${t.space.full};
  height: ${t.space.fit};
  border-radius: ${t.radii.medium};
  overflow: hidden;

  ${({theme:e})=>`
    box-shadow: ${t.boxShadows[e.mode]["0.02"]};
  `}

  ${({open:e})=>e?`
      z-index: 20;
      visibility: visible;
      margin-top: ${t.space["1.5"]};
      opacity ${t.opacity["100"]};
      transition: all 0.3s cubic-bezier(1, 0, 0.22, 1.6), z-index 0s linear 0.3s;
  `:`
      z-index: 0;
      visibility: hidden;
      margin-top: -${t.space["12"]};
      opacity: 0;
      transition: all 0.3s cubic-bezier(1, 0, 0.22, 1.6), z-index 0s linear 0s;
  `}
`,Mn=c.default.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: ${t.space["3"]};
  width: ${t.space.full};
  height: ${t.space["9"]};
  padding: 0 ${t.space["2"]};
  justify-content: flex-start;
  transition-duration: ${t.transitionDuration["150"]};
  transition-property: all;
  transition-timing-function: ${t.transitionTimingFunction.inOut};
  border-radius: ${t.radii.medium};
  margin: ${t.space["0.5"]} 0;

  ${({theme:e})=>`
    &:hover {
      background-color: ${t.colors[e.mode].foregroundSecondaryHover};    
    }
    
    &::first-child {
      margin-top: ${t.space["0"]};
    }
    
    &::last-child {
      margin-bottom: ${t.space["0"]};
    }
  `}

  ${({theme:e,selected:o})=>o&&`
      background-color: ${t.colors[e.mode].foregroundSecondary};
  `}

  ${({theme:e,disabled:o})=>o&&`
      color: ${t.colors[e.mode].textTertiary};
      cursor: not-allowed;
      
      &:hover {
        background-color: ${t.colors.base.transparent};
      }
  `}
`,rr=r.forwardRef(({description:e,disabled:o,error:n,hideLabel:a,id:i,label:d,labelSecondary:u,required:s,tabIndex:m,width:b,onBlur:g,onChange:p,onFocus:h,options:k,selected:x},T)=>{const B=r.useRef(null),G=T||B,[L]=r.useState(i||xn()),[E,w]=r.useState(null),[y,V]=r.useState(!1),z=(f,j,F)=>{if(o||F&&F.disabled)return f.stopPropagation();if(j==="keyboard"){if(f=f,!y&&["ArrowDown","ArrowUp","Enter"," "].includes(f.key))return V(!0);if(y&&f.key==="Enter"){F&&w(F),V(!1);return}}else f=f,f.type==="click"&&f.button===0&&(F&&w(F),V(!y))},O=f=>{G.current&&!G.current.contains(f.target)&&V(!1)};r.useEffect(()=>{x!==E&&x!==void 0&&w(x)},[x]),r.useEffect(()=>(y?document.addEventListener("mousedown",O):document.removeEventListener("mousedown",O),()=>{document.removeEventListener("mousedown",O)}),[G,y]),r.useEffect(()=>{E!==x&&p&&p(E)},[E]);const W=({option:f})=>f?r.createElement(r.Fragment,null,f.prefix&&r.createElement("div",null,f.prefix),f.label||f.value):null;return r.createElement(A,{"data-testid":"select",description:e,error:n,hideLabel:a,id:L,label:d,labelSecondary:u,required:s,width:b},r.createElement("div",{ref:G,style:{position:"relative"},onFocus:h,onBlur:g},r.createElement(Sn,{"aria-controls":`listbox-${L}`,"aria-expanded":"true","aria-haspopup":"listbox","aria-invalid":n?!0:void 0,id:`combo-${L}`,role:"combobox",onClick:f=>z(f,"mouse"),disabled:o,tabIndex:m,open:y},r.createElement(En,{"data-testid":"selected"},E?r.createElement(W,{option:E}):r.createElement("div",null)),r.createElement(Ln,{open:y,disabled:o})),r.createElement(Vn,{open:y,id:`listbox-${L}`,role:"listbox",tabIndex:-1},(Array.isArray(k)?k:[k]).map(f=>r.createElement(Mn,{selected:f===E,disabled:f.disabled,key:f.value,role:"option",onClick:j=>z(j,"mouse",f),onKeyPress:j=>z(j,"keyboard",f)},r.createElement(W,{option:f}))))))}),Tn=c.default.textarea`
  ${({theme:e})=>`
      background-color: ${t.colors.base.transparent};
      border-color: ${t.colors[e.mode].foregroundSecondary};
      border-radius: ${t.radii["2xLarge"]};
      border-width: ${t.space["0.5"]};
      color: ${t.colors[e.mode].text};
      display: flex;
      font-family: ${t.fonts.sans};
      font-size: ${t.fontSizes.base};
      font-weight: ${t.fontWeights.medium};
      min-height: ${t.space["14"]};
      padding: ${t.space["4"]};
      transition-duration: ${t.transitionDuration["150"]};
      transition-property: colors;
      transition-timing-function: ${t.transitionTimingFunction.inOut};
      width: ${t.space.full};
      resize: none;
      
      &:focus {
        border-color: ${t.colors[e.mode].accent};
      }
  `}

  ${({theme:e,disabled:o})=>o&&`
      border-color: ${t.colors[e.mode].foregroundSecondary};
      cursor: not-allowed;
  `}

  ${({theme:e,error:o})=>o&&`
      border-color: ${t.colors[e.mode].red};
      cursor: default;
      
      &:focus-within {
        border-color: ${t.colors[e.mode].red};
      }
  `}
`,Ve=r.forwardRef(({autoCorrect:e,autoFocus:o,defaultValue:n,description:a,disabled:i,error:d,hideLabel:u,id:s,label:m,labelSecondary:b,maxLength:g,name:p,placeholder:h,readOnly:k,required:x,rows:T=5,spellCheck:B,tabIndex:G,value:L,width:E,onChange:w,onBlur:y,onFocus:V},z)=>{const O=r.useRef(null),W=z||O,f=d?!0:void 0;return r.createElement(A,{description:a,error:d,hideLabel:u,id:s,label:m,labelSecondary:b,required:x,width:E},r.createElement(Tn,{"aria-invalid":f,autoCorrect:e,autoFocus:o,defaultValue:n,maxLength:g,name:p,placeholder:h,readOnly:k,ref:W,rows:T,spellCheck:B,tabIndex:G,value:L,onBlur:y,onChange:w,onFocus:V,disabled:i,error:f}))});Ve.displayName="Textarea";const Gn=c.default(P)`
  font-size: ${t.fontSizes.headingTwo};
  font-weight: ${t.fontWeights.bold};
`,Rn=c.default(P)`
  font-size: ${t.fontSizes.headingThree};
  font-weight: ${t.fontWeights.normal};
`,Bn=c.default.div`
  ${({center:e})=>`
    flex-direction: ${e?"column":"row"};
    gap: ${t.space["2"]};
  `}
  display: flex;
  align-items: center;
  justify-content: space-between;
`,or=s=>{var m=s,{title:e,subtitle:o,trailing:n,leading:a,center:i,children:d}=m,u=N(m,["title","subtitle","trailing","leading","center","children"]);return r.createElement(Se,l({},u),r.createElement("div",{style:{minWidth:64}},r.createElement("div",{style:{marginBottom:4}},e&&(typeof e!="string"&&e||r.createElement(Gn,null,e)),o&&(typeof o!="string"&&o||r.createElement(Rn,null,o))),d,(a||n)&&r.createElement("div",{style:{marginTop:4}},r.createElement(Bn,{center:i},a||!i&&r.createElement("div",{style:{flexGrow:1}}),n||!i&&r.createElement("div",{style:{flexGrow:1}})))))};var zn=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",Avatar:ue,BackdropSurface:me,Button:ae,Card:ge,Field:A,FileInput:fe,Heading:he,Portal:$e,Skeleton:Ke,Spinner:q,Tag:be,Typography:P,VisuallyHidden:Z,Backdrop:we,Checkbox:Ce,CountdownCircle:ve,Dropdown:le,FieldSet:Je,Input:ye,Modal:Se,Profile:Ut,RadioButton:Ee,RadioButtonGroup:Nt,Select:rr,SkeletonGroup:qe,Textarea:Ve,Dialog:or,ArrowCircleSVG:Qe,ArrowRightSVG:et,ArrowUpSVG:tt,BookOpenSVG:rt,CancelCircleSVG:ot,CheckSVG:nt,ChevronDownSVG:at,ChevronLeftSVG:it,ChevronRightSVG:lt,ChevronUpSVG:ct,CloseSVG:xe,CodeSVG:st,CogSVG:dt,CollectionSVG:ut,CopySVG:mt,DocumentsSVG:gt,DotsVerticalSVG:pt,DownIndicatorSVG:X,DuplicateSVG:ft,EthSVG:ht,EthTransparentSVG:$t,EthTransparentInvertedSVG:bt,ExclamationSVG:wt,FlagSVG:Ct,GradientSVG:vt,GridSVG:kt,GridSolidSVG:yt,HandSVG:xt,LinkSVG:St,ListSVG:Et,LockClosedSVG:Lt,LogoSVG:Vt,MenuSVG:Mt,MoonSVG:Tt,PencilSVG:Gt,PlusSVG:Rt,PlusSmallSVG:Bt,RefreshSVG:zt,SearchSVG:Ht,SplitSVG:jt,SunSVG:Ot,TokensSVG:Wt,TrendingUpSVG:Ft,UploadSVG:Dt,UserSolidSVG:It,UsersSolidSVG:Zt,WalletSVG:Pt});const Hn=_.createGlobalStyle`
  ${({theme:e})=>`
      *, ::before, ::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      border-color: ${t.colors[e.mode].foregroundSecondary};
      border-style: ${t.borderStyles.solid};
      border-width: 0;
      color: ${t.colors.base.current};
      font-size: 100%;
      font-family: ${t.fonts.sans};
      vertical-align: baseline;
    }
    
    [data-js-focus-visible] &:focus:not([data-focus-visible-added]) {
      outline: none;
    }
  
    html {
      font-size: ${t.fontSizes.root};
      color: ${t.colors[e.mode].foreground};
      text-rendering: optimizeLegibility;
      background: radial-gradient(40.48% 67.6% at 50% 32.4%,#ecf4ff 0%,#f7f7ff 52.77%,#f7f7f7 100%),#ffffff;
    }
    
    body {
      line-height: ${t.lineHeights.none};
    }
    
    article, aside, details, div, figcaption, figure, footer, header, hgroup, menu, nav, section {
      display: block;
    }
    
    ul, ol {
      list-style: none;
    }
    
    quote, blockquote {
      quotes: none;
      
      &:before, &after {
        content: '';
      }
    }
    
    table {
      border-collapse: collapse;
      border-spacing: 0;s
    }
    
    field {
      display: block;
      appearance: none;
      outline: none;
      &:placeholder {
        color: ${t.colors[e.mode].textTertiary};
        opacity: ${t.opacity["100"]};
      }
    }
    
    mark {
      background-color: ${t.colors.base.transparent};
      color: ${t.colors.base.inherit};
    }
    
    select {
      display: block;
        appearance: none;
        outline: none;
        &:placeholder {
          color: ${t.colors[e.mode].textTertiary};
          opacity: ${t.opacity["100"]};
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
        color: ${t.colors[e.mode].textTertiary};
        opacity: ${t.opacity["100"]};
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
      color: ${t.colors.base.inherit};
    }
  
  `}
`;exports.ArrowCircleSVG=Qe;exports.ArrowRightSVG=et;exports.ArrowUpSVG=tt;exports.Avatar=ue;exports.Backdrop=we;exports.BackdropSurface=me;exports.BookOpenSVG=rt;exports.Button=ae;exports.CancelCircleSVG=ot;exports.Card=ge;exports.CheckSVG=nt;exports.Checkbox=Ce;exports.ChevronDownSVG=at;exports.ChevronLeftSVG=it;exports.ChevronRightSVG=lt;exports.ChevronUpSVG=ct;exports.CloseSVG=xe;exports.CodeSVG=st;exports.CogSVG=dt;exports.CollectionSVG=ut;exports.Components=zn;exports.CopySVG=mt;exports.CountdownCircle=ve;exports.Dialog=or;exports.DocumentsSVG=gt;exports.DotsVerticalSVG=pt;exports.DownIndicatorSVG=X;exports.Dropdown=le;exports.DuplicateSVG=ft;exports.EthSVG=ht;exports.EthTransparentInvertedSVG=bt;exports.EthTransparentSVG=$t;exports.ExclamationSVG=wt;exports.Field=A;exports.FieldSet=Je;exports.FileInput=fe;exports.FlagSVG=Ct;exports.GradientSVG=vt;exports.GridSVG=kt;exports.GridSolidSVG=yt;exports.HandSVG=xt;exports.Heading=he;exports.Input=ye;exports.LinkSVG=St;exports.ListSVG=Et;exports.LockClosedSVG=Lt;exports.LogoSVG=Vt;exports.MenuSVG=Mt;exports.Modal=Se;exports.MoonSVG=Tt;exports.PencilSVG=Gt;exports.PlusSVG=Rt;exports.PlusSmallSVG=Bt;exports.Portal=$e;exports.Profile=Ut;exports.RadioButton=Ee;exports.RadioButtonGroup=Nt;exports.RefreshSVG=zt;exports.SearchSVG=Ht;exports.Select=rr;exports.Skeleton=Ke;exports.SkeletonGroup=qe;exports.Spinner=q;exports.SplitSVG=jt;exports.SunSVG=Ot;exports.Tag=be;exports.Textarea=Ve;exports.ThorinGlobalStyles=Hn;exports.TokensSVG=Wt;exports.TrendingUpSVG=Ft;exports.Typography=P;exports.UploadSVG=Dt;exports.UserSolidSVG=It;exports.UsersSolidSVG=Zt;exports.VisuallyHidden=Z;exports.WalletSVG=Pt;exports.largerThan=K;exports.tokens=t;
